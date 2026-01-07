import { Conversation, Message } from '../models/chat.model';
import { supabase } from '../lib/supabase';

interface MessageContent {
    type?: string;
    content?: string;
    additional_kwargs?: Record<string, any>;
    response_metadata?: Record<string, any>;
}

interface AmeliaMessage {
    session_id: string;
    id: number;
    message: MessageContent | string;
    created_at?: string;
}

/**
 * Parse the message from amelia_whatsapp_history
 * NO FILTERS - show all messages
 */
function parseMessageContent(message: MessageContent | string): { type: 'ai' | 'human'; text: string } | null {
    let parsed: MessageContent;

    if (typeof message === 'string') {
        try {
            parsed = JSON.parse(message);
        } catch {
            return { type: 'human', text: message.trim() };
        }
    } else {
        parsed = message;
    }

    if (!parsed) return null;

    // Determine type
    let messageType: 'ai' | 'human' = 'human';
    if (parsed.type) {
        const typeStr = String(parsed.type).toLowerCase();
        if (typeStr === 'ai' || typeStr === 'assistant' || typeStr === 'aimessage') {
            messageType = 'ai';
        }
    }

    // Get content - no filtering at all
    const text = parsed.content?.trim() || '';

    if (!text) {
        return null;
    }

    return { type: messageType, text };
}

/**
 * Get conversations from amelia_whatsapp_history
 */
async function getConversations(): Promise<Conversation[]> {
    if (!supabase) {
        console.error('[Chat] Supabase client not initialized');
        return [];
    }

    const { data, error } = await supabase
        .from('amelia_whatsapp_history')
        .select('*')
        .order('id', { ascending: true })
        .limit(1000);

    if (error) {
        console.error('[Chat] Query error:', error);
        return [];
    }

    if (!data || data.length === 0) {
        console.log('[Chat] No data returned from query');
        return [];
    }

    console.log('[Chat] Fetched', data.length, 'messages');

    // Group by session_id
    const conversationsMap = new Map<string, Conversation>();

    (data as AmeliaMessage[]).forEach((row) => {
        const sessionId = row.session_id;
        if (!sessionId) return;

        const parsed = parseMessageContent(row.message);
        if (!parsed) return;

        if (!conversationsMap.has(sessionId)) {
            conversationsMap.set(sessionId, {
                id: sessionId,
                guestName: sessionId,
                guestPhone: sessionId,
                lastMessageTime: row.created_at || new Date().toISOString(),
                unreadCount: 0,
                messages: [],
            });
        }

        const conv = conversationsMap.get(sessionId)!;

        if (row.created_at && row.created_at > conv.lastMessageTime) {
            conv.lastMessageTime = row.created_at;
        }

        conv.messages.push({
            id: row.id.toString(),
            senderId: parsed.type === 'ai' ? 'me' : 'guest',
            text: parsed.text,
            timestamp: row.created_at || new Date().toISOString(),
            isRead: true,
        });
    });

    const conversations = Array.from(conversationsMap.values());
    conversations.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

    console.log('[Chat] Processed', conversations.length, 'conversations');

    return conversations;
}

async function getConversationById(id: string): Promise<Conversation | undefined> {
    const conversations = await getConversations();
    return conversations.find(c => c.id === id);
}

async function sendMessage(_conversationId: string, _content: string): Promise<{ success: boolean }> {
    return { success: false };
}

export const chatService = {
    getConversations,
    getConversationById,
    sendMessage,
};

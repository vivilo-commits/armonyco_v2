import { Conversation, Message } from '../models/chat.model';
import { supabase } from '../lib/supabase';

interface MessageContent {
    type?: string;
    content?: string;
}

interface AmeliaRow {
    session_id: string;
    id: number;
    message: MessageContent | string;
    created_at?: string;
}

/**
 * Parse a single message and return type + text
 */
function parseMessage(raw: MessageContent | string): { type: 'ai' | 'human'; text: string } | null {
    let msgType: 'ai' | 'human' = 'human';
    let content = '';

    // Handle object (JSONB from Supabase)
    if (typeof raw === 'object' && raw !== null) {
        const typeStr = (raw.type || '').toLowerCase();
        if (typeStr === 'ai' || typeStr === 'assistant') {
            msgType = 'ai';
        }
        content = raw.content || '';
    }
    // Handle string
    else if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            const typeStr = (parsed.type || '').toLowerCase();
            if (typeStr === 'ai' || typeStr === 'assistant') {
                msgType = 'ai';
            }
            content = parsed.content || '';
        } catch {
            content = raw;
        }
    }

    content = content.trim();
    if (!content) return null;

    // Filter ONLY tool traces - be very specific
    const isToolTrace =
        content.startsWith('[{') || // JSON arrays are tool traces
        content.startsWith('Calling ') || // All "Calling X" are tool traces
        content.includes('"response":"Guest message:') || // Tool response format
        content.includes('; Tool: Think, Input:') ||
        content.includes('Tools needed:') ||
        content.includes('Conversation history:') ||
        content.includes('Review conversation history:') ||
        content.includes('Identity verification required') ||
        content.includes('Safest next step:') ||
        (content.startsWith('{') && content.includes('"id":"call_'));

    if (isToolTrace) return null;

    return { type: msgType, text: content };
}

/**
 * Fetch all conversations grouped by phone
 */
async function getConversations(): Promise<Conversation[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('amelia_whatsapp_history')
        .select('*')
        .order('id', { ascending: true })
        .limit(1000);

    if (error || !data) {
        console.error('[Chat] Error:', error);
        return [];
    }

    const convMap = new Map<string, Conversation>();

    for (const row of data as AmeliaRow[]) {
        const phone = row.session_id;
        if (!phone) continue;

        const parsed = parseMessage(row.message);
        if (!parsed) continue;

        if (!convMap.has(phone)) {
            convMap.set(phone, {
                id: phone,
                guestName: phone,
                guestPhone: phone,
                lastMessageTime: row.created_at || new Date().toISOString(),
                unreadCount: 0,
                messages: [],
            });
        }

        const conv = convMap.get(phone)!;

        if (row.created_at && row.created_at > conv.lastMessageTime) {
            conv.lastMessageTime = row.created_at;
        }

        conv.messages.push({
            id: String(row.id),
            senderId: parsed.type === 'ai' ? 'me' : 'guest',
            text: parsed.text,
            timestamp: row.created_at || new Date().toISOString(),
            isRead: true,
        });
    }

    const result = Array.from(convMap.values());
    result.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

    console.log('[Chat] Loaded', result.length, 'conversations');
    return result;
}

async function getConversationById(id: string): Promise<Conversation | undefined> {
    const all = await getConversations();
    return all.find(c => c.id === id);
}

async function sendMessage(): Promise<{ success: boolean }> {
    return { success: false };
}

export const chatService = {
    getConversations,
    getConversationById,
    sendMessage,
};

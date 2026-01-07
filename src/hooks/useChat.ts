import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAsync } from './useAsync';
import { Conversation, Message } from '../models/chat.model';

/**
 * Hook to get WhatsApp conversations with realtime updates
 */
export const useConversations = () => {
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if (!supabase) return;

        const channel = supabase
            .channel('amelia_whatsapp_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'amelia_whatsapp_history' }, (payload) => {
                console.log('[Realtime] WhatsApp history updated:', payload.eventType);
                setTrigger(prev => prev + 1);
            })
            .subscribe((status) => {
                console.log('[Realtime] WhatsApp subscription status:', status);
            });

        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchConversations = useCallback(async (): Promise<Conversation[]> => {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('amelia_whatsapp_history')
            .select('*')
            .order('id', { ascending: true });

        if (error) {
            console.error('[Conversations] Error:', error);
            return [];
        }

        // Group messages by phone number into conversations
        const conversationMap = new Map<string, Conversation>();

        data?.forEach(row => {
            const phoneNumber = row.phone_number || row.from_number || 'unknown';

            if (!conversationMap.has(phoneNumber)) {
                conversationMap.set(phoneNumber, {
                    id: phoneNumber,
                    guestPhone: phoneNumber,
                    guestName: row.guest_name || row.profile_name || 'Guest',
                    messages: [],
                    lastMessageTime: row.created_at || new Date().toISOString(),
                    unreadCount: 0,
                });
            }

            const conv = conversationMap.get(phoneNumber)!;

            // Add message
            const message: Message = {
                id: row.id?.toString() || Math.random().toString(),
                text: row.message_body || row.content || '',
                timestamp: row.created_at || new Date().toISOString(),
                senderId: row.direction === 'incoming' ? 'guest' : 'me',
                isRead: true,
            };

            conv.messages.push(message);

            // Update last message time
            if (row.created_at && row.created_at > conv.lastMessageTime) {
                conv.lastMessageTime = row.created_at;
            }
        });

        // Sort conversations by last message time (newest first)
        const conversations = Array.from(conversationMap.values()).sort((a, b) =>
            new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
        );

        console.log('[Conversations] Fetched:', conversations.length, 'conversations');
        return conversations;
    }, [trigger]);

    return useAsync(fetchConversations);
};

/**
 * Hook to send a message
 */
export const useSendMessage = () => {
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendMessage = async (phoneNumber: string, content: string): Promise<boolean> => {
        setSending(true);
        setError(null);

        try {
            if (!supabase) throw new Error('Supabase not configured');

            const { error: insertError } = await supabase
                .from('amelia_whatsapp_history')
                .insert({
                    phone_number: phoneNumber,
                    message_body: content,
                    direction: 'outgoing',
                    created_at: new Date().toISOString(),
                });

            if (insertError) throw insertError;
            return true;
        } catch (err: any) {
            console.error('[SendMessage] Error:', err);
            setError(err.message || 'Failed to send message');
            return false;
        } finally {
            setSending(false);
        }
    };

    return { sendMessage, sending, error };
};

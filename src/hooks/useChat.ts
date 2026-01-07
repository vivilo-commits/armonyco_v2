import { useCallback, useEffect, useState } from 'react';
import { useAsync } from './useAsync';
import { chatService } from '../services/chat.service';
import { supabase } from '../lib/supabase';
import { Conversation } from '../models/chat.model';

/**
 * Hook to get all conversations with realtime updates
 */
export const useConversations = () => {
    const [realtimeTrigger, setRealtimeTrigger] = useState(0);

    // Subscribe to realtime updates
    useEffect(() => {
        if (!supabase) return;

        const channel = supabase
            .channel('amelia_whatsapp_history_changes')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'amelia_whatsapp_history',
                },
                (payload) => {
                    console.log('[Realtime] New message:', payload.eventType);
                    // Trigger refetch by updating state
                    setRealtimeTrigger(prev => prev + 1);
                }
            )
            .subscribe((status) => {
                console.log('[Realtime] Status:', status);
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchConversations = useCallback(() => chatService.getConversations(), [realtimeTrigger]);
    return useAsync(fetchConversations);
};

/**
 * Hook to get a single conversation by ID
 */
export const useConversation = (id: string | null) => {
    const fetchConversation = useCallback(
        () => (id ? chatService.getConversationById(id) : Promise.resolve(undefined)),
        [id]
    );
    return useAsync(fetchConversation);
};

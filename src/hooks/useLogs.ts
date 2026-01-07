import { useCallback, useEffect, useState } from 'react';
import { useAsync } from './useAsync';
import { logService } from '../services/log.service';
import { supabase } from '../lib/supabase';

/**
 * Hook to get decision logs with realtime updates
 */
export const useLogs = () => {
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if (!supabase) return;

        const channel = supabase
            .channel('decision_logs_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'decision_logs' }, () => {
                console.log('[Realtime] Decision logs updated');
                setTrigger(prev => prev + 1);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchLogs = useCallback(() => logService.getLogs(), [trigger]);
    return useAsync(fetchLogs);
};

/**
 * Hook to get agents with realtime updates
 */
export const useAgents = () => {
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if (!supabase) return;

        const channel = supabase
            .channel('agents_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, () => {
                console.log('[Realtime] Agents updated');
                setTrigger(prev => prev + 1);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchAgents = useCallback(() => logService.getAgents(), [trigger]);
    return useAsync(fetchAgents);
};

/**
 * Hook to get notifications with realtime updates
 */
export const useNotifications = () => {
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if (!supabase) return;

        const channel = supabase
            .channel('notifications_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => {
                console.log('[Realtime] Notifications updated');
                setTrigger(prev => prev + 1);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchNotifications = useCallback(() => logService.getNotifications(), [trigger]);
    return useAsync(fetchNotifications);
};

/**
 * N8n Execution type for Truth Ledger - Enriched with full execution data
 */
export interface N8nExecution {
    id: number;
    truth_identity: string;
    n8n_execution_id: string;
    workflow_id: string;
    workflow_name: string;
    agent_name: string;
    perimeter: string;
    status: string;
    governance_verdict: string;
    started_at: string;
    stopped_at: string;
    duration_ms: number;
    mode: string;
    input_preview: string;
    error_message: string | null;
    created_at: string;

    // Trigger Context
    trigger_source?: string;           // 'webhook', 'manual', 'schedule', 'subworkflow'
    trigger_node_name?: string;        // 'New WhatsApp Message1'
    trigger_node_type?: string;        // 'n8n-nodes-base.whatsAppTrigger'
    parent_execution_id?: string;      // Parent execution ID
    parent_workflow_id?: string;       // Parent workflow ID

    // Business Data
    reservation_id?: string;           // '18113/2026'
    customer_name?: string;            // 'Guerrera Mario'
    customer_phone?: string;           // Phone number
    reservation_value?: number;        // 128.22
    reservation_channel?: string;      // 'Booking', 'Airbnb', 'Direct'
    check_in_date?: string;
    check_out_date?: string;
    nights?: number;
    property_name?: string;            // 'MARCHE 54 APT'

    // Execution Metrics
    nodes_executed?: number;
    total_api_calls?: number;
    slowest_node?: string;
    slowest_node_time_ms?: number;

    // AI/LLM Data
    ai_model_used?: string;
    ai_tokens_used?: number;
    ai_response_preview?: string;

    // Full Data
    execution_data?: Record<string, any>;
    execution_trace?: Array<{ node: string; time_ms: number; status: string }>;

    // ArmoCredits
    armo_credits_used?: number;
}


/**
 * Hook to get N8n executions for Truth Ledger with realtime updates
 */
export const useN8nExecutions = () => {
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if (!supabase) return;

        const channel = supabase
            .channel('n8n_executions_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'n8n_executions' }, (payload) => {
                console.log('[Realtime] N8n executions updated:', payload.eventType);
                setTrigger(prev => prev + 1);
            })
            .subscribe((status) => {
                console.log('[Realtime] Subscription status:', status);
            });

        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchExecutions = useCallback(async (): Promise<N8nExecution[]> => {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('n8n_executions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[N8n Executions] Error:', error);
            return [];
        }

        console.log('[N8n Executions] Fetched:', data?.length, 'records');
        return data || [];
    }, [trigger]);

    return useAsync(fetchExecutions);
};

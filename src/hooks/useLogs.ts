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
 * Execution type for Truth Ledger - Enriched with full execution data
 */
export interface N8nExecution {
    id: number;
    truth_identity: string;
    n8n_execution_id: string;          // Internal reference only
    workflow_id: string;               // Internal reference only
    workflow_name: string;             // Maps to agent_name for display
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
    trigger_source?: string;           // 'message', 'schedule', 'manual', 'cascade'
    trigger_channel?: string;          // 'WhatsApp', 'Email', 'Booking.com'
    trigger_context?: string;          // Human-readable description
    parent_execution_id?: string;      // For cascading actions
    parent_agent?: string;             // Parent agent name

    // Guest & Reservation Data
    reservation_id?: string;           // '18113/2026'
    guest_name?: string;               // 'Mario Guerrera'
    guest_phone?: string;              // Phone number
    guest_email?: string;              // Email
    booking_value?: number;            // 128.22 €
    booking_channel?: string;          // 'Booking.com', 'Airbnb', 'Direct'
    check_in_date?: string;
    check_out_date?: string;
    nights?: number;
    property_name?: string;            // 'MARCHE 54 APT'
    room_type?: string;                // 'Suite', 'Standard'

    // Execution Metrics
    actions_count?: number;            // Number of actions
    api_calls_count?: number;          // External API calls
    bottleneck_action?: string;        // Slowest action
    bottleneck_time_ms?: number;       // Time of slowest action

    // AI/Intelligence Data
    ai_model?: string;                 // 'GPT-4', 'Gemini Pro'
    ai_tokens?: number;
    ai_response_preview?: string;
    intelligence_score?: number;       // 0.00 to 1.00

    // Governance & Audit
    execution_trace?: Array<{ action: string; time_ms: number; status: string }>;
    evidence_data?: Record<string, any>;

    // ArmoCredits©
    armo_credits?: number;
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

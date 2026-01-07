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
 * N8n Execution type for Truth Ledger
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
            .on('postgres_changes', { event: '*', schema: 'public', table: 'n8n_executions' }, () => {
                console.log('[Realtime] N8n executions updated');
                setTrigger(prev => prev + 1);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchExecutions = useCallback(async (): Promise<N8nExecution[]> => {
        if (!supabase) return [];

        const { data, error } = await supabase
            .from('n8n_executions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            console.error('[N8n Executions] Error:', error);
            return [];
        }

        return data || [];
    }, [trigger]);

    return useAsync(fetchExecutions);
};

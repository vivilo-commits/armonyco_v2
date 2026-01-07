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

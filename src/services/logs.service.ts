import { supabase, getCurrentUser } from '../lib/supabase';
import { DecisionRecord, Agent, Notification } from '../types';

/**
 * Get decision logs for current user
 */
export async function getDecisionLogs(): Promise<DecisionRecord[]> {
    if (!supabase) return [];

    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('decision_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(100);

    if (error) {
        console.error('[Logs] Get logs failed:', error);
        return [];
    }

    return (data || []).map(d => ({
        id: d.id,
        timestamp: d.timestamp,
        policy: d.policy,
        verdict: d.verdict,
        entity: d.entity,
        responsible: d.responsible,
        evidenceHash: d.evidence_hash,
        credits: d.credits,
    }));
}

/**
 * Add a new decision log
 */
export async function addDecisionLog(log: Omit<DecisionRecord, 'id'>): Promise<boolean> {
    if (!supabase) return false;

    const user = await getCurrentUser();
    if (!user) return false;

    const { error } = await supabase
        .from('decision_logs')
        .insert({
            user_id: user.id,
            timestamp: log.timestamp || new Date().toISOString(),
            policy: log.policy,
            verdict: log.verdict,
            entity: log.entity,
            responsible: log.responsible,
            evidence_hash: log.evidenceHash,
            credits: log.credits,
        });

    if (error) {
        console.error('[Logs] Add log failed:', error);
        return false;
    }

    return true;
}

/**
 * Get all agents
 */
export async function getAgents(): Promise<Agent[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('[Logs] Get agents failed:', error);
        return [];
    }

    return (data || []).map(a => ({
        id: a.id,
        name: a.name,
        role: a.role,
        description: a.description,
        status: a.status,
        decisionCount: a.decision_count,
        accuracy: a.accuracy,
        avatar: a.avatar,
    }));
}

/**
 * Get notifications for current user
 */
export async function getNotifications(): Promise<Notification[]> {
    if (!supabase) return [];

    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        console.error('[Logs] Get notifications failed:', error);
        return [];
    }

    return (data || []).map(n => ({
        id: n.id,
        type: n.type,
        message: n.message,
        timestamp: n.created_at,
        read: n.read,
        metric: n.metric,
    }));
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(id: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

    if (error) {
        console.error('[Logs] Mark read failed:', error);
        return false;
    }

    return true;
}

/**
 * Get usage metrics for dashboard
 */
export async function getUsageMetrics(days: number = 30): Promise<{ period: string; value: number }[]> {
    if (!supabase) return [];

    const user = await getCurrentUser();
    if (!user) return [];

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
        .from('usage_metrics')
        .select('period, governed_value')
        .eq('user_id', user.id)
        .gte('period', startDate.toISOString().split('T')[0])
        .order('period', { ascending: true });

    if (error) {
        console.error('[Logs] Get metrics failed:', error);
        return [];
    }

    return (data || []).map(m => ({
        period: m.period,
        value: parseFloat(m.governed_value) || 0,
    }));
}

export const logsService = {
    getDecisionLogs,
    addDecisionLog,
    getAgents,
    getNotifications,
    markNotificationRead,
    getUsageMetrics,
};

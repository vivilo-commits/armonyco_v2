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
    getN8nExecutions,
    getAgentStats,
    getExecutionVelocity,
};

/**
 * Get N8n executions for Truth Ledger
 */
export async function getN8nExecutions(limit: number = 100): Promise<any[]> {
    if (!supabase) return [];

    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('n8n_executions')
        .select('*')
        .eq('company_uid', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('[Logs] Get n8n executions failed:', error);
        return [];
    }

    return data || [];
}

/**
 * Get agent stats from n8n_executions
 */
export async function getAgentStats(): Promise<any[]> {
    if (!supabase) return [];

    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('n8n_executions')
        .select('agent_name, status, duration_ms, governance_verdict')
        .eq('company_uid', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[Logs] Get agent stats failed:', error);
        return [];
    }

    // Aggregate by agent
    const agentMap: Record<string, { count: number; success: number; totalDuration: number }> = {};

    (data || []).forEach((exec: any) => {
        if (!agentMap[exec.agent_name]) {
            agentMap[exec.agent_name] = { count: 0, success: 0, totalDuration: 0 };
        }
        agentMap[exec.agent_name].count++;
        if (exec.status === 'success') agentMap[exec.agent_name].success++;
        agentMap[exec.agent_name].totalDuration += exec.duration_ms || 0;
    });

    return Object.entries(agentMap).map(([name, stats]) => ({
        name,
        count: stats.count,
        successRate: ((stats.success / stats.count) * 100).toFixed(1) + '%',
        avgDuration: Math.round(stats.totalDuration / stats.count / 1000) + 's',
    }));
}

/**
 * Get execution velocity for charts (hourly)
 */
export async function getExecutionVelocity(): Promise<{ time: string; value: number }[]> {
    if (!supabase) return [];

    const user = await getCurrentUser();
    if (!user) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
        .from('n8n_executions')
        .select('created_at')
        .eq('company_uid', user.id)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: true });

    if (error) {
        console.error('[Logs] Get velocity failed:', error);
        return [];
    }

    // Group by hour
    const hourlyCount: Record<string, number> = {};
    (data || []).forEach((exec: any) => {
        const hour = new Date(exec.created_at).getHours();
        const timeKey = `${hour.toString().padStart(2, '0')}:00`;
        hourlyCount[timeKey] = (hourlyCount[timeKey] || 0) + 1;
    });

    // Generate all hours
    const result: { time: string; value: number }[] = [];
    let cumulative = 0;
    for (let h = 8; h <= 22; h += 2) {
        const timeKey = `${h.toString().padStart(2, '0')}:00`;
        cumulative += hourlyCount[timeKey] || 0;
        result.push({ time: timeKey, value: cumulative });
    }

    return result;
}

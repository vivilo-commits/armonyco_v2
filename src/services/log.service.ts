import { DecisionRecord, Agent, Notification, UsageRecord } from '../types';
import { logsService } from './logs.service';
import { Users, TrendingUp, Settings, FileText } from 'lucide-react';

interface PerformanceItem {
    id: string;
    label: string;
    icon: React.ComponentType<any>;
    color: string;
    metric: string;
    value: string;
    trend: string;
}

/**
 * Log service - public API using Supabase backend
 */
export const logService = {
    getLogs: (): Promise<DecisionRecord[]> => logsService.getDecisionLogs(),
    getAgents: (): Promise<Agent[]> => logsService.getAgents(),
    getNotifications: (): Promise<Notification[]> => logsService.getNotifications(),
    getUsage: (): Promise<UsageRecord[]> => Promise.resolve([]),
    getValueVelocity: (): Promise<{ period: string; value: number }[]> => logsService.getUsageMetrics(30),
    getN8nExecutions: (limit?: number) => logsService.getN8nExecutions(limit),
    getAgentStats: () => logsService.getAgentStats(),
    getExecutionVelocity: () => logsService.getExecutionVelocity(),

    getDomainPerformance: async (): Promise<PerformanceItem[]> => {
        // Get real stats from n8n_executions
        const stats = await logsService.getAgentStats();

        const agentConfig: Record<string, { label: string; icon: any; color: string; metric: string }> = {
            'AMELIA': { label: 'Guest Communication', icon: Users, color: 'text-white', metric: 'WhatsApp' },
            'JAMES': { label: 'Reservation Lookup', icon: FileText, color: 'text-emerald-500', metric: 'Lookups' },
            'ELON': { label: 'Revenue Optimization', icon: TrendingUp, color: 'text-[var(--color-brand-accent)]', metric: 'Orphan Days' },
            'LARA': { label: 'Operations', icon: Settings, color: 'text-blue-500', metric: 'Planning' },
        };

        return stats.map((s: any) => {
            const config = agentConfig[s.name] || { label: s.name, icon: Users, color: 'text-white', metric: 'Executions' };
            return {
                id: s.name.toLowerCase(),
                label: config.label,
                icon: config.icon,
                color: config.color,
                metric: config.metric,
                value: s.count.toString(),
                trend: `${s.successRate} success | ${s.avgDuration} avg`,
            };
        });
    },
};

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
    getDomainPerformance: (): Promise<PerformanceItem[]> => Promise.resolve([
        { id: 'guest', label: 'Guest Experience', icon: Users, color: 'text-emerald-500', metric: 'Compliance', value: '94%', trend: '+2.1%' },
        { id: 'revenue', label: 'Revenue Ops', icon: TrendingUp, color: 'text-[var(--color-brand-accent)]', metric: 'Governed', value: '€12.4k', trend: '+18%' },
        { id: 'ops', label: 'Operations', icon: Settings, color: 'text-blue-500', metric: 'Automation', value: '91%', trend: '+4%' },
        { id: 'playbook', label: 'Playbooks', icon: FileText, color: 'text-purple-500', metric: 'Resolution', value: '89%', trend: '+6%' },
    ]),
};

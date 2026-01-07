import { DecisionRecord, Agent, Notification } from '../types';
import { MessageCircle, TrendingUp, Activity, Shield } from '../../components/ui/Icons';

// Real execution-based logs (matches n8n_executions table structure)
export const mockLogs: DecisionRecord[] = [
    { id: 'AR00001', timestamp: '2026-01-07 21:46:20', policy: 'INSTITUTIONAL_GUEST', verdict: 'ALLOW', evidenceHash: '5FjVkN71QXSTx285', responsible: 'AMELIA', credits: 35.262 },
    { id: 'AR00002', timestamp: '2026-01-07 21:42:15', policy: 'INSTITUTIONAL_FINANCE', verdict: 'ALLOW', evidenceHash: '9fDxYueKLt9EZdAL', responsible: 'JAMES', credits: 12.450 },
    { id: 'AR00003', timestamp: '2026-01-07 21:38:00', policy: 'INSTITUTIONAL_OPS', verdict: 'ALLOW', evidenceHash: 'ZNdnINGSSRh3mjFx', responsible: 'LARA', credits: 8.200 },
    { id: 'AR00004', timestamp: '2026-01-07 21:35:22', policy: 'INSTITUTIONAL_FINANCE', verdict: 'ALLOW', evidenceHash: 'OCziPZxTCSQEkTJo', responsible: 'ELON', credits: 45.800 },
    { id: 'AR00005', timestamp: '2026-01-07 21:30:45', policy: 'INSTITUTIONAL_OPS', verdict: 'ALLOW', evidenceHash: '52QIoF6eHQKDG5Wc', responsible: 'AMELIA', credits: 22.100 },
];

// Real agents based on N8n workflows
export const mockAgents: Agent[] = [
    {
        id: 'amelia',
        name: 'Amelia',
        role: 'Guest Communication',
        icon: MessageCircle,
        description: 'Handles WhatsApp guest interactions and KrossChat internal communications.',
        status: 'active',
        decisionCount: 14874,
        accuracy: '99.2%',
        avatar: 'A',
        metrics: [
            { label: 'Response Time', value: '35.2s', trend: -12 },
            { label: 'Resolution Rate', value: '98.5%', trend: 5 }
        ]
    },
    {
        id: 'lara',
        name: 'Lara',
        role: 'Operations & Planning',
        icon: TrendingUp,
        description: 'Manages internal operations and planning workflows.',
        status: 'active',
        decisionCount: 843,
        accuracy: '97.5%',
        avatar: 'L',
        metrics: [
            { label: 'Tasks Completed', value: '100%', trend: 8 },
            { label: 'Efficiency', value: '94%', trend: 2 }
        ]
    },
    {
        id: 'elon',
        name: 'Elon',
        role: 'Revenue Optimization',
        icon: Activity,
        description: 'Identifies orphan days and revenue optimization opportunities.',
        status: 'active',
        decisionCount: 2150,
        accuracy: '100.0%',
        avatar: 'E',
        metrics: [
            { label: 'Orphan Days Found', value: '127', trend: 15 },
            { label: 'Revenue Impact', value: '€4.2k', trend: 22 }
        ]
    },
    {
        id: 'james',
        name: 'James',
        role: 'Reservation Lookup',
        icon: Shield,
        description: 'Finds and verifies guest reservations from KrossBooking PMS.',
        status: 'active',
        decisionCount: 320,
        accuracy: '99.4%',
        avatar: 'J',
        metrics: [
            { label: 'Lookups', value: '320', trend: 10 },
            { label: 'Match Rate', value: '100%', trend: 0 }
        ]
    },
];

// Real notifications based on workflow executions
export const mockNotifications: Notification[] = [
    { id: '1', type: 'INFO', message: 'Amelia processed 127 guest messages today', timestamp: '10m ago', read: false, metric: '127' },
    { id: '2', type: 'INFO', message: 'Elon identified 3 orphan days for optimization', timestamp: '1h ago', read: false, metric: '€890' },
    { id: '3', type: 'INFO', message: 'James completed 45 reservation lookups', timestamp: '2h ago', read: true, metric: '45' },
];

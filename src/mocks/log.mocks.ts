import { DecisionRecord, Agent, Notification } from '../types';
import { MessageCircle, TrendingUp, Activity, Shield } from '../../components/ui/Icons';

export const mockLogs: DecisionRecord[] = [
    { id: 'EVT 29384', timestamp: '2023-10-24 14:22:01', policy: 'POL TRAVEL EU', verdict: 'ALLOW', evidenceHash: '0x9a8b...2f1', responsible: 'SYS AUTO', credits: 1.205 },
    { id: 'EVT 29385', timestamp: '2023-10-24 14:23:45', policy: 'POL SPEND LIMIT', verdict: 'DENY', evidenceHash: '0x1c3d...8e9', responsible: 'SYS AUTO', credits: 0.850 },
    { id: 'EVT 29386', timestamp: '2023-10-24 14:24:12', policy: 'POL VENDOR KYC', verdict: 'MODIFY', evidenceHash: '0x7f2a...1b4', responsible: 'HUMAN REV', credits: 2.400 },
    { id: 'EVT 29387', timestamp: '2023-10-24 14:26:00', policy: 'POL INVOICE MATCH', verdict: 'ALLOW', evidenceHash: '0x5e6d...9c2', responsible: 'SYS AUTO', credits: 0.920 },
    { id: 'EVT 29388', timestamp: '2023-10-24 14:28:33', policy: 'POL CONTRACT VAL', verdict: 'ALLOW', evidenceHash: '0x3a4b...5f6', responsible: 'SYS AUTO', credits: 1.560 },
    { id: 'EVT 29389', timestamp: '2023-10-25 09:15:00', policy: 'POL HR ACCESS', verdict: 'ALLOW', evidenceHash: '0x2b8c...1a9', responsible: 'SYS AUTO', credits: 0.450 },
    { id: 'EVT 29390', timestamp: '2023-10-25 10:00:22', policy: 'POL DATA EXPORT', verdict: 'DENY', evidenceHash: '0x4d9e...3f2', responsible: 'SEC OPS', credits: 3.200 },
];

export const mockAgents: Agent[] = [
    {
        id: 'amelia',
        name: 'Amelia',
        role: 'External Interface',
        icon: MessageCircle,
        description: 'Primary cognitive node for external communication and guest resolution. Specialized in preemptive hospitality protocols.',
        status: 'active',
        decisionCount: 1240,
        accuracy: '99.2%',
        avatar: 'A',
        metrics: [
            { label: 'Latency', value: '42ms', trend: -12 },
            { label: 'Autonomy', value: '98.5%', trend: 5 }
        ]
    },
    {
        id: 'lara',
        name: 'Lara',
        role: 'Revenue Engine',
        icon: TrendingUp,
        description: 'Strategic optimization node focused on gap monetization and opportunity capture. High-velocity yield management.',
        status: 'active',
        decisionCount: 843,
        accuracy: '97.5%',
        avatar: 'L',
        metrics: [
            { label: 'Yield Impact', value: '+18%', trend: 8 },
            { label: 'Conversion', value: '94%', trend: 2 }
        ]
    },
    {
        id: 'elon',
        name: 'Elon',
        role: 'Operations Engine',
        icon: Activity,
        description: 'Physical-to-digital bridge for operational efficiency. Triages real-world incidents against institutional policy.',
        status: 'active',
        decisionCount: 2150,
        accuracy: '100.0%',
        avatar: 'E',
        metrics: [
            { label: 'Uptime', value: '100%', trend: 0 },
            { label: 'SLA Match', value: '99.9%', trend: 1 }
        ]
    },
    {
        id: 'james',
        name: 'James',
        role: 'Compliance Engine',
        icon: Shield,
        description: 'Analytical node for policy enforcement and risk mitigation. Currently in advanced learning phase for local regulations.',
        status: 'learning',
        decisionCount: 320,
        accuracy: '88.4%',
        avatar: 'J',
        metrics: [
            { label: 'Recall', value: '82%', trend: 15 },
            { label: 'Precision', value: '91%', trend: 4 }
        ]
    },
];

export const mockNotifications: Notification[] = [
    { id: '1', type: 'ALERT', message: 'Autonomous Compliance Rate drop detected', timestamp: '10m ago', read: false, metric: '94.2%' },
    { id: '2', type: 'WARNING', message: 'Human Risk Exposure spike > 5%', timestamp: '1h ago', read: false, metric: 'Risk' },
    { id: '3', type: 'INFO', message: 'Weekly Governance Report generated', timestamp: '1d ago', read: true },
];

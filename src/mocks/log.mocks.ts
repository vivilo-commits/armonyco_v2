import { LogEntry, Agent, Notification } from '../models/log.model';
import { MessageCircle, TrendingUp, Activity, Shield } from '../../components/ui/Icons';

export const mockLogs: LogEntry[] = [
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
        status: 'active',
        decisionCount: 1240,
        accuracy: '99.2%',
        avatar: 'A'
    },
    {
        id: 'lara',
        name: 'Lara',
        role: 'Revenue Engine',
        status: 'active',
        decisionCount: 843,
        accuracy: '97.5%',
        avatar: 'L'
    },
    {
        id: 'elon',
        name: 'Elon',
        role: 'Operations Engine',
        status: 'active',
        decisionCount: 2150,
        accuracy: '100.0%',
        avatar: 'E'
    },
    {
        id: 'james',
        name: 'James',
        role: 'Compliance Engine',
        status: 'learning',
        decisionCount: 320,
        accuracy: '88.4%',
        avatar: 'J'
    },
];

export const mockNotifications: Notification[] = [
    { id: '1', type: 'ALERT', message: 'Autonomous Compliance Rate drop detected', timestamp: '10m ago', read: false, metric: '94.2%' },
    { id: '2', type: 'WARNING', message: 'Human Risk Exposure spike > 5%', timestamp: '1h ago', read: false, metric: 'Risk' },
    { id: '3', type: 'INFO', message: 'Weekly Governance Report generated', timestamp: '1d ago', read: true },
];

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
        id: 'intake',
        name: 'Amelia',
        role: 'Intake & Understanding',
        icon: MessageCircle,
        description: 'Interpreta l’input ed estrae i dati operativi dai canali (WhatsApp/PMS).',
        status: 'active',
        decisionCount: 1240,
        accuracy: '99.2%',
        avatar: 'I',
        metrics: [
            { label: 'Latency', value: '42ms', trend: -12 },
            { label: 'Understanding', value: '98.5%', trend: 5 }
        ]
    },
    {
        id: 'planning',
        name: 'Lara',
        role: 'Planning & Policy',
        icon: TrendingUp,
        description: 'Decide cosa fare in base alle regole del prodotto e al contesto dell’unità.',
        status: 'active',
        decisionCount: 843,
        accuracy: '97.5%',
        avatar: 'P',
        metrics: [
            { label: 'Policy Match', value: '100%', trend: 8 },
            { label: 'Logic Sync', value: '94%', trend: 2 }
        ]
    },
    {
        id: 'execution',
        name: 'Elon',
        role: 'Execution & Communication',
        icon: Activity,
        description: 'Esegue le azioni operative: messaggi agli ospiti, coordinamento e aggiornamenti.',
        status: 'active',
        decisionCount: 2150,
        accuracy: '100.0%',
        avatar: 'E',
        metrics: [
            { label: 'Resolution', value: '100%', trend: 0 },
            { label: 'TTR Sync', value: '99.9%', trend: 1 }
        ]
    },
    {
        id: 'verification',
        name: 'James',
        role: 'Verification & Closure',
        icon: Shield,
        description: 'Verifica le prove, chiude l’evento e registra la decisione nel ledger immutabile.',
        status: 'active',
        decisionCount: 320,
        accuracy: '99.4%',
        avatar: 'V',
        metrics: [
            { label: 'Evidence Matrix', value: '100%', trend: 15 },
            { label: 'Audit Trail', value: '100%', trend: 4 }
        ]
    },
];

export const mockNotifications: Notification[] = [
    { id: '1', type: 'ALERT', message: 'Autonomous Compliance Rate drop detected', timestamp: '10m ago', read: false, metric: '94.2%' },
    { id: '2', type: 'WARNING', message: 'Human Risk Exposure spike > 5%', timestamp: '1h ago', read: false, metric: 'Risk' },
    { id: '3', type: 'INFO', message: 'Weekly Governance Report generated', timestamp: '1d ago', read: true },
];

import { DecisionRecord } from '../types';

export const mockComplianceLog: DecisionRecord[] = [
    { id: 'EVT 29384', timestamp: '2024-01-02 14:22:01', policy: 'POL TRAVEL EU', verdict: 'ALLOW', responsible: 'SYS AUTO', credits: 1 },
    { id: 'EVT 29385', timestamp: '2024-01-02 14:23:45', policy: 'POL SPEND LIMIT', verdict: 'DENY', responsible: 'SYS AUTO', credits: 1 },
    { id: 'EVT 29386', timestamp: '2024-01-02 14:24:12', policy: 'POL VENDOR KYC', verdict: 'MODIFY', responsible: 'HUMAN REV', credits: 2 },
    { id: 'EVT 29387', timestamp: '2024-01-02 14:26:00', policy: 'POL INVOICE MATCH', verdict: 'ALLOW', responsible: 'SYS AUTO', credits: 1 },
];

export const mockComplianceMetrics = {
    rate: 96.8,
    trend: 1.2,
    governedValue: 48100,
    history: [92, 93, 91, 94, 95, 96, 96.8, 97, 96.5, 97.2, 96.8]
};

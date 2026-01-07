import { DecisionRecord } from '../types';

// Real compliance log based on N8n workflow executions
export const mockComplianceLog: DecisionRecord[] = [
    { id: 'AR00001', timestamp: '2026-01-07 21:46:20', policy: 'INSTITUTIONAL_GUEST', verdict: 'ALLOW', responsible: 'AMELIA', credits: 35 },
    { id: 'AR00002', timestamp: '2026-01-07 21:42:15', policy: 'INSTITUTIONAL_FINANCE', verdict: 'ALLOW', responsible: 'JAMES', credits: 12 },
    { id: 'AR00003', timestamp: '2026-01-07 21:38:00', policy: 'INSTITUTIONAL_OPS', verdict: 'ALLOW', responsible: 'LARA', credits: 8 },
    { id: 'AR00004', timestamp: '2026-01-07 21:35:22', policy: 'INSTITUTIONAL_FINANCE', verdict: 'ALLOW', responsible: 'ELON', credits: 45 },
];

// Compliance metrics based on workflow success rates
export const mockComplianceMetrics = {
    rate: 99.2,
    trend: 0.8,
    governedValue: 127,
    history: [95, 96, 97, 98, 98.5, 99, 99.2, 99.1, 99.3, 99.2, 99.2]
};

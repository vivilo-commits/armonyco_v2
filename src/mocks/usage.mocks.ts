import { UsageMetrics } from '../types';

export const mockUsageMetrics: UsageMetrics = {
    complianceRate: 96.8,
    governedValue: 48100,
    autonomyRate: 98.2,
    activeAlerts: 3,
    humanInterventionRate: 1.8,
    trends: [
        { time: '08:00', value: 45000 },
        { time: '10:00', value: 46200 },
        { time: '12:00', value: 46800 },
        { time: '14:00', value: 47100 },
        { time: '16:00', value: 47500 },
        { time: '18:00', value: 47832 },
        { time: '20:00', value: 48100 }
    ]
};

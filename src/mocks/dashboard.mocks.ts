import { TrendingUp, Shield, Activity, Users } from '../../components/ui/Icons';

export const mockValueVelocity = [
    { time: '08:00', value: 45000 },
    { time: '10:00', value: 46200 },
    { time: '12:00', value: 46800 },
    { time: '14:00', value: 47100 },
    { time: '16:00', value: 47500 },
    { time: '18:00', value: 47832 },
    { time: '20:00', value: 48100 },
];

export const mockDomainPerformance = [
    {
        id: 'products-guest',
        label: 'Guest Experience',
        metric: 'Identity Verification',
        value: '100%',
        trend: '0% Manual Review',
        icon: Users,
        color: 'text-white'
    },
    {
        id: 'products-revenue',
        label: 'Revenue Generation',
        metric: 'Gap Monetization',
        value: '12,450 AC',
        trend: '+18% vs Target',
        icon: TrendingUp,
        color: 'text-[var(--color-brand-accent)]'
    },
    {
        id: 'products-ops',
        label: 'Operational Efficiency',
        metric: 'Auto-Triage Rate',
        value: '94.2%',
        trend: '420h Human Time Saved',
        icon: Activity,
        color: 'text-emerald-500'
    },
    {
        id: 'products-response',
        label: 'Incident Response',
        metric: 'SLA Adherence',
        value: '99.9%',
        trend: '< 2m Avg Response',
        icon: Shield,
        color: 'text-emerald-500'
    },
];

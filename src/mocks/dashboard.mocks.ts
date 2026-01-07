import { TrendingUp, Shield, Activity, Users } from '../../components/ui/Icons';

// Real metrics based on N8n workflow executions
export const mockValueVelocity = [
    { time: '08:00', value: 12 },
    { time: '10:00', value: 28 },
    { time: '12:00', value: 45 },
    { time: '14:00', value: 67 },
    { time: '16:00', value: 89 },
    { time: '18:00', value: 112 },
    { time: '20:00', value: 127 },
];

// Domain performance based on real agent workflows
export const mockDomainPerformance = [
    {
        id: 'amelia-guest',
        label: 'Guest Communication',
        metric: 'Amelia WhatsApp',
        value: '127',
        trend: '35.2s avg response',
        icon: Users,
        color: 'text-white'
    },
    {
        id: 'elon-revenue',
        label: 'Revenue Optimization',
        metric: 'Elon Orphan Days',
        value: '€4.2k',
        trend: '+22% opportunity found',
        icon: TrendingUp,
        color: 'text-[var(--color-brand-accent)]'
    },
    {
        id: 'lara-ops',
        label: 'Operations',
        metric: 'Lara Planning',
        value: '94.2%',
        trend: '8h time saved today',
        icon: Activity,
        color: 'text-emerald-500'
    },
    {
        id: 'james-lookup',
        label: 'Reservation Lookup',
        metric: 'James Verification',
        value: '100%',
        trend: '320 lookups completed',
        icon: Shield,
        color: 'text-emerald-500'
    },
];

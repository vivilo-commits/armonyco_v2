import { MessageCircle, TrendingUp, Activity, Shield } from '../components/ui/Icons';

export const agents = [
    {
        id: 'amelia',
        name: 'Amelia',
        role: 'External Interface',
        description: 'Manages all guest interactions pre-arrival and on-site, answering questions and verifying identity.',
        metrics: [
            { label: 'Intent Accuracy', value: '99.2%', trend: 2 }
        ],
        status: 'active' as const,
        icon: MessageCircle,
    },
    {
        id: 'lara',
        name: 'Lara',
        role: 'Revenue Engine',
        description: 'Identifies monetization gaps and proactively offers upgrades and services to guests.',
        metrics: [
            { label: 'Upsell Conversion', value: '24.8%', trend: 5 }
        ],
        status: 'active' as const,
        icon: TrendingUp,
    },
    {
        id: 'elon',
        name: 'Elon',
        role: 'Operations Engine',
        description: 'Orchestrates maintenance and housekeeping, dispatching tasks to the right teams.',
        metrics: [
            { label: 'Dispatch Validity', value: '100.0%' }
        ],
        status: 'active' as const,
        icon: Activity,
    },
    {
        id: 'james',
        name: 'James',
        role: 'Compliance Engine',
        description: 'Audits every event against the Armonyco Reliability Standard to ensure compliance.',
        metrics: [
            { label: 'Policy Adherence', value: '100%', trend: 0 }
        ],
        status: 'learning' as const,
        icon: Shield,
    },
];

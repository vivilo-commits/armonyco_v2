import { MessageCircle, TrendingUp, Activity, Shield } from '../components/ui/Icons';

export const agents = [
    {
        id: 'amelia',
        name: 'Amelia',
        role: 'Intake & Understanding',
        description: 'Interprets input and extracts operational data from channels (WhatsApp/PMS).',
        metrics: [
            { label: 'Intent Accuracy', value: '99.2%', trend: 2 }
        ],
        status: 'active' as const,
        icon: MessageCircle,
    },
    {
        id: 'lara',
        name: 'Lara',
        role: 'Planning & Policy',
        description: 'Decides what to do based on product rules and the unit context.',
        metrics: [
            { label: 'Upsell Conversion', value: '24.8%', trend: 5 }
        ],
        status: 'active' as const,
        icon: TrendingUp,
    },
    {
        id: 'elon',
        name: 'Elon',
        role: 'Execution & Communication',
        description: 'Executes operational actions: guest messaging, coordination, and updates.',
        metrics: [
            { label: 'Dispatch Validity', value: '100.0%' }
        ],
        status: 'active' as const,
        icon: Activity,
    },
    {
        id: 'james',
        name: 'James',
        role: 'Verification & Closure',
        description: 'Verifies evidence, closes the event, and records the decision in the immutable ledger.',
        metrics: [
            { label: 'Policy Adherence', value: '100%', trend: 0 }
        ],
        status: 'active' as const,
        icon: Shield,
    },
];

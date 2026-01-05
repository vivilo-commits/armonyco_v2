import { MessageCircle, TrendingUp, Activity, Shield } from '../components/ui/Icons';

export const agents = [
    {
        id: 'amelia',
        name: 'Amelia',
        role: 'Intake & Understanding',
        description: 'Interpreta l’input ed estrae i dati operativi dai canali (WhatsApp/PMS).',
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
        description: 'Decide cosa fare in base alle regole del prodotto e al contesto dell’unità.',
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
        description: 'Esegue le azioni operative: messaggi agli ospiti, coordinamento e aggiornamenti.',
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
        description: 'Verifica le prove, chiude l’evento e registra la decisione nel ledger immutabile.',
        metrics: [
            { label: 'Policy Adherence', value: '100%', trend: 0 }
        ],
        status: 'active' as const,
        icon: Shield,
    },
];

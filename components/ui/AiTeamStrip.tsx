import React from 'react';
import { Shield, TrendingUp, Activity, MessageCircle, Fingerprint } from 'lucide-react';
import { AgentCard } from './AgentCard';

export const AiTeamStrip: React.FC<{ className?: string }> = ({ className = '' }) => {
  const agents = [
    {
      id: 'amelia',
      name: 'Amelia',
      role: 'Intake & Understanding',
      description: 'Interpreta l’input ed estrae i dati operativi dai canali (WhatsApp/PMS).',
      metrics: [{ label: 'Intent Accuracy', value: '99.8%' }],
      status: 'active' as const,
      icon: MessageCircle
    },
    {
      id: 'lara',
      name: 'Lara',
      role: 'Planning & Policy',
      description: 'Decide cosa fare in base alle regole del prodotto e al contesto dell’unità.',
      metrics: [{ label: 'Upsell Conversion', value: '24.2%', trend: 12 }],
      status: 'active' as const,
      icon: TrendingUp
    },
    {
      id: 'elon',
      name: 'Elon',
      role: 'Execution & Communication',
      description: 'Esegue le azioni operative: messaggi agli ospiti, coordinamento e aggiornamenti.',
      metrics: [{ label: 'Zero Error Rate', value: '100%' }],
      status: 'active' as const,
      icon: Activity
    },
    {
      id: 'james',
      name: 'James',
      role: 'Verification & Closure',
      description: 'Verifica le prove, chiude l’evento e registra la decisione nel ledger immutabile.',
      metrics: [{ label: 'Policy Adherence', value: '100%' }],
      status: 'active' as const,
      icon: Shield
    },
  ];

  return (
    <div className={`w-full mt-8 ${className}`}>
      <div className="flex items-center gap-3 mb-6 opacity-60">
        <Fingerprint size={12} className="text-stone-500" />
        <h4 className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">
          Authorized Personnel
        </h4>
        <div className="h-px bg-stone-200 flex-1"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {agents.map((agent) => (
          <AgentCard
            key={agent.id}
            name={agent.name}
            role={agent.role}
            description={agent.description}
            status={agent.status}
            metrics={agent.metrics}
            icon={agent.icon}
            hideAction={true} // Landing page doesn't need configure actions
          />
        ))}
      </div>
    </div>
  );
};
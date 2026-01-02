import React from 'react';
import { Shield, TrendingUp, Activity, MessageCircle, Fingerprint } from 'lucide-react';
import { AgentCard } from './AgentCard';

export const AiTeamStrip: React.FC<{ className?: string }> = ({ className = '' }) => {
  const agents = [
    {
      id: 'amelia',
      name: 'Amelia',
      role: 'Guest Experience',
      description: 'Autonomously manages guest inquiries, check-ins, and concierge requests 24/7.',
      metrics: [{ label: 'Intent Accuracy', value: '99.8%' }],
      status: 'active' as const,
      icon: MessageCircle
    },
    {
      id: 'lara',
      name: 'Lara',
      role: 'Revenue Engine',
      description: 'Dynamic upsell generation and gap monetization assistant.',
      metrics: [{ label: 'Upsell Conversion', value: '24.2%', trend: 12 }],
      status: 'active' as const,
      icon: TrendingUp
    },
    {
      id: 'elon',
      name: 'Elon',
      role: 'Ops Architect',
      description: 'Orchestrates maintenance tickets and housekeeping schedules.',
      metrics: [{ label: 'Zero Error Rate', value: '100%' }],
      status: 'active' as const,
      icon: Activity
    },
    {
      id: 'james',
      name: 'James',
      role: 'Compliance',
      description: 'Enforces policy adherence and risk auditing across all events.',
      metrics: [{ label: 'Policy Adherence', value: '100%' }],
      status: 'learning' as const,
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
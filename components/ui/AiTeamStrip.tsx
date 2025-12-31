import React from 'react';
import { Shield, TrendingUp, Activity, MessageCircle, Fingerprint } from 'lucide-react';
import { AgentCard } from './AgentCard';

export const AiTeamStrip: React.FC<{ className?: string }> = ({ className = '' }) => {
  const agents = [
    { 
        id: 'amelia', 
        name: 'Amelia', 
        role: 'Guest Experience', 
        metricLabel: 'Intent Accuracy',
        metricValue: '99.8%',
        status: 'ONLINE',
        initial: 'A',
        icon: MessageCircle,
        colorClass: 'text-emerald-500',
        bgClass: 'bg-emerald-500',
        hoverBorderClass: 'group-hover:border-emerald-500',
        borderClass: 'border-emerald-100'
    },
    { 
        id: 'lara', 
        name: 'Lara', 
        role: 'Revenue Engine', 
        metricLabel: 'Upsell Conversion',
        metricValue: '24.2%',
        status: 'WORKING', 
        initial: 'L',
        icon: TrendingUp,
        colorClass: 'text-armonyco-gold',
        bgClass: 'bg-armonyco-gold',
        hoverBorderClass: 'group-hover:border-armonyco-gold',
        borderClass: 'border-[#EADBC4]'
    },
    { 
        id: 'elon', 
        name: 'Elon', 
        role: 'Ops Architect', 
        metricLabel: 'Zero Error Rate',
        metricValue: '100%',
        status: 'ONLINE', 
        initial: 'E',
        icon: Activity,
        colorClass: 'text-blue-500',
        bgClass: 'bg-blue-500',
        hoverBorderClass: 'group-hover:border-blue-500',
        borderClass: 'border-blue-100'
    },
    { 
        id: 'james', 
        name: 'James', 
        role: 'Compliance', 
        metricLabel: 'Policy Adherence', 
        metricValue: '100%',
        status: 'AUDITING', 
        initial: 'J',
        icon: Shield,
        colorClass: 'text-stone-500',
        bgClass: 'bg-stone-500',
        hoverBorderClass: 'group-hover:border-stone-500',
        borderClass: 'border-stone-200'
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
                {...agent}
            />
        ))}
      </div>
    </div>
  );
};
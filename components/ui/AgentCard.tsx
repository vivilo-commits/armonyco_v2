import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Settings, Shield, Activity, Zap } from './Icons';

interface AgentCardProps {
  name: string;
  role: string;
  description?: string;
  status: 'active' | 'learning' | 'idle';
  metrics?: {
    label: string;
    value: string;
    trend?: number;
  }[];
  icon?: any;
  hideAction?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  role,
  status,
  metrics,
  icon: Icon
}) => {
  return (
    <Card
      variant="dark"
      padding="none"
      className="group relative h-full bg-[#080808] border border-white/5 hover:border-[var(--color-brand-accent)]/30 transition-all duration-500 rounded-[2rem] overflow-hidden flex flex-col items-center"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[var(--color-brand-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="p-8 flex flex-col items-center w-full relative z-10">
        {/* IDENTITY SECTION - Centered */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-[var(--color-brand-accent)] shadow-[0_15px_30px_rgba(0,0,0,0.4)] group-hover:scale-105 group-hover:border-[var(--color-brand-accent)]/30 transition-all duration-700 relative">
            {/* Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-brand-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl" />

            {typeof Icon === 'string' ? (
              <img src={Icon} alt={name} className="w-10 h-10 object-contain relative z-10" />
            ) : Icon ? (
              <Icon size={32} strokeWidth={1} className="relative z-10" />
            ) : (
              <Shield size={32} strokeWidth={1} className="relative z-10" />
            )}

            {/* Status Indicator - Integrated and stable */}
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-[4px] border-[#080808] z-20`}>
              <div className={`w-full h-full rounded-full ${status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : status === 'learning' ? 'bg-amber-500' : 'bg-zinc-600'}`} />
            </div>
          </div>

          <div className="flex flex-col items-center text-center px-2">
            <h3 className="text-xl font-bold text-white tracking-tight leading-tight mb-1 group-hover:text-[var(--color-brand-accent)] transition-colors duration-500">
              {name}
            </h3>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] leading-none mb-4">
              {role}
            </span>
            <div className="h-px w-8 bg-white/10" />
          </div>
        </div>

        {/* METRICS - Full width, Justified (Overlap Proof) */}
        <div className="w-full space-y-4 pt-2">
          {(metrics || []).slice(0, 2).map((metric, idx) => (
            <div key={idx} className="flex justify-between items-center w-full px-1">
              <div className="flex flex-col items-start gap-1">
                <span className="text-[8px] text-white/20 uppercase font-bold tracking-[0.2em]">{metric.label}</span>
                <span className="text-xl font-numbers font-bold text-white tracking-tighter leading-none">{metric.value}</span>
              </div>
              {metric.trend !== undefined && (
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black border transition-all ${metric.trend > 0
                  ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10'
                  : 'bg-red-500/5 text-red-500 border-red-500/10'
                  }`}>
                  {metric.trend > 0 ? '↑' : '↓'}{Math.abs(metric.trend)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
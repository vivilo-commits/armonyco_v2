import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Settings, Shield, Activity, Zap } from './Icons';

interface AgentCardProps {
  name: string;
  role: string;
  description: string;
  status: 'active' | 'learning' | 'idle';
  metrics: {
    label: string;
    value: string;
    trend?: number;
  }[];
  icon: any;
  hideAction?: boolean;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  role,
  description,
  status,
  metrics,
  icon: Icon,
  hideAction = false
}) => {
  return (
    <Card
      noPadding
      className="group relative flex flex-col h-full min-h-[500px] w-full bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-brand-accent)] transition-all duration-500 shadow-sm hover:shadow-glow overflow-visible"
    >
      <div className="p-8 flex flex-col h-full relative z-10">

        {/* HEADER SECTION - Fixed height for stability */}
        <div className="flex flex-col gap-4 mb-8 shrink-0">
          <div className="flex justify-between items-start w-full">
            {/* Icon Box */}
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-brand-accent)] group-hover:scale-110 transition-transform duration-500 shadow-sm">
              {typeof Icon === 'string' ? (
                <img src={Icon} alt={name} className="w-10 h-10 object-contain" />
              ) : (
                <Icon size={32} />
              )}
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 pt-1 shrink-0">
              <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-emerald-500 animate-pulse' : status === 'learning' ? 'bg-amber-500' : 'bg-stone-400'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] lg:hidden xl:block">
                {status}
              </span>
            </div>
          </div>

          {/* Name & Role Wrapper */}
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-1 leading-tight line-clamp-1" title={name}>
              {name}
            </h3>
            <span className="text-[11px] font-black text-[var(--color-brand-accent)] uppercase tracking-[0.2em] opacity-80">
              {role}
            </span>
          </div>
        </div>

        {/* DESCRIPTION - Flexible but with minimum lines for alignment */}
        <div className="flex-1 mb-8 overflow-visible">
          <p className="text-[13px] text-[var(--color-text-muted)] leading-relaxed font-light line-clamp-5">
            {description}
          </p>
        </div>

        {/* DIVIDER */}
        <div className="h-px w-full bg-[var(--color-border)] mb-8 shrink-0 opacity-40" />

        {/* METRICS FOOTER */}
        <div className="grid grid-cols-2 gap-8 mt-auto shrink-0">
          {metrics.slice(0, 2).map((metric, idx) => (
            <div key={idx} className="group/metric">
              <div className="text-[9px] text-[var(--color-text-subtle)] uppercase font-black tracking-[0.15em] mb-2 transition-colors group-hover/metric:text-[var(--color-brand-accent)]">
                {metric.label}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-numbers font-bold text-[var(--color-text-main)] leading-none">
                  {metric.value}
                </span>
                {metric.trend && (
                  <span className={`text-[10px] font-bold ${metric.trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {metric.trend > 0 ? '↑' : '↓'}{Math.abs(metric.trend)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Subtle Premium Details */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--color-brand-accent)]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </Card>
  );
};
import React from 'react';
import { Card } from '../ui/Card';
import { IconSizes } from '../ui/Icons';

interface StatCardProps {
    label: string;
    value: string;
    subtext?: React.ReactNode;
    icon: React.ElementType;
    iconColor?: string;
    trend?: {
        value: string;
        isPositive: boolean;
        label: string;
    };
    children?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    subtext,
    icon: Icon,
    iconColor = 'text-[var(--color-brand-accent)]',
    trend,
    children
}) => {
    return (
        <Card
            variant="dark"
            padding="lg"
            className="relative overflow-hidden group hover:scale-[1.02] transition-all duration-300"
        >
            <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:rotate-12 group-hover:scale-110 duration-700 ${iconColor}`}>
                <Icon size={80} />
            </div>

            <div className="flex justify-between items-start mb-1">
                <div className="text-[var(--color-text-muted)] text-[9px] uppercase tracking-[0.2em] font-black opacity-60">
                    {label}
                </div>
                {children && (
                    <span className="text-[8px] bg-white/5 text-white/40 px-1.5 py-0.5 rounded border border-white/10 font-black uppercase tracking-widest">
                        Governed
                    </span>
                )}
            </div>

            <div className="text-3xl font-numbers text-white font-black tracking-tighter italic">
                {value}
            </div>

            {trend ? (
                <div className="text-[var(--color-text-muted)] text-[10px] mt-2 flex items-center gap-1.5 font-bold uppercase tracking-widest">
                    <span className={`${trend.isPositive ? 'text-emerald-500' : 'text-red-500'} font-black font-numbers`}>
                        {trend.value}
                    </span>
                    <span className="opacity-40">{trend.label}</span>
                </div>
            ) : subtext ? (
                <div className="text-[var(--color-text-muted)] text-[10px] mt-2 font-bold uppercase tracking-widest opacity-40">
                    {subtext}
                </div>
            ) : null}

            {children && <div className="mt-4">{children}</div>}
        </Card>
    );
};

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
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500 ${iconColor}`}>
                <Icon size={64} />
            </div>

            <div className="text-[var(--color-text-muted)] text-[10px] uppercase tracking-widest font-bold mb-1">
                {label}
            </div>

            <div className="text-3xl font-numbers text-white">
                {value}
            </div>

            {trend ? (
                <div className="text-[var(--color-text-muted)] text-xs mt-2 flex items-center gap-1">
                    <span className={`${trend.isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'} font-bold font-numbers text-[10px]`}>
                        {trend.value}
                    </span>
                    {trend.label}
                </div>
            ) : subtext ? (
                <div className="text-[var(--color-text-muted)] text-xs mt-2">
                    {subtext}
                </div>
            ) : null}

            {children && <div className="mt-3">{children}</div>}
        </Card>
    );
};

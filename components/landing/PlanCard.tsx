import React from 'react';
import { CheckCircle } from '../ui/Icons';

export interface Plan {
    id: number;
    name: string;
    credits: number;
    tokens?: number; // Tokens = credits × 100
    price: number;
    features: string[];
    badge?: string;
    isCustom?: boolean;
}

interface PlanCardProps {
    plan: Plan;
    selected: boolean;
    onSelect: () => void;
    badge?: string;
    className?: string;
}

export const PlanCard: React.FC<PlanCardProps> = ({
    plan,
    selected,
    onSelect,
    badge,
    className = '',
}) => {
    return (
        <button
            onClick={onSelect}
            className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300
                flex flex-col gap-4 text-left w-full
                ${selected
                    ? 'border-[var(--color-brand-accent)] bg-[var(--color-brand-accent)]/5 scale-[1.02] shadow-xl'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-text-main)] hover:shadow-lg'
                }
                ${className}
            `}
        >
            {/* Badge */}
            {(badge || plan.badge) && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[var(--color-brand-accent)] text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                        {badge || plan.badge}
                    </span>
                </div>
            )}

            {/* Header */}
            <div className="text-center">
                <h3 className="text-sm uppercase tracking-[0.2em] font-black text-[var(--color-brand-accent)] mb-2">
                    {plan.name}
                </h3>

                {plan.isCustom ? (
                    <div className="py-4">
                        <p className="text-2xl font-bold text-[var(--color-text-main)]">
                            Contact Us
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            Custom Quote
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-4xl font-bold text-[var(--color-text-main)]">
                                €{plan.price.toLocaleString('en-US')}
                            </span>
                            <span className="text-sm text-[var(--color-text-muted)]">/month</span>
                        </div>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            VAT excluded • Monthly billing
                        </p>
                    </>
                )}
            </div>

            {/* Monthly Tokens */}
            {!plan.isCustom && (
                <div className="text-center py-4 bg-gradient-to-br from-[var(--color-brand-accent)]/10 to-[var(--color-brand-accent)]/5 rounded-lg border border-[var(--color-brand-accent)]/20">
                    <p className="text-3xl font-bold text-[var(--color-text-main)]">
                        {(plan.tokens || plan.credits * 100).toLocaleString('en-US')}
                    </p>
                    <p className="text-[10px] uppercase font-black text-[var(--color-brand-accent)] tracking-wider mt-1">
                        Tokens/Month
                    </p>
                    <p className="text-[9px] text-[var(--color-text-muted)] mt-1.5 px-2">
                        ⚡ Tokens accumulate every month
                    </p>
                </div>
            )}

            {/* Features */}
            <div className="flex-1">
                <p className="text-xs uppercase font-black text-[var(--color-text-muted)] tracking-wider mb-3">
                    {plan.isCustom ? 'Includes:' : 'Included Features:'}
                </p>
                <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                        <li
                            key={index}
                            className="flex items-start gap-2 text-sm text-[var(--color-text-main)]"
                        >
                            <CheckCircle
                                size={16}
                                className="text-emerald-400 shrink-0 mt-0.5"
                            />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Selected indicator */}
            {selected && (
                <div className="flex items-center justify-center gap-2 py-2 bg-[var(--color-brand-accent)] text-black rounded-lg font-bold text-sm">
                    <CheckCircle size={18} />
                    <span>Selected Plan</span>
                </div>
            )}
        </button>
    );
};


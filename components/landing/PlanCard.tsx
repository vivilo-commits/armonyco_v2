import React from 'react';
import { CheckCircle, Zap } from '../ui/Icons';

export interface Plan {
    id: number;
    name: string;
    credits: number;
    tokens?: number; // Tokens = credits × 100
    price: number;
    features: string[];
    badge?: string;
    isCustom?: boolean;
    popular?: boolean;
    units?: string;
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
    const isPopular = plan.popular || plan.badge === '🔥 MOST POPULAR';

    return (
        <button
            onClick={onSelect}
            className={`
                relative rounded-[2.5rem] border transition-all duration-300
                flex flex-col text-left w-full overflow-hidden py-10 px-6
                bg-white
                ${selected
                    ? 'border-[var(--color-brand-accent)] shadow-[0_0_30px_rgba(212,175,55,0.15)]'
                    : 'border-zinc-200 hover:border-zinc-300 hover:shadow-lg'
                }
                ${className}
            `}
        >
            {/* Selected Badge */}
            {selected && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-[var(--color-brand-accent)] text-black text-[8px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-xl shadow-lg whitespace-nowrap">
                        Selected Plan
                    </span>
                </div>
            )}

            {/* Popular Badge */}
            {isPopular && !selected && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                    <span className="bg-[var(--color-brand-accent)] text-black text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-b-xl shadow-lg whitespace-nowrap">
                        Most Popular
                    </span>
                </div>
            )}

            {/* Plan Name */}
            <div className="text-center flex flex-col items-center">
                <h3 className="text-[var(--color-brand-accent)] text-[12px] font-black uppercase tracking-[0.25em] mb-4">
                    {plan.name}
                </h3>

                {plan.isCustom ? (
                    <div className="mb-2">
                        <span className="text-[28px] font-bold text-zinc-900">Contact Us</span>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Bespoke Quote</p>
                        <p className="text-[11px] text-[var(--color-brand-accent)] font-bold uppercase tracking-widest mt-2">
                            {plan.units || '500+ Units'}
                        </p>
                    </div>
                ) : (
                    <div className="mb-2 flex flex-col items-center">
                        <div className="flex items-baseline">
                            <span className="text-[42px] font-bold text-zinc-900 leading-none">
                                €{plan.price.toLocaleString('de-DE')}
                            </span>
                            <span className="text-zinc-500 text-[18px] font-medium">/mo</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1.5">VAT included</p>
                        <p className="text-[11px] text-[var(--color-brand-accent)] font-bold uppercase tracking-widest mt-2 italic">
                            €5/unit • {plan.units || 'Up to 50 units'}
                        </p>
                    </div>
                )}
            </div>

            {/* Credits Box */}
            <div className="w-full mt-6 pt-6 border-t border-zinc-100 text-center">
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[var(--color-brand-accent)] block mb-2">
                    {plan.isCustom ? 'Scope' : 'Includes'}
                </span>
                {plan.isCustom ? (
                    <span className="text-[14px] font-bold text-zinc-700">Institutional Project</span>
                ) : (
                    <>
                        <span className="text-[24px] font-bold text-zinc-900">
                            {plan.credits.toLocaleString('de-DE')}
                        </span>
                        <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-1">
                            ArmoCredits©
                        </p>
                    </>
                )}
            </div>

            {/* CTA Button */}
            <div className="mt-6 w-full flex justify-center">
                <div
                    className={`px-10 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all duration-300 whitespace-nowrap ${selected
                        ? 'bg-transparent border border-zinc-300 text-zinc-600'
                        : 'bg-[var(--color-brand-accent)] border border-[var(--color-brand-accent)] text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                        }`}
                >
                    {selected ? 'Selected' : plan.isCustom ? 'Contact Sales' : 'Select Plan'}
                </div>
            </div>
        </button>
    );
};


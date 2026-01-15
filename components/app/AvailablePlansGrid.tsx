import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle, ArrowRight, Mail, Layers } from '../ui/Icons';

interface SubscriptionPlan {
    id: number;
    name: string;
    price: number;
    features: string[];
    credits?: number; // Monthly credits included
}

interface AvailablePlansGridProps {
    plans: SubscriptionPlan[];
    currentPlanId: number;
    onUpgrade: (planId: number) => void;
    onDowngrade: (planId: number) => void;
    onContactUs: () => void;
    loading?: boolean;
}

export const AvailablePlansGrid: React.FC<AvailablePlansGridProps> = ({
    plans,
    currentPlanId,
    onUpgrade,
    onDowngrade,
    onContactUs,
    loading = false
}) => {
    const [processingPlanId, setProcessingPlanId] = useState<number | null>(null);

    const handlePlanAction = async (planId: number, isUpgrade: boolean) => {
        setProcessingPlanId(planId);
        try {
            if (isUpgrade) {
                await onUpgrade(planId);
            } else {
                await onDowngrade(planId);
            }
        } finally {
            setProcessingPlanId(null);
        }
    };

    // Filter out current plan
    const availablePlans = plans.filter(p => p.id !== currentPlanId);

    if (availablePlans.length === 0) {
        return null;
    }

    return (
        <div className="space-y-8 mb-10">
            {/* Section Header */}
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-brand-accent)]/10 border border-[var(--color-brand-accent)]/20 flex items-center justify-center">
                    <Layers size={24} className="text-[var(--color-brand-accent)]" />
                </div>
                <div>
                    <h3 className="text-2xl font-light text-white">
                        Upgrade or Change Your Plan
                    </h3>
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] mt-1">
                        Scale your autonomous fleet
                    </p>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availablePlans.map((plan) => {
                    const isVIP = plan.price === 0 || plan.name.toLowerCase().includes('vip') || plan.name.toLowerCase().includes('custom');
                    const isUpgrade = plan.id > currentPlanId;
                    const isProcessing = processingPlanId === plan.id;

                    return (
                        <Card
                            key={plan.id}
                            variant="dark"
                            padding="lg"
                            className="border-white/10 hover:border-[var(--color-brand-accent)]/30 transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Plan Header */}
                            <div className="text-center mb-6 pb-6 border-b border-white/5">
                                <h4 className="text-sm uppercase tracking-[0.25em] font-black text-[var(--color-brand-accent)] mb-4">
                                    {plan.name}
                                </h4>
                                
                                {isVIP ? (
                                    <div className="space-y-2">
                                        <p className="text-3xl font-bold text-white">
                                            Contact Us
                                        </p>
                                        <p className="text-xs text-white/40 uppercase font-black tracking-widest">
                                            Bespoke Quote
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-4xl font-bold text-white">
                                                €{plan.price.toLocaleString('de-DE')}
                                            </span>
                                            <span className="text-sm text-white/40">/mo</span>
                                        </div>
                                        <p className="text-xs text-white/40 uppercase font-black tracking-widest">
                                            VAT INCLUDED
                                        </p>
                                    </div>
                                )}

                                {/* Units or Credits */}
                                {plan.units && (
                                    <p className="text-xs text-[var(--color-brand-accent)] font-bold uppercase tracking-wide mt-3 italic">
                                        {plan.units}
                                    </p>
                                )}
                            </div>

                            {/* Monthly Credits (if not VIP) */}
                            {!isVIP && plan.credits && (
                                <div className="mb-6 p-4 bg-[var(--color-brand-accent)]/10 border border-[var(--color-brand-accent)]/20 rounded-xl text-center">
                                    <p className="text-xs uppercase font-black text-[var(--color-brand-accent)] tracking-wider mb-1">
                                        Includes
                                    </p>
                                    <p className="text-2xl font-bold text-white">
                                        {plan.credits.toLocaleString('de-DE')}
                                    </p>
                                    <p className="text-[9px] text-white/40 uppercase font-black tracking-widest mt-1">
                                        ArmoCredits©
                                    </p>
                                </div>
                            )}

                            {/* Features */}
                            <div className="flex-1 mb-6">
                                <p className="text-[10px] uppercase font-black text-white/40 tracking-wider mb-3">
                                    Features:
                                </p>
                                <ul className="space-y-2">
                                    {plan.features.slice(0, 4).map((feature, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start gap-2 text-xs text-white/70"
                                        >
                                            <CheckCircle
                                                size={14}
                                                className="text-emerald-400 shrink-0 mt-0.5"
                                            />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                    {plan.features.length > 4 && (
                                        <li className="text-[10px] text-white/40 italic pl-5">
                                            +{plan.features.length - 4} more features
                                        </li>
                                    )}
                                </ul>
                            </div>

                            {/* Action Button */}
                            {isVIP ? (
                                <Button
                                    variant="ghost"
                                    fullWidth
                                    onClick={onContactUs}
                                    leftIcon={<Mail size={16} />}
                                    className="border border-[var(--color-brand-accent)]/30 hover:bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)]"
                                >
                                    Contact Sales
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => handlePlanAction(plan.id, isUpgrade)}
                                    disabled={loading || isProcessing}
                                    isLoading={isProcessing}
                                    rightIcon={<ArrowRight size={16} />}
                                    className={`
                                        ${isUpgrade 
                                            ? '!bg-[var(--color-brand-accent)] !text-black hover:!bg-white' 
                                            : '!bg-white/10 !text-white hover:!bg-white/20'
                                        }
                                        font-black uppercase tracking-wider text-[10px]
                                    `}
                                >
                                    {isUpgrade ? 'Upgrade Now' : 'Downgrade'}
                                </Button>
                            )}
                        </Card>
                    );
                })}
            </div>

            {/* Disclaimer */}
            <p className="text-center text-[10px] text-zinc-500 uppercase font-bold tracking-widest italic opacity-60 mt-6">
                All payments are processed securely via Stripe. VAT included in all institutional tiers.
            </p>
        </div>
    );
};

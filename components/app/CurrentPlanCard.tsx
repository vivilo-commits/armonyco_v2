import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle, Award, Calendar, X } from '../ui/Icons';
import { Button } from '../ui/Button';

interface SubscriptionPlan {
    id: number;
    name: string;
    price: number;
    features: string[];
}

interface CurrentPlanCardProps {
    plan: SubscriptionPlan;
    nextBillingDate: string;
    status: string;
    onCancel?: () => void;
    loading?: boolean;
}

export const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({
    plan,
    nextBillingDate,
    status,
    onCancel,
    loading = false
}) => {
    const isActive = status === 'active';
    const isPastDue = status === 'past_due';
    const isCanceled = status === 'canceled' || status === 'cancelled';

    return (
        <Card 
            variant="dark" 
            padding="lg"
            className="border-[var(--color-brand-accent)]/30 shadow-[0_0_50px_rgba(212,175,55,0.15)] mb-8"
        >
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Award size={24} className="text-[var(--color-brand-accent)]" />
                    <h2 className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--color-brand-accent)]">
                        YOUR CURRENT PLAN
                    </h2>
                </div>
                
                {/* Status Badge */}
                <span className={`
                    text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest
                    ${isActive ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : ''}
                    ${isPastDue ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : ''}
                    ${isCanceled ? 'bg-red-500/10 text-red-500 border border-red-500/20' : ''}
                `}>
                    {isActive && 'Active'}
                    {isPastDue && 'Past Due'}
                    {isCanceled && 'Canceled'}
                </span>
            </div>

            {/* Plan Name & Price */}
            <div className="mb-8">
                <h1 className="text-5xl font-black text-white mb-2 uppercase tracking-tight">
                    {plan.name}
                </h1>
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[var(--color-brand-accent)]">
                        €{plan.price.toLocaleString('de-DE')}
                    </span>
                    <span className="text-xl text-white/60">/month</span>
                </div>
                <p className="text-xs text-white/40 uppercase font-black tracking-widest mt-2">
                    VAT INCLUDED
                </p>
            </div>

            {/* Features List */}
            <div className="mb-8 pb-8 border-b border-white/10">
                <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <CheckCircle 
                                size={18} 
                                className="text-emerald-400 shrink-0 mt-0.5" 
                            />
                            <span className="text-sm text-white/80 leading-relaxed">
                                {feature}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Billing Info & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        <Calendar size={18} className="text-[var(--color-brand-accent)]" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-white/40">
                            Next Billing Date
                        </p>
                        <p className="text-sm font-bold text-white">
                            {new Date(nextBillingDate).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>

                {/* Cancel Button - Only show if active */}
                {isActive && onCancel && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onCancel}
                        disabled={loading}
                        leftIcon={<X size={14} />}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20"
                    >
                        Cancel Subscription
                    </Button>
                )}

                {isPastDue && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <span className="text-xs text-amber-500 font-bold">
                            ⚠️ Payment overdue - please update payment method
                        </span>
                    </div>
                )}

                {isCanceled && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <span className="text-xs text-red-400 font-bold">
                            Access until {new Date(nextBillingDate).toLocaleDateString('en-US')}
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
};

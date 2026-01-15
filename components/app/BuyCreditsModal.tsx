import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { CheckCircle, CreditCard, Zap } from '../ui/Icons';
import { CREDIT_PACKS, getTotalCredits, hasBonus } from '../../src/config/creditPacks';

interface BuyCreditsModalProps {
    isOpen: boolean;
    onClose: () => void;
    organizationId: string;
}

export const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({
    isOpen,
    onClose,
    organizationId
}) => {
    const [selectedPackId, setSelectedPackId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const handleBuyCredits = async (packId: number) => {
        try {
            setLoading(true);
            setSelectedPackId(packId);

            console.log('[BuyCredits] Initiating purchase:', {
                organizationId,
                packId
            });

            // Call API to create Stripe checkout session
            const response = await fetch('/api/stripe/buy-credits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    organizationId,
                    creditPackId: packId
                })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                console.error('[BuyCredits] Error:', data.error || data.details);
                alert(`Error: ${data.error || 'Failed to initiate purchase'}`);
                return;
            }

            console.log('[BuyCredits] Checkout URL:', data.checkoutUrl);

            // Redirect to Stripe Checkout
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }

        } catch (error: any) {
            console.error('[BuyCredits] Error:', error);
            alert('Failed to purchase credits. Please try again.');
        } finally {
            setLoading(false);
            setSelectedPackId(null);
        }
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            title="Buy ArmoCredits©"
        >
            <div className="p-6 max-w-4xl">
                <p className="text-sm text-[var(--color-text-muted)] mb-8 text-center">
                    Choose a credit pack to recharge your balance. Credits are available immediately after payment.
                </p>

                {/* Credit Packs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {CREDIT_PACKS.map(pack => {
                        const totalCredits = getTotalCredits(pack);
                        const packHasBonus = hasBonus(pack);
                        const isSelected = selectedPackId === pack.id;
                        const isLoading = loading && isSelected;

                        return (
                            <Card
                                key={pack.id}
                                variant="dark"
                                padding="lg"
                                className={`
                                    relative flex flex-col transition-all duration-300 cursor-pointer
                                    ${pack.popular ? 'border-[var(--color-brand-accent)]/40 shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'border-white/10'}
                                    ${isSelected ? 'scale-105 shadow-xl' : 'hover:border-[var(--color-brand-accent)]/20'}
                                `}
                            >
                                {/* Popular Badge */}
                                {pack.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="bg-[var(--color-brand-accent)] text-black text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                                            POPULAR
                                        </span>
                                    </div>
                                )}

                                {/* Pack Name */}
                                <div className="text-center mb-4">
                                    <h4 className="text-[11px] uppercase tracking-[0.2em] font-black text-[var(--color-brand-accent)] mb-2">
                                        {pack.name}
                                    </h4>
                                </div>

                                {/* Credits Amount */}
                                <div className="text-center mb-4 pb-4 border-b border-white/10">
                                    <div className="text-3xl font-bold text-white mb-1">
                                        {pack.credits.toLocaleString('de-DE')}
                                    </div>
                                    {packHasBonus && (
                                        <div className="text-sm text-emerald-400 font-bold">
                                            +{pack.bonus?.toLocaleString('de-DE')} bonus
                                        </div>
                                    )}
                                    <div className="text-[10px] text-white/40 uppercase font-black tracking-widest mt-1">
                                        ArmoCredits©
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="text-center mb-6">
                                    <div className="text-2xl font-bold text-[var(--color-brand-accent)]">
                                        €{pack.price}
                                    </div>
                                    {pack.discount && (
                                        <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wide mt-1">
                                            {pack.discount}% off
                                        </div>
                                    )}
                                </div>

                                {/* Total Credits */}
                                {packHasBonus && (
                                    <div className="mb-4 p-3 bg-[var(--color-brand-accent)]/10 border border-[var(--color-brand-accent)]/20 rounded-lg text-center">
                                        <div className="text-xs text-white/60 uppercase font-black tracking-wider mb-1">
                                            Total
                                        </div>
                                        <div className="text-xl font-bold text-white">
                                            {totalCredits.toLocaleString('de-DE')}
                                        </div>
                                        <div className="text-[9px] text-white/40 uppercase tracking-widest">
                                            ArmoCredits©
                                        </div>
                                    </div>
                                )}

                                {/* Buy Button */}
                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => handleBuyCredits(pack.id)}
                                    disabled={loading}
                                    isLoading={isLoading}
                                    leftIcon={!isLoading ? <CreditCard size={16} /> : undefined}
                                    className={`
                                        ${pack.popular 
                                            ? '!bg-[var(--color-brand-accent)] !text-black hover:!bg-white' 
                                            : '!bg-white/10 !text-white hover:!bg-white/20'
                                        }
                                        font-black uppercase tracking-wider text-[10px]
                                    `}
                                >
                                    {isLoading ? 'Processing...' : 'Buy Now'}
                                </Button>
                            </Card>
                        );
                    })}
                </div>

                {/* Info Section */}
                <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Zap size={16} className="text-[var(--color-brand-accent)] shrink-0 mt-0.5" />
                        <div className="text-xs text-white/60 leading-relaxed">
                            <p className="mb-2">
                                <strong className="text-white">Credits are added instantly</strong> after successful payment.
                            </p>
                            <p>
                                All payments are processed securely via Stripe. VAT included.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <div className="mt-6 flex justify-end">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={loading}
                        className="text-zinc-400 hover:text-white"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

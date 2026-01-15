import { useState } from 'react';
import { X, CreditCard, Lock, Sparkles } from 'lucide-react';
import { CREDIT_PACKS, getTotalCredits } from '../../src/config/creditPacks';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: string;
}

export function BuyCreditsModal({ isOpen, onClose, organizationId }: BuyCreditsModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPackId, setSelectedPackId] = useState<number | null>(null);

  async function handleBuyCredits(packId: number) {
    try {
      setLoading(true);
      setSelectedPackId(packId);

      const response = await fetch('/api/stripe/buy-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId,
          creditPackId: packId
        })
      });

      const { checkoutUrl, error } = await response.json();

      if (error) {
        alert('Error: ' + error);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;

    } catch (error) {
      console.error('Error buying credits:', error);
      alert('Failed to purchase credits');
    } finally {
      setLoading(false);
      setSelectedPackId(null);
    }
  }

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-5"
      onClick={onClose}
    >
      <div 
        className="bg-[#0a0a0a] rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-3xl font-bold text-white">Buy ArmoCredits®</h2>
          <button 
            className="p-2 hover:bg-gray-900 rounded-lg transition-all text-gray-500 hover:text-white"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* Subtitle */}
        <p className="text-gray-400 text-sm mb-8 leading-relaxed">
          Choose a credit pack to recharge your balance. Credits are available immediately after payment.
        </p>

        {/* Credit Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {CREDIT_PACKS.map((pack) => {
            const totalCredits = getTotalCredits(pack);
            const hasBonus = pack.bonus && pack.bonus > 0;
            const isPopular = pack.popular;
            const isProcessing = loading && selectedPackId === pack.id;

            return (
              <div 
                key={pack.id} 
                className={`
                  relative bg-[#1a1a1a] border-2 rounded-xl p-6 
                  flex flex-col items-center text-center
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                  ${isPopular 
                    ? 'border-yellow-500 bg-gradient-to-br from-[#1a1a1a] to-[#2a2410]' 
                    : 'border-gray-800 hover:border-gray-700'
                  }
                `}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 right-3 bg-gradient-to-r from-yellow-500 to-yellow-300 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-yellow-500/40">
                    POPULAR
                  </div>
                )}

                {/* Pack Name */}
                <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-4">
                  {pack.name}
                </div>

                {/* Main Credits */}
                <div className="mb-2">
                  <div className="text-5xl font-bold text-white leading-none">
                    {(pack.credits / 1000).toFixed(1)}K
                  </div>
                  <div className="text-[10px] font-medium uppercase tracking-wider text-gray-600 mt-1">
                    ARMOCREDITS®
                  </div>
                </div>

                {/* Bonus */}
                {hasBonus && (
                  <div className="my-3 px-3 py-2 bg-emerald-500/10 rounded-lg">
                    <span className="text-emerald-400 text-sm font-semibold flex items-center gap-1.5">
                      <Sparkles size={14} />
                      +{pack.bonus?.toLocaleString()} bonus
                    </span>
                  </div>
                )}

                {/* Price */}
                <div className="my-4">
                  <div className="text-4xl font-bold text-white">€{pack.price}</div>
                </div>

                {/* Discount Badge */}
                {pack.discount && (
                  <div className="mb-4 px-2.5 py-1 bg-amber-500/20 rounded-md">
                    <span className="text-amber-400 text-[11px] font-black uppercase tracking-wider">
                      {pack.discount}% OFF
                    </span>
                  </div>
                )}

                {/* Total Credits */}
                <div className="w-full pt-4 border-t border-gray-800 mb-4">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-600">
                    TOTAL
                  </div>
                  <div className="text-3xl font-bold text-white my-1">
                    {(totalCredits / 1000).toFixed(1)}K
                  </div>
                  <div className="text-[9px] font-medium uppercase tracking-wider text-gray-700">
                    ARMOCREDITS®
                  </div>
                </div>

                {/* Buy Button */}
                <button
                  className={`
                    w-full py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider
                    flex items-center justify-center gap-2
                    transition-all duration-300
                    ${isPopular
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 text-black hover:from-yellow-400 hover:to-yellow-300 shadow-lg shadow-yellow-500/30'
                      : 'bg-white text-black hover:bg-gray-100'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${!isProcessing && 'hover:scale-[1.02]'}
                  `}
                  onClick={() => handleBuyCredits(pack.id)}
                  disabled={loading}
                >
                  {isProcessing ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      <span>BUY NOW</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Security Info */}
        <div className="mt-8 p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <Lock size={18} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-sm mb-1">
                Secure payment powered by Stripe
              </p>
              <p className="text-gray-400 text-xs leading-relaxed">
                Credits are added instantly after successful payment. All transactions are encrypted and secure. VAT included in all prices.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-gray-800 flex justify-end">
          <button 
            className="px-4 py-2 text-gray-500 hover:text-white hover:bg-gray-900 rounded-lg text-sm font-medium transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

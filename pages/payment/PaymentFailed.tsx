/**
 * PAYMENT FAILED PAGE
 * Handles the case when payment fails on Stripe
 * Provides information and options to retry
 */

import React from 'react';
import { AlertTriangle, ChevronLeft, CreditCard } from '../../components/ui/Icons';
import { Button } from '../../components/ui/Button';

interface PaymentFailedProps {
    onRetry?: () => void;
    onGoHome?: () => void;
}

export const PaymentFailed: React.FC<PaymentFailedProps> = ({ 
    onRetry, 
    onGoHome 
}) => {
    const handleRetryPayment = () => {
        // Check if there's saved registration data
        const pendingData = localStorage.getItem('pending_registration');
        const draftData = localStorage.getItem('armonyco_registration_draft');
        
        if (pendingData || draftData) {
            // Redirect back to home with signup modal open
            if (onRetry) {
                onRetry();
            } else {
                window.location.href = '/?signup=1';
            }
        } else {
            // No saved data, start fresh
            if (onRetry) {
                onRetry();
            } else {
                window.location.href = '/';
            }
        }
    };

    const handleGoHome = () => {
        if (onGoHome) {
            onGoHome();
        } else {
            window.location.href = '/';
        }
    };

    const handleContactSupport = () => {
        window.location.href = 'mailto:support@armonyco.com?subject=Payment Problem';
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img 
                        src="/assets/logo-full.png" 
                        alt="Armonyco" 
                        className="h-12 object-contain" 
                    />
                </div>

                {/* Card */}
                <div className="bg-[#151515] border border-zinc-800 rounded-2xl p-8 md:p-12">
                    <div className="text-center space-y-8 animate-in fade-in duration-500">
                        {/* Icon */}
                        <div className="w-24 h-24 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                            <AlertTriangle size={48} className="text-red-400" />
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-3">
                                Payment Failed
                            </h1>
                            <p className="text-lg text-zinc-400">
                                A problem occurred while processing the payment
                            </p>
                        </div>

                        {/* Possible Causes */}
                        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-left">
                            <h3 className="text-sm font-bold text-red-400 mb-3 flex items-center gap-2">
                                <AlertTriangle size={16} />
                                <span>Possible Causes</span>
                            </h3>
                            <ul className="text-sm text-zinc-300 space-y-2">
                                <li>• Insufficient funds on card</li>
                                <li>• Expired or invalid card</li>
                                <li>• Spending limit reached</li>
                                <li>• Bank declined the transaction</li>
                                <li>• Temporary connection error</li>
                            </ul>
                        </div>

                        {/* What to Do */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-left">
                            <h3 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                                <span>💡</span>
                                <span>What to Do</span>
                            </h3>
                            <ul className="text-sm text-zinc-300 space-y-2">
                                <li>1. Verify your credit card details</li>
                                <li>2. Make sure you have sufficient funds</li>
                                <li>3. Contact your bank if the problem persists</li>
                                <li>4. Try again with another payment method</li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                variant="primary"
                                onClick={handleRetryPayment}
                                leftIcon={<CreditCard size={18} />}
                                className="min-w-[200px]"
                            >
                                Retry Payment
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handleContactSupport}
                                className="min-w-[200px]"
                            >
                                Contact Support
                            </Button>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleGoHome}
                                className="text-sm text-zinc-500 hover:text-zinc-400 flex items-center gap-1"
                            >
                                <ChevronLeft size={16} />
                                Back to Home
                            </button>
                        </div>

                        {/* Note */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                            <p className="text-xs text-zinc-500">
                                🔒 <strong>Security:</strong> No amount was charged. 
                                Your registration data is safely saved and you can try again whenever you want.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-zinc-600">
                        Secure payments processed by{' '}
                        <a 
                            href="https://stripe.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:underline"
                        >
                            Stripe
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

/**
 * PAYMENT CANCEL PAGE
 * Handles the case when user cancels payment on Stripe Checkout
 * Allows user to:
 * - Return to registration wizard
 * - Try again with payment
 * - Go back to home
 */

import React from 'react';
import { XCircle, ChevronLeft, CreditCard } from '../../components/ui/Icons';
import { Button } from '../../components/ui/Button';

interface PaymentCancelProps {
    onRetry?: () => void;
    onGoHome?: () => void;
}

export const PaymentCancel: React.FC<PaymentCancelProps> = ({ 
    onRetry, 
    onGoHome 
}) => {
    const handleRetryPayment = () => {
        // Check if there's saved registration data
        const pendingData = localStorage.getItem('pending_registration');
        const draftData = localStorage.getItem('armonyco_registration_draft');
        
        if (pendingData || draftData) {
            // Redirect back to home with signup modal open
            // The wizard will restore from localStorage
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
                        <div className="w-24 h-24 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center">
                            <XCircle size={48} className="text-orange-400" />
                        </div>

                        {/* Title */}
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-3">
                                Payment Cancelled
                            </h1>
                            <p className="text-lg text-zinc-400">
                                You cancelled the payment process
                            </p>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-left">
                            <h3 className="text-sm font-bold text-blue-400 mb-3 flex items-center gap-2">
                                <span>ℹ️</span>
                                <span>What Happened?</span>
                            </h3>
                            <ul className="text-sm text-zinc-300 space-y-2">
                                <li>• No charge was made to your card</li>
                                <li>• Your registration data has been safely saved</li>
                                <li>• You can complete the payment at any time</li>
                            </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                variant="primary"
                                onClick={handleRetryPayment}
                                leftIcon={<CreditCard size={18} />}
                                className="min-w-[220px]"
                            >
                                Retry Payment
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={handleGoHome}
                                leftIcon={<ChevronLeft size={18} />}
                                className="min-w-[220px]"
                            >
                                Back to Home
                            </Button>
                        </div>

                        {/* Note */}
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                            <p className="text-xs text-zinc-500">
                                💡 <strong>Note:</strong> Your data is saved locally and will be 
                                automatically deleted after 24 hours. Don't worry, you haven't lost anything!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-zinc-600">
                        Have questions about the payment process?{' '}
                        <a href="mailto:support@armonyco.com" className="text-emerald-400 hover:underline">
                            Contact support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

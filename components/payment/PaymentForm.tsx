/**
 * PaymentForm Component
 * 
 * Embedded payment form using Stripe PaymentElement
 * Supports all payment methods (cards, wallets, etc.)
 */

import React, { useState, useEffect } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import { Button } from '../ui/Button';
import { Loader, AlertTriangle, CheckCircle } from '../ui/Icons';

export interface PaymentFormProps {
    clientSecret: string;
    amount: number; // in cents
    currency?: string;
    onSuccess?: (paymentIntentId: string) => void;
    onError?: (error: string) => void;
    metadata?: Record<string, string>;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
    clientSecret,
    amount,
    currency = 'eur',
    onSuccess,
    onError,
    metadata = {},
}) => {
    const stripe = useStripe();
    const elements = useElements();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'succeeded' | 'failed'>('idle');
    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

    // Format amount for display
    const formattedAmount = new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: currency.toUpperCase(),
    }).format(amount / 100);

    useEffect(() => {
        if (!stripe || !clientSecret) {
            return;
        }

        // Check payment status on mount (in case user returns after payment)
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (paymentIntent) {
                if (paymentIntent.status === 'succeeded') {
                    setPaymentStatus('succeeded');
                    setPaymentIntentId(paymentIntent.id);
                    onSuccess?.(paymentIntent.id);
                } else if (paymentIntent.status === 'processing') {
                    setPaymentStatus('processing');
                } else if (paymentIntent.status === 'requires_payment_method') {
                    setPaymentStatus('idle');
                }
            }
        });
    }, [stripe, clientSecret, onSuccess]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setError('Stripe non inizializzato correttamente');
            return;
        }

        setIsLoading(true);
        setError(null);
        setPaymentStatus('processing');

        try {
            // Submit payment
            const { error: submitError, paymentIntent } = await stripe.confirmPayment({
                elements,
                clientSecret,
                confirmParams: {
                    return_url: `${window.location.origin}/payment/success`,
                    payment_method_data: {
                        billing_details: {
                            // Add billing details from metadata if available
                            ...(metadata.email && { email: metadata.email }),
                            ...(metadata.firstName && metadata.lastName && {
                                name: `${metadata.firstName} ${metadata.lastName}`,
                            }),
                        },
                    },
                },
                redirect: 'if_required', // Only redirect if 3D Secure is required
            });

            if (submitError) {
                // Payment failed
                console.error('[Payment] Error:', submitError);
                setError(submitError.message || 'Errore durante il pagamento');
                setPaymentStatus('failed');
                onError?.(submitError.message || 'Errore durante il pagamento');
                setIsLoading(false);
                return;
            }

            if (paymentIntent) {
                if (paymentIntent.status === 'succeeded') {
                    // Payment successful
                    setPaymentStatus('succeeded');
                    setPaymentIntentId(paymentIntent.id);
                    setIsLoading(false);
                    onSuccess?.(paymentIntent.id);
                } else if (paymentIntent.status === 'processing') {
                    // Payment is processing (e.g., bank transfer)
                    setPaymentStatus('processing');
                    setPaymentIntentId(paymentIntent.id);
                    // Keep loading state - user will be notified via webhook
                } else if (paymentIntent.status === 'requires_action') {
                    // 3D Secure or other action required
                    // Stripe will handle the redirect automatically
                    setPaymentStatus('processing');
                } else {
                    // Other status (requires_payment_method, etc.)
                    setError('Il pagamento non è stato completato. Riprova.');
                    setPaymentStatus('failed');
                    setIsLoading(false);
                }
            }
        } catch (err: any) {
            console.error('[Payment] Unexpected error:', err);
            setError(err.message || 'Errore imprevisto durante il pagamento');
            setPaymentStatus('failed');
            setIsLoading(false);
            onError?.(err.message || 'Errore imprevisto durante il pagamento');
        }
    };

    // Show success state
    if (paymentStatus === 'succeeded') {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Pagamento completato!</h3>
                <p className="text-gray-600 text-center">
                    Il tuo pagamento di {formattedAmount} è stato elaborato con successo.
                </p>
                {paymentIntentId && (
                    <p className="text-sm text-gray-500">
                        ID transazione: {paymentIntentId}
                    </p>
                )}
            </div>
        );
    }

    // Show processing state
    if (paymentStatus === 'processing') {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                <h3 className="text-xl font-semibold text-gray-900">Elaborazione pagamento...</h3>
                <p className="text-gray-600 text-center">
                    Il tuo pagamento di {formattedAmount} è in elaborazione.
                    <br />
                    Riceverai una conferma via email una volta completato.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Payment Element */}
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <PaymentElement
                    options={{
                        layout: 'tabs',
                    }}
                />
            </div>

            {/* Error Display */}
            {error && (
                <div className="flex items-start space-x-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-red-800">Errore</p>
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                disabled={!stripe || !elements || isLoading}
                className="w-full"
            >
                {isLoading ? (
                    <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Elaborazione...
                    </>
                ) : (
                    `Paga ${formattedAmount}`
                )}
            </Button>

            {/* Security Notice */}
            <p className="text-xs text-gray-500 text-center">
                I tuoi dati di pagamento sono protetti e crittografati. Non memorizziamo le informazioni della carta.
            </p>
        </form>
    );
};



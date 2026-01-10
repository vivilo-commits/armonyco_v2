/**
 * PaymentExample Component
 * 
 * Example usage of PaymentContainer with PaymentElement
 * This demonstrates how to integrate the payment form in your app
 */

import React, { useState, useEffect } from 'react';
import { PaymentContainer } from './PaymentContainer';
import { createPaymentIntent } from '../../src/services/payment.service';
import { Loader, AlertTriangle } from '../ui/Icons';
import { Button } from '../ui/Button';

export interface PaymentExampleProps {
    amount: number; // in cents (e.g. 30428 for €304.28)
    email: string;
    userId?: string;
    metadata?: Record<string, string>;
    onSuccess?: (paymentIntentId: string) => void;
    onError?: (error: string) => void;
}

export const PaymentExample: React.FC<PaymentExampleProps> = ({
    amount,
    email,
    userId,
    metadata = {},
    onSuccess,
    onError,
}) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

    // Initialize payment intent on mount
    useEffect(() => {
        const initializePayment = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const result = await createPaymentIntent({
                    amount,
                    currency: 'eur',
                    email,
                    userId,
                    metadata: {
                        ...metadata,
                        source: 'web_app',
                    },
                    description: `Payment for ${email}`,
                });

                setClientSecret(result.clientSecret);
                setPaymentIntentId(result.paymentIntentId);
                console.log('[PaymentExample] Payment intent created:', result.paymentIntentId);
            } catch (err: any) {
                console.error('[PaymentExample] Error initializing payment:', err);
                setError(err.message || 'Error initializing payment');
                onError?.(err.message || 'Error initializing payment');
            } finally {
                setIsLoading(false);
            }
        };

        if (amount > 0 && email) {
            initializePayment();
        } else {
            setError('Importo o email non validi');
            setIsLoading(false);
        }
    }, [amount, email, userId, metadata, onError]);

    const handlePaymentSuccess = (paymentIntentId: string) => {
        console.log('[PaymentExample] Payment succeeded:', paymentIntentId);
        onSuccess?.(paymentIntentId);
    };

    const handlePaymentError = (errorMessage: string) => {
        console.error('[PaymentExample] Payment error:', errorMessage);
        setError(errorMessage);
        onError?.(errorMessage);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
                <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-gray-600">Inizializzazione pagamento...</p>
            </div>
        );
    }

    // Error state
    if (error && !clientSecret) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-red-800">Error</h3>
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                    </div>
                </div>
                <Button
                    onClick={() => window.location.reload()}
                    className="mt-4"
                    variant="outline"
                >
                    Riprova
                </Button>
            </div>
        );
    }

    // Payment form
    if (clientSecret) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Completa il pagamento</h2>
                    <p className="text-gray-600">
                        Inserisci i dati della tua carta per completare l'acquisto.
                    </p>
                </div>

                <PaymentContainer
                    clientSecret={clientSecret}
                    amount={amount}
                    currency="eur"
                    metadata={{
                        ...metadata,
                        email,
                        userId: userId || '',
                    }}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                />
            </div>
        );
    }

    return null;
};



/**
 * PaymentContainer Component
 * 
 * Wrapper that provides Stripe Elements context
 * Use this component to wrap PaymentForm
 */

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '../../src/services/payment.service';
import { PaymentForm, PaymentFormProps } from './PaymentForm';

export interface PaymentContainerProps extends Omit<PaymentFormProps, 'clientSecret'> {
    clientSecret: string;
    stripePublicKey?: string;
}

export const PaymentContainer: React.FC<PaymentContainerProps> = ({
    clientSecret,
    stripePublicKey,
    ...paymentFormProps
}) => {
    const stripePromise = getStripe();

    // Check if Stripe is configured
    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-600">
                    Stripe non è configurato correttamente.
                    <br />
                    Verifica che VITE_STRIPE_PUBLIC_KEY sia impostato nelle variabili d'ambiente.
                </p>
            </div>
        );
    }

    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
                appearance: {
                    theme: 'stripe',
                    variables: {
                        colorPrimary: '#2563eb',
                        colorBackground: '#ffffff',
                        colorText: '#1f2937',
                        colorDanger: '#ef4444',
                        fontFamily: 'system-ui, sans-serif',
                        spacingUnit: '4px',
                        borderRadius: '8px',
                    },
                },
            }}
        >
            <PaymentForm clientSecret={clientSecret} {...paymentFormProps} />
        </Elements>
    );
};


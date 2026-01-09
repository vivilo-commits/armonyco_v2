/**
 * PAYMENT SERVICE
 * Stripe integration for payment management
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get Stripe instance (singleton)
 */
export function getStripe(): Promise<Stripe | null> {
    if (!stripePromise) {
        if (!STRIPE_PUBLIC_KEY) {
            console.error('[Stripe] Public key not configured');
            return Promise.resolve(null);
        }
        stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
    }
    return stripePromise;
}

// ============================================================================
// STRIPE CHECKOUT SESSION
// ============================================================================

export interface CheckoutSessionData {
    planId: number;
    planName: string;
    amount: number; // in cents (e.g. 24900 for €249/month)
    credits: number; // Plan credits (tokens = credits × 100)
    email: string;
    userId?: string; // User ID per linking con Stripe Customer
    metadata: {
        firstName: string;
        lastName: string;
        businessName: string;
        vatNumber: string;
        [key: string]: any;
    };
}

export interface CheckoutSessionResponse {
    sessionId: string;
    url: string;
    customerId?: string; // Stripe Customer ID
    mode?: 'subscription' | 'payment'; // Tipo di checkout
}

/**
 * Creates a Stripe Checkout session for SUBSCRIPTION
 * NOTE: This function must call a backend endpoint
 */
export async function createCheckoutSession(data: CheckoutSessionData): Promise<CheckoutSessionResponse> {
    try {
        // Determine backend URL
        // In local development, use VITE_API_URL if configured, otherwise use window.location.origin
        // NOTE: APIs only work with `vercel dev` or when deployed on Vercel
        const backendUrl = import.meta.env.VITE_API_URL || window.location.origin;
        const endpoint = `${backendUrl}/api/stripe/create-checkout`;

        console.log('[Payment] Creating checkout session:', {
            endpoint,
            backendUrl,
            hasViteApiUrl: !!import.meta.env.VITE_API_URL,
            planId: data.planId,
            planName: data.planName,
            amount: data.amount,
        });

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                planId: data.planId,
                planName: data.planName,
                amount: data.amount,
                credits: data.credits,
                email: data.email,
                userId: data.userId, // Important for linking subscription
                metadata: data.metadata,
                successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${window.location.origin}/payment/cancel`,
            }),
        });

        console.log('[Payment] Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ 
                error: 'Unknown error',
                message: `HTTP ${response.status}: ${response.statusText}` 
            }));
            
            console.error('[Payment] API Error:', errorData);
            
            // Clearer error message for 404
            if (response.status === 404) {
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                if (isLocalhost && !import.meta.env.VITE_API_URL) {
                    throw new Error(
                        'API endpoint not found (404). ' +
                        'In local development, use `vercel dev` instead of `npm run dev` to run APIs, ' +
                        'or configure VITE_API_URL in .env.local to point to a Vercel deployment.'
                    );
                } else {
                    throw new Error(
                        `API endpoint not found (404): ${endpoint}. ` +
                        'Verify that APIs are deployed on Vercel or that VITE_API_URL is configured correctly.'
                    );
                }
            }
            
            throw new Error(errorData.message || errorData.error || 'Error creating payment session');
        }

        const result = await response.json();
        console.log('[Payment] Checkout session created:', {
            sessionId: result.sessionId,
            hasUrl: !!result.url,
            mode: result.mode || 'subscription',
        });

        if (!result.sessionId) {
            throw new Error('Session ID not received from server');
        }

        if (!result.url) {
            throw new Error('Checkout URL not available from server');
        }

        return {
            sessionId: result.sessionId || result.id,
            url: result.url,
            customerId: result.customerId,
            mode: result.mode || 'subscription',
        };
    } catch (error: any) {
        console.error('[Payment] ❌ Error creating checkout session:', error);
        console.error('[Payment] Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
        });
        throw new Error(error.message || 'Unable to start payment. Check configuration.');
    }
}

/**
 * Redirects to Stripe Checkout using the checkout session URL
 * NOTE: stripe.redirectToCheckout() is deprecated, use direct URL redirect instead
 */
export async function redirectToCheckout(checkoutUrl: string): Promise<void> {
    console.log('[Payment] Redirecting to Stripe Checkout URL');
    
    if (!checkoutUrl) {
        throw new Error('Checkout URL is required');
    }

    try {
        // Direct redirect to Stripe Checkout URL (replaces deprecated stripe.redirectToCheckout())
        window.location.href = checkoutUrl;
        
        console.log('[Payment] ✅ Redirect started successfully');
    } catch (error: any) {
        console.error('[Payment] ❌ Error during redirect:', error);
        throw error;
    }
}

/**
 * Creates session and redirects in a single step
 */
export async function initiatePayment(data: CheckoutSessionData): Promise<void> {
    try {
        console.log('[Payment] 🚀 Initiating payment flow...');
        
        // Create session
        console.log('[Payment] Step 1: Creating checkout session...');
        const session = await createCheckoutSession(data);
        
        if (!session.sessionId) {
            throw new Error('Session ID not available after creation');
        }

        console.log('[Payment] Step 2: Redirecting to Stripe Checkout...');
        
        // Redirect to Stripe Checkout using the URL directly
        if (!session.url) {
            throw new Error('Checkout URL not available');
        }
        
        await redirectToCheckout(session.url);
        
        // If we get here without errors, redirect is in progress
        // User will be taken to Stripe
        console.log('[Payment] ✅ Payment flow initiated successfully');
    } catch (error: any) {
        console.error('[Payment] ❌ Error starting payment:', error);
        console.error('[Payment] Error stack:', error.stack);
        throw error;
    }
}

// ============================================================================
// PAYMENT VERIFICATION
// ============================================================================

export interface PaymentStatus {
    status: 'success' | 'processing' | 'failed' | 'cancelled';
    paymentIntentId?: string;
    amount?: number;
    metadata?: any;
    error?: string;
}

/**
 * Verifies payment status via session ID
 */
export async function verifyPaymentStatus(sessionId: string): Promise<PaymentStatus> {
    try {
        const backendUrl = import.meta.env.VITE_API_URL || window.location.origin;
        const endpoint = `${backendUrl}/api/stripe/verify-payment`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Payment verification error');
        }

        const result = await response.json();
        
        if (result.verified) {
            return {
                status: 'success',
                paymentIntentId: result.paymentIntentId,
                amount: result.amountTotal,
                metadata: result.metadata,
            };
        } else {
            return {
                status: 'failed',
                error: result.message || 'Payment not verified',
            };
        }
    } catch (error: any) {
        console.error('[Payment] Error verifying status:', error);
        return {
            status: 'failed',
            error: error.message || 'Unable to verify payment status',
        };
    }
}

// ============================================================================
// MOCK PAYMENT (per sviluppo senza backend)
// ============================================================================

/**
 * Simulates a subscription for testing (DO NOT use in production)
 */
export async function mockPayment(data: CheckoutSessionData): Promise<{ success: boolean; sessionId: string; customerId: string }> {
    console.warn('[Payment] Using MOCK subscription - development only!');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const sessionId = `mock_session_${Date.now()}`;
            const customerId = `cus_mock_${Math.random().toString(36).substring(7)}`;
            
            // Save mock data in localStorage to simulate callback
            localStorage.setItem('mock_payment_data', JSON.stringify({
                sessionId,
                customerId,
                status: 'success',
                mode: 'subscription',
                tokens: data.credits * 100,
                ...data,
            }));
            
            resolve({ success: true, sessionId, customerId });
        }, 1000);
    });
}

/**
 * Simulates redirect to success page (for mock)
 */
export async function mockPaymentFlow(data: CheckoutSessionData): Promise<void> {
    const result = await mockPayment(data);
    
    if (result.success) {
        // Simulate redirect to success page
        const successUrl = `/registration/success?session_id=${result.sessionId}`;
        window.location.href = successUrl;
    }
}

// ============================================================================
// PRICE CALCULATION
// ============================================================================

export interface PriceBreakdown {
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    total: number;
}

/**
 * Calculates price breakdown with Italian VAT (22%)
 */
export function calculatePriceBreakdown(amount: number, taxRate: number = 0.22): PriceBreakdown {
    const subtotal = Math.round(amount * 100) / 100;
    const taxAmount = Math.round(subtotal * taxRate * 100) / 100;
    const total = Math.round((subtotal + taxAmount) * 100) / 100;

    return {
        subtotal,
        taxRate,
        taxAmount,
        total,
    };
}

/**
 * Calculates monthly tokens from a plan
 */
export function calculateMonthlyTokens(credits: number): number {
    return credits * 100;
}

/**
 * Formats tokens for display
 */
export function formatTokens(tokens: number): string {
    return new Intl.NumberFormat('en-US').format(tokens);
}

/**
 * Formats amount in Euros
 */
export function formatEuro(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount);
}

// ============================================================================
// PAYMENT INTENT (One-time payments with PaymentElement)
// ============================================================================

export interface PaymentIntentData {
    amount: number; // in cents
    currency?: string;
    email: string;
    userId?: string;
    metadata?: Record<string, string>;
    description?: string;
}

export interface PaymentIntentResponse {
    clientSecret: string;
    paymentIntentId: string;
    customerId: string;
    amount: number;
    currency: string;
    status: string;
}

/**
 * Creates a Stripe Payment Intent for one-time payments
 * Returns client secret for use with PaymentElement
 */
export async function createPaymentIntent(data: PaymentIntentData): Promise<PaymentIntentResponse> {
    try {
        const backendUrl = import.meta.env.VITE_API_URL || window.location.origin;
        const endpoint = `${backendUrl}/api/checkout/create-payment-intent`;

        console.log('[Payment] Creating payment intent:', {
            endpoint,
            amount: data.amount,
            email: data.email,
        });

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: data.amount,
                currency: data.currency || 'eur',
                email: data.email,
                userId: data.userId,
                metadata: data.metadata || {},
                description: data.description,
            }),
        });

        console.log('[Payment] Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ 
                error: 'Unknown error',
                message: `HTTP ${response.status}: ${response.statusText}` 
            }));
            
            console.error('[Payment] API Error:', errorData);
            
            if (response.status === 404) {
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                if (isLocalhost && !import.meta.env.VITE_API_URL) {
                    throw new Error(
                        'API endpoint not found (404). ' +
                        'In local development, use `vercel dev` instead of `npm run dev` to run APIs, ' +
                        'or configure VITE_API_URL in .env.local to point to a Vercel deployment.'
                    );
                } else {
                    throw new Error(
                        `API endpoint not found (404): ${endpoint}. ` +
                        'Verify that APIs are deployed on Vercel or that VITE_API_URL is configured correctly.'
                    );
                }
            }
            
            throw new Error(errorData.message || errorData.error || 'Error creating payment intent');
        }

        const result = await response.json();
        console.log('[Payment] Payment intent created:', {
            paymentIntentId: result.paymentIntentId,
            hasClientSecret: !!result.clientSecret,
        });

        if (!result.clientSecret) {
            throw new Error('Client secret not received from server');
        }

        return {
            clientSecret: result.clientSecret,
            paymentIntentId: result.paymentIntentId,
            customerId: result.customerId,
            amount: result.amount,
            currency: result.currency,
            status: result.status,
        };
    } catch (error: any) {
        console.error('[Payment] ❌ Error creating payment intent:', error);
        throw new Error(error.message || 'Unable to initialize payment. Check configuration.');
    }
}

/**
 * Retrieves payment intent status
 */
export async function getPaymentIntentStatus(paymentIntentId: string): Promise<{
    status: string;
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
}> {
    try {
        const backendUrl = import.meta.env.VITE_API_URL || window.location.origin;
        const endpoint = `${backendUrl}/api/stripe/payment-intent/${paymentIntentId}`;

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to retrieve payment intent status');
        }

        return await response.json();
    } catch (error: any) {
        console.error('[Payment] Error retrieving payment intent status:', error);
        throw error;
    }
}

// ============================================================================
// EXPORT SERVICE
// ============================================================================

export const paymentService = {
    getStripe,
    createCheckoutSession,
    redirectToCheckout,
    initiatePayment,
    verifyPaymentStatus,
    createPaymentIntent,
    getPaymentIntentStatus,
    mockPayment,
    mockPaymentFlow,
    calculatePriceBreakdown,
    calculateMonthlyTokens,
    formatEuro,
    formatTokens,
};


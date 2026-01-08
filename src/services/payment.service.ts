/**
 * PAYMENT SERVICE
 * Integrazione con Stripe per gestione pagamenti
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Ottieni istanza Stripe (singleton)
 */
export function getStripe(): Promise<Stripe | null> {
    if (!stripePromise) {
        if (!STRIPE_PUBLIC_KEY) {
            console.error('[Stripe] Public key non configurata');
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
    amount: number; // in centesimi (es. 24900 per €249/mese)
    credits: number; // Credits del piano (tokens = credits × 100)
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
 * Crea una sessione Stripe Checkout per SUBSCRIPTION
 * NOTA: Questa funzione deve chiamare un backend endpoint
 */
export async function createCheckoutSession(data: CheckoutSessionData): Promise<CheckoutSessionResponse> {
    try {
        // Determina URL backend
        // In sviluppo locale, usa VITE_API_URL se configurato, altrimenti usa window.location.origin
        // NOTA: Le API funzionano solo con `vercel dev` o quando deployate su Vercel
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
                userId: data.userId, // Importante per linking subscription
                metadata: data.metadata,
                successUrl: `${window.location.origin}/registration/success?session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${window.location.origin}/registration?step=4&error=payment_cancelled`,
            }),
        });

        console.log('[Payment] Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ 
                error: 'Errore sconosciuto',
                message: `HTTP ${response.status}: ${response.statusText}` 
            }));
            
            console.error('[Payment] API Error:', errorData);
            
            // Messaggio di errore più chiaro per 404
            if (response.status === 404) {
                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                if (isLocalhost && !import.meta.env.VITE_API_URL) {
                    throw new Error(
                        'Endpoint API non trovato (404). ' +
                        'In sviluppo locale, usa `vercel dev` invece di `npm run dev` per far girare le API, ' +
                        'oppure configura VITE_API_URL nel file .env.local per puntare a un deployment Vercel.'
                    );
                } else {
                    throw new Error(
                        `Endpoint API non trovato (404): ${endpoint}. ` +
                        'Verifica che le API siano deployate su Vercel o che VITE_API_URL sia configurato correttamente.'
                    );
                }
            }
            
            throw new Error(errorData.message || errorData.error || 'Errore creazione sessione pagamento');
        }

        const result = await response.json();
        console.log('[Payment] Checkout session created:', {
            sessionId: result.sessionId,
            hasUrl: !!result.url,
            mode: result.mode || 'subscription',
        });

        if (!result.sessionId) {
            throw new Error('Session ID non ricevuto dal server');
        }

        if (!result.url) {
            throw new Error('URL di checkout non disponibile dal server');
        }

        return {
            sessionId: result.sessionId || result.id,
            url: result.url,
            customerId: result.customerId,
            mode: result.mode || 'subscription',
        };
    } catch (error: any) {
        console.error('[Payment] ❌ Errore creazione checkout session:', error);
        console.error('[Payment] Error details:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
        });
        throw new Error(error.message || 'Impossibile avviare il pagamento. Verifica la configurazione.');
    }
}

/**
 * Reindirizza a Stripe Checkout
 */
export async function redirectToCheckout(sessionId: string): Promise<void> {
    console.log('[Payment] Redirecting to Stripe Checkout, session:', sessionId);
    
    // Verifica che Stripe sia configurato
    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
        throw new Error(
            'Stripe non è configurato. Configura VITE_STRIPE_PUBLIC_KEY nel file .env.local'
        );
    }
    
    const stripe = await getStripe();
    
    if (!stripe) {
        console.error('[Payment] ❌ Stripe non inizializzato');
        throw new Error('Stripe non configurato correttamente. Verifica VITE_STRIPE_PUBLIC_KEY.');
    }

    console.log('[Payment] Stripe instance loaded, redirecting...');

    try {
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
            console.error('[Stripe] ❌ Errore redirect:', error);
            throw new Error(error.message || 'Errore reindirizzamento a Stripe');
        }

        console.log('[Payment] ✅ Redirect avviato con successo');
    } catch (error: any) {
        console.error('[Payment] ❌ Errore durante redirect:', error);
        throw error;
    }
}

/**
 * Crea sessione e reindirizza in un unico step
 */
export async function initiatePayment(data: CheckoutSessionData): Promise<void> {
    try {
        console.log('[Payment] 🚀 Initiating payment flow...');
        
        // Crea sessione
        console.log('[Payment] Step 1: Creating checkout session...');
        const session = await createCheckoutSession(data);
        
        if (!session.sessionId) {
            throw new Error('Session ID non disponibile dopo la creazione');
        }

        console.log('[Payment] Step 2: Redirecting to Stripe Checkout...');
        
        // Reindirizza a Stripe Checkout
        await redirectToCheckout(session.sessionId);
        
        // Se arriviamo qui senza errori, il redirect è in corso
        // L'utente verrà portato su Stripe
        console.log('[Payment] ✅ Payment flow initiated successfully');
    } catch (error: any) {
        console.error('[Payment] ❌ Errore avvio pagamento:', error);
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
 * Verifica lo stato di un pagamento tramite session ID
 */
export async function verifyPaymentStatus(sessionId: string): Promise<PaymentStatus> {
    try {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const endpoint = `${backendUrl}/api/stripe/verify-payment`;

        const response = await fetch(`${endpoint}?session_id=${sessionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Errore verifica pagamento');
        }

        const result = await response.json();
        
        return {
            status: result.status || 'failed',
            paymentIntentId: result.paymentIntentId,
            amount: result.amount,
            metadata: result.metadata,
        };
    } catch (error: any) {
        console.error('[Payment] Errore verifica stato:', error);
        return {
            status: 'failed',
            error: error.message || 'Impossibile verificare lo stato del pagamento',
        };
    }
}

// ============================================================================
// MOCK PAYMENT (per sviluppo senza backend)
// ============================================================================

/**
 * Simula un abbonamento per testing (NON usare in produzione)
 */
export async function mockPayment(data: CheckoutSessionData): Promise<{ success: boolean; sessionId: string; customerId: string }> {
    console.warn('[Payment] Usando MOCK subscription - solo per sviluppo!');
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const sessionId = `mock_session_${Date.now()}`;
            const customerId = `cus_mock_${Math.random().toString(36).substring(7)}`;
            
            // Salva dati mock in localStorage per simulare callback
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
 * Simula redirect a pagina successo (per mock)
 */
export async function mockPaymentFlow(data: CheckoutSessionData): Promise<void> {
    const result = await mockPayment(data);
    
    if (result.success) {
        // Simula redirect a success page
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
 * Calcola il breakdown del prezzo con IVA italiana (22%)
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
 * Calcola i tokens mensili da un piano
 */
export function calculateMonthlyTokens(credits: number): number {
    return credits * 100;
}

/**
 * Formatta i tokens per display
 */
export function formatTokens(tokens: number): string {
    return new Intl.NumberFormat('it-IT').format(tokens);
}

/**
 * Formatta importo in Euro
 */
export function formatEuro(amount: number): string {
    return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount);
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
    mockPayment,
    mockPaymentFlow,
    calculatePriceBreakdown,
    calculateMonthlyTokens,
    formatEuro,
    formatTokens,
};


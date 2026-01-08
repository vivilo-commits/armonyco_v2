/**
 * Vercel Serverless Function
 * Crea una sessione Stripe Checkout per ABBONAMENTI RICORRENTI
 * 
 * IMPORTANTE: Mode cambiato da 'payment' a 'subscription'
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// IMPORTANTE: Installare con npm install stripe
import Stripe from 'stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { 
            planId, 
            planName, 
            amount,      // Prezzo mensile in centesimi (es. 24900 per €249)
            credits,     // Credits del piano (tokens = credits × 100)
            email, 
            userId,      // User ID per linking
            metadata,    // Metadati aggiuntivi
            successUrl, 
            cancelUrl 
        } = req.body;

        // Validazione input
        if (!planId || !amount || !email) {
            return res.status(400).json({ error: 'Missing required fields: planId, amount, email' });
        }

        // Verifica che Stripe sia configurato
        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(500).json({ 
                error: 'Stripe non configurato',
                message: 'STRIPE_SECRET_KEY non trovata nelle variabili ambiente. Configura Stripe su Vercel.'
            });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2024-11-20.acacia',
        });

        // ================================================================
        // STEP 1: Crea o recupera Stripe Customer
        // ================================================================
        
        // Cerca se esiste già un customer con questa email
        const existingCustomers = await stripe.customers.list({
            email: email,
            limit: 1,
        });

        let customer;
        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
            console.log('[Stripe] Customer esistente trovato:', customer.id);
        } else {
            // Crea nuovo customer
            customer = await stripe.customers.create({
                email: email,
                metadata: {
                    user_id: userId || '',
                    ...metadata,
                },
            });
            console.log('[Stripe] Nuovo customer creato:', customer.id);
        }

        // ================================================================
        // STEP 2: Crea sessione Stripe Checkout SUBSCRIPTION
        // ================================================================

        // NOTA: Devi creare i Price IDs nel dashboard Stripe e configurarli come variabili ambiente
        const STRIPE_PRICE_IDS: Record<number, string> = {
            1: process.env.STRIPE_PRICE_STARTER || '',  // Piano STARTER
            2: process.env.STRIPE_PRICE_PRO || '',      // Piano PRO
            3: process.env.STRIPE_PRICE_ELITE || '',   // Piano ELITE
        };

        const priceId = STRIPE_PRICE_IDS[planId];
        
        if (!priceId) {
            const envVarName = planId === 1 ? 'STRIPE_PRICE_STARTER' : 
                              planId === 2 ? 'STRIPE_PRICE_PRO' : 
                              planId === 3 ? 'STRIPE_PRICE_ELITE' : 'STRIPE_PRICE_*';
            
            return res.status(400).json({ 
                error: 'Price ID non configurato',
                message: `Il Price ID per il piano ${planId} non è configurato. Configura ${envVarName} nelle variabili ambiente su Vercel.`
            });
        }
        
        // Verifica che il Price ID abbia il formato corretto
        if (!priceId.startsWith('price_')) {
            return res.status(400).json({ 
                error: 'Price ID non valido',
                message: `Il Price ID "${priceId}" non ha il formato corretto. Deve iniziare con "price_".`
            });
        }

        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,  // Usa Price ID invece di price_data
                    quantity: 1,
                },
            ],
            mode: 'subscription',  // CAMBIATO DA 'payment' A 'subscription'
            success_url: successUrl,
            cancel_url: cancelUrl,
            
            // Metadati per webhook
            subscription_data: {
                metadata: {
                    plan_id: planId.toString(),
                    plan_name: planName,
                    credits: credits.toString(),
                    user_id: userId || '',
                },
            },
            
            metadata: {
                plan_id: planId.toString(),
                plan_name: planName,
                credits: credits.toString(),
                user_id: userId || '',
            },

            // Permetti promo codes
            allow_promotion_codes: true,
            
            // Raccogli indirizzo fiscale
            billing_address_collection: 'required',
            
            // Tax ID collection per fatturazione italiana
            tax_id_collection: {
                enabled: true,
            },
        });

        console.log('[Stripe] Subscription session creata:', session.id);

        return res.status(200).json({
            sessionId: session.id,
            url: session.url,
            customerId: customer.id,
            mode: 'subscription',
        });
    } catch (error: any) {
        console.error('[API] Error creating checkout session:', error);
        return res.status(500).json({ 
            error: 'Failed to create checkout session',
            message: error.message 
        });
    }
}


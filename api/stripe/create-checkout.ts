/**
 * Vercel Serverless Function
 * Creates a Stripe Checkout session for RECURRING SUBSCRIPTIONS
 * 
 * IMPORTANT: Mode changed from 'payment' to 'subscription'
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// IMPORTANT: Install with npm install stripe
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
            amount,      // Monthly price in cents (e.g. 24900 for €249)
            credits,     // Plan credits (tokens = credits × 100)
            email, 
            userId,      // User ID for linking
            metadata,    // Additional metadata
            successUrl, 
            cancelUrl 
        } = req.body;

        // Input validation
        if (!planId || !amount || !email) {
            return res.status(400).json({ error: 'Missing required fields: planId, amount, email' });
        }

        // Verify Stripe is configured
        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('[API] ❌ STRIPE_SECRET_KEY not configured');
            return res.status(500).json({ 
                error: 'Stripe not configured',
                message: 'STRIPE_SECRET_KEY not found in environment variables. Configure Stripe in Vercel Dashboard → Settings → Environment Variables.',
                hint: 'See CONFIGURAZIONE_VERCEL.md for instructions'
            });
        }
        
        console.log('[API] ✅ Stripe configured, creating session...');

        let stripe: Stripe;
        try {
            stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
                apiVersion: '2025-02-24.acacia',
            });
            console.log('[API] ✅ Stripe client initialized');
        } catch (stripeError: any) {
            console.error('[API] ❌ Stripe initialization error:', stripeError);
            return res.status(500).json({ 
                error: 'Stripe initialization error',
                message: stripeError.message || 'Unable to initialize Stripe. Verify STRIPE_SECRET_KEY.'
            });
        }

        // ================================================================
        // STEP 1: Create or retrieve Stripe Customer
        // ================================================================
        
        // Check if customer already exists with this email
        const existingCustomers = await stripe.customers.list({
            email: email,
            limit: 1,
        });

        let customer;
        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
            console.log('[Stripe] Existing customer found:', customer.id);
        } else {
            // Create new customer
            customer = await stripe.customers.create({
                email: email,
                metadata: {
                    user_id: userId || '',
                    ...metadata,
                },
            });
            console.log('[Stripe] New customer created:', customer.id);
        }

        // ================================================================
        // STEP 2: Create Stripe Checkout SUBSCRIPTION session
        // ================================================================

        // NOTE: You must create Price IDs in Stripe dashboard and configure them as environment variables
        const STRIPE_PRICE_IDS: Record<number, string> = {
            1: process.env.STRIPE_PRICE_STARTER || '',  // STARTER plan
            2: process.env.STRIPE_PRICE_PRO || '',      // PRO plan
            3: process.env.STRIPE_PRICE_ELITE || '',   // ELITE plan
        };

        const priceId = STRIPE_PRICE_IDS[planId];
        
        if (!priceId) {
            const envVarName = planId === 1 ? 'STRIPE_PRICE_STARTER' : 
                              planId === 2 ? 'STRIPE_PRICE_PRO' : 
                              planId === 3 ? 'STRIPE_PRICE_ELITE' : 'STRIPE_PRICE_*';
            
            return res.status(400).json({ 
                error: 'Price ID not configured',
                message: `Price ID for plan ${planId} is not configured. Set ${envVarName} in Vercel environment variables.`
            });
        }
        
        // Verify Price ID format
        if (!priceId.startsWith('price_')) {
            return res.status(400).json({ 
                error: 'Invalid Price ID',
                message: `Price ID "${priceId}" has invalid format. Must start with "price_".`
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
            mode: 'subscription',  // CHANGED FROM 'payment' TO 'subscription'
            success_url: successUrl,
            cancel_url: cancelUrl,
            
            // Metadata for webhook
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

            // Allow promo codes
            allow_promotion_codes: true,
            
            // Collect billing address
            billing_address_collection: 'required',
            
            // Tax ID collection for Italian billing
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
        console.error('[API] ❌ Error creating checkout session:', error);
        console.error('[API] Error type:', error.type);
        console.error('[API] Error code:', error.code);
        console.error('[API] Error message:', error.message);
        console.error('[API] Error stack:', error.stack);
        
        // Handle specific Stripe errors
        if (error.type === 'StripeInvalidRequestError') {
            return res.status(400).json({ 
                error: 'Stripe request error',
                message: error.message || 'Invalid request to Stripe',
                details: error.raw?.message
            });
        }
        
        if (error.type === 'StripeAuthenticationError') {
            return res.status(401).json({ 
                error: 'Stripe authentication error',
                message: 'STRIPE_SECRET_KEY is invalid. Verify the key in Vercel.'
            });
        }
        
        if (error.type === 'StripeAPIError') {
            return res.status(502).json({ 
                error: 'Stripe API error',
                message: error.message || 'Error communicating with Stripe'
            });
        }
        
        // Generic error
        return res.status(500).json({ 
            error: 'Failed to create checkout session',
            message: error.message || 'Unknown error while creating session',
            type: error.type || 'UnknownError',
            hint: 'Check logs in Vercel Dashboard → Functions for more details'
        });
    }
}


/**
 * Vercel Serverless Function
 * Verifica lo stato di un pagamento Stripe
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// IMPORTANTE: Installare con npm install stripe
// import Stripe from 'stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { session_id } = req.query;

        if (!session_id || typeof session_id !== 'string') {
            return res.status(400).json({ error: 'Missing session_id parameter' });
        }

        // IMPORTANTE: Decommentare quando hai configurato Stripe
        /*
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2023-10-16',
        });

        // Recupera sessione Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['payment_intent'],
        });

        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const paymentIntent = session.payment_intent as any;

        return res.status(200).json({
            status: session.payment_status === 'paid' ? 'success' : session.payment_status,
            paymentIntentId: paymentIntent?.id,
            amount: session.amount_total,
            metadata: session.metadata,
        });
        */

        // MOCK RESPONSE per sviluppo
        console.log('[API] Verifying mock payment for session:', session_id);
        
        // If it's a mock session, return success
        if (session_id.startsWith('mock_session_') || session_id.startsWith('cs_test_')) {
            return res.status(200).json({
                status: 'success',
                paymentIntentId: `pi_mock_${Date.now()}`,
                amount: 30428, // Mock amount con IVA
                metadata: {
                    planId: '1',
                    credits: '25000',
                },
                message: 'MOCK: Payment verified successfully',
            });
        }

        return res.status(404).json({ error: 'Session not found' });
    } catch (error: any) {
        console.error('[API] Error verifying payment:', error);
        return res.status(500).json({ 
            error: 'Failed to verify payment',
            message: error.message 
        });
    }
}


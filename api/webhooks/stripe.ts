/**
 * Vercel Serverless Function
 * Gestisce webhook Stripe per ABBONAMENTI RICORRENTI
 * 
 * Eventi gestiti:
 * - customer.subscription.created: Prima sottoscrizione
 * - invoice.payment_succeeded: Rinnovo mensile
 * - customer.subscription.updated: Cambio piano
 * - customer.subscription.deleted: Cancellazione
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// IMPORTANTE: Installare con npm install stripe @supabase/supabase-js
// import Stripe from 'stripe';

// ============================================================================
// HELPER: Inizializza Supabase con service_role per scrivere tokens
// ============================================================================
function getSupabaseClient() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase credentials');
    }

    return createClient(supabaseUrl, supabaseServiceKey);
}

// ============================================================================
// HELPER: Mapping Plan ID ai credits
// ============================================================================
const PLAN_CREDITS: Record<number, { credits: number; name: string }> = {
    1: { credits: 25000, name: 'STARTER' },   // 2,500,000 tokens
    2: { credits: 100000, name: 'PRO' },      // 10,000,000 tokens
    3: { credits: 250000, name: 'ELITE' },    // 25,000,000 tokens
};

// ============================================================================
// HELPER: Aggiungi tokens all'utente
// ============================================================================
async function addTokensToUser(
    userId: string,
    credits: number,
    transactionType: string,
    description: string,
    referenceId?: string
): Promise<boolean> {
    const supabase = getSupabaseClient();
    const tokens = credits * 100; // Formula: tokens = credits × 100

    try {
        // Ottieni saldo corrente
        const { data: currentData } = await supabase
            .from('user_tokens')
            .select('tokens')
            .eq('user_id', userId)
            .single();

        const balanceBefore = currentData?.tokens || 0;
        const balanceAfter = balanceBefore + tokens;

        // Aggiorna saldo tokens
        const { error: upsertError } = await supabase
            .from('user_tokens')
            .upsert({
                user_id: userId,
                tokens: balanceAfter,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id',
            });

        if (upsertError) {
            console.error('[Webhook] Errore aggiornamento tokens:', upsertError);
            return false;
        }

        // Registra nello storico (se tabella esiste)
        try {
            await supabase.from('token_history').insert({
                user_id: userId,
                amount: tokens,
                balance_before: balanceBefore,
                balance_after: balanceAfter,
                transaction_type: transactionType,
                description,
                reference_id: referenceId,
                metadata: { credits, tokens },
            });
        } catch (historyError) {
            console.warn('[Webhook] Storico non disponibile (opzionale)');
        }

        console.log(`[Webhook] ✅ Aggiunti ${tokens} tokens a utente ${userId} (${credits} credits)`);
        return true;
    } catch (error) {
        console.error('[Webhook] Errore addTokensToUser:', error);
        return false;
    }
}

// ============================================================================
// WEBHOOK HANDLER
// ============================================================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // IMPORTANTE: Decommentare quando hai configurato Stripe
        /*
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: '2024-11-20.acacia',
        });

        const sig = req.headers['stripe-signature'] as string;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

        if (!sig || !webhookSecret) {
            console.error('[Webhook] Missing signature or secret');
            return res.status(400).json({ error: 'Missing signature' });
        }

        // Verifica firma webhook
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                sig,
                webhookSecret
            );
        } catch (err: any) {
            console.error('[Webhook] Signature verification failed:', err.message);
            return res.status(400).json({ error: 'Invalid signature' });
        }

        console.log('[Webhook] 📩 Event received:', event.type);

        // ====================================================================
        // GESTIONE EVENTI SUBSCRIPTION
        // ====================================================================

        switch (event.type) {
            // ----------------------------------------------------------------
            // SUBSCRIPTION CREATED - Prima sottoscrizione
            // ----------------------------------------------------------------
            case 'customer.subscription.created': {
                const subscription = event.data.object as Stripe.Subscription;
                console.log('[Webhook] 🆕 Nuova subscription:', subscription.id);

                const metadata = subscription.metadata || {};
                const userId = metadata.user_id;
                const planId = parseInt(metadata.plan_id || '0');
                const credits = parseInt(metadata.credits || '0');
                const customerId = subscription.customer as string;

                if (!userId || !planId || !credits) {
                    console.error('[Webhook] ⚠️ Missing metadata in subscription');
                    break;
                }

                const supabase = getSupabaseClient();

                // Crea record subscription
                const { error: subError } = await supabase
                    .from('user_subscriptions')
                    .insert({
                        user_id: userId,
                        plan_id: planId,
                        status: 'active',
                        stripe_subscription_id: subscription.id,
                        stripe_customer_id: customerId,
                        started_at: new Date(subscription.created * 1000).toISOString(),
                        expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
                    });

                if (subError) {
                    console.error('[Webhook] ❌ Errore creazione subscription:', subError);
                    break;
                }

                // Aggiungi tokens iniziali
                const planInfo = PLAN_CREDITS[planId] || { credits, name: metadata.plan_name };
                await addTokensToUser(
                    userId,
                    credits,
                    'subscription_initial',
                    `Piano ${planInfo.name} - Sottoscrizione iniziale`,
                    subscription.id
                );

                console.log('[Webhook] ✅ Subscription creata e tokens assegnati');
                break;
            }

            // ----------------------------------------------------------------
            // INVOICE PAID - Rinnovo mensile
            // ----------------------------------------------------------------
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                console.log('[Webhook] 💰 Pagamento ricevuto:', invoice.id);

                // Verifica che sia un rinnovo subscription (non il primo pagamento)
                if (!invoice.subscription || invoice.billing_reason === 'subscription_create') {
                    console.log('[Webhook] ℹ️ Primo pagamento, tokens già assegnati in subscription.created');
                    break;
                }

                const subscriptionId = invoice.subscription as string;
                
                // Recupera subscription da Stripe per ottenere metadata
                const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                const metadata = subscription.metadata || {};
                const userId = metadata.user_id;
                const planId = parseInt(metadata.plan_id || '0');
                const credits = parseInt(metadata.credits || '0');

                if (!userId || !credits) {
                    console.error('[Webhook] ⚠️ Missing metadata in subscription');
                    break;
                }

                // Aggiungi tokens mensili (si accumulano!)
                const planInfo = PLAN_CREDITS[planId] || { credits, name: metadata.plan_name };
                await addTokensToUser(
                    userId,
                    credits,
                    'subscription_renewal',
                    `Piano ${planInfo.name} - Rinnovo mensile`,
                    invoice.id
                );

                // Aggiorna data scadenza subscription
                const supabase = getSupabaseClient();
                await supabase
                    .from('user_subscriptions')
                    .update({
                        expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
                    })
                    .eq('stripe_subscription_id', subscriptionId);

                console.log('[Webhook] ✅ Rinnovo processato, tokens aggiunti');
                break;
            }

            // ----------------------------------------------------------------
            // SUBSCRIPTION UPDATED - Cambio piano (upgrade/downgrade)
            // ----------------------------------------------------------------
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const previousAttributes = (event.data as any).previous_attributes;

                // Verifica se c'è stato un cambio di piano (price change)
                if (!previousAttributes?.items) {
                    console.log('[Webhook] ℹ️ Subscription aggiornata ma nessun cambio piano');
                    break;
                }

                console.log('[Webhook] 🔄 Cambio piano subscription:', subscription.id);

                const metadata = subscription.metadata || {};
                const userId = metadata.user_id;
                const planId = parseInt(metadata.plan_id || '0');
                const credits = parseInt(metadata.credits || '0');

                if (!userId || !credits) {
                    console.error('[Webhook] ⚠️ Missing metadata');
                    break;
                }

                const supabase = getSupabaseClient();

                // Aggiorna subscription
                await supabase
                    .from('user_subscriptions')
                    .update({
                        plan_id: planId,
                        expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
                    })
                    .eq('stripe_subscription_id', subscription.id);

                // Aggiungi tokens del nuovo piano (si mantengono quelli esistenti!)
                const planInfo = PLAN_CREDITS[planId] || { credits, name: metadata.plan_name };
                await addTokensToUser(
                    userId,
                    credits,
                    'subscription_upgrade',
                    `Cambio a piano ${planInfo.name}`,
                    subscription.id
                );

                console.log('[Webhook] ✅ Cambio piano processato');
                break;
            }

            // ----------------------------------------------------------------
            // SUBSCRIPTION DELETED - Cancellazione
            // ----------------------------------------------------------------
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                console.log('[Webhook] ❌ Subscription cancellata:', subscription.id);

                const supabase = getSupabaseClient();

                // Imposta status cancelled (NON rimuovere tokens!)
                await supabase
                    .from('user_subscriptions')
                    .update({
                        status: 'cancelled',
                    })
                    .eq('stripe_subscription_id', subscription.id);

                console.log('[Webhook] ✅ Subscription cancellata (tokens mantenuti)');
                break;
            }

            // ----------------------------------------------------------------
            // PAYMENT FAILED - Pagamento fallito
            // ----------------------------------------------------------------
            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                console.log('[Webhook] ⚠️ Pagamento fallito:', invoice.id);

                // TODO: Inviare email di notifica all'utente
                // TODO: Eventualmente sospendere l'accesso dopo X tentativi

                break;
            }

            // ----------------------------------------------------------------
            // Altri eventi
            // ----------------------------------------------------------------
            default:
                console.log('[Webhook] ℹ️ Evento non gestito:', event.type);
        }

        return res.status(200).json({ received: true });
        */

        // ====================================================================
        // MOCK RESPONSE per sviluppo (quando Stripe non è configurato)
        // ====================================================================
        console.log('[Webhook] 📩 Mock webhook received');
        const mockEvent = req.body;
        console.log('[Webhook] Mock event type:', mockEvent?.type || 'unknown');
        
        return res.status(200).json({ 
            received: true,
            message: 'MOCK: Webhook processed (Stripe not configured)' 
        });
    } catch (error: any) {
        console.error('[Webhook] ❌ Error processing webhook:', error);
        return res.status(500).json({ 
            error: 'Webhook processing failed',
            message: error.message 
        });
    }
}

// Configurazione specifica per Vercel: disabilita body parser
export const config = {
    api: {
        bodyParser: false,
    },
};


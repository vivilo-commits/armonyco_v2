/**
 * Vercel Serverless Function
 * Handles Stripe webhooks
 * 
 * Handled events:
 * - checkout.session.completed: Checkout completed (both payment and subscription)
 * - payment_intent.succeeded: One-time payment succeeded
 * - invoice.payment_succeeded: Subscription payment succeeded (renewal)
 * - invoice.payment_failed: Subscription payment failed
 * - customer.subscription.updated: Subscription updated (plan change, status change)
 * - customer.subscription.deleted: Subscription cancelled
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { addCreditsToOrganization } from '../../src/lib/credits';

// ============================================================================
// CONFIGURATION: Disable body parser to read raw body for signature validation
// ============================================================================
export const config = {
    api: {
        bodyParser: false,
    },
};

// ============================================================================
// WEBHOOK HANDLER
// ============================================================================
export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Verify Stripe is configured
        if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
            console.log('[Webhook] 📩 Mock webhook received (Stripe not configured)');
            const mockEvent = req.body;
            console.log('[Webhook] Mock event type:', mockEvent?.type || 'unknown');
            
            return res.status(200).json({ 
                received: true,
                message: 'MOCK: Webhook processed (Stripe not configured)' 
            });
        }

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-02-24.acacia',
        });

        const sig = req.headers['stripe-signature'] as string;
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

        if (!sig || !webhookSecret) {
            console.error('[Webhook] Missing signature or secret');
            return res.status(400).json({ error: 'Missing signature' });
        }

        // Get raw body for signature validation
        // In Vercel, req.body is already a Buffer when bodyParser is disabled
        const rawBody = req.body as Buffer | string;
        
        // Convert to Buffer if needed
        const bodyBuffer = Buffer.isBuffer(rawBody) 
            ? rawBody 
            : typeof rawBody === 'string' 
                ? Buffer.from(rawBody, 'utf8')
                : Buffer.from(JSON.stringify(rawBody), 'utf8');

        // Verify webhook signature
        let event: Stripe.Event;
        try {
            event = stripe.webhooks.constructEvent(
                bodyBuffer,
                sig,
                webhookSecret
            );
        } catch (err: any) {
            console.error('[Webhook] Signature verification failed:', err.message);
            return res.status(400).json({ 
                error: 'Invalid signature',
                message: err.message 
            });
        }

        console.log('[Webhook] 📩 Event received:', event.type);

        // ====================================================================
        // EVENT HANDLING
        // ====================================================================

        switch (event.type) {
            // ----------------------------------------------------------------
            // CHECKOUT SESSION COMPLETED
            // Handles both one-time payments and subscription checkouts
            // ----------------------------------------------------------------
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                console.log('[Webhook] ✅ Checkout session completed:', session.id);

                const metadata = session.metadata || {};
                const userId = metadata.user_id;
                const organizationId = metadata.organizationId;
                const planId = metadata.plan_id || metadata.planId ? parseInt(metadata.plan_id || metadata.planId) : null;
                const planName = metadata.plan_name || 'Payment';
                const credits = metadata.credits ? parseInt(metadata.credits) : null;
                const action = metadata.action; // 'upgrade', 'downgrade', or undefined for new subscriptions
                const purchaseType = metadata.type; // 'credit_purchase' for one-time credit buys

                // Log checkout completion
                console.log('[Webhook] Checkout details:', {
                    sessionId: session.id,
                    mode: session.mode,
                    customerId: session.customer,
                    userId,
                    organizationId,
                    planId,
                    planName,
                    credits,
                    action,
                    purchaseType,
                });

                // ========================================
                // CASE A: SUBSCRIPTION (new or upgrade/downgrade)
                // ========================================
                if (session.mode === 'subscription' && organizationId && planId) {
                    console.log(`[Webhook] 🔄 Processing subscription for organization:`, organizationId);
                    
                    // Initialize Supabase
                    const supabase = createClient(
                        process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
                        process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!
                    );

                    // Get plan credits from database
                    const { data: plan, error: planError } = await supabase
                        .from('subscription_plans')
                        .select('credits, name')
                        .eq('id', planId)
                        .single();

                    if (planError) {
                        console.error('[Webhook] Error fetching plan:', planError);
                        break;
                    }

                    const creditsToAdd = plan?.credits || 0;

                    console.log('[Webhook] Plan details:', {
                        planName: plan?.name,
                        creditsToAdd
                    });

                    // 1. Upsert subscription record
                    const subscriptionId = session.subscription as string;
                    
                    await supabase
                        .from('organization_subscriptions')
                        .upsert({
                            organization_id: organizationId,
                            user_id: userId,
                            plan_id: planId,
                            status: 'active',
                            stripe_customer_id: session.customer as string,
                            stripe_subscription_id: subscriptionId,
                            started_at: new Date().toISOString(),
                            expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                            updated_at: new Date().toISOString()
                        });

                    // 2. ✨ ADD CREDITS to organization
                    if (creditsToAdd > 0) {
                        await addCreditsToOrganization(organizationId, creditsToAdd, 'subscription');
                        console.log('[Webhook] ✅ Subscription credits added:', creditsToAdd);
                    }
                }

                // ========================================
                // CASE B: CREDIT PURCHASE (one-time payment)
                // ========================================
                else if (session.mode === 'payment' && purchaseType === 'credit_purchase' && organizationId && credits) {
                    console.log('[Webhook] 💰 Processing credit purchase:', {
                        organizationId,
                        creditsToAdd: credits
                    });

                    // ✨ ADD CREDITS to organization
                    await addCreditsToOrganization(organizationId, credits, 'purchase');
                    
                    console.log('[Webhook] ✅ Credits purchased and added:', credits);
                }

                // TODO: Send confirmation email to user/organization

                break;
            }

            // ----------------------------------------------------------------
            // PAYMENT INTENT SUCCEEDED
            // One-time payment successful
            // ----------------------------------------------------------------
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                console.log('[Webhook] ✅ Payment Intent succeeded:', paymentIntent.id);

                const metadata = paymentIntent.metadata || {};
                const userId = metadata.user_id;
                const credits = metadata.credits ? parseInt(metadata.credits) : null;
                const planId = metadata.plan_id ? parseInt(metadata.plan_id) : null;
                const planName = metadata.plan_name || 'One-time payment';

                console.log('[Webhook] Payment Intent details:', {
                    paymentIntentId: paymentIntent.id,
                    amount: paymentIntent.amount,
                    currency: paymentIntent.currency,
                    userId,
                    credits,
                    planId,
                    planName,
                });

                // If credits are specified in metadata, add tokens to user
                if (userId && credits) {
                    console.log('[Webhook] Adding tokens for one-time payment:', {
                        userId,
                        credits,
                        tokens: credits * 100, // Formula: tokens = credits × 100
                    });
                    
                    // TODO: Implement token addition logic here
                    // Example:
                    // await addTokensToUser(userId, credits, 'payment_one_time', planName, paymentIntent.id);
                } else {
                    console.log('[Webhook] ℹ️ Payment succeeded but no credits to assign (metadata missing)');
                }

                // TODO: Send confirmation email to user
                // TODO: Update order/payment status in database if needed

                break;
            }

            // ----------------------------------------------------------------
            // INVOICE PAYMENT SUCCEEDED
            // Subscription payment succeeded (renewal)
            // ----------------------------------------------------------------
            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                console.log('[Webhook] ✅ Invoice payment succeeded:', invoice.id);
                
                await handlePaymentSucceeded(invoice);
                break;
            }

            // ----------------------------------------------------------------
            // INVOICE PAYMENT FAILED
            // Subscription payment failed
            // ----------------------------------------------------------------
            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                console.log('[Webhook] ❌ Invoice payment failed:', invoice.id);
                
                await handlePaymentFailed(invoice);
                break;
            }

            // ----------------------------------------------------------------
            // SUBSCRIPTION UPDATED
            // Subscription status changed, plan changed, etc.
            // ----------------------------------------------------------------
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                console.log('[Webhook] 🔄 Subscription updated:', subscription.id);
                
                await handleSubscriptionUpdated(subscription);
                break;
            }

            // ----------------------------------------------------------------
            // SUBSCRIPTION DELETED
            // Subscription cancelled
            // ----------------------------------------------------------------
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                console.log('[Webhook] ❌ Subscription deleted:', subscription.id);
                
                await handleSubscriptionDeleted(subscription);
                break;
            }

            // ----------------------------------------------------------------
            // Other events (log but don't process)
            // ----------------------------------------------------------------
            default:
                console.log('[Webhook] ℹ️ Unhandled event type:', event.type);
        }

        // Always return 200 to acknowledge receipt
        return res.status(200).json({ 
            received: true,
            eventType: event.type 
        });
    } catch (error: any) {
        console.error('[Webhook] ❌ Error processing webhook:', error);
        console.error('[Webhook] Error stack:', error.stack);
        
        return res.status(500).json({ 
            error: 'Webhook processing failed',
            message: error.message 
        });
    }
}

// ============================================================================
// SUBSCRIPTION LIFECYCLE HANDLERS
// ============================================================================

/**
 * Handler for invoice.payment_succeeded event
 * Reactivates subscription and resets payment failure counter
 * 
 * MIGRATION NOTE: Now updates organization_subscriptions instead of user_subscriptions
 */
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
    console.log('[Webhook] Processing payment succeeded for invoice:', invoice.id);

    const customerId = invoice.customer as string;
    const subscriptionId = invoice.subscription as string;

    // Initialize Supabase client with service role key for RLS bypass
    const supabase = createClient(
        process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1. Get organization subscription details
    const { data: orgSub, error: fetchError } = await supabase
        .from('organization_subscriptions')
        .select('organization_id, plan_id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (fetchError) {
        console.error('[Webhook] Error fetching subscription:', fetchError);
        throw fetchError;
    }

    // 2. Update subscription: reactivate account, reset failure counter
    const { error } = await supabase
        .from('organization_subscriptions') // MIGRATED: organization-based subscriptions
        .update({
            status: 'active',
            payment_failed_count: 0,
            last_payment_attempt: new Date().toISOString(),
            expires_at: new Date(invoice.period_end! * 1000).toISOString(),
        })
        .eq('stripe_customer_id', customerId);

    if (error) {
        console.error('[Webhook] Error updating subscription after payment success:', error);
        throw error;
    }

    console.log('[Webhook] ✅ Organization subscription reactivated for customer:', customerId);

    // 3. ✨ ADD CREDITS for monthly renewal
    if (orgSub?.organization_id && orgSub?.plan_id) {
        // Get plan credits
        const { data: plan } = await supabase
            .from('subscription_plans')
            .select('credits, name')
            .eq('id', orgSub.plan_id)
            .single();

        const creditsToAdd = plan?.credits || 0;

        if (creditsToAdd > 0) {
            await addCreditsToOrganization(orgSub.organization_id, creditsToAdd, 'renewal');
            console.log('[Webhook] ✅ Monthly renewal - credits added:', {
                organizationId: orgSub.organization_id,
                creditsAdded: creditsToAdd,
                planName: plan?.name
            });
        }
    }

    // TODO: Send email notification to all organization members (payment successful, subscription renewed)
}

/**
 * Handler for invoice.payment_failed event
 * Increments failure counter and suspends account after 3 failures
 * 
 * MIGRATION NOTE: Now updates organization_subscriptions instead of user_subscriptions
 */
async function handlePaymentFailed(invoice: Stripe.Invoice) {
    console.log('[Webhook] Processing payment failure for invoice:', invoice.id);

    const customerId = invoice.customer as string;

    // Initialize Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    );

    // Retrieve current subscription
    const { data: subscription, error: fetchError } = await supabase
        .from('organization_subscriptions') // MIGRATED: organization-based subscriptions
        .select('payment_failed_count, organization_id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (fetchError) {
        console.error('[Webhook] Error fetching subscription:', fetchError);
        throw fetchError;
    }

    const failedCount = (subscription?.payment_failed_count || 0) + 1;

    // After 3 failed attempts, suspend account; otherwise mark as past_due
    const newStatus = failedCount >= 3 ? 'suspended' : 'past_due';

    const { error } = await supabase
        .from('organization_subscriptions') // MIGRATED: organization-based subscriptions
        .update({
            status: newStatus,
            payment_failed_count: failedCount,
            last_payment_attempt: new Date().toISOString(),
        })
        .eq('stripe_customer_id', customerId);

    if (error) {
        console.error('[Webhook] Error updating subscription after payment failure:', error);
        throw error;
    }

    console.log(`[Webhook] ⚠️ Organization subscription status updated to ${newStatus} for customer:`, customerId);
    console.log(`[Webhook] Failed payment attempts: ${failedCount}/3`);

    // TODO: Send email notification to all organization members
    // - If failedCount < 3: "Payment failed, please update your payment method"
    // - If failedCount >= 3: "Account suspended due to payment failures, contact support"
}

/**
 * Handler for customer.subscription.updated event
 * Updates subscription details (plan change, status change, etc.)
 * 
 * MIGRATION NOTE: Now updates organization_subscriptions instead of user_subscriptions
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    console.log('[Webhook] Processing subscription update:', subscription.id);

    const customerId = subscription.customer as string;
    const metadata = subscription.metadata || {};

    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    );

    // Get current subscription details BEFORE updating
    const { data: currentSub, error: fetchError } = await supabase
        .from('organization_subscriptions')
        .select('plan_id, organization_id')
        .eq('stripe_customer_id', customerId)
        .single();

    if (fetchError) {
        console.error('[Webhook] Error fetching current subscription:', fetchError);
        throw fetchError;
    }

    const currentPlanId = currentSub?.plan_id;
    const newPlanId = metadata.planId ? parseInt(metadata.planId) : null;
    const action = metadata.action; // 'upgrade' or 'downgrade' if from Checkout
    const organizationId = currentSub?.organization_id || metadata.organizationId;

    // Detect plan change
    const isPlanChange = newPlanId && currentPlanId && newPlanId !== currentPlanId;
    
    console.log('[Webhook] Subscription metadata:', {
        action,
        currentPlanId,
        newPlanId,
        isPlanChange,
        organizationId
    });

    // Build update object
    const updateData: any = {
        status: subscription.status,
        stripe_subscription_id: subscription.id,
        expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
    };

    // If this is a plan change, update the plan_id
    if (newPlanId) {
        updateData.plan_id = newPlanId;
        console.log('[Webhook] 🔄 Plan change detected:', {
            action,
            currentPlanId,
            newPlanId,
            status: subscription.status
        });
    }

    // Update subscription in database
    const { error } = await supabase
        .from('organization_subscriptions') // MIGRATED: organization-based subscriptions
        .update(updateData)
        .eq('stripe_customer_id', customerId);

    if (error) {
        console.error('[Webhook] Error updating subscription:', error);
        throw error;
    }

    console.log('[Webhook] ✅ Organization subscription updated for customer:', customerId);
    console.log('[Webhook] New status:', subscription.status);
    if (newPlanId) {
        console.log('[Webhook] Plan changed to ID:', newPlanId);
    }

    // Add credits for manual plan changes (not from Checkout)
    if (isPlanChange && organizationId && !action) {
        // This is a manual plan change from Stripe Dashboard (no 'action' metadata)
        // We need to add credits for the new plan
        
        console.log('[Webhook] 💎 Manual plan change detected - adding credits');

        // Get new plan credits
        const { data: newPlan } = await supabase
            .from('subscription_plans')
            .select('credits, name')
            .eq('id', newPlanId)
            .single();

        const creditsToAdd = newPlan?.credits || 0;

        if (creditsToAdd > 0) {
            await addCreditsToOrganization(organizationId, creditsToAdd, 'subscription');
            console.log('[Webhook] ✅ Manual plan change - credits added:', {
                organizationId,
                creditsAdded: creditsToAdd,
                planName: newPlan?.name,
                previousPlanId: currentPlanId,
                newPlanId
            });
        }
    } else if (isPlanChange && action) {
        console.log('[Webhook] ℹ️ Plan change from Checkout - credits already added by checkout.session.completed');
    }

    // TODO: Send email notification to organization members about plan change
    // - Include old plan name, new plan name, effective date
    // - Include pricing changes and new features unlocked
}

/**
 * Handler for customer.subscription.deleted event
 * Marks subscription as cancelled
 * 
 * MIGRATION NOTE: Now updates organization_subscriptions instead of user_subscriptions
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    console.log('[Webhook] Processing subscription deletion:', subscription.id);

    const customerId = subscription.customer as string;

    const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    );

    const { error } = await supabase
        .from('organization_subscriptions') // MIGRATED: organization-based subscriptions
        .update({
            status: 'cancelled',
            expires_at: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_customer_id', customerId);

    if (error) {
        console.error('[Webhook] Error marking subscription as cancelled:', error);
        throw error;
    }

    console.log('[Webhook] ✅ Organization subscription cancelled for customer:', customerId);
    console.log('[Webhook] Access until:', new Date(subscription.current_period_end * 1000).toISOString());
}



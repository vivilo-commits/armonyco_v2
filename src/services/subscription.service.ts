import { supabase, getCurrentUser } from '../lib/supabase';
import { getUserTokens, calculateTokensFromCredits } from './tokens.service';

export interface SubscriptionPlan {
    id: number;
    name: string;
    price: number;
    credits: number;
    tokens: number; // Tokens = credits × 100
    tier: 'silver' | 'gold' | 'black' | 'institutional';
    features: string[];
}

export interface UserSubscription {
    id: string;
    planId: number;
    plan: SubscriptionPlan;
    status: 'active' | 'cancelled' | 'expired';
    startedAt: string;
    expiresAt: string | null;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
}

export interface UserSubscriptionWithTokens extends UserSubscription {
    currentTokens: number;
    tokensPerMonth: number;
}

export interface FeatureFlag {
    featureKey: string;
    name: string;
    description: string;
    minTier: 'silver' | 'gold' | 'black' | 'institutional';
    isActive: boolean;
}

const TIER_ORDER = ['silver', 'gold', 'black', 'institutional'];

/**
 * Get all available subscription plans
 */
export async function getPlans(): Promise<SubscriptionPlan[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true });

    if (error) {
        console.error('[Subscription] Get plans failed:', error);
        return [];
    }

    return (data || []).map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        credits: p.credits,
        tokens: calculateTokensFromCredits(p.credits), // Add calculated tokens
        tier: p.tier,
        features: p.features || [],
    }));
}

/**
 * Get user's current subscription (organization-based)
 * 
 * MIGRATION NOTE: Subscriptions now belong to organizations
 * This function finds the user's organization and returns its subscription
 */
export async function getUserSubscription(): Promise<UserSubscription | null> {
    if (!supabase) return null;

    const user = await getCurrentUser();
    if (!user) return null;

    // 1. Get user's organization
    const { data: membership, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

    if (memberError || !membership) {
        console.log('[Subscription] User has no organization membership');
        return null;
    }

    // 2. Get organization's subscription
    const { data, error } = await supabase
        .from('organization_subscriptions') // MIGRATED: organization-based subscriptions
        .select('*, subscription_plans(*)')
        .eq('organization_id', membership.organization_id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error || !data) {
        console.log('[Subscription] No active subscription for organization');
        return null;
    }

    return {
        id: data.id,
        planId: data.plan_id,
        plan: {
            id: data.subscription_plans.id,
            name: data.subscription_plans.name,
            price: data.subscription_plans.price,
            credits: data.subscription_plans.credits,
            tokens: calculateTokensFromCredits(data.subscription_plans.credits),
            tier: data.subscription_plans.tier,
            features: data.subscription_plans.features || [],
        },
        status: data.status,
        startedAt: data.started_at,
        expiresAt: data.expires_at,
        stripeCustomerId: data.stripe_customer_id,
        stripeSubscriptionId: data.stripe_subscription_id,
    };
}

/**
 * Subscribe organization to a plan
 * 
 * MIGRATION NOTE: Subscriptions now belong to organizations
 * This updates the organization's subscription, affecting all members
 */
export async function subscribeToPlan(planId: number): Promise<boolean> {
    if (!supabase) return false;

    const user = await getCurrentUser();
    if (!user) return false;

    // 1. Get user's organization
    const { data: membership, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

    if (memberError || !membership) {
        console.error('[Subscription] User has no organization');
        return false;
    }

    // 2. Cancel any existing subscription for the organization
    await supabase
        .from('organization_subscriptions') // MIGRATED: organization-based subscriptions
        .update({ status: 'cancelled' })
        .eq('organization_id', membership.organization_id)
        .eq('status', 'active');

    // 3. Create new subscription for the organization
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const { error } = await supabase
        .from('organization_subscriptions') // MIGRATED: organization-based subscriptions
        .insert({
            user_id: user.id, // Audit: who created the subscription
            organization_id: membership.organization_id, // Subscription owner
            plan_id: planId,
            status: 'active',
            started_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString(),
        });

    if (error) {
        console.error('[Subscription] Subscribe failed:', error);
        return false;
    }

    return true;
}

/**
 * Cancel organization's subscription
 * 
 * MIGRATION NOTE: Subscriptions now belong to organizations
 * This cancels the organization's subscription, affecting all members
 */
export async function cancelSubscription(): Promise<boolean> {
    if (!supabase) return false;

    const user = await getCurrentUser();
    if (!user) return false;

    // 1. Get user's organization
    const { data: membership, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .limit(1)
        .single();

    if (memberError || !membership) {
        console.error('[Subscription] User has no organization');
        return false;
    }

    // 2. Cancel organization's subscription
    const { error } = await supabase
        .from('organization_subscriptions') // MIGRATED: organization-based subscriptions
        .update({ status: 'cancelled' })
        .eq('organization_id', membership.organization_id)
        .eq('status', 'active');

    if (error) {
        console.error('[Subscription] Cancel failed:', error);
        return false;
    }

    return true;
}

/**
 * Get all feature flags
 */
export async function getFeatureFlags(): Promise<FeatureFlag[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('feature_flags')
        .select('*')
        .eq('is_active', true);

    if (error) {
        console.error('[Subscription] Get features failed:', error);
        return [];
    }

    return (data || []).map(f => ({
        featureKey: f.feature_key,
        name: f.name,
        description: f.description || '',
        minTier: f.min_tier,
        isActive: f.is_active,
    }));
}

/**
 * Check if user has access to a feature
 */
export async function hasFeatureAccess(featureKey: string): Promise<boolean> {
    const [subscription, features] = await Promise.all([
        getUserSubscription(),
        getFeatureFlags(),
    ]);

    const feature = features.find(f => f.featureKey === featureKey);
    if (!feature) return true; // Feature not restricted

    // Default to silver if no subscription
    const userTier = subscription?.plan.tier || 'silver';
    const userTierIndex = TIER_ORDER.indexOf(userTier);
    const requiredTierIndex = TIER_ORDER.indexOf(feature.minTier);

    return userTierIndex >= requiredTierIndex;
}

/**
 * Get user's tier
 */
export async function getUserTier(): Promise<string> {
    const subscription = await getUserSubscription();
    return subscription?.plan.tier || 'silver';
}

/**
 * Check if user can access admin features
 */
export async function canAccessAdmin(): Promise<boolean> {
    return hasFeatureAccess('admin_panel');
}

/**
 * Get user's subscription with tokens information
 */
export async function getUserSubscriptionWithTokens(): Promise<UserSubscriptionWithTokens | null> {
    const subscription = await getUserSubscription();
    if (!subscription) return null;

    const tokenBalance = await getUserTokens();
    
    return {
        ...subscription,
        currentTokens: tokenBalance?.tokens || 0,
        tokensPerMonth: subscription.plan.tokens,
    };
}

/**
 * Get Stripe Customer ID for user's organization
 * 
 * MIGRATION NOTE: Stripe customers now belong to organizations
 */
export async function getStripeCustomerId(userId?: string): Promise<string | null> {
    if (!supabase) return null;

    const targetUserId = userId || (await getCurrentUser())?.id;
    if (!targetUserId) return null;

    // 1. Get user's organization
    const { data: membership, error: memberError } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', targetUserId)
        .limit(1)
        .single();

    if (memberError || !membership) return null;

    // 2. Get organization's Stripe customer ID
    const { data, error } = await supabase
        .from('organization_subscriptions') // MIGRATED: organization-based subscriptions
        .select('stripe_customer_id')
        .eq('organization_id', membership.organization_id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error || !data) return null;
    
    return data.stripe_customer_id;
}

/**
 * Sync subscription status from Stripe
 * Chiamata dal webhook o per sincronizzazione manuale
 * 
 * MIGRATION NOTE: Now syncs organization_subscriptions
 */
export async function syncSubscriptionFromStripe(
    stripeSubscriptionId: string,
    status: 'active' | 'cancelled' | 'expired'
): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('organization_subscriptions') // MIGRATED: organization-based subscriptions
        .update({ status })
        .eq('stripe_subscription_id', stripeSubscriptionId);

    if (error) {
        console.error('[Subscription] Sync failed:', error);
        return false;
    }

    return true;
}

/**
 * Get subscription plan details by ID
 */
export async function getPlanById(planId: number): Promise<SubscriptionPlan | null> {
    const plans = await getPlans();
    return plans.find(p => p.id === planId) || null;
}

export const subscriptionService = {
    getPlans,
    getUserSubscription,
    getUserSubscriptionWithTokens,
    subscribeToPlan,
    cancelSubscription,
    getFeatureFlags,
    hasFeatureAccess,
    getUserTier,
    canAccessAdmin,
    getStripeCustomerId,
    syncSubscriptionFromStripe,
    getPlanById,
};

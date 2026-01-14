/**
 * useSubscription Hook
 * 
 * Hook to check and monitor organization subscription status
 * 
 * MIGRATION NOTE: Subscriptions are now organization-based
 * - Uses the user's current organization from usePermissions
 * - Queries organization_subscriptions table
 * - All members of an organization share the same subscription
 * 
 * Usage:
 * ```tsx
 * const { subscription, loading, isActive, hasSubscription } = useSubscription();
 * 
 * if (loading) return <Loader />;
 * if (!isActive) return <SubscriptionRequired />;
 * ```
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from './usePermissions';
import { supabase } from '../lib/supabase';

export interface SubscriptionData {
  id: string;
  organizationId: string;
  planId: number;
  status: 'active' | 'past_due' | 'suspended' | 'cancelled' | 'expired';
  startedAt: string;
  expiresAt: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  paymentFailedCount: number;
  lastPaymentAttempt: string | null;
}

export interface UseSubscriptionReturn {
  subscription: SubscriptionData | null;
  loading: boolean;
  isActive: boolean;
  hasSubscription: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to manage organization subscription state
 * 
 * Returns subscription details for the user's organization
 * Automatically updates when the organization changes
 */
export function useSubscription(): UseSubscriptionReturn {
  const { user } = useAuth();
  const { currentOrgId, loading: orgLoading } = usePermissions();
  
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // Load subscription data
  // ========================================
  const loadSubscription = async () => {
    // Wait for organization to load
    if (orgLoading) {
      return;
    }

    // No organization = no subscription
    if (!currentOrgId) {
      console.log('[useSubscription] No organization ID, clearing subscription');
      setSubscription(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('[useSubscription] Loading subscription for organization:', currentOrgId);

      // Query organization subscription
      const { data, error: queryError } = await supabase
        .from('organization_subscriptions')
        .select('*')
        .eq('organization_id', currentOrgId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (queryError) {
        // PGRST116 = No rows found (not an error, just no subscription)
        if (queryError.code === 'PGRST116') {
          console.log('[useSubscription] No active subscription found');
          setSubscription(null);
        } else {
          console.error('[useSubscription] Error loading subscription:', queryError);
          setError(queryError.message);
        }
      } else if (data) {
        console.log('[useSubscription] Subscription loaded:', data);
        setSubscription({
          id: data.id,
          organizationId: data.organization_id,
          planId: data.plan_id,
          status: data.status,
          startedAt: data.started_at,
          expiresAt: data.expires_at,
          stripeCustomerId: data.stripe_customer_id,
          stripeSubscriptionId: data.stripe_subscription_id,
          paymentFailedCount: data.payment_failed_count || 0,
          lastPaymentAttempt: data.last_payment_attempt,
        });
      } else {
        console.log('[useSubscription] No subscription data returned');
        setSubscription(null);
      }
    } catch (err: any) {
      console.error('[useSubscription] Unexpected error:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Effect: Load subscription when org changes
  // ========================================
  useEffect(() => {
    loadSubscription();
  }, [currentOrgId, orgLoading]);

  // ========================================
  // Computed values
  // ========================================
  const isActive = subscription?.status === 'active';
  const hasSubscription = subscription !== null;

  // ========================================
  // Return hook interface
  // ========================================
  return {
    subscription,
    loading,
    isActive,
    hasSubscription,
    error,
    refetch: loadSubscription,
  };
}

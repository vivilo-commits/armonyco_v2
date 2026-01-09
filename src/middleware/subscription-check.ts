/**
 * Subscription Check Middleware
 * Verifies user subscription status before allowing access to protected routes
 * 
 * Usage:
 * const { active, status, message } = await checkSubscriptionStatus(userId);
 * if (!active) {
 *   // Redirect to subscription-required page
 * }
 */

import { supabase } from '../lib/supabase';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface SubscriptionCheckResult {
  active: boolean;
  status: string;
  message?: string;
  expiresAt?: string;
  paymentFailedCount?: number;
}

export type SubscriptionStatus = 
  | 'active'      // All good, user can access
  | 'past_due'    // 1-2 payment failures, show warning
  | 'suspended'   // 3+ payment failures, block access
  | 'cancelled'   // User cancelled, access until expires_at
  | 'expired'     // Subscription expired
  | 'none';       // No subscription found

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Checks if user has an active subscription and can access the application
 * 
 * @param userId - Supabase user ID
 * @returns SubscriptionCheckResult with active status and optional message
 */
export async function checkSubscriptionStatus(
  userId: string
): Promise<SubscriptionCheckResult> {
  
  // Fetch user subscription from database
  const { data: subscription, error } = await supabase
    .from('user_subscriptions')
    .select('status, expires_at, payment_failed_count')
    .eq('user_id', userId)
    .single();

  // Handle database errors
  if (error) {
    console.error('[SubscriptionCheck] Database error:', error);
    return { 
      active: false, 
      status: 'none', 
      message: 'Unable to verify subscription status' 
    };
  }

  // No subscription found
  if (!subscription) {
    return { 
      active: false, 
      status: 'none', 
      message: 'No active subscription found' 
    };
  }

  // Check if subscription has expired (date-based)
  const now = new Date();
  const expiresAt = subscription.expires_at ? new Date(subscription.expires_at) : null;
  
  if (expiresAt && expiresAt < now) {
    return { 
      active: false, 
      status: 'expired', 
      message: 'Your subscription has expired. Please renew to continue using the service.',
      expiresAt: subscription.expires_at
    };
  }

  // Check status-based access control
  switch (subscription.status) {
    case 'active':
      return { 
        active: true, 
        status: 'active',
        expiresAt: subscription.expires_at
      };
    
    case 'past_due':
      // Allow access but show warning
      return { 
        active: true, // Still allow access with warning
        status: 'past_due', 
        message: `Your last payment failed (${subscription.payment_failed_count || 0} attempt${subscription.payment_failed_count === 1 ? '' : 's'}). Please update your payment method to avoid service interruption.`,
        paymentFailedCount: subscription.payment_failed_count
      };
    
    case 'suspended':
      // Block access completely
      return { 
        active: false, 
        status: 'suspended', 
        message: 'Your account has been suspended due to multiple payment failures. Please contact support or update your payment method.',
        paymentFailedCount: subscription.payment_failed_count
      };
    
    case 'cancelled':
      // Allow access until expires_at
      if (expiresAt && expiresAt >= now) {
        return { 
          active: true, 
          status: 'cancelled', 
          message: `Your subscription has been cancelled. You can still access the service until ${expiresAt.toLocaleDateString()}.`,
          expiresAt: subscription.expires_at
        };
      } else {
        return { 
          active: false, 
          status: 'cancelled', 
          message: 'Your subscription has been cancelled and the access period has ended.',
          expiresAt: subscription.expires_at
        };
      }
    
    default:
      // Unknown status - deny access by default for security
      console.warn('[SubscriptionCheck] Unknown subscription status:', subscription.status);
      return { 
        active: false, 
        status: subscription.status,
        message: 'Unable to verify subscription status. Please contact support.'
      };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Quick check if user has any form of valid access (active or grace period)
 */
export async function hasValidAccess(userId: string): Promise<boolean> {
  const result = await checkSubscriptionStatus(userId);
  return result.active;
}

/**
 * Returns a user-friendly status label for UI display
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'active': 'Active',
    'past_due': 'Payment Issue',
    'suspended': 'Suspended',
    'cancelled': 'Cancelled',
    'expired': 'Expired',
    'none': 'No Subscription'
  };
  
  return labels[status] || 'Unknown';
}

/**
 * Returns appropriate CSS class for status badge
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'active': 'green',
    'past_due': 'yellow',
    'suspended': 'red',
    'cancelled': 'gray',
    'expired': 'red',
    'none': 'gray'
  };
  
  return colors[status] || 'gray';
}

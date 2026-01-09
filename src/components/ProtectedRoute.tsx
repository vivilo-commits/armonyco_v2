/**
 * Protected Route Component
 * Checks subscription status and redirects to subscription-required view if needed
 * 
 * Usage in WebApp:
 * <ProtectedRoute 
 *   userId={userId}
 *   onSubscriptionBlocked={(message) => setView('subscription-required')}
 * >
 *   <YourProtectedContent />
 * </ProtectedRoute>
 */

import React, { useEffect, useState } from 'react';
import { checkSubscriptionStatus } from '../middleware/subscription-check';

interface ProtectedRouteProps {
  userId: string;
  onSubscriptionBlocked?: (message: string, status: string) => void;
  showWarning?: boolean; // Show warning for past_due status instead of blocking
  children: React.ReactNode;
}

/**
 * Component that checks subscription status before rendering children
 * Blocks access if subscription is not active (suspended, expired, cancelled)
 * Optionally shows warnings for past_due status
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  userId,
  onSubscriptionBlocked,
  showWarning = true,
  children
}) => {
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      if (!userId) {
        setHasAccess(false);
        setIsChecking(false);
        return;
      }

      try {
        const result = await checkSubscriptionStatus(userId);

        // Block access for: suspended, expired, cancelled (after expires_at), none
        if (!result.active) {
          setHasAccess(false);
          onSubscriptionBlocked?.(
            result.message || 'Subscription required',
            result.status
          );
        } else {
          setHasAccess(true);
        }
      } catch (error) {
        console.error('[ProtectedRoute] Error checking subscription:', error);
        setHasAccess(false);
        onSubscriptionBlocked?.(
          'Unable to verify subscription status',
          'error'
        );
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [userId, onSubscriptionBlocked]);

  // Show loading state
  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-zinc-400 text-sm">Verifying subscription...</span>
        </div>
      </div>
    );
  }

  // If no access, don't render children (parent will redirect)
  if (!hasAccess) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
};

/**
 * Hook to check subscription status in any component
 * Returns subscription check result and loading state
 */
export const useSubscriptionCheck = (userId: string | null) => {
  const [result, setResult] = useState<{
    active: boolean;
    status: string;
    message?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!userId) {
        setResult(null);
        setIsLoading(false);
        return;
      }

      try {
        const subscriptionResult = await checkSubscriptionStatus(userId);
        setResult(subscriptionResult);
      } catch (error) {
        console.error('[useSubscriptionCheck] Error:', error);
        setResult({ active: false, status: 'error', message: 'Unable to verify' });
      } finally {
        setIsLoading(false);
      }
    };

    check();
  }, [userId]);

  return { subscription: result, isLoading };
};

export default ProtectedRoute;

/**
 * Example: Using Products API Endpoint
 * 
 * This file demonstrates how to use the /api/user/has-product endpoint
 * from different contexts (client, server, external services)
 */

// ============================================================================
// CLIENT-SIDE USAGE (React/Frontend)
// ============================================================================

/**
 * Check if user has feature from frontend
 */
export async function checkUserFeature(userId: string, productId: string) {
  try {
    const response = await fetch(
      `/api/user/has-product?userId=${userId}&productId=${productId}`
    );

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    
    return {
      hasFeature: data.hasFeature,
      status: data.status as 'active' | 'paused' | 'inactive' | 'not_activated',
    };
  } catch (error) {
    console.error('Error checking feature:', error);
    return { hasFeature: false, status: 'not_activated' as const };
  }
}

// Usage in React component:
import { useState, useEffect } from 'react';

export function HeatingModuleButton({ userId }: { userId: string }) {
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    checkUserFeature(userId, 'heating-system').then(({ hasFeature }) => {
      setCanAccess(hasFeature);
    });
  }, [userId]);

  if (!canAccess) {
    return <button disabled>Heating (Upgrade Required)</button>;
  }

  return <button onClick={() => navigate('/heating')}>Heating Dashboard</button>;
}

// ============================================================================
// REACT HOOK FOR FEATURE CHECK
// ============================================================================

import { useQuery } from '@tanstack/react-query';

export function useHasFeature(userId: string | undefined, productId: string) {
  return useQuery({
    queryKey: ['feature', userId, productId],
    queryFn: async () => {
      if (!userId) return { hasFeature: false, status: 'not_activated' };
      return checkUserFeature(userId, productId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Usage:
export function FeatureButton({ productId }: { productId: string }) {
  const { user } = useAuth();
  const { data, isLoading } = useHasFeature(user?.id, productId);

  if (isLoading) return <div>Loading...</div>;
  if (!data?.hasFeature) return <UpgradePrompt />;

  return <FeatureContent />;
}

// ============================================================================
// SERVER-SIDE USAGE (Node.js/Vercel Functions)
// ============================================================================

import { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Example: Protect API endpoint with feature check
 */
export default async function heatingDataHandler(
  req: VercelRequest,
  res: VercelResponse
) {
  const { userId } = req.query;

  // Check if user has heating feature
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const featureCheck = await fetch(
    `${baseUrl}/api/user/has-product?userId=${userId}&productId=heating-system`
  );

  const { hasFeature } = await featureCheck.json();

  if (!hasFeature) {
    return res.status(403).json({
      error: 'Feature not available',
      message: 'Heating module not activated for this user',
    });
  }

  // User has feature, proceed with logic
  const heatingData = await getHeatingData(userId as string);
  return res.status(200).json(heatingData);
}

// ============================================================================
// MIDDLEWARE FOR EXPRESS/NEXT.JS
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

/**
 * Middleware to check feature access
 */
export async function requireFeature(productId: string) {
  return async (req: NextRequest) => {
    const userId = req.headers.get('x-user-id'); // Or extract from JWT

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/has-product?userId=${userId}&productId=${productId}`
    );

    const { hasFeature } = await response.json();

    if (!hasFeature) {
      return NextResponse.json(
        { error: 'Feature not available' },
        { status: 403 }
      );
    }

    return NextResponse.next();
  };
}

// Usage in Next.js API route:
/*
export const middleware = requireFeature('heating-system');
export const config = {
  matcher: '/api/heating/:path*',
};
*/

// ============================================================================
// BATCH CHECK MULTIPLE FEATURES
// ============================================================================

/**
 * Check multiple features at once
 */
export async function checkMultipleFeatures(
  userId: string,
  productIds: string[]
) {
  const checks = await Promise.all(
    productIds.map(productId => 
      checkUserFeature(userId, productId)
    )
  );

  return productIds.reduce((acc, productId, index) => {
    acc[productId] = checks[index];
    return acc;
  }, {} as Record<string, { hasFeature: boolean; status: string }>);
}

// Usage:
export async function DashboardLayout({ userId }: { userId: string }) {
  const features = await checkMultipleFeatures(userId, [
    'heating-system',
    'guest-management',
    'revenue-analytics',
  ]);

  return (
    <div>
      {features['heating-system'].hasFeature && <HeatingWidget />}
      {features['guest-management'].hasFeature && <GuestWidget />}
      {features['revenue-analytics'].hasFeature && <RevenueWidget />}
    </div>
  );
}

// ============================================================================
// EXTERNAL SERVICE INTEGRATION (Webhook/Zapier)
// ============================================================================

/**
 * Example: Check feature from external service
 */
export async function zapierWebhook(payload: any) {
  const { userId, productId, authToken } = payload;

  // Verify auth token
  if (authToken !== process.env.ZAPIER_SECRET) {
    throw new Error('Unauthorized');
  }

  // Check feature
  const response = await fetch(
    `https://yourdomain.com/api/user/has-product?userId=${userId}&productId=${productId}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`,
      },
    }
  );

  const { hasFeature, status } = await response.json();

  return {
    canProceed: hasFeature,
    featureStatus: status,
    timestamp: new Date().toISOString(),
  };
}

// ============================================================================
// CACHING STRATEGY
// ============================================================================

/**
 * Cache feature checks to reduce API calls
 */
class FeatureCache {
  private cache: Map<string, { value: boolean; expiry: number }> = new Map();
  private ttl = 5 * 60 * 1000; // 5 minutes

  private getCacheKey(userId: string, productId: string) {
    return `${userId}:${productId}`;
  }

  async hasFeature(userId: string, productId: string): Promise<boolean> {
    const key = this.getCacheKey(userId, productId);
    const cached = this.cache.get(key);

    // Return cached value if still valid
    if (cached && cached.expiry > Date.now()) {
      return cached.value;
    }

    // Fetch fresh value
    const { hasFeature } = await checkUserFeature(userId, productId);

    // Update cache
    this.cache.set(key, {
      value: hasFeature,
      expiry: Date.now() + this.ttl,
    });

    return hasFeature;
  }

  invalidate(userId: string, productId?: string) {
    if (productId) {
      this.cache.delete(this.getCacheKey(userId, productId));
    } else {
      // Clear all entries for user
      for (const key of this.cache.keys()) {
        if (key.startsWith(`${userId}:`)) {
          this.cache.delete(key);
        }
      }
    }
  }
}

// Usage:
const featureCache = new FeatureCache();

export async function checkFeatureWithCache(userId: string, productId: string) {
  return featureCache.hasFeature(userId, productId);
}

// Invalidate when user toggles feature
export async function onFeatureToggled(userId: string, productId: string) {
  featureCache.invalidate(userId, productId);
}

// ============================================================================
// ERROR HANDLING PATTERNS
// ============================================================================

/**
 * Robust feature check with fallback
 */
export async function checkFeatureSafe(
  userId: string,
  productId: string,
  options: {
    fallbackValue?: boolean;
    retries?: number;
    timeout?: number;
  } = {}
) {
  const { fallbackValue = false, retries = 2, timeout = 5000 } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(
        `/api/user/has-product?userId=${userId}&productId=${productId}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.hasFeature;

    } catch (error) {
      console.warn(`Feature check attempt ${attempt + 1} failed:`, error);
      
      if (attempt === retries) {
        console.error('All feature check attempts failed, using fallback');
        return fallbackValue;
      }

      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return fallbackValue;
}

// ============================================================================
// ANALYTICS INTEGRATION
// ============================================================================

/**
 * Track feature usage
 */
export async function trackFeatureAccess(
  userId: string,
  productId: string,
  action: 'view' | 'interact'
) {
  const { hasFeature, status } = await checkUserFeature(userId, productId);

  // Send to analytics
  analytics.track('Feature Access', {
    userId,
    productId,
    hasFeature,
    status,
    action,
    timestamp: new Date().toISOString(),
  });

  // If user doesn't have feature, track upsell opportunity
  if (!hasFeature) {
    analytics.track('Upsell Opportunity', {
      userId,
      productId,
      action: 'feature_access_denied',
    });
  }

  return hasFeature;
}

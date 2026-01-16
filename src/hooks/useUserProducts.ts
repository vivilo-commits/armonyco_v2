/**
 * @deprecated This hook uses user-based product activations.
 * Products are now activated per hotel, not per user.
 * This hook is kept for backward compatibility but should not be used in new code.
 * Products should be managed at the hotel level using hotelId.
 * 
 * Custom React Hook for User Products Management
 * 
 * Provides easy-to-use interface for managing user product activations
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  getProductsWithStatus, 
  toggleHotelProduct,
  hasActiveProduct,
  getActiveHotelProducts,
} from '../services/products.service';
import { getCurrentUser } from '../lib/supabase';
import { ProductModule } from '../models/product.model';

interface UseUserProductsReturn {
  products: ProductModule[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  toggleProduct: (productId: string, newStatus: 'active' | 'inactive') => Promise<void>;
  activeCount: number;
}

/**
 * Hook to manage user products
 */
export function useUserProducts(): UseUserProductsReturn {
  const [products, setProducts] = useState<ProductModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      setUserId(user.id);
      const data = await getProductsWithStatus();
      setProducts(data);
    } catch (err) {
      console.error('[useUserProducts] Error loading products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const toggleProduct = useCallback(async (
    productId: string,
    newStatus: 'active' | 'inactive'
  ) => {
    if (!userId) {
      throw new Error('User not authenticated');
    }

    try {
      await toggleUserProduct(userId, productId, newStatus);

      // Optimistic update
      setProducts(prev =>
        prev.map(p =>
          p.id === productId
            ? {
                ...p,
                status: newStatus === 'active' ? 'ACTIVE' : 'INACTIVE',
                isActive: newStatus === 'active',
                isPaused: false,
              }
            : p
        )
      );
    } catch (err) {
      console.error('[useUserProducts] Error toggling product:', err);
      // Reload to restore correct state
      await loadProducts();
      throw err;
    }
  }, [userId, loadProducts]);

  const activeCount = products.filter(p => p.isActive).length;

  return {
    products,
    loading,
    error,
    refresh: loadProducts,
    toggleProduct,
    activeCount,
  };
}

interface UseHasFeatureReturn {
  hasFeature: boolean;
  loading: boolean;
  error: string | null;
  status: 'active' | 'paused' | 'inactive' | 'not_activated' | null;
}

/**
 * Hook to check if user has a specific feature
 */
export function useHasFeature(productId: string): UseHasFeatureReturn {
  const [hasFeature, setHasFeature] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'active' | 'paused' | 'inactive' | 'not_activated' | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkFeature = async () => {
      try {
        setLoading(true);
        setError(null);

        const user = await getCurrentUser();
        if (!user) {
          if (mounted) {
            setHasFeature(false);
            setStatus('not_activated');
          }
          return;
        }

        const hasActive = await hasActiveProduct(user.id, productId);
        
        if (mounted) {
          setHasFeature(hasActive);
          setStatus(hasActive ? 'active' : 'inactive');
        }
      } catch (err) {
        console.error('[useHasFeature] Error checking feature:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to check feature');
          setHasFeature(false);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkFeature();

    return () => {
      mounted = false;
    };
  }, [productId]);

  return { hasFeature, loading, error, status };
}

interface UseActiveProductsReturn {
  activeProducts: any[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Hook to get only active products for user
 */
export function useActiveProducts(): UseActiveProductsReturn {
  const [activeProducts, setActiveProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActiveProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const user = await getCurrentUser();
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const products = await getActiveUserProducts(user.id);
      setActiveProducts(products);
    } catch (err) {
      console.error('[useActiveProducts] Error loading active products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load active products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActiveProducts();
  }, [loadActiveProducts]);

  return {
    activeProducts,
    loading,
    error,
    refresh: loadActiveProducts,
  };
}

/**
 * Hook to manage product categories
 */
export function useProductsByCategory() {
  const { products, loading, error } = useUserProducts();

  const byCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, ProductModule[]>);

  return { byCategory, loading, error };
}

/**
 * Hook for product search and filtering
 */
export function useProductSearch(searchQuery: string, categoryFilter?: string) {
  const { products, loading, error } = useUserProducts();

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = !categoryFilter || categoryFilter === 'all' || p.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return { filteredProducts, loading, error };
}

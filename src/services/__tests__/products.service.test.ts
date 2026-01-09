/**
 * Tests for Products Service
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  toggleUserProduct,
  hasActiveProduct,
  getActiveUserProducts,
  pauseUserProduct,
  activateProduct,
  deactivateProduct,
  getProductsWithStatus,
} from '../products.service';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
  getCurrentUser: vi.fn(),
}));

describe('Products Service', () => {
  const mockUserId = 'user-123';
  const mockProductId = 'product-456';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('toggleUserProduct', () => {
    it('should activate a product that was not activated before', async () => {
      const { supabase } = await import('../../lib/supabase');
      
      // Mock: no existing activation
      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      });

      // Mock: insert new activation
      const insertMock = vi.fn().mockResolvedValue({ data: {}, error: null });

      (supabase.from as any).mockReturnValue({
        select: selectMock,
        insert: insertMock,
      });

      await toggleUserProduct(mockUserId, mockProductId, 'active');

      expect(insertMock).toHaveBeenCalledWith({
        user_id: mockUserId,
        product_id: mockProductId,
        status: 'active',
      });
    });

    it('should update existing product activation', async () => {
      const { supabase } = await import('../../lib/supabase');
      
      // Mock: existing activation
      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: 'activation-1', status: 'active' },
              error: null,
            }),
          }),
        }),
      });

      // Mock: update activation
      const updateMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: {}, error: null }),
      });

      (supabase.from as any).mockImplementation((table: string) => {
        if (table === 'user_product_activations') {
          return {
            select: selectMock,
            update: updateMock,
          };
        }
      });

      await toggleUserProduct(mockUserId, mockProductId, 'inactive');

      expect(updateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'inactive',
        })
      );
    });

    it('should throw error if supabase not configured', async () => {
      vi.doMock('../../lib/supabase', () => ({
        supabase: null,
      }));

      const { toggleUserProduct } = await import('../products.service');

      await expect(
        toggleUserProduct(mockUserId, mockProductId, 'active')
      ).rejects.toThrow('Supabase not configured');
    });
  });

  describe('hasActiveProduct', () => {
    it('should return true if product is active', async () => {
      const { supabase } = await import('../../lib/supabase');
      
      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { status: 'active' },
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as any).mockReturnValue({ select: selectMock });

      const result = await hasActiveProduct(mockUserId, mockProductId);

      expect(result).toBe(true);
    });

    it('should return false if product is inactive', async () => {
      const { supabase } = await import('../../lib/supabase');
      
      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { status: 'inactive' },
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as any).mockReturnValue({ select: selectMock });

      const result = await hasActiveProduct(mockUserId, mockProductId);

      expect(result).toBe(false);
    });

    it('should return false if product is paused', async () => {
      const { supabase } = await import('../../lib/supabase');
      
      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: { status: 'paused' },
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as any).mockReturnValue({ select: selectMock });

      const result = await hasActiveProduct(mockUserId, mockProductId);

      expect(result).toBe(false);
    });

    it('should return false if product not activated', async () => {
      const { supabase } = await import('../../lib/supabase');
      
      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as any).mockReturnValue({ select: selectMock });

      const result = await hasActiveProduct(mockUserId, mockProductId);

      expect(result).toBe(false);
    });
  });

  describe('pauseUserProduct', () => {
    it('should pause an active product', async () => {
      const { supabase } = await import('../../lib/supabase');
      
      const updateMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: {}, error: null }),
        }),
      });

      (supabase.from as any).mockReturnValue({ update: updateMock });

      await pauseUserProduct(mockUserId, mockProductId);

      expect(updateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'paused',
        })
      );
    });
  });

  describe('getActiveUserProducts', () => {
    it('should return only active products', async () => {
      const { supabase } = await import('../../lib/supabase');
      
      const mockProducts = [
        { products: { id: '1', name: 'Product 1', code: 'p1' } },
        { products: { id: '2', name: 'Product 2', code: 'p2' } },
      ];

      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: mockProducts,
            error: null,
          }),
        }),
      });

      (supabase.from as any).mockReturnValue({ select: selectMock });

      const result = await getActiveUserProducts(mockUserId);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockProducts[0].products);
    });

    it('should filter out null products', async () => {
      const { supabase } = await import('../../lib/supabase');
      
      const mockProducts = [
        { products: { id: '1', name: 'Product 1', code: 'p1' } },
        { products: null },
      ];

      const selectMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({
            data: mockProducts,
            error: null,
          }),
        }),
      });

      (supabase.from as any).mockReturnValue({ select: selectMock });

      const result = await getActiveUserProducts(mockUserId);

      expect(result).toHaveLength(1);
    });
  });

  describe('getProductsWithStatus', () => {
    it('should merge products with user activation status', async () => {
      const { supabase, getCurrentUser } = await import('../../lib/supabase');
      
      // Mock current user
      (getCurrentUser as any).mockResolvedValue({ id: mockUserId });

      // Mock products
      const mockProducts = [
        {
          id: '1',
          code: 'p1',
          name: 'Product 1',
          description: 'Desc 1',
          category: 'GUEST',
          credit_cost: 100,
          is_active: true,
        },
      ];

      // Mock activations
      const mockActivations = [
        {
          id: 'a1',
          product_id: '1',
          status: 'active',
          activated_at: new Date().toISOString(),
        },
      ];

      const fromMock = vi.fn().mockImplementation((table: string) => {
        if (table === 'products') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: mockProducts,
                  error: null,
                }),
              }),
            }),
          };
        } else if (table === 'user_product_activations') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: mockActivations,
                error: null,
              }),
            }),
          };
        }
      });

      (supabase.from as any) = fromMock;

      const result = await getProductsWithStatus();

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: '1',
        code: 'p1',
        isActive: true,
        isPaused: false,
        status: 'ACTIVE',
      });
    });

    it('should mark products without activation as INACTIVE', async () => {
      const { supabase, getCurrentUser } = await import('../../lib/supabase');
      
      (getCurrentUser as any).mockResolvedValue({ id: mockUserId });

      const mockProducts = [
        {
          id: '1',
          code: 'p1',
          name: 'Product 1',
          category: 'GUEST',
          credit_cost: 100,
          is_active: true,
        },
      ];

      const fromMock = vi.fn().mockImplementation((table: string) => {
        if (table === 'products') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                order: vi.fn().mockResolvedValue({
                  data: mockProducts,
                  error: null,
                }),
              }),
            }),
          };
        } else {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({
                data: [],
                error: null,
              }),
            }),
          };
        }
      });

      (supabase.from as any) = fromMock;

      const result = await getProductsWithStatus();

      expect(result[0]).toMatchObject({
        isPurchased: false,
        isActive: false,
        isPaused: false,
        status: 'INACTIVE',
      });
    });
  });
});

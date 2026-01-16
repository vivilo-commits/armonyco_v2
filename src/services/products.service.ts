import { supabase, getCurrentUser } from '../lib/supabase';
import { ProductModule } from '../types';

export interface DBProduct {
    id: string;
    code: string;
    name: string;
    description: string;
    category: 'GUEST' | 'REVENUE' | 'OPS' | 'RESPONSE' | 'PLAYBOOK';
    credit_cost: number;
    labor_reduction: string;
    value_generated: string;
    requires_external: boolean;
    is_active: boolean;
    sort_order: number;
}

export interface HotelProductActivation {
    id: string;
    hotel_id: string;
    product_id: string;
    status: 'active' | 'paused' | 'inactive';
    activated_at: string;
    updated_at: string;
}

/**
 * Get all available products
 */
export async function getAllProducts(): Promise<ProductModule[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

    if (error) {
        console.error('[Products] Get all failed:', error);
        return [];
    }

    return (data || []).map(p => ({
        id: p.id,
        code: p.code,
        name: p.name,
        description: p.description || '',
        category: p.category,
        creditCost: p.credit_cost,
        laborReduction: p.labor_reduction,
        valueGenerated: p.value_generated,
        requiresExternal: p.requires_external,
        isActive: true,
        isPurchased: false,
        isPaused: false,
    }));
}

/**
 * Get hotel's product activations
 */
export async function getHotelActivations(hotelId: string): Promise<Map<string, HotelProductActivation>> {
    if (!supabase) return new Map();
    if (!hotelId) return new Map();

    const { data, error } = await supabase
        .from('hotel_product_activations')
        .select('*')
        .eq('hotel_id', hotelId);

    if (error) {
        // Don't throw if table doesn't exist yet
        if (error.code !== 'PGRST116' && error.code !== '42P01') {
            console.error('[Products] Get activations failed:', error);
        }
        return new Map();
    }

    const map = new Map<string, HotelProductActivation>();
    (data || []).forEach(a => {
        map.set(a.product_id, {
            id: a.id,
            hotel_id: a.hotel_id,
            product_id: a.product_id,
            status: a.status,
            activated_at: a.activated_at,
            updated_at: a.updated_at,
        });
    });

    return map;
}

/**
 * Get products with hotel's activation status merged
 */
export async function getProductsWithStatus(hotelId?: string): Promise<ProductModule[]> {
    const products = await getAllProducts();
    
    if (!hotelId) {
        // Return products without activation status if no hotel selected
        return products.map((p): ProductModule => ({
            ...p,
            isPurchased: false,
            isPaused: false,
            isActive: false,
            status: 'INACTIVE',
        }));
    }

    const activations = await getHotelActivations(hotelId);

    return products.map((p): ProductModule => {
        const activation = activations.get(p.id);
        const status: 'ACTIVE' | 'PAUSED' | 'INACTIVE' =
            activation?.status === 'active' ? 'ACTIVE'
                : activation?.status === 'paused' ? 'PAUSED'
                    : 'INACTIVE';

        return {
            id: p.id,
            code: p.code,
            name: p.name,
            description: p.description,
            category: p.category,
            creditCost: p.creditCost,
            laborReduction: p.laborReduction,
            valueGenerated: p.valueGenerated,
            requiresExternal: p.requiresExternal,
            isPurchased: !!activation,
            isPaused: activation?.status === 'paused',
            isActive: activation?.status === 'active',
            status,
        };
    });
}

/**
 * Toggle product status: active <-> inactive for a hotel
 */
export async function toggleHotelProduct(
    hotelId: string,
    productId: string,
    newStatus: 'active' | 'inactive'
): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    if (!hotelId) throw new Error('Hotel ID is required');

    // Check if activation exists
    const { data: existing } = await supabase
        .from('hotel_product_activations')
        .select('id, status')
        .eq('hotel_id', hotelId)
        .eq('product_id', productId)
        .maybeSingle();

    if (existing) {
        // UPDATE existing status
        const { error } = await supabase
            .from('hotel_product_activations')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

        if (error) throw error;
    } else {
        // INSERT new activation
        const { error } = await supabase
            .from('hotel_product_activations')
            .insert({
                hotel_id: hotelId,
                product_id: productId,
                status: newStatus,
            });

        if (error) throw error;
    }

    console.log(`[Products] Feature ${productId} set to ${newStatus} for hotel ${hotelId}`);
}

/**
 * Pause product temporarily for a hotel
 */
export async function pauseHotelProduct(hotelId: string, productId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    if (!hotelId) throw new Error('Hotel ID is required');

    const { error } = await supabase
        .from('hotel_product_activations')
        .update({
            status: 'paused',
            updated_at: new Date().toISOString(),
        })
        .eq('hotel_id', hotelId)
        .eq('product_id', productId);

    if (error) throw error;
}

/**
 * Check if hotel has active product
 */
export async function hasActiveProduct(
    hotelId: string,
    productId: string
): Promise<boolean> {
    if (!supabase) throw new Error('Supabase not configured');
    if (!hotelId) return false;

    const { data, error } = await supabase
        .from('hotel_product_activations')
        .select('status')
        .eq('hotel_id', hotelId)
        .eq('product_id', productId)
        .maybeSingle();

    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
        console.error('[Products] Error checking hotel product:', error);
        throw error;
    }

    return data?.status === 'active';
}

/**
 * Get only active products for hotel
 */
export async function getActiveHotelProducts(hotelId: string): Promise<DBProduct[]> {
    if (!supabase) throw new Error('Supabase not configured');
    if (!hotelId) return [];

    const { data, error } = await supabase
        .from('hotel_product_activations')
        .select(`
            products (*)
        `)
        .eq('hotel_id', hotelId)
        .eq('status', 'active');

    if (error) {
        if (error.code !== 'PGRST116' && error.code !== '42P01') {
            throw error;
        }
        return [];
    }

    return (data || []).map(d => d.products as any).filter(Boolean);
}

/**
 * Activate a product for hotel
 */
export async function activateProduct(productId: string, hotelId: string): Promise<boolean> {
    if (!supabase) return false;
    if (!hotelId) return false;

    const { error } = await supabase
        .from('hotel_product_activations')
        .upsert({
            hotel_id: hotelId,
            product_id: productId,
            status: 'active',
            updated_at: new Date().toISOString(),
        }, { onConflict: 'hotel_id,product_id' });

    if (error) {
        console.error('[Products] Activate failed:', error);
        return false;
    }

    return true;
}

/**
 * Pause a product (keep purchased but stop running) for hotel
 */
export async function pauseProduct(productId: string, hotelId: string): Promise<boolean> {
    if (!supabase) return false;
    if (!hotelId) return false;

    const { error } = await supabase
        .from('hotel_product_activations')
        .update({ status: 'paused', updated_at: new Date().toISOString() })
        .eq('hotel_id', hotelId)
        .eq('product_id', productId);

    if (error) {
        console.error('[Products] Pause failed:', error);
        return false;
    }

    return true;
}

/**
 * Resume a paused product for hotel
 */
export async function resumeProduct(productId: string, hotelId: string): Promise<boolean> {
    return activateProduct(productId, hotelId);
}

/**
 * Deactivate a product for hotel
 */
export async function deactivateProduct(productId: string, hotelId: string): Promise<boolean> {
    if (!supabase) return false;
    if (!hotelId) return false;

    const { error } = await supabase
        .from('hotel_product_activations')
        .update({ status: 'inactive', updated_at: new Date().toISOString() })
        .eq('hotel_id', hotelId)
        .eq('product_id', productId);

    if (error) {
        console.error('[Products] Deactivate failed:', error);
        return false;
    }

    return true;
}

/**
 * Activate all products for hotel
 */
export async function activateAllProducts(hotelId: string): Promise<boolean> {
    if (!hotelId) return false;
    const products = await getAllProducts();
    const results = await Promise.all(products.map(p => activateProduct(p.id, hotelId)));
    return results.every(r => r);
}

/**
 * Deactivate all products for hotel
 */
export async function deactivateAllProducts(hotelId: string): Promise<boolean> {
    if (!supabase) return false;
    if (!hotelId) return false;

    const { error } = await supabase
        .from('hotel_product_activations')
        .update({ status: 'inactive', updated_at: new Date().toISOString() })
        .eq('hotel_id', hotelId);

    if (error) {
        console.error('[Products] Deactivate all failed:', error);
        return false;
    }

    return true;
}

export const productsService = {
    getAllProducts,
    getHotelActivations,
    getProductsWithStatus,
    activateProduct,
    pauseProduct,
    resumeProduct,
    deactivateProduct,
    activateAllProducts,
    deactivateAllProducts,
    toggleHotelProduct,
    pauseHotelProduct,
    hasActiveProduct,
    getActiveHotelProducts,
};

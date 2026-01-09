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

export interface UserProductActivation {
    id: string;
    product_id: string;
    status: 'active' | 'paused' | 'inactive';
    activated_at: string;
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
 * Get user's product activations
 */
export async function getUserActivations(): Promise<Map<string, UserProductActivation>> {
    if (!supabase) return new Map();

    const user = await getCurrentUser();
    if (!user) return new Map();

    const { data, error } = await supabase
        .from('user_product_activations')
        .select('*')
        .eq('user_id', user.id);

    if (error) {
        console.error('[Products] Get activations failed:', error);
        return new Map();
    }

    const map = new Map<string, UserProductActivation>();
    (data || []).forEach(a => {
        map.set(a.product_id, {
            id: a.id,
            product_id: a.product_id,
            status: a.status,
            activated_at: a.activated_at,
        });
    });

    return map;
}

/**
 * Get products with user's activation status merged
 */
export async function getProductsWithStatus(): Promise<ProductModule[]> {
    const [products, activations] = await Promise.all([
        getAllProducts(),
        getUserActivations(),
    ]);

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
 * Toggle product status: active <-> inactive
 */
export async function toggleUserProduct(
    userId: string,
    productId: string,
    newStatus: 'active' | 'inactive'
): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    // Check if activation exists
    const { data: existing } = await supabase
        .from('user_product_activations')
        .select('id, status')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .maybeSingle();

    if (existing) {
        // UPDATE existing status
        const { error } = await supabase
            .from('user_product_activations')
            .update({
                status: newStatus,
                updated_at: new Date().toISOString(),
            })
            .eq('id', existing.id);

        if (error) throw error;
    } else {
        // INSERT new activation
        const { error } = await supabase
            .from('user_product_activations')
            .insert({
                user_id: userId,
                product_id: productId,
                status: newStatus,
            });

        if (error) throw error;
    }

    console.log(`[Products] Feature ${productId} set to ${newStatus} for user ${userId}`);
}

/**
 * Pause product temporarily
 */
export async function pauseUserProduct(userId: string, productId: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
        .from('user_product_activations')
        .update({
            status: 'paused',
            updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .eq('product_id', productId);

    if (error) throw error;
}

/**
 * Check if user has active product
 */
export async function hasActiveProduct(
    userId: string,
    productId: string
): Promise<boolean> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('user_product_activations')
        .select('status')
        .eq('user_id', userId)
        .eq('product_id', productId)
        .maybeSingle();

    if (error && error.code !== 'PGRST116') {
        console.error('[Products] Error checking user product:', error);
        throw error;
    }

    return data?.status === 'active';
}

/**
 * Get only active products for user
 */
export async function getActiveUserProducts(userId: string): Promise<DBProduct[]> {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('user_product_activations')
        .select(`
            products (*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active');

    if (error) throw error;

    return (data || []).map(d => d.products as any).filter(Boolean);
}

/**
 * Activate a product for user
 */
export async function activateProduct(productId: string): Promise<boolean> {
    if (!supabase) return false;

    const user = await getCurrentUser();
    if (!user) return false;

    const { error } = await supabase
        .from('user_product_activations')
        .upsert({
            user_id: user.id,
            product_id: productId,
            status: 'active',
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,product_id' });

    if (error) {
        console.error('[Products] Activate failed:', error);
        return false;
    }

    return true;
}

/**
 * Pause a product (keep purchased but stop running)
 */
export async function pauseProduct(productId: string): Promise<boolean> {
    if (!supabase) return false;

    const user = await getCurrentUser();
    if (!user) return false;

    const { error } = await supabase
        .from('user_product_activations')
        .update({ status: 'paused', updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('product_id', productId);

    if (error) {
        console.error('[Products] Pause failed:', error);
        return false;
    }

    return true;
}

/**
 * Resume a paused product
 */
export async function resumeProduct(productId: string): Promise<boolean> {
    return activateProduct(productId);
}

/**
 * Deactivate a product
 */
export async function deactivateProduct(productId: string): Promise<boolean> {
    if (!supabase) return false;

    const user = await getCurrentUser();
    if (!user) return false;

    const { error } = await supabase
        .from('user_product_activations')
        .update({ status: 'inactive', updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('product_id', productId);

    if (error) {
        console.error('[Products] Deactivate failed:', error);
        return false;
    }

    return true;
}

/**
 * Activate all products for user
 */
export async function activateAllProducts(): Promise<boolean> {
    const products = await getAllProducts();
    const results = await Promise.all(products.map(p => activateProduct(p.id)));
    return results.every(r => r);
}

/**
 * Deactivate all products for user
 */
export async function deactivateAllProducts(): Promise<boolean> {
    if (!supabase) return false;

    const user = await getCurrentUser();
    if (!user) return false;

    const { error } = await supabase
        .from('user_product_activations')
        .update({ status: 'inactive', updated_at: new Date().toISOString() })
        .eq('user_id', user.id);

    if (error) {
        console.error('[Products] Deactivate all failed:', error);
        return false;
    }

    return true;
}

export const productsService = {
    getAllProducts,
    getUserActivations,
    getProductsWithStatus,
    activateProduct,
    pauseProduct,
    resumeProduct,
    deactivateProduct,
    activateAllProducts,
    deactivateAllProducts,
    toggleUserProduct,
    pauseUserProduct,
    hasActiveProduct,
    getActiveUserProducts,
};

import { supabase, getCurrentUser } from '../lib/supabase';

export interface UnitGroup {
    id: string;
    name: string;
    unitsCount: number;
}

export interface Unit {
    id: string;
    name: string;
    groupId: string;
    groupName: string;
}

export interface UnitProductSetting {
    unitId: string;
    productId: string;
    isEnabled: boolean;
}

/**
 * Get all unit groups for current user
 */
export async function getUnitGroups(): Promise<UnitGroup[]> {
    if (!supabase) return [];

    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('unit_groups')
        .select('*, units(count)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('[Units] Get groups failed:', error);
        return [];
    }

    return (data || []).map(g => ({
        id: g.id,
        name: g.name,
        unitsCount: g.units?.[0]?.count || 0,
    }));
}

/**
 * Create a unit group
 */
export async function createUnitGroup(name: string): Promise<UnitGroup | null> {
    if (!supabase) return null;

    const user = await getCurrentUser();
    if (!user) return null;

    const id = `group-${Date.now()}`;

    const { data, error } = await supabase
        .from('unit_groups')
        .insert({ id, user_id: user.id, name })
        .select()
        .single();

    if (error) {
        console.error('[Units] Create group failed:', error);
        return null;
    }

    return { id: data.id, name: data.name, unitsCount: 0 };
}

/**
 * Get all units for current user
 */
export async function getUnits(): Promise<Unit[]> {
    if (!supabase) return [];

    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('units')
        .select('*, unit_groups(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('[Units] Get units failed:', error);
        return [];
    }

    return (data || []).map(u => ({
        id: u.id,
        name: u.name,
        groupId: u.group_id || '',
        groupName: u.unit_groups?.name || 'Ungrouped',
    }));
}

/**
 * Create a unit
 */
export async function createUnit(name: string, groupId?: string): Promise<Unit | null> {
    if (!supabase) return null;

    const user = await getCurrentUser();
    if (!user) return null;

    const id = `unit-${Date.now()}`;

    const { data, error } = await supabase
        .from('units')
        .insert({ id, user_id: user.id, name, group_id: groupId || null })
        .select('*, unit_groups(name)')
        .single();

    if (error) {
        console.error('[Units] Create unit failed:', error);
        return null;
    }

    return {
        id: data.id,
        name: data.name,
        groupId: data.group_id || '',
        groupName: data.unit_groups?.name || 'Ungrouped',
    };
}

/**
 * Update unit
 */
export async function updateUnit(unitId: string, updates: { name?: string; groupId?: string }): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('units')
        .update({ name: updates.name, group_id: updates.groupId })
        .eq('id', unitId);

    if (error) {
        console.error('[Units] Update unit failed:', error);
        return false;
    }

    return true;
}

/**
 * Delete unit
 */
export async function deleteUnit(unitId: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('units')
        .delete()
        .eq('id', unitId);

    if (error) {
        console.error('[Units] Delete unit failed:', error);
        return false;
    }

    return true;
}

/**
 * Get product settings for a unit
 */
export async function getUnitProductSettings(unitId: string): Promise<UnitProductSetting[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('unit_product_settings')
        .select('*')
        .eq('unit_id', unitId);

    if (error) {
        console.error('[Units] Get product settings failed:', error);
        return [];
    }

    return (data || []).map(s => ({
        unitId: s.unit_id,
        productId: s.product_id,
        isEnabled: s.is_enabled,
    }));
}

/**
 * Toggle product for a unit
 */
export async function setUnitProductEnabled(unitId: string, productId: string, enabled: boolean): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
        .from('unit_product_settings')
        .upsert({
            unit_id: unitId,
            product_id: productId,
            is_enabled: enabled,
        }, { onConflict: 'unit_id,product_id' });

    if (error) {
        console.error('[Units] Set product enabled failed:', error);
        return false;
    }

    return true;
}

export const unitsService = {
    getUnitGroups,
    createUnitGroup,
    getUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    getUnitProductSettings,
    setUnitProductEnabled,
};

import { supabase, getCurrentUser } from '../lib/supabase';
import { UserProfile } from '../types';

export interface AdminUser extends UserProfile {
    is_disabled: boolean;
    created_at: string;
    updated_at: string;
    last_sign_in?: string;
}

/**
 * Check if current user is admin (AppAdmin role)
 * @deprecated Use usePermissions().isAppAdmin() in components instead
 * This function is kept for backward compatibility but should not be used for access control
 */
export async function isAdmin(): Promise<boolean> {
    if (!supabase) return false;

    const user = await getCurrentUser();
    if (!user) return false;

    const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (error || !data) return false;
    // Updated to check for AppAdmin instead of Executive
    return data.role === 'AppAdmin';
}

/**
 * Get all users
 * Access control should be done in the calling component using usePermissions()
 */
export async function getAllUsers(): Promise<AdminUser[]> {
    console.log('[Admin Service] 📞 getAllUsers called');
    
    if (!supabase) {
        console.log('[Admin Service] ⚠️ Supabase not configured');
        return [];
    }

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[Admin Service] ❌ Error fetching users:', error);
            throw error;
        }

        console.log('[Admin Service] ✅ Users loaded:', data?.length || 0);

        return (data || []).map(u => ({
            id: u.id,
            email: u.email,
            firstName: u.first_name || '',
            lastName: u.last_name || '',
            phone: u.phone || '',
            photo: u.photo,
            role: u.role || 'Operator',
            credits: u.credits || 0,
            is_disabled: u.is_disabled || false,
            created_at: u.created_at,
            updated_at: u.updated_at,
        }));
    } catch (err) {
        console.error('[Admin Service] ❌ Exception in getAllUsers:', err);
        throw err;
    }
}

/**
 * Update user role
 * Access control should be done in the calling component using usePermissions()
 */
export async function updateUserRole(userId: string, role: string): Promise<boolean> {
    console.log('[Admin Service] 📞 updateUserRole called for user:', userId, 'new role:', role);
    
    if (!supabase) {
        console.log('[Admin Service] ⚠️ Supabase not configured');
        return false;
    }

    try {
        const { error } = await supabase
            .from('profiles')
            .update({ role, updated_at: new Date().toISOString() })
            .eq('id', userId);

        if (error) {
            console.error('[Admin Service] ❌ Update role failed:', error);
            throw error;
        }

        console.log('[Admin Service] ✅ Role updated successfully');
        return true;
    } catch (err) {
        console.error('[Admin Service] ❌ Exception in updateUserRole:', err);
        return false;
    }
}

/**
 * Enable/disable user account
 * Access control should be done in the calling component using usePermissions()
 */
export async function setUserDisabled(userId: string, disabled: boolean): Promise<boolean> {
    console.log('[Admin Service] 📞 setUserDisabled called for user:', userId, 'disabled:', disabled);
    
    if (!supabase) {
        console.log('[Admin Service] ⚠️ Supabase not configured');
        return false;
    }

    try {
        const { error } = await supabase
            .from('profiles')
            .update({ is_disabled: disabled, updated_at: new Date().toISOString() })
            .eq('id', userId);

        if (error) {
            console.error('[Admin Service] ❌ Set disabled failed:', error);
            throw error;
        }

        console.log('[Admin Service] ✅ User disabled status updated successfully');
        return true;
    } catch (err) {
        console.error('[Admin Service] ❌ Exception in setUserDisabled:', err);
        return false;
    }
}

/**
 * Get user count statistics
 * Access control should be done in the calling component using usePermissions()
 */
export async function getUserStats(): Promise<{ total: number; active: number; disabled: number }> {
    console.log('[Admin Service] 📞 getUserStats called');
    
    if (!supabase) {
        console.log('[Admin Service] ⚠️ Supabase not configured');
        return { total: 0, active: 0, disabled: 0 };
    }

    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('is_disabled');

        if (error) {
            console.error('[Admin Service] ❌ Error fetching stats:', error);
            return { total: 0, active: 0, disabled: 0 };
        }

        if (!data) {
            console.log('[Admin Service] ℹ️ No data returned');
            return { total: 0, active: 0, disabled: 0 };
        }

        const total = data.length;
        const disabled = data.filter(u => u.is_disabled).length;
        const active = total - disabled;

        console.log('[Admin Service] ✅ Stats loaded:', { total, active, disabled });

        return { total, active, disabled };
    } catch (err) {
        console.error('[Admin Service] ❌ Exception in getUserStats:', err);
        return { total: 0, active: 0, disabled: 0 };
    }
}

export const adminService = {
    isAdmin,
    getAllUsers,
    updateUserRole,
    setUserDisabled,
    getUserStats,
};

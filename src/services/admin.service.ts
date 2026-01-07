import { supabase, getCurrentUser } from '../lib/supabase';
import { UserProfile } from '../types';

export interface AdminUser extends UserProfile {
    is_disabled: boolean;
    created_at: string;
    updated_at: string;
    last_sign_in?: string;
}

/**
 * Check if current user is admin (Executive role)
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
    return data.role === 'Executive';
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<AdminUser[]> {
    if (!supabase) return [];

    // Check admin permission
    const admin = await isAdmin();
    if (!admin) {
        console.error('[Admin] Access denied - not an admin');
        return [];
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[Admin] Get users failed:', error);
        return [];
    }

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
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId: string, role: string): Promise<boolean> {
    if (!supabase) return false;

    const admin = await isAdmin();
    if (!admin) {
        console.error('[Admin] Access denied');
        return false;
    }

    const { error } = await supabase
        .from('profiles')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', userId);

    if (error) {
        console.error('[Admin] Update role failed:', error);
        return false;
    }

    return true;
}

/**
 * Enable/disable user account (admin only)
 */
export async function setUserDisabled(userId: string, disabled: boolean): Promise<boolean> {
    if (!supabase) return false;

    const admin = await isAdmin();
    if (!admin) {
        console.error('[Admin] Access denied');
        return false;
    }

    const { error } = await supabase
        .from('profiles')
        .update({ is_disabled: disabled, updated_at: new Date().toISOString() })
        .eq('id', userId);

    if (error) {
        console.error('[Admin] Set disabled failed:', error);
        return false;
    }

    return true;
}

/**
 * Get user count statistics (admin only)
 */
export async function getUserStats(): Promise<{ total: number; active: number; disabled: number }> {
    if (!supabase) return { total: 0, active: 0, disabled: 0 };

    const admin = await isAdmin();
    if (!admin) return { total: 0, active: 0, disabled: 0 };

    const { data, error } = await supabase
        .from('profiles')
        .select('is_disabled');

    if (error || !data) return { total: 0, active: 0, disabled: 0 };

    const total = data.length;
    const disabled = data.filter(u => u.is_disabled).length;
    const active = total - disabled;

    return { total, active, disabled };
}

export const adminService = {
    isAdmin,
    getAllUsers,
    updateUserRole,
    setUserDisabled,
    getUserStats,
};

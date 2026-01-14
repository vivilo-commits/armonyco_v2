import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export type OrgRole = 'Admin' | 'User' | 'Collaborator' | 'AppAdmin' | null;

export interface UsePermissionsReturn {
  // Current state
  currentOrgRole: OrgRole;
  currentOrgId: string | null;
  loading: boolean;
  
  // Role checks - NOW BOOLEANS (not functions)
  isOrgAdmin: boolean;
  isOrgUser: boolean;
  isOrgCollaborator: boolean;
  isAppAdmin: boolean; // Check if user has AppAdmin role in profiles table
  
  // Permission checks - NOW BOOLEANS (not functions)
  canManageMembers: boolean;
  canEditOrganization: boolean;
  canViewAllStats: boolean;
  canEditOwnProfile: boolean;
  
  // Simplified permission checks - NOW BOOLEANS (not functions)
  canEdit: boolean; // Admin and User can edit (not Collaborator)
  canDelete: boolean; // Only Admin can delete
  isReadOnly: boolean; // Collaborator is read-only
  
  // SuperAdmin-specific permissions - NOW BOOLEANS (not functions)
  canViewAllOrgs: boolean; // Can see all organizations
  canImpersonate: boolean; // Can impersonate users/orgs
  canAccessSystemSettings: boolean; // System-wide settings
  
  // Utilities (functions are ok for these)
  hasAccessToOrganization: (orgId: string) => Promise<boolean>;
  getUserRoleInOrg: (orgId: string) => Promise<OrgRole>;
  
  // Reload function
  reload: () => Promise<void>;
}

/**
 * Hook to manage organization-based permissions
 * Uses organization_members table to determine user's role in their organization
 * 
 * ✅ FIXED: Returns STABLE memoized values instead of functions
 * This prevents infinite re-render loops
 */
export function usePermissions(): UsePermissionsReturn {
  const { user, profile } = useAuth();
  
  const [currentOrgId, setCurrentOrgId] = useState<string | null>(null);
  const [currentOrgRole, setCurrentOrgRole] = useState<OrgRole>(null);
  const [loading, setLoading] = useState(true);

  // ========================================
  // useEffect: Load organization ONCE
  // ========================================
  useEffect(() => {
    console.log('[usePermissions] ⚡ useEffect triggered - userId:', user?.id, 'profileRole:', profile?.role);
    
    if (!user?.id) {
      console.log('[usePermissions] No user, setting loading=false');
      setLoading(false);
      setCurrentOrgId(null);
      setCurrentOrgRole(null);
      return;
    }

    // ✅ SuperAdmin: Skip org loading
    if (profile?.role === 'AppAdmin') {
      console.log('[usePermissions] 👑 SuperAdmin detected - skipping org load');
      setCurrentOrgId(null);
      setCurrentOrgRole('AppAdmin');
      setLoading(false);
      return;
    }

    // Normal user: Load org
    console.log('[usePermissions] Loading organization for normal user');
    let isMounted = true;

    async function loadOrg() {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from('organization_members')
          .select('organization_id, role')
          .eq('user_id', user.id)
          .limit(1)
          .single();

        if (!isMounted) return;

        if (error) {
          if (error.code === 'PGRST116') {
            console.log('[usePermissions] ℹ️ User not member of any organization (ok)');
          } else {
            console.error('[usePermissions] ❌ Error loading org:', error.message);
          }
          setCurrentOrgId(null);
          setCurrentOrgRole(null);
        } else if (data) {
          console.log('[usePermissions] ✅ Org loaded:', data.organization_id, 'role:', data.role);
          setCurrentOrgId(data.organization_id);
          setCurrentOrgRole(data.role as OrgRole);
        } else {
          console.log('[usePermissions] ℹ️ No org found');
          setCurrentOrgId(null);
          setCurrentOrgRole(null);
        }
      } catch (err) {
        console.error('[usePermissions] ❌ Error in loadOrg:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOrg();

    return () => {
      console.log('[usePermissions] 🧹 Cleanup');
      isMounted = false;
    };
  }, [user?.id, profile?.role]); // ✅ ONLY primitives as dependencies

  // ========================================
  // useMemo: STABLE boolean values
  // ========================================
  
  // Role checks
  const isAppAdmin = useMemo(() => {
    const result = profile?.role === 'AppAdmin';
    console.log('[usePermissions] 🔍 isAppAdmin computed:', result);
    return result;
  }, [profile?.role]);

  const isOrgAdmin = useMemo(() => {
    return currentOrgRole === 'Admin';
  }, [currentOrgRole]);

  const isOrgUser = useMemo(() => {
    return currentOrgRole === 'User';
  }, [currentOrgRole]);

  const isOrgCollaborator = useMemo(() => {
    return currentOrgRole === 'Collaborator';
  }, [currentOrgRole]);

  // ========================================
  // useMemo: STABLE permission values
  // ========================================
  
  const canManageMembers = useMemo(() => {
    return isAppAdmin || isOrgAdmin;
  }, [isAppAdmin, isOrgAdmin]);

  const canEditOrganization = useMemo(() => {
    return isAppAdmin || isOrgAdmin;
  }, [isAppAdmin, isOrgAdmin]);

  const canViewAllStats = useMemo(() => {
    return isAppAdmin || isOrgAdmin || isOrgCollaborator;
  }, [isAppAdmin, isOrgAdmin, isOrgCollaborator]);

  const canEditOwnProfile = useMemo(() => {
    return true; // Everyone can edit their own profile
  }, []);

  const canEdit = useMemo(() => {
    return isAppAdmin || !isOrgCollaborator;
  }, [isAppAdmin, isOrgCollaborator]);

  const canDelete = useMemo(() => {
    return isAppAdmin || isOrgAdmin;
  }, [isAppAdmin, isOrgAdmin]);

  const isReadOnly = useMemo(() => {
    return !isAppAdmin && isOrgCollaborator;
  }, [isAppAdmin, isOrgCollaborator]);

  const canViewAllOrgs = useMemo(() => {
    return isAppAdmin;
  }, [isAppAdmin]);

  const canImpersonate = useMemo(() => {
    return isAppAdmin;
  }, [isAppAdmin]);

  const canAccessSystemSettings = useMemo(() => {
    return isAppAdmin;
  }, [isAppAdmin]);

  // ========================================
  // Functions (these are OK as callbacks)
  // ========================================
  
  const hasAccessToOrganization = async (orgId: string): Promise<boolean> => {
    if (!supabase || !user?.id) return false;

    // SuperAdmin has access to all orgs
    if (isAppAdmin) return true;

    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select('id')
        .eq('user_id', user.id)
        .eq('organization_id', orgId)
        .single();

      return !!data && !error;
    } catch (error) {
      console.error('[usePermissions] Error checking org access:', error);
      return false;
    }
  };

  const getUserRoleInOrg = async (orgId: string): Promise<OrgRole> => {
    if (!supabase || !user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select('role')
        .eq('user_id', user.id)
        .eq('organization_id', orgId)
        .single();

      if (error || !data) return null;
      return data.role as OrgRole;
    } catch (error) {
      console.error('[usePermissions] Error getting role in org:', error);
      return null;
    }
  };

  const reload = async () => {
    console.log('[usePermissions] Manual reload requested');
    setLoading(true);
    
    if (!user?.id) {
      setLoading(false);
      return;
    }

    if (profile?.role === 'AppAdmin') {
      setCurrentOrgId(null);
      setCurrentOrgRole('AppAdmin');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('organization_members')
        .select('organization_id, role')
        .eq('user_id', user.id)
        .limit(1)
        .single();

      if (error) {
        setCurrentOrgId(null);
        setCurrentOrgRole(null);
      } else if (data) {
        setCurrentOrgId(data.organization_id);
        setCurrentOrgRole(data.role as OrgRole);
      }
    } catch (err) {
      console.error('[usePermissions] Error in reload:', err);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Return: STABLE values (not functions)
  // ========================================
  return {
    currentOrgRole,
    currentOrgId,
    loading,
    // ✅ Booleans directly (NOT functions)
    isOrgAdmin,
    isOrgUser,
    isOrgCollaborator,
    isAppAdmin,
    // ✅ Permission booleans
    canManageMembers,
    canEditOrganization,
    canViewAllStats,
    canEditOwnProfile,
    canEdit,
    canDelete,
    isReadOnly,
    canViewAllOrgs,
    canImpersonate,
    canAccessSystemSettings,
    // Functions (these are OK)
    hasAccessToOrganization,
    getUserRoleInOrg,
    reload,
  };
}

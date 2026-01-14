import { supabase } from '../lib/supabase';

// ✅ CORRECT: Role types with capital letters as per database schema
export type OrganizationRole = 'Admin' | 'User' | 'Collaborator';

export interface OrganizationMember {
  id: string;
  organization_id: string; // ✅ CORRECT: Column name WITH underscore
  user_id: string; // ✅ CORRECT: Column name WITH underscore
  role: OrganizationRole;
  created_at: string;
  profiles?: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

/**
 * Organization Service
 * Manages organization members and their roles
 */
export const organizationService = {
  /**
   * Get all members of an organization
   */
  async getOrganizationMembers(orgId: string): Promise<OrganizationMember[]> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('organization_members')
      .select(`
        id,
        user_id,
        organization_id,
        role,
        created_at,
        profiles!user_id (
          email,
          first_name,
          last_name
        )
      `)
      .eq('organization_id', orgId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[OrgService] Error fetching members:', error);
      throw error;
    }

    return (data || []) as any; // Type assertion needed due to Supabase join
  },

  /**
   * Add a new member to an organization
   * Only callable by Admin users (enforced at UI level)
   */
  async addMember(
    orgId: string,
    userId: string,
    role: OrganizationRole
  ): Promise<OrganizationMember> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('organization_members')
      .insert({
        organization_id: orgId,
        user_id: userId,
        role: role,
      })
      .select()
      .single();

    if (error) {
      console.error('[OrgService] Error adding member:', error);
      throw error;
    }

    console.log('[OrgService] Member added successfully:', data);
    return data;
  },

  /**
   * Remove a member from an organization
   * Only callable by Admin users (enforced at UI level)
   */
  async removeMember(memberId: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('organization_members')
      .delete()
      .eq('id', memberId);

    if (error) {
      console.error('[OrgService] Error removing member:', error);
      throw error;
    }

    console.log('[OrgService] Member removed successfully');
  },

  /**
   * Update a member's role
   * Only callable by Admin users (enforced at UI level)
   */
  async updateMemberRole(memberId: string, newRole: OrganizationRole): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('organization_members')
      .update({ role: newRole })
      .eq('id', memberId);

    if (error) {
      console.error('[OrgService] Error updating member role:', error);
      throw error;
    }

    console.log('[OrgService] Member role updated successfully to:', newRole);
  },

  /**
   * Check if a user is a member of an organization
   */
  async isMember(orgId: string, userId: string): Promise<boolean> {
    if (!supabase) {
      return false;
    }

    const { data, error } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', orgId)
      .eq('user_id', userId)
      .single();

    if (error) {
      return false;
    }

    return !!data;
  },

  /**
   * Get a specific member's details
   */
  async getMember(memberId: string): Promise<OrganizationMember | null> {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('organization_members')
      .select(`
        id,
        user_id,
        organization_id,
        role,
        created_at,
        profiles!user_id (
          email,
          first_name,
          last_name
        )
      `)
      .eq('id', memberId)
      .single();

    if (error) {
      console.error('[OrgService] Error fetching member:', error);
      return null;
    }

    return data as any; // Type assertion needed due to Supabase join
  },

  /**
   * Get user's role in a specific organization
   */
  async getUserRoleInOrg(orgId: string, userId: string): Promise<OrganizationRole | null> {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase
      .from('organization_members')
      .select('role')
      .eq('organization_id', orgId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.role as OrganizationRole;
  },

  /**
   * Count members in an organization
   */
  async getMemberCount(orgId: string): Promise<number> {
    if (!supabase) {
      return 0;
    }

    const { count, error } = await supabase
      .from('organization_members')
      .select('*', { count: 'exact', head: true })
      .eq('organization_id', orgId);

    if (error) {
      console.error('[OrgService] Error counting members:', error);
      return 0;
    }

    return count || 0;
  },
};

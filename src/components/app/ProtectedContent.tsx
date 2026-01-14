import React from 'react';
import { usePermissions, OrgRole } from '../../hooks/usePermissions';

interface ProtectedContentProps {
  children: React.ReactNode;
  requiredRole?: OrgRole;
  requireAdmin?: boolean;
  requireCollaborator?: boolean;
  hideForReadOnly?: boolean; // Hide content for Collaborators (read-only users)
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

/**
 * ProtectedContent Component
 * Conditionally renders content based on user's organization role and permissions
 * 
 * Usage:
 * <ProtectedContent requireAdmin>
 *   <button>Delete User</button>
 * </ProtectedContent>
 * 
 * <ProtectedContent hideForReadOnly>
 *   <button>Modifica</button>
 * </ProtectedContent>
 * 
 * <ProtectedContent requireCollaborator fallback={<p>Access denied</p>}>
 *   <OrganizationStats />
 * </ProtectedContent>
 */
export const ProtectedContent: React.FC<ProtectedContentProps> = ({
  children,
  requiredRole,
  requireAdmin = false,
  requireCollaborator = false,
  hideForReadOnly = false,
  fallback = null,
  loadingFallback = null,
}) => {
  const { currentOrgRole, loading, isReadOnly } = usePermissions();

  // Show loading state if still fetching permissions
  if (loading) {
    return <>{loadingFallback}</>;
  }

  // Check if user has no organization role
  if (!currentOrgRole) {
    return <>{fallback}</>;
  }

  // Check specific role requirement
  if (requiredRole && currentOrgRole !== requiredRole) {
    return <>{fallback}</>;
  }

  // Check admin requirement
  if (requireAdmin && currentOrgRole !== 'Admin') {
    return <>{fallback}</>;
  }

  // Check collaborator requirement (Admin or Collaborator can access)
  if (requireCollaborator && !['Admin', 'Collaborator'].includes(currentOrgRole)) {
    return <>{fallback}</>;
  }

  // Hide for read-only users (Collaborators)
  if (hideForReadOnly && isReadOnly) {
    return <>{fallback}</>;
  }

  // User has required permissions, render children
  return <>{children}</>;
};

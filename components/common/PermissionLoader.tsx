import React from 'react';

/**
 * PermissionLoader Component
 * Shows a loading spinner while permissions are being checked
 * 
 * Usage:
 * if (permissionsLoading) {
 *   return <PermissionLoader />;
 * }
 */
export const PermissionLoader: React.FC = () => {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[var(--color-brand-accent)]/30 border-t-[var(--color-brand-accent)] rounded-full animate-spin" />
        <span className="text-zinc-400 text-sm">Checking permissions...</span>
      </div>
    </div>
  );
};

import React from 'react';
import { Shield, AlertTriangle } from '../../../components/ui/Icons';
import { Button } from '../../../components/ui/Button';

interface UnauthorizedViewProps {
  message?: string;
  title?: string;
  showBackButton?: boolean;
}

/**
 * UnauthorizedView Component
 * Displays a styled message when user doesn't have permission to access a page/feature
 * 
 * Usage:
 * <UnauthorizedView message="Only Admins can manage users" />
 */
export const UnauthorizedView: React.FC<UnauthorizedViewProps> = ({
  message = 'You do not have permission to access this page',
  title = 'Access Denied',
  showBackButton = true,
}) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 animate-fade-in">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center mb-6">
        <Shield size={48} className="text-red-500" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-bold text-[var(--color-text-main)] mb-3 text-center">
        {title}
      </h1>

      {/* Message */}
      <p className="text-[var(--color-text-muted)] text-center max-w-md mb-8 leading-relaxed">
        {message}
      </p>

      {/* Info Box */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 max-w-md mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[var(--color-text-muted)]">
            <p className="font-semibold text-amber-500 mb-1">Permissions Required</p>
            <p>
              This section requires special permissions. Contact your organization 
              administrator if you think you should have access.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {showBackButton && (
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleBack}
          >
            Go Back
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/app/dashboard'}
          >
            Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

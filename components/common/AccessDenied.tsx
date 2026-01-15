import React from 'react';
import { Shield } from '../ui/Icons';
import { Button } from '../ui/Button';

interface AccessDeniedProps {
  message?: string;
  title?: string;
  onBack?: () => void;
}

/**
 * AccessDenied Component
 * Displays a styled message when user doesn't have permission to access a page/feature
 * 
 * Usage:
 * if (!isOrgAdmin) {
 *   return <AccessDenied message="Only admins can invite members" />;
 * }
 */
export const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = "You don't have permission to access this page.",
  title = 'Access Denied',
  onBack,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-6 animate-fade-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center">
          <Shield size={40} className="text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-zinc-400 leading-relaxed">{message}</p>
        <button
          onClick={handleBack}
          className="px-6 py-3 bg-[var(--color-brand-accent)] text-black rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-white transition-all"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

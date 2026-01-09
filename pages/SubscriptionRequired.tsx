import React from 'react';
import { AlertTriangle, CreditCard, Mail, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { supabase } from '../src/lib/supabase';
import { checkSubscriptionStatus } from '../src/middleware/subscription-check';

interface SubscriptionRequiredProps {
  message?: string;
  status?: string;
  onReturnToApp?: () => void;
  onGoToSettings?: () => void;
  onGoToSupport?: () => void;
  onLogout?: () => void;
}

/**
 * Subscription Required Page
 * Displayed when user's subscription is not active (suspended, expired, cancelled, etc.)
 */
export const SubscriptionRequired: React.FC<SubscriptionRequiredProps> = ({
  message: initialMessage,
  status: initialStatus,
  onReturnToApp,
  onGoToSettings,
  onGoToSupport,
  onLogout
}) => {
  const [message, setMessage] = React.useState<string>(
    initialMessage || 'Your subscription is not active'
  );
  const [status, setStatus] = React.useState<string>(initialStatus || 'none');
  const [isChecking, setIsChecking] = React.useState(false);

  // Check subscription status on mount
  React.useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        onLogout?.();
        return;
      }

      const result = await checkSubscriptionStatus(user.id);
      setStatus(result.status);
      
      // If subscription is now active, return to app
      if (result.active && result.status === 'active') {
        onReturnToApp?.();
        return;
      }
      
      // Update message if available
      if (result.message) {
        setMessage(result.message);
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleRefresh = async () => {
    setIsChecking(true);
    await checkStatus();
    setIsChecking(false);
  };

  const handleUpdatePayment = () => {
    // Navigate to settings billing tab
    onGoToSettings?.();
  };

  const handleContactSupport = () => {
    // Navigate to support page
    onGoToSupport?.();
  };

  const handleReturnHome = () => {
    onLogout?.();
  };

  // Determine icon and color based on status
  const getStatusIcon = () => {
    switch (status) {
      case 'suspended':
      case 'expired':
        return <AlertTriangle className="w-16 h-16 text-red-500" />;
      case 'past_due':
        return <AlertTriangle className="w-16 h-16 text-yellow-500" />;
      case 'cancelled':
        return <AlertTriangle className="w-16 h-16 text-gray-500" />;
      default:
        return <AlertTriangle className="w-16 h-16 text-orange-500" />;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'suspended':
        return 'Account Suspended';
      case 'expired':
        return 'Subscription Expired';
      case 'past_due':
        return 'Payment Issue';
      case 'cancelled':
        return 'Subscription Cancelled';
      case 'none':
        return 'No Active Subscription';
      default:
        return 'Subscription Required';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {getStatusIcon()}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center text-slate-900 mb-4">
          {getStatusTitle()}
        </h1>

        {/* Message */}
        <p className="text-center text-slate-600 mb-8 text-lg">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Primary action based on status */}
          {(status === 'suspended' || status === 'past_due' || status === 'expired') && (
            <Button
              onClick={handleUpdatePayment}
              className="w-full"
              size="lg"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Update Payment Method
            </Button>
          )}

          {status === 'cancelled' && (
            <Button
              onClick={handleUpdatePayment}
              className="w-full"
              size="lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Renew Subscription
            </Button>
          )}

          {status === 'none' && (
            <Button
              onClick={handleReturnHome}
              className="w-full"
              size="lg"
            >
              View Plans
            </Button>
          )}

          {/* Refresh status button */}
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="w-full"
            disabled={isChecking}
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Refresh Status'}
          </Button>

          {/* Contact support */}
          <Button
            onClick={handleContactSupport}
            variant="ghost"
            className="w-full"
          >
            <Mail className="w-5 h-5 mr-2" />
            Contact Support
          </Button>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-slate-200" />

        {/* Secondary actions */}
        <div className="text-center">
          <button
            onClick={handleReturnHome}
            className="text-slate-600 hover:text-slate-900 text-sm"
          >
            Return to Homepage
          </button>
        </div>

        {/* Additional info */}
        {status === 'suspended' && (
          <div className="mt-8 p-4 bg-red-50 rounded-lg border border-red-200">
            <h3 className="font-semibold text-red-900 mb-2">Account Suspended</h3>
            <p className="text-sm text-red-700">
              Your account has been suspended due to multiple payment failures. 
              Please update your payment method or contact support to restore access.
            </p>
          </div>
        )}

        {status === 'past_due' && (
          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-900 mb-2">Payment Issue</h3>
            <p className="text-sm text-yellow-700">
              Your last payment attempt failed. Please update your payment method 
              to avoid service interruption.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SubscriptionRequired;

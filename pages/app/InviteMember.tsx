import React, { useState } from 'react';
import { Users, Plus, AlertCircle, CheckCircle, Info, Copy } from '../../components/ui/Icons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FloatingInput } from '../../components/ui/FloatingInput';
import { usePermissions } from '../../src/hooks/usePermissions';
import { useAuth } from '../../src/context/AuthContext';
import { PermissionLoader } from '../../components/common/PermissionLoader';
import { AccessDenied } from '../../components/common/AccessDenied';

interface InviteMemberProps {
  onBack?: () => void;
}

export const InviteMember: React.FC<InviteMemberProps> = ({ onBack }) => {
  const { canManageMembers, currentOrgId, loading: permissionsLoading } = usePermissions();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  const [invitedEmail, setInvitedEmail] = useState('');
  const [existingUser, setExistingUser] = useState(false);

  // Show loading while permissions are being checked
  if (permissionsLoading) {
    return <PermissionLoader />;
  }

  // Check permissions only after loading is complete
  if (!canManageMembers) {
    return (
      <AccessDenied
        message="Only organization Admins can invite members."
        title="Access Denied"
        onBack={onBack}
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    setError('');
    setSuccess(false);
    setTempPassword('');
    setExistingUser(false);

    try {
      const response = await fetch('/api/organization/invite-collaborator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          phone,
          organizationId: currentOrgId,
          invitedBy: user?.id,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error while inviting collaborator');
      }

      // Success!
      setSuccess(true);
      setInvitedEmail(email);
      setTempPassword(result.tempPassword || '');
      setExistingUser(result.existingUser || false);

      // Reset form
      setEmail('');
      setFirstName('');
      setLastName('');
      setPhone('');

      // Auto-hide success message after 30 seconds
      setTimeout(() => {
        setSuccess(false);
        setTempPassword('');
      }, 30000);

    } catch (err: any) {
      setError(err.message || 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <Users className="text-[var(--color-brand-accent)] w-6 h-6" />
              <Plus className="absolute -bottom-1 -right-1 w-3 h-3 text-emerald-500 bg-black rounded-full" />
            </div>
            <h1 className="text-2xl font-light text-white uppercase tracking-tight">
              Invite Collaborator
            </h1>
          </div>
          <p className="text-zinc-500 text-sm">
            Add a new member to your organization
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
            <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-bold text-sm mb-1">Error</p>
              <p className="text-red-300/80 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl p-6 animate-fade-in">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle size={24} className="text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-emerald-400 font-bold text-lg mb-1">
                  {existingUser ? 'User Added!' : 'Invitation Sent!'}
                </p>
                <p className="text-emerald-300/80 text-sm">
                  {existingUser 
                    ? `User ${invitedEmail} has been added to your organization as a Collaborator.`
                    : `We created an account for ${invitedEmail} and added them to your organization.`
                  }
                </p>
              </div>
            </div>

            {/* Temporary Password Box */}
            {tempPassword && !existingUser && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg border border-emerald-500/30">
                <p className="text-xs text-emerald-400 font-bold mb-2">⚠️ TEMPORARY PASSWORD</p>
                <div className="flex items-center gap-2 mb-3">
                  <code className="flex-1 px-3 py-2 bg-black/40 rounded text-white font-mono text-sm border border-white/10">
                    {tempPassword}
                  </code>
                  <button
                    onClick={() => copyToClipboard(tempPassword)}
                    className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded transition-colors"
                    title="Copy password"
                  >
                    <Copy size={16} className="text-emerald-400" />
                  </button>
                </div>
                <div className="text-xs text-zinc-400 space-y-1">
                  <p>✓ Share this password securely with the collaborator</p>
                  <p>✓ User must change it on first login</p>
                  <p>✓ Email: <span className="text-white font-mono">{invitedEmail}</span></p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Info Box */}
        <Card variant="dark" padding="lg" className="mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-zinc-300">
              <p className="font-bold text-blue-400 mb-2">📝 How it works</p>
              <ol className="list-decimal list-inside space-y-2 text-zinc-400">
                <li>Enter the collaborator's details in the form below</li>
                <li>The system automatically creates the account and adds it to your organization</li>
                <li>The collaborator will receive a temporary password to change on first login</li>
                <li>The collaborator will have read-only access to the organization's data</li>
              </ol>
            </div>
          </div>
        </Card>

        {/* Form */}
        <Card variant="dark" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FloatingInput
              label="Email *"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="collaborator@example.com"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingInput
                label="First Name *"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                disabled={loading}
              />

              <FloatingInput
                label="Last Name *"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
                disabled={loading}
              />
            </div>

            <FloatingInput
              label="Phone (optional)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+39 123 456 7890"
              disabled={loading}
            />

            {/* Organization Info */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-zinc-500 mb-1">Organization</p>
              <p className="text-sm font-mono text-white">{currentOrgId || 'Not available'}</p>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              leftIcon={<Users size={18} />}
              disabled={loading || !currentOrgId}
            >
              {loading ? 'Sending...' : 'Send Invitation'}
            </Button>
          </form>
        </Card>

        {/* Additional Info */}
        <Card variant="dark" padding="md" className="mt-6">
          <div className="text-xs text-zinc-500">
            <p className="font-bold text-zinc-400 mb-2">ℹ️ Role Information</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong className="text-zinc-300">Collaborator:</strong> Read-only access to organization data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong className="text-zinc-300">User:</strong> Can view and edit data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong className="text-zinc-300">Admin:</strong> Full control of the organization</span>
              </li>
            </ul>
            <p className="mt-3 text-zinc-600">
              You can modify member roles from the "Manage Members" page
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

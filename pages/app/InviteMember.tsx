import React, { useState } from 'react';
import { Users, Plus, AlertCircle, CheckCircle, Info, Copy } from '../../components/ui/Icons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FloatingInput } from '../../components/ui/FloatingInput';
import { usePermissions } from '../../src/hooks/usePermissions';
import { useAuth } from '../../src/context/AuthContext';

interface InviteMemberProps {
  onBack?: () => void;
}

export const InviteMember: React.FC<InviteMemberProps> = ({ onBack }) => {
  const { canManageMembers, currentOrgId } = usePermissions();
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

  if (!canManageMembers) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <Card padding="lg" className="max-w-md text-center">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Accesso Negato</h2>
          <p className="text-zinc-400">
            Solo gli Admin dell'organizzazione possono invitare membri.
          </p>
        </Card>
      </div>
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
        throw new Error(result.error || 'Errore durante l\'invito del collaboratore');
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
              Invita Collaboratore
            </h1>
          </div>
          <p className="text-zinc-500 text-sm">
            Aggiungi un nuovo membro alla tua organizzazione
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
            <AlertCircle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-400 font-bold text-sm mb-1">Errore</p>
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
                  {existingUser ? 'Utente Aggiunto!' : 'Invito Inviato!'}
                </p>
                <p className="text-emerald-300/80 text-sm">
                  {existingUser 
                    ? `L'utente ${invitedEmail} è stato aggiunto alla tua organizzazione come Collaboratore.`
                    : `Abbiamo creato l'account per ${invitedEmail} e aggiunto alla tua organizzazione.`
                  }
                </p>
              </div>
            </div>

            {/* Temporary Password Box */}
            {tempPassword && !existingUser && (
              <div className="mt-4 p-4 bg-white/5 rounded-lg border border-emerald-500/30">
                <p className="text-xs text-emerald-400 font-bold mb-2">⚠️ PASSWORD TEMPORANEA</p>
                <div className="flex items-center gap-2 mb-3">
                  <code className="flex-1 px-3 py-2 bg-black/40 rounded text-white font-mono text-sm border border-white/10">
                    {tempPassword}
                  </code>
                  <button
                    onClick={() => copyToClipboard(tempPassword)}
                    className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded transition-colors"
                    title="Copia password"
                  >
                    <Copy size={16} className="text-emerald-400" />
                  </button>
                </div>
                <div className="text-xs text-zinc-400 space-y-1">
                  <p>✓ Condividi questa password in modo sicuro con il collaboratore</p>
                  <p>✓ L'utente dovrà cambiarla al primo accesso</p>
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
              <p className="font-bold text-blue-400 mb-2">📝 Come funziona</p>
              <ol className="list-decimal list-inside space-y-2 text-zinc-400">
                <li>Inserisci i dati del collaboratore nel form qui sotto</li>
                <li>Il sistema crea automaticamente l'account e lo aggiunge alla tua organizzazione</li>
                <li>Il collaboratore riceverà una password temporanea da cambiare al primo accesso</li>
                <li>Il collaboratore avrà accesso in sola lettura ai dati dell'organizzazione</li>
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
              placeholder="collaboratore@example.com"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FloatingInput
                label="Nome *"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Mario"
                required
                disabled={loading}
              />

              <FloatingInput
                label="Cognome *"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Rossi"
                required
                disabled={loading}
              />
            </div>

            <FloatingInput
              label="Telefono (opzionale)"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+39 123 456 7890"
              disabled={loading}
            />

            {/* Organization Info */}
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs text-zinc-500 mb-1">Organizzazione</p>
              <p className="text-sm font-mono text-white">{currentOrgId || 'Non disponibile'}</p>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              leftIcon={<Users size={18} />}
              disabled={loading || !currentOrgId}
            >
              {loading ? 'Invio in corso...' : 'Invia Invito'}
            </Button>
          </form>
        </Card>

        {/* Additional Info */}
        <Card variant="dark" padding="md" className="mt-6">
          <div className="text-xs text-zinc-500">
            <p className="font-bold text-zinc-400 mb-2">ℹ️ Informazioni sui Ruoli</p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong className="text-zinc-300">Collaborator:</strong> Accesso in sola lettura ai dati dell'organizzazione</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span><strong className="text-zinc-300">User:</strong> Può visualizzare e modificare dati</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span><strong className="text-zinc-300">Admin:</strong> Pieno controllo dell'organizzazione</span>
              </li>
            </ul>
            <p className="mt-3 text-zinc-600">
              Puoi modificare i ruoli dei membri dalla pagina "Gestione Membri"
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

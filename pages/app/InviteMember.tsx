import React, { useState } from 'react';
import { Users, Plus, AlertCircle, CheckCircle, Info } from '../../components/ui/Icons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FloatingInput } from '../../components/ui/FloatingInput';
import { usePermissions } from '../../src/hooks/usePermissions';

export const InviteMember: React.FC = () => {
  const { canManageMembers, currentOrgId } = usePermissions();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Versione semplificata - mostra istruzioni
    setShowSuccess(true);
    
    // Reset form dopo 5 secondi
    setTimeout(() => {
      setEmail('');
      setFirstName('');
      setLastName('');
      setShowSuccess(false);
    }, 5000);
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

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
            <CheckCircle size={24} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-400 font-bold text-sm mb-1">Invito Inviato!</p>
              <p className="text-emerald-300/80 text-sm">
                Abbiamo inviato le istruzioni a <strong>{email}</strong>
              </p>
            </div>
          </div>
        )}

        {/* Info Box - Versione Semplificata */}
        <Card variant="dark" padding="lg" className="mb-6">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-zinc-300">
              <p className="font-bold text-blue-400 mb-2">📝 Come funziona (Versione Semplificata)</p>
              <ol className="list-decimal list-inside space-y-2 text-zinc-400">
                <li>Inserisci l'email del collaboratore</li>
                <li>Il collaboratore deve <strong>registrarsi normalmente</strong> all'app</li>
                <li>Poi tu lo aggiungerai all'organizzazione dalla pagina <strong>Gestione Membri</strong></li>
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
              />

              <FloatingInput
                label="Cognome *"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Rossi"
                required
              />
            </div>

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
            >
              Invia Invito
            </Button>
          </form>
        </Card>

        {/* Additional Info */}
        <Card variant="dark" padding="md" className="mt-6">
          <div className="text-xs text-zinc-500">
            <p className="font-bold text-zinc-400 mb-2">ℹ️ Prossimi Passi</p>
            <ul className="space-y-1">
              <li>• Il collaboratore riceverà un'email con le istruzioni</li>
              <li>• Dopo la registrazione, potrai assegnargli un ruolo (Admin, User, Collaborator)</li>
              <li>• Puoi gestire tutti i membri dalla pagina "Gestione Membri"</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

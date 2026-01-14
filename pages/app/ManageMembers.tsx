import React, { useState, useEffect } from 'react';
import { Users, Shield, UserPlus, Trash2, RefreshCw, AlertCircle, CheckCircle } from '../../components/ui/Icons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { usePermissions } from '../../src/hooks/usePermissions';
import { UnauthorizedView } from '../../src/components/app/UnauthorizedView';
import { organizationService, OrganizationMember, OrganizationRole } from '../../src/services/organization.service';

export const ManageMembers: React.FC = () => {
  const { canManageMembers, currentOrgId, loading: permissionsLoading } = usePermissions();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedMember, setSelectedMember] = useState<OrganizationMember | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'remove' | 'change-role' | null>(null);
  const [newRole, setNewRole] = useState<OrganizationRole>('User');

  // Load members
  const loadMembers = async () => {
    if (!currentOrgId) return;

    setIsLoading(true);
    try {
      const data = await organizationService.getOrganizationMembers(currentOrgId);
      setMembers(data);
      console.log('[ManageMembers] Loaded members:', data);
    } catch (error) {
      console.error('[ManageMembers] Error loading members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentOrgId && canManageMembers) {
      loadMembers();
    }
  }, [currentOrgId]);

  // Handle role change
  const handleChangeRole = async (member: OrganizationMember, role: OrganizationRole) => {
    setSelectedMember(member);
    setNewRole(role);
    setConfirmAction('change-role');
    setShowConfirmModal(true);
  };

  // Handle remove member
  const handleRemoveMember = (member: OrganizationMember) => {
    setSelectedMember(member);
    setConfirmAction('remove');
    setShowConfirmModal(true);
  };

  // Confirm action
  const confirmActionHandler = async () => {
    if (!selectedMember) return;

    setIsUpdating(true);
    try {
      if (confirmAction === 'change-role') {
        await organizationService.updateMemberRole(selectedMember.id, newRole);
        console.log('[ManageMembers] Role changed successfully');
      } else if (confirmAction === 'remove') {
        await organizationService.removeMember(selectedMember.id);
        console.log('[ManageMembers] Member removed successfully');
      }

      // Reload members
      await loadMembers();
      setShowConfirmModal(false);
      setSelectedMember(null);
    } catch (error) {
      console.error('[ManageMembers] Error performing action:', error);
      alert('Errore durante l\'operazione. Riprova.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Get role color
  const getRoleColor = (role: OrganizationRole) => {
    switch (role) {
      case 'Admin':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30';
      case 'User':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'Collaborator':
        return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-zinc-400 bg-zinc-400/10 border-zinc-400/30';
    }
  };

  // Show loading while checking permissions
  if (permissionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Only Admin can access this page
  if (!canManageMembers) {
    return (
      <UnauthorizedView
        message="Solo gli Admin dell'organizzazione possono gestire i membri"
        title="Accesso Limitato"
      />
    );
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Users className="text-[var(--color-brand-accent)] w-6 h-6" />
            <h1 className="text-3xl font-light text-white">Gestione Membri</h1>
          </div>
          <p className="text-zinc-500 text-sm">
            Gestisci i membri della tua organizzazione e i loro ruoli
          </p>
        </div>
        <Button leftIcon={<RefreshCw size={16} />} onClick={loadMembers} isLoading={isLoading}>
          Ricarica
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="dark" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                Totale Membri
              </p>
              <p className="text-3xl font-bold text-white">{members.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
              <Users size={24} className="text-zinc-400" />
            </div>
          </div>
        </Card>
        <Card variant="dark" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Admin</p>
              <p className="text-3xl font-bold text-emerald-500">
                {members.filter((m) => m.role === 'Admin').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Shield size={24} className="text-emerald-500" />
            </div>
          </div>
        </Card>
        <Card variant="dark" padding="lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                Users + Collaboratori
              </p>
              <p className="text-3xl font-bold text-blue-400">
                {members.filter((m) => m.role !== 'Admin').length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-400/10 flex items-center justify-center">
              <Users size={24} className="text-blue-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Members Table */}
      <Card variant="dark" padding="none" className="overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            <AlertCircle size={32} className="mx-auto mb-4 opacity-50" />
            <p>Nessun membro trovato</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                  Membro
                </th>
                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                  Ruolo
                </th>
                <th className="text-left px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                  Aggiunto il
                </th>
                <th className="text-right px-6 py-4 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
                  Azioni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                        {member.profiles?.first_name?.[0] || member.profiles?.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {member.profiles?.first_name} {member.profiles?.last_name}
                        </p>
                        <p className="text-xs text-zinc-500">{member.profiles?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={member.role}
                      onChange={(e) => handleChangeRole(member, e.target.value as OrganizationRole)}
                      disabled={isUpdating}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border outline-none cursor-pointer ${getRoleColor(
                        member.role
                      )}`}
                    >
                      <option value="Admin">Admin</option>
                      <option value="User">User</option>
                      <option value="Collaborator">Collaborator</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-400">
                      {new Date(member.created_at).toLocaleDateString('it-IT')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(member)}
                      isLoading={isUpdating}
                      leftIcon={<Trash2 size={14} />}
                      className="text-red-400 hover:bg-red-500/10"
                    >
                      Rimuovi
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Confirm Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => !isUpdating && setShowConfirmModal(false)}
        title={confirmAction === 'remove' ? 'Rimuovi Membro' : 'Cambia Ruolo'}
        width="md"
      >
        <div className="p-6">
          {confirmAction === 'remove' ? (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-zinc-300">
                  <p className="font-semibold text-red-400 mb-1">Attenzione</p>
                  <p>
                    Stai per rimuovere <strong>{selectedMember?.profiles?.email}</strong> dall'organizzazione.
                    Questa azione non può essere annullata.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <CheckCircle size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-zinc-300">
                  <p>
                    Stai per cambiare il ruolo di <strong>{selectedMember?.profiles?.email}</strong> da{' '}
                    <strong>{selectedMember?.role}</strong> a <strong>{newRole}</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => setShowConfirmModal(false)}
              disabled={isUpdating}
            >
              Annulla
            </Button>
            <Button
              variant={confirmAction === 'remove' ? 'secondary' : 'primary'}
              fullWidth
              onClick={confirmActionHandler}
              isLoading={isUpdating}
              className={confirmAction === 'remove' ? 'border-red-500/20 text-red-500 hover:bg-red-500/5' : ''}
            >
              {confirmAction === 'remove' ? 'Rimuovi' : 'Conferma'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';

export type ModuleSuite = 'GUEST' | 'REVENUE' | 'OPS' | 'RESPONSE';

interface ModuleListModalProps {
  isOpen: boolean;
  onClose: () => void;
  suite: ModuleSuite | null;
}

export const ModuleListModal: React.FC<ModuleListModalProps> = ({ isOpen, onClose, suite }) => {
  const { t } = useTranslation();
  if (!suite) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('ui.moduleList.title')}
      width="xl"
    >
      <div className="flex flex-col h-[70vh] md:h-auto">
        {/* Subtitle */}
        <div className="px-6 pb-6 pt-0 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <p className="text-[var(--color-text-muted)] text-sm">
            These modules can be Activated, Paused, or Locked (not purchased) in the Products area.
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 md:p-8 bg-[var(--color-background)]">

          {/* Group A: Guest Experience */}
          {suite === 'GUEST' && (
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 pb-4 border-b border-zinc-100">
                Guest Experience
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { code: 'CC-01', name: 'Pre-arrival Info' },
                  { code: 'CC-02', name: 'Check-in Instructions + Access' },
                  { code: 'CC-03', name: 'Wi-Fi & House Manual (Top FAQ)' },
                  { code: 'CC-04', name: 'Checkout Instructions + Deposits/Tax' },
                  { code: 'CC-05', name: 'Issue Triage' },
                  { code: 'CC-06', name: 'Multi-language + Brand Tone of Voice' }
                ].map(m => (
                  <div key={m.code} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-zinc-100 group hover:border-[var(--color-brand-accent)]/30 transition-all">
                    <span className="text-[10px] font-mono text-zinc-400 font-bold w-12">{m.code}</span>
                    <span className="text-sm text-zinc-900 font-medium">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group B: Revenue Generation */}
          {suite === 'REVENUE' && (
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 pb-4 border-b border-zinc-100">
                Revenue Generation
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { code: 'CC-07', name: 'Orphan Days / Stay Extension Offer' },
                  { code: 'CC-08', name: 'Late Check-in / Late Check-out Upsell' },
                  { code: 'CC-09', name: 'Transfer / Experience Upsell (1–2 max)' }
                ].map(m => (
                  <div key={m.code} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-zinc-100 group hover:border-[var(--color-brand-accent)]/30 transition-all">
                    <span className="text-[10px] font-mono text-zinc-400 font-bold w-12">{m.code}</span>
                    <span className="text-sm text-zinc-900 font-medium">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group C: Operational Efficiency */}
          {suite === 'OPS' && (
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 pb-4 border-b border-zinc-100">
                Operational Efficiency
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { code: 'CC-10', name: 'Maintenance Triage' },
                  { code: 'CC-11', name: 'Housekeeping Exceptions' },
                  { code: 'CC-12', name: 'Human Escalation Pack' }
                ].map(m => (
                  <div key={m.code} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-zinc-100 group hover:border-[var(--color-brand-accent)]/30 transition-all">
                    <span className="text-[10px] font-mono text-zinc-400 font-bold w-12">{m.code}</span>
                    <span className="text-sm text-zinc-900 font-medium">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group D: Incident Response */}
          {suite === 'RESPONSE' && (
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6 pb-4 border-b border-zinc-100">
                Incident Response
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { code: 'PB-01', name: 'Guest can’t enter (smart lock/keybox)' },
                  { code: 'PB-02', name: 'Wi-Fi not working' },
                  { code: 'PB-03', name: 'Noise / complaint' },
                  { code: 'PB-04', name: 'AC/Heating not working' },
                  { code: 'PB-05', name: 'No hot water' },
                  { code: 'PB-06', name: 'Cleaning not satisfactory' },
                  { code: 'PB-07', name: 'Early check-in request' },
                  { code: 'PB-08', name: 'Late checkout request' },
                  { code: 'PB-09', name: 'Missing payment / city tax' },
                  { code: 'PB-10', name: 'Missing ID / document' }
                ].map(m => (
                  <div key={m.code} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-zinc-100 group hover:border-[var(--color-brand-accent)]/30 transition-all">
                    <span className="text-[10px] font-mono text-zinc-400 font-bold w-12">{m.code}</span>
                    <span className="text-sm text-zinc-900 font-medium leading-tight">{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-[var(--color-border)] bg-[var(--color-surface)] text-center shrink-0 rounded-b-xl">
          <p className="text-xs text-[var(--color-text-subtle)] italic">
            Activation happens inside the app. This page describes the catalog only.
          </p>
        </div>
      </div>
    </Modal>
  );
};
import React from 'react';
import { Modal } from '../ui/Modal';

export type ModuleSuite = 'GUEST' | 'REVENUE' | 'OPS' | 'RESPONSE';

interface ModuleListModalProps {
  isOpen: boolean;
  onClose: () => void;
  suite: ModuleSuite | null;
}

export const ModuleListModal: React.FC<ModuleListModalProps> = ({ isOpen, onClose, suite }) => {
  if (!suite) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Modules available inside the app"
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
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] mb-4 pb-2 border-b border-[var(--color-border)]">
                Guest Experience
              </h3>
              <ul className="space-y-2.5 text-sm text-[var(--color-text-muted)] font-mono leading-relaxed">
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">CC-01</span> Pre-arrival Info</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">CC-02</span> Check-in Instructions + Access</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">CC-03</span> Wi-Fi & House Manual (Top FAQ)</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">CC-04</span> Checkout Instructions + Deposits/Tax</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">CC-05</span> Issue Triage</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">CC-06</span> Multi-language + Brand Tone of Voice</li>
              </ul>
            </div>
          )}

          {/* Group B: Revenue Generation */}
          {suite === 'REVENUE' && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] mb-4 pb-2 border-b border-[var(--color-border)]">
                Revenue Generation
              </h3>
              <ul className="space-y-2.5 text-sm text-[var(--color-text-muted)] font-mono leading-relaxed">
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">CC-07</span> Orphan Days / Stay Extension Offer</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">CC-08</span> Late Check-in / Late Check-out Upsell</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">CC-09</span> Transfer / Experience Upsell (1–2 max)</li>
              </ul>
            </div>
          )}

          {/* Group C: Operational Efficiency */}
          {suite === 'OPS' && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] mb-4 pb-2 border-b border-[var(--color-border)]">
                Operational Efficiency
              </h3>
              <ul className="space-y-2.5 text-sm text-[var(--color-text-muted)] font-mono leading-relaxed">
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">CC-10</span> Maintenance Triage</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">CC-11</span> Housekeeping Exceptions</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">CC-12</span> Human Escalation Pack</li>
              </ul>
            </div>
          )}

          {/* Group D: Incident Response */}
          {suite === 'RESPONSE' && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-main)] mb-4 pb-2 border-b border-[var(--color-border)]">
                Incident Response
              </h3>
              <ul className="space-y-2.5 text-sm text-[var(--color-text-muted)] font-mono leading-relaxed">
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">PB-01</span> Guest can’t enter (smart lock/keybox)</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">PB-02</span> Wi-Fi not working</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">PB-03</span> Noise / complaint</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">PB-04</span> AC/Heating not working</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">PB-05</span> No hot water</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">PB-06</span> Cleaning not satisfactory / missing towels</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">PB-07</span> Early check-in request</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">PB-08</span> Late checkout request</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">PB-09</span> Missing payment / city tax</li>
                <li><span className="text-[var(--color-text-subtle)] mr-2 select-none">PB-10</span> Missing ID / document not sent</li>
              </ul>
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
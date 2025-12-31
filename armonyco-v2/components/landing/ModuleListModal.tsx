import React, { useEffect } from 'react';
import { X } from '../ui/Icons';

export type ModuleSuite = 'GUEST' | 'REVENUE' | 'OPS' | 'RESPONSE';

interface ModuleListModalProps {
  isOpen: boolean;
  onClose: () => void;
  suite: ModuleSuite | null;
}

export const ModuleListModal: React.FC<ModuleListModalProps> = ({ isOpen, onClose, suite }) => {
  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !suite) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-900/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 border border-stone-200">
        
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-stone-100 flex justify-between items-start bg-white shrink-0">
          <div>
            <h2 className="text-2xl font-light text-stone-900 mb-2">Modules available inside the app</h2>
            <p className="text-stone-500 text-sm">
              These modules can be Activated, Paused, or Locked (not purchased) in the Products area.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-900 transition-colors p-2 -mr-2 -mt-2"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 bg-stone-50/50">
            
            {/* Group A: Guest Experience */}
            {suite === 'GUEST' && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Guest Experience
              </h3>
              <ul className="space-y-2.5 text-sm text-stone-600 font-mono leading-relaxed">
                <li><span className="text-stone-400 mr-2 select-none">CC-01</span> Pre-arrival Info</li>
                <li><span className="text-stone-400 mr-2 select-none">CC-02</span> Check-in Instructions + Access</li>
                <li><span className="text-stone-400 mr-2 select-none">CC-03</span> Wi-Fi & House Manual (Top FAQ)</li>
                <li><span className="text-stone-400 mr-2 select-none">CC-04</span> Checkout Instructions + Deposits/Tax</li>
                <li><span className="text-stone-400 mr-2 select-none">CC-05</span> Issue Triage</li>
                <li><span className="text-stone-400 mr-2 select-none">CC-06</span> Multi-language + Brand Tone of Voice</li>
              </ul>
            </div>
            )}

            {/* Group B: Revenue Generation */}
            {suite === 'REVENUE' && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Revenue Generation
              </h3>
              <ul className="space-y-2.5 text-sm text-stone-600 font-mono leading-relaxed">
                <li><span className="text-stone-400 mr-2 select-none">CC-07</span> Orphan Days / Stay Extension Offer</li>
                <li><span className="text-stone-400 mr-2 select-none">CC-08</span> Late Check-in / Late Check-out Upsell</li>
                <li><span className="text-stone-400 mr-2 select-none">CC-09</span> Transfer / Experience Upsell (1–2 max)</li>
              </ul>
            </div>
            )}

            {/* Group C: Operational Efficiency */}
            {suite === 'OPS' && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Operational Efficiency
              </h3>
              <ul className="space-y-2.5 text-sm text-stone-600 font-mono leading-relaxed">
                <li><span className="text-stone-400 mr-2 select-none">CC-10</span> Maintenance Triage</li>
                <li><span className="text-stone-400 mr-2 select-none">CC-11</span> Housekeeping Exceptions</li>
                <li><span className="text-stone-400 mr-2 select-none">CC-12</span> Human Escalation Pack</li>
              </ul>
            </div>
            )}

            {/* Group D: Incident Response */}
            {suite === 'RESPONSE' && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Incident Response
              </h3>
              <ul className="space-y-2.5 text-sm text-stone-600 font-mono leading-relaxed">
                <li><span className="text-stone-400 mr-2 select-none">PB-01</span> Guest can’t enter (smart lock/keybox)</li>
                <li><span className="text-stone-400 mr-2 select-none">PB-02</span> Wi-Fi not working</li>
                <li><span className="text-stone-400 mr-2 select-none">PB-03</span> Noise / complaint</li>
                <li><span className="text-stone-400 mr-2 select-none">PB-04</span> AC/Heating not working</li>
                <li><span className="text-stone-400 mr-2 select-none">PB-05</span> No hot water</li>
                <li><span className="text-stone-400 mr-2 select-none">PB-06</span> Cleaning not satisfactory / missing towels</li>
                <li><span className="text-stone-400 mr-2 select-none">PB-07</span> Early check-in request</li>
                <li><span className="text-stone-400 mr-2 select-none">PB-08</span> Late checkout request</li>
                <li><span className="text-stone-400 mr-2 select-none">PB-09</span> Missing payment / city tax</li>
                <li><span className="text-stone-400 mr-2 select-none">PB-10</span> Missing ID / document not sent</li>
              </ul>
            </div>
            )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-stone-100 bg-white text-center shrink-0">
          <p className="text-xs text-stone-400 italic">
            Activation happens inside the app. This page describes the catalog only.
          </p>
        </div>
      </div>
    </div>
  );
};
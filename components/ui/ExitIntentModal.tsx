import React, { useEffect, useState, useCallback } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertCircle } from './Icons';

interface ExitIntentModalProps {
    isEnabled: boolean;
    onSaveAndExit: () => void;
    onContinue: () => void;
    onExitWithoutSaving: () => void;
}

export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({
    isEnabled,
    onSaveAndExit,
    onContinue,
    onExitWithoutSaving,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hasShown, setHasShown] = useState(false);

    const handleMouseLeave = useCallback((e: MouseEvent) => {
        // Trigger solo se mouse esce verso l'alto (per chiudere tab)
        if (e.clientY <= 0 && !hasShown && isEnabled) {
            setIsOpen(true);
            setHasShown(true);
        }
    }, [hasShown, isEnabled]);

    useEffect(() => {
        if (isEnabled) {
            document.addEventListener('mouseout', handleMouseLeave);
        }

        return () => {
            document.removeEventListener('mouseout', handleMouseLeave);
        };
    }, [isEnabled, handleMouseLeave]);

    const handleSaveAndExit = () => {
        setIsOpen(false);
        onSaveAndExit();
    };

    const handleContinue = () => {
        setIsOpen(false);
        onContinue();
    };

    const handleExitWithoutSaving = () => {
        setIsOpen(false);
        onExitWithoutSaving();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleContinue}
            title="Stai abbandonando la registrazione"
            width="md"
            showCloseButton={false}
        >
            <div className="space-y-6 p-6">
                {/* Icona e messaggio */}
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <AlertCircle size={32} className="text-orange-400" />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">
                            Non perdere i tuoi progressi!
                        </h3>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            Hai compilato alcuni dati. Vuoi salvare i tuoi progressi 
                            per completare la registrazione in seguito?
                        </p>
                    </div>
                </div>

                {/* Features salvate */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                        Cosa viene salvato:
                    </p>
                    <ul className="space-y-2 text-sm text-[var(--color-text-main)]">
                        <li className="flex items-center gap-2">
                            <span className="text-emerald-400">✓</span>
                            Informazioni personali e aziendali
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-emerald-400">✓</span>
                            Piano selezionato
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-emerald-400">✓</span>
                            Valido per 24 ore
                        </li>
                    </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <Button
                        variant="primary"
                        onClick={handleContinue}
                        className="w-full"
                    >
                        Continua Registrazione
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={handleSaveAndExit}
                        className="w-full"
                    >
                        Salva e Esci
                    </Button>

                    <button
                        onClick={handleExitWithoutSaving}
                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
                    >
                        Esci senza salvare
                    </button>
                </div>
            </div>
        </Modal>
    );
};


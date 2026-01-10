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
        // Trigger only if mouse exits upward (to close tab)
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
            title="You are leaving the registration"
            width="md"
            showCloseButton={false}
        >
            <div className="space-y-6 p-6">
                {/* Icon and message */}
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <AlertCircle size={32} className="text-orange-400" />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-[var(--color-text-main)] mb-2">
                            Don't lose your progress!
                        </h3>
                        <p className="text-sm text-[var(--color-text-muted)]">
                            You have filled in some data. Do you want to save your progress 
                            to complete the registration later?
                        </p>
                    </div>
                </div>

                {/* Saved features */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4">
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">
                        What is saved:
                    </p>
                    <ul className="space-y-2 text-sm text-[var(--color-text-main)]">
                        <li className="flex items-center gap-2">
                            <span className="text-emerald-400">✓</span>
                            Personal and business information
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-emerald-400">✓</span>
                            Selected plan
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-emerald-400">✓</span>
                            Valid for 24 hours
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
                        Continue Registration
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={handleSaveAndExit}
                        className="w-full"
                    >
                        Save and Exit
                    </Button>

                    <button
                        onClick={handleExitWithoutSaving}
                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
                    >
                        Exit without saving
                    </button>
                </div>
            </div>
        </Modal>
    );
};


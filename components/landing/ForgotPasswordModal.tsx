import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { FloatingInput } from '../ui/FloatingInput';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { resetPassword } from '../../src/lib/supabase';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBackToSignIn: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ 
    isOpen, 
    onClose,
    onBackToSignIn 
}) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleResetRequest = async () => {
        if (!email) {
            setError('Inserisci la tua email');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Inserisci un indirizzo email valido');
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            await resetPassword(email);
            setSuccess(true);
            setEmail('');
        } catch (err: any) {
            console.error('Password reset request failed:', err);
            setError(err.message || 'Errore durante l\'invio dell\'email. Riprova più tardi.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading && !success) {
            handleResetRequest();
        }
    };

    const handleClose = () => {
        setEmail('');
        setError(null);
        setSuccess(false);
        onClose();
    };

    const handleBackToSignIn = () => {
        setEmail('');
        setError(null);
        setSuccess(false);
        onBackToSignIn();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Recupera Password"
            width="sm"
        >
            <div className="p-8 space-y-6">
                {!success ? (
                    <>
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Mail className="w-8 h-8 text-emerald-500" />
                            </div>
                        </div>

                        <p className="text-center text-[var(--color-text-muted)] text-sm">
                            Inserisci la tua email e ti invieremo un link per reimpostare la password
                        </p>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <FloatingInput
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            bgClass="bg-[var(--color-surface)]"
                            disabled={isLoading}
                        />

                        <div className="flex flex-col gap-3 mt-6">
                            <Button
                                variant="primary"
                                onClick={handleResetRequest}
                                isLoading={isLoading}
                                className="w-full justify-center"
                            >
                                {isLoading ? 'Invio in corso...' : 'Invia Link di Recupero'}
                            </Button>
                            
                            <button 
                                onClick={handleBackToSignIn}
                                className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
                                disabled={isLoading}
                            >
                                Torna al Login
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Mail className="w-8 h-8 text-emerald-500" />
                            </div>
                        </div>

                        <div className="text-center space-y-4">
                            <h3 className="text-xl font-semibold text-[var(--color-text-main)]">
                                Email Inviata! ✅
                            </h3>
                            <p className="text-[var(--color-text-muted)] text-sm">
                                Ti abbiamo inviato un'email con le istruzioni per recuperare la password.
                                <br />
                                <br />
                                Controlla la tua casella di posta e clicca sul link per reimpostare la password.
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                                Non hai ricevuto l'email? Controlla anche la cartella spam.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 mt-6">
                            <Button
                                variant="primary"
                                onClick={handleBackToSignIn}
                                className="w-full justify-center"
                            >
                                Torna al Login
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

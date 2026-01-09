import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { FloatingInput } from '../components/ui/FloatingInput';
import { Button } from '../components/ui/Button';
import { supabase, signOut } from '../src/lib/supabase';

interface ResetPasswordProps {
    onSuccess: () => void;
    onError: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onSuccess, onError }) => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);
    const [isCheckingMode, setIsCheckingMode] = useState(true);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // STEP 1: Exchange token for valid session
        const exchangeTokenForSession = async () => {
            if (!supabase) {
                setError('Supabase non configurato');
                setIsCheckingMode(false);
                return;
            }

            try {
                // Get URL parameters
                const params = new URLSearchParams(window.location.search);
                const tokenHash = params.get('token_hash');
                const type = params.get('type');
                
                console.log('[ResetPassword] URL params - token_hash:', !!tokenHash, 'type:', type);

                // Verify we have the necessary parameters
                if (!tokenHash || type !== 'recovery') {
                    console.log('[ResetPassword] Missing or invalid recovery parameters');
                    setError('Link non valido o scaduto. Richiedi un nuovo link di recupero.');
                    setIsCheckingMode(false);
                    return;
                }

                // CRITICAL: Exchange token_hash for a valid session using verifyOtp
                console.log('[ResetPassword] Exchanging token for session...');
                const { data, error: verifyError } = await supabase.auth.verifyOtp({
                    token_hash: tokenHash,
                    type: 'recovery',
                });

                if (verifyError) {
                    console.error('[ResetPassword] Verify OTP error:', verifyError);
                    setError(`Errore: ${verifyError.message}`);
                    setIsCheckingMode(false);
                    return;
                }

                if (!data.session) {
                    console.error('[ResetPassword] No session created');
                    setError('Impossibile creare una sessione valida. Richiedi un nuovo link.');
                    setIsCheckingMode(false);
                    return;
                }

                console.log('[ResetPassword] ✅ Session created successfully:', data.session.user.email);
                setIsRecoveryMode(true);
                setIsCheckingMode(false);

            } catch (err) {
                console.error('[ResetPassword] Unexpected error during token exchange:', err);
                setError('Errore imprevisto durante la verifica del link.');
                setIsCheckingMode(false);
            }
        };

        exchangeTokenForSession();
    }, []);

    // Calculate password strength
    useEffect(() => {
        let strength = 0;
        if (newPassword.length >= 8) strength += 25;
        if (newPassword.length >= 12) strength += 25;
        if (/[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)) strength += 25;
        if (/[0-9]/.test(newPassword)) strength += 15;
        if (/[^a-zA-Z0-9]/.test(newPassword)) strength += 10;
        setPasswordStrength(Math.min(strength, 100));
    }, [newPassword]);

    const handlePasswordUpdate = async () => {
        setError(null);

        // Validation
        if (!newPassword || !confirmPassword) {
            setError('Compila entrambi i campi');
            return;
        }

        if (newPassword.length < 6) {
            setError('La password deve essere lunga almeno 6 caratteri');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Le password non corrispondono');
            return;
        }

        if (!supabase) {
            setError('Supabase non configurato');
            return;
        }

        setIsLoading(true);

        try {
            console.log('[ResetPassword] Updating password...');
            
            // Update the user's password
            // NOTE: Supabase has already authenticated the user via the recovery token
            const { data, error: updateError } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (updateError) {
                console.error('[ResetPassword] Update error:', updateError);
                throw updateError;
            }

            console.log('[ResetPassword] Password updated successfully:', data);
            setSuccess(true);

            // Sign out the user to clear the recovery session
            // They'll need to log in with the new password
            await signOut();
            console.log('[ResetPassword] User signed out, redirecting...');

            // Wait 2 seconds to show success message, then redirect
            setTimeout(() => {
                onSuccess();
            }, 2000);

        } catch (err: any) {
            console.error('[ResetPassword] Update failed:', err);
            setError(err.message || 'Errore durante l\'aggiornamento della password');
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            handlePasswordUpdate();
        }
    };

    // Loading state while checking recovery mode
    if (isCheckingMode) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    <span className="text-zinc-400 text-sm">Verifica link in corso...</span>
                </div>
            </div>
        );
    }

    // Success state - password updated
    if (success) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[var(--color-surface)] border border-white/10 rounded-[2rem] p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-center text-[var(--color-text-main)] mb-4">
                        ✅ Password Aggiornata!
                    </h2>
                    
                    <p className="text-center text-[var(--color-text-muted)] mb-6">
                        La tua password è stata modificata con successo.
                        <br />
                        <br />
                        Verrai reindirizzato al login...
                    </p>

                    <div className="flex justify-center">
                        <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                </div>
            </div>
        );
    }

    // Invalid recovery link
    if (!isRecoveryMode) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-[var(--color-surface)] border border-white/10 rounded-[2rem] p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-center text-[var(--color-text-main)] mb-4">
                        Link Non Valido
                    </h2>
                    
                    <p className="text-center text-[var(--color-text-muted)] mb-6">
                        Il link di recupero password è scaduto o non è valido.
                        <br />
                        <br />
                        Richiedi un nuovo link per reimpostare la password.
                    </p>

                    <Button
                        variant="primary"
                        onClick={onError}
                        className="w-full justify-center"
                    >
                        Torna alla Home
                    </Button>
                </div>
            </div>
        );
    }

    // Reset password form
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-[var(--color-surface)] border border-white/10 rounded-[2rem] p-8">
                <div className="flex justify-center mb-6">
                    <img src="/assets/logo-full.png" alt="Armonyco" className="h-16 object-contain mb-4" />
                </div>

                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Shield className="w-8 h-8 text-emerald-500" />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-[var(--color-text-main)] mb-2">
                    Imposta Nuova Password
                </h2>
                
                <p className="text-center text-[var(--color-text-muted)] text-sm mb-8">
                    Scegli una password sicura per il tuo account
                </p>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    <FloatingInput
                        label="Nuova Password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        bgClass="bg-[var(--color-background)]"
                        disabled={isLoading}
                    />

                    {/* Password strength indicator */}
                    {newPassword && (
                        <div className="space-y-2">
                            <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-300 ${
                                        passwordStrength < 40 ? 'bg-red-500' :
                                        passwordStrength < 70 ? 'bg-yellow-500' :
                                        'bg-emerald-500'
                                    }`}
                                    style={{ width: `${passwordStrength}%` }}
                                />
                            </div>
                            <p className="text-xs text-[var(--color-text-muted)]">
                                {passwordStrength < 40 ? '⚠️ Password debole' :
                                 passwordStrength < 70 ? '✓ Password media' :
                                 '✓ Password forte'}
                            </p>
                        </div>
                    )}

                    <FloatingInput
                        label="Conferma Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        bgClass="bg-[var(--color-background)]"
                        disabled={isLoading}
                    />

                    <div className="mt-8">
                        <Button
                            variant="primary"
                            onClick={handlePasswordUpdate}
                            isLoading={isLoading}
                            className="w-full justify-center"
                            disabled={!newPassword || !confirmPassword || isLoading}
                        >
                            {isLoading ? 'Aggiornamento...' : 'Aggiorna Password'}
                        </Button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button 
                        onClick={onError}
                        className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
                        disabled={isLoading}
                    >
                        Torna alla Home
                    </button>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { ArrowRight } from '../ui/Icons';
import { FloatingInput } from '../ui/FloatingInput';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { authService } from '../../src/services/auth.service';

interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (data?: any) => void;
    onForgotPassword: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onLogin, onForgotPassword }) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleEmailSignIn = async () => {
        if (!email || !password) {
            setError(t('auth.enterEmailAndPassword'));
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await authService.signIn({ email, password });
            onLogin(response);
            onClose();
        } catch (err: any) {
            console.error('Login failed', err);
            setError(err.message || t('auth.failedToSignIn'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            handleEmailSignIn();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={t('auth.signIn')}
            width="sm"
        >
            <div className="p-8 space-y-6">
                <div className="flex justify-center mb-8">
                    <img src="/assets/logo-full.png" alt="Armonyco" className="h-16 object-contain" />
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <FloatingInput
                    label={t('auth.email')}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    bgClass="bg-[var(--color-surface)]"
                />
                <FloatingInput
                    label={t('auth.password')}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    bgClass="bg-[var(--color-surface)]"
                    endIcon={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer focus:outline-none"
                            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    }
                />
                <div className="flex justify-between items-center text-xs">
                    <label className="flex items-center gap-2 text-[var(--color-text-muted)] cursor-pointer">
                        <input type="checkbox" className="rounded border-[var(--color-border)] text-[var(--color-brand-primary)] focus:ring-0 cursor-pointer" />
                        {t('auth.rememberMe')}
                    </label>
                    <button 
                        onClick={onForgotPassword}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
                    >
                        {t('auth.forgotPassword')}
                    </button>
                </div>

                <div className="flex justify-center mt-6">
                    <Button
                        variant="primary"
                        rightIcon={<ArrowRight size={18} />}
                        onClick={handleEmailSignIn}
                        isLoading={isLoading}
                        className="w-full justify-center"
                    >
                        {t('auth.signIn')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

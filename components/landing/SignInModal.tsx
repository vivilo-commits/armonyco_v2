import React from 'react';
import { ArrowRight } from '../ui/Icons';
import { FloatingInput } from '../ui/FloatingInput';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface SignInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (data?: any) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onLogin }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Sign In"
            width="sm"
        >
            <div className="p-8 space-y-6">
                <div className="flex justify-center mb-8">
                    <img src="/assets/logo-full.png" alt="Armonyco" className="h-16 object-contain" />
                </div>
                <FloatingInput
                    label="Email"
                    type="email"
                    bgClass="bg-[var(--color-surface)]"
                />
                <FloatingInput
                    label="Password"
                    type="password"
                    bgClass="bg-[var(--color-surface)]"
                />
                <div className="flex justify-between items-center text-xs">
                    <label className="flex items-center gap-2 text-[var(--color-text-muted)] cursor-pointer">
                        <input type="checkbox" className="rounded border-[var(--color-border)] text-[var(--color-brand-primary)] focus:ring-0 cursor-pointer" />
                        Remember me
                    </label>
                    <button className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors">Forgot password?</button>
                </div>

                <div className="flex justify-center mt-6">
                    <Button
                        variant="primary"
                        rightIcon={<ArrowRight size={18} />}
                        onClick={() => onLogin()}
                        className="w-full justify-center"
                    >
                        Sign In
                    </Button>
                </div>

                <div className="relative flex py-2 items-center my-2">
                    <div className="flex-grow border-t border-[var(--color-border)]"></div>
                    <span className="flex-shrink-0 mx-4 text-[var(--color-text-subtle)] text-[10px] uppercase">or</span>
                    <div className="flex-grow border-t border-[var(--color-border)]"></div>
                </div>

                <div className="space-y-3">
                    <button onClick={() => onLogin()} className="w-full py-2.5 border border-[var(--color-border)] rounded-md font-medium text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] bg-[var(--color-surface)] transition-colors flex items-center justify-center gap-3 hover:border-[var(--color-border-hover)]">
                        {/* Original Google SVG */}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>
                    <button onClick={() => onLogin()} className="w-full py-2.5 border border-[var(--color-border)] rounded-md font-medium text-xs text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)] bg-[var(--color-surface)] transition-colors flex items-center justify-center gap-3 hover:border-[var(--color-border-hover)]">
                        {/* Original Apple SVG */}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.68-.3-1.45-.55-2.23-.55-.78 0-1.6.25-2.3.55-1.02.48-1.98.53-2.95-.42-1.93-1.93-3.4-5.5-1.38-8.5 1.03-1.55 2.88-2.53 4.63-2.53 1.3 0 2.45.83 3.2.83.73 0 2.13-1.03 3.65-.88.63.02 2.43.25 3.58 1.93-2.9 1.75-2.43 5.35.6 6.55-.48 1.03-1.08 2.05-1.72 2.62zm-3.23-16.4c.53-1.28 2.13-2.18 2.13-2.18.3 1.55-.93 3.03-2.13 3.65-1.08.53-2.35-.45-2.35-.45 0 0-.25-1.28.35-1.02z" />
                        </svg>
                        Sign in with Apple
                    </button>
                </div>
            </div>
        </Modal>
    );
};

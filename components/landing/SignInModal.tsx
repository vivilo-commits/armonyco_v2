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
                        <svg className="w-5 h-5 mb-0.5" viewBox="0 0 384 512" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-11.7-111.9zM263 60.1C289 30.2 284.6 3.1 247.3 0c-4.1 36.9-29.3 64.1-52.7 89.1-30.8 28.3-56.9 29.8-56.9 31.8 40.5 2.2 68.4-31.5 86.3-55.9z" />
                        </svg>
                        Sign in with Apple
                    </button>
                </div>
            </div>
        </Modal>
    );
};

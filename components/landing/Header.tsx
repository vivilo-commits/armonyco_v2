import React, { useState } from 'react';
import { ChevronDown, Menu, X, LogIn, ArrowRight } from '../ui/Icons';
import { Button } from '../ui/Button';

interface HeaderProps {
    onLogin: () => void;
    onSignUp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogin, onSignUp }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-40 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-border)] px-6 md:px-24 h-20 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-2">
                <img src="/assets/logo-full.png" alt="Armonyco" className="h-12 md:h-20 object-contain cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1 text-sm font-medium text-[var(--color-text-muted)] h-full">

                {/* Governance Dropdown */}
                <div className="relative group h-full flex items-center">
                    <button className="px-4 py-2 hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1">
                        Governance <ChevronDown size={14} />
                    </button>
                    <div className="absolute top-14 left-0 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-2 z-50">
                        <div className="flex flex-col">
                            <a href="#governance" className="block w-full px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left">Governed Value™</a>
                            <a href="#governance" className="block w-full px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left">Decision Log</a>
                            <a href="#governance" className="block w-full px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left">Compliance Rate™</a>
                            <a href="#governance" className="block w-full px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left">Human Risk</a>
                            <a href="#governance" className="block w-full px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left">Residual Risk</a>
                        </div>
                    </div>
                </div>

                {/* Core Dropdown */}
                <div className="relative group h-full flex items-center">
                    <button className="px-4 py-2 hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1">
                        Core <ChevronDown size={14} />
                    </button>
                    <div className="absolute top-14 left-0 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-2 z-50">
                        <div className="flex flex-col">
                            <a href="#core" className="block w-full px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left">AEM Event Model™</a>
                            <a href="#core" className="block w-full px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left">AOS Operating System™</a>
                            <a href="#core" className="block w-full px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left">ARS Reliability™</a>
                            <a href="#core" className="block w-full px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left">AGS Scorecard™</a>
                        </div>
                    </div>
                </div>

                {/* Products Dropdown */}
                <div className="relative group h-full flex items-center">
                    <button className="px-4 py-2 hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1">
                        Products <ChevronDown size={14} />
                    </button>
                    <div className="absolute top-14 left-0 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-2 z-50">
                        <div className="flex flex-col">
                            <a href="#products" className="px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left">Guest Experience</a>
                            <a href="#products" className="px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left">Revenue Generation</a>
                            <a href="#products" className="px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left">Operational Efficiency</a>
                            <a href="#products" className="px-3 py-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left">Incident Response</a>
                        </div>
                    </div>
                </div>

                <a href="#manifesto" className="px-4 py-2 hover:text-[var(--color-text-main)] transition-colors">Manifesto</a>
                <a href="#faq" className="px-4 py-2 hover:text-[var(--color-text-main)] transition-colors">FAQ</a>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-3">
                    <Button
                        variant="ghost"
                        onClick={onLogin}
                    >
                        Sign In
                    </Button>
                    <Button
                        variant="primary"
                        onClick={onSignUp}
                    >
                        Start Now
                    </Button>
                </div>

                <button
                    className="md:hidden text-[var(--color-text-main)] p-2 hover:bg-[var(--color-surface-hover)] rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="fixed top-20 inset-x-0 bg-[var(--color-surface)] border-b border-[var(--color-border)] p-6 md:hidden z-50 shadow-2xl animate-in slide-in-from-top-5 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
                    <img src="/assets/logo-full.png" alt="Armonyco" className="h-14 object-contain mb-8 self-center" />
                    <a href="#governance" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-[var(--color-text-main)] block p-2 hover:bg-[var(--color-surface-hover)] rounded">Governance</a>
                    <a href="#core" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-[var(--color-text-main)] block p-2 hover:bg-[var(--color-surface-hover)] rounded">Core</a>
                    <a href="#products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-[var(--color-text-main)] block p-2 hover:bg-[var(--color-surface-hover)] rounded">Products</a>
                    <a href="#manifesto" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-[var(--color-text-main)] block p-2 hover:bg-[var(--color-surface-hover)] rounded">Manifesto</a>
                    <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-[var(--color-text-main)] block p-2 hover:bg-[var(--color-surface-hover)] rounded">FAQ</a>

                    <div className="pt-6 border-t border-[var(--color-border)] flex flex-col gap-4 items-center">
                        <Button
                            variant="ghost"
                            fullWidth
                            leftIcon={<LogIn size={18} />}
                            onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
                        >
                            Sign In
                        </Button>
                        <Button
                            variant="primary"
                            fullWidth
                            rightIcon={<ArrowRight size={18} />}
                            onClick={() => { onSignUp(); setIsMobileMenuOpen(false); }}
                        >
                            Start Now
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    );
};

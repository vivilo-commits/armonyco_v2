import React, { useState } from 'react';
import { ChevronDown, Menu, X, LogIn, ArrowRight } from '../ui/Icons';
import { Button } from '../ui/Button';

interface HeaderProps {
    onLogin: () => void;
    onSignUp: () => void;
    onContact: () => void;
    onNavigateSolutions?: (industry?: 'pm' | 'ins' | 'inv' | 'ent') => void;
    onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogin, onSignUp, onContact, onNavigateSolutions, onNavigateSection }) => {
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
                            <button onClick={() => onNavigateSection?.('governed-value')} className="block w-full px-3 py-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left uppercase font-bold tracking-widest transition-all">Governed Cashflow™</button>
                            <button onClick={() => onNavigateSection?.('decision-log')} className="block w-full px-3 py-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left uppercase font-bold tracking-widest transition-all">Decision Log</button>
                            <button onClick={() => onNavigateSection?.('compliance-rate')} className="block w-full px-3 py-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left uppercase font-bold tracking-widest transition-all">Compliance Rate™</button>
                            <button onClick={() => onNavigateSection?.('human-risk')} className="block w-full px-3 py-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left uppercase font-bold tracking-widest transition-all">Human Risk</button>
                            <button onClick={() => onNavigateSection?.('residual-risk')} className="block w-full px-3 py-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left uppercase font-bold tracking-widest transition-all">Residual Risk</button>
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
                            <button onClick={() => onNavigateSection?.('aem')} className="block w-full px-3 py-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left uppercase font-bold tracking-widest transition-all">AEM - Armonyco Event Model™</button>
                            <button onClick={() => onNavigateSection?.('aos')} className="block w-full px-3 py-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left uppercase font-bold tracking-widest transition-all">AOS - Armonyco Operating System™</button>
                            <button onClick={() => onNavigateSection?.('aim')} className="block w-full px-3 py-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left uppercase font-bold tracking-widest transition-all">AIM - Armonyco Intelligence Matrix™</button>
                            <button onClick={() => onNavigateSection?.('ars')} className="block w-full px-3 py-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left uppercase font-bold tracking-widest transition-all">ARS - Armonyco Reliability System™</button>
                            <button onClick={() => onNavigateSection?.('ags')} className="block w-full px-3 py-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left uppercase font-bold tracking-widest transition-all">AGS - Armonyco Governance Scorecard™</button>
                        </div>
                    </div>
                </div>

                {/* Solutions Dropdown */}
                <div className="relative group h-full flex items-center">
                    <button className="px-4 py-2 hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1">
                        Solutions <ChevronDown size={14} />
                    </button>
                    <div className="absolute top-14 left-0 w-64 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 p-2 z-50">
                        <div className="flex flex-col">
                            <button onClick={() => onNavigateSection?.('card-pm')} className="px-3 py-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left uppercase font-bold tracking-widest transition-all">Property Manager</button>
                            <button onClick={() => onNavigateSection?.('card-ins')} className="px-3 py-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left uppercase font-bold tracking-widest transition-all">Insurers</button>
                            <button onClick={() => onNavigateSection?.('card-inv')} className="px-3 py-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left uppercase font-bold tracking-widest transition-all">Investment Funds</button>
                            <button onClick={() => onNavigateSection?.('card-ent')} className="px-3 py-2 text-[10px] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] rounded-lg text-left uppercase font-bold tracking-widest transition-all">Enterprise</button>
                        </div>
                    </div>
                </div>

                <button onClick={() => onNavigateSection?.('manifesto')} className="px-4 py-2 hover:text-[var(--color-text-main)] transition-colors">Manifesto</button>
                <button onClick={() => onNavigateSection?.('faq')} className="px-4 py-2 hover:text-[var(--color-text-main)] transition-colors">FAQ</button>
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
                    <button onClick={() => { onNavigateSection?.('governance'); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-[var(--color-text-main)] block p-2 hover:bg-[var(--color-surface-hover)] rounded text-left w-full uppercase tracking-widest text-xs">Governance</button>
                    <button onClick={() => { onNavigateSection?.('core'); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-[var(--color-text-main)] block p-2 hover:bg-[var(--color-surface-hover)] rounded text-left w-full uppercase tracking-widest text-xs">Core Constructs</button>
                    <button onClick={() => { onNavigateSection?.('solutions-teaser'); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-[var(--color-text-main)] block p-2 hover:bg-[var(--color-surface-hover)] rounded text-left w-full">Solutions Portfolio™</button>
                    <button onClick={() => { onNavigateSection?.('manifesto'); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-[var(--color-text-main)] block p-2 hover:bg-[var(--color-surface-hover)] rounded text-left w-full">Manifesto</button>
                    <button onClick={() => { onNavigateSection?.('faq'); setIsMobileMenuOpen(false); }} className="text-lg font-medium text-[var(--color-text-main)] block p-2 hover:bg-[var(--color-surface-hover)] rounded text-left w-full">FAQ</button>

                    <div className="pt-6 border-t border-[var(--color-border)] flex flex-col gap-4 items-center">
                        <Button
                            variant="ghost"
                            fullWidth
                            onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
                        >
                            Sign In
                        </Button>
                        <Button
                            variant="primary"
                            fullWidth
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

import React, { useState, useEffect } from 'react';
import { Header } from '../components/landing/Header';
import { Hero } from '../components/landing/Hero';
import { Pillars } from '../components/landing/Pillars';
import { Constructs } from '../components/landing/Constructs';
import { Addendums } from '../components/landing/Addendums';
import { FAQ } from '../components/landing/FAQ';
import { Footer } from '../components/landing/Footer';
import { ChevronDown, Menu, X, CheckCircle, CreditCard, User, Building, MapPin, Globe, ChevronRight, ChevronLeft, Lock, ArrowRight, LogIn, MessageCircle, TrendingUp, Activity, Shield } from '../components/ui/Icons';
import { AiTeamStrip } from '../components/ui/AiTeamStrip';
import { ModuleListModal, ModuleSuite } from '../components/landing/ModuleListModal';
import { Card } from '../components/ui/Card';
import { ActiveWorkforce } from '../components/landing/ActiveWorkforce';
import { SignInModal } from '../components/landing/SignInModal';
import { SignUpWizard } from '../components/landing/SignUpWizard';

// --- Types ---
interface LandingPageProps {
    onLogin: (data?: any) => void;
}



export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [selectedSuite, setSelectedSuite] = useState<ModuleSuite | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Agent Configuration


    return (
        <div className="bg-stone-50 min-h-screen font-sans text-stone-900 selection:bg-armonyco-gold/30">
            {/* Header */}
            <Header
                onLogin={() => setIsSignInOpen(true)}
                onSignUp={() => setIsSignUpOpen(true)}
            />

            <main>
                <Hero onStartNow={() => setIsSignUpOpen(true)} />
                <Pillars />
                <Constructs />

                {/* Active Workforce Section - USING FLEX NOW */}
                <ActiveWorkforce />

                <section id="products" className="py-24 px-6 md:px-24 bg-[var(--color-surface)] border-b border-[var(--color-border)] scroll-mt-20">
                    <div className="mb-16">
                        <h2 className="text-4xl text-[var(--color-text-main)] font-light mb-4">Products</h2>
                        <p className="text-[var(--color-text-muted)] max-w-3xl text-lg">Operational coverage for the critical moments of truth.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card id="products-guest" hover padding="md" onClick={() => setSelectedSuite('GUEST')} className="cursor-pointer group">
                            <h3 className="text-lg font-medium text-[var(--color-text-main)] mb-2 group-hover:text-[var(--color-brand-accent)] transition-colors">Guest Experience</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Pre-arrival, access, and self-resolution.</p>
                        </Card>
                        <Card id="products-revenue" hover padding="md" onClick={() => setSelectedSuite('REVENUE')} className="cursor-pointer group">
                            <h3 className="text-lg font-medium text-[var(--color-text-main)] mb-2 group-hover:text-[var(--color-brand-accent)] transition-colors">Revenue Generation</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Monetization of exceptions and opportunities.</p>
                        </Card>
                        <Card id="products-ops" hover padding="md" onClick={() => setSelectedSuite('OPS')} className="cursor-pointer group">
                            <h3 className="text-lg font-medium text-[var(--color-text-main)] mb-2 group-hover:text-[var(--color-brand-accent)] transition-colors">Operational Efficiency</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Triage and closure for real-world operations.</p>
                        </Card>
                        <Card id="products-response" hover padding="md" onClick={() => setSelectedSuite('RESPONSE')} className="cursor-pointer group">
                            <h3 className="text-lg font-medium text-[var(--color-text-main)] mb-2 group-hover:text-[var(--color-brand-accent)] transition-colors">Incident Response</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Policy-driven incident handling playbooks.</p>
                        </Card>
                    </div>
                </section>
                <Addendums />
                <FAQ />
            </main>

            <Footer />

            <SignInModal
                isOpen={isSignInOpen}
                onClose={() => setIsSignInOpen(false)}
                onLogin={() => onLogin()}
            />

            <SignUpWizard
                isOpen={isSignUpOpen}
                onClose={() => setIsSignUpOpen(false)}
                onComplete={(data) => {
                    setIsSignUpOpen(false);
                    onLogin(data);
                }}
            />

            <ModuleListModal
                isOpen={!!selectedSuite}
                onClose={() => setSelectedSuite(null)}
                suite={selectedSuite}
            />
        </div>
    );
};
import React, { useState } from 'react';
import { Header } from '../components/landing/Header';
import { Hero } from '../components/landing/Hero';
import { Pillars } from '../components/landing/Pillars';
import { Constructs } from '../components/landing/Constructs';
import { Addendums } from '../components/landing/Addendums';
import { FAQ } from '../components/landing/FAQ';
import { Footer } from '../components/landing/Footer';
import { ChevronDown, Menu, X, CheckCircle, CreditCard, User, Building, MapPin, Globe, ChevronRight, ChevronLeft, Lock, ArrowRight, LogIn, MessageCircle, TrendingUp, Activity, Shield, Cpu } from '../components/ui/Icons';
import { ModuleListModal, ModuleSuite } from '../components/landing/ModuleListModal';
import { SignInModal } from '../components/landing/SignInModal';
import { SignUpWizard } from '../components/landing/SignUpWizard';
import { ContactModal } from '../components/landing/ContactModal';
import { ForgotPasswordModal } from '../components/landing/ForgotPasswordModal';

// --- Types ---
interface LandingPageProps {
    onLogin: (data?: any) => void;
    onNavigateSolutions: (industry?: 'pm' | 'ins' | 'inv' | 'ent') => void;
    onNavigateSection: (sectionId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onNavigateSolutions, onNavigateSection }) => {
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [selectedSuite, setSelectedSuite] = useState<ModuleSuite | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="bg-stone-50 min-h-screen font-sans text-stone-900 selection:bg-armonyco-gold/30">
            {/* Header */}
            <Header
                onLogin={() => setIsSignInOpen(true)}
                onSignUp={() => setIsSignUpOpen(true)}
                onContact={() => setIsContactOpen(true)}
                onNavigateSolutions={onNavigateSolutions}
                onNavigateSection={onNavigateSection}
            />

            <main>
                <Hero onStartNow={() => setIsContactOpen(true)} />
                <Pillars />
                <Constructs />

                <section id="solutions-teaser" className="py-32 px-6 md:px-24 bg-[var(--color-surface)] border-b border-[var(--color-border)] text-center">
                    <div className="max-w-4xl mx-auto">
                        <h4 className="text-[var(--color-brand-accent)] text-[10px] font-black uppercase tracking-[0.4em] mb-8 animate-fade-in">Decision Infrastructure</h4>
                        <h2 className="text-5xl md:text-7xl text-zinc-900 font-light mb-10 leading-[1.1] tracking-tight">One system.<br />Every institutional decision.</h2>
                        <div className="mb-16 p-8 bg-zinc-900 rounded-[2rem] border border-white/5 shadow-2xl">
                            <p className="text-2xl text-white font-light italic leading-relaxed">
                                "For operators, Armonyco turns daily chaos into predictable cashflow per unit. At scale, that’s what a Decision OS really is."
                            </p>
                        </div>

                        <p className="text-xl text-zinc-500 mb-12 leading-relaxed max-w-2xl mx-auto italic">
                            Move beyond tools. Deploy the Decision OS across your hospitality vertical.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                            {[
                                {
                                    id: "card-pm",
                                    slug: "pm",
                                    title: "Property Managers",
                                    desc: "Turn daily operational chaos into predictable cashflow per unit at scale.",
                                    icon: <Building size={24} className="text-[var(--color-brand-accent)]" />
                                },
                                {
                                    id: "card-ins",
                                    slug: "ins",
                                    title: "Insurers",
                                    desc: "The data substrate for real-time risk modification and fiduciary accountability layers.",
                                    icon: <Shield size={24} className="text-[var(--color-brand-accent)]" />
                                },
                                {
                                    id: "card-inv",
                                    slug: "inv",
                                    title: "Investment Funds",
                                    desc: "Securing institutional capital through standardized operational auditing and asset protection.",
                                    icon: <TrendingUp size={24} className="text-[var(--color-brand-accent)]" />
                                },
                                {
                                    id: "card-ent",
                                    slug: "ent",
                                    title: "Enterprise",
                                    desc: "Global governance layers for cross-border operations and complex stakeholder ecologies.",
                                    icon: <Globe size={24} className="text-[var(--color-brand-accent)]" />
                                }
                            ].map((industry, i) => (
                                <div key={i} id={industry.id} className="group p-8 rounded-[2rem] bg-white border border-zinc-100 hover:border-[var(--color-brand-accent)] transition-all hover:shadow-2xl flex flex-col h-full scroll-mt-24">
                                    <div className="mb-6 opacity-60 group-hover:opacity-100 transition-opacity">
                                        {industry.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-zinc-900 mb-3">{industry.title}</h3>
                                    <p className="text-sm text-zinc-500 leading-relaxed mb-8 flex-grow">{industry.desc}</p>

                                    <button
                                        onClick={() => onNavigateSolutions(industry.slug as any)}
                                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-900 transition-colors"
                                    >
                                        Learn More
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <Addendums />
                <FAQ />
            </main>

            <Footer onContact={() => setIsContactOpen(true)} />

            <SignInModal
                isOpen={isSignInOpen}
                onClose={() => setIsSignInOpen(false)}
                onLogin={() => onLogin()}
                onForgotPassword={() => {
                    setIsSignInOpen(false);
                    setIsForgotPasswordOpen(true);
                }}
            />

            <SignUpWizard
                isOpen={isSignUpOpen}
                onClose={() => setIsSignUpOpen(false)}
                onContact={() => setIsContactOpen(true)}
                onComplete={(data) => {
                    setIsSignUpOpen(false);
                    onLogin(data);
                }}
            />

            <ContactModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />

            <ModuleListModal
                isOpen={!!selectedSuite}
                onClose={() => setSelectedSuite(null)}
                suite={selectedSuite}
            />

            <ForgotPasswordModal
                isOpen={isForgotPasswordOpen}
                onClose={() => setIsForgotPasswordOpen(false)}
                onBackToSignIn={() => {
                    setIsForgotPasswordOpen(false);
                    setIsSignInOpen(true);
                }}
            />
        </div>
    );
};

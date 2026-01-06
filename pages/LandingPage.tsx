import React, { useState, useEffect } from 'react';
import { Header } from '../components/landing/Header';
import { Hero } from '../components/landing/Hero';
import { Pillars } from '../components/landing/Pillars';
import { Constructs } from '../components/landing/Constructs';
import { Addendums } from '../components/landing/Addendums';
import { FAQ } from '../components/landing/FAQ';
import { Footer } from '../components/landing/Footer';
import { ChevronDown, Menu, X, CheckCircle, CreditCard, User, Building, MapPin, Globe, ChevronRight, ChevronLeft, Lock, ArrowRight, LogIn, MessageCircle, TrendingUp, Activity, Shield, Cpu, Calendar } from '../components/ui/Icons';
import { AiTeamStrip } from '../components/ui/AiTeamStrip';
import { ModuleListModal, ModuleSuite } from '../components/landing/ModuleListModal';
import { Card } from '../components/ui/Card';
import { SignInModal } from '../components/landing/SignInModal';
import { SignUpWizard } from '../components/landing/SignUpWizard';
import { ContactModal } from '../components/landing/ContactModal';

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

                {/* Bottom CTA Section */}
                <section className="py-32 px-6 md:px-24 bg-zinc-900 border-b border-white/5 text-center overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[var(--color-brand-accent)]/10 via-transparent to-transparent opacity-50" />
                    <div className="max-w-4xl mx-auto relative z-10">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-light mb-12 tracking-tight leading-tight">
                            Governed operations are <br />
                            <span className="text-[var(--color-brand-accent)] italic serif">non-negotiable at scale.</span>
                        </h2>

                        {/* The Compass Line Card */}
                        <div className="mb-16 p-12 border border-[var(--color-brand-accent)]/30 bg-white/[0.02] rounded-[2.5rem] text-center backdrop-blur-sm shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-brand-accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <h3 className="text-[var(--color-brand-accent)] uppercase tracking-[0.4em] text-[10px] font-black mb-6 relative z-10">The Compass Line (Non-Negotiable Filter)</h3>
                            <p className="text-2xl md:text-3xl text-white font-light italic mb-8 relative z-10 leading-relaxed max-w-3xl mx-auto">
                                "If Armonyco solves a problem that can be bypassed by a human, it isn't Armonyco."
                            </p>
                            <p className="text-zinc-500 text-sm tracking-wide uppercase font-medium relative z-10">
                                Armonyco exists only where: <span className="text-zinc-300">execution must be provable</span> • <span className="text-zinc-300">value must be certifiable</span> • <span className="text-zinc-300">risk must be measurable</span>.
                            </p>
                        </div>

                        <p className="text-xl text-zinc-400 mb-6 max-w-2xl mx-auto italic font-light">
                            Ready to transition from tools to a Decision OS? Choose how you want to start.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button
                                onClick={() => setIsContactOpen(true)}
                                className="px-10 py-5 bg-[var(--color-brand-accent)] text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_10px_40px_rgba(212,175,55,0.3)] flex items-center justify-center gap-3"
                            >
                                Schedule a demo
                                <Calendar size={18} />
                            </button>
                            <button
                                onClick={() => setIsContactOpen(true)}
                                className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                            >
                                Contact us
                                <MessageCircle size={18} />
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer onContact={() => setIsContactOpen(true)} />

            <SignInModal
                isOpen={isSignInOpen}
                onClose={() => setIsSignInOpen(false)}
                onLogin={() => onLogin()}
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
        </div>
    );
};

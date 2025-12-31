import React, { useState, useEffect } from 'react';
import { Hero } from '../components/landing/Hero';
import { Pillars } from '../components/landing/Pillars';
import { Constructs } from '../components/landing/Constructs';
import { Addendums } from '../components/landing/Addendums';
import { Footer } from '../components/landing/Footer';
import { ChevronDown, Menu, X, CheckCircle, CreditCard, User, Building, MapPin, Globe, ChevronRight, ChevronLeft, Lock, ArrowRight, LogIn, MessageCircle, TrendingUp, Activity, Shield } from '../components/ui/Icons';
import { AiTeamStrip } from '../components/ui/AiTeamStrip';
import { ModuleListModal, ModuleSuite } from '../components/landing/ModuleListModal';
import { AnimatedButton } from '../components/ui/AnimatedButton';
import { FloatingInput } from '../components/ui/FloatingInput';
import { AgentCard } from '../components/ui/AgentCard';

// --- Types ---
interface LandingPageProps {
    onLogin: (data?: any) => void;
}

// --- Sign In Modal ---
const SignInModal: React.FC<{ isOpen: boolean; onClose: () => void; onLogin: () => void }> = ({ isOpen, onClose, onLogin }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 ui-modal-backdrop">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm animate-scale-in border border-stone-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                    <h3 className="font-medium text-stone-900">Sign In</h3>
                    <button onClick={onClose} className="text-stone-400 hover:text-stone-900 transition-colors"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-5">
                    <FloatingInput 
                        label="Email" 
                        type="email" 
                        bgClass="bg-white"
                    />
                    <FloatingInput 
                        label="Password" 
                        type="password" 
                        bgClass="bg-white"
                    />
                    <div className="flex justify-between items-center text-xs">
                        <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
                            <input type="checkbox" className="rounded border-stone-300 text-stone-900 focus:ring-0 cursor-pointer" />
                            Remember me
                        </label>
                        <button className="text-stone-400 hover:text-stone-900">Forgot password?</button>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                        <AnimatedButton 
                            text="Sign In" 
                            icon={<ArrowRight size={18} />} 
                            width="120px"
                            onClick={onLogin}
                        />
                    </div>
                    
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-stone-100"></div>
                        <span className="flex-shrink-0 mx-4 text-stone-300 text-[10px] uppercase">or</span>
                        <div className="flex-grow border-t border-stone-100"></div>
                    </div>

                    <div className="space-y-3">
                        <button onClick={onLogin} className="w-full py-2.5 border border-stone-200 rounded font-medium text-xs text-stone-600 hover:bg-stone-50 transition-colors flex items-center justify-center gap-3 ui-card hover:border-stone-300">
                            {/* Original Google SVG */}
                            <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Sign in with Google
                        </button>
                        <button onClick={onLogin} className="w-full py-2.5 border border-stone-200 rounded font-medium text-xs text-stone-600 hover:bg-stone-50 transition-colors flex items-center justify-center gap-3 ui-card hover:border-stone-300">
                            {/* Original Apple SVG */}
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.68-.3-1.45-.55-2.23-.55-.78 0-1.6.25-2.3.55-1.02.48-1.98.53-2.95-.42-1.93-1.93-3.4-5.5-1.38-8.5 1.03-1.55 2.88-2.53 4.63-2.53 1.3 0 2.45.83 3.2.83.73 0 2.13-1.03 3.65-.88.63.02 2.43.25 3.58 1.93-2.9 1.75-2.43 5.35.6 6.55-.48 1.03-1.08 2.05-1.72 2.62zm-3.23-16.4c.53-1.28 2.13-2.18 2.13-2.18.3 1.55-.93 3.03-2.13 3.65-1.08.53-2.35-.45-2.35-.45 0 0-.25-1.28.35-1.02z"/>
                            </svg>
                            Sign in with Apple
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sign Up Wizard Modal ---
const SignUpWizard: React.FC<{ isOpen: boolean; onClose: () => void; onComplete: (data: any) => void }> = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState(1);
    
    // State Collection
    const [credits, setCredits] = useState(20);
    const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', terms: false, privacy: false });
    const [org, setOrg] = useState({ name: '', billingEmail: '', language: 'EN', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
    const [billing, setBilling] = useState({ legalName: '', vatNumber: '', fiscalCode: '', address: '', city: '', zip: '', country: '', sdiCode: '', pecEmail: '' });

    if (!isOpen) return null;

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleComplete = () => {
        onComplete({
            userProfile: {
                firstName: profile.firstName,
                lastName: profile.lastName,
                email: profile.email,
                phone: profile.phone,
                photo: null
            },
            organization: {
                name: org.name,
                billingEmail: org.billingEmail,
                language: org.language,
                timezone: org.timezone
            },
            billingDetails: billing,
            credits: credits
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 ui-modal-backdrop">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-scale-in border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-8 py-5 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                    <h3 className="font-medium text-stone-900 text-lg">Start now</h3>
                    <div className="flex items-center gap-4">
                        <div className="text-xs font-mono text-stone-400">Step {step} of 3</div>
                        <button onClick={onClose} className="text-stone-400 hover:text-stone-900 transition-colors"><X size={20} /></button>
                    </div>
                </div>

                {/* Body - Scrollable */}
                <div className="p-8 overflow-y-auto flex-1">
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pt-2">
                            <div className="grid grid-cols-2 gap-6">
                                <FloatingInput 
                                    label="First Name" 
                                    value={profile.firstName} 
                                    onChange={e => setProfile({...profile, firstName: e.target.value})} 
                                />
                                <FloatingInput 
                                    label="Last Name" 
                                    value={profile.lastName} 
                                    onChange={e => setProfile({...profile, lastName: e.target.value})} 
                                />
                            </div>
                            <FloatingInput 
                                label="Email Address" 
                                type="email"
                                value={profile.email} 
                                onChange={e => setProfile({...profile, email: e.target.value})} 
                            />
                            <div className="grid grid-cols-2 gap-6">
                                <FloatingInput 
                                    label="Password" 
                                    type="password"
                                    value={profile.password} 
                                    onChange={e => setProfile({...profile, password: e.target.value})} 
                                />
                                <FloatingInput 
                                    label="Confirm Password" 
                                    type="password"
                                    value={profile.confirmPassword} 
                                    onChange={e => setProfile({...profile, confirmPassword: e.target.value})} 
                                />
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pt-2">
                            <FloatingInput 
                                label="Organization Name" 
                                value={org.name} 
                                onChange={e => setOrg({...org, name: e.target.value})} 
                            />
                            <FloatingInput 
                                label="Billing Email" 
                                type="email"
                                value={org.billingEmail} 
                                onChange={e => setOrg({...org, billingEmail: e.target.value})} 
                            />
                        </div>
                    )}
                    {step === 3 && (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 text-center space-y-3 ui-card">
                                <h2 className="text-lg font-medium text-stone-900">Commercial Plan</h2>
                                <p className="text-stone-600 text-sm">€0.0010 per Credit</p>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-4 text-center">Select Initial Credits</label>
                                <div className="grid grid-cols-4 gap-4 mb-2">
                                    {[10, 20, 50, 100].map(amt => (
                                        <button 
                                            key={amt}
                                            onClick={() => setCredits(amt)}
                                            className={`py-4 rounded-lg border transition-all text-sm font-medium ${credits === amt ? 'bg-stone-900 text-white' : 'bg-white'}`}
                                        >€{amt}</button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="px-8 py-5 border-t border-stone-100 bg-stone-50 flex justify-between items-center shrink-0">
                    {step > 1 ? (
                        <AnimatedButton 
                            text="Back" 
                            icon={<ChevronLeft size={18} />} 
                            onClick={prevStep}
                            variant="light"
                            width="100px"
                        />
                    ) : (
                        <div></div> 
                    )}

                    {step < 3 ? (
                        <AnimatedButton 
                            text="Continue" 
                            icon={<ChevronRight size={18} />} 
                            onClick={nextStep}
                            width="120px"
                        />
                    ) : (
                        <AnimatedButton 
                            text="Activate" 
                            icon={<CheckCircle size={18} />} 
                            onClick={handleComplete}
                            width="130px"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [selectedSuite, setSelectedSuite] = useState<ModuleSuite | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Agent Configuration
    const agents = [
        { 
            id: 'amelia', 
            name: 'Amelia', 
            role: 'External Interface', 
            metricLabel: 'Intent Accuracy', 
            metricValue: '99.2%', 
            status: 'ONLINE', 
            initial: 'A',
            icon: MessageCircle,
            colorClass: 'text-emerald-500',
            hoverBorderClass: 'group-hover:border-emerald-500',
            borderClass: 'border-emerald-100'
        },
        { 
            id: 'lara', 
            name: 'Lara', 
            role: 'Revenue Engine', 
            metricLabel: 'Upsell Conversion', 
            metricValue: '24.8%', 
            status: 'WORKING', 
            initial: 'L',
            icon: TrendingUp,
            colorClass: 'text-armonyco-gold',
            hoverBorderClass: 'group-hover:border-armonyco-gold',
            borderClass: 'border-[#EADBC4]' 
        },
        { 
            id: 'elon', 
            name: 'Elon', 
            role: 'Operations Engine', 
            metricLabel: 'Dispatch Validity', 
            metricValue: '100.0%', 
            status: 'ONLINE', 
            initial: 'E',
            icon: Activity,
            colorClass: 'text-blue-500',
            hoverBorderClass: 'group-hover:border-blue-500',
            borderClass: 'border-blue-100'
        },
        { 
            id: 'james', 
            name: 'James', 
            role: 'Compliance Engine', 
            metricLabel: 'Policy Adherence', 
            metricValue: '100.0%', 
            status: 'AUDITING', 
            initial: 'J',
            icon: Shield,
            colorClass: 'text-stone-500',
            hoverBorderClass: 'group-hover:border-stone-500',
            borderClass: 'border-stone-200'
        },
    ];

    return (
        <div className="bg-stone-50 min-h-screen font-sans text-stone-900 selection:bg-armonyco-gold/30">
            {/* Header */}
            <nav className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 md:px-24 h-20 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-stone-900 flex items-center justify-center text-armonyco-gold font-bold text-xs shadow-sm">A</div>
                    <span className="font-bold tracking-tight text-stone-900">ARMONYCO</span>
                </div>
                
                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-4 text-sm font-medium text-stone-600">
                    {/* ... (Menu items same as before) ... */}
                    <div className="relative group">
                        <a href="#governance" className="px-4 py-2 rounded-lg group-hover:bg-stone-100 text-stone-600 group-hover:text-stone-900 transition-all duration-200 flex items-center gap-1">
                            Governance <ChevronDown size={14} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
                        </a>
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-stone-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 p-2 z-50">
                            <div className="flex flex-col gap-1">
                                <a href="#governed-value" className="text-left px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors group/item block">
                                    <div className="text-stone-900 font-medium text-sm group-hover/item:text-armonyco-gold">Governed Value™</div>
                                    <div className="text-xs text-stone-400">Certified Cashflow</div>
                                </a>
                                <a href="#decision-log" className="text-left px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors group/item block">
                                    <div className="text-stone-900 font-medium text-sm group-hover/item:text-armonyco-gold">Immutable Decision Log</div>
                                    <div className="text-xs text-stone-400">Institutional Continuity</div>
                                </a>
                                <a href="#compliance-rate" className="text-left px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors group/item block">
                                    <div className="text-stone-900 font-medium text-sm group-hover/item:text-armonyco-gold">Autonomous Compliance</div>
                                    <div className="text-xs text-stone-400">Policy Enforcement</div>
                                </a>
                                <a href="#human-risk" className="text-left px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors group/item block">
                                    <div className="text-stone-900 font-medium text-sm group-hover/item:text-armonyco-gold">Human Risk Exposure</div>
                                    <div className="text-xs text-stone-400">Volatility Reduction</div>
                                </a>
                                <a href="#residual-risk" className="text-left px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors group/item block">
                                    <div className="text-stone-900 font-medium text-sm group-hover/item:text-armonyco-gold">Residual Risk Rate</div>
                                    <div className="text-xs text-stone-400">Ungoverned Events</div>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <a href="#core" className="px-4 py-2 rounded-lg group-hover:bg-stone-100 text-stone-600 group-hover:text-stone-900 transition-all duration-200 flex items-center gap-1">
                            Core <ChevronDown size={14} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
                        </a>
                        <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-stone-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 p-2 z-50">
                            <div className="flex flex-col gap-1">
                                <a href="#aem" className="text-left px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors group/item block">
                                    <div className="text-stone-900 font-medium text-sm group-hover/item:text-armonyco-gold">AEM Event Model™</div>
                                    <div className="text-xs text-stone-400">Canonical Truth</div>
                                </a>
                                <a href="#aos" className="text-left px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors group/item block">
                                    <div className="text-stone-900 font-medium text-sm group-hover/item:text-armonyco-gold">AOS Operating System™</div>
                                    <div className="text-xs text-stone-400">Execution Engine</div>
                                </a>
                                <a href="#ars" className="text-left px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors group/item block">
                                    <div className="text-stone-900 font-medium text-sm group-hover/item:text-armonyco-gold">ARS Reliability™</div>
                                    <div className="text-xs text-stone-400">Evidence Standard</div>
                                </a>
                                <a href="#ags" className="text-left px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors group/item block">
                                    <div className="text-stone-900 font-medium text-sm group-hover/item:text-armonyco-gold">AGS Governance™</div>
                                    <div className="text-xs text-stone-400">Trust Scorecard</div>
                                </a>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <a href="#products" className="px-4 py-2 rounded-lg group-hover:bg-stone-100 text-stone-600 group-hover:text-stone-900 transition-all duration-200 flex items-center gap-1">
                            Products <ChevronDown size={14} className="text-stone-400 group-hover:text-stone-900 transition-colors" />
                        </a>
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 p-2 z-50">
                            <div className="flex flex-col gap-1">
                                <button onClick={() => setSelectedSuite('GUEST')} className="text-left px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors group/item w-full">
                                    <div className="text-stone-900 font-medium text-sm group-hover/item:text-armonyco-gold">Guest Experience</div>
                                    <div className="text-xs text-stone-400">Pre-arrival & Access</div>
                                </button>
                                <button onClick={() => setSelectedSuite('REVENUE')} className="text-left px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors group/item w-full">
                                    <div className="text-stone-900 font-medium text-sm group-hover/item:text-armonyco-gold">Revenue Gen</div>
                                    <div className="text-xs text-stone-400">Gap Monetization</div>
                                </button>
                                <button onClick={() => setSelectedSuite('OPS')} className="text-left px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors group/item w-full">
                                    <div className="text-stone-900 font-medium text-sm group-hover/item:text-armonyco-gold">Operational Efficiency</div>
                                    <div className="text-xs text-stone-400">Triage & Dispatch</div>
                                </button>
                                <button onClick={() => setSelectedSuite('RESPONSE')} className="text-left px-4 py-3 rounded-lg hover:bg-stone-50 transition-colors group/item w-full">
                                    <div className="text-stone-900 font-medium text-sm group-hover/item:text-armonyco-gold">Incident Response</div>
                                    <div className="text-xs text-stone-400">Playbook Execution</div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <a href="#manifesto" className="px-4 py-2 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-all duration-200">Manifesto</a>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-4">
                        <button 
                            onClick={() => setIsSignInOpen(true)}
                            className="px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider text-stone-900 hover:bg-stone-100 transition-all"
                        >
                            Sign In
                        </button>
                        <AnimatedButton 
                            text="Start Now"
                            icon={<ArrowRight size={18} />}
                            width="130px"
                            onClick={() => setIsSignUpOpen(true)}
                        />
                    </div>

                    <button 
                        className="md:hidden text-stone-900 p-2 hover:bg-stone-100 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="fixed top-20 inset-x-0 bg-white border-b border-stone-200 p-6 md:hidden z-50 shadow-2xl animate-in slide-in-from-top-5 flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
                    <a href="#governance" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-stone-900 block p-2 hover:bg-stone-50 rounded">Governance</a>
                    <a href="#core" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-stone-900 block p-2 hover:bg-stone-50 rounded">Core</a>
                    <a href="#products" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-stone-900 block p-2 hover:bg-stone-50 rounded">Products</a>
                    <a href="#manifesto" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-stone-900 block p-2 hover:bg-stone-50 rounded">Manifesto</a>

                    <div className="pt-6 border-t border-stone-100 flex flex-col gap-4 items-center">
                        <button 
                            onClick={() => { setIsSignInOpen(true); setIsMobileMenuOpen(false); }}
                            className="w-full py-3 text-sm font-bold uppercase tracking-wider text-stone-900 border border-stone-200 rounded text-center hover:bg-stone-50"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setIsSignUpOpen(true); setIsMobileMenuOpen(false); }}
                            className="w-full py-3 text-sm font-bold uppercase tracking-wider text-white bg-stone-900 rounded text-center shadow-lg flex items-center justify-center gap-2"
                        >
                            Start Now <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            <main>
                <Hero />
                <Pillars />
                <Constructs />
                
                {/* Active Workforce Section - USING FLEX NOW */}
                <section className="py-24 px-6 md:px-24 bg-stone-50 border-b border-stone-200">
                    <div className="mb-16">
                        <h2 className="text-4xl text-stone-900 font-light mb-4">The Active Workforce</h2>
                        <p className="text-stone-500 max-w-3xl text-lg">
                            Armonyco isn't just software. It's a workforce. Meet the specialized AI agents that execute your governance protocols 24/7, turning policy into proof.
                        </p>
                    </div>
                    
                    {/* Updated to Flex Row for the Expansion Effect */}
                    <div className="flex flex-col lg:flex-row gap-6 w-full h-auto lg:h-[340px]">
                        {agents.map((agent) => (
                            <AgentCard 
                                key={agent.id}
                                name={agent.name}
                                role={agent.role}
                                metricLabel={agent.metricLabel}
                                metricValue={agent.metricValue}
                                status={agent.status}
                                initial={agent.initial}
                                icon={agent.icon}
                                colorClass={agent.colorClass}
                                hoverBorderClass={agent.hoverBorderClass}
                                borderClass={agent.borderClass}
                            />
                        ))}
                    </div>
                </section>

                <section id="products" className="py-24 px-6 md:px-24 bg-white border-b border-stone-200 scroll-mt-20">
                    <div className="mb-16">
                        <h2 className="text-4xl text-stone-900 font-light mb-4">Products</h2>
                        <p className="text-stone-500 max-w-3xl text-lg">Operational coverage for the critical moments of truth.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div id="products-guest" onClick={() => setSelectedSuite('GUEST')} className="p-6 ui-card cursor-pointer group">
                             <h3 className="text-lg font-medium text-stone-900 mb-2 group-hover:text-armonyco-gold transition-colors">Guest Experience</h3>
                             <p className="text-sm text-stone-500">Pre-arrival, access, and self-resolution.</p>
                        </div>
                        <div id="products-revenue" onClick={() => setSelectedSuite('REVENUE')} className="p-6 ui-card cursor-pointer group">
                             <h3 className="text-lg font-medium text-stone-900 mb-2 group-hover:text-armonyco-gold transition-colors">Revenue Generation</h3>
                             <p className="text-sm text-stone-500">Monetization of exceptions and opportunities.</p>
                        </div>
                        <div id="products-ops" onClick={() => setSelectedSuite('OPS')} className="p-6 ui-card cursor-pointer group">
                             <h3 className="text-lg font-medium text-stone-900 mb-2 group-hover:text-armonyco-gold transition-colors">Operational Efficiency</h3>
                             <p className="text-sm text-stone-500">Triage and closure for real-world operations.</p>
                        </div>
                        <div id="products-response" onClick={() => setSelectedSuite('RESPONSE')} className="p-6 ui-card cursor-pointer group">
                             <h3 className="text-lg font-medium text-stone-900 mb-2 group-hover:text-armonyco-gold transition-colors">Incident Response</h3>
                             <p className="text-sm text-stone-500">Policy-driven incident handling playbooks.</p>
                        </div>
                    </div>
                </section>
                <Addendums />
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
import React, { useState, useEffect } from 'react';
import { Header } from '../components/landing/Header';
import { Footer } from '../components/landing/Footer';
import { SignInModal } from '../components/landing/SignInModal';
import { SignUpWizard } from '../components/landing/SignUpWizard';
import { ContactModal } from '../components/landing/ContactModal';
import { ModuleListModal, ModuleSuite } from '../components/landing/ModuleListModal';
import { ArrowRight, Building, Shield, TrendingUp, Globe, FileText, CheckCircle, Activity, Zap, AlertCircle } from '../components/ui/Icons';

interface SolutionsPageProps {
    onLogin: (data?: any) => void;
    onBack: () => void;
    industry?: 'pm' | 'ins' | 'inv' | 'ent';
    onNavigateIndustry: (industry?: 'pm' | 'ins' | 'inv' | 'ent') => void;
    onNavigateSection: (sectionId: string) => void;
}

export const SolutionsPage: React.FC<SolutionsPageProps> = ({ onLogin, onBack, industry, onNavigateIndustry, onNavigateSection }) => {
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [selectedSuite, setSelectedSuite] = useState<ModuleSuite | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [industry]);

    interface Metric {
        label: string;
        value: string;
        desc?: string;
        icon?: any;
    }

    interface IndustryData {
        title: string;
        desc: string;
        image: string;
        heroTitle: string;
        subHeadline: string;
        bullets: string[];
        metrics?: {
            friction: Metric[];
            outcomes: Metric[];
        };
        cta: string;
        badge?: string;
        products: {
            name: string;
            code: string;
            agent: string;
            category: string;
            status: string;
        }[];
    }

    const industries = {
        pm: {
            title: "Property Managers",
            desc: "Governing thousands of units with high-density labor orchestration and immutable proof of control.",
            image: "/assets/solutions/pm-bg.jpg",
            badge: "- LAVORO + RICAVI",
            heroTitle: "Stop Managing. Start Governing. The life-saver for the modern operator.",
            subHeadline: "Armonyco is the silence in the storm. At scale, Decision OS turns daily operational trauma into predictable cashflow.",
            bullets: [
                "Chaos → Predictable Cashflow",
                "Scalable Decision Protocols",
                "Immutable Audit Trails"
            ],
            metrics: {
                friction: [
                    { label: "Hosts with another job", value: "83%", desc: "Fragmented focus needs autonomous systems." },
                    { label: "Work < 10h/week", value: "71%", desc: "But they stay 'on-call' 24/7. Stress is high." },
                    { label: "Can't find reliable teams", value: "49%", desc: "Operational bottleneck for scaling." },
                    { label: "Fear losing OTA rank", value: "63%", desc: "Directly impacts revenue stability." }
                ],
                outcomes: [
                    { label: "Ops Automated", value: "+80%", icon: Zap },
                    { label: "Time Saved", value: "+40%", icon: Activity },
                    { label: "Revenue Increase", value: "+15%", icon: TrendingUp },
                    { label: "Active Messages", value: "-85%", icon: Shield }
                ]
            },
            cta: "Deploy Decision OS for PM",
            products: [
                { name: 'Pre-arrival Info', code: 'CC-01', agent: 'Lara + Amelia', category: 'GUEST', status: 'Governed' },
                { name: 'Check-in Instructions + Access', code: 'CC-02', agent: 'James + Amelia', category: 'GUEST', status: 'Governed' },
                { name: 'Wi-Fi & House Manual (Top FAQ)', code: 'CC-03', agent: 'Amelia', category: 'GUEST', status: 'Governed' },
                { name: 'Checkout + Deposits/Tax', code: 'CC-04', agent: 'Amelia', category: 'GUEST', status: 'Governed' },
                { name: 'Issue Triage', code: 'CC-05', agent: 'Amelia', category: 'GUEST', status: 'Governed' },
                { name: 'Multi-language + Brand Tone', code: 'CC-06', agent: 'Lara', category: 'GUEST', status: 'Governed' },
                { name: 'Orphan Days / Stay Extension', code: 'CC-07', agent: 'James', category: 'REVENUE', status: 'Autonomous' },
                { name: 'Late Check-out Upsell', code: 'CC-08', agent: 'James + Amelia', category: 'REVENUE', status: 'Autonomous' },
                { name: 'Transfer / Experience Upsell', code: 'CC-09', agent: 'James', category: 'REVENUE', status: 'Autonomous' },
                { name: 'Maintenance Triage', code: 'CC-10', agent: 'Amelia + Elon', category: 'OPS', status: 'Matrix Active' },
                { name: 'Housekeeping Exceptions', code: 'CC-11', agent: 'Amelia + Elon', category: 'OPS', status: 'Matrix Active' },
                { name: 'Human Escalation Pack', code: 'CC-12', agent: 'Amelia', category: 'OPS', status: 'Governed' },
                { name: 'Guest can’t enter (Smart Lock)', code: 'PB-01', agent: 'James', category: 'INCIDENT', status: 'Rapid Dispatch' },
                { name: 'Wi-Fi not working', code: 'PB-02', agent: 'Amelia', category: 'INCIDENT', status: 'Rapid Dispatch' },
                { name: 'Noise / complaint', code: 'PB-03', agent: 'Amelia', category: 'INCIDENT', status: 'Rapid Dispatch' },
                { name: 'AC/Heating not working', code: 'PB-04', agent: 'Amelia + Elon', category: 'INCIDENT', status: 'Rapid Dispatch' },
                { name: 'No hot water', code: 'PB-05', agent: 'Amelia + Elon', category: 'INCIDENT', status: 'Rapid Dispatch' },
                { name: 'Cleaning not satisfactory', code: 'PB-06', agent: 'Amelia + Elon', category: 'INCIDENT', status: 'Rapid Dispatch' },
                { name: 'Early check-in request', code: 'PB-07', agent: 'Amelia', category: 'INCIDENT', status: 'Rapid Dispatch' },
                { name: 'Late checkout request', code: 'PB-08', agent: 'Amelia', category: 'INCIDENT', status: 'Rapid Dispatch' },
                { name: 'Missing payment / city tax', code: 'PB-09', agent: 'James', category: 'INCIDENT', status: 'Rapid Dispatch' },
                { name: 'Missing ID / document', code: 'PB-10', agent: 'Lara', category: 'INCIDENT', status: 'Rapid Dispatch' }
            ]
        } as IndustryData,
        ins: {
            title: "Insurance",
            desc: "Providing the data substrate for real-time risk modification and fiduciary accountability.",
            image: "/assets/solutions/insurers-bg.jpg",
            heroTitle: "Claims management with standards, evidence, and velocity.",
            subHeadline: "Armonyco governs every event from FNOL to closure: triage, checks, evidence, escalation, and metrics.",
            bullets: [
                "Less manual work, more control",
                "Immutable Dossier and Decision Log",
                "Real-time risk mitigation"
            ],
            cta: "Request a demo for Insurance",
            products: [
                { name: 'FNOL Intake & Structuring', code: 'AS-01', agent: 'Amelia', category: 'CLAIMS', status: 'Governed' },
                { name: 'Coverage Eligibility Check', code: 'AS-02', agent: 'James', category: 'COMPLIANCE', status: 'Governed' },
                { name: 'Claim Triage & Routing', code: 'AS-03', agent: 'Amelia', category: 'OPS', status: 'Autonomous' },
                { name: 'Fraud Signal Monitor', code: 'AS-04', agent: 'James', category: 'RISK', status: 'Matrix Active' },
                { name: 'Document Completeness Pack', code: 'AS-05', agent: 'Lara', category: 'EVIDENCE', status: 'Governed' },
                { name: 'Repair Coordination', code: 'AS-06', agent: 'Elon', category: 'VENDORS', status: 'Rapid Dispatch' },
                { name: 'Reserve Adequacy Check', code: 'AS-07', agent: 'James', category: 'FINANCIAL', status: 'Matrix Active' },
                { name: 'Regulatory Events', code: 'AS-08', agent: 'Lara', category: 'COMPLIANCE', status: 'Governed' },
                { name: 'Customer Communication', code: 'AS-09', agent: 'Amelia', category: 'GUEST', status: 'Governed' },
                { name: 'Subrogation Detection', code: 'AS-10', agent: 'James', category: 'REVENUE', status: 'Autonomous' }
            ]
        } as IndustryData,
        inv: {
            title: "Investment Funds",
            desc: "Securing institutional capital through standardized operational auditing and asset protection.",
            image: "/assets/solutions/investors-bg.jpg",
            heroTitle: "Operational governance for thousands of units.",
            subHeadline: "Armonyco transforms triage, maintenance, and access into auditable events. Zero memory dependence.",
            bullets: [
                "Exceptions become data, not chaos",
                "Real-time risk mitigation",
                "Proof of performance per unit"
            ],
            cta: "Request a demo for Funds",
            products: [
                { name: 'NAV Exception Triage', code: 'FI-01', agent: 'James', category: 'PORTFOLIO', status: 'Governed' },
                { name: 'Cashflow Reconciliation', code: 'FI-02', agent: 'James', category: 'FINANCIAL', status: 'Governed' },
                { name: 'Covenant Compliance Monitor', code: 'FI-03', agent: 'Lara', category: 'COMPLIANCE', status: 'Matrix Active' },
                { name: 'CapEx Approval Workflow', code: 'FI-04', agent: 'James', category: 'GOVERNANCE', status: 'Governed' },
                { name: 'Rent Roll Integrity Audit', code: 'FI-05', agent: 'Amelia', category: 'REPORTING', status: 'Governed' },
                { name: 'Vendor Contract Compliance', code: 'FI-06', agent: 'Elon', category: 'VENDORS', status: 'Matrix Active' },
                { name: 'Asset Performance Scorecard', code: 'FI-07', agent: 'Lara', category: 'RISK', status: 'Governed' },
                { name: 'ESG Evidence Pack', code: 'FI-08', agent: 'Lara', category: 'COMPLIANCE', status: 'Governed' },
                { name: 'Investor Reporting Pack', code: 'FI-09', agent: 'Amelia', category: 'REPORTING', status: 'Autonomous' },
                { name: 'Risk Scenario Alerts', code: 'FI-10', agent: 'James', category: 'RISK', status: 'Rapid Dispatch' }
            ]
        } as IndustryData,
        ent: {
            title: "Enterprise",
            desc: "Global governance layers for cross-border operations and complex stakeholder ecologies.",
            image: "/assets/solutions/enterprise-bg.jpg",
            heroTitle: "Enterprise: Armonyco tailored for your organization.",
            subHeadline: "For companies with non-standard processes, risks, and integrations. We design a tailored system.",
            bullets: [
                "Non-standard processes",
                "Multiple and complex integrations",
                "Custom IT and legal requirements"
            ],
            cta: "Contact us (Enterprise)",
            products: [
                { name: 'Custom Services Pack', code: 'ENT-01', agent: 'Matrix Team', category: 'CUSTOM', status: 'Tailored' },
                { name: 'Integration Pack', code: 'ENT-02', agent: 'Elon + James', category: 'INTEGRATION', status: 'Matrix Active' },
                { name: 'Security & Audit Pack', code: 'ENT-03', agent: 'Lara + James', category: 'SECURITY', status: 'Governed' },
                { name: 'SLA & Reliability Pack', code: 'ENT-04', agent: 'Elon + Amelia', category: 'RELIABILITY', status: 'Rapid Dispatch' }
            ]
        } as IndustryData
    };

    const renderRegistry = () => {
        if (!industry) return null;
        const products = industries[industry].products;

        // Grouping for PM specifically for "Complete Registry" feel
        if (industry === 'pm') {
            const categories = ['GUEST', 'REVENUE', 'OPS', 'INCIDENT'];
            return (
                <div className="space-y-16">
                    {categories.map(cat => (
                        <div key={cat} className="space-y-8">
                            <div className="flex items-center gap-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 shrink-0">
                                    {cat === 'INCIDENT' ? 'Incident Response' :
                                        cat === 'OPS' ? 'Operational Efficiency' :
                                            cat === 'REVENUE' ? 'Revenue Generation' : 'Guest Experience'}
                                </h4>
                                <div className="h-px bg-zinc-100 flex-1"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {products.filter(p => p.category === cat).map(item => (
                                    <div key={item.code} className="p-6 rounded-[2rem] bg-white border-2 border-zinc-50 hover:border-[var(--color-brand-accent)]/20 hover:shadow-xl transition-all group flex flex-col justify-between h-full relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight size={10} className="text-[var(--color-brand-accent)]" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="text-[9px] font-mono text-zinc-400 font-bold uppercase tracking-widest">{item.code}</span>
                                                <span className={`text-[7px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest ${item.status === 'Governed' ? 'bg-emerald-500/10 text-emerald-600' :
                                                    item.status === 'Autonomous' ? 'bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)]' :
                                                        'bg-indigo-500/10 text-indigo-600'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                            <h4 className="text-[12px] font-bold text-zinc-900 mb-2 leading-tight group-hover:text-[var(--color-brand-accent)] transition-colors">{item.name}</h4>
                                            <div className="flex items-center gap-2 mt-auto pt-4 border-t border-zinc-50/50">
                                                <div className="w-4 h-4 rounded-full bg-zinc-100 flex items-center justify-center text-[8px] font-bold text-zinc-400">
                                                    {item.agent.charAt(0)}
                                                </div>
                                                <p className="text-[9px] text-zinc-400 font-medium italic">by {item.agent}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(item => (
                    <div key={item.code} className="p-6 rounded-[2rem] bg-white border border-zinc-100 hover:border-[var(--color-brand-accent)]/30 hover:shadow-2xl transition-all group flex flex-col justify-between h-full">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-widest">{item.code}</span>
                                <span className={`text-[9px] px-2 py-1 rounded-full font-black uppercase tracking-widest ${item.status === 'Governed' ? 'bg-emerald-500/10 text-emerald-600' :
                                    item.status === 'Autonomous' ? 'bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)]' :
                                        'bg-indigo-500/10 text-indigo-600'
                                    }`}>
                                    {item.status}
                                </span>
                            </div>
                            <h4 className="text-lg font-bold text-zinc-900 mb-2 leading-tight">{item.name}</h4>
                        </div>
                        <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                            <p className="text-[11px] text-zinc-500 font-medium italic">Managed by {item.agent}</p>
                            <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-[var(--color-brand-accent)]/10 transition-colors">
                                <ArrowRight size={14} className="text-zinc-400 group-hover:text-[var(--color-brand-accent)]" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="bg-stone-50 min-h-screen font-sans text-stone-900 selection:bg-armonyco-gold/30">
            <Header
                onLogin={() => setIsSignInOpen(true)}
                onSignUp={() => setIsSignUpOpen(true)}
                onContact={() => setIsContactOpen(true)}
                onNavigateSolutions={onNavigateIndustry}
                onNavigateSection={onNavigateSection}
            />

            <main className="pt-32 pb-24">
                <section id="solutions" className="px-6 md:px-24">
                    {!industry ? (
                        <>
                            {/* Selection State / Solutions Intro */}
                            <div className="mb-20">
                                <div className="flex items-center gap-2 mb-4">
                                    <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-muted)] hover:opacity-70 transition-opacity flex items-center gap-1">
                                        ← Back to Start
                                    </button>
                                </div>

                                <div className="mb-24">
                                    <h4 className="text-[var(--color-brand-accent)] text-xs font-bold uppercase tracking-widest mb-4">The Point of No Return</h4>
                                    <h2 className="text-5xl md:text-7xl text-zinc-900 font-light mb-12 leading-[1.1] tracking-tight">If it isn't governed,<br />it isn't real cash flow.</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
                                        <div>
                                            <p className="text-zinc-500 text-xl leading-relaxed mb-6">
                                                The industry fails due to lack of systems, not tools. Memory is not a system. WhatsApp is not governance.
                                            </p>
                                            <p className="text-zinc-900 font-medium italic text-xl border-l-2 border-[var(--color-brand-accent)] pl-6">
                                                Armonyco Protocol: How much cash flow does each unit produce under auditable governance?
                                            </p>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="flex gap-4">
                                                <div className="w-1 h-full bg-zinc-100 shrink-0"></div>
                                                <div>
                                                    <p className="text-lg font-bold text-zinc-900 mb-1">Structural Responsibility</p>
                                                    <p className="text-sm text-zinc-500">Introducing accountability that survives individuals.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-1 h-full bg-zinc-100 shrink-0"></div>
                                                <div>
                                                    <p className="text-lg font-bold text-zinc-900 mb-1">Immutable Decision Log</p>
                                                    <p className="text-sm text-zinc-500">Chronological and non-rewritable evidence of every verdict.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Industry Showcase Cards */}
                                <div className="mt-32">
                                    <div className="mb-16">
                                        <h4 className="text-[var(--color-brand-accent)] text-[10px] font-black uppercase tracking-[0.3em] mb-4">Institutional Contexts</h4>
                                        <h2 className="text-4xl text-zinc-900 font-light leading-tight">Industry Showcase</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {(Object.keys(industries) as Array<keyof typeof industries>).map(key => (
                                            <div
                                                key={key}
                                                onClick={() => onNavigateIndustry(key)}
                                                className="group relative overflow-hidden rounded-[2.5rem] bg-zinc-900 border border-white/5 shadow-2xl transition-all hover:scale-[1.02] cursor-pointer"
                                            >
                                                <img src={industries[key].image} alt={industries[key].title} className="w-full h-[500px] object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent p-12 flex flex-col justify-end">
                                                    <h3 className="text-3xl text-white font-medium mb-4">{industries[key].title}</h3>
                                                    <p className="text-zinc-400 text-lg max-w-md mb-8">{industries[key].desc}</p>
                                                    <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                                                        Explore Registry <ArrowRight size={18} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Detail State / Industry Registry */}
                            <div className="mb-20">
                                <div className="flex items-center gap-2 mb-4">
                                    <button onClick={() => onNavigateIndustry(undefined)} className="text-[10px] font-black uppercase tracking-widest text-[var(--color-brand-accent)] hover:opacity-70 transition-opacity flex items-center gap-1">
                                        ← Back to Showcase
                                    </button>
                                </div>

                                {industries[industry].badge && (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-brand-accent)] text-white text-[10px] font-black uppercase tracking-[0.3em] mb-8 animate-fade-in shadow-lg shadow-[var(--color-brand-accent)]/20">
                                        <Zap size={14} className="fill-current" />
                                        {industries[industry].badge}
                                    </div>
                                )}

                                <h2 className="text-5xl text-zinc-900 font-light mb-6 leading-tight">{industries[industry].heroTitle}</h2>
                                <p className="text-zinc-500 max-w-3xl text-xl leading-relaxed mb-12">{industries[industry].subHeadline}</p>

                                {/* IMPACT METRICS (V0 Legacy Influence) */}
                                {industries[industry].metrics && (
                                    <div className="space-y-20 mb-32">
                                        {/* Row 1: The Friction */}
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-10 text-center">The Friction: Why operators fail to scale</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                                {industries[industry].metrics.friction.map((m, i) => (
                                                    <div key={i} className="p-8 rounded-[2rem] bg-zinc-50 border border-zinc-100 flex flex-col items-center text-center">
                                                        <span className="text-4xl font-light text-zinc-900 mb-4">{m.value}</span>
                                                        <h5 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-2">{m.label}</h5>
                                                        <p className="text-[10px] text-zinc-500 leading-relaxed italic">{m.desc}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Row 2: The Outcome */}
                                        <div className="p-12 rounded-[3rem] bg-zinc-900 border border-white/5 shadow-2xl relative overflow-hidden mb-24">
                                            <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-brand-accent)]/10 blur-[120px] rounded-full"></div>
                                            <div className="relative z-10 text-center">
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-brand-accent)] mb-12">The Outcome: Total Operational Harmony</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                                                    {industries[industry].metrics.outcomes.map((m, i) => (
                                                        <div key={i} className="flex flex-col items-center group">
                                                            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--color-brand-accent)]/10 group-hover:border-[var(--color-brand-accent)]/30 transition-all duration-500">
                                                                <m.icon size={28} className="text-[var(--color-brand-accent)]" />
                                                            </div>
                                                            <span className="text-6xl font-light text-white mb-2 tracking-tighter drop-shadow-[0_0_15px_rgba(197,165,114,0.3)]">{m.value}</span>
                                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-zinc-300 transition-colors">{m.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {industry === 'pm' && (
                                            <div className="mb-24 relative">
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                                                    <div className="order-2 lg:order-1 flex">
                                                        <div className="relative rounded-[3rem] overflow-hidden border border-zinc-200 shadow-2xl w-full">
                                                            <img
                                                                src="/assets/solutions/decision-os-pm.png"
                                                                alt="The Decision OS"
                                                                className="w-full h-full object-cover"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent"></div>
                                                            <div className="absolute bottom-10 left-10 right-10">
                                                                <p className="text-white text-lg font-light italic leading-relaxed">
                                                                    "Silence is the ultimate luxury for an operator. Armonyco delivers it through immutable governance."
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="order-1 lg:order-2 space-y-10">
                                                        <div className="p-8 rounded-[2rem] bg-white border border-zinc-100 shadow-lg relative overflow-hidden">
                                                            <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
                                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-4">THE CHAOS (Before)</h5>
                                                            <ul className="space-y-4">
                                                                {[
                                                                    "Fragmented data across WhatsApp & dynamic tools",
                                                                    "Memory-dependent decision making",
                                                                    "Operational trauma and burnout-level stress",
                                                                    "Zero auditable proof of control for owners"
                                                                ].map((p, i) => (
                                                                    <li key={i} className="text-sm text-zinc-500 flex items-start gap-3">
                                                                        <span className="text-red-400 mt-1">✕</span> {p}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="p-8 rounded-[2rem] bg-zinc-900 border border-[var(--color-brand-accent)]/30 shadow-2xl relative overflow-hidden">
                                                            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-brand-accent)]"></div>
                                                            <h5 className="text-[10px] font-black uppercase tracking-widest text-[var(--color-brand-accent)] mb-4">THE HARMONY (With Armonyco)</h5>
                                                            <ul className="space-y-4">
                                                                {[
                                                                    "Unified Decision OS (One Source of Truth)",
                                                                    "Autonomous governance protocols",
                                                                    "Predictable, auditable guest experiences",
                                                                    "Full evidence logs for institutional audits"
                                                                ].map((p, i) => (
                                                                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-3">
                                                                        <span className="text-[var(--color-brand-accent)] mt-1">✓</span> {p}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="pt-6">
                                                            <h3 className="text-4xl text-zinc-900 font-light leading-tight mb-6">Your life back.<br /><span className="text-[var(--color-brand-accent)] font-medium">Your business governed.</span></h3>
                                                            <button className="px-10 py-5 bg-zinc-900 text-white text-xs font-black uppercase tracking-[0.3em] rounded-full hover:bg-[var(--color-brand-accent)] transition-all transform hover:scale-105 shadow-xl">
                                                                Deploy System Harmony
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                                    {industries[industry].bullets.map((bullet, i) => (
                                        <div key={i} className="flex gap-4 p-6 rounded-2xl bg-white border border-zinc-100 items-center shadow-sm">
                                            <div className="p-2 rounded-lg bg-[var(--color-brand-accent)]/10">
                                                <CheckCircle className="text-[var(--color-brand-accent)]" size={18} />
                                            </div>
                                            <span className="text-zinc-900 font-bold text-sm">{bullet}</span>
                                        </div>
                                    ))}
                                </div>

                                {industry === 'pm' && (
                                    <div className="mb-24 p-12 rounded-[3rem] bg-zinc-50 border border-zinc-200">
                                        <div className="flex flex-col lg:flex-row gap-12 items-center">
                                            <div className="lg:w-1/3 text-center lg:text-left">
                                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--color-brand-accent)] mb-4">Protocol Standards</h3>
                                                <h4 className="text-3xl font-light text-zinc-900 leading-tight mb-6">Built for scales where memory fails.</h4>
                                                <p className="text-sm text-zinc-500 leading-relaxed">
                                                    Institutional governance isn't about better tools; it's about immutable sequences that produce auditable truth every single day.
                                                </p>
                                            </div>
                                            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6 w-full">
                                                {[
                                                    { label: "AVG Response", value: "< 5m", sub: "Global SLA" },
                                                    { label: "Gov. Accuracy", value: "99.9%", sub: "Audited cycles" },
                                                    { label: "Data Retention", value: "7Y", sub: "Immutable Log" },
                                                    { label: "Integration", value: "PMS", sub: "Real-time sync" },
                                                    { label: "Dispatch", value: "Auto", sub: "Zero lag time" },
                                                    { label: "Audit Trait", value: "Full", sub: "Legal evidence" }
                                                ].map((spec, i) => (
                                                    <div key={i} className="p-6 rounded-2xl bg-white border border-zinc-100 text-center">
                                                        <div className="text-2xl font-light text-zinc-900 mb-1">{spec.value}</div>
                                                        <div className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">{spec.label}</div>
                                                        <div className="text-[8px] text-zinc-400 italic">{spec.sub}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-12 flex items-center justify-between border-b border-zinc-100 pb-8">
                                    <div>
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-1">Operational Registry</h3>
                                        <p className="text-xs text-zinc-500">Certified modules for PM governance</p>
                                    </div>
                                    <button className="px-6 py-2.5 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:bg-[var(--color-brand-accent)] transition-colors flex items-center gap-2 group">
                                        {industries[industry].cta} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                {renderRegistry()}
                            </div>
                        </>
                    )}
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

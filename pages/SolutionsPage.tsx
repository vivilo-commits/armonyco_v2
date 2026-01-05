import React, { useState, useEffect } from 'react';
import { Header } from '../components/landing/Header';
import { Footer } from '../components/landing/Footer';
import { SignInModal } from '../components/landing/SignInModal';
import { SignUpWizard } from '../components/landing/SignUpWizard';
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
    const [selectedSuite, setSelectedSuite] = useState<ModuleSuite | null>(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [industry]);

    const industries = {
        pm: {
            title: "Property Managers",
            desc: "Governing thousands of units with high-density labor orchestration and immutable proof of control.",
            image: "/assets/solutions/pm-bg.jpg",
            heroTitle: "Armonyco turns daily operational chaos into predictable cashflow per unit.",
            subHeadline: "At scale, that’s what a Decision OS really is. Move beyond manual tasks to governed operational decisions.",
            bullets: [
                "Chaos → Predictable Cashflow",
                "Scalable Decision Protocols",
                "Immutable Audit Trails"
            ],
            cta: "Deploy Decision OS for PM",
            products: [
                { name: 'Pre-arrival Info', code: 'CC-01', agent: 'Lara + Amelia', category: 'GUEST', status: 'Governed' },
                { name: 'Check-in + Access', code: 'CC-02', agent: 'James + Amelia', category: 'GUEST', status: 'Governed' },
                { name: 'Arrival Support (WA)', code: 'CC-03', agent: 'Amelia', category: 'GUEST', status: 'Governed' },
                { name: 'Late Check-out Upsell', code: 'CC-08', agent: 'James + Amelia', category: 'REVENUE', status: 'Autonomous' },
                { name: 'Maintenance Triage', code: 'CC-10', agent: 'Amelia + Elon', category: 'OPS', status: 'Matrix Active' },
                { name: 'Noise Triage', code: 'PB-03', agent: 'Amelia', category: 'INCIDENT', status: 'Rapid Dispatch' }
            ]
        },
        ins: {
            title: "Assicurazioni",
            desc: "Providing the data substrate for real-time risk modification and fiduciary accountability.",
            image: "/assets/solutions/insurers-bg.jpg",
            heroTitle: "Gestione sinistri con standard, evidenze e velocità.",
            subHeadline: "Armonyco governa ogni evento dal FNOL alla chiusura: triage, controlli, prove, escalation e metriche.",
            bullets: [
                "Meno trabalho manual, mais controle",
                "Dossiê e Log de Decisões imutável",
                "Riscos mitigados em tempo real"
            ],
            cta: "Richiedi uma demo per Assicurazioni",
            products: [
                { name: 'FNOL Intake & Structuring', code: 'AS-01', agent: 'Amelia', category: 'CLAIMS', status: 'Governed' },
                { name: 'Coverage Eligibility Check', code: 'AS-02', agent: 'James', category: 'COMPLIANCE', status: 'Governed' },
                { name: 'Claim Triage & Routing', code: 'AS-03', agent: 'Amelia', category: 'OPS', status: 'Autonomous' },
                { name: 'Fraud Signal Monitor', code: 'AS-04', agent: 'James', category: 'RISK', status: 'Matrix Active' },
                { name: 'Document Completeness Pack', code: 'AS-05', agent: 'Lara', category: 'EVIDENCE', status: 'Governed' },
                { name: 'Repair Coordination', code: 'AS-06', agent: 'Elon', category: 'VENDORS', status: 'Rapid Dispatch' },
                { name: 'Reserve Adequacy Check', code: 'AS-07', agent: 'James', category: 'FINANCIAL', status: 'Matrix Active' },
                { name: 'Regulatory Events (IVASS)', code: 'AS-08', agent: 'Lara', category: 'COMPLIANCE', status: 'Governed' },
                { name: 'Customer Communication', code: 'AS-09', agent: 'Amelia', category: 'GUEST', status: 'Governed' },
                { name: 'Subrogation Detection', code: 'AS-10', agent: 'James', category: 'REVENUE', status: 'Autonomous' }
            ]
        },
        inv: {
            title: "Fondi di Investimento",
            desc: "Securing institutional capital through standardized operational auditing and asset protection.",
            image: "/assets/solutions/investors-bg.jpg",
            heroTitle: "Governança operacional para milhares de unidades.",
            subHeadline: "O Armonyco transforma triagens, manutenções e acessos em eventos auditáveis. Zero dependência de memória.",
            bullets: [
                "Ecceções viram dados, não caos",
                "Riscos mitigados em tempo real",
                "Prova de performance per unit"
            ],
            cta: "Richiedi uma demo per Fondi",
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
        },
        ent: {
            title: "Enterprise",
            desc: "Global governance layers for cross-border operations and complex stakeholder ecologies.",
            image: "/assets/solutions/enterprise-bg.jpg",
            heroTitle: "Enterprise: Armonyco su misura per a sua organização.",
            subHeadline: "Para empresas com processos, riscos e integrações fora do padrão. Desenhamos um sistema sob medida.",
            bullets: [
                "Processos não padronizados",
                "Integrações multiplas e complexas",
                "Requisitos legais e de TI customizados"
            ],
            cta: "Fale conosco (Enterprise)",
            products: [
                { name: 'Custom Services Pack', code: 'ENT-01', agent: 'Matrix Team', category: 'CUSTOM', status: 'Tailored' },
                { name: 'Integration Pack', code: 'ENT-02', agent: 'Elon + James', category: 'INTEGRATION', status: 'Matrix Active' },
                { name: 'Security & Audit Pack', code: 'ENT-03', agent: 'Lara + James', category: 'SECURITY', status: 'Governed' },
                { name: 'SLA & Reliability Pack', code: 'ENT-04', agent: 'Elon + Amelia', category: 'RELIABILITY', status: 'Rapid Dispatch' }
            ]
        }
    };

    const renderRegistry = () => {
        if (!industry) return null;
        const products = industries[industry].products;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {products.map(item => (
                    <div key={item.code} className="p-4 rounded-2xl bg-white border border-zinc-100 hover:border-[var(--color-brand-accent)]/30 hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-3">
                            <span className="text-[9px] font-mono text-zinc-400 font-bold">{item.code}</span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-widest ${item.status === 'Governed' ? 'bg-emerald-500/10 text-emerald-600' :
                                item.status === 'Autonomous' ? 'bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)]' :
                                    'bg-indigo-500/10 text-indigo-600'
                                }`}>
                                {item.status}
                            </span>
                        </div>
                        <h4 className="text-sm font-bold text-zinc-900 mb-1">{item.name}</h4>
                        <p className="text-[10px] text-zinc-500 italic">By {item.agent}</p>
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
                                        ← Volver al Inicio
                                    </button>
                                </div>

                                <div className="mb-24">
                                    <h4 className="text-[var(--color-brand-accent)] text-xs font-bold uppercase tracking-widest mb-4">The Point of No Return</h4>
                                    <h2 className="text-5xl md:text-7xl text-zinc-900 font-light mb-12 leading-[1.1] tracking-tight">Se não é governado,<br />não é cashflow real.</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
                                        <div>
                                            <p className="text-zinc-500 text-xl leading-relaxed mb-6">
                                                A indústria falha por falta de sistemas, não de ferramentas. Memória não é sistema. WhatsApp não é governança.
                                            </p>
                                            <p className="text-zinc-900 font-medium italic text-xl border-l-2 border-[var(--color-brand-accent)] pl-6">
                                                Protocolo Armonyco: Quanto de cashflow cada unidade produz sob governança auditável?
                                            </p>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="flex gap-4">
                                                <div className="w-1 h-full bg-zinc-100 shrink-0"></div>
                                                <div>
                                                    <p className="text-lg font-bold text-zinc-900 mb-1">Responsabilidade Estrutural</p>
                                                    <p className="text-sm text-zinc-500">Introdução de accountability que sobrevive a indivíduos.</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="w-1 h-full bg-zinc-100 shrink-0"></div>
                                                <div>
                                                    <p className="text-lg font-bold text-zinc-900 mb-1">Log de Decisões Imutável</p>
                                                    <p className="text-sm text-zinc-500">Evidência cronológica e não regravável de cada veredito.</p>
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
                                        ← Volver al Showcase
                                    </button>
                                </div>
                                <h2 className="text-5xl text-zinc-900 font-light mb-6 leading-tight">{industries[industry].heroTitle}</h2>
                                <p className="text-zinc-500 max-w-3xl text-xl leading-relaxed mb-12">{industries[industry].subHeadline}</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                                    {industries[industry].bullets.map((bullet, i) => (
                                        <div key={i} className="flex gap-3">
                                            <CheckCircle className="text-[var(--color-brand-accent)] shrink-0" size={20} />
                                            <span className="text-zinc-700 font-medium">{bullet}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-12 flex items-center justify-between">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Registry Modules</h3>
                                    <button className="text-xs font-bold text-[var(--color-brand-accent)] uppercase tracking-widest hover:opacity-70 transition-opacity flex items-center gap-2">
                                        {industries[industry].cta} <ArrowRight size={14} />
                                    </button>
                                </div>

                                {renderRegistry()}
                            </div>
                        </>
                    )}
                </section>
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

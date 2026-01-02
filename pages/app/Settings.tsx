import React, { useState, useEffect } from 'react';
import { Settings, Bell, Layers, Database, Smartphone, Key, User, Building, CreditCard, BookOpen, HelpCircle, CheckCircle, ChevronRight, AlertTriangle, Calendar, Plus, RefreshCw, X, ArrowRight, Activity, FileText, Camera, LogOut, Moon, Sun, Monitor, Laptop, Shield, Lock, Clock, UploadCloud, Download, AlertCircle, Copy, Check, XCircle, Save, Link, IconSizes, Zap } from '../../components/ui/Icons';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Button } from '../../components/ui/Button';
import { FloatingInput } from '../../components/ui/FloatingInput';
import { Modal } from '../../components/ui/Modal';
import { Card } from '../../components/ui/Card';
import { authService, billingService, usageService } from '../../src/services';
import { UserProfile, Organization, BillingDetails, Invoice, PaymentMethod, UsageMetrics } from '../../src/types';

interface SettingsViewProps {
    activeView?: string;
    userProfile: UserProfile;
    onUpdateProfile: (data: Partial<UserProfile>) => void;
    organization: Organization;
    onUpdateOrganization: (data: Partial<Organization>) => void;
    billingDetails: BillingDetails;
    onUpdateBillingDetails: (data: Partial<BillingDetails>) => void;
    currentCredits: number;
    onUpdateCredits: (amount: number) => void;
}

type SettingsTab = 'PROFILE' | 'ORG' | 'BILLING';

// --- Helper for Cost ---
const COST_PER_CREDIT = 0.10; // Keeping for logic, but UI will not show Euros

export const SettingsView: React.FC<SettingsViewProps> = ({
    activeView,
    userProfile,
    onUpdateProfile,
    organization,
    onUpdateOrganization,
    billingDetails,
    onUpdateBillingDetails,
    currentCredits,
    onUpdateCredits
}) => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('PROFILE');

    // Effect to sync prop activeView with internal state
    useEffect(() => {
        if (activeView) {
            if (activeView === 'settings-profile') setActiveTab('PROFILE');
            if (activeView === 'settings-company') setActiveTab('ORG');
            if (activeView === 'settings-billing') setActiveTab('BILLING');
        }
    }, [activeView]);

    // -- Profile Local State (Synced with Props) --
    const [localProfile, setLocalProfile] = useState(userProfile);
    useEffect(() => setLocalProfile(userProfile), [userProfile]);

    const [emailVerified, setEmailVerified] = useState(true);
    const [phoneVerified, setPhoneVerified] = useState(false);

    // -- Org Local State (Synced with Props) --
    const [localOrg, setLocalOrg] = useState(organization);
    useEffect(() => setLocalOrg(organization), [organization]);

    // -- Billing Details Local State --
    const [localBillingDetails, setLocalBillingDetails] = useState(billingDetails);
    useEffect(() => setLocalBillingDetails(billingDetails), [billingDetails]);

    // -- Security State --
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    // -- Preferences State --
    const [timeFormat, setTimeFormat] = useState('24h');
    const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
    const [theme, setTheme] = useState('system');

    // -- Legal State --
    const [marketingConsent, setMarketingConsent] = useState(false);

    // -- Billing & Metrics State --
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [usageMetrics, setUsageMetrics] = useState<UsageMetrics | null>(null);

    useEffect(() => {
        const fetchBillingData = async () => {
            try {
                const [inv, pm, um] = await Promise.all([
                    billingService.getInvoices(),
                    billingService.getPaymentMethods(),
                    usageService.getMetrics()
                ]);
                setInvoices(inv);
                setPaymentMethods(pm);
                setUsageMetrics(um);
            } catch (error) {
                console.error('Failed to fetch billing data:', error);
            }
        };
        fetchBillingData();
    }, []);

    // State for Profile Modal
    const [showProfileModal, setShowProfileModal] = useState(false);
    // -- Top Up State --
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [selectedPack, setSelectedPack] = useState<number>(10000); // Default pack
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [topUpSuccess, setTopUpSuccess] = useState(false);

    // -- Org Billing Details State --
    const [showBillingModal, setShowBillingModal] = useState(false);

    // -- Auto Top Up State --
    const [autoTopUpEnabled, setAutoTopUpEnabled] = useState(false);
    const [showAutoTopUpModal, setShowAutoTopUpModal] = useState(false);
    const [isAcceptingTerms, setIsAcceptingTerms] = useState(false);
    const AUTO_TOPUP_THRESHOLD = 10000;
    const AUTO_TOPUP_AMOUNT = 10000;

    const isBillingDetailsComplete = localBillingDetails.legalName && localBillingDetails.vatNumber && localBillingDetails.address;

    // -- Activation State --
    const [activationSteps, setActivationSteps] = useState([
        { id: 1, label: 'Connect WhatsApp Business API', status: 'Pending' },
        { id: 2, label: 'Connect PMS', status: 'Pending' },
        { id: 3, label: 'Knowledge Base', status: 'Pending' }
    ]);
    const [activeStepModal, setActiveStepModal] = useState<number | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Activation Forms State
    const [waForm, setWaForm] = useState({
        accessToken: '', businessId: '', phoneId: '', clientId: '', clientSecret: ''
    });
    const [pmsForm, setPmsForm] = useState({
        provider: 'Kross Booking', username: '', password: '', pmsId: ''
    });
    const [kbFiles, setKbFiles] = useState<string[]>([]);

    // -- Notification State --
    const [notifConfig, setNotifConfig] = useState({
        systemIncidents: true,
        integrationFailures: true,
        slaRisk: true,
        complianceAlerts: false,
        budgetWarnings: true,
        emailChannel: true,
        appChannel: true,
    });

    // -- Billing State --
    const [budgetLimit, setBudgetLimit] = useState<string>('500');
    const [budgetEnabled, setBudgetEnabled] = useState(false);

    const handleValidation = (stepId: number) => {
        setValidationError(null);
        setIsValidating(true);

        setTimeout(() => {
            let success = true;
            let errorMsg = '';

            if (stepId === 1) {
                if (!waForm.accessToken || !waForm.businessId || !waForm.clientId || !waForm.clientSecret) {
                    success = false;
                    errorMsg = 'Please fill in all required fields marked with *';
                }
            } else if (stepId === 2) {
                if (!pmsForm.username || !pmsForm.password) {
                    success = false;
                    errorMsg = 'Invalid credentials or unreachable endpoint.';
                }
            }

            setIsValidating(false);

            if (success) {
                setActivationSteps(steps => steps.map(s => s.id === stepId ? { ...s, status: 'Completed' } : s));
                setActiveStepModal(null);
            } else {
                setValidationError(errorMsg);
                setActivationSteps(steps => steps.map(s => s.id === stepId ? { ...s, status: 'Error' } : s));
            }
        }, 2000);
    };

    const handleSaveBillingDetails = () => {
        onUpdateBillingDetails(localBillingDetails);
        setShowBillingModal(false);
    };

    const handleProcessTopUp = () => {
        setIsProcessingPayment(true);
        setTimeout(() => {
            onUpdateCredits(currentCredits + selectedPack);
            setIsProcessingPayment(false);
            setShowTopUpModal(false);
        }, 2000);
    };

    const handleEnableAutoTopUp = () => {
        setIsAcceptingTerms(true);
        setTimeout(() => {
            setAutoTopUpEnabled(true);
            setIsAcceptingTerms(false);
            setShowAutoTopUpModal(false);
            // Check instantly if recharge needed (mock logic)
            if (currentCredits < AUTO_TOPUP_THRESHOLD) {
                onUpdateCredits(currentCredits + AUTO_TOPUP_AMOUNT);
            }
        }, 1500);
    };

    const handleToggleAutoTopUp = () => {
        if (!autoTopUpEnabled) {
            setShowAutoTopUpModal(true);
        } else {
            setAutoTopUpEnabled(false);
        }
    };

    const renderProfile = () => {
        return (
            <div className="space-y-6 animate-fade-in w-full">
                {/* Personal Information */}
                <Card padding="lg">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-[var(--color-text-main)]">Personal Information</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Manage your identity and contact details.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FloatingInput label="First Name" value={localProfile.firstName} onChange={(e) => setLocalProfile({ ...localProfile, firstName: e.target.value })} />
                        <FloatingInput label="Last Name" value={localProfile.lastName} onChange={(e) => setLocalProfile({ ...localProfile, lastName: e.target.value })} />
                        <FloatingInput label="Email Address" value={localProfile.email} onChange={(e) => setLocalProfile({ ...localProfile, email: e.target.value })} />
                        <FloatingInput label="Phone Number" value={localProfile.phone} onChange={(e) => setLocalProfile({ ...localProfile, phone: e.target.value })} />
                    </div>
                </Card>

                {/* Preferences */}
                <Card padding="lg">
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-[var(--color-text-main)]">Preferences</h3>
                        <p className="text-sm text-[var(--color-text-muted)]">Regional and display settings.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <label className="text-xs text-[var(--color-text-muted)] absolute top-2 left-3">Language</label>
                            <select className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 pt-6 pb-2 text-sm focus:border-[var(--color-brand-accent)] outline-none appearance-none">
                                <option>English (US)</option>
                                <option>Italiano</option>
                                <option>Español</option>
                            </select>
                        </div>
                        <div className="relative">
                            <label className="text-xs text-[var(--color-text-muted)] absolute top-2 left-3">Timezone</label>
                            <select className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 pt-6 pb-2 text-sm focus:border-[var(--color-brand-accent)] outline-none appearance-none">
                                <option>UTC (Coordinated Universal Time)</option>
                                <option>EST (Eastern Standard Time)</option>
                                <option>CET (Central European Time)</option>
                            </select>
                        </div>
                    </div>
                </Card>

                {/* Security Placeholder */}
                <Card padding="lg">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-medium text-[var(--color-text-main)]">Security</h3>
                            <p className="text-sm text-[var(--color-text-muted)]">Password and authentication methods.</p>
                        </div>
                        <Button variant="secondary" size="sm">Change Password</Button>
                    </div>
                </Card>

                <div className="flex justify-end pt-4">
                    <Button size="lg" leftIcon={<Save size={18} />} onClick={() => onUpdateProfile(localProfile)}>Save All Changes</Button>
                </div>
            </div>
        );
    };

    const renderOrg = () => {
        return (
            <div className="w-full animate-fade-in">
                <Card padding="lg" className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Organization Settings</h3>
                    <div className="grid grid-cols-1 gap-6">
                        <FloatingInput label="Organization Name" value={localOrg.name} onChange={(e) => setLocalOrg({ ...localOrg, name: e.target.value })} />
                        <FloatingInput label="Billing Email" value={localOrg.billingEmail} onChange={(e) => setLocalOrg({ ...localOrg, billingEmail: e.target.value })} />
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button leftIcon={<Save size={18} />} onClick={() => onUpdateOrganization(localOrg)}>Save Changes</Button>
                    </div>
                </Card>

                {/* Billing Details Re-implementation within Org Tab if needed, but keeping primarily in Billing Tab */}
                <div className="border-t border-[var(--color-border)] pt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Billing Information</h3>
                        <Button variant="secondary" size="sm" onClick={() => setShowBillingModal(true)}>Edit Details</Button>
                    </div>
                    <div className="bg-[var(--color-surface-hover)] p-4 rounded-lg border border-[var(--color-border)]">
                        <p className="font-medium">{localBillingDetails.legalName || 'Not Set'}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">{localBillingDetails.address || 'Address not set'}</p>
                        <p className="text-sm text-[var(--color-text-muted)]">VAT: {localBillingDetails.vatNumber || 'N/A'}</p>
                    </div>
                </div>
            </div>
        )
    }

    const renderActivation = () => (
        <div className="w-full animate-fade-in">
            <div className="border-b border-[var(--color-border)] pb-6 mb-6">
                <h2 className="text-xl font-light">System Activation</h2>
            </div>
            <div className="space-y-4">
                {activationSteps.map((step) => (
                    <Card key={step.id} padding="md" className="flex items-center justify-between bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group rounded-2xl">
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs border shadow-lg transition-transform group-hover:scale-110 ${step.status === 'Completed'
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                : step.status === 'Error'
                                    ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                                    : 'bg-white/5 text-white/40 border-white/10'
                                }`}>
                                {step.status === 'Completed' ? <CheckCircle size={18} /> : <span>0{step.id}</span>}
                            </div>
                            <div>
                                <h3 className="font-bold text-white uppercase tracking-widest text-xs">{step.label}</h3>
                                <p className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-black mt-1">
                                    {step.status === 'Completed' ? 'Identity Verified & Secure' : 'Authorization Required'}
                                </p>
                            </div>
                        </div>
                        <Button
                            leftIcon={step.status === 'Completed' ? <Settings size={18} /> : <Link size={18} />}
                            onClick={() => setActiveStepModal(step.id)}
                            variant={step.status === 'Completed' ? 'secondary' : 'primary'}
                            className="rounded-xl font-black uppercase tracking-widest text-[10px]"
                        >
                            {step.status === 'Completed' ? 'Configure' : 'Establish Link'}
                        </Button>
                    </Card>
                ))}
            </div>
            {/* Note: Modals for activation are simplified/omitted for brevity but logic is there */}
        </div>
    );

    const renderNotifications = () => (
        <div className="w-full animate-fade-in">
            <div className="border-b border-[var(--color-border)] pb-6 mb-6">
                <h2 className="text-xl font-light">Notification Preferences</h2>
            </div>
            <Card padding="none" className="overflow-hidden mb-8">
                {/* ... Simplified Notification UI ... */}
                <div className="p-6 text-[var(--color-text-muted)] text-sm italic">Notification settings are managed via Control Tower defaults.</div>
            </Card>
        </div>
    );

    const renderBilling = () => {
        const consumptionStats = [
            { label: 'Credits Used (30d)', value: usageMetrics?.governedValue ? (usageMetrics.governedValue * 0.1).toLocaleString() : '0' },
            { label: 'Network Sessions', value: '128' },
            { label: 'Compliance Rate', value: `${usageMetrics?.complianceRate || 0}%` }
        ];

        const history = invoices;

        return (
            <div className="w-full animate-fade-in space-y-10 pb-20">
                {/* Header Section */}
                <div className="border-b border-white/10 pb-8">
                    <h2 className="text-3xl font-light text-white mb-2">Pricing & Billing</h2>
                    <p className="text-zinc-500 text-sm">Governance engine resource allocation and ledger.</p>
                </div>

                {/* 4 CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* 1. BALANCE */}
                    <Card variant="dark" className="shadow-2xl relative overflow-hidden h-full flex flex-col justify-between" padding="lg">
                        <div className="relative z-10">
                            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-4">Current Balance</div>
                            <div className="text-4xl font-numbers font-bold text-white tracking-tight">
                                {Math.floor(currentCredits).toLocaleString()}
                                <span className="text-xs text-zinc-600 block mt-1 font-numbers uppercase tracking-widest italic">AC</span>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={40} /></div>
                    </Card>

                    {/* 2. AUTO TOP-UP */}
                    <Card variant="dark" className="border-zinc-800/50 flex flex-col justify-between" padding="lg">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-4">Auto Top-Up</div>
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-medium ${autoTopUpEnabled ? 'text-[var(--color-success)]' : 'text-zinc-500'}`}>
                                    {autoTopUpEnabled ? 'ACTIVE' : 'DISABLED'}
                                </span>
                                <button
                                    onClick={handleToggleAutoTopUp}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${autoTopUpEnabled ? 'bg-[var(--color-success)]' : 'bg-zinc-700'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${autoTopUpEnabled ? 'left-7 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-4 leading-relaxed">
                            {autoTopUpEnabled
                                ? "If balance < 10,000 credits, trigger +10,000 AC top-up."
                                : "No automatic reloads configured. Services may pause on zero balance."
                            }
                        </p>
                    </Card>

                    {/* 3. MANUAL TOP-UP */}
                    <Card variant="dark" className="border-white/5 flex flex-col justify-between" padding="lg">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-4">Top-Up Engine</div>
                            <Button
                                variant="primary"
                                className="w-full justify-center !bg-white !text-black hover:!bg-zinc-200 border-0 font-black h-12"
                                onClick={() => setShowTopUpModal(true)}
                            >
                                <Plus size={18} className="mr-2" /> RECHARGE
                            </Button>
                        </div>
                        <div className="flex gap-1 mt-4">
                            {[1, 2, 3].map(i => <div key={i} className="flex-1 h-1 bg-white/10 rounded-full" />)}
                        </div>
                    </Card>

                    {/* 4. USAGE SUMMARY */}
                    <Card variant="dark" className="border-zinc-800/80 flex flex-col justify-between" padding="lg">
                        <div className="space-y-4">
                            {consumptionStats.map((stat, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
                                    <span className="text-[10px] text-zinc-500 uppercase">{stat.label}</span>
                                    <span className="text-xs font-mono text-white">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>

                {/* CONSUMPTION TABLE */}
                <div className="pt-4">
                    <Card variant="default" padding="none" className="overflow-hidden border-white/5">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <h3 className="text-lg font-light text-white">Execution Ledger (Real-Time)</h3>
                            <Button variant="ghost" size="sm" className="text-zinc-500"><Download size={16} /> Export</Button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.01]">
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Invoice ID</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Date</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Amount</th>
                                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {history.map((item) => (
                                        <tr key={item.id} className="hover:bg-white/[0.03] transition-all duration-200 group">
                                            <td className="px-6 py-5 text-[10px] font-mono text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-widest">{item.id}</td>
                                            <td className="px-6 py-5 text-[10px] font-mono text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-widest">{item.date}</td>
                                            <td className="px-6 py-5 text-xs font-numbers text-[var(--color-brand-accent)] font-black">
                                                {item.amount.toLocaleString()}
                                                <span className="text-[9px] opacity-40 ml-1.5 font-numbers uppercase tracking-widest italic">AC</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <span className={`text-[9px] px-2.5 py-1 rounded-full border uppercase font-black tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.1)] ${item.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* CHART PLACEHOLDER */}
                <div className="pt-2">
                    <Card variant="default" padding="lg" className="border-white/5">
                        <div className="mb-6">
                            <h3 className="text-lg font-light text-white">Consumption Over Time</h3>
                            <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">Resource allocation trend (7d)</p>
                        </div>
                        <div className="h-[240px] w-full flex items-center justify-center border border-white/5 bg-black/40 rounded-3xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-accent)]/5 to-transparent opacity-50"></div>
                            <div className="absolute inset-0 flex items-end justify-between px-10 pb-6 opacity-40 pointer-events-none gap-2">
                                {[40, 70, 45, 90, 65, 80, 50, 60, 45, 75, 55, 95].map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-white/10 rounded-t-lg transition-all duration-700 group-hover:bg-[var(--color-brand-accent)]/20 group-hover:scale-y-110 origin-bottom"
                                        style={{ height: `${h}%`, transitionDelay: `${i * 30}ms` }}
                                    />
                                ))}
                            </div>
                            <div className="flex flex-col items-center gap-4 relative z-10">
                                <Activity className="text-[var(--color-brand-accent)] opacity-40 animate-pulse" size={32} />
                                <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em] px-6 py-2 border border-white/5 rounded-full backdrop-blur-md">
                                    Ledger Topology Active
                                </span>
                            </div>
                        </div>
                    </Card>
                </div>


                {/* Modals */}
                <Modal isOpen={showTopUpModal} onClose={() => setShowTopUpModal(false)} title="Top Up ArmoCredits©">
                    <div className="p-6">
                        <p className="text-sm text-[var(--color-text-muted)] mb-6">Select a credit pack to add to your balance. Funds are available immediately.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {[10000, 20000, 50000, 100000].map(amount => (
                                <button
                                    key={amount}
                                    onClick={() => setSelectedPack(amount)}
                                    className={`
                                        p-4 rounded-xl border flex flex-col items-center justify-center transition-all bg-[var(--color-surface)]
                                        ${selectedPack === amount
                                            ? 'border-[var(--color-brand-primary)] ring-1 ring-[var(--color-brand-primary)] shadow-md bg-[var(--color-brand-primary)]/5'
                                            : 'border-[var(--color-border)] hover:border-[var(--color-text-muted)]'
                                        }
                                    `}
                                >
                                    <span className={`text-lg font-mono font-bold ${selectedPack === amount ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-text-main)]'}`}>
                                        {amount.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-bold mt-1">ArmoCredits©</span>
                                </button>
                            ))}
                        </div>

                        <div className="border-t border-[var(--color-border)] pt-6 flex justify-end">
                            <Button
                                variant="primary"
                                size="lg"
                                className="w-full md:w-auto"
                                onClick={handleProcessTopUp}
                                disabled={isProcessingPayment}
                                leftIcon={isProcessingPayment ? <RefreshCw className="animate-spin" /> : <CreditCard />}
                            >
                                {isProcessingPayment ? 'Processing...' : 'Confirm Recharge'}
                            </Button>
                        </div>
                    </div>
                </Modal>

                <Modal isOpen={showAutoTopUpModal} onClose={() => setShowAutoTopUpModal(false)} title="Enable Auto Top-up">
                    <div className="p-6 max-w-md mx-auto">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-[var(--color-brand-primary)]/10 flex items-center justify-center text-[var(--color-brand-primary)]">
                                <RefreshCw size={32} />
                            </div>
                        </div>

                        <h3 className="text-center font-medium text-lg mb-2">Never Run Out of Credits</h3>
                        <p className="text-center text-sm text-[var(--color-text-muted)] mb-6">
                            When your balance falls below <strong className="text-[var(--color-text-main)]">10,000 ArmoCredits©</strong>,
                            we will automatically recharge your account with <strong className="text-[var(--color-text-main)]">10,000 ArmoCredits©</strong>.
                        </p>

                        <div className="bg-[var(--color-surface-hover)] p-4 rounded-lg border border-[var(--color-border)] mb-6">
                            <div className="flex gap-3 items-start">
                                <InfoIcon />
                                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                                    By enabling this, you authorize Armonyco to recharge your credits whenever the threshold is reached. Charges will appear on your statement as "Armonyco Refill".
                                </p>
                            </div>
                        </div>

                        <div className="mb-6 flex justify-center">
                            <div className="text-center">
                                <span className="text-xs text-[var(--color-text-muted)] uppercase font-bold">Top-up Amount</span>
                                <div className="text-lg font-bold">10,000 ArmoCredits©</div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="ghost" className="flex-1 justify-center" onClick={() => setShowAutoTopUpModal(false)}>Cancel</Button>
                            <Button
                                variant="primary"
                                className="flex-1 justify-center"
                                onClick={handleEnableAutoTopUp}
                                disabled={isAcceptingTerms}
                            >
                                {isAcceptingTerms ? 'Enabling...' : 'I Agree, Enable Auto-Topup'}
                            </Button>
                        </div>
                    </div>
                </Modal>

                <Modal
                    isOpen={showBillingModal}
                    onClose={() => setShowBillingModal(false)}
                    title="Edit Billing Details"
                >
                    <div className="p-6 space-y-5">
                        {/* Billing Form Inputs */}
                        <div className="space-y-4">
                            <FloatingInput label="Legal Entity Name" value={localBillingDetails.legalName} onChange={(e) => setLocalBillingDetails({ ...localBillingDetails, legalName: e.target.value })} />
                            <FloatingInput label="VAT Number" value={localBillingDetails.vatNumber} onChange={(e) => setLocalBillingDetails({ ...localBillingDetails, vatNumber: e.target.value })} />
                            <FloatingInput label="Address" value={localBillingDetails.address} onChange={(e) => setLocalBillingDetails({ ...localBillingDetails, address: e.target.value })} />
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button onClick={handleSaveBillingDetails}>Save Details</Button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    };



    return (
        <div className="w-full p-8 animate-fade-in flex flex-col h-full bg-black text-white">
            <header className="mb-10 border-b border-white/5 pb-8 flex flex-col md:flex-row justify-between md:items-center gap-6 shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Settings className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">System Settings</h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Configure your personal identity and organization protocols.</p>
                </div>

                <nav className="flex bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
                    {[
                        { id: 'PROFILE', label: 'Identity', icon: User },
                        { id: 'ORG', label: 'Organization', icon: Building },
                        { id: 'BILLING', label: 'Billing & AC', icon: CreditCard }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as SettingsTab)}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeTab === tab.id
                                ? 'bg-[var(--color-brand-accent)] text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </header>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
                {activeTab === 'PROFILE' && renderProfile()}
                {activeTab === 'ORG' && renderOrg()}
                {activeTab === 'BILLING' && renderBilling()}
            </div>
        </div>
    );
};

// Helper Icon Component for Auto Top Up Modal
const InfoIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-text-subtle)] shrink-0">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
);
import React, { useState, useEffect } from 'react';
import { Settings, Bell, Layers, Database, Smartphone, Key, User, Building, CreditCard, BookOpen, HelpCircle, CheckCircle, ChevronRight, AlertTriangle, Calendar, Plus, RefreshCw, X, ArrowRight, Activity, FileText, Camera, LogOut, Moon, Sun, Monitor, Laptop, Shield, Lock, Clock, UploadCloud, Download, AlertCircle, Copy, Check, XCircle, Save, Link, IconSizes, Zap } from '../../components/ui/Icons';
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { Button } from '../../components/ui/Button';
import { FloatingInput } from '../../components/ui/FloatingInput';
import { Modal } from '../../components/ui/Modal';
import { Card } from '../../components/ui/Card';
import { UserProfile, Organization, BillingDetails } from '../../src/types';
import { ContactModal } from '../../components/landing/ContactModal';
import { usePermissions } from '../../src/hooks/usePermissions';
import { ProtectedContent } from '../../src/components/app/ProtectedContent';
import { CurrentPlanCard } from '../../components/app/CurrentPlanCard';
import { AvailablePlansGrid } from '../../components/app/AvailablePlansGrid';
import { UsageTable } from '../../components/app/UsageTable';
import { BuyCreditsModal } from '../../components/app/BuyCreditsModal';
import { supabase } from '../../src/lib/supabase';

interface SettingsViewProps {
    activeView?: string;
    userProfile: UserProfile;
    onUpdateProfile: (data: Partial<UserProfile>) => void | Promise<void>;
    organization: Organization;
    onUpdateOrganization: (data: Partial<Organization>) => void | Promise<void>;
    billingDetails: BillingDetails;
    onUpdateBillingDetails: (data: Partial<BillingDetails>) => void | Promise<void>;
    currentCredits: number;
    onUpdateCredits: (amount: number) => void | Promise<void>;
    activePlanId: number;
    onUpdatePlanId: (id: number) => void;
    onNavigate?: (view: string) => void;
}

type SettingsTab = 'PROFILE' | 'ORG' | 'SUBSCRIPTION' | 'ACTIVATION';

// --- Helper for Cost ---
const COST_PER_CREDIT = 0.01; // €1 per 100 credits institutional rate

export const SettingsView: React.FC<SettingsViewProps> = ({
    activeView,
    userProfile,
    onUpdateProfile,
    organization,
    onUpdateOrganization,
    billingDetails,
    onUpdateBillingDetails,
    currentCredits,
    onUpdateCredits,
    activePlanId,
    onUpdatePlanId,
    onNavigate
}) => {
    // ========================================
    // ALL HOOKS FIRST - ALWAYS CALLED
    // ========================================
    const [activeTab, setActiveTab] = useState<SettingsTab>('PROFILE');
    const [isContactOpen, setIsContactOpen] = useState(false);
    
    // Check permissions for organization settings and Settings access
    const { canEditOrganization, canAccessSettings, loading: permissionsLoading } = usePermissions();

    // -- Profile Local State (Synced with Props) --
    const [localProfile, setLocalProfile] = useState(userProfile);
    const [emailVerified, setEmailVerified] = useState(true);
    const [phoneVerified, setPhoneVerified] = useState(false);

    // -- Org Local State (Synced with Props) --
    const [localOrg, setLocalOrg] = useState(organization);

    // -- Billing Details Local State --
    const [localBillingDetails, setLocalBillingDetails] = useState(billingDetails);

    // -- Security State --
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    // -- Preferences State --
    const [timeFormat, setTimeFormat] = useState('24h');
    const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
    const [theme, setTheme] = useState('system');

    // -- Legal State --
    const [marketingConsent, setMarketingConsent] = useState(false);

    // -- Org Billing Details State --
    const [showBillingModal, setShowBillingModal] = useState(false);

    // -- Save Loading States --
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingOrg, setIsSavingOrg] = useState(false);
    const [isSavingBilling, setIsSavingBilling] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

    // -- Top Up State (OLD - Kept for Auto Top-Up only) --
    const [showTopUpModal, setShowTopUpModal] = useState(false);

    // -- Auto Top Up State --
    const [autoTopUpEnabled, setAutoTopUpEnabled] = useState(false);
    const [showAutoTopUpModal, setShowAutoTopUpModal] = useState(false);
    const [isAcceptingTerms, setIsAcceptingTerms] = useState(false);
    const AUTO_TOPUP_THRESHOLD = 1000;
    const AUTO_TOPUP_AMOUNT = 1000;

    // -- Subscription Plan State --
    const [showPlanChangeModal, setShowPlanChangeModal] = useState(false);
    const [pendingPlan, setPendingPlan] = useState<{ id: number, name: string, price: number } | null>(null);
    const [isUpdatingPlan, setIsUpdatingPlan] = useState(false);

    // -- Activation State --
    const [activationSteps, setActivationSteps] = useState([
        { id: 1, label: 'Knowledge Base Upload', status: 'Pending' },
        { id: 2, label: 'Connect Channels', status: 'Pending' },
        { id: 3, label: 'Infrastructure Setup', status: 'Pending' }
    ]);
    const [activeStepModal, setActiveStepModal] = useState<number | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    // Activation Forms State
    const [waForm, setWaForm] = useState({
        accessToken: '', businessId: '', phoneId: '', verifyToken: '', appSecret: ''
    });
    const [pmsForm, setPmsForm] = useState({
        url: '', username: '', password: '', hotelId: ''
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

    // -- New Billing State (Subscription Management) --
    const [currentSubscription, setCurrentSubscription] = useState<any>(null);
    const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
    const [loadingSubscription, setLoadingSubscription] = useState(false);
    const [upgradingPlan, setUpgradingPlan] = useState(false);

    // -- Credits State (Organization Credits) --
    const [organizationBalance, setOrganizationBalance] = useState<number>(0);
    const [loadingBalance, setLoadingBalance] = useState(false);
    const [showBuyCreditsModal, setShowBuyCreditsModal] = useState(false);

    // Effect to sync prop activeView with internal state
    useEffect(() => {
        if (activeView) {
            if (activeView === 'settings-profile') setActiveTab('PROFILE');
            if (activeView === 'settings-company') setActiveTab('ORG');
            if (activeView === 'settings-billing') setActiveTab('SUBSCRIPTION');
            if (activeView === 'settings-activation') setActiveTab('ACTIVATION');
        }
    }, [activeView]);

    useEffect(() => setLocalProfile(userProfile), [userProfile]);
    useEffect(() => setLocalOrg(organization), [organization]);
    useEffect(() => setLocalBillingDetails(billingDetails), [billingDetails]);

    // Fetch subscription data when subscription tab is active
    useEffect(() => {
        if (activeTab === 'SUBSCRIPTION' && organization?.id) {
            fetchSubscriptionData();
            fetchOrganizationBalance();
        }
    }, [activeTab, organization?.id]);

    // Fetch organization credits balance
    const fetchOrganizationBalance = async () => {
        if (!supabase || !organization?.id) {
            console.warn('[Settings] Supabase or organization not available');
            return;
        }

        setLoadingBalance(true);
        try {
            const { data, error } = await supabase
                .from('organization_credits')
                .select('balance')
                .eq('organization_id', organization.id)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    // No record found, balance is 0
                    console.log('[Settings] No credits record found, balance = 0');
                    setOrganizationBalance(0);
                } else {
                    console.error('[Settings] Error fetching balance:', error);
                }
            } else {
                setOrganizationBalance(data?.balance || 0);
                console.log('[Settings] Organization balance:', data?.balance);
            }
        } catch (error) {
            console.error('[Settings] Unexpected error fetching balance:', error);
        } finally {
            setLoadingBalance(false);
        }
    };

    // Fetch current subscription and available plans
    const fetchSubscriptionData = async () => {
        if (!supabase) {
            console.warn('[Settings] Supabase not configured');
            return;
        }

        setLoadingSubscription(true);
        try {
            // Fetch current active subscription with plan details
            const { data: subscription, error: subError } = await supabase
                .from('organization_subscriptions')
                .select(`
                    id,
                    organization_id,
                    plan_id,
                    status,
                    started_at,
                    expires_at,
                    stripe_customer_id,
                    stripe_subscription_id,
                    subscription_plans (
                        id,
                        name,
                        price,
                        credits,
                        tier,
                        features
                    )
                `)
                .eq('organization_id', organization.id)
                .eq('status', 'active')
                .single();

            if (subError && subError.code !== 'PGRST116') {
                console.error('[Settings] Error fetching subscription:', subError);
            } else {
                setCurrentSubscription(subscription);
                console.log('[Settings] Current subscription:', subscription);
            }

            // Fetch all available subscription plans
            const { data: plans, error: plansError } = await supabase
                .from('subscription_plans')
                .select('id, name, price, credits, tier, is_active, features')
                .eq('is_active', true)
                .order('price', { ascending: true });

            if (plansError) {
                console.error('[Settings] Error fetching plans:', plansError);
            } else {
                setSubscriptionPlans(plans || []);
                console.log('[Settings] Available plans:', plans);
            }

        } catch (error) {
            console.error('[Settings] Unexpected error:', error);
        } finally {
            setLoadingSubscription(false);
        }
    };

    // ========================================
    // AFTER ALL HOOKS: CONDITIONAL LOGIC
    // ========================================

    // Show loading state while permissions are being checked
    if (permissionsLoading) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[var(--color-brand-accent)]/30 border-t-[var(--color-brand-accent)] rounded-full animate-spin" />
                    <span className="text-zinc-400 text-sm">Checking permissions...</span>
                </div>
            </div>
        );
    }

    // Redirect Collaborators - Settings are restricted to SuperAdmin and Org Admin only
    if (!canAccessSettings) {
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center p-6">
                <div className="max-w-md text-center space-y-6 animate-fade-in">
                    <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center">
                        <Shield size={40} className="text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-3">Limited Access</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            The Settings section is only available to Organization Administrators.
                        </p>
                        <p className="text-zinc-500 text-sm mt-4">
                            As a Collaborator, you have read-only access to the main platform features. 
                            Contact your organization administrator if you need to change settings.
                        </p>
                    </div>
                    <div className="pt-4">
                        <button 
                            onClick={() => onNavigate?.('dashboard')} 
                            className="px-6 py-3 bg-[var(--color-brand-accent)] text-black rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-white transition-all"
                        >
                            Torna alla Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const isBillingDetailsComplete = localBillingDetails.legalName && localBillingDetails.vatNumber && localBillingDetails.address;

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        try {
            await onUpdateProfile(localProfile);
            setSaveSuccess('Profile saved!');
            setTimeout(() => setSaveSuccess(null), 2000);
        } catch (error) {
            console.error('Failed to save profile:', error);
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleSaveOrg = async () => {
        setIsSavingOrg(true);
        try {
            await onUpdateOrganization(localOrg);
            setSaveSuccess('Organization saved!');
            setTimeout(() => setSaveSuccess(null), 2000);
        } catch (error) {
            console.error('Failed to save organization:', error);
        } finally {
            setIsSavingOrg(false);
        }
    };

    const handlePlanChange = (plan: { id: number, name: string, price: number }) => {
        if (plan.id === activePlanId) return;
        setPendingPlan(plan);
        setShowPlanChangeModal(true);
    };

    const confirmPlanChange = () => {
        setIsUpdatingPlan(true);
        setTimeout(() => {
            if (pendingPlan) {
                onUpdatePlanId(pendingPlan.id);
            }
            setIsUpdatingPlan(false);
            setShowPlanChangeModal(false);
        }, 1500);
    };

    const handleValidation = (stepId: number) => {
        setValidationError(null);
        setIsValidating(true);

        setTimeout(() => {
            let success = true;
            let errorMsg = '';

            if (stepId === 1) {
                if (!waForm.accessToken || !waForm.businessId || !waForm.phoneId || !waForm.appSecret) {
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

    // Handle subscription upgrade
    const handleUpgrade = async (newPlanId: number) => {
        setUpgradingPlan(true);
        try {
            console.log('[Settings] Initiating upgrade to plan:', newPlanId);

            // Call API to create Stripe checkout session
            const response = await fetch('/api/stripe/upgrade-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    organizationId: organization.id,
                    newPlanId: newPlanId,
                    currentSubscriptionId: currentSubscription?.stripe_subscription_id
                })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                console.error('[Settings] Upgrade error:', data.error || data.details);
                alert(`Error: ${data.error || 'Failed to initiate upgrade'}`);
                return;
            }

            console.log('[Settings] Checkout URL:', data.checkoutUrl);

            // Redirect to Stripe Checkout
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }

        } catch (error: any) {
            console.error('[Settings] Upgrade error:', error);
            alert('Failed to initiate upgrade. Please try again.');
        } finally {
            setUpgradingPlan(false);
        }
    };

    // Handle subscription downgrade
    const handleDowngrade = async (newPlanId: number) => {
        // Show confirmation dialog
        const confirmed = window.confirm(
            'Are you sure you want to downgrade your plan? This change will take effect at the end of your current billing period.'
        );

        if (!confirmed) {
            return;
        }

        setUpgradingPlan(true);
        try {
            console.log('[Settings] Initiating downgrade to plan:', newPlanId);

            // Call API to create Stripe checkout session
            const response = await fetch('/api/stripe/upgrade-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    organizationId: organization.id,
                    newPlanId: newPlanId,
                    currentSubscriptionId: currentSubscription?.stripe_subscription_id
                })
            });

            const data = await response.json();

            if (!response.ok || data.error) {
                console.error('[Settings] Downgrade error:', data.error || data.details);
                alert(`Error: ${data.error || 'Failed to initiate downgrade'}`);
                return;
            }

            console.log('[Settings] Checkout URL:', data.checkoutUrl);

            // Redirect to Stripe Checkout
            if (data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            }

        } catch (error: any) {
            console.error('[Settings] Downgrade error:', error);
            alert('Failed to initiate downgrade. Please try again.');
        } finally {
            setUpgradingPlan(false);
        }
    };

    // Handle subscription cancellation
    const handleCancelSubscription = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to cancel your subscription? You will retain access until the end of your current billing period.'
        );

        if (!confirmed) {
            return;
        }

        alert('Subscription cancellation will be implemented in the next phase.');
        // TODO: Implement cancellation via Stripe API
    };

    const renderProfile = () => {
        return (
            <div className="space-y-6 animate-fade-in w-full pb-20">
                {/* Identity Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-6">
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
                                <div className="md:col-span-2">
                                    <FloatingInput label="Job Role / Title" value="Regional Operations Director" />
                                </div>
                            </div>
                        </Card>

                        {/* Preferences */}
                        <Card padding="lg">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-[var(--color-text-main)]">Regional Preferences</h3>
                                <p className="text-sm text-[var(--color-text-muted)]">Language, timezone, and data formatting.</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-muted)] absolute top-2 left-3">Language</label>
                                    <select className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 pt-6 pb-2 text-sm focus:border-[var(--color-brand-accent)] outline-none appearance-none">
                                        <option>English (US) - Primary</option>
                                        <option>Português (Brasil)</option>
                                        <option>Español (LatAm)</option>
                                        <option>Italian</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-muted)] absolute top-2 left-3">Timezone</label>
                                    <select className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 pt-6 pb-2 text-sm focus:border-[var(--color-brand-accent)] outline-none appearance-none">
                                        <option>UTC (Coordinated Universal Time)</option>
                                        <option>EST (Eastern Standard Time)</option>
                                        <option>CET (Central European Time)</option>
                                        <option>BRT (Brasilia Time)</option>
                                    </select>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar / Profile Avatar */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card variant="dark" padding="lg" className="text-center flex flex-col items-center">
                            <div className="relative group cursor-pointer mb-6">
                                <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-all overflow-hidden">
                                    <Camera size={32} className="text-white/20 group-hover:text-white/40 transition-colors" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--color-brand-accent)] flex items-center justify-center text-black shadow-lg">
                                    <Plus size={16} />
                                </div>
                            </div>
                            <h4 className="text-white font-bold tracking-tight">Profile Avatar</h4>
                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-1">Institutional Identity</p>
                            <p className="text-[10px] text-zinc-600 mt-4 px-4 italic leading-relaxed">Recommended size: 500x500px. JPG or PNG allowed.</p>
                        </Card>

                        <Card variant="dark" padding="lg">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6">Security Baseline</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-white/40">2FA Status</span>
                                    <span className="text-emerald-500">Active</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-white/40">Last Login</span>
                                    <span className="text-white/60">2 hours ago</span>
                                </div>
                                <button className="w-full py-3 mt-4 text-[9px] font-black uppercase tracking-[0.2em] border border-white/5 rounded-xl hover:bg-white/5 transition-all">
                                    Change Password
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5 mt-10">
                    <Button size="lg" leftIcon={<Save size={18} />} onClick={handleSaveProfile} isLoading={isSavingProfile}>{isSavingProfile ? 'Saving...' : 'Save Identity Changes'}</Button>
                </div>
            </div>
        );
    };

    const renderOrg = () => {
        return (
            <div className="w-full animate-fade-in space-y-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Main Org Data */}
                    <div className="lg:col-span-8 space-y-8">
                        <Card padding="lg">
                            <h3 className="text-lg font-medium mb-6">Organization Profile</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FloatingInput label="Organization Name" value={localOrg.name} onChange={(e) => setLocalOrg({ ...localOrg, name: e.target.value })} />
                                <FloatingInput label="Corporate Email" value={localOrg.billingEmail} onChange={(e) => setLocalOrg({ ...localOrg, billingEmail: e.target.value })} />
                                <FloatingInput label="Company Website" value="https://armonyco.io" />
                                <div className="relative">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-muted)] absolute top-2 left-3">Legal Structure</label>
                                    <select className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 pt-6 pb-2 text-sm focus:border-[var(--color-brand-accent)] outline-none appearance-none">
                                        <option>LLC / Ltd.</option>
                                        <option>S.A. / Corporation</option>
                                        <option>Inc.</option>
                                        <option>Private Individual / Host</option>
                                    </select>
                                </div>
                            </div>
                        </Card>

                        <Card padding="lg">
                            <h3 className="text-lg font-medium mb-6">Fiscal Address (Global Universal)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2">
                                    <FloatingInput label="Street Address" value={localBillingDetails.address || ''} />
                                </div>
                                <FloatingInput label="Suite / Apt" value="" />
                                <FloatingInput label="City" value="" />
                                <FloatingInput label="State / Province / Region" value="" />
                                <FloatingInput label="Zip / Postal Code" value="" />
                                <div className="relative md:col-span-3">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-muted)] absolute top-2 left-3">Country / Territory</label>
                                    <select className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 pt-6 pb-2 text-sm focus:border-[var(--color-brand-accent)] outline-none appearance-none">
                                        <option>United States</option>
                                        <option>Brazil</option>
                                        <option>Italy</option>
                                        <option>Mexico</option>
                                        <option>Colombia</option>
                                        <option>European Union (Select Member State)</option>
                                    </select>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Org Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        <Card variant="dark" padding="lg">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 italic">Compliance Status</h4>
                                <span className="text-[8px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded uppercase font-black">Authorized</span>
                            </div>

                            <div className="space-y-6">
                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] text-zinc-500 font-bold uppercase italic">Master Services Agreement</span>
                                        <CheckCircle size={12} className="text-emerald-500" />
                                    </div>
                                    <button className="w-full py-2 bg-[var(--color-brand-accent)] text-black text-[9px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-white transition-all">
                                        <Link size={12} /> DocuSign Infrastructure
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="aspect-square bg-white/[0.02] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-white/5 transition-all">
                                        <Camera size={16} className="text-white/20 group-hover:text-[var(--color-brand-accent)]" />
                                        <span className="text-[8px] text-white/40 font-black uppercase text-center px-2">Legal Rep. Photo</span>
                                    </div>
                                    <div className="aspect-square bg-white/[0.02] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-white/5 transition-all">
                                        <FileText size={16} className="text-white/20 group-hover:text-[var(--color-brand-accent)]" />
                                        <span className="text-[8px] text-white/40 font-black uppercase text-center px-2">Gov. ID / Passport</span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card variant="dark" padding="lg">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6">Institutional Compliance</h4>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Universal Tax ID / VAT / EIN / CNPJ</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Legal ID"
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/60 outline-none focus:border-[var(--color-brand-accent)]/40"
                                        value={localBillingDetails.vatNumber || ''}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Settlement Currency</label>
                                    <div className="relative">
                                        <select className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white/80 outline-none appearance-none cursor-pointer">
                                            <option>USD - United States Dollar</option>
                                            <option>EUR - Euro</option>
                                            <option>GBP - British Pound</option>
                                            <option>BRL - Brazilian Real</option>
                                            <option>MXN - Mexican Peso</option>
                                        </select>
                                        <ChevronRight size={14} className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-white/20 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card variant="dark" padding="lg" className="border-[var(--color-brand-accent)]/20 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield size={18} className="text-[var(--color-brand-accent)]" />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Trust Substrate</h4>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-relaxed italic">
                                ArmonycoOS™ requires verified organizational data to establish node sovereignty and cross-border settlement protocols.
                            </p>
                        </Card>
                    </div>
                </div>

                <div className="mt-6 flex justify-end pt-8 border-t border-white/5">
                    <Button leftIcon={<Save size={18} />} onClick={handleSaveOrg} isLoading={isSavingOrg}>{isSavingOrg ? 'Saving...' : 'Update Organization Infrastructure'}</Button>
                </div>
            </div>
        )
    }

    const renderActivation = () => (
        <div className="w-full animate-fade-in space-y-10 pb-20">
            {/* Header Section */}
            <div className="border-b border-white/10 pb-10 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <Zap className="text-[var(--color-brand-accent)]" size={24} />
                        </div>
                        <h2 className="text-4xl font-light text-white tracking-tight">System Activation & Knowledge</h2>
                    </div>
                    <p className="text-zinc-500 text-[11px] uppercase font-black tracking-[0.4em] italic">Self-Onboarding Flow • Institutional Calibration</p>
                </div>
                <div className="flex items-center gap-4 px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse"></div>
                    <span className="text-[11px] text-emerald-500 font-black uppercase tracking-[0.2em] italic">System Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* LEFT COLUMN: The Flow */}
                <div className="lg:col-span-8 space-y-12">

                    {/* STEP 1: KNOWLEDGE BASE */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-xs italic">1</div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Knowledge Base Upload</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="group cursor-pointer">
                                <Card className="border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[var(--color-brand-accent)]/40 transition-all aspect-[4/3] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-brand-accent)]/20 to-transparent group-hover:via-[var(--color-brand-accent)]/40 transition-all"></div>
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <FileText className="text-white/40 group-hover:text-[var(--color-brand-accent)] transition-colors" size={24} />
                                    </div>
                                    <div className="text-center px-4">
                                        <div className="text-[11px] font-black uppercase tracking-widest text-white mb-1">Institutional Policies</div>
                                        <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest italic">Grounding Material (PDF)</div>
                                    </div>
                                </Card>
                            </div>

                            <div className="group cursor-pointer">
                                <Card className="border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[var(--color-brand-accent)]/40 transition-all aspect-[4/3] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-brand-accent)]/20 to-transparent group-hover:via-[var(--color-brand-accent)]/40 transition-all"></div>
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Database className="text-white/40 group-hover:text-[var(--color-brand-accent)] transition-colors" size={24} />
                                    </div>
                                    <div className="text-center px-4">
                                        <div className="text-[11px] font-black uppercase tracking-widest text-white mb-1">Property Data</div>
                                        <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest italic">Wi-Fi, Codes & Assets (CSV)</div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 px-1">
                            <CheckCircle size={14} className="text-emerald-500" />
                            <p className="text-[10px] text-white/30 font-medium italic">System automatically parses property rules from PDF.</p>
                        </div>
                    </div>

                    {/* STEP 2: CHANNELS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-xs italic">2</div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Connect Channels</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">Permanent Access Token</label>
                                <input
                                    type="password"
                                    value="••••••••••••••••••••••••••••••••••••"
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 focus:border-[var(--color-brand-accent)] outline-none"
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">WhatsApp Business ID</label>
                                <input
                                    type="text"
                                    value="294857204918234"
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 outline-none"
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">Phone Number ID</label>
                                <input
                                    type="text"
                                    value="102938475612345"
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 outline-none"
                                    readOnly
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">Webhook Verify Token</label>
                                <input
                                    type="text"
                                    value="armonyco_secure_v1"
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 outline-none"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* STEP 3: INFRASTRUCTURE */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-xs italic">3</div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/60">PMS Connection</h3>
                        </div>

                        <Card variant="dark" padding="none" className="overflow-hidden border-white/5 bg-gradient-to-br from-zinc-900 via-black to-black">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Zap className="text-[var(--color-brand-accent)]" size={16} />
                                    <span className="text-xs font-black uppercase tracking-widest text-white">PMS Connection</span>
                                </div>
                                <span className="text-[9px] px-3 py-1 bg-white/5 border border-white/10 rounded text-white/40 font-black uppercase tracking-widest">Encrypted</span>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">API Endpoint / URL *</label>
                                        <input
                                            type="text"
                                            placeholder="https://pms.example.com/api"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/60 outline-none focus:border-[var(--color-brand-accent)]/40 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Hotel ID / Property ID</label>
                                        <input
                                            type="text"
                                            placeholder="Optional"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/60 outline-none focus:border-[var(--color-brand-accent)]/40 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Auth Username *</label>
                                        <input
                                            type="text"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/60 outline-none focus:border-[var(--color-brand-accent)]/40 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 italic">Auth Password *</label>
                                        <input
                                            type="password"
                                            className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/60 outline-none focus:border-[var(--color-brand-accent)]/40 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center gap-4">
                                    <div className="flex-1 h-[1px] bg-white/5"></div>
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 border border-white/5 rounded-full">
                                        <Clock size={12} className="text-[var(--color-brand-accent)]" />
                                        <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest italic">Activation within 48 hours</span>
                                    </div>
                                    <div className="flex-1 h-[1px] bg-white/5"></div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* RIGHT COLUMN: Calibration & Templates */}
                <div className="lg:col-span-4 space-y-8">
                    {/* Knowledge Templates Card */}
                    <Card variant="dark" padding="lg" className="border-[var(--color-brand-accent)]/20 shadow-[0_0_30px_rgba(212,175,55,0.05)]">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-brand-accent)] mb-6 flex items-center gap-2">
                            <Download size={14} /> Knowledge Templates
                        </h3>
                        <div className="space-y-3">
                            {[
                                { name: 'Institutional Policies', type: 'PDF Template', icon: FileText },
                                { name: 'Property Assets Matrix', type: 'CSV Reference', icon: Database },
                                { name: 'Service Workflow Protocol', type: 'PDF Model', icon: Zap }
                            ].map((model, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/5 transition-all group cursor-pointer border-dashed">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <model.icon size={14} className="text-white/40 group-hover:text-[var(--color-brand-accent)] transition-colors" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-white/80 uppercase tracking-tight">{model.name}</div>
                                            <div className="text-[8px] text-white/20 font-bold uppercase tracking-widest">{model.type}</div>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg group-hover:bg-[var(--color-brand-accent)] group-hover:text-black transition-all">
                                        <Download size={12} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="mt-6 text-[9px] text-zinc-500 leading-relaxed italic border-t border-white/5 pt-4">
                            Download templates, populate with institutional data, and upload in the primary flow for seamless system calibration.
                        </p>
                    </Card>

                    <Card variant="dark" padding="lg" className="border-white/5 bg-black/60 backdrop-blur-xl h-fit flex flex-col justify-between">
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-brand-accent)] mb-6 flex items-center gap-2">
                                    <Shield size={14} /> Neural Integrity
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-white/40 italic">Parsing Accuracy</span>
                                        <span className="text-emerald-500">99.2%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div className="w-[99.2%] h-full bg-emerald-500"></div>
                                    </div>

                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-white/40 italic">Calibration Status</span>
                                        <span className="text-white font-mono uppercase">Optimized</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="text-white/40 italic">Data Sovereignty</span>
                                        <span className="text-white font-mono uppercase">Secured</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-6 italic">Active Agent Nodes</h3>
                                <div className="space-y-3">
                                    {['Amelia', 'Lara', 'Elon', 'James'].map(agent => (
                                        <div key={agent} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl group hover:border-[var(--color-brand-accent)]/20 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-white transition-colors">{agent}</span>
                                            </div>
                                            <span className="text-[8px] text-white/20 font-black uppercase tracking-tighter italic">Live</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 text-center text-balance">
                            <p className="text-[9px] text-white/20 leading-relaxed italic">
                                ArmonycoOS™ Knowledge Engine ensures absolute fidelity across all cognitive tasks.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
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
        // Show loading state
        if (loadingSubscription) {
            return (
                <div className="w-full animate-fade-in flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-4">
                        <RefreshCw size={32} className="text-[var(--color-brand-accent)] animate-spin" />
                        <span className="text-sm text-zinc-400">Loading subscription data...</span>
                    </div>
                </div>
            );
        }

        // Mock consumption stats for the old 4-card grid
        const consumptionStats = [
            { label: 'Credits Used (30d)', value: '3,420' },
            { label: 'Network Sessions', value: '128' },
            { label: 'Avg Consumption', value: '26.7' }
        ];

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
                            {loadingBalance ? (
                                <div className="flex items-center gap-2">
                                    <RefreshCw size={20} className="text-[var(--color-brand-accent)] animate-spin" />
                                    <span className="text-sm text-white/60">Loading...</span>
                                </div>
                            ) : (
                                <div className="text-4xl font-numbers font-bold text-white tracking-tight">
                                    {Math.floor(organizationBalance).toLocaleString('de-DE')}
                                    <span className="text-xs text-zinc-600 block mt-1 font-numbers uppercase tracking-widest italic">ArmoCredits©</span>
                                </div>
                            )}
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
                                ? "If balance < 1.000 ArmoCredits©, trigger +1.000 ArmoCredits© top-up."
                                : "No automatic reloads configured. Services may pause on zero balance."
                            }
                        </p>
                    </Card>

                    {/* 3. BUY CREDITS */}
                    <Card variant="dark" className="border-white/5 flex flex-col justify-between" padding="lg">
                        <div>
                            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500 mb-4">Buy Credits</div>
                            <Button
                                variant="primary"
                                className="w-full justify-center !bg-[var(--color-brand-accent)] !text-black hover:!bg-white border-0 font-black h-12"
                                onClick={() => setShowBuyCreditsModal(true)}
                            >
                                <Plus size={18} className="mr-2" /> BUY CREDITS
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

                {/* =================================================================== */}
                {/* SECTION 1: CURRENT SUBSCRIPTION CARD                                */}
                {/* =================================================================== */}
                {currentSubscription && currentSubscription.subscription_plans ? (
                    <CurrentPlanCard
                        plan={{
                            id: currentSubscription.subscription_plans.id,
                            name: currentSubscription.subscription_plans.name,
                            price: currentSubscription.subscription_plans.price,
                            features: currentSubscription.subscription_plans.features || []
                        }}
                        nextBillingDate={currentSubscription.expires_at}
                        status={currentSubscription.status}
                        onCancel={handleCancelSubscription}
                        loading={upgradingPlan}
                    />
                ) : (
                    <Card variant="dark" padding="lg" className="border-amber-500/30 mb-8">
                        <div className="text-center py-8">
                            <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">No Active Subscription</h3>
                            <p className="text-sm text-white/60 mb-6">
                                You currently don't have an active subscription. Choose a plan below to get started.
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => setIsContactOpen(true)}
                                className="!bg-[var(--color-brand-accent)] !text-black"
                            >
                                Contact Sales
                            </Button>
                        </div>
                    </Card>
                )}

                {/* =================================================================== */}
                {/* SECTION 2: AVAILABLE PLANS GRID (UPGRADE/DOWNGRADE)                 */}
                {/* =================================================================== */}
                {subscriptionPlans.length > 0 && currentSubscription && (
                    <AvailablePlansGrid
                        plans={subscriptionPlans.map(plan => ({
                            id: plan.id,
                            name: plan.name,
                            price: plan.price,
                            features: plan.features || [],
                            credits: plan.credits
                        }))}
                        currentPlanId={currentSubscription.plan_id}
                        onUpgrade={handleUpgrade}
                        onDowngrade={handleDowngrade}
                        onContactUs={() => setIsContactOpen(true)}
                        loading={upgradingPlan}
                    />
                )}

                {/* =================================================================== */}
                {/* SECTION 3: WORKFLOW USAGE TABLE                                      */}
                {/* =================================================================== */}
                {organization?.id && (
                    <UsageTable 
                        organizationId={organization.id}
                        limit={10}
                    />
                )}


                {/* Modals */}
                
                {/* Buy Credits Modal - NEW SYSTEM */}
                {organization?.id && (
                    <BuyCreditsModal
                        isOpen={showBuyCreditsModal}
                        onClose={() => {
                            setShowBuyCreditsModal(false);
                            // Refresh balance after closing modal
                            fetchOrganizationBalance();
                        }}
                        organizationId={organization.id}
                    />
                )}

                <Modal isOpen={showAutoTopUpModal} onClose={() => setShowAutoTopUpModal(false)} title="Enable Auto Top-up">
                    <div className="p-6 max-w-md mx-auto">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 rounded-full bg-[var(--color-brand-primary)]/10 flex items-center justify-center text-[var(--color-brand-primary)]">
                                <RefreshCw size={32} />
                            </div>
                        </div>

                        <h3 className="text-center font-medium text-lg mb-2">Never Run Out of Credits</h3>
                        <p className="text-center text-sm text-[var(--color-text-muted)] mb-6">
                            When your balance falls below <strong className="text-[var(--color-text-main)]">1.000 ArmoCredits©</strong>,
                            we will automatically recharge your account with <strong className="text-[var(--color-text-main)]">1.000 ArmoCredits©</strong>.
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
                                <div className="text-lg font-bold">1.000 ArmoCredits©</div>
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

                {/* Edit Billing Details Modal */}
                <Modal
                    isOpen={showBillingModal}
                    onClose={() => setShowBillingModal(false)}
                    title="Edit Billing Details"
                >
                    <div className="p-6 space-y-5">
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

                {/* Plan Change Modal */}
                <Modal
                    isOpen={showPlanChangeModal}
                    onClose={() => !isUpdatingPlan && setShowPlanChangeModal(false)}
                    title="Confirm Protocol Change"
                >
                    <div className="p-8">
                        {pendingPlan && (
                            <div className="space-y-6">
                                <div className="p-8 bg-black/90 rounded-2xl border border-white/10 text-center shadow-2xl">
                                    <div className="text-[10px] uppercase font-black tracking-[0.3em] text-[var(--color-brand-accent)] mb-3 italic">New Execution Tier Protocol</div>
                                    <div className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">{pendingPlan.name}</div>
                                    <div className="mt-6 pt-6 border-t border-white/5 text-[11px] text-zinc-400 uppercase tracking-[0.15em] leading-relaxed font-medium">
                                        The new resource allocation matrix will be deployed at the start of the next cycle. Operational continuity remains unaffected.
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 mt-4">
                                    <Button
                                        variant="primary"
                                        className="w-full h-14 !bg-[var(--color-brand-accent)] !text-black font-black uppercase tracking-[0.3em] text-[10px] border-none shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                                        onClick={confirmPlanChange}
                                        disabled={isUpdatingPlan}
                                    >
                                        {isUpdatingPlan ? <RefreshCw className="animate-spin mr-2" /> : 'AUTHORIZE DEPLOYMENT'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full text-zinc-500 hover:text-white uppercase tracking-[0.2em] font-black text-[9px] transition-colors"
                                        onClick={() => setShowPlanChangeModal(false)}
                                        disabled={isUpdatingPlan}
                                    >
                                        ABORT MISSION
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Modal>
            </div >
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
                        { id: 'PROFILE', label: 'IDENTITY', icon: User },
                        { id: 'ORG', label: 'ORGANIZATION', icon: Building },
                        { id: 'ACTIVATION', label: 'SYSTEM ACTIVATION', icon: Zap },
                        { id: 'SUBSCRIPTION', label: 'SUBSCRIPTION', icon: CreditCard }
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
                {activeTab === 'ORG' && (
                    <ProtectedContent 
                        requireAdmin
                        fallback={
                            <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
                                <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mb-4">
                                    <Shield size={40} className="text-amber-500" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Limited Access</h3>
                                <p className="text-zinc-400 text-center max-w-md">
                                    Only organization Admins can modify business settings.
                                </p>
                            </div>
                        }
                    >
                        {renderOrg()}
                    </ProtectedContent>
                )}
                {activeTab === 'SUBSCRIPTION' && renderBilling()}
                {activeTab === 'ACTIVATION' && renderActivation()}
            </div>
            <ContactModal
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />
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
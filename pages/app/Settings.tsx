import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { PermissionLoader } from '../../components/common/PermissionLoader';
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
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState<SettingsTab>('PROFILE');
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');
    
    // Check permissions for organization settings and Settings access
    const { canEditOrganization, canAccessSettings, isOrgAdmin, isAppAdmin, loading: permissionsLoading } = usePermissions();
    
    // Debug logging for permissions
    console.log('[Settings] 🔍 Permissions:', {
        permissionsLoading,
        canAccessSettings,
        isOrgAdmin,
        isAppAdmin
    });

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
    
    // DEBUG - Remove after fixing
    useEffect(() => {
        console.log('[Settings] showPasswordModal state:', showPasswordModal);
    }, [showPasswordModal]);
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [changingPassword, setChangingPassword] = useState(false);

    // -- Avatar Upload State --
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const avatarInputRef = React.useRef<HTMLInputElement>(null);

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

    // -- Top Up State removed - Manual payments only --

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
    const [kbFilesData, setKbFilesData] = useState<any[]>([]);
    const [uploadingFile, setUploadingFile] = useState<string | null>(null);

    // PMS Configuration state (single record)
    const [pmsConfig, setPmsConfig] = useState({
        pmsProvider: 'mews', // 'mews', 'opera', 'cloudbeds', 'custom'
        apiBaseUrl: '',
        authType: 'api_key', // 'basic', 'api_key', 'oauth2', 'bearer'
        // Credentials (based on authType)
        apiUsername: '',
        apiPassword: '',
        apiKey: '',
        clientId: '',
        clientSecret: '',
        bearerToken: ''
    });

    // Hotels list state (multiple records)
    const [hotels, setHotels] = useState<Array<{
        id?: string;
        hotelName: string;
        hotelIdInPms: string;
        propertyCode?: string;
        isActive: boolean;
    }>>([]);

    // UI state for hotels
    const [showAddHotelModal, setShowAddHotelModal] = useState(false);
    const [editingHotel, setEditingHotel] = useState<any>(null);
    const [isSavingPMS, setIsSavingPMS] = useState(false);

    // File input refs
    const policyFileInputRef = React.useRef<HTMLInputElement>(null);
    const propertyFileInputRef = React.useRef<HTMLInputElement>(null);

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

    // ========================================
    // ALL FUNCTION DECLARATIONS
    // ========================================

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
                .maybeSingle(); // Use maybeSingle() to handle case where credits don't exist yet

            if (error) {
                console.error('[Settings] Error fetching balance:', error);
                setOrganizationBalance(0);
            } else {
                // If data is null (webhook hasn't created credits yet), show 0
                setOrganizationBalance(data?.balance || 0);
                console.log('[Settings] Organization balance:', data?.balance || 0);
            }
        } catch (error) {
            console.error('[Settings] Unexpected error fetching balance:', error);
            setOrganizationBalance(0);
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

    // Fetch knowledge base files from database
    const fetchKnowledgeBaseFiles = async () => {
        if (!supabase || !organization?.id) {
            console.warn('[Settings] Supabase or organization not available');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('organization_knowledge_base')
                .select('*')
                .eq('organization_id', organization.id)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('[Settings] Error fetching KB files:', error);
                return;
            }

            if (data) {
                setKbFilesData(data);
                setKbFiles(data.map(f => f.file_name));
                console.log('[Settings] KB files loaded:', data.length);
            }
        } catch (error) {
            console.error('[Settings] Unexpected error fetching KB files:', error);
        }
    };

    // Fetch WhatsApp configuration
    const fetchWhatsAppConfig = async () => {
        if (!supabase || !organization?.id) {
            console.warn('[Settings] Supabase or organization not available');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('organization_whatsapp_config')
                .select('*')
                .eq('organization_id', organization.id)
                .maybeSingle();
            
            if (error && error.code !== 'PGRST116') {
                console.error('[Settings] Error fetching WhatsApp config:', error);
                return;
            }
            
            if (data) {
                console.log('[Settings] WhatsApp config loaded:', { id: data.id, configured: data.configured_in_n8n });
                setWaForm({
                    accessToken: data.access_token || '',
                    businessId: data.business_account_id || '',
                    phoneId: data.phone_number_id || '',
                    verifyToken: data.verify_token || '',
                    appSecret: data.app_secret || ''
                });
            }
        } catch (error) {
            console.error('[Settings] Unexpected error fetching WhatsApp config:', error);
        }
    };

    // Fetch PMS Configuration
    const fetchPMSConfig = async () => {
        if (!supabase || !organization?.id) {
            console.warn('[Settings] Supabase or organization not available');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('organization_pms_config')
                .select('*')
                .eq('organization_id', organization.id)
                .maybeSingle();
            
            if (error && error.code !== 'PGRST116') {
                console.error('[Settings] Error fetching PMS config:', error);
                return;
            }
            
            if (data) {
                console.log('[Settings] PMS config loaded:', { id: data.id, provider: data.pms_provider });
                setPmsConfig({
                    pmsProvider: data.pms_provider || 'mews',
                    apiBaseUrl: data.api_base_url || '',
                    authType: data.auth_type || 'api_key',
                    apiUsername: data.api_username || '',
                    apiPassword: data.api_password_encrypted || '',
                    apiKey: data.api_key || '',
                    clientId: data.client_id || '',
                    clientSecret: data.client_secret_encrypted || '',
                    bearerToken: data.bearer_token || ''
                });
            }
        } catch (error) {
            console.error('[Settings] Unexpected error fetching PMS config:', error);
        }
    };

    // Fetch Hotels
    const fetchHotels = async () => {
        if (!supabase || !organization?.id) {
            console.warn('[Settings] Supabase or organization not available');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('organization_hotels')
                .select('*')
                .eq('organization_id', organization.id)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            setHotels(data.map(h => ({
                id: h.id,
                hotelName: h.hotel_name,
                hotelIdInPms: h.hotel_id_in_pms,
                propertyCode: h.property_code,
                isActive: h.is_active
            })));

            console.log('[Settings] Hotels loaded:', data.length);
        } catch (error: any) {
            console.error('[Settings] Error fetching hotels:', error);
            // Don't show error to user if table doesn't exist yet
            if (error.code !== '42P01' && error.code !== 'PGRST116') {
                setValidationError('Failed to load hotels');
            }
        }
    };

    // ========================================
    // ALL useEffect HOOKS
    // ========================================

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

    // Load user language preference on mount
    useEffect(() => {
        const loadUserLanguage = async () => {
            if (!supabase || !userProfile?.id) return;
            
            try {
                const { data } = await supabase
                    .from('profiles')
                    .select('language')
                    .eq('id', userProfile.id)
                    .maybeSingle();
                
                if (data?.language && (data.language === 'en' || data.language === 'it')) {
                    setSelectedLanguage(data.language);
                    i18n.changeLanguage(data.language);
                }
            } catch (error) {
                console.error('[Settings] Error loading language preference:', error);
            }
        };
        
        loadUserLanguage();
    }, [userProfile?.id, i18n]);

    // Handle language change
    const handleLanguageChange = async (lang: string) => {
        if (!supabase || !userProfile?.id) return;
        
        try {
            await i18n.changeLanguage(lang);
            setSelectedLanguage(lang);
            localStorage.setItem('language', lang);
            
            // Save to user profile
            const { error } = await supabase
                .from('profiles')
                .update({ language: lang })
                .eq('id', userProfile.id);
            
            if (error) {
                console.error('[Settings] Error saving language preference:', error);
            }
        } catch (error) {
            console.error('[Settings] Error changing language:', error);
        }
    };

    // Handle credit purchase redirect (success/cancel)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const creditsStatus = params.get('credits');
        const amount = params.get('amount');

        if (creditsStatus === 'success' && amount) {
            console.log('✅ Credits purchase successful!');
            console.log('Credits added:', amount);
            
            // Refresh balance to show updated amount
            if (organization?.id) {
                fetchOrganizationBalance();
            }
            
            // Clean up URL
            window.history.replaceState({}, '', window.location.pathname + '?tab=subscription');
            
            // Optional: Show success notification
            setSaveSuccess(`Successfully purchased ${parseInt(amount).toLocaleString()} credits!`);
            setTimeout(() => setSaveSuccess(null), 5000);
        }

        if (creditsStatus === 'canceled') {
            console.log('❌ Credits purchase was canceled');
            window.history.replaceState({}, '', window.location.pathname + '?tab=subscription');
        }
    }, [organization?.id]);

    // Fetch subscription data when subscription tab is active
    useEffect(() => {
        if (activeTab === 'SUBSCRIPTION' && organization?.id) {
            fetchSubscriptionData();
            fetchOrganizationBalance();
        }
    }, [activeTab, organization?.id]);

    // Fetch knowledge base files when activation tab is active
    useEffect(() => {
        if (activeTab === 'ACTIVATION' && organization?.id) {
            fetchKnowledgeBaseFiles();
            fetchWhatsAppConfig();
            fetchPMSConfig();
            fetchHotels();
        }
    }, [activeTab, organization?.id]);

    // ========================================
    // AFTER ALL HOOKS: CONDITIONAL LOGIC
    // ========================================

    // Show loading state while permissions are being checked
    if (permissionsLoading) {
        return <PermissionLoader />;
    }

    // Redirect Collaborators - Settings are restricted to SuperAdmin and Org Admin only
    if (!canAccessSettings) {
        console.log('[Settings] ❌ Access DENIED:', {
            canAccessSettings,
            isOrgAdmin,
            isAppAdmin,
            userRole: userProfile?.role
        });
        
        return (
            <div className="w-full h-screen bg-black flex items-center justify-center p-6">
                <div className="max-w-md text-center space-y-6 animate-fade-in">
                    <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center">
                        <Shield size={40} className="text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-3">{t('settings.accessDenied.title')}</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            {t('settings.accessDenied.message')}
                        </p>
                        <p className="text-zinc-500 text-sm mt-4">
                            {t('settings.accessDenied.collaboratorMessage')}
                        </p>
                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
                                <p className="text-xs text-red-400 font-mono">
                                    DEBUG: canAccessSettings={String(canAccessSettings)}, 
                                    isOrgAdmin={String(isOrgAdmin)}, 
                                    isAppAdmin={String(isAppAdmin)}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="pt-4">
                        <button 
                            onClick={() => onNavigate?.('dashboard')} 
                            className="px-6 py-3 bg-[var(--color-brand-accent)] text-black rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-white transition-all"
                        >
                            {t('settings.accessDenied.backToDashboard')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    
    console.log('[Settings] ✅ Access GRANTED:', {
        canAccessSettings,
        isOrgAdmin,
        isAppAdmin
    });

    const isBillingDetailsComplete = localBillingDetails.legalName && localBillingDetails.vatNumber && localBillingDetails.address;

    const handleSaveProfile = async () => {
        setIsSavingProfile(true);
        try {
            await onUpdateProfile(localProfile);
            setSaveSuccess(t('settings.saveProfile'));
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
            setSaveSuccess(t('settings.organization.saved'));
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

    const handleSaveBillingDetails = async () => {
        setIsSavingBilling(true);
        try {
            await onUpdateBillingDetails(localBillingDetails);
            setSaveSuccess('Billing details saved!');
            setTimeout(() => setSaveSuccess(null), 2000);
        } catch (error) {
            console.error('Failed to save billing details:', error);
        } finally {
            setIsSavingBilling(false);
        }
    };
    
    const handleSaveBillingModal = () => {
        onUpdateBillingDetails(localBillingDetails);
        setShowBillingModal(false);
    };

    // Avatar Upload Handlers
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            setValidationError('Please upload a JPG or PNG image');
            return;
        }

        // Validate file size (max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            setValidationError('Image size must be less than 2MB');
            return;
        }

        try {
            setUploadingAvatar(true);
            setValidationError(null);

            // 1. Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${userProfile.id}_${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { data: storageData, error: storageError } = await supabase.storage
                .from('profiles')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (storageError) throw storageError;

            // 2. Get public URL
            const { data: urlData } = supabase.storage
                .from('profiles')
                .getPublicUrl(filePath);

            const avatarUrl = urlData.publicUrl;

            // 3. Update profile in database
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ photo: avatarUrl, updated_at: new Date().toISOString() })
                .eq('id', userProfile.id);

            if (updateError) throw updateError;

            // 4. Update local state
            setLocalProfile({ ...localProfile, photo: avatarUrl });
            setSaveSuccess('Avatar updated successfully!');
            setTimeout(() => setSaveSuccess(null), 3000);

        } catch (error: any) {
            console.error('Avatar upload error:', error);
            setValidationError(`Failed to upload avatar: ${error.message}`);
        } finally {
            setUploadingAvatar(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleRemoveAvatar = async () => {
        if (!confirm('Are you sure you want to remove your avatar?')) return;

        try {
            setUploadingAvatar(true);

            // Update profile to remove photo
            const { error } = await supabase
                .from('profiles')
                .update({ photo: null, updated_at: new Date().toISOString() })
                .eq('id', userProfile.id);

            if (error) throw error;

            setLocalProfile({ ...localProfile, photo: null });
            setSaveSuccess('Avatar removed');
            setTimeout(() => setSaveSuccess(null), 3000);

        } catch (error: any) {
            console.error('Error removing avatar:', error);
            setValidationError(`Failed to remove avatar: ${error.message}`);
        } finally {
            setUploadingAvatar(false);
        }
    };

    // Password Change Handler
    const handleChangePassword = async () => {
        try {
            setChangingPassword(true);
            setValidationError(null);

            // Validation
            if (passwordForm.newPassword.length < 8) {
                setValidationError('Password must be at least 8 characters long');
                setChangingPassword(false);
                return;
            }

            if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                setValidationError('New passwords do not match');
                setChangingPassword(false);
                return;
            }

            // Verify current password by attempting to sign in
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: userProfile.email,
                password: passwordForm.currentPassword
            });

            if (signInError) {
                setValidationError('Current password is incorrect');
                setChangingPassword(false);
                return;
            }

            // Update password
            const { error: updateError } = await supabase.auth.updateUser({
                password: passwordForm.newPassword
            });

            if (updateError) throw updateError;

            // Success
            setSaveSuccess('Password changed successfully!');
            setShowPasswordModal(false);
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setTimeout(() => setSaveSuccess(null), 3000);

        } catch (error: any) {
            console.error('Password change error:', error);
            setValidationError(`Failed to change password: ${error.message}`);
        } finally {
            setChangingPassword(false);
        }
    };

    // Handle knowledge base file upload
    const handleKBFileUpload = async (file: File, fileType: 'policy_pdf' | 'property_csv') => {
        if (!supabase || !organization?.id) {
            setValidationError('System not initialized');
            return;
        }

        // Validate file size (10MB max)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            setValidationError('File size exceeds 10MB limit');
            return;
        }

        // Validate file type
        if (fileType === 'policy_pdf' && file.type !== 'application/pdf') {
            setValidationError('Please upload a PDF file for Institutional Policies');
            return;
        }
        if (fileType === 'property_csv' && file.type !== 'text/csv') {
            setValidationError('Please upload a CSV file for Property Data');
            return;
        }

        try {
            setUploadingFile(fileType);
            setValidationError(null);

            // 1. Upload to Supabase Storage
            const fileName = `${organization.id}/${Date.now()}_${file.name}`;
            console.log('[Settings] Uploading file:', fileName);

            const { data: storageData, error: storageError } = await supabase.storage
                .from('knowledge-base')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (storageError) {
                console.error('[Settings] Storage error:', storageError);
                throw new Error(`Upload failed: ${storageError.message}`);
            }

            console.log('[Settings] File uploaded to storage:', storageData);

            // 2. Save metadata to database
            const { data: user } = await supabase.auth.getUser();
            const { data: dbData, error: dbError } = await supabase
                .from('organization_knowledge_base')
                .insert({
                    organization_id: organization.id,
                    file_type: fileType,
                    file_name: file.name,
                    storage_path: fileName,
                    file_size_bytes: file.size,
                    mime_type: file.type,
                    uploaded_by: user?.user?.id,
                    processing_status: 'uploaded'
                })
                .select()
                .single();

            if (dbError) {
                console.error('[Settings] Database error:', dbError);
                // Try to clean up storage
                await supabase.storage.from('knowledge-base').remove([fileName]);
                throw new Error(`Failed to save metadata: ${dbError.message}`);
            }

            console.log('[Settings] Metadata saved:', dbData);

            // 3. Update local state
            setKbFilesData(prev => [dbData, ...prev]);
            setKbFiles(prev => [file.name, ...prev]);
            setSaveSuccess(`${file.name} uploaded successfully!`);
            setTimeout(() => setSaveSuccess(null), 3000);

        } catch (error: any) {
            console.error('[Settings] Upload error:', error);
            setValidationError(error.message || 'Failed to upload file');
        } finally {
            setUploadingFile(null);
        }
    };

    // Trigger file input clicks
    const handlePolicyCardClick = () => {
        policyFileInputRef.current?.click();
    };

    const handlePropertyCardClick = () => {
        propertyFileInputRef.current?.click();
    };

    // Handle file input changes
    const handlePolicyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleKBFileUpload(file, 'policy_pdf');
        }
        // Reset input
        e.target.value = '';
    };

    const handlePropertyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleKBFileUpload(file, 'property_csv');
        }
        // Reset input
        e.target.value = '';
    };

    // Format file size for display
    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // Delete knowledge base file
    const handleDeleteKBFile = async (fileId: string, storagePath: string) => {
        if (!supabase || !organization?.id) return;

        const confirmed = window.confirm('Are you sure you want to delete this file?');
        if (!confirmed) return;

        try {
            setIsValidating(true);

            // 1. Mark as inactive in database (soft delete)
            const { error: dbError } = await supabase
                .from('organization_knowledge_base')
                .update({ is_active: false })
                .eq('id', fileId);

            if (dbError) throw dbError;

            // 2. Delete from storage
            const { error: storageError } = await supabase.storage
                .from('knowledge-base')
                .remove([storagePath]);

            if (storageError) {
                console.warn('[Settings] Storage deletion warning:', storageError);
            }

            // 3. Update local state
            setKbFilesData(prev => prev.filter(f => f.id !== fileId));
            setKbFiles(prev => prev.filter((_, idx) => kbFilesData[idx]?.id !== fileId));

            setSaveSuccess('File deleted successfully');
            setTimeout(() => setSaveSuccess(null), 2000);

        } catch (error: any) {
            console.error('[Settings] Delete error:', error);
            setValidationError('Failed to delete file');
        } finally {
            setIsValidating(false);
        }
    };

    // Save WhatsApp configuration
    const handleSaveWhatsAppConfig = async () => {
        try {
            setIsValidating(true);
            setValidationError(null);
            
            // Validation
            if (!waForm.accessToken || !waForm.businessId || !waForm.phoneId) {
                setValidationError('Access Token, Business Account ID, and Phone Number ID are required');
                setIsValidating(false);
                return;
            }
            
            // Additional validation: Access token should start with EAA
            if (!waForm.accessToken.trim().startsWith('EAA')) {
                setValidationError('Access Token should start with "EAA" (Meta format)');
                setIsValidating(false);
                return;
            }
            
            // Upsert to database
            const { data, error } = await supabase
                .from('organization_whatsapp_config')
                .upsert({
                    organization_id: organization.id,
                    access_token: waForm.accessToken.trim(),
                    business_account_id: waForm.businessId.trim(),
                    phone_number_id: waForm.phoneId.trim(),
                    verify_token: waForm.verifyToken?.trim() || null,
                    app_secret: waForm.appSecret?.trim() || null,
                    configured_in_n8n: false, // Initially not configured
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'organization_id'
                })
                .select()
                .single();
            
            if (error) throw error;
            
            console.log('[Settings] WhatsApp config saved:', data);
            setSaveSuccess('WhatsApp configuration saved successfully! ✓');
            setTimeout(() => setSaveSuccess(null), 4000);
            
        } catch (error: any) {
            console.error('[Settings] Error saving WhatsApp config:', error);
            setValidationError(`Failed to save configuration: ${error.message}`);
        } finally {
            setIsValidating(false);
        }
    };

    // Save PMS Configuration
    const handleSavePMSConfig = async () => {
        try {
            setIsSavingPMS(true);
            setValidationError(null);
            
            // Validation
            if (!pmsConfig.apiBaseUrl) {
                setValidationError('API Base URL is required');
                return;
            }
            
            // Validate credentials based on auth type
            if (pmsConfig.authType === 'basic' && (!pmsConfig.apiUsername || !pmsConfig.apiPassword)) {
                setValidationError('Username and Password are required for Basic Auth');
                return;
            }
            if (pmsConfig.authType === 'api_key' && !pmsConfig.apiKey) {
                setValidationError('API Key is required');
                return;
            }
            if (pmsConfig.authType === 'oauth2' && (!pmsConfig.clientId || !pmsConfig.clientSecret)) {
                setValidationError('Client ID and Secret are required for OAuth2');
                return;
            }
            if (pmsConfig.authType === 'bearer' && !pmsConfig.bearerToken) {
                setValidationError('Bearer Token is required');
                return;
            }
            
            // Upsert to database
            const { error } = await supabase
                .from('organization_pms_config')
                .upsert({
                    organization_id: organization.id,
                    pms_provider: pmsConfig.pmsProvider,
                    api_base_url: pmsConfig.apiBaseUrl.trim(),
                    auth_type: pmsConfig.authType,
                    api_username: pmsConfig.apiUsername?.trim() || null,
                    api_password_encrypted: pmsConfig.apiPassword?.trim() || null, // TODO: encrypt in production
                    api_key: pmsConfig.apiKey?.trim() || null,
                    client_id: pmsConfig.clientId?.trim() || null,
                    client_secret_encrypted: pmsConfig.clientSecret?.trim() || null, // TODO: encrypt in production
                    bearer_token: pmsConfig.bearerToken?.trim() || null,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'organization_id'
                });
            
            if (error) throw error;
            
            console.log('[Settings] PMS configuration saved');
            setSaveSuccess('PMS configuration saved successfully! ✓');
            setTimeout(() => setSaveSuccess(null), 3000);
            
        } catch (error: any) {
            console.error('[Settings] Error saving PMS config:', error);
            setValidationError(`Failed to save: ${error.message}`);
        } finally {
            setIsSavingPMS(false);
        }
    };

    // Save Hotel
    const handleSaveHotel = async () => {
        try {
            if (!editingHotel?.hotelName || !editingHotel?.hotelIdInPms) {
                setValidationError('Hotel Name and Hotel ID are required');
                return;
            }
            
            // Get PMS config ID first
            const { data: pmsConfigData } = await supabase
                .from('organization_pms_config')
                .select('id')
                .eq('organization_id', organization.id)
                .maybeSingle();
            
            if (!pmsConfigData) {
                setValidationError('Please save PMS configuration first');
                return;
            }
            
            if (editingHotel.id) {
                // Update existing hotel
                const { error } = await supabase
                    .from('organization_hotels')
                    .update({
                        hotel_name: editingHotel.hotelName,
                        hotel_id_in_pms: editingHotel.hotelIdInPms,
                        property_code: editingHotel.propertyCode || null,
                        is_active: editingHotel.isActive,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingHotel.id);
                
                if (error) throw error;
            } else {
                // Insert new hotel
                const { error } = await supabase
                    .from('organization_hotels')
                    .insert({
                        organization_id: organization.id,
                        pms_config_id: pmsConfigData.id,
                        hotel_name: editingHotel.hotelName,
                        hotel_id_in_pms: editingHotel.hotelIdInPms,
                        property_code: editingHotel.propertyCode || null,
                        is_active: editingHotel.isActive ?? true
                    });
                
                if (error) throw error;
            }
            
            // Refresh hotels list
            await fetchHotels();
            setShowAddHotelModal(false);
            setEditingHotel(null);
            setSaveSuccess('Hotel saved successfully! ✓');
            setTimeout(() => setSaveSuccess(null), 3000);
            
        } catch (error: any) {
            console.error('[Settings] Error saving hotel:', error);
            setValidationError(`Failed to save hotel: ${error.message}`);
        }
    };

    // Delete Hotel
    const handleDeleteHotel = async (hotelId: string | undefined) => {
        if (!hotelId) return;
        
        if (!confirm('Are you sure you want to delete this hotel?')) return;
        
        try {
            const { error } = await supabase
                .from('organization_hotels')
                .delete()
                .eq('id', hotelId);
            
            if (error) throw error;
            
            await fetchHotels();
            setSaveSuccess('Hotel deleted successfully');
            setTimeout(() => setSaveSuccess(null), 3000);
        } catch (error: any) {
            console.error('[Settings] Error deleting hotel:', error);
            setValidationError(`Failed to delete: ${error.message}`);
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
        console.log('[renderProfile] showPasswordModal:', showPasswordModal);
        return (
            <div className="space-y-6 animate-fade-in w-full pb-20">
                {/* Identity Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-6">
                        {/* Personal Information */}
                        <Card padding="lg">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-lg font-medium text-[var(--color-text-main)]">{t('settings.profile.title')}</h3>
                                    <p className="text-sm text-[var(--color-text-muted)]">{t('settings.profile.subtitle')}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FloatingInput 
                                    label={t('settings.profile.firstName')} 
                                    value={localProfile.firstName || ''} 
                                    onChange={(e) => setLocalProfile({ ...localProfile, firstName: e.target.value })} 
                                />
                                <FloatingInput 
                                    label={t('settings.profile.lastName')} 
                                    value={localProfile.lastName || ''} 
                                    onChange={(e) => setLocalProfile({ ...localProfile, lastName: e.target.value })} 
                                />
                                <FloatingInput 
                                    label={t('settings.profile.email')} 
                                    value={localProfile.email} 
                                    disabled
                                    className="opacity-60 cursor-not-allowed"
                                />
                                <FloatingInput 
                                    label={t('settings.profile.phone')} 
                                    placeholder="+39 123 456 7890"
                                    value={localProfile.phone || ''} 
                                    onChange={(e) => setLocalProfile({ ...localProfile, phone: e.target.value })} 
                                />
                                <div className="md:col-span-2">
                                    <FloatingInput 
                                        label={t('settings.profile.jobRole')} 
                                        placeholder="Operations Manager"
                                        value={localProfile.jobRole || ''} 
                                        onChange={(e) => setLocalProfile({ ...localProfile, jobRole: e.target.value })} 
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Preferences */}
                        <Card padding="lg">
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-[var(--color-text-main)]">{t('settings.preferences.title')}</h3>
                                <p className="text-sm text-[var(--color-text-muted)]">{t('settings.preferences.subtitle')}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-muted)] absolute top-2 left-3">{t('settings.preferences.language')}</label>
                                    <select 
                                        value={selectedLanguage}
                                        onChange={(e) => handleLanguageChange(e.target.value)}
                                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 pt-6 pb-2 text-sm focus:border-[var(--color-brand-accent)] outline-none appearance-none"
                                    >
                                        <option value="en" className="bg-black text-white !border !border-black">{t('settings.preferences.english')}</option>
                                        <option value="it" className="bg-black text-white !border !border-black">{t('settings.preferences.italian')}</option>
                                    </select>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar / Profile Avatar */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card variant="dark" padding="lg" className="text-center flex flex-col items-center">
                            {/* Hidden file input */}
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                onChange={handleAvatarUpload}
                                className="hidden"
                            />

                            <div 
                                className="relative group cursor-pointer mb-6"
                                onClick={() => avatarInputRef.current?.click()}
                            >
                                <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-all overflow-hidden">
                                    {uploadingAvatar ? (
                                        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : localProfile.photo ? (
                                        <img 
                                            src={localProfile.photo} 
                                            alt="Avatar" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Camera size={32} className="text-white/20 group-hover:text-white/40 transition-colors" />
                                    )}
                                </div>
                                
                                <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--color-brand-accent)] flex items-center justify-center text-black shadow-lg">
                                    <Plus size={16} />
                                </div>
                            </div>

                            <h4 className="text-white font-bold tracking-tight">{t('settings.profile.avatar.title')}</h4>
                            <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-1">{t('settings.profile.avatar.subtitle')}</p>
                            <p className="text-[10px] text-zinc-600 mt-4 px-4 italic leading-relaxed">
                                {t('settings.profile.avatar.uploadHint')}
                            </p>
                            
                            {localProfile.photo && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveAvatar();
                                    }}
                                    className="mt-4 text-xs text-red-400 hover:text-red-300 underline"
                                >
                                    {t('settings.profile.avatar.remove')}
                                </button>
                            )}
                        </Card>

                        {/* Security Card */}
                        <Card variant="dark" padding="lg">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6">
                                {t('settings.security.title')}
                            </h4>
                            
                            <p className="text-[10px] text-zinc-500 mb-6 leading-relaxed">
                                {t('settings.security.subtitle')}
                            </p>
                            
                            <button
                                onClick={() => {
                                    console.log('[Settings] Button clicked, opening modal');
                                    console.log('[Settings] Current state:', showPasswordModal);
                                    setShowPasswordModal(true);
                                    console.log('[Settings] State should now be true');
                                }}
                                className="w-full py-3 text-[9px] font-black uppercase tracking-[0.2em] border border-white/5 rounded-xl hover:bg-white/5 transition-all"
                            >
                                {t('settings.security.changePassword')}
                            </button>
                        </Card>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-white/5 mt-10">
                    <Button size="lg" leftIcon={<Save size={18} />} onClick={handleSaveProfile} isLoading={isSavingProfile}>{isSavingProfile ? t('common.saving') : t('settings.saveChanges')}</Button>
                </div>
            </div>
        );
    };

    const renderOrg = () => {
        return (
            <div className="w-full animate-fade-in space-y-8 pb-20 max-w-4xl mx-auto">
                
                {/* SECTION 1: Organization Profile */}
                <Card padding="lg">
                    <h3 className="text-lg font-medium mb-6">Organization Profile</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FloatingInput 
                            label="Organization Name" 
                            value={localOrg.name} 
                            onChange={(e) => setLocalOrg({ ...localOrg, name: e.target.value })} 
                        />
                        
                        <FloatingInput 
                            label="Corporate Email" 
                            value={localOrg.billingEmail} 
                            onChange={(e) => setLocalOrg({ ...localOrg, billingEmail: e.target.value })} 
                        />
                        
                        <FloatingInput 
                            label="Company Website" 
                            value="https://armonyco.io" 
                            readOnly
                            className="opacity-60 cursor-not-allowed"
                        />
                        
                        <div className="relative">
                            <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-muted)] absolute top-2 left-3">
                                Legal Structure
                            </label>
                            <select className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 pt-6 pb-2 text-sm focus:border-[var(--color-brand-accent)] outline-none appearance-none">
                                <option>LLC / Ltd.</option>
                                <option>S.A. / Corporation</option>
                                <option>Inc.</option>
                                <option>Private Individual Host</option>
                            </select>
                        </div>
                    </div>
                    
                    {/* Save Organization Button */}
                    <div className="flex justify-end pt-6 mt-6 border-t border-white/5">
                        <Button
                            size="lg"
                            leftIcon={<Save size={18} />}
                            onClick={handleSaveOrg}
                            isLoading={isSavingOrg}
                            disabled={isSavingOrg}
                        >
                            {isSavingOrg ? 'Saving...' : 'Save Organization'}
                        </Button>
                    </div>
                </Card>

                {/* SECTION 2: Billing Details */}
                <Card padding="lg">
                    <h3 className="text-lg font-medium mb-6">Billing Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Legal Name */}
                        <div className="md:col-span-2">
                            <FloatingInput
                                label="Legal Entity Name *"
                                placeholder="Company S.r.l."
                                value={localBillingDetails.legalName || ''}
                                onChange={(e) => setLocalBillingDetails({ ...localBillingDetails, legalName: e.target.value })}
                            />
                        </div>

                        {/* VAT Number */}
                        <FloatingInput
                            label="VAT / Tax ID Number *"
                            placeholder="IT12345678901"
                            value={localBillingDetails.vatNumber || ''}
                            onChange={(e) => setLocalBillingDetails({ ...localBillingDetails, vatNumber: e.target.value })}
                        />

                        {/* Fiscal Code */}
                        <FloatingInput
                            label="Fiscal Code (Optional)"
                            placeholder="RSSMRA80A01H501U"
                            value={localBillingDetails.fiscalCode || ''}
                            onChange={(e) => setLocalBillingDetails({ ...localBillingDetails, fiscalCode: e.target.value })}
                        />

                        {/* Address */}
                        <div className="md:col-span-2">
                            <FloatingInput
                                label="Address *"
                                placeholder="Via Roma 123"
                                value={localBillingDetails.address || ''}
                                onChange={(e) => setLocalBillingDetails({ ...localBillingDetails, address: e.target.value })}
                            />
                        </div>

                        {/* City */}
                        <FloatingInput
                            label="City *"
                            placeholder="Roma"
                            value={localBillingDetails.city || ''}
                            onChange={(e) => setLocalBillingDetails({ ...localBillingDetails, city: e.target.value })}
                        />

                        {/* ZIP */}
                        <FloatingInput
                            label="ZIP / Postal Code *"
                            placeholder="00100"
                            value={localBillingDetails.zip || ''}
                            onChange={(e) => setLocalBillingDetails({ ...localBillingDetails, zip: e.target.value })}
                        />

                        {/* Country */}
                        <div className="relative md:col-span-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-muted)] absolute top-2 left-3">
                                Country *
                            </label>
                            <select
                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 pt-6 pb-2 text-sm focus:border-[var(--color-brand-accent)] outline-none appearance-none"
                                value={localBillingDetails.country || ''}
                                onChange={(e) => setLocalBillingDetails({ ...localBillingDetails, country: e.target.value })}
                            >
                                <option value="">Select Country</option>
                                <option value="IT">Italy</option>
                                <option value="US">United States</option>
                                <option value="GB">United Kingdom</option>
                                <option value="FR">France</option>
                                <option value="DE">Germany</option>
                                <option value="ES">Spain</option>
                                <option value="BR">Brazil</option>
                            </select>
                        </div>

                        {/* SDI Code */}
                        <FloatingInput
                            label="SDI Code (Italy - Optional)"
                            placeholder="ABCDEFG"
                            value={localBillingDetails.sdiCode || ''}
                            onChange={(e) => setLocalBillingDetails({ ...localBillingDetails, sdiCode: e.target.value })}
                        />

                        {/* PEC Email */}
                        <FloatingInput
                            label="PEC Email (Italy - Optional)"
                            placeholder="company@pec.it"
                            type="email"
                            value={localBillingDetails.pecEmail || ''}
                            onChange={(e) => setLocalBillingDetails({ ...localBillingDetails, pecEmail: e.target.value })}
                        />

                        {/* Settlement Currency */}
                        <div className="relative md:col-span-2">
                            <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-muted)] absolute top-2 left-3">
                                Settlement Currency
                            </label>
                            <select className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 pt-6 pb-2 text-sm focus:border-[var(--color-brand-accent)] outline-none appearance-none">
                                <option>USD - United States Dollar</option>
                                <option>EUR - Euro</option>
                                <option>GBP - British Pound</option>
                                <option>BRL - Brazilian Real</option>
                                <option>MXN - Mexican Peso</option>
                            </select>
                        </div>
                    </div>

                    {/* Save Billing Button */}
                    <div className="flex justify-end pt-6 mt-6 border-t border-white/5">
                        <Button
                            size="lg"
                            leftIcon={<Save size={18} />}
                            onClick={handleSaveBillingDetails}
                            isLoading={isSavingBilling}
                            disabled={isSavingBilling}
                        >
                            {isSavingBilling ? 'Saving...' : 'Save Billing Details'}
                        </Button>
                    </div>
                </Card>

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

                        {/* Hidden file inputs */}
                        <input
                            ref={policyFileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handlePolicyFileChange}
                            className="hidden"
                        />
                        <input
                            ref={propertyFileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handlePropertyFileChange}
                            className="hidden"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Policy PDF Upload Card */}
                            <div 
                                className="group cursor-pointer"
                                onClick={handlePolicyCardClick}
                            >
                                <Card className={`border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[var(--color-brand-accent)]/40 transition-all aspect-[4/3] flex flex-col items-center justify-center gap-4 relative overflow-hidden ${uploadingFile === 'policy_pdf' ? 'pointer-events-none opacity-60' : ''}`}>
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-brand-accent)]/20 to-transparent group-hover:via-[var(--color-brand-accent)]/40 transition-all"></div>
                                    {uploadingFile === 'policy_pdf' ? (
                                        <>
                                            <RefreshCw size={24} className="text-[var(--color-brand-accent)] animate-spin" />
                                            <div className="text-center px-4">
                                                <div className="text-[11px] font-black uppercase tracking-widest text-white mb-1">Uploading...</div>
                                                <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest italic">Please wait</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <FileText className="text-white/40 group-hover:text-[var(--color-brand-accent)] transition-colors" size={24} />
                                            </div>
                                            <div className="text-center px-4">
                                                <div className="text-[11px] font-black uppercase tracking-widest text-white mb-1">Institutional Policies</div>
                                                <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest italic">Grounding Material (PDF)</div>
                                            </div>
                                        </>
                                    )}
                                </Card>
                            </div>

                            {/* Property CSV Upload Card */}
                            <div 
                                className="group cursor-pointer"
                                onClick={handlePropertyCardClick}
                            >
                                <Card className={`border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[var(--color-brand-accent)]/40 transition-all aspect-[4/3] flex flex-col items-center justify-center gap-4 relative overflow-hidden ${uploadingFile === 'property_csv' ? 'pointer-events-none opacity-60' : ''}`}>
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-brand-accent)]/20 to-transparent group-hover:via-[var(--color-brand-accent)]/40 transition-all"></div>
                                    {uploadingFile === 'property_csv' ? (
                                        <>
                                            <RefreshCw size={24} className="text-[var(--color-brand-accent)] animate-spin" />
                                            <div className="text-center px-4">
                                                <div className="text-[11px] font-black uppercase tracking-widest text-white mb-1">Uploading...</div>
                                                <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest italic">Please wait</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Database className="text-white/40 group-hover:text-[var(--color-brand-accent)] transition-colors" size={24} />
                                            </div>
                                            <div className="text-center px-4">
                                                <div className="text-[11px] font-black uppercase tracking-widest text-white mb-1">Property Data</div>
                                                <div className="text-[9px] text-white/20 font-bold uppercase tracking-widest italic">Wi-Fi, Codes & Assets (CSV)</div>
                                            </div>
                                        </>
                                    )}
                                </Card>
                            </div>
                        </div>

                        {/* Error/Success Messages */}
                        {validationError && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <AlertCircle size={16} className="text-red-500" />
                                <p className="text-[10px] text-red-500 font-medium">{validationError}</p>
                                <button onClick={() => setValidationError(null)} className="ml-auto">
                                    <X size={14} className="text-red-500/60 hover:text-red-500" />
                                </button>
                            </div>
                        )}

                        {/* Uploaded Files List */}
                        {kbFilesData.length > 0 && (
                            <div className="space-y-3 pt-4">
                                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 italic">Uploaded Files</h4>
                                <div className="space-y-2">
                                    {kbFilesData.map((file) => (
                                        <div key={file.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl group hover:border-[var(--color-brand-accent)]/20 transition-all">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                                                    {file.file_type === 'policy_pdf' ? (
                                                        <FileText size={14} className="text-[var(--color-brand-accent)]" />
                                                    ) : (
                                                        <Database size={14} className="text-[var(--color-brand-accent)]" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[10px] font-black text-white/80 uppercase tracking-tight truncate">{file.file_name}</div>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest">{formatFileSize(file.file_size_bytes)}</span>
                                                        <span className="text-white/10">•</span>
                                                        <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest">
                                                            {new Date(file.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteKBFile(file.id, file.storage_path);
                                                }}
                                                className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-lg hover:bg-red-500/10 hover:border-red-500/30 transition-all group/btn shrink-0 ml-2"
                                                disabled={isValidating}
                                            >
                                                <X size={12} className="text-white/40 group-hover/btn:text-red-500 transition-colors" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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

                        {/* Configuration Status Indicator */}
                        {waForm.accessToken && (
                            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={20} className="text-emerald-500" />
                                    <div>
                                        <p className="text-sm font-bold text-white">Configuration Saved</p>
                                        <p className="text-xs text-zinc-400">
                                            Your WhatsApp credentials are stored securely. Update anytime.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">Permanent Access Token *</label>
                                <input
                                    type="password"
                                    placeholder="EAAxxxxx... (from Meta Business Settings)"
                                    value={waForm.accessToken}
                                    onChange={(e) => setWaForm({ ...waForm, accessToken: e.target.value })}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 focus:border-[var(--color-brand-accent)] outline-none"
                                />
                                <p className="text-[8px] text-zinc-500 italic">Permanent token from Meta Business Settings</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">WhatsApp Business Account ID *</label>
                                <input
                                    type="text"
                                    placeholder="123456789012345"
                                    value={waForm.businessId}
                                    onChange={(e) => setWaForm({ ...waForm, businessId: e.target.value })}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 focus:border-[var(--color-brand-accent)] outline-none"
                                />
                                <p className="text-[8px] text-zinc-500 italic">Business Account ID from WhatsApp Business</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">Phone Number ID *</label>
                                <input
                                    type="text"
                                    placeholder="987654321098765"
                                    value={waForm.phoneId}
                                    onChange={(e) => setWaForm({ ...waForm, phoneId: e.target.value })}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 focus:border-[var(--color-brand-accent)] outline-none"
                                />
                                <p className="text-[8px] text-zinc-500 italic">Phone Number ID from WhatsApp Business</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">Webhook Verify Token (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="your_custom_webhook_token"
                                    value={waForm.verifyToken}
                                    onChange={(e) => setWaForm({ ...waForm, verifyToken: e.target.value })}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 focus:border-[var(--color-brand-accent)] outline-none"
                                />
                                <p className="text-[8px] text-zinc-500 italic">Custom token for webhook verification</p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">App Secret (Optional)</label>
                                <input
                                    type="password"
                                    placeholder="abcdef1234567890..."
                                    value={waForm.appSecret}
                                    onChange={(e) => setWaForm({ ...waForm, appSecret: e.target.value })}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 focus:border-[var(--color-brand-accent)] outline-none"
                                />
                                <p className="text-[8px] text-zinc-500 italic">App Secret for additional security (optional)</p>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                            <Button
                                onClick={handleSaveWhatsAppConfig}
                                isLoading={isValidating}
                                disabled={!waForm.accessToken || !waForm.businessId || !waForm.phoneId}
                                leftIcon={<Save size={18} />}
                            >
                                {isValidating ? 'Saving...' : 'Save WhatsApp Configuration'}
                            </Button>
                        </div>

                        {/* Success Message */}
                        {saveSuccess && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <CheckCircle size={16} className="text-emerald-500" />
                                <p className="text-[10px] text-emerald-500 font-medium">{saveSuccess}</p>
                            </div>
                        )}
                    </div>

                    {/* STEP 3: PMS CONNECTION */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-xs italic">3</div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/60">PMS Connection</h3>
                        </div>

                        {/* Configuration Status Indicator */}
                        {pmsConfig.apiBaseUrl && (
                            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={20} className="text-emerald-500" />
                                    <div>
                                        <p className="text-sm font-bold text-white">PMS Configuration Saved</p>
                                        <p className="text-xs text-zinc-400">
                                            Provider: {pmsConfig.pmsProvider.toUpperCase()} • Update anytime
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Card variant="dark" padding="none" className="overflow-hidden border-white/5 bg-gradient-to-br from-zinc-900 via-black to-black">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <Zap className="text-[var(--color-brand-accent)]" size={16} />
                                    <span className="text-xs font-black uppercase tracking-widest text-white">PMS Configuration</span>
                                </div>
                                <span className="text-[9px] px-3 py-1 bg-white/5 border border-white/10 rounded text-white/40 font-black uppercase tracking-widest">Encrypted</span>
                            </div>
                            <div className="p-8 space-y-6">
                                {/* PMS Provider Selection */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">
                                        PMS Provider *
                                    </label>
                                    <select
                                        value={pmsConfig.pmsProvider}
                                        onChange={(e) => setPmsConfig({ ...pmsConfig, pmsProvider: e.target.value })}
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-white/80 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="mews">Mews</option>
                                        <option value="opera">Oracle Opera</option>
                                        <option value="cloudbeds">Cloudbeds</option>
                                        <option value="little_hotelier">Little Hotelier</option>
                                        <option value="protel">Protel</option>
                                        <option value="rms">RMS / Booking Automation</option>
                                        <option value="custom">Custom / Other</option>
                                    </select>
                                </div>

                                {/* API Base URL */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">API Base URL *</label>
                                    <input
                                        type="text"
                                        placeholder="https://api.mews.com/v1"
                                        value={pmsConfig.apiBaseUrl}
                                        onChange={(e) => setPmsConfig({ ...pmsConfig, apiBaseUrl: e.target.value })}
                                        className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 focus:border-[var(--color-brand-accent)] outline-none"
                                    />
                                </div>

                                {/* Authentication Type */}
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">
                                        Authentication Type *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { value: 'api_key', label: 'API Key' },
                                            { value: 'basic', label: 'Username + Password' },
                                            { value: 'oauth2', label: 'OAuth2 (Client ID + Secret)' },
                                            { value: 'bearer', label: 'Bearer Token' }
                                        ].map((type) => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setPmsConfig({ ...pmsConfig, authType: type.value })}
                                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                                                    pmsConfig.authType === type.value
                                                        ? 'bg-[var(--color-brand-accent)] text-black'
                                                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                                                }`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Dynamic Credential Fields Based on authType */}
                                {pmsConfig.authType === 'basic' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">API Username *</label>
                                            <input
                                                type="text"
                                                value={pmsConfig.apiUsername}
                                                onChange={(e) => setPmsConfig({ ...pmsConfig, apiUsername: e.target.value })}
                                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 focus:border-[var(--color-brand-accent)] outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">API Password *</label>
                                            <input
                                                type="password"
                                                value={pmsConfig.apiPassword}
                                                onChange={(e) => setPmsConfig({ ...pmsConfig, apiPassword: e.target.value })}
                                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 focus:border-[var(--color-brand-accent)] outline-none"
                                            />
                                        </div>
                                    </>
                                )}

                                {pmsConfig.authType === 'api_key' && (
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">API Key *</label>
                                        <input
                                            type="password"
                                            placeholder="sk_live_abc123xyz789"
                                            value={pmsConfig.apiKey}
                                            onChange={(e) => setPmsConfig({ ...pmsConfig, apiKey: e.target.value })}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 focus:border-[var(--color-brand-accent)] outline-none"
                                        />
                                    </div>
                                )}

                                {pmsConfig.authType === 'oauth2' && (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">Client ID *</label>
                                            <input
                                                type="text"
                                                value={pmsConfig.clientId}
                                                onChange={(e) => setPmsConfig({ ...pmsConfig, clientId: e.target.value })}
                                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 focus:border-[var(--color-brand-accent)] outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">Client Secret *</label>
                                            <input
                                                type="password"
                                                value={pmsConfig.clientSecret}
                                                onChange={(e) => setPmsConfig({ ...pmsConfig, clientSecret: e.target.value })}
                                                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 focus:border-[var(--color-brand-accent)] outline-none"
                                            />
                                        </div>
                                    </>
                                )}

                                {pmsConfig.authType === 'bearer' && (
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 italic">Bearer Token *</label>
                                        <input
                                            type="password"
                                            value={pmsConfig.bearerToken}
                                            onChange={(e) => setPmsConfig({ ...pmsConfig, bearerToken: e.target.value })}
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-white/80 focus:border-[var(--color-brand-accent)] outline-none"
                                        />
                                    </div>
                                )}

                                {/* Save PMS Config Button */}
                                <div className="flex justify-end pt-4">
                                    <Button
                                        onClick={handleSavePMSConfig}
                                        isLoading={isSavingPMS}
                                        leftIcon={<Save size={18} />}
                                    >
                                        {isSavingPMS ? 'Saving...' : 'Save PMS Configuration'}
                                    </Button>
                                </div>
                            </div>
                        </Card>

                        {/* Hotels List Section */}
                        <div className="mt-12 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
                                        Hotels / Properties
                                    </h4>
                                    <p className="text-[10px] text-white/30 mt-1">
                                        Add all hotels that use this PMS configuration
                                    </p>
                                </div>
                                <Button
                                    onClick={() => {
                                        setEditingHotel({ hotelName: '', hotelIdInPms: '', propertyCode: '', isActive: true });
                                        setShowAddHotelModal(true);
                                    }}
                                    variant="secondary"
                                    size="sm"
                                    leftIcon={<Plus size={14} />}
                                >
                                    Add Hotel
                                </Button>
                            </div>

                            {/* Hotels List */}
                            {hotels.length === 0 ? (
                                <div className="p-8 bg-white/[0.02] border border-dashed border-white/10 rounded-xl text-center">
                                    <Database size={32} className="mx-auto text-white/20 mb-3" />
                                    <p className="text-sm text-white/40">No hotels added yet</p>
                                    <p className="text-xs text-white/30 mt-1">Add your first hotel to start syncing data</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {hotels.map((hotel, idx) => (
                                        <div
                                            key={hotel.id || idx}
                                            className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/8 transition-all"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${hotel.isActive ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{hotel.hotelName}</p>
                                                        <p className="text-xs text-white/40">ID: {hotel.hotelIdInPms}</p>
                                                        {hotel.propertyCode && (
                                                            <p className="text-xs text-white/30">Code: {hotel.propertyCode}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditingHotel(hotel);
                                                            setShowAddHotelModal(true);
                                                        }}
                                                        className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 rounded-lg transition-all"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteHotel(hotel.id)}
                                                        className="px-3 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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
                                { name: 'Property Assets Matrix', type: 'CSV Reference', icon: Database }
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

        return (
            <div className="w-full animate-fade-in space-y-10 pb-20">
                {/* Header Section */}
                <div className="border-b border-white/10 pb-8">
                    <h2 className="text-3xl font-light text-white mb-2">Pricing & Billing</h2>
                    <p className="text-zinc-500 text-sm">Governance engine resource allocation and ledger.</p>
                </div>

                {/* 2 CARDS GRID - Manual Payments Only */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">

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

                    {/* 2. BUY CREDITS - Manual Purchase */}
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
                            <Button onClick={handleSaveBillingModal}>Save Details</Button>
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

            {/* Add/Edit Hotel Modal */}
            <Modal
                isOpen={showAddHotelModal}
                onClose={() => {
                    setShowAddHotelModal(false);
                    setEditingHotel(null);
                }}
                title={editingHotel?.id ? 'Edit Hotel' : 'Add New Hotel'}
            >
                <div className="p-6 space-y-5">
                    <FloatingInput
                        label="Hotel Name *"
                        placeholder="Hotel Roma Centro"
                        value={editingHotel?.hotelName || ''}
                        onChange={(e) => setEditingHotel({ ...editingHotel, hotelName: e.target.value })}
                        className="text-black"
                    />
                    
                    <FloatingInput
                        label="Hotel ID in PMS *"
                        placeholder="HTL_001"
                        value={editingHotel?.hotelIdInPms || ''}
                        onChange={(e) => setEditingHotel({ ...editingHotel, hotelIdInPms: e.target.value })}
                        className="text-black"
                    />
                    
                    <FloatingInput
                        label="Property Code (Optional)"
                        placeholder="ROMA001"
                        value={editingHotel?.propertyCode || ''}
                        onChange={(e) => setEditingHotel({ ...editingHotel, propertyCode: e.target.value })}
                        className="text-black"
                    />

                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            checked={editingHotel?.isActive ?? true}
                            onChange={(e) => setEditingHotel({ ...editingHotel, isActive: e.target.checked })}
                            className="w-4 h-4 bg-white/5 border border-white/10 rounded cursor-pointer"
                        />
                        <label className="text-sm text-black/80">Active (enable sync)</label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowAddHotelModal(false);
                                setEditingHotel(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveHotel}>
                            {editingHotel?.id ? 'Update Hotel' : 'Add Hotel'}
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Change Password Modal - Root Level */}
            <Modal
                isOpen={showPasswordModal}
                onClose={() => {
                    console.log('[Settings] Closing password modal');
                    setShowPasswordModal(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setValidationError(null);
                }}
                title="Change Password"
            >
                <div className="p-6 space-y-5">
                    <p className="text-sm text-zinc-400">
                        Enter your current password and choose a new one.
                    </p>

                    <FloatingInput
                        label="Current Password"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    />

                    <FloatingInput
                        label="New Password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    />

                    <FloatingInput
                        label="Confirm New Password"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    />

                    {validationError && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                            {validationError}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setShowPasswordModal(false);
                                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                setValidationError(null);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleChangePassword}
                            isLoading={changingPassword}
                            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                        >
                            {changingPassword ? 'Changing...' : 'Change Password'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

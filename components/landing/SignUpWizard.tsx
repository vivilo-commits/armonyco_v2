import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, CheckCircle, Loader, AlertTriangle } from '../ui/Icons';
import { FloatingInput } from '../ui/FloatingInput';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { ProgressBar } from '../ui/ProgressBar';
import { PasswordStrengthMeter } from '../ui/PasswordStrengthMeter';
import { VATVerifier } from '../ui/VATVerifier';
import { ExitIntentModal } from '../ui/ExitIntentModal';
import { TermsModal } from './TermsModal';
import { PlanCard, Plan } from './PlanCard';
import { ITALIAN_PROVINCES } from '../../src/data/italian-provinces';
import { 
    validateStep1, 
    validateStep2
} from '../../src/services/validation.service';
import { 
    saveRegistrationDraft, 
    getRegistrationDraft, 
    clearRegistrationDraft,
    completeRegistration
} from '../../src/services/registration.service';
import { 
    initiatePayment, 
    calculatePriceBreakdown,
    formatEuro 
} from '../../src/services/payment.service';

interface SignUpWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onContact: () => void;
    onComplete: (data: any) => void;
}

const STEPS = [
    'Account Base',
    'Business Details',
    'Plan Selection',
    'Payment',
    'Confirmation'
];

const PLANS: Plan[] = [
    {
        id: 1,
        name: 'STARTER',
        credits: 25000,
        tokens: 2500000, // 25,000 credits × 100
        price: 249,
        features: [
            '2.5M tokens per month',
            'Tokens accumulate',
            'Dashboard analytics',
            'Email support',
            'Complete documentation'
        ],
    },
    {
        id: 2,
        name: 'PRO',
        credits: 100000,
        tokens: 10000000, // 100,000 credits × 100
        price: 999,
        badge: '🔥 Most Popular',
        features: [
            '10M tokens per month',
            'Tokens accumulate',
            'Advanced dashboard',
            'Priority support',
            'API access',
            'Custom reports'
        ],
    },
    {
        id: 3,
        name: 'ELITE',
        credits: 250000,
        tokens: 25000000, // 250,000 credits × 100
        price: 2499,
        features: [
            '25M tokens per month',
            'Tokens accumulate',
            'Enterprise dashboard',
            '24/7 dedicated support',
            'Unlimited API',
            'White label',
            'Guaranteed SLA'
        ],
    },
    {
        id: 4,
        name: 'VIP',
        credits: 0,
        price: 0,
        isCustom: true,
        features: [
            'Unlimited tokens',
            'Institutional project',
            'Dedicated account manager',
            'Complete customization',
            'Enterprise contract'
        ],
    },
];

export const SignUpWizard: React.FC<SignUpWizardProps> = ({ 
    isOpen, 
    onClose, 
    onContact, 
    onComplete 
}) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showTerms, setShowTerms] = useState(false);
    const [showExitIntent, setShowExitIntent] = useState(false);

    // Step 1: Account Base
    const [formData, setFormData] = useState({
        // Step 1
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        acceptTerms: false,

        // Step 2
        businessName: '',
        vatNumber: '',
        fiscalCode: '',
        address: '',
        civicNumber: '',
        cap: '',
        city: '',
        province: '',
        country: 'Italia',
        phone: '',
        sdiCode: '',
        pecEmail: '',

        // Step 3
        planId: 0,
        planName: '',
        planPrice: 0,
        planCredits: 0,
    });

    // Load draft on mount
    useEffect(() => {
        if (isOpen) {
            const draft = getRegistrationDraft();
            if (draft) {
                setFormData(prev => ({ ...prev, ...draft.data }));
                // Don't restore step automatically for security
                console.log('[SignUp] Draft recovered from localStorage');
            }
        }
    }, [isOpen]);

    // Auto-save draft (debounced)
    useEffect(() => {
        if (!isOpen || step === 5) return; // Don't save in final step

        const timeoutId = setTimeout(() => {
            if (step > 1) {
                saveRegistrationDraft(step, formData);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [formData, step, isOpen]);

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Remove field error when user modifies it
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    // Validazione step corrente
    const validateCurrentStep = (): boolean => {
        setErrors({});

        if (step === 1) {
            const result = validateStep1(formData);
            if (!result.valid) {
                setErrors(result.errors);
                return false;
            }
        }

        if (step === 2) {
            const result = validateStep2(formData);
            if (!result.valid) {
                setErrors(result.errors);
                return false;
            }
        }

        if (step === 3) {
            if (!formData.planId) {
                setErrors({ plan: 'Select a plan to continue' });
                return false;
            }
        }

        return true;
    };

    const nextStep = () => {
        console.log('[SignUp] Validating step', step, 'Form data:', formData);
        const isValid = validateCurrentStep();
        console.log('[SignUp] Validation result:', isValid, 'Errors:', errors);
        
        if (isValid) {
            console.log('[SignUp] Moving to step', step + 1);
            setStep(step + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            console.log('[SignUp] ❌ Validation FAILED. Errors:', errors);
            // Scroll to first error
            const firstErrorElement = document.querySelector('[class*="text-red"]');
            if (firstErrorElement) {
                firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    const prevStep = () => {
        setStep(step - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const goToStep = (targetStep: number) => {
        if (targetStep < step) {
            setStep(targetStep);
        }
    };

    const handleClose = () => {
        if (step > 1 && step < 4) {
            setShowExitIntent(true);
        } else {
            onClose();
        }
    };

    const handleSaveAndExit = () => {
        saveRegistrationDraft(step, formData);
        setShowExitIntent(false);
        onClose();
    };

    const handleExitWithoutSaving = () => {
        clearRegistrationDraft();
        setShowExitIntent(false);
        onClose();
    };

    // Step 3: Selezione piano
    const handleSelectPlan = (plan: Plan) => {
        if (plan.isCustom) {
            onContact();
            return;
        }

        updateField('planId', plan.id);
        updateField('planName', plan.name);
        updateField('planPrice', plan.price);
        updateField('planCredits', plan.credits);
    };

    // Step 4: Payment
    const handlePayment = async () => {
        if (!validateCurrentStep()) return;

        // Verifica che Stripe sia configurato
        if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
            setErrors({ 
                payment: 'Stripe non è configurato. Configura VITE_STRIPE_PUBLIC_KEY nel file .env.local' 
            });
            return;
        }

        setIsSubmitting(true);
        setErrors({}); // Clear previous errors

        try {
            console.log('[SignUp] Starting Stripe payment flow...');
            console.log('[SignUp] Plan:', formData.planName, 'Credits:', formData.planCredits);
            
            // Save ALL registration data to localStorage BEFORE redirect
            const pendingRegistration = {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                businessName: formData.businessName,
                vatNumber: formData.vatNumber,
                fiscalCode: formData.fiscalCode,
                address: formData.address,
                civicNumber: formData.civicNumber,
                cap: formData.cap,
                city: formData.city,
                province: formData.province,
                country: formData.country,
                phone: formData.phone,
                sdiCode: formData.sdiCode,
                pecEmail: formData.pecEmail,
                planId: formData.planId,
                planName: formData.planName,
                planPrice: formData.planPrice,
                planCredits: formData.planCredits,
                timestamp: Date.now(),
            };
            
            localStorage.setItem('pending_registration', JSON.stringify(pendingRegistration));
            console.log('[SignUp] Registration data saved to localStorage');
            
            // Payment reale con Stripe
            await initiatePayment({
                planId: formData.planId,
                planName: formData.planName,
                amount: Math.round(formData.planPrice * 1.22 * 100),
                credits: formData.planCredits,
                email: formData.email,
                userId: undefined, // Verrà aggiunto dopo la registrazione
                metadata: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    businessName: formData.businessName,
                    vatNumber: formData.vatNumber,
                },
            });
            
            // Se initiatePayment non lancia errori, il redirect è in corso
            // Non impostare isSubmitting a false perché l'utente verrà reindirizzato
            console.log('[SignUp] Redirecting to Stripe Checkout...');
        } catch (error: any) {
            console.error('[SignUp] ❌ Payment error:', error);
            console.error('[SignUp] Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name,
            });
            
            setErrors({ 
                payment: error.message || 'Error during payment. Check Stripe configuration.' 
            });
            setIsSubmitting(false);
        }
    };

    // NOTE: Registration completion is now handled ONLY in PaymentSuccess.tsx
    // after Stripe payment verification. This prevents premature signup calls.
    // The wizard only saves data to localStorage and redirects to Stripe.

    const priceBreakdown = formData.planPrice ? calculatePriceBreakdown(formData.planPrice) : null;

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                title={null}
                width="full"
                showCloseButton={step < 5}
            >
                <div className="flex flex-col h-auto max-h-[90vh] md:max-h-none">
                    {/* Progress Bar */}
                    {step < 5 && (
                        <div className="px-6 py-5 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                            <ProgressBar
                                currentStep={step}
                                totalSteps={5}
                                stepTitles={STEPS}
                            />
                        </div>
                    )}

                    {/* Error Banner */}
                    {errors.general && (
                        <div className="mx-6 mt-4 p-4 bg-red-500/20 border-2 border-red-500/50 rounded-lg text-red-400 text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <AlertTriangle size={20} className="flex-shrink-0 text-red-400" />
                            <div className="flex-1">
                                <p className="font-semibold text-red-300 mb-1">Registration error</p>
                                <p>{errors.general}</p>
                            </div>
                        </div>
                    )}

                    {/* Body */}
                    <div className="p-6 md:p-8 overflow-y-auto flex-1">
                        {/* Logo */}
                        {step < 5 && (
                            <div className="flex justify-center mb-8">
                                <img src="/assets/logo-full.png" alt="Armonyco" className="h-12 object-contain" />
                            </div>
                        )}

                        {/* STEP 1: Account Base */}
                        {step === 1 && (
                            <div className="max-w-2xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-[var(--color-text-main)]">Create your Account</h2>
                                    <p className="text-sm text-[var(--color-text-muted)] mt-2">
                                        Start by entering your personal information
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FloatingInput
                                        label="First Name *"
                                        value={formData.firstName}
                                        onChange={e => updateField('firstName', e.target.value)}
                                        error={errors.firstName}
                                    />
                                    <FloatingInput
                                        label="Last Name *"
                                        value={formData.lastName}
                                        onChange={e => updateField('lastName', e.target.value)}
                                        error={errors.lastName}
                                    />
                                </div>

                                <FloatingInput
                                    label="Email *"
                                    type="email"
                                    value={formData.email}
                                    onChange={e => updateField('email', e.target.value)}
                                    error={errors.email}
                                    placeholder="name@example.com"
                                />

                                <div>
                                    <FloatingInput
                                        label="Password *"
                                        type="password"
                                        value={formData.password}
                                        onChange={e => updateField('password', e.target.value)}
                                        error={errors.password}
                                    />
                                    {formData.password && (
                                        <div className="mt-3">
                                            <PasswordStrengthMeter password={formData.password} />
                                        </div>
                                    )}
                                </div>

                                <FloatingInput
                                    label="Confirm Password *"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={e => updateField('confirmPassword', e.target.value)}
                                    error={errors.confirmPassword}
                                />

                                <div className="pt-4">
                                    <label className="flex items-start gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={formData.acceptTerms}
                                            onChange={e => updateField('acceptTerms', e.target.checked)}
                                            className="mt-1 w-5 h-5 rounded border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-brand-accent)] focus:ring-2 focus:ring-[var(--color-brand-accent)]"
                                        />
                                        <span className="text-sm text-[var(--color-text-main)] group-hover:text-[var(--color-text-main)]">
                                            I accept the{' '}
                                            <button
                                                type="button"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setShowTerms(true);
                                                }}
                                                className="text-[var(--color-brand-accent)] underline hover:no-underline"
                                            >
                                                Terms and Conditions
                                            </button>
                                            {' '}and the Privacy Policy *
                                        </span>
                                    </label>
                                    {errors.acceptTerms && (
                                        <p className="text-xs text-red-400 mt-2">{errors.acceptTerms}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Business Details */}
                        {step === 2 && (
                            <div className="max-w-2xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-[var(--color-text-main)]">Business Details</h2>
                                    <p className="text-sm text-[var(--color-text-muted)] mt-2">
                                        Information required for billing
                                    </p>
                                </div>

                                <FloatingInput
                                    label="Business Name *"
                                    value={formData.businessName}
                                    onChange={e => updateField('businessName', e.target.value)}
                                    error={errors.businessName}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <FloatingInput
                                            label="VAT Number *"
                                            value={formData.vatNumber}
                                            onChange={e => updateField('vatNumber', e.target.value)}
                                            error={errors.vatNumber}
                                            placeholder="12345678901"
                                        />
                                        <VATVerifier
                                            vatNumber={formData.vatNumber}
                                            countryCode="IT"
                                            onVerified={(companyName) => {
                                                if (companyName && !formData.businessName) {
                                                    updateField('businessName', companyName);
                                                }
                                            }}
                                            className="mt-3"
                                        />
                                    </div>

                                    <FloatingInput
                                        label={t('signup.fiscalCode')}
                                        value={formData.fiscalCode}
                                        onChange={e => updateField('fiscalCode', e.target.value)}
                                        error={errors.fiscalCode}
                                        placeholder={t('signup.fiscalCodePlaceholder')}
                                    />
                                </div>

                                <FloatingInput
                                    label={t('signup.businessPhone')}
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => updateField('phone', e.target.value)}
                                    error={errors.phone}
                                    placeholder="+39 333 123 4567"
                                />

                                <div className="pt-4 border-t border-[var(--color-border)]">
                                    <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-4">
                                        {t('signup.legalAddress')}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <FloatingInput
                                                label={t('signup.streetSquare')}
                                                value={formData.address}
                                                onChange={e => updateField('address', e.target.value)}
                                                error={errors.address}
                                            />
                                        </div>
                                        <FloatingInput
                                            label={t('signup.streetNumber')}
                                            value={formData.civicNumber}
                                            onChange={e => updateField('civicNumber', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                        <FloatingInput
                                            label={t('signup.postalCode')}
                                            value={formData.cap}
                                            onChange={e => updateField('cap', e.target.value)}
                                            error={errors.cap}
                                            placeholder="00100"
                                        />
                                        <FloatingInput
                                            label={t('signup.city')}
                                            value={formData.city}
                                            onChange={e => updateField('city', e.target.value)}
                                            error={errors.city}
                                        />
                                        <div>
                                            <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-muted)] block mb-2">
                                                {t('signup.province')}
                                            </label>
                                            <select
                                                value={formData.province}
                                                onChange={e => updateField('province', e.target.value)}
                                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-3 text-sm focus:border-[var(--color-brand-accent)] outline-none"
                                            >
                                                <option value="">{t('signup.selectProvince')}</option>
                                                {ITALIAN_PROVINCES.map(prov => (
                                                    <option key={prov.code} value={prov.code}>
                                                        {prov.name} ({prov.code})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <FloatingInput
                                            label={t('signup.country')}
                                            value={formData.country}
                                            onChange={e => updateField('country', e.target.value)}
                                            error={errors.country}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[var(--color-border)]">
                                    <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-2">
                                        {t('signup.electronicInvoicing')}
                                    </h3>
                                    <p className="text-xs text-[var(--color-text-muted)] mb-4">
                                        {t('signup.electronicInvoicingDescription')}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FloatingInput
                                            label={t('signup.sdiCodeOptional')}
                                            value={formData.sdiCode}
                                            onChange={e => updateField('sdiCode', e.target.value)}
                                            placeholder={t('signup.sdiCodePlaceholder')}
                                        />
                                        <FloatingInput
                                            label="PEC (opzionale)"
                                            type="email"
                                            value={formData.pecEmail}
                                            onChange={e => updateField('pecEmail', e.target.value)}
                                            placeholder="company@pec.it"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* STEP 3: Selezione Piano */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in duration-300">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-[var(--color-text-main)]">
                                        Choose Your Plan
                                    </h2>
                                    <p className="text-sm text-[var(--color-text-muted)] mt-2">
                                        Select the plan that best suits your needs
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                                    {PLANS.map(plan => (
                                        <PlanCard
                                            key={plan.id}
                                            plan={plan}
                                            selected={formData.planId === plan.id}
                                            onSelect={() => handleSelectPlan(plan)}
                                        />
                                    ))}
                                </div>

                                {errors.plan && (
                                    <p className="text-center text-sm text-red-400 mt-4">{errors.plan}</p>
                                )}

                                {priceBreakdown && formData.planId > 0 && (
                                    <div className="max-w-md mx-auto mt-8 p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
                                        <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">
                                            Cost Summary
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-[var(--color-text-muted)]">Subtotal:</span>
                                                <span className="font-medium">{formatEuro(priceBreakdown.subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[var(--color-text-muted)]">VAT 22%:</span>
                                                <span className="font-medium">{formatEuro(priceBreakdown.taxAmount)}</span>
                                            </div>
                                            <div className="flex justify-between pt-3 border-t border-[var(--color-border)] text-lg font-bold">
                                                <span>Total:</span>
                                                <span className="text-[var(--color-brand-accent)]">
                                                    {formatEuro(priceBreakdown.total)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <p className="text-center text-xs text-[var(--color-text-muted)] italic mt-6">
                                    Monthly subscription with automatic billing. Tokens accumulate every month and do not expire.
                                </p>
                            </div>
                        )}

                        {/* STEP 4: Payment */}
                        {step === 4 && priceBreakdown && (
                            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-[var(--color-text-main)]">
                                        Confirmation and Payment
                                    </h2>
                                    <p className="text-sm text-[var(--color-text-muted)] mt-2">
                                        Verify the details and proceed to payment
                                    </p>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-[var(--color-brand-accent)]/10 border-2 border-[var(--color-brand-accent)] rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-4">
                                        📋 Order Summary
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-[var(--color-text-main)]">
                                                    Plan {formData.planName}
                                                </p>
                                                <p className="text-xs text-[var(--color-brand-accent)]">
                                                    ⚡ {(formData.planCredits * 100).toLocaleString('en-US')} tokens/month
                                                </p>
                                                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                                                    Tokens accumulate monthly
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => goToStep(3)}
                                                className="text-xs text-[var(--color-brand-accent)] underline hover:no-underline"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                        <div className="border-t border-[var(--color-border)] pt-3 space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-[var(--color-text-muted)]">Subtotal:</span>
                                                <span className="font-medium">{formatEuro(priceBreakdown.subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[var(--color-text-muted)]">VAT 22%:</span>
                                                <span className="font-medium">{formatEuro(priceBreakdown.taxAmount)}</span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-[var(--color-border)] text-xl font-bold">
                                                <span>Total/Month:</span>
                                                <span className="text-[var(--color-brand-accent)]">
                                                    {formatEuro(priceBreakdown.total)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tax Details */}
                                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-[var(--color-text-main)]">
                                            🏢 Billing Information
                                        </h3>
                                        <button
                                            onClick={() => goToStep(2)}
                                            className="text-xs text-[var(--color-brand-accent)] underline hover:no-underline"
                                        >
                                            Edit
                                        </button>
                                    </div>
                                    <div className="text-sm space-y-1 text-[var(--color-text-muted)]">
                                        <p><strong className="text-[var(--color-text-main)]">{formData.businessName}</strong></p>
                                        <p>VAT: {formData.vatNumber}</p>
                                        <p>{formData.address} {formData.civicNumber}</p>
                                        <p>{formData.cap} {formData.city} ({formData.province})</p>
                                        {formData.sdiCode && <p>SDI: {formData.sdiCode}</p>}
                                        {formData.pecEmail && <p>PEC: {formData.pecEmail}</p>}
                                    </div>
                                </div>

                                {/* Payment information */}
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                    <h3 className="text-sm font-bold text-blue-400 mb-3">ℹ️ Subscription Information</h3>
                                    <ul className="text-xs text-[var(--color-text-muted)] space-y-2">
                                        <li>• Secure payment handled by Stripe</li>
                                        <li>• Tokens are credited immediately and accumulate every month</li>
                                        <li>• Monthly automatic billing</li>
                                        <li>• You will receive the invoice via email within 24 hours</li>
                                        <li>• You can cancel the subscription at any time</li>
                                        <li>• You can use credit/debit cards or SEPA bank transfer</li>
                                    </ul>
                                </div>

                                {errors.payment && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center text-red-400 text-sm">
                                        {errors.payment}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 5: Success Confirmation */}
                        {step === 5 && (
                            <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in duration-500 py-8">
                                <div className="w-24 h-24 mx-auto bg-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                                    <CheckCircle size={64} className="text-white" />
                                </div>

                                <div>
                                    <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-3">
                                        Welcome to Armonyco! 🎉
                                    </h2>
                                    <p className="text-lg text-[var(--color-text-muted)]">
                                        Your account has been successfully created
                                    </p>
                                </div>

                                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 text-left space-y-4">
                                    <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider text-center mb-6">
                                        Account Summary
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-text-muted)]">Email:</span>
                                            <span className="font-medium text-[var(--color-text-main)]">{formData.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-text-muted)]">Plan:</span>
                                            <span className="font-medium text-[var(--color-text-main)]">{formData.planName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-text-muted)]">Credits:</span>
                                            <span className="font-bold text-[var(--color-brand-accent)]">
                                                {formData.planCredits.toLocaleString('en-US')} ArmoCredits©
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-text-muted)]">Activation date:</span>
                                            <span className="font-medium text-[var(--color-text-main)]">
                                                {new Date().toLocaleDateString('en-US')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                    <p className="text-sm text-[var(--color-text-muted)]">
                                        📧 We have sent a confirmation email with all the details to{' '}
                                        <strong className="text-[var(--color-text-main)]">{formData.email}</strong>
                                    </p>
                                </div>

                                <div className="pt-6">
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            clearRegistrationDraft();
                                            window.location.href = '/app/dashboard';
                                        }}
                                        className="w-full md:w-auto px-12"
                                    >
                                        Go to Dashboard →
                                    </Button>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-4">
                                        You will be redirected automatically in a few seconds...
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Navigation */}
                    {step < 5 && (
                        <div className="px-6 md:px-8 py-5 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex justify-between items-center shrink-0 rounded-b-xl">
                            {step > 1 ? (
                                <Button
                                    variant="secondary"
                                    leftIcon={<ChevronLeft size={18} />}
                                    onClick={prevStep}
                                    disabled={isSubmitting}
                                >
                                    Back
                                </Button>
                            ) : (
                                <div></div>
                            )}

                            {step < 4 ? (
                                <Button
                                    variant="primary"
                                    rightIcon={<ChevronRight size={18} />}
                                    onClick={nextStep}
                                    disabled={isSubmitting}
                                >
                                    Continue
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    rightIcon={isSubmitting ? <Loader size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                    onClick={handlePayment}
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                >
                                    {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Modal>

            {/* Modals */}
            <TermsModal
                isOpen={showTerms}
                onClose={() => setShowTerms(false)}
                onAccept={() => updateField('acceptTerms', true)}
            />

            <ExitIntentModal
                isEnabled={step > 1 && step < 4 && isOpen}
                onSaveAndExit={handleSaveAndExit}
                onContinue={() => setShowExitIntent(false)}
                onExitWithoutSaving={handleExitWithoutSaving}
            />
        </>
    );
};

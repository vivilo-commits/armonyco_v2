import React, { useState, useEffect, useCallback } from 'react';
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
    'Dati Aziendali',
    'Selezione Piano',
    'Pagamento',
    'Conferma'
];

const PLANS: Plan[] = [
    {
        id: 1,
        name: 'STARTER',
        credits: 25000,
        tokens: 2500000, // 25,000 credits × 100
        price: 249,
        features: [
            '2,5M tokens al mese',
            'I tokens si accumulano',
            'Dashboard analytics',
            'Email support',
            'Documentazione completa'
        ],
    },
    {
        id: 2,
        name: 'PRO',
        credits: 100000,
        tokens: 10000000, // 100,000 credits × 100
        price: 999,
        badge: '🔥 Più Popolare',
        features: [
            '10M tokens al mese',
            'I tokens si accumulano',
            'Dashboard avanzata',
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
            '25M tokens al mese',
            'I tokens si accumulano',
            'Dashboard enterprise',
            '24/7 support dedicato',
            'API illimitata',
            'White label',
            'SLA garantito'
        ],
    },
    {
        id: 4,
        name: 'VIP',
        credits: 0,
        price: 0,
        isCustom: true,
        features: [
            'Tokens illimitati',
            'Progetto istituzionale',
            'Account manager dedicato',
            'Customizzazione completa',
            'Contratto enterprise'
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

    // Carica draft al mount
    useEffect(() => {
        if (isOpen) {
            const draft = getRegistrationDraft();
            if (draft) {
                setFormData(prev => ({ ...prev, ...draft.data }));
                // Non ripristinare lo step automaticamente per sicurezza
                console.log('[SignUp] Draft recuperato dal localStorage');
            }
        }
    }, [isOpen]);

    // Auto-save draft (debounced)
    useEffect(() => {
        if (!isOpen || step === 5) return; // Non salvare nello step finale

        const timeoutId = setTimeout(() => {
            if (step > 1) {
                saveRegistrationDraft(step, formData);
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [formData, step, isOpen]);

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Rimuovi errore del campo quando l'utente modifica
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
                setErrors({ plan: 'Seleziona un piano per continuare' });
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
            // Scroll al primo errore
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

    // Step 4: Pagamento
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
                payment: error.message || 'Errore durante il pagamento. Verifica la configurazione di Stripe.' 
            });
            setIsSubmitting(false);
        }
    };

    // Handle Stripe redirect return
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        
        // Handle Stripe redirect return
        if (sessionId && isOpen) {
            // Stripe payment completed
            handleCompleteRegistration();
        }
    }, [isOpen]);

    const handleCompleteRegistration = async () => {
        console.log('[SignUp] Starting registration completion...');
        setIsSubmitting(true);
        setErrors({}); // Clear previous errors

        try {
            const result = await completeRegistration({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                businessName: formData.businessName,
                vatNumber: formData.vatNumber,
                fiscalCode: formData.fiscalCode,
                phone: formData.phone,
                address: formData.address,
                civicNumber: formData.civicNumber,
                cap: formData.cap,
                city: formData.city,
                province: formData.province,
                country: formData.country,
                sdiCode: formData.sdiCode,
                pecEmail: formData.pecEmail,
                planId: formData.planId,
                planCredits: formData.planCredits,
            });

            if (result.success) {
                console.log('[SignUp] Registration completed successfully!');
                setStep(5); // Go to confirmation step
                setIsSubmitting(false);
                
                // Callback after 3 seconds
                setTimeout(() => {
                    onComplete({
                        userId: result.userId,
                        email: formData.email,
                        plan: formData.planName,
                        credits: formData.planCredits,
                    });
                }, 3000);
            } else {
                console.error('[SignUp] Registration failed:', result.error);
                const errorMessage = result.error || 'Errore durante la registrazione';
                
                // Se l'email è già registrata, torna allo step 1 e mostra l'errore nel campo email
                if (errorMessage.includes('Email già registrata') || errorMessage.includes('already registered')) {
                    setStep(1);
                    setErrors({ 
                        email: 'Questa email è già registrata. Prova a fare login invece.',
                        general: 'Questa email è già registrata. Prova a fare login invece.'
                    });
                    // Scroll al campo email dopo un breve delay per permettere il render
                    setTimeout(() => {
                        const emailInput = document.querySelector('input[type="email"]');
                        if (emailInput) {
                            emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            (emailInput as HTMLInputElement).focus();
                        }
                    }, 100);
                } else {
                    // Per altri errori, mostra nel banner generale
                    setErrors({ general: errorMessage });
                    // Scroll al banner di errore
                    setTimeout(() => {
                        const errorBanner = document.querySelector('[class*="bg-red-500"]');
                        if (errorBanner) {
                            errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 100);
                }
                setIsSubmitting(false);
            }
        } catch (error: any) {
            console.error('[SignUp] Registration exception:', error);
            const errorMessage = error.message || 'Errore durante la registrazione';
            
            // Se l'email è già registrata, torna allo step 1 e mostra l'errore nel campo email
            if (errorMessage.includes('Email già registrata') || errorMessage.includes('already registered')) {
                setStep(1);
                setErrors({ 
                    email: 'Questa email è già registrata. Prova a fare login invece.',
                    general: 'Questa email è già registrata. Prova a fare login invece.'
                });
                // Scroll al campo email dopo un breve delay per permettere il render
                setTimeout(() => {
                    const emailInput = document.querySelector('input[type="email"]');
                    if (emailInput) {
                        emailInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        (emailInput as HTMLInputElement).focus();
                    }
                }, 100);
            } else {
                // Per altri errori, mostra nel banner generale
                setErrors({ general: errorMessage });
                // Scroll al banner di errore
                setTimeout(() => {
                    const errorBanner = document.querySelector('[class*="bg-red-500"]');
                    if (errorBanner) {
                        errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
            setIsSubmitting(false);
        }
    };

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
                                <p className="font-semibold text-red-300 mb-1">Errore di registrazione</p>
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
                                    <h2 className="text-2xl font-bold text-[var(--color-text-main)]">Crea il tuo Account</h2>
                                    <p className="text-sm text-[var(--color-text-muted)] mt-2">
                                        Inizia inserendo i tuoi dati personali
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FloatingInput
                                        label="Nome *"
                                        value={formData.firstName}
                                        onChange={e => updateField('firstName', e.target.value)}
                                        error={errors.firstName}
                                    />
                                    <FloatingInput
                                        label="Cognome *"
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
                                    placeholder="nome@example.com"
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
                                    label="Conferma Password *"
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
                                            Accetto i{' '}
                                            <button
                                                type="button"
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setShowTerms(true);
                                                }}
                                                className="text-[var(--color-brand-accent)] underline hover:no-underline"
                                            >
                                                Termini e Condizioni
                                            </button>
                                            {' '}e la Privacy Policy *
                                        </span>
                                    </label>
                                    {errors.acceptTerms && (
                                        <p className="text-xs text-red-400 mt-2">{errors.acceptTerms}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* STEP 2: Dati Aziendali */}
                        {step === 2 && (
                            <div className="max-w-2xl mx-auto w-full space-y-6 animate-in fade-in duration-300">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-[var(--color-text-main)]">Dati Aziendali</h2>
                                    <p className="text-sm text-[var(--color-text-muted)] mt-2">
                                        Informazioni necessarie per la fatturazione
                                    </p>
                                </div>

                                <FloatingInput
                                    label="Ragione Sociale *"
                                    value={formData.businessName}
                                    onChange={e => updateField('businessName', e.target.value)}
                                    error={errors.businessName}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <FloatingInput
                                            label="Partita IVA *"
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
                                        label="Codice Fiscale"
                                        value={formData.fiscalCode}
                                        onChange={e => updateField('fiscalCode', e.target.value)}
                                        error={errors.fiscalCode}
                                        placeholder="Opzionale se diverso da P.IVA"
                                    />
                                </div>

                                <FloatingInput
                                    label="Telefono Aziendale"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => updateField('phone', e.target.value)}
                                    error={errors.phone}
                                    placeholder="+39 333 123 4567"
                                />

                                <div className="pt-4 border-t border-[var(--color-border)]">
                                    <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-4">
                                        Sede Legale
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <FloatingInput
                                                label="Via/Piazza *"
                                                value={formData.address}
                                                onChange={e => updateField('address', e.target.value)}
                                                error={errors.address}
                                            />
                                        </div>
                                        <FloatingInput
                                            label="Numero Civico"
                                            value={formData.civicNumber}
                                            onChange={e => updateField('civicNumber', e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                                        <FloatingInput
                                            label="CAP"
                                            value={formData.cap}
                                            onChange={e => updateField('cap', e.target.value)}
                                            error={errors.cap}
                                            placeholder="00100"
                                        />
                                        <FloatingInput
                                            label="Città *"
                                            value={formData.city}
                                            onChange={e => updateField('city', e.target.value)}
                                            error={errors.city}
                                        />
                                        <div>
                                            <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-muted)] block mb-2">
                                                Provincia
                                            </label>
                                            <select
                                                value={formData.province}
                                                onChange={e => updateField('province', e.target.value)}
                                                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-3 text-sm focus:border-[var(--color-brand-accent)] outline-none"
                                            >
                                                <option value="">Seleziona...</option>
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
                                            label="Nazione *"
                                            value={formData.country}
                                            onChange={e => updateField('country', e.target.value)}
                                            error={errors.country}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[var(--color-border)]">
                                    <h3 className="text-sm font-bold text-[var(--color-text-main)] mb-2">
                                        Fatturazione Elettronica (Opzionale)
                                    </h3>
                                    <p className="text-xs text-[var(--color-text-muted)] mb-4">
                                        Codice SDI o PEC per fatture elettroniche - completamente opzionale
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FloatingInput
                                            label="Codice SDI (opzionale)"
                                            value={formData.sdiCode}
                                            onChange={e => updateField('sdiCode', e.target.value)}
                                            placeholder="XXXXXXX"
                                        />
                                        <FloatingInput
                                            label="PEC (opzionale)"
                                            type="email"
                                            value={formData.pecEmail}
                                            onChange={e => updateField('pecEmail', e.target.value)}
                                            placeholder="azienda@pec.it"
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
                                        Scegli il Tuo Piano
                                    </h2>
                                    <p className="text-sm text-[var(--color-text-muted)] mt-2">
                                        Seleziona il piano più adatto alle tue esigenze
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
                                            Riepilogo Costi
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-[var(--color-text-muted)]">Subtotale:</span>
                                                <span className="font-medium">{formatEuro(priceBreakdown.subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[var(--color-text-muted)]">IVA 22%:</span>
                                                <span className="font-medium">{formatEuro(priceBreakdown.taxAmount)}</span>
                                            </div>
                                            <div className="flex justify-between pt-3 border-t border-[var(--color-border)] text-lg font-bold">
                                                <span>Totale:</span>
                                                <span className="text-[var(--color-brand-accent)]">
                                                    {formatEuro(priceBreakdown.total)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <p className="text-center text-xs text-[var(--color-text-muted)] italic mt-6">
                                    Abbonamento mensile con fatturazione automatica. I tokens si accumulano ogni mese e non scadono.
                                </p>
                            </div>
                        )}

                        {/* STEP 4: Pagamento */}
                        {step === 4 && priceBreakdown && (
                            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
                                <div className="text-center mb-6">
                                    <h2 className="text-2xl font-bold text-[var(--color-text-main)]">
                                        Conferma e Pagamento
                                    </h2>
                                    <p className="text-sm text-[var(--color-text-muted)] mt-2">
                                        Verifica i dati e procedi al pagamento
                                    </p>
                                </div>

                                {/* Riepilogo Ordine */}
                                <div className="bg-[var(--color-brand-accent)]/10 border-2 border-[var(--color-brand-accent)] rounded-xl p-6">
                                    <h3 className="text-lg font-bold text-[var(--color-text-main)] mb-4">
                                        📋 Riepilogo Ordine
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-[var(--color-text-main)]">
                                                    Piano {formData.planName}
                                                </p>
                                                <p className="text-xs text-[var(--color-brand-accent)]">
                                                    ⚡ {(formData.planCredits * 100).toLocaleString('it-IT')} tokens/mese
                                                </p>
                                                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                                                    I tokens si accumulano mensilmente
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => goToStep(3)}
                                                className="text-xs text-[var(--color-brand-accent)] underline hover:no-underline"
                                            >
                                                Modifica
                                            </button>
                                        </div>
                                        <div className="border-t border-[var(--color-border)] pt-3 space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-[var(--color-text-muted)]">Subtotale:</span>
                                                <span className="font-medium">{formatEuro(priceBreakdown.subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[var(--color-text-muted)]">IVA 22%:</span>
                                                <span className="font-medium">{formatEuro(priceBreakdown.taxAmount)}</span>
                                            </div>
                                            <div className="flex justify-between pt-2 border-t border-[var(--color-border)] text-xl font-bold">
                                                <span>Totale/Mese:</span>
                                                <span className="text-[var(--color-brand-accent)]">
                                                    {formatEuro(priceBreakdown.total)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dati Fiscali */}
                                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-[var(--color-text-main)]">
                                            🏢 Dati Fatturazione
                                        </h3>
                                        <button
                                            onClick={() => goToStep(2)}
                                            className="text-xs text-[var(--color-brand-accent)] underline hover:no-underline"
                                        >
                                            Modifica
                                        </button>
                                    </div>
                                    <div className="text-sm space-y-1 text-[var(--color-text-muted)]">
                                        <p><strong className="text-[var(--color-text-main)]">{formData.businessName}</strong></p>
                                        <p>P.IVA: {formData.vatNumber}</p>
                                        <p>{formData.address} {formData.civicNumber}</p>
                                        <p>{formData.cap} {formData.city} ({formData.province})</p>
                                        {formData.sdiCode && <p>SDI: {formData.sdiCode}</p>}
                                        {formData.pecEmail && <p>PEC: {formData.pecEmail}</p>}
                                    </div>
                                </div>

                                {/* Informazioni pagamento */}
                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                    <h3 className="text-sm font-bold text-blue-400 mb-3">ℹ️ Informazioni Abbonamento</h3>
                                    <ul className="text-xs text-[var(--color-text-muted)] space-y-2">
                                        <li>• Pagamento sicuro gestito da Stripe</li>
                                        <li>• I tokens vengono accreditati immediatamente e si accumulano ogni mese</li>
                                        <li>• Fatturazione automatica mensile</li>
                                        <li>• Riceverai la fattura via email entro 24 ore</li>
                                        <li>• Puoi cancellare l'abbonamento in qualsiasi momento</li>
                                        <li>• Puoi utilizzare carte di credito/debito o bonifico SEPA</li>
                                    </ul>
                                </div>

                                {errors.payment && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center text-red-400 text-sm">
                                        {errors.payment}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* STEP 5: Conferma Successo */}
                        {step === 5 && (
                            <div className="max-w-2xl mx-auto text-center space-y-8 animate-in fade-in duration-500 py-8">
                                <div className="w-24 h-24 mx-auto bg-emerald-500 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
                                    <CheckCircle size={64} className="text-white" />
                                </div>

                                <div>
                                    <h2 className="text-3xl font-bold text-[var(--color-text-main)] mb-3">
                                        Benvenuto in Armonyco! 🎉
                                    </h2>
                                    <p className="text-lg text-[var(--color-text-muted)]">
                                        Il tuo account è stato creato con successo
                                    </p>
                                </div>

                                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 text-left space-y-4">
                                    <h3 className="text-sm font-bold text-[var(--color-text-muted)] uppercase tracking-wider text-center mb-6">
                                        Riepilogo Account
                                    </h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-text-muted)]">Email:</span>
                                            <span className="font-medium text-[var(--color-text-main)]">{formData.email}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-text-muted)]">Piano:</span>
                                            <span className="font-medium text-[var(--color-text-main)]">{formData.planName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-text-muted)]">Crediti:</span>
                                            <span className="font-bold text-[var(--color-brand-accent)]">
                                                {formData.planCredits.toLocaleString('it-IT')} ArmoCredits©
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-[var(--color-text-muted)]">Data attivazione:</span>
                                            <span className="font-medium text-[var(--color-text-main)]">
                                                {new Date().toLocaleDateString('it-IT')}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                                    <p className="text-sm text-[var(--color-text-muted)]">
                                        📧 Abbiamo inviato un'email di conferma con tutti i dettagli a{' '}
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
                                        Vai alla Dashboard →
                                    </Button>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-4">
                                        Sarai reindirizzato automaticamente tra pochi secondi...
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
                                    Indietro
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
                                    Continua
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    rightIcon={isSubmitting ? <Loader size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                    onClick={handlePayment}
                                    disabled={isSubmitting}
                                    isLoading={isSubmitting}
                                >
                                    {isSubmitting ? 'Elaborazione...' : 'Procedi al Pagamento'}
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

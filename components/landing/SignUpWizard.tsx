import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Building, User, CreditCard, Zap } from '../ui/Icons';
import { FloatingInput } from '../ui/FloatingInput';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { authService } from '../../src/services/auth.service';

interface SignUpWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onContact: () => void;
    onComplete: (data: any) => void;
}

const STEPS = [
    { id: 1, title: 'Personal Info', icon: User },
    { id: 2, title: 'Organization', icon: Building },
    { id: 3, title: 'Billing Details', icon: CreditCard },
    { id: 4, title: 'Select Plan', icon: Zap },
];

export const SignUpWizard: React.FC<SignUpWizardProps> = ({ isOpen, onClose, onContact, onComplete }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Personal Info
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    // Organization
    const [org, setOrg] = useState({
        name: '',
        billingEmail: '',
        website: '',
        language: 'EN',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });

    // Billing Details
    const [billing, setBilling] = useState({
        legalName: '',
        vatNumber: '',
        fiscalCode: '',
        address: '',
        city: '',
        zip: '',
        country: '',
        sdiCode: '',
        pecEmail: '',
    });

    // Plan
    const [selectedPlan, setSelectedPlan] = useState<number>(25000);

    // Validation helpers
    const isValidEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const isValidPhone = (phone: string) => {
        if (!phone) return true; // Phone is optional
        // Accept international format: +XX XXX XXX XXXX or similar
        const regex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/;
        return regex.test(phone.replace(/\s/g, ''));
    };

    const isValidVAT = (vat: string, country: string) => {
        if (!vat) return true; // VAT is optional
        // Basic VAT validation per country
        const patterns: Record<string, RegExp> = {
            'IT': /^IT[0-9]{11}$/i,
            'Italy': /^IT[0-9]{11}$/i,
            'DE': /^DE[0-9]{9}$/i,
            'Germany': /^DE[0-9]{9}$/i,
            'FR': /^FR[A-Z0-9]{2}[0-9]{9}$/i,
            'France': /^FR[A-Z0-9]{2}[0-9]{9}$/i,
            'ES': /^ES[A-Z0-9][0-9]{7}[A-Z0-9]$/i,
            'Spain': /^ES[A-Z0-9][0-9]{7}[A-Z0-9]$/i,
            'PT': /^PT[0-9]{9}$/i,
            'Portugal': /^PT[0-9]{9}$/i,
            'UK': /^GB([0-9]{9}|[0-9]{12}|(GD|HA)[0-9]{3})$/i,
            'United Kingdom': /^GB([0-9]{9}|[0-9]{12}|(GD|HA)[0-9]{3})$/i,
        };
        const pattern = patterns[country];
        if (pattern) {
            return pattern.test(vat.replace(/\s/g, ''));
        }
        // Generic: at least 8 alphanumeric
        return /^[A-Z0-9]{8,}$/i.test(vat.replace(/\s/g, ''));
    };

    const isValidPassword = (password: string) => {
        // Min 8 chars, at least 1 letter and 1 number
        return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
    };

    const validateStep = () => {
        setError(null);

        if (step === 1) {
            if (!profile.firstName.trim() || !profile.lastName.trim()) {
                setError('Please enter your first and last name');
                return false;
            }
            if (!profile.email || !isValidEmail(profile.email)) {
                setError('Please enter a valid email address (e.g. name@company.com)');
                return false;
            }
            if (profile.phone && !isValidPhone(profile.phone)) {
                setError('Please enter a valid phone number (e.g. +39 333 123 4567)');
                return false;
            }
            if (!profile.password || !isValidPassword(profile.password)) {
                setError('Password must be at least 8 characters with letters and numbers');
                return false;
            }
            if (profile.password !== profile.confirmPassword) {
                setError('Passwords do not match');
                return false;
            }
        }

        if (step === 2) {
            if (!org.name.trim()) {
                setError('Please enter your organization name');
                return false;
            }
            if (!org.billingEmail || !isValidEmail(org.billingEmail)) {
                setError('Please enter a valid billing email address');
                return false;
            }
            if (org.website && !org.website.startsWith('http')) {
                setError('Website must start with http:// or https://');
                return false;
            }
        }

        if (step === 3) {
            if (!billing.legalName.trim()) {
                setError('Please enter the legal company name');
                return false;
            }
            if (billing.vatNumber && !isValidVAT(billing.vatNumber, billing.country)) {
                setError(`Invalid VAT format for ${billing.country || 'selected country'}. Example: IT12345678901`);
                return false;
            }
            if (!billing.address.trim() || !billing.city.trim() || !billing.country.trim()) {
                setError('Please complete all required address fields (Address, City, Country)');
                return false;
            }
            if (billing.pecEmail && !isValidEmail(billing.pecEmail)) {
                setError('Please enter a valid PEC email address');
                return false;
            }
        }

        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const prevStep = () => setStep(step - 1);

    const handleComplete = async () => {
        if (!validateStep()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            // 1. Create user account
            const response = await authService.signUp({
                email: profile.email,
                password: profile.password,
                userProfile: {
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    email: profile.email,
                    phone: profile.phone,
                    photo: null,
                }
            });

            // 2. Save organization data
            await authService.updateOrganization({
                name: org.name,
                billingEmail: org.billingEmail,
                language: org.language,
                timezone: org.timezone,
            });

            // 3. Save billing details
            await authService.updateBillingDetails(billing);

            // 4. Add initial credits based on plan
            await authService.addCredits(selectedPlan);

            onComplete({
                ...response,
                organization: org,
                billingDetails: billing,
                credits: selectedPlan,
            });
        } catch (err: any) {
            console.error('Registration failed', err);
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const plans = [
        { id: 1, name: 'Starter', amt: 25000, price: 249, units: 'Up to 50' },
        { id: 2, name: 'Pro', amt: 100000, price: 999, units: 'Up to 200' },
        { id: 3, name: 'Elite', amt: 250000, price: 2499, units: 'Up to 500' },
        { id: 4, name: 'VIP', amt: 0, price: 0, units: '500+', isCustom: true },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Account"
            width="full"
            showCloseButton={true}
        >
            <div className="flex flex-col h-auto max-h-[85vh] md:max-h-none">
                {/* Step Indicator */}
                <div className="px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                    <div className="flex items-center justify-center gap-2">
                        {STEPS.map((s, idx) => (
                            <React.Fragment key={s.id}>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${step === s.id
                                    ? 'bg-[var(--color-brand-accent)] text-black'
                                    : step > s.id
                                        ? 'bg-emerald-500/20 text-emerald-500'
                                        : 'bg-white/5 text-[var(--color-text-muted)]'
                                    }`}>
                                    {step > s.id ? <CheckCircle size={14} /> : <s.icon size={14} />}
                                    <span className="hidden md:inline">{s.title}</span>
                                </div>
                                {idx < STEPS.length - 1 && (
                                    <div className={`w-8 h-0.5 ${step > s.id ? 'bg-emerald-500' : 'bg-white/10'}`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Body */}
                <div className="p-8 overflow-y-auto flex-1">
                    <div className="flex justify-center mb-8">
                        <img src="/assets/logo-full.png" alt="Armonyco" className="h-14 object-contain" />
                    </div>

                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <div className="max-w-2xl mx-auto w-full space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-bold text-[var(--color-text-main)]">Personal Information</h2>
                                <p className="text-sm text-[var(--color-text-muted)] mt-1">Tell us about yourself</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <FloatingInput
                                    label="First Name *"
                                    value={profile.firstName}
                                    onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                                />
                                <FloatingInput
                                    label="Last Name *"
                                    value={profile.lastName}
                                    onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                                />
                            </div>
                            <FloatingInput
                                label="Email Address *"
                                type="email"
                                value={profile.email}
                                onChange={e => setProfile({ ...profile, email: e.target.value })}
                            />
                            <FloatingInput
                                label="Phone Number"
                                type="tel"
                                value={profile.phone}
                                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-6">
                                <FloatingInput
                                    label="Password *"
                                    type="password"
                                    value={profile.password}
                                    onChange={e => setProfile({ ...profile, password: e.target.value })}
                                />
                                <FloatingInput
                                    label="Confirm Password *"
                                    type="password"
                                    value={profile.confirmPassword}
                                    onChange={e => setProfile({ ...profile, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Organization */}
                    {step === 2 && (
                        <div className="max-w-2xl mx-auto w-full space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-bold text-[var(--color-text-main)]">Organization Details</h2>
                                <p className="text-sm text-[var(--color-text-muted)] mt-1">Tell us about your company</p>
                            </div>

                            <FloatingInput
                                label="Organization Name *"
                                value={org.name}
                                onChange={e => setOrg({ ...org, name: e.target.value })}
                            />
                            <FloatingInput
                                label="Billing Email *"
                                type="email"
                                value={org.billingEmail}
                                onChange={e => setOrg({ ...org, billingEmail: e.target.value })}
                            />
                            <FloatingInput
                                label="Company Website"
                                type="url"
                                value={org.website}
                                onChange={e => setOrg({ ...org, website: e.target.value })}
                                placeholder="https://example.com"
                            />
                            <div className="grid grid-cols-2 gap-6">
                                <div className="relative">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-muted)] absolute top-2 left-3 z-10">Language</label>
                                    <select
                                        value={org.language}
                                        onChange={e => setOrg({ ...org, language: e.target.value })}
                                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 pt-6 pb-2 text-sm focus:border-[var(--color-brand-accent)] outline-none appearance-none"
                                    >
                                        <option value="EN">English</option>
                                        <option value="IT">Italiano</option>
                                        <option value="ES">Español</option>
                                        <option value="PT">Português</option>
                                        <option value="FR">Français</option>
                                    </select>
                                </div>
                                <div className="relative">
                                    <label className="text-[10px] uppercase font-black tracking-widest text-[var(--color-text-muted)] absolute top-2 left-3 z-10">Timezone</label>
                                    <select
                                        value={org.timezone}
                                        onChange={e => setOrg({ ...org, timezone: e.target.value })}
                                        className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 pt-6 pb-2 text-sm focus:border-[var(--color-brand-accent)] outline-none appearance-none"
                                    >
                                        <option value="Europe/Rome">Europe/Rome (CET)</option>
                                        <option value="Europe/London">Europe/London (GMT)</option>
                                        <option value="America/New_York">America/New York (EST)</option>
                                        <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
                                        <option value="America/Sao_Paulo">America/São Paulo (BRT)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Billing Details */}
                    {step === 3 && (
                        <div className="max-w-2xl mx-auto w-full space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-bold text-[var(--color-text-main)]">Billing & Fiscal Details</h2>
                                <p className="text-sm text-[var(--color-text-muted)] mt-1">For invoicing purposes</p>
                            </div>

                            <FloatingInput
                                label="Legal Company Name *"
                                value={billing.legalName}
                                onChange={e => setBilling({ ...billing, legalName: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-6">
                                <FloatingInput
                                    label="VAT Number"
                                    value={billing.vatNumber}
                                    onChange={e => setBilling({ ...billing, vatNumber: e.target.value })}
                                    placeholder="e.g. IT12345678901"
                                />
                                <FloatingInput
                                    label="Fiscal Code"
                                    value={billing.fiscalCode}
                                    onChange={e => setBilling({ ...billing, fiscalCode: e.target.value })}
                                />
                            </div>
                            <FloatingInput
                                label="Street Address *"
                                value={billing.address}
                                onChange={e => setBilling({ ...billing, address: e.target.value })}
                            />
                            <div className="grid grid-cols-3 gap-6">
                                <FloatingInput
                                    label="City *"
                                    value={billing.city}
                                    onChange={e => setBilling({ ...billing, city: e.target.value })}
                                />
                                <FloatingInput
                                    label="ZIP / Postal Code"
                                    value={billing.zip}
                                    onChange={e => setBilling({ ...billing, zip: e.target.value })}
                                />
                                <FloatingInput
                                    label="Country *"
                                    value={billing.country}
                                    onChange={e => setBilling({ ...billing, country: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <FloatingInput
                                    label="SDI Code (Italy)"
                                    value={billing.sdiCode}
                                    onChange={e => setBilling({ ...billing, sdiCode: e.target.value })}
                                    placeholder="e.g. 0000000"
                                />
                                <FloatingInput
                                    label="PEC Email (Italy)"
                                    type="email"
                                    value={billing.pecEmail}
                                    onChange={e => setBilling({ ...billing, pecEmail: e.target.value })}
                                    placeholder="company@pec.it"
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Select Plan */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-8">
                                <h2 className="text-xl font-bold text-[var(--color-text-main)]">Select Your Plan</h2>
                                <p className="text-sm text-[var(--color-text-muted)] mt-1">Choose the plan that fits your needs</p>
                            </div>

                            <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4">
                                {plans.map(plan => (
                                    <button
                                        key={plan.id}
                                        onClick={() => {
                                            if (plan.isCustom) {
                                                onContact();
                                            } else {
                                                setSelectedPlan(plan.amt);
                                            }
                                        }}
                                        className={`py-6 rounded-[1.5rem] border transition-all flex flex-col items-center justify-center gap-1 ${selectedPlan === plan.amt && !plan.isCustom
                                            ? 'bg-[var(--color-text-main)] text-[var(--color-surface)] border-[var(--color-text-main)] shadow-xl scale-[1.02]'
                                            : 'bg-[var(--color-surface)] text-[var(--color-text-main)] border-[var(--color-border)] hover:border-[var(--color-text-main)]'
                                            }`}
                                    >
                                        <span className={`text-[12px] uppercase tracking-[0.2em] font-black ${selectedPlan === plan.amt && !plan.isCustom ? 'text-white' : 'text-[var(--color-brand-accent)]'
                                            }`}>
                                            {plan.name}
                                        </span>
                                        {plan.isCustom ? (
                                            <div className="flex flex-col items-center my-3">
                                                <span className="text-[18px] font-bold leading-tight text-center">Contact Us</span>
                                                <span className="text-[8px] uppercase font-black opacity-50 tracking-widest mt-1">Bespoke Quote</span>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="text-[30px] font-bold leading-none mb-0">
                                                    €{plan.price.toLocaleString('de-DE')}
                                                    <span className="text-[14px] opacity-60 font-medium">/mo</span>
                                                </span>
                                                <span className="text-[8px] uppercase font-black opacity-50 tracking-widest mb-0.5">VAT Incl.</span>
                                            </>
                                        )}
                                        <div className="flex flex-col items-center gap-1 border-t border-black/5 dark:border-white/5 pt-4 mt-2 w-full">
                                            <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${selectedPlan === plan.amt && !plan.isCustom ? 'text-white' : 'text-[var(--color-brand-accent)]'
                                                } mb-1`}>
                                                {plan.isCustom ? 'Scope' : 'Includes'}
                                            </span>
                                            {!plan.isCustom ? (
                                                <>
                                                    <span className="text-[18px] font-bold tracking-tight">{plan.amt.toLocaleString('de-DE')}</span>
                                                    <span className="text-[9px] opacity-60 font-black uppercase tracking-widest">ArmoCredits©</span>
                                                </>
                                            ) : (
                                                <span className="text-[11px] font-bold tracking-tight text-center px-2">Institutional Project</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <p className="text-center text-[9px] text-[var(--color-text-muted)] mt-4 italic">VAT Included. Monthly refresh.</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex justify-between items-center shrink-0 rounded-b-xl">
                    {step > 1 ? (
                        <Button
                            variant="secondary"
                            leftIcon={<ChevronLeft size={18} />}
                            onClick={prevStep}
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
                        >
                            Continue
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            rightIcon={<CheckCircle size={18} />}
                            onClick={handleComplete}
                            isLoading={isSubmitting}
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

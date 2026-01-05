import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from '../ui/Icons';
import { FloatingInput } from '../ui/FloatingInput';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface SignUpWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (data: any) => void;
}

export const SignUpWizard: React.FC<SignUpWizardProps> = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState(1);

    // State Collection
    const [credits, setCredits] = useState(10000);
    const [profile, setProfile] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '', terms: false, privacy: false });
    const [org, setOrg] = useState({ name: '', billingEmail: '', language: 'EN', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone });
    const [billing, setBilling] = useState({ legalName: '', vatNumber: '', fiscalCode: '', address: '', city: '', zip: '', country: '', sdiCode: '', pecEmail: '' });

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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Start now"
            width="full"
            showCloseButton={true}
        >
            <div className="flex flex-col h-auto max-h-[85vh] md:max-h-none">
                {/* Header Subtext */}
                <div className="px-6 pb-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex justify-between items-center -mt-4 mb-0">
                    <div className="text-xs font-mono text-[var(--color-text-subtle)]">Step {step} of 3</div>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 md:p-8 overflow-y-auto flex-1">
                    <div className="flex justify-center mb-6">
                        <img src="/assets/logo-full.png" alt="Armonyco" className="h-12 object-contain" />
                    </div>
                    {step === 1 && (
                        <div className="max-w-2xl mx-auto w-full space-y-6 animate-in slide-in-from-right-4 duration-300 pt-2">
                            <div className="grid grid-cols-2 gap-6">
                                <FloatingInput
                                    label="First Name"
                                    value={profile.firstName}
                                    onChange={e => setProfile({ ...profile, firstName: e.target.value })}
                                />
                                <FloatingInput
                                    label="Last Name"
                                    value={profile.lastName}
                                    onChange={e => setProfile({ ...profile, lastName: e.target.value })}
                                />
                            </div>
                            <FloatingInput
                                label="Email Address"
                                type="email"
                                value={profile.email}
                                onChange={e => setProfile({ ...profile, email: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-6">
                                <FloatingInput
                                    label="Password"
                                    type="password"
                                    value={profile.password}
                                    onChange={e => setProfile({ ...profile, password: e.target.value })}
                                />
                                <FloatingInput
                                    label="Confirm Password"
                                    type="password"
                                    value={profile.confirmPassword}
                                    onChange={e => setProfile({ ...profile, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                    {step === 2 && (
                        <div className="max-w-2xl mx-auto w-full space-y-6 animate-in slide-in-from-right-4 duration-300 pt-2">
                            <FloatingInput
                                label="Organization Name"
                                value={org.name}
                                onChange={e => setOrg({ ...org, name: e.target.value })}
                            />
                            <FloatingInput
                                label="Billing Email"
                                type="email"
                                value={org.billingEmail}
                                onChange={e => setOrg({ ...org, billingEmail: e.target.value })}
                            />
                        </div>
                    )}
                    {step === 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="max-w-3xl mx-auto bg-[var(--color-background)] p-4 rounded-xl border border-[var(--color-border)] text-center space-y-2 ui-card">
                                <div>
                                    <h2 className="text-base font-medium text-[var(--color-text-main)]">ArmoCredits™ System</h2>
                                    <p className="text-[var(--color-text-muted)] text-[10px]">The fuel for autonomous governance.</p>
                                </div>
                                <div className="text-[10px] text-[var(--color-text-muted)] space-y-1 border-t border-[var(--color-border)] pt-3">
                                    <p>Plans include monthly credits with automatic top-up protection.</p>
                                    <div className="flex justify-center gap-4 font-mono font-medium text-[var(--color-text-main)] text-[9px]">
                                        <span>Activation + Execution Model</span>
                                        <span className="text-[var(--color-border)]">|</span>
                                        <span>Monthly Refresh</span>
                                    </div>
                                </div>
                            </div>
                            <div className="max-w-5xl mx-auto">
                                <label className="block text-[10px] font-bold text-[var(--color-text-subtle)] uppercase tracking-wider mb-2 text-center">Select Institutional Plan</label>
                                <div className="grid grid-cols-4 gap-4 mb-1">
                                    {[
                                        { id: 1, name: 'Starter', amt: 10000, price: 39, units: 'Up to 50' },
                                        { id: 2, name: 'Pro', amt: 20000, price: 59, units: 'Up to 200' },
                                        { id: 3, name: 'Elite', amt: 50000, price: 79, units: 'Up to 500' },
                                        { id: 4, name: 'VIP', amt: 100000, price: 129, units: '500+' }
                                    ].map(plan => (
                                        <button
                                            key={plan.amt}
                                            onClick={() => setCredits(plan.amt)}
                                            className={`py-5 rounded-[1.5rem] border transition-all flex flex-col items-center justify-center gap-1 ${credits === plan.amt ? 'bg-[var(--color-text-main)] text-[var(--color-surface)] border-[var(--color-text-main)] shadow-xl scale-[1.02]' : 'bg-[var(--color-surface)] text-[var(--color-text-main)] border-[var(--color-border)] hover:border-[var(--color-text-main)] hover:bg-[var(--color-background)]'}`}
                                        >
                                            <span className="text-[12px] opacity-40 uppercase tracking-[0.2em] font-black">{plan.name}</span>
                                            <span className="text-[32px] font-bold leading-none mb-0.5">€{plan.price}<span className="text-[14px] opacity-60 font-medium">/mo</span></span>
                                            <span className="text-[8px] uppercase font-black opacity-30 tracking-widest mb-1.5">VAT Incl.</span>
                                            <div className="flex flex-col items-center gap-1 border-t border-black/5 dark:border-white/5 pt-3 mt-1.5 w-full">
                                                <div className="flex flex-col items-center">
                                                    <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${credits === plan.amt ? 'text-white' : 'text-[var(--color-brand-accent)]'} mb-1`}>Includes</span>
                                                    <span className="text-[18px] font-bold tracking-tight">{plan.amt.toLocaleString('de-DE')}</span>
                                                    <span className="text-[9px] opacity-40 font-black uppercase tracking-widest">ArmoCredits©</span>
                                                </div>
                                                <span className="text-[10px] opacity-40 uppercase tracking-[0.2em] font-bold mt-1 italic">{plan.units} units</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-center text-[10px] text-[var(--color-text-muted)] mt-4 italic opacity-60">All prices include VAT. Resource allocation reset every 30 days.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
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

                    {step < 3 ? (
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
                        >
                            Activate
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

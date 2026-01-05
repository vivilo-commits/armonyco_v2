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
    const [credits, setCredits] = useState(20);
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
            width="xl"
            showCloseButton={true}
        >
            <div className="flex flex-col h-[70vh] md:h-auto">
                {/* Header Subtext */}
                <div className="px-6 pb-4 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex justify-between items-center -mt-4 mb-0">
                    <div className="text-xs font-mono text-[var(--color-text-subtle)]">Step {step} of 3</div>
                </div>

                {/* Body - Scrollable */}
                <div className="p-8 overflow-y-auto flex-1">
                    <div className="flex justify-center mb-10">
                        <img src="/assets/logo-full.png" alt="Armonyco" className="h-16 object-contain" />
                    </div>
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pt-2">
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
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 pt-2">
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
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-[var(--color-background)] p-6 rounded-xl border border-[var(--color-border)] text-center space-y-4 ui-card">
                                <div>
                                    <h2 className="text-lg font-medium text-[var(--color-text-main)] mb-1">ArmoCredits™ System</h2>
                                    <p className="text-[var(--color-text-muted)] text-sm">The fuel for autonomous governance.</p>
                                </div>
                                <div className="text-xs text-[var(--color-text-muted)] space-y-2 border-t border-[var(--color-border)] pt-4">
                                    <p>ArmoCredits© power your autonomous governance. Charges apply for module activation and ongoing operational routines.</p>
                                    <div className="flex justify-center gap-4 font-mono font-medium text-[var(--color-text-main)]">
                                        <span>Activation + Execution Model</span>
                                        <span className="text-[var(--color-border)]">|</span>
                                        <span>Lifetime Validity</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-[var(--color-text-subtle)] uppercase tracking-wider mb-4 text-center">Select Initial Credits</label>
                                <div className="grid grid-cols-4 gap-4 mb-2">
                                    {[10000, 20000, 50000, 100000].map(amt => (
                                        <button
                                            key={amt}
                                            onClick={() => setCredits(amt)}
                                            className={`py-4 rounded-lg border transition-all text-sm font-medium ${credits === amt ? 'bg-[var(--color-text-main)] text-[var(--color-surface)] border-[var(--color-text-main)]' : 'bg-[var(--color-surface)] text-[var(--color-text-main)] border-[var(--color-border)] hover:border-[var(--color-text-main)]'}`}
                                        >{amt.toLocaleString('de-DE')} ArmoCredits©</button>
                                    ))}
                                </div>
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

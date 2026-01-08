import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept?: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
    const handleAccept = () => {
        if (onAccept) {
            onAccept();
        }
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Terms and Conditions"
            width="lg"
            showCloseButton={true}
        >
            <div className="p-6 space-y-6">
                {/* Scrollable content */}
                <div className="max-h-[60vh] overflow-y-auto space-y-4 text-sm text-[var(--color-text-main)] pr-2">
                    <section>
                        <h3 className="font-bold text-base mb-2">1. Acceptance of Terms</h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            By using the Armonyco service, you fully accept these Terms and Conditions.
                            If you do not accept these terms, you may not use our services.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">2. Service Description</h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            Armonyco is a B2B SaaS platform that provides decision management tools
                            and automation for businesses. The service includes access to AI modules, analytics
                            dashboards, and compliance tools.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">3. Registration and Account</h3>
                        <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                            <li>You must provide accurate and complete information during registration</li>
                            <li>You are responsible for the security of your login credentials</li>
                            <li>You may not share your account with unauthorized third parties</li>
                            <li>You must notify us immediately in case of unauthorized access</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">4. Plans and Payments</h3>
                        <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                            <li>Payments are processed via Stripe and are subject to their policies</li>
                            <li>Purchased credits are valid for the period specified in the plan</li>
                            <li>Unused credits are not refundable</li>
                            <li>Prices may change with at least 30 days advance notice</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">5. Service Usage</h3>
                        <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                            <li>You agree to use the service in compliance with all applicable laws</li>
                            <li>You may not use the service for illegal or unauthorized activities</li>
                            <li>You may not attempt to breach the platform's security</li>
                            <li>You may not reverse engineer the software</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">6. Intellectual Property</h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            All intellectual property rights related to the Armonyco platform
                            belong to us or our licensors. Your data remains your property,
                            but you grant us a license to use it to provide you with the service.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">7. Privacy and Data</h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            The processing of your personal data is governed by our Privacy Policy,
                            compliant with GDPR. We process data with maximum security and do not sell
                            it to third parties.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">8. Limitation of Liability</h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            The service is provided "as is" without warranties of any kind. We are not
                            liable for indirect, incidental, or consequential damages arising
                            from the use of the service.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">9. Termination and Cancellation</h3>
                        <ul className="list-disc list-inside space-y-2 text-[var(--color-text-muted)]">
                            <li>You can delete your account at any time from settings</li>
                            <li>We may suspend or terminate the account in case of terms violation</li>
                            <li>Data is retained according to our retention policy</li>
                        </ul>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">10. Terms Modifications</h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            We reserve the right to modify these terms at any time.
                            Changes will be communicated via email and published on the platform.
                            Continued use of the service constitutes acceptance of the changes.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-bold text-base mb-2">11. Applicable Law</h3>
                        <p className="text-[var(--color-text-muted)] leading-relaxed">
                            These terms are governed by Italian law. Any disputes
                            will be subject to the exclusive jurisdiction of the Court of Milan.
                        </p>
                    </section>

                    <section className="pt-4 border-t border-[var(--color-border)]">
                        <p className="text-xs text-[var(--color-text-muted)] italic">
                            Last updated: January 2026
                        </p>
                    </section>
                </div>

                {/* Footer with actions */}
                <div className="flex gap-3 pt-4 border-t border-[var(--color-border)]">
                    {onAccept && (
                        <Button
                            variant="primary"
                            onClick={handleAccept}
                            className="flex-1"
                        >
                            Accept Terms
                        </Button>
                    )}
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className={onAccept ? 'flex-1' : 'w-full'}
                    >
                        {onAccept ? 'Decline' : 'Close'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};


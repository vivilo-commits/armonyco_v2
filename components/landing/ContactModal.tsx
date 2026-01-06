import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import {
    MessageCircle,
    Mail,
    Calendar,
    ChevronRight,
    Send,
    CheckCircle,
    Phone,
    Building,
    User,
    ArrowRight
} from '../ui/Icons';
import { Button } from '../ui/Button';
import { FloatingInput } from '../ui/FloatingInput';
import { contactService, ContactFormData } from '../../src/services/contact.service';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type ContactView = 'SELECTION' | 'FORM' | 'SUCCESS';

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const [view, setView] = useState<ContactView>('SELECTION');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<ContactFormData>({
        fullName: '',
        company: '',
        email: '',
        phone: '',
        unitsManaged: '',
        message: ''
    });

    const handleClose = () => {
        onClose();
        // Reset state after a delay to allow for closing animation
        setTimeout(() => setView('SELECTION'), 300);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await contactService.submitContactForm(formData);
            setView('SUCCESS');
        } catch (error) {
            console.error('Submission failed', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Use placeholder links as instructed
    const WHATSAPP_LINK = "http://wa.me/393520177120";
    const CALENDLY_LINK = "https://calendly.com/armonyco/demo";

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={view === 'FORM' ? 'Send a message' : 'Contact Armonyco'}
            width={view === 'FORM' ? 'xl' : 'md'}
        >
            <div className="p-8">
                {view === 'SELECTION' && (
                    <div className="space-y-6">
                        <div className="mb-8">
                            <p className="text-[var(--color-text-muted)] text-base">
                                Choose your preferred way to reach us. We'll respond quickly.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            {/* WhatsApp Option */}
                            <a
                                href={WHATSAPP_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-6 rounded-2xl bg-[#25D366]/5 border border-[#25D366]/10 hover:border-[#25D366]/40 transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#25D366] flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20">
                                        <MessageCircle size={24} fill="currentColor" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zinc-900 group-hover:text-[#25D366] transition-colors">Message us on WhatsApp</h4>
                                        <p className="text-xs text-zinc-500 mt-1">Fastest way to talk to our team.</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-zinc-300 group-hover:text-[#25D366] transition-all group-hover:translate-x-1" />
                            </a>

                            {/* Form Option */}
                            <button
                                onClick={() => setView('FORM')}
                                className="group flex items-center justify-between p-6 rounded-2xl bg-[var(--color-brand-primary)]/5 border border-[var(--color-border)] hover:border-[var(--color-brand-primary)] transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-primary)] flex items-center justify-center text-white shadow-lg shadow-[var(--color-brand-primary)]/20">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zinc-900 group-hover:text-[var(--color-brand-primary)] transition-colors text-left uppercase tracking-tight">Send a message</h4>
                                        <p className="text-xs text-zinc-500 mt-1">Tell us about your project.</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-zinc-300 group-hover:text-[var(--color-brand-primary)] transition-all group-hover:translate-x-1" />
                            </button>

                            {/* Demo Option */}
                            <a
                                href={CALENDLY_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between p-6 rounded-2xl bg-[var(--color-brand-accent)]/5 border border-[var(--color-brand-accent)]/10 hover:border-[var(--color-brand-accent)] transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--color-brand-accent)] flex items-center justify-center text-white shadow-lg shadow-[var(--color-brand-accent)]/20">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-zinc-900 group-hover:text-[var(--color-brand-accent)] transition-colors">Schedule a demo</h4>
                                        <p className="text-xs text-zinc-500 mt-1">Pick a time on our calendar.</p>
                                    </div>
                                </div>
                                <ChevronRight size={20} className="text-zinc-300 group-hover:text-[var(--color-brand-accent)] transition-all group-hover:translate-x-1" />
                            </a>
                        </div>
                    </div>
                )}

                {view === 'FORM' && (
                    <form onSubmit={handleFormSubmit} className="animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <FloatingInput
                                label="Full Name *"
                                value={formData.fullName}
                                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                required
                                startIcon={<User size={18} />}
                            />
                            <FloatingInput
                                label="Company"
                                value={formData.company}
                                onChange={e => setFormData({ ...formData, company: e.target.value })}
                                startIcon={<Building size={18} />}
                            />
                            <FloatingInput
                                label="Email address *"
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                required
                                startIcon={<Mail size={18} />}
                            />
                            <FloatingInput
                                label="WhatsApp / Phone"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                startIcon={<Phone size={18} />}
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 ml-1">Units managed</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {['1-50', '51-200', '201-500', '500+'].map(option => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, unitsManaged: option })}
                                        className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all ${formData.unitsManaged === option ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg' : 'bg-white border-zinc-100 text-zinc-500 hover:border-zinc-300'}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3 ml-1">Message *</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.message}
                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                className="w-full bg-white border border-zinc-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-primary)]/50 transition-all resize-none"
                                placeholder="How can we help your operations?"
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="secondary"
                                className="flex-1"
                                onClick={() => setView('SELECTION')}
                                disabled={isSubmitting}
                            >
                                Back
                            </Button>
                            <Button
                                type="submit"
                                className="flex-[2] py-4 shadow-xl"
                                disabled={isSubmitting}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <Send size={16} />
                                        </>
                                    )}
                                </div>
                            </Button>
                        </div>
                    </form>
                )}

                {view === 'SUCCESS' && (
                    <div className="py-12 text-center animate-fade-in">
                        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <CheckCircle size={40} className="text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-light text-zinc-900 mb-4 tracking-tight">Message Received</h3>
                        <p className="text-zinc-500 max-w-sm mx-auto mb-10 leading-relaxed">
                            Thanks — we received your message and will get back to you shortly.
                        </p>
                        <Button onClick={handleClose} className="w-full">
                            Close
                        </Button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

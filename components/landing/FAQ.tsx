import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowRight } from '../ui/Icons';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface FAQItem {
    question: string;
    answer: string;
}

const faqData: FAQItem[] = [
    // Core 8 FAQs (Disruptive)
    {
        question: "Is it just a WhatsApp chatbot?",
        answer: "No. The chatbot is the interface. Underneath is a system that decides, controls, and traces every operational event."
    },
    {
        question: "How is it different from other AI concierges?",
        answer: "Others respond to messages. Armonyco governs processes: access, decisions, escalations, and economic value."
    },
    {
        question: "Does it really work without changing my PMS or workflows?",
        answer: "Yes. Armonyco is PMS-agnostic and overlays existing systems. You don't need to reorganize anything."
    },
    {
        question: "What happens when the AI doesn't know what to do?",
        answer: "It doesn't improvise. It stops, flags, and escalates with all context ready for the human."
    },
    {
        question: "Does it actually save me time, or is it just 'more technology'?",
        answer: "It reduces messages, errors, and unnecessary escalations. The result isn't more tech—it's less operational chaos."
    },
    {
        question: "Does it handle upselling and revenue, or just support?",
        answer: "Both. Early check-in, late check-out, extra services, and orphan days are decided automatically—not just suggested."
    },
    {
        question: "Can I see what it does and why?",
        answer: "Yes. Every action is traced: event → rule → decision → outcome."
    },
    {
        question: "Who is Armonyco NOT for?",
        answer: "For those who just want 'a cute chatbot.' Armonyco is for those who want real control while scaling."
    },
    // Extended FAQs (12 more)
    {
        question: "How long does it take to activate Armonyco?",
        answer: "Progressive activation takes less than 24 hours. We import your portfolio and connect WhatsApp/Crossbooking immediately. Full autonomy kicks in as the system learns your specific policies."
    },
    {
        question: "Do I need to change my PMS or internal tools?",
        answer: "No. Armonyco is PMS-agnostic and overlays your current setup. We pull data from tools like Crossbooking or simple spreadsheets to populate your units automatically."
    },
    {
        question: "How exactly do you measure performance?",
        answer: "We track Governed Cashflow™. If it's not governed, it's not real cashflow. This is the precise financial value governed by our policy engine—monetizing gaps, protecting deposits, and ensuring every stay follows your profitability rules."
    },
    {
        question: "Can I start with just a few properties?",
        answer: "Yes. You can test Armonyco on a small group or even a single unit and scale as you see the ROI."
    },
    {
        question: "What happens if a guest has a real or urgent problem?",
        answer: "Armonyco classifies the request and escalates only when needed, with priority and context."
    },
    {
        question: "Can I decide what to automate and what not to?",
        answer: "Yes. Every flow is configurable and supervisable."
    },
    {
        question: "Does it handle multiple properties and different brands?",
        answer: "Yes. Armonyco is designed for multi-property and multi-brand operations."
    },
    {
        question: "How does it avoid wrong answers or 'hallucinations'?",
        answer: "It doesn't make things up. It only responds based on verified data and defined policies."
    },
    {
        question: "Does it keep track of what happens over time?",
        answer: "Yes. Every event is logged: messages, decisions, errors, escalations."
    },
    {
        question: "Is it suitable for small teams?",
        answer: "Yes. In fact, that's often where the benefit is most evident."
    },
    {
        question: "Does Armonyco learn over time?",
        answer: "Yes, but in a controlled way. Every exception becomes a rule, not chaos."
    },
    {
        question: "What's the real advantage over any other tool?",
        answer: "When you grow, Armonyco doesn't collapse. In fact: the more complexity, the more value it generates."
    },
];

const FAQItemComponent: React.FC<{ item: FAQItem; isOpen: boolean; onClick: () => void }> = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-[var(--color-border)] last:border-b-0">
            <button
                onClick={onClick}
                className="w-full py-5 flex justify-between items-center text-left group"
            >
                <span className="text-[var(--color-text-main)] font-medium pr-4 group-hover:text-[var(--color-brand-accent)] transition-colors">
                    {item.question}
                </span>
                <span className="text-[var(--color-text-muted)] shrink-0">
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 pb-5' : 'max-h-0 opacity-0'
                    }`}
            >
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed pr-8">
                    {item.answer}
                </p>
            </div>
        </div>
    );
};

export const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [showMore, setShowMore] = useState(false);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const visibleFAQs = showMore ? faqData : faqData.slice(0, 8);
    const primaryFAQs = visibleFAQs.slice(0, 4);
    const secondaryFAQs = visibleFAQs.slice(4);

    return (
        <section id="faq" className="py-24 px-6 md:px-24 bg-[var(--color-background)] border-b border-[var(--color-border)] scroll-mt-20">
            <div className="max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl text-[var(--color-text-main)] font-light mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-[var(--color-text-muted)] text-lg">
                        Everything you need to know about Armonyco.
                    </p>
                </div>

                {/* Primary FAQs - Always visible */}
                <Card variant="default" padding="md" className="mb-6">
                    {primaryFAQs.map((item, index) => (
                        <FAQItemComponent
                            key={index}
                            item={item}
                            isOpen={openIndex === index}
                            onClick={() => handleToggle(index)}
                        />
                    ))}
                </Card>

                {/* Secondary FAQs - Expandable */}
                {secondaryFAQs.length > 0 && (
                    <Card variant="default" padding="md" className="mb-8">
                        {secondaryFAQs.map((item, index) => (
                            <FAQItemComponent
                                key={index + 4}
                                item={item}
                                isOpen={openIndex === index + 4}
                                onClick={() => handleToggle(index + 4)}
                            />
                        ))}
                    </Card>
                )}

                {/* Show More / Show Less Button */}
                {!showMore && faqData.length > 8 && (
                    <div className="text-center mb-12">
                        <button
                            onClick={() => setShowMore(true)}
                            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors flex items-center gap-2 mx-auto"
                        >
                            Show more questions
                            <ChevronDown size={16} />
                        </button>
                    </div>
                )}
                {showMore && (
                    <div className="text-center mb-12">
                        <button
                            onClick={() => setShowMore(false)}
                            className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors flex items-center gap-2 mx-auto"
                        >
                            Show less
                            <ChevronUp size={16} />
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
};

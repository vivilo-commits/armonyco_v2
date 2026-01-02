import React from 'react';
import { AgentCard } from '../ui/AgentCard';
import { agents } from '../../data/agents';

export const ActiveWorkforce: React.FC = () => {
    return (
        <section className="py-24 px-6 md:px-24 bg-[var(--color-background)] border-b border-[var(--color-border)]">
            <div className="mb-16">
                <h2 className="text-4xl text-[var(--color-text-main)] font-light mb-4">The Active Workforce</h2>
                <p className="text-[var(--color-text-muted)] max-w-3xl text-lg">
                    Armonyco isn't just software. It's a workforce. Meet the specialized AI agents that execute your governance protocols 24/7, turning policy into proof.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 w-full h-auto lg:h-[340px]">
                {agents.map((agent) => (
                    <AgentCard
                        key={agent.id}
                        {...agent}
                    />
                ))}
            </div>
        </section>
    );
};

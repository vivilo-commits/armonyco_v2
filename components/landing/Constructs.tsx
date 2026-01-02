import React from 'react';
import { Database, Network, Shield, FileCheck } from '../ui/Icons';
import { Card } from '../ui/Card';

export const Constructs: React.FC = () => {
  return (
    <section id="core" className="py-24 px-6 md:px-24 bg-[var(--color-background)] border-b border-[var(--color-border)] scroll-mt-20">
      <div className="mb-20">
        <h2 className="text-4xl text-[var(--color-text-main)] font-light mb-4">The Core Constructs</h2>
        <p className="text-[var(--color-text-muted)] text-lg">Infrastructure for Institutional Truth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AEM */}
        <Card id="aem" padding="lg" variant="default" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded bg-[var(--color-background)] flex items-center justify-center text-[var(--color-brand-accent)] border border-[var(--color-border)]">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-2xl text-[var(--color-text-main)] font-medium">AEM Armonyco Event Model™</h3>
          </div>
          <p className="text-[var(--color-text-main)] mb-4 font-medium italic text-lg">AEM is the canonical model of reality.</p>
          <p className="text-[var(--color-text-muted)] text-sm mb-8 leading-relaxed">
            Organizations fail at governance because “operations” are not structured. They happen in messages, calls, improvisations, supplier habits, informal approvals, and exceptions. AEM converts that chaos into a single governable unit: the Operational Event.
          </p>
          <div className="space-y-4 mb-8 text-sm bg-[var(--color-background)] p-6 rounded-lg border border-[var(--color-border)]">
            <p className="text-[var(--color-text-subtle)] uppercase text-[10px] tracking-widest font-bold">An event is only valid when:</p>
            <ul className="list-disc pl-4 text-[var(--color-text-muted)] space-y-2">
              <li>It is recognized and classified</li>
              <li>It is evaluated against a policy</li>
              <li>It receives a verdict (allow/deny/modify)</li>
              <li>It produces evidence</li>
              <li>It becomes auditable truth</li>
            </ul>
          </div>
          <p className="text-[var(--color-brand-accent)] text-xs font-bold uppercase tracking-wider">AEM is the grammar that makes governance possible.</p>
        </Card>

        {/* AOS */}
        <Card id="aos" padding="lg" variant="default" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded bg-[var(--color-background)] flex items-center justify-center text-[var(--color-brand-accent)] border border-[var(--color-border)]">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-2xl text-[var(--color-text-main)] font-medium">AOS Armonyco Operating System™</h3>
          </div>
          <p className="text-[var(--color-text-main)] mb-4 font-medium italic text-lg">AOS is the operating system for governed execution.</p>
          <p className="text-[var(--color-text-muted)] text-sm mb-8 leading-relaxed">
            Not task management. Not workflow software. Not “ops tooling.” AOS is the layer that sits above operations and does three things - always:
          </p>
          <ul className="list-disc pl-4 text-[var(--color-text-muted)] text-sm space-y-3 mb-8">
            <li>Captures operational events from the real world</li>
            <li>Decides through Decision-First Architecture (policy → verdict)</li>
            <li>Certifies through evidence, immutable history, and buyer-grade metrics</li>
          </ul>
          <p className="text-[var(--color-brand-accent)] text-xs font-bold uppercase tracking-wider">AOS is what your business becomes dependent on to remain governable.</p>
        </Card>

        {/* ARS */}
        <Card id="ars" padding="lg" variant="default" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded bg-[var(--color-background)] flex items-center justify-center text-[var(--color-brand-accent)] border border-[var(--color-border)]">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-2xl text-[var(--color-text-main)] font-medium">ARS Armonyco Reliability Standard™</h3>
          </div>
          <p className="text-[var(--color-text-main)] mb-4 font-medium italic text-lg">ARS defines when something is true enough to be governed.</p>
          <p className="text-[var(--color-text-muted)] text-sm mb-8 leading-relaxed">
            Most operational systems accept “confirmation.” ARS requires proof. It sets the minimum reliability requirements for each event class:
          </p>
          <ul className="list-disc pl-4 text-[var(--color-text-muted)] text-sm space-y-3 mb-8">
            <li>Evidence sufficiency</li>
            <li>Accountability chain</li>
            <li>Validity window</li>
            <li>Exception handling</li>
            <li>Default verdict behavior</li>
          </ul>
          <p className="text-[var(--color-brand-accent)] text-xs font-bold uppercase tracking-wider">ARS is how governance stops being aspiration and becomes infrastructure.</p>
        </Card>

        {/* AGS */}
        <Card id="ags" padding="lg" variant="default" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded bg-[var(--color-background)] flex items-center justify-center text-[var(--color-brand-accent)] border border-[var(--color-border)]">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl text-[var(--color-text-main)] font-medium">AGS Armonyco Governance Scorecard™</h3>
          </div>
          <p className="text-[var(--color-text-main)] mb-4 font-medium italic text-lg">AGS is the buyer-grade surface of trust.</p>
          <p className="text-[var(--color-text-muted)] text-sm mb-8 leading-relaxed">
            Organizations fail at institutional scale because trust is informal. Performance is narrated. Risk is assumed. Governance is implied. AGS converts operational truth into a readable, comparable signal that capital, insurers, and buyers can rely on without relationships, intuition, or stories.
          </p>
          <div className="space-y-4 mb-8 text-sm bg-[var(--color-background)] p-6 rounded-lg border border-[var(--color-border)]">
            <p className="text-[var(--color-text-subtle)] uppercase text-[10px] tracking-widest font-bold">A scorecard is only credible when:</p>
            <ul className="list-disc pl-4 text-[var(--color-text-muted)] space-y-2">
              <li>It is built on governed reality, not reported activity</li>
              <li>It is comparable across operators and assets</li>
              <li>It is defensible across time, not a snapshot</li>
              <li>It is evidence-weighted, not opinion-weighted</li>
              <li>It reflects what is governed and what remains risk</li>
            </ul>
          </div>
          <p className="text-[var(--color-brand-accent)] text-xs font-bold uppercase tracking-wider">AGS is the trust surface that turns governance into a portfolio signal.</p>
        </Card>
      </div>
    </section>
  );
};
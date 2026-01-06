import React from 'react';
import { Database, Network, Shield, FileCheck, Cpu } from '../ui/Icons';
import { Card } from '../ui/Card';

export const Constructs: React.FC = () => {
  return (
    <section id="core" className="py-24 px-6 md:px-24 bg-[var(--color-background)] border-b border-[var(--color-border)] scroll-mt-20">
      <div className="mb-20">
        <h2 className="text-4xl text-[var(--color-text-main)] font-light mb-4">The Core Constructs</h2>
        <p className="text-[var(--color-text-muted)] text-lg">Infrastructure for Institutional Truth.</p>
      </div>

      <div className="flex flex-col gap-8">
        {/* AEM */}
        <Card id="aem" padding="lg" variant="default" className="scroll-mt-32">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            <div className="flex items-center gap-4 shrink-0 lg:w-[320px]">
              <div className="w-12 h-12 rounded bg-[var(--color-background)] flex items-center justify-center text-[var(--color-brand-accent)] border border-[var(--color-border)]">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl text-[var(--color-text-main)] font-medium">AEM - Armonyco Event Model™</h3>
                <p className="text-[var(--color-brand-accent)] text-[10px] font-bold uppercase tracking-widest">Institutional Memory</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[var(--color-text-main)] mb-3 font-medium italic text-xl leading-snug">The registry of institutional truth.</p>
              <p className="text-[var(--color-text-muted)] text-base leading-relaxed max-w-2xl">
                Registers every daily operational event as an immutable truth. It captures type, unit, guest, and channel, ensuring the organization no longer depends on memory or screenshots.
              </p>
            </div>
            <div className="hidden xl:block w-px h-16 bg-[var(--color-border)]"></div>
            <div className="lg:w-[300px] text-right">
              <p className="text-[var(--color-text-subtle)] text-[11px] font-black uppercase tracking-widest mb-2">Practical Result</p>
              <p className="text-[var(--color-text-muted)] text-sm italic font-medium">"Zero dependence on memory or prints."</p>
            </div>
          </div>
        </Card>

        {/* AOS */}
        <Card id="aos" padding="lg" variant="default" className="scroll-mt-32">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            <div className="flex items-center gap-4 shrink-0 lg:w-[320px]">
              <div className="w-12 h-12 rounded bg-[var(--color-background)] flex items-center justify-center text-[var(--color-brand-accent)] border border-[var(--color-border)]">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl text-[var(--color-text-main)] font-medium">AOS - Armonyco Operating System™</h3>
                <p className="text-[var(--color-brand-accent)] text-[10px] font-bold uppercase tracking-widest">Operational Sequence</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[var(--color-text-main)] mb-3 font-medium italic text-xl leading-snug">Transforming events into executable flow.</p>
              <p className="text-[var(--color-text-muted)] text-base leading-relaxed max-w-2xl">
                Takes the institutional truth and renders it into a sequence: classification, context gathering, and execution planning. It turns a "loose message" into a governed operational cycle.
              </p>
            </div>
            <div className="hidden xl:block w-px h-16 bg-[var(--color-border)]"></div>
            <div className="lg:w-[300px] text-right">
              <p className="text-[var(--color-text-subtle)] text-[11px] font-black uppercase tracking-widest mb-2">Practical Result</p>
              <p className="text-[var(--color-text-muted)] text-sm italic font-medium">"Events follow a defined factory flow."</p>
            </div>
          </div>
        </Card>

        {/* AIM */}
        <Card id="aim" padding="lg" variant="default" className="scroll-mt-32">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            <div className="flex items-center gap-4 shrink-0 lg:w-[320px]">
              <div className="w-12 h-12 rounded bg-[var(--color-background)] flex items-center justify-center text-[var(--color-brand-accent)] border border(--color-border)]">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl text-[var(--color-text-main)] font-medium">AIM - Armonyco Intelligence Matrix™</h3>
                <p className="text-[var(--color-brand-accent)] text-[10px] font-bold uppercase tracking-widest">4-Agent Harmony</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[var(--color-text-main)] mb-3 font-medium italic text-xl leading-snug">Autonomous execution workforce.</p>
              <p className="text-[var(--color-text-muted)] text-base leading-relaxed max-w-2xl">
                Uses 4 collaborative AI agents: Intake (understanding), Planning (deciding), Execution (communicating), and Verification (closure). Each event is solved with mapped actions and agent-level accountability.
              </p>
            </div>
            <div className="hidden xl:block w-px h-16 bg-[var(--color-border)]"></div>
            <div className="lg:w-[300px] text-right">
              <p className="text-[var(--color-text-subtle)] text-[11px] font-black uppercase tracking-widest mb-2">Practical Result</p>
              <p className="text-[var(--color-text-muted)] text-sm italic font-medium">"Accountable execution per AI agent."</p>
            </div>
          </div>
        </Card>

        {/* ARS */}
        <Card id="ars" padding="lg" variant="default" className="scroll-mt-32">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            <div className="flex items-center gap-4 shrink-0 lg:w-[320px]">
              <div className="w-12 h-12 rounded bg-[var(--color-background)] flex items-center justify-center text-[var(--color-brand-accent)] border border(--color-border)]">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl text-[var(--color-text-main)] font-medium">ARS - Armonyco Reliability System™</h3>
                <p className="text-[var(--color-brand-accent)] text-[10px] font-bold uppercase tracking-widest">Legal Protection</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[var(--color-text-main)] mb-3 font-medium italic text-xl leading-snug">Reliability standard and escalation thresholds.</p>
              <p className="text-[var(--color-text-muted)] text-base leading-relaxed max-w-2xl">
                Defines mandatory checks, prohibited actions, and evidence requirements. It identifies when to act autonomously and when to escalate to humans, ensuring total legal and operational safety.
              </p>
            </div>
            <div className="hidden xl:block w-px h-16 bg-[var(--color-border)]"></div>
            <div className="lg:w-[300px] text-right">
              <p className="text-[var(--color-text-subtle)] text-[11px] font-black uppercase tracking-widest mb-2">Practical Result</p>
              <p className="text-[var(--color-text-muted)] text-sm italic font-medium">"Secure boundaries for AI autonomy."</p>
            </div>
          </div>
        </Card>

        {/* AGS */}
        <Card id="ags" padding="lg" variant="default" className="scroll-mt-32">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
            <div className="flex items-center gap-4 shrink-0 lg:w-[320px]">
              <div className="w-12 h-12 rounded bg-[var(--color-background)] flex items-center justify-center text-[var(--color-brand-accent)] border border(--color-border)]">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl text-[var(--color-text-main)] font-medium">AGS - Armonyco Governance Scorecard™</h3>
                <p className="text-[var(--color-brand-accent)] text-[10px] font-bold uppercase tracking-widest">Performance Signal</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-[var(--color-text-main)] mb-3 font-medium italic text-xl leading-snug">Consolidation of cycle proof.</p>
              <p className="text-[var(--color-text-muted)] text-base leading-relaxed max-w-2xl">
                Groups every event scorecard into metrics by unit, group, or product. It populates the Control Tower with the final evidence-backed numbers required by property leadership.
              </p>
            </div>
            <div className="hidden xl:block w-px h-16 bg-[var(--color-border)]"></div>
            <div className="lg:w-[300px] text-right">
              <p className="text-[var(--color-text-subtle)] text-[11px] font-black uppercase tracking-widest mb-2">Practical Result</p>
              <p className="text-[var(--color-text-muted)] text-sm italic font-medium">"Evidence-backed proof of performance."</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
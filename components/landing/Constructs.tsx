import React from 'react';
import { Database, Network, Shield, FileCheck } from '../ui/Icons';

export const Constructs: React.FC = () => {
  return (
    <section id="core" className="py-24 px-6 md:px-24 bg-stone-50 border-b border-stone-200 scroll-mt-20">
      <div className="mb-20">
        <h2 className="text-4xl text-stone-900 font-light mb-4">The Core Constructs</h2>
        <p className="text-stone-500 text-lg">Infrastructure for Institutional Truth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AEM - Removed hover:shadow-md */}
        <div id="aem" className="bg-white p-10 rounded-xl border border-stone-200 scroll-mt-32 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded bg-stone-50 flex items-center justify-center text-armonyco-gold border border-stone-100">
                <Database className="w-6 h-6" />
            </div>
            <h3 className="text-2xl text-stone-900 font-medium">AEM Armonyco Event Model™</h3>
          </div>
          <p className="text-stone-900 mb-4 font-medium italic text-lg">AEM is the canonical model of reality.</p>
          <p className="text-stone-500 text-sm mb-8 leading-relaxed">
            Organizations fail at governance because “operations” are not structured. They happen in messages, calls, improvisations, supplier habits, informal approvals, and exceptions. AEM converts that chaos into a single governable unit: the Operational Event.
          </p>
          <div className="space-y-4 mb-8 text-sm bg-stone-50 p-6 rounded-lg border border-stone-100">
            <p className="text-stone-400 uppercase text-[10px] tracking-widest font-bold">An event is only valid when:</p>
            <ul className="list-disc pl-4 text-stone-600 space-y-2">
              <li>It is recognized and classified</li>
              <li>It is evaluated against a policy</li>
              <li>It receives a verdict (allow/deny/modify)</li>
              <li>It produces evidence</li>
              <li>It becomes auditable truth</li>
            </ul>
          </div>
          <p className="text-armonyco-gold text-xs font-bold uppercase tracking-wider">AEM is the grammar that makes governance possible.</p>
        </div>

        {/* AOS */}
        <div id="aos" className="bg-white p-10 rounded-xl border border-stone-200 scroll-mt-32 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded bg-stone-50 flex items-center justify-center text-armonyco-gold border border-stone-100">
                <Network className="w-6 h-6" />
            </div>
            <h3 className="text-2xl text-stone-900 font-medium">AOS Armonyco Operating System™</h3>
          </div>
          <p className="text-stone-900 mb-4 font-medium italic text-lg">AOS is the operating system for governed execution.</p>
          <p className="text-stone-500 text-sm mb-8 leading-relaxed">
            Not task management. Not workflow software. Not “ops tooling.” AOS is the layer that sits above operations and does three things - always:
          </p>
          <ul className="list-disc pl-4 text-stone-600 text-sm space-y-3 mb-8">
            <li>Captures operational events from the real world</li>
            <li>Decides through Decision-First Architecture (policy → verdict)</li>
            <li>Certifies through evidence, immutable history, and buyer-grade metrics</li>
          </ul>
          <p className="text-armonyco-gold text-xs font-bold uppercase tracking-wider">AOS is what your business becomes dependent on to remain governable.</p>
        </div>

        {/* ARS */}
        <div id="ars" className="bg-white p-10 rounded-xl border border-stone-200 scroll-mt-32 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded bg-stone-50 flex items-center justify-center text-armonyco-gold border border-stone-100">
                <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-2xl text-stone-900 font-medium">ARS Armonyco Reliability Standard™</h3>
          </div>
          <p className="text-stone-900 mb-4 font-medium italic text-lg">ARS defines when something is true enough to be governed.</p>
          <p className="text-stone-500 text-sm mb-8 leading-relaxed">
            Most operational systems accept “confirmation.” ARS requires proof. It sets the minimum reliability requirements for each event class:
          </p>
          <ul className="list-disc pl-4 text-stone-600 text-sm space-y-3 mb-8">
            <li>Evidence sufficiency</li>
            <li>Accountability chain</li>
            <li>Validity window</li>
            <li>Exception handling</li>
            <li>Default verdict behavior</li>
          </ul>
          <p className="text-armonyco-gold text-xs font-bold uppercase tracking-wider">ARS is how governance stops being aspiration and becomes infrastructure.</p>
        </div>

        {/* AGS */}
        <div id="ags" className="bg-white p-10 rounded-xl border border-stone-200 scroll-mt-32 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded bg-stone-50 flex items-center justify-center text-armonyco-gold border border-stone-100">
                <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl text-stone-900 font-medium">AGS Armonyco Governance Scorecard™</h3>
          </div>
          <p className="text-stone-900 mb-4 font-medium italic text-lg">AGS is the buyer-grade surface of trust.</p>
          <p className="text-stone-500 text-sm mb-8 leading-relaxed">
            Organizations fail at institutional scale because trust is informal. Performance is narrated. Risk is assumed. Governance is implied. AGS converts operational truth into a readable, comparable signal that capital, insurers, and buyers can rely on without relationships, intuition, or stories.
          </p>
          <div className="space-y-4 mb-8 text-sm bg-stone-50 p-6 rounded-lg border border-stone-100">
            <p className="text-stone-400 uppercase text-[10px] tracking-widest font-bold">A scorecard is only credible when:</p>
            <ul className="list-disc pl-4 text-stone-600 space-y-2">
              <li>It is built on governed reality, not reported activity</li>
              <li>It is comparable across operators and assets</li>
              <li>It is defensible across time, not a snapshot</li>
              <li>It is evidence-weighted, not opinion-weighted</li>
              <li>It reflects what is governed and what remains risk</li>
            </ul>
          </div>
          <p className="text-armonyco-gold text-xs font-bold uppercase tracking-wider">AGS is the trust surface that turns governance into a portfolio signal.</p>
        </div>
      </div>
    </section>
  );
};
import React from 'react';
import { Shield, Fingerprint, Scale, Activity, Lock } from '../ui/Icons';

export const Pillars: React.FC = () => {
  return (
    <section id="governance" className="py-24 px-6 md:px-24 bg-white border-b border-stone-200 scroll-mt-20">
      <div className="mb-16">
        <h2 className="text-4xl text-stone-900 font-light mb-4">Governance</h2>
        <p className="text-armonyco-gold uppercase tracking-widest text-sm mb-4">(Buyer-Grade, Non-Negotiable)</p>
        <p className="text-stone-500 max-w-3xl text-lg">
          These are not “KPIs.” They are the governance of an operational system that can be audited, underwritten, transferred, and trusted.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Pillar 1 */}
        <div id="governed-value" className="group border-l-2 border-armonyco-gold pl-8 py-2 scroll-mt-32">
          <div className="flex items-center gap-3 mb-4">
             <span className="text-armonyco-gold font-mono text-sm">01</span>
             <h3 className="text-2xl text-stone-900 font-medium">Governed Value™ (€) Lifetime</h3>
          </div>
          <p className="text-lg text-stone-900 mb-6">Governed Value is money that becomes institutional.</p>
          <p className="text-stone-600 mb-6 max-w-4xl leading-relaxed">
            Not projected. Not estimated. Not “attributed by a dashboard.” Certified cashflow, governed end-to-end by policy-driven decisions, with traceable responsibility and proof of execution.
          </p>
          <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
            <h4 className="text-sm text-stone-500 uppercase tracking-wider mb-4">What this unlocks:</h4>
            <ul className="space-y-3 text-stone-600">
              <li><span className="text-stone-900 font-medium">Value that survives people.</span> Your results no longer depend on who remembers, who is careful, or who is present.</li>
              <li><span className="text-stone-900 font-medium">Value that survives disputes.</span> Every euro has a governance trail, not a narrative.</li>
              <li><span className="text-stone-900 font-medium">Value that survives scaling.</span> A single system governs execution across 1 asset or 1,000 with the same standards.</li>
              <li><span className="text-stone-900 font-medium">Value that survives ownership change.</span> Value becomes transferable because it is provable.</li>
            </ul>
          </div>
          <p className="mt-6 text-armonyco-gold italic font-medium">Governed Value is the difference between “we perform” and “we can prove performance without trust.”</p>
        </div>

        {/* Pillar 2 */}
        <div id="decision-log" className="group border-l-2 border-stone-200 hover:border-stone-900 transition-colors pl-8 py-2 scroll-mt-32">
           <div className="flex items-center gap-3 mb-4">
             <span className="text-stone-400 font-mono text-sm">02</span>
             <h3 className="text-2xl text-stone-900 font-medium">Immutable Decision Log</h3>
          </div>
          <p className="text-stone-600 mb-4 max-w-4xl leading-relaxed">
             An organization becomes contestable when decisions vanish into chat, memory, and informal exceptions. Armonyco ends that.
          </p>
          <div className="font-mono text-sm bg-stone-50 border border-stone-200 p-4 inline-block mb-6 text-stone-900 rounded">
            Policy → Verdict → Evidence → Decision → Responsible entity
          </div>
          <p className="text-stone-600 mb-4">This is not “logging.” It is institutional continuity.</p>
           <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
            <h4 className="text-sm text-stone-500 uppercase tracking-wider mb-4">What this unlocks:</h4>
            <ul className="space-y-3 text-stone-600">
              <li><span className="text-stone-900 font-medium">Contest-proof operations.</span> Disputes lose power when truth is structural.</li>
              <li><span className="text-stone-900 font-medium">Board-grade accountability.</span> Responsibility is demonstrable, not inferred.</li>
              <li><span className="text-stone-900 font-medium">Operational sovereignty.</span> You don’t depend on a vendor, a team, or a manager’s personal system to know what is true.</li>
              <li><span className="text-stone-900 font-medium">A compounding asset.</span> History becomes a moat: irreplaceable, non-replicable, cumulative.</li>
            </ul>
          </div>
          <p className="mt-6 text-stone-400 italic">The log is not a feature. It is the foundation of governance.</p>
        </div>

        {/* Pillar 3 */}
        <div id="compliance-rate" className="group border-l-2 border-stone-200 hover:border-stone-900 transition-colors pl-8 py-2 scroll-mt-32">
           <div className="flex items-center gap-3 mb-4">
             <span className="text-stone-400 font-mono text-sm">03</span>
             <h3 className="text-2xl text-stone-900 font-medium">Autonomous Compliance Rate™</h3>
          </div>
          <p className="text-stone-600 mb-4">Most systems “monitor compliance.” Armonyco validates compliance with policy-driven verdicts.</p>
          <p className="text-stone-600 mb-6 max-w-4xl leading-relaxed">
            Autonomous Compliance Rate measures the share of operational events resolved autonomously, within policy, with no shortcuts, and with complete traceability. This is not automation for convenience. It is autonomy that produces institutional reliability.
          </p>
           <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
            <h4 className="text-sm text-stone-500 uppercase tracking-wider mb-4">What this unlocks:</h4>
            <ul className="space-y-3 text-stone-600">
              <li><span className="text-stone-900 font-medium">Compliance that scales.</span> Not by hiring, training, or reminding: by enforcing.</li>
              <li><span className="text-stone-900 font-medium">Risk reduction at the point of execution.</span> Non-compliance is stopped where it happens, not reported after.</li>
              <li><span className="text-stone-900 font-medium">A compliance posture that can be underwritten.</span> Because it is measurable and evidenced, not claimed.</li>
              <li><span className="text-stone-900 font-medium">A system that becomes stricter over time.</span> Exceptions don’t create chaos—they create new standards.</li>
            </ul>
          </div>
          <p className="mt-6 text-stone-400 italic">When compliance becomes autonomous, governance becomes inevitable.</p>
        </div>

        {/* Pillar 4 */}
        <div id="human-risk" className="group border-l-2 border-stone-200 hover:border-stone-900 transition-colors pl-8 py-2 scroll-mt-32">
           <div className="flex items-center gap-3 mb-4">
             <span className="text-stone-400 font-mono text-sm">04</span>
             <h3 className="text-2xl text-stone-900 font-medium">Human Risk Exposure</h3>
          </div>
          <p className="text-stone-600 mb-4">
            Human intervention is not only cost. It is volatility—the source of error, negotiation, inconsistency, and missing proof.
          </p>
          <p className="text-stone-600 mb-6 max-w-4xl leading-relaxed">
            Human Risk Exposure measures how much of your operation still relies on humans to decide, approve, interpret, or “make it work.”
          </p>
           <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
            <h4 className="text-sm text-stone-500 uppercase tracking-wider mb-4">What this unlocks:</h4>
            <ul className="space-y-3 text-stone-600">
              <li><span className="text-stone-900 font-medium">Reduced volatility.</span> The same event produces the same verdict under the same policy.</li>
              <li><span className="text-stone-900 font-medium">Fewer catastrophic failures.</span> The highest-cost mistakes are prevented structurally.</li>
              <li><span className="text-stone-900 font-medium">Less operational blackmail.</span> When knowledge and control are locked inside people, you are hostage to them.</li>
              <li><span className="text-stone-900 font-medium">Higher governance maturity.</span> You can separate “human judgment” from “human weakness.”</li>
            </ul>
          </div>
          <p className="mt-6 text-stone-400 italic">Armonyco doesn’t replace humans. It removes humans from the parts of the system where humans create unmeasurable risk.</p>
        </div>

        {/* Pillar 5 */}
        <div id="residual-risk" className="group border-l-2 border-stone-200 hover:border-stone-900 transition-colors pl-8 py-2 scroll-mt-32">
           <div className="flex items-center gap-3 mb-4">
             <span className="text-stone-400 font-mono text-sm">05</span>
             <h3 className="text-2xl text-stone-900 font-medium">Residual Risk Rate</h3>
          </div>
          <p className="text-stone-600 mb-4">
            Residual Risk is what remains outside governance: the events your organization cannot capture, standardize, decide, or prove.
          </p>
          <p className="text-stone-600 mb-6 max-w-4xl leading-relaxed">
             Most businesses accept this as “the cost of reality.” Armonyco treats it as operational debt.
          </p>
           <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
            <h4 className="text-sm text-stone-500 uppercase tracking-wider mb-4">What this unlocks:</h4>
            <ul className="space-y-3 text-stone-600">
              <li><span className="text-stone-900 font-medium">Clear boundaries of control.</span> You always know what is governed vs. what is exposed.</li>
              <li><span className="text-stone-900 font-medium">A roadmap driven by risk, not feature requests.</span> Every improvement reduces residual risk or increases governed value.</li>
              <li><span className="text-stone-900 font-medium">A compounding governance perimeter.</span> Each exception becomes a class; each class becomes a policy; each policy becomes autonomy.</li>
              <li><span className="text-stone-900 font-medium">A system designed for irreversibility.</span> The governed perimeter expands until the “outside” becomes intolerable.</li>
            </ul>
          </div>
          <p className="mt-6 text-stone-400 italic">Residual Risk Rate is the metric that tells the truth about maturity—because it measures what you cannot yet control.</p>
        </div>

      </div>
    </section>
  );
};
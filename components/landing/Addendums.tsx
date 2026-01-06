import React from 'react';

const AddendumCard: React.FC<{ number: string; title: string; subtitle?: string; children: React.ReactNode }> = ({ number, title, subtitle, children }) => (
  <div className="border-b border-[var(--color-border)] py-12 last:border-b-0">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/4">
        <span className="text-[var(--color-text-subtle)] font-mono text-sm block mb-2">{number}</span>
        <h3 className="text-xl text-[var(--color-text-main)] font-medium">{title}</h3>
        {subtitle && <p className="text-[var(--color-text-muted)] text-sm mt-1">{subtitle}</p>}
      </div>
      <div className="w-full md:w-3/4 space-y-4 text-[var(--color-text-muted)] leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

export const Addendums: React.FC = () => {
  return (
    <section id="manifesto" className="py-24 px-6 md:px-24 bg-[var(--color-surface)] scroll-mt-20 border-b border-[var(--color-border)]">
      <h2 className="text-3xl text-[var(--color-text-main)] font-light mb-12 border-b border-[var(--color-border)] pb-6">Manifesto</h2>

      <AddendumCard number="01" title="Decision-First Architecture">
        <p className="text-[var(--color-text-main)] mb-2 font-medium">Most systems “support decisions.” Armonyco makes a stronger claim: nothing is valid until it has been decided.</p>
        <p>A Decision-First system does not optimize workflows. It governs reality.</p>
        <p className="mt-4"><strong className="text-[var(--color-text-main)]">What this unlocks:</strong></p>
        <ul className="list-disc pl-4 space-y-2">
          <li>Validity over activity. You don’t manage “things happening.” You manage what is allowed, denied, or modified under policy.</li>
          <li>Institutional consistency. The same event produces the same verdict under the same policy—across teams, time zones, vendors, and leadership changes.</li>
          <li>Responsibility that cannot be blurred. When every event produces a verdict, accountability becomes structural rather than political.</li>
          <li>A system that is harder than humans. It doesn’t “suggest.” It decides.</li>
        </ul>
        <p className="mt-4 italic text-[var(--color-brand-accent)] font-medium">Armonyco’s output is not “automation.” It is verdicts + proof, at the point where execution becomes risk.</p>
      </AddendumCard>

      <AddendumCard number="02" title="The Overlay Principle" subtitle="(PMS-Agnostic by Design)">
        <p>Armonyco is designed to sit above existing systems, not replace them. That choice creates a different kind of value: governance portability.</p>
        <p className="mt-4"><strong className="text-[var(--color-text-main)]">What this unlocks:</strong></p>
        <ul className="list-disc pl-4 space-y-2">
          <li>You don’t bet the company on migration. Truth is not trapped inside a tool rollout.</li>
          <li>Governance survives stack changes. You can change platforms and vendors without losing the system of truth.</li>
          <li>Armonyco becomes the constant. The operational substrate can change; the truth layer stays.</li>
        </ul>
        <p className="mt-4">This is how Armonyco avoids being “just another system.” It becomes the layer that makes every other system accountable.</p>
      </AddendumCard>

      <AddendumCard number="03" title="Friendly Frontend. Adult Backend.">
        <p>Armonyco is built on a deliberate asymmetry: UX is frictionless. Core is institutional, immutable, and traceable. This is not a design preference. It is a strategic structure.</p>
        <p className="mt-4"><strong className="text-[var(--color-text-main)]">What this unlocks:</strong></p>
        <ul className="list-disc pl-4 space-y-2">
          <li>People don’t need to “adopt governance.” They simply operate.</li>
          <li>Truth is enforced behind the scenes. The system stays rigorous even when the world stays messy.</li>
          <li>Simplicity becomes a right, not a risk. The interface can stay natural while the backend stays court-grade.</li>
        </ul>
        <p className="mt-4 italic text-[var(--color-brand-accent)] font-medium">Armonyco makes governance invisible—without making it weak.</p>
      </AddendumCard>

      <AddendumCard number="04" title="Multi-Stakeholder Native" subtitle="(The Operator Is Not the Center)">
        <p>Armonyco is not “operator-first.” It is stakeholder-native. The operator is the operational user, not the system’s center. And that single shift changes what the product fundamentally is.</p>
        <p className="mt-4"><strong className="text-[var(--color-text-main)]">What this unlocks:</strong></p>
        <ul className="list-disc pl-4 space-y-2">
          <li>One language across power. Operators execute, while owners/buyers/insurers read certified truth.</li>
          <li>The operator becomes uncontestable. The value is no longer “how much I worked,” but “what value I governed with proof.”</li>
          <li>Board-grade legibility. Armonyco is built to be read by stakeholders who don’t touch operations—because they don’t need to.</li>
        </ul>
        <p className="mt-4">This is the core: the system does not exist to help someone work. It exists to protect value, reduce risk, and certify responsibility.</p>
      </AddendumCard>

      <AddendumCard number="05" title="WhatsApp Is Not the Product." subtitle="It’s the “Dirty World Interface.”">
        <p>Armonyco is designed to govern execution where execution actually happens. WhatsApp is not the product. It is the interface of the messy real world.</p>
        <p className="mt-4"><strong className="text-[var(--color-text-main)]">What this unlocks:</strong></p>
        <ul className="list-disc pl-4 space-y-2">
          <li>Control without behavioral change. Vendors, technicians, and staff don’t need new tools to become governable.</li>
          <li>Verification instead of digitization. “Armonyco doesn’t digitize suppliers. It makes them verifiable.”</li>
          <li>Truth extraction from informal reality. The world responds in chat; Armonyco turns that into structured truth.</li>
        </ul>
        <p className="mt-4 italic text-[var(--color-brand-accent)] font-medium">This is a huge point: Armonyco feeds on disorder—and becomes stronger because of it.</p>
      </AddendumCard>

      <AddendumCard number="06" title="Knowledge Capitalization" subtitle="(The Moat That Compounds)">
        <p>Armonyco treats operations as a compounding asset: every error becomes a rule, every exception becomes a SOP, every incident becomes training. This is not documentation. It is institutional accumulation.</p>
        <p className="mt-4"><strong className="text-[var(--color-text-main)]">What this unlocks:</strong></p>
        <ul className="list-disc pl-4 space-y-2">
          <li>People become replaceable. The system keeps the intelligence.</li>
          <li>Reliability increases over time. The system improves because reality is messy, not despite it.</li>
          <li>History becomes a barrier. The longer Armonyco runs, the less replicable the business becomes.</li>
        </ul>
        <p className="mt-4">Most products scale by hiring. Armonyco scales by accumulating governance.</p>
      </AddendumCard>

      <AddendumCard number="07" title="Irreversibility" subtitle="(Structural Lock-In, Not Contractual)">
        <p>A tool can be replaced. A system of truth cannot. The moment Armonyco becomes the source of audit, history, certifications, and proof, turning it off becomes traumatic.</p>
        <p className="mt-4"><strong className="text-[var(--color-text-main)]">What this unlocks:</strong></p>
        <ul className="list-disc pl-4 space-y-2">
          <li>Governance continuity. You can change people, vendors, and operators without losing the truth layer.</li>
          <li>A new category of defensibility. The moat is not features; it is historical, operational, and institutional.</li>
          <li>Exit-grade infrastructure. Armonyco is not “a product that grows with adoption.” It grows with irreversibility.</li>
        </ul>
        <p className="mt-4 italic text-[var(--color-brand-accent)] font-medium">This is the power statement: Armonyco is designed to become indispensable, irreversible, and non-replaceable.</p>
      </AddendumCard>

      <AddendumCard number="08" title="The Iron Clause" subtitle="(What Armonyco Refuses to Build)">
        <p>Armonyco’s roadmap is governed by a hard rule: Every feature must strengthen at least one of:</p>
        <ol className="list-decimal pl-4 space-y-1">
          <li>Increase Governed Cashflow™</li>
          <li>Reduce Human Risk</li>
          <li>Increase Structural Lock-In</li>
        </ol>
        <p className="mt-2">If it doesn’t produce certified value, traceable verdicts, or structural dependence—it is not built.</p>
        <p className="mt-4"><strong className="text-[var(--color-text-main)]">What this unlocks:</strong></p>
        <ul className="list-disc pl-4 space-y-2">
          <li>A product that can’t be diluted.</li>
          <li>A system that becomes more inevitable over time.</li>
          <li>A company that compounds defensibility instead of features.</li>
        </ul>
        <p className="mt-4">This clause is why Armonyco stays aligned even under pressure.</p>
      </AddendumCard>

      <AddendumCard number="09" title="Economic Alignment" subtitle="(Value Participation, Not Taxation)">
        <p>Armonyco does not “tax what already exists.” It participates only in the value it governs. This is not a pricing statement. It’s a power alignment:</p>
        <p className="mt-4"><strong className="text-[var(--color-text-main)]">What this unlocks:</strong></p>
        <ul className="list-disc pl-4 space-y-2">
          <li>Trust at board level. The system’s incentives are tied to certified outcomes, not seat count or usage.</li>
          <li>Governance-driven growth. The business model forces the product to deepen governance, not expand noise.</li>
          <li>A buyer-grade narrative. Value becomes measurable, attributable, and governed—or it doesn’t exist.</li>
        </ul>
      </AddendumCard>

      <AddendumCard number="10" title="Long-Term Design" subtitle="(Standard, Language, Fiduciary System)">
        <p>Armonyco is designed to become: an operational standard, a common language, a fiduciary system, an infrastructure layer. This is the real endgame: not “a better tool,” but a shared definition of operational truth.</p>
        <p className="mt-4"><strong className="text-[var(--color-text-main)]">What this unlocks:</strong></p>
        <ul className="list-disc pl-4 space-y-2">
          <li>Standardization without centralization. Many stakeholders, one truth.</li>
          <li>Transferable governance. The system becomes readable by capital, not just by operators.</li>
          <li>The highest form of defensibility: becoming the standard rather than “a vendor.”</li>
        </ul>
      </AddendumCard>


    </section>
  );
};
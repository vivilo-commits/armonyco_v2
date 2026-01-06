import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-16 px-6 md:px-24 bg-[var(--color-brand-primary)] text-white">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid - Strict 4 columns for perfect equidistance */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <img src="/assets/logo-footer.png" alt="Armonyco" className="h-36 object-contain" />
            <p className="text-stone-400 text-sm leading-relaxed">
              The Operational Decision OS™ that governs flexible hospitality. Turning operational chaos into predictable cashflow.
            </p>
          </div>

          {/* Governance Links */}
          <div className="md:pt-14">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-subtle)] mb-6">Governance</h4>
            <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
              <li><a href="#governed-value" className="hover:text-white transition-colors">Governed Cashflow™</a></li>
              <li><a href="#decision-log" className="hover:text-white transition-colors">Decision Log</a></li>
              <li><a href="#compliance-rate" className="hover:text-white transition-colors">Compliance Rate</a></li>
              <li><a href="#human-risk" className="hover:text-white transition-colors">Human Risk</a></li>
              <li><a href="#residual-risk" className="hover:text-white transition-colors">Residual Risk</a></li>
            </ul>
          </div>

          {/* Core Links */}
          <div className="md:pt-14">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-subtle)] mb-6">Core</h4>
            <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
              <li><a href="#aem" className="hover:text-white transition-colors">AEM - Armonyco Event Model™</a></li>
              <li><a href="#aos" className="hover:text-white transition-colors">AOS - Armonyco Operating System™</a></li>
              <li><a href="#aim" className="hover:text-white transition-colors">AIM - Armonyco Intelligence Matrix™</a></li>
              <li><a href="#ars" className="hover:text-white transition-colors">ARS - Armonyco Reliability System™</a></li>
              <li><a href="#ags" className="hover:text-white transition-colors">AGS - Armonyco Governance Scorecard™</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="md:pt-14">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--color-text-subtle)] mb-6">Resources</h4>
            <ul className="space-y-3 text-sm text-[var(--color-text-muted)]">
              <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#manifesto" className="hover:text-white transition-colors">Manifesto</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--color-brand-secondary)] flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest">© 2024 Armonyco. System of Truth.</span>
          <div className="flex gap-6 text-xs text-[var(--color-text-muted)]">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
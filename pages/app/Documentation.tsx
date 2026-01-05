import React, { useState } from 'react';
import { Search, ChevronRight, FileText, Code, Settings, Zap, Database, CreditCard, ArrowRight, Shield, Layers, Activity } from '../../components/ui/Icons';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';

export const DocumentationView: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<{ title: string; type: string } | null>(null);

  const openDoc = (title: string, type: string) => {
    setActiveDoc({ title, type });
  };

  const renderDocContent = (type: string) => {
    switch (type) {
      case 'KICKSTART':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="p-6 bg-white/[0.03] rounded-2xl text-sm border border-white/10 shadow-inner backdrop-blur-md">
              <h4 className="font-black text-[10px] uppercase tracking-[0.3em] mb-4 text-[var(--color-brand-accent)] italic">Prerequisites Matrix</h4>
              <ul className="space-y-3 text-white/60 font-medium">
                <li className="flex items-start gap-3"><div className="w-1 h-1 bg-[var(--color-brand-accent)] rounded-full mt-2"></div> Active Organization Protocol</li>
                <li className="flex items-start gap-3"><div className="w-1 h-1 bg-[var(--color-brand-accent)] rounded-full mt-2"></div> WhatsApp Business API Credentials</li>
                <li className="flex items-start gap-3"><div className="w-1 h-1 bg-[var(--color-brand-accent)] rounded-full mt-2"></div> PMS Connectivity Topology</li>
              </ul>
            </div>
            <div className="space-y-6">
              <div className="group">
                <h3 className="text-lg font-light text-white mb-2 flex items-center gap-2 group-hover:text-[var(--color-brand-accent)] transition-colors">01 <span className="w-4 h-[1px] bg-white/20"></span> Environment Sync</h3>
                <p className="text-sm text-white/40 leading-relaxed italic">
                  Configure your organization profile in the Settings panel. Verify billing identity before activating Core Intelligence Modules.
                </p>
              </div>
              <div className="group">
                <h3 className="text-lg font-light text-white mb-2 flex items-center gap-2 group-hover:text-[var(--color-brand-accent)] transition-colors">02 <span className="w-4 h-[1px] bg-white/20"></span> Neural Channels</h3>
                <p className="text-sm text-white/40 leading-relaxed italic">
                  Map your communication channels in the Activation matrix. These feeds are ingested by Agent Amelia for autonomous governance.
                </p>
              </div>
              <div className="aspect-video bg-black/40 rounded-3xl flex flex-col items-center justify-center border border-dashed border-white/10 group cursor-pointer hover:border-white/20 transition-all">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/20 group-hover:scale-110 transition-transform"><ArrowRight size={20} /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mt-4 italic">Neural Stream Tutorial.mp4</span>
              </div>
            </div>
          </div>
        );
      case 'API':
        return (
          <div className="space-y-8 animate-fade-in">
            <p className="text-sm text-white/60 leading-relaxed italic">
              Ingest institutional events into the AEM - Armonyco Event Model™ for real-time validation and ledgering.
            </p>
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">Protocol Endpoints</h3>
              <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-white/5 font-mono text-xs text-stone-400 overflow-x-auto shadow-2xl">
                <div className="mb-4 flex items-center gap-4"><span className="text-emerald-500 font-black px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20 text-[9px]">POST</span> <span className="opacity-80">/v1/events/ingest</span></div>
                <div className="mb-4 flex items-center gap-4"><span className="text-blue-500 font-black px-2 py-0.5 bg-blue-500/10 rounded border border-blue-500/20 text-[9px]">GET</span>  <span className="opacity-80">/v1/agents/{"{id}"}/status</span></div>
                <div className="flex items-center gap-4"><span className="text-amber-500 font-black px-2 py-0.5 bg-amber-500/10 rounded border border-amber-500/20 text-[9px]">PUT</span>   <span className="opacity-80">/v1/governance/rules</span></div>
              </div>
            </div>
            <div className="p-6 bg-emerald-500/5 text-emerald-500/80 border border-emerald-500/10 rounded-2xl text-sm italic backdrop-blur-md">
              <strong className="block mb-2 font-black uppercase tracking-[0.2em] text-[10px] text-emerald-500 shadow-sm">Throughput Limitation</strong>
              Institutional tier allows 100 req/min. Neural tier offers infinite vertical scaling.
            </div>
          </div>
        );
      case 'PROCESS':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-sm text-white/40 italic">
              Armonyco governs 12 standard hospitality topologies covering the recursive guest lifecycle.
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Booking Intelligence", "Pre-Arrival Logic", "Ingress Protocols", "Cognitive Support",
                "Maintenance Topology", "Service Coordination", "Concierge Routines", "Egress Negotiation",
                "Settlement Process", "Post-Stay Sentiment", "Reputation Governance", "Engagement Loops"
              ].map((flow, i) => (
                <div key={i} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[11px] font-bold text-white/60 flex items-center gap-4 group hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-default">
                  <span className="w-6 h-6 rounded-lg bg-white/5 text-white/30 flex items-center justify-center font-mono text-[10px] font-black group-hover:text-[var(--color-brand-accent)] transition-colors italic">{i + 1}</span>
                  {flow}
                </div>
              ))}
            </div>
          </div>
        );
      case 'CONFIG':
        return (
          <div className="space-y-8 animate-fade-in">
            <p className="text-sm text-white/40 leading-relaxed italic">
              Cognitive agents are tailored to match your institutional identity and risk tolerance.
            </p>
            <div className="space-y-6">
              <div className="group">
                <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] text-white/20 mb-2 group-hover:text-white/40 transition-colors">Cognitive Persona</h4>
                <p className="text-sm text-white/60 font-medium tracking-tight">Adjust formality vectors, empathy weight, and linguistic density.</p>
              </div>

              <div className="group">
                <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] text-white/20 mb-2 group-hover:text-white/40 transition-colors">Escalation Logic</h4>
                <p className="text-sm text-white/60 font-medium tracking-tight">Define deterministic hand-off triggers (e.g. Sentiment &lt; 0.35).</p>
              </div>

              <div className="p-6 bg-[var(--color-brand-primary)]/5 border border-[var(--color-brand-primary)]/10 rounded-3xl backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform"><Shield size={40} /></div>
                <div className="text-[10px] uppercase tracking-[0.4em] font-black text-[var(--color-brand-primary)] mb-3 italic">Institutional Wisdom</div>
                <p className="text-xs text-white/80 leading-relaxed font-bold italic">
                  Utilize Shadow Mode to audit new logic against historical streams before global deployment.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Resource allocation in progress...</div>;
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in pb-20">
      <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Layers className="text-[var(--color-brand-accent)] w-6 h-6" />
            <h1 className="text-2xl text-white font-light uppercase tracking-tight">Collective <span className="text-[var(--color-brand-accent)] italic tracking-normal">Intelligence</span></h1>
          </div>
          <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Cryptographic guides, neural references, and institutional playbooks to master the Armonyco layer.</p>
        </div>
      </header>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {[
          { title: 'Neural Kickstart', type: 'KICKSTART', icon: <Zap />, desc: 'Deploy first agent in < 5m' },
          { title: 'AEM - Armonyco Event Model™', type: 'API', icon: <Code />, desc: 'Full event model reference' },
          { title: 'Process Logic', type: 'PROCESS', icon: <Database />, desc: 'The 12 hospitality flows' },
          { title: 'Agent Tuning', type: 'CONFIG', icon: <Settings />, desc: 'Voice & Escalation rules' }
        ].map((doc, i) => (
          <Card
            key={i}
            padding="lg"
            className="cursor-pointer group bg-black/40 border-white/5 backdrop-blur-xl hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 rounded-3xl flex flex-col justify-between h-56 relative overflow-hidden"
            onClick={() => openDoc(doc.title, doc.type)}
          >
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-[var(--color-brand-accent)]/5 transition-all"></div>
            <div>
              <div className="w-10 h-10 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-white/20 group-hover:text-[var(--color-brand-accent)] transition-all duration-500 group-hover:scale-110 shadow-lg">
                {React.isValidElement(doc.icon) ? React.cloneElement(doc.icon as React.ReactElement<any>, { size: 20 }) : null}
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-3 group-hover:text-[var(--color-brand-accent)] transition-colors">{doc.title}</h3>
              <p className="text-[10px] text-white/30 font-bold leading-relaxed group-hover:text-white/50 transition-colors uppercase tracking-widest">{doc.desc}</p>
            </div>
            <div className="flex items-center text-[9px] font-black uppercase tracking-[0.3em] text-white/10 group-hover:text-white/40 transition-all mt-4 border-t border-white/5 pt-4">
              Access Node <ChevronRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Changelog */}
        <div className="relative">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl text-white font-light tracking-tight flex items-center gap-4">
              <Activity size={20} className="text-emerald-500" /> Neural Changelog
            </h2>
            <span className="px-3 py-1 bg-white/5 text-white/40 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest italic">v.2.4.0_STABLE</span>
          </div>

          <div className="space-y-12 relative">
            <div className="absolute left-[7px] top-2 bottom-4 w-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent"></div>

            <div className="relative pl-10 group">
              <span className="absolute left-[3px] top-2 w-2.5 h-2.5 rounded-full bg-emerald-500 border-[3px] border-zinc-950 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-10 transition-transform group-hover:scale-125"></span>
              <div className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] mb-2 group-hover:text-emerald-500/50 transition-colors italic">Shift: Today</div>
              <p className="text-white/80 text-sm font-bold tracking-tight leading-relaxed">Added 'Pause' state to Product Marketplace for operational flexibility.</p>
            </div>

            <div className="relative pl-10 group opacity-60 hover:opacity-100 transition-opacity">
              <span className="absolute left-[3px] top-2 w-2.5 h-2.5 rounded-full bg-white/10 border-[3px] border-zinc-950 z-10 transition-transform group-hover:scale-125"></span>
              <div className="text-[9px] text-white/20 font-black uppercase tracking-[0.3em] mb-2 italic">Shift: Yesterday</div>
              <p className="text-white/60 text-sm font-bold tracking-tight leading-relaxed">Released Global Core Constructs Pass (AEM, AOS, AIM, ARS, AGS Architecture).</p>
            </div>
          </div>
        </div>

        {/* System Capabilities / Icons Summary */}
        <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:rotate-12 transition-transform duration-1000"><Shield size={120} /></div>
          <h2 className="text-sm font-black text-white/20 uppercase tracking-[0.4em] mb-10">System Identity</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[var(--color-brand-accent)]"><Shield size={16} /></div>
              <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">Governed</div>
            </div>
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-emerald-500"><Zap size={16} /></div>
              <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">Autonomous</div>
            </div>
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-blue-500"><Layers size={16} /></div>
              <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">Orchestrated</div>
            </div>
            <div className="space-y-3">
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40"><FileText size={16} /></div>
              <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">Immutable</div>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Content Modal */}
      <Modal
        isOpen={!!activeDoc}
        onClose={() => setActiveDoc(null)}
        title={activeDoc?.title || 'DOCUMENTATION_UPLINK'}
        width="xl"
      >
        <div className="p-10 bg-zinc-950 text-white min-h-[500px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-brand-accent)]/5 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            {activeDoc && renderDocContent(activeDoc.type)}
          </div>
          <div className="mt-12 flex justify-end">
            <Button variant="secondary" onClick={() => setActiveDoc(null)} className="rounded-xl font-black uppercase tracking-widest text-[9px]">Terminate Session</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
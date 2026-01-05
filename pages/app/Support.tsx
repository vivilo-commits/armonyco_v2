import React from 'react';
import { CheckCircle, Mail, Phone, Plus, Activity, Headphones, AlertTriangle } from '../../components/ui/Icons';
import { AnimatedButton } from '../../components/ui/AnimatedButton';
import { Card } from '../../components/ui/Card';
import { Tooltip } from '../../components/ui/Tooltip';

export const SupportView: React.FC = () => {
    return (
        <div className="p-8 max-w-5xl mx-auto animate-fade-in pb-20">
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Headphones className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Institutional Support <span className="text-white/40 italic tracking-normal">Terminal</span></h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Direct access to the Armonyco Orchestration Engineers. 24/7 Priority Availability.</p>
                </div>
                <div className="hover:scale-105 transition-transform">
                    <AnimatedButton
                        text="ESTABLISH FEED (NEW TICKET)"
                        icon={<Plus size={16} />}
                        width="240px"
                        onClick={() => { }}
                    />
                </div>
            </header>

            {/* Support Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

                {/* System Status */}
                <Card padding="lg" className="bg-black/40 border-white/5 backdrop-blur-xl relative group overflow-hidden rounded-3xl">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Activity size={48} /></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-lg">
                            <CheckCircle size={24} />
                        </div>
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-2">Systems Status</h3>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <p className="text-white text-lg font-light tracking-tight italic opacity-90">Core Nominal</p>
                    </div>
                </Card>

                {/* Email Support */}
                <Card padding="lg" className="bg-black/40 border-white/5 backdrop-blur-xl relative group overflow-hidden rounded-3xl">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Mail size={48} /></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 border border-white/10 shadow-lg group-hover:text-white transition-colors">
                            <Mail size={24} />
                        </div>
                    </div>
                    <h3 className="text-sm font-black text-white/40 uppercase tracking-[0.2em] mb-2">Encrypted Comms</h3>
                    <p className="text-white/80 text-sm font-bold tracking-tight">support@armonyco.ai</p>
                    <p className="text-[9px] text-white/20 uppercase font-black tracking-widest mt-2">&lt; 2h Response SLA</p>
                </Card>

                {/* Emergency Line */}
                <Card padding="lg" className="bg-[var(--color-brand-accent)]/[0.03] border-[var(--color-brand-accent)]/10 backdrop-blur-xl relative group overflow-hidden rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.05)]">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-[var(--color-brand-accent)]"><Headphones size={48} /></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-12 h-12 bg-[var(--color-brand-accent)]/10 rounded-2xl flex items-center justify-center text-[var(--color-brand-accent)] border border-[var(--color-brand-accent)]/20 shadow-lg">
                            <Phone size={24} />
                        </div>
                        <span className="bg-[var(--color-brand-accent)]/10 border border-[var(--color-brand-accent)]/20 text-[var(--color-brand-accent)] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm backdrop-blur-md">
                            PREMIUM_UPLINK
                        </span>
                    </div>
                    <h3 className="text-sm font-black text-[var(--color-brand-accent)] uppercase tracking-[0.2em] mb-2">Crisis Intervention</h3>
                    <p className="text-white text-lg font-light tracking-tight italic opacity-90">Priority Hotline</p>
                    <p className="text-[9px] text-white/20 uppercase font-black tracking-widest mt-2">Verified Members Only</p>
                </Card>
            </div>

            {/* Ticket Table */}
            <Card padding="none" className="overflow-hidden border-white/5 bg-black/40 shadow-2xl rounded-3xl backdrop-blur-3xl">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] opacity-40">Active Ticket Feed</h3>
                    <div className="flex gap-6">
                        <button className="text-[10px] font-black uppercase tracking-widest text-[var(--color-brand-accent)] border-b-2 border-[var(--color-brand-accent)] pb-1 transition-all">Intercepts (2)</button>
                        <button className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/40 pb-1 transition-all">Archived Logs</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.01] text-white/30 uppercase text-[9px] font-black tracking-[0.2em] border-b border-white/5">
                            <tr>
                                <th className="px-8 py-5">Stream ID</th>
                                <th className="px-8 py-5">Subject Topology</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5">Temporal Drift</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[10px] font-mono">
                            <tr className="hover:bg-white/[0.03] transition-all duration-300 group">
                                <td className="px-8 py-6 text-white/20 font-black group-hover:text-white/40">#TK-9921</td>
                                <td className="px-8 py-6">
                                    <div className="text-white font-bold text-sm tracking-tight opacity-80 group-hover:opacity-100">Webhook timeout on Check-in Ingress</div>
                                    <div className="text-white/20 text-[9px] font-black uppercase tracking-widest mt-1.5 flex items-center gap-2 italic">
                                        <div className="w-1 h-1 bg-red-500 rounded-full"></div> Integration • Priority Alpha
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-500 border border-amber-500/20 uppercase tracking-[0.2em] shadow-sm italic">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> In Processing
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-white/30 uppercase tracking-widest">25 mins ago</td>
                                <td className="px-8 py-6 text-right">
                                    <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-white/40 font-black uppercase tracking-widest hover:border-white/10 hover:text-white transition-all active:scale-95 shadow-lg">Decrypt</button>
                                </td>
                            </tr>
                            <tr className="hover:bg-white/[0.03] transition-all duration-300 group">
                                <td className="px-8 py-6 text-white/20 font-black group-hover:text-white/40">#TK-9882</td>
                                <td className="px-8 py-6">
                                    <div className="text-white font-bold text-sm tracking-tight opacity-80 group-hover:opacity-100">Cognitive Layer Rate Limit</div>
                                    <div className="text-white/20 text-[9px] font-black uppercase tracking-widest mt-1.5 flex items-center gap-2 italic">
                                        <div className="w-1 h-1 bg-zinc-500 rounded-full"></div> Infrastructure • Priority Gamma
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black bg-white/5 text-white/40 border border-white/10 uppercase tracking-[0.2em] shadow-sm italic">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div> Queued
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-white/30 uppercase tracking-widest">2h ago</td>
                                <td className="px-8 py-6 text-right">
                                    <button className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-white/40 font-black uppercase tracking-widest hover:border-white/10 hover:text-white transition-all active:scale-95 shadow-lg">Decrypt</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
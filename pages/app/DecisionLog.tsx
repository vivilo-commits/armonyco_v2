import React, { useState } from 'react';
import { LogEntry } from '../../types';
import { Search, Filter, Calendar, ChevronDown, Activity, MessageCircle, TrendingUp, Shield, Zap, AlertTriangle, FileText, CheckCircle } from '../../components/ui/Icons';
import { AgentCard } from '../../components/ui/AgentCard';
import { agents } from '../../data/agents';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/app/StatCard';
import { Button } from '../../components/ui/Button';
import { Tooltip } from '../../components/ui/Tooltip';

const mockLogs: LogEntry[] = [
    { id: 'EVT 29384', timestamp: '2023-10-24 14:22:01', policy: 'POL TRAVEL EU', verdict: 'ALLOW', evidenceHash: '0x9a8b...2f1', responsible: 'SYS AUTO', credits: 1 },
    { id: 'EVT 29385', timestamp: '2023-10-24 14:23:45', policy: 'POL SPEND LIMIT', verdict: 'DENY', evidenceHash: '0x1c3d...8e9', responsible: 'SYS AUTO', credits: 1 },
    { id: 'EVT 29386', timestamp: '2023-10-24 14:24:12', policy: 'POL VENDOR KYC', verdict: 'MODIFY', evidenceHash: '0x7f2a...1b4', responsible: 'HUMAN REV', credits: 2 },
    { id: 'EVT 29387', timestamp: '2023-10-24 14:26:00', policy: 'POL INVOICE MATCH', verdict: 'ALLOW', evidenceHash: '0x5e6d...9c2', responsible: 'SYS AUTO', credits: 1 },
    { id: 'EVT 29388', timestamp: '2023-10-24 14:28:33', policy: 'POL CONTRACT VAL', verdict: 'ALLOW', evidenceHash: '0x3a4b...5f6', responsible: 'SYS AUTO', credits: 2 },
    { id: 'EVT 29389', timestamp: '2023-10-25 09:15:00', policy: 'POL HR ACCESS', verdict: 'ALLOW', evidenceHash: '0x2b8c...1a9', responsible: 'SYS AUTO', credits: 1 },
    { id: 'EVT 29390', timestamp: '2023-10-25 10:00:22', policy: 'POL DATA EXPORT', verdict: 'DENY', evidenceHash: '0x4d9e...3f2', responsible: 'SEC OPS', credits: 3 },
];

export const DecisionLog: React.FC = () => {
    const [filterPolicy, setFilterPolicy] = useState('');
    const [filterVerdict, setFilterVerdict] = useState('ALL');
    const [filterEntity, setFilterEntity] = useState('');

    const filteredLogs = mockLogs.filter(log => {
        const matchesPolicy = log.policy.toLowerCase().includes(filterPolicy.toLowerCase());
        const matchesVerdict = filterVerdict === 'ALL' || log.verdict === filterVerdict;
        const matchesEntity = log.responsible.toLowerCase().includes(filterEntity.toLowerCase());
        return matchesPolicy && matchesVerdict && matchesEntity;
    });

    return (
        <div className="p-8 animate-fade-in pb-20 overflow-x-hidden bg-black text-white">
            {/* Header */}
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Decision Log</h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Decentralized execution records. Cryptographically verified chain of custody.</p>
                </div>
                <div className="flex gap-2">
                    <Tooltip text="Hash Integrity Verified">
                        <span className="px-4 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-[9px] font-black text-white/40 flex items-center gap-3 shadow-md uppercase tracking-[0.2em] backdrop-blur-md">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                            Last ledger sync: 2s ago
                        </span>
                    </Tooltip>
                </div>
            </header>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <StatCard
                    label="Decisions (24h)"
                    value="1,492"
                    icon={Zap}
                    trend={{ value: "+12%", isPositive: true, label: "load" }}
                />
                <StatCard
                    label="Autonomy Rate"
                    value="98.2%"
                    icon={Activity}
                    iconColor="text-[var(--color-brand-accent)]"
                    subtext="Autonomous execution"
                />
                <StatCard
                    label="Active Alerts"
                    value="3"
                    icon={AlertTriangle}
                    iconColor="text-amber-500"
                    subtext="Signals requiring review"
                />
                <StatCard
                    label="Ledger State"
                    value="1.2 GB"
                    icon={Shield}
                    iconColor="text-emerald-500"
                    subtext="Hashed & Encrypted"
                />
            </div>

            {/* AI Agents / Governance Actors Row */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white/40 font-black text-[10px] uppercase tracking-[0.3em]">Institutional Intelligence Matrix</h3>
                    <span className="text-[9px] text-white/20 flex items-center gap-2 font-black uppercase tracking-widest italic">
                        <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                        Cognitive Core Nominal
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                    {agents.map((agent) => (
                        <div key={agent.id} className="transition-all duration-300 hover:scale-[1.02]">
                            <AgentCard
                                {...agent}
                                hideAction={true}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Card */}
            <Card padding="none" className="overflow-hidden border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl rounded-3xl">
                {/* Advanced Filter Bar */}
                <div className="p-5 flex flex-wrap gap-4 items-center border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-2xl min-w-[180px] relative h-[50px] shadow-inner group hover:bg-white/[0.05] transition-colors">
                        <Filter size={14} className="text-white/30" />
                        <select
                            className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-white/60 w-full appearance-none cursor-pointer z-10"
                            value={filterVerdict}
                            onChange={(e) => setFilterVerdict(e.target.value)}
                        >
                            <option value="ALL">All Event Verdicts</option>
                            <option value="ALLOW">Allow (Secure)</option>
                            <option value="DENY">Deny (Risk)</option>
                            <option value="MODIFY">Modify (Review)</option>
                        </select>
                        <ChevronDown size={14} className="text-white/30 absolute right-4 pointer-events-none group-hover:text-white/60 transition-colors" />
                    </div>

                    <Tooltip text="Temporal Filter">
                        <Button variant="secondary" className="w-[50px] h-[50px] p-0 flex items-center justify-center rounded-2xl border-white/10 hover:bg-white/5">
                            <Calendar size={18} className="text-white/60" />
                        </Button>
                    </Tooltip>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.01] text-white/30 font-black uppercase text-[9px] tracking-[0.2em] border-b border-white/5">
                            <tr>
                                <th className="px-8 py-5">Event Temporal Coord</th>
                                <th className="px-8 py-5">Stream ID</th>
                                <th className="px-8 py-5">Policy Topology</th>
                                <th className="px-8 py-5">Verdict</th>
                                <th className="px-8 py-5 text-right">Value (€)</th>
                                <th className="px-8 py-5">Evidence Proof</th>
                                <th className="px-8 py-5 text-right">Entity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono text-[10px]">
                            {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-white/[0.03] transition-all duration-200 group cursor-default">
                                    <td className="px-8 py-5 text-white/30 group-hover:text-white/60 transition-colors uppercase tracking-widest">{log.timestamp}</td>
                                    <td className="px-8 py-5 text-white font-black group-hover:text-[var(--color-brand-accent)] transition-colors italic tracking-tighter">{log.id}</td>
                                    <td className="px-8 py-5 font-sans text-white/60 font-bold uppercase tracking-tight">{log.policy}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border tracking-widest uppercase shadow-sm ${log.verdict === 'ALLOW' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                            log.verdict === 'DENY' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                            {log.verdict}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right text-white font-numbers">-{log.credits} €</td>
                                    <td className="px-8 py-5 text-white/20 group-hover:text-white/40 transition-colors italic truncate max-w-[120px]">{log.evidenceHash}</td>
                                    <td className="px-8 py-5 text-right">
                                        <span className="text-white/80 font-black px-2 py-0.5 bg-white/5 rounded border border-white/5 group-hover:border-white/10 transition-colors uppercase tracking-widest text-[9px]">
                                            {log.responsible}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="p-20 text-center">
                                        <Search size={32} className="mx-auto mb-4 text-white/10 animate-pulse" />
                                        <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">No matching operational events within the decrypted stream.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
            <div className="mt-12 flex flex-col items-center gap-4">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <p className="text-white/10 text-[9px] font-black uppercase tracking-[0.5em] italic">
                    Institutional Continuity Protocol Active
                </p>
            </div>
        </div>
    );
};
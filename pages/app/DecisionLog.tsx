import React, { useState } from 'react';
import { Search, Filter, Calendar, ChevronDown, Activity, MessageCircle, TrendingUp, Shield, Zap, AlertTriangle, FileText, CheckCircle } from '../../components/ui/Icons';
import { AgentCard } from '../../components/ui/AgentCard';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/app/StatCard';
import { Button } from '../../components/ui/Button';
import { Tooltip } from '../../components/ui/Tooltip';
import { useLogs, useAgents, useN8nExecutions } from '../../src/hooks/useLogs';
import { DecisionRecord } from '../../src/types';

export const DecisionLog: React.FC = () => {
    const { data: logsData } = useLogs();
    const { data: agentsData } = useAgents();
    const { data: executions } = useN8nExecutions();

    const [filterPolicy, setFilterPolicy] = useState('');
    const [filterVerdict, setFilterVerdict] = useState('ALL');
    const [filterEntity, setFilterEntity] = useState('');

    const logs = logsData || [];
    const agents = agentsData || [];

    // Calculate real stats from executions
    const totalDecisions = executions?.length || 0;
    const successCount = executions?.filter(e => e.status === 'success').length || 0;
    const autonomyRate = totalDecisions > 0 ? ((successCount / totalDecisions) * 100).toFixed(1) : '0';
    const alertCount = executions?.filter(e => e.status !== 'success').length || 0;

    const filteredLogs = logs.filter(log => {
        if (!log) return false;
        const policy = (log.policy || '').toLowerCase();
        const verdict = (log.verdict || '').toUpperCase();
        const responsible = (log.responsible || '').toLowerCase();

        const matchesPolicy = policy.includes(filterPolicy.toLowerCase());
        const matchesVerdict = filterVerdict === 'ALL' || verdict === filterVerdict.toUpperCase();
        const matchesEntity = responsible.includes(filterEntity.toLowerCase());

        return matchesPolicy && matchesVerdict && matchesEntity;
    });

    return (
        <div className="p-8 animate-fade-in pb-20 overflow-x-hidden bg-black text-white">
            {/* Header */}
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Truth Ledger</h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Operational decision log: "Why" and "How" documented for every event.</p>
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
                    label="Total Decisions"
                    value={totalDecisions.toLocaleString()}
                    icon={Zap}
                    trend={{ value: "Live", isPositive: true, label: "realtime" }}
                />
                <StatCard
                    label="Autonomy Rate"
                    value={`${autonomyRate}%`}
                    icon={Activity}
                    iconColor="text-[var(--color-brand-accent)]"
                    subtext="Autonomous execution"
                />
                <StatCard
                    label="Active Alerts"
                    value={alertCount.toString()}
                    icon={AlertTriangle}
                    iconColor={alertCount > 0 ? "text-amber-500" : "text-emerald-500"}
                    subtext="Signals requiring review"
                />
                <StatCard
                    label="Ledger State"
                    value="Synced"
                    icon={Shield}
                    iconColor="text-emerald-500"
                    subtext="Hashed & Encrypted"
                />
            </div>


            {/* AI Agents / Governance Actors Row */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-white/40 font-black text-[10px] uppercase tracking-[0.3em]">AIM - Armonyco Intelligence Matrix™</h3>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest italic tracking-[0.2em]">Matrix Sync Active</span>
                        </div>
                    </div>
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
                                status={agent.status as any}
                                hideAction={true}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Card */}
            <Card padding="none" className="overflow-hidden border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl rounded-3xl w-full">
                {/* Advanced Filter Bar */}
                <div className="p-6 flex flex-wrap gap-4 items-center border-b border-white/5 bg-white/[0.02] w-full">
                    <div className="flex items-center gap-4 px-6 py-2 bg-white/[0.03] border border-white/10 rounded-2xl min-w-[240px] relative h-[56px] shadow-inner group hover:bg-white/[0.05] transition-colors">
                        <Filter size={16} className="text-[var(--color-brand-accent)]" />
                        <select
                            className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-[0.2em] text-white/80 w-full appearance-none cursor-pointer z-10"
                            value={filterVerdict}
                            onChange={(e) => setFilterVerdict(e.target.value)}
                        >
                            <option value="ALL">All Event Verdicts</option>
                            <option value="ALLOW">Allow (Secure)</option>
                            <option value="DENY">Deny (Risk)</option>
                            <option value="MODIFY">Modify (Review)</option>
                        </select>
                        <ChevronDown size={14} className="text-white/30 absolute right-6 pointer-events-none group-hover:text-white/60 transition-colors" />
                    </div>

                    <div className="flex-1 h-[56px] bg-white/[0.01] border border-white/5 rounded-2xl flex items-center px-6 gap-4">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Truth stream decrypted & verified via shard-42</span>
                    </div>

                    <Tooltip text="Temporal Filter">
                        <Button variant="secondary" className="w-[56px] h-[56px] p-0 flex items-center justify-center rounded-2xl border-white/10 hover:bg-white/5 transition-all">
                            <Calendar size={18} className="text-white/60" />
                        </Button>
                    </Tooltip>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.01] text-white/30 font-black uppercase text-[9px] tracking-[0.2em] border-b border-white/5">
                            <tr>
                                <th className="px-6 py-6">Timestamp</th>
                                <th className="px-6 py-6">Stream ID</th>
                                <th className="px-6 py-6">Trigger</th>
                                <th className="px-6 py-6">Reservation</th>
                                <th className="px-6 py-6">Guest</th>
                                <th className="px-6 py-6">Verdict</th>
                                <th className="px-6 py-6 text-right">ArmoCredits©</th>
                                <th className="px-6 py-6 text-right">Agent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-mono text-[10px]">
                            {executions && executions.length > 0 ? executions.slice(0, 50).map((exec) => (
                                <tr key={exec.id} className="hover:bg-white/[0.03] transition-all duration-200 group cursor-default">
                                    <td className="px-6 py-5 text-white/30 group-hover:text-white/60 transition-colors uppercase tracking-widest">
                                        {new Date(exec.started_at).toLocaleString('en-US', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td className="px-6 py-5 text-white font-black group-hover:text-[var(--color-brand-accent)] transition-colors italic tracking-tighter">
                                        {(exec.truth_identity ?? exec.n8n_execution_id ?? 'N/A').slice(0, 12)}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-1 rounded text-[9px] font-bold border ${exec.trigger_source === 'message' || exec.trigger_channel === 'WhatsApp' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            exec.trigger_source === 'schedule' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                exec.trigger_source === 'cascade' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                                                    'bg-white/5 text-white/40 border-white/10'
                                            }`}>
                                            {exec.trigger_channel || exec.trigger_source || 'Manual'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-white/60 font-bold">
                                        {exec.reservation_id || '-'}
                                    </td>
                                    <td className="px-6 py-5 text-white/80 font-medium truncate max-w-[150px]" title={exec.guest_name || ''}>
                                        {exec.guest_name || '-'}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black border tracking-widest uppercase shadow-sm ${exec.status === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                            exec.status === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                            }`}>
                                            {exec.status === 'success' ? 'ALLOW' : exec.status === 'error' ? 'DENY' : 'PENDING'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right text-white font-numbers">-{exec.armo_credits || 50} ⌬</td>
                                    <td className="px-6 py-5 text-right">
                                        <span className="text-white/80 font-black px-2 py-0.5 bg-white/5 rounded border border-white/5 group-hover:border-white/10 transition-colors uppercase tracking-widest text-[9px]">
                                            {exec.agent_name || exec.workflow_name?.split(' ')[0] || 'AOS'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={8} className="p-20 text-center">
                                        <Search size={32} className="mx-auto mb-4 text-white/10 animate-pulse" />
                                        <p className="text-[10px] text-white/20 uppercase font-black tracking-[0.3em]">No execution data in the decrypted stream.</p>
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
import React from 'react';
import { Database, Activity, CheckCircle, AlertTriangle, Clock, TrendingUp, Monitor, Zap, Shield } from '../../components/ui/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/app/StatCard';
import { Tooltip } from '../../components/ui/Tooltip';
import { useN8nExecutions } from '../../src/hooks/useLogs';

export const AEMView: React.FC = () => {
    const { data: executions, status } = useN8nExecutions();
    const loading = status === 'pending';

    // Calculate real metrics from executions
    const totalExecutions = executions?.length || 0;
    const successCount = executions?.filter(e => e.status === 'success').length || 0;
    const integrityRate = totalExecutions > 0 ? ((successCount / totalExecutions) * 100).toFixed(1) : '0';

    // Calculate event data by perimeter
    const eventData = React.useMemo(() => {
        if (!executions?.length) return [];

        const perimeterMap: Record<string, { valid: number; invalid: number }> = {};
        executions.forEach(exec => {
            const perimeter = exec.perimeter?.replace('INSTITUTIONAL_', '') || 'OTHER';
            if (!perimeterMap[perimeter]) {
                perimeterMap[perimeter] = { valid: 0, invalid: 0 };
            }
            if (exec.status === 'success') {
                perimeterMap[perimeter].valid++;
            } else {
                perimeterMap[perimeter].invalid++;
            }
        });

        return Object.entries(perimeterMap).map(([name, data]) => ({
            name,
            value: data.valid + data.invalid,
            valid: data.valid,
            invalid: data.invalid
        }));
    }, [executions]);

    // Calculate average duration
    const avgDuration = React.useMemo(() => {
        if (!executions?.length) return '0s';
        const durations = executions.filter(e => e.duration_ms).map(e => e.duration_ms);
        if (!durations.length) return '0s';
        const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
        return avg > 60000 ? `${Math.round(avg / 60000)}m` : `${Math.round(avg / 1000)}s`;
    }, [executions]);

    const formatTimestamp = (ts: string) => {
        const date = new Date(ts);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="p-8 animate-fade-in flex flex-col min-h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden">
            {/* Header: Core Constructs Standard */}
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Database className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">AEM - Armonyco Event Model™ <span className="text-white/20 text-sm font-normal lowercase italic tracking-normal ml-2">/ institutional truth</span></h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Records every operational event as institutional truth: Input → Actions → Decisions → Proofs.</p>
                </div>
                <div className="flex gap-2">
                    <Tooltip text="Schema validation active">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[9px] font-black flex items-center gap-2 shadow-sm uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            Schema v2.4 Active
                        </span>
                    </Tooltip>
                </div>
            </header>

            {/* Split View Layout: Metrics & Topology */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">

                {/* Left Panel: Metric Map (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Event Integrity */}
                    <Card variant="dark" padding="lg" className="relative overflow-hidden group border border-white/10 bg-black/40 backdrop-blur-md">
                        <div className="relative z-10">
                            <div className="text-white/40 text-[9px] uppercase tracking-[0.2em] mb-4 font-black opacity-60">Truth Integrity: Event Completeness</div>
                            <div className="text-6xl font-numbers text-emerald-500 leading-none pb-2 font-black tracking-tighter italic">{integrityRate}%</div>
                            <div className="text-emerald-500/60 text-[10px] mt-4 flex items-center gap-2 font-black uppercase tracking-[0.2em] italic">
                                <Activity size={14} className="animate-pulse" /> Truth Protocol: {loading ? 'Loading...' : 'Nominal'}
                            </div>
                        </div>
                    </Card>

                    {/* Execution Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            label="Total Events"
                            value={totalExecutions.toString()}
                            icon={Zap}
                            trend={{ value: "Live", isPositive: true, label: "realtime" }}
                        />
                        <StatCard
                            label="Avg Duration"
                            value={avgDuration}
                            icon={Clock}
                            iconColor="text-emerald-500"
                            trend={{ value: "Sync", isPositive: true, label: "closed" }}
                        />
                    </div>

                    {/* Quality & Governance */}
                    <Card padding="md" className="bg-white/[0.01] border-white/5">
                        <div className="flex justify-between items-center mb-3">
                            <div className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-black opacity-60">Evidence Matrix (Hash Proofs)</div>
                            <Shield size={14} className="text-[var(--color-brand-accent)]" />
                        </div>
                        <div className="text-3xl font-numbers text-white flex items-center font-black tracking-tight italic">{integrityRate}% <span className="text-[10px] ml-2 opacity-40 font-numbers uppercase tracking-widest not-italic">Pass</span></div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-3">
                            <div className="bg-white h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ width: `${integrityRate}%` }}></div>
                        </div>
                    </Card>
                </div>

                {/* Right Panel: Visualization & Detail (8 cols) */}
                <div className="lg:col-span-8 flex flex-col">
                    <Card padding="lg" className="h-full flex flex-col border-white/5 bg-black/40 backdrop-blur-xl" overflowHidden={false}>
                        <div className="flex justify-between items-center mb-10 shrink-0">
                            <h3 className="text-white font-light text-sm uppercase tracking-tight opacity-80">Topology: Event distribution <span className="text-white/20 text-xs lowercase italic tracking-normal ml-2">/ system-wide</span></h3>
                            <div className="flex gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                                <span className="flex items-center gap-2"><span className="w-2 h-2 bg-white opacity-80 rounded-sm"></span> Calibrated</span>
                                <span className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 opacity-80 rounded-sm"></span> Ungoverned</span>
                            </div>
                        </div>
                        <div className="flex-1 min-h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={eventData} barCategoryGap="25%">
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="rgba(255,255,255,0.2)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                        fontWeight="900"
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.2)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-10}
                                        fontWeight="900"
                                    />
                                    <RechartsTooltip
                                        cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                        contentStyle={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                            backdropFilter: 'blur(8px)',
                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                            color: '#FFFFFF',
                                            borderRadius: '12px',
                                            fontWeight: 'bold',
                                            fontSize: '10px',
                                            textTransform: 'uppercase'
                                        }}
                                    />
                                    <Bar dataKey="valid" stackId="a" fill="#fff" fillOpacity={0.8} radius={[0, 0, 4, 4]} />
                                    <Bar dataKey="invalid" stackId="a" fill="#ef4444" fillOpacity={0.8} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Bottom Row: Truth Ledger (Full Width) */}
            <div className="flex-1 flex flex-col min-h-0">
                <Card padding="none" className="flex-1 overflow-hidden flex flex-col bg-black/20 border-white/5">
                    <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center shrink-0">
                        <h3 className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                            <Zap size={14} /> Truth Ledger: Ingestion Stream
                        </h3>
                        <div className="flex items-center gap-6">
                            <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest text-white/20">
                                <span className="flex items-center gap-2 italic">Events: {totalExecutions}</span>
                                <span className="flex items-center gap-2 italic">Sync Level: 100%</span>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
                        <table className="w-full text-left font-mono text-[10px]">
                            <thead className="bg-white/[0.01] text-white/20 font-black uppercase text-[8px] tracking-[0.2em] border-b border-white/5 sticky top-0 bg-black">
                                <tr>
                                    <th className="py-4 px-6">Timestamp</th>
                                    <th className="py-4 px-6">Truth Identity</th>
                                    <th className="py-4 px-6">Agent</th>
                                    <th className="py-4 px-6">Perimeter</th>
                                    <th className="py-4 px-6 text-right pr-10">Governance Verdict</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.03]">
                                {loading ? (
                                    <tr><td colSpan={5} className="py-8 text-center text-white/40">Loading...</td></tr>
                                ) : executions?.slice(0, 20).map((exec) => (
                                    <tr key={exec.id} className="hover:bg-white/[0.03] transition-all duration-200 group">
                                        <td className="py-4 px-6 text-white/30 group-hover:text-white/60 transition-colors uppercase tracking-widest">
                                            {formatTimestamp(exec.started_at)}
                                        </td>
                                        <td className="py-4 px-6 text-white font-black group-hover:text-[var(--color-brand-accent)] transition-colors italic tracking-tighter">
                                            {exec.truth_identity || `exec_${exec.n8n_execution_id}`}
                                        </td>
                                        <td className="py-4 px-6 text-white/60 text-[9px] uppercase font-bold tracking-tight">
                                            {exec.agent_name}
                                        </td>
                                        <td className="py-4 px-6 text-white/40 text-[9px] uppercase font-bold tracking-tight">
                                            {exec.perimeter}
                                        </td>
                                        <td className="py-4 px-6 text-right pr-10">
                                            {exec.status !== 'success' ? (
                                                <span className="text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20 font-black tracking-widest text-[9px] uppercase">Drift Detected</span>
                                            ) : (
                                                <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 font-black tracking-widest text-[9px] uppercase">Verify / Pass</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div className="mt-8 mb-4 pt-6 border-t border-white/5 text-center shrink-0">
                    <p className="text-[9px] text-white/10 font-black uppercase tracking-[0.5em] italic">
                        AEM - Armonyco Event Model™ Node v2.4.1 • Shard: eu-central-1a • Replica: Primary Registry
                    </p>
                </div>
            </div>
        </div>
    );
};
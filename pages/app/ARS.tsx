import React from 'react';
import { Shield, FileCheck, Link, Lock, Search, Clock, TrendingUp, CheckCircle, AlertTriangle } from '../../components/ui/Icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/app/StatCard';
import { Tooltip } from '../../components/ui/Tooltip';
import { useN8nExecutions } from '../../src/hooks/useLogs';

export const ARSView: React.FC = () => {
    const { data: executions, status } = useN8nExecutions();
    const loading = status === 'pending';

    // Calculate real metrics from executions
    const totalExecutions = executions?.length || 0;
    const successCount = executions?.filter(e => e.status === 'success').length || 0;
    const evidenceDensity = totalExecutions > 0 ? ((successCount / totalExecutions) * 100).toFixed(1) : '0';

    // Calculate evidence distribution by agent/perimeter
    const evidenceData = React.useMemo(() => {
        if (!executions?.length) return [
            { name: 'Photo/Media', value: 35, color: '#FFFFFF' },
            { name: 'System Logs', value: 40, color: '#C5A572' },
            { name: 'Documents', value: 15, color: '#575756' },
            { name: 'User Auth', value: 10, color: '#151514' },
        ];

        const agentCount: Record<string, number> = {};
        executions.forEach(exec => {
            const agent = exec.agent_name || 'OTHER';
            agentCount[agent] = (agentCount[agent] || 0) + 1;
        });

        const colors: Record<string, string> = {
            'AMELIA': '#FFFFFF',
            'JAMES': '#C5A572',
            'ELON': '#575756',
            'LARA': '#10b981',
            'OTHER': '#151514',
        };

        return Object.entries(agentCount).map(([name, count]) => ({
            name: name === 'AMELIA' ? 'Guest Comm' : name === 'JAMES' ? 'Reservations' : name === 'ELON' ? 'Revenue' : name === 'LARA' ? 'Operations' : 'Other',
            value: count,
            color: colors[name] || '#575756',
        }));
    }, [executions]);

    // Calculate chain integrity (100% if all successful)
    const chainIntegrity = totalExecutions > 0 ? Math.round((successCount / totalExecutions) * 100) : 100;

    // Calculate accountability value (based on execution count)
    const accountabilityValue = totalExecutions * 100; // €100 per execution as example

    // Get verification stream from real executions
    const verificationStream = React.useMemo(() => {
        if (!executions?.length) return [];
        return executions.slice(0, 5).map(exec => ({
            id: (exec.truth_identity ?? exec.n8n_execution_id ?? 'N/A').slice(0, 10),
            type: exec.workflow_name || 'Workflow Execution',
            req: exec.perimeter || 'Standard Verification',
            status: exec.status === 'success' ? 'VERIFIED' : 'PENDING',
        }));
    }, [executions]);

    return (
        <div className="p-8 animate-fade-in flex flex-col min-h-[calc(100vh-64px)] overflow-y-auto">
            {/* Header: Core Constructs Standard */}
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">ARS - Armonyco Reliability Standard™ <span className="text-white/20 text-sm font-normal lowercase italic tracking-normal ml-2">/ sovereign safety</span></h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Reliability Standard: preventive controls, mandatory escalations, and management of operational limits.</p>
                </div>
                <div className="flex gap-2">
                    <Tooltip text="Compliance standard met">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black flex items-center gap-2 shadow-sm uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            {loading ? 'Loading' : 'Live Data'}
                        </span>
                    </Tooltip>
                </div>
            </header>

            {/* Split View Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">

                {/* Left Panel: Health & Metrics (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
                    {/* Primary System Status */}
                    <Card variant="dark" padding="lg" className="relative group border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden">
                        <div className="relative z-10">
                            <div className="text-white/40 text-[9px] uppercase tracking-[0.2em] mb-4 font-black opacity-60">Audit Readiness</div>
                            <div className={`text-6xl font-numbers leading-none pb-2 font-black tracking-tighter italic ${parseFloat(evidenceDensity) >= 95 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                {parseFloat(evidenceDensity) >= 95 ? 'READY' : 'REVIEW'}
                            </div>
                            <div className={`text-[10px] mt-4 flex items-center gap-2 font-black uppercase tracking-[0.2em] italic ${parseFloat(evidenceDensity) >= 95 ? 'text-emerald-500/60' : 'text-amber-500/60'}`}>
                                <CheckCircle size={14} className="animate-pulse" /> Verified Trust Engine
                            </div>
                        </div>
                    </Card>

                    {/* Operational Value */}
                    <Card padding="md" className="bg-white/[0.01] border-white/5">
                        <div className="text-white/40 text-[9px] uppercase tracking-[0.2em] mb-3 font-black opacity-60">Accountability Growth</div>
                        <div className="text-3xl font-numbers text-[var(--color-brand-accent)] h-[50px] flex items-center font-black tracking-tight italic">{accountabilityValue.toLocaleString('de-DE')} <span className="text-xs ml-2 opacity-40 font-numbers uppercase tracking-widest not-italic">€</span></div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-3">
                            <div className="bg-[var(--color-brand-accent)] h-full rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)]" style={{ width: `${Math.min(100, accountabilityValue / 200)}%` }}></div>
                        </div>
                    </Card>

                    {/* Reliability Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            label="Chain"
                            value={`${chainIntegrity}%`}
                            icon={Link}
                            iconColor="text-[var(--color-brand-accent)]"
                            subtext={<span className="text-[var(--color-brand-accent)] font-black uppercase tracking-widest text-[9px]">{chainIntegrity === 100 ? 'Zero Breaks' : 'Minor Issues'}</span>}
                        />
                        <StatCard
                            label="Hashes"
                            value={totalExecutions.toLocaleString()}
                            icon={Lock}
                            iconColor="text-emerald-500"
                            subtext={<span className="text-emerald-500 font-black uppercase tracking-widest text-[9px]">Synced</span>}
                        />
                    </div>

                    {/* Compact Metrics */}
                    <Card padding="md" className="bg-black/20 border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-black opacity-60">Evidence Density</div>
                            <FileCheck size={16} className="text-[var(--color-brand-accent)]" />
                        </div>
                        <div className="text-4xl font-numbers text-white tracking-tighter italic font-black">{evidenceDensity}%</div>
                        <div className="w-full bg-white/5 h-1 gap-1 rounded-full mt-4 overflow-hidden">
                            <div className="bg-white/80 h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ width: `${evidenceDensity}%` }}></div>
                        </div>
                    </Card>
                </div>

                {/* Right Panel: Visualization & Logs (8 cols) */}
                <div className="lg:col-span-8 flex flex-col h-full gap-8">
                    {/* Top Chart */}
                    <Card padding="lg" className="min-h-[450px] flex flex-col border-white/5 bg-black/40 backdrop-blur-xl" overflowHidden={false}>
                        <h3 className="text-white font-light text-sm uppercase tracking-tight opacity-80 mb-8">Topology: Evidence distribution <span className="text-white/20 text-xs lowercase italic tracking-normal ml-2">/ domain segmentation</span></h3>
                        <div className="flex-1 min-h-0 relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={evidenceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="rgba(255,255,255,0.05)"
                                        strokeWidth={1}
                                    >
                                        {evidenceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                            backdropFilter: 'blur(8px)',
                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                            color: '#fff',
                                            fontSize: '10px',
                                            borderRadius: '12px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase'
                                        }}
                                    />
                                    <Legend verticalAlign="bottom" align="center" layout="horizontal" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', paddingTop: '40px', color: 'rgba(255,255,255,0.4)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Bottom Log */}
                    <Card padding="none" className="flex-1 min-h-[400px] flex flex-col overflow-hidden bg-black/20 border-white/5">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
                            <h3 className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                                <Search size={14} /> Verification stream <span className="text-white/20 lowercase italic tracking-normal ml-2">/ primary ledger</span>
                            </h3>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.03] text-white/30 font-black uppercase text-[9px] tracking-[0.2em] border-b border-white/5 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4">Event Temporal Coord</th>
                                        <th className="px-6 py-4">Protocol</th>
                                        <th className="px-6 py-4">Fidelity Req</th>
                                        <th className="px-6 py-4 text-right">Verdict</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03] font-mono text-[10px]">
                                    {verificationStream.length > 0 ? verificationStream.map((row, i) => (
                                        <tr key={i} className="hover:bg-white/[0.03] transition-all duration-200 group">
                                            <td className="px-6 py-5 text-white font-black group-hover:text-[var(--color-brand-accent)] transition-colors italic tracking-tighter">{row.id}</td>
                                            <td className="px-6 py-5 text-white/60 group-hover:text-white transition-colors uppercase tracking-tight">{row.type}</td>
                                            <td className="px-6 py-5 text-white/40 group-hover:text-white transition-colors italic opacity-60">{row.req}</td>
                                            <td className="px-6 py-5 text-right">
                                                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black tracking-widest uppercase ${row.status === 'VERIFIED'
                                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-sm'
                                                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-sm'
                                                    }`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-white/40">Loading verification stream...</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
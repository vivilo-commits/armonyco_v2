import React from 'react';
import { Shield, FileCheck, Link, Lock, Search, Clock, TrendingUp, CheckCircle, AlertTriangle } from '../../components/ui/Icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/app/StatCard';
import { Tooltip } from '../../components/ui/Tooltip';

const evidenceData = [
    { name: 'Photo/Media', value: 35, color: '#FFFFFF' },
    { name: 'System Logs', value: 40, color: '#C5A572' },
    { name: 'Documents', value: 15, color: '#575756' },
    { name: 'User Auth', value: 10, color: '#151514' },
];

export const ARSView: React.FC = () => {
    return (
        <div className="p-8 animate-fade-in flex flex-col min-h-[calc(100vh-64px)] overflow-y-auto">
            {/* Header: Core Constructs Standard */}
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Reliability Standard™</h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Evidence Quality & Chain of Custody Registry.</p>
                </div>
                <div className="flex gap-2">
                    <Tooltip text="Compliance standard met">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black flex items-center gap-2 shadow-sm uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            Standard v2.1 Active
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
                            <div className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-4 font-black">Audit Readiness</div>
                            <div className="text-6xl font-mono text-emerald-500 leading-none pb-2 font-black tracking-tighter italic">READY</div>
                            <div className="text-emerald-500/60 text-[10px] mt-4 flex items-center gap-2 font-bold uppercase tracking-[0.15em]">
                                <CheckCircle size={14} className="animate-pulse" /> Verified Trust Engine
                            </div>
                        </div>
                        <img src="/assets/logo-icon.png" alt="" className="absolute right-[-30px] bottom-[-30px] w-40 h-40 opacity-[0.03] transform rotate-12 group-hover:scale-110 transition-transform duration-700" />
                    </Card>

                    {/* Operational Value */}
                    <Card padding="md" className="bg-white/[0.01] border-white/5">
                        <div className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-3 font-black">Operational Value</div>
                        <div className="text-3xl font-numbers text-[var(--color-brand-accent)] h-[50px] flex items-center font-bold tracking-tight">12,000 <span className="text-xs ml-2 opacity-60 font-numbers uppercase tracking-widest">€</span></div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
                            <div className="bg-[var(--color-brand-accent)] w-[75%] h-full rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)]"></div>
                        </div>
                    </Card>

                    {/* Reliability Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            label="Chain"
                            value="100%"
                            icon={Link}
                            iconColor="text-[var(--color-brand-accent)]"
                            subtext={<span className="text-[var(--color-brand-accent)]/80 font-bold uppercase tracking-widest text-[9px]">Zero Breaks</span>}
                        />
                        <StatCard
                            label="Hashes"
                            value="12.4k"
                            icon={Lock}
                            iconColor="text-emerald-500"
                            subtext={<span className="text-emerald-500/80 font-bold uppercase tracking-widest text-[9px]">Synced to Ledger</span>}
                        />
                    </div>

                    {/* Compact Metrics */}
                    <Card padding="md" className="bg-black/20 border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black">Evidence Density</div>
                            <FileCheck size={16} className="text-[var(--color-brand-accent)]" />
                        </div>
                        <div className="text-4xl font-mono text-white tracking-tighter italic">98.2%</div>
                        <div className="w-full bg-white/5 h-1 gap-1 rounded-full mt-4 overflow-hidden">
                            <div className="bg-white/80 w-[98.2%] h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"></div>
                        </div>
                    </Card>
                </div>

                {/* Right Panel: Visualization & Logs (8 cols) */}
                <div className="lg:col-span-8 flex flex-col h-full gap-8">
                    {/* Top Chart */}
                    <Card padding="lg" className="min-h-[450px] flex flex-col border-white/5 bg-black/40 backdrop-blur-xl" overflowHidden={false}>
                        <h3 className="text-white font-medium text-xs uppercase tracking-[0.2em] opacity-80 mb-8">Topology: Evidence Distribution</h3>
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
                                    <Legend verticalAlign="bottom" align="center" layout="horizontal" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '40px', color: 'rgba(255,255,255,0.4)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Bottom Log */}
                    <Card padding="none" className="flex-1 min-h-[400px] flex flex-col overflow-hidden bg-black/20 border-white/5">
                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
                            <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                                <Search size={14} /> Verification Stream
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-left text-[10px]">
                                <thead className="bg-white/[0.03] text-[var(--color-text-muted)] font-bold border-b border-white/5 uppercase tracking-widest sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4">Event ID</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Requirement</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03] font-mono">
                                    {[
                                        { id: 'evt_9921', type: 'Expense > 500', req: 'Receipt + Approval', status: 'VERIFIED' },
                                        { id: 'evt_9922', type: 'Guest Check-in', req: 'Passport Scan', status: 'VERIFIED' },
                                        { id: 'evt_9923', type: 'Refund Issue', req: 'Damage Photo', status: 'PENDING' },
                                        { id: 'evt_9924', type: 'Vendor Payout', req: 'Tax ID Valid', status: 'VERIFIED' },
                                        { id: 'evt_9925', type: 'Key Grant', req: 'ID Verification', status: 'VERIFIED' },
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-white/[0.03] transition-all duration-200 group">
                                            <td className="px-6 py-4 text-white font-bold opacity-80 group-hover:opacity-100">{row.id}</td>
                                            <td className="px-6 py-4 text-[var(--color-text-muted)] group-hover:text-white transition-colors">{row.type}</td>
                                            <td className="px-6 py-4 text-[var(--color-text-muted)] group-hover:text-white transition-colors italic opacity-60">{row.req}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black tracking-widest ${row.status === 'VERIFIED'
                                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]'
                                                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]'
                                                    }`}>
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
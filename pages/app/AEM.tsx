import React from 'react';
import { Database, Activity, CheckCircle, AlertTriangle, Clock, TrendingUp, Monitor, Zap } from '../../components/ui/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/app/StatCard';
import { Tooltip } from '../../components/ui/Tooltip';

const eventData = [
    { name: 'Finance', value: 4200, valid: 4150, invalid: 50 },
    { name: 'Ops', value: 8500, valid: 8300, invalid: 200 },
    { name: 'Guest', value: 12000, valid: 11950, invalid: 50 },
    { name: 'Security', value: 1500, valid: 1500, invalid: 0 },
    { name: 'System', value: 3000, valid: 2980, invalid: 20 },
];

export const AEMView: React.FC = () => {
    return (
        <div className="p-8 animate-fade-in flex flex-col min-h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden">
            {/* Header: Core Constructs Standard */}
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Database className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Event Model™</h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Canonical Event Ingestion & High-Fidelity Schema Validation.</p>
                </div>
                <div className="flex gap-2">
                    <Tooltip text="Schema validation active">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black flex items-center gap-2 shadow-sm uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            Schema v2.4 Active
                        </span>
                    </Tooltip>
                </div>
            </header>

            {/* Split View Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">

                {/* Left Panel: Health & Metrics (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
                    {/* Primary Health */}
                    <Card variant="dark" padding="lg" className="relative overflow-hidden group border border-white/10 bg-black/40 backdrop-blur-md">
                        <div className="relative z-10">
                            <div className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-4 font-black">System Integrity</div>
                            <div className="text-6xl font-numbers text-emerald-500 leading-none pb-2 font-black tracking-tighter italic">99.98%</div>
                            <div className="text-emerald-500/60 text-[10px] mt-4 flex items-center gap-2 font-bold uppercase tracking-[0.15em]">
                                <Activity size={14} className="animate-pulse" /> Canonical Drift: Zero
                            </div>
                        </div>
                        <img src="/assets/logo-icon.png" alt="" className="absolute right-[-20px] bottom-[-20px] w-40 h-40 opacity-[0.03] transform rotate-6 group-hover:scale-110 transition-transform duration-700" />
                    </Card>

                    {/* Operational Value */}
                    <Card padding="md" className="bg-white/[0.01] border-white/5">
                        <div className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-3 font-black">Operational Value</div>
                        <div className="text-3xl font-numbers text-[var(--color-brand-accent)] h-[50px] flex items-center font-bold tracking-tight">42,500 <span className="text-xs ml-2 opacity-60 font-numbers uppercase tracking-widest">€</span></div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
                            <div className="bg-[var(--color-brand-accent)] w-[75%] h-full rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)]"></div>
                        </div>
                    </Card>

                    {/* Processing Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            label="Events/sec"
                            value="842"
                            icon={Zap}
                            trend={{ value: "↑ 12%", isPositive: true, label: "load" }}
                        />
                        <StatCard
                            label="Latency"
                            value="24ms"
                            icon={Clock}
                            iconColor="text-emerald-500"
                            trend={{ value: "↓ 2ms", isPositive: true, label: "avg" }}
                        />
                    </div>

                    {/* Live Feed (Compact) */}
                    <Card padding="none" className="flex-1 overflow-hidden flex flex-col min-h-[300px] bg-black/20 border-white/5">
                        <div className="p-4 border-b border-white/5 bg-white/[0.02] flex justify-between items-center shrink-0">
                            <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                                <Zap size={14} /> Live Ingestion
                            </h3>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
                            <table className="w-full text-left font-mono text-[10px]">
                                <tbody className="divide-y divide-white/[0.03]">
                                    {[...Array(12)].map((_, i) => (
                                        <tr key={i} className="hover:bg-white/[0.03] transition-all duration-200 group">
                                            <td className="py-3 px-4 text-white/40 group-hover:text-white transition-colors">10:42:{10 + i}</td>
                                            <td className="py-3 px-4 text-white font-bold opacity-60 group-hover:opacity-100 transition-opacity">evt_{84920 + i}</td>
                                            <td className="py-3 px-4 text-right">
                                                {i === 3 || i === 8 ? (
                                                    <span className="text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 font-black tracking-widest text-[9px] shadow-[0_0_8px_rgba(239,68,68,0.1)]">ERR</span>
                                                ) : (
                                                    <span className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-black tracking-widest text-[9px] shadow-[0_0_8px_rgba(16,185,129,0.1)]">OK</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Right Panel: Visualization & Detail (8 cols) */}
                <div className="lg:col-span-8 flex flex-col h-full">
                    <Card padding="lg" className="min-h-[500px] flex flex-col border-white/5 bg-black/40 backdrop-blur-xl" overflowHidden={false}>
                        <div className="flex justify-between items-center mb-10 shrink-0">
                            <h3 className="text-white font-medium text-xs uppercase tracking-[0.2em] opacity-80">Topology: Event Distribution</h3>
                            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                <span className="flex items-center gap-2"><span className="w-2 h-2 bg-white opacity-80 rounded-sm"></span> Valid</span>
                                <span className="flex items-center gap-2"><span className="w-2 h-2 bg-red-500 opacity-80 rounded-sm"></span> Invalid</span>
                            </div>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={eventData} barCategoryGap="25%">
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="rgba(255,255,255,0.2)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                        fontWeight="bold"
                                        textTransform="uppercase"
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.2)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-10}
                                        fontWeight="bold"
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
                        <div className="mt-8 pt-6 border-t border-white/5 text-center shrink-0">
                            <p className="text-[9px] text-white/20 font-mono uppercase tracking-[0.3em] font-bold">
                                AEM Node v2.4.1 • Shard: eu-central-1a • Replica: Primary Registry
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
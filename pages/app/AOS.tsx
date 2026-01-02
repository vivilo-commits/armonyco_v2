import React from 'react';
import { Network, Zap, Cpu, Server, Activity, Clock } from '../../components/ui/Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/app/StatCard';
import { Tooltip } from '../../components/ui/Tooltip';

const performanceData = [
    { time: '00:00', load: 20, latency: 120 },
    { time: '04:00', load: 15, latency: 115 },
    { time: '08:00', load: 45, latency: 140 },
    { time: '12:00', load: 85, latency: 180 },
    { time: '16:00', load: 70, latency: 160 },
    { time: '20:00', load: 50, latency: 130 },
    { time: '23:59', load: 30, latency: 125 },
];

export const AOSView: React.FC = () => {
    return (
        <div className="p-8 animate-fade-in flex flex-col min-h-[calc(100vh-64px)] overflow-y-auto">
            {/* Header: Core Constructs Standard */}
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Network className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Operating System™</h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Execution Engine Performance & Latency Topology.</p>
                </div>
                <div className="flex gap-2">
                    <Tooltip text="System is healthy">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)] uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            Engine v4.0 Online
                        </span>
                    </Tooltip>
                </div>
            </header>

            {/* Split View Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">

                {/* Left Panel: Health & Metrics (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
                    {/* Primary System Status */}
                    <Card variant="dark" padding="lg" className="relative overflow-hidden group border border-white/10 bg-black/40 backdrop-blur-md">
                        <div className="relative z-10">
                            <div className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-3 font-black">System Uptime</div>
                            <div className="text-6xl font-numbers text-white leading-none pb-2 font-black tracking-tighter italic">99.99%</div>
                            <div className="text-emerald-500 text-[10px] mt-4 flex items-center gap-2 font-bold uppercase tracking-[0.15em]">
                                <Activity size={14} className="animate-pulse" /> Optimal Performance Range
                            </div>
                        </div>
                        <img src="/assets/logo-icon.png" alt="" className="absolute -bottom-10 -right-10 w-48 h-48 opacity-[0.03] transform rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
                    </Card>

                    {/* Operational Value */}
                    <Card padding="md" className="bg-white/[0.01] border-white/5">
                        <div className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-3 font-black">Operational Value</div>
                        <div className="text-3xl font-numbers text-[var(--color-brand-accent)] h-[50px] flex items-center font-bold tracking-tight">12,500 <span className="text-xs ml-2 opacity-60 font-numbers uppercase tracking-widest">€</span></div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
                            <div className="bg-[var(--color-brand-accent)] w-[75%] h-full rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)]"></div>
                        </div>
                    </Card>

                    {/* Performance Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            label="Latency"
                            value="142ms"
                            icon={Zap}
                            trend={{ value: "Optimal", isPositive: true, label: "" }}
                        />
                        <StatCard
                            label="Agents"
                            value="4/4"
                            icon={Cpu}
                            iconColor="text-emerald-500"
                            subtext={<span className="text-emerald-500/80 font-bold uppercase tracking-widest text-[9px]">All Systems GO</span>}
                        />
                    </div>

                    {/* Active Agents List */}
                    <Card padding="none" className="flex-1 min-h-[250px] flex flex-col bg-black/20 border-white/5 overflow-hidden">
                        <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/40 text-[10px] uppercase tracking-[0.2em] font-black">
                                <Cpu size={14} /> Agent Cluster
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {[
                                { name: 'Amelia (Ext)', status: 'ONLINE', type: 'GUEST' },
                                { name: 'Lara (Rev)', status: 'ONLINE', type: 'REVENUE' },
                                { name: 'Elon (Ops)', status: 'ONLINE', type: 'OPS' },
                                { name: 'James (Comp)', status: 'ONLINE', type: 'COMPLIANCE' }
                            ].map((agent, i) => (
                                <div key={i} className="flex justify-between text-xs items-center p-3 hover:bg-white/[0.03] rounded-xl transition-all duration-200 group">
                                    <div className="flex flex-col">
                                        <span className="text-white font-mono font-bold opacity-80 group-hover:opacity-100">{agent.name}</span>
                                        <span className="text-[9px] text-white/30 uppercase tracking-widest">{agent.type}</span>
                                    </div>
                                    <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[9px] font-black border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)] uppercase tracking-widest group-hover:bg-emerald-500/20 transition-colors">
                                        {agent.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Panel: Visualization (8 cols) */}
                <div className="lg:col-span-8 flex flex-col h-full">
                    <Card padding="lg" className="min-h-[500px] flex flex-col border-white/5 bg-black/40 backdrop-blur-xl" overflowHidden={false}>
                        <div className="flex justify-between items-center mb-10 shrink-0">
                            <h3 className="text-white font-medium text-xs uppercase tracking-[0.2em] opacity-80">Topology: Load vs Latency</h3>
                            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white opacity-80"></div> System Load</div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[var(--color-brand-accent)]"></div> Latency</div>
                            </div>
                        </div>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceData}>
                                    <defs>
                                        <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#fff" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-brand-accent)" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="var(--color-brand-accent)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dx={-10} />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                            backdropFilter: 'blur(8px)',
                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                            color: '#fff',
                                            borderRadius: '12px',
                                            fontSize: '10px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase'
                                        }}
                                    />
                                    <Area type="monotone" dataKey="load" stroke="#fff" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
                                    <Area type="monotone" dataKey="latency" stroke="var(--color-brand-accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/5 text-center shrink-0">
                            <p className="text-[9px] text-white/20 font-mono uppercase tracking-[0.3em] font-bold">
                                AOS Cluster v4.0.2 • Region: eu-west-1 • Node: primary-shard-01
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
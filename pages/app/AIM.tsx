import React from 'react';
import { Cpu, Zap, Activity, Shield, MessageCircle, Clock, TrendingUp } from '../../components/ui/Icons';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/app/StatCard';
import { AgentCard } from '../../components/ui/AgentCard';
import { useAgents } from '../../src/hooks/useLogs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const cognitiveLoadData = [
    { time: '08:00', load: 30 },
    { time: '10:00', load: 45 },
    { time: '12:00', load: 85 },
    { time: '14:00', load: 70 },
    { time: '16:00', load: 90 },
    { time: '18:00', load: 55 },
    { time: '20:00', load: 40 },
];

export const AIMView: React.FC = () => {
    const { data: agentsData } = useAgents();
    const agents = agentsData || [];

    return (
        <div className="p-8 animate-fade-in flex flex-col min-h-[calc(100vh-64px)] overflow-y-auto">
            {/* Header: Core Constructs Standard */}
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Cpu className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">AIM - Armonyco Intelligence Matrix™ <span className="text-white/20 text-sm font-normal lowercase italic tracking-normal ml-2">/ 4-agent harmony</span></h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Four AI agents working in harmony to manage every event: from input to certified closure.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[9px] font-black flex items-center gap-2 shadow-sm uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        Matrix v4.2 Nominal
                    </span>
                </div>
            </header>

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
                <StatCard
                    label="Active Nodes"
                    value="4"
                    icon={Cpu}
                    trend={{ value: "Stable", isPositive: true, label: "nodes" }}
                />
                <StatCard
                    label="Cognitive Load"
                    value="68%"
                    icon={Zap}
                    trend={{ value: "↑ 12%", isPositive: false, label: "demand" }}
                />
                <StatCard
                    label="Decisions/Hour"
                    value="1.240"
                    icon={Activity}
                    trend={{ value: "↑ 402", isPositive: true, label: "velocity" }}
                />
                <StatCard
                    label="Policy Index™"
                    value="100%"
                    icon={Shield}
                    iconColor="text-emerald-500"
                    trend={{ value: "Absolute", isPositive: true, label: "compliance" }}
                />
            </div>

            {/* Agents Grid - Single Row */}
            <div className="flex flex-col gap-6 mb-8 shrink-0">
                <div className="flex items-center justify-between px-1 shrink-0">
                    <h3 className="text-white font-light text-sm uppercase tracking-tight opacity-80">Autonomous Workforce Harmony <span className="text-white/20 text-xs lowercase italic tracking-normal ml-2">/ event lifecycle specialists</span></h3>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest italic">Sync active</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {agents.map((agent) => (
                        <AgentCard key={agent.id} {...agent} status={agent.status as any} />
                    ))}
                </div>
            </div>

            {/* Bottom Row: Topology & Feed side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
                {/* Left: Load Topology (8 cols) */}
                <Card padding="lg" className="lg:col-span-8 bg-black/40 border-white/5 backdrop-blur-xl flex flex-col min-h-[450px]">
                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <h3 className="text-white font-light text-sm uppercase tracking-tight opacity-80">Matrix Load Topology <span className="text-white/20 text-xs lowercase italic tracking-normal ml-2">/ system distribution</span></h3>
                    </div>
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cognitiveLoadData}>
                                <defs>
                                    <linearGradient id="colorLoadAIM" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--color-brand-accent)" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="var(--color-brand-accent)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dy={10} fontWeight="900" />
                                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dx={-10} fontWeight="900" />
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
                                <Area type="monotone" dataKey="load" stroke="var(--color-brand-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorLoadAIM)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Right: Feed & Security (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <Card padding="none" className="bg-black/40 border-white/5 backdrop-blur-xl flex flex-col overflow-hidden flex-1">
                        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                            <h3 className="text-white/60 text-[10px] uppercase font-black tracking-widest italic">Intelligence Feed</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 scrollbar-hide space-y-6">
                            {[
                                { node: 'AMELIA', text: 'WhatsApp Interpretation (U42): Early Check-in requested.', time: '2m ago', color: 'bg-[var(--color-brand-accent)]' },
                                { node: 'LARA', text: 'Early Check-in Protocol active. Availability verify complete.', time: '15m ago', color: 'bg-emerald-500' },
                                { node: 'ELON', text: 'Offer accepted (€25). Cleaning coordination synchronized.', time: '1h ago', color: 'bg-zinc-700' },
                                { node: 'JAMES', text: 'Evidence verification complete (Screenshot + PMS). Event closed.', time: '2h ago', color: 'bg-white' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className={`w-0.5 h-auto ${item.color} rounded-full shrink-0`}></div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[10px] font-black text-white uppercase tracking-wider">{item.node} Node</span>
                                            <span className="text-[8px] text-zinc-500">{item.time}</span>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 italic leading-tight">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card padding="md" variant="dark" className="border-[var(--color-brand-accent)]/20 shadow-[0_0_30px_rgba(0,0,0,0.2)] shrink-0">
                        <div className="flex items-center gap-3 mb-3">
                            <Shield className="w-4 h-4 text-[var(--color-brand-accent)]" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--color-brand-accent)]">Sovereign Safety</h4>
                        </div>
                        <p className="text-[10px] text-white/50 leading-relaxed italic pr-4">
                            Humans retain "Executive Stop" privileges for all autonomous protocols.
                        </p>
                    </Card>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center shrink-0">
                <p className="text-[9px] text-white/10 font-black uppercase tracking-[0.5em] italic">
                    AIM - Armonyco Intelligence Matrix™ Node v4.2.1 • Cognition Layer: Active • Cluster: eu-central-1a
                </p>
            </div>
        </div>
    );
};

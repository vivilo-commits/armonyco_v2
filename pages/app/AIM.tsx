import React from 'react';
import { Cpu, Zap, Activity, Shield, MessageCircle, Clock, TrendingUp } from '../../components/ui/Icons';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/app/StatCard';
import { AgentCard } from '../../components/ui/AgentCard';
import { useAgents, useN8nExecutions } from '../../src/hooks/useLogs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export const AIMView: React.FC = () => {
    const { data: agentsData } = useAgents();
    const { data: executions, status } = useN8nExecutions();
    const agents = agentsData || [];
    const loading = status === 'pending';

    // Calculate real metrics from executions
    const totalExecutions = executions?.length || 0;
    const successCount = executions?.filter(e => e.status === 'success').length || 0;
    const complianceRate = totalExecutions > 0 ? ((successCount / totalExecutions) * 100).toFixed(0) : '0';

    // Calculate cognitive load from executions (hourly distribution)
    const cognitiveLoadData = React.useMemo(() => {
        if (!executions?.length) return [];

        const hourlyCount: Record<string, number> = {};
        executions.forEach(exec => {
            const hour = new Date(exec.started_at).getHours();
            const timeKey = `${hour.toString().padStart(2, '0')}:00`;
            hourlyCount[timeKey] = (hourlyCount[timeKey] || 0) + 1;
        });

        // Normalize to percentage (max load = 100%)
        const maxCount = Math.max(...Object.values(hourlyCount), 1);
        const result: { time: string; load: number }[] = [];
        for (let h = 8; h <= 20; h += 2) {
            const timeKey = `${h.toString().padStart(2, '0')}:00`;
            const count = hourlyCount[timeKey] || 0;
            result.push({ time: timeKey, load: Math.round((count / maxCount) * 100) });
        }
        return result;
    }, [executions]);

    // Calculate average cognitive load
    const avgLoad = cognitiveLoadData.length > 0
        ? Math.round(cognitiveLoadData.reduce((acc, item) => acc + item.load, 0) / cognitiveLoadData.length)
        : 0;

    // Calculate decisions per hour
    const decisionsPerHour = totalExecutions > 0 ? Math.round(totalExecutions / 24) : 0;

    // Get recent feed from executions
    const recentFeed = React.useMemo(() => {
        if (!executions?.length) return [];
        return executions.slice(0, 4).map(exec => {
            const agent = exec.agent_name || 'SYSTEM';
            const colors: Record<string, string> = {
                'AMELIA': 'bg-[var(--color-brand-accent)]',
                'JAMES': 'bg-white',
                'ELON': 'bg-zinc-700',
                'LARA': 'bg-emerald-500',
            };
            const timeDiff = Date.now() - new Date(exec.started_at).getTime();
            const timeAgo = timeDiff < 60000 ? 'just now'
                : timeDiff < 3600000 ? `${Math.round(timeDiff / 60000)}m ago`
                    : `${Math.round(timeDiff / 3600000)}h ago`;

            return {
                node: agent,
                text: `${exec.workflow_name || 'Workflow'} execution ${exec.status}. Duration: ${exec.duration_ms ? Math.round(exec.duration_ms / 1000) : 0}s`,
                time: timeAgo,
                color: colors[agent] || 'bg-zinc-700',
            };
        });
    }, [executions]);

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
                        {loading ? 'Loading' : 'Live Data'}
                    </span>
                </div>
            </header>

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 shrink-0">
                <StatCard
                    label="Active Nodes"
                    value={agents.length.toString()}
                    icon={Cpu}
                    trend={{ value: "Stable", isPositive: true, label: "nodes" }}
                />
                <StatCard
                    label="Cognitive Load"
                    value={`${avgLoad}%`}
                    icon={Zap}
                    trend={{ value: avgLoad > 70 ? "High" : "Normal", isPositive: avgLoad <= 70, label: "demand" }}
                />
                <StatCard
                    label="Total Decisions"
                    value={totalExecutions.toLocaleString()}
                    icon={Activity}
                    trend={{ value: `${decisionsPerHour}/h`, isPositive: true, label: "avg" }}
                />
                <StatCard
                    label="Policy Index™"
                    value={`${complianceRate}%`}
                    icon={Shield}
                    iconColor="text-emerald-500"
                    trend={{ value: parseInt(complianceRate) >= 95 ? "Optimal" : "Review", isPositive: parseInt(complianceRate) >= 95, label: "compliance" }}
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
                        {cognitiveLoadData.length > 0 ? (
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
                        ) : (
                            <div className="h-full flex items-center justify-center text-white/40">Loading matrix...</div>
                        )}
                    </div>
                </Card>

                {/* Right: Feed & Security (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <Card padding="none" className="bg-black/40 border-white/5 backdrop-blur-xl flex flex-col overflow-hidden flex-1">
                        <div className="p-4 border-b border-white/5 bg-white/[0.02]">
                            <h3 className="text-white/60 text-[10px] uppercase font-black tracking-widest italic">Intelligence Feed</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-5 scrollbar-hide space-y-6">
                            {recentFeed.length > 0 ? recentFeed.map((item, i) => (
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
                            )) : (
                                <div className="text-center text-white/40 text-xs py-4">No recent activity</div>
                            )}
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

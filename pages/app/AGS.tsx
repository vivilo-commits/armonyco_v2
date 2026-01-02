import React from 'react';
import { FileCheck, TrendingUp, Calendar, Download, Shield, Award, CheckCircle } from '../../components/ui/Icons';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, Tooltip as RechartsTooltip, CartesianGrid } from 'recharts';
import { Card } from '../../components/ui/Card';
import { StatCard } from '../../components/app/StatCard';
import { Tooltip } from '../../components/ui/Tooltip';

const radarData = [
    { subject: 'Financial Control', A: 98, fullMark: 100 },
    { subject: 'Ops Consistency', A: 92, fullMark: 100 },
    { subject: 'Risk Mitigation', A: 96, fullMark: 100 },
    { subject: 'Data Integrity', A: 99, fullMark: 100 },
    { subject: 'Compliance', A: 95, fullMark: 100 },
    { subject: 'Recovery Speed', A: 88, fullMark: 100 },
];

const historyData = [
    { month: 'Jul', score: 82 },
    { month: 'Aug', score: 85 },
    { month: 'Sep', score: 89 },
    { month: 'Oct', score: 91 },
    { month: 'Nov', score: 94 },
    { month: 'Dec', score: 96 },
];

export const AGSView: React.FC = () => {
    return (
        <div className="p-8 animate-fade-in flex flex-col min-h-[calc(100vh-64px)] overflow-y-auto">
            {/* Header: Core Constructs Standard */}
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <FileCheck className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Governance Scorecard™</h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Certified Institutional Grade Operational Governance.</p>
                </div>
                <div className="flex gap-4 items-center">
                    <Tooltip text="Live audit protocol">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black flex items-center gap-2 shadow-sm uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.3)]"></div>
                            Audit Active
                        </span>
                    </Tooltip>
                </div>
            </header>

            {/* Split View Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">

                {/* Left Panel: Health & Metrics (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
                    {/* Main Grade Card */}
                    <Card variant="dark" padding="lg" className="flex flex-col justify-center items-center relative overflow-hidden group min-h-[350px] bg-black border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--color-brand-accent)] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="text-white/40 text-[10px] uppercase tracking-[0.3em] mb-4 font-black z-10">Current Operational Grade</div>
                        <div className="text-8xl leading-none font-serif text-[var(--color-brand-accent)] mb-4 drop-shadow-[0_0_30px_rgba(212,175,55,0.2)] z-10 italic">A+</div>
                        <div className="text-3xl font-numbers text-white tracking-tighter z-10 italic">96<span className="text-base text-white/30 ml-1 font-normal non-italic">/100</span></div>

                        <div className="mt-12 flex flex-col gap-3 items-center z-10">
                            <div className="flex gap-6 text-[9px] uppercase tracking-[0.2em] text-white/60 font-black">
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Audit Ready</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Verified</div>
                            </div>
                        </div>
                        <img src="/assets/logo-icon.png" alt="Armonyco" className="w-48 h-48 opacity-[0.03] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none filter brightness-0 invert transition-transform duration-1000" style={{ color: 'var(--color-background)' }} />
                    </Card>

                    {/* Status Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard
                            label="Velocity"
                            value="High"
                            icon={TrendingUp}
                            trend={{ value: "+4%", isPositive: true, label: "MoM" }}
                        />
                        <StatCard
                            label="Policy"
                            value="100%"
                            icon={Shield}
                            iconColor="text-emerald-500"
                            subtext={<span className="text-emerald-500/80 font-black uppercase tracking-widest text-[9px]">Full Coverage</span>}
                        />
                    </div>

                    {/* Trajectory */}
                    <Card padding="md" className="bg-white/[0.01] border-white/5 min-h-[180px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                                <TrendingUp size={14} /> 6-Month Trajectory
                            </h3>
                        </div>
                        <div className="h-32 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={historyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0, 0, 0, 0.9)',
                                            backdropFilter: 'blur(8px)',
                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                            color: '#FFFFFF',
                                            fontSize: '10px',
                                            borderRadius: '12px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="score"
                                        stroke="var(--color-brand-accent)"
                                        strokeWidth={3}
                                        dot={{ fill: 'var(--color-brand-accent)', r: 3, strokeWidth: 1, stroke: 'var(--color-background)' }}
                                        activeDot={{ r: 5, fill: '#fff', strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Report Download (Footer) */}
                    <div className="flex justify-center pt-2">
                        <button className="flex items-center gap-3 text-[10px] text-white/50 hover:text-white transition-all px-6 py-3 hover:bg-white/5 rounded-full border border-white/5 hover:border-white/20 uppercase tracking-[0.2em] font-black group">
                            <Download size={14} className="group-hover:-translate-y-0.5 transition-transform" /> Download Audit Report (PDF)
                        </button>
                    </div>
                </div>

                {/* Right Panel: Visualization (8 cols) */}
                <div className="lg:col-span-8 flex flex-col h-full">
                    <Card padding="lg" className="min-h-[600px] flex flex-col border-white/5 bg-black/40 backdrop-blur-xl" overflowHidden={false}>
                        <h3 className="text-white font-medium text-xs uppercase tracking-[0.2em] opacity-80 mb-10">Policy Dimension Topology</h3>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase' }} />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Governance Score"
                                        dataKey="A"
                                        stroke="var(--color-brand-accent)"
                                        strokeWidth={3}
                                        fill="var(--color-brand-accent)"
                                        fillOpacity={0.1}
                                    />
                                    <RechartsTooltip
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
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/5 text-center shrink-0">
                            <p className="text-[9px] text-white/20 font-mono uppercase tracking-[0.3em] font-bold">
                                AGS Protocol v1.1.4 • Certified Operational Integrity • Institutional Grade
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
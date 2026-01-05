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
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">AGS - Armonyco Governance Scorecard™ <span className="text-white/20 text-sm font-normal lowercase italic tracking-normal ml-2">/ institutional consolidation</span></h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Consolidating performance metrics per unit, group, and product. Proving governance with real numbers.</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">

                {/* Left Panel: Health & Metrics (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Main Grade Card */}
                    <Card variant="dark" padding="lg" className="flex flex-col justify-center items-center relative overflow-hidden group min-h-[350px] bg-black border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--color-brand-accent)] to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                        <div className="text-white/40 text-[9px] uppercase tracking-[0.3em] mb-4 font-black z-10 opacity-60">Current Operational Grade</div>
                        <div className="text-8xl leading-none font-numbers text-[var(--color-brand-accent)] mb-4 drop-shadow-[0_0_30px_rgba(212,175,55,0.2)] z-10 italic font-black">A+</div>
                        <div className="text-3xl font-numbers text-white tracking-tighter z-10 italic font-black">96<span className="text-base text-white/30 ml-1 font-numbers not-italic">/100</span></div>

                        <div className="mt-12 flex flex-col gap-3 items-center z-10">
                            <div className="flex gap-6 text-[9px] uppercase tracking-[0.2em] text-white/60 font-black">
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Audit Ready</div>
                                <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Verified</div>
                            </div>
                        </div>
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
                            subtext={<span className="text-emerald-500 font-black uppercase tracking-widest text-[9px]">Full Coverage</span>}
                        />
                    </div>
                </div>

                {/* Right Panel: Visualization (8 cols) */}
                <div className="lg:col-span-8 flex flex-col">
                    <Card padding="lg" className="h-full min-h-[500px] flex flex-col border-white/5 bg-black/40 backdrop-blur-xl" overflowHidden={false}>
                        <h3 className="text-white font-light text-sm uppercase tracking-tight opacity-80 mb-10">Dimension Topology <span className="text-white/20 text-xs lowercase italic tracking-normal ml-2">/ governance audit matrix</span></h3>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 900 }} />
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
                    </Card>
                </div>
            </div>

            {/* Bottom Row: Trajectory (Edge to Edge) */}
            <div className="flex flex-col gap-6">
                <Card padding="lg" className="bg-black/40 border-white/5 backdrop-blur-xl w-full">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-white/40 text-[9px] uppercase tracking-[0.2em] font-black flex items-center gap-2">
                            <TrendingUp size={14} /> Trajectory <span className="text-white/20 lowercase italic tracking-normal ml-2">/ 6-month governance evolution</span>
                        </h3>
                        <div className="flex gap-4">
                            <span className="text-[9px] text-white/30 font-black uppercase tracking-widest italic">Matrix Calibration: 99.8%</span>
                        </div>
                    </div>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={historyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="month" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} fontWeight="900" dy={10} />
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
                                    strokeWidth={4}
                                    dot={{ fill: 'var(--color-brand-accent)', r: 4, strokeWidth: 2, stroke: 'var(--color-background)' }}
                                    activeDot={{ r: 6, fill: '#fff', strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Report Download */}
                <div className="flex justify-center pt-4">
                    <button className="flex items-center gap-4 text-[10px] text-white/40 hover:text-[var(--color-brand-accent)] transition-all px-10 py-4 hover:bg-white/5 rounded-full border border-white/5 uppercase tracking-[0.3em] font-black group">
                        <Download size={16} className="group-hover:-translate-y-1 transition-transform" /> Download Audit Protocol (PDF)
                    </button>
                </div>
            </div>


            <div className="mt-12 pt-6 border-t border-white/5 text-center shrink-0">
                <p className="text-[9px] text-white/10 font-black uppercase tracking-[0.5em] italic">
                    AGS - Armonyco Governance Scorecard™ Protocol v1.1.4 • Certified Operational Integrity • Institutional Grade
                </p>
            </div>
        </div>
    );
};
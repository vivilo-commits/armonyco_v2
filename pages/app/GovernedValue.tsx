import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Search, Filter, Calendar, TrendingUp, Shield, Activity, CheckCircle } from '../../components/ui/Icons';
import { FloatingInput } from '../../components/ui/FloatingInput';
import { Card } from '../../components/ui/Card';
import { Tooltip } from '../../components/ui/Tooltip';

const data = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 12000 },
    { name: 'Mar', value: 18000 },
    { name: 'Apr', value: 27000 },
    { name: 'May', value: 32000 },
    { name: 'Jun', value: 41000 },
    { name: 'Jul', value: 47832 },
];

export const GovernedValueView: React.FC = () => {
    const [minAmount, setMinAmount] = useState('');

    return (
        <div className="p-8 animate-fade-in flex flex-col min-h-[calc(100vh-64px)] overflow-y-auto overflow-x-hidden bg-black text-white">
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Governed Value™ <span className="text-white/40 italic">Lifetime</span></h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Wealth that survives personnel shifts, disputes, and ownership evolution.</p>
                </div>
                <div className="flex gap-2">
                    <Tooltip text="Real-time wealth tracking">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black flex items-center gap-2 shadow-sm uppercase tracking-widest">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            Tracking Active
                        </span>
                    </Tooltip>
                </div>
            </header>

            {/* Filter Bar */}
            <Card padding="md" className="mb-8 flex flex-wrap gap-4 items-center flex-shrink-0 bg-black/20 border-white/5 shadow-xl hover:border-white/10 transition-all rounded-2xl">
                <div className="flex items-center gap-3 px-4 bg-white/[0.03] border border-white/5 rounded-xl w-auto h-[50px] group hover:bg-white/[0.05] transition-colors">
                    <span className="text-white/30 text-[9px] font-black uppercase tracking-widest">Identity</span>
                    <select className="bg-transparent border-none outline-none text-xs text-white appearance-none cursor-pointer pr-8 font-bold uppercase tracking-tight min-w-[170px]">
                        <option>ARMONYCO CREDITS (€)</option>
                    </select>
                </div>

                <div className="w-52 h-[50px]">
                    <FloatingInput
                        label="Minimal Threshold"
                        type="number"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        startIcon={<Filter size={16} className="text-white/40" />}
                    />
                </div>

                <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] border border-white/5 rounded-xl flex-1 h-[50px] group hover:bg-white/[0.05] transition-colors">
                    <Calendar size={14} className="text-white/30" />
                    <span className="text-white/80 text-xs font-bold uppercase tracking-widest">2024 Institutional Fiscal Year</span>
                </div>
            </Card>

            <div className="flex-1 min-h-0 flex flex-col gap-10">
                <div className="h-96 w-full relative shrink-0">
                    <Card padding="lg" className="h-full relative border-white/5 bg-black/40 backdrop-blur-xl group overflow-hidden" overflowHidden={false}>
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--color-brand-accent)]/30 to-transparent"></div>

                        <div className="absolute top-8 right-10 z-10 text-right animate-slide-up">
                            <span className="text-[var(--color-brand-accent)] font-numbers text-5xl font-black block mb-2 tracking-tighter italic drop-shadow-[0_0_20px_rgba(212,175,55,0.2)]">47,832 €</span>
                            <span className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-black flex items-center justify-end gap-2">
                                <Activity size={12} className="animate-pulse" /> Cumulative Institutional Value
                            </span>
                        </div>

                        <div className="h-full pt-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--color-brand-accent)" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="var(--color-brand-accent)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dy={10} fontWeight="bold" />
                                    <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} dx={-10} fontWeight="bold" />
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
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="var(--color-brand-accent)"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                        animationDuration={1500}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 shrink-0 md:pb-10">
                    <Card padding="lg" className="flex flex-col justify-between h-36 bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all group rounded-2xl">
                        <div>
                            <h3 className="text-white/20 text-[9px] uppercase font-black tracking-[0.3em] mb-3 group-hover:text-white/40 transition-colors">Largest Accumulation</h3>
                            <p className="text-white text-3xl font-numbers font-black italic tracking-tighter">12,450 €</p>
                        </div>
                        <div className="text-emerald-500/60 text-[10px] flex items-center gap-2 font-bold uppercase tracking-widest">
                            <TrendingUp size={14} className="text-emerald-500" /> Contract_Renewal_V2
                        </div>
                    </Card>

                    <Card padding="lg" className="flex flex-col justify-between h-36 bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all group rounded-2xl">
                        <div>
                            <h3 className="text-white/20 text-[9px] uppercase font-black tracking-[0.3em] mb-3 group-hover:text-white/40 transition-colors">Governance Density</h3>
                            <p className="text-white text-3xl font-numbers font-black italic tracking-tighter">100%</p>
                        </div>
                        <div className="text-white/40 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 italic">
                            <Shield size={14} className="text-[var(--color-brand-accent)]" /> Institutional Fidelity
                        </div>
                    </Card>

                    <Card padding="lg" className="flex flex-col justify-between h-36 bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all group rounded-2xl">
                        <div>
                            <h3 className="text-white/20 text-[9px] uppercase font-black tracking-[0.3em] mb-3 group-hover:text-white/40 transition-colors">Conflict Rate</h3>
                            <p className="text-white text-3xl font-numbers font-black italic tracking-tighter">0.00%</p>
                        </div>
                        <div className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 italic">
                            <CheckCircle size={14} className="text-emerald-500" /> Zero Ledger Disputes
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
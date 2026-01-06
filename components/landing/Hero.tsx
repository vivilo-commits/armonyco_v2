import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Zap, Activity, CheckCircle, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { AnimatedButton } from '../ui/AnimatedButton';
import { AgentCard } from '../ui/AgentCard';
import { Card } from '../ui/Card';

export const Hero = ({ onStartNow }: { onStartNow?: () => void }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="relative w-full px-4 md:px-8 pb-12 pt-20 md:pt-24">
            {/* THE PREMIUM SHELL CONTAINER */}
            <div className="relative w-full max-w-[1440px] mx-auto bg-zinc-950 rounded-[3rem] overflow-hidden min-h-[90vh] flex items-center shadow-[0_0_50px_rgba(0,0,0,0.3)] border border-white/5">

                {/* Shell Background Ambience */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-800/30 via-zinc-950 to-zinc-950 z-0" />
                <div className="absolute -top-[500px] -right-[500px] w-[1000px] h-[1000px] bg-[var(--color-brand-primary)]/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-[500px] -left-[500px] w-[1000px] h-[1000px] bg-[var(--color-brand-accent)]/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-8 md:px-16 relative z-10 w-full h-full py-20 md:py-24">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center h-full">

                        {/* LEFT COLUMN: Narrative */}
                        <div className={`space-y-10 text-center lg:text-left transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} relative z-20`}>
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-sm group cursor-default hover:bg-white/10 transition-colors">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-accent)] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-brand-accent)]"></span>
                                </span>
                                <span className="text-xs font-semibold tracking-wider text-zinc-300 italic">Powered by ArmonycoOS™</span>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-[var(--color-brand-accent)] text-xs font-black uppercase tracking-[0.4em]">Decision Infrastructure</h2>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.05] tracking-tight whitespace-nowrap lg:mr-[-400px]">
                                    The first <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 italic font-serif">Decision OS™</span><br />
                                    for flexible hospitality.
                                </h1>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xl text-white font-medium whitespace-nowrap">
                                    ArmonycoOS™ The first Decision OS for flexible hospitality.
                                </p>

                                <div className="max-w-xl mx-auto lg:mx-0">
                                    <p className="text-base text-zinc-400 leading-relaxed font-light mb-6">
                                        Armonyco is the operational decision layer that governs how revenue, risk, and operations are decided across fragmented PMS, AI tools, and local operators.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 border-l-2 border-[var(--color-brand-accent)]/30 pl-6 mb-8">
                                        <div className="text-xs text-zinc-500 font-medium flex items-center gap-2">• Not a PMS</div>
                                        <div className="text-xs text-zinc-500 font-medium flex items-center gap-2">• Not an AI concierge</div>
                                        <div className="text-xs text-zinc-500 font-medium flex items-center gap-2">• Not an automation tool</div>
                                        <div className="text-xs text-zinc-500 font-medium flex items-center gap-2">• Not a dashboard</div>
                                    </div>

                                    <p className="text-sm text-zinc-500 italic leading-relaxed">
                                        Designed for operators, platforms, and investors who need hospitality to be scalable, auditable, and investable — not just automated.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start items-center pt-4">
                                <AnimatedButton onClick={onStartNow} text="Schedule a demo →" width="320px" expanded={true} className="shadow-[0_0_30px_rgba(212,175,55,0.3)]" />
                            </div>

                            <div className="pt-6 flex flex-col items-center lg:items-start gap-4 opacity-100 transition-all duration-500">
                                <div className="flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        {[
                                            '/assets/social-1.png',
                                            '/assets/social-2.png',
                                            '/assets/social-3.png',
                                            '/assets/social-4.png',
                                            '/assets/social-5.png'
                                        ].map((src, i) => (
                                            <div key={i} className="w-12 h-12 rounded-full border-[3px] border-zinc-950 bg-zinc-900 overflow-hidden shadow-lg">
                                                <img
                                                    src={src}
                                                    alt="Operator"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-0.5 text-center lg:text-left">
                                    <div className="text-sm text-zinc-200 font-medium tracking-wide">
                                        Trusted by <span className="text-[var(--color-brand-accent)] font-bold">500+</span> Property Managers
                                    </div>
                                    <p className="text-xs text-zinc-500 font-light">
                                        Governing decisions, not just automation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: The Living Scene (ENLARGED) */}
                        <div className={`relative h-[600px] w-full hidden lg:block perspective-1000 scale-110 origin-center transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0 translate-y-24' : 'opacity-0 translate-x-10'} z-10 pointer-events-none`}>

                            {/* Background Element: ARS System */}
                            <div className="absolute top-0 right-10 w-[300px] opacity-40 scale-90 blur-[2px] animate-float-slow z-0">
                                <Card padding="lg" hover={false} className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-sm">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center text-zinc-500"><Shield size={16} /></div>
                                        <div>
                                            <div className="text-xs font-bold text-zinc-500 uppercase">ARS - Armonyco Reliability System™</div>
                                            <div className="text-[10px] text-zinc-700">Governance Substrate</div>
                                        </div>
                                    </div>
                                    <div className="h-16 flex items-end justify-between gap-1 opacity-50">
                                        {[40, 60, 45, 70, 50, 80, 75].map((h, i) => (
                                            <div key={i} className="w-full bg-zinc-700 rounded-t" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </Card>
                            </div>

                            {/* Main Element: Amelia (Decision Guardian) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] animate-float z-20">
                                <div className="relative group cursor-pointer">
                                    {/* Active Glow Effect */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-tr from-[var(--color-brand-accent)] via-[var(--color-brand-primary)] to-white opacity-20 blur-xl rounded-[2rem] group-hover:opacity-40 transition duration-1000 animate-pulse-slow"></div>

                                    <div className="relative bg-[#0A0A0A] rounded-[1.8rem] border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden p-1.5">
                                        <div className="bg-zinc-900/50 rounded-[1.4rem] p-6 border border-white/5">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 flex items-center justify-center shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]">
                                                        <Shield size={28} className="text-[var(--color-brand-accent)] drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-bold text-xl tracking-tight">Amelia</h3>
                                                        <div className="text-[11px] text-[var(--color-brand-accent)] uppercase tracking-[0.2em] font-bold mt-1">Decision Guardian</div>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)] animate-pulse shadow-[0_0_15px_#10b981]" />
                                                </div>
                                            </div>

                                            <div className="space-y-4 mb-8">
                                                <div className="flex justify-between text-xs py-2 border-b border-white/5 group-hover:border-white/10 transition-colors">
                                                    <span className="text-zinc-500 font-medium">Status</span>
                                                    <span className="text-white font-mono tracking-wide">Governance Active</span>
                                                </div>
                                                <div className="flex justify-between text-xs py-2 border-b border-white/5 group-hover:border-white/10 transition-colors">
                                                    <span className="text-zinc-500 font-medium">Compliance</span>
                                                    <span className="text-[var(--color-success)] font-mono font-bold tracking-wide">Validated (99.8%)</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 items-center">
                                                <div className="h-1.5 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-[var(--color-brand-accent)] to-[#F5E6BE] w-[92%] relative">
                                                        <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 blur-[4px]" />
                                                    </div>
                                                </div>
                                                <span className="text-[11px] font-mono text-zinc-400 font-bold">92%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Element: KPI Badge */}
                            <div className="absolute bottom-24 left-8 animate-float-reverse animation-delay-2000 z-30">
                                <div className="bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-4 rounded-2xl flex items-center gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:bg-black/60 transition-colors cursor-default">
                                    <div className="p-2 bg-[var(--color-brand-accent)]/10 rounded-xl text-[var(--color-brand-accent)]">
                                        <Zap size={18} fill="currentColor" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-zinc-500 uppercase font-black tracking-wider">Latency</div>
                                        <div className="text-base font-numbers font-bold text-white mt-0.5">24ms <span className="text-[var(--color-success)] text-[10px] ml-1 px-1.5 py-0.5 rounded-md bg-[var(--color-success)]/10">↓ 12%</span></div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Element: Verification log */}
                            <div className="absolute bottom-10 right-4 animate-slide-up-slow animation-delay-1000 z-30 hidden xl:block">
                                <div className="bg-zinc-950/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl font-mono text-[9px] text-zinc-500 space-y-1 w-[200px]">
                                    <div className="flex justify-between border-b border-white/5 pb-1 mb-2">
                                        <span className="text-[var(--color-brand-accent)]">Verification.log</span>
                                        <span className="text-zinc-600">LIVE</span>
                                    </div>
                                    <div className="text-emerald-500/80">✔ Decision-Audit passed</div>
                                    <div className="text-zinc-400">→ Encrypting handshake...</div>
                                    <div className="text-zinc-400">→ Verifying AEM - Armonyco Event Model™ hash...</div>
                                    <div className="text-emerald-500/80">✔ Proof-of-Control valid</div>
                                    <div className="animate-pulse inline-block w-1.5 h-3 bg-zinc-700 ml-1" />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import { Network, Zap, Cpu, Server, Activity, Clock, TrendingUp, CheckCircle, FileText, MessageCircle, Link, Shield, Calendar, Mail, User, Phone, MapPin, Search, ChevronDown, Plus, Info } from '../../components/ui/Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../../components/ui/Card';
import { useAgents } from '../../src/hooks/useLogs';
import { Modal } from '../../components/ui/Modal';

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
    const { data: agentsData } = useAgents();
    const agents = agentsData || [];
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

    return (
        <div className="p-8 animate-fade-in flex flex-col min-h-screen">
            {/* Header: Core Constructs Standard */}
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Network className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">AOS - Armonyco Operating System™ <span className="text-white/20 text-sm font-normal lowercase italic tracking-normal ml-2">/ executable truth</span></h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Trasforma la verità istituzionale in una sequenza eseguibile di azioni governate e monitorate.</p>
                </div>
            </header>

            {/* Performance Topology Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 shrink-0 mb-10">

                {/* Left Panel: Health & Metrics (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6 scrollbar-hide">
                    {/* Primary System Status */}
                    <Card variant="dark" padding="lg" className="relative overflow-hidden group border border-white/10 bg-black/40 backdrop-blur-md">
                        <div className="relative z-10">
                            <div className="text-white/40 text-[9px] uppercase tracking-[0.2em] mb-4 font-black opacity-60">System Uptime</div>
                            <div className="text-6xl font-numbers text-white leading-none pb-2 font-black tracking-tighter italic">99.99%</div>
                            <div className="text-emerald-500 text-[10px] mt-4 flex items-center gap-2 font-black uppercase tracking-[0.2em] italic">
                                <Activity size={14} className="animate-pulse" /> Cluster Health: Optimal
                            </div>
                        </div>
                    </Card>

                    {/* Operational Value */}
                    <Card padding="md" className="bg-white/[0.01] border-white/5">
                        <div className="text-white/40 text-[9px] uppercase tracking-[0.2em] mb-3 font-black opacity-60">Cluster Value Growth</div>
                        <div className="text-3xl font-numbers text-[var(--color-brand-accent)] h-[50px] flex items-center font-black tracking-tight italic">12,500 <span className="text-xs ml-2 opacity-40 font-numbers uppercase tracking-widest not-italic">€</span></div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-3">
                            <div className="bg-[var(--color-brand-accent)] w-[75%] h-full rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)]"></div>
                        </div>
                    </Card>
                </div>

                {/* Right Panel: Visualization (8 cols) */}
                <div className="lg:col-span-8 flex flex-col h-full">
                    <Card padding="lg" className="h-full min-h-[400px] flex flex-col border-white/5 bg-black/40 backdrop-blur-xl" overflowHidden={false}>
                        <div className="flex justify-between items-center mb-10 shrink-0">
                            <h3 className="text-white font-light text-sm uppercase tracking-tight opacity-80">Topology: Load vs Latency <span className="text-white/20 text-xs lowercase italic tracking-normal ml-2">/ global cluster nodes</span></h3>
                            <div className="flex gap-6 text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white opacity-80"></div> Node Load</div>
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
                                    <Area type="monotone" dataKey="load" stroke="#fff" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
                                    <Area type="monotone" dataKey="latency" stroke="var(--color-brand-accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Live Conversations Dashboard */}
            <div className="flex flex-col mb-12 shrink-0">
                <div className="flex items-center justify-between px-1 mb-4 shrink-0">
                    <h3 className="text-white font-light text-sm uppercase tracking-tight opacity-80">Live Neural Channels <span className="text-white/20 text-xs lowercase italic tracking-normal ml-2">/ real-time guest interaction</span></h3>
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest italic">Live Stream Active</span>
                    </div>
                </div>

                <Card padding="none" className="bg-black/60 border-white/10 backdrop-blur-2xl h-[750px] overflow-hidden flex flex-col">
                    <div className="grid grid-cols-12 h-full divide-x divide-white/5 overflow-hidden">
                        {/* 1. Conversations Index (3 cols) */}
                        <div className="col-span-3 flex flex-col h-full bg-white/[0.02] overflow-hidden">
                            <div className="p-4 border-b border-white/5 space-y-4 shrink-0">
                                <div className="relative">
                                    <input type="text" placeholder="Search Guest Name or ID..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[11px] text-white outline-none focus:border-[var(--color-brand-accent)]/40 italic" />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                                {[
                                    { name: 'Szewczyk Donata', unit: 'Muggia 21 Suites', status: 'Active', icon: 'bg-emerald-500', time: '1h 29m', source: 'WhatsApp' },
                                    { name: 'Asia Pigneto', unit: 'Patio Apt', status: 'Pending', icon: 'bg-amber-500', time: '1h 13m', source: 'PMS' },
                                    { name: 'Kadyrka Kiryll', unit: 'Navona Loft', status: 'Active', icon: 'bg-emerald-500', time: '2h 14m', source: 'WhatsApp' },
                                    { name: 'Vadim Molinches', unit: 'Campo dei Fiori', status: 'Resolved', icon: 'bg-zinc-500', time: '4h 05m', source: 'WhatsApp' },
                                    { name: 'Elena Petrova', unit: 'Trastevere Cozy', status: 'Active', icon: 'bg-emerald-500', time: '5m', source: 'PMS' },
                                    { name: 'John Smith', unit: 'Vatican View', status: 'Active', icon: 'bg-emerald-500', time: '42m', source: 'WhatsApp' },
                                    { name: 'Marco Rossi', unit: 'Spanish Steps', status: 'Attention', icon: 'bg-red-500', time: '12m', source: 'WhatsApp' },
                                    { name: 'Lucia Bianco', unit: 'Monti Loft', status: 'Active', icon: 'bg-emerald-500', time: '3h 10m', source: 'PMS' },
                                    { name: 'Robert Green', unit: 'Colosseum Suite', status: 'Pending', icon: 'bg-amber-500', time: '6h 22m', source: 'WhatsApp' }
                                ].map((chat, i) => (
                                    <div key={i} className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all ${i === 0 ? 'bg-white/5 border-l-2 border-l-[var(--color-brand-accent)]' : ''}`}>
                                        <div className="flex justify-between items-start mb-1.5">
                                            <span className="text-[13px] font-bold text-white tracking-tight">{chat.name}</span>
                                            <span className="text-[9px] text-white/20 font-black uppercase shrink-0">{chat.time}</span>
                                        </div>
                                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2.5">{chat.unit}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${chat.icon}`}></div>
                                                <span className="text-[9px] text-zinc-400 font-black uppercase tracking-tighter italic">{chat.status}</span>
                                            </div>
                                            <span className="text-[8px] text-[var(--color-brand-accent)] font-black uppercase tracking-widest opacity-40">{chat.source}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Neural Thread (6 cols) */}
                        <div className="col-span-6 flex flex-col h-full bg-black/20 overflow-hidden">
                            {/* Chat Header */}
                            <div className="p-5 border-b border-white/5 bg-white/[0.01] flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[12px] font-black text-white shadow-lg">SD</div>
                                    <div>
                                        <div className="text-[14px] font-bold text-white leading-none mb-1">Szewczyk Donata</div>
                                        <div className="text-[9px] text-emerald-500 font-black uppercase tracking-widest italic flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                                            Active via Neural Channel — WhatsApp
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 text-white/40">
                                    <Clock size={16} />
                                    <Activity size={16} />
                                    <Link size={16} />
                                </div>
                            </div>

                            {/* Messages Area - FIXED SCROLLING */}
                            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide space-y-10 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                                <div className="flex flex-col items-center">
                                    <span className="px-4 py-1.5 bg-white/5 border border-white/5 rounded-full text-[9px] text-white/30 font-black uppercase tracking-[0.25em] mb-4">Monday, Dec 31</span>
                                </div>

                                {/* Flow closure label */}
                                <div className="flex flex-col items-center">
                                    <span className="px-4 py-1.5 bg-[var(--color-brand-accent)]/5 border border-[var(--color-brand-accent)]/10 rounded-full text-[9px] text-[var(--color-brand-accent)] font-black uppercase tracking-[0.25em] mb-4">Event Synchronized with PMS</span>
                                </div>

                                {/* AI Message */}
                                <div className="flex flex-col items-start max-w-[85%]">
                                    <div className="flex items-center gap-2 mb-2.5 font-black text-[var(--color-brand-accent)] text-[9px] uppercase tracking-widest italic">
                                        <Zap size={10} /> AMELIA AI Node
                                    </div>
                                    <div className="p-5 bg-zinc-900/95 border border-white/10 rounded-2xl rounded-tl-none shadow-2xl">
                                        <p className="text-[13px] text-white/90 leading-relaxed italic pr-4">
                                            ¡Hola Donata! Soy Amelia, el Guardián de Riesgos de Armonyco. He detectado que tu reserva para el 31 de diciembre no tiene una hora de llegada confirmada.
                                        </p>
                                        <div className="text-right mt-3 opacity-30 text-[9px] font-black uppercase tracking-widest">
                                            15:30 • Read
                                        </div>
                                    </div>
                                </div>

                                {/* Guest Message */}
                                <div className="flex flex-col items-end self-end max-w-[85%]">
                                    <div className="p-5 bg-[var(--color-brand-accent)]/10 border border-[var(--color-brand-accent)]/20 rounded-2xl rounded-tr-none shadow-2xl backdrop-blur-sm">
                                        <p className="text-[13px] text-white/95 leading-relaxed italic pl-4">
                                            Hola Amelia, que bien que me contactas. Si, llegamos el 31 sobre las 10:00 de la mañana. ¿Es posible dejar las maletas o entrar antes?
                                        </p>
                                        <div className="text-right mt-3 opacity-40 text-[9px] font-black uppercase">
                                            15:32
                                        </div>
                                    </div>
                                </div>

                                {/* AI Message */}
                                <div className="flex flex-col items-start max-w-[85%]">
                                    <div className="flex items-center gap-2 mb-2.5 font-black text-[var(--color-brand-accent)] text-[9px] uppercase tracking-widest italic">
                                        <Zap size={10} /> AMELIA AI Node
                                    </div>
                                    <div className="p-5 bg-zinc-900/95 border border-white/10 rounded-2xl rounded-tl-none shadow-2xl">
                                        <p className="text-[13px] text-white/90 leading-relaxed italic">
                                            Para poder ayudarte con tu reserva necesito verificar un segundo dato. ¿Podrías confirmarme, por favor, el número de noches de tu estancia? Así podré localizar tu reserva correctamente en el sistema.
                                        </p>
                                        <div className="text-right mt-3 opacity-30 text-[9px] font-black">
                                            15:38
                                        </div>
                                    </div>
                                </div>

                                {/* Guest Message */}
                                <div className="flex flex-col items-end self-end max-w-[85%]">
                                    <div className="p-5 bg-[var(--color-brand-accent)]/10 border border-[var(--color-brand-accent)]/20 rounded-2xl rounded-tr-none shadow-2xl backdrop-blur-sm">
                                        <p className="text-[13px] text-white/95 leading-relaxed italic pl-4">
                                            Si claro, nos quedamos 5 noches. El código es 17722/2025 de Booking.
                                        </p>
                                        <div className="text-right mt-3 opacity-40 text-[9px] font-black uppercase">
                                            15:40
                                        </div>
                                    </div>
                                </div>

                                {/* LARA Message */}
                                <div className="flex flex-col items-start max-w-[85%]">
                                    <div className="flex items-center gap-2 mb-2.5 font-black text-emerald-500 text-[9px] uppercase tracking-widest italic">
                                        <Activity size={10} /> LARA Planning Node
                                    </div>
                                    <div className="p-5 bg-emerald-500/[0.02] border border-emerald-500/20 rounded-2xl rounded-tl-none shadow-xl">
                                        <p className="text-[13px] text-emerald-500/80 leading-relaxed italic">
                                            Perfecto Donata. He consultado el calendario y tenemos disponibilidad para un Early Check-in a las 10:00. El cargo adicional es de 25€. ¿Deseas que procedamos con el cargo automático a tu tarjeta registrada?
                                        </p>
                                        <div className="text-right mt-3 opacity-30 text-[9px] font-black">
                                            15:42
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chat Footer / Input */}
                            <div className="p-5 border-t border-white/5 bg-black/40 shrink-0">
                                <div className="relative group">
                                    <input type="text" placeholder="Neural Override: Direct intervention as Human Admin..." className="w-full bg-white/5 border border-white/10 rounded-xl px-14 py-4 text-[13px] text-white outline-none focus:border-[var(--color-brand-accent)]/40 italic transition-all group-hover:bg-white/[0.08]" />
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20"><MessageCircle size={18} /></div>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[var(--color-brand-accent)] cursor-pointer hover:scale-110 transition-transform"><TrendingUp size={18} /></div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Contextual Intelligence (3 cols) */}
                        <div className="col-span-3 flex flex-col h-full bg-black/40 p-6 overflow-hidden">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-8 italic flex items-center gap-3 shrink-0">
                                <Shield size={14} className="opacity-40" />
                                Reservation Topology
                            </h4>

                            <div className="flex-1 overflow-y-auto scrollbar-hide space-y-8">
                                <div
                                    onClick={() => setIsReservationModalOpen(true)}
                                    className="p-5 bg-white/[0.03] border border-white/10 rounded-2xl relative overflow-hidden group hover:border-[var(--color-brand-accent)]/30 transition-all cursor-pointer"
                                >
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-10 h-10 rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20 flex items-center justify-center text-white font-black text-sm">B.</div>
                                            <div className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center gap-2">
                                                <CheckCircle size={12} className="text-emerald-500" />
                                                <span className="text-[10px] text-emerald-500 font-black uppercase">Active</span>
                                            </div>
                                        </div>
                                        <div className="text-[14px] font-bold text-white mb-1">Szewczyk Donata</div>
                                        <div className="text-[10px] text-zinc-500 font-black mb-6 uppercase tracking-widest">Code: 17722 / 2025</div>

                                        <div className="space-y-3 shrink-0">
                                            <div className="flex flex-col p-3 bg-black/40 rounded-xl border border-white/5">
                                                <span className="text-[9px] text-white/40 font-black uppercase tracking-widest mb-1">Check-in Sequence</span>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[12px] text-white font-bold italic tracking-tight">Mer 31/12/2025</span>
                                                    <span className="text-[11px] text-[var(--color-brand-accent)] font-black">10:00</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Card variant="dark" padding="md" className="border-amber-500/30 bg-amber-500/[0.03] shrink-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                        <span className="text-[9px] text-amber-500 font-black uppercase tracking-[0.25em]">Staff Intelligence</span>
                                    </div>
                                    <p className="text-[12px] text-amber-500/80 leading-relaxed italic font-medium">
                                        "Addebitata stripe 03.12 nath deve pagare 30€ tax."
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* HIGH-FIDELITY RESERVATION MODAL [NEW] */}
            <Modal
                isOpen={isReservationModalOpen}
                onClose={() => setIsReservationModalOpen(false)}
                width="full"
            >
                <div className="bg-[#1c222d] text-white max-h-[75vh] flex flex-col font-sans overflow-hidden">
                    {/* Modal Top Bar */}
                    <div className="px-5 py-3 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-[10px] font-medium text-white/60">
                                <FileText size={12} className="opacity-50" />
                                117874/2025 [18105]
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-white">
                                <span className="text-white/40 font-normal italic">Ref:</span> B. 6618160637
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-white">
                                <User size={12} className="opacity-50" />
                                Shurpik Maksim
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-white/60">
                                <Calendar size={12} className="opacity-50" />
                                04/01/2026 - 07/01/2026
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-white/60">
                                <Clock size={12} className="opacity-50" />
                                3 Notti
                            </div>
                            <div className="text-[10px] font-bold text-white">288,12€</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold flex items-center gap-2">
                                <Activity size={10} className="text-[var(--color-brand-accent)]" /> Segmenti
                            </div>
                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center"><Phone size={12} /></div>
                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center"><Mail size={12} /></div>
                        </div>
                    </div>

                    {/* Modal Body: 3 Columns */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-hide">
                        <div className="grid grid-cols-3 gap-6">
                            {/* Column 1: Info & Status */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Riferimento</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-lg p-3 text-[13px] font-bold flex justify-between items-center">
                                            Shurpik Maksim
                                            <span className="text-[10px] text-[var(--color-brand-accent)] font-black">EN</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center opacity-60"><Plus size={14} /></div>
                                        <div className="w-8 h-8 rounded border border-white/10 flex items-center justify-center opacity-60"><Search size={14} /></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Status</label>
                                        <div className="bg-blue-600 px-3 py-2 rounded-lg text-[11px] font-bold flex justify-between items-center">
                                            Check-in effettuato
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Scadenza</label>
                                        <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-[11px] flex justify-between items-center text-white/40">
                                            gg/mm/aaaa
                                            <Calendar size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Periodo</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-[11px] font-bold">04/01/2026</div>
                                        <div className="w-12 bg-white/5 border border-white/10 px-2 py-2 rounded-lg text-center text-[11px] font-bold">3</div>
                                        <div className="flex-1 bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-[11px] font-bold">07/01/2026</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 text-[8px]">Arrival Time</label>
                                        <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-[11px] flex justify-between items-center">
                                            14:00 <Clock size={12} className="opacity-40" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 text-[8px]">Departure</label>
                                        <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-[11px] flex justify-between items-center">
                                            06:30 <Clock size={12} className="opacity-40" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 text-[8px]">Prenotazione</label>
                                        <div className="bg-white/5 border border-white/10 px-2 py-2 rounded-lg text-[9px] text-white/60">
                                            03/12/2025
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 2: Lead & Acquisition */}
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Email</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-[12px] font-medium text-white/80 overflow-hidden text-ellipsis italic">
                                            mshurp.412180@guest.booking.com
                                        </div>
                                        <button className="px-4 py-2 bg-[var(--color-brand-accent)]/10 text-[var(--color-brand-accent)] border border-[var(--color-brand-accent)]/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[var(--color-brand-accent)]/20 transition-all flex items-center gap-2 shrink-0">
                                            Invia Email <Mail size={12} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Tipologia Viaggio</label>
                                    <div className="bg-white/10 border border-white/20 px-3 py-2.5 rounded-lg text-[12px] font-bold flex justify-between items-center group cursor-pointer">
                                        Select Type...
                                        <ChevronDown size={16} className="opacity-40 group-hover:opacity-100" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Metodo Acquisizione</label>
                                        <div className="bg-white/10 border border-white/20 px-3 py-2.5 rounded-lg text-[12px] font-bold flex justify-between items-center group cursor-pointer">
                                            Channel Manager
                                            <ChevronDown size={14} className="opacity-40" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Origine Lead</label>
                                        <div className="bg-white/10 border border-white/20 px-3 py-2.5 rounded-lg text-[12px] font-bold flex justify-between items-center group cursor-pointer">
                                            OTA
                                            <ChevronDown size={14} className="opacity-40" />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-[var(--color-brand-accent)]/5 border border-[var(--color-brand-accent)]/10 rounded-xl">
                                    <div className="flex items-center gap-2 mb-2 text-[var(--color-brand-accent)]">
                                        <Info size={14} />
                                        <span className="text-[9px] font-black uppercase tracking-widest">System Intelligence Note</span>
                                    </div>
                                    <p className="text-[11px] italic text-[var(--color-brand-accent)]/80 leading-relaxed font-medium">
                                        Ospite forse ha già soggiornato nel cluster Armonyco (U42). Verificare cronologia pagamenti.
                                    </p>
                                </div>
                            </div>

                            {/* Column 3: Notes & Alerts */}
                            <div className="space-y-6">
                                <div className="space-y-2 flex flex-col h-full">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Note Canale</label>
                                    <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl flex-1 min-h-[140px]">
                                        <div className="text-[10px] font-black text-[var(--color-brand-accent)] uppercase tracking-wider mb-2">** THIS RESERVATION HAS BEEN PRE-PAID **</div>
                                        <p className="text-[11px] text-white/60 leading-relaxed italic">
                                            Reservation has a cancellation grace period. Do not charge if cancelled before 2025-12-04 22:40:20.
                                            BOOKING NOTE: Payment charge is EUR 3.6019.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Note Interne</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[12px] italic text-white/80 min-h-[100px] outline-none focus:border-[var(--color-brand-accent)]/40 transition-all"
                                        defaultValue="Deve pagare 42€ tax."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rooms/Units Bottom Table */}
                        <div className="mt-10 border-t border-white/5 pt-8 overflow-hidden">
                            <div className="flex gap-4 border-b border-white/5 pb-2 mb-6">
                                <span className="text-[11px] font-bold text-[var(--color-brand-accent)] border-b-2 border-[var(--color-brand-accent)] pb-2 px-4 cursor-pointer">Camere</span>
                                <span className="text-[11px] font-medium text-white/20 pb-2 px-4 cursor-pointer hover:text-white/40 transition-colors">Servizi</span>
                                <span className="text-[11px] font-medium text-white/20 pb-2 px-4 cursor-pointer hover:text-white/40 transition-colors">Audit</span>
                            </div>

                            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6">
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-1 text-[10px] font-black uppercase text-white/20">Unità</div>
                                    <div className="col-span-4 text-[10px] font-black uppercase text-white/20">Tariffa</div>
                                    <div className="col-span-2 text-[10px] font-black uppercase text-white/20">Ospiti Tot.</div>
                                    <div className="col-span-2 text-[10px] font-black uppercase text-white/20">Configurazione</div>
                                    <div className="col-span-2 text-[10px] font-black uppercase text-white/20">Prezzo/notte</div>
                                    <div className="col-span-1 text-[10px] font-black uppercase text-white/20">Totale</div>

                                    {/* Row 1 */}
                                    <div className="col-span-1 py-4">
                                        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                                            <FileText size={10} className="text-blue-500" />
                                            <span className="text-[9px] font-black text-blue-500">102J</span>
                                        </div>
                                    </div>
                                    <div className="col-span-4 py-4">
                                        <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-lg p-2.5 group cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <div className="px-1.5 py-0.5 bg-blue-600 rounded text-[8px] font-black uppercase">Q.</div>
                                                <span className="text-[11px] font-bold truncate">NON RIMBORSABILE - OTA</span>
                                            </div>
                                            <ChevronDown size={14} className="opacity-20 group-hover:opacity-100" />
                                        </div>
                                    </div>
                                    <div className="col-span-2 py-4">
                                        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-2.5 flex justify-between items-center text-[11px] font-bold">
                                            2 Ospiti <ChevronDown size={14} className="opacity-20" />
                                        </div>
                                    </div>
                                    <div className="col-span-2 py-4">
                                        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-2.5 flex justify-between items-center text-[11px] font-bold">
                                            Matrimoniale <ChevronDown size={14} className="opacity-20" />
                                        </div>
                                    </div>
                                    <div className="col-span-2 py-4">
                                        <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
                                            <span className="opacity-40">€</span> Prezzo/notte
                                        </button>
                                    </div>
                                    <div className="col-span-1 py-4 flex items-center justify-end gap-3 font-numbers text-[14px] font-black italic">
                                        246,12 <span className="text-emerald-500 font-black">€</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Bottom Sticky Button */}
                    <div className="p-6 border-t border-white/5 bg-black/40 flex justify-end shrink-0">
                        <button
                            onClick={() => setIsReservationModalOpen(false)}
                            className="px-10 py-3 bg-[var(--color-brand-accent)] text-black rounded-full text-[11px] font-black uppercase tracking-[0.2em] transform active:scale-95 transition-all shadow-xl shadow-[var(--color-brand-accent)]/20"
                        >
                            Chiudi Protocollo
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
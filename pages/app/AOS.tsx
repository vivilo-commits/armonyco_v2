import React, { useState, useEffect, useRef } from 'react';
import { Network, Zap, Cpu, Server, Activity, Clock, TrendingUp, CheckCircle, FileText, MessageCircle, Link, Shield, Calendar, Mail, User, Phone, MapPin, Search, ChevronDown, Plus, Info, Loader } from '../../components/ui/Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../../components/ui/Card';
import { useAgents } from '../../src/hooks/useLogs';
import { useConversations } from '../../src/hooks/useChat';
import { Modal } from '../../components/ui/Modal';
import { Conversation, Message } from '../../src/models/chat.model';

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
    const { data: conversations, status: convStatus } = useConversations();
    const agents = agentsData || [];
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
    const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Filter conversations by phone number
    const filteredConversations = conversations?.filter(c =>
        c.guestPhone.includes(searchTerm)
    ) || [];

    // Select first conversation on load
    useEffect(() => {
        if (conversations && conversations.length > 0 && !selectedConvId) {
            setSelectedConvId(conversations[0].id);
        }
    }, [conversations, selectedConvId]);

    // Auto-scroll to bottom when conversation changes or new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [selectedConvId, conversations]);

    const selectedConversation = conversations?.find(c => c.id === selectedConvId);

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `${diffMins}m`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ${diffMins % 60}m`;
        return date.toLocaleDateString();
    };

    return (
        <div className="p-8 animate-fade-in flex flex-col min-h-screen">
            {/* Header: Core Constructs Standard */}
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Network className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">AOS - Armonyco Operating System™ <span className="text-white/20 text-sm font-normal lowercase italic tracking-normal ml-2">/ executable truth</span></h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Transforms institutional truth into an executable sequence of governed and monitored actions.</p>
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
                                    <input
                                        type="text"
                                        placeholder="Search by phone number..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[11px] text-white outline-none focus:border-[var(--color-brand-accent)]/40"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                                {convStatus === 'pending' ? (
                                    <div className="flex items-center justify-center p-8">
                                        <Loader size={20} className="animate-spin text-white/20" />
                                    </div>
                                ) : filteredConversations.length > 0 ? (
                                    filteredConversations.map((conv) => (
                                        <div
                                            key={conv.id}
                                            onClick={() => setSelectedConvId(conv.id)}
                                            className={`p-4 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-all ${selectedConvId === conv.id ? 'bg-white/5 border-l-2 border-l-[var(--color-brand-accent)]' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-1.5 gap-2">
                                                <span className="text-[12px] font-bold text-white tracking-tight truncate">{conv.guestPhone}</span>
                                                <span className="text-[9px] text-white/40 font-medium shrink-0">{formatTime(conv.lastMessageTime)}</span>
                                            </div>
                                            <p className="text-[10px] text-zinc-500 truncate mb-2">{conv.messages.length} mensagens</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                <span className="text-[9px] text-zinc-400 font-medium">WhatsApp</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center">
                                        <p className="text-[10px] text-white/20 uppercase tracking-widest">No conversations</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 2. Neural Thread (6 cols) */}
                        <div className="col-span-9 flex flex-col h-full bg-black/20 overflow-hidden">
                            {/* Chat Header */}
                            <div className="p-5 border-b border-white/5 bg-white/[0.01] flex justify-between items-center shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[12px] font-black text-white shadow-lg">
                                        {selectedConversation ? getInitials(selectedConversation.guestName) : '??'}
                                    </div>
                                    <div>
                                        <div className="text-[14px] font-bold text-white leading-none mb-1">
                                            {selectedConversation?.guestName || 'Select a conversation'}
                                        </div>
                                        <div className="text-[9px] text-emerald-500 font-black uppercase tracking-widest italic flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                                            {selectedConversation?.guestPhone || 'No phone'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3 text-white/40">
                                    <Clock size={16} />
                                    <Activity size={16} />
                                    <Link size={16} />
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-8 scrollbar-hide space-y-6 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
                                {selectedConversation?.messages && selectedConversation.messages.length > 0 ? (
                                    selectedConversation.messages.map((msg) => (
                                        <div key={msg.id} className={`flex flex-col ${msg.senderId === 'me' ? 'items-end self-end' : 'items-start'} max-w-[85%]`}>
                                            {msg.senderId === 'me' ? null : (
                                                <div className="flex items-center gap-2 mb-2.5 font-black text-[var(--color-brand-accent)] text-[9px] uppercase tracking-widest italic">
                                                    <Zap size={10} /> Guest
                                                </div>
                                            )}
                                            <div className={`p-5 rounded-2xl shadow-2xl ${msg.senderId === 'me'
                                                ? 'bg-[var(--color-brand-accent)]/10 border border-[var(--color-brand-accent)]/20 rounded-tr-none'
                                                : 'bg-zinc-900/95 border border-white/10 rounded-tl-none'
                                                }`}>
                                                <p className={`text-[13px] leading-relaxed italic ${msg.senderId === 'me' ? 'text-white/95 pl-4' : 'text-white/90 pr-4'}`}>
                                                    {msg.text}
                                                </p>
                                                <div className="text-right mt-3 opacity-30 text-[9px] font-black uppercase tracking-widest">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {msg.isRead && ' • Read'}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-[10px] text-white/20 uppercase tracking-widest">No messages</p>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Chat Footer / Input - Disabled */}
                            <div className="p-5 border-t border-white/10 bg-black/60 shrink-0">
                                <div className="relative group cursor-not-allowed">
                                    <div className="w-full bg-white/5 border border-white/20 rounded-xl px-14 py-4 text-[13px] text-white/50 italic select-none">
                                        🔒 Neural Override: Direct human intervention not permitted
                                    </div>
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30"><MessageCircle size={18} /></div>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30"><Shield size={18} /></div>
                                </div>
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
                                01/04/2026 - 01/07/2026
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-white/60">
                                <Clock size={12} className="opacity-50" />
                                3 Nights
                            </div>
                            <div className="text-[10px] font-bold text-white">€288.12</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-bold flex items-center gap-2">
                                <Activity size={10} className="text-[var(--color-brand-accent)]" /> Segments
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
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Reference</label>
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
                                        <div className="bg-blue-600 px-3 py-2 rounded-lg text-[11px] font-bold flex justify-between items-center text-white">
                                            Checked-in
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Expiration</label>
                                        <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-[11px] flex justify-between items-center text-white/40">
                                            mm/dd/yyyy
                                            <Calendar size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Period</label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-[11px] font-bold">01/04/2026</div>
                                        <div className="w-12 bg-white/5 border border-white/10 px-2 py-2 rounded-lg text-center text-[11px] font-bold">3</div>
                                        <div className="flex-1 bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-[11px] font-bold">01/07/2026</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 text-[8px]">Arrival Time</label>
                                        <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-[11px] flex justify-between items-center text-white">
                                            14:00 <Clock size={12} className="opacity-40" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 text-[8px]">Departure</label>
                                        <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-lg text-[11px] flex justify-between items-center text-white">
                                            06:30 <Clock size={12} className="opacity-40" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30 text-[8px]">Reservation</label>
                                        <div className="bg-white/5 border border-white/10 px-2 py-2 rounded-lg text-[9px] text-white/60">
                                            12/03/2025
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
                                            Send Email <Mail size={12} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Trip Type</label>
                                    <div className="bg-white/10 border border-white/20 px-3 py-2.5 rounded-lg text-[12px] font-bold flex justify-between items-center group cursor-pointer text-white">
                                        Select Type...
                                        <ChevronDown size={16} className="opacity-40 group-hover:opacity-100" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Acquisition Method</label>
                                        <div className="bg-white/10 border border-white/20 px-3 py-2.5 rounded-lg text-[12px] font-bold flex justify-between items-center group cursor-pointer text-white">
                                            Channel Manager
                                            <ChevronDown size={14} className="opacity-40" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Lead Origin</label>
                                        <div className="bg-white/10 border border-white/20 px-3 py-2.5 rounded-lg text-[12px] font-bold flex justify-between items-center group cursor-pointer text-white">
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
                                        Guest may have stayed in the Armonyco cluster (U42). Verify payment history.
                                    </p>
                                </div>
                            </div>

                            {/* Column 3: Notes & Alerts */}
                            <div className="space-y-6">
                                <div className="space-y-2 flex flex-col h-full">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Channel Notes</label>
                                    <div className="p-4 bg-white/[0.03] border border-white/10 rounded-xl flex-1 min-h-[140px]">
                                        <div className="text-[10px] font-black text-[var(--color-brand-accent)] uppercase tracking-wider mb-2">** THIS RESERVATION HAS BEEN PRE-PAID **</div>
                                        <p className="text-[11px] text-white/60 leading-relaxed italic">
                                            Reservation has a cancellation grace period. Do not charge if cancelled before 12/04/2025 22:40:20.
                                            BOOKING NOTE: Payment charge is EUR 3.6019.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Internal Notes</label>
                                    <textarea
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[12px] italic text-white/80 min-h-[100px] outline-none focus:border-[var(--color-brand-accent)]/40 transition-all font-sans"
                                        defaultValue="Must pay €42 tax."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rooms/Units Bottom Table */}
                        <div className="mt-10 border-t border-white/5 pt-8 overflow-hidden">
                            <div className="flex gap-4 border-b border-white/5 pb-2 mb-6">
                                <span className="text-[11px] font-bold text-[var(--color-brand-accent)] border-b-2 border-[var(--color-brand-accent)] pb-2 px-4 cursor-pointer">Rooms</span>
                                <span className="text-[11px] font-medium text-white/20 pb-2 px-4 cursor-pointer hover:text-white/40 transition-colors">Services</span>
                                <span className="text-[11px] font-medium text-white/20 pb-2 px-4 cursor-pointer hover:text-white/40 transition-colors">Audit</span>
                            </div>

                            <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-6 text-white">
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-1 text-[10px] font-black uppercase text-white/20">Unit</div>
                                    <div className="col-span-4 text-[10px] font-black uppercase text-white/20">Rate</div>
                                    <div className="col-span-2 text-[10px] font-black uppercase text-white/20">Total Guests</div>
                                    <div className="col-span-2 text-[10px] font-black uppercase text-white/20">Configuration</div>
                                    <div className="col-span-2 text-[10px] font-black uppercase text-white/20">Price/night</div>
                                    <div className="col-span-1 text-[10px] font-black uppercase text-white/20">Total</div>

                                    {/* Row 1 */}
                                    <div className="col-span-1 py-4">
                                        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded">
                                            <FileText size={10} className="text-blue-500" />
                                            <span className="text-[9px] font-black text-blue-500">102J</span>
                                        </div>
                                    </div>
                                    <div className="col-span-4 py-4">
                                        <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-lg p-2.5 group cursor-pointer text-white">
                                            <div className="flex items-center gap-2">
                                                <div className="px-1.5 py-0.5 bg-blue-600 rounded text-[8px] font-black uppercase">Q.</div>
                                                <span className="text-[11px] font-bold truncate">NON-REFUNDABLE - OTA</span>
                                            </div>
                                            <ChevronDown size={14} className="opacity-20 group-hover:opacity-100" />
                                        </div>
                                    </div>
                                    <div className="col-span-2 py-4">
                                        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-2.5 flex justify-between items-center text-[11px] font-bold text-white">
                                            2 Guests <ChevronDown size={14} className="opacity-20" />
                                        </div>
                                    </div>
                                    <div className="col-span-2 py-4">
                                        <div className="bg-white/[0.03] border border-white/10 rounded-lg p-2.5 flex justify-between items-center text-[11px] font-bold text-white">
                                            Double <ChevronDown size={14} className="opacity-20" />
                                        </div>
                                    </div>
                                    <div className="col-span-2 py-4">
                                        <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all text-white">
                                            <span className="opacity-40">€</span> Price/night
                                        </button>
                                    </div>
                                    <div className="col-span-1 py-4 flex items-center justify-end gap-3 font-numbers text-[14px] font-black italic">
                                        246.12 <span className="text-emerald-500 font-black">€</span>
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
                            Close Protocol
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
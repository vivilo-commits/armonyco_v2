import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    MoreHorizontal,
    Phone,
    Video,
    CheckCircle,
    MessageCircle,
    Home,
    CreditCard,
    MapPin,
    Calendar,
    User,
    Loader,
    Send,
    AlertTriangle
} from '../../components/ui/Icons';
import { FloatingInput } from '../../components/ui/FloatingInput';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Tooltip } from '../../components/ui/Tooltip';
import { useConversations } from '../../src/hooks/useChat';

export const ConversationsView: React.FC = () => {
    const { data: conversations, status, error } = useConversations();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMessageSending, setIsMessageSending] = useState(false);

    // Select first conversation on load
    useEffect(() => {
        if (conversations && conversations.length > 0 && !selectedId) {
            setSelectedId(conversations[0].id);
        }
    }, [conversations, selectedId]);

    const selectedConversation = conversations?.find(c => c.id === selectedId);

    const filteredConversations = conversations?.filter(c =>
        c.guestName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (status === 'pending' || status === 'idle') {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-black/40 backdrop-blur-xl">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[var(--color-brand-accent)] animate-spin shadow-[0_0_20px_rgba(212,175,55,0.2)]"></div>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black">Decrypting Streams...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center p-8 bg-black/20">
                <Card className="p-10 text-center max-w-md border-red-500/20 bg-red-500/5">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6 text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-3">Feed Interruption</h3>
                    <p className="text-sm text-white/40 leading-relaxed italic">{error}</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-black/20 border-t border-white/5 animate-fade-in">

            {/* LEFT PANE: LIST */}
            <div className="w-80 border-r border-white/5 flex flex-col bg-black/40 backdrop-blur-3xl shrink-0">
                <div className="p-6 border-b border-white/5 space-y-6 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] opacity-80">Intelligence Feed</h2>
                        <span className="text-[9px] font-black text-[var(--color-brand-accent)] bg-[var(--color-brand-accent)]/10 px-2 py-0.5 rounded-full border border-[var(--color-brand-accent)]/20 uppercase tracking-widest">{conversations?.length} Active</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        <div className="flex-1">
                            <FloatingInput
                                label="Search guest identity..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                startIcon={<Search size={16} className="text-white/40" />}
                            />
                        </div>
                        <Tooltip text="Filter Grid">
                            <button className="p-3 bg-white/[0.03] hover:bg-white/[0.08] text-white/60 hover:text-white transition-all h-[50px] w-[50px] flex items-center justify-center rounded-2xl border border-white/10 hover:border-white/20 active:scale-95 shadow-lg">
                                <Filter size={18} />
                            </button>
                        </Tooltip>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                    {filteredConversations?.map(conv => {
                        const isSelected = selectedId === conv.id;
                        return (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedId(conv.id)}
                                className={`
                                    mx-3 my-1 p-4 rounded-2xl cursor-pointer transition-all duration-300 relative group
                                    ${isSelected
                                        ? 'bg-white/[0.08] border border-white/10 shadow-xl scale-[1.02]'
                                        : 'hover:bg-white/[0.03] border border-transparent hover:border-white/5'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black shadow-lg border border-white/5 relative group-hover:scale-110 transition-transform duration-500 overflow-hidden ${conv.guestAvatar ? '' : (conv.guestAvatarColor || 'bg-white/10 text-white/60')}`}>
                                            {conv.guestAvatar ? (
                                                <img src={conv.guestAvatar} alt={conv.guestName} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                conv.guestInitials
                                            )}
                                            {conv.hasWhatsapp && (
                                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center">
                                                    <MessageCircle size={10} className="text-emerald-500" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className={`text-sm font-bold truncate transition-colors ${isSelected ? 'text-[var(--color-brand-accent)]' : 'text-white/80 group-hover:text-white'}`}>{conv.guestName}</h3>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-[10px] text-white/40 truncate font-mono tracking-tighter italic">{conv.propertyName}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-numbers font-black text-white/20 group-hover:text-white/40 transition-colors uppercase tracking-[0.1em]">{conv.lastMessageTime}</span>
                                </div>

                                <div className="flex items-center gap-2 mt-2 ml-13">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border transition-all ${isSelected
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                        : 'bg-white/5 text-white/40 border-white/5'
                                        }`}>
                                        {conv.status}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {filteredConversations?.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center">
                            <Search size={32} className="text-white/10 mb-4" />
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black leading-relaxed">No matching identities found within the encrypted feed.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANE: CHAT DETAIL */}
            <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-2xl">
                {selectedConversation ? (
                    <>
                        {/* Conversation Header */}
                        <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.02] backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-black shadow-2xl border border-white/10 ${selectedConversation.guestAvatar ? '' : (selectedConversation.guestAvatarColor || 'bg-white/10 text-white/60')}`}>
                                    {selectedConversation.guestAvatar ? (
                                        <img src={selectedConversation.guestAvatar} alt={selectedConversation.guestName} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        selectedConversation.guestInitials
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-lg font-light text-white flex items-center gap-3 tracking-tight">
                                        {selectedConversation.guestName}
                                        {selectedConversation.hasWhatsapp && (
                                            <Tooltip text="WhatsApp Integrated">
                                                <MessageCircle size={16} className="text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] animate-pulse" />
                                            </Tooltip>
                                        )}
                                    </h2>
                                    <p className="text-[10px] text-white/40 flex items-center gap-3 uppercase tracking-widest font-black mt-1">
                                        <span className="flex items-center gap-1.5 opacity-60"><Home size={12} /> {selectedConversation.propertyName}</span>
                                        <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                        <span className="flex items-center gap-1.5 opacity-60"><Calendar size={12} /> {selectedConversation.dates}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Tooltip text="Encrypted Voice Call">
                                    <button className="p-3 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-2xl border border-transparent hover:border-white/10 transition-all active:scale-90">
                                        <Phone size={18} />
                                    </button>
                                </Tooltip>
                                <Tooltip text="Secure Video Stream">
                                    <button className="p-3 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-2xl border border-transparent hover:border-white/10 transition-all active:scale-90">
                                        <Video size={18} />
                                    </button>
                                </Tooltip>
                                <div className="w-px h-8 bg-white/5 mx-2"></div>
                                <Tooltip text="Extended Actions">
                                    <button className="p-3 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-2xl border border-transparent hover:border-white/10 transition-all active:scale-90">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-8 overflow-y-auto bg-black/30 scrollbar-hide space-y-6">
                            <div className="flex justify-center mb-10">
                                <span className="text-[9px] font-black text-white/30 bg-white/[0.03] border border-white/5 px-4 py-1.5 rounded-full uppercase tracking-[0.3em] shadow-sm backdrop-blur-sm">
                                    Secure context established {selectedConversation.checkInDate}
                                </span>
                            </div>

                            {selectedConversation.messages?.map((msg, i) => (
                                <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'} animate-slide-up`} style={{ animationDelay: `${i * 50}ms` }}>
                                    <div className={`
                                        max-w-[70%] p-5 rounded-3xl shadow-2xl relative group transition-all duration-300
                                        ${msg.senderId === 'me'
                                            ? 'bg-zinc-900 border border-white/10 text-white rounded-br-none'
                                            : 'bg-white/5 backdrop-blur-md border border-white/5 text-white/90 rounded-bl-none hover:bg-white/10'
                                        }
                                    `}>
                                        <p className="text-sm leading-relaxed tracking-tight">{msg.text}</p>
                                        <div className={`text-[9px] mt-3 font-mono opacity-40 flex items-center justify-end gap-2 uppercase tracking-widest`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            {msg.senderId === 'me' && (
                                                <span className={msg.isRead ? 'text-emerald-500' : 'text-white/20'}>
                                                    {msg.isRead ? '✓✓' : '✓'}
                                                </span>
                                            )}
                                        </div>
                                        {/* Premium bubble tail or accent */}
                                        {msg.senderId === 'me' && (
                                            <div className="absolute -bottom-0 -right-[2px] w-2 h-2 bg-zinc-900 border-r border-b border-white/10 rounded-full blur-[1px]"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-black/40 backdrop-blur-3xl border-t border-white/5">
                            <div className="relative group">
                                <textarea
                                    rows={1}
                                    placeholder="Execute governed response..."
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 pr-16 focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-accent)]/50 text-white placeholder-white/20 transition-all resize-none shadow-inner"
                                />
                                <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-[var(--color-brand-accent)] text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]"
                                    onClick={() => {
                                        setIsMessageSending(true);
                                        setTimeout(() => setIsMessageSending(false), 800);
                                    }}
                                >
                                    {isMessageSending ? <Loader size={18} className="animate-spin text-black" /> : <Send size={18} className="text-black" />}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/20 pb-20 overflow-hidden relative">
                        {/* Centered Empty State */}
                        <div className="absolute inset-0 bg-gradient-radial from-[var(--color-brand-accent)]/5 to-transparent opacity-30 pointer-events-none" />
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center mb-8 shadow-2xl animate-pulse">
                                <MessageCircle size={48} className="text-[var(--color-brand-accent)] opacity-40" />
                            </div>
                            <h3 className="text-xl font-light text-white/80 mb-2 uppercase tracking-[0.2em]">Secure Feed Standby</h3>
                            <p className="text-[10px] uppercase font-bold tracking-[0.3em] opacity-40 max-w-sm text-center leading-loose">
                                Select a verified guest identity from the decrypt feed to initiate governance routines.
                            </p>
                            <div className="mt-8 flex gap-4">
                                <div className="h-px w-8 bg-white/10"></div>
                                <div className="h-px w-8 bg-[var(--color-brand-accent)]/20"></div>
                                <div className="h-px w-8 bg-white/10"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT PANE: INFO (Booking Details) */}
            {selectedConversation && (
                <div className="w-80 border-l border-white/5 bg-black/40 backdrop-blur-3xl hidden xl:flex flex-col overflow-y-auto scrollbar-hide">
                    <div className="p-8 border-b border-white/5 bg-white/[0.02]">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                <Home size={22} className="text-[var(--color-brand-accent)]" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-black text-white truncate uppercase tracking-tight">{selectedConversation.propertyName}</h3>
                                <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] font-black mt-1">Luxury Collection Registry</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-xs text-white/60">
                                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center"><MapPin size={12} className="text-[var(--color-brand-accent)]" /></div>
                                <span className="truncate italic">Via del Corso 28, Roma, IT</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-white/60">
                                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center"><User size={12} className="text-[var(--color-brand-accent)]" /></div>
                                <span className="font-bold">2 Accounted Subjects</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        <div>
                            <h4 className="text-[9px] font-black text-white/20 uppercase tracking-[0.3em] mb-6">Reservation Topology</h4>

                            <div className="space-y-4">
                                <Card padding="md" className="bg-black/40 border-white/10 relative group overflow-hidden">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[9px] text-white/30 uppercase tracking-widest font-black">Ingress</span>
                                        <span className="text-[9px] text-white/30 uppercase tracking-widest font-black">Egress</span>
                                    </div>
                                    <div className="flex justify-between items-center font-mono text-xs text-white">
                                        <span className="font-black group-hover:text-[var(--color-brand-accent)] transition-colors">{selectedConversation.checkInDate}</span>
                                        <span className="text-white/20 px-2">→</span>
                                        <span className="font-black group-hover:text-[var(--color-brand-accent)] transition-colors">{selectedConversation.checkOutDate}</span>
                                    </div>
                                    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-[var(--color-brand-accent)]/20 to-transparent"></div>
                                </Card>

                                <div className="flex items-center justify-between py-4 border-b border-white/5 text-xs">
                                    <span className="text-white/30 font-bold uppercase tracking-widest">Confirmation</span>
                                    <span className="font-mono text-white/80 font-black tracking-tighter">#HM-9382</span>
                                </div>
                                <div className="flex items-center justify-between py-4 border-b border-white/5 text-xs">
                                    <span className="text-white/30 font-bold uppercase tracking-widest">Total Payout</span>
                                    <span className="font-bold text-[var(--color-brand-accent)] text-sm tracking-tight font-numbers">1,240 AC</span>
                                </div>
                                <div className="flex items-center justify-between py-4 text-xs">
                                    <span className="text-white/30 font-bold uppercase tracking-widest">Status</span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[9px] font-black tracking-widest uppercase">Verified Paid</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full ui-btn-primary flex items-center justify-center gap-3 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(212,175,55,0.2)]">
                            <CreditCard size={16} />
                            Ingest Transaction
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
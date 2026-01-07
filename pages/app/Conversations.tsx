import React, { useState, useEffect } from 'react';
import {
    Search,
    MoreHorizontal,
    Phone,
    MessageCircle,
    Loader,
    Send,
    AlertTriangle
} from '../../components/ui/Icons';
import { FloatingInput } from '../../components/ui/FloatingInput';
import { Card } from '../../components/ui/Card';
import { Tooltip } from '../../components/ui/Tooltip';
import { useConversations } from '../../src/hooks/useChat';

export const ConversationsView: React.FC = () => {
    const { data: conversations, status, error } = useConversations();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMessageSending, setIsMessageSending] = useState(false);
    const [messageText, setMessageText] = useState('');

    // Select first conversation on load
    useEffect(() => {
        if (conversations && conversations.length > 0 && !selectedId) {
            setSelectedId(conversations[0].id);
        }
    }, [conversations, selectedId]);

    const selectedConversation = conversations?.find(c => c.id === selectedId);

    const filteredConversations = conversations?.filter(c =>
        c.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.guestPhone.includes(searchTerm)
    );

    // Get initials from name
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    // Format time
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        }
        return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    };

    if (status === 'pending' || status === 'idle') {
        return (
            <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-black/40 backdrop-blur-xl">
                <div className="flex flex-col items-center gap-6">
                    <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[var(--color-brand-accent)] animate-spin shadow-[0_0_20px_rgba(212,175,55,0.2)]"></div>
                    <p className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-black">Loading Conversations...</p>
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
                    <h3 className="text-xl font-medium text-white mb-3">Connection Error</h3>
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
                        <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] opacity-80">Conversations</h2>
                        <span className="text-[9px] font-black text-[var(--color-brand-accent)] bg-[var(--color-brand-accent)]/10 px-2 py-0.5 rounded-full border border-[var(--color-brand-accent)]/20 uppercase tracking-widest">{conversations?.length || 0}</span>
                    </div>
                    <FloatingInput
                        label="Search by name or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        startIcon={<Search size={16} className="text-white/40" />}
                    />
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                    {filteredConversations?.map(conv => {
                        const isSelected = selectedId === conv.id;
                        const lastMsg = conv.messages[conv.messages.length - 1];
                        return (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedId(conv.id)}
                                className={`
                                    mx-3 my-1 p-4 rounded-2xl cursor-pointer transition-all duration-300 relative group
                                    ${isSelected
                                        ? 'bg-white/[0.08] border border-white/10 shadow-xl'
                                        : 'hover:bg-white/[0.03] border border-transparent hover:border-white/5'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-black text-emerald-400 border border-emerald-500/20 relative">
                                        {getInitials(conv.guestName)}
                                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-black border border-white/10 flex items-center justify-center">
                                            <MessageCircle size={10} className="text-emerald-500" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <h3 className={`text-sm font-bold truncate transition-colors ${isSelected ? 'text-[var(--color-brand-accent)]' : 'text-white/80'}`}>
                                                {conv.guestName}
                                            </h3>
                                            <span className="text-[9px] text-white/30 font-mono">{formatTime(conv.lastMessageTime)}</span>
                                        </div>
                                        <p className="text-[11px] text-white/40 truncate mt-0.5">
                                            {conv.guestPhone}
                                        </p>
                                        {lastMsg && (
                                            <p className="text-[10px] text-white/30 truncate mt-1">
                                                {lastMsg.senderId === 'me' ? '✓ ' : ''}{lastMsg.text.substring(0, 40)}...
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {filteredConversations?.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center">
                            <MessageCircle size={32} className="text-white/10 mb-4" />
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-black">No conversations found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT PANE: CHAT */}
            <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-2xl">
                {selectedConversation ? (
                    <>
                        {/* Header */}
                        <div className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-sm font-black text-emerald-400 border border-emerald-500/20">
                                    {getInitials(selectedConversation.guestName)}
                                </div>
                                <div>
                                    <h2 className="text-lg font-light text-white flex items-center gap-3">
                                        {selectedConversation.guestName}
                                        <MessageCircle size={16} className="text-emerald-500" />
                                    </h2>
                                    <p className="text-[11px] text-white/40 font-mono">
                                        {selectedConversation.guestPhone}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Tooltip text="Call">
                                    <button className="p-3 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all">
                                        <Phone size={18} />
                                    </button>
                                </Tooltip>
                                <Tooltip text="More">
                                    <button className="p-3 text-white/40 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </Tooltip>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-8 overflow-y-auto bg-black/30 scrollbar-hide space-y-4">
                            {selectedConversation.messages?.map((msg, i) => (
                                <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`
                                        max-w-[70%] p-4 rounded-2xl shadow-lg
                                        ${msg.senderId === 'me'
                                            ? 'bg-emerald-600/20 border border-emerald-500/20 text-white rounded-br-sm'
                                            : 'bg-white/5 border border-white/5 text-white/90 rounded-bl-sm'
                                        }
                                    `}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <div className="text-[9px] mt-2 text-white/30 flex items-center justify-end gap-2">
                                            {formatTime(msg.timestamp)}
                                            {msg.senderId === 'me' && (
                                                <span className={msg.isRead ? 'text-emerald-500' : ''}>
                                                    {msg.isRead ? '✓✓' : '✓'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-6 bg-black/40 border-t border-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={messageText}
                                    onChange={(e) => setMessageText(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 pr-16 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 text-white placeholder-white/30"
                                />
                                <button
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-emerald-500 text-black rounded-xl hover:bg-emerald-400 transition-all"
                                    onClick={() => {
                                        if (!messageText.trim()) return;
                                        setIsMessageSending(true);
                                        setTimeout(() => {
                                            setIsMessageSending(false);
                                            setMessageText('');
                                        }, 500);
                                    }}
                                >
                                    {isMessageSending ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/20">
                        <MessageCircle size={48} className="text-white/10 mb-4" />
                        <h3 className="text-lg font-light text-white/60">Select a conversation</h3>
                    </div>
                )}
            </div>
        </div>
    );
};
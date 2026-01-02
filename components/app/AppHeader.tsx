import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, X, CheckCircle, AlertTriangle, XCircle, IconSizes } from '../ui/Icons';
import { Notification } from '../../types';
import { FloatingInput } from '../ui/FloatingInput';

interface AppHeaderProps {
    title: string;
    onNavigate: (view: string) => void;
    notifications: Notification[];
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title, onNavigate, notifications, markAsRead, markAllAsRead }) => {
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="sticky top-0 z-30 w-full h-20 px-8 flex items-center justify-between bg-[var(--color-surface)]/90 backdrop-blur-sm border-b border-[var(--color-border)] transition-all">

            {/* Content */}
            <div className="relative z-10 flex w-full items-center justify-between">

                {/* Global Search */}
                <div className="flex-1 max-w-2xl pr-8 hidden md:block">
                    <FloatingInput
                        label="Search governance, decisions, KPIs..."
                        startIcon={<Search size={IconSizes.md} />}
                        bgClass="bg-[var(--color-surface)]/90"
                        className="bg-[var(--color-surface)] border-[var(--color-border)]"
                    />
                </div>

                {/* Right: Notifications & Support Links */}
                <div className="flex items-center gap-8 text-sm font-medium shrink-0">

                    {/* Notifications */}
                    <div className="relative" ref={notifRef}>
                        <button
                            onClick={() => setIsNotifOpen(!isNotifOpen)}
                            className="relative text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors pt-1"
                        >
                            <Bell size={IconSizes.lg} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-danger)] text-[9px] font-bold text-white ring-2 ring-[var(--color-surface)] shadow-sm">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {isNotifOpen && (
                            <div className="absolute right-0 mt-4 w-96 bg-[var(--color-surface)]/90 backdrop-blur-xl border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden origin-top-right z-50 animate-in fade-in slide-in-from-top-2 ring-1 ring-white/5">
                                <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-hover)]">
                                    <h3 className="font-medium text-[var(--color-text-main)]">Notifications</h3>
                                    <div className="flex gap-3">
                                        {unreadCount > 0 && (
                                            <button onClick={markAllAsRead} className="text-xs text-[var(--color-brand-accent)] hover:text-[var(--color-text-main)] font-bold uppercase tracking-wider">
                                                Mark all read
                                            </button>
                                        )}
                                        <button onClick={() => setIsNotifOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]">
                                            <X size={IconSizes.sm} />
                                        </button>
                                    </div>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto p-2">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-[var(--color-text-muted)] text-xs">No notifications.</div>
                                    ) : (
                                        <div className="space-y-1">
                                            {notifications.map((notif) => (
                                                <div key={notif.id} className={`p-4 rounded-xl transition-all ${notif.read ? 'opacity-60 hover:bg-[var(--color-surface-hover)]' : 'bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm'}`}>
                                                    <div className="flex gap-3 items-start">
                                                        <div className={`mt-0.5 shrink-0 p-1.5 rounded-full ${notif.type === 'ALERT' ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]' :
                                                            notif.type === 'WARNING' ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]' : 'bg-[var(--color-info)]/10 text-[var(--color-info)]'
                                                            }`}>
                                                            {notif.type === 'ALERT' ? <XCircle size={IconSizes.sm} /> :
                                                                notif.type === 'WARNING' ? <AlertTriangle size={IconSizes.sm} /> : <CheckCircle size={IconSizes.sm} />}
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-xs text-[var(--color-text-main)] font-bold leading-snug">{notif.message}</p>
                                                            <p className="text-[10px] text-[var(--color-text-muted)] mt-1">{notif.timestamp}</p>
                                                        </div>
                                                        {!notif.read && (
                                                            <button onClick={() => markAsRead(notif.id)} className="shrink-0 w-2 h-2 rounded-full bg-[var(--color-brand-accent)] ring-4 ring-[var(--color-brand-accent)]/20" title="Mark as read"></button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-6 border-l border-[var(--color-border)] pl-6 h-8">
                        <button
                            onClick={() => onNavigate('documentation')}
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors hover:scale-105 transform"
                        >
                            Documentation
                        </button>
                        <button
                            onClick={() => onNavigate('support')}
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors hover:scale-105 transform"
                        >
                            Support
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
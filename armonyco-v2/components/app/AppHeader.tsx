import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, X, CheckCircle, AlertTriangle, XCircle } from '../ui/Icons';
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
    <header className="sticky top-0 z-30 w-full h-20 px-8 flex items-center justify-between bg-white/90 backdrop-blur-sm border-b border-stone-200 transition-all">
      
      {/* Content */}
      <div className="relative z-10 flex w-full items-center justify-between">
          
          {/* Global Search */}
          <div className="flex-1 max-w-2xl pr-8 hidden md:block">
            <FloatingInput 
                label="Search governance, decisions, KPIs..." 
                startIcon={<Search size={16} />}
                bgClass="bg-white/90"
                className="bg-white border-stone-200"
            />
          </div>

          {/* Right: Notifications & Support Links */}
          <div className="flex items-center gap-8 text-sm font-medium shrink-0">
            
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
                <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative text-stone-500 hover:text-stone-900 transition-colors pt-1"
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white shadow-sm">
                            {unreadCount}
                        </span>
                    )}
                </button>

                {/* Notification Dropdown */}
                {isNotifOpen && (
                    <div className="absolute right-0 mt-4 w-96 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden origin-top-right z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                            <h3 className="font-medium text-stone-900">Notifications</h3>
                            <div className="flex gap-3">
                                {unreadCount > 0 && (
                                    <button onClick={markAllAsRead} className="text-xs text-armonyco-gold hover:text-stone-900 font-bold uppercase tracking-wider">
                                        Mark all read
                                    </button>
                                )}
                                <button onClick={() => setIsNotifOpen(false)} className="text-stone-400 hover:text-stone-900">
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto p-2">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-stone-400 text-xs">No notifications.</div>
                            ) : (
                                <div className="space-y-1">
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className={`p-4 rounded-xl transition-all ${notif.read ? 'opacity-60 hover:bg-stone-50' : 'bg-white border border-stone-100 shadow-sm'}`}>
                                            <div className="flex gap-3 items-start">
                                                <div className={`mt-0.5 shrink-0 p-1.5 rounded-full ${
                                                    notif.type === 'ALERT' ? 'bg-red-100 text-red-500' :
                                                    notif.type === 'WARNING' ? 'bg-amber-100 text-amber-500' : 'bg-blue-100 text-blue-500'
                                                }`}>
                                                    {notif.type === 'ALERT' ? <XCircle size={14} /> :
                                                    notif.type === 'WARNING' ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-xs text-stone-900 font-bold leading-snug">{notif.message}</p>
                                                    <p className="text-[10px] text-stone-500 mt-1">{notif.timestamp}</p>
                                                </div>
                                                {!notif.read && (
                                                    <button onClick={() => markAsRead(notif.id)} className="shrink-0 w-2 h-2 rounded-full bg-armonyco-gold ring-4 ring-armonyco-gold/20" title="Mark as read"></button>
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

            <div className="flex items-center gap-6 border-l border-stone-200 pl-6 h-8">
                <button 
                onClick={() => onNavigate('documentation')}
                className="text-stone-500 hover:text-stone-900 transition-colors hover:scale-105 transform"
                >
                Documentation
                </button>
                <button 
                onClick={() => onNavigate('support')}
                className="text-stone-500 hover:text-stone-900 transition-colors hover:scale-105 transform"
                >
                Support
                </button>
            </div>
          </div>
      </div>
    </header>
  );
};
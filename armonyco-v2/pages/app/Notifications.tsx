import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Settings, XCircle } from '../../components/ui/Icons';
import { Notification } from '../../types';

interface NotificationsProps {
    notifications: Notification[];
    markAsRead: (id: string) => void;
}

export const NotificationsView: React.FC<NotificationsProps> = ({ notifications, markAsRead }) => {
    const [activeTab, setActiveTab] = useState<'ALERTS' | 'SETTINGS'>('ALERTS');
    
    // Mock Settings State
    const [settings, setSettings] = useState({
        complianceDrop: true,
        riskSpike: true,
        residualThreshold: true,
        emailDigest: false
    });

    return (
        <div className="p-8">
            <header className="mb-8 border-b border-stone-200 pb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl text-stone-900 font-light">Notification Center</h1>
                    <p className="text-stone-500 text-sm">System Alerts & Threshold Warnings</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setActiveTab('ALERTS')}
                        className={`px-4 py-2 text-sm rounded transition-colors ${activeTab === 'ALERTS' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'}`}
                    >
                        Alerts
                    </button>
                    <button 
                        onClick={() => setActiveTab('SETTINGS')}
                        className={`px-4 py-2 text-sm rounded transition-colors ${activeTab === 'SETTINGS' ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'}`}
                    >
                        Preferences
                    </button>
                </div>
            </header>

            {activeTab === 'ALERTS' ? (
                <div className="space-y-4 max-w-4xl">
                    {notifications.length === 0 && (
                        <div className="text-center py-12 text-stone-400">
                            <Bell size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No active alerts.</p>
                        </div>
                    )}
                    
                    {notifications.map(notif => (
                        <div 
                            key={notif.id} 
                            className={`p-4 rounded border flex gap-4 items-start transition-all ${
                                notif.read 
                                ? 'bg-stone-50 border-stone-100 opacity-60' 
                                : 'bg-white border-stone-200 shadow-sm'
                            }`}
                        >
                            <div className={`mt-1 ${
                                notif.type === 'ALERT' ? 'text-red-500' :
                                notif.type === 'WARNING' ? 'text-amber-500' : 'text-blue-500'
                            }`}>
                                {notif.type === 'ALERT' ? <XCircle size={20} /> :
                                 notif.type === 'WARNING' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-sm font-bold mb-1 ${notif.read ? 'text-stone-500' : 'text-stone-900'}`}>
                                    {notif.message}
                                </h4>
                                <div className="flex gap-4 text-xs text-stone-500">
                                    <span>{notif.timestamp}</span>
                                    {notif.metric && <span className="text-stone-600 font-mono bg-stone-100 px-1 rounded">Metric: {notif.metric}</span>}
                                </div>
                            </div>
                            {!notif.read && (
                                <button 
                                    onClick={() => markAsRead(notif.id)}
                                    className="text-xs text-stone-400 hover:text-stone-900 underline"
                                >
                                    Mark Read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="max-w-2xl bg-white border border-stone-200 rounded-xl p-8 shadow-sm">
                    <h2 className="text-xl text-stone-900 mb-6 flex items-center gap-2">
                        <Settings size={20} className="text-stone-400" />
                        Configuration Rules
                    </h2>
                    
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 border border-stone-200 rounded bg-stone-50">
                            <div>
                                <h3 className="text-stone-900 text-sm font-medium">Compliance Rate Drops</h3>
                                <p className="text-stone-500 text-xs">Notify when Autonomous Compliance Rate drops below 95%</p>
                            </div>
                            <button 
                                onClick={() => setSettings(s => ({...s, complianceDrop: !s.complianceDrop}))}
                                className={`w-10 h-5 rounded-full transition-colors relative ${settings.complianceDrop ? 'bg-armonyco-gold' : 'bg-stone-300'}`}
                            >
                                <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all shadow-sm ${settings.complianceDrop ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>

                         <div className="flex items-center justify-between p-4 border border-stone-200 rounded bg-stone-50">
                            <div>
                                <h3 className="text-stone-900 text-sm font-medium">Human Risk Spikes</h3>
                                <p className="text-stone-500 text-xs">Notify when Human Risk Exposure exceeds 5% volatility</p>
                            </div>
                            <button 
                                onClick={() => setSettings(s => ({...s, riskSpike: !s.riskSpike}))}
                                className={`w-10 h-5 rounded-full transition-colors relative ${settings.riskSpike ? 'bg-armonyco-gold' : 'bg-stone-300'}`}
                            >
                                <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all shadow-sm ${settings.riskSpike ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-stone-200 rounded bg-stone-50">
                            <div>
                                <h3 className="text-stone-900 text-sm font-medium">Residual Risk Threshold</h3>
                                <p className="text-stone-500 text-xs">Notify when ungoverned events exceed 3% of volume</p>
                            </div>
                            <button 
                                onClick={() => setSettings(s => ({...s, residualThreshold: !s.residualThreshold}))}
                                className={`w-10 h-5 rounded-full transition-colors relative ${settings.residualThreshold ? 'bg-armonyco-gold' : 'bg-stone-300'}`}
                            >
                                <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all shadow-sm ${settings.residualThreshold ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
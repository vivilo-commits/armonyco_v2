import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Settings, XCircle, Activity, Shield } from '../../components/ui/Icons';
import { Notification } from '../../src/types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/app/StatCard';
import { ActionToggle } from '../../components/ui/ActionToggle';

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
        <div className="p-8 animate-fade-in">
            {/* Header */}
            <header className="mb-8 border-b border-[var(--color-border)] pb-6 flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Bell className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-[var(--color-text-main)] font-light">Notification Center</h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm">System Alerts & Threshold Warnings</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={activeTab === 'ALERTS' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('ALERTS')}
                        className="text-sm"
                    >
                        Alerts
                    </Button>
                    <Button
                        variant={activeTab === 'SETTINGS' ? 'primary' : 'secondary'}
                        onClick={() => setActiveTab('SETTINGS')}
                        className="text-sm"
                    >
                        Preferences
                    </Button>
                </div>
            </header>

            {/* KPI Strip (Alert Intelligence) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <StatCard
                    label="Active Alerts"
                    value={notifications.filter(n => !n.read).length.toString()}
                    icon={Bell}
                    trend={{ value: "2", isPositive: false, label: "new" }}
                />
                <StatCard
                    label="Critical"
                    value={notifications.filter(n => n.type === 'ALERT').length.toString()}
                    icon={XCircle}
                    iconColor="text-[var(--color-danger)]"
                />
                <StatCard
                    label="Warnings"
                    value={notifications.filter(n => n.type === 'WARNING').length.toString()}
                    icon={AlertTriangle}
                    iconColor="text-[var(--color-warning)]"
                />
                <StatCard
                    label="System Health"
                    value="98%"
                    icon={Activity}
                    iconColor="text-[var(--color-success)]"
                />
            </div>

            {activeTab === 'ALERTS' ? (
                <div className="space-y-4 max-w-5xl mx-auto md:mx-0">
                    {notifications.length === 0 && (
                        <div className="text-center py-12 text-[var(--color-text-muted)]">
                            <Bell size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No active alerts.</p>
                        </div>
                    )}

                    {notifications.map(notif => (
                        <Card
                            key={notif.id}
                            padding="md"
                            className={`flex gap-4 items-start transition-all ${notif.read
                                ? 'bg-[var(--color-surface-hover)] border-[var(--color-border)] opacity-60'
                                : 'bg-[var(--color-surface)] border-[var(--color-brand-accent)]/30 shadow-sm'
                                }`}
                        >
                            <div className={`mt-1 ${notif.type === 'ALERT' ? 'text-[var(--color-danger)]' :
                                notif.type === 'WARNING' ? 'text-[var(--color-warning)]' : 'text-blue-500'
                                }`}>
                                {notif.type === 'ALERT' ? <XCircle size={20} /> :
                                    notif.type === 'WARNING' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-sm font-bold mb-1 ${notif.read ? 'text-[var(--color-text-muted)]' : 'text-[var(--color-text-main)]'}`}>
                                    {notif.message}
                                </h4>
                                <div className="flex gap-4 text-xs text-[var(--color-text-muted)]">
                                    <span>{notif.timestamp}</span>
                                    {notif.metric && <span className="text-[var(--color-text-secondary)] font-mono bg-[var(--color-surface-hover)] px-1 rounded border border-[var(--color-border)]">Metric: {notif.metric}</span>}
                                </div>
                            </div>
                            {!notif.read && (
                                <button
                                    onClick={() => markAsRead(notif.id)}
                                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] underline"
                                >
                                    Mark Read
                                </button>
                            )}
                        </Card>
                    ))}
                </div>
            ) : (
                <Card padding="lg" className="max-w-2xl">
                    <h2 className="text-xl text-[var(--color-text-main)] mb-6 flex items-center gap-2">
                        <Settings size={20} className="text-[var(--color-text-muted)]" />
                        Configuration Rules
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded bg-[var(--color-surface-hover)]">
                            <div>
                                <h3 className="text-[var(--color-text-main)] text-sm font-medium">Compliance Rate Drops</h3>
                                <p className="text-[var(--color-text-muted)] text-xs">Notify when Autonomous Compliance Rate drops below 95%</p>
                            </div>
                            <ActionToggle
                                checked={settings.complianceDrop}
                                onChange={() => setSettings(s => ({ ...s, complianceDrop: !s.complianceDrop }))}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded bg-[var(--color-surface-hover)]">
                            <div>
                                <h3 className="text-[var(--color-text-main)] text-sm font-medium">Human Risk Spikes</h3>
                                <p className="text-[var(--color-text-muted)] text-xs">Notify when Human Risk Exposure exceeds 5% volatility</p>
                            </div>
                            <ActionToggle
                                checked={settings.riskSpike}
                                onChange={() => setSettings(s => ({ ...s, riskSpike: !s.riskSpike }))}
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded bg-[var(--color-surface-hover)]">
                            <div>
                                <h3 className="text-[var(--color-text-main)] text-sm font-medium">Residual Risk Threshold</h3>
                                <p className="text-[var(--color-text-muted)] text-xs">Notify when ungoverned events exceed 3% of volume</p>
                            </div>
                            <ActionToggle
                                checked={settings.residualThreshold}
                                onChange={() => setSettings(s => ({ ...s, residualThreshold: !s.residualThreshold }))}
                            />
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};
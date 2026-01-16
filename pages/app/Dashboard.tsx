import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    TrendingUp,
    Shield,
    Activity,
    Zap,
    Users,
    Package,
    AlertTriangle,
    IconSizes,
    CreditCard
} from '../../components/ui/Icons';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts';
import { StatCard } from '../../components/app/StatCard';
import { RecentActivity } from '../../components/app/RecentActivity';
import { Card } from '../../components/ui/Card';
import { authService } from '../../src/services/auth.service';
import { productService } from '../../src/services/product.service';
import { useN8nExecutions } from '../../src/hooks/useLogs';
import { usePermissions } from '../../src/hooks/usePermissions';
import { UserProfile, ProductModule, DecisionRecord } from '../../src/types';

interface DashboardProps {
    onNavigate?: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const { t } = useTranslation();
    const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
    const [modules, setModules] = React.useState<ProductModule[]>([]);
    
    // Check permissions
    const { currentOrgId, currentOrgRole, isReadOnly, loading: permissionsLoading } = usePermissions();
    
    console.log('[Dashboard] permissionsLoading:', permissionsLoading, 'currentOrgId:', currentOrgId, 'role:', currentOrgRole);

    // Real data from n8n_executions
    const { data: executions, status } = useN8nExecutions();
    const loading = status === 'pending' || permissionsLoading;
    
    console.log('[Dashboard] executions status:', status, 'combined loading:', loading);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [profile, allModules] = await Promise.all([
                    authService.getUserProfile(),
                    productService.getModules(),
                ]);
                setUserProfile(profile);
                setModules(allModules);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            }
        };
        fetchData();
    }, []);

    // Calculate real metrics from executions
    const totalExecutions = executions?.length || 0;
    const successCount = executions?.filter(e => e.status === 'success').length || 0;
    const failedCount = executions?.filter(e => e.status !== 'success').length || 0;
    const complianceRate = totalExecutions > 0 ? ((successCount / totalExecutions) * 100).toFixed(1) : '0';
    const humanRisk = totalExecutions > 0 ? ((failedCount / totalExecutions) * 100).toFixed(1) : '0';
    const residualRisk = totalExecutions > 0 ? (Math.max(0, parseFloat(humanRisk) - 1.4)).toFixed(1) : '0';

    // Calculate velocity chart data (hourly cumulative)
    const valueVelocity = React.useMemo(() => {
        if (!executions?.length) return [];

        const hourlyCount: Record<string, number> = {};
        executions.forEach(exec => {
            const hour = new Date(exec.started_at).getHours();
            const timeKey = `${hour.toString().padStart(2, '0')}:00`;
            hourlyCount[timeKey] = (hourlyCount[timeKey] || 0) + 1;
        });

        const result: { time: string; value: number }[] = [];
        let cumulative = 0;
        for (let h = 8; h <= 22; h += 2) {
            const timeKey = `${h.toString().padStart(2, '0')}:00`;
            cumulative += hourlyCount[timeKey] || 0;
            result.push({ time: timeKey, value: cumulative });
        }
        return result;
    }, [executions]);

    // Calculate performance by agent
    const performance = React.useMemo(() => {
        if (!executions?.length) return [];

        const agentMap: Record<string, { count: number; success: number }> = {};
        executions.forEach(exec => {
            const agent = exec.agent_name || 'OTHER';
            if (!agentMap[agent]) agentMap[agent] = { count: 0, success: 0 };
            agentMap[agent].count++;
            if (exec.status === 'success') agentMap[agent].success++;
        });

        const iconMap: Record<string, { icon: any; color: string; label: string }> = {
            'AMELIA': { icon: Users, color: 'text-white', label: t('dashboard.guestCommunication') },
            'JAMES': { icon: Shield, color: 'text-emerald-500', label: t('dashboard.reservationLookup') },
            'ELON': { icon: TrendingUp, color: 'text-[var(--color-brand-accent)]', label: t('dashboard.revenueOptimization') },
            'LARA': { icon: Activity, color: 'text-blue-500', label: t('dashboard.operations') },
        };

        return Object.entries(agentMap).map(([name, data]) => ({
            id: name.toLowerCase(),
            label: iconMap[name]?.label || name,
            icon: iconMap[name]?.icon || Users,
            color: iconMap[name]?.color || 'text-white',
            metric: name,
            value: data.count.toString(),
            trend: `${((data.success / data.count) * 100).toFixed(0)}% success`,
        }));
    }, [executions]);

    // Convert executions to activities for RecentActivity
    const activities: DecisionRecord[] = React.useMemo(() => {
        if (!executions?.length) return [];
        return executions.slice(0, 10).map(exec => ({
            id: exec.truth_identity || exec.n8n_execution_id,
            timestamp: exec.started_at,
            policy: exec.perimeter || 'INSTITUTIONAL',
            verdict: exec.status === 'success' ? 'ALLOW' : 'DENY',
            responsible: exec.agent_name || 'SYSTEM',
            credits: exec.duration_ms ? Math.round(exec.duration_ms / 1000) : 0,
        }));
    }, [executions]);

    // Show loading while checking permissions
    if (permissionsLoading) {
        console.log('[Dashboard] ⏳ Showing permissions loading spinner...');
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
                <p className="ml-4 text-zinc-400">{t('dashboard.loadingPermissions')}</p>
            </div>
        );
    }

    // Show message if user has no organization
    if (!currentOrgId) {
        console.log('[Dashboard] ⚠️ User has no organization');
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
                <div className="w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mb-6">
                    <AlertTriangle size={48} className="text-amber-500" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">{t('dashboard.noOrganization')}</h1>
                <p className="text-zinc-400 text-center max-w-md">
                    {t('dashboard.noOrganizationMessage')}
                </p>
            </div>
        );
    }
    
    console.log('[Dashboard] ✅ Rendering dashboard content');

    return (
        <div className="p-8 animate-fade-in text-white">
            {/* Read-Only Alert per Collaborator */}
            {isReadOnly && (
                <div className="mb-6 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                    <AlertTriangle size={24} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-amber-400 font-bold text-sm mb-1">{t('dashboard.readOnlyMode')}</p>
                        <p className="text-amber-300/80 text-sm">
                            {t('dashboard.readOnlyMessage')}
                        </p>
                    </div>
                </div>
            )}

            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <LayoutDashboard className="text-[var(--color-brand-accent)] w-6 h-6" />
                            <h1 className="text-2xl text-white font-light uppercase tracking-tight">{t('dashboard.title')} <span className="text-white/20 text-sm font-normal lowercase italic tracking-normal ml-2">/ {t('dashboard.subtitle')}</span></h1>
                            
                            {/* Role Badge */}
                            {currentOrgRole && (
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                    currentOrgRole === 'Admin' 
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                                        : currentOrgRole === 'User'
                                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                }`}>
                                    {currentOrgRole}
                                </span>
                            )}
                        </div>
                        <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">{t('dashboard.description')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">{t('dashboard.live')}</span>
                    </div>
            </header>
            
            {/* Read-Only Alert for Collaborators */}
            {isReadOnly && (
                <div className="mb-6 p-4 bg-amber-500/10 border-2 border-amber-500/30 rounded-xl animate-fade-in">
                    <div className="flex items-start gap-3">
                        <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-amber-400 font-semibold mb-1">{t('dashboard.readOnlyMode')}</p>
                            <p className="text-amber-200/70 text-sm">
                                {t('dashboard.readOnlyMessage')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* KPI Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 items-stretch">
                <div className="cursor-pointer h-full" onClick={() => onNavigate?.('value')}>
                    <StatCard
                        label={t('dashboard.governedCashflow')}
                        value={`${(userProfile?.credits || 0).toLocaleString('de-DE')} €`}
                        icon={TrendingUp}
                        trend={{ value: "↑ 2.4%", isPositive: true, label: "24h velocity" }}
                    >
                        <div className="flex items-center gap-2 mt-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest italic">Immutable Proof</span>
                        </div>
                    </StatCard>
                </div>

                <div className="cursor-pointer h-full" onClick={() => onNavigate?.('log')}>
                    <StatCard
                        label={t('dashboard.decisionLog')}
                        value={totalExecutions.toLocaleString()}
                        icon={Zap}
                        iconColor="text-white"
                        subtext={<span className="text-[var(--color-text-muted)] opacity-60">{t('dashboard.truthLedger')}</span>}
                    />
                </div>

                <div className="cursor-pointer h-full" onClick={() => onNavigate?.('compliance')}>
                    <StatCard
                        label={t('dashboard.complianceRate')}
                        value={`${complianceRate}%`}
                        icon={Shield}
                        iconColor="text-emerald-500"
                    >
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1">
                            <div className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]" style={{ width: `${complianceRate}%` }}></div>
                        </div>
                    </StatCard>
                </div>

                <div className="cursor-pointer h-full" onClick={() => onNavigate?.('human-risk')}>
                    <StatCard
                        label={t('dashboard.humanRisk')}
                        value={`${humanRisk}%`}
                        icon={AlertTriangle}
                        iconColor={parseFloat(humanRisk) > 3 ? "text-red-500" : "text-emerald-500"}
                        subtext={<span className={`${parseFloat(humanRisk) < 3 ? 'text-emerald-500' : 'text-red-500'} font-black uppercase tracking-widest text-[9px] italic`}>{t('dashboard.targetLessThan')} 3%</span>}
                    />
                </div>

                <div className="cursor-pointer h-full" onClick={() => onNavigate?.('residual-risk')}>
                    <StatCard
                        label={t('dashboard.residualRisk')}
                        value={`${residualRisk}%`}
                        icon={Activity}
                        iconColor={parseFloat(residualRisk) > 1 ? "text-amber-500" : "text-emerald-500"}
                        subtext={<span className={`${parseFloat(residualRisk) < 1 ? 'text-emerald-500' : 'text-amber-500'} font-black uppercase tracking-widest text-[9px] italic`}>{t('dashboard.targetLessThan')} 1%</span>}
                    />
                </div>
            </div>

            {/* Main Grid: Charts & Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* Main Chart Area */}
                <Card padding="lg" className="lg:col-span-2 min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[var(--color-text-main)] font-medium">{t('dashboard.executionVelocity')}</h3>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-white/5 text-[var(--color-text-muted)] rounded text-[10px] uppercase font-bold tracking-widest border border-white/10">{t('dashboard.today')}</span>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        {loading ? (
                            <div className="h-full flex items-center justify-center text-white/40">{t('common.loading')}</div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={valueVelocity}>
                                    <defs>
                                        <linearGradient id="colorValueMain" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#d4af37" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="var(--color-text-subtle)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        dy={10}
                                    />
                                    <YAxis
                                        stroke="var(--color-text-subtle)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        dx={-10}
                                    />
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
                                    <Area type="monotone" dataKey="value" stroke="var(--color-brand-accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorValueMain)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </Card>

                {/* Product Domain Performance */}
                <Card padding="md" className="flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[var(--color-text-main)] font-medium text-sm">{t('dashboard.agentPerformance')}</h3>
                        <Package size={20} className="text-[var(--color-text-muted)]" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between gap-3">
                        {performance.length === 0 && !loading && (
                            <div className="text-center text-white/40 py-8">{t('dashboard.noAgentData')}</div>
                        )}
                        {performance.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => onNavigate?.(product.id)}
                                className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-[var(--color-brand-accent)]/30 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center border border-white/5 group-hover:border-[var(--color-brand-accent)]/20 transition-colors">
                                            <product.icon size={16} className={product.color} />
                                        </div>
                                        <span className="text-[10px] font-bold text-[var(--color-text-subtle)] uppercase tracking-[0.1em]">{product.label}</span>
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <div className="text-[10px] text-[var(--color-text-muted)] mb-1 uppercase opacity-60 italic">{product.metric}</div>
                                        <div className="text-lg font-mono text-white leading-none">{product.value}</div>
                                    </div>
                                    <div className="text-[9px] text-[var(--color-text-subtle)] font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10 group-hover:border-[var(--color-brand-accent)]/20 transition-colors uppercase tracking-widest">
                                        {product.trend}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Live Decision Feed */}
            <RecentActivity activities={activities} />

        </div>
    );
};
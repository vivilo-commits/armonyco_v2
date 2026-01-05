import React from 'react';
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
import { logService } from '../../src/services/log.service';
import { productService } from '../../src/services/product.service';
import { UserProfile, ProductModule, DecisionRecord } from '../../src/types';

interface DashboardProps {
    onNavigate?: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
    const [modules, setModules] = React.useState<ProductModule[]>([]);
    const [activities, setActivities] = React.useState<DecisionRecord[]>([]);
    const [valueVelocity, setValueVelocity] = React.useState<any[]>([]);
    const [performance, setPerformance] = React.useState<any[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [profile, allModules, logs, velocity, perf] = await Promise.all([
                    authService.getUserProfile(),
                    productService.getModules(),
                    logService.getLogs(),
                    logService.getValueVelocity(),
                    logService.getDomainPerformance()
                ]);
                setUserProfile(profile);
                setModules(allModules);
                setActivities(logs);
                setValueVelocity(velocity);
                setPerformance(perf);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper to get module metric (mock simulation)
    const getModuleMetric = (category: string) => {
        const module = modules.find(m => m.category === category && m.isPurchased);
        if (!module) return { value: '0%', trend: 'No module' };

        switch (category) {
            case 'REVENUE': return { value: '12.450 ArmoCredits©', trend: '+18% vs Target' };
            case 'OPS': return { value: '94.2%', trend: '420h Saved' };
            default: return { value: '99.9%', trend: 'Optimal' };
        }
    };
    return (
        <div className="p-8 animate-fade-in text-white">
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <LayoutDashboard className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Control Tower™ <span className="text-white/20 text-sm font-normal lowercase italic tracking-normal ml-2">/ institutional truth</span></h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Consolidated overview of operational events and governed decision protocols.</p>
                </div>
            </header>

            {/* KPI Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 items-stretch">
                <div className="cursor-pointer h-full" onClick={() => onNavigate?.('value')}>
                    <StatCard
                        label="Governed Cashflow™"
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
                        label="Decision Log"
                        value="1.492"
                        icon={Zap}
                        iconColor="text-white"
                        subtext={<span className="text-[var(--color-text-muted)] opacity-60">Truth Ledger: Decisions Registered</span>}
                    />
                </div>

                <div className="cursor-pointer h-full" onClick={() => onNavigate?.('compliance')}>
                    <StatCard
                        label="Compliance Rate™"
                        value="96.8%"
                        icon={Shield}
                        iconColor="text-emerald-500"
                    >
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-1">
                            <div className="bg-emerald-500 w-[96.8%] h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                        </div>
                    </StatCard>
                </div>

                <div className="cursor-pointer h-full" onClick={() => onNavigate?.('human-risk')}>
                    <StatCard
                        label="Human Risk"
                        value="1.8%"
                        icon={AlertTriangle}
                        iconColor="text-red-500"
                        subtext={<span className="text-emerald-500 font-black uppercase tracking-widest text-[9px] italic">Target: {'<'} 3%</span>}
                    />
                </div>

                <div className="cursor-pointer h-full" onClick={() => onNavigate?.('residual-risk')}>
                    <StatCard
                        label="Residual Risk"
                        value="0.4%"
                        icon={Activity}
                        iconColor="text-amber-500"
                        subtext={<span className="text-emerald-500 font-black uppercase tracking-widest text-[9px] italic">Target: {'<'} 1%</span>}
                    />
                </div>
            </div>

            {/* Main Grid: Charts & Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* Main Chart Area */}
                <Card padding="lg" className="lg:col-span-2 min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[var(--color-text-main)] font-medium">Governed Cashflow™ Velocity</h3>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-white/5 text-[var(--color-text-muted)] rounded text-[10px] uppercase font-bold tracking-widest border border-white/10">Today</span>
                        </div>
                    </div>
                    <div className="h-80 w-full">
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
                    </div>
                </Card>

                {/* Product Domain Performance */}
                <Card padding="md" className="flex flex-col min-h-[400px]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-[var(--color-text-main)] font-medium text-sm">Product Domain Performance</h3>
                        <Package size={20} className="text-[var(--color-text-muted)]" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between gap-3">
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
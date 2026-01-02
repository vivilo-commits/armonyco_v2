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
    IconSizes
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

const valueData = [
    { time: '08:00', value: 45000 },
    { time: '10:00', value: 46200 },
    { time: '12:00', value: 46800 },
    { time: '14:00', value: 47100 },
    { time: '16:00', value: 47500 },
    { time: '18:00', value: 47832 },
    { time: '20:00', value: 48100 },
];

const productMetrics = [
    {
        id: 'products-guest',
        label: 'Guest Experience',
        metric: 'Identity Verification',
        value: '100%',
        trend: '0% Manual Review',
        icon: Users,
        color: 'text-white'
    },
    {
        id: 'products-revenue',
        label: 'Revenue Generation',
        metric: 'Gap Monetization',
        value: '12,450 AC',
        trend: '+18% vs Target',
        icon: TrendingUp,
        color: 'text-[var(--color-brand-accent)]'
    },
    {
        id: 'products-ops',
        label: 'Operational Efficiency',
        metric: 'Auto-Triage Rate',
        value: '94.2%',
        trend: '420h Human Time Saved',
        icon: Activity,
        color: 'text-emerald-500' // Using consistent success/operational color
    },
    {
        id: 'products-response',
        label: 'Incident Response',
        metric: 'SLA Adherence',
        value: '99.9%',
        trend: '< 2m Avg Response',
        icon: Shield,
        color: 'text-emerald-500'
    },
];

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
    const [modules, setModules] = React.useState<ProductModule[]>([]);
    const [activities, setActivities] = React.useState<DecisionRecord[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [profile, allModules, logs] = await Promise.all([
                    authService.getUserProfile(),
                    productService.getModules(),
                    logService.getLogs()
                ]);
                setUserProfile(profile);
                setModules(allModules);
                setActivities(logs);
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
            case 'REVENUE': return { value: '12,450 AC', trend: '+18% vs Target' };
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
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Control Tower™ <span className="text-[var(--color-text-muted)] text-sm font-normal lowercase italic tracking-normal opacity-50">/ Overview</span></h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Real-time Operational Governance & System Performance.</p>
                </div>
            </header>

            {/* KPI Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8 items-stretch">
                <div className="cursor-pointer h-full" onClick={() => onNavigate?.('value')}>
                    <StatCard
                        label="Governed Value™"
                        value={`${(userProfile?.credits || 0).toLocaleString()} €`}
                        icon={TrendingUp}
                        trend={{ value: "↑ 2.4%", isPositive: true, label: "since yesterday" }}
                    />
                </div>

                <div className="cursor-pointer h-full" onClick={() => onNavigate?.('log')}>
                    <StatCard
                        label="Decision Log"
                        value="1,492"
                        icon={Zap}
                        iconColor="text-white"
                        subtext="Verified events (24h)"
                    />
                </div>

                <div className="cursor-pointer h-full" onClick={() => onNavigate?.('compliance')}>
                    <StatCard
                        label="Compliance Rate™"
                        value="96.8%"
                        icon={Shield}
                        iconColor="text-[var(--color-success)]"
                    >
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden mt-2">
                            <div className="bg-[var(--color-success)] w-[96.8%] h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                        </div>
                    </StatCard>
                </div>

                <div className="cursor-pointer h-full" onClick={() => onNavigate?.('human-risk')}>
                    <StatCard
                        label="Human Risk"
                        value="3.2%"
                        icon={AlertTriangle}
                        iconColor="text-[var(--color-danger)]"
                        subtext={<span className="text-[var(--color-danger)] animate-pulse">Intervention required</span>}
                    />
                </div>

                <div className="cursor-pointer h-full" onClick={() => onNavigate?.('residual-risk')}>
                    <StatCard
                        label="Residual Risk"
                        value="1.8%"
                        icon={Activity}
                        iconColor="text-[var(--color-warning)]"
                        subtext="Ungoverned signals"
                    />
                </div>
            </div>

            {/* Main Grid: Charts & Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* Main Chart Area */}
                <Card padding="lg" className="lg:col-span-2 min-h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[var(--color-text-main)] font-medium">Governed Value Velocity</h3>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-white/5 text-[var(--color-text-muted)] rounded text-[10px] uppercase font-bold tracking-widest border border-white/10">Today</span>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={valueData}>
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
                        {productMetrics.map((product) => (
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
import React from 'react';
import { Calendar, AlertTriangle, CheckCircle, Activity, Shield, User, XCircle, Search, Filter, TrendingUp, Zap, ChevronDown } from '../../components/ui/Icons';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FloatingInput } from '../../components/ui/FloatingInput';
import { useCompliance, useRecentDecisions } from '../../src/hooks/useCompliance';
import { useN8nExecutions } from '../../src/hooks/useLogs';
import { DecisionRecord } from '../../src/types';

interface RiskComplianceProps {
    view?: 'overview' | 'compliance' | 'human-risk' | 'residual-risk';
}

const calculateCost = (credits: number) => credits * 0.0010;

// Shared Filter Bar Component
const FilterBar = ({ title }: { title: string }) => (
    <Card padding="md" className="mb-8 flex flex-wrap gap-4 items-center flex-shrink-0 w-full bg-white/[0.02] border-white/5">
        <div className="flex items-center gap-3 px-5 py-3 bg-white/[0.03] border border-white/10 rounded-2xl w-auto h-[56px] group hover:bg-white/[0.05] transition-all">
            <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Range_Matrix</span>
            <select className="bg-transparent border-none outline-none text-xs text-white/80 appearance-none cursor-pointer pr-8 font-black uppercase tracking-wider">
                <option>24H</option>
                <option>7D</option>
                <option>30D</option>
                <option>90D</option>
                <option>YTD</option>
            </select>
            <ChevronDown size={14} className="text-white/20 -ml-6 pointer-events-none" />
        </div>
        <div className="flex items-center gap-4 px-6 py-3 bg-white/[0.03] border border-white/10 rounded-2xl flex-1 h-[56px]">
            <Calendar size={16} className="text-[var(--color-brand-accent)]" />
            <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] italic">Fiscal Cycle 2024 • Q1 Protocol Active</span>
        </div>
        <Button variant="secondary" className="h-[56px] px-8 rounded-2xl border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5">
            <TrendingUp size={16} className="mr-2" /> Export Truth Log
        </Button>
    </Card>
);

export const RiskComplianceView: React.FC<RiskComplianceProps> = ({ view = 'overview' }) => {
    const { data: metrics } = useCompliance();
    const { data: decisions } = useRecentDecisions();
    const { data: executions } = useN8nExecutions();

    const history = metrics?.history || [];
    const recentDecisions = decisions || [];

    // Calculate real metrics from n8n_executions
    const totalExecutions = executions?.length || 0;
    const successCount = executions?.filter(e => e.status === 'success').length || 0;
    const failedCount = executions?.filter(e => e.status !== 'success').length || 0;
    const complianceRate = totalExecutions > 0 ? ((successCount / totalExecutions) * 100).toFixed(1) : '0';
    const humanRisk = totalExecutions > 0 ? ((failedCount / totalExecutions) * 100).toFixed(1) : '0';
    const residualRisk = totalExecutions > 0 ? (Math.max(0, parseFloat(humanRisk) * 0.5)).toFixed(1) : '0';

    // Convert executions to recent decisions format
    const executionDecisions = React.useMemo(() => {
        if (!executions?.length) return [];
        return executions.slice(0, 10).map(exec => ({
            id: exec.truth_identity || exec.n8n_execution_id,
            timestamp: new Date(exec.started_at).toLocaleTimeString('en-US'),
            policy: exec.perimeter || 'INSTITUTIONAL',
            verdict: exec.status === 'success' ? 'ALLOW' : 'DENY',
            responsible: exec.agent_name || 'SYSTEM',
            credits: exec.duration_ms ? Math.round(exec.duration_ms / 1000) : 0,
        }));
    }, [executions]);

    // Calculate intervention reasons from failed executions
    const interventionReasons = React.useMemo(() => {
        if (!executions?.length) return [];
        const agentFailures: Record<string, number> = {};
        executions.filter(e => e.status !== 'success').forEach(exec => {
            const agent = exec.agent_name || 'OTHER';
            agentFailures[agent] = (agentFailures[agent] || 0) + 1;
        });
        const total = Object.values(agentFailures).reduce((a, b) => a + b, 0) || 1;
        return Object.entries(agentFailures).map(([agent, count]) => ({
            label: agent === 'AMELIA' ? 'Guest Communication Issue' : agent === 'JAMES' ? 'Reservation Lookup Error' : agent === 'ELON' ? 'Revenue Calculation' : 'System Error',
            val: `${Math.round((count / total) * 100)}%`,
            color: agent === 'AMELIA' ? 'bg-[var(--color-danger)]' : agent === 'JAMES' ? 'bg-[var(--color-warning)]' : 'bg-[var(--color-text-muted)]',
        })).slice(0, 3);
    }, [executions]);

    // Human intervention log from failed executions
    const humanInterventionLog = React.useMemo(() => {
        if (!executions?.length) return [];
        return executions.filter(e => e.status !== 'success').slice(0, 5).map(exec => ({
            id: exec.truth_identity?.slice(0, 12) || exec.n8n_execution_id.slice(0, 12),
            time: new Date(exec.started_at).toLocaleTimeString('en-US'),
            actor: exec.agent_name || 'SYSTEM',
            reason: exec.workflow_name?.toUpperCase().replace(/ /g, '_').slice(0, 15) || 'WORKFLOW_ERROR',
            action: exec.status === 'error' ? 'Error Logged' : 'Review Required',
            risk: exec.duration_ms && exec.duration_ms > 30000 ? 'HIGH' : exec.duration_ms && exec.duration_ms > 10000 ? 'MED' : 'LOW',
            credits: exec.duration_ms ? Math.round(exec.duration_ms / 1000) : 1,
        }));
    }, [executions]);

    // Ungoverned signals (simulated from executions with unusual patterns)
    const ungovernedSignals = React.useMemo(() => {
        if (!executions?.length) return [];
        // Use failed or long-running executions as "ungoverned signals"
        return executions.filter(e => e.status !== 'success' || (e.duration_ms && e.duration_ms > 60000)).slice(0, 5).map(exec => ({
            id: `TRC-${exec.n8n_execution_id.slice(-5)}`,
            source: `${exec.agent_name || 'System'} (${exec.perimeter || 'Unknown'})`,
            content: exec.workflow_name || 'Workflow execution',
            cat: exec.status !== 'success' ? 'FAILED_EXEC' : 'LONG_RUNNING',
            action: exec.status === 'success' ? 'Monitored' : 'Alert Sent',
            credits: exec.duration_ms ? Math.round(exec.duration_ms / 60000) : 1,
        }));
    }, [executions]);

    // Calculated ungoverned counts
    const ungovernedSignalsCount = failedCount || 0;
    const shadowChannels = Math.max(0, Math.floor(failedCount / 3));

    // --- COMPLIANCE VIEW ---
    const renderCompliance = () => (
        <div className="flex flex-col h-full">
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Shield className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Compliance Rate™</h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Automated Compliance & Risk Exposure.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-[var(--color-success)]/10 text-[var(--color-success)] border border-[var(--color-success)]/20 rounded-full text-[10px] font-black flex items-center gap-2 shadow-sm uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse"></div>
                        Monitoring Active
                    </span>
                </div>
            </header>

            <FilterBar title="Compliance" />

            <div className="flex-1 min-h-0 flex flex-col gap-6">
                {/* Main KPI Card */}
                <Card padding="lg" className="w-full relative shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div>
                            <h3 className="text-[var(--color-text-muted)] text-xs uppercase font-bold tracking-wider mb-2">COMPLIANCE RATE™</h3>
                            <div className="flex items-baseline gap-3">
                                <span className="text-6xl font-numbers text-[var(--color-text-main)] tracking-tighter">{complianceRate}%</span>
                                <span className="text-[var(--color-success)] text-sm font-bold bg-[var(--color-success)]/10 px-2 py-1 rounded border border-[var(--color-success)]/20 font-numbers ml-2">Live</span>
                            </div>
                            <p className="text-[var(--color-text-muted)] text-sm mt-4 leading-relaxed">
                                Percentage of governed events resolved within policy, without human intervention.
                            </p>
                        </div>
                        <div className="md:col-span-2 h-32 flex items-end justify-between gap-1">
                            {history.map((val, i) => (
                                <div key={i} className="w-full bg-[var(--color-surface-hover)] rounded-t hover:bg-[var(--color-border)] transition-colors relative group h-full flex items-end">
                                    <div
                                        className="w-full bg-[var(--color-text-main)] rounded-t transition-all mx-0.5 shadow-lg group-hover:bg-[var(--color-brand-accent)]"
                                        style={{ height: `${(val - 80) * 4}%` }}
                                    ></div>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--color-surface-active)] text-[var(--color-text-main)] border border-[var(--color-border)] text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded whitespace-nowrap z-10 font-mono shadow-sm">
                                        {val}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Table Card */}
                <Card padding="none" className="overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <h3 className="text-white font-medium flex items-center gap-3 uppercase text-xs tracking-tight opacity-70">
                            <Shield size={18} className="text-emerald-500" /> Recent Autonomous Decisions
                        </h3>
                    </div>
                    <div className="overflow-x-auto w-full">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/[0.01] text-white/30 font-black border-b border-white/5 text-[9px] uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-10 py-6">Event ID</th>
                                    <th className="px-10 py-6">Timestamp</th>
                                    <th className="px-10 py-6">Policy Applied</th>
                                    <th className="px-10 py-6">Agent</th>
                                    <th className="px-10 py-6">Verdict</th>
                                    <th className="px-10 py-6 text-right">ArmoCredits©</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono text-xs">
                                {(executionDecisions.length > 0 ? executionDecisions : recentDecisions).map((row, i) => (
                                    <tr key={row.id || i} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                                        <td className="px-6 py-4 text-[var(--color-text-main)] font-medium">{row.id}</td>
                                        <td className="px-6 py-4 text-[var(--color-text-muted)]">{row.timestamp?.split(' ')[1] || row.timestamp}</td>
                                        <td className="px-6 py-4 text-[var(--color-text-secondary)] font-sans">{row.policy}</td>
                                        <td className="px-6 py-4 text-[var(--color-text-muted)]">{row.responsible || 'AMELIA'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${(row.verdict || '').toUpperCase() === 'ALLOW' ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20' :
                                                (row.verdict || '').toUpperCase() === 'DENY' ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20' :
                                                    'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20'
                                                }`}>{row.verdict}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-[var(--color-text-muted)] font-numbers">-{row.credits || 0} ⌬</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );

    // --- HUMAN RISK VIEW ---
    const renderHumanRisk = () => (
        <div className="flex flex-col h-full">
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Human Risk</h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Automated Compliance & Risk Exposure.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-[var(--color-warning)]/10 text-[var(--color-warning)] border border-[var(--color-warning)]/20 rounded-full text-[10px] font-black flex items-center gap-2 shadow-sm uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)] animate-pulse"></div>
                        Risk Detected
                    </span>
                </div>
            </header>

            <FilterBar title="Human Risk" />

            <div className="flex-1 min-h-0 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
                    <Card padding="lg" className="relative overflow-hidden group border-[var(--color-danger)]/30">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                            <AlertTriangle className="w-32 h-32 text-[var(--color-danger)]" />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-[var(--color-danger)]/10 rounded-lg text-[var(--color-danger)]"><AlertTriangle size={20} /></div>
                            <h3 className="text-[var(--color-text-main)] font-medium">Human Risk Exposure</h3>
                        </div>
                        <div className="text-5xl font-numbers text-[var(--color-danger)] mb-2">{humanRisk}%</div>
                        <p className="text-[var(--color-text-muted)] text-sm mt-4">The fraction of critical operations still dependent on human judgment.</p>
                    </Card>

                    <Card padding="lg" className="flex flex-col justify-center">
                        <h3 className="text-[var(--color-text-muted)] text-xs uppercase tracking-wider mb-6 font-bold">Top Intervention Reasons</h3>
                        <div className="space-y-6">
                            {(interventionReasons.length > 0 ? interventionReasons : [
                                { label: 'No intervention data', val: '0%', color: 'bg-[var(--color-text-muted)]' }
                            ]).map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs text-[var(--color-text-secondary)] font-medium">
                                        <span>{item.label}</span>
                                        <span>{item.val}</span>
                                    </div>
                                    <div className="w-full bg-[var(--color-surface-hover)] h-2 rounded-full overflow-hidden">
                                        <div className={`${item.color} h-full rounded-full shadow-sm`} style={{ width: item.val }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Table Card */}
                <Card padding="none" className="overflow-hidden">
                    <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-hover)]">
                        <h3 className="text-[var(--color-text-main)] font-medium flex items-center gap-2">
                            <User size={16} className="text-[var(--color-text-muted)]" /> Human Intervention Log
                        </h3>
                        <Button variant="secondary" size="sm">Export Log</Button>
                    </div>
                    {/* Reuse table structure with different data/headers if needed, simplified here */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/[0.02] text-[var(--color-text-muted)] font-bold border-b border-white/5 text-[9px] uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-6 py-4">Event ID</th>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Actor</th>
                                    <th className="px-6 py-4">Reason Code</th>
                                    <th className="px-6 py-4">Action</th>
                                    <th className="px-6 py-4">Risk Level</th>
                                    <th className="px-6 py-4 text-right">ArmoCredits©</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono text-xs">
                                {(humanInterventionLog.length > 0 ? humanInterventionLog : []).map((row, i) => (
                                    <tr key={i} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                                        <td className="px-6 py-4 text-[var(--color-text-main)] font-medium">{row.id}</td>
                                        <td className="px-6 py-4 text-[var(--color-text-muted)]">{row.time}</td>
                                        <td className="px-6 py-4 text-[var(--color-text-main)]">{row.actor}</td>
                                        <td className="px-6 py-4 text-[var(--color-text-secondary)]">{row.reason}</td>
                                        <td className="px-6 py-4 text-[var(--color-text-muted)]">{row.action}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold border ${row.risk === 'HIGH' ? 'bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20' :
                                                row.risk === 'MED' ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20' : 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20'
                                                }`}>{row.risk}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-[var(--color-text-muted)] font-numbers">-{row.credits} ⌬</td>
                                    </tr>
                                ))}
                                {humanInterventionLog.length === 0 && (
                                    <tr><td colSpan={7} className="px-6 py-8 text-center text-[var(--color-text-muted)]">No intervention data available</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div>
    );

    // --- RESIDUAL RISK VIEW ---
    const renderResidualRisk = () => (
        <div className="flex flex-col h-full">
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Residual Risk</h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Automated Compliance & Risk Exposure.</p>
                </div>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-[var(--color-danger)]/10 text-[var(--color-danger)] border border-[var(--color-danger)]/20 rounded-full text-[10px] font-black flex items-center gap-2 shadow-sm uppercase tracking-widest">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-danger)] animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.3)]"></div>
                        Critical Exposure
                    </span>
                </div>
            </header>

            <FilterBar title="Residual Risk" />

            <div className="flex-1 min-h-0 flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
                    <Card padding="lg" className="relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                            <Activity className="w-32 h-32 text-[var(--color-brand-accent)]" />
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-[var(--color-surface-hover)] rounded-lg text-[var(--color-brand-accent)]"><Activity size={20} /></div>
                            <h3 className="text-[var(--color-text-main)] font-medium">Residual Risk Rate</h3>
                        </div>
                        <div className="text-5xl font-numbers text-[var(--color-warning)] mb-2">{residualRisk}%</div>
                        <p className="text-[var(--color-text-muted)] text-sm mt-4">Events and communications happening outside the governance perimeter.</p>
                    </Card>

                    <Card padding="lg" className="flex flex-col justify-center">
                        <div className="border-l-4 border-[var(--color-brand-accent)] pl-6 py-2 mb-8 italic text-[var(--color-text-secondary)]">
                            "Residual Risk is the metric that tells the truth about maturity—because it measures what you cannot yet control."
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[var(--color-surface-hover)] p-4 rounded-lg text-center border border-[var(--color-border)]">
                                <div className="text-2xl font-bold text-[var(--color-warning)] mb-1">{ungovernedSignalsCount}</div>
                                <div className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">Ungoverned Signals</div>
                            </div>
                            <div className="bg-[var(--color-surface-hover)] p-4 rounded-lg text-center border border-[var(--color-border)]">
                                <div className="text-2xl font-bold text-[var(--color-warning)] mb-1">{shadowChannels}</div>
                                <div className="text-[10px] uppercase font-bold text-[var(--color-text-muted)] tracking-wider">Shadow Channels</div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Table Card */}
                <Card padding="none" className="overflow-hidden">
                    <div className="p-4 border-b border-[var(--color-border)] flex justify-between items-center bg-[var(--color-surface-hover)]">
                        <h3 className="text-[var(--color-text-main)] font-medium flex items-center gap-2">
                            <XCircle size={16} className="text-[var(--color-warning)]" /> Ungoverned Signal Discovery
                        </h3>
                        <Button variant="secondary" size="sm">Export Log</Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white/[0.02] text-[var(--color-text-muted)] font-bold border-b border-white/5 text-[9px] uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-6 py-4">Trace ID</th>
                                    <th className="px-6 py-4">Detected Via</th>
                                    <th className="px-6 py-4">Content Snippet</th>
                                    <th className="px-6 py-4">Likely Category</th>
                                    <th className="px-6 py-4">Action</th>
                                    <th className="px-6 py-4 text-right">ArmoCredits©</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-mono text-xs">
                                {(ungovernedSignals.length > 0 ? ungovernedSignals : []).map((row, i) => (
                                    <tr key={i} className="hover:bg-[var(--color-surface-hover)] transition-colors">
                                        <td className="px-6 py-4 text-[var(--color-text-main)] font-medium">{row.id}</td>
                                        <td className="px-6 py-4 text-[var(--color-text-muted)]">{row.source}</td>
                                        <td className="px-6 py-4 text-[var(--color-text-secondary)] italic">"{row.content}"</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded text-[10px] font-bold border bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20">
                                                {row.cat}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-[var(--color-text-muted)]">{row.action}</td>
                                        <td className="px-6 py-4 text-right text-[var(--color-text-muted)] font-numbers">{row.credits} ⌬</td>
                                    </tr>
                                ))}
                                {ungovernedSignals.length === 0 && (
                                    <tr><td colSpan={6} className="px-6 py-8 text-center text-[var(--color-text-muted)]">No ungoverned signals detected</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </div >
    );

    // --- MAIN RENDER ---
    return (
        <div className="p-8 animate-fade-in min-h-[calc(100vh-64px)] overflow-y-auto bg-black text-white">
            {(view === 'overview' || !view) && renderCompliance()}
            {view === 'compliance' && renderCompliance()}
            {view === 'human-risk' && renderHumanRisk()}
            {view === 'residual-risk' && renderResidualRisk()}
        </div>
    );
};
import React from 'react';
import { Card } from '../ui/Card';
import { Zap, MoreHorizontal, IconSizes, Loader } from '../ui/Icons';
import { Tooltip } from '../ui/Tooltip';
import { DecisionRecord } from '../../src/types';

interface RecentActivityProps {
    activities?: DecisionRecord[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities = [] }) => {
    // Internal helper to get status colors
    const getStatusStyle = (verdict: string) => {
        const v = verdict.toUpperCase();
        if (v === 'DENY' || v === 'REJECTED') return 'bg-red-500/10 text-red-500 border-red-500/20';
        if (v === 'ALLOW' || v === 'APPROVED') return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    };

    return (
        <Card padding="none" className="flex flex-col border-white/5 bg-black/40 backdrop-blur-xl">
            {/* Header */}
            <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <h3 className="text-white font-medium text-xs flex items-center gap-2 uppercase tracking-[0.2em]">
                    <Zap size={16} className="text-[var(--color-brand-accent)]" /> Live Decision Stream
                </h3>
                <div className="flex gap-6 items-center">
                    <div className="flex gap-2 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[10px] text-[var(--color-text-muted)] uppercase font-bold tracking-widest">Real-time</span>
                    </div>
                    <Tooltip text="View Stream Settings">
                        <MoreHorizontal size={18} className="text-[var(--color-text-muted)] hover:text-white cursor-pointer transition-colors" />
                    </Tooltip>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-white/[0.03] text-[var(--color-text-muted)] font-bold border-b border-white/5">
                        <tr>
                            <th className="px-6 py-4 font-mono text-[9px] uppercase tracking-[0.15em]">Time</th>
                            <th className="px-6 py-4 font-mono text-[9px] uppercase tracking-[0.15em]">Event ID</th>
                            <th className="px-6 py-4 font-mono text-[9px] uppercase tracking-[0.15em]">Agent</th>
                            <th className="px-6 py-4 font-mono text-[9px] uppercase tracking-[0.15em]">Policy</th>
                            <th className="px-6 py-4 font-mono text-[9px] uppercase tracking-[0.15em]">Verdict</th>
                            <th className="px-6 py-4 font-mono text-[9px] uppercase tracking-[0.15em] text-right">Credits©</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03] font-mono text-[10px]">
                        {(activities.length > 0 ? activities : []).slice(0, 10).map((item, i) => {
                            const isDeny = item.verdict === 'DENY' || item.verdict === 'REJECTED';

                            return (
                                <tr key={item.id || i} className="hover:bg-white/[0.03] transition-all duration-200 group cursor-default">
                                    <td className="px-6 py-4 text-[var(--color-text-muted)] group-hover:text-white transition-colors">
                                        {item.timestamp.split(' ')[1] || item.timestamp}
                                    </td>
                                    <td className="px-6 py-4 text-[var(--color-text-subtle)] group-hover:text-[var(--color-brand-accent)]/80 transition-colors">
                                        {item.id || `EVT_${i}`}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1 h-1 rounded-full ${i % 2 === 0 ? 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]' :
                                                'bg-[var(--color-brand-accent)] shadow-[0_0_4px_rgba(212,175,55,0.5)]'
                                                }`}></div>
                                            <span className="text-white font-bold opacity-80 group-hover:opacity-100 transition-opacity uppercase">
                                                {item.responsible || 'AMELIA'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-[var(--color-text-muted)] italic">
                                        {item.policy}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold tracking-widest ${getStatusStyle(item.verdict)}`}>
                                                {item.verdict.toUpperCase()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-primary)] font-bold transition-colors">
                                        {item.credits || '0.00'} AC
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* Footer shadow fade */}
            <div className="h-4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </Card>
    );
};

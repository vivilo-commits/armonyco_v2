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
                <h3 className="text-white font-light text-sm flex items-center gap-2 uppercase tracking-tight">
                    <Zap size={18} className="text-[var(--color-brand-accent)]" /> Live Decision Stream <span className="text-white/20 text-xs font-normal lowercase italic tracking-normal ml-2">/ real-time ledger</span>
                </h3>
                <div className="flex gap-6 items-center">
                    <div className="flex gap-2 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="text-[9px] text-emerald-500 uppercase font-black tracking-[0.2em] italic">Active Matrix Sync</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white/[0.03] text-white/30 font-black uppercase text-[9px] tracking-[0.2em] border-b border-white/5">
                        <tr>
                            <th className="px-10 py-5">Temporal Coord</th>
                            <th className="px-10 py-5">Event ID</th>
                            <th className="px-10 py-5">Governance Actor</th>
                            <th className="px-10 py-5">SOP Protocol</th>
                            <th className="px-10 py-5">Verdict</th>
                            <th className="px-10 py-5 text-right">Consumption</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03] font-mono text-[10px]">
                        {(activities || []).slice(0, 8).map((item, i) => {
                            if (!item) return null;
                            const timestamp = item.timestamp || '';
                            const timeOnly = timestamp.includes(' ') ? timestamp.split(' ')[1] : timestamp;

                            return (
                                <tr key={item.id || i} className="hover:bg-white/[0.03] transition-all duration-200 group cursor-default">
                                    <td className="px-6 py-5 text-white/30 group-hover:text-white/60 transition-colors tracking-widest">
                                        {timeOnly || '--:--:--'}
                                    </td>
                                    <td className="px-6 py-5 text-white font-black group-hover:text-[var(--color-brand-accent)] transition-colors italic tracking-tighter">
                                        {item.id || `EVT_${i}`}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1 h-1 rounded-full ${i % 2 === 0 ? 'bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]' :
                                                'bg-[var(--color-brand-accent)] shadow-[0_0_4px_rgba(212,175,55,0.5)]'
                                                }`}></div>
                                            <span className="text-white/80 font-black group-hover:text-white transition-opacity uppercase tracking-widest">
                                                {item.responsible || 'AMELIA'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-white/40 italic">
                                        {item.policy || 'N/A'}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-black tracking-widest uppercase shadow-sm ${getStatusStyle(item.verdict || 'N/A')}`}>
                                            {(item.verdict || 'N/A').toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right text-white font-numbers font-black italic">
                                        {(item.credits || 0).toLocaleString('de-DE')} <span className="text-[8px] opacity-40 uppercase tracking-widest not-italic ml-1">Credits©</span>
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

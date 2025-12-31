import React, { useState } from 'react';
import { LogEntry } from '../../types';
import { Search, Filter, Calendar, ChevronDown, Activity, MessageCircle, TrendingUp, Shield } from '../../components/ui/Icons';
import { AgentCard } from '../../components/ui/AgentCard';

const mockLogs: LogEntry[] = [
  { id: 'EVT 29384', timestamp: '2023-10-24 14:22:01', policy: 'POL TRAVEL EU', verdict: 'ALLOW', evidenceHash: '0x9a8b...2f1', responsible: 'SYS AUTO', credits: 1.205 },
  { id: 'EVT 29385', timestamp: '2023-10-24 14:23:45', policy: 'POL SPEND LIMIT', verdict: 'DENY', evidenceHash: '0x1c3d...8e9', responsible: 'SYS AUTO', credits: 0.850 },
  { id: 'EVT 29386', timestamp: '2023-10-24 14:24:12', policy: 'POL VENDOR KYC', verdict: 'MODIFY', evidenceHash: '0x7f2a...1b4', responsible: 'HUMAN REV', credits: 2.400 },
  { id: 'EVT 29387', timestamp: '2023-10-24 14:26:00', policy: 'POL INVOICE MATCH', verdict: 'ALLOW', evidenceHash: '0x5e6d...9c2', responsible: 'SYS AUTO', credits: 0.920 },
  { id: 'EVT 29388', timestamp: '2023-10-24 14:28:33', policy: 'POL CONTRACT VAL', verdict: 'ALLOW', evidenceHash: '0x3a4b...5f6', responsible: 'SYS AUTO', credits: 1.560 },
  { id: 'EVT 29389', timestamp: '2023-10-25 09:15:00', policy: 'POL HR ACCESS', verdict: 'ALLOW', evidenceHash: '0x2b8c...1a9', responsible: 'SYS AUTO', credits: 0.450 },
  { id: 'EVT 29390', timestamp: '2023-10-25 10:00:22', policy: 'POL DATA EXPORT', verdict: 'DENY', evidenceHash: '0x4d9e...3f2', responsible: 'SEC OPS', credits: 3.200 },
];

const agents = [
    { 
        id: 'amelia', 
        name: 'Amelia', 
        role: 'External Interface', 
        metricLabel: 'Intent Accuracy', 
        metricValue: '99.2%', 
        status: 'ONLINE', 
        initial: 'A',
        icon: MessageCircle,
        colorClass: 'text-emerald-500',
        bgClass: 'bg-emerald-500',
        hoverBorderClass: 'group-hover:border-emerald-500',
        borderClass: 'border-emerald-100'
    },
    { 
        id: 'lara', 
        name: 'Lara', 
        role: 'Revenue Engine', 
        metricLabel: 'Upsell Conversion', 
        metricValue: '24.8%', 
        status: 'WORKING', 
        initial: 'L',
        icon: TrendingUp,
        colorClass: 'text-armonyco-gold',
        bgClass: 'bg-armonyco-gold',
        hoverBorderClass: 'group-hover:border-armonyco-gold',
        borderClass: 'border-[#EADBC4]'
    },
    { 
        id: 'elon', 
        name: 'Elon', 
        role: 'Operations Engine', 
        metricLabel: 'Dispatch Validity', 
        metricValue: '100.0%', 
        status: 'ONLINE', 
        initial: 'E',
        icon: Activity,
        colorClass: 'text-blue-500',
        bgClass: 'bg-blue-500',
        hoverBorderClass: 'group-hover:border-blue-500',
        borderClass: 'border-blue-100'
    },
    { 
        id: 'james', 
        name: 'James', 
        role: 'Compliance Engine', 
        metricLabel: 'Policy Adherence', 
        metricValue: '100.0%', 
        status: 'AUDITING', 
        initial: 'J',
        icon: Shield,
        colorClass: 'text-stone-500',
        bgClass: 'bg-stone-500',
        hoverBorderClass: 'group-hover:border-stone-500',
        borderClass: 'border-stone-200'
    },
];

const calculateCost = (credits: number) => credits * 0.0010;

export const DecisionLog: React.FC = () => {
  const [filterPolicy, setFilterPolicy] = useState('');
  const [filterVerdict, setFilterVerdict] = useState('ALL');
  const [filterEntity, setFilterEntity] = useState('');

  const filteredLogs = mockLogs.filter(log => {
    const matchesPolicy = log.policy.toLowerCase().includes(filterPolicy.toLowerCase());
    const matchesVerdict = filterVerdict === 'ALL' || log.verdict === filterVerdict;
    const matchesEntity = log.responsible.toLowerCase().includes(filterEntity.toLowerCase());
    return matchesPolicy && matchesVerdict && matchesEntity;
  });

  return (
    <div className="p-8 animate-fade-in">
      <header className="mb-8 flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-stone-200 pb-6">
        <div>
          <h1 className="text-2xl text-stone-900 font-light">Immutable Decision Log</h1>
          <p className="text-stone-500 text-sm">Every operational event. Permanent record. Strict chain.</p>
        </div>
        <div className="text-xs text-stone-600 bg-white border border-stone-200 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span className="font-mono">Last hash sync: 2s ago</span>
        </div>
      </header>

      {/* AI Agents / Governance Actors Row */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
             <h3 className="text-stone-900 font-medium text-sm uppercase tracking-widest">Active Intelligence Team</h3>
             <span className="text-xs text-stone-500 flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> All Systems Operational</span>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6 w-full h-auto lg:h-[340px]">
            {agents.map((agent) => (
                <AgentCard 
                    key={agent.id}
                    {...agent}
                />
            ))}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="ui-card overflow-hidden">
        {/* Advanced Filter Bar */}
        <div className="p-4 flex flex-wrap gap-4 items-center border-b border-stone-100 bg-stone-50">
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-stone-200 rounded-xl min-w-[150px] relative ui-input h-10">
                <Filter size={14} className="text-stone-400" />
                <select 
                    className="bg-transparent border-none outline-none text-sm text-stone-900 w-full appearance-none cursor-pointer z-10"
                    value={filterVerdict}
                    onChange={(e) => setFilterVerdict(e.target.value)}
                >
                    <option value="ALL">All Verdicts</option>
                    <option value="ALLOW">Allow</option>
                    <option value="DENY">Deny</option>
                    <option value="MODIFY">Modify</option>
                </select>
                <ChevronDown size={14} className="text-stone-400 absolute right-3 pointer-events-none" />
            </div>

            <button className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-400 hover:text-stone-900 hover:border-stone-400 transition-colors ui-input w-auto h-10 flex items-center justify-center">
                <Calendar size={16} />
            </button>
        </div>

        <div className="overflow-hidden">
            <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-white text-stone-500 font-medium uppercase text-xs tracking-wider border-b border-stone-100">
                <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Event ID</th>
                <th className="px-6 py-4">Policy</th>
                <th className="px-6 py-4">Verdict</th>
                <th className="px-6 py-4 text-right">Credits</th>
                <th className="px-6 py-4 text-right">Cost (€)</th>
                <th className="px-6 py-4">Evidence Hash</th>
                <th className="px-6 py-4">Responsible</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono text-xs">
                {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-stone-50 transition-colors group cursor-default">
                    <td className="px-6 py-4 text-stone-500">{log.timestamp}</td>
                    <td className="px-6 py-4 text-stone-900 font-medium group-hover:text-armonyco-gold transition-colors">{log.id}</td>
                    <td className="px-6 py-4 font-sans text-stone-600">{log.policy}</td>
                    <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                        log.verdict === 'ALLOW' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        log.verdict === 'DENY' ? 'bg-red-50 text-red-600 border-red-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                        {log.verdict}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-right text-stone-500">{log.credits.toFixed(3)}</td>
                    <td className="px-6 py-4 text-right text-stone-900 font-bold">€{calculateCost(log.credits).toFixed(4)}</td>
                    <td className="px-6 py-4 text-stone-400 group-hover:text-stone-600 transition-colors">{log.evidenceHash}</td>
                    <td className="px-6 py-4 text-stone-900 font-bold">{log.responsible}</td>
                </tr>
                )) : (
                    <tr>
                        <td colSpan={8} className="p-12 text-center text-stone-500">
                            No events found matching criteria.
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
      </div>
      <p className="mt-4 text-stone-400 text-xs italic text-center">
        "This is not logging. It is institutional continuity."
      </p>
    </div>
  );
};
import React from 'react';
import { Database, Activity, CheckCircle, AlertTriangle, Zap, Clock, TrendingUp } from '../../components/ui/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const eventData = [
  { name: 'Finance', value: 4200, valid: 4150, invalid: 50 },
  { name: 'Ops', value: 8500, valid: 8300, invalid: 200 },
  { name: 'Guest', value: 12000, valid: 11950, invalid: 50 },
  { name: 'Security', value: 1500, valid: 1500, invalid: 0 },
  { name: 'System', value: 3000, valid: 2980, invalid: 20 },
];

const kpiData = [
    { label: 'Prod. executions', value: '1,044', sub: 'Last 7 days', trend: '6.53%', trendColor: 'text-emerald-500', trendIcon: '↑' },
    { label: 'Failed prod. executions', value: '89', sub: 'Last 7 days', trend: '52.41%', trendColor: 'text-red-500', trendIcon: '↑' },
    { label: 'Failure rate', value: '8.5%', sub: 'Last 7 days', trend: '10.6pp', trendColor: 'text-red-500', trendIcon: '↑' },
    { label: 'Time saved', value: '44h', sub: 'Last 7 days', trend: '44h', trendColor: 'text-emerald-500', trendIcon: '↑' },
    { label: 'Run time (avg.)', value: '48.26s', sub: 'Last 7 days', trend: '8.31s', trendColor: 'text-emerald-500', trendIcon: '↓' }, // Assuming lower is better
];

export const AEMView: React.FC = () => {
  return (
    <div className="p-8 animate-fade-in">
      <header className="mb-8 border-b border-stone-200 pb-6 flex justify-between items-end">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <Database className="text-armonyco-gold w-6 h-6" />
                <h1 className="text-2xl text-stone-900 font-light">AEM Event Model™</h1>
            </div>
            <p className="text-stone-500 text-sm">Canonical Event Ingestion & Schema Validation.</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-xs font-bold flex items-center gap-2 ui-card shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Schema v2.4 Active
            </span>
        </div>
      </header>

      {/* Impact Cards (Pricing-Free) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="ui-card-dark p-6 flex items-center justify-between relative overflow-hidden group">
               <div className="relative z-10">
                   <div className="text-stone-400 text-xs uppercase tracking-wider mb-2 font-bold">Human Time Reduced</div>
                   <div className="text-4xl font-mono text-armonyco-gold">142h</div>
               </div>
               <Clock size={32} className="text-stone-600 group-hover:text-armonyco-gold transition-colors relative z-10" />
               <div className="absolute top-0 right-0 p-4 opacity-10"><Clock size={64}/></div>
          </div>
          <div className="ui-card-dark p-6 flex items-center justify-between relative overflow-hidden group">
               <div className="relative z-10">
                   <div className="text-stone-400 text-xs uppercase tracking-wider mb-2 font-bold">Operational Value Saved</div>
                   <div className="text-4xl font-mono text-emerald-500">€ 4,250</div>
               </div>
               <TrendingUp size={32} className="text-stone-600 group-hover:text-emerald-500 transition-colors relative z-10" />
               <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={64}/></div>
          </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
         {kpiData.map((kpi, idx) => (
             <div key={idx} className="ui-card p-5 flex flex-col justify-between h-32">
                 <div>
                    <div className="text-stone-400 text-xs uppercase tracking-wider mb-1 truncate font-bold" title={kpi.label}>{kpi.label}</div>
                    <div className="text-stone-400 text-[10px] mb-2">{kpi.sub}</div>
                 </div>
                 <div className="flex items-end justify-between">
                     <div className="text-2xl font-mono text-stone-900 leading-none">{kpi.value}</div>
                     <div className={`text-xs font-bold ${kpi.trendColor} flex items-center`}>
                         {kpi.trendIcon} {kpi.trend}
                     </div>
                 </div>
             </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart */}
        <div className="lg:col-span-2 ui-card p-6 h-96">
            <h3 className="text-stone-900 font-medium mb-6">Event Distribution by Class</h3>
            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={eventData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e4" vertical={false} />
                    <XAxis dataKey="name" stroke="#a8a8a6" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a8a8a6" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                        cursor={{fill: '#f9faf9'}}
                        contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e5e4', color: '#151514', borderRadius: '8px' }}
                    />
                    <Bar dataKey="valid" stackId="a" fill="#151514" radius={[0, 0, 4, 4]} barSize={40} />
                    <Bar dataKey="invalid" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Live Validation Feed */}
        <div className="ui-card p-0 overflow-hidden flex flex-col h-96">
            <div className="p-4 border-b border-stone-100 bg-stone-50 flex justify-between items-center">
                <h3 className="text-stone-900 font-medium text-sm">Live Ingestion Stream</h3>
                <Activity size={14} className="text-emerald-500 animate-pulse" />
            </div>
            <div className="flex-1 overflow-y-auto p-0">
                <table className="w-full text-left text-xs font-mono">
                    <tbody className="divide-y divide-stone-100">
                        {[...Array(8)].map((_, i) => (
                            <tr key={i} className="hover:bg-stone-50 transition-colors">
                                <td className="p-3 text-stone-400">10:42:{10 + i}</td>
                                <td className="p-3 text-blue-600">evt_{84920 + i}</td>
                                <td className="p-3 text-right">
                                    {i === 3 ? (
                                        <span className="text-red-500 font-bold flex items-center justify-end gap-1">ERR <AlertTriangle size={10}/></span>
                                    ) : (
                                        <span className="text-emerald-500 font-bold flex items-center justify-end gap-1">OK <CheckCircle size={10}/></span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

      </div>
    </div>
  );
};
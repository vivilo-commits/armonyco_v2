import React from 'react';
import { Network, Zap, Cpu, Server, Activity, Clock, TrendingUp } from '../../components/ui/Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const performanceData = [
  { time: '00:00', load: 20, latency: 120 },
  { time: '04:00', load: 15, latency: 115 },
  { time: '08:00', load: 45, latency: 140 },
  { time: '12:00', load: 85, latency: 180 },
  { time: '16:00', load: 70, latency: 160 },
  { time: '20:00', load: 50, latency: 130 },
  { time: '23:59', load: 30, latency: 125 },
];

export const AOSView: React.FC = () => {
  return (
    <div className="p-8 animate-fade-in">
      <header className="mb-8 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-3 mb-2">
            <Network className="text-armonyco-gold w-6 h-6" />
            <h1 className="text-2xl text-stone-900 font-light">AOS Operating System™</h1>
        </div>
        <p className="text-stone-500 text-sm">Execution Engine Performance & Latency.</p>
      </header>

      {/* Impact Cards (Pricing-Free) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="ui-card-dark p-6 flex items-center justify-between relative overflow-hidden group">
               <div className="relative z-10">
                   <div className="text-stone-400 text-xs uppercase tracking-wider mb-2 font-bold">Human Time Reduced</div>
                   <div className="text-4xl font-mono text-armonyco-gold">420h</div>
               </div>
               <Clock size={32} className="text-stone-600 group-hover:text-armonyco-gold transition-colors relative z-10" />
               <div className="absolute top-0 right-0 p-4 opacity-10"><Clock size={64}/></div>
          </div>
          <div className="ui-card-dark p-6 flex items-center justify-between relative overflow-hidden group">
               <div className="relative z-10">
                   <div className="text-stone-400 text-xs uppercase tracking-wider mb-2 font-bold">Operational Value Saved</div>
                   <div className="text-4xl font-mono text-emerald-500">€ 12,500</div>
               </div>
               <TrendingUp size={32} className="text-stone-600 group-hover:text-emerald-500 transition-colors relative z-10" />
               <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={64}/></div>
          </div>
      </div>

      {/* System Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="ui-card-dark p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Zap size={64} />
              </div>
              <div className="text-stone-400 text-xs uppercase tracking-wider mb-2 font-bold">Decision Latency (Avg)</div>
              <div className="text-5xl font-mono font-light mb-2 text-armonyco-gold">142<span className="text-lg text-stone-500 ml-1">ms</span></div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                  Optimal Range
              </div>
          </div>

          <div className="ui-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-stone-400 text-xs uppercase tracking-wider font-bold">
                        <Cpu size={14} /> Active Agents
                    </div>
                    <span className="text-2xl font-mono text-stone-900">4<span className="text-stone-300 text-lg">/4</span></span>
                </div>
                <div className="space-y-3">
                    {[
                        { name: 'Amelia (Ext)', status: 'ONLINE' },
                        { name: 'Lara (Rev)', status: 'ONLINE' },
                        { name: 'Elon (Ops)', status: 'ONLINE' },
                        { name: 'James (Comp)', status: 'ONLINE' }
                    ].map((agent, i) => (
                         <div key={i} className="flex justify-between text-xs items-center">
                            <span className="text-stone-600 font-mono">{agent.name}</span>
                            <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-bold border border-emerald-100">{agent.status}</span>
                        </div>
                    ))}
                </div>
              </div>
          </div>

          <div className="ui-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-stone-400 text-xs uppercase tracking-wider font-bold">
                    <Server size={14} /> System Uptime
                </div>
                <div className="text-4xl font-mono text-stone-900 mb-1">99.99%</div>
                <div className="text-stone-400 text-xs">Rolling 30-day window</div>
              </div>
              <div className="mt-4">
                  <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden mb-2">
                    <div className="bg-emerald-500 h-full w-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  </div>
                  <div className="text-[10px] text-stone-400 text-right">Last outage: None</div>
              </div>
          </div>
      </div>

      {/* Latency Chart */}
      <div className="ui-card p-6 h-96">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-stone-900 font-medium">System Load vs. Decision Latency</h3>
            <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-stone-900"></div> System Load</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-armonyco-gold"></div> Latency</div>
            </div>
        </div>
        <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={performanceData}>
                <defs>
                    <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#151514" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#151514" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C5A572" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#C5A572" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e4" vertical={false} />
                <XAxis dataKey="time" stroke="#a8a8a6" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a8a8a6" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e5e4', color: '#151514', borderRadius: '8px' }}
                />
                <Area type="monotone" dataKey="load" stroke="#151514" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
                <Area type="monotone" dataKey="latency" stroke="#C5A572" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" />
            </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
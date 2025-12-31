import React from 'react';
import { 
    LayoutDashboard, 
    TrendingUp, 
    Shield, 
    Activity, 
    Zap,
    Users,
    Package,
    MoreHorizontal,
    AlertTriangle
} from '../../components/ui/Icons';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer
} from 'recharts';

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
        id: 'guest', 
        label: 'Guest Experience', 
        metric: 'Identity Verification', 
        value: '100%', 
        trend: '0% Manual Review', 
        icon: Users,
        color: 'text-stone-900'
    },
    { 
        id: 'revenue', 
        label: 'Revenue Generation', 
        metric: 'Gap Monetization', 
        value: '€ 12,450', 
        trend: '+18% vs Target', 
        icon: TrendingUp,
        color: 'text-armonyco-gold'
    },
    { 
        id: 'ops', 
        label: 'Operational Efficiency', 
        metric: 'Auto-Triage Rate', 
        value: '94.2%', 
        trend: '420h Human Time Saved', 
        icon: Activity,
        color: 'text-blue-600'
    },
    { 
        id: 'response', 
        label: 'Incident Response', 
        metric: 'SLA Adherence', 
        value: '99.9%', 
        trend: '< 2m Avg Response', 
        icon: Shield,
        color: 'text-emerald-600'
    },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="p-8">
      <header className="mb-8 border-b border-stone-200 pb-6">
         <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="text-armonyco-gold w-6 h-6" />
            <h1 className="text-2xl text-stone-900 font-light">Control Tower Overview</h1>
         </div>
         <p className="text-stone-500 text-sm">Real-time Operational Governance & System Performance.</p>
      </header>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          
          <div className="ui-card-dark p-6 relative overflow-hidden group hover:scale-105 transition-transform duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                  <TrendingUp size={64} />
              </div>
              <div className="text-stone-400 text-[10px] uppercase tracking-widest font-bold mb-1">Governed Value™</div>
              <div className="text-3xl font-mono text-armonyco-gold">€ 48,100</div>
              <div className="text-stone-400 text-xs mt-2 flex items-center gap-1">
                  <span className="text-emerald-400 font-bold font-mono">↑ 2.4%</span> since yesterday
              </div>
          </div>

          <div className="ui-card-dark p-6 relative overflow-hidden group hover:scale-105 transition-transform duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                  <Zap size={64} />
              </div>
              <div className="text-stone-400 text-[10px] uppercase tracking-widest font-bold mb-1">Decision Log</div>
              <div className="text-3xl font-mono text-stone-100">1,492</div>
              <div className="text-stone-500 text-xs mt-2">Verified events (24h)</div>
          </div>

          <div className="ui-card-dark p-6 relative overflow-hidden group hover:scale-105 transition-transform duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-emerald-500 transform group-hover:scale-110 duration-500">
                  <Shield size={64} />
              </div>
              <div className="text-stone-400 text-[10px] uppercase tracking-widest font-bold mb-1">Compliance Rate</div>
              <div className="text-3xl font-mono text-white">96.8%</div>
              <div className="w-full bg-stone-800 h-1.5 rounded-full mt-3 overflow-hidden">
                   <div className="bg-emerald-500 w-[96.8%] h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              </div>
          </div>

          <div className="ui-card-dark p-6 relative overflow-hidden group hover:scale-105 transition-transform duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-red-500 transform group-hover:scale-110 duration-500">
                  <AlertTriangle size={64} />
              </div>
              <div className="text-stone-400 text-[10px] uppercase tracking-widest font-bold mb-1">Human Risk</div>
              <div className="text-3xl font-mono text-white">3.2%</div>
              <div className="text-red-400 text-xs mt-2">Intervention required</div>
          </div>

           <div className="ui-card-dark p-6 relative overflow-hidden group hover:scale-105 transition-transform duration-500">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-amber-500 transform group-hover:scale-110 duration-500">
                  <Activity size={64} />
              </div>
              <div className="text-stone-400 text-[10px] uppercase tracking-widest font-bold mb-1">Residual Risk</div>
              <div className="text-3xl font-mono text-white">1.8%</div>
              <div className="text-stone-500 text-xs mt-2">Ungoverned signals</div>
          </div>
      </div>

      {/* Main Grid: Charts & Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Main Chart Area */}
          <div className="ui-card lg:col-span-2 p-6 min-h-[400px]">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-stone-900 font-medium">Governed Value Velocity</h3>
                  <div className="flex gap-2">
                      <span className="px-2 py-1 bg-stone-50 text-stone-600 rounded text-xs font-mono border border-stone-200">Today</span>
                  </div>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={valueData}>
                        <defs>
                            <linearGradient id="colorValueMain" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#151514" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#151514" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e4" vertical={false} />
                        <XAxis dataKey="time" stroke="#a8a8a6" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#a8a8a6" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e5e4', color: '#151514', borderRadius: '8px' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#151514" strokeWidth={2} fillOpacity={1} fill="url(#colorValueMain)" />
                    </AreaChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* Product Domain Performance */}
          <div className="ui-card p-6 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                  <h3 className="text-stone-900 font-medium">Product Domain Performance</h3>
                  <Package size={16} className="text-stone-400" />
              </div>
              <div className="flex-1 flex flex-col justify-between gap-4">
                  {productMetrics.map((product) => (
                      <div key={product.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors cursor-default">
                          <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                  <product.icon size={14} className={product.color} />
                                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wide">{product.label}</span>
                              </div>
                          </div>
                          <div className="flex items-end justify-between">
                             <div>
                                <div className="text-xs text-stone-400">{product.metric}</div>
                                <div className="text-xl font-mono text-stone-900 leading-none mt-1">{product.value}</div>
                             </div>
                             <div className="text-[10px] text-stone-500 font-medium bg-white px-1.5 py-0.5 rounded border border-stone-200">
                                 {product.trend}
                             </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>

      {/* Live Decision Feed */}
      <div className="ui-card p-0 flex flex-col">
        <div className="p-4 border-b border-stone-100 bg-stone-50 flex justify-between items-center">
            <h3 className="text-stone-900 font-medium text-sm flex items-center gap-2">
                <Zap size={14} className="text-armonyco-gold" /> Live Decision Stream
            </h3>
            <div className="flex gap-4 items-center">
                 <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs text-stone-400 uppercase">Real-time</span>
                </div>
                <MoreHorizontal size={14} className="text-stone-400 hover:text-stone-900 cursor-pointer" />
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
                <thead className="bg-white text-stone-500 font-medium border-b border-stone-100">
                    <tr>
                        <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-wider">Event ID</th>
                        <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-wider">Agent</th>
                        <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-wider">Policy</th>
                        <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-wider">Verdict</th>
                        <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-wider text-right">Credits</th>
                        <th className="px-6 py-3 font-mono text-[10px] uppercase tracking-wider text-right">Cost (€)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                        {[...Array(5)].map((_, i) => {
                            const credits = 0.8 + (i * 0.123);
                            const cost = credits * 0.001;
                            return (
                                <tr key={i} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4 text-stone-400">14:02:{45 - i}</td>
                                    <td className="px-6 py-4 text-stone-600">EVT_{99420 - i}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                i % 2 === 0 ? 'bg-emerald-500' : i % 3 === 0 ? 'bg-stone-400' : 'bg-blue-500'
                                            }`}></span>
                                            <span className="text-stone-900 font-bold">
                                                {i % 2 === 0 ? 'AMELIA' : i % 3 === 0 ? 'JAMES' : 'ELON'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-stone-500">
                                        {i % 2 === 0 ? 'POL_GUEST_ACCESS' : 'POL_VENDOR_PAY'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded border ${
                                            i === 2 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                        }`}>
                                            {i === 2 ? 'DENY' : 'ALLOW'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-stone-500">{credits.toFixed(3)}</td>
                                    <td className="px-6 py-4 text-right text-stone-900 font-bold">€{cost.toFixed(4)}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};
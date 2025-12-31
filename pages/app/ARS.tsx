import React from 'react';
import { Shield, FileCheck, Link, Lock, Search, Clock, TrendingUp, CheckCircle } from '../../components/ui/Icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const evidenceData = [
  { name: 'Photo/Media', value: 35, color: '#151514' },
  { name: 'System Logs', value: 40, color: '#575756' },
  { name: 'Documents', value: 15, color: '#A8A8A6' },
  { name: 'User Auth', value: 10, color: '#C5A572' },
];

export const ARSView: React.FC = () => {
  return (
    <div className="p-8 animate-fade-in">
      <header className="mb-8 border-b border-stone-200 pb-6">
        <div className="flex items-center gap-3 mb-2">
            <Shield className="text-armonyco-gold w-6 h-6" />
            <h1 className="text-2xl text-stone-900 font-light">ARS Reliability Standard™</h1>
        </div>
        <p className="text-stone-500 text-sm">Evidence Quality & Chain of Custody Monitor.</p>
      </header>

      {/* Impact Cards (Pricing-Free) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="ui-card-dark p-6 flex items-center justify-between relative overflow-hidden group">
               <div className="relative z-10">
                   <div className="text-stone-400 text-xs uppercase tracking-wider mb-2 font-bold">Human Time Reduced</div>
                   <div className="text-4xl font-mono text-armonyco-gold">32h</div>
               </div>
               <Clock size={32} className="text-stone-600 group-hover:text-armonyco-gold transition-colors relative z-10" />
               <div className="absolute top-0 right-0 p-4 opacity-10"><Clock size={64}/></div>
          </div>
          <div className="ui-card-dark p-6 flex items-center justify-between relative overflow-hidden group">
               <div className="relative z-10">
                   <div className="text-stone-400 text-xs uppercase tracking-wider mb-2 font-bold">Operational Value Saved</div>
                   <div className="text-4xl font-mono text-emerald-500">€ 1,200</div>
               </div>
               <TrendingUp size={32} className="text-stone-600 group-hover:text-emerald-500 transition-colors relative z-10" />
               <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={64}/></div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="ui-card p-6 flex flex-col justify-between">
             <div className="flex items-center justify-between mb-4">
                 <div className="text-stone-400 text-xs uppercase tracking-wider font-bold">Evidence Density</div>
                 <FileCheck size={16} className="text-armonyco-gold" />
             </div>
             <div className="text-3xl font-mono text-stone-900">98.2%</div>
             <div className="w-full bg-stone-100 h-1.5 rounded-full mt-3 overflow-hidden">
                 <div className="bg-stone-900 w-[98.2%] h-full rounded-full"></div>
             </div>
          </div>
          
          <div className="ui-card p-6 flex flex-col justify-between">
             <div className="flex items-center justify-between mb-4">
                 <div className="text-stone-400 text-xs uppercase tracking-wider font-bold">Chain Completeness</div>
                 <Link size={16} className="text-armonyco-gold" />
             </div>
             <div className="text-3xl font-mono text-stone-900">100%</div>
             <div className="text-stone-500 text-xs mt-2 flex items-center gap-1"><CheckCircle size={10} className="text-emerald-500"/> Zero Breaks</div>
          </div>

          <div className="ui-card p-6 flex flex-col justify-between">
             <div className="flex items-center justify-between mb-4">
                 <div className="text-stone-400 text-xs uppercase tracking-wider font-bold">Immutable Hashes</div>
                 <Lock size={16} className="text-armonyco-gold" />
             </div>
             <div className="text-3xl font-mono text-stone-900">12.4k</div>
             <div className="text-stone-500 text-xs mt-2">Synced to Ledger</div>
          </div>

           <div className="ui-card p-6 flex flex-col justify-between">
             <div className="flex items-center justify-between mb-4">
                 <div className="text-stone-400 text-xs uppercase tracking-wider font-bold">Audit Readiness</div>
                 <Shield size={16} className="text-emerald-500" />
             </div>
             <div className="text-3xl font-mono text-emerald-500">READY</div>
             <div className="text-stone-500 text-xs mt-2">Last Check: 1m ago</div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Evidence Distribution */}
          <div className="ui-card p-6 h-96">
              <h3 className="text-stone-900 font-medium mb-6">Evidence Type Distribution</h3>
              <ResponsiveContainer width="100%" height="85%">
                  <PieChart>
                      <Pie 
                        data={evidenceData} 
                        innerRadius={60} 
                        outerRadius={90} 
                        paddingAngle={5} 
                        dataKey="value"
                        stroke="none"
                      >
                        {evidenceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e5e4', color: '#151514', fontSize: '12px', borderRadius: '8px' }}/>
                      <Legend verticalAlign="bottom" layout="horizontal" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '20px' }} />
                  </PieChart>
              </ResponsiveContainer>
          </div>

          {/* Verification Log */}
          <div className="lg:col-span-2 ui-card p-0 overflow-hidden h-96 flex flex-col">
              <div className="p-4 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                  <h3 className="text-stone-900 font-medium text-sm flex items-center gap-2">
                     <Shield size={14} className="text-emerald-500"/> Recent Evidence Verifications
                  </h3>
              </div>
              <div className="overflow-y-auto flex-1">
                  <table className="w-full text-left text-xs">
                      <thead className="bg-white text-stone-500 font-medium border-b border-stone-100 sticky top-0 text-xs uppercase tracking-wider">
                          <tr>
                              <th className="px-6 py-3">Event ID</th>
                              <th className="px-6 py-3">Type</th>
                              <th className="px-6 py-3">Requirement</th>
                              <th className="px-6 py-3">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 font-mono text-[11px]">
                          <tr className="hover:bg-stone-50 transition-colors">
                              <td className="px-6 py-4 text-stone-900">evt_9921</td>
                              <td className="px-6 py-4 text-stone-500">Expense &gt; 500</td>
                              <td className="px-6 py-4 text-stone-500">Receipt + Manager Approval</td>
                              <td className="px-6 py-4"><span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded font-bold">VERIFIED</span></td>
                          </tr>
                          <tr className="hover:bg-stone-50 transition-colors">
                              <td className="px-6 py-4 text-stone-900">evt_9922</td>
                              <td className="px-6 py-4 text-stone-500">Guest Check-in</td>
                              <td className="px-6 py-4 text-stone-500">Passport Scan</td>
                              <td className="px-6 py-4"><span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded font-bold">VERIFIED</span></td>
                          </tr>
                          <tr className="hover:bg-stone-50 transition-colors">
                              <td className="px-6 py-4 text-stone-900">evt_9923</td>
                              <td className="px-6 py-4 text-stone-500">Refund Issue</td>
                              <td className="px-6 py-4 text-stone-500">Damage Photo</td>
                              <td className="px-6 py-4"><span className="text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded font-bold">PENDING</span></td>
                          </tr>
                          <tr className="hover:bg-stone-50 transition-colors">
                              <td className="px-6 py-4 text-stone-900">evt_9924</td>
                              <td className="px-6 py-4 text-stone-500">Vendor Payout</td>
                              <td className="px-6 py-4 text-stone-500">Tax ID Valid</td>
                              <td className="px-6 py-4"><span className="text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded font-bold">VERIFIED</span></td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    </div>
  );
};
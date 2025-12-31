import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Filter, Calendar, TrendingUp } from '../../components/ui/Icons';
import { FloatingInput } from '../../components/ui/FloatingInput';

const data = [
    { name: 'Jan', value: 4000, currency: 'EUR' },
    { name: 'Feb', value: 12000, currency: 'EUR' },
    { name: 'Mar', value: 18000, currency: 'EUR' },
    { name: 'Apr', value: 27000, currency: 'EUR' },
    { name: 'May', value: 32000, currency: 'EUR' },
    { name: 'Jun', value: 41000, currency: 'EUR' },
    { name: 'Jul', value: 47832, currency: 'EUR' },
];

export const GovernedValueView: React.FC = () => {
    const [minAmount, setMinAmount] = useState('');
    
    const displayData = data; 

    return (
        <div className="p-8 animate-fade-in">
             <header className="mb-8">
                <h1 className="text-2xl text-stone-900 font-light">Governed Value™ (€) Lifetime</h1>
                <p className="text-stone-500 text-sm">Value that survives people, disputes, scaling, and ownership change.</p>
            </header>

            {/* Filter Bar */}
            <div className="ui-card p-6 mb-8 flex flex-wrap gap-4 items-end">
                <div className="flex items-center gap-2 px-3 py-3 bg-stone-50 border border-stone-200 rounded-xl ui-input w-auto h-[50px]">
                    <span className="text-stone-500 text-xs font-mono font-bold">CURRENCY</span>
                    <select className="bg-transparent border-none outline-none text-sm text-stone-900 appearance-none cursor-pointer pr-4 font-medium">
                        <option>EUR (€)</option>
                        <option>USD ($)</option>
                        <option>GBP (£)</option>
                    </select>
                </div>
                
                <div className="w-40">
                    <FloatingInput 
                        label="Min Value" 
                        type="number"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        startIcon={<Filter size={14} />}
                    />
                </div>

                <div className="flex items-center gap-2 px-3 py-3 bg-stone-50 border border-stone-200 rounded-xl flex-1 ui-input h-[50px]">
                    <Calendar size={14} className="text-stone-400" />
                    <span className="text-stone-600 text-sm font-medium">2024 Fiscal Year</span>
                </div>
            </div>

            <div className="h-96 w-full ui-card p-4 mb-8 relative">
                <div className="absolute top-6 right-6 z-10 text-right">
                    <span className="text-armonyco-gold font-mono text-3xl font-bold block mb-1">€ 47,832</span>
                    <span className="text-stone-400 text-[10px] uppercase tracking-widest font-bold">Total Governed Value</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={displayData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#C5A572" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#C5A572" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e4" vertical={false} />
                        <XAxis dataKey="name" stroke="#a8a8a6" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#a8a8a6" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e5e4', color: '#151514', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            itemStyle={{ color: '#C5A572', fontWeight: 600, fontFamily: 'monospace' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#C5A572" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="p-6 ui-card flex flex-col justify-between h-32">
                     <div>
                        <h3 className="text-stone-400 text-xs uppercase font-bold tracking-wider mb-2">Largest Single Event</h3>
                        <p className="text-stone-900 text-2xl font-mono">€ 12,450</p>
                     </div>
                     <p className="text-stone-500 text-xs flex items-center gap-1"><TrendingUp size={12} className="text-armonyco-gold"/> Contract_Renewal_V2</p>
                 </div>
                 <div className="p-6 ui-card flex flex-col justify-between h-32">
                     <div>
                        <h3 className="text-stone-400 text-xs uppercase font-bold tracking-wider mb-2">Governance Density</h3>
                        <p className="text-stone-900 text-2xl font-mono">100%</p>
                     </div>
                     <p className="text-stone-500 text-xs">All flows fully evidenced</p>
                 </div>
                 <div className="p-6 ui-card flex flex-col justify-between h-32">
                     <div>
                        <h3 className="text-stone-400 text-xs uppercase font-bold tracking-wider mb-2">Dispute Rate</h3>
                        <p className="text-stone-900 text-2xl font-mono">0.0%</p>
                     </div>
                     <p className="text-stone-500 text-xs">Last 6 months</p>
                 </div>
            </div>

            <p className="text-stone-400 italic text-sm mt-8 text-center">Certified cashflow, governed end-to-end.</p>
        </div>
    )
}
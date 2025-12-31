import React from 'react';
import { FileCheck, TrendingUp, Calendar, Download } from '../../components/ui/Icons';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, LineChart, Line, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { ActionToggle } from '../../components/ui/ActionToggle';

const radarData = [
  { subject: 'Financial Control', A: 98, fullMark: 100 },
  { subject: 'Ops Consistency', A: 92, fullMark: 100 },
  { subject: 'Risk Mitigation', A: 96, fullMark: 100 },
  { subject: 'Data Integrity', A: 99, fullMark: 100 },
  { subject: 'Compliance', A: 95, fullMark: 100 },
  { subject: 'Recovery Speed', A: 88, fullMark: 100 },
];

const historyData = [
    { month: 'Jul', score: 82 },
    { month: 'Aug', score: 85 },
    { month: 'Sep', score: 89 },
    { month: 'Oct', score: 91 },
    { month: 'Nov', score: 94 },
    { month: 'Dec', score: 96 },
];

export const AGSView: React.FC = () => {
  return (
    <div className="p-8 animate-fade-in">
      <header className="mb-8 border-b border-stone-200 pb-6 flex justify-between items-end">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <FileCheck className="text-armonyco-gold w-6 h-6" />
                <h1 className="text-2xl text-stone-900 font-light">AGS Governance Scorecard™</h1>
            </div>
            <p className="text-stone-500 text-sm">Certified Institutional Grade.</p>
        </div>
        <ActionToggle 
            type="download"
            labelIdle="Export Report"
            labelActive="Done"
            onToggle={() => console.log('Exporting...')}
        />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Grade Card */}
          <div className="ui-card-dark p-8 flex flex-col justify-center items-center relative overflow-hidden shadow-lg group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-armonyco-gold via-white to-armonyco-gold opacity-50"></div>
              <div className="text-stone-400 text-xs uppercase tracking-widest mb-6 font-bold">Current Score</div>
              <div className="text-[120px] leading-none font-serif text-armonyco-gold mb-2 drop-shadow-2xl">A+</div>
              <div className="text-2xl font-light text-stone-300 font-mono">96<span className="text-base text-stone-600">/100</span></div>
              <div className="mt-8 flex gap-6 text-[10px] uppercase tracking-wider text-stone-400">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Audit Ready</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 bg-emerald-500 rounded-full"></div> Verified</div>
              </div>
          </div>

          {/* Radar Chart */}
          <div className="ui-card p-6 col-span-1 md:col-span-2">
              <h3 className="text-stone-900 font-medium mb-4">Governance Dimensions</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#e5e5e4" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#787875', fontSize: 11, fontWeight: 500 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Armonyco"
                        dataKey="A"
                        stroke="#C5A572"
                        strokeWidth={3}
                        fill="#C5A572"
                        fillOpacity={0.2}
                    />
                    </RadarChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* Historical Trend */}
          <div className="ui-card p-6 col-span-1 md:col-span-3">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-stone-900 font-medium flex items-center gap-2">
                     <TrendingUp size={16} className="text-stone-400"/> 6-Month Trajectory
                 </h3>
                 <div className="flex gap-2 text-xs text-stone-500">
                     <span className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded border border-stone-100 font-mono"><Calendar size={12} /> Last 6 Months</span>
                 </div>
              </div>
              <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0ee" vertical={false} />
                          <XAxis dataKey="month" stroke="#a8a8a6" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderColor: '#e5e5e4', color: '#151514', fontSize: '12px', borderRadius: '8px' }}
                          />
                          <Line type="monotone" dataKey="score" stroke="#151514" strokeWidth={2} dot={{ fill: '#C5A572', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#151514' }} />
                      </LineChart>
                  </ResponsiveContainer>
              </div>
          </div>

      </div>
    </div>
  );
};
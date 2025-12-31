import React, { useState } from 'react';
import { Calendar, AlertTriangle, CheckCircle, Activity, Shield, User, XCircle, Search, Filter } from '../../components/ui/Icons';

interface RiskComplianceProps {
    view?: 'overview' | 'compliance' | 'human-risk' | 'residual-risk';
}

const calculateCost = (credits: number) => credits * 0.0010;

export const RiskComplianceView: React.FC<RiskComplianceProps> = ({ view = 'overview' }) => {
    const [timeRange, setTimeRange] = useState('30D');

    // --- SUB-VIEWS ---

    const renderCompliance = () => (
        <div className="space-y-8 animate-slide-up">
            {/* Main Metric */}
            <div className="ui-card p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div>
                    <h3 className="text-stone-500 mb-2 text-xs uppercase tracking-wider font-bold">Autonomous Compliance Rate™</h3>
                    <div className="flex items-baseline gap-3">
                        <span className="text-6xl font-mono text-stone-900 tracking-tighter">96.8%</span>
                        <span className="text-emerald-500 text-sm font-bold bg-emerald-50 px-2 py-1 rounded border border-emerald-100">↑ 1.2%</span>
                    </div>
                    <p className="text-stone-500 text-sm mt-4 leading-relaxed">
                        Percentage of governed events resolved within policy, without human intervention.
                    </p>
                </div>
                <div className="md:col-span-2 h-32 flex items-end justify-between gap-1">
                    {[92, 93, 91, 94, 95, 96, 96.8, 97, 96.5, 97.2, 96.8].map((val, i) => (
                        <div key={i} className="w-full bg-stone-50 rounded-t hover:bg-stone-100 transition-colors relative group h-full flex items-end">
                            <div 
                                className="w-full bg-stone-900 rounded-t transition-all mx-0.5 shadow-lg group-hover:bg-armonyco-gold" 
                                style={{ height: `${(val - 80) * 4}%` }} 
                            ></div>
                             <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity rounded whitespace-nowrap z-10 font-mono">
                                {val}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Compliance Log Table */}
            <div className="ui-card p-0">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <h3 className="text-stone-900 font-medium flex items-center gap-2">
                        <Shield size={16} className="text-emerald-500" /> Recent Autonomous Decisions
                    </h3>
                    <div className="flex gap-2 text-xs">
                        <button className="ui-btn-secondary py-1.5 px-3 text-xs">Export Log</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white text-stone-500 font-medium border-b border-stone-100 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Event ID</th>
                                <th className="px-6 py-4">Timestamp</th>
                                <th className="px-6 py-4">Policy Applied</th>
                                <th className="px-6 py-4">Agent</th>
                                <th className="px-6 py-4">Verdict</th>
                                <th className="px-6 py-4 text-right">Credits</th>
                                <th className="px-6 py-4 text-right">Cost (€)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 font-mono text-xs">
                            {[
                                { id: 'EVT-90021', time: '10:42:05', policy: 'POL-INV-MATCH', agent: 'LARA', verdict: 'ALLOW', conf: '99.9%', credits: 0.420 },
                                { id: 'EVT-90022', time: '10:41:55', policy: 'POL-GUEST-ID', agent: 'JAMES', verdict: 'DENY', conf: '100%', credits: 1.100 },
                                { id: 'EVT-90023', time: '10:41:12', policy: 'POL-RATE-LIMIT', agent: 'ELON', verdict: 'ALLOW', conf: '98.5%', credits: 0.230 },
                                { id: 'EVT-90024', time: '10:40:48', policy: 'POL-CHECKOUT-TIME', agent: 'JAMES', verdict: 'MODIFY', conf: '95.0%', credits: 0.890 },
                                { id: 'EVT-90025', time: '10:38:22', policy: 'POL-MAINT-COST', agent: 'ELON', verdict: 'ALLOW', conf: '99.2%', credits: 1.200 },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4 text-stone-900 font-medium">{row.id}</td>
                                    <td className="px-6 py-4 text-stone-500">{row.time}</td>
                                    <td className="px-6 py-4 text-stone-600 font-sans">{row.policy}</td>
                                    <td className="px-6 py-4 text-stone-500">{row.agent}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                                            row.verdict === 'ALLOW' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                            row.verdict === 'DENY' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>{row.verdict}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-stone-500">{row.credits.toFixed(3)}</td>
                                    <td className="px-6 py-4 text-right text-stone-900 font-bold">€{calculateCost(row.credits).toFixed(4)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderHumanRisk = () => (
        <div className="space-y-8 animate-slide-up">
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="ui-card p-8 relative overflow-hidden group border-red-100">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                        <AlertTriangle className="w-32 h-32 text-red-500" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-red-50 rounded-lg text-red-500"><AlertTriangle size={20} /></div>
                        <h3 className="text-stone-900 font-medium">Human Risk Exposure</h3>
                    </div>
                    <div className="text-5xl font-mono text-red-600 mb-2">3.2%</div>
                    <p className="text-stone-500 text-sm mt-4">The fraction of critical operations still dependent on human judgment.</p>
                </div>

                <div className="ui-card p-8 flex flex-col justify-center">
                    <h3 className="text-stone-500 text-xs uppercase tracking-wider mb-6 font-bold">Top Intervention Reasons</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-stone-600 font-medium">
                                <span>Manual Price Override</span>
                                <span>42%</span>
                            </div>
                            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-red-500 w-[42%] h-full rounded-full shadow-sm"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-stone-600 font-medium">
                                <span>Unstructured PO Entry</span>
                                <span>28%</span>
                            </div>
                            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-amber-500 w-[28%] h-full rounded-full shadow-sm"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-stone-600 font-medium">
                                <span>Guest Refund Exception</span>
                                <span>15%</span>
                            </div>
                            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                                <div className="bg-stone-400 w-[15%] h-full rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Intervention Log */}
            <div className="ui-card p-0">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <h3 className="text-stone-900 font-medium flex items-center gap-2">
                        <User size={16} className="text-stone-400" /> Human Intervention Log
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white text-stone-500 font-medium border-b border-stone-100 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Event ID</th>
                                <th className="px-6 py-4">Time</th>
                                <th className="px-6 py-4">Actor</th>
                                <th className="px-6 py-4">Reason Code</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Risk Level</th>
                                <th className="px-6 py-4 text-right">Credits</th>
                                <th className="px-6 py-4 text-right">Cost (€)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 font-mono text-xs">
                             {[
                                { id: 'EVT-90018', time: '10:15:00', actor: 'Marco Verratti', reason: 'PRICE_OVERRIDE', action: 'Modified Quote', risk: 'HIGH', credits: 1.500 },
                                { id: 'EVT-90012', time: '09:42:10', actor: 'Sarah Chen', reason: 'REFUND_EXCEPTION', action: 'Approved Refund', risk: 'MEDIUM', credits: 0.800 },
                                { id: 'EVT-90005', time: '09:10:33', actor: 'Marco Verratti', reason: 'DOC_MISSING', action: 'Bypassed Check', risk: 'HIGH', credits: 0.450 },
                                { id: 'EVT-89998', time: '08:55:00', actor: 'David Miller', reason: 'MAINT_SCHED', action: 'Manual Dispatch', risk: 'LOW', credits: 0.200 },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4 text-stone-900">{row.id}</td>
                                    <td className="px-6 py-4 text-stone-500">{row.time}</td>
                                    <td className="px-6 py-4 font-sans text-stone-700">{row.actor}</td>
                                    <td className="px-6 py-4 text-stone-500">{row.reason}</td>
                                    <td className="px-6 py-4 text-stone-600">{row.action}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                                            row.risk === 'HIGH' ? 'bg-red-50 text-red-600 border border-red-100' : 
                                            row.risk === 'MEDIUM' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-stone-100 text-stone-500'
                                        }`}>{row.risk}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-stone-500">{row.credits.toFixed(3)}</td>
                                    <td className="px-6 py-4 text-right text-stone-900 font-bold">€{calculateCost(row.credits).toFixed(4)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const renderResidualRisk = () => (
         <div className="space-y-8 animate-slide-up">
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="ui-card p-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                        <Activity className="w-32 h-32 text-amber-500" />
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-500"><Activity size={20} /></div>
                        <h3 className="text-stone-900 font-medium">Residual Risk Rate</h3>
                    </div>
                    <div className="text-5xl font-mono text-amber-500 mb-2">1.8%</div>
                    <p className="text-stone-500 text-sm mt-4">Events and communications happening outside the governance perimeter.</p>
                </div>

                <div className="ui-card p-8 flex flex-col justify-center">
                    <p className="text-stone-600 italic text-lg leading-relaxed mb-6 border-l-2 border-armonyco-gold pl-4">
                        "Residual Risk is the metric that tells the truth about maturity—because it measures what you cannot yet control."
                    </p>
                    <div className="flex gap-4">
                        <div className="text-center p-3 bg-stone-50 rounded border border-stone-100 flex-1">
                            <span className="block text-2xl font-mono text-stone-900">421</span>
                            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Ungoverned Signals</span>
                        </div>
                        <div className="text-center p-3 bg-stone-50 rounded border border-stone-100 flex-1">
                            <span className="block text-2xl font-mono text-stone-900">12</span>
                            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Shadow Channels</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ungoverned Stream */}
            <div className="ui-card p-0">
                <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <h3 className="text-stone-900 font-medium flex items-center gap-2">
                        <XCircle size={16} className="text-amber-500" /> Ungoverned Signal Discovery
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white text-stone-500 font-medium border-b border-stone-100 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Trace ID</th>
                                <th className="px-6 py-4">Detected Via</th>
                                <th className="px-6 py-4">Content Snippet</th>
                                <th className="px-6 py-4">Likely Category</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4 text-right">Credits</th>
                                <th className="px-6 py-4 text-right">Cost (€)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 font-mono text-xs">
                             {[
                                { id: 'TRC-10293', source: 'WhatsApp (Personal)', content: '"Can I pay cash upon arrival?"', category: 'Shadow Revenue', action: 'Flagged', credits: 0.150 },
                                { id: 'TRC-10294', source: 'Direct Email', content: '"Attached is the invoice for plumbing"', category: 'Shadow Procurement', action: 'Flagged', credits: 0.400 },
                                { id: 'TRC-10295', source: 'SMS', content: '"Code is 1234, door is stuck"', category: 'Unlogged Maint.', action: 'Flagged', credits: 0.100 },
                                { id: 'TRC-10296', source: 'Gmail', content: '"Refund processed manually"', category: 'Fin. Compliance', action: 'Flagged', credits: 0.250 },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-4 text-stone-400">{row.id}</td>
                                    <td className="px-6 py-4 text-stone-500">{row.source}</td>
                                    <td className="px-6 py-4 text-stone-900 italic font-serif">"{row.content.replace(/"/g, '')}"</td>
                                    <td className="px-6 py-4">
                                        <span className="text-amber-600 bg-amber-50 border border-amber-100 px-2 py-1 rounded text-[10px] font-bold uppercase">{row.category}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-stone-400 hover:text-stone-900 underline">Investigate</button>
                                    </td>
                                    <td className="px-6 py-4 text-right text-stone-500">{row.credits.toFixed(3)}</td>
                                    <td className="px-6 py-4 text-right text-stone-900 font-bold">€{calculateCost(row.credits).toFixed(4)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const getHeader = () => {
        switch(view) {
            case 'compliance': return 'Autonomous Compliance Rate™';
            case 'human-risk': return 'Human Risk Exposure';
            case 'residual-risk': return 'Residual Risk Rate';
            default: return 'Risk & Compliance';
        }
    };

    return (
     <div className="p-8 animate-fade-in">
        <header className="mb-8">
            <h1 className="text-2xl text-stone-900 font-light">{getHeader()}</h1>
            <p className="text-stone-500 text-sm">Automated Compliance & Risk Exposure</p>
        </header>

        {/* Filter Bar */}
        <div className="flex gap-2 mb-8">
            {['24H', '7D', '30D', '90D', 'YTD'].map(range => (
                <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all transform hover:-translate-y-0.5 ${
                        timeRange === range 
                        ? 'ui-btn-primary' 
                        : 'ui-btn-secondary'
                    }`}
                >
                    {range}
                </button>
            ))}
        </div>

        {/* View Switcher for Overview Mode (Optional if Overview is used as a dashboard) */}
        {view === 'overview' && (
             <div className="grid grid-cols-1 gap-12">
                {renderCompliance()}
                {renderHumanRisk()}
                {renderResidualRisk()}
             </div>
        )}

        {/* Dedicated Views */}
        {view === 'compliance' && renderCompliance()}
        {view === 'human-risk' && renderHumanRisk()}
        {view === 'residual-risk' && renderResidualRisk()}

     </div>
    );
}
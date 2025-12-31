import React from 'react';
import { CheckCircle, Mail, Phone, Plus, Search } from 'lucide-react';

export const SupportView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4 border-b border-stone-200 pb-6">
        <div>
           <h1 className="text-4xl font-light text-stone-900 mb-2">Support Center</h1>
           <p className="text-stone-500">Get help with your orchestration layer. We are here 24/7.</p>
        </div>
        <button className="ui-btn-primary py-2.5 px-5 flex items-center gap-2 text-sm">
           <Plus size={16} /> Open New Ticket
        </button>
      </div>

      {/* Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         
         {/* System Status */}
         <div className="ui-card p-6">
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500">
                  <CheckCircle size={20} />
               </div>
               <span className="bg-stone-100 text-stone-500 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  System Status
               </span>
            </div>
            <h3 className="text-2xl font-light text-stone-900 mb-1">Operational</h3>
            <p className="text-stone-400 text-xs">All services running normally.</p>
         </div>

         {/* Email Support */}
         <div className="ui-card p-6">
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-stone-50 rounded-lg flex items-center justify-center text-stone-400">
                <Mail size={20} />
                </div>
            </div>
            <h3 className="text-2xl font-light text-stone-900 mb-1">Email Support</h3>
            <p className="text-stone-400 text-xs">support@armonyco.ai • &lt; 2h Response</p>
         </div>

         {/* Emergency Line */}
         <div className="ui-card-dark p-6">
            <div className="flex justify-between items-start mb-4">
               <div className="w-10 h-10 bg-stone-800 rounded-lg flex items-center justify-center text-armonyco-gold">
                  <Phone size={20} />
               </div>
               <span className="bg-stone-800 border border-stone-700 text-armonyco-gold text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  Premium
               </span>
            </div>
            <h3 className="text-2xl font-light text-white mb-1">Emergency</h3>
            <p className="text-stone-400 text-xs">+1 (800) 123-4567 • Critical Incidents Only</p>
         </div>
      </div>

      {/* Ticket Table */}
      <div className="ui-card p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
            <h3 className="text-sm font-medium text-stone-900 uppercase tracking-wider">Recent Tickets</h3>
            <div className="flex gap-4 text-xs font-medium">
                <button className="text-stone-900 border-b-2 border-stone-900 pb-0.5">Open (2)</button>
                <button className="text-stone-400 hover:text-stone-900 pb-0.5 transition-colors">Closed</button>
            </div>
        </div>
        <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-white text-stone-500 uppercase text-xs font-medium tracking-wider border-b border-stone-100">
                <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Subject</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Last Update</th>
                    <th className="px-6 py-4 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
                <tr className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 text-stone-500 font-mono">#TK-9921</td>
                    <td className="px-6 py-4">
                        <div className="text-stone-900 font-medium text-sm">Webhook timeout on Check-in</div>
                        <div className="text-stone-500 mt-0.5">Integration • High Priority</div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wide">
                           <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> In Progress
                        </span>
                    </td>
                    <td className="px-6 py-4 text-stone-400">25 mins ago</td>
                    <td className="px-6 py-4 text-right">
                        <button className="text-stone-900 font-medium hover:underline">View</button>
                    </td>
                </tr>
                <tr className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4 text-stone-500 font-mono">#TK-9882</td>
                    <td className="px-6 py-4">
                        <div className="text-stone-900 font-medium text-sm">Billing inquiry for Dec 2025</div>
                        <div className="text-stone-500 mt-0.5">Billing • Low Priority</div>
                    </td>
                    <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200 uppercase tracking-wide">
                           Open
                        </span>
                    </td>
                    <td className="px-6 py-4 text-stone-400">1 day ago</td>
                    <td className="px-6 py-4 text-right">
                        <button className="text-stone-900 font-medium hover:underline">View</button>
                    </td>
                </tr>
            </tbody>
        </table>
      </div>

    </div>
  );
};
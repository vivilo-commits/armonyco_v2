import React from 'react';
import { Search, ChevronRight, FileText, Code, Settings, Zap, Database, CreditCard } from '../../components/ui/Icons';

export const DocumentationView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-light text-stone-900 mb-4">Documentation</h1>
        <p className="text-lg text-stone-500 mb-8">
          Comprehensive guides, API references, and playbooks to master the Armonyco orchestration layer.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        
        {/* Card 1 */}
        <div className="ui-card p-6 cursor-pointer group">
          <div className="w-10 h-10 bg-stone-50 rounded flex items-center justify-center mb-4 text-stone-400 group-hover:text-armonyco-gold transition-colors">
            <Zap size={20} />
          </div>
          <h3 className="text-lg font-medium text-stone-900 mb-2">Quick Start</h3>
          <p className="text-stone-500 text-sm mb-6 h-10">Deploy your first agent in under 5 minutes.</p>
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-stone-400 group-hover:text-stone-900 transition-colors">
            Read Guide <ChevronRight size={14} className="ml-1" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="ui-card p-6 cursor-pointer group">
          <div className="w-10 h-10 bg-stone-50 rounded flex items-center justify-center mb-4 text-stone-400 group-hover:text-armonyco-gold transition-colors">
            <Code size={20} />
          </div>
          <h3 className="text-lg font-medium text-stone-900 mb-2">API Reference</h3>
          <p className="text-stone-500 text-sm mb-6 h-10">Full documentation of the Armonyco Event Model (AEM).</p>
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-stone-400 group-hover:text-stone-900 transition-colors">
            Read Guide <ChevronRight size={14} className="ml-1" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="ui-card p-6 cursor-pointer group">
          <div className="w-10 h-10 bg-stone-50 rounded flex items-center justify-center mb-4 text-stone-400 group-hover:text-armonyco-gold transition-colors">
            <Database size={20} />
          </div>
          <h3 className="text-lg font-medium text-stone-900 mb-2">Core Processes</h3>
          <p className="text-stone-500 text-sm mb-6 h-10">Detailed playbooks for the 12 standard hospitality flows.</p>
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-stone-400 group-hover:text-stone-900 transition-colors">
            Read Guide <ChevronRight size={14} className="ml-1" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="ui-card p-6 cursor-pointer group">
          <div className="w-10 h-10 bg-stone-50 rounded flex items-center justify-center mb-4 text-stone-400 group-hover:text-armonyco-gold transition-colors">
            <Settings size={20} />
          </div>
          <h3 className="text-lg font-medium text-stone-900 mb-2">Agent Configuration</h3>
          <p className="text-stone-500 text-sm mb-6 h-10">Customize tone, budgets, and escalation rules.</p>
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-stone-400 group-hover:text-stone-900 transition-colors">
            Read Guide <ChevronRight size={14} className="ml-1" />
          </div>
        </div>

        {/* Card 5 */}
        <div className="ui-card p-6 cursor-pointer group">
          <div className="w-10 h-10 bg-stone-50 rounded flex items-center justify-center mb-4 text-stone-400 group-hover:text-armonyco-gold transition-colors">
            <Code size={20} />
          </div>
          <h3 className="text-lg font-medium text-stone-900 mb-2">Webhooks & MCP</h3>
          <p className="text-stone-500 text-sm mb-6 h-10">Connect external tools like n8n and Make.</p>
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-stone-400 group-hover:text-stone-900 transition-colors">
            Read Guide <ChevronRight size={14} className="ml-1" />
          </div>
        </div>

        {/* Card 6 */}
        <div className="ui-card p-6 cursor-pointer group">
          <div className="w-10 h-10 bg-stone-50 rounded flex items-center justify-center mb-4 text-stone-400 group-hover:text-armonyco-gold transition-colors">
            <CreditCard size={20} />
          </div>
          <h3 className="text-lg font-medium text-stone-900 mb-2">Billing & Usage</h3>
          <p className="text-stone-500 text-sm mb-6 h-10">Understand credits, usage volume, and billing cycles.</p>
          <div className="flex items-center text-xs font-bold uppercase tracking-wider text-stone-400 group-hover:text-stone-900 transition-colors">
            Read Guide <ChevronRight size={14} className="ml-1" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Changelog */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-stone-900 font-light">Latest Changelog</h2>
            <span className="px-2 py-1 bg-stone-100 text-stone-600 rounded text-xs font-mono font-medium">v2.4.0</span>
          </div>
          
          <div className="space-y-8 border-l border-stone-200 ml-3 pl-8 py-2">
            <div className="relative">
              <span className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full bg-stone-300 border-2 border-white"></span>
              <div className="text-xs font-mono text-stone-400 mb-1">Dec 24</div>
              <h4 className="text-stone-900 font-medium text-sm mb-1">New "Billing" Agent Role</h4>
              <p className="text-stone-500 text-sm">Added support for dedicated finance agents to handle invoicing.</p>
            </div>
            
            <div className="relative">
              <span className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full bg-stone-300 border-2 border-white"></span>
              <div className="text-xs font-mono text-stone-400 mb-1">Dec 20</div>
              <h4 className="text-stone-900 font-medium text-sm mb-1">AEM v2 Event Schema</h4>
              <p className="text-stone-500 text-sm">Standardized payload structure for "ReservationModified" events.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full bg-stone-300 border-2 border-white"></span>
              <div className="text-xs font-mono text-stone-400 mb-1">Dec 15</div>
              <h4 className="text-stone-900 font-medium text-sm mb-1">Slack Integration Update</h4>
              <p className="text-stone-500 text-sm">Interactive buttons are now supported in escalation alerts.</p>
            </div>
          </div>
        </div>

        {/* cURL Reference */}
        <div>
          <h2 className="text-2xl text-stone-900 font-light mb-6">cURL Example</h2>
          <div className="ui-card-dark p-6 overflow-hidden">
             <div className="flex gap-1.5 mb-4">
               <div className="w-2.5 h-2.5 rounded-full bg-stone-600"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-stone-600"></div>
               <div className="w-2.5 h-2.5 rounded-full bg-stone-600"></div>
             </div>
             <pre className="font-mono text-xs text-stone-300 leading-relaxed overflow-x-auto">
{`curl -X POST \\
https://api.armonyco.ai/v1/trigger \\
-H 'Authorization: Bearer sk_live_...' \\
-d '{
  "event": "guest_checkin",
  "data": { ... }
}'`}
             </pre>
          </div>
          <button className="mt-4 text-armonyco-gold font-bold text-xs uppercase tracking-wider hover:underline">
             View Full Reference →
          </button>
        </div>
      </div>
    </div>
  );
};
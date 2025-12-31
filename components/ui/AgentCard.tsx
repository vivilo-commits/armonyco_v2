import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface AgentCardProps {
  name: string;
  role: string;
  metricLabel: string;
  metricValue: string;
  status: string;
  initial: string;
  icon: React.ElementType; 
  colorClass: string; 
  bgClass?: string; 
  hoverBorderClass?: string;
  borderClass?: string; 
}

export const AgentCard: React.FC<AgentCardProps> = ({
  name,
  role,
  metricLabel,
  metricValue,
  status,
  initial,
  icon: Icon,
  colorClass,
  borderClass = 'border-stone-100'
}) => {
  return (
    <div className="
        relative 
        flex-1 
        h-[340px] 
        bg-white
        rounded-[24px] 
        border border-stone-200 
        shadow-sm 
        hover:shadow-xl 
        hover:border-armonyco-gold/50
        transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] 
        group 
        overflow-hidden
        cursor-default
        hover:flex-[3] 
        min-w-[100px]
    ">
      
      {/* 
         IDLE STATE CONTENT 
      */}
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-10 transition-all duration-300 group-hover:opacity-0 group-hover:-translate-y-4">
         
         {/* Icon Container */}
         <div className={`p-4 rounded-full bg-stone-50 border border-stone-100 shadow-sm mb-6 group-hover:scale-90 transition-transform`}>
            <Icon size={24} className={`${colorClass}`} />
         </div>
         
         {/* Name - HORIZONTAL & CENTERED */}
         <div className="flex flex-col items-center gap-1 px-2">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-900 text-center leading-tight">
                {name.split(' ')[0]}
            </span>
            <span className="text-[9px] font-mono text-stone-400 text-center">
                {role.split(' ')[0]}
            </span>
         </div>
         
         {/* Status Dot at Bottom */}
         <div className="mt-auto mb-8 flex flex-col items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${colorClass.replace('text-', 'bg-')} opacity-50`}></div>
         </div>
      </div>

      {/* 
         EXPANDED STATE CONTENT
      */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 flex flex-col p-8 bg-stone-900 translate-y-4 group-hover:translate-y-0">
          
          {/* Top Header */}
          <div className="flex justify-between items-start mb-auto">
              <div className={`p-3 rounded-full bg-white/10 text-white`}>
                  <Icon size={32} className={`${colorClass.replace('text-', 'text-')}`} />
              </div>
              <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${colorClass.replace('text-', 'bg-')} animate-pulse`}></span>
                    <span className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">{status}</span>
                  </div>
              </div>
          </div>

          {/* Main Info */}
          <div className="mt-8">
              <h3 className="text-3xl font-light text-white mb-1 leading-tight">{name}</h3>
              <p className="text-xs text-armonyco-gold font-mono uppercase tracking-wider mb-6">{role}</p>
              
              {/* Metric Box */}
              <div className="bg-white/5 rounded-xl p-5 border border-white/10 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest font-bold block mb-1">{metricLabel}</span>
                    <span className="text-3xl font-mono text-white tracking-tighter">{metricValue}</span>
                  </div>
                  <MoreHorizontal size={20} className="text-stone-600" />
              </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-armonyco-gold/10 to-transparent rounded-bl-full pointer-events-none"></div>
      </div>
    </div>
  );
};
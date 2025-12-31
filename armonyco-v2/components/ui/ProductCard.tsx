import React from 'react';
import { ProductModule } from '../../types';
import { Settings, CheckCircle, MessageCircle } from 'lucide-react';
import { ActionToggle } from './ActionToggle';

interface ProductCardProps {
  module: ProductModule;
  onToggle: (id: string) => void;
  onConfigure: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ module, onToggle, onConfigure }) => {
  const isActive = module.isActive;

  return (
    <div 
      id={module.id} 
      className={`flex flex-col justify-between h-full transition-all duration-500 rounded-2xl border shadow-sm overflow-hidden ${
        isActive 
          ? 'bg-stone-900 border-stone-800 text-white' 
          : 'bg-white border-stone-200 text-stone-900'
      }`}
    >
      <div className="p-6 flex flex-col h-full">
          {/* Header Row */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              {/* Icon Box */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                isActive 
                  ? 'bg-stone-800 border-stone-700 text-white' 
                  : 'bg-stone-50 border-stone-100 text-stone-400'
              }`}>
                 <span className="font-mono text-xs font-bold">{module.code.split('-')[1]}</span>
              </div>
              
              <div>
                <h3 className={`font-medium text-lg leading-tight mb-1 ${isActive ? 'text-white' : 'text-stone-900'}`}>
                  {module.name}
                </h3>
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-stone-300'}`}></div>
                   <span className={`text-[10px] uppercase tracking-widest font-bold ${isActive ? 'text-stone-400' : 'text-stone-400'}`}>
                     {isActive ? 'Active' : 'Paused'}
                   </span>
                </div>
              </div>
            </div>

            {/* Action Toggle - Controlled */}
            <div className="relative z-20">
                <ActionToggle 
                    type="toggle"
                    isActive={isActive}
                    onToggle={() => onToggle(module.id)}
                />
            </div>
          </div>

          {/* Role Tag */}
          <div className="mb-6">
            <span className={`inline-block px-2.5 py-1 rounded-md text-[9px] font-mono uppercase tracking-widest border ${
               isActive 
                 ? 'bg-stone-800 border-stone-700 text-stone-400' 
                 : 'bg-stone-100 border-stone-200 text-stone-500'
            }`}>
              {module.category === 'PLAYBOOK' ? 'Incident Playbook' : `Core — ${module.category}`}
            </span>
          </div>

          {/* Description Body */}
          <div className={`text-sm mb-8 flex-grow leading-relaxed ${isActive ? 'text-stone-300' : 'text-stone-600'}`}>
            <p className="mb-4 font-medium">{module.description}</p>
            
            {/* Accordion-ish summary */}
            <div className={`text-xs space-y-3 pl-4 border-l ${isActive ? 'border-stone-700' : 'border-stone-200'}`}>
                 <div>
                    <span className={`uppercase text-[9px] tracking-widest font-bold block mb-1 ${isActive ? 'text-stone-500' : 'text-stone-400'}`}>What</span>
                    <p className="opacity-90">{module.what}</p>
                 </div>
                 <div>
                    <span className={`uppercase text-[9px] tracking-widest font-bold block mb-1 ${isActive ? 'text-stone-500' : 'text-stone-400'}`}>How</span>
                    <p className="opacity-90">{module.how}</p>
                 </div>
            </div>
          </div>

          {/* Footer Row */}
          <div className={`pt-4 border-t flex justify-between items-center mt-auto ${isActive ? 'border-stone-800' : 'border-stone-100'}`}>
            <div className="flex items-center gap-2">
                {module.requiresExternal ? (
                    <div className={`flex items-center gap-1.5 ${isActive ? 'text-stone-500' : 'text-stone-400'}`}>
                       <MessageCircle size={14} />
                       <span className="text-[10px] font-medium">WhatsApp</span>
                    </div>
                ) : (
                    <div className={`flex items-center gap-1.5 ${isActive ? 'text-stone-500' : 'text-stone-300'}`}>
                       <CheckCircle size={14} />
                       <span className="text-[10px] font-medium">Internal</span>
                    </div>
                )}
            </div>

            <button 
               onClick={() => onConfigure(module.id)}
               className={`flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold hover:underline transition-all hover:scale-105 ${isActive ? 'text-white' : 'text-stone-900'}`}
            >
               <Settings size={12} /> Configure
            </button>
          </div>
      </div>
    </div>
  );
};
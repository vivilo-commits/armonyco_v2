import React, { useState } from 'react';
import { Package, X } from '../../components/ui/Icons';
import { ProductCard } from '../../components/ui/ProductCard';
import { AiTeamStrip } from '../../components/ui/AiTeamStrip';
import { productModules } from '../../data/modules';

interface ProductsViewProps {
    block: 'GUEST' | 'REVENUE' | 'OPS' | 'PLAYBOOK';
}

export const ProductsView: React.FC<ProductsViewProps> = ({ block }) => {
  // Local state for module activation (mocking backend persistance)
  const [modules, setModules] = useState(productModules);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingModuleId, setPendingModuleId] = useState<string | null>(null);

  const toggleModule = (id: string) => {
    const targetModule = modules.find(m => m.id === id);
    if (!targetModule) return;

    if (targetModule.isActive) {
        // If Active -> Pause immediately
        setModules(modules.map(m => m.id === id ? { ...m, isActive: false } : m));
    } else {
        // If Paused -> Confirm before Activate
        setPendingModuleId(id);
        setShowConfirmModal(true);
    }
  };

  const confirmActivation = () => {
      if (pendingModuleId) {
          setModules(modules.map(m => m.id === pendingModuleId ? { ...m, isActive: true } : m));
      }
      setShowConfirmModal(false);
      setPendingModuleId(null);
  };

  const cancelActivation = () => {
      setShowConfirmModal(false);
      setPendingModuleId(null);
  };

  const handleConfigure = (id: string) => {
    console.log(`Configure module ${id}`);
    // In a real app, this would open a modal/drawer
  };

  // Filter by category (block) and search term
  const filteredModules = modules.filter(m => {
      const matchBlock = m.category === block;
      const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.code.toLowerCase().includes(searchTerm.toLowerCase());
      return matchBlock && matchSearch;
  });

  const getBlockInfo = () => {
      switch(block) {
          case 'GUEST': return { 
              title: 'Guest Experience', 
              sub: 'Governed guest execution across the highest-friction moments: pre-arrival, access, self-resolution, and structured issue intake.' 
          };
          case 'REVENUE': return { 
              title: 'Revenue Generation', 
              sub: 'Governed monetization of exceptions and opportunities — captured without creating operational chaos.' 
          };
          case 'OPS': return { 
              title: 'Operational Efficiency', 
              sub: 'Governed triage and closure for real-world operations — keeping outcomes provable and escalations bounded.' 
          };
          case 'PLAYBOOK': return { 
              title: 'Incident Response', 
              sub: 'Policy-driven, playbook-standardized incident handling: diagnose, resolve, escalate with context, and close the loop.' 
          };
          default: return { title: 'Products', sub: '' };
      }
  };

  const info = getBlockInfo();

  return (
    <div className="p-8">
      <header className="mb-10 border-b border-stone-200 pb-8">
        <div className="flex flex-col md:flex-row justify-between md:items-start gap-8 mb-8">
            <div className="flex-1 max-w-3xl">
               <div className="flex items-center gap-3 mb-2">
                    <Package className="text-armonyco-gold w-6 h-6" />
                    <h1 className="text-2xl text-stone-900 font-light">{info.title}</h1>
                </div>
                <p className="text-stone-500 text-sm leading-relaxed">{info.sub}</p>
            </div>
        </div>
        
        {/* Team Context Strip - Full Width */}
        <AiTeamStrip />
      </header>

      <div className="space-y-12">
        {filteredModules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredModules.map(m => (
                    <ProductCard 
                        key={m.id} 
                        module={m} 
                        onToggle={toggleModule} 
                        onConfigure={handleConfigure}
                    />
                ))}
            </div>
        ) : (
            <div className="text-center py-24 text-stone-400">
                <p>No modules found matching your search.</p>
            </div>
        )}
      </div>

      {/* Activation Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-stone-200">
                <div className="p-6">
                    <h3 className="text-lg font-medium text-stone-900 mb-4">Activate product?</h3>
                    <div className="space-y-4 text-sm text-stone-600">
                        <p>You are activating this product. Once active, operations may generate usage costs based on credits.</p>
                        <p>Are you sure you want to continue?</p>
                        <p className="text-xs text-stone-400 pt-2 border-t border-stone-100">
                            €0.0010 per Credit
                        </p>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 flex justify-end gap-3">
                    <button 
                        onClick={cancelActivation}
                        className="px-6 py-2.5 bg-white border border-stone-200 text-stone-900 text-xs font-bold uppercase tracking-wider rounded hover:bg-stone-50 hover:border-stone-300 transition-colors"
                    >
                        No
                    </button>
                    <button 
                        onClick={confirmActivation}
                        className="px-6 py-2.5 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-stone-800 transition-colors shadow-sm"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
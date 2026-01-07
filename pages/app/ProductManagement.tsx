import React, { useState, useCallback } from 'react';
import { Package, Search, Filter, CheckCircle, XCircle, Pause, Play, ChevronRight, Building, Home, Zap, Shield, Activity, Loader } from '../../components/ui/Icons';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useProducts } from '../../src/hooks/useProducts';
import { useUserProfile } from '../../src/hooks/useAuth';
import { units, unitGroups, Unit, UnitGroup } from '../../data/portfolio';
import { ProductModule } from '../../src/types';
import { productService } from '../../src/services/product.service';

export const ProductManagement: React.FC = () => {
    const { data: modules, status: modulesStatus } = useProducts();
    const { data: userProfile } = useUserProfile();
    // Governance Perimeter Sync Trigger


    const [portfolioLevel, setPortfolioLevel] = useState<'GLOBAL' | 'GROUP' | 'UNIT'>('GLOBAL');
    const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [selectedModule, setSelectedModule] = useState<ProductModule | null>(null);
    const [showActivationModal, setShowActivationModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Reload products after changes
    const reloadProducts = useCallback(() => {
        window.location.reload(); // Simple reload for now
    }, []);

    const handleActivateProduct = async () => {
        if (!selectedModule) return;
        setIsSaving(true);
        try {
            await productService.purchaseModule(selectedModule.id, selectedModule.creditCost || 0);
            setShowActivationModal(false);
            reloadProducts();
        } catch (error) {
            console.error('Failed to activate:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handlePauseResume = async () => {
        if (!selectedModule) return;
        setIsSaving(true);
        try {
            await productService.toggleModule(selectedModule.id);
            setShowActivationModal(false);
            reloadProducts();
        } catch (error) {
            console.error('Failed to toggle:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeactivate = async () => {
        if (!selectedModule) return;
        setIsSaving(true);
        try {
            await productService.deactivateModule(selectedModule.id);
            setShowActivationModal(false);
            reloadProducts();
        } catch (error) {
            console.error('Failed to deactivate:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredModules = modules?.filter(m => {
        const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
        return matchesSearch && matchesCategory;
    }) || [];

    const categories = ['ALL', 'GUEST', 'REVENUE', 'OPS', 'PLAYBOOK'];

    const getStatusColor = (module: ProductModule) => {
        if (!module.isPurchased) return 'text-zinc-600';
        return module.isPaused ? 'text-amber-500' : 'text-emerald-500';
    };

    const handleManageActivation = (module: ProductModule) => {
        setSelectedModule(module);
        setShowActivationModal(true);
    };

    return (
        <div className="p-8 animate-fade-in flex flex-col h-full bg-black text-white">
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-start shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Operational Services</h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">Il registro definitivo delle routine operative governate sopra i tuoi asset istituzionali.</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] font-black mb-1">Operational Balance</p>
                    <p className="text-2xl font-numbers text-[var(--color-brand-primary)]">
                        {Math.floor(userProfile?.credits || 0).toLocaleString('de-DE')}
                        <span className="text-[10px] opacity-40 ml-2 font-numbers uppercase tracking-widest italic">ArmoCredits©</span>
                    </p>
                </div>
            </header>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by product name or code..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-[var(--color-brand-accent)] outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Products Table */}
            <Card variant="dark" padding="none" className="flex-1 overflow-hidden border-white/5 flex flex-col">
                <div className="overflow-x-auto overflow-y-auto scrollbar-hide">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02] sticky top-0 z-20 backdrop-blur-md">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Service Routine</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Category</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Governance</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Productivity</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Human Time</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Runtime</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredModules.map((module) => (
                                <tr key={module.id} className="hover:bg-white/[0.03] transition-all duration-200 group">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white tracking-tight group-hover:text-[var(--color-brand-accent)] transition-colors">
                                                {module.name}
                                            </span>
                                            <span className="text-[10px] font-mono text-zinc-600 uppercase mt-0.5">{module.code}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] px-2 py-1 bg-white/5 rounded border border-white/10 text-zinc-400 uppercase font-bold tracking-widest">
                                            {module.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-emerald-500 tracking-tighter italic">
                                                {module.laborReduction || "0%"}
                                            </span>
                                            <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">Labor Redux</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-white tracking-tighter italic">
                                                {module.valueGenerated || "0€/mo"}
                                            </span>
                                            <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">Value Growth</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-rose-500 tracking-tighter italic">
                                                -{module.laborReduction || "20%"}
                                            </span>
                                            <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">Saved/Unit/Mo</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-mono text-[var(--color-brand-accent)] font-bold">
                                                {module.creditCost?.toLocaleString('de-DE')}
                                            </span>
                                            <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-widest">Credits/Mo</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${getStatusColor(module)}`}>
                                            {module.isPurchased ? (
                                                module.isPaused ? (
                                                    <><Pause size={12} /> Paused</>
                                                ) : (
                                                    <><Play size={12} className="fill-current" /> Operational</>
                                                )
                                            ) : (
                                                <><Zap size={12} /> Idle</>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-[10px] font-black uppercase tracking-widest hover:text-white"
                                            onClick={() => handleManageActivation(module)}
                                        >
                                            Configure <ChevronRight size={14} className="ml-1" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* ACTIVATION MODAL */}
            <Modal
                isOpen={showActivationModal}
                onClose={() => setShowActivationModal(false)}
                title={`Manage Governance: ${selectedModule?.name}`}
                width="lg"
            >
                <div className="p-8">
                    <div className="flex items-start gap-6 mb-8 border-b border-white/5 pb-8">
                        <div className="w-16 h-16 rounded-2xl bg-[var(--color-brand-accent)]/10 flex items-center justify-center text-[var(--color-brand-accent)] shrink-0 border border-[var(--color-brand-accent)]/20 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                            <Shield size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-medium text-white mb-2">{selectedModule?.name}</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed font-light">{selectedModule?.description}</p>
                            <div className="flex gap-4 mt-4">
                                <div className="flex flex-col">
                                    <span className="text-[8px] uppercase tracking-widest text-zinc-600 font-bold mb-0.5">Category</span>
                                    <span className="text-[10px] font-black text-white/60 uppercase">{selectedModule?.category}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[8px] uppercase tracking-widest text-zinc-600 font-bold mb-0.5">Routine Code</span>
                                    <span className="text-[10px] font-mono text-white/60">{selectedModule?.code}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Global Controls */}
                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                                <Activity size={12} /> Global Perimeter Control
                            </h4>
                            <div className="flex gap-3">
                                {!selectedModule?.isPurchased ? (
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        className="!bg-emerald-500 !text-black border-0"
                                        onClick={handleActivateProduct}
                                        isLoading={isSaving}
                                    >
                                        Activate Service
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="primary"
                                            fullWidth
                                            className={selectedModule?.isPaused ? "!bg-emerald-500 !text-black border-0" : "!bg-amber-500 !text-black border-0"}
                                            onClick={handlePauseResume}
                                            isLoading={isSaving}
                                        >
                                            {selectedModule?.isPaused ? 'Resume Service' : 'Pause Service'}
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            fullWidth
                                            className="border-red-500/20 text-red-500 hover:bg-red-500/5"
                                            onClick={handleDeactivate}
                                            isLoading={isSaving}
                                        >
                                            Deactivate
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Hierarchical Controls */}
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                                    <Building size={12} /> By Unit Group
                                </h4>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                                    {unitGroups.map(group => (
                                        <div key={group.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white transition-colors uppercase tracking-tight">{group.name}</span>
                                                <span className="text-[9px] text-zinc-600 uppercase font-bold">{group.unitsCount} Units</span>
                                            </div>
                                            <div className="w-10 h-5 bg-zinc-800 rounded-full relative p-1 transition-all">
                                                <div className="absolute left-1 w-3 h-3 bg-zinc-600 rounded-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                                    <Home size={12} /> Individual Units
                                </h4>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-hide">
                                    {units.map(unit => (
                                        <div key={unit.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white truncate max-w-[120px]">{unit.name}</span>
                                                <span className="text-[9px] text-zinc-600 uppercase font-bold">{unit.groupName}</span>
                                            </div>
                                            <div className="w-10 h-5 bg-emerald-500/20 rounded-full relative p-1">
                                                <div className="absolute right-1 w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/5 flex gap-3">
                        <Button variant="ghost" fullWidth onClick={() => setShowActivationModal(false)}>Cancel</Button>
                        <Button variant="primary" fullWidth onClick={() => setShowActivationModal(false)}>Save Perimeter Settings</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

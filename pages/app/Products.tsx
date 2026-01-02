import React, { useState } from 'react';
import { Package, ShoppingCart, AlertCircle, Play, Pause, Loader } from '../../components/ui/Icons';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useProducts } from '../../src/hooks/useProducts';
import { productService } from '../../src/services/product.service';
import { useUserProfile } from '../../src/hooks/useAuth';
import { authService } from '../../src/services/auth.service';

import { ProductModule, UserProfile } from '../../src/types';

// --- TYPES ---

interface ProductsViewProps {
    block: 'GUEST' | 'REVENUE' | 'OPS' | 'PLAYBOOK';
    onNavigateToBilling: () => void;
}

interface MarketplaceCardProps {
    module: ProductModule;
    processingId: string | null;
    onAction: (id: string, type: 'PURCHASE' | 'RESUME' | 'PAUSE', cost: number) => void;
}

// --- SUB-COMPONENTS ---

/**
 * Renders a single product card with status-aware styling.
 */
const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ module, processingId, onAction }) => {
    const isPurchased = module.isPurchased;
    const isPaused = module.isPaused;
    const isProcessing = processingId === module.id;

    // Status config mapping for maintenance ease
    const statusConfig = {
        ACTIVE: {
            label: 'ACTIVE',
            cardClass: 'bg-emerald-500/[0.03] border-emerald-500/20 shadow-2zl shadow-emerald-500/5',
            overlay: null
        },
        PAUSED: {
            label: 'PAUSED',
            cardClass: 'bg-amber-500/[0.03] border-amber-500/20 shadow-amber-500/5',
            overlay: null
        },
        INACTIVE: {
            label: 'INACTIVE',
            cardClass: 'bg-red-500/[0.03] border-red-500/20 grayscale-[0.8] opacity-70',
            overlay: <div className="absolute inset-0 bg-red-950/20 z-10 pointer-events-none rounded-[inherit]" />
        }
    };

    const statusKey = !isPurchased ? 'INACTIVE' : (isPaused ? 'PAUSED' : 'ACTIVE');
    const config = statusConfig[statusKey];

    return (
        <Card className={`flex flex-col relative transition-all duration-700 h-full border ${config.cardClass}`}>
            {config.overlay}

            <div className="p-6 flex-1 flex flex-col relative z-20">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                        {config.label}
                    </span>
                    <span className="text-xs font-numbers text-zinc-600 font-bold">{module.code}</span>
                </div>

                <h3 className="text-xl font-medium text-white mb-2">{module.name}</h3>
                <p className="text-sm text-zinc-500 mb-6 flex-1 leading-relaxed">{module.description}</p>

                <div className="mt-auto">
                    {isPurchased ? (
                        !isPaused ? (
                            <Button
                                onClick={() => onAction(module.id, 'PAUSE', 0)}
                                disabled={!!processingId}
                                variant="secondary"
                                size="lg"
                                fullWidth
                                isLoading={isProcessing}
                                leftIcon={<Pause size={16} />}
                            >
                                <div className="flex justify-between items-center w-full px-1">
                                    <span className="uppercase tracking-widest text-[10px] font-black">Pause Operation</span>
                                    <span className="text-[10px] opacity-40 italic">Active</span>
                                </div>
                            </Button>
                        ) : (
                            <Button
                                onClick={() => onAction(module.id, 'RESUME', 1000)}
                                disabled={!!processingId}
                                variant="primary"
                                size="lg"
                                fullWidth
                                isLoading={isProcessing}
                                leftIcon={<Play size={16} />}
                                className="shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                            >
                                <div className="flex justify-between items-center w-full px-1">
                                    <span className="uppercase tracking-widest text-[10px] font-black">Resume Module</span>
                                    <span className="font-numbers text-xs font-black">1,000 <span className="text-[8px] opacity-60">AC</span></span>
                                </div>
                            </Button>
                        )
                    ) : (
                        <Button
                            onClick={() => onAction(module.id, 'PURCHASE', 25000)}
                            disabled={!!processingId}
                            variant="primary"
                            size="lg"
                            fullWidth
                            isLoading={isProcessing}
                            leftIcon={<ShoppingCart size={16} />}
                            className="shadow-[0_0_25px_rgba(212,175,55,0.2)]"
                        >
                            <div className="flex justify-between items-center w-full px-1">
                                <span className="uppercase tracking-widest text-[10px] font-black">Purchase Module</span>
                                <span className="font-numbers text-xs font-black">25,000 <span className="text-[8px] opacity-60">AC</span></span>
                            </div>
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};

// --- MAIN VIEW ---

export const ProductsView: React.FC<ProductsViewProps> = ({ block, onNavigateToBilling }) => {
    const { data: modules, status: modulesStatus, refetch } = useProducts();
    const { data: userProfile, refetch: refetchProfile } = useUserProfile();

    const [processingId, setProcessingId] = useState<string | null>(null);

    // Modal State
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [insufficientModalOpen, setInsufficientModalOpen] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
    const [actionType, setActionType] = useState<'PURCHASE' | 'RESUME' | 'PAUSE'>('PURCHASE');
    const [costToConfirm, setCostToConfirm] = useState(0);

    const filteredModules = modules?.filter(m => m.category === block) || [];

    const getBlockInfo = () => {
        const infoMap = {
            GUEST: { title: 'Guest Experience', sub: 'Governed guest execution across high-friction moments.' },
            REVENUE: { title: 'Revenue Generation', sub: 'Governed monetization of exceptions and opportunities.' },
            OPS: { title: 'Operational Efficiency', sub: 'Governed triage and closure for real-world operations.' },
            PLAYBOOK: { title: 'Incident Response', sub: 'Policy-driven, playbook-standardized incident handling.' }
        };
        return infoMap[block] || { title: 'Marketplace', sub: '' };
    };
    const info = getBlockInfo();

    const handleActionClick = (id: string, type: 'PURCHASE' | 'RESUME' | 'PAUSE', cost: number) => {
        setSelectedModuleId(id);
        setActionType(type);
        setCostToConfirm(cost);

        if (type === 'PURCHASE' && (userProfile?.credits || 0) < cost) {
            setInsufficientModalOpen(true);
        } else {
            setConfirmModalOpen(true);
        }
    };

    const executeTransaction = async () => {
        if (!selectedModuleId) return;
        setConfirmModalOpen(false);
        setProcessingId(selectedModuleId);

        try {
            if (actionType === 'PURCHASE') {
                await productService.purchaseModule(selectedModuleId, costToConfirm);
            } else {
                await productService.toggleModule(selectedModuleId);
                if (actionType === 'RESUME') {
                    await authService.consumeCredits(costToConfirm);
                }
            }
            await Promise.all([refetch(), refetchProfile()]);
        } catch (error) {
            console.error("Transaction failed", error);
        } finally {
            setProcessingId(null);
            setSelectedModuleId(null);
        }
    };

    if (modulesStatus === 'pending') {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader className="w-8 h-8 text-[var(--color-brand-primary)] animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 animate-fade-in relative">
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-center shrink-0">
                <div className="flex-1 max-w-3xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">Marketplace™ <span className="text-[var(--color-text-muted)] text-sm font-normal grayscale opacity-50 italic tracking-normal">/ {info.title}</span></h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">{info.sub}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] font-black mb-1">Operational Balance</p>
                    <p className="text-2xl font-numbers text-[var(--color-brand-primary)]">
                        {Math.floor(userProfile?.credits || 0).toLocaleString()}
                        <span className="text-[10px] opacity-40 ml-2 font-numbers uppercase tracking-widest italic">AC</span>
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredModules.map(module => (
                    <MarketplaceCard
                        key={module.id}
                        module={module}
                        processingId={processingId}
                        onAction={handleActionClick}
                    />
                ))}
            </div>

            {/* CONFIRMATION MODAL */}
            <Modal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                title={actionType === 'PAUSE' ? 'Pause Governance' : 'Confirm Transaction'}
                width="sm"
            >
                <div className="p-6">
                    <div className="mb-6">
                        {actionType === 'PAUSE' ? (
                            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                                This operation will pause the function. Activity will no longer be monitored and future results will not be computed. This <span className="text-white font-bold italic">blank space</span> cannot be recovered later, remaining a permanent gap in governance.
                            </p>
                        ) : (
                            <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                                This operation will consume <span className="text-white font-bold whitespace-nowrap">ArmoCredits©</span>. Upon resuming, all governance routines return to operational state immediately. Balances are processed in real-time for every resumption or new acquisition.
                            </p>
                        )}
                    </div>

                    <div className="bg-[var(--color-background)] p-4 rounded-xl mb-6 border border-[var(--color-border)]">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-[var(--color-text-muted)]">Current Balance</span>
                            <span className="font-numbers">{userProfile?.credits?.toLocaleString()} AC</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium pt-2 border-t border-[var(--color-border)]">
                            <span className="text-[var(--color-text-main)]">After Action</span>
                            <span className={`font-numbers ${(userProfile?.credits || 0) - costToConfirm < 0 ? 'text-red-500' : 'text-white'}`}>
                                {Math.floor((userProfile?.credits || 0) - costToConfirm).toLocaleString()} AC
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={() => setConfirmModalOpen(false)} className="flex-1 ui-btn-secondary py-2.5 rounded-lg">Cancel</button>
                        <button onClick={executeTransaction} className="flex-1 ui-btn-primary py-2.5 rounded-lg">Confirm</button>
                    </div>
                </div>
            </Modal>

            {/* INSUFFICIENT FUNDS MODAL */}
            <Modal
                isOpen={insufficientModalOpen}
                onClose={() => setInsufficientModalOpen(false)}
                title="Insufficient Credits"
                width="sm"
            >
                <div className="p-6 text-center">
                    <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <AlertCircle size={24} />
                    </div>
                    <p className="text-[var(--color-text-muted)] mb-6">
                        You need <span className="font-numbers font-bold">{costToConfirm.toLocaleString()} AC</span> for this action, but you only have <span className="font-numbers italic">{(userProfile?.credits || 0).toLocaleString()} AC</span>.
                    </p>
                    <button
                        onClick={() => { setInsufficientModalOpen(false); onNavigateToBilling(); }}
                        className="w-full ui-btn-primary py-2.5 rounded-lg flex items-center justify-center gap-2"
                    >
                        Go to Pricing & Billing
                    </button>
                </div>
            </Modal>
        </div>
    );
};
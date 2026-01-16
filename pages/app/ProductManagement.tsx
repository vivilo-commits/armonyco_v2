import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Search, Filter, CheckCircle, XCircle, Pause, Play, ChevronRight, Building, Home, Zap, Shield, Activity, Loader } from '../../components/ui/Icons';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useUserProfile } from '../../src/hooks/useAuth';
import { usePermissions } from '../../src/hooks/usePermissions';
import { UnauthorizedView } from '../../src/components/app/UnauthorizedView';
import { units, unitGroups, Unit, UnitGroup } from '../../data/portfolio';
import { ProductModule } from '../../src/types';
import { supabase } from '../../src/lib/supabase';

export const ProductManagement: React.FC = () => {
    const { t } = useTranslation();
    const { data: userProfile } = useUserProfile();
    
    // Check permissions - only Admin can manage products
    const { canEditOrganization, loading: permissionsLoading } = usePermissions();
    
    // Hotel selection state
    const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);
    const [hotels, setHotels] = useState<any[]>([]);
    const [loadingHotels, setLoadingHotels] = useState(true);
    
    // Governance Perimeter Sync Trigger
    const [portfolioLevel, setPortfolioLevel] = useState<'GLOBAL' | 'GROUP' | 'UNIT'>('GLOBAL');
    const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
    const [selectedModule, setSelectedModule] = useState<ProductModule | null>(null);
    const [showActivationModal, setShowActivationModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [localModules, setLocalModules] = useState<ProductModule[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // Fetch hotels for current organization
    useEffect(() => {
        const fetchHotels = async () => {
            if (!userProfile?.id || !supabase) return;
            
            setLoadingHotels(true);
            try {
                // Get user's organization
                const { data: orgData, error: orgError } = await supabase
                    .from('organization_members')
                    .select('organization_id')
                    .eq('user_id', userProfile.id)
                    .single();
                
                if (orgError || !orgData) {
                    console.error('Error fetching organization:', orgError);
                    return;
                }
                
                // Fetch hotels for organization
                const { data: hotelsData, error: hotelsError } = await supabase
                    .from('organization_hotels')
                    .select('*')
                    .eq('organization_id', orgData.organization_id)
                    .eq('is_active', true)
                    .order('hotel_name', { ascending: true });
                
                if (hotelsError) {
                    // Don't show error if table doesn't exist yet
                    if (hotelsError.code !== '42P01' && hotelsError.code !== 'PGRST116') {
                        console.error('Error fetching hotels:', hotelsError);
                    }
                    return;
                }
                
                setHotels(hotelsData || []);
                
                // Auto-select first hotel
                if (hotelsData && hotelsData.length > 0) {
                    setSelectedHotelId(hotelsData[0].id);
                }
            } catch (error) {
                console.error('Error fetching hotels:', error);
            } finally {
                setLoadingHotels(false);
            }
        };
        
        fetchHotels();
    }, [userProfile?.id]);

    // Fetch products with activation status for selected hotel
    useEffect(() => {
        const fetchProductsForHotel = async () => {
            if (!selectedHotelId || !supabase) {
                setLocalModules([]);
                return;
            }
            
            setLoadingProducts(true);
            try {
                // Fetch all products
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select('*')
                    .eq('is_active', true)
                    .order('sort_order', { ascending: true });
                
                if (productsError) throw productsError;
                
                // Fetch activations for this hotel
                const { data: activationsData, error: activationsError } = await supabase
                    .from('hotel_product_activations')
                    .select('*')
                    .eq('hotel_id', selectedHotelId);
                
                if (activationsError && activationsError.code !== 'PGRST116' && activationsError.code !== '42P01') {
                    throw activationsError;
                }
                
                // Map products with activation status
                const productsWithStatus: ProductModule[] = productsData?.map(product => {
                    const activation = activationsData?.find(a => a.product_id === product.id);
                    const status: 'ACTIVE' | 'PAUSED' | 'INACTIVE' = 
                        activation?.status === 'active' ? 'ACTIVE' 
                        : activation?.status === 'paused' ? 'PAUSED' 
                        : 'INACTIVE';
                    
                    return {
                        id: product.id,
                        code: product.code,
                        name: product.name,
                        description: product.description,
                        category: product.category,
                        creditCost: product.credit_cost,
                        laborReduction: product.labor_reduction,
                        valueGenerated: product.value_generated,
                        requiresExternal: product.requires_external,
                        isActive: activation?.status === 'active',
                        isPurchased: !!activation,
                        isPaused: activation?.status === 'paused',
                        status,
                    };
                }) || [];
                
                setLocalModules(productsWithStatus);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoadingProducts(false);
            }
        };
        
        fetchProductsForHotel();
    }, [selectedHotelId]);

    // Reload products after changes
    const reloadProducts = useCallback(() => {
        // Trigger re-fetch by updating selectedHotelId
        if (selectedHotelId) {
            setSelectedHotelId(null);
            setTimeout(() => setSelectedHotelId(selectedHotelId), 100);
        }
    }, [selectedHotelId]);

    const handleActivateProduct = async () => {
        if (!selectedModule || !selectedHotelId || !supabase) return;
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('hotel_product_activations')
                .upsert({
                    hotel_id: selectedHotelId,
                    product_id: selectedModule.id,
                    status: 'active',
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'hotel_id,product_id'
                });
            
            if (error) throw error;
            
            setShowActivationModal(false);
            reloadProducts();
            showSuccessToast(`${selectedModule.name} activated successfully for this hotel`);
        } catch (error) {
            console.error('Failed to activate:', error);
            alert('Failed to activate product. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePauseResume = async () => {
        if (!selectedModule || !selectedHotelId || !supabase) return;
        setIsSaving(true);
        try {
            const newStatus = selectedModule.isPaused ? 'active' : 'paused';
            const { error } = await supabase
                .from('hotel_product_activations')
                .upsert({
                    hotel_id: selectedHotelId,
                    product_id: selectedModule.id,
                    status: newStatus,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'hotel_id,product_id'
                });
            
            if (error) throw error;
            
            setShowActivationModal(false);
            reloadProducts();
            showSuccessToast(`${selectedModule.name} ${newStatus === 'active' ? 'resumed' : 'paused'} successfully`);
        } catch (error) {
            console.error('Failed to toggle:', error);
            alert('Failed to toggle product status. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeactivate = async () => {
        if (!selectedModule || !selectedHotelId || !supabase) return;
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('hotel_product_activations')
                .update({ 
                    status: 'inactive',
                    updated_at: new Date().toISOString()
                })
                .eq('hotel_id', selectedHotelId)
                .eq('product_id', selectedModule.id);
            
            if (error) throw error;
            
            setShowActivationModal(false);
            reloadProducts();
            showSuccessToast(`${selectedModule.name} deactivated successfully`);
        } catch (error) {
            console.error('Failed to deactivate:', error);
            alert('Failed to deactivate product. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    // Toast notification helper
    const showSuccessToast = (message: string) => {
        const toast = document.createElement('div');
        toast.className = 'success-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    };

    // Handle toggle switch for activate/deactivate products
    const handleToggle = async (productId: string, currentlyActive: boolean, productName: string) => {
        if (!selectedHotelId) {
            alert('Please select a hotel first');
            return;
        }

        if (!supabase) {
            alert('Database connection not available');
            return;
        }

        const newStatus = currentlyActive ? 'inactive' : 'active';

        // Confirmation before deactivating
        if (currentlyActive) {
            const confirmed = window.confirm(
                `Are you sure you want to disable "${productName}"?\n\nThis feature will no longer be available for this hotel.`
            );
            if (!confirmed) return;
        }

        // Prevent multiple simultaneous operations
        if (togglingId) {
            console.log('[Products] Another operation in progress');
            return;
        }

        try {
            // Show loading state
            setTogglingId(productId);

            // Check if activation exists
            const { data: existing, error: checkError } = await supabase
                .from('hotel_product_activations')
                .select('*')
                .eq('hotel_id', selectedHotelId)
                .eq('product_id', productId)
                .maybeSingle();
            
            if (checkError && checkError.code !== 'PGRST116' && checkError.code !== '42P01') {
                throw checkError;
            }

            if (existing) {
                // Update existing activation
                const { error } = await supabase
                    .from('hotel_product_activations')
                    .update({ 
                        status: newStatus,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existing.id);
                
                if (error) throw error;
            } else {
                // Create new activation
                const { error } = await supabase
                    .from('hotel_product_activations')
                    .insert({
                        hotel_id: selectedHotelId,
                        product_id: productId,
                        status: newStatus,
                    });
                
                if (error) throw error;
            }

            console.log(`[Products] ✅ Updated product ${productId} to ${newStatus} for hotel ${selectedHotelId}`);

            // Update UI locally immediately (optimistic update)
            setLocalModules(prevModules =>
                prevModules.map(p =>
                    p.id === productId
                        ? {
                                ...p,
                                status: newStatus === 'active' ? 'ACTIVE' : 'INACTIVE',
                                isActive: newStatus === 'active',
                                isPurchased: newStatus === 'active' ? true : p.isPurchased,
                                isPaused: false,
                            }
                        : p
                )
            );

            // Show success feedback
            showSuccessToast(`${productName} ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully for this hotel`);

        } catch (error: any) {
            console.error('[Products] ❌ Error toggling product:', error);
            alert(`Failed to ${newStatus === 'active' ? 'activate' : 'deactivate'} ${productName}. Please try again.`);
        } finally {
            // Remove loading state
            setTogglingId(null);
        }
    };

    const filteredModules = localModules?.filter(m => {
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

    // Show loading while checking permissions
    if (permissionsLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    // Only Admin can manage products
    if (!canEditOrganization) {
        return (
            <UnauthorizedView 
                message={t('products.accessDeniedMessage')} 
                title={t('products.accessDenied')}
            />
        );
    }

    return (
        <div className="p-8 animate-fade-in flex flex-col h-full bg-black text-white">
            <header className="mb-10 border-b border-white/5 pb-8 flex justify-between items-start shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Package className="text-[var(--color-brand-accent)] w-6 h-6" />
                        <h1 className="text-2xl text-white font-light uppercase tracking-tight">{t('products.title')}</h1>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm italic opacity-70">{t('products.description')}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] font-black mb-1">{t('products.operationalBalance')}</p>
                    <p className="text-2xl font-numbers text-[var(--color-brand-primary)]">
                        {Math.floor(userProfile?.credits || 0).toLocaleString('de-DE')}
                        <span className="text-[10px] opacity-40 ml-2 font-numbers uppercase tracking-widest italic">{t('settings.subscription.armoCredits')}</span>
                    </p>
                </div>
            </header>

            {/* Hotel Selector */}
            <Card variant="dark" padding="lg" className="mb-8 border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-white mb-1">{t('products.selectHotel')}</h3>
                        <p className="text-xs text-zinc-500">
                            {t('products.selectHotelDescription')}
                        </p>
                    </div>
                    
                    <div className="w-80">
                        {loadingHotels ? (
                            <div className="flex items-center gap-2 text-zinc-500">
                                <Loader size={16} className="animate-spin" />
                                <span className="text-sm">{t('products.loadingHotels')}</span>
                            </div>
                        ) : hotels.length === 0 ? (
                            <div className="text-sm text-amber-500">
                                {t('products.noHotels')}
                            </div>
                        ) : (
                            <select
                                value={selectedHotelId || ''}
                                onChange={(e) => setSelectedHotelId(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[var(--color-brand-accent)] outline-none appearance-none text-white [&>option]:border-2 [&>option]:border-black"
                            >
                                <option value="" className="bg-black text-white border-2 border-black">
                                    Select a hotel
                                </option>
                                {hotels.map((hotel) => (
                                    <option 
                                        key={hotel.id} 
                                        value={hotel.id}
                                        className="bg-black text-white border-2 border-black"
                                    >
                                        {hotel.hotel_name}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                </div>
            </Card>

            {/* Show message if no hotel selected */}
            {!selectedHotelId && hotels.length > 0 && (
                <Card variant="dark" padding="lg" className="text-center mb-8">
                    <Home size={48} className="mx-auto text-zinc-600 mb-4" />
                    <p className="text-zinc-400">Please select a hotel to manage services</p>
                </Card>
            )}

            {/* Filters & Search */}
            {selectedHotelId && (
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
            )}

            {/* Products Table */}
            {selectedHotelId ? (
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
                                        <div className="status-container flex items-center gap-2">
                                            {/* Dynamic Icon */}
                                            {module.isActive ? (
                                                <span className="status-icon active text-emerald-500">⚡</span>
                                            ) : module.isPaused ? (
                                                <span className="status-icon paused text-amber-500">⏸</span>
                                            ) : (
                                                <span className="status-icon idle text-zinc-600">○</span>
                                            )}

                                            {/* Status Badge */}
                                            <span className={`status-badge px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                                                module.isActive
                                                    ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                                                    : module.isPaused
                                                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                                    : 'bg-zinc-600/10 text-zinc-600 border-zinc-600/30'
                                            }`}>
                                                {module.isActive ? 'Active' : module.isPaused ? 'Paused' : 'Inactive'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="toggle-container flex items-center gap-3 justify-end">
                                            {/* Toggle Switch */}
                                            <label className="toggle-switch relative inline-block w-12 h-6 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={module.isActive || false}
                                                    disabled={module.isPaused || togglingId === module.id}
                                                    onChange={() => handleToggle(module.id, module.isActive || false, module.name)}
                                                    className="opacity-0 w-0 h-0"
                                                />
                                                <span className={`slider absolute top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300 ${
                                                    module.isActive
                                                        ? 'bg-emerald-500'
                                                        : module.isPaused || togglingId === module.id
                                                        ? 'bg-zinc-700 opacity-50 cursor-not-allowed'
                                                        : 'bg-zinc-700'
                                                } before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:rounded-full before:transition-transform before:duration-300 ${
                                                    module.isActive ? 'before:translate-x-6' : ''
                                                }`}></span>
                                            </label>

                                            {/* Toggle Label */}
                                            <span className={`toggle-label text-xs font-bold min-w-[60px] ${
                                                module.isActive ? 'text-emerald-500' : 'text-zinc-500'
                                            }`}>
                                                {togglingId === module.id ? (
                                                    <span className="loading-spinner inline-block animate-pulse text-blue-500">●</span>
                                                ) : module.isPaused ? (
                                                    'Paused'
                                                ) : module.isActive ? (
                                                    'Active'
                                                ) : (
                                                    'Inactive'
                                                )}
                                            </span>

                                            {/* Optional: Keep configure button for additional settings */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-[9px] font-black uppercase tracking-widest hover:text-white opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                                                onClick={() => handleManageActivation(module)}
                                            >
                                                <Shield size={12} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            ) : hotels.length === 0 ? null : (
                <Card variant="dark" padding="lg" className="text-center">
                    <p className="text-zinc-400">Select a hotel to view and manage services</p>
                </Card>
            )}

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

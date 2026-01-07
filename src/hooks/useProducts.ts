import { useCallback, useEffect, useState } from 'react';
import { useAsync } from './useAsync';
import { productService } from '../services/product.service';
import { supabase } from '../lib/supabase';

/**
 * Hook to get products/modules with realtime updates
 */
export const useProducts = () => {
    const [trigger, setTrigger] = useState(0);

    useEffect(() => {
        if (!supabase) return;

        // Subscribe to both products and user_product_activations
        const channel = supabase
            .channel('products_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
                console.log('[Realtime] Products updated');
                setTrigger(prev => prev + 1);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'user_product_activations' }, () => {
                console.log('[Realtime] Product activations updated');
                setTrigger(prev => prev + 1);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchModules = useCallback(() => productService.getModules(), [trigger]);
    return useAsync(fetchModules);
};

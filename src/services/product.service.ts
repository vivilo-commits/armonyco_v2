import { ProductModule } from '../types';
import {
    getProductsWithStatus,
    activateProduct,
    pauseProduct,
    resumeProduct,
    deactivateProduct
} from './products.service';

/**
 * Product service - public API using Supabase backend
 */
export const productService = {
    /**
     * Get all modules with user's activation status
     */
    getModules: async (): Promise<ProductModule[]> => {
        return getProductsWithStatus();
    },

    /**
     * Activate/purchase a module
     */
    purchaseModule: async (id: string, _cost: number): Promise<{ success: boolean; module?: ProductModule }> => {
        const success = await activateProduct(id);
        if (success) {
            const modules = await getProductsWithStatus();
            const module = modules.find(m => m.id === id);
            return { success: true, module };
        }
        return { success: false };
    },

    /**
     * Toggle module pause/active status
     */
    toggleModule: async (id: string): Promise<{ success: boolean; module?: ProductModule }> => {
        const modules = await getProductsWithStatus();
        const module = modules.find(m => m.id === id);

        if (!module) return { success: false };

        let success: boolean;
        if (module.isPaused) {
            success = await resumeProduct(id);
        } else {
            success = await pauseProduct(id);
        }

        if (success) {
            const updatedModules = await getProductsWithStatus();
            const updatedModule = updatedModules.find(m => m.id === id);
            return { success: true, module: updatedModule };
        }
        return { success: false };
    },

    /**
     * Deactivate a module
     */
    deactivateModule: async (id: string): Promise<{ success: boolean }> => {
        const success = await deactivateProduct(id);
        return { success };
    }
};

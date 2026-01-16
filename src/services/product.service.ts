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
 * Now hotel-based instead of user-based
 */
export const productService = {
    /**
     * Get all modules with hotel's activation status
     */
    getModules: async (hotelId?: string): Promise<ProductModule[]> => {
        return getProductsWithStatus(hotelId);
    },

    /**
     * Activate/purchase a module for a hotel
     */
    purchaseModule: async (id: string, hotelId: string, _cost: number): Promise<{ success: boolean; module?: ProductModule }> => {
        if (!hotelId) return { success: false };
        const success = await activateProduct(id, hotelId);
        if (success) {
            const modules = await getProductsWithStatus(hotelId);
            const module = modules.find(m => m.id === id);
            return { success: true, module };
        }
        return { success: false };
    },

    /**
     * Toggle module pause/active status for a hotel
     */
    toggleModule: async (id: string, hotelId: string): Promise<{ success: boolean; module?: ProductModule }> => {
        if (!hotelId) return { success: false };
        const modules = await getProductsWithStatus(hotelId);
        const module = modules.find(m => m.id === id);

        if (!module) return { success: false };

        let success: boolean;
        if (module.isPaused) {
            success = await resumeProduct(id, hotelId);
        } else {
            success = await pauseProduct(id, hotelId);
        }

        if (success) {
            const updatedModules = await getProductsWithStatus(hotelId);
            const updatedModule = updatedModules.find(m => m.id === id);
            return { success: true, module: updatedModule };
        }
        return { success: false };
    },

    /**
     * Deactivate a module for a hotel
     */
    deactivateModule: async (id: string, hotelId: string): Promise<{ success: boolean }> => {
        if (!hotelId) return { success: false };
        const success = await deactivateProduct(id, hotelId);
        return { success };
    }
};

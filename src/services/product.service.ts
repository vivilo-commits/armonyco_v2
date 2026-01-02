import { apiClient } from './api';
import { mockProductModules } from '../mocks/product.mocks';
import { ProductModule } from '../types';

export const productService = {
    getModules: (): Promise<ProductModule[]> => {
        return apiClient.get('/products', mockProductModules as unknown as ProductModule[]);
    },

    purchaseModule: async (id: string, cost: number): Promise<{ success: boolean; module?: ProductModule }> => {
        const mockModule = (mockProductModules as unknown as ProductModule[]).find(m => m.id === id);
        const result = {
            success: true,
            module: mockModule ? { ...mockModule, isPurchased: true, isPaused: true } : undefined
        };
        return apiClient.post(`/products/${id}/purchase`, { cost }, result);
    },

    toggleModule: async (id: string): Promise<{ success: boolean; module?: ProductModule }> => {
        const mockModule = (mockProductModules as unknown as ProductModule[]).find(m => m.id === id);
        const result = {
            success: true,
            module: mockModule ? { ...mockModule, isPaused: !mockModule.isPaused } : undefined
        };
        return apiClient.post(`/products/${id}/toggle`, {}, result);
    }
};


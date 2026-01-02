import { useCallback } from 'react';
import { useAsync } from './useAsync';
import { productService } from '../services/product.service';

export const useProducts = () => {
    const fetchModules = useCallback(() => productService.getModules(), []);
    return useAsync(fetchModules);
};

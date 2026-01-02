import { useCallback } from 'react';
import { useAsync } from './useAsync';
import { authService } from '../services/auth.service';

export const useUserProfile = () => {
    const fetchProfile = useCallback(() => authService.getUserProfile(), []);
    return useAsync(fetchProfile);
};

export const useOrganization = () => {
    const fetchOrg = useCallback(() => authService.getOrganization(), []);
    return useAsync(fetchOrg);
};

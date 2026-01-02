import { useCallback } from 'react';
import { useAsync } from './useAsync';
import { complianceService } from '../services/compliance.service';

export const useCompliance = () => {
    const fetchMetrics = useCallback(() => complianceService.getMetrics(), []);
    return useAsync(fetchMetrics);
};

export const useRecentDecisions = () => {
    const fetchDecisions = useCallback(() => complianceService.getRecentDecisions(), []);
    return useAsync(fetchDecisions);
};

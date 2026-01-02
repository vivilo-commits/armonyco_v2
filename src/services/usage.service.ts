import { apiClient } from './api';
import { mockUsageMetrics } from '../mocks/usage.mocks';
import { UsageMetrics } from '../types';

export const usageService = {
    getMetrics: (): Promise<UsageMetrics> => {
        return apiClient.get('/usage/metrics', mockUsageMetrics);
    }
};

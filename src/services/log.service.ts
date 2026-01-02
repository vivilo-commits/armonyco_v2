import { apiClient } from './api';
import { mockLogs, mockAgents, mockNotifications } from '../mocks/log.mocks';
import { mockValueVelocity, mockDomainPerformance } from '../mocks/dashboard.mocks';
import { DecisionRecord, UsageRecord } from '../types';

export const logService = {
    getLogs: () => apiClient.get('/logs', mockLogs),
    getAgents: () => apiClient.get('/agents', mockAgents),
    getNotifications: () => apiClient.get('/notifications', mockNotifications),
    getUsage: () => apiClient.get('/usage', [] as UsageRecord[]),
    getValueVelocity: () => apiClient.get('/stats/velocity', mockValueVelocity),
    getDomainPerformance: () => apiClient.get('/stats/performance', mockDomainPerformance),
};


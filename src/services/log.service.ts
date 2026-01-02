import { apiClient } from './api';
import { mockLogs, mockAgents, mockNotifications } from '../mocks/log.mocks';
import { DecisionRecord, UsageRecord } from '../types';

export const logService = {
    getLogs: () => apiClient.get('/logs', mockLogs as unknown as DecisionRecord[]),
    getAgents: () => apiClient.get('/agents', mockAgents),
    getNotifications: () => apiClient.get('/notifications', mockNotifications),
    getUsage: () => apiClient.get('/usage', [] as UsageRecord[]), // New plumbing for usage
};


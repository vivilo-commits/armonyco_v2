import { apiClient } from './api';
import { mockComplianceMetrics, mockComplianceLog } from '../mocks/compliance.mocks';
import { DecisionRecord } from '../types';

export interface ComplianceMetrics {
    rate: number;
    trend: number;
    governedValue: number;
    history: number[];
}

export const complianceService = {
    getMetrics: () => apiClient.get<ComplianceMetrics>('/compliance/metrics', mockComplianceMetrics),
    getRecentDecisions: () => apiClient.get<DecisionRecord[]>('/compliance/decisions', mockComplianceLog)
};

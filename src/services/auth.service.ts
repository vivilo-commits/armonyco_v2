import { apiClient } from './api';
import { mockUserProfile, mockOrganization, mockBillingDetails } from '../mocks/user.mocks';
import { UserProfile, Organization, BillingDetails } from '../types';

export const authService = {
    getUserProfile: () => apiClient.get('/auth/me', mockUserProfile as unknown as UserProfile),
    getOrganization: () => apiClient.get('/auth/org', mockOrganization as unknown as Organization),
    getBillingDetails: () => apiClient.get('/auth/billing', mockBillingDetails as unknown as BillingDetails),

    updateProfile: (data: Partial<UserProfile>) => {
        const result = { ...mockUserProfile, ...data } as UserProfile;
        return apiClient.post('/auth/me', data, result);
    },

    updateOrganization: (data: Partial<Organization>) => {
        const result = { ...mockOrganization, ...data } as Organization;
        return apiClient.post('/auth/org', data, result);
    },

    // Credits Management
    addCredits: (amount: number) => {
        const result = { ...mockUserProfile, credits: (mockUserProfile.credits || 0) + amount } as unknown as UserProfile;
        return apiClient.post('/auth/credits/topup', { amount }, result);
    },

    consumeCredits: (amount: number) => {
        const success = (mockUserProfile.credits || 0) >= amount;
        return apiClient.post('/auth/credits/consume', { amount }, success);
    }
};


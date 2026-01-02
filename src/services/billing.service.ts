import { apiClient } from './api';
import { mockInvoices, mockPaymentMethods } from '../mocks/billing.mocks';
import { Invoice, PaymentMethod } from '../types';

export const billingService = {
    getInvoices: (): Promise<Invoice[]> => {
        return apiClient.get('/billing/invoices', mockInvoices);
    },
    getPaymentMethods: (): Promise<PaymentMethod[]> => {
        return apiClient.get('/billing/payment-methods', mockPaymentMethods);
    },
    purchaseCredits: (amount: number): Promise<{ success: boolean; newBalance: number }> => {
        // Mocking the balance update calculation
        return apiClient.post('/billing/purchase-credits', { amount }, { success: true, newBalance: 5000 + amount });
    }
};

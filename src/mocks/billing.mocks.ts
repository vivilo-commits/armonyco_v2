import { Invoice, PaymentMethod } from '../types';

export const mockInvoices: Invoice[] = [
    {
        id: 'INV-2023-001',
        date: '2023-11-01',
        amount: 500,
        status: 'PAID',
        url: '#'
    },
    {
        id: 'INV-2023-002',
        date: '2023-12-01',
        amount: 500,
        status: 'PAID',
        url: '#'
    },
    {
        id: 'INV-2024-001',
        date: '2024-01-01',
        amount: 750,
        status: 'PENDING',
        url: '#'
    }
];

export const mockPaymentMethods: PaymentMethod[] = [
    {
        id: 'pm-001',
        type: 'CARD',
        last4: '4242',
        brand: 'Visa',
        isDefault: true
    },
    {
        id: 'pm-002',
        type: 'PAYPAL',
        isDefault: false
    }
];

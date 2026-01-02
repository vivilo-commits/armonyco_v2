/**
 * CORE DOMAIN TYPES
 */

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    photo?: string | null;
    role: string; // Relaxed for plumbing compatibility
    credits: number;
}

export interface Organization {
    id: string;
    name: string;
    tier?: 'silver' | 'gold' | 'black';
    billingEmail: string;
    language: string;
    timezone: string;
}

export interface BillingDetails {
    legalName: string;
    vatNumber: string;
    fiscalCode: string;
    address: string;
    city: string;
    zip: string;
    country: string;
    sdiCode: string;
    pecEmail: string;
}

export interface ProductModule {
    id: string;
    code: string;
    name: string;
    description: string;
    category: 'GUEST' | 'REVENUE' | 'OPS' | 'RESPONSE';
    cost: number;
    creditCost?: number; // Compatibility with legacy data
    isPurchased: boolean;
    isPaused: boolean;
    isActive?: boolean; // Compatibility with legacy data
    status?: 'ACTIVE' | 'PAUSED' | 'INACTIVE';
}

export interface UsageRecord {
    id: string;
    timestamp: string;
    event: string;
    creditCost: number;
    status: 'VERIFIED' | 'PENDING';
}

export interface DecisionRecord {
    id: string;
    timestamp: string;
    policy: string;
    verdict: string;
    entity?: string;
    responsible?: string;
    evidenceHash?: string;
    hash?: string;
    credits?: number;
}

/**
 * API RESPONSE WRAPPER
 */
export interface ApiResponse<T> {
    data: T;
    error?: {
        code: string;
        message: string;
    };
}

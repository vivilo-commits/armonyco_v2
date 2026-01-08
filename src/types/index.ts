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
    category: 'GUEST' | 'REVENUE' | 'OPS' | 'RESPONSE' | 'PLAYBOOK';
    cost?: number;
    creditCost?: number;
    isPurchased?: boolean;
    isPaused?: boolean;
    isActive?: boolean;
    status?: 'ACTIVE' | 'PAUSED' | 'INACTIVE';
    what?: string;
    why?: string[];
    how?: string;
    requiresExternal?: boolean;
    laborReduction?: string; // e.g. "85%"
    valueGenerated?: string; // e.g. "€1.2k/mo"
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

export enum UserRole {
    EXECUTIVE = 'Executive',
    AUDITOR = 'Auditor',
    OPERATOR = 'Operator'
}

export interface Notification {
    id: string;
    type: 'ALERT' | 'WARNING' | 'INFO';
    message: string;
    timestamp: string;
    read: boolean;
    metric?: string;
}

/**
 * API RESPONSE WRAPPER
 */
export interface Agent {
    id: string;
    name: string;
    role: string;
    description?: string;
    status: 'active' | 'learning' | 'inactive' | 'idle';
    decisionCount: number;
    accuracy: string;
    avatar?: string;
    icon?: any;
    metrics?: {
        label: string;
        value: string;
        trend?: number;
    }[];
}

export interface ApiResponse<T> {
    data: T;
    error?: {
        code: string;
        message: string;
    };
}

/**
 * TOKENS SYSTEM TYPES
 */
export * from './tokens.types';
export enum UserRole {
    EXECUTIVE = 'Executive', // Full Access
    AUDITOR = 'Auditor',     // Read Only, Full Access to Logs/Constructs
    OPERATOR = 'Operator'    // Restricted Access (No Constructs Config)
}

export interface UserProfile {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    photo?: string | null;
    jobRole?: string;
    role: UserRole;
    credits: number; // ArmoCredits balance
}

export interface Organization {
    id: string;
    name: string;
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

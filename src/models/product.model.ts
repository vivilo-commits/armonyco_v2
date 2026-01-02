export enum ConstructType {
    AEM = 'AEM',
    AOS = 'AOS',
    ARS = 'ARS',
    AGS = 'AGS'
}

export type ModuleCategory = 'GUEST' | 'REVENUE' | 'OPS' | 'PLAYBOOK' | 'CORE';

export interface ProductModule {
    id: string;
    code: string;
    name: string;
    description: string;

    category: ModuleCategory;

    // Marketing/Sales content
    what: string;
    why: string[];
    how: string;

    // Marketplace State
    creditCost: number; // Cost in ArmoCredits
    isPurchased: boolean;
    isActive: boolean;
    isPaused: boolean;

    requiresExternal: boolean;
}

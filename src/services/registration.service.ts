/**
 * REGISTRATION SERVICE
 * Gestione flusso registrazione multi-step con localStorage e completamento
 */

import { signUpWithEmail, supabase } from '../lib/supabase';
import { 
    updateProfileInDB, 
    updateOrganizationInDB, 
    updateBillingInDB 
} from './auth.service';

// ============================================================================
// TYPES
// ============================================================================

export interface RegistrationDraft {
    step: number;
    timestamp: number;
    data: {
        // Step 1: Account Base
        email?: string;
        password?: string;
        firstName?: string;
        lastName?: string;
        acceptTerms?: boolean;

        // Step 2: Dati Aziendali
        businessName?: string;
        vatNumber?: string;
        fiscalCode?: string;
        address?: string;
        civicNumber?: string;
        cap?: string;
        city?: string;
        province?: string;
        country?: string;
        phone?: string;
        sdiCode?: string;
        pecEmail?: string;

        // Step 3: Piano
        planId?: number;
        planName?: string;
        planPrice?: number;
        planCredits?: number;

        // Step 4: Pagamento
        stripeSessionId?: string;
        paymentIntentId?: string;
    };
}

export interface CompleteRegistrationData {
    // Account
    email: string;
    password: string;
    firstName: string;
    lastName: string;

    // Organization
    businessName: string;
    vatNumber: string;
    fiscalCode?: string;
    phone?: string;

    // Billing
    address: string;
    civicNumber?: string;
    cap?: string;
    city: string;
    province?: string;
    country: string;
    sdiCode?: string;
    pecEmail?: string;

    // Plan
    planId: number;
    planCredits: number;

    // Payment
    stripeSessionId?: string;
    paymentIntentId?: string;
}

export interface RegistrationResult {
    success: boolean;
    userId?: string;
    error?: string;
}

// ============================================================================
// LOCALSTORAGE DRAFT MANAGEMENT
// ============================================================================

const STORAGE_KEY = 'armonyco_registration_draft';
const DRAFT_EXPIRY_HOURS = 24;

/**
 * Salva draft registrazione in localStorage
 */
export function saveRegistrationDraft(step: number, data: Partial<RegistrationDraft['data']>): void {
    try {
        // Recupera draft esistente
        const existing = getRegistrationDraft();
        
        const draft: RegistrationDraft = {
            step,
            timestamp: Date.now(),
            data: {
                ...(existing?.data || {}),
                ...data,
            },
        };

        // NON salvare la password in localStorage per sicurezza
        // La password verrà richiesta nuovamente se l'utente ricarica la pagina
        if (draft.data.password) {
            delete draft.data.password;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        console.log('[Registration] Draft salvato, step:', step);
    } catch (error) {
        console.error('[Registration] Errore salvataggio draft:', error);
    }
}

/**
 * Recupera draft registrazione da localStorage
 */
export function getRegistrationDraft(): RegistrationDraft | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (!stored) {
            return null;
        }

        const draft: RegistrationDraft = JSON.parse(stored);

        // Verifica scadenza (24 ore)
        const age = Date.now() - draft.timestamp;
        const maxAge = DRAFT_EXPIRY_HOURS * 60 * 60 * 1000;

        if (age > maxAge) {
            console.log('[Registration] Draft scaduto, rimuovo');
            clearRegistrationDraft();
            return null;
        }

        return draft;
    } catch (error) {
        console.error('[Registration] Errore recupero draft:', error);
        return null;
    }
}

/**
 * Pulisce draft registrazione da localStorage
 */
export function clearRegistrationDraft(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('[Registration] Draft rimosso');
    } catch (error) {
        console.error('[Registration] Errore rimozione draft:', error);
    }
}

/**
 * Aggiorna solo specifici campi del draft
 */
export function updateRegistrationDraft(updates: Partial<RegistrationDraft['data']>): void {
    const existing = getRegistrationDraft();
    if (existing) {
        saveRegistrationDraft(existing.step, updates);
    }
}

// ============================================================================
// COMPLETE REGISTRATION
// ============================================================================

/**
 * Completa la registrazione creando account Supabase e salvando tutti i dati
 */
export async function completeRegistration(data: CompleteRegistrationData): Promise<RegistrationResult> {
    try {
        console.log('[Registration] Starting registration for:', data.email);
        console.log('[Registration] Full data:', {
            email: data.email,
            passwordLength: data.password?.length,
            firstName: data.firstName,
            lastName: data.lastName,
            businessName: data.businessName,
        });

        // 1. Create Supabase Auth account
        let signUpResult;
        try {
            console.log('[Registration] Calling signUpWithEmail...');
            signUpResult = await signUpWithEmail(
                data.email,
                data.password,
                {
                    firstName: data.firstName,
                    lastName: data.lastName,
                }
            );
            console.log('[Registration] signUpWithEmail result:', signUpResult);
        } catch (error: any) {
            console.error('[Registration] Errore creazione account:', error);
            
            // Check for specific Supabase errors
            if (error.message?.includes('Anonymous sign-ins are disabled')) {
                return {
                    success: false,
                    error: 'Le registrazioni sono disabilitate su Supabase. Abilita "Email Signup" nella dashboard Supabase.',
                };
            }
            
            if (error.message?.includes('User already registered')) {
                return {
                    success: false,
                    error: 'Email già registrata. Prova a fare login.',
                };
            }
            
            return {
                success: false,
                error: error.message || 'Errore durante la creazione account',
            };
        }

        const { user, error: signUpError } = signUpResult;

        if (signUpError || !user) {
            console.error('[Registration] Errore creazione account:', signUpError);
            
            // Check for specific Supabase errors in the error object
            const errorMessage = signUpError?.message || '';
            
            if (errorMessage.includes('User already registered') || errorMessage.includes('already registered')) {
                return {
                    success: false,
                    error: 'Email già registrata. Prova a fare login.',
                };
            }
            
            return {
                success: false,
                error: errorMessage || 'Errore creazione account',
            };
        }

        const userId = user.id;
        const userSession = signUpResult.session;
        console.log('[Registration] Account created successfully! userId:', userId);
        console.log('[Registration] Session:', userSession ? 'Active' : 'None - email confirmation required');

        // If no session (email confirmation required), we can't save to DB yet
        if (!userSession) {
            console.warn('[Registration] No session after signup - email confirmation may be required');
            console.warn('[Registration] User created but additional data not saved. Will be saved on first login.');
            return {
                success: true,
                userId,
            };
        }

        // 2. Save user profile
        console.log('[Registration] Saving profile to database...');
        const profile = await updateProfileInDB(userId, {
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone || '',
            role: 'Executive', // Default admin role
            credits: data.planCredits || 0,
        });

        if (!profile) {
            console.warn('[Registration] Profile save returned null, but continuing...');
        } else {
            console.log('[Registration] Profile saved successfully:', profile);
        }

        // 3. Save organization
        console.log('[Registration] Saving organization...');
        const organization = await updateOrganizationInDB(userId, {
            name: data.businessName,
            billingEmail: data.email,
            language: 'IT',
            timezone: 'Europe/Rome',
            tier: 'silver', // Default tier
        });

        if (!organization) {
            console.warn('[Registration] Organization save returned null, but continuing...');
        } else {
            console.log('[Registration] Organization saved successfully');
        }

        // 4. Save billing details
        console.log('[Registration] Saving billing details...');
        const billing = await updateBillingInDB(userId, {
            legalName: data.businessName,
            vatNumber: data.vatNumber,
            fiscalCode: data.fiscalCode || '',
            address: [data.address, data.civicNumber].filter(Boolean).join(', '),
            city: data.city,
            zip: data.cap || '',
            country: data.country,
            sdiCode: data.sdiCode || '',
            pecEmail: data.pecEmail || '',
        });

        if (!billing) {
            console.warn('[Registration] Billing save returned null, but continuing...');
        } else {
            console.log('[Registration] Billing saved successfully');
        }

        // 5. Salva informazioni piano/pagamento (opzionale - per tracking)
        if (supabase && data.stripeSessionId) {
            await supabase
                .from('user_subscriptions')
                .insert({
                    user_id: userId,
                    plan_id: data.planId,
                    status: 'active',
                    started_at: new Date().toISOString(),
                });
        }

        console.log('[Registration] Registrazione completata con successo');

        // 6. Pulisci draft
        clearRegistrationDraft();

        return {
            success: true,
            userId,
        };
    } catch (error: any) {
        console.error('[Registration] Errore completamento:', error);
        return {
            success: false,
            error: error.message || 'Errore durante la registrazione',
        };
    }
}

/**
 * Completa registrazione da draft salvato (dopo redirect da Stripe)
 */
export async function completeRegistrationFromDraft(
    sessionId: string,
    password: string
): Promise<RegistrationResult> {
    try {
        const draft = getRegistrationDraft();

        if (!draft) {
            return {
                success: false,
                error: 'Nessun draft di registrazione trovato',
            };
        }

        const data: CompleteRegistrationData = {
            email: draft.data.email!,
            password,
            firstName: draft.data.firstName!,
            lastName: draft.data.lastName!,
            businessName: draft.data.businessName!,
            vatNumber: draft.data.vatNumber!,
            fiscalCode: draft.data.fiscalCode,
            phone: draft.data.phone,
            address: draft.data.address!,
            civicNumber: draft.data.civicNumber,
            cap: draft.data.cap,
            city: draft.data.city!,
            province: draft.data.province,
            country: draft.data.country!,
            sdiCode: draft.data.sdiCode,
            pecEmail: draft.data.pecEmail,
            planId: draft.data.planId!,
            planCredits: draft.data.planCredits!,
            stripeSessionId: sessionId,
        };

        return await completeRegistration(data);
    } catch (error: any) {
        console.error('[Registration] Errore completamento da draft:', error);
        return {
            success: false,
            error: error.message || 'Errore durante la registrazione',
        };
    }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Verifica se il draft è completo e pronto per il pagamento
 */
export function isDraftReadyForPayment(draft: RegistrationDraft | null): boolean {
    if (!draft) return false;

    const d = draft.data;

    return !!(
        // Step 1
        d.email &&
        d.firstName &&
        d.lastName &&
        d.acceptTerms &&
        // Step 2
        d.businessName &&
        d.vatNumber &&
        d.address &&
        d.city &&
        d.country &&
        (d.sdiCode || d.pecEmail) &&
        // Step 3
        d.planId &&
        d.planCredits
    );
}

/**
 * Calcola la percentuale di completamento del draft
 */
export function calculateDraftCompleteness(draft: RegistrationDraft | null): number {
    if (!draft) return 0;

    const requiredFields = [
        'email', 'firstName', 'lastName', 'acceptTerms',
        'businessName', 'vatNumber', 'address', 'city', 'country',
        'planId', 'planCredits'
    ];

    const completedFields = requiredFields.filter(field => {
        const value = (draft.data as any)[field];
        return value !== undefined && value !== null && value !== '';
    });

    return Math.round((completedFields.length / requiredFields.length) * 100);
}

// ============================================================================
// EXPORT SERVICE
// ============================================================================

export const registrationService = {
    saveRegistrationDraft,
    getRegistrationDraft,
    clearRegistrationDraft,
    updateRegistrationDraft,
    completeRegistration,
    completeRegistrationFromDraft,
    isDraftReadyForPayment,
    calculateDraftCompleteness,
};


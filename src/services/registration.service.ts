/**
 * REGISTRATION SERVICE
 * Multi-step registration flow management with localStorage and completion
 */

import { signUpWithEmail, supabase, createUserSubscription } from '../lib/supabase';
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

        // Step 2: Business Details
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

        // Step 3: Plan
        planId?: number;
        planName?: string;
        planPrice?: number;
        planCredits?: number;

        // Step 4: Payment
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
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
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
 * Saves registration draft to localStorage
 */
export function saveRegistrationDraft(step: number, data: Partial<RegistrationDraft['data']>): void {
    try {
        // Retrieve existing draft
        const existing = getRegistrationDraft();
        
        const draft: RegistrationDraft = {
            step,
            timestamp: Date.now(),
            data: {
                ...(existing?.data || {}),
                ...data,
            },
        };

        // DO NOT save password in localStorage for security
        // Password will be requested again if user reloads the page
        if (draft.data.password) {
            delete draft.data.password;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
        console.log('[Registration] Draft saved, step:', step);
    } catch (error) {
        console.error('[Registration] Error saving draft:', error);
    }
}

/**
 * Retrieves registration draft from localStorage
 */
export function getRegistrationDraft(): RegistrationDraft | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (!stored) {
            return null;
        }

        const draft: RegistrationDraft = JSON.parse(stored);

        // Check expiration (24 hours)
        const age = Date.now() - draft.timestamp;
        const maxAge = DRAFT_EXPIRY_HOURS * 60 * 60 * 1000;

        if (age > maxAge) {
            console.log('[Registration] Draft expired, removing');
            clearRegistrationDraft();
            return null;
        }

        return draft;
    } catch (error) {
        console.error('[Registration] Error retrieving draft:', error);
        return null;
    }
}

/**
 * Clears registration draft from localStorage
 */
export function clearRegistrationDraft(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('[Registration] Draft removed');
    } catch (error) {
        console.error('[Registration] Error removing draft:', error);
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
 * Completes registration by creating Supabase account and saving all data
 */
export async function completeRegistration(data: CompleteRegistrationData): Promise<RegistrationResult> {
    try {
        // ============================================================================
        // VALIDATION - Ensure email and password are present before calling Supabase
        // ============================================================================
        
        if (!data.email || !data.password) {
            console.error('[Registration] ❌ Missing email or password');
            return {
                success: false,
                error: 'Email and password are required',
            };
        }

        if (data.password.length < 6) {
            console.error('[Registration] ❌ Password too short');
            return {
                success: false,
                error: 'Password must be at least 6 characters',
            };
        }

        if (!data.email.includes('@')) {
            console.error('[Registration] ❌ Invalid email format');
            return {
                success: false,
                error: 'Invalid email format',
            };
        }

        console.log('[Registration] ✅ Validation passed. Starting registration for:', data.email);
        console.log('[Registration] Full data:', {
            email: data.email,
            hasPassword: true,
            passwordLength: data.password.length,
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
            console.error('[Registration] Error creating account:', error);
            
            // Check for specific Supabase errors
            if (error.message?.includes('Anonymous sign-ins are disabled')) {
                return {
                    success: false,
                    error: 'Registrations are disabled on Supabase. Enable "Email Signup" in Supabase dashboard.',
                };
            }
            
            if (error.message?.includes('User already registered')) {
                return {
                    success: false,
                    error: 'Email already registered. Try logging in.',
                };
            }
            
            return {
                success: false,
                error: error.message || 'Error during account creation',
            };
        }

        const { user, error: signUpError } = signUpResult;

        if (signUpError || !user) {
            console.error('[Registration] Error creating account:', signUpError);
            
            // Check for specific Supabase errors in the error object
            const errorMessage = signUpError?.message || '';
            
            if (errorMessage.includes('User already registered') || errorMessage.includes('already registered')) {
                return {
                    success: false,
                    error: 'Email already registered. Try logging in.',
                };
            }
            
            return {
                success: false,
                error: errorMessage || 'Error creating account',
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
            role: 'AppUser', // ✅ FIX 1: AppUser role for normal registered users
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
            console.log('[Registration] Organization ID:', organization.id);
            
            // ✅ FIX: Add user as Admin to organization_members
            console.log('[Registration] Adding user to organization as Admin...');
            console.log('[Registration] User ID:', userId);
            console.log('[Registration] Organization ID:', organization.id);
            
            try {
                const { data: memberData, error: memberError } = await supabase
                    .from('organization_members')
                    .insert({
                        user_id: userId,                // ✅ CORRECT: underscore
                        organization_id: organization.id, // ✅ CORRECT: underscore
                        role: 'Admin',                   // ✅ CORRECT: Capital A
                    })
                    .select();
                
                if (memberError) {
                    console.error('[Registration] ❌ ERROR adding user to organization:', memberError);
                    console.error('[Registration] Error details:', {
                        code: memberError.code,
                        message: memberError.message,
                        details: memberError.details,
                        hint: memberError.hint,
                    });
                    throw new Error(`Failed to add user to organization: ${memberError.message}`);
                }
                
                console.log('[Registration] ✅ User added to organization as Admin:', memberData);
            } catch (error: any) {
                console.error('[Registration] ❌ Unexpected error adding user to organization:', error);
                throw error; // ⚠️ Block registration if this fails
            }
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

        // 5. Save subscription with Stripe data
        if (data.stripeCustomerId) {
            try {
                console.log('[Registration] Creating subscription with Stripe data...');
                await createUserSubscription({
                    userId,
                    planId: data.planId,
                    stripeCustomerId: data.stripeCustomerId,
                    stripeSubscriptionId: data.stripeSubscriptionId,
                    // Expiration calculated automatically (1 month from now)
                });
                console.log('[Registration] Subscription created successfully');
            } catch (error: any) {
                console.error('[Registration] Error creating subscription:', error);
                // Save error state for retry
                if (typeof window !== 'undefined') {
                    localStorage.setItem('pending_subscription', JSON.stringify({
                        userId,
                        planId: data.planId,
                        stripeCustomerId: data.stripeCustomerId,
                        stripeSubscriptionId: data.stripeSubscriptionId,
                    }));
                }
                // Don't fail the entire registration, but log the error
                console.warn('[Registration] Subscription creation failed but user account was created');
            }
        } else {
            console.warn('[Registration] No Stripe customer ID provided, subscription not created');
        }

        console.log('[Registration] Registration completed successfully');

        // 6. Clear draft
        clearRegistrationDraft();

        return {
            success: true,
            userId,
        };
    } catch (error: any) {
        console.error('[Registration] Error completing:', error);
        return {
            success: false,
            error: error.message || 'Error during registration',
        };
    }
}

/**
 * Completes registration from saved draft (after redirect from Stripe)
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
                error: 'No registration draft found',
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
        console.error('[Registration] Error completing from draft:', error);
        return {
            success: false,
            error: error.message || 'Error during registration',
        };
    }
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Checks if draft is complete and ready for payment
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
 * Calculates draft completion percentage
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


import {
    supabase,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    getCurrentUser,
    User
} from '../lib/supabase';
import { UserProfile, Organization, BillingDetails } from '../types';

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Get user profile from database
 */
export async function getProfileFromDB(userId: string): Promise<UserProfile | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !data) return null;

    return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone || '',
        photo: data.photo,
        jobRole: data.job_role || '',
        role: data.role || 'AppUser',
        credits: data.credits || 0,
    };
}

/**
 * Update user profile in database (upsert - creates if not exists)
 */
export async function updateProfileInDB(userId: string, profile: Partial<UserProfile>): Promise<UserProfile | null> {
    if (!supabase) return null;

    // Get current user email for upsert
    const { data: userData } = await supabase.auth.getUser();
    const email = userData?.user?.email || '';

    const updateData: any = {
        id: userId,
        email: email,
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone,
        photo: profile.photo,
        role: profile.role || 'AppUser',
        credits: profile.credits ?? 0,
        updated_at: new Date().toISOString(),
    };

    // Add job_role if provided (column may not exist in older schemas)
    if (profile.jobRole !== undefined) {
        updateData.job_role = profile.jobRole;
    }

    const { data, error } = await supabase
        .from('profiles')
        .upsert(updateData, { onConflict: 'id' })
        .select()
        .single();

    if (error || !data) {
        console.error('[DB] Upsert profile failed:', error);
        return null;
    }

    return {
        id: data.id,
        email: data.email,
        firstName: data.first_name,
        lastName: data.last_name,
        phone: data.phone || '',
        photo: data.photo,
        jobRole: data.job_role || '',
        role: data.role || 'AppUser',
        credits: data.credits || 0,
    };
}

/**
 * Get organization from database
 */
export async function getOrganizationFromDB(userId: string): Promise<Organization | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error || !data) return null;

    return {
        id: data.id,
        name: data.name || '',
        billingEmail: data.billing_email || '',
        language: data.language || 'EN',
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        tier: data.tier,
    };
}

/**
 * Update organization in database (upsert - creates if not exists)
 */
export async function updateOrganizationInDB(userId: string, org: Partial<Organization>): Promise<Organization | null> {
    if (!supabase) return null;

    // First try to get the existing org id
    const { data: existingOrg } = await supabase
        .from('organizations')
        .select('id')
        .eq('user_id', userId)
        .single();

    const upsertData = {
        user_id: userId,
        name: org.name || '',
        billing_email: org.billingEmail || '',
        language: org.language || 'EN',
        timezone: org.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        tier: org.tier || 'silver',
        updated_at: new Date().toISOString(),
    };

    // If existing org, include id for upsert
    if (existingOrg?.id) {
        (upsertData as any).id = existingOrg.id;
    }

    const { data, error } = await supabase
        .from('organizations')
        .upsert(upsertData, { onConflict: 'id' })
        .select()
        .single();

    if (error || !data) {
        console.error('[DB] Upsert organization failed:', error);
        return null;
    }

    return {
        id: data.id,
        name: data.name || '',
        billingEmail: data.billing_email || '',
        language: data.language || 'EN',
        timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        tier: data.tier,
    };
}

/**
 * Get billing details from database
 */
export async function getBillingFromDB(userId: string): Promise<BillingDetails | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('billing_details')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error || !data) return null;

    return {
        legalName: data.legal_name || '',
        vatNumber: data.vat_number || '',
        fiscalCode: data.fiscal_code || '',
        address: data.address || '',
        city: data.city || '',
        zip: data.zip || '',
        country: data.country || '',
        sdiCode: data.sdi_code || '',
        pecEmail: data.pec_email || '',
    };
}

/**
 * Update billing details in database (upsert - creates if not exists)
 */
export async function updateBillingInDB(userId: string, billing: Partial<BillingDetails>): Promise<BillingDetails | null> {
    if (!supabase) return null;

    // First try to get the existing billing id
    const { data: existingBilling } = await supabase
        .from('billing_details')
        .select('id')
        .eq('user_id', userId)
        .single();

    const upsertData = {
        user_id: userId,
        legal_name: billing.legalName || '',
        vat_number: billing.vatNumber || '',
        fiscal_code: billing.fiscalCode || '',
        address: billing.address || '',
        city: billing.city || '',
        zip: billing.zip || '',
        country: billing.country || '',
        sdi_code: billing.sdiCode || '',
        pec_email: billing.pecEmail || '',
        updated_at: new Date().toISOString(),
    };

    if (existingBilling?.id) {
        (upsertData as any).id = existingBilling.id;
    }

    const { data, error } = await supabase
        .from('billing_details')
        .upsert(upsertData, { onConflict: 'id' })
        .select()
        .single();

    if (error || !data) {
        console.error('[DB] Upsert billing failed:', error);
        return null;
    }

    return {
        legalName: data.legal_name || '',
        vatNumber: data.vat_number || '',
        fiscalCode: data.fiscal_code || '',
        address: data.address || '',
        city: data.city || '',
        zip: data.zip || '',
        country: data.country || '',
        sdiCode: data.sdi_code || '',
        pecEmail: data.pec_email || '',
    };
}

// ============================================================================
// AUTH SERVICE (Public API)
// ============================================================================

// Default empty values for fallback
const createDefaultProfile = (user: User | null): UserProfile => ({
    id: user?.id || '',
    firstName: user?.user_metadata?.firstName || '',
    lastName: user?.user_metadata?.lastName || '',
    email: user?.email || '',
    phone: '',
    photo: null,
    role: 'AppUser',
    credits: 0,
});

const createDefaultOrganization = (): Organization => ({
    id: '',
    name: '',
    billingEmail: '',
    language: 'EN',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
});

const createDefaultBillingDetails = (): BillingDetails => ({
    legalName: '',
    vatNumber: '',
    fiscalCode: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    sdiCode: '',
    pecEmail: ''
});

export const authService = {
    /**
     * Sign in with email and password
     */
    signIn: async (credentials: { email: string; password: string }) => {
        const { session, user } = await signInWithEmail(credentials.email, credentials.password);

        // Fetch profile from database
        const profile = user ? await getProfileFromDB(user.id) : null;

        return {
            token: session?.access_token || '',
            user: profile || createDefaultProfile(user),
        };
    },

    /**
     * Sign up with email and password
     */
    signUp: async (data: { email: string; password: string; userProfile?: Partial<UserProfile> }) => {
        const { session, user } = await signUpWithEmail(
            data.email,
            data.password,
            {
                firstName: data.userProfile?.firstName || '',
                lastName: data.userProfile?.lastName || ''
            }
        );

        return {
            token: session?.access_token || '',
            user: { ...createDefaultProfile(user), ...data.userProfile },
        };
    },

    /**
     * Sign out
     */
    signOut: async () => {
        await signOut();
    },

    /**
     * Get current user profile from database
     */
    getUserProfile: async (): Promise<UserProfile> => {
        const user = await getCurrentUser();
        if (!user) return createDefaultProfile(null);

        const profile = await getProfileFromDB(user.id);
        return profile || createDefaultProfile(user);
    },

    /**
     * Get organization from database
     */
    getOrganization: async (): Promise<Organization> => {
        const user = await getCurrentUser();
        if (!user) return createDefaultOrganization();

        const org = await getOrganizationFromDB(user.id);
        return org || createDefaultOrganization();
    },

    /**
     * Get billing details from database
     */
    getBillingDetails: async (): Promise<BillingDetails> => {
        const user = await getCurrentUser();
        if (!user) return createDefaultBillingDetails();

        const billing = await getBillingFromDB(user.id);
        return billing || createDefaultBillingDetails();
    },

    /**
     * Update user profile in database
     */
    updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const updated = await updateProfileInDB(user.id, data);
        return updated || { ...createDefaultProfile(user), ...data };
    },

    /**
     * Update organization in database
     */
    updateOrganization: async (data: Partial<Organization>): Promise<Organization> => {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const updated = await updateOrganizationInDB(user.id, data);
        return updated || { ...createDefaultOrganization(), ...data };
    },

    /**
     * Update billing details in database
     */
    updateBillingDetails: async (data: Partial<BillingDetails>): Promise<BillingDetails> => {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const updated = await updateBillingInDB(user.id, data);
        return updated || { ...createDefaultBillingDetails(), ...data };
    },

    /**
     * Add credits to user account
     */
    addCredits: async (amount: number): Promise<UserProfile> => {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const currentProfile = await getProfileFromDB(user.id);
        const newCredits = (currentProfile?.credits || 0) + amount;

        const updated = await updateProfileInDB(user.id, { credits: newCredits });
        return updated || createDefaultProfile(user);
    },

    /**
     * Consume credits from user account
     */
    consumeCredits: async (amount: number): Promise<boolean> => {
        const user = await getCurrentUser();
        if (!user) throw new Error('Not authenticated');

        const currentProfile = await getProfileFromDB(user.id);
        if (!currentProfile || currentProfile.credits < amount) return false;

        const newCredits = currentProfile.credits - amount;
        await updateProfileInDB(user.id, { credits: newCredits });
        return true;
    },
};

import { createClient, User, Session, AuthError } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Environment variables not configured. Authentication features disabled.'
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ============================================================================
// AUTH HELPERS
// ============================================================================

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(email: string, password: string, metadata?: Record<string, any>) {
  if (!supabase) throw new Error('Supabase not configured');

  console.log('[Supabase] Attempting signup with email:', email);
  console.log('[Supabase] Password length:', password?.length);
  console.log('[Supabase] Metadata:', metadata);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) {
    console.error('[Supabase] Signup error:', error);
    throw error;
  }

  console.log('[Supabase] Signup success:', data);
  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Get the current session
 */
export async function getSession() {
  if (!supabase) return null;

  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  if (!supabase) return null;

  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => { } } } };

  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string) {
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw error;
}

// ============================================================================
// SUBSCRIPTION HELPERS
// ============================================================================

export interface CreateSubscriptionData {
  userId: string;
  planId: number;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  expiresAt?: string;
}

/**
 * Create user subscription in database
 * Subscription expires 1 month from creation by default
 */
export async function createUserSubscription(data: CreateSubscriptionData) {
  if (!supabase) throw new Error('Supabase not configured');

  console.log('[Supabase] Creating user subscription:', data);

  // Calculate expiration date: 1 month from now
  const expiresAt = data.expiresAt || calculateExpirationDate(1);

  const { data: subscription, error } = await supabase
    .from('user_subscriptions')
    .insert({
      user_id: data.userId,
      plan_id: data.planId,
      stripe_customer_id: data.stripeCustomerId,
      stripe_subscription_id: data.stripeSubscriptionId || null,
      status: 'active',
      started_at: new Date().toISOString(),
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Error creating subscription:', error);
    throw error;
  }

  console.log('[Supabase] Subscription created successfully:', subscription);
  return subscription;
}

/**
 * Calculate expiration date from current date
 * @param months Number of months to add
 * @returns ISO date string
 */
function calculateExpirationDate(months: number): string {
  const now = new Date();
  const expiration = new Date(now.setMonth(now.getMonth() + months));
  return expiration.toISOString();
}

// Re-export types for convenience
export type { User, Session, AuthError };

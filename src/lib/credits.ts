/**
 * ========================================
 * UTILITY: Organization Credits Management
 * ========================================
 * 
 * Handles all credit operations for organizations:
 * - Initialize credits for new organizations
 * - Add credits (purchase, subscription, renewal)
 * - Consume credits (workflow execution)
 * - Get current balance
 */

import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('[Credits] Supabase not properly configured');
}

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Initialize credits record for a new organization
 */
export async function initializeOrganizationCredits(
  organizationId: string,
  initialCredits: number = 0
) {
  if (!supabase) {
    console.error('[Credits] Supabase not configured');
    throw new Error('Supabase not configured');
  }

  console.log(`[Credits] Initializing credits for org ${organizationId} with ${initialCredits} credits`);

  const { data, error } = await supabase
    .from('organization_credits')
    .insert({
      organization_id: organizationId,
      balance: initialCredits,
      total_purchased: initialCredits,
      total_consumed: 0,
      last_recharged_at: initialCredits > 0 ? new Date().toISOString() : null
    })
    .select()
    .single();

  if (error) {
    console.error('[Credits] Error initializing credits:', error);
    throw error;
  }

  console.log('[Credits] ✅ Credits initialized:', data);
  return data;
}

/**
 * Add credits to existing balance
 * 
 * @param organizationId - Organization UUID
 * @param creditsToAdd - Amount of credits to add
 * @param source - Source of credits (subscription, purchase, renewal, bonus)
 */
export async function addCreditsToOrganization(
  organizationId: string,
  creditsToAdd: number,
  source: 'subscription' | 'purchase' | 'renewal' | 'bonus' = 'purchase'
) {
  if (!supabase) {
    console.error('[Credits] Supabase not configured');
    throw new Error('Supabase not configured');
  }

  console.log(`[Credits] Adding ${creditsToAdd} credits to ${organizationId} (source: ${source})`);

  // 1. Get current balance
  const { data: current, error: fetchError } = await supabase
    .from('organization_credits')
    .select('balance, total_purchased')
    .eq('organization_id', organizationId)
    .single();

  if (fetchError) {
    // If doesn't exist, create it
    if (fetchError.code === 'PGRST116') {
      console.log('[Credits] No record found, creating new one');
      return await initializeOrganizationCredits(organizationId, creditsToAdd);
    }
    console.error('[Credits] Error fetching credits:', fetchError);
    throw fetchError;
  }

  const newBalance = (current?.balance || 0) + creditsToAdd;
  const newTotalPurchased = (current?.total_purchased || 0) + creditsToAdd;

  // 2. Update balance
  const { data, error: updateError } = await supabase
    .from('organization_credits')
    .update({
      balance: newBalance,
      total_purchased: newTotalPurchased,
      last_recharged_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('organization_id', organizationId)
    .select()
    .single();

  if (updateError) {
    console.error('[Credits] Error updating credits:', updateError);
    throw updateError;
  }

  console.log(`[Credits] ✅ Balance updated: ${current?.balance} → ${newBalance} (source: ${source})`);
  return data;
}

/**
 * Consume credits from balance
 * 
 * @param organizationId - Organization UUID
 * @param creditsToConsume - Amount of credits to deduct
 * @param reason - Reason for consumption (e.g., "workflow_execution")
 */
export async function consumeCreditsFromOrganization(
  organizationId: string,
  creditsToConsume: number,
  reason: string = 'workflow_execution'
) {
  if (!supabase) {
    console.error('[Credits] Supabase not configured');
    throw new Error('Supabase not configured');
  }

  console.log(`[Credits] Consuming ${creditsToConsume} credits from ${organizationId} (reason: ${reason})`);

  // 1. Get current balance
  const { data: current, error: fetchError } = await supabase
    .from('organization_credits')
    .select('balance, total_consumed')
    .eq('organization_id', organizationId)
    .single();

  if (fetchError) {
    console.error('[Credits] Error fetching credits:', fetchError);
    throw fetchError;
  }

  const currentBalance = current?.balance || 0;

  // 2. Check if enough balance
  if (currentBalance < creditsToConsume) {
    console.error(`[Credits] Insufficient balance: ${currentBalance} < ${creditsToConsume}`);
    throw new Error(`Insufficient credits: ${currentBalance} available, ${creditsToConsume} required`);
  }

  const newBalance = currentBalance - creditsToConsume;
  const newTotalConsumed = (current?.total_consumed || 0) + creditsToConsume;

  // 3. Update balance
  const { data, error: updateError } = await supabase
    .from('organization_credits')
    .update({
      balance: newBalance,
      total_consumed: newTotalConsumed,
      last_consumed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('organization_id', organizationId)
    .select()
    .single();

  if (updateError) {
    console.error('[Credits] Error updating credits:', updateError);
    throw updateError;
  }

  console.log(`[Credits] ✅ Credits consumed: ${currentBalance} → ${newBalance}`);
  return data;
}

/**
 * Get current balance for an organization
 */
export async function getOrganizationBalance(organizationId: string): Promise<number> {
  if (!supabase) {
    console.error('[Credits] Supabase not configured');
    return 0;
  }

  const { data, error } = await supabase
    .from('organization_credits')
    .select('balance')
    .eq('organization_id', organizationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No record found, return 0
      console.log('[Credits] No credits record found for organization:', organizationId);
      return 0;
    }
    console.error('[Credits] Error fetching balance:', error);
    return 0;
  }

  return data?.balance || 0;
}

/**
 * Get full credits info for an organization
 */
export async function getOrganizationCreditsInfo(organizationId: string) {
  if (!supabase) {
    console.error('[Credits] Supabase not configured');
    return null;
  }

  const { data, error } = await supabase
    .from('organization_credits')
    .select('*')
    .eq('organization_id', organizationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      console.log('[Credits] No credits record found');
      return null;
    }
    console.error('[Credits] Error fetching credits info:', error);
    return null;
  }

  return data;
}

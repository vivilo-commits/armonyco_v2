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
 * 
 * ⚠️ SECURITY WARNING: This module MUST ONLY be used in server/API context!
 * It requires SUPABASE_SERVICE_ROLE_KEY which should NEVER be exposed to the browser.
 */

import { createClient } from '@supabase/supabase-js';

// ============================================================================
// SAFETY CHECKS: Prevent accidental frontend usage
// ============================================================================

// Check 1: Ensure this is NOT running in browser context
if (typeof window !== 'undefined') {
  throw new Error(
    '[Credits] SECURITY ERROR: This module can ONLY be used in server/API context, not in browser. ' +
    'Credits must be managed through backend APIs (e.g., Stripe webhook, buy-credits API).'
  );
}

// Check 2: Ensure Service Role Key is configured
if (!process.env.SUPABASE_SERVICE_ROLE_KEY && !process.env.SUPABASE_SERVICE_KEY) {
  throw new Error(
    '[Credits] CONFIGURATION ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is not configured. ' +
    'This key is required for credit management operations.'
  );
}

// ============================================================================
// SUPABASE CLIENT INITIALIZATION (Server-side only)
// ============================================================================

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
  console.log('[Credits] ' + '='.repeat(60));
  console.log('[Credits] ⚡ START: addCreditsToOrganization');
  console.log('[Credits] Timestamp:', new Date().toISOString());
  console.log('[Credits] Input parameters:');
  console.log('[Credits]   - organizationId:', organizationId, '(type:', typeof organizationId, ')');
  console.log('[Credits]   - creditsToAdd:', creditsToAdd, '(type:', typeof creditsToAdd, ')');
  console.log('[Credits]   - source:', source);
  console.log('[Credits] ' + '='.repeat(60));
  
  // Validate inputs
  if (!organizationId) {
    console.error('[Credits] ❌ VALIDATION ERROR: Organization ID is missing or invalid');
    console.error('[Credits] Value:', organizationId);
    throw new Error('Organization ID is required');
  }
  
  if (!creditsToAdd || creditsToAdd <= 0) {
    console.error('[Credits] ❌ VALIDATION ERROR: Credits amount is invalid');
    console.error('[Credits] Value:', creditsToAdd);
    throw new Error('Credits amount must be greater than 0');
  }
  
  console.log('[Credits] ✅ Input validation passed');
  
  if (!supabase) {
    console.error('[Credits] ❌ Supabase not configured');
    throw new Error('Supabase not configured');
  }

  try {
    console.log('[Credits] Step 1: Checking if organization_credits record exists...');
    console.log('[Credits] Querying Supabase with organization_id:', organizationId);
    
    const { data: current, error: fetchError } = await supabase
      .from('organization_credits')
      .select('id, balance, total_purchased, total_consumed')
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (fetchError) {
      console.error('[Credits] ❌ Error querying existing record:', fetchError);
      console.error('[Credits] Error code:', fetchError.code);
      console.error('[Credits] Error message:', fetchError.message);
      console.error('[Credits] Error details:', JSON.stringify(fetchError, null, 2));
      throw fetchError;
    }

    console.log('[Credits] Query result:', current);
    console.log('[Credits] Record exists:', !!current);

    // CREATE NEW RECORD
    if (!current) {
      console.log('[Credits] ' + '-'.repeat(50));
      console.log('[Credits] Step 2: NO EXISTING RECORD - Creating new one...');
      console.log('[Credits] Insert data:');
      console.log('[Credits]   - organization_id:', organizationId);
      console.log('[Credits]   - balance:', creditsToAdd);
      console.log('[Credits]   - total_purchased:', creditsToAdd);
      console.log('[Credits]   - total_consumed:', 0);
      console.log('[Credits]   - last_recharged_at:', new Date().toISOString());
      
      const insertData = {
        organization_id: organizationId,
        balance: creditsToAdd,
        total_purchased: creditsToAdd,
        total_consumed: 0,
        last_recharged_at: new Date().toISOString()
      };
      
      console.log('[Credits] Calling Supabase insert...');
      
      const { data: newRecord, error: insertError } = await supabase
        .from('organization_credits')
        .insert(insertData)
        .select()
        .single();
      
      if (insertError) {
        console.error('[Credits] ❌❌❌ INSERT FAILED');
        console.error('[Credits] Error code:', insertError.code);
        console.error('[Credits] Error message:', insertError.message);
        console.error('[Credits] Error details:', JSON.stringify(insertError, null, 2));
        console.error('[Credits] Insert data was:', JSON.stringify(insertData, null, 2));
        throw insertError;
      }
      
      console.log('[Credits] ✅✅✅ SUCCESS: NEW RECORD CREATED');
      console.log('[Credits] Created record:', JSON.stringify(newRecord, null, 2));
      console.log('[Credits] Record ID:', newRecord?.id);
      console.log('[Credits] Balance:', newRecord?.balance);
      console.log('[Credits] ' + '='.repeat(60));
      console.log('[Credits] ⚡ END: addCreditsToOrganization');
      console.log('[Credits] ' + '='.repeat(60));
      
      return newRecord;
    }

    // UPDATE EXISTING RECORD
    console.log('[Credits] ' + '-'.repeat(50));
    console.log('[Credits] Step 2: EXISTING RECORD FOUND - Updating balance...');
    console.log('[Credits] Current values:');
    console.log('[Credits]   - balance:', current.balance);
    console.log('[Credits]   - total_purchased:', current.total_purchased);
    
    const newBalance = (current.balance || 0) + creditsToAdd;
    const newTotalPurchased = (current.total_purchased || 0) + creditsToAdd;
    
    console.log('[Credits] Calculated new values:');
    console.log('[Credits]   - new balance:', newBalance, `(${current.balance} + ${creditsToAdd})`);
    console.log('[Credits]   - new total_purchased:', newTotalPurchased);

    const updateData = {
      balance: newBalance,
      total_purchased: newTotalPurchased,
      last_recharged_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('[Credits] Calling Supabase update...');

    const { data: updatedRecord, error: updateError } = await supabase
      .from('organization_credits')
      .update(updateData)
      .eq('organization_id', organizationId)
      .select()
      .single();

    if (updateError) {
      console.error('[Credits] ❌❌❌ UPDATE FAILED');
      console.error('[Credits] Error code:', updateError.code);
      console.error('[Credits] Error message:', updateError.message);
      console.error('[Credits] Error details:', JSON.stringify(updateError, null, 2));
      console.error('[Credits] Update data was:', JSON.stringify(updateData, null, 2));
      throw updateError;
    }

    console.log('[Credits] ✅✅✅ SUCCESS: RECORD UPDATED');
    console.log('[Credits] Updated record:', JSON.stringify(updatedRecord, null, 2));
    console.log('[Credits] New balance:', updatedRecord?.balance);
    console.log('[Credits] ' + '='.repeat(60));
    console.log('[Credits] ⚡ END: addCreditsToOrganization');
    console.log('[Credits] ' + '='.repeat(60));
    
    return updatedRecord;
    
  } catch (error: any) {
    console.error('[Credits] ' + '='.repeat(60));
    console.error('[Credits] ❌❌❌ FATAL ERROR in addCreditsToOrganization');
    console.error('[Credits] Error type:', error?.constructor?.name);
    console.error('[Credits] Error:', error);
    console.error('[Credits] Error message:', error?.message);
    console.error('[Credits] Error stack:', error?.stack);
    console.error('[Credits] ' + '='.repeat(60));
    throw error;
  }
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
    .maybeSingle();

  if (error) {
    console.error('[Credits] Error fetching balance:', error);
    return 0;
  }

  // If data is null (record doesn't exist), return 0
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
    .maybeSingle();

  if (error) {
    console.error('[Credits] Error fetching credits info:', error);
    return null;
  }

  // If data is null (record doesn't exist), return null
  return data;
}

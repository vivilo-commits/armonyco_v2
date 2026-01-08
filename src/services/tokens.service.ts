/**
 * TOKENS SERVICE
 * Complete token system management for subscriptions
 * 
 * Formula: tokens = credits × 100
 * Example: STARTER Plan (25000 credits) = 2,500,000 tokens
 */

import { supabase, getCurrentUser } from '../lib/supabase';
import type {
  UserTokens,
  TokenBalance,
  TokenTransaction,
  AddTokensParams,
  ConsumeTokensParams,
  TokenHistoryFilters,
  TokenTransactionType,
} from '../types/tokens.types';

// ============================================================================
// CONSTANTS
// ============================================================================

export const TOKENS_PER_CREDIT = 100;

/**
 * Calculates tokens from credits
 */
export function calculateTokensFromCredits(credits: number): number {
  return credits * TOKENS_PER_CREDIT;
}

/**
 * Calculates credits from tokens
 */
export function calculateCreditsFromTokens(tokens: number): number {
  return Math.floor(tokens / TOKENS_PER_CREDIT);
}

// ============================================================================
// GET TOKEN BALANCE
// ============================================================================

/**
 * Gets current token balance for user
 */
export async function getUserTokens(userId?: string): Promise<TokenBalance | null> {
  if (!supabase) {
    console.error('[Tokens] Supabase not configured');
    return null;
  }

  try {
    // If userId not provided, use current user
    const targetUserId = userId || (await getCurrentUser())?.id;
    
    if (!targetUserId) {
      console.error('[Tokens] No user provided');
      return null;
    }

    const { data, error } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    if (error) {
      // If user doesn't have a token record yet, return 0
      if (error.code === 'PGRST116') {
        return {
          userId: targetUserId,
          tokens: 0,
          lastUpdated: new Date().toISOString(),
        };
      }
      
      console.error('[Tokens] Error retrieving balance:', error);
      return null;
    }

    return {
      userId: data.user_id,
      tokens: data.tokens,
      lastUpdated: data.updated_at,
    };
  } catch (error) {
    console.error('[Tokens] Error getUserTokens:', error);
    return null;
  }
}

/**
 * Gets current user's token balance
 */
export async function getCurrentUserTokens(): Promise<number> {
  const balance = await getUserTokens();
  return balance?.tokens || 0;
}

/**
 * Checks if user has enough tokens
 */
export async function hasEnoughTokens(amount: number, userId?: string): Promise<boolean> {
  const balance = await getUserTokens(userId);
  return balance ? balance.tokens >= amount : false;
}

// ============================================================================
// ADD TOKENS
// ============================================================================

/**
 * Adds tokens to user balance
 * NOTE: This function requires service_role permissions
 */
export async function addTokens(params: AddTokensParams): Promise<boolean> {
  if (!supabase) {
    console.error('[Tokens] Supabase not configured');
    return false;
  }

  try {
    const { userId, amount, transactionType, description, referenceId, metadata } = params;

    if (amount <= 0) {
      console.error('[Tokens] Amount must be positive');
      return false;
    }

    // Get current balance
    const currentBalance = await getUserTokens(userId);
    const balanceBefore = currentBalance?.tokens || 0;
    const balanceAfter = balanceBefore + amount;

    // Update or create user_tokens record
    const { error: upsertError } = await supabase
      .from('user_tokens')
      .upsert({
        user_id: userId,
        tokens: balanceAfter,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (upsertError) {
      console.error('[Tokens] Error updating balance:', upsertError);
      return false;
    }

    // Record transaction in history (if table exists)
    try {
      await supabase
        .from('token_history')
        .insert({
          user_id: userId,
          amount,
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          transaction_type: transactionType,
          description,
          reference_id: referenceId,
          metadata,
        });
    } catch (historyError) {
      // If token_history table doesn't exist, ignore error
      console.warn('[Tokens] History not available (optional table)');
    }

    console.log(`[Tokens] Added ${amount} tokens to user ${userId}. New balance: ${balanceAfter}`);
    return true;
  } catch (error) {
    console.error('[Tokens] Error addTokens:', error);
    return false;
  }
}

/**
 * Adds tokens from subscription (helper)
 */
export async function addTokensFromSubscription(
  userId: string,
  credits: number,
  transactionType: 'subscription_initial' | 'subscription_renewal' | 'subscription_upgrade' | 'subscription_downgrade',
  planName: string,
  subscriptionId?: string
): Promise<boolean> {
  const tokens = calculateTokensFromCredits(credits);
  
  return addTokens({
    userId,
    amount: tokens,
    transactionType,
    description: `${planName} - ${transactionType === 'subscription_initial' ? 'Initial subscription' : 
                   transactionType === 'subscription_renewal' ? 'Monthly renewal' : 
                   transactionType === 'subscription_upgrade' ? 'Plan upgrade' : 'Plan downgrade'}`,
    referenceId: subscriptionId,
    metadata: {
      plan: planName,
      credits,
      tokens,
    },
  });
}

// ============================================================================
// CONSUME TOKENS
// ============================================================================

/**
 * Consumes tokens from user balance
 * NOTE: This function requires service_role permissions
 */
export async function consumeTokens(params: ConsumeTokensParams): Promise<boolean> {
  if (!supabase) {
    console.error('[Tokens] Supabase not configured');
    return false;
  }

  try {
    const { userId, amount, action, metadata } = params;

    if (amount <= 0) {
      console.error('[Tokens] Amount must be positive');
      return false;
    }

    // Check available balance
    const hasTokens = await hasEnoughTokens(amount, userId);
    if (!hasTokens) {
      console.error('[Tokens] Insufficient balance');
      return false;
    }

    // Get current balance
    const currentBalance = await getUserTokens(userId);
    const balanceBefore = currentBalance?.tokens || 0;
    const balanceAfter = balanceBefore - amount;

    // Update balance
    const { error: updateError } = await supabase
      .from('user_tokens')
      .update({
        tokens: balanceAfter,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('[Tokens] Error updating balance:', updateError);
      return false;
    }

    // Record transaction in history (if table exists)
    try {
      await supabase
        .from('token_history')
        .insert({
          user_id: userId,
          amount: -amount, // Negative for consumption
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          transaction_type: 'consumption',
          description: `Consumption: ${action}`,
          metadata: {
            action,
            ...metadata,
          },
        });
    } catch (historyError) {
      console.warn('[Tokens] History not available (optional table)');
    }

    console.log(`[Tokens] Consumed ${amount} tokens from user ${userId}. New balance: ${balanceAfter}`);
    return true;
  } catch (error) {
    console.error('[Tokens] Error consumeTokens:', error);
    return false;
  }
}

// ============================================================================
// TOKEN HISTORY
// ============================================================================

/**
 * Gets user's token transaction history
 */
export async function getTokenHistory(filters: TokenHistoryFilters): Promise<TokenTransaction[]> {
  if (!supabase) {
    console.error('[Tokens] Supabase not configured');
    return [];
  }

  try {
    const { userId, startDate, endDate, transactionType, limit = 50, offset = 0 } = filters;

    let query = supabase
      .from('token_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    if (transactionType) {
      query = query.eq('transaction_type', transactionType);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[Tokens] Error retrieving history:', error);
      return [];
    }

    return (data || []).map(record => ({
      id: record.id,
      userId: record.user_id,
      amount: record.amount,
      balanceBefore: record.balance_before,
      balanceAfter: record.balance_after,
      transactionType: record.transaction_type,
      description: record.description,
      referenceId: record.reference_id,
      metadata: record.metadata,
      createdAt: record.created_at,
    }));
  } catch (error) {
    console.error('[Tokens] Error getTokenHistory:', error);
    return [];
  }
}

/**
 * Gets token statistics for period
 */
export async function getTokenStats(userId: string, startDate?: string): Promise<{
  totalAdded: number;
  totalConsumed: number;
  netChange: number;
  transactionCount: number;
}> {
  try {
    const filters: TokenHistoryFilters = {
      userId,
      startDate,
      limit: 1000, // High limit for statistics
    };

    const history = await getTokenHistory(filters);

    const stats = history.reduce(
      (acc, transaction) => {
        if (transaction.amount > 0) {
          acc.totalAdded += transaction.amount;
        } else {
          acc.totalConsumed += Math.abs(transaction.amount);
        }
        acc.transactionCount++;
        return acc;
      },
      { totalAdded: 0, totalConsumed: 0, transactionCount: 0, netChange: 0 }
    );

    stats.netChange = stats.totalAdded - stats.totalConsumed;

    return stats;
  } catch (error) {
    console.error('[Tokens] Error getTokenStats:', error);
    return { totalAdded: 0, totalConsumed: 0, netChange: 0, transactionCount: 0 };
  }
}

// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

/**
 * Manual token adjustment (admin only)
 */
export async function adminAdjustTokens(
  userId: string,
  amount: number,
  reason: string,
  adminId: string
): Promise<boolean> {
  return addTokens({
    userId,
    amount,
    transactionType: 'manual_adjustment',
    description: `Manual adjustment: ${reason}`,
    metadata: {
      admin_id: adminId,
      reason,
    },
  });
}

// ============================================================================
// EXPORT SERVICE
// ============================================================================

export const tokensService = {
  // Utilities
  calculateTokensFromCredits,
  calculateCreditsFromTokens,
  TOKENS_PER_CREDIT,

  // Balance
  getUserTokens,
  getCurrentUserTokens,
  hasEnoughTokens,

  // Transactions
  addTokens,
  addTokensFromSubscription,
  consumeTokens,

  // History
  getTokenHistory,
  getTokenStats,

  // Admin
  adminAdjustTokens,
};


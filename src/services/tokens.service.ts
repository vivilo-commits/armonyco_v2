/**
 * TOKENS SERVICE
 * Gestione completa del sistema di tokens per abbonamenti
 * 
 * Formula: tokens = credits × 100
 * Esempio: Piano STARTER (25000 credits) = 2,500,000 tokens
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
 * Calcola tokens da credits
 */
export function calculateTokensFromCredits(credits: number): number {
  return credits * TOKENS_PER_CREDIT;
}

/**
 * Calcola credits da tokens
 */
export function calculateCreditsFromTokens(tokens: number): number {
  return Math.floor(tokens / TOKENS_PER_CREDIT);
}

// ============================================================================
// GET TOKEN BALANCE
// ============================================================================

/**
 * Ottiene il saldo tokens corrente dell'utente
 */
export async function getUserTokens(userId?: string): Promise<TokenBalance | null> {
  if (!supabase) {
    console.error('[Tokens] Supabase non configurato');
    return null;
  }

  try {
    // Se userId non è fornito, usa l'utente corrente
    const targetUserId = userId || (await getCurrentUser())?.id;
    
    if (!targetUserId) {
      console.error('[Tokens] Nessun utente fornito');
      return null;
    }

    const { data, error } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('user_id', targetUserId)
      .single();

    if (error) {
      // Se l'utente non ha ancora un record tokens, ritorna 0
      if (error.code === 'PGRST116') {
        return {
          userId: targetUserId,
          tokens: 0,
          lastUpdated: new Date().toISOString(),
        };
      }
      
      console.error('[Tokens] Errore recupero saldo:', error);
      return null;
    }

    return {
      userId: data.user_id,
      tokens: data.tokens,
      lastUpdated: data.updated_at,
    };
  } catch (error) {
    console.error('[Tokens] Errore getUserTokens:', error);
    return null;
  }
}

/**
 * Ottiene il saldo tokens dell'utente corrente
 */
export async function getCurrentUserTokens(): Promise<number> {
  const balance = await getUserTokens();
  return balance?.tokens || 0;
}

/**
 * Verifica se l'utente ha abbastanza tokens
 */
export async function hasEnoughTokens(amount: number, userId?: string): Promise<boolean> {
  const balance = await getUserTokens(userId);
  return balance ? balance.tokens >= amount : false;
}

// ============================================================================
// ADD TOKENS
// ============================================================================

/**
 * Aggiunge tokens al saldo dell'utente
 * NOTA: Questa funzione richiede permessi service_role
 */
export async function addTokens(params: AddTokensParams): Promise<boolean> {
  if (!supabase) {
    console.error('[Tokens] Supabase non configurato');
    return false;
  }

  try {
    const { userId, amount, transactionType, description, referenceId, metadata } = params;

    if (amount <= 0) {
      console.error('[Tokens] Amount deve essere positivo');
      return false;
    }

    // Ottieni saldo corrente
    const currentBalance = await getUserTokens(userId);
    const balanceBefore = currentBalance?.tokens || 0;
    const balanceAfter = balanceBefore + amount;

    // Aggiorna o crea record user_tokens
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
      console.error('[Tokens] Errore aggiornamento saldo:', upsertError);
      return false;
    }

    // Registra transazione nello storico (se tabella esiste)
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
      // Se la tabella token_history non esiste, ignora l'errore
      console.warn('[Tokens] Storico non disponibile (tabella opzionale)');
    }

    console.log(`[Tokens] Aggiunti ${amount} tokens a utente ${userId}. Nuovo saldo: ${balanceAfter}`);
    return true;
  } catch (error) {
    console.error('[Tokens] Errore addTokens:', error);
    return false;
  }
}

/**
 * Aggiunge tokens da sottoscrizione (helper)
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
    description: `${planName} - ${transactionType === 'subscription_initial' ? 'Sottoscrizione iniziale' : 
                   transactionType === 'subscription_renewal' ? 'Rinnovo mensile' : 
                   transactionType === 'subscription_upgrade' ? 'Upgrade piano' : 'Downgrade piano'}`,
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
 * Consuma tokens dal saldo dell'utente
 * NOTA: Questa funzione richiede permessi service_role
 */
export async function consumeTokens(params: ConsumeTokensParams): Promise<boolean> {
  if (!supabase) {
    console.error('[Tokens] Supabase non configurato');
    return false;
  }

  try {
    const { userId, amount, action, metadata } = params;

    if (amount <= 0) {
      console.error('[Tokens] Amount deve essere positivo');
      return false;
    }

    // Verifica saldo disponibile
    const hasTokens = await hasEnoughTokens(amount, userId);
    if (!hasTokens) {
      console.error('[Tokens] Saldo insufficiente');
      return false;
    }

    // Ottieni saldo corrente
    const currentBalance = await getUserTokens(userId);
    const balanceBefore = currentBalance?.tokens || 0;
    const balanceAfter = balanceBefore - amount;

    // Aggiorna saldo
    const { error: updateError } = await supabase
      .from('user_tokens')
      .update({
        tokens: balanceAfter,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('[Tokens] Errore aggiornamento saldo:', updateError);
      return false;
    }

    // Registra transazione nello storico (se tabella esiste)
    try {
      await supabase
        .from('token_history')
        .insert({
          user_id: userId,
          amount: -amount, // Negativo per consumo
          balance_before: balanceBefore,
          balance_after: balanceAfter,
          transaction_type: 'consumption',
          description: `Consumo: ${action}`,
          metadata: {
            action,
            ...metadata,
          },
        });
    } catch (historyError) {
      console.warn('[Tokens] Storico non disponibile (tabella opzionale)');
    }

    console.log(`[Tokens] Consumati ${amount} tokens da utente ${userId}. Nuovo saldo: ${balanceAfter}`);
    return true;
  } catch (error) {
    console.error('[Tokens] Errore consumeTokens:', error);
    return false;
  }
}

// ============================================================================
// TOKEN HISTORY
// ============================================================================

/**
 * Ottiene lo storico transazioni tokens dell'utente
 */
export async function getTokenHistory(filters: TokenHistoryFilters): Promise<TokenTransaction[]> {
  if (!supabase) {
    console.error('[Tokens] Supabase non configurato');
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
      console.error('[Tokens] Errore recupero storico:', error);
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
    console.error('[Tokens] Errore getTokenHistory:', error);
    return [];
  }
}

/**
 * Ottiene statistiche tokens per periodo
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
      limit: 1000, // Limite alto per statistiche
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
    console.error('[Tokens] Errore getTokenStats:', error);
    return { totalAdded: 0, totalConsumed: 0, netChange: 0, transactionCount: 0 };
  }
}

// ============================================================================
// ADMIN FUNCTIONS
// ============================================================================

/**
 * Aggiustamento manuale tokens (solo admin)
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
    description: `Aggiustamento manuale: ${reason}`,
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


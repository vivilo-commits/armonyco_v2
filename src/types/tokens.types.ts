/**
 * TOKENS TYPES
 * TypeScript interfaces per il sistema di tokens
 */

export interface UserTokens {
  id: string;
  userId: string;
  tokens: number;
  createdAt: string;
  updatedAt: string;
}

export interface TokenBalance {
  userId: string;
  tokens: number;
  lastUpdated: string;
}

export type TokenTransactionType =
  | 'subscription_initial'
  | 'subscription_renewal'
  | 'subscription_upgrade'
  | 'subscription_downgrade'
  | 'manual_adjustment'
  | 'consumption'
  | 'refund';

export interface TokenTransaction {
  id: string;
  userId: string;
  amount: number; // Positivo per aggiunte, negativo per consumi
  balanceBefore: number;
  balanceAfter: number;
  transactionType: TokenTransactionType;
  description?: string;
  referenceId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AddTokensParams {
  userId: string;
  amount: number;
  transactionType: TokenTransactionType;
  description?: string;
  referenceId?: string;
  metadata?: Record<string, any>;
}

export interface ConsumeTokensParams {
  userId: string;
  amount: number;
  action: string; // Es: 'decision_analysis', 'report_generation', etc.
  metadata?: Record<string, any>;
}

export interface TokenHistoryFilters {
  userId: string;
  startDate?: string;
  endDate?: string;
  transactionType?: TokenTransactionType;
  limit?: number;
  offset?: number;
}


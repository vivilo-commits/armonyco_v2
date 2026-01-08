/**
 * TOKENS CARD COMPONENT
 * Visualizza il saldo tokens e le informazioni sull'abbonamento
 */

import React, { useEffect, useState } from 'react';
import { Loader } from '../ui/Icons';
import { 
    getCurrentUserTokens, 
    getTokenStats,
    formatTokens 
} from '../../src/services/tokens.service';
import { 
    getUserSubscriptionWithTokens,
    type UserSubscriptionWithTokens 
} from '../../src/services/subscription.service';

interface TokenStats {
    totalAdded: number;
    totalConsumed: number;
    netChange: number;
    transactionCount: number;
}

export const TokensCard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [tokenBalance, setTokenBalance] = useState(0);
    const [subscription, setSubscription] = useState<UserSubscriptionWithTokens | null>(null);
    const [monthlyStats, setMonthlyStats] = useState<TokenStats | null>(null);

    useEffect(() => {
        loadTokenData();
    }, []);

    const loadTokenData = async () => {
        try {
            setLoading(true);

            // Carica dati in parallelo
            const [balance, sub, stats] = await Promise.all([
                getCurrentUserTokens(),
                getUserSubscriptionWithTokens(),
                getTokenStats(
                    (await getUserSubscriptionWithTokens())?.plan.id.toString() || '',
                    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
                ),
            ]);

            setTokenBalance(balance);
            setSubscription(sub);
            setMonthlyStats(stats);
        } catch (error) {
            console.error('[TokensCard] Errore caricamento dati:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const getUsagePercentage = () => {
        if (!monthlyStats || monthlyStats.totalAdded === 0) return 0;
        return Math.min((monthlyStats.totalConsumed / monthlyStats.totalAdded) * 100, 100);
    };

    if (loading) {
        return (
            <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-8">
                <div className="flex items-center justify-center">
                    <Loader className="animate-spin text-[var(--color-brand-accent)]" size={32} />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-[var(--color-brand-accent)]/10 to-[var(--color-brand-accent)]/5 rounded-2xl border-2 border-[var(--color-brand-accent)]/30 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-sm uppercase font-black tracking-wider text-[var(--color-text-muted)]">
                        Saldo Tokens
                    </h2>
                    {subscription && (
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                            Piano {subscription.plan.name}
                        </p>
                    )}
                </div>
                <div className="w-12 h-12 rounded-full bg-[var(--color-brand-accent)] flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                </div>
            </div>

            {/* Saldo Principale */}
            <div className="text-center py-6 bg-[var(--color-surface)]/50 rounded-xl border border-[var(--color-border)]">
                <p className="text-5xl font-black text-[var(--color-text-main)] mb-2">
                    {formatTokens(tokenBalance)}
                </p>
                <p className="text-xs uppercase font-black tracking-wider text-[var(--color-brand-accent)]">
                    Tokens Disponibili
                </p>
            </div>

            {/* Statistiche Mensili */}
            {monthlyStats && (
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[var(--color-surface)]/50 rounded-xl p-4 border border-[var(--color-border)]">
                        <p className="text-xs text-[var(--color-text-muted)] mb-1">
                            Ricevuti questo mese
                        </p>
                        <p className="text-2xl font-bold text-emerald-400">
                            +{formatTokens(monthlyStats.totalAdded)}
                        </p>
                    </div>
                    <div className="bg-[var(--color-surface)]/50 rounded-xl p-4 border border-[var(--color-border)]">
                        <p className="text-xs text-[var(--color-text-muted)] mb-1">
                            Consumati questo mese
                        </p>
                        <p className="text-2xl font-bold text-orange-400">
                            -{formatTokens(monthlyStats.totalConsumed)}
                        </p>
                    </div>
                </div>
            )}

            {/* Barra Utilizzo */}
            {monthlyStats && monthlyStats.totalAdded > 0 && (
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-[var(--color-text-muted)]">
                            Utilizzo mensile
                        </span>
                        <span className="text-xs font-bold text-[var(--color-text-main)]">
                            {getUsagePercentage().toFixed(1)}%
                        </span>
                    </div>
                    <div className="h-2 bg-[var(--color-surface)] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-[var(--color-brand-accent)] transition-all duration-500"
                            style={{ width: `${getUsagePercentage()}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Info Abbonamento */}
            {subscription && (
                <div className="border-t border-[var(--color-border)] pt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-text-muted)]">
                            Tokens mensili:
                        </span>
                        <span className="font-bold text-[var(--color-brand-accent)]">
                            +{formatTokens(subscription.tokensPerMonth)}
                        </span>
                    </div>
                    
                    {subscription.expiresAt && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--color-text-muted)]">
                                Prossimo rinnovo:
                            </span>
                            <span className="font-medium text-[var(--color-text-main)]">
                                {formatDate(subscription.expiresAt)}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-text-muted)]">
                            Status:
                        </span>
                        <span className={`
                            font-bold uppercase text-xs px-2 py-1 rounded
                            ${subscription.status === 'active' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-orange-500/20 text-orange-400'}
                        `}>
                            {subscription.status === 'active' ? '✓ Attivo' : '⚠ Non attivo'}
                        </span>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-xs text-[var(--color-text-muted)]">
                    <strong className="text-blue-400">ℹ️ Nota:</strong> I tokens si accumulano ogni mese 
                    e non scadono mai. Puoi utilizzarli quando vuoi!
                </p>
            </div>
        </div>
    );
};


/**
 * TOKENS HISTORY MODAL
 * Mostra lo storico completo delle transazioni tokens (opzionale)
 */

import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { Loader } from '../ui/Icons';
import { 
    getTokenHistory,
    formatTokens,
    type TokenTransaction 
} from '../../src/services/tokens.service';
import { getCurrentUser } from '../../src/lib/supabase';

interface TokensHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TRANSACTION_TYPE_LABELS: Record<string, string> = {
    subscription_initial: '🎉 Sottoscrizione Iniziale',
    subscription_renewal: '🔄 Rinnovo Mensile',
    subscription_upgrade: '⬆️ Upgrade Piano',
    subscription_downgrade: '⬇️ Downgrade Piano',
    manual_adjustment: '⚙️ Aggiustamento Manuale',
    consumption: '📉 Consumo',
    refund: '↩️ Rimborso',
};

export const TokensHistoryModal: React.FC<TokensHistoryModalProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<TokenTransaction[]>([]);

    useEffect(() => {
        if (isOpen) {
            loadHistory();
        }
    }, [isOpen]);

    const loadHistory = async () => {
        try {
            setLoading(true);
            const user = await getCurrentUser();
            if (!user) return;

            const history = await getTokenHistory({
                userId: user.id,
                limit: 50,
            });

            setTransactions(history);
        } catch (error) {
            console.error('[TokensHistory] Errore caricamento:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('it-IT', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="large">
            <div className="p-6 max-h-[80vh] overflow-y-auto">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-[var(--color-text-main)]">
                        Storico Tokens
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">
                        Tutte le transazioni del tuo account
                    </p>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader className="animate-spin text-[var(--color-brand-accent)]" size={32} />
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-[var(--color-text-muted)]">
                            Nessuna transazione disponibile
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 hover:border-[var(--color-brand-accent)]/50 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    {/* Left: Info */}
                                    <div className="flex-1">
                                        <p className="font-bold text-[var(--color-text-main)] mb-1">
                                            {TRANSACTION_TYPE_LABELS[transaction.transactionType] || transaction.transactionType}
                                        </p>
                                        {transaction.description && (
                                            <p className="text-sm text-[var(--color-text-muted)] mb-2">
                                                {transaction.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-[var(--color-text-muted)]">
                                            {formatDate(transaction.createdAt)}
                                        </p>
                                    </div>

                                    {/* Right: Amount */}
                                    <div className="text-right">
                                        <p className={`text-xl font-bold ${
                                            transaction.amount > 0 
                                                ? 'text-emerald-400' 
                                                : 'text-orange-400'
                                        }`}>
                                            {transaction.amount > 0 ? '+' : ''}
                                            {formatTokens(transaction.amount)}
                                        </p>
                                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                                            Saldo: {formatTokens(transaction.balanceAfter)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-[var(--color-brand-accent)] text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Chiudi
                    </button>
                </div>
            </div>
        </Modal>
    );
};


import React, { useState } from 'react';
import { CheckCircle, AlertCircle, Loader } from './Icons';
import { validateVIES } from '../../src/services/validation.service';
import { Button } from './Button';

interface VATVerifierProps {
    vatNumber: string;
    countryCode: string;
    onVerified?: (companyName?: string, address?: string) => void;
    className?: string;
}

export const VATVerifier: React.FC<VATVerifierProps> = ({
    vatNumber,
    countryCode,
    onVerified,
    className = '',
}) => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [result, setResult] = useState<{
        verified: boolean;
        companyName?: string;
        error?: string;
    } | null>(null);

    const handleVerify = async () => {
        if (!vatNumber || !countryCode) {
            setResult({
                verified: false,
                error: 'Inserisci P.IVA e nazione',
            });
            return;
        }

        setIsVerifying(true);
        setResult(null);

        try {
            const viesResult = await validateVIES(vatNumber, countryCode);

            if (viesResult.valid) {
                setResult({
                    verified: true,
                    companyName: viesResult.companyName,
                });

                // Callback per pre-compilare campi
                if (onVerified && viesResult.companyName) {
                    onVerified(viesResult.companyName, viesResult.companyAddress);
                }
            } else {
                setResult({
                    verified: false,
                    error: viesResult.error || 'P.IVA non valida',
                });
            }
        } catch (error: any) {
            setResult({
                verified: false,
                error: error.message || 'Errore verifica',
            });
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {/* Button verifica */}
            <Button
                variant="secondary"
                onClick={handleVerify}
                disabled={isVerifying || !vatNumber}
                leftIcon={isVerifying ? <Loader size={16} className="animate-spin" /> : undefined}
                className="w-full sm:w-auto"
            >
                {isVerifying ? 'Verifica in corso...' : 'Verifica P.IVA su VIES'}
            </Button>

            {/* Risultato verifica */}
            {result && (
                <div
                    className={`
                        p-3 rounded-lg border flex items-start gap-3 text-sm
                        ${result.verified
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : result.error?.includes('backend') || result.error?.includes('browser')
                                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                : 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                        }
                    `}
                >
                    {result.verified ? (
                        <CheckCircle size={20} className="shrink-0 mt-0.5" />
                    ) : (
                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    )}

                    <div className="flex-1">
                        {result.verified ? (
                            <>
                                <p className="font-bold mb-1">✓ Verifica completata</p>
                                {result.companyName && (
                                    <p className="text-xs opacity-80">
                                        Ragione sociale: {result.companyName}
                                    </p>
                                )}
                                {result.error && (
                                    <p className="text-xs opacity-80 mt-1">
                                        ℹ️ {result.error}
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <p className="font-bold mb-1">
                                    {result.error?.includes('backend') || result.error?.includes('browser') 
                                        ? 'ℹ️ Verifica non disponibile' 
                                        : '⚠️ Attenzione'}
                                </p>
                                <p className="text-xs opacity-80">
                                    {result.error}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Info tooltip */}
            <p className="text-[10px] text-[var(--color-text-muted)] italic">
                ℹ️ La verifica VIES europea richiede un backend (blocco CORS dal browser).
                La verifica è opzionale - puoi comunque procedere con la registrazione.
            </p>
        </div>
    );
};


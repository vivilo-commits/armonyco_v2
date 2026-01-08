import React from 'react';
import { validatePasswordStrength } from '../../src/services/validation.service';

interface PasswordStrengthMeterProps {
    password: string;
    className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password, className = '' }) => {
    const result = validatePasswordStrength(password);

    if (!password) {
        return null;
    }

    // Colori basati sullo score
    const colors = [
        'bg-red-500',      // 0 - Molto debole
        'bg-orange-500',   // 1 - Debole
        'bg-yellow-500',   // 2 - Media
        'bg-lime-500',     // 3 - Forte
        'bg-emerald-500',  // 4 - Molto forte
    ];

    const textColors = [
        'text-red-400',
        'text-orange-400',
        'text-yellow-400',
        'text-lime-400',
        'text-emerald-400',
    ];

    const barColor = colors[result.score] || colors[0];
    const textColor = textColors[result.score] || textColors[0];
    const barWidth = result.valid ? `${((result.score + 1) / 5) * 100}%` : '20%';

    return (
        <div className={`space-y-2 ${className}`}>
            {/* Barra di progresso */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                    className={`h-full ${barColor} transition-all duration-300 ease-out`}
                    style={{ width: barWidth }}
                />
            </div>

            {/* Feedback testuale */}
            <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${textColor}`}>
                    {result.feedback}
                </span>
                {result.valid && (
                    <span className="text-emerald-400 font-bold">✓</span>
                )}
            </div>

            {/* Requisiti */}
            {!result.valid && (
                <div className="text-[10px] text-[var(--color-text-muted)] space-y-1">
                    <p>Requisiti obbligatori:</p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                        <li className={password.length >= 8 ? 'text-emerald-400' : ''}>
                            Minimo 8 caratteri
                        </li>
                        <li className={/[A-Z]/.test(password) ? 'text-emerald-400' : ''}>
                            Almeno 1 lettera maiuscola
                        </li>
                        <li className={/[0-9]/.test(password) ? 'text-emerald-400' : ''}>
                            Almeno 1 numero
                        </li>
                        <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-emerald-400' : ''}>
                            Almeno 1 carattere speciale (!@#$%...)
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};


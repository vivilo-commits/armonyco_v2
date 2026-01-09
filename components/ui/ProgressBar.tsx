import React from 'react';
import { CheckCircle } from './Icons';

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    stepTitles: string[];
    className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    currentStep,
    totalSteps,
    stepTitles,
    className = '',
}) => {
    return (
        <div className={`w-full ${className}`}>
            {/* Titolo step corrente */}
            <div className="text-center mb-4">
                <p className="text-sm text-[var(--color-text-muted)] font-medium">
                    Step {currentStep} di {totalSteps}
                </p>
                <h3 className="text-lg font-bold text-[var(--color-text-main)] mt-1">
                    {stepTitles[currentStep - 1] || 'Registrazione'}
                </h3>
            </div>

            {/* Barra di progresso */}
            <div className="flex items-center justify-between gap-2">
                {Array.from({ length: totalSteps }).map((_, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;
                    const isFuture = stepNumber > currentStep;

                    return (
                        <React.Fragment key={stepNumber}>
                            {/* Cerchio step */}
                            <div className="flex flex-col items-center gap-1 flex-1">
                                <div
                                    className={`
                                        w-10 h-10 rounded-full flex items-center justify-center 
                                        font-bold text-sm transition-all duration-300
                                        ${isCompleted
                                            ? 'bg-emerald-500 text-white scale-100'
                                            : isCurrent
                                                ? 'bg-[var(--color-brand-accent)] text-black scale-110 shadow-lg'
                                                : 'bg-white/5 text-[var(--color-text-muted)] scale-90'
                                        }
                                    `}
                                >
                                    {isCompleted ? (
                                        <CheckCircle size={20} />
                                    ) : (
                                        <span>{stepNumber}</span>
                                    )}
                                </div>

                                {/* Label (solo desktop) */}
                                <span
                                    className={`
                                        hidden md:block text-[9px] uppercase font-black tracking-wider text-center
                                        ${isCurrent ? 'text-[var(--color-brand-accent)]' : 'text-[var(--color-text-muted)]'}
                                    `}
                                >
                                    {stepTitles[index]?.split(' ')[0] || `Step ${stepNumber}`}
                                </span>
                            </div>

                            {/* Linea connettrice */}
                            {index < totalSteps - 1 && (
                                <div
                                    className={`
                                        h-1 flex-1 rounded-full transition-all duration-300
                                        ${isCompleted ? 'bg-emerald-500' : 'bg-white/10'}
                                    `}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};



import React from 'react';
import { Search } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    startIcon?: React.ReactNode;
    floating?: boolean;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    startIcon,
    floating = true,
    className = '',
    id,
    ...props
}) => {
    // Generate a random ID if not provided, for the label association
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className={`relative w-full group ${className}`}>
            {/* Icon Position */}
            {startIcon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none z-10 transition-colors group-focus-within:text-[var(--color-brand-accent)]">
                    {startIcon}
                </div>
            )}

            <input
                id={inputId}
                placeholder=" " // Required for peer-placeholder-shown
                className={`
          block w-full 
          rounded-xl border 
          bg-transparent 
          px-4 py-3 
          text-sm text-[var(--color-text-main)]
          transition-all duration-200 
          focus:outline-none focus:ring-0
          peer
          ${error
                        ? 'border-[var(--color-error)] focus:border-[var(--color-error)]'
                        : 'border-[var(--color-border)] focus:border-[var(--color-brand-accent)]'
                    }
          ${startIcon ? 'pl-10' : ''}
          ${floating ? 'pt-4 pb-2 h-[50px]' : 'h-10'}
        `}
                {...props}
            />

            {/* Label */}
            {label && floating && (
                <label
                    htmlFor={inputId}
                    className={`
            absolute 
            text-[var(--color-text-muted)] 
            duration-200 transform 
            top-[15px]
            z-10 origin-[0] 
            pointer-events-none
            ${startIcon ? 'left-10' : 'left-4'}
            peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0
            peer-focus:scale-75 
            peer-focus:-translate-y-3
            peer-focus:text-[var(--color-brand-accent)]
            peer-focus:font-bold
            peer-[&:not(:placeholder-shown)]:scale-75
            peer-[&:not(:placeholder-shown)]:-translate-y-3
          `}
                >
                    {label}
                </label>
            )}

            {/* Non-floating fallback (standard label) */}
            {label && !floating && (
                <label htmlFor={inputId} className="absolute -top-6 left-0 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                    {label}
                </label>
            )}

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-xs text-[var(--color-error)]">{error}</p>
            )}
        </div>
    );
};

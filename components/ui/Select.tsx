import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: SelectOption[];
    error?: string;
    startIcon?: React.ReactNode;
    floating?: boolean;
}

export const Select: React.FC<SelectProps> = ({
    label,
    options,
    error,
    startIcon,
    floating = true,
    className = '',
    id,
    ...props
}) => {
    const internalId = React.useId();
    const selectId = id || internalId;

    return (
        <div className={`relative w-full group ${className}`}>
            {/* Icon Position */}
            {startIcon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none z-10">
                    {startIcon}
                </div>
            )}

            <select
                id={selectId}
                className={`
          block w-full 
          rounded-xl border 
          bg-transparent 
          px-4 py-3 
          text-sm text-[var(--color-text-main)]
          appearance-none
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
            >
                <option value="" disabled selected hidden></option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {/* Custom Chevron */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <ChevronDown size={16} />
            </div>

            {/* Label */}
            {label && floating && (
                <label
                    htmlFor={selectId}
                    className={`
            absolute 
            text-[var(--color-text-muted)] 
            duration-200 transform 
            top-[15px]
            z-10 origin-[0] 
            pointer-events-none
            ${startIcon ? 'left-10' : 'left-4'}
            peer-focus:scale-75 
            peer-focus:-translate-y-3
            peer-focus:text-[var(--color-brand-accent)]
            peer-focus:font-bold
            /* For select, we rely on the value being present or focused to keep the label up. 
               Since native select placeholder check is tricky, we often force the label state if value is present. */
            ${props.value ? 'scale-75 -translate-y-3' : 'scale-100 translate-y-0'}
          `}
                >
                    {label}
                </label>
            )}

            {/* Non-floating fallback */}
            {label && !floating && (
                <label htmlFor={selectId} className="absolute -top-6 left-0 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                    {label}
                </label>
            )}

            {error && (
                <p className="mt-1 text-xs text-[var(--color-error)]">{error}</p>
            )}
        </div>
    );
};

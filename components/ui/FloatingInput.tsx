import React from 'react';

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  startIcon?: React.ReactNode;
  bgClass?: string; // Matches the container background
  labelClass?: string;
  error?: string; // Error message to display
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  startIcon,
  bgClass = 'bg-[var(--color-surface)]',
  labelClass = '',
  className = '',
  error,
  ...props
}) => {
  return (
    <div className="relative w-full">
      <div className="relative w-full group">
        {startIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none z-10 transition-colors group-focus-within:text-[var(--color-brand-accent)]">
            {startIcon}
          </div>
        )}

        <input
          {...props}
          placeholder=" " // Necessary for peer-placeholder-shown to work
          className={`
            block w-full rounded-2xl border bg-transparent px-4 h-[50px] text-sm text-[var(--color-text-main)] 
            focus:outline-none focus:ring-0 transition-all duration-200 peer
            ${error 
              ? 'border-red-400 focus:border-red-400' 
              : 'border-[var(--color-border)] focus:border-[var(--color-brand-accent)]'
            }
            ${startIcon ? 'pl-10' : ''}
            ${className}
          `}
        />

        <label
          className={`
            absolute duration-200 transform 
            -translate-y-4 scale-75 top-2 z-10 origin-[0] 
            ${startIcon ? 'left-10' : 'left-4'}
            peer-placeholder-shown:scale-100 
            peer-placeholder-shown:translate-y-0 
            peer-placeholder-shown:top-[14px] 
            peer-focus:top-2 
            peer-focus:-translate-y-4 
            peer-focus:scale-75 
            peer-focus:font-medium
            pointer-events-none
            px-1
            ${bgClass}
            ${error 
              ? 'text-red-400 peer-focus:text-red-400' 
              : 'text-[var(--color-text-muted)] peer-focus:text-[var(--color-brand-accent)]'
            }
            ${labelClass}
          `}
        >
          {label}
        </label>
      </div>

      {/* Error message */}
      {error && (
        <p className="text-xs text-red-400 mt-1.5 ml-1 animate-in fade-in duration-200">
          {error}
        </p>
      )}
    </div>
  );
};
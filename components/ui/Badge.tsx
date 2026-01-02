import React from 'react';

export interface BadgeProps {
    variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'error';
    label: string;
    dot?: boolean;
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    variant = 'neutral',
    label,
    dot = false,
    className = ''
}) => {
    const variants = {
        neutral: "bg-stone-100 text-[var(--color-text-muted)] border-stone-200",
        brand: "bg-[rgba(197,165,114,0.1)] text-[var(--color-brand-accent)] border-[rgba(197,165,114,0.2)]",
        success: "bg-[var(--color-success-bg)] text-[var(--color-success)] border-[var(--color-success-border)]",
        warning: "bg-[var(--color-warning-bg)] text-[var(--color-warning)] border-[var(--color-warning-border)]",
        error: "bg-[var(--color-error-bg)] text-[var(--color-error)] border-[var(--color-error-border)]"
    };

    const dotColors = {
        neutral: "bg-stone-400",
        brand: "bg-[var(--color-brand-accent)]",
        success: "bg-[var(--color-success)]",
        warning: "bg-[var(--color-warning)]",
        error: "bg-[var(--color-error)]"
    };

    return (
        <span className={`
      inline-flex items-center gap-1.5 
      px-2.5 py-0.5 
      rounded-full 
      text-[10px] font-bold uppercase tracking-widest 
      border
      ${variants[variant]}
      ${className}
    `}>
            {dot && (
                <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} ${variant === 'success' ? 'animate-pulse' : ''}`} />
            )}
            {label}
        </span>
    );
};

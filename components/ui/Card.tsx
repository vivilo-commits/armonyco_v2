import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'dark' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    overflowHidden?: boolean;
}

export const Card: React.FC<CardProps> = ({
    variant = 'default',
    padding = 'md',
    hover = false,
    overflowHidden = true,
    className = '',
    children,
    ...props
}) => {

    const variants = {
        default: "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-main)]",
        dark: "bg-[var(--color-brand-primary)] border border-white/5 text-white shadow-2xl",
        glass: "bg-white/[0.03] backdrop-blur-xl border border-white/10 text-white"
    };

    const paddings = {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8 md:p-10"
    };

    const hoverEffects = hover
        ? "transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] hover:border-[var(--color-brand-accent)]/30 motion-safe:transform-gpu"
        : "";

    return (
        <div
            className={`
        rounded-2xl
        shadow-sm
        ${overflowHidden ? 'overflow-hidden' : ''}
        ${variants[variant]}
        ${paddings[padding]}
        ${hoverEffects}
        ${className}
      `}
            {...props}
        >
            {children}
        </div>
    );
};

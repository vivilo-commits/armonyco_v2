import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className = '',
    children,
    disabled,
    ...props
}) => {
    // Base Styles
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg whitespace-nowrap";

    // Height/Padding Config (using pixel values or standard utility classes mapping to standard spacing)
    const sizes = {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-[50px] px-6 text-base"
    };

    // Variant Config - Utilizing CSS Variables defined in index.css
    // using style={{ backgroundColor: 'var(--color-brand-accent)' }} could be safer if tailwind classes aren't mapped
    // But assuming basic tailwind generic classes work or using inline styles for strictness

    const variants = {
        primary: "bg-[var(--color-brand-accent)] text-white hover:bg-[var(--color-brand-accent-hover)] border border-transparent shadow-sm",
        secondary: "bg-[var(--color-surface)] text-[var(--color-text-main)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-border-hover)] shadow-sm",
        ghost: "bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] border border-transparent",
        danger: "bg-[var(--color-error)] text-white hover:bg-red-600 border border-transparent shadow-sm"
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
        <button
            className={`
        ${baseStyles} 
        ${sizes[size]} 
        ${variants[variant]} 
        ${widthClass} 
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    );
};

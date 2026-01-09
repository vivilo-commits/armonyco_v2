import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ReactDOM from 'react-dom';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    width = 'md',
    showCloseButton = true
}) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);

    useEffect(() => {
        if (isOpen) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShouldRender(true);
            // Small delay to allow render before animation starts
            requestAnimationFrame(() => setIsAnimating(true));
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => setShouldRender(false), 300); // Match transition duration
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!shouldRender) return null;

    const widths = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-2xl',
        '2xl': 'max-w-7xl',
        full: 'max-w-5xl'
    };

    // Portal to body (optional, but good practice for modals)
    // For simplicity and strictness we can render inline if needed, but portal is safer for stacking contexts.
    // Assuming standard React setup.

    const content = (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto py-16 md:py-20 scrollbar-hide">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-[var(--color-background)]/60 backdrop-blur-md transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            {/* Modal Card */}
            <div
                className={`
          relative w-full ${widths[width]}
          bg-[var(--color-surface)] 
          border border-white/10 
          rounded-[2rem] 
          shadow-2xl
          overflow-hidden 
          transform transition-all duration-300 
          ${isAnimating ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'}
        `}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
                        {title && <h3 className="text-[var(--text-lg)] font-medium text-[var(--color-text-main)]">{title}</h3>}
                        {!title && <div />} {/* Spacer if no title but close button */}

                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Content */}
                <div className="p-0">
                    {children}
                </div>
            </div>
        </div>
    );

    return ReactDOM.createPortal(content, document.body);
};

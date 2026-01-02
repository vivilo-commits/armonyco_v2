import React, { useState } from 'react';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Premium Tooltip component with a liquid glass aesthetic.
 * Replaces default browser tooltips.
 */
export const Tooltip: React.FC<TooltipProps> = ({ text, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className={`
                    absolute ${positionClasses[position]} z-[100]
                    px-3 py-1.5 rounded-lg
                    bg-black/90 backdrop-blur-md border border-white/20
                    shadow-2xl animate-fade-in
                    whitespace-nowrap pointer-events-none
                `}>
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-tight">
                        {text}
                    </p>
                    {/* Tiny Arrow */}
                    <div className={`
                        absolute w-0 h-0 border-4
                        ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 border-t-black/90 border-x-transparent border-b-transparent' : ''}
                        ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 border-b-black/90 border-x-transparent border-t-transparent' : ''}
                        ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 border-l-black/90 border-y-transparent border-r-transparent' : ''}
                        ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 border-r-black/90 border-y-transparent border-l-transparent' : ''}
                    `} />
                </div>
            )}
        </div>
    );
};

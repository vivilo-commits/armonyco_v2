import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  variant?: 'light' | 'dark';
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  variant = 'light', 
  className = '', 
  hoverEffect = false,
  onClick,
  id
}) => {
  
  // Base Glass Styles
  const baseStyles = "relative overflow-hidden rounded-[24px] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] border";
  
  // Variants
  const lightStyles = "bg-white/60 border-white/40 shadow-glass text-stone-900";
  const darkStyles = "bg-[#151514]/90 border-white/10 shadow-lg text-white";
  
  // Hover Effects
  const hoverStyles = hoverEffect 
    ? "hover:scale-[1.01] hover:shadow-glass-hover hover:bg-white/70 hover:border-white/60 cursor-pointer" 
    : "";

  const darkHoverStyles = hoverEffect
    ? "hover:scale-[1.01] hover:shadow-xl hover:bg-[#151514] hover:border-white/20 cursor-pointer"
    : "";

  const finalStyles = `
    ${baseStyles}
    ${variant === 'dark' ? darkStyles : lightStyles}
    ${variant === 'dark' ? darkHoverStyles : hoverStyles}
    ${className}
  `;

  return (
    <div id={id} className={finalStyles} onClick={onClick}>
      {/* Subtle Specular Highlight / Shine for that 'Liquid' feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
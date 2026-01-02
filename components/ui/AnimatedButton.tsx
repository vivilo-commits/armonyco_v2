import React from 'react';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?: React.ReactNode;
  width?: string;
  variant?: 'dark' | 'light' | 'danger';
  expanded?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text,
  icon,
  width = '140px',
  variant = 'dark',
  expanded = false,
  className = '',
  ...props
}) => {
  const variantClass = variant === 'light' ? 'light' : variant === 'danger' ? 'danger' : '';
  const expandedClass = expanded ? 'expanded' : '';

  return (
    <button
      className={`ui-btn-animated ${variantClass} ${expandedClass} ${className}`}
      style={{ '--hover-width': width } as React.CSSProperties}
      {...props}
    >
      {icon && (
        <div className="sign">
          {icon}
        </div>
      )}
      <div className={`text ${!icon ? '!w-full !right-auto !text-center !px-4' : ''}`}>
        {text}
      </div>
    </button>
  );
};
import React from 'react';

export interface FeierabendCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'premium' | 'flat';
  hoverable?: boolean;
}

export const FeierabendCard = React.forwardRef<HTMLDivElement, FeierabendCardProps>(
  ({ variant = 'default', hoverable = false, className = '', children, ...props }, ref) => {
    const baseClasses = 'rounded-2xl transition-all duration-300';
    
    const variantClasses = {
      default: 'bg-white shadow-soft border border-gray-200',
      premium: 'bg-gradient-to-br from-white to-gray-50 border-2 border-feierabend-blue-300 shadow-premium',
      flat: 'bg-white',
    };
    
    const hoverClasses = hoverable 
      ? 'hover:shadow-hover hover:-translate-y-1 hover:border-feierabend-blue-200 cursor-pointer' 
      : '';
    
    return (
      <div
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FeierabendCard.displayName = 'FeierabendCard';

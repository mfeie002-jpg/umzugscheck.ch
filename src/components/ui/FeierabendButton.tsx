import React from 'react';
import { Loader2 } from 'lucide-react';

export interface FeierabendButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

export const FeierabendButton = React.forwardRef<HTMLButtonElement, FeierabendButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    icon, 
    loading = false, 
    fullWidth = false,
    className = '',
    children,
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center gap-2 font-accent font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-feierabend-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantClasses = {
      primary: 'bg-feierabend-orange-600 text-white shadow-[0_4px_12px_rgba(255,107,53,0.25)] hover:bg-feierabend-orange-500 hover:shadow-[0_6px_20px_rgba(255,107,53,0.35)] hover:-translate-y-0.5 active:translate-y-0',
      secondary: 'bg-white text-feierabend-blue-700 border-2 border-feierabend-blue-300 hover:border-feierabend-blue-500 hover:bg-feierabend-blue-50 hover:-translate-y-0.5 active:translate-y-0',
      text: 'bg-transparent text-feierabend-blue-500 hover:underline font-medium',
    };
    
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-8 py-3.5 text-base',
      lg: 'px-10 py-4 text-lg',
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : icon ? (
          <span className="flex-shrink-0">{icon}</span>
        ) : null}
        {children}
      </button>
    );
  }
);

FeierabendButton.displayName = 'FeierabendButton';

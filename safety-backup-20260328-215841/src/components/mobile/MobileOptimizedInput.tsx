import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface MobileOptimizedInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const MobileOptimizedInput = forwardRef<HTMLInputElement, MobileOptimizedInputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium mb-1.5 text-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              // Base styles
              'w-full rounded-xl border border-input bg-background',
              // Touch-friendly sizing
              'h-12 sm:h-11 px-4 text-base sm:text-sm',
              // Focus states
              'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
              // Disable zoom on iOS
              'text-[16px] sm:text-sm',
              // Icon padding
              icon && 'pl-10',
              // Error state
              error && 'border-destructive focus:ring-destructive/20',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

MobileOptimizedInput.displayName = 'MobileOptimizedInput';

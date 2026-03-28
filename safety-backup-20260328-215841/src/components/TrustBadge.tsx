import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TrustBadgeProps {
  icon?: ReactNode;
  label?: string;
  text?: string;
  variant?: 'default' | 'compact' | 'large';
  className?: string;
  children?: ReactNode;
}

export const TrustBadge = ({ 
  icon, 
  label, 
  text,
  variant = 'default',
  className,
  children 
}: TrustBadgeProps) => {
  const displayText = label || text || children;
  
  return (
    <div 
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/80 backdrop-blur-sm",
        variant === 'compact' && "px-2 py-1 text-xs",
        variant === 'default' && "px-3 py-1.5 text-sm",
        variant === 'large' && "px-4 py-2 text-base",
        className
      )}
    >
      {icon && (
        <span className="flex-shrink-0 text-primary">
          {icon}
        </span>
      )}
      {displayText && (
        <span className="font-medium text-foreground/80">
          {displayText}
        </span>
      )}
    </div>
  );
};

export default TrustBadge;

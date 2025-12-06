import { memo } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'primary' | 'secondary' | 'success';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const variantStyles = {
  default: "bg-foreground",
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-emerald-500"
};

const sizeStyles = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3"
};

/**
 * Simple progress bar component
 */
export const ProgressBar = memo(({ 
  value, 
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  className 
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  return (
    <div className={cn("w-full", className)}>
      <div 
        className={cn(
          "w-full bg-muted rounded-full overflow-hidden",
          sizeStyles[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantStyles[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground mt-1 block text-right">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

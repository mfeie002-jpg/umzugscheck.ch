import { memo } from "react";
import { cn } from "@/lib/utils";

interface PulseDotProps {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorVariants = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  destructive: "bg-destructive"
};

const sizeVariants = {
  sm: "w-2 h-2",
  md: "w-3 h-3",
  lg: "w-4 h-4"
};

/**
 * Animated pulsing dot for live indicators
 */
export const PulseDot = memo(({ 
  color = 'success',
  size = 'md',
  className 
}: PulseDotProps) => {
  return (
    <span className={cn("relative inline-flex", className)}>
      <span 
        className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          colorVariants[color]
        )} 
        aria-hidden="true"
      />
      <span 
        className={cn(
          "relative inline-flex rounded-full",
          colorVariants[color],
          sizeVariants[size]
        )} 
      />
    </span>
  );
});

PulseDot.displayName = 'PulseDot';

import { memo, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface IconBoxProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'muted';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const variantStyles = {
  default: "bg-card border border-border text-foreground",
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-emerald-500/10 text-emerald-600",
  muted: "bg-muted text-muted-foreground"
};

const sizeStyles = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
  xl: "w-14 h-14"
};

const roundedStyles = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full"
};

/**
 * Consistent icon container box
 */
export const IconBox = memo(({ 
  children, 
  variant = 'primary',
  size = 'md',
  rounded = 'lg',
  className 
}: IconBoxProps) => {
  return (
    <div 
      className={cn(
        "flex items-center justify-center flex-shrink-0",
        variantStyles[variant],
        sizeStyles[size],
        roundedStyles[rounded],
        className
      )}
    >
      {children}
    </div>
  );
});

IconBox.displayName = 'IconBox';

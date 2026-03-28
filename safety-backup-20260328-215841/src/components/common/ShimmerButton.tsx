import { memo, forwardRef } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps extends ButtonProps {
  shimmerColor?: string;
}

export const ShimmerButton = memo(forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, children, shimmerColor = "rgba(255,255,255,0.3)", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden",
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <span
          className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"
          style={{ 
            background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)` 
          }}
        />
      </Button>
    );
  }
));

ShimmerButton.displayName = 'ShimmerButton';

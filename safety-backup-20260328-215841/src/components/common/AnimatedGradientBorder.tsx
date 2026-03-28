import { memo } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientBorderProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
  animate?: boolean;
}

export const AnimatedGradientBorder = memo(function AnimatedGradientBorder({
  children,
  className,
  borderWidth = 2,
  animate = true
}: AnimatedGradientBorderProps) {
  return (
    <div className={cn("relative group", className)}>
      <div 
        className={cn(
          "absolute -inset-px rounded-inherit bg-gradient-to-r from-secondary via-primary to-secondary",
          animate && "animate-gradient-x"
        )}
        style={{ 
          padding: borderWidth,
          backgroundSize: "200% 200%"
        }}
      />
      <div className="relative bg-card rounded-inherit h-full">
        {children}
      </div>
    </div>
  );
});

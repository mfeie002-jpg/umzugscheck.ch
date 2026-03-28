import { memo } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard = memo(({ 
  children, 
  className = "",
  hover = true
}: GlassCardProps) => {
  return (
    <div
      className={cn(
        "relative bg-white/80 dark:bg-card/80 backdrop-blur-lg border border-white/20 dark:border-border/20 rounded-xl shadow-soft",
        hover && "transition-all duration-300 hover:shadow-medium hover:border-primary/20 hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
});

GlassCard.displayName = 'GlassCard';

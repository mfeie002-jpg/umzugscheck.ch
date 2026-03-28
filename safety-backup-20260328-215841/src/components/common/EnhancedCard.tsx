import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface EnhancedCardProps {
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}

export const EnhancedCard = ({ 
  className, 
  hover = true, 
  gradient = false, 
  children,
  onClick 
}: EnhancedCardProps) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-border/50 bg-card text-card-foreground shadow-premium",
        hover && "transition-shadow hover:shadow-lift hover:border-primary/20 cursor-pointer",
        gradient && "bg-gradient-to-br from-card to-muted/30",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

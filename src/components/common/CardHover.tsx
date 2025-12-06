import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardHoverProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverY?: number;
}

export const CardHover = memo(({
  children,
  className,
  hoverScale = 1,
  hoverY = -6
}: CardHoverProps) => {
  return (
    <motion.div
      whileHover={{ 
        y: hoverY,
        scale: hoverScale
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "bg-card rounded-xl border border-border/50 shadow-soft hover:shadow-medium hover:border-primary/20 transition-colors",
        className
      )}
    >
      {children}
    </motion.div>
  );
});

CardHover.displayName = 'CardHover';

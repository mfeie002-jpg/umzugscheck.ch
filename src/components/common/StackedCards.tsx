import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

interface StackedCardsProps {
  cards: ReactNode[];
  className?: string;
}

export const StackedCards = memo(function StackedCards({
  cards,
  className
}: StackedCardsProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Simplified rendering on mobile - just show the top card
  if (isMobile) {
    return (
      <div className={cn("relative", className)}>
        <div className="rounded-2xl border border-border/50 bg-card">
          {cards[cards.length - 1]}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {cards.map((card, i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute inset-0 rounded-2xl border border-border/50 bg-card",
            i === cards.length - 1 && "relative"
          )}
          style={{
            zIndex: i,
            transformOrigin: "center bottom"
          }}
          initial={{ y: 0, scale: 1 - (cards.length - 1 - i) * 0.05 }}
          whileHover={
            prefersReducedMotion ? {} : (
              i === cards.length - 1
                ? { y: -8, scale: 1.02 }
                : { scale: 1 - (cards.length - 1 - i) * 0.03 }
            )
          }
          transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 300 }}
        >
          {i === cards.length - 1 && card}
        </motion.div>
      ))}
    </div>
  );
});

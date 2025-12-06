import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StackedCardsProps {
  cards: ReactNode[];
  className?: string;
}

export const StackedCards = memo(function StackedCards({
  cards,
  className
}: StackedCardsProps) {
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
            i === cards.length - 1
              ? { y: -8, scale: 1.02 }
              : { scale: 1 - (cards.length - 1 - i) * 0.03 }
          }
          transition={{ type: "spring", stiffness: 300 }}
        >
          {i === cards.length - 1 && card}
        </motion.div>
      ))}
    </div>
  );
});

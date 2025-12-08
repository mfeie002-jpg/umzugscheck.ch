import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, ArrowUp, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedArrowProps {
  direction?: "right" | "down" | "up";
  variant?: "arrow" | "chevron";
  className?: string;
  size?: number;
}

export const AnimatedArrow = memo(function AnimatedArrow({
  direction = "right",
  variant = "arrow",
  className,
  size = 20
}: AnimatedArrowProps) {
  const icons = {
    right: variant === "arrow" ? ArrowRight : ChevronRight,
    down: ArrowDown,
    up: ArrowUp,
  };
  
  const Icon = icons[direction];
  
  const animations = {
    right: { x: [0, 5, 0] },
    down: { y: [0, 5, 0] },
    up: { y: [0, -5, 0] },
  };

  return (
    <motion.span
      className={cn("inline-flex", className)}
      animate={animations[direction]}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    >
      <Icon size={size} />
    </motion.span>
  );
});

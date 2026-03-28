import { memo } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollProgressProps {
  className?: string;
  color?: string;
  height?: number;
  position?: "top" | "bottom";
}

export const ScrollProgress = memo(function ScrollProgress({
  className,
  height = 3,
  position = "top"
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className={cn(
        "fixed left-0 right-0 z-50 origin-left bg-gradient-to-r from-secondary via-primary to-secondary",
        position === "top" ? "top-0" : "bottom-0",
        className
      )}
      style={{
        scaleX,
        height
      }}
    />
  );
});

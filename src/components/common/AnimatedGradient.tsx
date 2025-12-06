import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientProps {
  className?: string;
  colors?: [string, string, string];
}

export const AnimatedGradient = memo(function AnimatedGradient({ 
  className,
  colors = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--primary))"]
}: AnimatedGradientProps) {
  return (
    <motion.div
      className={cn("absolute inset-0 opacity-30", className)}
      style={{
        background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
        backgroundSize: "200% 100%"
      }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
});

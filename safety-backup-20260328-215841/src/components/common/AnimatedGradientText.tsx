import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  duration?: number;
}

export const AnimatedGradientText = memo(function AnimatedGradientText({
  children,
  className,
  colors = ["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--primary))"],
  duration = 3
}: AnimatedGradientTextProps) {
  return (
    <motion.span
      className={cn(
        "inline-block bg-clip-text text-transparent bg-gradient-to-r bg-[length:200%_auto]",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`
      }}
      animate={{
        backgroundPosition: ["0% center", "200% center"]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {children}
    </motion.span>
  );
});
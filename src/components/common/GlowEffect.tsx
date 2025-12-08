import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowEffectProps {
  children: ReactNode;
  className?: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export const GlowEffect = memo(function GlowEffect({
  children,
  className,
  color = "hsl(var(--primary))",
  size = "md",
  animated = true
}: GlowEffectProps) {
  const sizeClasses = {
    sm: "blur-lg",
    md: "blur-2xl",
    lg: "blur-3xl"
  };

  return (
    <div className={cn("relative", className)}>
      <motion.div
        className={cn(
          "absolute inset-0 opacity-30 -z-10",
          sizeClasses[size]
        )}
        style={{ background: color }}
        animate={animated ? {
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2]
        } : undefined}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      {children}
    </div>
  );
});
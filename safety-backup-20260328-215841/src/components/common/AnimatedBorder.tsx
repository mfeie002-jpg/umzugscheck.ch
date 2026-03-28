import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBorderProps {
  children: ReactNode;
  className?: string;
  borderRadius?: string;
  duration?: number;
}

export const AnimatedBorder = memo(function AnimatedBorder({
  children,
  className,
  borderRadius = "1rem",
  duration = 4
}: AnimatedBorderProps) {
  return (
    <div
      className={cn("relative p-[2px] overflow-hidden", className)}
      style={{ borderRadius }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: "conic-gradient(from 0deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--primary)))",
          borderRadius
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <div
        className="relative bg-card h-full"
        style={{ borderRadius: `calc(${borderRadius} - 2px)` }}
      >
        {children}
      </div>
    </div>
  );
});
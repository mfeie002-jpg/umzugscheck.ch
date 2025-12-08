import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientBorderCardProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
  animated?: boolean;
}

export const GradientBorderCard = memo(function GradientBorderCard({
  children,
  className,
  borderWidth = 2,
  animated = true
}: GradientBorderCardProps) {
  return (
    <div className={cn("relative rounded-2xl p-[2px] group", className)}>
      {/* Gradient Border */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary"
        style={{ padding: borderWidth }}
        animate={animated ? {
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        } : undefined}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Content */}
      <div className="relative bg-card rounded-2xl h-full">
        {children}
      </div>
    </div>
  );
});
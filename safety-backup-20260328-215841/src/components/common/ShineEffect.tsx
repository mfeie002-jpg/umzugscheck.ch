import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShineEffectProps {
  children: ReactNode;
  className?: string;
  duration?: number;
}

export const ShineEffect = memo(function ShineEffect({
  children,
  className,
  duration = 3
}: ShineEffectProps) {
  return (
    <div className={cn("relative overflow-hidden group", className)}>
      {children}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
        animate={{
          x: ["-100%", "200%"]
        }}
        transition={{
          duration,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "linear"
        }}
      />
    </div>
  );
});
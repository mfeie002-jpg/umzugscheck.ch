import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PulseRingProps {
  className?: string;
  size?: number;
  color?: string;
  rings?: number;
}

export const PulseRing = memo(function PulseRing({
  className,
  size = 80,
  color = "border-primary",
  rings = 3
}: PulseRingProps) {
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {Array.from({ length: rings }).map((_, i) => (
        <motion.div
          key={i}
          className={cn("absolute inset-0 rounded-full border-2", color)}
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{
            scale: [0.8, 1.5],
            opacity: [0.8, 0]
          }}
          transition={{
            duration: 2,
            delay: i * 0.4,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      ))}
      <div className={cn("absolute inset-0 rounded-full border-2", color)} />
    </div>
  );
});
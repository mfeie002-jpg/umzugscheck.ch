import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BeamProps {
  className?: string;
  direction?: "horizontal" | "vertical";
}

export const Beam = memo(function Beam({
  className,
  direction = "horizontal"
}: BeamProps) {
  const isHorizontal = direction === "horizontal";

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isHorizontal ? "h-px w-full" : "w-px h-full",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-border to-transparent" />
      <motion.div
        className={cn(
          "absolute bg-gradient-to-r from-transparent via-primary to-transparent",
          isHorizontal ? "h-full w-1/4" : "w-full h-1/4"
        )}
        animate={
          isHorizontal
            ? { x: ["-100%", "400%"] }
            : { y: ["-100%", "400%"] }
        }
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
});

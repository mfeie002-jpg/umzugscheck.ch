import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LiveDotProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "green" | "red" | "yellow" | "blue";
}

export const LiveDot = memo(function LiveDot({
  className,
  size = "md",
  color = "green"
}: LiveDotProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4"
  };

  const colorClasses = {
    green: "bg-green-500",
    red: "bg-red-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500"
  };

  return (
    <span className={cn("relative inline-flex", className)}>
      <motion.span
        className={cn(
          "absolute inline-flex rounded-full opacity-75",
          sizeClasses[size],
          colorClasses[color]
        )}
        animate={{ scale: [1, 1.5, 1], opacity: [0.75, 0, 0.75] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <span
        className={cn(
          "relative inline-flex rounded-full",
          sizeClasses[size],
          colorClasses[color]
        )}
      />
    </span>
  );
});
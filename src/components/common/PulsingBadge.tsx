import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PulsingBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "info" | "live";
  className?: string;
  pulse?: boolean;
}

const variants = {
  success: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800",
  warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800",
  info: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800",
  live: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800",
};

const pulseColors = {
  success: "bg-green-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
  live: "bg-red-500",
};

export const PulsingBadge = memo(function PulsingBadge({
  children,
  variant = "success",
  className,
  pulse = true
}: PulsingBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border",
        variants[variant],
        className
      )}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            pulseColors[variant]
          )} />
          <span className={cn(
            "relative inline-flex rounded-full h-2 w-2",
            pulseColors[variant]
          )} />
        </span>
      )}
      {children}
    </motion.span>
  );
});

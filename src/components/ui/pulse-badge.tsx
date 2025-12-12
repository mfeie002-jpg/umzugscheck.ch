import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PulseBadgeProps {
  children: ReactNode;
  variant?: "success" | "warning" | "info" | "premium";
  pulse?: boolean;
  className?: string;
}

export const PulseBadge = memo(function PulseBadge({
  children,
  variant = "success",
  pulse = true,
  className
}: PulseBadgeProps) {
  const variants = {
    success: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    info: "bg-primary/10 text-primary border-primary/20",
    premium: "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
  };

  const pulseColors = {
    success: "bg-green-500",
    warning: "bg-amber-500",
    info: "bg-primary",
    premium: "bg-amber-500"
  };

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
          <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", pulseColors[variant])} />
          <span className={cn("relative inline-flex rounded-full h-2 w-2", pulseColors[variant])} />
        </span>
      )}
      {children}
    </motion.span>
  );
});

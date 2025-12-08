import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CountBadgeProps {
  count: number;
  className?: string;
  variant?: "default" | "success" | "warning" | "info";
  animated?: boolean;
}

export const CountBadge = memo(function CountBadge({
  count,
  className,
  variant = "default",
  animated = true
}: CountBadgeProps) {
  const variantClasses = {
    default: "bg-primary text-primary-foreground",
    success: "bg-green-500 text-white",
    warning: "bg-amber-500 text-white",
    info: "bg-blue-500 text-white"
  };

  return (
    <motion.span
      className={cn(
        "inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-semibold",
        variantClasses[variant],
        className
      )}
      initial={animated ? { scale: 0 } : undefined}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      key={count}
    >
      {count > 99 ? "99+" : count}
    </motion.span>
  );
});
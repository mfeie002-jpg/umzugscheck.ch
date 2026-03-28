import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BadgeWithIconProps {
  children: ReactNode;
  icon: ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "info" | "premium";
}

export const BadgeWithIcon = memo(function BadgeWithIcon({
  children,
  icon,
  className,
  variant = "default"
}: BadgeWithIconProps) {
  const variantClasses = {
    default: "bg-muted text-foreground",
    success: "bg-green-500/10 text-green-600",
    warning: "bg-amber-500/10 text-amber-600",
    info: "bg-blue-500/10 text-blue-600",
    premium: "bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-amber-600"
  };

  return (
    <motion.span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium",
        variantClasses[variant],
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className="w-4 h-4">{icon}</span>
      {children}
    </motion.span>
  );
});
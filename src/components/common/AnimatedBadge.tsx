import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AnimatedBadgeProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "muted";
  pulse?: boolean;
  className?: string;
}

const variantStyles = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-green-500/10 text-green-600",
  muted: "bg-muted text-muted-foreground"
};

export const AnimatedBadge = memo(({
  icon: Icon,
  children,
  variant = "primary",
  pulse = false,
  className
}: AnimatedBadgeProps) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider",
        variantStyles[variant],
        pulse && "animate-pulse-subtle",
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      {children}
    </motion.span>
  );
});

AnimatedBadge.displayName = 'AnimatedBadge';

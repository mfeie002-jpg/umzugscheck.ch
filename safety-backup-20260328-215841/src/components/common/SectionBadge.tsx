import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  variant?: "default" | "primary" | "secondary" | "outline";
}

export const SectionBadge = memo(function SectionBadge({
  children,
  className,
  icon,
  variant = "default"
}: SectionBadgeProps) {
  const variantClasses = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    outline: "border border-border text-muted-foreground"
  };

  return (
    <motion.span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {icon}
      {children}
    </motion.span>
  );
});
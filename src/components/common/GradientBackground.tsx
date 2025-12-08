import { memo, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "subtle" | "radial";
  animated?: boolean;
}

export const GradientBackground = memo(function GradientBackground({
  children,
  className,
  variant = "subtle",
  animated = false
}: GradientBackgroundProps) {
  const gradients = {
    primary: "bg-gradient-to-br from-primary/10 via-transparent to-secondary/10",
    secondary: "bg-gradient-to-tr from-secondary/10 via-transparent to-primary/10",
    subtle: "bg-gradient-to-b from-muted/50 to-transparent",
    radial: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"
  };

  const content = (
    <div className={cn("relative", gradients[variant], className)}>
      {children}
    </div>
  );

  if (!animated) return content;

  return (
    <motion.div
      className={cn("relative", gradients[variant], className)}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%"]
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "linear"
      }}
    >
      {children}
    </motion.div>
  );
});
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FeatureBadgeProps {
  icon?: LucideIcon;
  text: string;
  variant?: "primary" | "secondary" | "success" | "muted";
  className?: string;
  animated?: boolean;
}

export const FeatureBadge = ({ 
  icon: Icon, 
  text, 
  variant = "primary", 
  className,
  animated = true 
}: FeatureBadgeProps) => {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    success: "bg-success/10 text-success border-success/20",
    muted: "bg-muted text-muted-foreground border-border"
  };

  const Wrapper = animated ? motion.span : "span";
  const animationProps = animated ? {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true }
  } : {};

  return (
    <Wrapper
      {...animationProps}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border",
        variants[variant],
        className
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {text}
    </Wrapper>
  );
};

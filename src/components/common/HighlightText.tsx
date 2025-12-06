import { memo } from "react";
import { cn } from "@/lib/utils";

interface HighlightTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "gradient";
}

export const HighlightText = memo(function HighlightText({ 
  children, 
  className,
  variant = "primary"
}: HighlightTextProps) {
  const variants = {
    primary: "bg-primary/10 text-primary px-1 rounded",
    secondary: "bg-secondary/10 text-secondary px-1 rounded",
    gradient: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
  };

  return (
    <span className={cn(variants[variant], className)}>
      {children}
    </span>
  );
});

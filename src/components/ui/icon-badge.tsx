import { memo } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface IconBadgeProps {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "muted" | "success";
  className?: string;
}

export const IconBadge = memo(function IconBadge({
  icon: Icon,
  size = "md",
  variant = "primary",
  className
}: IconBadgeProps) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const variants = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/10 text-secondary",
    muted: "bg-muted text-muted-foreground",
    success: "bg-green-500/10 text-green-600"
  };

  return (
    <div className={cn(
      "rounded-xl flex items-center justify-center",
      sizes[size],
      variants[variant],
      className
    )}>
      <Icon className={iconSizes[size]} />
    </div>
  );
});

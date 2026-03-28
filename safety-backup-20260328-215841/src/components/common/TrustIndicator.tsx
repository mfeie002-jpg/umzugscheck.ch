import { memo } from "react";
import { Shield, CheckCircle, Star, Users, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface TrustIndicatorProps {
  type: "verified" | "secure" | "rating" | "users" | "award";
  value?: string | number;
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

const icons: Record<string, LucideIcon> = {
  verified: CheckCircle,
  secure: Shield,
  rating: Star,
  users: Users,
  award: Award
};

const colors: Record<string, string> = {
  verified: "text-green-500",
  secure: "text-primary",
  rating: "text-swiss-gold fill-swiss-gold",
  users: "text-secondary",
  award: "text-amber-500"
};

export const TrustIndicator = memo(({
  type,
  value,
  label,
  size = "md",
  className
}: TrustIndicatorProps) => {
  const Icon = icons[type];
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const textSize = size === "sm" ? "text-xs" : "text-sm";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Icon className={cn(iconSize, colors[type])} aria-hidden="true" />
      {value && (
        <span className={cn("font-bold text-foreground", textSize)}>
          {value}
        </span>
      )}
      {label && (
        <span className={cn("text-muted-foreground", textSize)}>
          {label}
        </span>
      )}
    </div>
  );
});

TrustIndicator.displayName = 'TrustIndicator';

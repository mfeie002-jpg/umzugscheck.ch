import { memo } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Shield, CheckCircle2, Star, Award } from "lucide-react";

type BadgeVariant = 'verified' | 'trusted' | 'rated' | 'award';

interface TrustBadgeProps {
  variant?: BadgeVariant;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const badgeConfig: Record<BadgeVariant, { icon: LucideIcon; defaultText: string; color: string }> = {
  verified: { 
    icon: CheckCircle2, 
    defaultText: "Geprüft", 
    color: "text-emerald-600 bg-emerald-50 border-emerald-200" 
  },
  trusted: { 
    icon: Shield, 
    defaultText: "Versichert", 
    color: "text-primary bg-primary/10 border-primary/20" 
  },
  rated: { 
    icon: Star, 
    defaultText: "Top bewertet", 
    color: "text-swiss-gold bg-amber-50 border-amber-200" 
  },
  award: { 
    icon: Award, 
    defaultText: "Ausgezeichnet", 
    color: "text-secondary bg-secondary/10 border-secondary/20" 
  }
};

const sizeClasses = {
  sm: "text-[10px] px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1.5 gap-2"
};

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-4 w-4"
};

export const TrustBadge = memo(({ 
  variant = 'verified',
  text,
  size = 'md',
  className = ""
}: TrustBadgeProps) => {
  const config = badgeConfig[variant];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded-full border",
        sizeClasses[size],
        config.color,
        className
      )}
    >
      <Icon className={cn(iconSizes[size], variant === 'rated' && "fill-current")} />
      {text || config.defaultText}
    </span>
  );
});

TrustBadge.displayName = 'TrustBadge';

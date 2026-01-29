/**
 * GoldenTrustBadges - Reusable trust badges component
 * 
 * Used across CTAs, forms, and conversion points to build trust.
 * Best patterns from all variants:
 * - Outcome-focused badges (Variant D)
 * - Icon + text combo (Variant C)
 * - Swiss-specific trust signals
 */

import { memo } from "react";
import { Shield, Clock, CheckCircle, Lock, Award, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const TRUST_BADGE_CONFIGS = {
  default: [
    { icon: CheckCircle, label: "Kostenlos", color: "text-emerald-600" },
    { icon: Shield, label: "Unverbindlich", color: "text-primary" },
    { icon: Lock, label: "Datenschutz", color: "text-slate-600" },
  ],
  premium: [
    { icon: Award, label: "Geprüfte Partner", color: "text-primary" },
    { icon: Star, label: "4.8/5 Bewertung", color: "text-amber-500" },
    { icon: Clock, label: "24h Antwort", color: "text-emerald-600" },
  ],
  minimal: [
    { icon: CheckCircle, label: "Gratis", color: "text-emerald-600" },
    { icon: Shield, label: "Sicher", color: "text-primary" },
  ],
  form: [
    { icon: Lock, label: "Schweizer Server", color: "text-emerald-600" },
    { icon: Shield, label: "Keine Werbeanrufe", color: "text-primary" },
    { icon: CheckCircle, label: "DSGVO-konform", color: "text-slate-600" },
  ],
};

type BadgePreset = keyof typeof TRUST_BADGE_CONFIGS;

interface GoldenTrustBadgesProps {
  preset?: BadgePreset;
  variant?: "inline" | "stacked" | "pills";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const GoldenTrustBadges = memo(({
  preset = "default",
  variant = "inline",
  size = "sm",
  className
}: GoldenTrustBadgesProps) => {
  const badges = TRUST_BADGE_CONFIGS[preset];

  const sizeClasses = {
    sm: "text-[10px] gap-1",
    md: "text-xs gap-1.5",
    lg: "text-sm gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  if (variant === "pills") {
    return (
      <div className={cn("flex flex-wrap gap-2 justify-center", className)}>
        {badges.map((badge) => (
          <div
            key={badge.label}
            className={cn(
              "inline-flex items-center px-3 py-1.5 rounded-full",
              "bg-muted/50 border border-border/50",
              sizeClasses[size]
            )}
          >
            <badge.icon className={cn(iconSizes[size], badge.color, "mr-1")} />
            <span className="font-medium text-foreground">{badge.label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "stacked") {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        {badges.map((badge) => (
          <div
            key={badge.label}
            className={cn("flex items-center", sizeClasses[size])}
          >
            <badge.icon className={cn(iconSizes[size], badge.color)} />
            <span className="text-muted-foreground ml-1">{badge.label}</span>
          </div>
        ))}
      </div>
    );
  }

  // Default: inline
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-x-4 gap-y-2", className)}>
      {badges.map((badge, idx) => (
        <div
          key={badge.label}
          className={cn("flex items-center", sizeClasses[size])}
        >
          <badge.icon className={cn(iconSizes[size], badge.color, "flex-shrink-0")} />
          <span className="text-muted-foreground ml-1 whitespace-nowrap">{badge.label}</span>
        </div>
      ))}
    </div>
  );
});

GoldenTrustBadges.displayName = "GoldenTrustBadges";

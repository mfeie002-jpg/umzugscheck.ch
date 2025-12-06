import { Shield, CheckCircle, Award, Star, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadgesProps {
  variant?: "light" | "dark" | "minimal";
  className?: string;
  showAll?: boolean;
}

const badges = [
  { icon: Shield, label: "Geprüfte Partner", value: "200+" },
  { icon: Star, label: "Kundenbewertung", value: "4.8/5" },
  { icon: CheckCircle, label: "Kostenlos", value: "100%" },
  { icon: Clock, label: "Schnelle Offerten", value: "24-48h" },
  { icon: Users, label: "Erfolgreiche Umzüge", value: "15'000+" },
  { icon: Award, label: "Swiss Made", value: "" },
];

export const TrustBadges = ({ 
  variant = "light", 
  className,
  showAll = false 
}: TrustBadgesProps) => {
  const displayBadges = showAll ? badges : badges.slice(0, 4);
  
  const baseStyles = "flex items-center gap-1.5 text-sm font-medium";
  const variantStyles = {
    light: "text-muted-foreground",
    dark: "text-primary-foreground/80",
    minimal: "text-foreground/70",
  };

  return (
    <div className={cn(
      "flex flex-wrap items-center justify-center gap-4 md:gap-6",
      className
    )}>
      {displayBadges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <span key={idx} className={cn(baseStyles, variantStyles[variant])}>
            <Icon className="h-4 w-4 flex-shrink-0" />
            {badge.value && <span className="font-bold">{badge.value}</span>}
            <span className="hidden sm:inline">{badge.label}</span>
          </span>
        );
      })}
    </div>
  );
};

export const InlineTrustBadge = ({ 
  icon: Icon, 
  text, 
  className 
}: { 
  icon: React.ElementType; 
  text: string; 
  className?: string;
}) => (
  <span className={cn(
    "inline-flex items-center gap-1.5 text-sm text-muted-foreground",
    className
  )}>
    <Icon className="h-4 w-4 text-emerald-500" />
    {text}
  </span>
);

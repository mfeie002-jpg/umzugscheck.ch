/**
 * TrustFloor - 80px Hero-Abschluss-Balken
 * V4 Best-Of: Visueller Anchor am Ende des Hero-Bereichs
 */

import { memo } from "react";
import { Shield, Star, Clock, Users } from "lucide-react";
import { TRUST } from "@/content/trust";

const FLOOR_ITEMS = [
  {
    icon: Users,
    value: TRUST.movesCount,
    label: "Umzüge vermittelt",
  },
  {
    icon: Star,
    value: `${TRUST.ratingValue}/5`,
    label: `${TRUST.ratingCount.toLocaleString('de-CH')} Bewertungen`,
  },
  {
    icon: Shield,
    value: TRUST.companiesCount,
    label: "Geprüfte Partner",
  },
  {
    icon: Clock,
    value: TRUST.responseTime,
    label: "Antwortzeit",
  },
];

interface TrustFloorProps {
  className?: string;
  variant?: "light" | "dark" | "gradient";
}

export const TrustFloor = memo(({ className = "", variant = "gradient" }: TrustFloorProps) => {
  const variantStyles = {
    light: "bg-muted/50 text-foreground",
    dark: "bg-foreground text-background",
    gradient: "bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 text-foreground",
  };

  return (
    <div className={`h-20 ${variantStyles[variant]} ${className}`}>
      <div className="container mx-auto h-full px-4">
        <div className="h-full flex items-center justify-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-4xl">
            {FLOOR_ITEMS.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-2 md:gap-3 justify-center"
              >
                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0" />
                <div className="text-left">
                  <div className="text-sm md:text-base font-bold leading-tight">
                    {item.value}
                  </div>
                  <div className="text-[10px] md:text-xs text-muted-foreground leading-tight">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

TrustFloor.displayName = "TrustFloor";

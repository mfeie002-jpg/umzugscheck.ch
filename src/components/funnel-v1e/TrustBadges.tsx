/**
 * Trust Badges Component
 * 
 * Displays trust signals: ratings, certifications, social proof
 */

import { memo } from "react";
import { Shield, Star, Users, Award, CheckCircle } from "lucide-react";

interface TrustBadgesProps {
  variant?: "compact" | "full";
  className?: string;
}

export const TrustBadges = memo(function TrustBadges({ 
  variant = "compact",
  className = "" 
}: TrustBadgesProps) {
  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-3 text-[10px] text-muted-foreground ${className}`}>
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="font-medium">4.8/5</span>
          <span className="text-muted-foreground/70">(2'847 Bewertungen)</span>
        </span>
        <span className="hidden sm:flex items-center gap-1">
          <Users className="w-3 h-3 text-primary" />
          <span>12'500+ Umzüge</span>
        </span>
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-green-500" />
          <span>SSL gesichert</span>
        </span>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 ${className}`}>
      <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 text-center">
        <div className="flex items-center gap-1 mb-1">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-lg font-bold">4.8</span>
        </div>
        <span className="text-[10px] text-muted-foreground">2'847 Bewertungen</span>
      </div>
      
      <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 text-center">
        <div className="flex items-center gap-1 mb-1">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-lg font-bold">12'500+</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Erfolgreiche Umzüge</span>
      </div>
      
      <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 text-center">
        <div className="flex items-center gap-1 mb-1">
          <Award className="w-4 h-4 text-secondary" />
          <span className="text-lg font-bold">150+</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Geprüfte Firmen</span>
      </div>
      
      <div className="flex flex-col items-center p-3 rounded-lg bg-muted/50 text-center">
        <div className="flex items-center gap-1 mb-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-lg font-bold">100%</span>
        </div>
        <span className="text-[10px] text-muted-foreground">Kostenlos & unverbindlich</span>
      </div>
    </div>
  );
});

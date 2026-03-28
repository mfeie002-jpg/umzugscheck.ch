/**
 * Trust Bar Component
 * 
 * Slim trust indicator bar for header area
 * Shows key trust signals in minimal space
 */

import { memo } from "react";
import { Shield, Star, Clock, Users, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBarProps {
  variant?: 'header' | 'hero' | 'footer';
  className?: string;
}

const trustItems = [
  { icon: Shield, label: "SSL Verschlüsselt", shortLabel: "Sicher" },
  { icon: Star, label: "4.8/5 Bewertung", shortLabel: "4.8★" },
  { icon: Clock, label: "24h Offerten", shortLabel: "24h" },
  { icon: Users, label: "200+ Partner", shortLabel: "200+" },
  { icon: CheckCircle, label: "Schweizer Service", shortLabel: "CH" },
];

export const TrustBar = memo(function TrustBar({
  variant = 'header',
  className
}: TrustBarProps) {
  if (variant === 'header') {
    return (
      <div className={cn(
        "bg-primary text-primary-foreground py-1.5 px-4",
        className
      )}>
        <div className="container flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
          {trustItems.slice(0, 4).map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <item.icon className="w-3.5 h-3.5 opacity-90" />
              <span className="hidden sm:inline font-medium">{item.label}</span>
              <span className="sm:hidden font-medium">{item.shortLabel}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <div className={cn(
        "flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-4",
        className
      )}>
        {trustItems.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full"
          >
            <item.icon className="w-4 h-4 text-secondary" />
            <span className="text-sm font-medium text-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  // Footer variant
  return (
    <div className={cn(
      "flex flex-wrap items-center justify-center gap-6 py-4 border-t border-border/50",
      className
    )}>
      {trustItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2 text-muted-foreground">
          <item.icon className="w-4 h-4" />
          <span className="text-sm">{item.label}</span>
        </div>
      ))}
    </div>
  );
});

export default TrustBar;

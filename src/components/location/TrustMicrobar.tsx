/**
 * TRUST MICROBAR
 * 
 * Compact trust signals bar for location pages
 * Displays key trust indicators with emojis
 */

import { memo } from "react";
import { cn } from "@/lib/utils";

interface TrustMicrobarProps {
  stats?: {
    providerCount?: number;
    reviewCount?: number;
    avgRating?: number;
  };
  locationName?: string;
  variant?: 'light' | 'dark' | 'card';
  className?: string;
}

const trustItems = [
  { emoji: "🛡️", label: '100% kostenlos & unverbindlich', key: 'free' },
  { emoji: "⏰", label: '3–5 Offerten in 24–48h', key: 'speed' },
  { emoji: "⭐", label: 'Ø 4.9/5 Bewertung', key: 'rating', dynamic: true },
  { emoji: "👥", label: '200+ geprüfte Firmen', key: 'providers', dynamic: true },
];

export const TrustMicrobar = memo(({
  stats,
  locationName,
  variant = 'card',
  className,
}: TrustMicrobarProps) => {
  const getLabel = (item: typeof trustItems[0]) => {
    if (item.key === 'rating' && stats?.avgRating) {
      return `Ø ${stats.avgRating}/5 Bewertung`;
    }
    if (item.key === 'providers' && stats?.providerCount) {
      return `${stats.providerCount}+ geprüfte Firmen`;
    }
    return item.label;
  };

  const bgClass = {
    light: 'bg-white/10 text-white',
    dark: 'bg-muted text-foreground',
    card: 'bg-card border border-border shadow-soft',
  }[variant];

  return (
    <div 
      className={cn(
        "rounded-xl p-4 md:p-6",
        bgClass,
        className
      )}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {trustItems.map((item) => (
          <div 
            key={item.key}
            className="flex items-center gap-2 text-sm"
          >
            <span className="text-lg flex-shrink-0">{item.emoji}</span>
            <span className={variant === 'light' ? 'text-white/90' : 'text-muted-foreground'}>
              {getLabel(item)}
            </span>
          </div>
        ))}
      </div>
      
      {locationName && stats?.reviewCount && (
        <div className={cn(
          "mt-3 pt-3 border-t text-xs",
          variant === 'light' ? 'border-white/20 text-white/70' : 'border-border text-muted-foreground'
        )}>
          In {locationName}: {stats.reviewCount.toLocaleString('de-CH')}+ Bewertungen von zufriedenen Kunden
        </div>
      )}
    </div>
  );
});

TrustMicrobar.displayName = 'TrustMicrobar';

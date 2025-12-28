/**
 * ============================================================================
 * PRICE DISPLAY ARCHETYP - CONVERSION-OPTIMIZED
 * ============================================================================
 * 
 * Premium Preisanzeige für maximale Conversion.
 * Features:
 * - Animierte Preise mit CountUp
 * - Spar-Badges für Preis-Jäger Archetyp
 * - Flex-Date Rabatt-Anzeige
 * - Mobile-optimiert
 * 
 * @version 2.0.0 - Archetyp Edition
 */

import { memo } from "react";
import { cn } from "@/lib/utils";
import { TrendingDown, Calendar, Sparkles } from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================
interface PriceRangeDisplayProps {
  minPrice: number;
  maxPrice: number;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSavings?: boolean;
  savingsPercent?: number;
  flexDateSavings?: number;
  isEstimate?: boolean;
  className?: string;
}

// ============================================================================
// PRICE FORMATTER
// ============================================================================
const formatPrice = (price: number, currency = "CHF"): string => {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const PriceRangeDisplay = memo(({
  minPrice,
  maxPrice,
  currency = "CHF",
  size = "lg",
  showSavings = false,
  savingsPercent = 0,
  flexDateSavings = 0,
  isEstimate = true,
  className
}: PriceRangeDisplayProps) => {
  const sizeStyles = {
    sm: "text-lg font-semibold",
    md: "text-2xl font-bold",
    lg: "text-3xl md:text-4xl font-bold",
    xl: "text-4xl md:text-5xl font-bold"
  };

  const labelSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg"
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Main Price Range */}
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className={cn(sizeStyles[size], "text-foreground")}>
          {formatPrice(minPrice, currency)}
        </span>
        <span className={cn(labelSize[size], "text-muted-foreground")}>–</span>
        <span className={cn(sizeStyles[size], "text-foreground")}>
          {formatPrice(maxPrice, currency)}
        </span>
      </div>

      {/* Estimate Label */}
      {isEstimate && (
        <p className={cn(labelSize[size], "text-muted-foreground")}>
          Geschätzte Kosten inkl. MwSt.
        </p>
      )}

      {/* Savings Badges */}
      <div className="flex flex-wrap gap-2">
        {showSavings && savingsPercent > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
            <TrendingDown className="h-3.5 w-3.5" />
            {savingsPercent}% günstiger als Durchschnitt
          </span>
        )}

        {flexDateSavings > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Calendar className="h-3.5 w-3.5" />
            Spare {formatPrice(flexDateSavings)} mit flexiblem Datum
          </span>
        )}
      </div>
    </div>
  );
});

PriceRangeDisplay.displayName = 'PriceRangeDisplay';

// ============================================================================
// ZÜGELTAG INDICATOR
// ============================================================================
interface ZuegeltagIndicatorProps {
  date: Date;
  className?: string;
}

export const ZuegeltagIndicator = memo(({ date, className }: ZuegeltagIndicatorProps) => {
  // Official Swiss moving days
  const officialDays = [
    { month: 3, day: 31, label: "31. März" },
    { month: 6, day: 30, label: "30. Juni" },
    { month: 9, day: 30, label: "30. September" }
  ];

  const isOfficialDay = officialDays.some(
    d => date.getMonth() + 1 === d.month && date.getDate() === d.day
  );

  // Check if within 3 days of official day
  const isNearOfficialDay = officialDays.some(d => {
    const officialDate = new Date(date.getFullYear(), d.month - 1, d.day);
    const diff = Math.abs(date.getTime() - officialDate.getTime());
    const daysDiff = diff / (1000 * 60 * 60 * 24);
    return daysDiff <= 3 && daysDiff > 0;
  });

  if (isOfficialDay) {
    return (
      <span className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        "bg-destructive/10 text-destructive text-sm font-medium",
        className
      )}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
        </span>
        Offizieller Zügeltag – hohe Nachfrage
      </span>
    );
  }

  if (isNearOfficialDay) {
    return (
      <span className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        "bg-warning/10 text-warning text-sm font-medium",
        className
      )}>
        <Calendar className="h-3.5 w-3.5" />
        Nähe zum Zügeltag – erhöhte Nachfrage
      </span>
    );
  }

  // Good date - not near official days
  const month = date.getMonth();
  const isLowSeason = month === 0 || month === 1 || month === 10 || month === 11;

  if (isLowSeason) {
    return (
      <span className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        "bg-success/10 text-success text-sm font-medium",
        className
      )}>
        <Sparkles className="h-3.5 w-3.5" />
        Nebensaison – bessere Verfügbarkeit & Preise
      </span>
    );
  }

  return null;
});

ZuegeltagIndicator.displayName = 'ZuegeltagIndicator';

// ============================================================================
// FLEX DATE BADGE
// ============================================================================
interface FlexDateBadgeProps {
  savingsAmount?: number;
  className?: string;
}

export const FlexDateBadge = memo(({ 
  savingsAmount = 150, 
  className 
}: FlexDateBadgeProps) => (
  <span className={cn(
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
    "bg-gradient-to-r from-primary/10 to-success/10",
    "text-primary text-sm font-medium",
    "border border-primary/20",
    className
  )}>
    <Calendar className="h-3.5 w-3.5" />
    <span>±3 Tage flexibel?</span>
    <span className="font-bold text-success">
      Spare bis zu {formatPrice(savingsAmount)}
    </span>
  </span>
));

FlexDateBadge.displayName = 'FlexDateBadge';

export default PriceRangeDisplay;

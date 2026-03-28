/**
 * Price Preview Badge Component
 * 
 * Shows estimated price range for quick user orientation
 * Creates urgency and sets expectations
 */

import { memo } from "react";
import { Tag, TrendingUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PricePreviewBadgeProps {
  minPrice?: number;
  maxPrice?: number;
  label?: string;
  showTrend?: boolean;
  trendDirection?: 'up' | 'down' | 'stable';
  variant?: 'default' | 'compact' | 'prominent';
  className?: string;
}

export const PricePreviewBadge = memo(function PricePreviewBadge({
  minPrice = 400,
  maxPrice = 2500,
  label = "Privatumzug",
  showTrend = false,
  trendDirection = 'stable',
  variant = 'default',
  className
}: PricePreviewBadgeProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-CH', {
      style: 'currency',
      currency: 'CHF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (variant === 'compact') {
    return (
      <span className={cn(
        "inline-flex items-center gap-1 text-sm font-medium text-primary",
        className
      )}>
        <Tag className="w-3.5 h-3.5" />
        ab {formatPrice(minPrice)}
      </span>
    );
  }

  if (variant === 'prominent') {
    return (
      <div className={cn(
        "inline-flex flex-col items-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20",
        className
      )}>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(minPrice)}
          </span>
          <span className="text-muted-foreground">–</span>
          <span className="text-xl font-semibold text-foreground">
            {formatPrice(maxPrice)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground mt-1">
          Durchschnittliche Preise in der Schweiz
        </span>
      </div>
    );
  }

  // Default variant
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn(
            "inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-colors cursor-help",
            className
          )}>
            <Tag className="w-4 h-4 text-secondary" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-sm font-semibold text-foreground">
                {formatPrice(minPrice)} – {formatPrice(maxPrice)}
              </span>
            </div>
            {showTrend && (
              <TrendingUp className={cn(
                "w-4 h-4 ml-1",
                trendDirection === 'up' && "text-red-500",
                trendDirection === 'down' && "text-green-500",
                trendDirection === 'stable' && "text-muted-foreground"
              )} />
            )}
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="text-sm">
            Durchschnittliche Preise für {label} in der Schweiz. 
            Exakte Preise hängen von Entfernung, Volumen und Zusatzservices ab.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

export default PricePreviewBadge;

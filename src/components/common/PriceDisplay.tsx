import { memo } from "react";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency?: string;
  period?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const PriceDisplay = memo(function PriceDisplay({ 
  price, 
  originalPrice,
  currency = "CHF",
  period,
  size = "md",
  className 
}: PriceDisplayProps) {
  const sizes = {
    sm: { price: "text-xl", currency: "text-sm", period: "text-xs" },
    md: { price: "text-3xl", currency: "text-base", period: "text-sm" },
    lg: { price: "text-5xl", currency: "text-lg", period: "text-base" }
  };

  const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0;

  return (
    <div className={cn("flex flex-col", className)}>
      {originalPrice && (
        <div className="flex items-center gap-2 mb-1">
          <span className="text-muted-foreground line-through text-sm">
            {currency} {originalPrice.toLocaleString("de-CH")}
          </span>
          <span className="bg-secondary text-secondary-foreground text-xs font-bold px-2 py-0.5 rounded">
            -{discount}%
          </span>
        </div>
      )}
      <div className="flex items-baseline gap-1">
        <span className={cn("text-muted-foreground font-medium", sizes[size].currency)}>
          {currency}
        </span>
        <span className={cn("font-bold text-foreground", sizes[size].price)}>
          {price.toLocaleString("de-CH")}
        </span>
        {period && (
          <span className={cn("text-muted-foreground", sizes[size].period)}>
            /{period}
          </span>
        )}
      </div>
    </div>
  );
});

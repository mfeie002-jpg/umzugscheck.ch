import { memo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/pricing";
import { PriceAnnouncer } from "./PriceAnnouncer";

interface PriceBreakdownItem {
  label: string;
  value: number;
  highlight?: boolean;
}

interface CalculatorResultCardProps {
  /** Whether we have a result to display */
  hasResult: boolean;
  /** Icon to show in empty state */
  emptyIcon: LucideIcon;
  /** Title for empty state */
  emptyTitle: string;
  /** Description for empty state */
  emptyDescription: string;
  /** Main price to display */
  mainPrice?: number;
  /** Price label (e.g., "Geschätzter Preis", "Monatlicher Preis") */
  mainPriceLabel?: string;
  /** Min-max price range */
  priceRange?: { min: number; max: number };
  /** Breakdown items */
  breakdown?: PriceBreakdownItem[];
  /** Tip text */
  tip?: string;
  /** CTA button text */
  ctaText?: string;
  /** CTA button link */
  ctaLink?: string;
  /** Announcement for screen readers */
  priceAnnouncement?: string;
}

/**
 * Reusable result card component for calculator pages
 * Handles empty state and result display with accessibility
 */
export const CalculatorResultCard = memo(function CalculatorResultCard({
  hasResult,
  emptyIcon: EmptyIcon,
  emptyTitle,
  emptyDescription,
  mainPrice,
  mainPriceLabel = "Geschätzter Preis",
  priceRange,
  breakdown,
  tip,
  ctaText = "Offerte anfragen",
  ctaLink = "/kontakt",
  priceAnnouncement,
}: CalculatorResultCardProps) {
  if (!hasResult) {
    return (
      <Card className="p-6" variant="elevated">
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <EmptyIcon className="w-16 h-16 text-muted-foreground/30 mb-4" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {emptyTitle}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {emptyDescription}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6" variant="elevated" role="region" aria-label="Kostenschätzung Ergebnis">
      {priceAnnouncement && <PriceAnnouncer announcement={priceAnnouncement} />}
      
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Ihre Kostenschätzung
          </h3>
          <p className="text-sm text-muted-foreground">
            Basierend auf Ihren Angaben
          </p>
        </div>

        <div className="bg-primary/10 rounded-xl p-6 text-center">
          <div className="text-sm text-muted-foreground mb-2">{mainPriceLabel}</div>
          <div className="text-4xl font-bold text-primary mb-1" aria-live="polite">
            {formatCurrency(mainPrice || 0)}
          </div>
          {priceRange && (
            <div className="text-sm text-muted-foreground">
              {formatCurrency(priceRange.min)} - {formatCurrency(priceRange.max)}
            </div>
          )}
        </div>

        {breakdown && breakdown.length > 0 && (
          <div className="space-y-4" role="list" aria-label="Preisaufschlüsselung">
            {breakdown.map((item, index) => (
              <div 
                key={index}
                className="flex justify-between items-center pb-3 border-b border-border"
                role="listitem"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className={item.highlight ? "font-semibold text-lg text-primary" : "font-semibold"}>
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
          </div>
        )}

        {tip && (
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tipp:</strong> {tip}
            </p>
          </div>
        )}

        <Link to={ctaLink}>
          <Button className="w-full" size="lg">
            {ctaText}
          </Button>
        </Link>
      </div>
    </Card>
  );
});

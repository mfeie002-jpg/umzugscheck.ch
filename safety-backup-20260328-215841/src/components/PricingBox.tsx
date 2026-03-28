import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/pricing";

interface PricingBoxProps {
  priceMin: number;
  priceMax: number;
  volumeM3?: number;
  estimatedHours?: number;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaAction?: () => void;
  variant?: "default" | "compact" | "detailed";
  showBadge?: boolean;
}

export const PricingBox = ({
  priceMin,
  priceMax,
  volumeM3,
  estimatedHours,
  title = "Geschätzte Kosten",
  subtitle,
  ctaText = "Offerten erhalten",
  ctaAction,
  variant = "default",
  showBadge = true,
}: PricingBoxProps) => {
  if (variant === "compact") {
    return (
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          {showBadge && (
            <Badge variant="outline" className="bg-success-light text-success border-success/20">
              Unverbindlich
            </Badge>
          )}
        </div>
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-3xl font-bold text-primary">
            {formatCurrency(priceMin)}
          </span>
          <span className="text-lg text-muted-foreground">-</span>
          <span className="text-3xl font-bold text-primary">
            {formatCurrency(priceMax)}
          </span>
        </div>
        {(volumeM3 || estimatedHours) && (
          <div className="flex gap-4 text-sm text-muted-foreground">
            {volumeM3 && (
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>{volumeM3} m³</span>
              </div>
            )}
            {estimatedHours && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>~{estimatedHours}h</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === "detailed") {
    return (
      <Card className="shadow-strong border-2 border-primary/20">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>

          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="text-4xl font-bold text-primary">
                {formatCurrency(priceMin)}
              </div>
              <div className="text-2xl text-muted-foreground">-</div>
              <div className="text-4xl font-bold text-primary">
                {formatCurrency(priceMax)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Geschätzter Preisbereich</p>
          </div>

          {(volumeM3 || estimatedHours) && (
            <div className="grid grid-cols-2 gap-4">
              {volumeM3 && (
                <div className="bg-secondary/30 rounded-xl p-4 text-center">
                  <Package className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{volumeM3}</div>
                  <div className="text-xs text-muted-foreground">Kubikmeter</div>
                </div>
              )}
              {estimatedHours && (
                <div className="bg-secondary/30 rounded-xl p-4 text-center">
                  <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{estimatedHours}</div>
                  <div className="text-xs text-muted-foreground">Stunden</div>
                </div>
              )}
            </div>
          )}

          {showBadge && (
            <div className="flex items-center justify-center gap-2 text-sm text-success">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">Beste Preise von geprüften Firmen</span>
            </div>
          )}

          {ctaAction && (
            <Button
              onClick={ctaAction}
              size="lg"
              className="w-full bg-accent hover:bg-accent/90 shadow-accent group"
            >
              {ctaText}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="shadow-medium hover-lift">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          {showBadge && (
            <Badge variant="outline" className="bg-success-light text-success border-success/20">
              Kostenlos
            </Badge>
          )}
        </div>

        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}

        <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4">
          <div className="flex items-baseline justify-center gap-2 mb-1">
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(priceMin)}
            </span>
            <span className="text-xl text-muted-foreground">-</span>
            <span className="text-3xl font-bold text-primary">
              {formatCurrency(priceMax)}
            </span>
          </div>
          <p className="text-xs text-center text-muted-foreground">Geschätzter Preisbereich</p>
        </div>

        {(volumeM3 || estimatedHours) && (
          <div className="flex justify-around py-2 border-y">
            {volumeM3 && (
              <div className="text-center">
                <Package className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold">{volumeM3} m³</div>
                <div className="text-xs text-muted-foreground">Volumen</div>
              </div>
            )}
            {estimatedHours && (
              <div className="text-center">
                <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                <div className="text-lg font-bold">~{estimatedHours}h</div>
                <div className="text-xs text-muted-foreground">Dauer</div>
              </div>
            )}
          </div>
        )}

        {ctaAction && (
          <Button
            onClick={ctaAction}
            className="w-full bg-accent hover:bg-accent/90 group"
          >
            {ctaText}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

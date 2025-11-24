import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, Calendar, Users, Activity } from "lucide-react";
import { calculateDynamicPricing, formatPricingBreakdown } from "@/lib/dynamic-pricing";

interface DynamicPricingDisplayProps {
  basePriceChf: number;
  interestedProviders: number;
  averageCapacityPercentage: number;
  leadDate?: Date;
  showBreakdown?: boolean;
}

export function DynamicPricingDisplay({
  basePriceChf,
  interestedProviders,
  averageCapacityPercentage,
  leadDate,
  showBreakdown = true,
}: DynamicPricingDisplayProps) {
  const pricing = calculateDynamicPricing(
    basePriceChf,
    interestedProviders,
    averageCapacityPercentage,
    leadDate
  );

  const getTrendIcon = (multiplier: number) => {
    if (multiplier > 1.05) return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (multiplier < 0.95) return <TrendingDown className="h-4 w-4 text-green-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendBadge = (adjustment: string) => {
    const isIncrease = adjustment.startsWith('+');
    const isDecrease = adjustment.startsWith('-');
    
    if (isIncrease) {
      return <Badge variant="destructive" className="ml-2">{adjustment}</Badge>;
    }
    if (isDecrease) {
      return <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">{adjustment}</Badge>;
    }
    return <Badge variant="outline" className="ml-2">{adjustment}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Dynamische Preisgestaltung</span>
          <span className="text-2xl font-bold text-primary">CHF {pricing.finalPriceChf}</span>
        </CardTitle>
        <CardDescription>
          Preis basiert auf aktueller Nachfrage, Saison und Verfügbarkeit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Basispreis</span>
            <span className="font-semibold">CHF {pricing.basePriceChf}</span>
          </div>

          {showBreakdown && (
            <>
              <div className="space-y-3">
                {/* Demand Factor */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(pricing.demandMultiplier)}
                    <div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">Nachfrage</span>
                        {getTrendBadge(pricing.factors.demand.adjustment)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {pricing.factors.demand.interestedProviders} interessierte Anbieter
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">
                    ×{pricing.demandMultiplier.toFixed(2)}
                  </span>
                </div>

                {/* Seasonal Factor */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(pricing.seasonalMultiplier)}
                    <div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">Saison</span>
                        {getTrendBadge(pricing.factors.seasonal.adjustment)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {pricing.factors.seasonal.season}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">
                    ×{pricing.seasonalMultiplier.toFixed(2)}
                  </span>
                </div>

                {/* Availability Factor */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(pricing.availabilityMultiplier)}
                    <div>
                      <div className="flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm font-medium">Verfügbarkeit</span>
                        {getTrendBadge(pricing.factors.availability.adjustment)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {pricing.factors.availability.averageCapacity}% Kapazität verfügbar
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">
                    ×{pricing.availabilityMultiplier.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Gesamtmultiplikator</span>
                  <span className="text-sm font-semibold">
                    ×{(pricing.demandMultiplier * pricing.seasonalMultiplier * pricing.availabilityMultiplier).toFixed(2)}
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
            <span className="font-semibold">Endpreis</span>
            <span className="text-xl font-bold text-primary">CHF {pricing.finalPriceChf}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Calendar,
  Users,
  Percent,
  Sun,
  Snowflake,
  Leaf,
  Info,
  Zap,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { 
  calculateDynamicPricing, 
  getSeasonName,
  DynamicPricingFactors 
} from "@/lib/dynamic-pricing";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MarketplaceDynamicPricingProps {
  providerId: string;
  basePriceChf?: number;
  onPricingChange?: (pricing: DynamicPricingFactors) => void;
}

export function MarketplaceDynamicPricing({ 
  providerId, 
  basePriceChf = 35,
  onPricingChange 
}: MarketplaceDynamicPricingProps) {
  const [autoPricingEnabled, setAutoPricingEnabled] = useState(true);
  const [customBasePrice, setCustomBasePrice] = useState(basePriceChf);
  const [demandLevel, setDemandLevel] = useState(3); // Simulated interested providers
  const [capacityLevel, setCapacityLevel] = useState(60); // Provider capacity %

  // Calculate dynamic pricing
  const pricing = calculateDynamicPricing(
    customBasePrice,
    demandLevel,
    capacityLevel
  );

  // Notify parent of pricing changes
  useEffect(() => {
    onPricingChange?.(pricing);
  }, [pricing, onPricingChange]);

  // Get season icon
  const getSeasonIcon = () => {
    const month = new Date().getMonth();
    if (month >= 4 && month <= 8) return <Sun className="h-4 w-4 text-amber-500" />;
    if (month >= 2 && month <= 9) return <Leaf className="h-4 w-4 text-emerald-500" />;
    return <Snowflake className="h-4 w-4 text-blue-400" />;
  };

  // Get trend indicator
  const getTrendIndicator = (multiplier: number) => {
    if (multiplier > 1) {
      return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    } else if (multiplier < 1) {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Dynamische Preisgestaltung
            </CardTitle>
            <CardDescription>
              Automatische Preisanpassung basierend auf Marktbedingungen
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Auto-Pricing</span>
            <Switch
              checked={autoPricingEnabled}
              onCheckedChange={setAutoPricingEnabled}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Price Display */}
        <motion.div
          className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <p className="text-sm text-muted-foreground mb-2">Aktueller Lead-Preis</p>
          <div className="flex items-center justify-center gap-2">
            <motion.span
              key={pricing.finalPriceChf}
              className="text-4xl font-bold text-primary"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              CHF {pricing.finalPriceChf}
            </motion.span>
            {pricing.finalPriceChf > pricing.basePriceChf ? (
              <Badge className="bg-emerald-500">
                +{Math.round((pricing.finalPriceChf / pricing.basePriceChf - 1) * 100)}%
              </Badge>
            ) : pricing.finalPriceChf < pricing.basePriceChf ? (
              <Badge variant="secondary">
                -{Math.round((1 - pricing.finalPriceChf / pricing.basePriceChf) * 100)}%
              </Badge>
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Basispreis: CHF {pricing.basePriceChf}
          </p>
        </motion.div>

        {/* Pricing Factors */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            Preisfaktoren
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    Der Endpreis wird durch mehrere Faktoren beeinflusst, die sich dynamisch ändern.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h4>

          {/* Demand Factor */}
          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Nachfrage</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {pricing.factors.demand.interestedProviders} Anbieter
                </Badge>
                {getTrendIndicator(pricing.demandMultiplier)}
                <span className={cn(
                  "text-sm font-semibold",
                  pricing.demandMultiplier > 1 ? "text-emerald-500" : 
                  pricing.demandMultiplier < 1 ? "text-red-500" : ""
                )}>
                  {pricing.factors.demand.adjustment}
                </span>
              </div>
            </div>
            {autoPricingEnabled && (
              <div className="space-y-2">
                <Slider
                  value={[demandLevel]}
                  onValueChange={([v]) => setDemandLevel(v)}
                  min={0}
                  max={8}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Niedrig</span>
                  <span>Hoch</span>
                </div>
              </div>
            )}
          </div>

          {/* Seasonal Factor */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getSeasonIcon()}
                <span className="text-sm font-medium">Saison</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {pricing.factors.seasonal.season}
                </Badge>
                {getTrendIndicator(pricing.seasonalMultiplier)}
                <span className={cn(
                  "text-sm font-semibold",
                  pricing.seasonalMultiplier > 1 ? "text-emerald-500" : 
                  pricing.seasonalMultiplier < 1 ? "text-red-500" : ""
                )}>
                  {pricing.factors.seasonal.adjustment}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {pricing.factors.seasonal.season === 'Hochsaison' 
                ? 'Mai-September: Höhere Nachfrage = Höhere Preise'
                : 'Nebensaison: Geringere Nachfrage = Attraktivere Preise'}
            </p>
          </div>

          {/* Availability Factor */}
          <div className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Verfügbarkeit</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {pricing.factors.availability.averageCapacity}% Kapazität
                </Badge>
                {getTrendIndicator(pricing.availabilityMultiplier)}
                <span className={cn(
                  "text-sm font-semibold",
                  pricing.availabilityMultiplier > 1 ? "text-emerald-500" : 
                  pricing.availabilityMultiplier < 1 ? "text-red-500" : ""
                )}>
                  {pricing.factors.availability.adjustment}
                </span>
              </div>
            </div>
            {autoPricingEnabled && (
              <div className="space-y-2">
                <Slider
                  value={[capacityLevel]}
                  onValueChange={([v]) => setCapacityLevel(v)}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Ausgebucht</span>
                  <span>Viel Kapazität</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Base Price Setting */}
        <div className="p-4 bg-muted/30 rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Basispreis pro Lead</span>
            </div>
            <span className="font-semibold">CHF {customBasePrice}</span>
          </div>
          <Slider
            value={[customBasePrice]}
            onValueChange={([v]) => setCustomBasePrice(v)}
            min={15}
            max={100}
            step={5}
            disabled={!autoPricingEnabled}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>CHF 15 (Min)</span>
            <span>CHF 100 (Max)</span>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="p-4 border-2 border-dashed rounded-lg">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Preisberechnung
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Basispreis</span>
              <span>CHF {pricing.basePriceChf}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">× Nachfrage ({pricing.factors.demand.adjustment})</span>
              <span>×{pricing.demandMultiplier.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">× Saison ({pricing.factors.seasonal.adjustment})</span>
              <span>×{pricing.seasonalMultiplier.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">× Verfügbarkeit ({pricing.factors.availability.adjustment})</span>
              <span>×{pricing.availabilityMultiplier.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Endpreis</span>
              <span className="text-primary">CHF {pricing.finalPriceChf}</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button className="w-full" disabled={!autoPricingEnabled}>
          <Zap className="h-4 w-4 mr-2" />
          Preiseinstellungen speichern
        </Button>
      </CardContent>
    </Card>
  );
}

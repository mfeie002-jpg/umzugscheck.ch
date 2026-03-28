import { useMemo } from "react";
import { Calculator, Info, BadgeSwissFranc } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { swissCities, extractPLZ, calculateDistance } from "./DistanceCalculator";

interface CostEstimateProps {
  fromAddress: string;
  toAddress: string;
  rooms: string;
  serviceType: string;
  onEstimateChange?: (estimate: CostEstimateResult | null) => void;
}

export interface CostEstimateResult {
  minPrice: number;
  maxPrice: number;
  distance: number;
  roomCount: number;
  breakdown: {
    basePrice: number;
    distanceCost: number;
    serviceMultiplier: number;
  };
}

export function useCostEstimate(fromAddress: string, toAddress: string, rooms: string, serviceType: string): CostEstimateResult | null {
  return useMemo(() => {
    const fromPLZ = extractPLZ(fromAddress);
    const toPLZ = extractPLZ(toAddress);

    if (!fromPLZ || !toPLZ || !rooms) return null;

    const fromCity = swissCities[fromPLZ];
    const toCity = swissCities[toPLZ];

    let distance = 20;
    if (fromCity && toCity) {
      distance = Math.round(calculateDistance(fromCity.lat, fromCity.lng, toCity.lat, toCity.lng) * 1.3);
    }

    const roomCount = rooms === "5+" ? 5 : parseInt(rooms);
    const basePerRoom = 350;
    const distanceCost = distance * 3.5;
    const serviceMultiplier = 
      serviceType === "Büroumzug" ? 1.3 :
      serviceType === "Spezialumzug" ? 1.5 : 1.0;

    const baseCost = roomCount * basePerRoom;
    const totalBase = (baseCost + distanceCost) * serviceMultiplier;
    const minPrice = Math.round(totalBase * 0.85 / 10) * 10;
    const maxPrice = Math.round(totalBase * 1.15 / 10) * 10;

    return {
      minPrice,
      maxPrice,
      distance,
      roomCount,
      breakdown: {
        basePrice: Math.round(baseCost),
        distanceCost: Math.round(distanceCost),
        serviceMultiplier,
      }
    };
  }, [fromAddress, toAddress, rooms, serviceType]);
}

export default function CostEstimate({ fromAddress, toAddress, rooms, serviceType, onEstimateChange }: CostEstimateProps) {
  const estimate = useCostEstimate(fromAddress, toAddress, rooms, serviceType);

  // Notify parent of estimate changes
  useMemo(() => {
    onEstimateChange?.(estimate);
  }, [estimate, onEstimateChange]);

  if (!estimate) return null;

  return (
    <Card className="p-4 sm:p-5 bg-gradient-to-br from-alpine/10 to-primary/5 border-alpine/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-alpine" />
          <span className="font-semibold text-sm sm:text-base">Kostenvoranschlag</span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p className="text-xs">Unverbindliche Schätzung basierend auf Entfernung und Zimmeranzahl. Der finale Preis wird nach Besichtigung festgelegt.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main Price Display */}
      <div className="text-center py-4 sm:py-6 bg-background/50 rounded-lg mb-4">
        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Geschätzter Preis</p>
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-alpine">
            CHF {estimate.minPrice.toLocaleString('de-CH')}
          </span>
          <span className="text-lg sm:text-xl text-muted-foreground">–</span>
          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-alpine">
            {estimate.maxPrice.toLocaleString('de-CH')}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">inkl. MwSt.</p>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between items-center py-2 border-b border-alpine/10">
          <span className="text-muted-foreground">{estimate.roomCount} Zimmer</span>
          <span className="font-medium">CHF {estimate.breakdown.basePrice.toLocaleString('de-CH')}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-alpine/10">
          <span className="text-muted-foreground">{estimate.distance} km Entfernung</span>
          <span className="font-medium">CHF {estimate.breakdown.distanceCost.toLocaleString('de-CH')}</span>
        </div>
        {serviceType !== "Privatumzug" && (
          <div className="flex justify-between items-center py-2 text-xs text-alpine">
            <span>{serviceType}-Zuschlag</span>
            <span>+{serviceType === "Büroumzug" ? "30" : "50"}%</span>
          </div>
        )}
      </div>

      {/* Trust Badge */}
      <div className="mt-4 pt-4 border-t border-alpine/10 flex items-center gap-2 text-xs text-muted-foreground">
        <BadgeSwissFranc className="h-4 w-4 text-alpine" />
        <span>Transparente Preise • Keine versteckten Kosten</span>
      </div>
    </Card>
  );
}

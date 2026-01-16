/**
 * Live Price Preview Component
 * 
 * Shows real-time price estimation as user fills the form.
 * Creates urgency and transparency.
 */

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingDown, Clock, Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LivePricePreviewProps {
  rooms?: number;
  fromPLZ?: string;
  toPLZ?: string;
  hasElevator?: boolean;
  floor?: number;
  moveDate?: Date;
  className?: string;
  variant?: "compact" | "detailed" | "minimal";
}

// Price calculation logic
const calculateEstimate = ({
  rooms = 0,
  fromPLZ,
  toPLZ,
  hasElevator = true,
  floor = 0,
  moveDate
}: {
  rooms?: number;
  fromPLZ?: string;
  toPLZ?: string;
  hasElevator?: boolean;
  floor?: number;
  moveDate?: Date;
}) => {
  if (!rooms || rooms < 1) return null;

  // Base price per room
  const basePerRoom = 350;
  let minPrice = rooms * basePerRoom * 0.8;
  let maxPrice = rooms * basePerRoom * 1.4;

  // Distance factor (simplified - based on first digit of PLZ)
  if (fromPLZ && toPLZ && fromPLZ.length >= 1 && toPLZ.length >= 1) {
    const fromRegion = parseInt(fromPLZ[0]);
    const toRegion = parseInt(toPLZ[0]);
    const regionDiff = Math.abs(fromRegion - toRegion);
    
    if (regionDiff > 0) {
      const distanceFactor = 1 + (regionDiff * 0.08);
      minPrice *= distanceFactor;
      maxPrice *= distanceFactor;
    }
  }

  // Floor factor (no elevator)
  if (!hasElevator && floor > 0) {
    const floorFactor = 1 + (floor * 0.05);
    minPrice *= floorFactor;
    maxPrice *= floorFactor;
  }

  // Weekend/peak surcharge
  let isPeakTime = false;
  if (moveDate) {
    const dayOfWeek = moveDate.getDay();
    const month = moveDate.getMonth();
    
    // Weekend
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      minPrice *= 1.15;
      maxPrice *= 1.15;
      isPeakTime = true;
    }
    
    // Peak months (June-August, December)
    if ([5, 6, 7, 11].includes(month)) {
      minPrice *= 1.1;
      maxPrice *= 1.1;
      isPeakTime = true;
    }
  }

  // Round to nice numbers
  minPrice = Math.round(minPrice / 50) * 50;
  maxPrice = Math.round(maxPrice / 50) * 50;

  // Ensure min < max
  if (minPrice >= maxPrice) {
    maxPrice = minPrice + 200;
  }

  // Calculate savings
  const savings = Math.round((maxPrice - minPrice) * 0.6);

  return {
    minPrice,
    maxPrice,
    savings,
    isPeakTime,
    confidence: rooms >= 2 && fromPLZ && toPLZ ? "high" : "medium"
  };
};

export const LivePricePreview = ({
  rooms,
  fromPLZ,
  toPLZ,
  hasElevator,
  floor,
  moveDate,
  className,
  variant = "detailed"
}: LivePricePreviewProps) => {
  const estimate = useMemo(() => 
    calculateEstimate({ rooms, fromPLZ, toPLZ, hasElevator, floor, moveDate }),
    [rooms, fromPLZ, toPLZ, hasElevator, floor, moveDate]
  );

  if (!estimate) return null;

  if (variant === "minimal") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn("text-center", className)}
      >
        <span className="text-sm text-muted-foreground">Geschätzt: </span>
        <span className="font-bold text-primary">
          CHF {estimate.minPrice.toLocaleString()} – {estimate.maxPrice.toLocaleString()}
        </span>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/20",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Live-Schätzung</span>
        </div>
        <div className="text-right">
          <span className="font-bold text-primary">
            CHF {estimate.minPrice.toLocaleString()} – {estimate.maxPrice.toLocaleString()}
          </span>
        </div>
      </motion.div>
    );
  }

  // Detailed variant
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${estimate.minPrice}-${estimate.maxPrice}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "rounded-xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4 md:p-6",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Live-Preisschätzung</h4>
              <p className="text-xs text-muted-foreground">
                Basierend auf Ihren Angaben
              </p>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Diese Schätzung basiert auf Durchschnittspreisen für vergleichbare Umzüge. Der finale Preis wird durch die Umzugsfirmen individuell berechnet.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Price Range */}
        <div className="text-center mb-4">
          <motion.div
            key={estimate.minPrice}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-3xl md:text-4xl font-bold text-foreground"
          >
            CHF {estimate.minPrice.toLocaleString()} – {estimate.maxPrice.toLocaleString()}
          </motion.div>
          
          {/* Confidence indicator */}
          <div className="flex items-center justify-center gap-1 mt-2">
            <div className={cn(
              "h-1 w-8 rounded-full",
              estimate.confidence === "high" ? "bg-green-500" : "bg-yellow-500"
            )} />
            <span className="text-xs text-muted-foreground ml-1">
              {estimate.confidence === "high" ? "Hohe Genauigkeit" : "Grobe Schätzung"}
            </span>
          </div>
        </div>

        {/* Savings & Tips */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <TrendingDown className="h-4 w-4 text-green-600 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Sparpotenzial</p>
              <p className="text-sm font-semibold text-green-600">
                bis CHF {estimate.savings.toLocaleString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-2 rounded-lg bg-muted border border-border">
            <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Offerten in</p>
              <p className="text-sm font-semibold">24-48 Stunden</p>
            </div>
          </div>
        </div>

        {/* Peak time warning */}
        {estimate.isPeakTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20"
          >
            <p className="text-xs text-amber-700 dark:text-amber-400 text-center">
              💡 Tipp: Wochentage oder Nebensaison können bis zu 15% günstiger sein
            </p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default LivePricePreview;

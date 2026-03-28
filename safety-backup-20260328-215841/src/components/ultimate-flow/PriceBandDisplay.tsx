/**
 * Price Band Display Component
 * 
 * Prompt 1: Sofortiges Preisband nach PLZ-Eingabe
 * - Zeigt min-max Preis an
 * - Animiert bei Änderungen
 * - Kompakt und vertrauensbildend
 */

import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, Info, Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/pricing';
import { calculateQuickPriceEstimate } from '@/lib/service-level-pricing';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface PriceBandDisplayProps {
  fromPostal: string;
  toPostal: string;
  rooms: string;
  serviceLevel: number;
  className?: string;
  variant?: 'compact' | 'full';
}

export const PriceBandDisplay = memo(function PriceBandDisplay({
  fromPostal,
  toPostal,
  rooms,
  serviceLevel,
  className,
  variant = 'full'
}: PriceBandDisplayProps) {
  const estimate = useMemo(() => {
    if (!fromPostal || !toPostal || !rooms) return null;
    return calculateQuickPriceEstimate(fromPostal, toPostal, rooms, serviceLevel);
  }, [fromPostal, toPostal, rooms, serviceLevel]);

  if (!estimate) {
    return (
      <div className={cn(
        "bg-muted/50 rounded-lg p-4 text-center",
        className
      )}>
        <Calculator className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          Geben Sie PLZ und Zimmer ein für eine Preisschätzung
        </p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "bg-gradient-to-r from-primary/10 to-green-500/10 rounded-lg p-3 flex items-center justify-between",
          className
        )}
      >
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium">Geschätzt:</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={`${estimate.priceMin}-${estimate.priceMax}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="font-bold text-foreground"
          >
            {formatCurrency(estimate.priceMin)} – {formatCurrency(estimate.priceMax)}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-gradient-to-br from-primary/5 via-green-500/5 to-emerald-500/5 rounded-xl border border-primary/20 p-5",
        className
      )}
    >
      {/* Price Range Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-sm text-muted-foreground">Geschätzte Kosten</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3.5 h-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Basierend auf {estimate.volumeM3}m³ Umzugsgut und ca. {estimate.estimatedDistance}km Distanz. 
                  Finale Offerten können abweichen.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={`${estimate.priceMin}-${estimate.priceMax}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="text-2xl sm:text-3xl font-bold text-foreground"
          >
            {formatCurrency(estimate.priceMin)} – {formatCurrency(estimate.priceMax)}
          </motion.div>
        </AnimatePresence>
        
        <p className="text-xs text-muted-foreground mt-1">
          {estimate.serviceLevelPricing.serviceLevelLabel} • {estimate.volumeM3}m³ • ~{estimate.estimatedDistance}km
        </p>
      </div>

      {/* Savings Indicator */}
      <div className="flex items-center justify-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-lg py-2 px-3">
        <TrendingDown className="w-4 h-4" />
        <span className="font-medium">
          Sparen Sie bis zu 40% durch Vergleichen
        </span>
      </div>
    </motion.div>
  );
});

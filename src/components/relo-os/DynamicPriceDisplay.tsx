/**
 * Dynamic Price Display Component
 * 
 * Shows the calculated price with breakdown, seasonality info,
 * and alternative date suggestions.
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  TrendingDown, 
  Info, 
  ChevronDown,
  ChevronUp,
  Truck,
  Building2,
  Package,
  Shield,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { 
  PricingResult, 
  formatPrice, 
  getSeasonalityBadge 
} from '@/lib/move-pricing-engine';
import { useState } from 'react';

interface DynamicPriceDisplayProps {
  pricing: PricingResult;
  onDateChange?: (newDate: string) => void;
  className?: string;
}

export const DynamicPriceDisplay = memo(function DynamicPriceDisplay({
  pricing,
  onDateChange,
  className,
}: DynamicPriceDisplayProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const { breakdown, seasonality, alternativeDates } = pricing;
  const seasonBadge = getSeasonalityBadge(seasonality.factor);
  
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-primary" />
            Ihr Fixpreis
          </CardTitle>
          <Badge className={seasonBadge.color}>
            {seasonBadge.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        {/* Main Price */}
        <div className="text-center py-4">
          <motion.div
            key={breakdown.total}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block"
          >
            <span className="text-4xl font-bold text-primary">
              {formatPrice(breakdown.total)}
            </span>
          </motion.div>
          <p className="text-sm text-muted-foreground mt-1">
            Garantierter Fixpreis • 7 Tage gültig
          </p>
        </div>
        
        {/* Price Breakdown */}
        <Collapsible open={showBreakdown} onOpenChange={setShowBreakdown}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Preisaufschlüsselung
              </span>
              {showBreakdown ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="pt-2">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  Transport (Basispreis)
                </span>
                <span>{formatPrice(breakdown.basePrice)}</span>
              </div>
              
              {breakdown.distanceSurcharge > 0 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Distanz-Zuschlag
                  </span>
                  <span>+{formatPrice(breakdown.distanceSurcharge)}</span>
                </div>
              )}
              
              {breakdown.floorSurcharge > 0 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Stockwerk-Zuschlag
                  </span>
                  <span>+{formatPrice(breakdown.floorSurcharge)}</span>
                </div>
              )}
              
              {breakdown.fragileSurcharge > 0 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    Spezialbehandlung
                  </span>
                  <span>+{formatPrice(breakdown.fragileSurcharge)}</span>
                </div>
              )}
              
              {breakdown.seasonalAdjustment !== 0 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {seasonality.reason}
                  </span>
                  <span className={breakdown.seasonalAdjustment > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                    {breakdown.seasonalAdjustment > 0 ? '+' : ''}
                    {formatPrice(breakdown.seasonalAdjustment)}
                  </span>
                </div>
              )}
              
              {Object.entries(breakdown.serviceFees).length > 0 && (
                <>
                  <Separator />
                  {Object.entries(breakdown.serviceFees).map(([service, fee]) => (
                    <div key={service} className="flex justify-between items-center">
                      <span className="capitalize">{service}</span>
                      <span>+{formatPrice(fee as number)}</span>
                    </div>
                  ))}
                </>
              )}
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span>Plattform-Gebühr (5%)</span>
                <span>{formatPrice(breakdown.platformFee)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(breakdown.total)}</span>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Alternative Dates */}
        {alternativeDates.length > 0 && onDateChange && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <TrendingDown className="h-4 w-4" />
              <span className="font-medium text-sm">Sparen Sie mit flexiblem Datum</span>
            </div>
            
            <div className="space-y-2">
              {alternativeDates.slice(0, 2).map((alt) => (
                <button
                  key={alt.date}
                  onClick={() => onDateChange(alt.date)}
                  className="w-full flex items-center justify-between p-2 rounded-md bg-white dark:bg-background hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(alt.date).toLocaleDateString('de-CH', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                    -{formatPrice(alt.savings)}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Guarantee Info */}
        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg text-sm">
          <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Preisgarantie</p>
            <p className="text-muted-foreground text-xs mt-1">
              Dieser Fixpreis ist verbindlich. Keine versteckten Kosten.
              Bei Änderungen am Umfang wird ein neuer Preis berechnet.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default DynamicPriceDisplay;

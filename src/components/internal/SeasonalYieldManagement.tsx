/**
 * Seasonal Yield Management Panel
 * Based on Gemini analysis: Dynamic pricing for capacity optimization
 * 
 * End of Month: Premium Pricing (Base + 30%)
 * Mid-Month: Discounted Pricing (Base - 15%)
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Sun,
  Snowflake,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DayPricing {
  day: number;
  modifier: number;
  demand: 'low' | 'medium' | 'high';
}

const generateMonthPricing = (): DayPricing[] => {
  const days: DayPricing[] = [];
  for (let i = 1; i <= 31; i++) {
    let modifier = 0;
    let demand: 'low' | 'medium' | 'high' = 'medium';
    
    // End of month (25-31): Premium
    if (i >= 25) {
      modifier = 0.30;
      demand = 'high';
    }
    // Start of month (1-5): Slight premium
    else if (i <= 5) {
      modifier = 0.15;
      demand = 'high';
    }
    // Mid-month (10-20): Discount
    else if (i >= 10 && i <= 20) {
      modifier = -0.15;
      demand = 'low';
    }
    // Transition days
    else {
      modifier = 0;
      demand = 'medium';
    }
    
    days.push({ day: i, modifier, demand });
  }
  return days;
};

const SEASONAL_MULTIPLIERS = {
  jan: { label: 'Januar', modifier: -0.10, season: 'winter' as const },
  feb: { label: 'Februar', modifier: -0.05, season: 'winter' as const },
  mar: { label: 'März', modifier: 0.10, season: 'spring' as const },
  apr: { label: 'April', modifier: 0.15, season: 'spring' as const },
  may: { label: 'Mai', modifier: 0.20, season: 'spring' as const },
  jun: { label: 'Juni', modifier: 0.30, season: 'summer' as const },
  jul: { label: 'Juli', modifier: 0.25, season: 'summer' as const },
  aug: { label: 'August', modifier: 0.20, season: 'summer' as const },
  sep: { label: 'September', modifier: 0.30, season: 'fall' as const },
  oct: { label: 'Oktober', modifier: 0.15, season: 'fall' as const },
  nov: { label: 'November', modifier: -0.10, season: 'winter' as const },
  dec: { label: 'Dezember', modifier: -0.15, season: 'winter' as const },
};

export function SeasonalYieldManagement() {
  const [basePrice, setBasePrice] = useState(200); // CHF per hour
  const monthPricing = generateMonthPricing();

  const calculateDayPrice = (day: DayPricing, monthModifier: number) => {
    return basePrice * (1 + day.modifier + monthModifier);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-mono uppercase tracking-wide text-muted-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Seasonal Yield Management (Gemini)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Base Price Slider */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Basispreis pro Stunde</span>
            <span className="font-mono font-bold">CHF {basePrice}</span>
          </div>
          <Slider
            value={[basePrice]}
            onValueChange={(v) => setBasePrice(v[0])}
            min={150}
            max={300}
            step={10}
          />
        </div>

        {/* Monthly View */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
            Monatliche Modifier
          </p>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {Object.entries(SEASONAL_MULTIPLIERS).map(([key, month]) => (
              <div 
                key={key}
                className={cn(
                  "p-2 rounded-lg text-center border",
                  month.modifier > 0.15 ? "bg-red-50 border-red-200 dark:bg-red-950/30" :
                  month.modifier > 0 ? "bg-amber-50 border-amber-200 dark:bg-amber-950/30" :
                  "bg-blue-50 border-blue-200 dark:bg-blue-950/30"
                )}
              >
                <div className="text-xs font-medium">{month.label.slice(0, 3)}</div>
                <div className={cn(
                  "text-sm font-mono font-bold",
                  month.modifier > 0 ? "text-red-600" : "text-blue-600"
                )}>
                  {month.modifier > 0 ? '+' : ''}{(month.modifier * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Pricing Calendar */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
            Tägliche Preisstruktur (September Beispiel)
          </p>
          <div className="grid grid-cols-7 gap-1">
            {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
            {/* Empty cells for first day alignment (assuming September starts on Sunday) */}
            {[...Array(6)].map((_, i) => (
              <div key={`empty-${i}`} className="p-2" />
            ))}
            {monthPricing.map((day) => {
              const price = calculateDayPrice(day, SEASONAL_MULTIPLIERS.sep.modifier);
              return (
                <div 
                  key={day.day}
                  className={cn(
                    "p-2 rounded text-center text-xs",
                    day.demand === 'high' ? "bg-red-100 dark:bg-red-950/40" :
                    day.demand === 'low' ? "bg-green-100 dark:bg-green-950/40" :
                    "bg-muted/50"
                  )}
                >
                  <div className="font-medium">{day.day}</div>
                  <div className={cn(
                    "font-mono text-[10px]",
                    day.modifier > 0 ? "text-red-600" : 
                    day.modifier < 0 ? "text-green-600" : "text-muted-foreground"
                  )}>
                    {price.toFixed(0)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Yield Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-center">
            <TrendingUp className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <div className="text-xs text-muted-foreground">Peak (End Monat)</div>
            <div className="text-lg font-bold font-mono text-red-600">
              +30%
            </div>
            <div className="text-xs font-mono">
              CHF {(basePrice * 1.30).toFixed(0)}/h
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50 text-center">
            <Calendar className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
            <div className="text-xs text-muted-foreground">Standard</div>
            <div className="text-lg font-bold font-mono">
              ±0%
            </div>
            <div className="text-xs font-mono">
              CHF {basePrice}/h
            </div>
          </div>
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-center">
            <TrendingDown className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <div className="text-xs text-muted-foreground">Tal (Mitte Monat)</div>
            <div className="text-lg font-bold font-mono text-green-600">
              -15%
            </div>
            <div className="text-xs font-mono">
              CHF {(basePrice * 0.85).toFixed(0)}/h
            </div>
          </div>
        </div>

        {/* Strategic Note */}
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-800 dark:text-amber-200">
              <p className="font-medium">Gemini Insight: Demand Shifting</p>
              <p className="mt-1">
                Marketing sollte Kunden zu Mid-Month Terminen lenken (Rabatt-Kommunikation), 
                um Kapazität zu optimieren und "Empty Truck Syndrome" zu vermeiden.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Quelle: Gemini Strategic Analysis - Seasonal Yield Management
        </p>
      </CardContent>
    </Card>
  );
}

import { MONTHLY_DEMAND_PATTERNS } from "@/lib/smart-date-optimizer";
import { cn } from "@/lib/utils";

interface SeasonalPriceChartProps {
  highlightMonth?: number;
  compact?: boolean;
}

export const SeasonalPriceChart = ({
  highlightMonth,
  compact = false,
}: SeasonalPriceChartProps) => {
  const maxPrice = Math.max(...MONTHLY_DEMAND_PATTERNS.map(p => p.avgPriceIndex));

  return (
    <div className={cn("space-y-2", compact && "space-y-1")}>
      {!compact && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Saisonale Preisschwankungen</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Günstig
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              Teuer
            </span>
          </div>
        </div>
      )}
      
      <div className="flex items-end gap-1 h-16">
        {MONTHLY_DEMAND_PATTERNS.map((pattern) => {
          const heightPercent = (pattern.avgPriceIndex / maxPrice) * 100;
          const isHighlighted = highlightMonth === pattern.month;
          
          return (
            <div
              key={pattern.month}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className={cn(
                  "w-full rounded-t transition-all",
                  pattern.demandLevel === 'low' && "bg-green-400",
                  pattern.demandLevel === 'medium' && "bg-yellow-400",
                  pattern.demandLevel === 'high' && "bg-orange-400",
                  pattern.demandLevel === 'peak' && "bg-red-400",
                  isHighlighted && "ring-2 ring-primary ring-offset-1"
                )}
                style={{ height: `${heightPercent}%` }}
                title={`${pattern.monthName}: ${pattern.avgPriceIndex}% Preisindex`}
              />
              <span className={cn(
                "text-[9px] text-muted-foreground",
                isHighlighted && "font-bold text-foreground"
              )}>
                {pattern.monthName.slice(0, 1)}
              </span>
            </div>
          );
        })}
      </div>

      {!compact && (
        <p className="text-[10px] text-muted-foreground text-center">
          💡 Januar, Februar & Dezember bieten die besten Preise
        </p>
      )}
    </div>
  );
};

export default SeasonalPriceChart;

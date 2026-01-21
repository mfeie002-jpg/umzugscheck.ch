import { Badge } from "@/components/ui/badge";
import { TrendingDown, Calendar, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  analyzeMoveDate,
  getAlternativeDates,
  getDemandColorClasses,
} from "@/lib/smart-date-optimizer";

interface DatePriceBadgeProps {
  date: Date;
  showSavings?: boolean;
  showTooltip?: boolean;
  size?: 'sm' | 'md';
}

export const DatePriceBadge = ({
  date,
  showSavings = true,
  showTooltip = true,
  size = 'md',
}: DatePriceBadgeProps) => {
  const analysis = analyzeMoveDate(date);
  const alternatives = getAlternativeDates(date, 5).slice(0, 2);

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
  };

  const badge = (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 font-medium",
        getDemandColorClasses(analysis.demandLevel),
        sizeClasses[size]
      )}
    >
      {analysis.demandLevel === 'peak' && <AlertCircle className="h-3 w-3" />}
      {analysis.demandLevel === 'low' && <TrendingDown className="h-3 w-3" />}
      {analysis.demandLevel === 'low' && 'Günstig'}
      {analysis.demandLevel === 'medium' && 'Normal'}
      {analysis.demandLevel === 'high' && 'Erhöht'}
      {analysis.demandLevel === 'peak' && 'Spitze'}
      {showSavings && analysis.savingsPercent > 10 && (
        <span className="ml-0.5">(-{analysis.savingsPercent}%)</span>
      )}
    </Badge>
  );

  if (!showTooltip) {
    return badge;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">
                {analysis.dayOfWeek}, {date.toLocaleDateString('de-CH')}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{analysis.reason}</p>
            
            {alternatives.length > 0 && analysis.demandLevel !== 'low' && (
              <div className="pt-2 border-t">
                <p className="text-xs font-medium mb-1">Günstigere Alternativen:</p>
                {alternatives.map((alt) => (
                  <div key={alt.date.toISOString()} className="text-xs text-green-600">
                    {alt.dayOfWeek}, {alt.date.toLocaleDateString('de-CH', { day: 'numeric', month: 'short' })} 
                    <span className="ml-1">(-{alt.savingsPercent}%)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default DatePriceBadge;

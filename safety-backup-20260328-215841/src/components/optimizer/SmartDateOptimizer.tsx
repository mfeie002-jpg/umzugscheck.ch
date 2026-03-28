import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingDown, Users, Sparkles, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DateRecommendation,
  analyzeMoveDate,
  findBestDates,
  getAlternativeDates,
  getDemandColorClasses,
  getRecommendationColorClasses,
} from "@/lib/smart-date-optimizer";

interface SmartDateOptimizerProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  dateRange?: { start: Date; end: Date };
  showAlternatives?: boolean;
}

export const SmartDateOptimizer = ({
  selectedDate,
  onDateSelect,
  dateRange,
  showAlternatives = true,
}: SmartDateOptimizerProps) => {
  const today = new Date();
  const defaultStart = dateRange?.start || today;
  const defaultEnd = dateRange?.end || new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);

  const bestDates = findBestDates(defaultStart, defaultEnd, 5);
  const currentAnalysis = selectedDate ? analyzeMoveDate(selectedDate) : null;
  const alternatives = selectedDate && showAlternatives 
    ? getAlternativeDates(selectedDate, 7) 
    : [];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Smart Termin-Optimierer
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Finden Sie den günstigsten Umzugstermin
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Selection Analysis */}
        {currentAnalysis && (
          <div className="p-3 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Gewählter Termin</span>
              <Badge className={cn(getRecommendationColorClasses(currentAnalysis.recommendation))}>
                {currentAnalysis.recommendation === 'best' && '🎯 Beste Wahl'}
                {currentAnalysis.recommendation === 'good' && '👍 Gute Wahl'}
                {currentAnalysis.recommendation === 'neutral' && 'Normal'}
                {currentAnalysis.recommendation === 'expensive' && '💰 Teuer'}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>
                  {currentAnalysis.dayOfWeek}, {currentAnalysis.date.toLocaleDateString('de-CH')}
                </span>
              </div>
              {currentAnalysis.savingsPercent > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>~{currentAnalysis.savingsPercent}% günstiger</span>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{currentAnalysis.reason}</p>
          </div>
        )}

        {/* Best Dates Grid */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            Top 5 günstigste Termine
          </p>
          <div className="space-y-2">
            {bestDates.map((rec, index) => (
              <DateRecommendationRow
                key={rec.date.toISOString()}
                recommendation={rec}
                rank={index + 1}
                isSelected={selectedDate?.toDateString() === rec.date.toDateString()}
                onSelect={() => onDateSelect?.(rec.date)}
              />
            ))}
          </div>
        </div>

        {/* Alternatives for selected date */}
        {alternatives.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            <p className="text-xs font-medium text-muted-foreground">
              Günstigere Alternativen ±7 Tage
            </p>
            <div className="space-y-1.5">
              {alternatives.slice(0, 3).map((alt) => (
                <Button
                  key={alt.date.toISOString()}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between h-auto py-2"
                  onClick={() => onDateSelect?.(alt.date)}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs">
                      {alt.dayOfWeek}, {alt.date.toLocaleDateString('de-CH', { day: 'numeric', month: 'short' })}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 text-green-600 text-xs">
                    <TrendingDown className="h-3 w-3" />
                    {alt.savingsPercent}% sparen
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DateRecommendationRowProps {
  recommendation: DateRecommendation;
  rank: number;
  isSelected?: boolean;
  onSelect?: () => void;
}

const DateRecommendationRow = ({
  recommendation,
  rank,
  isSelected,
  onSelect,
}: DateRecommendationRowProps) => {
  return (
    <Button
      variant={isSelected ? "secondary" : "ghost"}
      size="sm"
      className={cn(
        "w-full justify-between h-auto py-2 px-3",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <span className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
          rank === 1 && "bg-green-500 text-white",
          rank === 2 && "bg-green-400 text-white",
          rank === 3 && "bg-green-300 text-green-900",
          rank > 3 && "bg-muted text-muted-foreground"
        )}>
          {rank}
        </span>
        <div className="text-left">
          <p className="text-sm font-medium">
            {recommendation.dayOfWeek}, {recommendation.date.toLocaleDateString('de-CH', {
              day: 'numeric',
              month: 'short',
            })}
          </p>
          <p className="text-[10px] text-muted-foreground">{recommendation.reason}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge 
          variant="outline" 
          className={cn("text-[10px]", getDemandColorClasses(recommendation.demandLevel))}
        >
          {recommendation.demandLevel === 'low' && 'Niedrig'}
          {recommendation.demandLevel === 'medium' && 'Mittel'}
          {recommendation.demandLevel === 'high' && 'Hoch'}
          {recommendation.demandLevel === 'peak' && 'Spitze'}
        </Badge>
        {recommendation.savingsPercent > 0 && (
          <span className="text-xs text-green-600 font-medium">
            -{recommendation.savingsPercent}%
          </span>
        )}
      </div>
    </Button>
  );
};

export default SmartDateOptimizer;

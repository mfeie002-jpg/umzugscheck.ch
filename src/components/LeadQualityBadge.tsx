import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Award, TrendingUp } from "lucide-react";
import { LeadQualityScore, getQualityColor, getQualityBadgeVariant } from "@/lib/lead-quality";

interface LeadQualityBadgeProps {
  qualityScore: LeadQualityScore;
  showDetails?: boolean;
}

export function LeadQualityBadge({ qualityScore, showDetails = true }: LeadQualityBadgeProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={getQualityBadgeVariant(qualityScore.grade) as any}
            className={getQualityColor(qualityScore.grade)}
          >
            <Award className="h-3 w-3 mr-1" />
            {qualityScore.grade}
          </Badge>
        </TooltipTrigger>
        {showDetails && (
          <TooltipContent className="w-80">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Lead-Qualität:</span>
                <span className="font-bold">{qualityScore.totalScore}/100</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-3 w-3" />
                <span>Conversion-Wahrsch.: {qualityScore.conversionProbability.toFixed(0)}%</span>
              </div>

              <div className="text-xs space-y-1 pt-2 border-t">
                <div className="flex justify-between">
                  <span>Wert:</span>
                  <span className="font-medium">{qualityScore.breakdown.valueScore}/30</span>
                </div>
                <div className="flex justify-between">
                  <span>Dringlichkeit:</span>
                  <span className="font-medium">{qualityScore.breakdown.urgencyScore}/20</span>
                </div>
                <div className="flex justify-between">
                  <span>Vollständigkeit:</span>
                  <span className="font-medium">{qualityScore.breakdown.completenessScore}/20</span>
                </div>
                {qualityScore.breakdown.providerFitScore > 0 && (
                  <div className="flex justify-between">
                    <span>Ihre Passung:</span>
                    <span className="font-medium">{qualityScore.breakdown.providerFitScore}/15</span>
                  </div>
                )}
              </div>

              {qualityScore.insights.length > 0 && (
                <div className="text-xs pt-2 border-t space-y-1">
                  {qualityScore.insights.slice(0, 2).map((insight, i) => (
                    <div key={i} className="text-muted-foreground">• {insight}</div>
                  ))}
                </div>
              )}
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

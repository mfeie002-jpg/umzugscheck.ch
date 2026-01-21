import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProviderBadgeData, getBadgeColorClasses } from "@/lib/quality-badge";
import { ProviderQualityBadge } from "./ProviderQualityBadge";

interface BadgeProgressCardProps {
  badgeData: ProviderBadgeData;
  showRequirements?: boolean;
}

export const BadgeProgressCard = ({
  badgeData,
  showRequirements = true,
}: BadgeProgressCardProps) => {
  const { currentBadge, nextBadge, progressToNext } = badgeData;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Ihr Qualitätsbadge</span>
          <ProviderQualityBadge level={currentBadge.level} size="md" />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="text-center py-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            {currentBadge.description}
          </p>
        </div>

        {/* Progress to Next Badge */}
        {nextBadge && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <ProviderQualityBadge 
                  level={currentBadge.level} 
                  size="sm" 
                  showTooltip={false} 
                />
                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                <ProviderQualityBadge 
                  level={nextBadge.level} 
                  size="sm" 
                  showTooltip={false} 
                />
              </div>
              <span className="text-muted-foreground">{progressToNext}%</span>
            </div>
            
            <Progress value={progressToNext} className="h-2" />
            
            {/* Requirements Checklist */}
            {showRequirements && nextBadge.requirements.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-medium text-muted-foreground">
                  Anforderungen für {nextBadge.label}:
                </p>
                <div className="space-y-1.5">
                  {nextBadge.requirements.map((req) => (
                    <div
                      key={req.id}
                      className={cn(
                        "flex items-center gap-2 text-xs",
                        req.met ? "text-green-600" : "text-muted-foreground"
                      )}
                    >
                      {req.met ? (
                        <CheckCircle className="h-3.5 w-3.5" />
                      ) : (
                        <Circle className="h-3.5 w-3.5" />
                      )}
                      <span>{req.label}</span>
                      {req.value !== undefined && !req.met && (
                        <span className="ml-auto text-muted-foreground">
                          ({req.value}/{req.threshold})
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Max level reached */}
        {!nextBadge && currentBadge.level === 'elite' && (
          <div className="text-center py-2">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              🏆 Höchste Stufe erreicht!
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgeProgressCard;

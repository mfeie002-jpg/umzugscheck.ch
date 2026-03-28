/**
 * TrustTriumvirateCard
 * Visual representation of the 3-pillar trust system with progress bars and gap analysis
 */

import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  Building2, 
  Users, 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  ChevronDown,
  ChevronUp,
  Zap,
  TrendingUp,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  TrustTriumvirate, 
  TrustPillar, 
  TrustFactor,
  TrustGap,
  getTrustScoreColor,
} from '@/lib/trust-triumvirate';
import { BADGE_DEFINITIONS as QUALITY_BADGES } from '@/lib/quality-badge';

interface TrustTriumvirateCardProps {
  trustData: TrustTriumvirate;
  showGapAnalysis?: boolean;
  compact?: boolean;
  onImproveClick?: (pillar: 'institutional' | 'social' | 'process') => void;
  className?: string;
}

const PILLAR_ICONS = {
  institutional: Building2,
  social: Users,
  process: ClipboardCheck,
};

export const TrustTriumvirateCard = memo(function TrustTriumvirateCard({
  trustData,
  showGapAnalysis = true,
  compact = false,
  onImproveClick,
  className,
}: TrustTriumvirateCardProps) {
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  const pillars = [
    trustData.institutional,
    trustData.social,
    trustData.process,
  ];

  if (compact) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-semibold">Trust Score</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-2xl font-bold", getTrustScoreColor(trustData.overallScore))}>
                {trustData.overallScore}
              </span>
              <span className="text-muted-foreground">/100</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {pillars.map((pillar) => (
              <PillarMiniCard key={pillar.id} pillar={pillar} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">Trust Triumvirate</CardTitle>
              <p className="text-sm text-muted-foreground">
                Swiss-Trust Framework Analyse
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-baseline gap-1">
              <span className={cn("text-3xl font-bold", getTrustScoreColor(trustData.overallScore))}>
                {trustData.overallScore}
              </span>
              <span className="text-muted-foreground">/100</span>
            </div>
            <Badge variant="outline" className={cn(
              "mt-1",
              trustData.badgeLevel === 'elite' && "bg-purple-100 text-purple-700 border-purple-300",
              trustData.badgeLevel === 'premium' && "bg-amber-100 text-amber-700 border-amber-300",
              trustData.badgeLevel === 'verified' && "bg-blue-100 text-blue-700 border-blue-300",
              trustData.badgeLevel === 'none' && "bg-muted text-muted-foreground",
            )}>
              {QUALITY_BADGES[trustData.badgeLevel]?.label || 'Basis'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Three Pillars */}
        <div className="space-y-4">
          {pillars.map((pillar) => {
            const Icon = PILLAR_ICONS[pillar.id];
            const isExpanded = expandedPillar === pillar.id;
            
            return (
              <Collapsible
                key={pillar.id}
                open={isExpanded}
                onOpenChange={() => setExpandedPillar(isExpanded ? null : pillar.id)}
              >
                <div className="rounded-lg border bg-card p-4">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          pillar.id === 'institutional' && "bg-blue-100",
                          pillar.id === 'social' && "bg-amber-100",
                          pillar.id === 'process' && "bg-green-100",
                        )}>
                          <Icon className={cn(
                            "w-5 h-5",
                            pillar.id === 'institutional' && "text-blue-600",
                            pillar.id === 'social' && "text-amber-600",
                            pillar.id === 'process' && "text-green-600",
                          )} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{pillar.labelDe}</p>
                          <p className="text-xs text-muted-foreground">{pillar.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className={cn("font-bold", getPillarScoreColor(pillar.score))}>
                            {pillar.score}%
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {pillar.earnedPoints}/{pillar.maxScore} Pkt.
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress 
                        value={pillar.score} 
                        className="h-2"
                      />
                    </div>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="mt-4 pt-4 border-t space-y-2">
                      {pillar.factors.map((factor) => (
                        <FactorRow key={factor.id} factor={factor} />
                      ))}
                      {onImproveClick && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-3"
                          onClick={() => onImproveClick(pillar.id)}
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Verbessern
                        </Button>
                      )}
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>

        {/* Quick Wins */}
        {showGapAnalysis && trustData.quickWins.length > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-amber-600" />
              <h4 className="font-semibold text-amber-900">Quick Wins</h4>
            </div>
            <p className="text-sm text-amber-800 mb-3">
              Diese Verbesserungen haben hohen Impact bei niedrigem Aufwand:
            </p>
            <div className="space-y-2">
              {trustData.quickWins.map((factor) => (
                <div 
                  key={factor.id}
                  className="flex items-center gap-2 text-sm bg-white rounded-md px-3 py-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-600" />
                  <span>{factor.labelDe}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    +{factor.weight} Pkt.
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gap Analysis */}
        {showGapAnalysis && trustData.gaps.length > 0 && (
          <GapAnalysisSection gaps={trustData.gaps} />
        )}
      </CardContent>
    </Card>
  );
});

// ============= Sub-Components =============

function PillarMiniCard({ pillar }: { pillar: TrustPillar }) {
  const Icon = PILLAR_ICONS[pillar.id];
  
  return (
    <div className="text-center">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1",
        pillar.id === 'institutional' && "bg-blue-100",
        pillar.id === 'social' && "bg-amber-100",
        pillar.id === 'process' && "bg-green-100",
      )}>
        <Icon className={cn(
          "w-4 h-4",
          pillar.id === 'institutional' && "text-blue-600",
          pillar.id === 'social' && "text-amber-600",
          pillar.id === 'process' && "text-green-600",
        )} />
      </div>
      <p className={cn("text-lg font-bold", getPillarScoreColor(pillar.score))}>
        {pillar.score}%
      </p>
      <p className="text-xs text-muted-foreground truncate">
        {pillar.id === 'institutional' ? 'Institut.' : pillar.id === 'social' ? 'Social' : 'Prozess'}
      </p>
    </div>
  );
}

function FactorRow({ factor }: { factor: TrustFactor }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        {factor.met ? (
          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
        ) : (
          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
        )}
        <span className={cn(
          "text-sm",
          factor.met ? "text-foreground" : "text-muted-foreground"
        )}>
          {factor.labelDe}
        </span>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge 
              variant={factor.met ? "default" : "outline"}
              className={cn(
                "text-xs",
                factor.met && "bg-green-100 text-green-700 hover:bg-green-100"
              )}
            >
              {factor.met ? `+${factor.weight}` : factor.weight} Pkt.
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {factor.met 
              ? `${factor.weight} Punkte verdient` 
              : `${factor.weight} Punkte möglich`
            }
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

function GapAnalysisSection({ gaps }: { gaps: TrustGap[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayGaps = showAll ? gaps : gaps.slice(0, 3);

  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Verbesserungspotenzial
      </h4>
      <div className="space-y-2">
        {displayGaps.map((gap, idx) => (
          <div 
            key={gap.factor.id}
            className="flex items-center justify-between bg-background rounded-md px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">#{idx + 1}</span>
              <span className="text-sm">{gap.factor.labelDe}</span>
            </div>
            <div className="flex items-center gap-2">
              <ImpactBadge impact={gap.impact} />
              <EffortBadge effort={gap.effort} />
            </div>
          </div>
        ))}
      </div>
      {gaps.length > 3 && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-2"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Weniger anzeigen' : `${gaps.length - 3} weitere anzeigen`}
        </Button>
      )}
    </div>
  );
}

function ImpactBadge({ impact }: { impact: 'high' | 'medium' | 'low' }) {
  return (
    <Badge variant="outline" className={cn(
      "text-xs",
      impact === 'high' && "bg-green-100 text-green-700 border-green-300",
      impact === 'medium' && "bg-blue-100 text-blue-700 border-blue-300",
      impact === 'low' && "bg-muted text-muted-foreground",
    )}>
      {impact === 'high' ? 'Hoher' : impact === 'medium' ? 'Mittlerer' : 'Geringer'} Impact
    </Badge>
  );
}

function EffortBadge({ effort }: { effort: 'low' | 'medium' | 'high' }) {
  return (
    <Badge variant="outline" className={cn(
      "text-xs",
      effort === 'low' && "bg-green-100 text-green-700 border-green-300",
      effort === 'medium' && "bg-amber-100 text-amber-700 border-amber-300",
      effort === 'high' && "bg-red-100 text-red-700 border-red-300",
    )}>
      {effort === 'low' ? 'Einfach' : effort === 'medium' ? 'Mittel' : 'Aufwändig'}
    </Badge>
  );
}

function getPillarScoreColor(score: number): string {
  if (score >= 70) return 'text-green-600';
  if (score >= 50) return 'text-blue-600';
  if (score >= 30) return 'text-amber-600';
  return 'text-red-500';
}

export default TrustTriumvirateCard;

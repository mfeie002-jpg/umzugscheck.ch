/**
 * Flow Card Component
 * Displays a single flow with scores and actions
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Eye, 
  BarChart3, 
  Loader2, 
  Smartphone, 
  TrendingUp, 
  Zap,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScoreBadgeCompact, RankBadge, ScoreDeltaCompact } from './ScoreDisplay';
import type { FlowScore, FlowVariant } from '../types';
import { getScoreColor, formatRelativeTime } from '../utils';

interface FlowCardProps {
  variant: FlowVariant;
  score?: FlowScore | null;
  rank?: number | null;
  isAnalyzing?: boolean;
  onAnalyze?: () => void;
  onViewDetails?: () => void;
  showPreview?: boolean;
  compact?: boolean;
}

export const FlowCard: React.FC<FlowCardProps> = ({
  variant,
  score,
  rank,
  isAnalyzing = false,
  onAnalyze,
  onViewDetails,
  showPreview = false,
  compact = false,
}) => {
  const hasScore = score?.overallScore !== null && score?.overallScore !== undefined;

  if (compact) {
    return (
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              {rank !== null && rank !== undefined && (
                <RankBadge rank={rank} size="sm" />
              )}
              <div className={cn('w-3 h-3 rounded-full flex-shrink-0', variant.color)} />
              <div className="min-w-0">
                <div className="font-medium truncate">{variant.label}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {variant.stepCount} Steps
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {hasScore ? (
                <div className="flex items-center gap-1.5">
                  <ScoreBadgeCompact score={score.overallScore} size="sm" />
                  {score.delta !== undefined && score.delta !== null && score.delta !== 0 && (
                    <ScoreDeltaCompact delta={score.delta} />
                  )}
                </div>
              ) : (
                <Badge variant="outline" className="text-xs opacity-50">
                  Nicht analysiert
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onViewDetails}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-shadow hover:shadow-lg overflow-hidden">
      <CardHeader className={cn('text-white', variant.color)}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              {rank !== null && rank !== undefined && (
                <RankBadge rank={rank} />
              )}
              
              <Badge variant="secondary" className="bg-white/10 text-white font-mono">
                {variant.id}
              </Badge>
              
              {variant.isMain && (
                <Badge variant="secondary" className="bg-white/30 text-white">
                  Hauptflow
                </Badge>
              )}
            </div>
            
            <CardTitle className="text-2xl mt-3">{variant.label}</CardTitle>
            <CardDescription className="text-white/80 mt-1">
              {variant.description} • {variant.stepCount} Steps
            </CardDescription>
            
            {hasScore && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <ScoreBadgeCompact score={score.overallScore} label="Gesamt" />
                {score.delta !== undefined && score.delta !== null && score.delta !== 0 && (
                  <ScoreDeltaCompact delta={score.delta} className="ml-1" />
                )}
                <ScoreBadgeCompact score={score.conversionScore} label="Conv" />
                <ScoreBadgeCompact score={score.uxScore} label="UX" />
                <ScoreBadgeCompact score={score.mobileScore} label="Mobile" />
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Link to={variant.path} target="_blank">
              <Button variant="secondary" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Live
              </Button>
            </Link>
            
            {onAnalyze && (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={onAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Analysieren
              </Button>
            )}
            
            {onViewDetails && (
              <Button variant="secondary" size="sm" onClick={onViewDetails}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Details
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      {hasScore && (
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ScoreItem
              icon={<TrendingUp className="h-4 w-4" />}
              label="Conversion"
              score={score.conversionScore}
            />
            <ScoreItem
              icon={<Zap className="h-4 w-4" />}
              label="UX"
              score={score.uxScore}
            />
            <ScoreItem
              icon={<Smartphone className="h-4 w-4" />}
              label="Mobile"
              score={score.mobileScore}
            />
            <ScoreItem
              icon={<CheckCircle className="h-4 w-4" />}
              label="Trust"
              score={score.trustScore}
            />
          </div>
          
          {score.lastAnalyzed && (
            <div className="mt-4 text-xs text-muted-foreground text-right">
              Analysiert: {formatRelativeTime(score.lastAnalyzed)}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

// Helper component for score items
const ScoreItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  score: number | null;
}> = ({ icon, label, score }) => (
  <div className="text-center p-3 bg-muted/50 rounded-lg">
    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-1">
      {icon}
      <span>{label}</span>
    </div>
    <div className={cn('text-xl font-bold', getScoreColor(score))}>
      {score ?? '-'}/100
    </div>
    <Progress value={score || 0} className="h-1.5 mt-2" />
  </div>
);

export default FlowCard;

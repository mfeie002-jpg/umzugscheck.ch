/**
 * Flow Ranking Card
 * 
 * Displays a flow with:
 * - Screenshot preview
 * - Score with category breakdown
 * - Reason why it's ranked here (key strength)
 * - Issues summary
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy, Eye, Camera, BarChart3, ExternalLink, ChevronDown, ChevronUp,
  AlertTriangle, AlertCircle, CheckCircle, Zap, Star, Shield, Smartphone
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { type LiveFlowScore } from '@/hooks/use-live-flow-analysis';
import { type FlowFeatures } from '@/data/flowFeatureRegistry';

interface FlowRankingCardProps {
  flowId: string;
  label: string;
  description: string;
  color: string;
  path: string;
  stepCount: number;
  rank: number | null;
  score: {
    overallScore: number | null;
    conversionScore: number | null;
    uxScore: number | null;
    mobileScore: number | null;
    trustScore: number | null;
  } | null;
  liveScore?: LiveFlowScore;
  isWinner?: boolean;
  onSelectForAnalysis?: () => void;
}

// Generate reason based on scores and features
function getKeyStrength(score: FlowRankingCardProps['score'], features?: FlowFeatures): string {
  if (!score) return 'Keine Analyse verfügbar';
  
  const strengths: string[] = [];
  
  if (score.trustScore && score.trustScore >= 80) strengths.push('Starke Trust-Signale');
  if (score.conversionScore && score.conversionScore >= 80) strengths.push('Optimale CTA-Platzierung');
  if (score.mobileScore && score.mobileScore >= 80) strengths.push('Exzellente Mobile-UX');
  if (score.uxScore && score.uxScore >= 80) strengths.push('Klarer Benutzerfluss');
  
  if (features) {
    if (features.hasStickyCTA && features.hasTrustPills) strengths.push('Sticky CTA + Trust Pills');
    if (features.hasASTAG && features.hasSwissQuality) strengths.push('ASTAG + Swiss Quality Badges');
    if (features.hasPricePreview) strengths.push('Live-Preisvorschau');
  }
  
  if (strengths.length === 0) {
    if (score.overallScore && score.overallScore >= 70) return 'Solide Grundstruktur';
    return 'Optimierungspotenzial vorhanden';
  }
  
  return strengths.slice(0, 2).join(' • ');
}

function getKeyWeakness(liveScore?: LiveFlowScore): string {
  if (!liveScore?.issues?.length) return '';
  
  const criticalIssues = liveScore.issues.filter(i => i.severity === 'critical');
  if (criticalIssues.length > 0) {
    return criticalIssues[0].description;
  }
  
  const warningIssues = liveScore.issues.filter(i => i.severity === 'warning');
  if (warningIssues.length > 0) {
    return warningIssues[0].description;
  }
  
  return '';
}

const ScoreBar = ({ label, score, icon: Icon }: { label: string; score: number | null; icon: React.ElementType }) => {
  if (score === null) return null;
  
  const getColorClass = (s: number) => 
    s >= 80 ? 'bg-green-500' : 
    s >= 60 ? 'bg-yellow-500' : 
    'bg-red-500';
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-muted-foreground">
          <Icon className="h-3 w-3" />
          {label}
        </span>
        <span className="font-semibold">{score}</span>
      </div>
      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn('h-full transition-all', getColorClass(score))} 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
};

export default function FlowRankingCard({
  flowId,
  label,
  description,
  color,
  path,
  stepCount,
  rank,
  score,
  liveScore,
  isWinner,
  onSelectForAnalysis,
}: FlowRankingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const keyStrength = getKeyStrength(score, liveScore?.features);
  const keyWeakness = getKeyWeakness(liveScore);
  const overallScore = score?.overallScore ?? 0;
  
  // Generate screenshot URL (placeholder - would be from storage in production)
  const screenshotUrl = `/api/screenshot?path=${encodeURIComponent(path)}&t=${Date.now()}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank ? rank * 0.05 : 0 }}
    >
      <Card className={cn(
        'overflow-hidden border-2 transition-all hover:shadow-lg',
        isWinner && 'ring-2 ring-yellow-500 shadow-yellow-100'
      )}>
        {/* Header with Color Bar */}
        <div className={cn('h-2', color)} />
        
        <CardContent className="p-4">
          <div className="flex gap-4">
            {/* Screenshot Preview */}
            <div className="flex-shrink-0 w-32 h-48 bg-muted rounded-lg overflow-hidden border relative group">
              {/* Placeholder with flow preview iframe */}
              <iframe
                src={path}
                className="w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none"
                title={`${label} Preview`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                <Link to={path} target="_blank">
                  <Button size="sm" variant="secondary" className="text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Öffnen
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Title Row */}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {rank && (
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          'text-sm px-2 py-0.5 font-bold',
                          rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                          rank === 2 ? 'bg-gray-300 text-gray-800' :
                          rank === 3 ? 'bg-amber-600 text-white' :
                          'bg-muted'
                        )}
                      >
                        #{rank}
                      </Badge>
                    )}
                    {isWinner && (
                      <Badge className="bg-yellow-500 text-yellow-900">
                        <Trophy className="h-3 w-3 mr-1" />
                        Gewinner
                      </Badge>
                    )}
                    <Badge variant="outline" className="font-mono text-xs">{flowId}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{label}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{description}</p>
                </div>
                
                {/* Score Circle */}
                <div className={cn(
                  'flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold',
                  overallScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  overallScore >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                )}>
                  {overallScore}
                </div>
              </div>
              
              {/* Key Strength - WHY it's ranked here */}
              <div className="flex items-start gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <span className="font-medium text-green-700 dark:text-green-400">Stärke: </span>
                  <span className="text-green-800 dark:text-green-300">{keyStrength}</span>
                </div>
              </div>
              
              {/* Key Weakness if exists */}
              {keyWeakness && (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <span className="font-medium text-amber-700 dark:text-amber-400">Zu verbessern: </span>
                    <span className="text-amber-800 dark:text-amber-300">{keyWeakness}</span>
                  </div>
                </div>
              )}
              
              {/* Score Breakdown */}
              <div className="grid grid-cols-4 gap-3">
                <ScoreBar label="Trust" score={score?.trustScore ?? null} icon={Shield} />
                <ScoreBar label="CTA" score={score?.conversionScore ?? null} icon={Zap} />
                <ScoreBar label="Mobile" score={score?.mobileScore ?? null} icon={Smartphone} />
                <ScoreBar label="UX" score={score?.uxScore ?? null} icon={Star} />
              </div>
            </div>
          </div>
          
          {/* Expandable Issues Section */}
          {liveScore?.issues && liveScore.issues.length > 0 && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full mt-3 gap-2">
                  <span>{liveScore.issues.length} Issues gefunden</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 space-y-2">
                {liveScore.issues.map((issue, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      'flex items-start gap-2 p-2 rounded text-sm',
                      issue.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/30' :
                      issue.severity === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950/30' :
                      'bg-blue-50 dark:bg-blue-950/30'
                    )}
                  >
                    <AlertCircle className={cn(
                      'h-4 w-4 mt-0.5 flex-shrink-0',
                      issue.severity === 'critical' ? 'text-red-500' :
                      issue.severity === 'warning' ? 'text-yellow-500' :
                      'text-blue-500'
                    )} />
                    <div>
                      <span className="font-medium">{issue.category}: </span>
                      <span className="text-muted-foreground">{issue.description}</span>
                      <p className="text-xs text-primary mt-1">→ {issue.recommendation}</p>
                    </div>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
          
          {/* Actions */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t">
            <Link to={path} target="_blank" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Live ansehen
              </Button>
            </Link>
            <Button variant="outline" size="sm" onClick={onSelectForAnalysis} className="flex-1">
              <BarChart3 className="h-4 w-4 mr-2" />
              Details
            </Button>
            <Link to={`/admin/tools?tab=calculator-review&flow=${flowId}`} className="flex-1">
              <Button size="sm" className="w-full gap-2">
                <Camera className="h-4 w-4" />
                Screenshot
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

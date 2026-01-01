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
      transition={{ delay: rank ? rank * 0.02 : 0 }}
      className="h-full"
    >
      <Card className={cn(
        'overflow-hidden border-2 transition-all hover:shadow-lg h-full flex flex-col',
        isWinner && 'ring-2 ring-yellow-500 shadow-yellow-100'
      )}>
        {/* Header with Color Bar */}
        <div className={cn('h-1.5', color)} />
        
        <CardContent className="p-3 flex-1 flex flex-col">
          {/* Screenshot Preview - Full Width on Top */}
          <div className="w-full aspect-[4/3] bg-muted rounded-lg overflow-hidden border relative group mb-3">
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
            
            {/* Rank Badge Overlay */}
            {rank && (
              <div className="absolute top-2 left-2">
                <Badge 
                  className={cn(
                    'text-sm px-2 py-0.5 font-bold shadow-md',
                    rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                    rank === 2 ? 'bg-gray-300 text-gray-800' :
                    rank === 3 ? 'bg-amber-600 text-white' :
                    'bg-background/90 text-foreground'
                  )}
                >
                  #{rank}
                </Badge>
              </div>
            )}
            
            {/* Score Overlay */}
            <div className="absolute top-2 right-2">
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md',
                overallScore >= 80 ? 'bg-green-500 text-white' :
                overallScore >= 60 ? 'bg-yellow-500 text-white' :
                'bg-red-500 text-white'
              )}>
                {overallScore}
              </div>
            </div>
            
            {/* Winner Badge */}
            {isWinner && (
              <div className="absolute bottom-2 left-2">
                <Badge className="bg-yellow-500 text-yellow-900 shadow-md">
                  <Trophy className="h-3 w-3 mr-1" />
                  Gewinner
                </Badge>
              </div>
            )}
          </div>
          
          {/* Title */}
          <div className="space-y-1 mb-2">
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="font-mono text-[10px] px-1.5">{flowId}</Badge>
            </div>
            <h3 className="font-semibold text-sm leading-tight">{label}</h3>
          </div>
          
          {/* Key Strength - Compact */}
          <div className="flex items-start gap-1.5 p-1.5 rounded bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 mb-2">
            <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
            <span className="text-[11px] text-green-800 dark:text-green-300 line-clamp-2">{keyStrength}</span>
          </div>
          
          {/* Key Weakness - Compact */}
          {keyWeakness && (
            <div className="flex items-start gap-1.5 p-1.5 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 mb-2">
              <AlertTriangle className="h-3 w-3 text-amber-600 mt-0.5 flex-shrink-0" />
              <span className="text-[11px] text-amber-800 dark:text-amber-300 line-clamp-2">{keyWeakness}</span>
            </div>
          )}
          
          {/* Score Breakdown - Compact Grid */}
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            <ScoreBar label="Trust" score={score?.trustScore ?? null} icon={Shield} />
            <ScoreBar label="CTA" score={score?.conversionScore ?? null} icon={Zap} />
            <ScoreBar label="Mobile" score={score?.mobileScore ?? null} icon={Smartphone} />
            <ScoreBar label="UX" score={score?.uxScore ?? null} icon={Star} />
          </div>
          
          {/* Expandable Issues - Compact */}
          {liveScore?.issues && liveScore.issues.length > 0 && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full h-7 text-xs gap-1">
                  <span>{liveScore.issues.length} Issues</span>
                  {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2 space-y-1.5 max-h-32 overflow-y-auto">
                {liveScore.issues.slice(0, 3).map((issue, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      'flex items-start gap-1.5 p-1.5 rounded text-[10px]',
                      issue.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/30' :
                      issue.severity === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950/30' :
                      'bg-blue-50 dark:bg-blue-950/30'
                    )}
                  >
                    <AlertCircle className={cn(
                      'h-3 w-3 flex-shrink-0',
                      issue.severity === 'critical' ? 'text-red-500' :
                      issue.severity === 'warning' ? 'text-yellow-500' :
                      'text-blue-500'
                    )} />
                    <span className="line-clamp-2">{issue.description}</span>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}
          
          {/* Actions - Compact, stacked on mobile */}
          <div className="mt-auto pt-2 border-t flex flex-col gap-1.5">
            <div className="flex gap-1.5">
              <Link to={path} target="_blank" className="flex-1">
                <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  Live
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={onSelectForAnalysis} className="flex-1 h-7 text-xs">
                <BarChart3 className="h-3 w-3 mr-1" />
                Details
              </Button>
            </div>
            <Link to={`/admin/tools?tab=calculator-review&flow=${flowId}`}>
              <Button size="sm" className="w-full h-7 text-xs gap-1">
                <Camera className="h-3 w-3" />
                Screenshot
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

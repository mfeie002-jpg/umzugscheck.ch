/**
 * Flow Ranking Card - Horizontal Step Filmstrip Layout
 * 
 * Displays a flow with:
 * - Horizontal scrollable step screenshots (filmstrip style)
 * - Score with category breakdown
 * - Key strength/weakness
 * - Fix All button for issues
 */

import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy, Eye, Camera, BarChart3, ExternalLink, ChevronDown, ChevronUp,
  AlertTriangle, AlertCircle, CheckCircle, Zap, Star, Shield, Smartphone,
  Play, Pause, ChevronLeft, ChevronRight, Wrench
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { type LiveFlowScore } from '@/hooks/use-live-flow-analysis';
import { type FlowFeatures } from '@/data/flowFeatureRegistry';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS, type FlowStepConfig } from '@/data/flowConfigs';

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
  onFixAll?: () => void;
}

// Get steps for a flow
function getFlowSteps(flowId: string): FlowStepConfig[] {
  const config = FLOW_CONFIGS[flowId] || SUB_VARIANT_CONFIGS[flowId];
  return config?.steps || [];
}

// Generate reason based on scores and features
function getKeyStrength(score: FlowRankingCardProps['score'], features?: FlowFeatures): string {
  if (!score) return 'Keine Analyse verfügbar';
  
  const strengths: string[] = [];
  
  if (score.trustScore && score.trustScore >= 80) strengths.push('Trust-Signale');
  if (score.conversionScore && score.conversionScore >= 80) strengths.push('CTA-Optimiert');
  if (score.mobileScore && score.mobileScore >= 80) strengths.push('Mobile-First');
  if (score.uxScore && score.uxScore >= 80) strengths.push('Klarer Flow');
  
  if (features) {
    if (features.hasStickyCTA) strengths.push('Sticky CTA');
    if (features.hasASTAG) strengths.push('ASTAG');
  }
  
  if (strengths.length === 0) {
    if (score.overallScore && score.overallScore >= 70) return 'Solide Basis';
    return 'Optimierbar';
  }
  
  return strengths.slice(0, 3).join(' • ');
}

function getKeyWeakness(liveScore?: LiveFlowScore): string {
  if (!liveScore?.issues?.length) return '';
  
  const criticalIssues = liveScore.issues.filter(i => i.severity === 'critical');
  if (criticalIssues.length > 0) return criticalIssues[0].description;
  
  const warningIssues = liveScore.issues.filter(i => i.severity === 'warning');
  if (warningIssues.length > 0) return warningIssues[0].description;
  
  return '';
}

const ScoreBar = ({ label, score, icon: Icon }: { label: string; score: number | null; icon: React.ElementType }) => {
  if (score === null) return null;
  
  const getColorClass = (s: number) => 
    s >= 80 ? 'bg-green-500' : 
    s >= 60 ? 'bg-yellow-500' : 
    'bg-red-500';
  
  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="flex items-center gap-0.5 text-muted-foreground">
          <Icon className="h-2.5 w-2.5" />
          {label}
        </span>
        <span className="font-semibold">{score}</span>
      </div>
      <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className={cn('h-full transition-all', getColorClass(score))} 
          style={{ width: `${score}%` }} 
        />
      </div>
    </div>
  );
};

// Step thumbnail component with live preview
const StepThumbnail = ({ 
  step, 
  basePath, 
  isActive,
  onClick 
}: { 
  step: FlowStepConfig; 
  basePath: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  // Build step URL - append step param or just use base path for step 1
  const stepUrl = step.step === 1 ? basePath : `${basePath}?step=${step.step}`;
  
  return (
    <motion.div
      className={cn(
        "flex-shrink-0 w-28 cursor-pointer group",
        isActive && "ring-2 ring-primary rounded-lg"
      )}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
    >
      <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden border relative">
        <iframe
          src={stepUrl}
          className="w-[400%] h-[400%] origin-top-left scale-[0.25] pointer-events-none"
          title={`Step ${step.step}`}
        />
        {/* Step number badge */}
        <div className="absolute top-1 left-1">
          <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-background/90">
            {step.step}
          </Badge>
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="h-4 w-4 text-white" />
        </div>
      </div>
      <p className="text-[9px] text-muted-foreground mt-1 truncate text-center">
        {step.name}
      </p>
    </motion.div>
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
  onFixAll,
}: FlowRankingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const steps = getFlowSteps(flowId);
  const keyStrength = getKeyStrength(score, liveScore?.features);
  const keyWeakness = getKeyWeakness(liveScore);
  const overallScore = score?.overallScore ?? 0;
  const issueCount = liveScore?.issues?.length ?? 0;
  
  // Auto-advance steps (filmstrip animation)
  useEffect(() => {
    if (!isAutoPlay || steps.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveStep(prev => prev >= steps.length ? 1 : prev + 1);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [isAutoPlay, steps.length]);
  
  // Scroll to active step
  useEffect(() => {
    if (scrollRef.current) {
      const stepWidth = 120; // approximate width including gap
      scrollRef.current.scrollTo({
        left: (activeStep - 1) * stepWidth,
        behavior: 'smooth'
      });
    }
  }, [activeStep]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank ? rank * 0.03 : 0 }}
    >
      <Card className={cn(
        'overflow-hidden border-2 transition-all hover:shadow-lg',
        isWinner && 'ring-2 ring-yellow-500 shadow-yellow-100'
      )}>
        {/* Color Bar */}
        <div className={cn('h-1', color)} />
        
        <CardContent className="p-4">
          {/* Header Row: Rank, Title, Score, Actions */}
          <div className="flex items-center gap-4 mb-3">
            {/* Rank Badge */}
            {rank && (
              <div className={cn(
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg',
                rank === 1 ? 'bg-yellow-400 text-yellow-900' :
                rank === 2 ? 'bg-gray-300 text-gray-800' :
                rank === 3 ? 'bg-amber-600 text-white' :
                'bg-muted text-muted-foreground'
              )}>
                {rank}
              </div>
            )}
            
            {/* Title & Description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-base">{label}</h3>
                {isWinner && (
                  <Badge className="bg-yellow-500 text-yellow-900 text-xs">
                    <Trophy className="h-3 w-3 mr-1" />
                    Gewinner
                  </Badge>
                )}
                <Badge variant="outline" className="font-mono text-[10px]">{flowId}</Badge>
              </div>
              <p className="text-xs text-muted-foreground truncate">{description}</p>
            </div>
            
            {/* Score Circle */}
            <div className={cn(
              'flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold',
              overallScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              overallScore >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            )}>
              {overallScore}
            </div>
            
            {/* Quick Actions */}
            <div className="flex-shrink-0 flex gap-1">
              <Link to={path} target="_blank">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={onSelectForAnalysis}>
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Step Filmstrip */}
          <div className="relative mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-muted-foreground">{steps.length} Steps</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
              >
                {isAutoPlay ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
              <div className="flex-1" />
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                disabled={activeStep === 1}
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>
              <span className="text-xs font-mono">{activeStep}/{steps.length}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setActiveStep(prev => Math.min(steps.length, prev + 1))}
                disabled={activeStep === steps.length}
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
            
            {/* Scrollable Step Thumbnails */}
            <div 
              ref={scrollRef}
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
              style={{ scrollbarWidth: 'thin' }}
            >
              {steps.map((step) => (
                <StepThumbnail
                  key={step.step}
                  step={step}
                  basePath={path}
                  isActive={activeStep === step.step}
                  onClick={() => {
                    setActiveStep(step.step);
                    setIsAutoPlay(false);
                  }}
                />
              ))}
            </div>
            
            {/* Progress bar under filmstrip */}
            <div className="h-0.5 bg-muted rounded-full mt-1 overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: `${(activeStep / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          
          {/* Strength/Weakness + Score Bars Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            {/* Strength & Weakness */}
            <div className="space-y-2">
              <div className="flex items-start gap-1.5 p-2 rounded bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-green-800 dark:text-green-300">{keyStrength}</span>
              </div>
              
              {keyWeakness && (
                <div className="flex items-start gap-1.5 p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-amber-800 dark:text-amber-300 line-clamp-1">{keyWeakness}</span>
                </div>
              )}
            </div>
            
            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-2">
              <ScoreBar label="Trust" score={score?.trustScore ?? null} icon={Shield} />
              <ScoreBar label="CTA" score={score?.conversionScore ?? null} icon={Zap} />
              <ScoreBar label="Mobile" score={score?.mobileScore ?? null} icon={Smartphone} />
              <ScoreBar label="UX" score={score?.uxScore ?? null} icon={Star} />
            </div>
          </div>
          
          {/* Issues Section with Fix All */}
          {issueCount > 0 && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <div className="flex items-center gap-2">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs gap-1 justify-start">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                    <span>{issueCount} Issues</span>
                    {isExpanded ? <ChevronUp className="h-3 w-3 ml-auto" /> : <ChevronDown className="h-3 w-3 ml-auto" />}
                  </Button>
                </CollapsibleTrigger>
                
                {/* Fix All Button */}
                <Button 
                  size="sm" 
                  className="h-8 text-xs gap-1"
                  onClick={onFixAll}
                >
                  <Wrench className="h-3.5 w-3.5" />
                  Fix All
                </Button>
              </div>
              
              <CollapsibleContent className="pt-2 space-y-1.5">
                {liveScore?.issues?.slice(0, 5).map((issue, idx) => (
                  <div 
                    key={idx} 
                    className={cn(
                      'flex items-start gap-2 p-2 rounded text-xs',
                      issue.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/30' :
                      issue.severity === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950/30' :
                      'bg-blue-50 dark:bg-blue-950/30'
                    )}
                  >
                    <AlertCircle className={cn(
                      'h-3.5 w-3.5 flex-shrink-0 mt-0.5',
                      issue.severity === 'critical' ? 'text-red-500' :
                      issue.severity === 'warning' ? 'text-yellow-500' :
                      'text-blue-500'
                    )} />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{issue.category}:</span>{' '}
                      <span className="text-muted-foreground">{issue.description}</span>
                    </div>
                  </div>
                ))}
                {issueCount > 5 && (
                  <p className="text-xs text-muted-foreground text-center pt-1">
                    +{issueCount - 5} weitere Issues
                  </p>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
          
          {/* Bottom Actions */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <Link to={path} target="_blank" className="flex-1">
              <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                <Eye className="h-3.5 w-3.5 mr-1" />
                Live ansehen
              </Button>
            </Link>
            <Link to={`/admin/tools?tab=calculator-review&flow=${flowId}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                <Camera className="h-3.5 w-3.5 mr-1" />
                Screenshots
              </Button>
            </Link>
            <Button size="sm" onClick={onSelectForAnalysis} className="flex-1 h-8 text-xs">
              <BarChart3 className="h-3.5 w-3.5 mr-1" />
              Analyse
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

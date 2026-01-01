/**
 * Flow Ranking Card - Animated Screenshot Filmstrip
 * 
 * Displays a flow with:
 * - Animated step screenshots (GIF-like slideshow)
 * - Horizontal scrollable thumbnails
 * - Score breakdown
 */

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Eye, Camera, BarChart3, ExternalLink, ChevronDown, ChevronUp,
  AlertTriangle, AlertCircle, CheckCircle, Zap, Star, Shield, Smartphone,
  Play, Pause, ChevronLeft, ChevronRight, ImageOff
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { type LiveFlowScore } from '@/hooks/use-live-flow-analysis';
import { type FlowFeatures } from '@/data/flowFeatureRegistry';
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS, type FlowStepConfig } from '@/data/flowConfigs';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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

// Get steps for a flow
function getFlowSteps(flowId: string): FlowStepConfig[] {
  const config = FLOW_CONFIGS[flowId] || SUB_VARIANT_CONFIGS[flowId];
  return config?.steps || [];
}

// Fetch screenshots from DB
async function fetchFlowScreenshots(flowId: string): Promise<string[]> {
  // Try flow_step_metrics first
  const { data: stepMetrics } = await supabase
    .from('flow_step_metrics')
    .select('step_number, desktop_screenshot_url, mobile_screenshot_url')
    .eq('flow_id', flowId)
    .order('step_number', { ascending: true });
  
  if (stepMetrics && stepMetrics.length > 0) {
    return stepMetrics
      .map(s => s.desktop_screenshot_url || s.mobile_screenshot_url)
      .filter(Boolean) as string[];
  }
  
  // Try flow_versions as fallback
  const { data: versions } = await supabase
    .from('flow_versions')
    .select('screenshots')
    .eq('flow_id', flowId)
    .order('created_at', { ascending: false })
    .limit(1);
  
  if (versions && versions[0]?.screenshots) {
    const screenshots = versions[0].screenshots as Record<string, string>;
    return Object.values(screenshots).filter(Boolean);
  }
  
  return [];
}

function getKeyStrength(score: FlowRankingCardProps['score'], features?: FlowFeatures): string {
  if (!score) return 'Keine Analyse';
  const strengths: string[] = [];
  if (score.trustScore && score.trustScore >= 80) strengths.push('Trust');
  if (score.conversionScore && score.conversionScore >= 80) strengths.push('CTA');
  if (score.mobileScore && score.mobileScore >= 80) strengths.push('Mobile');
  if (score.uxScore && score.uxScore >= 80) strengths.push('UX');
  if (features?.hasStickyCTA) strengths.push('Sticky');
  if (features?.hasASTAG) strengths.push('ASTAG');
  if (strengths.length === 0) return score.overallScore && score.overallScore >= 70 ? 'Solide Basis' : 'Optimierbar';
  return strengths.slice(0, 4).join(' • ');
}

function getKeyWeakness(liveScore?: LiveFlowScore): string {
  if (!liveScore?.issues?.length) return '';
  const critical = liveScore.issues.find(i => i.severity === 'critical');
  if (critical) return critical.description;
  const warning = liveScore.issues.find(i => i.severity === 'warning');
  return warning?.description || '';
}

const ScoreBar = ({ label, score, icon: Icon }: { label: string; score: number | null; icon: React.ElementType }) => {
  if (score === null) return null;
  const getColor = (s: number) => s >= 80 ? 'bg-green-500' : s >= 60 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="space-y-0.5">
      <div className="flex items-center justify-between text-[10px]">
        <span className="flex items-center gap-0.5 text-muted-foreground">
          <Icon className="h-2.5 w-2.5" />{label}
        </span>
        <span className="font-semibold">{score}</span>
      </div>
      <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
        <div className={cn('h-full transition-all', getColor(score))} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};

// Animated Screenshot Preview Component
const AnimatedPreview = ({ 
  screenshots, 
  steps,
  basePath,
  activeStep,
  setActiveStep,
  isPlaying
}: { 
  screenshots: string[];
  steps: FlowStepConfig[];
  basePath: string;
  activeStep: number;
  setActiveStep: (step: number) => void;
  isPlaying: boolean;
}) => {
  const hasScreenshots = screenshots.length > 0;
  
  // If we have screenshots, show them; otherwise fall back to iframe
  if (hasScreenshots) {
    return (
      <div className="relative w-full aspect-[16/10] bg-muted rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeStep}
            src={screenshots[activeStep - 1] || screenshots[0]}
            alt={`Step ${activeStep}`}
            className="w-full h-full object-cover object-top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
        
        {/* Step indicator dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(idx + 1)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                activeStep === idx + 1 
                  ? "bg-white scale-125" 
                  : "bg-white/50 hover:bg-white/75"
              )}
            />
          ))}
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={{ width: isPlaying ? '100%' : `${(activeStep / steps.length) * 100}%` }}
            transition={isPlaying ? { duration: 2.5, ease: 'linear' } : { duration: 0.3 }}
            key={isPlaying ? activeStep : 'static'}
          />
        </div>
      </div>
    );
  }
  
  // Fallback: iframe preview
  const stepUrl = activeStep === 1 ? basePath : `${basePath}?step=${activeStep}`;
  return (
    <div className="relative w-full aspect-[16/10] bg-muted rounded-lg overflow-hidden border">
      <iframe
        src={stepUrl}
        className="w-[300%] h-[300%] origin-top-left scale-[0.333] pointer-events-none"
        title="Flow Preview"
      />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {steps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveStep(idx + 1)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              activeStep === idx + 1 ? "bg-primary" : "bg-muted-foreground/30"
            )}
          />
        ))}
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
  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const steps = useMemo(() => getFlowSteps(flowId), [flowId]);
  const keyStrength = getKeyStrength(score, liveScore?.features);
  const keyWeakness = getKeyWeakness(liveScore);
  const overallScore = score?.overallScore ?? 0;
  const issueCount = liveScore?.issues?.length ?? 0;
  
  // Fetch screenshots
  const { data: screenshots = [] } = useQuery({
    queryKey: ['flow-screenshots', flowId],
    queryFn: () => fetchFlowScreenshots(flowId),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
  
  // Auto-advance (GIF-like animation)
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;
    const interval = setInterval(() => {
      setActiveStep(prev => prev >= steps.length ? 1 : prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [isPlaying, steps.length]);
  
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
        <div className={cn('h-1', color)} />
        
        <CardContent className="p-4">
          {/* Main Layout: Screenshot Left, Info Right */}
          <div className="flex gap-4">
            {/* Left: Animated Screenshot Preview */}
            <div className="w-72 flex-shrink-0">
              <AnimatedPreview
                screenshots={screenshots}
                steps={steps}
                basePath={path}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                isPlaying={isPlaying}
              />
              
              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <span className="text-xs font-mono text-muted-foreground w-10 text-center">
                  {activeStep}/{steps.length}
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setActiveStep(prev => Math.min(steps.length, prev + 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Step Thumbnails */}
              <div className="flex gap-1 mt-2 overflow-x-auto pb-1">
                {steps.map((step, idx) => (
                  <button
                    key={step.step}
                    onClick={() => { setActiveStep(step.step); setIsPlaying(false); }}
                    className={cn(
                      "flex-shrink-0 px-2 py-1 rounded text-[9px] transition-all",
                      activeStep === step.step 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                    )}
                  >
                    {step.step}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Right: Info & Scores */}
            <div className="flex-1 min-w-0 flex flex-col">
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
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
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{label}</h3>
                    {isWinner && (
                      <Badge className="bg-yellow-500 text-yellow-900 text-xs">
                        <Trophy className="h-3 w-3 mr-1" />Gewinner
                      </Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] mt-1">{flowId}</Badge>
                </div>
                <div className={cn(
                  'flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold',
                  overallScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                  overallScore >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                )}>
                  {overallScore}
                </div>
              </div>
              
              {/* Strength & Weakness */}
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-1.5 p-2 rounded bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                  <span className="text-xs text-green-800 dark:text-green-300">{keyStrength}</span>
                </div>
                {keyWeakness && (
                  <div className="flex items-center gap-1.5 p-2 rounded bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0" />
                    <span className="text-xs text-amber-800 dark:text-amber-300 truncate">{keyWeakness}</span>
                  </div>
                )}
              </div>
              
              {/* Score Bars */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                <ScoreBar label="Trust" score={score?.trustScore ?? null} icon={Shield} />
                <ScoreBar label="CTA" score={score?.conversionScore ?? null} icon={Zap} />
                <ScoreBar label="Mobile" score={score?.mobileScore ?? null} icon={Smartphone} />
                <ScoreBar label="UX" score={score?.uxScore ?? null} icon={Star} />
              </div>
              
              {/* Issues - Compact display without individual fix button */}
              {issueCount > 0 && (
                <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full h-8 text-xs gap-1 justify-start">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                      {issueCount} Issues
                      {isExpanded ? <ChevronUp className="h-3 w-3 ml-auto" /> : <ChevronDown className="h-3 w-3 ml-auto" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-2 space-y-1">
                    {liveScore?.issues?.slice(0, 3).map((issue, idx) => (
                      <div key={idx} className={cn(
                        'flex items-start gap-1.5 p-1.5 rounded text-[10px]',
                        issue.severity === 'critical' ? 'bg-red-50 dark:bg-red-950/30' :
                        issue.severity === 'warning' ? 'bg-yellow-50 dark:bg-yellow-950/30' :
                        'bg-blue-50 dark:bg-blue-950/30'
                      )}>
                        <AlertCircle className={cn(
                          'h-3 w-3 flex-shrink-0',
                          issue.severity === 'critical' ? 'text-red-500' :
                          issue.severity === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                        )} />
                        <span className="line-clamp-1">{issue.description}</span>
                      </div>
                    ))}
                    {issueCount > 3 && (
                      <p className="text-[9px] text-muted-foreground text-center">+{issueCount - 3} weitere</p>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              )}
              
              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-3 border-t">
                <Link to={path} target="_blank" className="flex-1">
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                    <Eye className="h-3.5 w-3.5 mr-1" />Live
                  </Button>
                </Link>
                <Link to={`/admin/tools?tab=calculator-review&flow=${flowId}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs">
                    <Camera className="h-3.5 w-3.5 mr-1" />Capture
                  </Button>
                </Link>
                <Button size="sm" onClick={onSelectForAnalysis} className="flex-1 h-8 text-xs">
                  <BarChart3 className="h-3.5 w-3.5 mr-1" />Analyse
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

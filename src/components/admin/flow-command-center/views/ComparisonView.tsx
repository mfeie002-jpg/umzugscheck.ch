/**
 * Comparison View - Side-by-side flow comparison
 * The Archetype Reference for A/B comparison
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { 
  Layers, 
  ArrowLeftRight,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
  Target,
  Zap,
  Smartphone,
  Shield,
  BarChart3,
  Monitor,
  X,
  ChevronLeft,
  ChevronRight,
  ImageOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { ScoreRing } from '../components';
import { getVariantsForFlow, getScoreColor, formatRelativeTime } from '../utils';
import type { FlowScore } from '../types';

interface ComparisonViewProps {
  initialFlowA?: string | null;
  initialFlowB?: string | null;
  onSelectFlow?: (flowId: string) => void;
}

interface ComparisonData {
  flowId: string;
  score: FlowScore | null;
  issues: number;
  strengths: string[];
  weaknesses: string[];
}

interface StepScreenshot {
  stepNumber: number;
  desktopUrl: string | null;
  mobileUrl: string | null;
}

interface FlowScreenshots {
  flowId: string;
  steps: StepScreenshot[];
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({
  initialFlowA,
  initialFlowB,
  onSelectFlow,
}) => {
  const [flowA, setFlowA] = useState<string>(initialFlowA || '');
  const [flowB, setFlowB] = useState<string>(initialFlowB || '');
  const [dataA, setDataA] = useState<ComparisonData | null>(null);
  const [dataB, setDataB] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Screenshot state
  const [screenshotsA, setScreenshotsA] = useState<FlowScreenshots | null>(null);
  const [screenshotsB, setScreenshotsB] = useState<FlowScreenshots | null>(null);
  const [loadingScreenshots, setLoadingScreenshots] = useState(false);
  
  // Zoom modal state - now supports side-by-side comparison
  const [zoomComparison, setZoomComparison] = useState<{
    urlA: string | null;
    urlB: string | null;
    labelA: string;
    labelB: string;
    stepNum: number;
    type: 'mobile' | 'desktop';
  } | null>(null);
  
  // Slider position for comparison (0-100, 50 = middle)
  const [sliderPosition, setSliderPosition] = useState(50);

  const allVariants = getVariantsForFlow('all');

  useEffect(() => {
    if (flowA) {
      fetchFlowData(flowA, 'A');
      fetchScreenshots(flowA, 'A');
    }
    if (flowB) {
      fetchFlowData(flowB, 'B');
      fetchScreenshots(flowB, 'B');
    }
  }, [flowA, flowB]);

  const fetchScreenshots = async (flowId: string, side: 'A' | 'B') => {
    setLoadingScreenshots(true);
    try {
      const { data: stepMetrics } = await supabase
        .from('flow_step_metrics')
        .select('step_number, desktop_screenshot_url, mobile_screenshot_url, created_at')
        .eq('flow_id', flowId)
        .order('step_number', { ascending: true })
        .order('created_at', { ascending: false });

      if (stepMetrics && stepMetrics.length > 0) {
        // Deduplicate by step_number, keeping newest entry that HAS screenshots
        const newestByStep = new Map<number, { 
          step_number: number; 
          mobileUrl: string | null; 
          desktopUrl: string | null;
        }>();
        
        for (const s of stepMetrics) {
          const existing = newestByStep.get(s.step_number);
          
          if (!existing) {
            // First entry for this step
            newestByStep.set(s.step_number, {
              step_number: s.step_number,
              mobileUrl: s.mobile_screenshot_url,
              desktopUrl: s.desktop_screenshot_url,
            });
          } else {
            // Merge: prefer existing URLs but fill in missing ones
            newestByStep.set(s.step_number, {
              step_number: s.step_number,
              mobileUrl: existing.mobileUrl || s.mobile_screenshot_url,
              desktopUrl: existing.desktopUrl || s.desktop_screenshot_url,
            });
          }
        }

        const steps: StepScreenshot[] = Array.from(newestByStep.values())
          .sort((a, b) => a.step_number - b.step_number)
          .map(s => ({
            stepNumber: s.step_number,
            desktopUrl: s.desktopUrl,
            mobileUrl: s.mobileUrl,
          }));

        const screenshots: FlowScreenshots = { flowId, steps };
        if (side === 'A') setScreenshotsA(screenshots);
        else setScreenshotsB(screenshots);
      } else {
        if (side === 'A') setScreenshotsA({ flowId, steps: [] });
        else setScreenshotsB({ flowId, steps: [] });
      }
    } catch (err) {
      console.error(`Failed to fetch screenshots for ${side}:`, err);
    } finally {
      setLoadingScreenshots(false);
    }
  };

  const fetchFlowData = async (flowId: string, side: 'A' | 'B') => {
    setLoading(true);
    try {
      // Fetch latest COMPLETED run (avoid picking currently running/incomplete runs)
      const { data: runData } = await supabase
        .from('flow_analysis_runs')
        .select('*')
        .eq('flow_id', flowId)
        .eq('status', 'completed')
        .not('completed_at', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch issues count
      const { count: issueCount } = await supabase
        .from('flow_ux_issues')
        .select('*', { count: 'exact', head: true })
        .eq('flow_id', flowId)
        .eq('is_resolved', false);

      const score: FlowScore | null = runData ? {
        flowId: runData.flow_id,
        overallScore: runData.overall_score,
        conversionScore: runData.conversion_score,
        uxScore: runData.ux_score,
        mobileScore: runData.mobile_score,
        trustScore: runData.trust_score,
        accessibilityScore: runData.accessibility_score,
        performanceScore: runData.performance_score,
        lastAnalyzed: runData.created_at,
      } : null;

      const data: ComparisonData = {
        flowId,
        score,
        issues: issueCount || 0,
        strengths: Array.isArray(runData?.strengths) ? runData.strengths as string[] : [],
        weaknesses: Array.isArray(runData?.quick_wins) ? runData.quick_wins as string[] : [],
      };

      if (side === 'A') setDataA(data);
      else setDataB(data);
    } catch (err) {
      console.error(`Failed to fetch ${side}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const swapFlows = () => {
    const tempA = flowA;
    setFlowA(flowB);
    setFlowB(tempA);
  };

  const getWinner = (category: keyof FlowScore | 'issues'): 'A' | 'B' | 'tie' | null => {
    if (!dataA || !dataB) return null;
    
    if (category === 'issues') {
      if (dataA.issues < dataB.issues) return 'A';
      if (dataB.issues < dataA.issues) return 'B';
      return 'tie';
    }
    
    const scoreA = dataA.score?.[category];
    const scoreB = dataB.score?.[category];
    
    if (scoreA === null || scoreB === null) return null;
    if (typeof scoreA !== 'number' || typeof scoreB !== 'number') return null;
    
    if (scoreA > scoreB) return 'A';
    if (scoreB > scoreA) return 'B';
    return 'tie';
  };

  const categories: Array<{ key: keyof FlowScore; label: string; icon: React.ReactNode }> = [
    { key: 'overallScore', label: 'Gesamt', icon: <Target className="h-4 w-4" /> },
    { key: 'conversionScore', label: 'Conversion', icon: <TrendingUp className="h-4 w-4" /> },
    { key: 'uxScore', label: 'UX', icon: <Zap className="h-4 w-4" /> },
    { key: 'mobileScore', label: 'Mobile', icon: <Smartphone className="h-4 w-4" /> },
    { key: 'trustScore', label: 'Trust', icon: <Shield className="h-4 w-4" /> },
    { key: 'performanceScore', label: 'Performance', icon: <BarChart3 className="h-4 w-4" /> },
  ];

  const overallWinner = getWinner('overallScore');

  // Get max steps between both flows
  const maxSteps = Math.max(
    screenshotsA?.steps.length || 0,
    screenshotsB?.steps.length || 0
  );

  const openComparisonZoom = (stepNum: number, type: 'mobile' | 'desktop') => {
    const stepA = screenshotsA?.steps.find(s => s.stepNumber === stepNum);
    const stepB = screenshotsB?.steps.find(s => s.stepNumber === stepNum);
    
    const urlA = type === 'mobile' ? stepA?.mobileUrl : stepA?.desktopUrl;
    const urlB = type === 'mobile' ? stepB?.mobileUrl : stepB?.desktopUrl;
    
    setZoomComparison({
      urlA: urlA || null,
      urlB: urlB || null,
      labelA: `${flowA} - Schritt ${stepNum} ${type === 'mobile' ? 'Mobile' : 'Desktop'}`,
      labelB: `${flowB} - Schritt ${stepNum} ${type === 'mobile' ? 'Mobile' : 'Desktop'}`,
      stepNum,
      type,
    });
    setSliderPosition(50);
  };

  return (
    <div className="space-y-6">
      {/* Flow Selectors */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Flow A</label>
              <Select value={flowA} onValueChange={setFlowA}>
                <SelectTrigger className={cn(
                  overallWinner === 'A' && 'border-green-500 bg-green-50 dark:bg-green-950'
                )}>
                  <SelectValue placeholder="Flow wählen" />
                </SelectTrigger>
                <SelectContent>
                  {allVariants.map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              onClick={swapFlows}
              className="mt-6"
              disabled={!flowA || !flowB}
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
            
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Flow B</label>
              <Select value={flowB} onValueChange={setFlowB}>
                <SelectTrigger className={cn(
                  overallWinner === 'B' && 'border-green-500 bg-green-50 dark:bg-green-950'
                )}>
                  <SelectValue placeholder="Flow wählen" />
                </SelectTrigger>
                <SelectContent>
                  {allVariants.filter(v => v.id !== flowA).map(v => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Winner Banner */}
      {overallWinner && overallWinner !== 'tie' && (
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-300">
          <CardContent className="py-4">
            <div className="flex items-center justify-center gap-3">
              <Crown className="h-6 w-6 text-yellow-600" />
              <span className="text-lg font-bold text-yellow-900 dark:text-yellow-100">
                {overallWinner === 'A' ? flowA : flowB} ist der Winner!
              </span>
              <Badge className="bg-yellow-600">
                +{Math.abs((dataA?.score?.overallScore || 0) - (dataB?.score?.overallScore || 0))} Punkte
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Grid */}
      {flowA && flowB && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Flow A Card */}
          <Card className={cn(
            overallWinner === 'A' && 'border-green-500 ring-2 ring-green-200'
          )}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {overallWinner === 'A' && <Crown className="h-5 w-5 text-yellow-500" />}
                  {flowA}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectFlow?.(flowA)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              {dataA?.score?.lastAnalyzed && (
                <CardDescription>
                  {formatRelativeTime(dataA.score.lastAnalyzed)}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {loading && !dataA ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : dataA?.score ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <ScoreRing score={dataA.score.overallScore || 0} size="lg" label="Score" />
                  </div>
                  
                  <div className="space-y-2">
                    {categories.slice(1).map(cat => {
                      const winner = getWinner(cat.key);
                      const value = dataA.score?.[cat.key];
                      return (
                        <div key={cat.key} className="flex items-center gap-2">
                          {cat.icon}
                          <span className="text-sm flex-1">{cat.label}</span>
                          <span className={cn(
                            'font-medium',
                            winner === 'A' ? 'text-green-600' : winner === 'B' ? 'text-red-600' : ''
                          )}>
                            {typeof value === 'number' ? value : '-'}
                          </span>
                          {winner === 'A' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {winner === 'B' && <XCircle className="h-4 w-4 text-red-600" />}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span>Offene Issues</span>
                      <Badge variant={getWinner('issues') === 'A' ? 'default' : 'destructive'}>
                        {dataA.issues}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Keine Analyse vorhanden
                </div>
              )}
            </CardContent>
          </Card>

          {/* Flow B Card */}
          <Card className={cn(
            overallWinner === 'B' && 'border-green-500 ring-2 ring-green-200'
          )}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {overallWinner === 'B' && <Crown className="h-5 w-5 text-yellow-500" />}
                  {flowB}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSelectFlow?.(flowB)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              {dataB?.score?.lastAnalyzed && (
                <CardDescription>
                  {formatRelativeTime(dataB.score.lastAnalyzed)}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              {loading && !dataB ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : dataB?.score ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <ScoreRing score={dataB.score.overallScore || 0} size="lg" label="Score" />
                  </div>
                  
                  <div className="space-y-2">
                    {categories.slice(1).map(cat => {
                      const winner = getWinner(cat.key);
                      const value = dataB.score?.[cat.key];
                      return (
                        <div key={cat.key} className="flex items-center gap-2">
                          {cat.icon}
                          <span className="text-sm flex-1">{cat.label}</span>
                          <span className={cn(
                            'font-medium',
                            winner === 'B' ? 'text-green-600' : winner === 'A' ? 'text-red-600' : ''
                          )}>
                            {typeof value === 'number' ? value : '-'}
                          </span>
                          {winner === 'B' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {winner === 'A' && <XCircle className="h-4 w-4 text-red-600" />}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span>Offene Issues</span>
                      <Badge variant={getWinner('issues') === 'B' ? 'default' : 'destructive'}>
                        {dataB.issues}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  Keine Analyse vorhanden
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Comparison Bars */}
      {dataA?.score && dataB?.score && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Kategorie-Vergleich
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categories.map(cat => {
              const valueA = dataA.score?.[cat.key];
              const valueB = dataB.score?.[cat.key];
              const hasA = typeof valueA === 'number' && valueA !== null;
              const hasB = typeof valueB === 'number' && valueB !== null;
              const numA = hasA ? valueA : 0;
              const numB = hasB ? valueB : 0;
              const winner = getWinner(cat.key);
              
              return (
                <div key={cat.key} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      {cat.icon}
                      <span className="font-medium">{cat.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        'font-bold',
                        winner === 'A' ? 'text-green-600' : '',
                        !hasA && 'text-muted-foreground'
                      )}>
                        {hasA ? numA : '-'}
                      </span>
                      <span className="text-muted-foreground">vs</span>
                      <span className={cn(
                        'font-bold',
                        winner === 'B' ? 'text-green-600' : '',
                        !hasB && 'text-muted-foreground'
                      )}>
                        {hasB ? numB : '-'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 h-3">
                    <div 
                      className={cn(
                        'rounded-l-full transition-all',
                        winner === 'A' ? 'bg-green-500' : 'bg-muted'
                      )}
                      style={{ width: `${numA}%` }}
                    />
                    <div 
                      className={cn(
                        'rounded-r-full transition-all',
                        winner === 'B' ? 'bg-green-500' : 'bg-muted'
                      )}
                      style={{ width: `${numB}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Screenshot Comparison Section */}
      {flowA && flowB && maxSteps > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Screenshot-Vergleich
            </CardTitle>
            <CardDescription>
              Mobile Screenshots nebeneinander, Desktop darunter. Tippen zum Vergrößern.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingScreenshots ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="relative">
                {/* Horizontal Slider */}
                <div className="overflow-x-auto pb-4 -mx-6 px-6" style={{ scrollbarWidth: 'thin' }}>
                  <div className="inline-flex gap-4" style={{ whiteSpace: 'nowrap' }}>
                    {Array.from({ length: maxSteps }, (_, i) => i + 1).map(stepNum => {
                      const stepA = screenshotsA?.steps.find(s => s.stepNumber === stepNum);
                      const stepB = screenshotsB?.steps.find(s => s.stepNumber === stepNum);
                      
                      return (
                        <div key={stepNum} className="inline-block w-[220px] space-y-2 p-2 bg-muted/30 rounded-lg border align-top" style={{ whiteSpace: 'normal' }}>
                          <Badge variant="outline" className="text-xs">Schritt {stepNum}</Badge>
                          
                          {/* Mobile Screenshots Side-by-Side - Click opens slider comparison */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <p className="text-[10px] text-muted-foreground truncate">{flowA}</p>
                              {stepA?.mobileUrl ? (
                                <button
                                  onClick={() => openComparisonZoom(stepNum, 'mobile')}
                                  className="relative group w-full aspect-[9/16] bg-muted rounded overflow-hidden border hover:border-primary transition-colors"
                                >
                                  <img
                                    src={stepA.mobileUrl}
                                    alt={`${flowA} Step ${stepNum} Mobile`}
                                    className="w-full h-full object-cover object-top"
                                  />
                                </button>
                              ) : (
                                <div className="w-full aspect-[9/16] bg-muted rounded flex items-center justify-center">
                                  <ImageOff className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-1">
                              <p className="text-[10px] text-muted-foreground truncate">{flowB}</p>
                              {stepB?.mobileUrl ? (
                                <button
                                  onClick={() => openComparisonZoom(stepNum, 'mobile')}
                                  className="relative group w-full aspect-[9/16] bg-muted rounded overflow-hidden border hover:border-primary transition-colors"
                                >
                                  <img
                                    src={stepB.mobileUrl}
                                    alt={`${flowB} Step ${stepNum} Mobile`}
                                    className="w-full h-full object-cover object-top"
                                  />
                                </button>
                              ) : (
                                <div className="w-full aspect-[9/16] bg-muted rounded flex items-center justify-center">
                                  <ImageOff className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Desktop Screenshots Side-by-Side */}
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              {stepA?.desktopUrl ? (
                                <button
                                  onClick={() => openComparisonZoom(stepNum, 'desktop')}
                                  className="relative group w-full aspect-video bg-muted rounded overflow-hidden border hover:border-primary transition-colors"
                                >
                                  <img
                                    src={stepA.desktopUrl}
                                    alt={`${flowA} Step ${stepNum} Desktop`}
                                    className="w-full h-full object-cover object-top"
                                  />
                                </button>
                              ) : (
                                <div className="w-full aspect-video bg-muted rounded flex items-center justify-center">
                                  <ImageOff className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            
                            <div>
                              {stepB?.desktopUrl ? (
                                <button
                                  onClick={() => openComparisonZoom(stepNum, 'desktop')}
                                  className="relative group w-full aspect-video bg-muted rounded overflow-hidden border hover:border-primary transition-colors"
                                >
                                  <img
                                    src={stepB.desktopUrl}
                                    alt={`${flowB} Step ${stepNum} Desktop`}
                                    className="w-full h-full object-cover object-top"
                                  />
                                </button>
                              ) : (
                                <div className="w-full aspect-video bg-muted rounded flex items-center justify-center">
                                  <ImageOff className="h-4 w-4 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Scroll hint */}
                <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* No selection state */}
      {(!flowA || !flowB) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Flows vergleichen</h3>
            <p className="text-muted-foreground">
              Wähle zwei Flows aus um sie direkt zu vergleichen.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Side-by-Side Comparison Modal */}
      <Dialog open={!!zoomComparison} onOpenChange={() => setZoomComparison(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-4 overflow-auto">
          <DialogTitle className="text-center mb-4">
            Schritt {zoomComparison?.stepNum} - {zoomComparison?.type === 'mobile' ? 'Mobile' : 'Desktop'} Vergleich
          </DialogTitle>
          
          {zoomComparison && (
            <div className="grid grid-cols-2 gap-4 h-[80vh]">
              {/* Flow A (Left) */}
              <div className="flex flex-col h-full">
                <div className="p-2 bg-blue-600 text-white text-sm rounded-t text-center font-medium">
                  {flowA} (Alt)
                </div>
                <div className="flex-1 bg-muted rounded-b overflow-hidden flex items-center justify-center">
                  {zoomComparison.urlA ? (
                    <img
                      src={zoomComparison.urlA}
                      alt={zoomComparison.labelA}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageOff className="h-12 w-12 mx-auto mb-2" />
                      <p>Kein Screenshot</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Flow B (Right) */}
              <div className="flex flex-col h-full">
                <div className="p-2 bg-green-600 text-white text-sm rounded-t text-center font-medium">
                  {flowB} (Neu)
                </div>
                <div className="flex-1 bg-muted rounded-b overflow-hidden flex items-center justify-center">
                  {zoomComparison.urlB ? (
                    <img
                      src={zoomComparison.urlB}
                      alt={zoomComparison.labelB}
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageOff className="h-12 w-12 mx-auto mb-2" />
                      <p>Kein Screenshot</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComparisonView;

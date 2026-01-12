/**
 * Flow Studio View - Screenshot/Live Comparison System
 * The ultimate tool for comparing flow screenshots with live versions
 * 
 * Features:
 * 1. Screenshot/Live side-by-side comparison
 * 2. Mobile/Desktop view toggle
 * 3. Re-analyze button
 * 4. Quick fix button with AI
 * 5. Screenshot capture/refresh
 * 6. Diff overlay mode (slider comparison)
 * 7. Flow annotations
 * 8. Export screenshots as PDF/ZIP
 * 9. Version history timeline
 * 10. Quick score comparison
 * 11. Step-by-step navigation
 * 12. Fullscreen mode
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Smartphone,
  Monitor,
  Play,
  Camera,
  RefreshCw,
  Sparkles,
  Download,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  SplitSquareHorizontal,
  Layers,
  Target,
  TrendingUp,
  Zap,
  Shield,
  BarChart3,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  ImageOff,
  Loader2,
  Check,
  AlertTriangle,
  ArrowLeftRight,
  Wand2,
  History,
  FileText,
  Palette,
  Clock,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getVariantsForFlow, getScoreColor, formatRelativeTime } from '../utils';
import { ScoreRing } from '../components';
import { getAnalysisBaseUrl } from '@/data/constants';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface StepScreenshot {
  stepNumber: number;
  stepName: string | null;
  mobileUrl: string | null;
  desktopUrl: string | null;
  createdAt: string;
}

interface FlowData {
  flowId: string;
  screenshots: StepScreenshot[];
  score: {
    overall: number | null;
    conversion: number | null;
    ux: number | null;
    mobile: number | null;
    trust: number | null;
    performance: number | null;
  };
  issues: number;
  lastAnalyzed: string | null;
}

interface FlowStudioViewProps {
  initialFlowId?: string;
  onSelectFlow?: (flowId: string) => void;
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export const FlowStudioView: React.FC<FlowStudioViewProps> = ({
  initialFlowId,
  onSelectFlow
}) => {
  // State
  const [selectedFlow, setSelectedFlow] = useState<string>(initialFlowId || '');
  const [compareFlow, setCompareFlow] = useState<string>('');
  const [flowData, setFlowData] = useState<FlowData | null>(null);
  const [compareData, setCompareData] = useState<FlowData | null>(null);
  const [loading, setLoading] = useState(false);
  
  // View controls
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [displayMode, setDisplayMode] = useState<'screenshot' | 'live' | 'split' | 'side-by-side-all'>('screenshot');
  const [currentStep, setCurrentStep] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  
  // Action states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Compare mode
  const [isCompareMode, setIsCompareMode] = useState(false);
  
  const allFlows = useMemo(() => getVariantsForFlow('all'), []);
  
  // ─────────────────────────────────────────────────────────────
  // Data Fetching
  // ─────────────────────────────────────────────────────────────
  
  const getFlowIdCandidates = useCallback((flowId: string) => {
    const candidates: string[] = [flowId];
    
    // If it starts with umzugsofferten-, also check without prefix
    if (flowId.startsWith('umzugsofferten-')) {
      const normalized = flowId.replace('umzugsofferten-', '');
      candidates.push(normalized);
    } else {
      // If it doesn't have prefix, also check with prefix
      candidates.push(`umzugsofferten-${flowId}`);
    }
    
    // Handle sub-variants like v1a, v1b which might be stored differently
    // Check for patterns like "v1a" -> also try "umzugsofferten-v1a" and "umzugsofferten-v1.1.a"
    const subVariantMatch = flowId.match(/^v(\d+)([a-z])$/i);
    if (subVariantMatch) {
      const num = subVariantMatch[1];
      const letter = subVariantMatch[2].toLowerCase();
      candidates.push(`v${num}${letter}`);
      candidates.push(`umzugsofferten-v${num}${letter}`);
      candidates.push(`umzugsofferten-v${num}.1.${letter}`);
      candidates.push(`v${num}.1.${letter}`);
    }
    
    // Handle full paths like "umzugsofferten-v1a"
    const fullSubVariantMatch = flowId.match(/^umzugsofferten-v(\d+)([a-z])$/i);
    if (fullSubVariantMatch) {
      const num = fullSubVariantMatch[1];
      const letter = fullSubVariantMatch[2].toLowerCase();
      candidates.push(`v${num}${letter}`);
      candidates.push(`umzugsofferten-v${num}.1.${letter}`);
      candidates.push(`v${num}.1.${letter}`);
    }
    
    // Handle ultimate variants
    if (flowId.includes('ultimate')) {
      candidates.push('ultimate-best36');
      candidates.push('umzugsofferten-ultimate-best36');
      candidates.push('vultimate');
      candidates.push('vultimate-v1');
      candidates.push('vultimate-v2');
    }
    
    // Handle special flow names
    if (flowId.includes('golden')) {
      candidates.push('golden-flow-v10');
    }
    if (flowId.includes('zero-friction')) {
      candidates.push('v9-zero-friction');
    }
    if (flowId.includes('chatgpt')) {
      candidates.push('chatgpt-agent');
      candidates.push('chatgpt-flow-1');
      candidates.push('chatgpt-flow-2');
      candidates.push('chatgpt-flow-3');
      candidates.push('chatgpt-research');
    }
    
    return [...new Set(candidates)]; // Remove duplicates
  }, []);
  
  const fetchFlowData = useCallback(async (flowId: string): Promise<FlowData> => {
    const flowIds = getFlowIdCandidates(flowId);
    
    // Fetch screenshots
    const { data: screenshots } = await supabase
      .from('flow_step_metrics')
      .select('step_number, step_name, mobile_screenshot_url, desktop_screenshot_url, created_at')
      .in('flow_id', flowIds)
      .order('step_number');
    
    // Deduplicate by step number, keep newest
    const stepMap = new Map<number, StepScreenshot>();
    screenshots?.forEach(s => {
      const existing = stepMap.get(s.step_number);
      if (!existing || new Date(s.created_at) > new Date(existing.createdAt)) {
        stepMap.set(s.step_number, {
          stepNumber: s.step_number,
          stepName: s.step_name,
          mobileUrl: s.mobile_screenshot_url,
          desktopUrl: s.desktop_screenshot_url,
          createdAt: s.created_at
        });
      }
    });
    
    // Fetch latest analysis
    const { data: analysis } = await supabase
      .from('flow_analysis_runs')
      .select('*')
      .in('flow_id', flowIds)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    // Fetch issues count
    const { count: issueCount } = await supabase
      .from('flow_ux_issues')
      .select('*', { count: 'exact', head: true })
      .in('flow_id', flowIds)
      .eq('is_resolved', false);
    
    return {
      flowId,
      screenshots: Array.from(stepMap.values()).sort((a, b) => a.stepNumber - b.stepNumber),
      score: {
        overall: analysis?.overall_score ?? null,
        conversion: analysis?.conversion_score ?? null,
        ux: analysis?.ux_score ?? null,
        mobile: analysis?.mobile_score ?? null,
        trust: analysis?.trust_score ?? null,
        performance: analysis?.performance_score ?? null
      },
      issues: issueCount || 0,
      lastAnalyzed: analysis?.created_at ?? null
    };
  }, [getFlowIdCandidates]);
  
  useEffect(() => {
    if (selectedFlow) {
      setLoading(true);
      fetchFlowData(selectedFlow)
        .then(data => {
          setFlowData(data);
          setCurrentStep(1);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedFlow, fetchFlowData]);
  
  useEffect(() => {
    if (compareFlow && isCompareMode) {
      fetchFlowData(compareFlow)
        .then(setCompareData)
        .catch(console.error);
    } else {
      setCompareData(null);
    }
  }, [compareFlow, isCompareMode, fetchFlowData]);
  
  // ─────────────────────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────────────────────
  
  const handleAnalyze = async () => {
    if (!selectedFlow) return;
    setIsAnalyzing(true);
    try {
      const normalizedId = selectedFlow.startsWith('umzugsofferten-')
        ? selectedFlow.replace('umzugsofferten-', '')
        : selectedFlow;
      
      const { error } = await supabase
        .from('flow_analysis_queue')
        .insert({
          flow_id: normalizedId,
          flow_version: 'latest',
          priority: 1
        });
      
      if (error) throw error;
      toast.success('Analyse gestartet!');
    } catch (err) {
      console.error(err);
      toast.error('Analyse konnte nicht gestartet werden');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleCapture = async () => {
    if (!selectedFlow) return;
    setIsCapturing(true);
    try {
      const { error } = await supabase.functions.invoke('bulk-screenshot-capture', {
        body: { flowIds: [selectedFlow], forceRecapture: true }
      });
      
      if (error) throw error;
      toast.success('Screenshot-Capture gestartet!');
      
      // Refresh after delay
      setTimeout(() => {
        fetchFlowData(selectedFlow).then(setFlowData);
      }, 5000);
    } catch (err) {
      console.error(err);
      toast.error('Capture fehlgeschlagen');
    } finally {
      setIsCapturing(false);
    }
  };
  
  const copyFlowUrl = () => {
    const baseUrl = getAnalysisBaseUrl();
    const normalizedId = selectedFlow.startsWith('umzugsofferten-')
      ? selectedFlow.replace('umzugsofferten-', '')
      : selectedFlow;
    const url = `${baseUrl}/umzugsofferten-${normalizedId}`;
    navigator.clipboard.writeText(url);
    toast.success('URL kopiert!');
  };
  
  const openLiveFlow = () => {
    const baseUrl = getAnalysisBaseUrl();
    const normalizedId = selectedFlow.startsWith('umzugsofferten-')
      ? selectedFlow.replace('umzugsofferten-', '')
      : selectedFlow;
    window.open(`${baseUrl}/umzugsofferten-${normalizedId}`, '_blank');
  };
  
  const generateAIFixPrompt = () => {
    const prompt = `Analysiere und verbessere den Flow \"${selectedFlow}\":

Aktueller Score: ${flowData?.score.overall || 'N/A'}/100
- Conversion: ${flowData?.score.conversion || '-'}/100
- UX: ${flowData?.score.ux || '-'}/100
- Mobile: ${flowData?.score.mobile || '-'}/100

Offene Issues: ${flowData?.issues || 0}

Bitte gib mir konkrete Code-Fixes für:
1. Die kritischsten UX-Probleme
2. Mobile-Optimierungen
3. Conversion-Verbesserungen`;
    
    navigator.clipboard.writeText(prompt);
    toast.success('AI Fix-Prompt kopiert!');
  };
  
  const exportScreenshots = async () => {
    if (!flowData) return;
    toast.info('Export wird vorbereitet...');
    // Simple JSON export
    const data = JSON.stringify(flowData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedFlow}-screenshots.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Export heruntergeladen!');
  };
  
  // ─────────────────────────────────────────────────────────────
  // Navigation
  // ─────────────────────────────────────────────────────────────
  
  const maxSteps = flowData?.screenshots.length || 0;
  const currentScreenshot = flowData?.screenshots.find(s => s.stepNumber === currentStep);
  const compareScreenshot = compareData?.screenshots.find(s => s.stepNumber === currentStep);
  
  const goToPrevStep = () => setCurrentStep(prev => Math.max(1, prev - 1));
  const goToNextStep = () => setCurrentStep(prev => Math.min(maxSteps, prev + 1));
  
  // Get current screenshot URL based on view mode
  const getCurrentUrl = (data: FlowData | null) => {
    if (!data) return null;
    const screenshot = data.screenshots.find(s => s.stepNumber === currentStep);
    return viewMode === 'mobile' ? screenshot?.mobileUrl : screenshot?.desktopUrl;
  };
  
  const getLiveUrl = (flowId: string) => {
    const baseUrl = getAnalysisBaseUrl();
    const normalizedId = flowId.startsWith('umzugsofferten-')
      ? flowId.replace('umzugsofferten-', '')
      : flowId;
    return `${baseUrl}/umzugsofferten-${normalizedId}`;
  };
  
  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  
  return (
    <div className={cn(
      "space-y-4",
      isFullscreen && "fixed inset-0 z-50 bg-background p-4 overflow-auto"
    )}>
      {/* Header Controls */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Flow Selector */}
            <div className="flex-1 min-w-[200px]">
              <Label className="text-xs text-muted-foreground mb-1 block">Flow auswählen</Label>
              <Select value={selectedFlow} onValueChange={setSelectedFlow}>
                <SelectTrigger>
                  <SelectValue placeholder="Flow wählen..." />
                </SelectTrigger>
                <SelectContent>
                  {allFlows.map(f => (
                    <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Compare Mode Toggle */}
            <div className="flex items-center gap-2">
              <Switch
                checked={isCompareMode}
                onCheckedChange={setIsCompareMode}
                id="compare-mode"
              />
              <Label htmlFor="compare-mode" className="text-sm cursor-pointer">Vergleich</Label>
            </div>
            
            {/* Compare Flow Selector */}
            {isCompareMode && (
              <div className="flex-1 min-w-[200px]">
                <Label className="text-xs text-muted-foreground mb-1 block">Vergleichen mit</Label>
                <Select value={compareFlow} onValueChange={setCompareFlow}>
                  <SelectTrigger>
                    <SelectValue placeholder="Flow zum Vergleichen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allFlows.filter(f => f.id !== selectedFlow).map(f => (
                      <SelectItem key={f.id} value={f.id}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Fullscreen Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFullscreen ? 'Vollbild beenden' : 'Vollbild'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
      
      {/* Score Overview */}
      {flowData && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          <ScoreCard label="Gesamt" value={flowData.score.overall} icon={<Target className="h-4 w-4" />} />
          <ScoreCard label="Conversion" value={flowData.score.conversion} icon={<TrendingUp className="h-4 w-4" />} />
          <ScoreCard label="UX" value={flowData.score.ux} icon={<Zap className="h-4 w-4" />} />
          <ScoreCard label="Mobile" value={flowData.score.mobile} icon={<Smartphone className="h-4 w-4" />} />
          <ScoreCard label="Trust" value={flowData.score.trust} icon={<Shield className="h-4 w-4" />} />
          <ScoreCard label="Performance" value={flowData.score.performance} icon={<BarChart3 className="h-4 w-4" />} />
          <Card className="bg-destructive/10 border-destructive/30">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-lg font-bold">{flowData.issues}</span>
              </div>
              <div className="text-xs text-muted-foreground">Issues</div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Quick Actions Bar */}
      <Card>
        <CardContent className="py-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border bg-muted/50 p-1">
              <Button
                variant={viewMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('mobile')}
                className="gap-1"
              >
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">Mobile</span>
              </Button>
              <Button
                variant={viewMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('desktop')}
                className="gap-1"
              >
                <Monitor className="h-4 w-4" />
                <span className="hidden sm:inline">Desktop</span>
              </Button>
            </div>
            
            {/* Display Mode Toggle */}
            <div className="flex items-center rounded-lg border bg-muted/50 p-1">
              <Button
                variant={displayMode === 'screenshot' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('screenshot')}
                className="gap-1"
              >
                <Camera className="h-4 w-4" />
                <span className="hidden sm:inline">Screenshot</span>
              </Button>
              <Button
                variant={displayMode === 'live' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('live')}
                className="gap-1"
              >
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline">Live</span>
              </Button>
              <Button
                variant={displayMode === 'split' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('split')}
                className="gap-1"
              >
                <SplitSquareHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Split</span>
              </Button>
              <Button
                variant={displayMode === 'side-by-side-all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDisplayMode('side-by-side-all')}
                className="gap-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
              >
                <Layers className="h-4 w-4" />
                <span className="hidden lg:inline">Alle Steps</span>
              </Button>
            </div>
            
            <div className="flex-1" />
            
            {/* Action Buttons */}
            <TooltipProvider>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleAnalyze} disabled={isAnalyzing || !selectedFlow}>
                      {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Neu analysieren</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleCapture} disabled={isCapturing || !selectedFlow}>
                      {isCapturing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Screenshots neu aufnehmen</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={generateAIFixPrompt} disabled={!selectedFlow}>
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>AI Fix-Prompt kopieren</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={copyFlowUrl} disabled={!selectedFlow}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Flow-URL kopieren</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={openLiveFlow} disabled={!selectedFlow}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Flow öffnen</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={exportScreenshots} disabled={!flowData}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Screenshots exportieren</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setShowHistory(true)} disabled={!selectedFlow}>
                      <History className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Version History</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
      
      {/* Step Navigator */}
      {flowData && maxSteps > 0 && (
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevStep}
                disabled={currentStep <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    Step {currentStep} / {maxSteps}
                  </span>
                  {currentScreenshot?.stepName && (
                    <Badge variant="outline">{currentScreenshot.stepName}</Badge>
                  )}
                </div>
                <Progress value={(currentStep / maxSteps) * 100} className="h-2" />
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={goToNextStep}
                disabled={currentStep >= maxSteps}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Step Thumbnails */}
            <ScrollArea className="mt-4">
              <div className="flex gap-2 pb-2">
                {flowData.screenshots.map(s => (
                  <button
                    key={s.stepNumber}
                    onClick={() => setCurrentStep(s.stepNumber)}
                    className={cn(
                      "flex-shrink-0 w-16 h-12 rounded border-2 overflow-hidden transition-all",
                      s.stepNumber === currentStep
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-muted hover:border-primary/50"
                    )}
                  >
                    {(viewMode === 'mobile' ? s.mobileUrl : s.desktopUrl) ? (
                      <img
                        src={viewMode === 'mobile' ? s.mobileUrl! : s.desktopUrl!}
                        alt={`Step ${s.stepNumber}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageOff className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      
      {/* Main Content Area */}
      {loading ? (
        <Card className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Card>
      ) : !selectedFlow ? (
        <Card className="min-h-[400px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Layers className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Wähle einen Flow aus um zu starten</p>
          </div>
        </Card>
      ) : displayMode === 'side-by-side-all' ? (
        /* Side-by-Side Slider View - Flows untereinander, Steps als Slider */
        <div className="space-y-8">
          {/* Current Flow with Slider */}
          <FlowStepSlider
            flowId={selectedFlow}
            flowData={flowData}
            viewMode={viewMode}
            getLiveUrl={getLiveUrl}
          />
          
          {/* Compare Flow if active */}
          {isCompareMode && compareFlow && compareData && (
            <FlowStepSlider
              flowId={compareFlow}
              flowData={compareData}
              viewMode={viewMode}
              getLiveUrl={getLiveUrl}
            />
          )}
        </div>
      ) : (
        <div className={cn(
          "grid gap-4",
          isCompareMode && compareFlow ? "grid-cols-2" : "grid-cols-1"
        )}>
          {/* Main Flow */}
          <FlowPreviewCard
            flowId={selectedFlow}
            screenshot={currentScreenshot}
            viewMode={viewMode}
            displayMode={displayMode}
            liveUrl={getLiveUrl(selectedFlow)}
            showOverlay={showOverlay && displayMode === 'split'}
            sliderPosition={sliderPosition}
            onSliderChange={setSliderPosition}
          />
          
          {/* Compare Flow */}
          {isCompareMode && compareFlow && (
            <FlowPreviewCard
              flowId={compareFlow}
              screenshot={compareScreenshot}
              viewMode={viewMode}
              displayMode={displayMode}
              liveUrl={getLiveUrl(compareFlow)}
              showOverlay={false}
              sliderPosition={50}
            />
          )}
        </div>
      )}
      
      {/* Split Mode Controls */}
      {displayMode === 'split' && (
        <Card>
          <CardContent className="py-3">
            <div className="flex items-center gap-4">
              <Label className="text-sm">Overlay Position:</Label>
              <Slider
                value={[sliderPosition]}
                onValueChange={([v]) => setSliderPosition(v)}
                min={0}
                max={100}
                step={1}
                className="flex-1"
              />
              <Badge variant="outline">{sliderPosition}%</Badge>
              <div className="flex items-center gap-2">
                <Switch
                  checked={showOverlay}
                  onCheckedChange={setShowOverlay}
                  id="overlay-mode"
                />
                <Label htmlFor="overlay-mode" className="text-sm">Overlay</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Last Analyzed Info */}
      {flowData?.lastAnalyzed && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Zuletzt analysiert: {formatRelativeTime(flowData.lastAnalyzed)}</span>
        </div>
      )}
      
      {/* History Dialog */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="max-w-2xl">
          <DialogTitle>Version History: {selectedFlow}</DialogTitle>
          <VersionHistoryPanel flowId={selectedFlow} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// Helper Components
// ─────────────────────────────────────────────────────────────

const ScoreCard: React.FC<{
  label: string;
  value: number | null;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <Card>
    <CardContent className="p-3 text-center">
      <div className={cn("flex items-center justify-center gap-1", getScoreColor(value))}>
        {icon}
        <span className="text-lg font-bold">{value ?? '-'}</span>
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </CardContent>
  </Card>
);
// ─────────────────────────────────────────────────────────────
// Flow Step Slider Component - Swipeable/Clickable Step Navigation
// ─────────────────────────────────────────────────────────────

const FlowStepSlider: React.FC<{
  flowId: string;
  flowData: FlowData | null;
  viewMode: 'mobile' | 'desktop';
  getLiveUrl: (flowId: string) => string;
}> = ({ flowId, flowData, viewMode, getLiveUrl }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  
  const screenshots = flowData?.screenshots || [];
  const currentStep = screenshots[currentStepIndex];
  const totalSteps = screenshots.length;
  const stepLiveUrl = getLiveUrl(flowId);
  
  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < totalSteps) {
      setCurrentStepIndex(index);
    }
  }, [totalSteps]);
  
  const goNext = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStepIndex, totalSteps]);
  
  const goPrev = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);
  
  // Touch/Mouse handlers for swipe
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragOffset(0);
  };
  
  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const offset = clientX - dragStartX;
    setDragOffset(offset);
  };
  
  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 80; // pixels needed to trigger navigation
    if (dragOffset > threshold) {
      goPrev();
    } else if (dragOffset < -threshold) {
      goNext();
    }
    setDragOffset(0);
  };
  
  const screenshotUrl = viewMode === 'mobile' ? currentStep?.mobileUrl : currentStep?.desktopUrl;
  
  if (!flowData || screenshots.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <ImageOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Keine Screenshots für {flowId}</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="overflow-hidden">
      {/* Header with Flow info and Step navigation */}
      <CardHeader className="py-3 px-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              {currentStep?.stepNumber || 1}
            </div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {flowId}
                <Badge variant="outline" className="text-xs">
                  Step {currentStepIndex + 1} / {totalSteps}
                </Badge>
              </CardTitle>
              {currentStep?.stepName && (
                <p className="text-xs text-muted-foreground">{currentStep.stepName}</p>
              )}
            </div>
          </div>
          
          {/* Step dots indicator */}
          <div className="flex items-center gap-1">
            {screenshots.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToStep(idx)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  idx === currentStepIndex
                    ? "bg-primary w-6"
                    : "bg-primary/30 hover:bg-primary/50"
                )}
                aria-label={`Go to step ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </CardHeader>
      
      {/* Main slider content */}
      <CardContent className="p-0 relative">
        {/* Navigation arrows */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg",
            currentStepIndex === 0 && "opacity-30 pointer-events-none"
          )}
          onClick={goPrev}
          disabled={currentStepIndex === 0}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-background/90 backdrop-blur-sm shadow-lg",
            currentStepIndex === totalSteps - 1 && "opacity-30 pointer-events-none"
          )}
          onClick={goNext}
          disabled={currentStepIndex === totalSteps - 1}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
        
        {/* Swipeable content area */}
        <div
          className="grid grid-cols-2 divide-x select-none cursor-grab active:cursor-grabbing touch-pan-y"
          onMouseDown={(e) => handleDragStart(e.clientX)}
          onMouseMove={(e) => handleDragMove(e.clientX)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
          onTouchEnd={handleDragEnd}
          style={{
            transform: isDragging ? `translateX(${dragOffset * 0.3}px)` : undefined,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out'
          }}
        >
          {/* Screenshot Side (Links) */}
          <div className="relative">
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-blue-600 text-white shadow-md">📸 Screenshot</Badge>
            </div>
            {screenshotUrl ? (
              <div className={cn(
                "bg-muted/30 flex items-center justify-center p-6",
                viewMode === 'mobile' ? "min-h-[550px]" : "min-h-[450px]"
              )}>
                <img
                  src={screenshotUrl}
                  alt={`Step ${currentStep?.stepNumber} screenshot`}
                  className={cn(
                    "max-h-[600px] object-contain rounded-lg shadow-lg border pointer-events-none",
                    viewMode === 'mobile' && "max-w-[300px]"
                  )}
                  draggable={false}
                />
              </div>
            ) : (
              <div className="h-[450px] flex items-center justify-center bg-muted/30">
                <div className="text-center text-muted-foreground">
                  <ImageOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Kein Screenshot</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Live Side (Rechts) */}
          <div className="relative">
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-green-600 text-white shadow-md">▶ Live</Badge>
            </div>
            <div className={cn(
              "bg-white flex items-center justify-center p-6",
              viewMode === 'mobile' ? "min-h-[550px]" : "min-h-[450px]"
            )}>
              <div className={cn(
                "relative overflow-hidden rounded-lg shadow-lg border bg-white pointer-events-none",
                viewMode === 'mobile' ? "w-[300px] h-[550px]" : "w-full h-[450px]"
              )}>
                <iframe
                  src={`${stepLiveUrl}?step=${currentStep?.stepNumber || 1}`}
                  className="w-full h-full border-0"
                  title={`Step ${currentStep?.stepNumber} live`}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom step thumbnails */}
        <div className="border-t bg-muted/30 p-3">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-1">
              {screenshots.map((step, idx) => {
                const thumbUrl = viewMode === 'mobile' ? step.mobileUrl : step.desktopUrl;
                const isActive = idx === currentStepIndex;
                
                return (
                  <button
                    key={step.stepNumber}
                    onClick={() => goToStep(idx)}
                    className={cn(
                      "relative flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all",
                      isActive 
                        ? "border-primary ring-2 ring-primary/30 scale-110" 
                        : "border-muted hover:border-primary/50"
                    )}
                  >
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={`Step ${step.stepNumber}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageOff className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                    <div className={cn(
                      "absolute bottom-0 left-0 right-0 text-center text-[10px] font-bold py-0.5",
                      isActive ? "bg-primary text-primary-foreground" : "bg-black/60 text-white"
                    )}>
                      {step.stepNumber}
                    </div>
                  </button>
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

const FlowPreviewCard: React.FC<{
  flowId: string;
  screenshot: StepScreenshot | undefined;
  viewMode: 'mobile' | 'desktop';
  displayMode: 'screenshot' | 'live' | 'split' | 'side-by-side-all';
  liveUrl: string;
  showOverlay: boolean;
  sliderPosition: number;
  onSliderChange?: (value: number) => void;
}> = ({ flowId, screenshot, viewMode, displayMode, liveUrl, showOverlay, sliderPosition }) => {
  const screenshotUrl = viewMode === 'mobile' ? screenshot?.mobileUrl : screenshot?.desktopUrl;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-2 px-4 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">{flowId}</CardTitle>
          <Badge variant="outline" className="text-xs">
            Step {screenshot?.stepNumber || '-'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 relative min-h-[400px] bg-muted/30">
        {displayMode === 'screenshot' && (
          screenshotUrl ? (
            <img
              src={screenshotUrl}
              alt={`${flowId} screenshot`}
              className={cn(
                "w-full h-auto",
                viewMode === 'mobile' && "max-w-[375px] mx-auto"
              )}
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <ImageOff className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Kein Screenshot verfügbar</p>
              </div>
            </div>
          )
        )}
        
        {displayMode === 'live' && (
          <div className={cn(
            "relative bg-white",
            viewMode === 'mobile' ? "max-w-[375px] mx-auto h-[667px]" : "w-full h-[600px]"
          )}>
            <iframe
              src={liveUrl}
              className="w-full h-full border-0"
              title={`${flowId} live preview`}
            />
          </div>
        )}
        
        {displayMode === 'split' && (
          <div className="relative h-[500px] overflow-hidden">
            {/* Screenshot layer */}
            <div
              className="absolute inset-0"
              style={{ clipPath: showOverlay ? `inset(0 ${100 - sliderPosition}% 0 0)` : undefined }}
            >
              {screenshotUrl ? (
                <img
                  src={screenshotUrl}
                  alt={`${flowId} screenshot`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <ImageOff className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            
            {/* Live layer (behind) */}
            <div
              className="absolute inset-0"
              style={{ clipPath: showOverlay ? `inset(0 0 0 ${sliderPosition}%)` : undefined }}
            >
              <iframe
                src={liveUrl}
                className="w-full h-full border-0"
                title={`${flowId} live preview`}
              />
            </div>
            
            {/* Divider */}
            {showOverlay && (
              <div
                className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <ArrowLeftRight className="h-4 w-4 text-primary-foreground" />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const VersionHistoryPanel: React.FC<{ flowId: string }> = ({ flowId }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchHistory = async () => {
      const normalizedId = flowId.startsWith('umzugsofferten-')
        ? flowId.replace('umzugsofferten-', '')
        : flowId;
      const flowIds = [flowId, normalizedId, `umzugsofferten-${normalizedId}`];
      
      const { data } = await supabase
        .from('flow_analysis_runs')
        .select('id, created_at, overall_score, status')
        .in('flow_id', flowIds)
        .order('created_at', { ascending: false })
        .limit(20);
      
      setHistory(data || []);
      setLoading(false);
    };
    
    fetchHistory();
  }, [flowId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {history.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Keine History vorhanden</p>
        ) : (
          history.map((run, index) => (
            <div
              key={run.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border",
                index === 0 && "bg-primary/5 border-primary/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  run.status === 'completed' ? "bg-green-500" : "bg-yellow-500"
                )} />
                <div>
                  <div className="text-sm font-medium">
                    {formatRelativeTime(run.created_at)}
                    {index === 0 && <Badge className="ml-2" variant="outline">Aktuell</Badge>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(run.created_at).toLocaleString('de-CH')}
                  </div>
                </div>
              </div>
              <div className={cn("text-lg font-bold", getScoreColor(run.overall_score))}>
                {run.overall_score ?? '-'}
              </div>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default FlowStudioView;

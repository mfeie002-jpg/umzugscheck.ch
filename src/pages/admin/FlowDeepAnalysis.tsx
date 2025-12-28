/**
 * Flow Deep Analysis Page - Comprehensive visual analysis of all flow variants (V1-V9)
 * 
 * Features:
 * - Side-by-side visual comparison
 * - Element-level analysis with scores
 * - AI-powered recommendations
 * - Winner determination and synthesis
 * - Automatic optimization suggestions
 * - Support for all flow versions V1-V9
 */

import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, Trophy, Target, Zap, CheckCircle, AlertTriangle,
  AlertCircle, ChevronRight, Star, TrendingUp, Eye, Code, Download,
  RefreshCw, BarChart3, Layers, Sparkles, Crown, Medal, Award, ListOrdered,
  Wand2, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AnalysisQueuePanel from '@/components/admin/AnalysisQueuePanel';

interface ElementAnalysis {
  elementType: string;
  elementName: string;
  scores: {
    visibility: number;
    usability: number;
    conversion: number;
    mobile: number;
    accessibility: number;
  };
  issues: Array<{
    severity: 'critical' | 'warning' | 'info';
    description: string;
    recommendation: string;
    effort: 'low' | 'medium' | 'high';
  }>;
  bestPractices: string[];
  improvements: string[];
}

interface FlowAnalysis {
  flowId: string;
  flowName: string;
  overallScore: number;
  categoryScores: {
    ux: number;
    conversion: number;
    mobile: number;
    accessibility: number;
    performance: number;
    trust: number;
    clarity: number;
  };
  elements: ElementAnalysis[];
  strengths: string[];
  weaknesses: string[];
  keyInsights: string[];
  conversionKillers: string[];
  quickWins: string[];
  stepByStepAnalysis: Array<{
    step: number;
    name: string;
    score: number;
    dropOffRisk: string;
    friction: string[];
    positives: string[];
  }>;
}

interface Synthesis {
  winner: {
    flowId: string;
    flowName: string;
    totalScore: number;
    reasoning: string;
  };
  ranking: Array<{
    position: number;
    flowId: string;
    score: number;
    keyStrength: string;
    keyWeakness: string;
  }>;
  bestElements: Array<{
    element: string;
    sourceFlow: string;
    reason: string;
    implementation: string;
  }>;
  ultimateFlow: {
    name: string;
    description: string;
    steps: Array<{
      number: number;
      name: string;
      sourceFlow: string;
      elements: string[];
      improvements: string[];
    }>;
    expectedConversionLift: string;
    implementationPriority: Array<{
      priority: number;
      change: string;
      effort: string;
      impact: string;
      sourceFlow: string;
    }>;
  };
  codeChanges: Array<{
    file: string;
    component: string;
    currentState: string;
    proposedChange: string;
    implementation: string;
  }>;
}

// All available flow versions
const ALL_FLOWS = [
  { id: 'v1', label: 'V1', flowId: 'umzugsofferten-v1' },
  { id: 'v2', label: 'V2', flowId: 'umzugsofferten-v2' },
  { id: 'v3', label: 'V3', flowId: 'umzugsofferten-v3' },
  { id: 'v4', label: 'V4', flowId: 'umzugsofferten-v4' },
  { id: 'v5', label: 'V5', flowId: 'umzugsofferten-v5' },
  { id: 'v6', label: 'V6', flowId: 'umzugsofferten-v6' },
  { id: 'v7', label: 'V7', flowId: 'umzugsofferten-v7' },
  { id: 'v8', label: 'V8', flowId: 'umzugsofferten-v8' },
  { id: 'v9', label: 'V9', flowId: 'umzugsofferten-v9' },
];

const ScoreRing = ({ score, size = 'md', label }: { score: number; size?: 'sm' | 'md' | 'lg'; label?: string }) => {
  const sizeClasses = {
    sm: 'w-12 h-12 text-sm',
    md: 'w-20 h-20 text-lg',
    lg: 'w-28 h-28 text-2xl'
  };
  
  const getColor = (s: number) => {
    if (s >= 80) return 'text-green-500 stroke-green-500';
    if (s >= 60) return 'text-yellow-500 stroke-yellow-500';
    return 'text-red-500 stroke-red-500';
  };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/20"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${score * 2.64} 264`}
          className={getColor(score)}
        />
      </svg>
      <div className="flex flex-col items-center">
        <span className={`font-bold ${getColor(score)}`}>{score}</span>
        {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
};

const SeverityBadge = ({ severity }: { severity: 'critical' | 'warning' | 'info' }) => {
  const config = {
    critical: { bg: 'bg-red-100 dark:bg-red-950', text: 'text-red-700 dark:text-red-300', icon: AlertCircle },
    warning: { bg: 'bg-yellow-100 dark:bg-yellow-950', text: 'text-yellow-700 dark:text-yellow-300', icon: AlertTriangle },
    info: { bg: 'bg-blue-100 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300', icon: AlertCircle }
  };
  const { bg, text, icon: Icon } = config[severity];
  
  return (
    <Badge variant="outline" className={`${bg} ${text} gap-1`}>
      <Icon className="h-3 w-3" />
      {severity}
    </Badge>
  );
};

const EffortBadge = ({ effort }: { effort: string }) => {
  const config: Record<string, string> = {
    low: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    high: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
  };
  
  return (
    <Badge variant="outline" className={config[effort] || config.medium}>
      {effort} effort
    </Badge>
  );
};

export default function FlowDeepAnalysis() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBackgroundAnalysis, setIsBackgroundAnalysis] = useState(false);
  const [analyses, setAnalyses] = useState<FlowAnalysis[]>([]);
  const [synthesis, setSynthesis] = useState<Synthesis | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Selected flow for analysis (default to V1)
  const [selectedFlowVersion, setSelectedFlowVersion] = useState<string>(() => {
    return searchParams.get('flow') || 'v1';
  });
  
  // Available variants for the selected flow
  const [availableVariants, setAvailableVariants] = useState<string[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  
  // Background job tracking
  const [backgroundJob, setBackgroundJob] = useState<{
    id: string;
    status: string;
    stepsCaptured: number;
    totalSteps: number;
    startedAt: string | null;
  } | null>(null);

  // Fix-It state tracking
  const [fixingFlowId, setFixingFlowId] = useState<string | null>(null);

  // Update URL when flow version changes
  useEffect(() => {
    setSearchParams(prev => {
      prev.set('flow', selectedFlowVersion);
      return prev;
    });
  }, [selectedFlowVersion, setSearchParams]);

  // Fetch available variants for the selected flow
  useEffect(() => {
    const fetchVariants = async () => {
      setLoadingVariants(true);
      try {
        const flowConfig = ALL_FLOWS.find(f => f.id === selectedFlowVersion);
        if (!flowConfig) {
          setAvailableVariants([]);
          return;
        }
        
        const { data, error } = await supabase
          .from('flow_versions')
          .select('version_number, flow_code, version_name')
          .eq('flow_id', flowConfig.flowId)
          .eq('is_active', true)
          .order('version_number');
        
        if (error) {
          console.error('Error fetching variants:', error);
          setAvailableVariants([]);
          return;
        }
        
        const variantIds = (data || []).map(v => 
          v.flow_code?.toLowerCase() || `${selectedFlowVersion}.${v.version_number}`
        );
        setAvailableVariants(variantIds);
      } catch (err) {
        console.error('Error in fetchVariants:', err);
        setAvailableVariants([]);
      } finally {
        setLoadingVariants(false);
      }
    };
    fetchVariants();
  }, [selectedFlowVersion]);

  // Check for previous analysis results and running jobs on load
  useEffect(() => {
    const checkForResults = async () => {
      try {
        const flowConfig = ALL_FLOWS.find(f => f.id === selectedFlowVersion);
        if (!flowConfig) return;
        
        // First check for running queue items
        const { data: queueData } = await supabase
          .from('flow_analysis_queue')
          .select('*')
          .eq('flow_id', flowConfig.flowId)
          .in('status', ['queued', 'processing'])
          .order('queued_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (queueData) {
          // There's an active queue item
          setBackgroundJob({
            id: queueData.id,
            status: queueData.status === 'processing' ? 'running' : 'queued',
            stepsCaptured: 0,
            totalSteps: 0,
            startedAt: queueData.started_at
          });
          setAnalyses([]);
          setSynthesis(null);
          return;
        }
        
        // Then check flow_analysis_runs
        const { data, error } = await supabase
          .from('flow_analysis_runs')
          .select('*')
          .eq('run_type', 'deep-archetyp-analysis')
          .eq('flow_id', flowConfig.flowId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) {
          console.error('Error loading previous analysis:', error);
          return;
        }

        if (data) {
          // Check if it's a running job
          if (data.status === 'running' || data.status === 'pending') {
            setBackgroundJob({
              id: data.id,
              status: data.status,
              stepsCaptured: data.steps_captured || 0,
              totalSteps: data.total_steps || 0,
              startedAt: data.started_at
            });
            // Clear any previous results when there's an active job
            setAnalyses([]);
            setSynthesis(null);
          } else if (data.status === 'completed') {
            setBackgroundJob(null);
            // Load previous results
            const metadata = data.metadata as any;
            if (metadata?.analyses && Array.isArray(metadata.analyses)) {
              setAnalyses(metadata.analyses.map((a: any) => ({
                flowId: a.flowId || '',
                flowName: a.flowName || '',
                overallScore: a.overallScore || 0,
                categoryScores: a.categoryScores || { ux: 0, conversion: 0, mobile: 0, accessibility: 0, performance: 0, trust: 0, clarity: 0 },
                elements: a.elements || [],
                strengths: a.strengths || [],
                weaknesses: a.weaknesses || [],
                keyInsights: a.keyInsights || [],
                conversionKillers: a.conversionKillers || [],
                quickWins: a.quickWins || [],
                stepByStepAnalysis: a.stepByStepAnalysis || []
              })));
            }
            const aiRecs = data.ai_recommendations as any;
            if (aiRecs && Array.isArray(aiRecs) && aiRecs.length > 0) {
              setSynthesis(aiRecs[0] as any);
            }
          } else {
            // Failed or other status
            setBackgroundJob(null);
            setAnalyses([]);
            setSynthesis(null);
          }
        } else {
          setBackgroundJob(null);
          setAnalyses([]);
          setSynthesis(null);
        }
      } catch (err) {
        console.error('Error in checkForResults:', err);
      }
    };
    checkForResults();
  }, [selectedFlowVersion]);

  // Poll for background job progress (checks both queue and runs)
  useEffect(() => {
    if (!backgroundJob || backgroundJob.status === 'completed') return;
    
    const flowConfig = ALL_FLOWS.find(f => f.id === selectedFlowVersion);
    
    const pollInterval = setInterval(async () => {
      try {
        // First check queue status
        const { data: queueData } = await supabase
          .from('flow_analysis_queue')
          .select('*')
          .eq('id', backgroundJob.id)
          .maybeSingle();
        
        if (queueData) {
          if (queueData.status === 'completed' && queueData.result_run_id) {
            // Queue item completed, load results from the run
            const { data: runData } = await supabase
              .from('flow_analysis_runs')
              .select('*')
              .eq('id', queueData.result_run_id)
              .single();
            
            if (runData && runData.status === 'completed') {
              setBackgroundJob(null);
              const metadata = runData.metadata as any;
              if (metadata?.analyses && Array.isArray(metadata.analyses)) {
                setAnalyses(metadata.analyses.map((a: any) => ({
                  flowId: a.flowId || '',
                  flowName: a.flowName || '',
                  overallScore: a.overallScore || 0,
                  categoryScores: a.categoryScores || { ux: 0, conversion: 0, mobile: 0, accessibility: 0, performance: 0, trust: 0, clarity: 0 },
                  elements: a.elements || [],
                  strengths: a.strengths || [],
                  weaknesses: a.weaknesses || [],
                  keyInsights: a.keyInsights || [],
                  conversionKillers: a.conversionKillers || [],
                  quickWins: a.quickWins || [],
                  stepByStepAnalysis: a.stepByStepAnalysis || []
                })));
              }
              const aiRecs = runData.ai_recommendations as any;
              if (aiRecs && Array.isArray(aiRecs) && aiRecs.length > 0) {
                setSynthesis(aiRecs[0] as any);
              }
              toast({ title: 'Analyse abgeschlossen', description: 'Ergebnisse wurden geladen.' });
              return;
            }
          } else if (queueData.status === 'failed') {
            setBackgroundJob(null);
            toast({ title: 'Analyse fehlgeschlagen', description: queueData.error_message || 'Die Analyse ist fehlgeschlagen.', variant: 'destructive' });
            return;
          } else if (queueData.status === 'processing' || queueData.status === 'queued') {
            // Still processing/queued
            setBackgroundJob(prev => prev ? {
              ...prev,
              status: queueData.status === 'processing' ? 'running' : 'queued',
              startedAt: queueData.started_at
            } : null);
            return;
          }
        }
        
        // Fallback: check flow_analysis_runs directly
        const { data, error } = await supabase
          .from('flow_analysis_runs')
          .select('*')
          .eq('id', backgroundJob.id)
          .maybeSingle();
        
        if (error || !data) {
          // Check if there's any running job for this flow
          if (flowConfig) {
            const { data: latestRun } = await supabase
              .from('flow_analysis_runs')
              .select('*')
              .eq('flow_id', flowConfig.flowId)
              .in('status', ['running', 'pending'])
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
            
            if (latestRun) {
              setBackgroundJob({
                id: latestRun.id,
                status: latestRun.status,
                stepsCaptured: latestRun.steps_captured || 0,
                totalSteps: latestRun.total_steps || 0,
                startedAt: latestRun.started_at
              });
            }
          }
          return;
        }
        
        if (data.status === 'completed') {
          setBackgroundJob(null);
          const metadata = data.metadata as any;
          if (metadata?.analyses && Array.isArray(metadata.analyses)) {
            setAnalyses(metadata.analyses.map((a: any) => ({
              flowId: a.flowId || '',
              flowName: a.flowName || '',
              overallScore: a.overallScore || 0,
              categoryScores: a.categoryScores || { ux: 0, conversion: 0, mobile: 0, accessibility: 0, performance: 0, trust: 0, clarity: 0 },
              elements: a.elements || [],
              strengths: a.strengths || [],
              weaknesses: a.weaknesses || [],
              keyInsights: a.keyInsights || [],
              conversionKillers: a.conversionKillers || [],
              quickWins: a.quickWins || [],
              stepByStepAnalysis: a.stepByStepAnalysis || []
            })));
          }
          const aiRecs = data.ai_recommendations as any;
          if (aiRecs && Array.isArray(aiRecs) && aiRecs.length > 0) {
            setSynthesis(aiRecs[0] as any);
          }
          toast({ title: 'Analyse abgeschlossen', description: 'Ergebnisse wurden geladen.' });
        } else if (data.status === 'failed') {
          setBackgroundJob(null);
          toast({ title: 'Analyse fehlgeschlagen', description: 'Die Hintergrund-Analyse ist fehlgeschlagen.', variant: 'destructive' });
        } else {
          setBackgroundJob(prev => prev ? {
            ...prev,
            status: data.status,
            stepsCaptured: data.steps_captured || 0,
            totalSteps: data.total_steps || 0
          } : null);
        }
      } catch (err) {
        console.error('Error in poll:', err);
      }
    }, 3000);
    
    return () => clearInterval(pollInterval);
  }, [backgroundJob?.id, backgroundJob?.status, selectedFlowVersion, toast]);

  // Function to load results from database
  const loadAnalysisResults = async () => {
    try {
      const flowConfig = ALL_FLOWS.find(f => f.id === selectedFlowVersion);
      if (!flowConfig) return false;
      
      const { data, error } = await supabase
        .from('flow_analysis_runs')
        .select('*')
        .eq('run_type', 'deep-archetyp-analysis')
        .eq('flow_id', flowConfig.flowId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error loading analysis:', error);
        return false;
      }

      if (data && data.status === 'completed') {
        const metadata = data.metadata as any;
        if (metadata?.analyses && Array.isArray(metadata.analyses)) {
          setAnalyses(metadata.analyses.map((a: any) => ({
            flowId: a.flowId || '',
            flowName: a.flowName || '',
            overallScore: a.overallScore || 0,
            categoryScores: a.categoryScores || { ux: 0, conversion: 0, mobile: 0, accessibility: 0, performance: 0, trust: 0, clarity: 0 },
            elements: a.elements || [],
            strengths: a.strengths || [],
            weaknesses: a.weaknesses || [],
            keyInsights: a.keyInsights || [],
            conversionKillers: a.conversionKillers || [],
            quickWins: a.quickWins || [],
            stepByStepAnalysis: a.stepByStepAnalysis || []
          })));
        }
        const aiRecs = data.ai_recommendations as any;
        if (aiRecs && Array.isArray(aiRecs) && aiRecs.length > 0) {
          setSynthesis(aiRecs[0] as any);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error in loadAnalysisResults:', err);
      return false;
    }
  };

  const runDeepAnalysis = async (background = false) => {
    if (availableVariants.length === 0) {
      toast({
        title: 'Keine Varianten',
        description: `Keine aktiven Varianten für ${selectedFlowVersion.toUpperCase()} gefunden.`,
        variant: 'destructive'
      });
      return;
    }
    
    setIsAnalyzing(true);
    setIsBackgroundAnalysis(background);
    
    const flowConfig = ALL_FLOWS.find(f => f.id === selectedFlowVersion);
    
    toast({
      title: background ? 'Hintergrund-Analyse gestartet' : 'Tiefenanalyse gestartet',
      description: background 
        ? 'Sie können die Seite verlassen. Ergebnisse werden gespeichert.'
        : `Analysiere ${availableVariants.length} ${selectedFlowVersion.toUpperCase()} Varianten...`,
    });

    try {
      const { data, error } = await supabase.functions.invoke('deep-flow-analysis', {
        body: {
          flowIds: availableVariants,
          flowId: flowConfig?.flowId,
          flowVersion: selectedFlowVersion,
          analysisType: 'synthesis',
          includeRecommendations: true,
          background
        }
      });

      if (error) throw error;

      if (background) {
        // Background mode - just show confirmation
        toast({
          title: 'Analyse läuft im Hintergrund',
          description: 'Sie können die Seite verlassen. Ergebnisse werden automatisch gespeichert.',
        });
        setIsAnalyzing(false);
        setIsBackgroundAnalysis(false);
        return;
      }

      // Set results directly from response
      setAnalyses(data.analyses || []);
      setSynthesis(data.synthesis || null);
      
      // Also set selectedFlow to first analyzed flow for immediate display
      if (data.analyses?.length > 0) {
        setSelectedFlow(data.analyses[0].flowId);
      }
      
      toast({
        title: 'Analyse abgeschlossen',
        description: `${data.analyses?.length || 0} Flows analysiert. Gewinner: ${data.synthesis?.winner?.flowId || 'N/A'}`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Fehler',
        description: 'Analyse konnte nicht durchgeführt werden',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
      setIsBackgroundAnalysis(false);
    }
  };

  // Function to refresh/reload results from database
  const refreshResults = async () => {
    toast({ title: 'Lade Ergebnisse...', description: 'Suche nach gespeicherten Analysen...' });
    const found = await loadAnalysisResults();
    if (found) {
      toast({ title: 'Ergebnisse geladen', description: 'Gespeicherte Analyse wurde gefunden und geladen.' });
    } else {
      toast({ title: 'Keine Ergebnisse', description: 'Keine gespeicherten Analysen gefunden.', variant: 'destructive' });
    }
  };

  // AI Fix Flow function
  const handleFixFlow = async (analysis: FlowAnalysis) => {
    setFixingFlowId(analysis.flowId);
    
    toast({
      title: 'AI-Optimierung gestartet',
      description: `Generiere Award-Level Optimierungen für ${analysis.flowName}...`,
    });

    try {
      const { data, error } = await supabase.functions.invoke('ai-fix-flow', {
        body: {
          flowId: analysis.flowId,
          flowName: analysis.flowName,
          analysis: {
            overallScore: analysis.overallScore,
            categoryScores: analysis.categoryScores,
            strengths: analysis.strengths,
            weaknesses: analysis.weaknesses,
            conversionKillers: analysis.conversionKillers,
            quickWins: analysis.quickWins,
            elements: analysis.elements
          },
          targetScore: 95
        }
      });

      if (error) throw error;

      toast({
        title: 'Optimierung abgeschlossen!',
        description: `${data.optimization?.summary?.totalChanges || 0} Änderungen generiert. Score: ${analysis.overallScore} → ${data.optimization?.optimizedFlow?.expectedScore || 95}+`,
      });

      // Open the generated variant for viewing
      if (data.variantId) {
        window.open(`/admin/flow-feedback-variants?variant=${data.variantId}`, '_blank');
      }
    } catch (error) {
      console.error('Fix flow error:', error);
      toast({
        title: 'Fehler',
        description: 'AI-Optimierung konnte nicht durchgeführt werden',
        variant: 'destructive'
      });
    } finally {
      setFixingFlowId(null);
    }
  };

  const selectedAnalysis = analyses.find(a => a.flowId === selectedFlow);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/admin/tools?tab=flow-automation">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Flow Tiefenanalyse
                </h1>
                <p className="text-sm text-muted-foreground">
                  Element-Level Analyse • AI-Recommendations • Winner Synthesis
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Flow Version Selector */}
              <Select value={selectedFlowVersion} onValueChange={setSelectedFlowVersion}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Flow wählen" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_FLOWS.map(flow => (
                    <SelectItem key={flow.id} value={flow.id}>
                      {flow.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Refresh Results Button */}
              <Button 
                onClick={refreshResults} 
                disabled={isAnalyzing}
                variant="ghost"
                size="lg"
                className="gap-2"
                title="Gespeicherte Ergebnisse laden"
              >
                <Download className="h-5 w-5" />
                Laden
              </Button>
              
              <Button 
                onClick={() => runDeepAnalysis(true)} 
                disabled={isAnalyzing || loadingVariants || availableVariants.length === 0}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                Hintergrund
              </Button>
              <Button 
                onClick={() => runDeepAnalysis(false)} 
                disabled={isAnalyzing || loadingVariants || availableVariants.length === 0}
                size="lg"
                className="gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Analysiere...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Tiefenanalyse starten
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* No Analysis State */}
        {analyses.length === 0 && !isAnalyzing && !backgroundJob && (
          <Card className="max-w-2xl mx-auto text-center py-16">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <BarChart3 className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Umfassende {selectedFlowVersion.toUpperCase()} Flow Analyse
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Analysiere alle {selectedFlowVersion.toUpperCase()} Varianten auf Element-Level. Erhalte AI-Recommendations, 
                  identifiziere den Gewinner und generiere die ultimative Version.
                </p>
              </div>
              
              {loadingVariants ? (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Lade Varianten...
                </div>
              ) : availableVariants.length > 0 ? (
                <div className="flex flex-wrap gap-2 justify-center">
                  {availableVariants.map(id => (
                    <Badge key={id} variant="outline">{id}</Badge>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  Keine aktiven Varianten für {selectedFlowVersion.toUpperCase()} gefunden
                </div>
              )}
              
              <div className="flex gap-2 flex-wrap justify-center">
                <Button 
                  onClick={() => runDeepAnalysis(false)} 
                  size="lg" 
                  className="gap-2"
                  disabled={loadingVariants || availableVariants.length === 0}
                >
                  <Play className="h-5 w-5" />
                  Jetzt analysieren
                </Button>
                <Button 
                  onClick={() => runDeepAnalysis(true)} 
                  variant="outline" 
                  size="lg" 
                  className="gap-2"
                  disabled={loadingVariants || availableVariants.length === 0}
                >
                  <RefreshCw className="h-5 w-5" />
                  Im Hintergrund
                </Button>
                <Button 
                  onClick={refreshResults} 
                  variant="ghost" 
                  size="lg" 
                  className="gap-2"
                >
                  <Download className="h-5 w-5" />
                  Ergebnisse laden
                </Button>
              </div>
              
              {/* Flow Selector Buttons */}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3">Flow auswählen:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {ALL_FLOWS.map(flow => (
                    <Button
                      key={flow.id}
                      variant={selectedFlowVersion === flow.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedFlowVersion(flow.id)}
                    >
                      {flow.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Queue Panel - Always visible */}
        <div className="max-w-2xl mx-auto mb-6">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full gap-2 justify-between">
                <span className="flex items-center gap-2">
                  <ListOrdered className="h-4 w-4" />
                  Analyse-Queue
                </span>
                <ChevronRight className="h-4 w-4 transition-transform ui-open:rotate-90" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <AnalysisQueuePanel availableFlows={ALL_FLOWS} />
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Background Job Progress State */}
        {backgroundJob && !isAnalyzing && (
          <Card className="max-w-2xl mx-auto border-primary/50">
            <CardContent className="py-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <RefreshCw className="h-10 w-10 text-primary animate-spin" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300">
                    {backgroundJob.status === 'running' ? 'Läuft' : 'Wartend'}
                  </Badge>
                  Hintergrund-Analyse aktiv
                </h2>
                <p className="text-muted-foreground mb-4">
                  {selectedFlowVersion.toUpperCase()} Flow wird analysiert
                </p>
                {backgroundJob.totalSteps > 0 && (
                  <div className="space-y-2">
                    <Progress 
                      value={(backgroundJob.stepsCaptured / backgroundJob.totalSteps) * 100} 
                      className="max-w-xs mx-auto h-3" 
                    />
                    <p className="text-sm text-muted-foreground">
                      {backgroundJob.stepsCaptured} / {backgroundJob.totalSteps} Schritte
                    </p>
                  </div>
                )}
                {backgroundJob.startedAt && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Gestartet: {new Date(backgroundJob.startedAt).toLocaleTimeString('de-CH')}
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Diese Seite aktualisiert automatisch alle 3 Sekunden...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Loading State (foreground analysis) */}
        {isAnalyzing && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-16 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-pulse">
                <RefreshCw className="h-10 w-10 text-primary animate-spin" />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-2">AI Tiefenanalyse läuft...</h2>
                <p className="text-muted-foreground">
                  Analysiere {availableVariants.length} {selectedFlowVersion.toUpperCase()} Flows auf Element-Level
                </p>
              </div>
              <Progress value={undefined} className="max-w-xs mx-auto" />
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analyses.length > 0 && !isAnalyzing && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Übersicht
              </TabsTrigger>
              <TabsTrigger value="comparison" className="gap-2">
                <Layers className="h-4 w-4" />
                Vergleich
              </TabsTrigger>
              <TabsTrigger value="winner" className="gap-2">
                <Trophy className="h-4 w-4" />
                Gewinner
              </TabsTrigger>
              <TabsTrigger value="ultimate" className="gap-2">
                <Crown className="h-4 w-4" />
                Ultimate
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl font-bold text-primary">{analyses.length}</div>
                    <div className="text-sm text-muted-foreground">Flows analysiert</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl font-bold text-green-600">
                      {Math.round(analyses.reduce((acc, a) => acc + a.overallScore, 0) / analyses.length)}
                    </div>
                    <div className="text-sm text-muted-foreground">Ø Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl font-bold text-yellow-600">
                      {analyses.reduce((acc, a) => acc + a.quickWins.length, 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Quick Wins</div>
                  </CardContent>
                </Card>
                <Card className="border-primary/50 bg-primary/5">
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl font-bold text-primary">
                      {synthesis?.winner?.flowId || '-'}
                    </div>
                    <div className="text-sm text-muted-foreground">Gewinner</div>
                  </CardContent>
                </Card>
              </div>

              {/* Flow Cards Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyses.map((analysis, index) => (
                  <motion.div
                    key={analysis.flowId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${
                        synthesis?.winner?.flowId === analysis.flowId ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => {
                        setSelectedFlow(analysis.flowId);
                        setActiveTab('comparison');
                      }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {synthesis?.winner?.flowId === analysis.flowId && (
                              <Trophy className="h-5 w-5 text-yellow-500" />
                            )}
                            <CardTitle className="text-lg">{analysis.flowId}</CardTitle>
                          </div>
                          <ScoreRing score={analysis.overallScore} size="sm" />
                        </div>
                        <CardDescription>{analysis.flowName}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Category Scores */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div>
                            <div className="font-bold">{analysis.categoryScores.ux}</div>
                            <div className="text-muted-foreground">UX</div>
                          </div>
                          <div>
                            <div className="font-bold">{analysis.categoryScores.conversion}</div>
                            <div className="text-muted-foreground">Conv</div>
                          </div>
                          <div>
                            <div className="font-bold">{analysis.categoryScores.mobile}</div>
                            <div className="text-muted-foreground">Mobile</div>
                          </div>
                        </div>

                        <Separator />

                        {/* Top Strength & Weakness */}
                        <div className="space-y-2 text-sm">
                          {analysis.strengths[0] && (
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                              <span className="line-clamp-1">{analysis.strengths[0]}</span>
                            </div>
                          )}
                          {analysis.weaknesses[0] && (
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                              <span className="line-clamp-1">{analysis.weaknesses[0]}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 gap-2">
                            <Eye className="h-4 w-4" />
                            Details
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/80"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFixFlow(analysis);
                            }}
                            disabled={fixingFlowId === analysis.flowId}
                          >
                            {fixingFlowId === analysis.flowId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Wand2 className="h-4 w-4" />
                            )}
                            Fix it
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="comparison" className="space-y-6">
              {/* Flow Selector */}
              <div className="flex gap-2 flex-wrap">
                {analyses.map(a => (
                  <Button
                    key={a.flowId}
                    variant={selectedFlow === a.flowId ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFlow(a.flowId)}
                    className="gap-2"
                  >
                    {synthesis?.winner?.flowId === a.flowId && (
                      <Trophy className="h-3 w-3 text-yellow-500" />
                    )}
                    {a.flowId}
                    <Badge variant="secondary" className="ml-1">{a.overallScore}</Badge>
                  </Button>
                ))}
              </div>

              {selectedAnalysis && (
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Left: Scores & Categories */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Scores
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-center">
                        <ScoreRing score={selectedAnalysis.overallScore} size="lg" label="Gesamt" />
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        {Object.entries(selectedAnalysis.categoryScores).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize">{key}</span>
                              <span className="font-bold">{value}</span>
                            </div>
                            <Progress value={value} className="h-2" />
                          </div>
                        ))}
                      </div>
                      
                      {/* Fix it Button in comparison tab */}
                      <Separator className="my-4" />
                      <Button 
                        onClick={() => handleFixFlow(selectedAnalysis)}
                        disabled={fixingFlowId === selectedAnalysis.flowId}
                        className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80"
                      >
                        {fixingFlowId === selectedAnalysis.flowId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Wand2 className="h-4 w-4" />
                        )}
                        AI Auto-Fix generieren
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Center: Element Analysis */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5" />
                        Element-Analyse
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[500px] pr-4">
                        <div className="space-y-4">
                          {selectedAnalysis.elements.map((element, i) => (
                            <Card key={i} className="border-muted">
                              <CardHeader className="py-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline">{element.elementType}</Badge>
                                    <span className="font-medium">{element.elementName}</span>
                                  </div>
                                  <ScoreRing 
                                    score={Math.round(Object.values(element.scores).reduce((a, b) => a + b, 0) / 5)} 
                                    size="sm" 
                                  />
                                </div>
                              </CardHeader>
                              <CardContent className="py-2 space-y-3">
                                {/* Scores Grid */}
                                <div className="grid grid-cols-5 gap-2 text-xs text-center">
                                  {Object.entries(element.scores).map(([k, v]) => (
                                    <div key={k}>
                                      <div className="font-bold">{v}</div>
                                      <div className="text-muted-foreground capitalize">{k}</div>
                                    </div>
                                  ))}
                                </div>

                                {/* Issues */}
                                {element.issues.length > 0 && (
                                  <div className="space-y-2">
                                    {element.issues.map((issue, j) => (
                                      <div key={j} className="p-2 rounded bg-muted/50 text-sm">
                                        <div className="flex items-center gap-2 mb-1">
                                          <SeverityBadge severity={issue.severity} />
                                          <EffortBadge effort={issue.effort} />
                                        </div>
                                        <p className="text-muted-foreground">{issue.description}</p>
                                        <p className="text-primary mt-1">→ {issue.recommendation}</p>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Best Practices */}
                                {element.bestPractices.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {element.bestPractices.map((bp, j) => (
                                      <Badge key={j} variant="secondary" className="text-xs">
                                        <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                                        {bp}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Winner Tab */}
            <TabsContent value="winner" className="space-y-6">
              {synthesis && (
                <>
                  {/* Winner Card */}
                  <Card className="border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
                    <CardContent className="py-8">
                      <div className="flex items-center justify-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <Trophy className="h-12 w-12 text-yellow-500" />
                        </div>
                        <div>
                          <div className="text-sm text-yellow-600 font-medium mb-1">GEWINNER</div>
                          <h2 className="text-4xl font-bold">{synthesis.winner.flowId}</h2>
                          <p className="text-muted-foreground">{synthesis.winner.flowName}</p>
                        </div>
                        <ScoreRing score={synthesis.winner.totalScore} size="lg" label="Score" />
                      </div>
                      <Separator className="my-6" />
                      <p className="text-center max-w-2xl mx-auto text-muted-foreground">
                        {synthesis.winner.reasoning}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Ranking */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Medal className="h-5 w-5" />
                        Ranking
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {synthesis.ranking.map((item, i) => (
                          <div 
                            key={item.flowId}
                            className={`flex items-center gap-4 p-4 rounded-lg ${
                              i === 0 ? 'bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200' :
                              i === 1 ? 'bg-gray-50 dark:bg-gray-950/20 border border-gray-200' :
                              i === 2 ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200' :
                              'bg-muted/30'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              i === 0 ? 'bg-yellow-500 text-white' :
                              i === 1 ? 'bg-gray-400 text-white' :
                              i === 2 ? 'bg-orange-500 text-white' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {item.position}
                            </div>
                            <div className="flex-1">
                              <div className="font-bold">{item.flowId}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                <span className="text-green-600">✓ {item.keyStrength}</span>
                                <span className="mx-2">•</span>
                                <span className="text-yellow-600">⚠ {item.keyWeakness}</span>
                              </div>
                            </div>
                            <ScoreRing score={item.score} size="sm" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Best Elements */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Beste Elemente
                      </CardTitle>
                      <CardDescription>
                        Die besten Elemente aus allen Flows
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {synthesis.bestElements.map((el, i) => (
                          <Card key={i} className="border-primary/20">
                            <CardContent className="pt-4">
                              <div className="flex items-center justify-between mb-2">
                                <Badge>{el.element}</Badge>
                                <Badge variant="outline">von {el.sourceFlow}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{el.reason}</p>
                              <div className="text-sm text-primary flex items-start gap-2">
                                <Code className="h-4 w-4 mt-0.5 shrink-0" />
                                {el.implementation}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Ultimate Tab */}
            <TabsContent value="ultimate" className="space-y-6">
              {synthesis?.ultimateFlow && (
                <>
                  {/* Ultimate Flow Header */}
                  <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardContent className="py-8">
                      <div className="text-center">
                        <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
                        <h2 className="text-3xl font-bold mb-2">{synthesis.ultimateFlow.name}</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">
                          {synthesis.ultimateFlow.description}
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2">
                          <Badge variant="default" className="text-lg px-4 py-1">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            {synthesis.ultimateFlow.expectedConversionLift} erwartete Conversion-Steigerung
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step Blueprint */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5" />
                        Step Blueprint
                      </CardTitle>
                      <CardDescription>
                        Die optimale Kombination aller Steps
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {synthesis.ultimateFlow.steps.map((step, i) => (
                          <div 
                            key={i}
                            className="flex gap-4 p-4 rounded-lg border bg-card"
                          >
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">
                              {step.number}
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold">{step.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  von {step.sourceFlow}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {step.elements.map((el, j) => (
                                  <Badge key={j} variant="secondary" className="text-xs">
                                    {el}
                                  </Badge>
                                ))}
                              </div>
                              {step.improvements.length > 0 && (
                                <div className="text-sm text-muted-foreground">
                                  <span className="text-primary">Verbesserungen:</span>{' '}
                                  {step.improvements.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Implementation Priority */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Implementierungs-Prioritäten
                      </CardTitle>
                      <CardDescription>
                        Effort vs. Impact Matrix
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {synthesis.ultimateFlow.implementationPriority.map((item, i) => (
                          <div 
                            key={i}
                            className={`flex items-center gap-4 p-4 rounded-lg ${
                              i === 0 ? 'bg-green-50 dark:bg-green-950/20 border border-green-200' :
                              'bg-muted/30'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                              i === 0 ? 'bg-green-500 text-white' : 'bg-muted'
                            }`}>
                              {item.priority}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{item.change}</div>
                              <div className="text-sm text-muted-foreground">
                                von {item.sourceFlow}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline" className={
                                item.effort === 'low' ? 'bg-green-100 text-green-700' :
                                item.effort === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }>
                                {item.effort} effort
                              </Badge>
                              <Badge variant="outline" className={
                                item.impact === 'high' ? 'bg-green-100 text-green-700' :
                                item.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }>
                                {item.impact} impact
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-center">
                    <Button size="lg" className="gap-2">
                      <Zap className="h-5 w-5" />
                      Ultimate Flow generieren
                    </Button>
                    <Button size="lg" variant="outline" className="gap-2">
                      <Download className="h-5 w-5" />
                      Analyse exportieren
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}

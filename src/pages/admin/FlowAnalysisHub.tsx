/**
 * Flow Analysis Hub - Ultimate unified analysis center
 * 
 * Combines everything into one page:
 * - All Flows Overview with Ranking
 * - Deep Analysis with AI recommendations
 * - Winner determination & synthesis  
 * - Ultimate Flow generation
 * - AI Auto-Fix with prompt export
 * - Background processing queue
 * 
 * Fully automated, logically structured, the showcase model.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Play, Trophy, Target, Zap, CheckCircle, AlertTriangle,
  AlertCircle, ChevronRight, Star, TrendingUp, Eye, Code, Download,
  RefreshCw, BarChart3, Layers, Sparkles, Crown, Medal, Award, ListOrdered,
  Wand2, Loader2, Users, BookOpen, Camera, ExternalLink, Settings,
  ChevronDown, Filter, ArrowUpDown, Wifi, WifiOff
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
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';
import { FLOW_COMPONENT_REGISTRY } from '@/lib/flowComponentRegistry';
import { 
  ArchetypeRadar, 
  QuickWinsPanel, 
  IssuesList, 
  MovuComparisonCard, 
  ScoreBadge
} from '@/components/admin/analysis';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AnalysisQueuePanel from '@/components/admin/AnalysisQueuePanel';
import AiFixResultPanel from '@/components/admin/AiFixResultPanel';
import FlowRankingCard from '@/components/admin/FlowRankingCard';
import { cn } from '@/lib/utils';
import { useLiveFlowAnalysis, type LiveFlowScore } from '@/hooks/use-live-flow-analysis';

// ─────────────────────────────────────────────────────────────
// Types & Interfaces
// ─────────────────────────────────────────────────────────────

interface FlowScore {
  flowId: string;
  overallScore: number | null;
  conversionScore: number | null;
  uxScore: number | null;
  mobileScore: number | null;
  trustScore: number | null;
  lastAnalyzed: string | null;
}

interface FlowVariant {
  id: string;
  label: string;
  description: string;
  color: string;
  path: string;
  stepCount: number;
  isMain: boolean;
  flowNumber: number;
}

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

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

const ALL_FLOWS = [
  { id: 'all', label: 'Alle', flowId: 'all' },
  { id: 'v1', label: 'V1', flowId: 'umzugsofferten-v1' },
  { id: 'v2', label: 'V2', flowId: 'umzugsofferten-v2' },
  { id: 'v3', label: 'V3', flowId: 'umzugsofferten-v3' },
  { id: 'v4', label: 'V4', flowId: 'umzugsofferten-v4' },
  { id: 'v5', label: 'V5', flowId: 'umzugsofferten-v5' },
  { id: 'v6', label: 'V6', flowId: 'umzugsofferten-v6' },
  { id: 'v7', label: 'V7', flowId: 'umzugsofferten-v7' },
  { id: 'v8', label: 'V8', flowId: 'umzugsofferten-v8' },
  { id: 'v9', label: 'V9', flowId: 'umzugsofferten-v9' },
  { id: 'ultimate-best36', label: 'Ultimate ⭐', flowId: 'umzugsofferten-ultimate-best36' },
];

function getMainFlowKey(flowNumber: number): string {
  return `umzugsofferten-v${flowNumber}`;
}

function getAllFlowNumbers(): number[] {
  const numbers = new Set<number>();
  Object.keys(FLOW_CONFIGS).forEach(key => {
    const match = key.match(/umzugsofferten-v(\d+)/);
    if (match) numbers.add(parseInt(match[1], 10));
  });
  Object.keys(SUB_VARIANT_CONFIGS).forEach(key => {
    const match = key.match(/^v(\d+)/i);
    if (match) numbers.add(parseInt(match[1], 10));
  });
  return Array.from(numbers).sort((a, b) => a - b);
}

function getVariantsForFlow(flowNumber: number | 'all'): FlowVariant[] {
  const variants: FlowVariant[] = [];
  
  if (flowNumber === 'all') {
    Object.entries(FLOW_CONFIGS).forEach(([id, config]) => {
      const match = id.match(/umzugsofferten-v(\d+)/);
      if (match) {
        variants.push({
          id,
          label: config.label,
          description: config.description,
          color: config.color,
          path: config.path,
          stepCount: config.steps.length,
          isMain: true,
          flowNumber: parseInt(match[1], 10),
        });
      }
    });
    
    Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
      const match = id.match(/^v(\d+)([a-z])$/i);
      if (match) {
        variants.push({
          id,
          label: config.label,
          description: config.description,
          color: config.color,
          path: config.path,
          stepCount: config.steps.length,
          isMain: false,
          flowNumber: parseInt(match[1], 10),
        });
      }
    });
  } else {
    const mainFlowKey = getMainFlowKey(flowNumber);
    const mainFlow = FLOW_CONFIGS[mainFlowKey];
    
    if (mainFlow) {
      variants.push({
        id: mainFlowKey,
        label: mainFlow.label,
        description: mainFlow.description,
        color: mainFlow.color,
        path: mainFlow.path,
        stepCount: mainFlow.steps.length,
        isMain: true,
        flowNumber,
      });
    }
    
    Object.entries(SUB_VARIANT_CONFIGS).forEach(([id, config]) => {
      const match = id.match(/^v(\d+)([a-z])$/i);
      if (match && parseInt(match[1], 10) === flowNumber) {
        variants.push({
          id,
          label: config.label,
          description: config.description,
          color: config.color,
          path: config.path,
          stepCount: config.steps.length,
          isMain: false,
          flowNumber,
        });
      }
    });
  }
  
  return variants;
}

const DEFAULT_ELEMENT_SCORES = { visibility: 0, usability: 0, conversion: 0, mobile: 0, accessibility: 0 };
const DEFAULT_CATEGORY_SCORES = { ux: 0, conversion: 0, mobile: 0, accessibility: 0, performance: 0, trust: 0, clarity: 0 };

const normalizeElementAnalysis = (e: any): ElementAnalysis => ({
  elementType: String(e?.elementType ?? ''),
  elementName: String(e?.elementName ?? ''),
  scores: e?.scores && typeof e.scores === 'object' ? { ...DEFAULT_ELEMENT_SCORES, ...e.scores } : DEFAULT_ELEMENT_SCORES,
  issues: Array.isArray(e?.issues) ? e.issues : [],
  bestPractices: Array.isArray(e?.bestPractices) ? e.bestPractices : [],
  improvements: Array.isArray(e?.improvements) ? e.improvements : [],
});

const normalizeFlowAnalysis = (a: any): FlowAnalysis => ({
  flowId: String(a?.flowId ?? ''),
  flowName: String(a?.flowName ?? ''),
  overallScore: Number(a?.overallScore ?? 0),
  categoryScores: a?.categoryScores && typeof a.categoryScores === 'object' ? { ...DEFAULT_CATEGORY_SCORES, ...a.categoryScores } : DEFAULT_CATEGORY_SCORES,
  elements: Array.isArray(a?.elements) ? a.elements.map(normalizeElementAnalysis) : [],
  strengths: Array.isArray(a?.strengths) ? a.strengths : [],
  weaknesses: Array.isArray(a?.weaknesses) ? a.weaknesses : [],
  keyInsights: Array.isArray(a?.keyInsights) ? a.keyInsights : [],
  conversionKillers: Array.isArray(a?.conversionKillers) ? a.conversionKillers : [],
  quickWins: Array.isArray(a?.quickWins) ? a.quickWins : [],
  stepByStepAnalysis: Array.isArray(a?.stepByStepAnalysis) ? a.stepByStepAnalysis : [],
});

const normalizeSynthesis = (s: any): Synthesis | null => {
  const winner = s?.winner;
  const hasWinner = typeof winner?.flowId === 'string' && winner.flowId.trim().length > 0;
  if (!hasWinner) return null;
  return {
    winner: { flowId: String(winner.flowId ?? ''), flowName: String(winner.flowName ?? ''), totalScore: Number(winner.totalScore ?? 0), reasoning: String(winner.reasoning ?? '') },
    ranking: Array.isArray(s?.ranking) ? s.ranking.map((r: any) => ({ position: Number(r?.position ?? 0), flowId: String(r?.flowId ?? ''), score: Number(r?.score ?? 0), keyStrength: String(r?.keyStrength ?? ''), keyWeakness: String(r?.keyWeakness ?? '') })) : [],
    bestElements: Array.isArray(s?.bestElements) ? s.bestElements.map((b: any) => ({ element: String(b?.element ?? ''), sourceFlow: String(b?.sourceFlow ?? ''), reason: String(b?.reason ?? ''), implementation: String(b?.implementation ?? '') })) : [],
    ultimateFlow: {
      name: String(s?.ultimateFlow?.name ?? ''),
      description: String(s?.ultimateFlow?.description ?? ''),
      steps: Array.isArray(s?.ultimateFlow?.steps) ? s.ultimateFlow.steps.map((st: any) => ({ number: Number(st?.number ?? 0), name: String(st?.name ?? ''), sourceFlow: String(st?.sourceFlow ?? ''), elements: Array.isArray(st?.elements) ? st.elements : [], improvements: Array.isArray(st?.improvements) ? st.improvements : [] })) : [],
      expectedConversionLift: String(s?.ultimateFlow?.expectedConversionLift ?? ''),
      implementationPriority: Array.isArray(s?.ultimateFlow?.implementationPriority) ? s.ultimateFlow.implementationPriority.map((p: any) => ({ priority: Number(p?.priority ?? 0), change: String(p?.change ?? ''), effort: String(p?.effort ?? ''), impact: String(p?.impact ?? ''), sourceFlow: String(p?.sourceFlow ?? '') })) : [],
    },
    codeChanges: Array.isArray(s?.codeChanges) ? s.codeChanges.map((c: any) => ({ file: String(c?.file ?? ''), component: String(c?.component ?? ''), currentState: String(c?.currentState ?? ''), proposedChange: String(c?.proposedChange ?? ''), implementation: String(c?.implementation ?? '') })) : [],
  };
};

// ─────────────────────────────────────────────────────────────
// Sub-Components
// ─────────────────────────────────────────────────────────────

const ScoreRing = ({ score, size = 'md', label }: { score: number; size?: 'sm' | 'md' | 'lg'; label?: string }) => {
  const sizeClasses = { sm: 'w-12 h-12 text-sm', md: 'w-20 h-20 text-lg', lg: 'w-28 h-28 text-2xl' };
  const getColor = (s: number) => s >= 80 ? 'text-green-500 stroke-green-500' : s >= 60 ? 'text-yellow-500 stroke-yellow-500' : 'text-red-500 stroke-red-500';
  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/20" />
        <circle cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${score * 2.64} 264`} className={getColor(score)} />
      </svg>
      <div className="flex flex-col items-center">
        <span className={`font-bold ${getColor(score)}`}>{score}</span>
        {label && <span className="text-[10px] text-muted-foreground">{label}</span>}
      </div>
    </div>
  );
};

const ScoreBadgeSimple = ({ score, label }: { score: number | null; label?: string }) => {
  if (score === null || score === undefined) {
    return <Badge variant="outline" className="text-xs opacity-50">{label || 'N/A'}</Badge>;
  }
  const color = score >= 80 ? 'bg-green-100 text-green-800 border-green-200' : score >= 60 ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-red-100 text-red-800 border-red-200';
  return <Badge className={cn('text-xs font-semibold', color)}>{label && <span className="mr-1 opacity-70">{label}</span>}{score}</Badge>;
};

const SeverityBadge = ({ severity }: { severity: 'critical' | 'warning' | 'info' }) => {
  const config = {
    critical: { bg: 'bg-red-100 dark:bg-red-950', text: 'text-red-700 dark:text-red-300', icon: AlertCircle },
    warning: { bg: 'bg-yellow-100 dark:bg-yellow-950', text: 'text-yellow-700 dark:text-yellow-300', icon: AlertTriangle },
    info: { bg: 'bg-blue-100 dark:bg-blue-950', text: 'text-blue-700 dark:text-blue-300', icon: AlertCircle }
  };
  const { bg, text, icon: Icon } = config[severity];
  return <Badge variant="outline" className={`${bg} ${text} gap-1`}><Icon className="h-3 w-3" />{severity}</Badge>;
};

const EffortBadge = ({ effort }: { effort: string }) => {
  const config: Record<string, string> = {
    low: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300',
    high: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
  };
  return <Badge variant="outline" className={config[effort] || config.medium}>{effort} effort</Badge>;
};

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function FlowAnalysisHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  // ═══════════════════════════════════════════════════════════════
  // LIVE ANALYSIS - Always reflects current code state
  // ═══════════════════════════════════════════════════════════════
  const { 
    scores: liveScores, 
    isAnalyzing: isLiveAnalyzing, 
    lastUpdate: liveLastUpdate,
    analyzeAllFlows: refreshLiveAnalysis 
  } = useLiveFlowAnalysis();
  
  // Toggle between live and cached scores
  const [useLiveScores, setUseLiveScores] = useState(true);
  
  // View mode - read from URL param if present
  const viewParam = searchParams.get('view') as 'ranking' | 'analysis' | 'winner' | 'ultimate' | null;
  const [activeView, setActiveView] = useState<'ranking' | 'analysis' | 'winner' | 'ultimate'>(viewParam || 'ranking');
  const [selectedFlowVersion, setSelectedFlowVersion] = useState(() => searchParams.get('flow') || 'all');
  const [sortBy, setSortBy] = useState<'score' | 'name'>('score');
  
  // Scores from DB for ranking (cached)
  const [cachedScores, setCachedScores] = useState<Record<string, FlowScore>>({});
  
  // Use live or cached scores based on toggle
  const scores = useLiveScores 
    ? Object.fromEntries(
        Object.entries(liveScores).map(([id, s]) => [id, {
          flowId: s.flowId,
          overallScore: s.overallScore,
          conversionScore: s.categoryScores.conversion,
          uxScore: s.categoryScores.ux,
          mobileScore: s.categoryScores.mobile,
          trustScore: s.categoryScores.trust,
          lastAnalyzed: s.lastAnalyzed.toISOString(),
        }])
      )
    : cachedScores;
  
  // Deep analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [foregroundProgress, setForegroundProgress] = useState(0);
  const [analyses, setAnalyses] = useState<FlowAnalysis[]>([]);
  const [synthesis, setSynthesis] = useState<Synthesis | null>(null);
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
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
  
  // Fix-it state
  const [fixingFlowId, setFixingFlowId] = useState<string | null>(null);
  const [isGeneratingUltimate, setIsGeneratingUltimate] = useState(false);
  
  const ANALYSIS_STALL_TIMEOUT_MS = 15 * 60 * 1000;
  const autoTimeoutAppliedForJobIdRef = useRef<string | null>(null);

  // Update URL with flow and view
  useEffect(() => {
    setSearchParams(prev => { 
      prev.set('flow', selectedFlowVersion); 
      prev.set('view', activeView);
      return prev; 
    });
  }, [selectedFlowVersion, activeView, setSearchParams]);

  // Fetch scores for ranking
  useEffect(() => {
    async function fetchScores() {
      try {
        const { data, error } = await supabase
          .from('flow_analysis_runs')
          .select('flow_id, overall_score, conversion_score, ux_score, mobile_score, trust_score, created_at')
          .order('created_at', { ascending: false });
        if (error) throw error;
        const scoreMap: Record<string, FlowScore> = {};
        data?.forEach(row => {
          if (!scoreMap[row.flow_id]) {
            scoreMap[row.flow_id] = {
              flowId: row.flow_id,
              overallScore: row.overall_score,
              conversionScore: row.conversion_score,
              uxScore: row.ux_score,
              mobileScore: row.mobile_score,
              trustScore: row.trust_score,
              lastAnalyzed: row.created_at,
            };
          }
        });
        setCachedScores(scoreMap);
      } catch (err) {
        console.error('Failed to fetch scores:', err);
      }
    }
    fetchScores();
  }, []);

  // Fetch available variants for deep analysis
  useEffect(() => {
    const fetchVariants = async () => {
      setLoadingVariants(true);
      try {
        if (selectedFlowVersion === 'all') {
          const { data, error } = await supabase
            .from('flow_versions')
            .select('version_number, flow_code, version_name, flow_id')
            .eq('is_active', true)
            .order('flow_id')
            .order('version_number');
          if (error) { setAvailableVariants([]); return; }
          setAvailableVariants((data || []).map(v => v.flow_code?.toLowerCase() || `${v.flow_id}.${v.version_number}`));
          return;
        }
        const flowConfig = ALL_FLOWS.find(f => f.id === selectedFlowVersion);
        if (!flowConfig) { setAvailableVariants([]); return; }
        const { data, error } = await supabase
          .from('flow_versions')
          .select('version_number, flow_code, version_name')
          .eq('flow_id', flowConfig.flowId)
          .eq('is_active', true)
          .order('version_number');
        if (error) { setAvailableVariants([]); return; }
        setAvailableVariants((data || []).map(v => v.flow_code?.toLowerCase() || `${selectedFlowVersion}.${v.version_number}`));
      } catch { setAvailableVariants([]); } finally { setLoadingVariants(false); }
    };
    fetchVariants();
  }, [selectedFlowVersion]);

  // Check for previous analysis results
  useEffect(() => {
    const checkForResults = async () => {
      try {
        const flowConfig = ALL_FLOWS.find(f => f.id === selectedFlowVersion);
        if (!flowConfig) return;
        
        const { data } = await supabase
          .from('flow_analysis_runs')
          .select('*')
          .eq('run_type', 'deep-archetyp-analysis')
          .eq('flow_id', flowConfig.flowId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (data?.status === 'completed') {
          const metadata = data.metadata as any;
          if (metadata?.analyses && Array.isArray(metadata.analyses)) {
            setAnalyses(metadata.analyses.map(normalizeFlowAnalysis));
          }
          const aiRecs = data.ai_recommendations as any;
          if (aiRecs && Array.isArray(aiRecs) && aiRecs.length > 0) {
            setSynthesis(normalizeSynthesis(aiRecs[0]));
          }
        } else if (data?.status === 'running' || data?.status === 'pending') {
          setBackgroundJob({
            id: data.id,
            status: data.status,
            stepsCaptured: data.steps_captured || 0,
            totalSteps: data.total_steps || 0,
            startedAt: data.started_at
          });
        }
      } catch (err) {
        console.error('Error checking for results:', err);
      }
    };
    checkForResults();
  }, [selectedFlowVersion]);

  // Progress animation for foreground analysis
  useEffect(() => {
    if (!isAnalyzing) { setForegroundProgress(0); return; }
    setForegroundProgress(10);
    const interval = setInterval(() => {
      setForegroundProgress(p => p >= 90 ? 90 : Math.min(90, Math.round(p + 4 + Math.random() * 8)));
    }, 700);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Poll for background job
  useEffect(() => {
    if (!backgroundJob || backgroundJob.status === 'completed') return;
    
    const pollInterval = setInterval(async () => {
      try {
        const { data } = await supabase
          .from('flow_analysis_runs')
          .select('*')
          .eq('id', backgroundJob.id)
          .maybeSingle();
        
        if (!data) return;
        
        if (data.status === 'completed') {
          setBackgroundJob(null);
          const metadata = data.metadata as any;
          if (metadata?.analyses) setAnalyses(metadata.analyses.map(normalizeFlowAnalysis));
          const aiRecs = data.ai_recommendations as any;
          if (aiRecs?.[0]) setSynthesis(normalizeSynthesis(aiRecs[0]));
          toast({ title: 'Analyse abgeschlossen', description: 'Ergebnisse wurden geladen.' });
        } else if (data.status === 'failed') {
          setBackgroundJob(null);
          toast({ title: 'Analyse fehlgeschlagen', variant: 'destructive' });
        } else {
          setBackgroundJob(prev => prev ? { ...prev, status: data.status, stepsCaptured: data.steps_captured || 0, totalSteps: data.total_steps || 0 } : null);
        }
      } catch {}
    }, 3000);
    
    return () => clearInterval(pollInterval);
  }, [backgroundJob?.id, backgroundJob?.status, toast]);

  // Get variants for display
  const flowNum = selectedFlowVersion === 'all' ? 'all' : parseInt(selectedFlowVersion.replace('v', ''), 10);
  let variants = getVariantsForFlow(flowNum as number | 'all');
  
  // Sort variants by score
  if (sortBy === 'score') {
    variants = [...variants].sort((a, b) => {
      const scoreA = scores[a.id]?.overallScore ?? -1;
      const scoreB = scores[b.id]?.overallScore ?? -1;
      return scoreB - scoreA;
    });
  }

  // Run deep analysis
  const runDeepAnalysis = async (background = false) => {
    if (availableVariants.length === 0) {
      toast({ title: 'Keine Varianten', description: 'Keine aktiven Varianten gefunden.', variant: 'destructive' });
      return;
    }
    
    setIsAnalyzing(true);
    const flowConfig = ALL_FLOWS.find(f => f.id === selectedFlowVersion);
    
    toast({ title: background ? 'Hintergrund-Analyse gestartet' : 'Tiefenanalyse gestartet', description: `Analysiere ${availableVariants.length} Varianten...` });

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

      if (background && data?.runId) {
        setBackgroundJob({ id: data.runId, status: 'running', stepsCaptured: 0, totalSteps: data.totalSteps || availableVariants.length, startedAt: new Date().toISOString() });
        setAnalyses([]);
        setSynthesis(null);
        setIsAnalyzing(false);
        return;
      }

      const normalizedAnalyses = Array.isArray(data?.analyses) ? data.analyses.map(normalizeFlowAnalysis) : [];
      const normalizedSynthesis = normalizeSynthesis(data?.synthesis);
      setAnalyses(normalizedAnalyses);
      setSynthesis(normalizedSynthesis);
      if (normalizedAnalyses.length > 0) setSelectedFlow(normalizedAnalyses[0].flowId);
      toast({ title: 'Analyse abgeschlossen', description: `${normalizedAnalyses.length} Flows analysiert. Gewinner: ${normalizedSynthesis?.winner?.flowId || 'N/A'}` });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({ title: 'Fehler', description: 'Analyse konnte nicht durchgeführt werden', variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle AI Auto-Fix
  const handleFixFlow = async (analysis: FlowAnalysis) => {
    setFixingFlowId(analysis.flowId);
    toast({ title: '⏳ AI-Fix gestartet', description: `Optimierung läuft für ${analysis.flowName}...` });

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
      toast({ title: '✅ AI-Fix generiert!', description: 'Änderungsvorschläge wurden erstellt.' });
    } catch (error) {
      console.error('Fix error:', error);
      toast({ title: 'Fehler', description: 'AI-Optimierung fehlgeschlagen', variant: 'destructive' });
    } finally {
      setFixingFlowId(null);
    }
  };

  // Generate Ultimate Flow
  const handleGenerateUltimateFlow = async () => {
    if (!synthesis) {
      toast({ title: 'Keine Synthese', description: 'Bitte erst Tiefenanalyse durchführen.', variant: 'destructive' });
      return;
    }

    setIsGeneratingUltimate(true);
    toast({ title: 'Ultimate Flow wird generiert...', description: 'Kombiniere die besten Elemente...' });

    try {
      const { data, error } = await supabase.functions.invoke('generate-ultimate-flow', {
        body: {
          synthesis: { winner: synthesis.winner, ranking: synthesis.ranking, bestElements: synthesis.bestElements, ultimateFlow: synthesis.ultimateFlow },
          analyses: analyses.map(a => ({ flowId: a.flowId, flowName: a.flowName, overallScore: a.overallScore, categoryScores: a.categoryScores, strengths: a.strengths, quickWins: a.quickWins })),
          flowVersion: selectedFlowVersion,
        }
      });

      if (error) throw error;
      toast({ title: '🎉 Ultimate Flow generiert!', description: `Erwartete Steigerung: ${synthesis.ultimateFlow.expectedConversionLift}` });
      if (data?.variantId) window.open(`/admin/flow-feedback-variants?variant=${data.variantId}`, '_blank');
    } catch (error) {
      console.error('Ultimate flow error:', error);
      toast({ title: 'Fehler', description: 'Ultimate Flow konnte nicht generiert werden', variant: 'destructive' });
    } finally {
      setIsGeneratingUltimate(false);
    }
  };

  const selectedAnalysis = analyses.find(a => a.flowId === selectedFlow);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link to="/admin/tools?tab=flow-automation">
                <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Tools</Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  Flow Analysis Hub
                </h1>
                <p className="text-sm text-muted-foreground">
                  {variants.length} Flows • Ranking • Tiefenanalyse • Gewinner • Ultimate Flow • AI Auto-Fix
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* Flow Selector */}
              <Select value={selectedFlowVersion} onValueChange={setSelectedFlowVersion}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Flow wählen" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_FLOWS.map(flow => (
                    <SelectItem key={flow.id} value={flow.id}>{flow.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Live/Cached Toggle - NEW */}
              <Button 
                variant={useLiveScores ? "default" : "outline"} 
                size="sm" 
                onClick={() => {
                  setUseLiveScores(prev => !prev);
                  if (!useLiveScores) refreshLiveAnalysis();
                }} 
                className="gap-2"
              >
                {useLiveScores ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                {useLiveScores ? 'Live' : 'Cached'}
              </Button>

              {/* Sort Toggle */}
              <Button variant="outline" size="sm" onClick={() => setSortBy(s => s === 'score' ? 'name' : 'score')} className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                {sortBy === 'score' ? 'Nach Score' : 'Nach Name'}
              </Button>
              
              {/* Refresh Live */}
              {useLiveScores && (
                <Button variant="outline" size="sm" onClick={refreshLiveAnalysis} disabled={isLiveAnalyzing} className="gap-2">
                  <RefreshCw className={cn("h-4 w-4", isLiveAnalyzing && "animate-spin")} />
                  Aktualisieren
                </Button>
              )}
              
              {/* Analysis Actions */}
              <Button onClick={() => runDeepAnalysis(true)} disabled={isAnalyzing || loadingVariants || availableVariants.length === 0} variant="outline" size="sm" className="gap-2">
                <RefreshCw className="h-4 w-4" />Hintergrund
              </Button>
              <Button onClick={() => runDeepAnalysis(false)} disabled={isAnalyzing || loadingVariants || availableVariants.length === 0} size="sm" className="gap-2">
                {isAnalyzing ? <><Loader2 className="h-4 w-4 animate-spin" />Analysiere...</> : <><Play className="h-4 w-4" />Analyse starten</>}
              </Button>
            </div>
          </div>
          
          {/* Live Status Banner */}
          {useLiveScores && liveLastUpdate && (
            <div className="flex items-center justify-center gap-2 py-2 px-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm rounded-lg">
              <Wifi className="h-4 w-4" />
              <span>Live-Analyse aktiv • Letzte Aktualisierung: {liveLastUpdate.toLocaleTimeString('de-CH')}</span>
              <Badge variant="outline" className="ml-2 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200">
                {Object.keys(liveScores).length} Flows
              </Badge>
            </div>
          )}

          {/* View Tabs */}
          <div className="flex items-center gap-2 mt-4">
            <Button variant={activeView === 'ranking' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveView('ranking')} className="gap-2">
              <Award className="h-4 w-4" />Ranking
            </Button>
            <Button variant={activeView === 'analysis' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveView('analysis')} className="gap-2">
              <Layers className="h-4 w-4" />Analyse
            </Button>
            <Button variant={activeView === 'winner' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveView('winner')} className="gap-2" disabled={!synthesis}>
              <Trophy className="h-4 w-4" />Gewinner
            </Button>
            <Button variant={activeView === 'ultimate' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveView('ultimate')} className="gap-2" disabled={!synthesis}>
              <Crown className="h-4 w-4" />Ultimate
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Queue Panel (Collapsible) */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full max-w-md gap-2 justify-between">
              <span className="flex items-center gap-2"><ListOrdered className="h-4 w-4" />Analyse-Queue</span>
              <ChevronRight className="h-4 w-4 transition-transform ui-open:rotate-90" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <AnalysisQueuePanel availableFlows={ALL_FLOWS} />
          </CollapsibleContent>
        </Collapsible>

        {/* Background Job Progress */}
        {backgroundJob && (
          <Card className="border-primary/50 max-w-2xl mx-auto">
            <CardContent className="py-8 text-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
              <div>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700">{backgroundJob.status === 'running' ? 'Läuft' : 'Wartend'}</Badge>
                <h3 className="font-bold mt-2">Hintergrund-Analyse aktiv</h3>
                {backgroundJob.totalSteps > 0 && (
                  <Progress value={(backgroundJob.stepsCaptured / backgroundJob.totalSteps) * 100} className="max-w-xs mx-auto mt-4" />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Foreground Loading */}
        {isAnalyzing && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12 text-center space-y-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
              <h3 className="font-bold">AI Tiefenanalyse läuft...</h3>
              <Progress value={foregroundProgress} className="max-w-xs mx-auto" />
            </CardContent>
          </Card>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* RANKING VIEW */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeView === 'ranking' && !isAnalyzing && !backgroundJob && (
          <div className="space-y-4">
            {variants.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">Keine Varianten gefunden.</CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
              {variants.map((variant, index) => {
                const flowScore = scores[variant.id];
                const liveFlowScore = liveScores[variant.id];
                const rank = sortBy === 'score' ? index + 1 : null;
                const isWinner = synthesis?.winner?.flowId === variant.id;
                
                return (
                  <FlowRankingCard
                    key={variant.id}
                    flowId={variant.id}
                    label={variant.label}
                    description={variant.description}
                    color={variant.color}
                    path={variant.path}
                    stepCount={variant.stepCount}
                    rank={rank}
                    score={flowScore ? {
                      overallScore: flowScore.overallScore,
                      conversionScore: flowScore.conversionScore,
                      uxScore: flowScore.uxScore,
                      mobileScore: flowScore.mobileScore,
                      trustScore: flowScore.trustScore,
                    } : null}
                    liveScore={liveFlowScore}
                    isWinner={isWinner}
                    onSelectForAnalysis={() => {
                      setSelectedFlow(variant.id);
                      setActiveView('analysis');
                    }}
                  />
                );
              })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ANALYSIS VIEW */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeView === 'analysis' && analyses.length > 0 && !isAnalyzing && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card><CardContent className="pt-6 text-center"><div className="text-4xl font-bold text-primary">{analyses.length}</div><div className="text-sm text-muted-foreground">Flows</div></CardContent></Card>
              <Card><CardContent className="pt-6 text-center"><div className="text-4xl font-bold text-green-600">{Math.round(analyses.reduce((acc, a) => acc + a.overallScore, 0) / analyses.length)}</div><div className="text-sm text-muted-foreground">Ø Score</div></CardContent></Card>
              <Card><CardContent className="pt-6 text-center"><div className="text-4xl font-bold text-yellow-600">{analyses.reduce((acc, a) => acc + a.quickWins.length, 0)}</div><div className="text-sm text-muted-foreground">Quick Wins</div></CardContent></Card>
              <Card className="border-primary/50 bg-primary/5"><CardContent className="pt-6 text-center"><div className="text-4xl font-bold text-primary">{synthesis?.winner?.flowId || '-'}</div><div className="text-sm text-muted-foreground">Gewinner</div></CardContent></Card>
            </div>

            {/* Flow Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyses.map((analysis, index) => (
                <motion.div key={analysis.flowId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <Card className={cn('cursor-pointer transition-all hover:shadow-lg hover:border-primary/50', synthesis?.winner?.flowId === analysis.flowId && 'ring-2 ring-primary')}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {synthesis?.winner?.flowId === analysis.flowId && <Trophy className="h-5 w-5 text-yellow-500" />}
                          <CardTitle className="text-lg">{analysis.flowId}</CardTitle>
                        </div>
                        <ScoreRing score={analysis.overallScore} size="sm" />
                      </div>
                      <CardDescription>{analysis.flowName}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Category Scores */}
                      <div className="grid grid-cols-4 gap-2 text-xs text-center">
                        <div><div className="font-bold">{analysis.categoryScores.ux}</div><div className="text-muted-foreground">UX</div></div>
                        <div><div className="font-bold">{analysis.categoryScores.conversion}</div><div className="text-muted-foreground">Conv</div></div>
                        <div><div className="font-bold">{analysis.categoryScores.mobile}</div><div className="text-muted-foreground">Mobile</div></div>
                        <div><div className="font-bold">{analysis.categoryScores.trust}</div><div className="text-muted-foreground">Trust</div></div>
                      </div>
                      
                      {/* Quick Wins */}
                      {analysis.quickWins.length > 0 && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium flex items-center gap-1"><Zap className="h-3 w-3 text-yellow-500" />Quick Wins</div>
                          <div className="text-xs text-muted-foreground line-clamp-2">{analysis.quickWins.slice(0, 2).join(' • ')}</div>
                        </div>
                      )}
                      
                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedFlow(analysis.flowId)}>
                          <Eye className="h-4 w-4 mr-1" />Details
                        </Button>
                        <Button size="sm" className="flex-1 gap-2" onClick={() => handleFixFlow(analysis)} disabled={fixingFlowId === analysis.flowId}>
                          {fixingFlowId === analysis.flowId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                          Fix it
                        </Button>
                      </div>
                      
                      {/* AI Fix Result */}
                      <AiFixResultPanel flowId={analysis.flowId} currentScore={analysis.overallScore} onReanalyze={() => runDeepAnalysis(true)} />
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Selected Flow Detail */}
            {selectedAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" />
                    {selectedAnalysis.flowId} - Element-Analyse
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {selectedAnalysis.elements.map((element, i) => (
                        <Card key={i} className="border-muted">
                          <CardHeader className="py-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{element.elementType}</Badge>
                                <span className="font-medium">{element.elementName}</span>
                              </div>
                              <ScoreRing score={Math.round(Object.values(element.scores).reduce((a, b) => a + b, 0) / 5)} size="sm" />
                            </div>
                          </CardHeader>
                          <CardContent className="py-2 space-y-3">
                            <div className="grid grid-cols-5 gap-2 text-xs text-center">
                              {Object.entries(element.scores).map(([k, v]) => (
                                <div key={k}><div className="font-bold">{v}</div><div className="text-muted-foreground capitalize">{k}</div></div>
                              ))}
                            </div>
                            {element.issues.length > 0 && (
                              <div className="space-y-2">
                                {element.issues.map((issue, j) => (
                                  <div key={j} className="p-2 rounded bg-muted/50 text-sm">
                                    <div className="flex items-center gap-2 mb-1"><SeverityBadge severity={issue.severity} /><EffortBadge effort={issue.effort} /></div>
                                    <p className="text-muted-foreground">{issue.description}</p>
                                    <p className="text-primary mt-1">→ {issue.recommendation}</p>
                                  </div>
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
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* WINNER VIEW */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeView === 'winner' && synthesis && (
          <div className="space-y-6">
            {/* Winner Card */}
            <Card className="border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
              <CardContent className="py-8">
                <div className="flex items-center justify-center gap-6 flex-wrap">
                  <div className="w-24 h-24 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-yellow-500" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-yellow-600 font-medium">GEWINNER</div>
                    <h2 className="text-4xl font-bold">{synthesis.winner.flowId}</h2>
                    <p className="text-muted-foreground">{synthesis.winner.flowName}</p>
                  </div>
                  <ScoreRing score={synthesis.winner.totalScore} size="lg" label="Score" />
                </div>
                <Separator className="my-6" />
                <p className="text-center max-w-2xl mx-auto text-muted-foreground">{synthesis.winner.reasoning}</p>
              </CardContent>
            </Card>

            {/* Ranking */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Medal className="h-5 w-5" />Ranking</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {synthesis.ranking.map((item, i) => (
                    <div key={item.flowId} className={cn('flex items-center gap-4 p-4 rounded-lg',
                      i === 0 ? 'bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200' :
                      i === 1 ? 'bg-gray-50 dark:bg-gray-950/20 border border-gray-200' :
                      i === 2 ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200' :
                      'bg-muted/30'
                    )}>
                      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center font-bold',
                        i === 0 ? 'bg-yellow-500 text-white' :
                        i === 1 ? 'bg-gray-400 text-white' :
                        i === 2 ? 'bg-orange-500 text-white' :
                        'bg-muted text-muted-foreground'
                      )}>{item.position}</div>
                      <div className="flex-1">
                        <div className="font-bold">{item.flowId}</div>
                        <div className="text-sm text-muted-foreground">
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
              <CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5" />Beste Elemente</CardTitle></CardHeader>
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
                          <Code className="h-4 w-4 mt-0.5 shrink-0" />{el.implementation}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════ */}
        {/* ULTIMATE VIEW */}
        {/* ═══════════════════════════════════════════════════════════════ */}
        {activeView === 'ultimate' && synthesis?.ultimateFlow && (
          <div className="space-y-6">
            {/* Ultimate Flow Header */}
            <Card className="border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
              <CardContent className="py-8 text-center">
                <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">{synthesis.ultimateFlow.name}</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">{synthesis.ultimateFlow.description}</p>
                <div className="mt-4">
                  <Badge variant="default" className="text-lg px-4 py-1">
                    <TrendingUp className="h-4 w-4 mr-2" />{synthesis.ultimateFlow.expectedConversionLift} erwartete Steigerung
                  </Badge>
                </div>
                <Button onClick={handleGenerateUltimateFlow} disabled={isGeneratingUltimate} className="mt-6 gap-2" size="lg">
                  {isGeneratingUltimate ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                  Ultimate Flow generieren
                </Button>
              </CardContent>
            </Card>

            {/* Step Blueprint */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5" />Step Blueprint</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {synthesis.ultimateFlow.steps.map((step) => (
                    <div key={step.number} className="flex gap-4 p-4 rounded-lg border bg-card">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0">{step.number}</div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{step.name}</span>
                          <Badge variant="outline" className="text-xs">von {step.sourceFlow}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {step.elements.map((el, j) => <Badge key={j} variant="secondary" className="text-xs">{el}</Badge>)}
                        </div>
                        {step.improvements.length > 0 && (
                          <div className="text-sm text-muted-foreground">
                            <span className="text-primary">Verbesserungen:</span> {step.improvements.join(', ')}
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
              <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Implementation Roadmap</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {synthesis.ultimateFlow.implementationPriority.map((item) => (
                    <div key={item.priority} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Badge variant="outline" className="shrink-0">P{item.priority}</Badge>
                      <div className="flex-1">
                        <div className="font-medium">{item.change}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                          <span>Aufwand: {item.effort}</span>
                          <span>Impact: {item.impact}</span>
                          <span>Quelle: {item.sourceFlow}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {activeView !== 'ranking' && analyses.length === 0 && !isAnalyzing && !backgroundJob && (
          <Card className="max-w-2xl mx-auto text-center py-16">
            <CardContent className="space-y-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <BarChart3 className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Keine Analyse vorhanden</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Starte eine Tiefenanalyse, um detaillierte Insights, Gewinner-Bestimmung und Ultimate Flow zu erhalten.
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => runDeepAnalysis(false)} size="lg" disabled={loadingVariants || availableVariants.length === 0}>
                  <Play className="h-5 w-5 mr-2" />Jetzt analysieren
                </Button>
                <Button onClick={() => runDeepAnalysis(true)} variant="outline" size="lg" disabled={loadingVariants || availableVariants.length === 0}>
                  <RefreshCw className="h-5 w-5 mr-2" />Im Hintergrund
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

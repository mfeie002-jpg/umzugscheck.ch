/**
 * Flow Command Center - The Ultimate Unified Analysis Hub
 * 
 * ARCHETYP-REFERENZ: Das Vorzeigemodell der Branche
 * 
 * Vereint alle Analysis-Tools in einem System:
 * - Dashboard: Übersicht aller Flows mit Scores
 * - Ranking: Sortierte Liste mit Winner-Determination
 * - Deep Analysis: Detaillierte Analyse pro Flow
 * - History: Trend-Tracking und Score-Entwicklung
 * - Landing Page Analysis: Auch Landing Pages analysieren
 * 
 * 3 Interface-Modi:
 * 1. Tabs: Klassische Tab-Navigation
 * 2. Modular: Dashboard mit Links zu Sub-Pages
 * 3. AI-First: Kontext-basierte Tool-Auswahl
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Trophy,
  BarChart3,
  History as HistoryIcon,
  Settings,
  ArrowLeft,
  RefreshCw,
  Play,
  Loader2,
  Sparkles,
  Globe,
  Layers,
  Target,
  Zap,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Crown,
  Medal,
  ChevronRight,
  Filter,
  Download,
  Wand2,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

// Command Center Components
import { 
  DashboardView, 
  RankingView, 
  AnalysisView,
  HistoryView,
  ComparisonView
} from '@/components/admin/flow-command-center/views';
import { 
  ScoreRing, 
  FlowCard, 
  IssuesPanel 
} from '@/components/admin/flow-command-center/components';
import { useKeyboardShortcuts, useExport } from '@/components/admin/flow-command-center/hooks';
import type { 
  ViewMode, 
  InterfaceMode, 
  FlowScore, 
  AnalysisRun 
} from '@/components/admin/flow-command-center/types';

// Flow configs
import { FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface CommandCenterStats {
  totalFlows: number;
  analyzedFlows: number;
  avgScore: number;
  topScore: number;
  criticalIssues: number;
  totalIssues: number;
  lastAnalysisDate: string | null;
}

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const VIEW_CONFIG: Record<ViewMode, { label: string; icon: React.ElementType; description: string }> = {
  dashboard: { label: 'Dashboard', icon: LayoutDashboard, description: 'Übersicht aller Flows' },
  ranking: { label: 'Ranking', icon: Trophy, description: 'Sortierte Liste & Winner' },
  analysis: { label: 'Analyse', icon: BarChart3, description: 'Deep Analysis pro Flow' },
  comparison: { label: 'Vergleich', icon: Layers, description: 'Flow-Vergleich Side-by-Side' },
  history: { label: 'Historie', icon: HistoryIcon, description: 'Trend-Tracking' },
  settings: { label: 'Einstellungen', icon: Settings, description: 'Konfiguration' },
};

const INTERFACE_MODES: { value: InterfaceMode; label: string; description: string }[] = [
  { value: 'tabs', label: 'Tabs', description: 'Klassische Tab-Navigation' },
  { value: 'modular', label: 'Dashboard', description: 'Modulare Übersicht' },
  { value: 'ai-first', label: 'AI-First', description: 'Kontext-basiert' },
];

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

// Map frontend flow IDs to edge function flow IDs
// Edge function expects: v1, v1a, v2, v2a, etc.
// Frontend has: umzugsofferten-v1, v1a, umzugsofferten-v2, v2a, etc.
function mapToEdgeFunctionFlowId(flowId: string): string {
  // If it starts with umzugsofferten-, extract just the version part
  if (flowId.startsWith('umzugsofferten-')) {
    const versionPart = flowId.replace('umzugsofferten-', '');
    // Check if it's a simple version like v1, v2, etc.
    return versionPart;
  }
  // Sub-variants like v1a, v2b are already in correct format
  return flowId;
}

// Valid flow IDs that the edge function supports
const VALID_EDGE_FUNCTION_FLOWS = [
  'v1', 'v1a', 'v1b', 'v1c', 'v1d', 'v1e', 'v1f', 'v1g',
  'v2', 'v2a', 'v2b', 'v2c', 'v2d', 'v2e', 'v2f',
  'v3', 'v3a', 'v3b', 'v3c', 'v3d', 'v3e',
  'v4', 'v4a', 'v4b', 'v4c', 'v4d', 'v4e', 'v4f',
  'v5', 'v5a', 'v5b', 'v5c', 'v5d', 'v5e', 'v5f',
  'v6', 'v6a', 'v6b', 'v6c', 'v6d', 'v6e', 'v6f',
  'v7', 'v7a',
  'v8', 'v8a',
  'v9', 'v9a', 'v9b', 'v9c', 'v9d',
  'multi-a',
  'ultimate-v7'
];

function getAllFlowIds(): string[] {
  // Return only the valid edge function flow IDs
  return [...VALID_EDGE_FUNCTION_FLOWS];
}

function getAllFrontendFlowIds(): string[] {
  const ids: string[] = [];
  Object.keys(FLOW_CONFIGS).forEach(key => {
    if (key.startsWith('umzugsofferten-')) {
      ids.push(key);
    }
  });
  Object.keys(SUB_VARIANT_CONFIGS).forEach(key => {
    ids.push(key);
  });
  return ids;
}

function getScoreColor(score: number | null): string {
  if (score === null) return 'text-muted-foreground';
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function FlowCommandCenter() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // State from URL
  const viewParam = searchParams.get('view') as ViewMode | null;
  const flowParam = searchParams.get('flow');
  const modeParam = searchParams.get('mode') as InterfaceMode | null;
  
  // UI State
  const [activeView, setActiveView] = useState<ViewMode>(viewParam || 'dashboard');
  const [interfaceMode, setInterfaceMode] = useState<InterfaceMode>(modeParam || 'tabs');
  // Normalize legacy URLs (older runs used "umzugsofferten-vX" as flow_id)
  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(
    flowParam ? mapToEdgeFunctionFlowId(flowParam) : null
  );
  // Data State
  const [scores, setScores] = useState<Map<string, FlowScore>>(new Map());
  const [stats, setStats] = useState<CommandCenterStats>({
    totalFlows: 0,
    analyzedFlows: 0,
    avgScore: 0,
    topScore: 0,
    criticalIssues: 0,
    totalIssues: 0,
    lastAnalysisDate: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onNavigateDashboard: () => setActiveView('dashboard'),
    onNavigateRanking: () => setActiveView('ranking'),
    onNavigateAnalysis: () => setActiveView('analysis'),
    onNavigateHistory: () => setActiveView('history'),
    onNavigateComparison: () => setActiveView('comparison'),
    onRefresh: () => loadData(),
    onAnalyzeAll: () => handleAnalyzeAll(),
    onExport: () => toast.info('Export öffnen...'),
  });

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('view', activeView);
    if (selectedFlowId) params.set('flow', selectedFlowId);
    if (interfaceMode !== 'tabs') params.set('mode', interfaceMode);
    setSearchParams(params, { replace: true });
  }, [activeView, selectedFlowId, interfaceMode, setSearchParams]);

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Fetch all flow scores from feature_scores table
      const { data: featureData, error: featureError } = await supabase
        .from('flow_feature_scores')
        .select('*')
        .order('updated_at', { ascending: false });

      if (featureError) throw featureError;

      // Also fetch from flow_analysis_runs for completed analyses
      const { data: analysisData, error: analysisError } = await supabase
        .from('flow_analysis_runs')
        .select('*')
        .eq('status', 'completed')
        .not('overall_score', 'is', null)
        .order('created_at', { ascending: false });

      if (analysisError) throw analysisError;

      const scoreMap = new Map<string, FlowScore>();
      let totalScore = 0;
      let topScore = 0;
      let analyzedCount = 0;

      const flowIds = getAllFlowIds();
      
      // First, try to match by exact ID or with umzugsofferten- prefix
      for (const id of flowIds) {
        // Try multiple matching patterns
        const featureScore = featureData?.find(f => 
          f.flow_id === id || 
          f.flow_id === `umzugsofferten-${id}` ||
          f.flow_id.replace('umzugsofferten-', '') === id
        );
        
        // Also check analysis runs
        const analysisRun = analysisData?.find(a => 
          a.flow_id === id || 
          a.flow_id === `umzugsofferten-${id}` ||
          a.flow_id.replace('umzugsofferten-', '') === id
        );
        
        // Use feature score if available, otherwise use analysis run
        const sourceData = featureScore || analysisRun;
        
        if (sourceData) {
          const score: FlowScore = {
            flowId: id,
            overallScore: sourceData.overall_score,
            conversionScore: sourceData.conversion_score,
            uxScore: sourceData.ux_score,
            mobileScore: sourceData.mobile_score,
            trustScore: sourceData.trust_score,
            accessibilityScore: sourceData.accessibility_score,
            performanceScore: sourceData.performance_score,
            lastAnalyzed: 'updated_at' in sourceData ? sourceData.updated_at : sourceData.created_at,
          };
          scoreMap.set(id, score);
          
          if (score.overallScore !== null) {
            totalScore += score.overallScore;
            topScore = Math.max(topScore, score.overallScore);
            analyzedCount++;
          }
        } else {
          // Flow without analysis
          scoreMap.set(id, {
            flowId: id,
            overallScore: null,
            conversionScore: null,
            uxScore: null,
            mobileScore: null,
            trustScore: null,
            accessibilityScore: null,
            performanceScore: null,
            lastAnalyzed: null,
          });
        }
      }

      setScores(scoreMap);

      // Fetch issue counts
      const { count: criticalCount } = await supabase
        .from('flow_ux_issues')
        .select('*', { count: 'exact', head: true })
        .eq('is_resolved', false)
        .eq('severity', 'critical');

      const { count: totalIssues } = await supabase
        .from('flow_ux_issues')
        .select('*', { count: 'exact', head: true })
        .eq('is_resolved', false);

      // Get last analysis date
      const { data: lastRun } = await supabase
        .from('flow_analysis_runs')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      setStats({
        totalFlows: flowIds.length,
        analyzedFlows: analyzedCount,
        avgScore: analyzedCount > 0 ? Math.round(totalScore / analyzedCount) : 0,
        topScore,
        criticalIssues: criticalCount || 0,
        totalIssues: totalIssues || 0,
        lastAnalysisDate: lastRun?.created_at || null,
      });

    } catch (err) {
      console.error('Failed to load data:', err);
      toast.error('Fehler beim Laden der Daten');
    } finally {
      setIsLoading(false);
    }
  };

  const [analyzingFlowId, setAnalyzingFlowId] = useState<string | null>(null);

  const handleAnalyzeFlow = async (flowId: string) => {
    setIsAnalyzing(true);
    setAnalyzingFlowId(flowId);
    try {
      const edgeFlowId = mapToEdgeFunctionFlowId(flowId);
      toast.info(`Analyse für ${edgeFlowId} wird gestartet...`);
      
      // Call the auto-analyze-flow edge function
      const { data, error } = await supabase.functions.invoke('auto-analyze-flow', {
        body: {
          flowId: edgeFlowId,
          runType: 'manual',
          baseUrl: 'https://www.umzugscheck.ch'
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Edge function failed');
      }

      console.log('Analysis response:', data);
      toast.success(`Analyse für ${edgeFlowId} abgeschlossen`);
      
      // Reload data to show new results
      await loadData();
    } catch (err) {
      console.error('Analysis failed:', err);
      toast.error(`Analyse fehlgeschlagen: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    } finally {
      setIsAnalyzing(false);
      setAnalyzingFlowId(null);
    }
  };

  // Analyze only specific flows (for quick re-analysis of changed flows)
  const handleAnalyzeSelected = async (flowIds: string[]) => {
    if (flowIds.length === 0) {
      toast.warning('Keine Flows zum Analysieren ausgewählt');
      return;
    }
    
    setIsAnalyzing(true);
    const total = flowIds.length;
    let completed = 0;
    let failed = 0;
    
    toast.info(`Analyse von ${total} Flow(s) gestartet...`);
    
    for (const id of flowIds) {
      setAnalyzingFlowId(id);
      try {
        const edgeFlowId = mapToEdgeFunctionFlowId(id);
        const { data, error } = await supabase.functions.invoke('auto-analyze-flow', {
          body: {
            flowId: edgeFlowId,
            runType: 'manual',
            baseUrl: 'https://www.umzugscheck.ch'
          }
        });

        if (error) {
          console.error(`Analysis failed for ${id}:`, error);
          failed++;
        } else {
          completed++;
          console.log(`Analyzed ${id}:`, data);
        }
        
        // Update progress
        toast.info(`Fortschritt: ${completed + failed}/${total}`);
      } catch (err) {
        console.error(`Analysis error for ${id}:`, err);
        failed++;
      }
    }
    
    setIsAnalyzing(false);
    setAnalyzingFlowId(null);
    await loadData();
    
    if (failed === 0) {
      toast.success(`${total} Flow(s) erfolgreich analysiert!`);
    } else {
      toast.warning(`${completed} analysiert, ${failed} fehlgeschlagen`);
    }
  };

  const handleAnalyzeAll = async () => {
    const flowIds = getAllFlowIds();
    await handleAnalyzeSelected(flowIds);
  };
  
  // Quick re-analyze for v1b and other recently changed flows
  const handleAnalyzeChangedFlows = async () => {
    // Focus on the main flows that are commonly updated
    const changedFlows = ['v1b', 'v2e', 'v1', 'v2', 'v3', 'v4', 'v5', 'v6', 'v7', 'v8', 'v9'];
    await handleAnalyzeSelected(changedFlows);
  };

  // Refresh all screenshots for all flows (runs analysis which captures new screenshots)
  const handleRefreshAllScreenshots = async () => {
    const flowIds = getAllFlowIds();
    toast.info(`Screenshots werden für ${flowIds.length} Flow(s) neu erfasst...`);
    await handleAnalyzeSelected(flowIds);
  };

  const handleViewChange = (view: ViewMode) => {
    setActiveView(view);
  };

  const handleSelectFlow = (flowId: string) => {
    setSelectedFlowId(flowId);
    setActiveView('analysis');
  };

  // Sorted scores for ranking
  const rankedFlows = useMemo(() => {
    return Array.from(scores.values())
      .filter(s => s.overallScore !== null)
      .sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0))
      .map((s, i) => ({ ...s, rank: i + 1 }));
  }, [scores]);

  const winner = rankedFlows[0] || null;

  // ─────────────────────────────────────────────────────────────
  // Render: Tabs Interface Mode
  // ─────────────────────────────────────────────────────────────

  const renderTabsInterface = () => (
    <Tabs value={activeView} onValueChange={(v) => handleViewChange(v as ViewMode)}>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <TabsList className="h-auto flex-wrap">
          {(['dashboard', 'ranking', 'analysis', 'history', 'comparison'] as ViewMode[]).map((view) => {
            const config = VIEW_CONFIG[view];
            const Icon = config.icon;
            return (
              <TabsTrigger key={view} value={view} className="gap-2">
                <Icon className="h-4 w-4" />
                {config.label}
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        <div className="flex items-center gap-2">
          <Select value={interfaceMode} onValueChange={(v) => setInterfaceMode(v as InterfaceMode)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INTERFACE_MODES.map((mode) => (
                <SelectItem key={mode.value} value={mode.value}>
                  {mode.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleAnalyzeChangedFlows}
            disabled={isAnalyzing}
            title="v1b, v2e, v1-v9 analysieren"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Zap className="h-4 w-4 mr-2" />
            )}
            Schnell-Analyse
          </Button>
          
          <Button
            onClick={handleAnalyzeAll}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Alle analysieren
          </Button>
          
          <Button
            variant="outline"
            onClick={handleRefreshAllScreenshots}
            disabled={isAnalyzing}
            title="Alle Screenshots für alle Flows neu erfassen"
          >
            {isAnalyzing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Camera className="h-4 w-4 mr-2" />
            )}
            Alle Screenshots
          </Button>
        </div>
      </div>
      
      {/* Show current analysis progress */}
      {isAnalyzing && analyzingFlowId && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-sm font-medium">
            Analysiere: <strong>{analyzingFlowId}</strong>
          </span>
        </div>
      )}

      <TabsContent value="dashboard" className="mt-0">
        <DashboardView
          onAnalyzeFlow={handleAnalyzeFlow}
          onViewFlowDetails={handleSelectFlow}
          isAnalyzing={analyzingFlowId}
        />
      </TabsContent>

      <TabsContent value="ranking" className="mt-0">
        <RankingView
          onAnalyzeFlow={handleAnalyzeFlow}
          onViewFlowDetails={handleSelectFlow}
          isAnalyzing={analyzingFlowId}
        />
      </TabsContent>

      <TabsContent value="analysis" className="mt-0">
        <AnalysisView
          flowId={selectedFlowId}
          onBack={() => {
            setSelectedFlowId(null);
            setActiveView('dashboard');
          }}
          onAnalyze={handleAnalyzeFlow}
          isAnalyzing={isAnalyzing}
        />
      </TabsContent>

      <TabsContent value="history" className="mt-0">
        <HistoryView 
          selectedFlowId={selectedFlowId || undefined}
          onSelectFlow={handleSelectFlow}
        />
      </TabsContent>

      <TabsContent value="comparison" className="mt-0">
        <ComparisonView
          initialFlowA={selectedFlowId}
          onSelectFlow={handleSelectFlow}
        />
      </TabsContent>
    </Tabs>
  );

  // ─────────────────────────────────────────────────────────────
  // Render: Modular Dashboard Interface Mode
  // ─────────────────────────────────────────────────────────────

  const renderModularInterface = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard
          label="Flows"
          value={stats.totalFlows}
          icon={<Layers className="h-5 w-5" />}
          color="text-primary"
        />
        <StatCard
          label="Analysiert"
          value={`${stats.analyzedFlows}/${stats.totalFlows}`}
          icon={<CheckCircle className="h-5 w-5" />}
          color="text-green-600"
        />
        <StatCard
          label="Ø Score"
          value={stats.avgScore}
          icon={<Target className="h-5 w-5" />}
          color={getScoreColor(stats.avgScore)}
        />
        <StatCard
          label="Top Score"
          value={stats.topScore}
          icon={<Crown className="h-5 w-5" />}
          color="text-yellow-600"
        />
        <StatCard
          label="Critical"
          value={stats.criticalIssues}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="text-red-600"
        />
        <StatCard
          label="Total Issues"
          value={stats.totalIssues}
          icon={<BarChart3 className="h-5 w-5" />}
          color="text-muted-foreground"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        {(['dashboard', 'ranking', 'analysis'] as ViewMode[]).map((view) => {
          const config = VIEW_CONFIG[view];
          const Icon = config.icon;
          return (
            <Card
              key={view}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => {
                setActiveView(view);
                setInterfaceMode('tabs');
              }}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{config.label}</h3>
                    <p className="text-sm text-muted-foreground">{config.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 ml-auto text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Winner Showcase */}
      {winner && (
        <Card className="border-yellow-500/50 bg-gradient-to-br from-yellow-50 to-transparent dark:from-yellow-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-500" />
              Aktueller Winner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{winner.flowId}</h3>
                <p className="text-muted-foreground">
                  Score: {winner.overallScore}/100
                </p>
              </div>
              <ScoreRing score={winner.overallScore || 0} size="lg" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Flows */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Flows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rankedFlows.slice(0, 5).map((flow, i) => (
              <div
                key={flow.flowId}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                onClick={() => handleSelectFlow(flow.flowId)}
              >
                <Badge variant={i === 0 ? 'default' : 'outline'} className="w-8 justify-center">
                  {i + 1}
                </Badge>
                <span className="font-medium flex-1">{flow.flowId}</span>
                <span className={cn('font-bold', getScoreColor(flow.overallScore))}>
                  {flow.overallScore}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // Render: AI-First Interface Mode
  // ─────────────────────────────────────────────────────────────

  const renderAIFirstInterface = () => (
    <div className="space-y-6">
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Analysis Assistant
          </CardTitle>
          <CardDescription>
            Basierend auf deinem aktuellen Kontext empfehle ich folgende Aktionen:
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats.criticalIssues > 0 && (
            <div className="flex items-center gap-4 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div className="flex-1">
                <h4 className="font-semibold text-red-900 dark:text-red-100">
                  {stats.criticalIssues} kritische Issues gefunden
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Diese sollten priorisiert behoben werden.
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => setActiveView('analysis')}>
                Beheben
              </Button>
            </div>
          )}

          {stats.analyzedFlows < stats.totalFlows && (
            <div className="flex items-center gap-4 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
              <Zap className="h-6 w-6 text-yellow-600" />
              <div className="flex-1">
                <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                  {stats.totalFlows - stats.analyzedFlows} Flows noch nicht analysiert
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Starte eine vollständige Analyse für bessere Insights.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleAnalyzeAll} disabled={isAnalyzing}>
                Analysieren
              </Button>
            </div>
          )}

          {winner && (
            <div className="flex items-center gap-4 p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <Crown className="h-6 w-6 text-green-600" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 dark:text-green-100">
                  Winner: {winner.flowId} ({winner.overallScore}/100)
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Dieser Flow performt am besten. Analysiere ihn für Best Practices.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => handleSelectFlow(winner.flowId)}>
                Analysieren
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard
          icon={<Trophy className="h-6 w-6" />}
          label="Ranking"
          description="Winner & Top 10"
          onClick={() => { setActiveView('ranking'); setInterfaceMode('tabs'); }}
        />
        <QuickActionCard
          icon={<BarChart3 className="h-6 w-6" />}
          label="Deep Analysis"
          description="Einzelne Flows"
          onClick={() => { setActiveView('analysis'); setInterfaceMode('tabs'); }}
        />
        <QuickActionCard
          icon={<HistoryIcon className="h-6 w-6" />}
          label="Historie"
          description="Trend-Tracking"
          onClick={() => { setActiveView('history'); setInterfaceMode('tabs'); }}
        />
        <QuickActionCard
          icon={<Wand2 className="h-6 w-6" />}
          label="Auto-Fix"
          description="AI-generierte Fixes"
          onClick={() => toast.info('Auto-Fix kommt bald...')}
        />
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // Main Render
  // ─────────────────────────────────────────────────────────────

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              Flow Command Center
            </h1>
            <p className="text-muted-foreground">
              Unified Analysis Hub – The Archetype Reference
            </p>
          </div>
        </div>
        
        {stats.lastAnalysisDate && (
          <Badge variant="outline" className="text-xs">
            Letzte Analyse: {new Date(stats.lastAnalysisDate).toLocaleString('de-CH')}
          </Badge>
        )}
      </div>

      {/* Content based on interface mode */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {interfaceMode === 'tabs' && renderTabsInterface()}
          {interfaceMode === 'modular' && renderModularInterface()}
          {interfaceMode === 'ai-first' && renderAIFirstInterface()}
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Helper Components
// ─────────────────────────────────────────────────────────────

const StatCard: React.FC<{
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, icon, color }) => (
  <Card>
    <CardContent className="pt-4 text-center">
      <div className={cn("mb-2", color)}>{icon}</div>
      <div className={cn("text-2xl font-bold", color)}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </CardContent>
  </Card>
);

const QuickActionCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
}> = ({ icon, label, description, onClick }) => (
  <Card 
    className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
    onClick={onClick}
  >
    <CardContent className="pt-6 text-center">
      <div className="mb-3 text-primary">{icon}</div>
      <h4 className="font-semibold">{label}</h4>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

// Legacy placeholder removed - now using imported HistoryView from flow-command-center/views

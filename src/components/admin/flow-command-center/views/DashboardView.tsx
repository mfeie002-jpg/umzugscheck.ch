/**
 * Dashboard View - Overview of all flows with key metrics
 * Priority 1: Overview & Ranking
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Trophy, 
  TrendingUp, 
  AlertTriangle, 
  Play, 
  RefreshCw,
  ArrowUpDown,
  Filter,
  Loader2,
  CheckCircle,
  Crown,
  Medal,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { FlowCard, ScoreRing, ScoreBadgeCompact, RankBadge, BackendHealthIndicator, ChatGPTExportPanel } from '../components';
import { useBackendHealth } from '../hooks';
import type { FlowScore, FlowVariant, AnalysisRun } from '../types';
import { 
  getVariantsForFlow, 
  getAllFlowNumbers, 
  getScoreColor,
  formatRelativeTime,
  CANONICAL_FLOW_COUNT 
} from '../utils';

interface DashboardViewProps {
  onAnalyzeFlow: (flowId: string) => void;
  onViewFlowDetails: (flowId: string) => void;
  isAnalyzing: string | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onAnalyzeFlow,
  onViewFlowDetails,
  isAnalyzing,
}) => {
  const [scores, setScores] = useState<Record<string, FlowScore>>({});
  const [dbFlowIds, setDbFlowIds] = useState<string[]>([]); // All flows from database
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'date'>('score');
  const [filterFlowNum, setFilterFlowNum] = useState<number | 'all'>('all');
  
  // Backend health monitoring
  const backendHealth = useBackendHealth();

  // Fetch scores from database with delta tracking
  useEffect(() => {
    fetchScores();
  }, []);

  // Normalize flow IDs to match DB format (remove 'umzugsofferten-' prefix)
  const normalizeFlowId = (flowId: string): string => {
    return flowId.replace('umzugsofferten-', '');
  };

  const fetchScores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('flow_analysis_runs')
        .select('flow_id, overall_score, conversion_score, ux_score, mobile_score, trust_score, accessibility_score, performance_score, created_at, status')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Collect all unique flow IDs from database
      const uniqueDbFlowIds = [...new Set(data?.map(r => r.flow_id) || [])];
      setDbFlowIds(uniqueDbFlowIds);
      
      // Group by NORMALIZED flow_id and get latest 5 for delta calculation
      const flowRuns: Record<string, typeof data> = {};
      data?.forEach(row => {
        const normalized = normalizeFlowId(row.flow_id);
        if (!flowRuns[normalized]) {
          flowRuns[normalized] = [];
        }
        if (flowRuns[normalized].length < 5) {
          flowRuns[normalized].push(row);
        }
      });
      
      // Build score map with deltas - USE COMPLETED RUNS ONLY FOR SCORES
      // Key by NORMALIZED ID so lookup with variant.id works after normalization
      const scoreMap: Record<string, FlowScore> = {};
      Object.entries(flowRuns).forEach(([normalizedId, runs]) => {
        // Filter to completed runs only for scores
        const completedRuns = runs?.filter(r => r.status === 'completed') || [];
        const latest = completedRuns[0] || runs?.[0]; // fallback to any if no completed
        const previous = completedRuns[1];
        
        scoreMap[normalizedId] = {
          flowId: normalizedId,
          overallScore: latest?.overall_score,
          conversionScore: latest?.conversion_score,
          uxScore: latest?.ux_score,
          mobileScore: latest?.mobile_score,
          trustScore: latest?.trust_score,
          accessibilityScore: latest?.accessibility_score,
          performanceScore: latest?.performance_score,
          lastAnalyzed: latest?.created_at,
          // Delta fields - only between completed runs
          previousOverallScore: previous?.overall_score ?? null,
          delta: previous ? (latest?.overall_score || 0) - (previous.overall_score || 0) : null,
          deltaConversion: previous ? (latest?.conversion_score || 0) - (previous.conversion_score || 0) : null,
          deltaUx: previous ? (latest?.ux_score || 0) - (previous.ux_score || 0) : null,
          deltaMobile: previous ? (latest?.mobile_score || 0) - (previous.mobile_score || 0) : null,
        };
      });
      
      setScores(scoreMap);
    } catch (err) {
      console.error('Failed to fetch scores:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get all variants
  const allVariants = getVariantsForFlow(filterFlowNum);
  const flowNumbers = getAllFlowNumbers();

  // Helper to get score for a variant (using normalized ID)
  const getScoreForVariant = (variantId: string): FlowScore | undefined => {
    const normalizedId = normalizeFlowId(variantId);
    return scores[normalizedId] || scores[variantId];
  };

  // Sort variants
  const sortedVariants = [...allVariants].sort((a, b) => {
    if (sortBy === 'score') {
      const scoreA = getScoreForVariant(a.id)?.overallScore ?? -1;
      const scoreB = getScoreForVariant(b.id)?.overallScore ?? -1;
      return scoreB - scoreA;
    }
    if (sortBy === 'date') {
      const dateA = getScoreForVariant(a.id)?.lastAnalyzed || '';
      const dateB = getScoreForVariant(b.id)?.lastAnalyzed || '';
      return dateB.localeCompare(dateA);
    }
    return a.label.localeCompare(b.label);
  });

  // Calculate stats - use CANONICAL_FLOW_COUNT as authoritative total
  const analyzedFromDb = Object.values(scores).filter(s => s.overallScore !== undefined).length;
  
  // Use canonical count (87) as the authoritative total
  const analyzedCount = analyzedFromDb;
  const totalFlows = CANONICAL_FLOW_COUNT;
  const relevantScores = Object.values(scores).filter((s): s is FlowScore => s?.overallScore !== undefined);
  const avgScore = relevantScores.length > 0
    ? Math.round(relevantScores.reduce((sum, s) => sum + (s.overallScore || 0), 0) / relevantScores.length)
    : 0;
  const criticalFlows = relevantScores.filter(s => s.overallScore !== null && s.overallScore < 50).length;

  // Get winner
  const winner = sortedVariants[0];
  const winnerScore = winner ? scores[winner.id] : null;

  return (
    <div className="space-y-6">
      {/* Backend Health Status - Show prominently if not online */}
      {backendHealth.status !== 'online' && (
        <BackendHealthIndicator
          status={backendHealth.status}
          latencyMs={backendHealth.latencyMs}
          lastChecked={backendHealth.lastChecked}
          error={backendHealth.error}
          onRetry={backendHealth.checkNow}
        />
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Compact health indicator when online */}
        <Card className="col-span-1">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <BackendHealthIndicator
                status={backendHealth.status}
                latencyMs={backendHealth.latencyMs}
                lastChecked={backendHealth.lastChecked}
                error={backendHealth.error}
                onRetry={backendHealth.checkNow}
                compact
              />
              <div className="text-xs text-muted-foreground">
                Backend
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Analysiert</p>
                <p className="text-2xl font-bold">{analyzedCount}/{totalFlows}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ø Score</p>
                <p className={cn('text-2xl font-bold', getScoreColor(avgScore))}>
                  {avgScore}/100
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Kritisch</p>
                <p className="text-2xl font-bold text-red-600">{criticalFlows}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-200 dark:bg-yellow-800">
                <Crown className="h-5 w-5 text-yellow-700 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Winner</p>
                <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100 truncate">
                  {winner?.label || '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Filter:</span>
          <Button
            variant={filterFlowNum === 'all' ? 'secondary' : 'outline'}
            size="sm"
            onClick={() => setFilterFlowNum('all')}
          >
            <Award className="h-3 w-3 mr-1" />
            Alle
          </Button>
          {flowNumbers.map(num => (
            <Button
              key={num}
              variant={filterFlowNum === num ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setFilterFlowNum(num)}
            >
              V{num}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSortBy(
              sortBy === 'score' ? 'name' : sortBy === 'name' ? 'date' : 'score'
            )}
          >
            <ArrowUpDown className="h-3 w-3 mr-1" />
            {sortBy === 'score' ? 'Score' : sortBy === 'name' ? 'Name' : 'Datum'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchScores}
            disabled={loading}
          >
            <RefreshCw className={cn('h-3 w-3 mr-1', loading && 'animate-spin')} />
            Aktualisieren
          </Button>
        </div>
      </div>

      {/* Flow Grid and Export */}
      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sortedVariants.map((variant, index) => (
                <FlowCard
                  key={variant.id}
                  variant={variant}
                  score={getScoreForVariant(variant.id)}
                  rank={sortBy === 'score' && filterFlowNum === 'all' ? index + 1 : null}
                  isAnalyzing={isAnalyzing === variant.id}
                  onAnalyze={() => onAnalyzeFlow(variant.id)}
                  onViewDetails={() => onViewFlowDetails(variant.id)}
                  compact
                />
              ))}
            </div>
          )}
        </div>
        
        {/* ChatGPT Export Panel */}
        <div className="lg:col-span-1">
          <ChatGPTExportPanel />
        </div>
      </div>

      {/* No results */}
      {!loading && sortedVariants.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Keine Flows gefunden
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardView;

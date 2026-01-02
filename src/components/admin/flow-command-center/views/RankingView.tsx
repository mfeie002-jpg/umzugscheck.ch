/**
 * Ranking View - All flows ranked by score with detailed comparison
 * Priority 1: Overview & Ranking
 * 
 * Enhanced with:
 * - Real-time analysis status (running/completed/failed)
 * - Screenshot status indicators
 * - Auto-polling for running analyses
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Eye, 
  BarChart3,
  Play,
  Crown,
  Medal,
  Award,
  Loader2,
  ExternalLink,
  ImageOff,
  Image,
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { ScoreBadgeCompact, RankBadge, ScoreRing, ScoreDeltaCompact } from '../components';
import type { FlowScore, FlowVariant } from '../types';
import { 
  getVariantsForFlow, 
  getScoreColor,
  formatRelativeTime 
} from '../utils';

interface AnalysisStatus {
  status: 'running' | 'completed' | 'failed' | 'none';
  stepsCaptures: number;
  totalSteps: number;
  screenshotsCount: number;
  hasErrors: boolean;
  lastError?: string;
}

interface RankingViewProps {
  onAnalyzeFlow: (flowId: string) => void;
  onViewFlowDetails: (flowId: string) => void;
  isAnalyzing: string | null;
}

export const RankingView: React.FC<RankingViewProps> = ({
  onAnalyzeFlow,
  onViewFlowDetails,
  isAnalyzing,
}) => {
  const [scores, setScores] = useState<Record<string, FlowScore>>({});
  const [analysisStatus, setAnalysisStatus] = useState<Record<string, AnalysisStatus>>({});
  const [loading, setLoading] = useState(true);
  const [runningCount, setRunningCount] = useState(0);

  // Helper to normalize flow IDs for matching
  const normalizeFlowId = (flowId: string): string => {
    // Remove 'umzugsofferten-' prefix if present
    return flowId.replace('umzugsofferten-', '');
  };

  const fetchScores = useCallback(async () => {
    try {
      // Fetch scores from analysis runs (completed ones only for scores)
      const { data: runsData, error: runsError } = await supabase
        .from('flow_analysis_runs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (runsError) throw runsError;
      
      const scoreMap: Record<string, FlowScore> = {};
      const statusMap: Record<string, AnalysisStatus> = {};
      let runningTotal = 0;
      
      // Group runs by normalized flow ID (keep latest 2 for delta)
      const flowRuns: Record<string, typeof runsData> = {};
      runsData?.forEach(row => {
        const normalized = normalizeFlowId(row.flow_id);
        if (!flowRuns[normalized]) {
          flowRuns[normalized] = [];
        }
        if (flowRuns[normalized].length < 2) {
          flowRuns[normalized].push(row);
        }
      });
      
      // Fetch step metrics for screenshot counts - count mobile + desktop separately
      const { data: stepMetrics } = await supabase
        .from('flow_step_metrics')
        .select('run_id, mobile_screenshot_url, desktop_screenshot_url');
      
      const screenshotCounts = new Map<string, number>();
      stepMetrics?.forEach(m => {
        const runId = m.run_id;
        if (runId) {
          const count = screenshotCounts.get(runId) || 0;
          // Count mobile and desktop separately
          let screenshotCount = 0;
          if (m.mobile_screenshot_url) screenshotCount++;
          if (m.desktop_screenshot_url) screenshotCount++;
          screenshotCounts.set(runId, count + screenshotCount);
        }
      });
      
      Object.entries(flowRuns).forEach(([normalizedId, runs]) => {
        const latest = runs[0];
        const previous = runs[1];
        
        // Calculate deltas
        const delta = previous 
          ? (latest.overall_score || 0) - (previous.overall_score || 0) 
          : null;
        const deltaConversion = previous 
          ? (latest.conversion_score || 0) - (previous.conversion_score || 0) 
          : null;
        const deltaUx = previous 
          ? (latest.ux_score || 0) - (previous.ux_score || 0) 
          : null;
        const deltaMobile = previous 
          ? (latest.mobile_score || 0) - (previous.mobile_score || 0) 
          : null;
        
        scoreMap[normalizedId] = {
          flowId: normalizedId,
          overallScore: latest.overall_score,
          conversionScore: latest.conversion_score,
          uxScore: latest.ux_score,
          mobileScore: latest.mobile_score,
          trustScore: latest.trust_score,
          accessibilityScore: latest.accessibility_score,
          performanceScore: latest.performance_score,
          lastAnalyzed: latest.created_at,
          // Delta tracking
          previousOverallScore: previous?.overall_score ?? null,
          delta,
          deltaConversion,
          deltaUx,
          deltaMobile,
        };
        
        // Status mapping - mark old running analyses as stalled
        const isRunning = latest.status === 'running' || latest.status === 'processing';
        const runningTime = new Date().getTime() - new Date(latest.created_at).getTime();
        const isStalled = isRunning && runningTime > 30 * 60 * 1000; // 30 min timeout
        
        if (isRunning && !isStalled) runningTotal++;
        
        const metadata = latest.metadata as { error?: string } | null;
        
        statusMap[normalizedId] = {
          status: latest.status === 'completed' ? 'completed' 
                : latest.status === 'failed' || isStalled ? 'failed'
                : isRunning ? 'running' : 'none',
          stepsCaptures: latest.steps_captured || 0,
          totalSteps: latest.total_steps || 1,
          screenshotsCount: screenshotCounts.get(latest.id) || 0,
          hasErrors: latest.status === 'failed' || isStalled,
          lastError: isStalled ? 'Analysis stalled - screenshot service error' : metadata?.error,
        };
      });
      
      setScores(scoreMap);
      setAnalysisStatus(statusMap);
      setRunningCount(runningTotal);
    } catch (err) {
      console.error('Failed to fetch scores:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  // Auto-poll while analyses are running
  useEffect(() => {
    if (runningCount === 0) return;
    
    const interval = setInterval(() => {
      fetchScores();
    }, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, [runningCount, fetchScores]);

  // Get all variants and sort by score
  const allVariants = getVariantsForFlow('all');
  const rankedVariants = [...allVariants]
    .map(v => {
      // Match using normalized ID
      const normalizedId = normalizeFlowId(v.id);
      return { 
        ...v, 
        score: scores[normalizedId] || scores[v.id],
        status: analysisStatus[normalizedId] || analysisStatus[v.id] || { 
          status: 'none' as const, 
          stepsCaptures: 0, 
          totalSteps: 1, 
          screenshotsCount: 0, 
          hasErrors: false 
        }
      };
    })
    .sort((a, b) => {
      const scoreA = a.score?.overallScore ?? -1;
      const scoreB = b.score?.overallScore ?? -1;
      return scoreB - scoreA;
    });

  // Top 3 podium
  const [first, second, third] = rankedVariants.slice(0, 3);

  // Stats
  const completedCount = rankedVariants.filter(v => v.status.status === 'completed').length;
  const failedCount = rankedVariants.filter(v => v.status.status === 'failed').length;
  const noAnalysisCount = rankedVariants.filter(v => v.status.status === 'none').length;
  const totalScreenshots = rankedVariants.reduce((sum, v) => sum + v.status.screenshotsCount, 0);

  const getStatusIcon = (status: AnalysisStatus) => {
    switch (status.status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: AnalysisStatus) => {
    switch (status.status) {
      case 'running':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            {status.stepsCaptures}/{status.totalSteps}
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            OK
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Fehler
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getScreenshotBadge = (status: AnalysisStatus) => {
    if (status.status === 'none') {
      return (
        <Badge variant="outline" className="text-muted-foreground">
          <ImageOff className="h-3 w-3 mr-1" />
          0
        </Badge>
      );
    }
    
    const expected = status.totalSteps * 2; // desktop + mobile per step
    const actual = status.screenshotsCount;
    const isComplete = actual >= expected;
    
    return (
      <Badge 
        variant="outline" 
        className={cn(
          isComplete ? "bg-green-50 text-green-700 border-green-200" : "bg-yellow-50 text-yellow-700 border-yellow-200"
        )}
      >
        <Image className="h-3 w-3 mr-1" />
        {actual}/{expected}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardContent className="pt-4 text-center">
            <CheckCircle2 className="h-6 w-6 text-green-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-green-700">{completedCount}</div>
            <div className="text-xs text-green-600">Analysiert</div>
          </CardContent>
        </Card>
        
        <Card className={cn(
          "bg-gradient-to-br",
          runningCount > 0 
            ? "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900" 
            : "from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
        )}>
          <CardContent className="pt-4 text-center">
            {runningCount > 0 ? (
              <Loader2 className="h-6 w-6 text-blue-600 mx-auto mb-1 animate-spin" />
            ) : (
              <Clock className="h-6 w-6 text-gray-500 mx-auto mb-1" />
            )}
            <div className={cn("text-2xl font-bold", runningCount > 0 ? "text-blue-700" : "text-gray-600")}>
              {runningCount}
            </div>
            <div className={cn("text-xs", runningCount > 0 ? "text-blue-600" : "text-gray-500")}>
              Laufend
            </div>
          </CardContent>
        </Card>
        
        <Card className={cn(
          "bg-gradient-to-br",
          failedCount > 0 
            ? "from-red-50 to-red-100 dark:from-red-950 dark:to-red-900"
            : "from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
        )}>
          <CardContent className="pt-4 text-center">
            <AlertCircle className={cn("h-6 w-6 mx-auto mb-1", failedCount > 0 ? "text-red-600" : "text-gray-500")} />
            <div className={cn("text-2xl font-bold", failedCount > 0 ? "text-red-700" : "text-gray-600")}>
              {failedCount}
            </div>
            <div className={cn("text-xs", failedCount > 0 ? "text-red-600" : "text-gray-500")}>
              Fehler
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <CardContent className="pt-4 text-center">
            <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-yellow-700">{noAnalysisCount}</div>
            <div className="text-xs text-yellow-600">Nicht analysiert</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
          <CardContent className="pt-4 text-center">
            <Image className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-purple-700">{totalScreenshots}</div>
            <div className="text-xs text-purple-600">Screenshots</div>
          </CardContent>
        </Card>
      </div>

      {/* Refresh indicator when polling */}
      {runningCount > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Auto-Update aktiv ({runningCount} Analysen laufen)</span>
        </div>
      )}

      {/* Podium - Top 3 */}
      <div className="grid grid-cols-3 gap-4">
        {/* Second Place */}
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-300">
          <CardContent className="pt-6 text-center">
            <Medal className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <RankBadge rank={2} size="lg" />
            <div className="mt-4">
              <ScoreRing score={second?.score?.overallScore || 0} size="md" />
            </div>
            <h3 className="font-bold mt-3">{second?.label || '-'}</h3>
            <p className="text-xs text-muted-foreground">{second?.description}</p>
            {second && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => onViewFlowDetails(second.id)}
              >
                Details
              </Button>
            )}
          </CardContent>
        </Card>

        {/* First Place */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-300 scale-105 shadow-lg z-10">
          <CardContent className="pt-6 text-center">
            <Crown className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
            <RankBadge rank={1} size="lg" />
            <div className="mt-4">
              <ScoreRing score={first?.score?.overallScore || 0} size="lg" />
            </div>
            <h3 className="font-bold text-lg mt-3">{first?.label || '-'}</h3>
            <p className="text-sm text-muted-foreground">{first?.description}</p>
            {first && (
              <div className="flex items-center justify-center gap-2 mt-3">
                <Link to={first.path} target="_blank">
                  <Button variant="secondary" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Live
                  </Button>
                </Link>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => onViewFlowDetails(first.id)}
                >
                  Details
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Third Place */}
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-300">
          <CardContent className="pt-6 text-center">
            <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
            <RankBadge rank={3} size="lg" />
            <div className="mt-4">
              <ScoreRing score={third?.score?.overallScore || 0} size="md" />
            </div>
            <h3 className="font-bold mt-3">{third?.label || '-'}</h3>
            <p className="text-xs text-muted-foreground">{third?.description}</p>
            {third && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={() => onViewFlowDetails(third.id)}
              >
                Details
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Full Ranking Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Vollständiges Ranking
          </CardTitle>
          <CardDescription>
            Alle {rankedVariants.length} Flows sortiert nach Gesamtscore
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rang</TableHead>
                <TableHead>Flow</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Screenshots</TableHead>
                <TableHead className="text-center">Gesamt</TableHead>
                <TableHead className="text-center">Conv.</TableHead>
                <TableHead className="text-center">UX</TableHead>
                <TableHead className="text-center">Mobile</TableHead>
                <TableHead className="text-right">Analysiert</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankedVariants.map((variant, index) => (
                <TableRow 
                  key={variant.id} 
                  className={cn(
                    "hover:bg-muted/50",
                    variant.status.status === 'running' && "bg-blue-50/50 dark:bg-blue-950/20",
                    variant.status.status === 'failed' && "bg-red-50/50 dark:bg-red-950/20"
                  )}
                >
                  <TableCell>
                    <RankBadge rank={index + 1} size="sm" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', variant.color)} />
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {variant.label}
                          {variant.status.status === 'running' && (
                            <Progress 
                              value={(variant.status.stepsCaptures / variant.status.totalSteps) * 100} 
                              className="w-16 h-1"
                            />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {variant.stepCount} Steps
                          {variant.status.lastError && (
                            <span className="text-red-500 ml-2" title={variant.status.lastError}>
                              • {variant.status.lastError.substring(0, 30)}...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {getStatusBadge(variant.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    {getScreenshotBadge(variant.status)}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className={cn('font-bold', getScoreColor(variant.score?.overallScore ?? null))}>
                        {variant.score?.overallScore ?? '-'}
                      </span>
                      {variant.score?.delta !== undefined && variant.score?.delta !== null && variant.score?.delta !== 0 && (
                        <ScoreDeltaCompact delta={variant.score.delta} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn('text-sm', getScoreColor(variant.score?.conversionScore ?? null))}>
                      {variant.score?.conversionScore ?? '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn('text-sm', getScoreColor(variant.score?.uxScore ?? null))}>
                      {variant.score?.uxScore ?? '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn('text-sm', getScoreColor(variant.score?.mobileScore ?? null))}>
                      {variant.score?.mobileScore ?? '-'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {formatRelativeTime(variant.score?.lastAnalyzed ?? null)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onAnalyzeFlow(variant.id)}
                        disabled={isAnalyzing === variant.id || variant.status.status === 'running'}
                      >
                        {isAnalyzing === variant.id || variant.status.status === 'running' ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onViewFlowDetails(variant.id)}
                      >
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RankingView;

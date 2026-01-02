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
import { FlowCard, ScoreRing, ScoreBadgeCompact, RankBadge } from '../components';
import type { FlowScore, FlowVariant, AnalysisRun } from '../types';
import { 
  getVariantsForFlow, 
  getAllFlowNumbers, 
  getScoreColor,
  formatRelativeTime 
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
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'date'>('score');
  const [filterFlowNum, setFilterFlowNum] = useState<number | 'all'>('all');

  // Fetch scores from database
  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('flow_analysis_runs')
        .select('flow_id, overall_score, conversion_score, ux_score, mobile_score, trust_score, accessibility_score, performance_score, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get latest score per flow
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
            accessibilityScore: row.accessibility_score,
            performanceScore: row.performance_score,
            lastAnalyzed: row.created_at,
          };
        }
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

  // Sort variants
  const sortedVariants = [...allVariants].sort((a, b) => {
    if (sortBy === 'score') {
      const scoreA = scores[a.id]?.overallScore ?? -1;
      const scoreB = scores[b.id]?.overallScore ?? -1;
      return scoreB - scoreA;
    }
    if (sortBy === 'date') {
      const dateA = scores[a.id]?.lastAnalyzed || '';
      const dateB = scores[b.id]?.lastAnalyzed || '';
      return dateB.localeCompare(dateA);
    }
    return a.label.localeCompare(b.label);
  });

  // Calculate stats - only count flows that exist in our config
  const configFlowIds = new Set(allVariants.map(v => v.id));
  const analyzedCount = Object.keys(scores).filter(flowId => configFlowIds.has(flowId)).length;
  const totalFlows = allVariants.length;
  const relevantScores = Object.entries(scores).filter(([flowId]) => configFlowIds.has(flowId)).map(([, s]) => s);
  const avgScore = relevantScores.length > 0
    ? Math.round(relevantScores.reduce((sum, s) => sum + (s.overallScore || 0), 0) / relevantScores.length)
    : 0;
  const criticalFlows = relevantScores.filter(s => s.overallScore !== null && s.overallScore < 50).length;

  // Get winner
  const winner = sortedVariants[0];
  const winnerScore = winner ? scores[winner.id] : null;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* Flow Grid */}
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
              score={scores[variant.id]}
              rank={sortBy === 'score' && filterFlowNum === 'all' ? index + 1 : null}
              isAnalyzing={isAnalyzing === variant.id}
              onAnalyze={() => onAnalyzeFlow(variant.id)}
              onViewDetails={() => onViewFlowDetails(variant.id)}
              compact
            />
          ))}
        </div>
      )}

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

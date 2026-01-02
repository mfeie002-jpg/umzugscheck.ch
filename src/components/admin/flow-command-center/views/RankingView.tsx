/**
 * Ranking View - All flows ranked by score with detailed comparison
 * Priority 1: Overview & Ranking
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { ScoreBadgeCompact, RankBadge, ScoreRing } from '../components';
import type { FlowScore, FlowVariant } from '../types';
import { 
  getVariantsForFlow, 
  getScoreColor,
  formatRelativeTime 
} from '../utils';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    setLoading(true);
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
            accessibilityScore: null,
            performanceScore: null,
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

  // Get all variants and sort by score
  const allVariants = getVariantsForFlow('all');
  const rankedVariants = [...allVariants]
    .map(v => ({ ...v, score: scores[v.id] }))
    .sort((a, b) => {
      const scoreA = a.score?.overallScore ?? -1;
      const scoreB = b.score?.overallScore ?? -1;
      return scoreB - scoreA;
    });

  // Top 3 podium
  const [first, second, third] = rankedVariants.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                <TableHead className="text-center">Gesamt</TableHead>
                <TableHead className="text-center">Conv.</TableHead>
                <TableHead className="text-center">UX</TableHead>
                <TableHead className="text-center">Mobile</TableHead>
                <TableHead className="text-center">Trust</TableHead>
                <TableHead className="text-right">Analysiert</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankedVariants.map((variant, index) => (
                <TableRow key={variant.id} className="hover:bg-muted/50">
                  <TableCell>
                    <RankBadge rank={index + 1} size="sm" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', variant.color)} />
                      <div>
                        <div className="font-medium">{variant.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {variant.stepCount} Steps
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn('font-bold', getScoreColor(variant.score?.overallScore ?? null))}>
                      {variant.score?.overallScore ?? '-'}
                    </span>
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
                  <TableCell className="text-center">
                    <span className={cn('text-sm', getScoreColor(variant.score?.trustScore ?? null))}>
                      {variant.score?.trustScore ?? '-'}
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
                        disabled={isAnalyzing === variant.id}
                      >
                        {isAnalyzing === variant.id ? (
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

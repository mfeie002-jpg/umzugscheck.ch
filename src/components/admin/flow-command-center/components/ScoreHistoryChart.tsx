/**
 * Score History Chart - Visualize score progression over time
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreHistoryEntry {
  date: string;
  overallScore: number;
  conversionScore: number;
  uxScore: number;
  mobileScore: number;
  trustScore: number;
}

interface ScoreHistoryChartProps {
  flowId: string;
  className?: string;
}

export const ScoreHistoryChart: React.FC<ScoreHistoryChartProps> = ({ flowId, className }) => {
  const [history, setHistory] = useState<ScoreHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [flowId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const normalizedId = flowId.startsWith('umzugsofferten-')
        ? flowId.replace('umzugsofferten-', '')
        : flowId;
      const flowIds = [flowId, normalizedId, `umzugsofferten-${normalizedId}`];

      const { data } = await supabase
        .from('flow_analysis_runs')
        .select('created_at, overall_score, conversion_score, ux_score, mobile_score, trust_score')
        .in('flow_id', flowIds)
        .eq('status', 'completed')
        .not('overall_score', 'is', null)
        .order('created_at', { ascending: true })
        .limit(20);

      if (data) {
        setHistory(data.map(d => ({
          date: new Date(d.created_at).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit' }),
          overallScore: d.overall_score || 0,
          conversionScore: d.conversion_score || 0,
          uxScore: d.ux_score || 0,
          mobileScore: d.mobile_score || 0,
          trustScore: d.trust_score || 0,
        })));
      }
    } catch (err) {
      console.error('Failed to fetch score history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (history.length < 2) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm">Score-Verlauf</CardTitle>
        </CardHeader>
        <CardContent className="py-4 text-center text-muted-foreground text-sm">
          Mind. 2 Analysen benötigt für Verlaufsanzeige
        </CardContent>
      </Card>
    );
  }

  const first = history[0];
  const last = history[history.length - 1];
  const totalChange = last.overallScore - first.overallScore;
  const maxScore = Math.max(...history.map(h => h.overallScore));
  const minScore = Math.min(...history.map(h => h.overallScore));
  const range = maxScore - minScore || 1;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Score-Verlauf</CardTitle>
          <Badge 
            variant={totalChange > 0 ? "default" : totalChange < 0 ? "destructive" : "secondary"}
            className="text-xs"
          >
            {totalChange > 0 ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : totalChange < 0 ? (
              <TrendingDown className="h-3 w-3 mr-1" />
            ) : (
              <Minus className="h-3 w-3 mr-1" />
            )}
            {totalChange > 0 ? '+' : ''}{totalChange}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Simple bar chart */}
        <div className="flex items-end gap-1 h-20">
          {history.map((entry, idx) => {
            const height = ((entry.overallScore - minScore) / range) * 100;
            const isLast = idx === history.length - 1;
            return (
              <div 
                key={idx}
                className="flex-1 flex flex-col items-center gap-1"
                title={`${entry.date}: ${entry.overallScore}`}
              >
                <div 
                  className={cn(
                    "w-full rounded-t transition-all",
                    isLast ? "bg-primary" : "bg-primary/40"
                  )}
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>{history[0].date}</span>
          <span>{history[history.length - 1].date}</span>
        </div>
        
        {/* Category breakdown */}
        <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
          <ScoreChange label="Conv" first={first.conversionScore} last={last.conversionScore} />
          <ScoreChange label="UX" first={first.uxScore} last={last.uxScore} />
          <ScoreChange label="Mobile" first={first.mobileScore} last={last.mobileScore} />
          <ScoreChange label="Trust" first={first.trustScore} last={last.trustScore} />
        </div>
      </CardContent>
    </Card>
  );
};

const ScoreChange: React.FC<{ label: string; first: number; last: number }> = ({ label, first, last }) => {
  const change = last - first;
  return (
    <div className="text-center">
      <div className="text-muted-foreground">{label}</div>
      <div className={cn(
        "font-medium",
        change > 0 ? "text-green-600" : change < 0 ? "text-red-600" : "text-muted-foreground"
      )}>
        {change > 0 ? '+' : ''}{change}
      </div>
    </div>
  );
};

export default ScoreHistoryChart;

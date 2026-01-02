/**
 * Flow Comparison Mini - Quick side-by-side comparison of 2 flows
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlowScore {
  flowId: string;
  overallScore: number | null;
  conversionScore: number | null;
  uxScore: number | null;
  mobileScore: number | null;
  trustScore: number | null;
}

interface FlowComparisonMiniProps {
  currentFlowId: string;
  availableFlows: string[];
  className?: string;
}

export const FlowComparisonMini: React.FC<FlowComparisonMiniProps> = ({
  currentFlowId,
  availableFlows,
  className,
}) => {
  const [compareFlowId, setCompareFlowId] = useState<string>('');
  const [currentScore, setCurrentScore] = useState<FlowScore | null>(null);
  const [compareScore, setCompareScore] = useState<FlowScore | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCurrentScore();
  }, [currentFlowId]);

  useEffect(() => {
    if (compareFlowId) {
      fetchCompareScore();
    }
  }, [compareFlowId]);

  const fetchScore = async (flowId: string): Promise<FlowScore | null> => {
    const normalizedId = flowId.startsWith('umzugsofferten-')
      ? flowId.replace('umzugsofferten-', '')
      : flowId;
    const flowIds = [flowId, normalizedId, `umzugsofferten-${normalizedId}`];

    const { data } = await supabase
      .from('flow_analysis_runs')
      .select('overall_score, conversion_score, ux_score, mobile_score, trust_score')
      .in('flow_id', flowIds)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (data) {
      return {
        flowId,
        overallScore: data.overall_score,
        conversionScore: data.conversion_score,
        uxScore: data.ux_score,
        mobileScore: data.mobile_score,
        trustScore: data.trust_score,
      };
    }
    return null;
  };

  const fetchCurrentScore = async () => {
    const score = await fetchScore(currentFlowId);
    setCurrentScore(score);
  };

  const fetchCompareScore = async () => {
    setLoading(true);
    const score = await fetchScore(compareFlowId);
    setCompareScore(score);
    setLoading(false);
  };

  const otherFlows = availableFlows.filter(f => f !== currentFlowId);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Schnellvergleich</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-mono">
            {currentFlowId}
          </Badge>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <Select value={compareFlowId} onValueChange={setCompareFlowId}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Vergleichen mit..." />
            </SelectTrigger>
            <SelectContent>
              {otherFlows.slice(0, 15).map(flow => (
                <SelectItem key={flow} value={flow}>
                  {flow}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {currentScore && compareScore && !loading && (
          <div className="space-y-2">
            <CompareRow 
              label="Gesamt" 
              current={currentScore.overallScore} 
              compare={compareScore.overallScore} 
            />
            <CompareRow 
              label="Conversion" 
              current={currentScore.conversionScore} 
              compare={compareScore.conversionScore} 
            />
            <CompareRow 
              label="UX" 
              current={currentScore.uxScore} 
              compare={compareScore.uxScore} 
            />
            <CompareRow 
              label="Mobile" 
              current={currentScore.mobileScore} 
              compare={compareScore.mobileScore} 
            />
            <CompareRow 
              label="Trust" 
              current={currentScore.trustScore} 
              compare={compareScore.trustScore} 
            />
          </div>
        )}

        {!compareFlowId && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Wähle einen Flow zum Vergleichen
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const CompareRow: React.FC<{
  label: string;
  current: number | null;
  compare: number | null;
}> = ({ label, current, compare }) => {
  const diff = (current || 0) - (compare || 0);
  const isWinning = diff > 0;
  const isTied = diff === 0;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <span className={cn(
          "font-medium",
          isWinning ? "text-green-600" : isTied ? "" : "text-red-600"
        )}>
          {current ?? '-'}
        </span>
        <span className="text-muted-foreground">vs</span>
        <span className="font-medium">{compare ?? '-'}</span>
        {!isTied && (
          <Badge variant={isWinning ? "default" : "destructive"} className="text-xs px-1">
            {isWinning ? '+' : ''}{diff}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default FlowComparisonMini;

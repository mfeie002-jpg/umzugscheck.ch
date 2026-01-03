/**
 * History View - Score trend tracking over time
 * The Archetype Reference for historical analysis
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  History, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  RefreshCw,
  Loader2,
  BarChart3,
  Target,
  Crown,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { formatRelativeTime, getScoreColor } from '../utils';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, Area, AreaChart } from 'recharts';

interface HistoryEntry {
  id: string;
  flowId: string;
  runNumber: number;
  currentScore: number;
  previousScore: number | null;
  scoreDelta: number;
  fixedIssues: string[];
  newIssues: string[];
  createdAt: string;
}

interface FlowTrend {
  flowId: string;
  entries: HistoryEntry[];
  currentScore: number;
  startScore: number;
  totalDelta: number;
  trend: 'up' | 'down' | 'stable';
}

interface HistoryViewProps {
  selectedFlowId?: string | null;
  onSelectFlow?: (flowId: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  selectedFlowId,
  onSelectFlow,
}) => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [flowFilter, setFlowFilter] = useState<string>(selectedFlowId || 'all');

  useEffect(() => {
    fetchHistory();
  }, [timeRange]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('flow_improvement_history')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply time filter
      if (timeRange !== 'all') {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        query = query.gte('created_at', cutoff.toISOString());
      }

      const { data, error } = await query.limit(500);
      
      if (error) throw error;

      setEntries((data || []).map(row => ({
        id: row.id,
        flowId: row.flow_id,
        runNumber: row.run_number,
        currentScore: row.current_score,
        previousScore: row.previous_score,
        scoreDelta: row.score_delta,
        fixedIssues: Array.isArray(row.fixed_issues) ? row.fixed_issues as string[] : [],
        newIssues: Array.isArray(row.new_issues) ? row.new_issues as string[] : [],
        createdAt: row.created_at,
      })));
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group entries by flow
  const flowTrends = useMemo(() => {
    const grouped = new Map<string, HistoryEntry[]>();
    
    entries.forEach(entry => {
      if (!grouped.has(entry.flowId)) {
        grouped.set(entry.flowId, []);
      }
      grouped.get(entry.flowId)!.push(entry);
    });

    const trends: FlowTrend[] = [];
    grouped.forEach((flowEntries, flowId) => {
      const sorted = flowEntries.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      
      const current = sorted[sorted.length - 1]?.currentScore || 0;
      const start = sorted[0]?.previousScore || sorted[0]?.currentScore || 0;
      const delta = current - start;

      trends.push({
        flowId,
        entries: sorted,
        currentScore: current,
        startScore: start,
        totalDelta: delta,
        trend: delta > 2 ? 'up' : delta < -2 ? 'down' : 'stable',
      });
    });

    return trends.sort((a, b) => b.totalDelta - a.totalDelta);
  }, [entries]);

  // Filter flows
  const filteredTrends = flowFilter === 'all' 
    ? flowTrends 
    : flowTrends.filter(t => t.flowId === flowFilter);

  // Chart data
  const chartData = useMemo(() => {
    if (filteredTrends.length === 0) return [];
    
    // Get all unique dates
    const dateMap = new Map<string, Record<string, number>>();
    
    filteredTrends.forEach(trend => {
      trend.entries.forEach(entry => {
        const dateKey = new Date(entry.createdAt).toLocaleDateString('de-CH');
        if (!dateMap.has(dateKey)) {
          dateMap.set(dateKey, { date: dateKey } as any);
        }
        dateMap.get(dateKey)![trend.flowId] = entry.currentScore;
      });
    });

    return Array.from(dateMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [filteredTrends]);

  // Get unique flow IDs for filter
  const flowIds = useMemo(() => 
    Array.from(new Set(entries.map(e => e.flowId))).sort(),
    [entries]
  );

  // Stats
  const stats = useMemo(() => {
    const improving = flowTrends.filter(t => t.trend === 'up').length;
    const declining = flowTrends.filter(t => t.trend === 'down').length;
    const avgDelta = flowTrends.length > 0 
      ? flowTrends.reduce((sum, t) => sum + t.totalDelta, 0) / flowTrends.length 
      : 0;
    const topImprover = flowTrends[0];
    
    return { improving, declining, avgDelta, topImprover };
  }, [flowTrends]);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
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
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verbessert</p>
                <p className="text-2xl font-bold text-green-600">{stats.improving}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Verschlechtert</p>
                <p className="text-2xl font-bold text-red-600">{stats.declining}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ø Änderung</p>
                <p className={cn(
                  'text-2xl font-bold',
                  stats.avgDelta > 0 ? 'text-green-600' : stats.avgDelta < 0 ? 'text-red-600' : 'text-muted-foreground'
                )}>
                  {stats.avgDelta > 0 ? '+' : ''}{stats.avgDelta.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-200 dark:bg-yellow-800">
                <Crown className="h-5 w-5 text-yellow-700 dark:text-yellow-300" />
              </div>
              <div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">Top Improver</p>
                <p className="text-lg font-bold text-yellow-900 dark:text-yellow-100 truncate">
                  {stats.topImprover?.flowId || '-'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
            <SelectTrigger className="w-32">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Tage</SelectItem>
              <SelectItem value="30d">30 Tage</SelectItem>
              <SelectItem value="90d">90 Tage</SelectItem>
              <SelectItem value="all">Alle</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={flowFilter} onValueChange={setFlowFilter}>
            <SelectTrigger className="w-48">
              <BarChart3 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Flow wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle Flows</SelectItem>
              {flowIds.map(id => (
                <SelectItem key={id} value={id}>{id}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" size="sm" onClick={fetchHistory} disabled={loading}>
          <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
          Aktualisieren
        </Button>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Score-Entwicklung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis domain={[0, 100]} className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  {filteredTrends.slice(0, 5).map((trend, i) => (
                    <Area
                      key={trend.flowId}
                      type="monotone"
                      dataKey={trend.flowId}
                      stroke={`hsl(${i * 60}, 70%, 50%)`}
                      fill={`hsl(${i * 60}, 70%, 50%)`}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flow Trends List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Flow-Entwicklung
          </CardTitle>
          <CardDescription>
            Score-Änderungen nach Flow
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTrends.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Keine Verlaufsdaten vorhanden</p>
              <p className="text-sm mt-2">
                Führe Analysen durch um den Fortschritt zu tracken.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {filteredTrends.map((trend) => (
                  <div
                    key={trend.flowId}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-colors",
                      "hover:bg-muted/50",
                      selectedFlowId === trend.flowId && "bg-primary/5 border-primary"
                    )}
                    onClick={() => onSelectFlow?.(trend.flowId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTrendIcon(trend.trend)}
                        <div>
                          <h4 className="font-medium">{trend.flowId}</h4>
                          <p className="text-sm text-muted-foreground">
                            {trend.entries.length} Analysen
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className={cn('font-bold', getScoreColor(trend.currentScore))}>
                            {trend.currentScore}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Start: {trend.startScore}
                          </div>
                        </div>
                        
                        <Badge 
                          variant={trend.trend === 'up' ? 'default' : trend.trend === 'down' ? 'destructive' : 'secondary'}
                          className="min-w-[60px] justify-center"
                        >
                          {trend.totalDelta > 0 ? '+' : ''}{trend.totalDelta.toFixed(0)}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Mini timeline */}
                    <div className="mt-3 flex items-center gap-1">
                      {trend.entries.slice(-10).map((entry, i) => (
                        <div
                          key={entry.id}
                          className={cn(
                            'flex-1 h-1.5 rounded-full',
                            entry.scoreDelta > 0 ? 'bg-green-500' : 
                            entry.scoreDelta < 0 ? 'bg-red-500' : 'bg-muted'
                          )}
                          title={`Run ${entry.runNumber}: ${entry.scoreDelta > 0 ? '+' : ''}${entry.scoreDelta}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Recent Changes */}
      <Card>
        <CardHeader>
          <CardTitle>Letzte Änderungen</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {entries.slice(0, 20).map((entry) => (
                <div key={entry.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className={cn(
                    'p-2 rounded-full',
                    entry.scoreDelta > 0 ? 'bg-green-100 dark:bg-green-950' : 
                    entry.scoreDelta < 0 ? 'bg-red-100 dark:bg-red-950' : 'bg-muted'
                  )}>
                    {entry.scoreDelta > 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-green-600" />
                    ) : entry.scoreDelta < 0 ? (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{entry.flowId}</span>
                      <Badge variant="outline" className="text-xs">
                        Run #{entry.runNumber}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {formatRelativeTime(entry.createdAt)}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <div className={cn(
                      'font-bold',
                      entry.scoreDelta > 0 ? 'text-green-600' : 
                      entry.scoreDelta < 0 ? 'text-red-600' : 'text-muted-foreground'
                    )}>
                      {entry.scoreDelta > 0 ? '+' : ''}{entry.scoreDelta}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entry.currentScore}/100
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {entry.fixedIssues.length > 0 && (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {entry.fixedIssues.length}
                      </Badge>
                    )}
                    {entry.newIssues.length > 0 && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {entry.newIssues.length}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistoryView;

/**
 * Flow Tester Results View - Admin overview of flow testing feedback
 * Shows statistics, rankings, and allows CSV/JSON export
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Download, 
  FileJson, 
  FileSpreadsheet, 
  Users, 
  Star, 
  Trophy, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface TesterSession {
  id: string;
  tester_name: string;
  tester_email: string;
  tester_role: string;
  started_at: string;
  completed_at: string | null;
  total_flows_tested: number;
}

interface FlowFeedback {
  id: string;
  session_id: string;
  flow_id: string;
  flow_name: string;
  flow_type: string;
  rating: number;
  feedback: string | null;
  abandoned: boolean;
  tested_at: string;
  session?: TesterSession;
}

interface FlowStats {
  flowId: string;
  flowName: string;
  totalTests: number;
  avgRating: number;
  abandonRate: number;
  recommendRate: number;
  feedbacks: FlowFeedback[];
}

export const FlowTesterResultsView: React.FC = () => {
  const [sessions, setSessions] = useState<TesterSession[]>([]);
  const [feedbacks, setFeedbacks] = useState<FlowFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | 'all'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to fetch sessions - tables may not exist yet
      const { data: sessionsData, error: sessionsError } = await supabase
        .from('flow_tester_sessions' as any)
        .select('*')
        .order('started_at', { ascending: false });
      
      // If table doesn't exist, show friendly message
      if (sessionsError) {
        if (sessionsError.message?.includes('does not exist') || sessionsError.code === '42P01') {
          setError('Die Datenbank-Tabellen für Flow-Tester wurden noch nicht erstellt. Bitte die Migration ausführen.');
        } else {
          throw sessionsError;
        }
        return;
      }
      
      // Fetch feedbacks
      const { data: feedbacksData, error: feedbacksError } = await supabase
        .from('flow_tester_feedback' as any)
        .select('*')
        .order('tested_at', { ascending: false });
      
      if (feedbacksError) throw feedbacksError;
      
      setSessions((sessionsData as unknown as TesterSession[]) || []);
      setFeedbacks((feedbacksData as unknown as FlowFeedback[]) || []);
    } catch (err: any) {
      console.error('Error fetching flow tester data:', err);
      setError(err.message || 'Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  // Filter by time range
  const filteredFeedbacks = useMemo(() => {
    if (selectedTimeRange === 'all') return feedbacks;
    
    const now = new Date();
    const days = selectedTimeRange === '7d' ? 7 : 30;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    
    return feedbacks.filter(f => new Date(f.tested_at) >= cutoff);
  }, [feedbacks, selectedTimeRange]);

  // Calculate flow statistics
  const flowStats = useMemo((): FlowStats[] => {
    const statsMap = new Map<string, FlowStats>();
    
    filteredFeedbacks.forEach(fb => {
      if (!statsMap.has(fb.flow_id)) {
        statsMap.set(fb.flow_id, {
          flowId: fb.flow_id,
          flowName: fb.flow_name,
          totalTests: 0,
          avgRating: 0,
          abandonRate: 0,
          recommendRate: 0,
          feedbacks: []
        });
      }
      
      const stats = statsMap.get(fb.flow_id)!;
      stats.feedbacks.push(fb);
      stats.totalTests++;
    });
    
    // Calculate averages
    statsMap.forEach(stats => {
      const completedFeedbacks = stats.feedbacks.filter(f => !f.abandoned);
      const abandonedCount = stats.feedbacks.filter(f => f.abandoned).length;
      const recommendCount = completedFeedbacks.filter(f => f.rating >= 4).length;
      
      stats.avgRating = completedFeedbacks.length > 0
        ? completedFeedbacks.reduce((sum, f) => sum + f.rating, 0) / completedFeedbacks.length
        : 0;
      stats.abandonRate = stats.totalTests > 0 ? (abandonedCount / stats.totalTests) * 100 : 0;
      stats.recommendRate = completedFeedbacks.length > 0 
        ? (recommendCount / completedFeedbacks.length) * 100 
        : 0;
    });
    
    return Array.from(statsMap.values()).sort((a, b) => b.avgRating - a.avgRating);
  }, [filteredFeedbacks]);

  // Overall statistics
  const overallStats = useMemo(() => {
    const total = filteredFeedbacks.length;
    const completed = filteredFeedbacks.filter(f => !f.abandoned).length;
    const abandoned = filteredFeedbacks.filter(f => f.abandoned).length;
    const avgRating = completed > 0
      ? filteredFeedbacks.filter(f => !f.abandoned).reduce((sum, f) => sum + f.rating, 0) / completed
      : 0;
    const uniqueTesters = new Set(filteredFeedbacks.map(f => f.session_id)).size;
    const recommendCount = filteredFeedbacks.filter(f => !f.abandoned && f.rating >= 4).length;
    
    return {
      total,
      completed,
      abandoned,
      avgRating,
      uniqueTesters,
      recommendRate: completed > 0 ? (recommendCount / completed) * 100 : 0
    };
  }, [filteredFeedbacks]);

  // Export functions
  const exportCSV = () => {
    const headers = ['Flow ID', 'Flow Name', 'Rating', 'Feedback', 'Abandoned', 'Tester Role', 'Tested At'];
    const rows = filteredFeedbacks.map(fb => {
      const session = sessions.find(s => s.id === fb.session_id);
      return [
        fb.flow_id,
        fb.flow_name,
        fb.rating.toString(),
        (fb.feedback || '').replace(/"/g, '""'),
        fb.abandoned ? 'Ja' : 'Nein',
        session?.tester_role || 'unknown',
        new Date(fb.tested_at).toLocaleString('de-CH')
      ];
    });
    
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `flow-tester-results-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('CSV exportiert');
  };

  const exportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      stats: overallStats,
      flowStats,
      sessions: sessions.map(s => ({
        ...s,
        feedbacks: feedbacks.filter(f => f.session_id === s.id)
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `flow-tester-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    toast.success('JSON exportiert');
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600';
    if (rating >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex flex-col items-center gap-4 text-center">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <div>
              <h3 className="font-semibold text-lg">Fehler beim Laden</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
            <Button onClick={fetchData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Erneut versuchen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold">Flow-Tester Ergebnisse</h2>
          <p className="text-muted-foreground">
            Übersicht aller Tester-Feedbacks und Statistiken
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedTimeRange} onValueChange={(v) => setSelectedTimeRange(v as any)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Tage</SelectItem>
              <SelectItem value="30d">30 Tage</SelectItem>
              <SelectItem value="all">Alle</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            CSV
          </Button>
          
          <Button variant="outline" size="sm" onClick={exportJSON}>
            <FileJson className="h-4 w-4 mr-2" />
            JSON
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tests</p>
                <p className="text-2xl font-bold">{overallStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Abgeschlossen</p>
                <p className="text-2xl font-bold">{overallStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-950">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Abgebrochen</p>
                <p className="text-2xl font-bold text-red-600">{overallStats.abandoned}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-950">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ø Rating</p>
                <p className={cn('text-2xl font-bold', getRatingColor(overallStats.avgRating))}>
                  {overallStats.avgRating.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tester</p>
                <p className="text-2xl font-bold">{overallStats.uniqueTesters}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950">
                <ThumbsUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Empfehlung</p>
                <p className="text-2xl font-bold">{overallStats.recommendRate.toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="ranking" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ranking">
            <Trophy className="h-4 w-4 mr-2" />
            Flow Ranking
          </TabsTrigger>
          <TabsTrigger value="feedbacks">
            <MessageSquare className="h-4 w-4 mr-2" />
            Alle Feedbacks
          </TabsTrigger>
          <TabsTrigger value="testers">
            <Users className="h-4 w-4 mr-2" />
            Tester
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ranking" className="space-y-4">
          {flowStats.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Noch keine Testergebnisse vorhanden</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {flowStats.map((stats, index) => (
                <Card key={stats.flowId} className={cn(
                  index === 0 && 'ring-2 ring-yellow-400 bg-yellow-50/50 dark:bg-yellow-950/20'
                )}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center font-bold',
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-400 text-orange-900' :
                        'bg-muted text-muted-foreground'
                      )}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{stats.flowName}</h3>
                        <p className="text-sm text-muted-foreground">{stats.flowId}</p>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-muted-foreground">Tests</p>
                          <p className="font-semibold">{stats.totalTests}</p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-muted-foreground">Rating</p>
                          <div className="flex items-center gap-1">
                            <Star className={cn('h-4 w-4', getRatingColor(stats.avgRating))} />
                            <span className={cn('font-semibold', getRatingColor(stats.avgRating))}>
                              {stats.avgRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-muted-foreground">Abbruch</p>
                          <p className={cn('font-semibold', 
                            stats.abandonRate > 30 ? 'text-red-600' : 'text-green-600'
                          )}>
                            {stats.abandonRate.toFixed(0)}%
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-muted-foreground">Empfehlung</p>
                          <p className={cn('font-semibold',
                            stats.recommendRate >= 70 ? 'text-green-600' : 
                            stats.recommendRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                          )}>
                            {stats.recommendRate.toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="feedbacks" className="space-y-4">
          {filteredFeedbacks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Noch keine Feedbacks vorhanden</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredFeedbacks.slice(0, 50).map(fb => {
                const session = sessions.find(s => s.id === fb.session_id);
                return (
                  <Card key={fb.id}>
                    <CardContent className="py-3">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          fb.abandoned ? 'bg-red-100 dark:bg-red-950' : 'bg-green-100 dark:bg-green-950'
                        )}>
                          {fb.abandoned ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{fb.flow_name}</span>
                            <Badge variant="outline" className="text-xs">{fb.flow_type}</Badge>
                            {fb.abandoned && <Badge variant="destructive" className="text-xs">Abgebrochen</Badge>}
                          </div>
                          
                          {fb.feedback && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{fb.feedback}</p>
                          )}
                          
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {session?.tester_name || 'Unbekannt'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(fb.tested_at).toLocaleString('de-CH')}
                            </span>
                          </div>
                        </div>
                        
                        {!fb.abandoned && (
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star 
                                key={star} 
                                className={cn(
                                  'h-4 w-4',
                                  star <= fb.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'
                                )} 
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              {filteredFeedbacks.length > 50 && (
                <p className="text-center text-sm text-muted-foreground">
                  Zeige 50 von {filteredFeedbacks.length} Feedbacks
                </p>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="testers" className="space-y-4">
          {sessions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Noch keine Tester registriert</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sessions.map(session => {
                const sessionFeedbacks = feedbacks.filter(f => f.session_id === session.id);
                const avgRating = sessionFeedbacks.length > 0
                  ? sessionFeedbacks.filter(f => !f.abandoned).reduce((sum, f) => sum + f.rating, 0) / 
                    sessionFeedbacks.filter(f => !f.abandoned).length
                  : 0;
                
                return (
                  <Card key={session.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{session.tester_name}</p>
                          <p className="text-xs text-muted-foreground">{session.tester_email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline">{session.tester_role}</Badge>
                        <span className="text-muted-foreground">
                          {sessionFeedbacks.length} Tests
                        </span>
                        {avgRating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            {avgRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FlowTesterResultsView;

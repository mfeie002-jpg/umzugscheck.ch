import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ListOrdered, Play, Trash2, RefreshCw, Clock, CheckCircle, 
  AlertCircle, Loader2, Plus, ArrowUp, ArrowDown, History, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface QueueItem {
  id: string;
  flow_version: string;
  flow_id: string;
  priority: number;
  status: string;
  queued_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
}

interface AnalysisRun {
  id: string;
  flow_id: string;
  flow_name: string;
  status: string;
  overall_score: number | null;
  created_at: string;
  completed_at: string | null;
}

interface AnalysisQueuePanelProps {
  onAddToQueue?: (flowVersion: string, flowId: string) => void;
  availableFlows?: Array<{ id: string; label: string; flowId: string }>;
}

export default function AnalysisQueuePanel({ availableFlows = [] }: AnalysisQueuePanelProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [recentItems, setRecentItems] = useState<QueueItem[]>([]);
  const [analysisRuns, setAnalysisRuns] = useState<AnalysisRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRecent, setShowRecent] = useState(true);
  const [activeTab, setActiveTab] = useState('queue');

  const requireAuth = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) console.error('Auth check failed:', error);

    if (!session) {
      setIsAuthed(false);
      toast({
        title: 'Bitte einloggen',
        description: 'Für die Analyse-Queue musst du im Admin-Login eingeloggt sein.',
      });
      navigate('/admin/login');
      return false;
    }

    setIsAuthed(true);
    return true;
  };

  // Fetch queue including recent completions
  const fetchQueue = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAuthed(false);
        setQueue([]);
        setRecentItems([]);
        return;
      }
      setIsAuthed(true);

      // Fetch active queue items
      const { data: activeData, error: activeError } = await supabase
        .from('flow_analysis_queue')
        .select('*')
        .in('status', ['queued', 'processing'])
        .order('priority', { ascending: false })
        .order('queued_at', { ascending: true });

      if (activeError) throw activeError;
      setQueue(activeData || []);

      // Fetch recently completed/failed items (last 15 minutes)
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
      const { data: recentData, error: recentError } = await supabase
        .from('flow_analysis_queue')
        .select('*')
        .in('status', ['completed', 'failed'])
        .gte('completed_at', fifteenMinutesAgo)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;
      setRecentItems(recentData || []);

      // Fetch analysis runs history
      const { data: runsData, error: runsError } = await supabase
        .from('flow_analysis_runs')
        .select('id, flow_id, flow_name, status, overall_score, created_at, completed_at')
        .order('created_at', { ascending: false })
        .limit(30);

      if (runsError) throw runsError;
      setAnalysisRuns(runsData || []);
    } catch (err) {
      console.error('Error fetching queue:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let intervalId: number | undefined;

    (async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error) console.error('getSession error:', error);

      if (!session) {
        setIsAuthed(false);
        setIsLoading(false);
        return;
      }

      setIsAuthed(true);
      await fetchQueue();
      intervalId = window.setInterval(fetchQueue, 3000); // Faster polling
    })();

    return () => {
      mounted = false;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [fetchQueue]);

  // Add to queue
  const addToQueue = async (flowVersion: string, flowId: string, priority = 0) => {
    try {
      if (flowVersion === 'all' || flowId === 'all') {
        toast({
          title: 'Bitte V1–V9 wählen',
          description: '"Alle" kann nicht als einzelner Queue-Job analysiert werden. Nutze den Button "Alle" oben.',
        });
        return;
      }

      // Check if already in active queue
      const existing = queue.find(q => q.flow_version === flowVersion && q.status !== 'completed');
      if (existing) {
        toast({ title: 'Bereits in Queue', description: `${flowVersion.toUpperCase()} ist bereits in der Warteschlange.` });
        return;
      }

      const { error } = await supabase
        .from('flow_analysis_queue')
        .insert({
          flow_version: flowVersion,
          flow_id: flowId,
          priority,
          status: 'queued'
        });

      if (error) throw error;

      toast({ title: 'Zur Queue hinzugefügt', description: `${flowVersion.toUpperCase()} wurde zur Warteschlange hinzugefügt.` });
      await fetchQueue();
    } catch (err) {
      console.error('Error adding to queue:', err);
      toast({ title: 'Fehler', description: 'Konnte nicht zur Queue hinzufügen.', variant: 'destructive' });
    }
  };

  // Add all flows to queue (excludes the synthetic "all" entry)
  const addAllToQueue = async () => {
    const flows = availableFlows.filter(f => f.id !== 'all' && f.flowId !== 'all');
    for (const [idx, flow] of flows.entries()) {
      await addToQueue(flow.id, flow.flowId, flows.length - idx);
    }
    toast({ 
      title: 'Alle Flows hinzugefügt', 
      description: `${flows.length} Flows wurden zur Queue hinzugefügt.` 
    });
  };

  // Remove from queue
  const removeFromQueue = async (id: string) => {
    try {
      const { error } = await supabase
        .from('flow_analysis_queue')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({ title: 'Entfernt', description: 'Item wurde aus der Queue entfernt.' });
      fetchQueue();
    } catch (err) {
      console.error('Error removing from queue:', err);
      toast({ title: 'Fehler', description: 'Konnte nicht entfernen.', variant: 'destructive' });
    }
  };

  // Start processing queue
  const startProcessing = async () => {
    setIsProcessing(true);
    try {
      const { error } = await supabase.functions.invoke('process-analysis-queue', {
        body: { processAll: true }
      });

      if (error) throw error;

      toast({ 
        title: 'Queue gestartet', 
        description: 'Die Verarbeitung wurde gestartet und läuft im Hintergrund. Items werden sofort verarbeitet.' 
      });
      
      // Immediate refresh to catch fast completions
      setTimeout(fetchQueue, 500);
      setTimeout(fetchQueue, 2000);
    } catch (err) {
      console.error('Error starting queue:', err);
      toast({ title: 'Fehler', description: 'Konnte Queue nicht starten.', variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  // Update priority
  const updatePriority = async (id: string, delta: number) => {
    const item = queue.find(q => q.id === id);
    if (!item) return;

    try {
      const { error } = await supabase
        .from('flow_analysis_queue')
        .update({ priority: item.priority + delta })
        .eq('id', id);

      if (error) throw error;
      fetchQueue();
    } catch (err) {
      console.error('Error updating priority:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'queued':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"><Clock className="h-3 w-3 mr-1" /> Wartend</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"><Loader2 className="h-3 w-3 mr-1 animate-spin" /> Läuft</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"><CheckCircle className="h-3 w-3 mr-1" /> Fertig</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"><AlertCircle className="h-3 w-3 mr-1" /> Fehler</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const queuedItems = queue.filter(q => q.status === 'queued');
  const processingItem = queue.find(q => q.status === 'processing');
  const totalActive = queuedItems.length + (processingItem ? 1 : 0);

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ListOrdered className="h-5 w-5" />
            Analyse-Queue
            {totalActive > 0 && (
              <Badge variant="secondary">{totalActive} aktiv</Badge>
            )}
            {recentItems.length > 0 && totalActive === 0 && (
              <Badge variant="outline" className="text-green-600">{recentItems.length} fertig</Badge>
            )}
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchQueue}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button 
              size="sm" 
              onClick={startProcessing}
              disabled={isProcessing || queuedItems.length === 0}
              className="gap-1"
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Starten
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="queue" className="gap-1">
              <ListOrdered className="h-3 w-3" />
              Queue {totalActive > 0 && `(${totalActive})`}
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1">
              <History className="h-3 w-3" />
              History ({analysisRuns.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="queue" className="space-y-4 mt-4">
            {/* Quick add buttons */}
            {availableFlows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Zur Queue hinzufügen:</span>
                  <Button variant="ghost" size="sm" onClick={addAllToQueue} className="gap-1">
                    <Plus className="h-3 w-3" /> Alle
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {availableFlows
                    .filter(flow => flow.id !== 'all' && flow.flowId !== 'all')
                    .map(flow => {
                      const isQueued = queue.some(q => q.flow_version === flow.id && q.status !== 'completed');
                      const recentlyCompleted = recentItems.some(r => r.flow_version === flow.id);
                      return (
                        <Button
                          key={flow.id}
                          variant={isQueued ? 'secondary' : recentlyCompleted ? 'outline' : 'outline'}
                          size="sm"
                          onClick={() => addToQueue(flow.id, flow.flowId)}
                          disabled={isQueued}
                          className={`h-7 text-xs ${recentlyCompleted && !isQueued ? 'border-green-300 text-green-700 dark:border-green-700 dark:text-green-400' : ''}`}
                        >
                          {flow.label}
                          {isQueued && <Loader2 className="h-3 w-3 ml-1 animate-spin" />}
                          {recentlyCompleted && !isQueued && <CheckCircle className="h-3 w-3 ml-1" />}
                        </Button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Processing item */}
            {processingItem && (
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
                    <span className="font-medium">{processingItem.flow_version.toUpperCase()}</span>
                  </div>
                  {getStatusBadge(processingItem.status)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Gestartet: {processingItem.started_at ? new Date(processingItem.started_at).toLocaleTimeString('de-CH') : '-'}
                </p>
              </div>
            )}

            {/* Queue list */}
            {queuedItems.length > 0 ? (
              <ScrollArea className="h-[150px]">
                <div className="space-y-2">
                  <AnimatePresence>
                    {queuedItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between p-2 rounded bg-muted/50 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground w-5 text-center">{index + 1}.</span>
                          <span className="font-medium">{item.flow_version.toUpperCase()}</span>
                          {item.priority > 0 && (
                            <Badge variant="outline" className="text-xs">P{item.priority}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updatePriority(item.id, 1)}>
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updatePriority(item.id, -1)}>
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => removeFromQueue(item.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </ScrollArea>
            ) : !processingItem && queuedItems.length === 0 && recentItems.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                <ListOrdered className="h-8 w-8 mx-auto mb-2 opacity-50" />
                Queue ist leer
              </div>
            ) : null}

            {/* Recent completions */}
            {recentItems.length > 0 && (
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-muted-foreground gap-2"
                  onClick={() => setShowRecent(!showRecent)}
                >
                  <History className="h-4 w-4" />
                  Kürzlich verarbeitet ({recentItems.length})
                  <span className="ml-auto text-xs">{showRecent ? '▼' : '▶'}</span>
                </Button>
                
                {showRecent && (
                  <ScrollArea className="h-[100px]">
                    <div className="space-y-1">
                      {recentItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 rounded bg-green-50/50 dark:bg-green-950/20 text-sm">
                          <div className="flex items-center gap-2">
                            {item.status === 'completed' ? <CheckCircle className="h-3 w-3 text-green-600" /> : <AlertCircle className="h-3 w-3 text-red-600" />}
                            <span className="font-medium">{item.flow_version.toUpperCase()}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {item.completed_at && formatDistanceToNow(new Date(item.completed_at), { addSuffix: true, locale: de })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {analysisRuns.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    Keine Analyse-Runs gefunden
                  </div>
                ) : (
                  analysisRuns.map((run) => {
                    const version = run.flow_id.replace('umzugsofferten-', '');
                    return (
                      <div
                        key={run.id}
                        className="flex items-center justify-between p-3 rounded bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => window.location.href = `/admin/flow-deep-analysis?flow=${version}`}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{run.flow_name || run.flow_id}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(run.created_at), { addSuffix: true, locale: de })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {run.overall_score !== null && (
                            <Badge 
                              variant="outline" 
                              className={`
                                ${run.overall_score >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300' : ''}
                                ${run.overall_score >= 60 && run.overall_score < 80 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300' : ''}
                                ${run.overall_score < 60 ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : ''}
                              `}
                            >
                              {run.overall_score}%
                            </Badge>
                          )}
                          {getStatusBadge(run.status)}
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
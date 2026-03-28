/**
 * All Flows Screenshot Review Page
 * Manual checking of ALL flows with their screenshots
 * Desktop/Mobile, all steps, with status indicators
 */

import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Monitor, Smartphone, Search, RefreshCw, AlertCircle, CheckCircle2, 
  XCircle, Image, Camera, ChevronDown, ChevronUp, Filter, Download,
  Loader2, Eye, ZoomIn, X, Play, ExternalLink, Grid, List
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

// All flow IDs (76 total)
const ALL_FLOW_IDS = [
  'v1', 'v1a', 'v1b', 'v1c', 'v1d', 'v1e', 'v1f', 'v1g',
  'v2', 'v2a', 'v2b', 'v2c', 'v2d', 'v2e', 'v2f', 'v2-archetyp',
  'v3', 'v3a', 'v3b', 'v3c', 'v3d', 'v3e',
  'v4', 'v4a', 'v4b', 'v4c', 'v4d', 'v4e', 'v4f',
  'v5', 'v5a', 'v5b', 'v5c', 'v5d', 'v5e', 'v5f',
  'v6', 'v6a', 'v6b', 'v6c', 'v6d', 'v6e', 'v6f',
  'v7', 'v7a',
  'v8', 'v8a',
  'v9', 'v9a', 'v9b', 'v9c', 'v9d',
  'ultimate-all', 'ultimate-best36', 'ultimate-v1', 'ultimate-v2', 'ultimate-v5', 'ultimate-v7', 'ultimate-ch',
  'vultimate', 'vultimate-v1', 'vultimate-v2',
  'chatgpt-flow-1', 'chatgpt-flow-2', 'chatgpt-flow-3',
  'multi-a',
  'v9-zero-friction', 'golden-flow-v10', 'swiss-lightning', 'swiss-premium-choice', 'swiss-concierge-hybrid',
  'umzugsofferten-v1.1.a',
];

// Flow family groupings
const FLOW_FAMILIES = {
  'V1 Familie': ['v1', 'v1a', 'v1b', 'v1c', 'v1d', 'v1e', 'v1f', 'v1g'],
  'V2 Familie': ['v2', 'v2a', 'v2b', 'v2c', 'v2d', 'v2e', 'v2f', 'v2-archetyp'],
  'V3 Familie': ['v3', 'v3a', 'v3b', 'v3c', 'v3d', 'v3e'],
  'V4 Familie': ['v4', 'v4a', 'v4b', 'v4c', 'v4d', 'v4e', 'v4f'],
  'V5 Familie': ['v5', 'v5a', 'v5b', 'v5c', 'v5d', 'v5e', 'v5f'],
  'V6 Familie': ['v6', 'v6a', 'v6b', 'v6c', 'v6d', 'v6e', 'v6f'],
  'V7 Familie': ['v7', 'v7a'],
  'V8 Familie': ['v8', 'v8a'],
  'V9 Familie': ['v9', 'v9a', 'v9b', 'v9c', 'v9d'],
  'Ultimate Familie': ['ultimate-all', 'ultimate-best36', 'ultimate-v1', 'ultimate-v2', 'ultimate-v5', 'ultimate-v7', 'ultimate-ch', 'vultimate', 'vultimate-v1', 'vultimate-v2'],
  'ChatGPT Flows': ['chatgpt-flow-1', 'chatgpt-flow-2', 'chatgpt-flow-3'],
  'Swiss Premium': ['v9-zero-friction', 'golden-flow-v10', 'swiss-lightning', 'swiss-premium-choice', 'swiss-concierge-hybrid'],
  'Sonstige': ['multi-a', 'umzugsofferten-v1.1.a'],
};

interface StepScreenshot {
  stepNumber: number;
  desktopUrl: string | null;
  mobileUrl: string | null;
  createdAt: string;
}

interface FlowScreenshotData {
  flowId: string;
  screenshots: StepScreenshot[];
  totalSteps: number;
  desktopCount: number;
  mobileCount: number;
  status: 'complete' | 'partial' | 'missing';
  isLoading: boolean;
  lastUpdated: string | null;
}

type FilterStatus = 'all' | 'complete' | 'partial' | 'missing';
type ViewMode = 'list' | 'grid';

export default function AllFlowsScreenshotReview() {
  const [flowData, setFlowData] = useState<Map<string, FlowScreenshotData>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterFamily, setFilterFamily] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [expandedFlows, setExpandedFlows] = useState<Set<string>>(new Set());
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxInfo, setLightboxInfo] = useState<{ flowId: string; step: number; device: string } | null>(null);
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'desktop' | 'mobile'>('all');

  // Get flow ID candidates for matching (handles prefixes)
  const getFlowIdCandidates = (id: string) => {
    const normalized = id.startsWith('umzugsofferten-')
      ? id.replace('umzugsofferten-', '')
      : id;
    return Array.from(new Set([
      id,
      normalized,
      `umzugsofferten-${normalized}`,
    ]));
  };

  // Load all flow screenshot data
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    const newFlowData = new Map<string, FlowScreenshotData>();

    try {
      // Fetch all step metrics at once
      const { data: allMetrics, error } = await supabase
        .from('flow_step_metrics')
        .select('flow_id, step_number, desktop_screenshot_url, mobile_screenshot_url, created_at')
        .or('desktop_screenshot_url.not.is.null,mobile_screenshot_url.not.is.null')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by flow_id
      const metricsByFlow = new Map<string, typeof allMetrics>();
      for (const metric of allMetrics || []) {
        const flowId = metric.flow_id.replace(/^umzugsofferten-/, '');
        if (!metricsByFlow.has(flowId)) {
          metricsByFlow.set(flowId, []);
        }
        metricsByFlow.get(flowId)!.push(metric);
      }

      // Process each flow
      for (const flowId of ALL_FLOW_IDS) {
        const candidates = getFlowIdCandidates(flowId);
        let metrics: typeof allMetrics = [];
        
        // Find metrics for this flow
        for (const candidate of candidates) {
          const normalized = candidate.replace(/^umzugsofferten-/, '');
          if (metricsByFlow.has(normalized)) {
            metrics = metricsByFlow.get(normalized) || [];
            break;
          }
          if (metricsByFlow.has(candidate)) {
            metrics = metricsByFlow.get(candidate) || [];
            break;
          }
        }

        // Deduplicate by step number (keep newest)
        const newestByStep = new Map<number, StepScreenshot>();
        for (const row of metrics) {
          if (!newestByStep.has(row.step_number)) {
            newestByStep.set(row.step_number, {
              stepNumber: row.step_number,
              desktopUrl: row.desktop_screenshot_url,
              mobileUrl: row.mobile_screenshot_url,
              createdAt: row.created_at,
            });
          }
        }

        const screenshots = Array.from(newestByStep.values()).sort((a, b) => a.stepNumber - b.stepNumber);
        const desktopCount = screenshots.filter(s => s.desktopUrl).length;
        const mobileCount = screenshots.filter(s => s.mobileUrl).length;
        const totalSteps = screenshots.length;
        
        // Determine status
        let status: 'complete' | 'partial' | 'missing' = 'missing';
        if (totalSteps > 0) {
          const hasAllDesktop = desktopCount === totalSteps;
          const hasAllMobile = mobileCount === totalSteps;
          status = hasAllDesktop && hasAllMobile ? 'complete' : 'partial';
        }

        const lastUpdated = screenshots.length > 0 
          ? screenshots.reduce((latest, s) => s.createdAt > latest ? s.createdAt : latest, screenshots[0].createdAt)
          : null;

        newFlowData.set(flowId, {
          flowId,
          screenshots,
          totalSteps,
          desktopCount,
          mobileCount,
          status,
          isLoading: false,
          lastUpdated,
        });
      }

      setFlowData(newFlowData);
    } catch (err) {
      console.error('Failed to load screenshot data:', err);
      toast.error('Fehler beim Laden der Screenshot-Daten');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Filter flows
  const filteredFlows = ALL_FLOW_IDS.filter(flowId => {
    // Search filter
    if (searchTerm && !flowId.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Family filter
    if (filterFamily !== 'all') {
      const familyFlows = FLOW_FAMILIES[filterFamily as keyof typeof FLOW_FAMILIES] || [];
      if (!familyFlows.includes(flowId)) {
        return false;
      }
    }

    // Status filter
    if (filterStatus !== 'all') {
      const data = flowData.get(flowId);
      if (!data || data.status !== filterStatus) {
        return false;
      }
    }

    return true;
  });

  // Stats
  const stats = {
    total: ALL_FLOW_IDS.length,
    complete: Array.from(flowData.values()).filter(f => f.status === 'complete').length,
    partial: Array.from(flowData.values()).filter(f => f.status === 'partial').length,
    missing: Array.from(flowData.values()).filter(f => f.status === 'missing').length,
  };

  const toggleExpand = (flowId: string) => {
    setExpandedFlows(prev => {
      const next = new Set(prev);
      if (next.has(flowId)) {
        next.delete(flowId);
      } else {
        next.add(flowId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedFlows(new Set(filteredFlows));
  };

  const collapseAll = () => {
    setExpandedFlows(new Set());
  };

  const openLightbox = (url: string, flowId: string, step: number, device: string) => {
    setLightboxUrl(url);
    setLightboxInfo({ flowId, step, device });
  };

  const closeLightbox = () => {
    setLightboxUrl(null);
    setLightboxInfo(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30"><CheckCircle2 className="h-3 w-3 mr-1" />Vollständig</Badge>;
      case 'partial':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"><AlertCircle className="h-3 w-3 mr-1" />Teilweise</Badge>;
      case 'missing':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="h-3 w-3 mr-1" />Fehlt</Badge>;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('de-CH', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">All Flows Screenshot Review</h1>
            <p className="text-muted-foreground">
              Manuelle Überprüfung aller {stats.total} Flows mit Screenshots
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={loadAllData} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/screenshots">
                <Camera className="h-4 w-4 mr-2" />
                Bulk Capture
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFilterStatus('all')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gesamt</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Grid className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-green-500 transition-colors" onClick={() => setFilterStatus('complete')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Vollständig</p>
                  <p className="text-2xl font-bold text-green-600">{stats.complete}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-yellow-500 transition-colors" onClick={() => setFilterStatus('partial')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">Teilweise</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.partial}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-red-500 transition-colors" onClick={() => setFilterStatus('missing')}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-600">Fehlt</p>
                  <p className="text-2xl font-bold text-red-600">{stats.missing}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Flow suchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-48"
                  />
                </div>

                {/* Family Filter */}
                <Select value={filterFamily} onValueChange={setFilterFamily}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Familie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Familien</SelectItem>
                    {Object.keys(FLOW_FAMILIES).map(family => (
                      <SelectItem key={family} value={family}>{family}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    <SelectItem value="complete">Vollständig</SelectItem>
                    <SelectItem value="partial">Teilweise</SelectItem>
                    <SelectItem value="missing">Fehlt</SelectItem>
                  </SelectContent>
                </Select>

                {/* Device Filter */}
                <Select value={deviceFilter} onValueChange={(v) => setDeviceFilter(v as 'all' | 'desktop' | 'mobile')}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Gerät" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Geräte</SelectItem>
                    <SelectItem value="desktop">Desktop</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{filteredFlows.length} Flows</span>
                <Button variant="ghost" size="sm" onClick={expandAll}>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Alle öffnen
                </Button>
                <Button variant="ghost" size="sm" onClick={collapseAll}>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Alle schliessen
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Screenshot-Abdeckung</span>
            <span>{Math.round((stats.complete / stats.total) * 100)}% vollständig</span>
          </div>
          <Progress value={(stats.complete / stats.total) * 100} className="h-2" />
        </div>

        {/* Flow List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFlows.map(flowId => {
              const data = flowData.get(flowId);
              const isExpanded = expandedFlows.has(flowId);

              return (
                <Card key={flowId} className="overflow-hidden">
                  <button
                    onClick={() => toggleExpand(flowId)}
                    className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        data?.status === 'complete' ? 'bg-green-500' :
                        data?.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="font-mono font-medium">{flowId}</div>
                        <div className="text-sm text-muted-foreground">
                          {data?.totalSteps || 0} Steps • 
                          <Monitor className="inline h-3 w-3 mx-1" />{data?.desktopCount || 0} • 
                          <Smartphone className="inline h-3 w-3 mx-1" />{data?.mobileCount || 0}
                          {data?.lastUpdated && (
                            <span className="ml-2">• Aktualisiert: {formatDate(data.lastUpdated)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {data && getStatusBadge(data.status)}
                      <Link 
                        to={`/umzugsofferten-${flowId}`}
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 hover:bg-muted rounded-lg"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 pt-0 border-t">
                          {!data || data.screenshots.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                              <p>Keine Screenshots vorhanden</p>
                              <Button variant="outline" size="sm" className="mt-3" asChild>
                                <Link to={`/admin/screenshots?flow=${flowId}`}>
                                  <Camera className="h-4 w-4 mr-2" />
                                  Screenshots erstellen
                                </Link>
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {/* Desktop Screenshots */}
                              {(deviceFilter === 'all' || deviceFilter === 'desktop') && (
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <Monitor className="h-4 w-4" />
                                    <span className="font-medium">Desktop</span>
                                    <Badge variant="outline">{data.desktopCount}/{data.totalSteps}</Badge>
                                  </div>
                                  <div className="flex gap-3 overflow-x-auto pb-2">
                                    {data.screenshots.map(step => (
                                      <div key={`desktop-${step.stepNumber}`} className="flex-shrink-0">
                                        <div className="text-xs text-muted-foreground mb-1 text-center">
                                          Step {step.stepNumber}
                                        </div>
                                        <button
                                          onClick={() => step.desktopUrl && openLightbox(step.desktopUrl, flowId, step.stepNumber, 'Desktop')}
                                          disabled={!step.desktopUrl}
                                          className={`relative w-40 h-24 rounded-lg overflow-hidden border group transition-all ${
                                            step.desktopUrl 
                                              ? 'border-border hover:border-primary cursor-pointer' 
                                              : 'border-dashed border-muted-foreground/30 bg-muted'
                                          }`}
                                        >
                                          {step.desktopUrl ? (
                                            <>
                                              <img
                                                src={step.desktopUrl}
                                                alt={`Step ${step.stepNumber}`}
                                                className="w-full h-full object-cover object-top"
                                                loading="lazy"
                                              />
                                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                              </div>
                                            </>
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                              <XCircle className="h-6 w-6 text-muted-foreground/50" />
                                            </div>
                                          )}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Mobile Screenshots */}
                              {(deviceFilter === 'all' || deviceFilter === 'mobile') && (
                                <div>
                                  <div className="flex items-center gap-2 mb-3">
                                    <Smartphone className="h-4 w-4" />
                                    <span className="font-medium">Mobile</span>
                                    <Badge variant="outline">{data.mobileCount}/{data.totalSteps}</Badge>
                                  </div>
                                  <div className="flex gap-3 overflow-x-auto pb-2">
                                    {data.screenshots.map(step => (
                                      <div key={`mobile-${step.stepNumber}`} className="flex-shrink-0">
                                        <div className="text-xs text-muted-foreground mb-1 text-center">
                                          Step {step.stepNumber}
                                        </div>
                                        <button
                                          onClick={() => step.mobileUrl && openLightbox(step.mobileUrl, flowId, step.stepNumber, 'Mobile')}
                                          disabled={!step.mobileUrl}
                                          className={`relative w-16 h-28 rounded-lg overflow-hidden border group transition-all ${
                                            step.mobileUrl 
                                              ? 'border-border hover:border-primary cursor-pointer' 
                                              : 'border-dashed border-muted-foreground/30 bg-muted'
                                          }`}
                                        >
                                          {step.mobileUrl ? (
                                            <>
                                              <img
                                                src={step.mobileUrl}
                                                alt={`Step ${step.stepNumber}`}
                                                className="w-full h-full object-cover object-top"
                                                loading="lazy"
                                              />
                                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                                <ZoomIn className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                              </div>
                                            </>
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                              <XCircle className="h-5 w-5 text-muted-foreground/50" />
                                            </div>
                                          )}
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxUrl && lightboxInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="text-white/60 absolute top-4 left-4 text-sm">
              {lightboxInfo.flowId} • Step {lightboxInfo.step} • {lightboxInfo.device}
            </div>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={lightboxUrl}
              alt={`${lightboxInfo.flowId} Step ${lightboxInfo.step}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

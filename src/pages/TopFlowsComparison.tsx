/**
 * FlowComparison - Enhanced Top Flows Vergleichsseite
 * 
 * Features:
 * - Refresh/Update von DB
 * - Screenshots-Slider integration  
 * - Mehr Details & Buttons
 * - Load More functionality
 * - Sync Status für alle Flows
 * - Expanded detail views
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  ExternalLink, 
  Star, 
  TrendingUp, 
  Smartphone, 
  Monitor,
  Grid3X3,
  List,
  ArrowUpDown,
  RefreshCw,
  Download,
  ChevronLeft,
  ChevronRight,
  Play,
  Copy,
  Eye,
  BarChart3,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Image as ImageIcon,
  Layers,
  ChevronDown,
  Sparkles,
  Settings2,
  FileJson,
  Share2,
  Maximize2
} from 'lucide-react';
import { getAllFlows, FLOW_CONFIGS, SUB_VARIANT_CONFIGS } from '@/data/flowConfigs';

// Types
interface FlowData {
  id: string;
  label: string;
  path: string;
  score: number;
  mobileScore: number | null;
  conversionScore: number | null;
  uxScore: number | null;
  issues: number;
  criticalIssues: number;
  badge: string;
  highlights: string[];
  status: 'synced' | 'missing' | 'outdated';
  lastAnalyzed: string | null;
  stepsCount: number;
  screenshots: {
    desktop: string[];
    mobile: string[];
  };
  runId?: string;
}

interface ScreenshotData {
  step_number: number;
  step_name: string | null;
  desktop_screenshot_url: string | null;
  mobile_screenshot_url: string | null;
}

// Static fallback data
const STATIC_TOP_FLOWS: Omit<FlowData, 'screenshots' | 'lastAnalyzed' | 'runId'>[] = [
  { 
    id: 'v1', 
    label: 'V1 Control Flow', 
    path: '/umzugsofferten-v1a',
    score: 96, 
    mobileScore: 72,
    conversionScore: 80,
    uxScore: 78,
    issues: 0,
    criticalIssues: 0,
    badge: 'Baseline',
    highlights: ['Minimal', '2 Steps', 'Schnell'],
    status: 'synced',
    stepsCount: 2,
  },
  { 
    id: 'v1f', 
    label: 'V1f Sticky CTA + Trust', 
    path: '/umzugsofferten-v1f',
    score: 95, 
    mobileScore: null,
    conversionScore: null,
    uxScore: null,
    issues: 0,
    criticalIssues: 0,
    badge: 'Neu ⭐',
    highlights: ['Micro-Feedback', 'Step Trust Pills', 'WhyThis'],
    status: 'synced',
    stepsCount: 2,
  },
  { 
    id: 'v1g', 
    label: 'V1g Input UX', 
    path: '/umzugsofferten-v1g',
    score: 94, 
    mobileScore: null,
    conversionScore: null,
    uxScore: null,
    issues: 0,
    criticalIssues: 0,
    badge: 'Neu ⭐',
    highlights: ['Inline Validation', 'Mobile InputMode', 'Completion Indicators'],
    status: 'synced',
    stepsCount: 2,
  },
  { 
    id: 'v2c', 
    label: 'V2c Trust Focused', 
    path: '/umzugsofferten-v2?variant=v2c',
    score: 79, 
    mobileScore: null,
    conversionScore: null,
    uxScore: null,
    issues: 22,
    criticalIssues: 2,
    badge: 'Trust',
    highlights: ['Trust-Elemente', '6 Steps', 'Detailliert'],
    status: 'synced',
    stepsCount: 3,
  },
  { 
    id: 'v2e', 
    label: 'V2e Chat Funnel', 
    path: '/umzugsofferten-v2e',
    score: 79, 
    mobileScore: 78,
    conversionScore: 82,
    uxScore: 79,
    issues: 35,
    criticalIssues: 3,
    badge: 'Chat ⭐',
    highlights: ['Conversational', 'Modern', 'Chat-UI'],
    status: 'synced',
    stepsCount: 10,
  },
  { 
    id: 'v9d', 
    label: 'V9d Main Gemini', 
    path: '/umzugsofferten-v9d',
    score: 76, 
    mobileScore: null,
    conversionScore: null,
    uxScore: null,
    issues: 41,
    criticalIssues: 6,
    badge: 'Gemini',
    highlights: ['AI-Optimiert', '9 Steps', 'Umfangreich'],
    status: 'synced',
    stepsCount: 9,
  },
  { 
    id: 'v9b', 
    label: 'V9b ChatGPT Pro Ext', 
    path: '/umzugsofferten-v9b',
    score: 73, 
    mobileScore: null,
    conversionScore: null,
    uxScore: null,
    issues: 39,
    criticalIssues: 10,
    badge: 'ChatGPT ⭐',
    highlights: ['ChatGPT-Optimiert', 'Extended', 'Social Proof'],
    status: 'synced',
    stepsCount: 5,
  },
  { 
    id: 'v9c', 
    label: 'V9c Zero Friction', 
    path: '/umzugsofferten-v9c',
    score: 72, 
    mobileScore: null,
    conversionScore: null,
    uxScore: null,
    issues: 39,
    criticalIssues: 13,
    badge: 'Zero Friction',
    highlights: ['Minimal Friction', 'Schnell', 'Optimiert'],
    status: 'synced',
    stepsCount: 6,
  },
  { 
    id: 'v3a', 
    label: 'V3a Mobile First', 
    path: '/umzugsofferten-v3a',
    score: 70, 
    mobileScore: null,
    conversionScore: null,
    uxScore: null,
    issues: 28,
    criticalIssues: 4,
    badge: 'Mobile',
    highlights: ['Mobile-First', 'Thumb Zone', 'Touch-Optimiert'],
    status: 'synced',
    stepsCount: 3,
  },
  { 
    id: 'v4b', 
    label: 'V4b Social Proof', 
    path: '/umzugsofferten-v4b',
    score: 68, 
    mobileScore: null,
    conversionScore: null,
    uxScore: null,
    issues: 32,
    criticalIssues: 5,
    badge: 'Social',
    highlights: ['Social Proof', 'Reviews', 'Trust'],
    status: 'synced',
    stepsCount: 3,
  },
];

type ViewMode = 'grid' | 'list';
type SortBy = 'score' | 'issues' | 'name' | 'recent';
type DeviceTab = 'all' | 'desktop' | 'mobile' | 'screenshots';

const FlowComparison = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('score');
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [activeTab, setActiveTab] = useState<DeviceTab>('all');
  const [visibleCount, setVisibleCount] = useState(10);
  const [expandedFlow, setExpandedFlow] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch analysis data from DB
  const { data: analysisData, isLoading: analysisLoading, refetch: refetchAnalysis } = useQuery({
    queryKey: ['flow-analysis-comparison'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flow_analysis_runs')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch screenshots data
  const { data: screenshotsData, isLoading: screenshotsLoading, refetch: refetchScreenshots } = useQuery({
    queryKey: ['flow-screenshots-comparison'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flow_step_metrics')
        .select('flow_id, step_number, step_name, desktop_screenshot_url, mobile_screenshot_url, run_id')
        .or('desktop_screenshot_url.neq.null,mobile_screenshot_url.neq.null')
        .order('step_number', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  // Calculate sync status
  const allConfiguredFlows = useMemo(() => {
    const mainFlows = Object.keys(FLOW_CONFIGS).length;
    const subVariants = Object.keys(SUB_VARIANT_CONFIGS).length;
    return mainFlows + subVariants;
  }, []);

  const analyzedFlowsCount = useMemo(() => {
    if (!analysisData) return 0;
    const uniqueFlows = new Set(analysisData.map(a => a.flow_id));
    return uniqueFlows.size;
  }, [analysisData]);

  // Build enhanced flow data
  const enhancedFlows = useMemo((): FlowData[] => {
    // Start with static data
    let flows: FlowData[] = STATIC_TOP_FLOWS.map(f => ({
      ...f,
      screenshots: { desktop: [], mobile: [] },
      lastAnalyzed: null,
      runId: undefined,
    }));

    // Merge with DB data if available
    if (analysisData && analysisData.length > 0) {
      const latestByFlow = new Map<string, typeof analysisData[0]>();
      
      for (const run of analysisData) {
        const existing = latestByFlow.get(run.flow_id);
        if (!existing || new Date(run.created_at) > new Date(existing.created_at)) {
          latestByFlow.set(run.flow_id, run);
        }
      }

      flows = flows.map(flow => {
        const dbData = latestByFlow.get(`umzugsofferten-${flow.id}`) 
                    || latestByFlow.get(flow.id);
        
        if (dbData) {
          return {
            ...flow,
            score: dbData.overall_score ?? flow.score,
            mobileScore: dbData.mobile_score ?? flow.mobileScore,
            conversionScore: dbData.conversion_score ?? flow.conversionScore,
            uxScore: dbData.ux_score ?? flow.uxScore,
            lastAnalyzed: dbData.created_at,
            runId: dbData.id,
            status: 'synced' as const,
          };
        }
        return flow;
      });
    }

    // Add screenshots if available
    if (screenshotsData && screenshotsData.length > 0) {
      const screenshotsByFlow = new Map<string, ScreenshotData[]>();
      
      for (const screenshot of screenshotsData) {
        const flowId = screenshot.flow_id;
        if (!screenshotsByFlow.has(flowId)) {
          screenshotsByFlow.set(flowId, []);
        }
        screenshotsByFlow.get(flowId)!.push(screenshot);
      }

      flows = flows.map(flow => {
        const screenshots = screenshotsByFlow.get(`umzugsofferten-${flow.id}`) 
                         || screenshotsByFlow.get(flow.id)
                         || [];
        
        return {
          ...flow,
          screenshots: {
            desktop: screenshots
              .filter(s => s.desktop_screenshot_url)
              .map(s => s.desktop_screenshot_url!)
              .slice(0, 10),
            mobile: screenshots
              .filter(s => s.mobile_screenshot_url)
              .map(s => s.mobile_screenshot_url!)
              .slice(0, 10),
          },
        };
      });
    }

    return flows;
  }, [analysisData, screenshotsData]);

  // Sorted and filtered flows
  const sortedFlows = useMemo(() => {
    let flows = [...enhancedFlows];
    
    if (showOnlyNew) {
      flows = flows.filter(f => f.badge.includes('⭐') || f.badge === 'Neu ⭐');
    }

    switch (sortBy) {
      case 'score':
        return flows.sort((a, b) => b.score - a.score);
      case 'issues':
        return flows.sort((a, b) => a.criticalIssues - b.criticalIssues);
      case 'name':
        return flows.sort((a, b) => a.label.localeCompare(b.label));
      case 'recent':
        return flows.sort((a, b) => {
          if (!a.lastAnalyzed && !b.lastAnalyzed) return 0;
          if (!a.lastAnalyzed) return 1;
          if (!b.lastAnalyzed) return -1;
          return new Date(b.lastAnalyzed).getTime() - new Date(a.lastAnalyzed).getTime();
        });
      default:
        return flows;
    }
  }, [enhancedFlows, sortBy, showOnlyNew]);

  const visibleFlows = sortedFlows.slice(0, visibleCount);
  const hasMore = visibleCount < sortedFlows.length;

  // Handlers
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchAnalysis(),
        refetchScreenshots(),
      ]);
      toast.success('Daten aktualisiert');
    } catch (error) {
      toast.error('Fehler beim Aktualisieren');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + 10, sortedFlows.length));
  };

  const handleCopyUrl = (path: string) => {
    const fullUrl = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('URL kopiert');
  };

  const handleOpenInNewTab = (path: string) => {
    window.open(path, '_blank');
  };

  const handleRunAnalysis = (flowId: string) => {
    navigate(`/admin/tools?tab=flow-automation&analyze=${flowId}`);
  };

  const handleExportData = () => {
    const exportData = sortedFlows.map(f => ({
      id: f.id,
      label: f.label,
      score: f.score,
      mobileScore: f.mobileScore,
      conversionScore: f.conversionScore,
      uxScore: f.uxScore,
      issues: f.issues,
      criticalIssues: f.criticalIssues,
      lastAnalyzed: f.lastAnalyzed,
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flow-comparison-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Exportiert');
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-orange-600 bg-orange-50 border-orange-200';
  };

  const getBadgeVariant = (badge: string) => {
    if (badge.includes('⭐')) return 'default';
    if (badge === 'Baseline') return 'secondary';
    if (badge === 'Trust' || badge === 'Social') return 'outline';
    return 'secondary';
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Flow Vergleich | Top Flows | Umzugscheck.ch</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
              Flow Vergleich
            </h1>
            <p className="text-muted-foreground text-sm">
              {analyzedFlowsCount}/{allConfiguredFlows} Flows analysiert • 
              Top {sortedFlows.length} nach Score
            </p>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-1.5"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Aktualisieren
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="gap-1.5"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Link to="/admin/tools?tab=flow-automation">
              <Button size="sm" className="gap-1.5">
                <Zap className="h-4 w-4" />
                Alle analysieren
              </Button>
            </Link>
          </div>
        </div>

        {/* Sync Status Banner */}
        <Card className="mb-6 bg-muted/50">
          <CardContent className="py-3">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span><strong>{allConfiguredFlows}</strong> konfiguriert</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span><strong>{analyzedFlowsCount}</strong> analysiert</span>
                </div>
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                  <span><strong>{screenshotsData?.length || 0}</strong> Screenshots</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                Sync prüfen
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* View Mode */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="gap-1"
            >
              <Grid3X3 className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="gap-1"
            >
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Liste</span>
            </Button>
          </div>

          {/* Sort Options */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={sortBy === 'score' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('score')}
              className="gap-1"
            >
              <TrendingUp className="h-4 w-4" />
              Score
            </Button>
            <Button
              variant={sortBy === 'issues' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('issues')}
              className="gap-1"
            >
              <ArrowUpDown className="h-4 w-4" />
              Issues
            </Button>
            <Button
              variant={sortBy === 'recent' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSortBy('recent')}
              className="gap-1"
            >
              <Clock className="h-4 w-4" />
              Neueste
            </Button>
          </div>

          <Button
            variant={showOnlyNew ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowOnlyNew(!showOnlyNew)}
            className="gap-1"
          >
            <Star className="h-4 w-4" />
            Nur Neue
          </Button>
        </div>

        {/* Tabs with Screenshots Integration */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DeviceTab)} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="all" className="gap-1">
              <Layers className="h-4 w-4" />
              Alle
            </TabsTrigger>
            <TabsTrigger value="desktop" className="gap-1">
              <Monitor className="h-4 w-4" />
              Desktop
            </TabsTrigger>
            <TabsTrigger value="mobile" className="gap-1">
              <Smartphone className="h-4 w-4" />
              Mobile
            </TabsTrigger>
            <TabsTrigger value="screenshots" className="gap-1">
              <ImageIcon className="h-4 w-4" />
              Screenshots
            </TabsTrigger>
          </TabsList>

          {/* All View */}
          <TabsContent value="all" className="mt-4">
            {analysisLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-3" />
                    <Skeleton className="h-8 w-16 mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </Card>
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {visibleFlows.map((flow, index) => (
                  <FlowCard 
                    key={flow.id} 
                    flow={flow} 
                    rank={index + 1}
                    expanded={expandedFlow === flow.id}
                    onToggleExpand={() => setExpandedFlow(expandedFlow === flow.id ? null : flow.id)}
                    onCopyUrl={() => handleCopyUrl(flow.path)}
                    onOpenNew={() => handleOpenInNewTab(flow.path)}
                    onRunAnalysis={() => handleRunAnalysis(flow.id)}
                    getScoreColor={getScoreColor}
                    getBadgeVariant={getBadgeVariant}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {visibleFlows.map((flow, index) => (
                  <FlowListItem 
                    key={flow.id} 
                    flow={flow} 
                    rank={index + 1}
                    onCopyUrl={() => handleCopyUrl(flow.path)}
                    onOpenNew={() => handleOpenInNewTab(flow.path)}
                    onRunAnalysis={() => handleRunAnalysis(flow.id)}
                    getScoreColor={getScoreColor}
                  />
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-6">
                <Button variant="outline" onClick={handleLoadMore} className="gap-2">
                  <ChevronDown className="h-4 w-4" />
                  Mehr laden ({sortedFlows.length - visibleCount} weitere)
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Desktop Screenshots View */}
          <TabsContent value="desktop" className="mt-4">
            <ScreenshotGallery 
              flows={visibleFlows}
              device="desktop"
              onOpenFlow={(path) => handleOpenInNewTab(path)}
            />
          </TabsContent>

          {/* Mobile Screenshots View */}
          <TabsContent value="mobile" className="mt-4">
            <ScreenshotGallery 
              flows={visibleFlows}
              device="mobile"
              onOpenFlow={(path) => handleOpenInNewTab(path)}
            />
          </TabsContent>

          {/* Full Screenshots Slider View */}
          <TabsContent value="screenshots" className="mt-4">
            <ScreenshotSlider 
              flows={visibleFlows}
              onOpenFlow={(path) => handleOpenInNewTab(path)}
            />
          </TabsContent>
        </Tabs>

        {/* Quick Links */}
        <Card className="mt-8">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Schnellzugriff</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setVisibleCount(sortedFlows.length)}>
                  Alle anzeigen
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sortedFlows.map(flow => (
                <Link key={flow.id} to={flow.path}>
                  <Button variant="outline" size="sm" className="gap-1.5 h-auto py-1.5">
                    <span className={`w-2 h-2 rounded-full ${flow.score >= 80 ? 'bg-green-500' : flow.score >= 70 ? 'bg-yellow-500' : 'bg-orange-500'}`} />
                    {flow.label}
                    <span className="text-muted-foreground text-xs">({flow.score})</span>
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Actions */}
        <Card className="mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Admin-Aktionen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/tools?tab=flow-automation">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <BarChart3 className="h-4 w-4" />
                  Flow Dashboard
                </Button>
              </Link>
              <Link to="/admin/tools?tab=screenshots">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ImageIcon className="h-4 w-4" />
                  Screenshot Generator
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExportData}>
                <FileJson className="h-4 w-4" />
                JSON Export
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
                Sync All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// ========== FlowCard Component ==========
interface FlowCardProps {
  flow: FlowData;
  rank: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onCopyUrl: () => void;
  onOpenNew: () => void;
  onRunAnalysis: () => void;
  getScoreColor: (score: number) => string;
  getBadgeVariant: (badge: string) => 'default' | 'secondary' | 'outline' | 'destructive';
}

const FlowCard = ({ 
  flow, 
  rank, 
  expanded, 
  onToggleExpand,
  onCopyUrl,
  onOpenNew,
  onRunAnalysis,
  getScoreColor,
  getBadgeVariant,
}: FlowCardProps) => {
  const [currentScreenshot, setCurrentScreenshot] = useState(0);
  const screenshots = flow.screenshots.desktop;
  const hasScreenshots = screenshots.length > 0;

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-all">
      {/* Rank Badge */}
      <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
        {rank}
      </div>

      {/* Screenshot Preview Area */}
      {hasScreenshots ? (
        <div className="relative aspect-video bg-muted overflow-hidden group">
          <img 
            src={screenshots[currentScreenshot]} 
            alt={`${flow.label} Step ${currentScreenshot + 1}`}
            className="w-full h-full object-cover object-top"
          />
          
          {/* Screenshot Navigation */}
          {screenshots.length > 1 && (
            <>
              <button
                onClick={() => setCurrentScreenshot(p => (p - 1 + screenshots.length) % screenshots.length)}
                className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentScreenshot(p => (p + 1) % screenshots.length)}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              
              {/* Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {screenshots.map((_, i) => (
                  <div 
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === currentScreenshot ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Fullscreen Button */}
          <button
            onClick={onOpenNew}
            className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div className="aspect-video bg-muted flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <ImageIcon className="h-8 w-8 mx-auto mb-1 opacity-50" />
            <span className="text-xs">Keine Screenshots</span>
          </div>
        </div>
      )}

      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm truncate">{flow.label}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getBadgeVariant(flow.badge)} className="text-xs">
                {flow.badge}
              </Badge>
              <span className="text-xs text-muted-foreground">{flow.stepsCount} Steps</span>
            </div>
          </div>
          <div className={`text-2xl font-bold px-2 py-1 rounded border ${getScoreColor(flow.score)}`}>
            {flow.score}
          </div>
        </div>

        {/* Sub-Scores */}
        {(flow.mobileScore || flow.conversionScore || flow.uxScore) && (
          <div className="flex gap-3 text-xs text-muted-foreground mb-3">
            {flow.mobileScore && <span>📱 {flow.mobileScore}</span>}
            {flow.conversionScore && <span>📈 {flow.conversionScore}</span>}
            {flow.uxScore && <span>🎨 {flow.uxScore}</span>}
          </div>
        )}

        {/* Highlights */}
        <div className="flex flex-wrap gap-1 mb-3">
          {flow.highlights.slice(0, 3).map(h => (
            <span key={h} className="text-xs bg-muted px-2 py-0.5 rounded">
              {h}
            </span>
          ))}
        </div>

        {/* Issues */}
        <div className="text-xs text-muted-foreground mb-3">
          {flow.criticalIssues > 0 ? (
            <span className="text-destructive">{flow.criticalIssues} kritisch</span>
          ) : (
            <span className="text-green-600">✓ Keine kritischen Issues</span>
          )}
          {flow.issues > 0 && ` • ${flow.issues} total`}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={flow.path} className="flex-1">
            <Button size="sm" className="w-full gap-1">
              Öffnen
              <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
          <Button size="sm" variant="outline" onClick={onCopyUrl}>
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" onClick={onToggleExpand}>
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted/50 rounded p-2">
                <div className="text-muted-foreground">Mobile</div>
                <div className="font-semibold">{flow.mobileScore ?? '-'}/100</div>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <div className="text-muted-foreground">Conversion</div>
                <div className="font-semibold">{flow.conversionScore ?? '-'}/100</div>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <div className="text-muted-foreground">UX</div>
                <div className="font-semibold">{flow.uxScore ?? '-'}/100</div>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <div className="text-muted-foreground">Screenshots</div>
                <div className="font-semibold">{flow.screenshots.desktop.length + flow.screenshots.mobile.length}</div>
              </div>
            </div>
            
            {flow.lastAnalyzed && (
              <div className="text-xs text-muted-foreground">
                Analysiert: {new Date(flow.lastAnalyzed).toLocaleDateString('de-CH')}
              </div>
            )}
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={onRunAnalysis}>
                <Play className="h-3 w-3" />
                Analyse
              </Button>
              <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={onOpenNew}>
                <Eye className="h-3 w-3" />
                Preview
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ========== FlowListItem Component ==========
interface FlowListItemProps {
  flow: FlowData;
  rank: number;
  onCopyUrl: () => void;
  onOpenNew: () => void;
  onRunAnalysis: () => void;
  getScoreColor: (score: number) => string;
}

const FlowListItem = ({ 
  flow, 
  rank, 
  onCopyUrl,
  onOpenNew,
  onRunAnalysis,
  getScoreColor,
}: FlowListItemProps) => {
  return (
    <Card className="p-3">
      <div className="flex items-center gap-3">
        {/* Rank */}
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center flex-shrink-0">
          {rank}
        </div>
        
        {/* Screenshot Thumbnail */}
        <div className="w-16 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
          {flow.screenshots.desktop[0] ? (
            <img 
              src={flow.screenshots.desktop[0]} 
              alt={flow.label}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <ImageIcon className="h-4 w-4" />
            </div>
          )}
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-foreground text-sm truncate">{flow.label}</h3>
            <Badge variant="secondary" className="text-xs">{flow.badge}</Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
            <span>{flow.highlights.slice(0, 2).join(' • ')}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>{flow.stepsCount} Steps</span>
            {flow.criticalIssues > 0 && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-destructive">{flow.criticalIssues} kritisch</span>
              </>
            )}
          </div>
        </div>

        {/* Scores */}
        <div className="hidden sm:flex items-center gap-4 text-xs text-muted-foreground">
          {flow.mobileScore && <span title="Mobile">📱 {flow.mobileScore}</span>}
          {flow.conversionScore && <span title="Conversion">📈 {flow.conversionScore}</span>}
          {flow.uxScore && <span title="UX">🎨 {flow.uxScore}</span>}
        </div>

        {/* Main Score */}
        <div className={`text-xl font-bold px-2 py-1 rounded ${getScoreColor(flow.score).split(' ')[0]}`}>
          {flow.score}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button size="sm" variant="ghost" onClick={onCopyUrl} title="URL kopieren">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="ghost" onClick={onRunAnalysis} title="Analysieren">
            <Play className="h-3.5 w-3.5" />
          </Button>
          <Link to={flow.path}>
            <Button size="sm" variant="outline" className="gap-1">
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

// ========== ScreenshotGallery Component ==========
interface ScreenshotGalleryProps {
  flows: FlowData[];
  device: 'desktop' | 'mobile';
  onOpenFlow: (path: string) => void;
}

const ScreenshotGallery = ({ flows, device, onOpenFlow }: ScreenshotGalleryProps) => {
  const flowsWithScreenshots = flows.filter(f => 
    device === 'desktop' ? f.screenshots.desktop.length > 0 : f.screenshots.mobile.length > 0
  );

  if (flowsWithScreenshots.length === 0) {
    return (
      <Card className="p-8 text-center">
        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
        <h3 className="font-medium mb-1">Keine {device === 'desktop' ? 'Desktop' : 'Mobile'} Screenshots</h3>
        <p className="text-sm text-muted-foreground">
          Führen Sie eine Analyse durch, um Screenshots zu generieren.
        </p>
        <Link to="/admin/tools?tab=screenshots" className="mt-4 inline-block">
          <Button size="sm" className="gap-1.5">
            <ImageIcon className="h-4 w-4" />
            Screenshot Generator
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className={`grid ${device === 'desktop' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'} gap-4`}>
      {flowsWithScreenshots.map((flow, index) => {
        const screenshots = device === 'desktop' ? flow.screenshots.desktop : flow.screenshots.mobile;
        return (
          <Card key={flow.id} className="overflow-hidden group">
            <div className="relative">
              {/* Rank */}
              <div className="absolute top-2 left-2 z-10 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {index + 1}
              </div>
              
              {/* Screenshot with horizontal scroll */}
              <ScrollArea className={`${device === 'desktop' ? 'aspect-video' : 'aspect-[9/16]'}`}>
                <div className="flex gap-2 p-2">
                  {screenshots.map((url, i) => (
                    <img 
                      key={i}
                      src={url}
                      alt={`${flow.label} Step ${i + 1}`}
                      className={`${device === 'desktop' ? 'h-48' : 'h-64'} w-auto rounded border object-cover object-top flex-shrink-0`}
                    />
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              
              {/* Score overlay */}
              <div className="absolute top-2 right-2 bg-background/90 px-2 py-0.5 rounded text-sm font-bold">
                {flow.score}
              </div>
            </div>
            
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h3 className="font-medium text-sm truncate">{flow.label}</h3>
                  <p className="text-xs text-muted-foreground">{screenshots.length} Screenshots</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => onOpenFlow(flow.path)}>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

// ========== ScreenshotSlider Component ==========
interface ScreenshotSliderProps {
  flows: FlowData[];
  onOpenFlow: (path: string) => void;
}

const ScreenshotSlider = ({ flows, onOpenFlow }: ScreenshotSliderProps) => {
  const [selectedFlow, setSelectedFlow] = useState(flows[0]?.id || '');
  const [viewDevice, setViewDevice] = useState<'desktop' | 'mobile' | 'both'>('both');
  
  const currentFlow = flows.find(f => f.id === selectedFlow) || flows[0];
  
  if (!currentFlow) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Flow Selector */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-medium">Flow:</span>
        <ScrollArea className="max-w-full">
          <div className="flex gap-2 pb-2">
            {flows.map((flow, index) => (
              <Button
                key={flow.id}
                variant={selectedFlow === flow.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFlow(flow.id)}
                className="flex-shrink-0 gap-1.5"
              >
                <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                {flow.label}
                <span className="text-muted-foreground text-xs">({flow.score})</span>
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Device Toggle */}
      <div className="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        <Button
          variant={viewDevice === 'both' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewDevice('both')}
        >
          Beide
        </Button>
        <Button
          variant={viewDevice === 'desktop' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewDevice('desktop')}
          className="gap-1"
        >
          <Monitor className="h-4 w-4" />
          Desktop
        </Button>
        <Button
          variant={viewDevice === 'mobile' ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setViewDevice('mobile')}
          className="gap-1"
        >
          <Smartphone className="h-4 w-4" />
          Mobile
        </Button>
      </div>

      {/* Screenshots Display */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">{currentFlow.label}</h3>
            <p className="text-sm text-muted-foreground">
              Score: {currentFlow.score} • {currentFlow.stepsCount} Steps • 
              {currentFlow.screenshots.desktop.length + currentFlow.screenshots.mobile.length} Screenshots
            </p>
          </div>
          <Button size="sm" onClick={() => onOpenFlow(currentFlow.path)} className="gap-1.5">
            <ExternalLink className="h-4 w-4" />
            Öffnen
          </Button>
        </div>

        {viewDevice === 'both' ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Desktop Screenshots */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Desktop ({currentFlow.screenshots.desktop.length})
              </h4>
              <ScrollArea className="border rounded-lg">
                <div className="flex gap-3 p-3">
                  {currentFlow.screenshots.desktop.length > 0 ? (
                    currentFlow.screenshots.desktop.map((url, i) => (
                      <img 
                        key={i}
                        src={url}
                        alt={`Step ${i + 1}`}
                        className="h-48 w-auto rounded border object-cover object-top flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                        onClick={() => window.open(url, '_blank')}
                      />
                    ))
                  ) : (
                    <div className="h-48 w-full flex items-center justify-center text-muted-foreground">
                      <span className="text-sm">Keine Desktop Screenshots</span>
                    </div>
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            {/* Mobile Screenshots */}
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Mobile ({currentFlow.screenshots.mobile.length})
              </h4>
              <ScrollArea className="border rounded-lg">
                <div className="flex gap-3 p-3">
                  {currentFlow.screenshots.mobile.length > 0 ? (
                    currentFlow.screenshots.mobile.map((url, i) => (
                      <img 
                        key={i}
                        src={url}
                        alt={`Step ${i + 1}`}
                        className="h-64 w-auto rounded border object-cover object-top flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                        onClick={() => window.open(url, '_blank')}
                      />
                    ))
                  ) : (
                    <div className="h-64 w-full flex items-center justify-center text-muted-foreground">
                      <span className="text-sm">Keine Mobile Screenshots</span>
                    </div>
                  )}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        ) : (
          <ScrollArea className="border rounded-lg">
            <div className="flex gap-3 p-3">
              {(viewDevice === 'desktop' ? currentFlow.screenshots.desktop : currentFlow.screenshots.mobile).map((url, i) => (
                <img 
                  key={i}
                  src={url}
                  alt={`Step ${i + 1}`}
                  className={`${viewDevice === 'desktop' ? 'h-64' : 'h-96'} w-auto rounded border object-cover object-top flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all`}
                  onClick={() => window.open(url, '_blank')}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </Card>
    </div>
  );
};

export default FlowComparison;

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/data/constants";
import { Link } from "react-router-dom";
import {
  Camera,
  CheckCircle2,
  Loader2,
  Play,
  RefreshCw,
  Monitor,
  Smartphone,
  AlertTriangle,
  ExternalLink,
  CloudUpload,
  X
} from "lucide-react";
import { useBulkScreenshotJob } from "@/hooks/useBulkScreenshotJob";

interface FlowConfig {
  flowId: string;
  flowName: string;
  stepCount: number;
  flowPath: string;
  hasScreenshots: boolean;
}

// Complete flow registry - matches edge function FLOW_CONFIGS (80+ flows)
const FLOW_CONFIGS: Record<string, { name: string; steps: number; baseUrl: string }> = {
  // === V1 - Control Flow (8 variants) ===
  'v1': { name: 'V1 Control (Baseline)', steps: 2, baseUrl: '/umzugsofferten-v1' },
  'v1a': { name: 'V1a Control (Feedback)', steps: 2, baseUrl: '/umzugsofferten-v1a' },
  'v1b': { name: 'V1b ChatGPT Agent', steps: 4, baseUrl: '/umzugsofferten-v1b' },
  'v1c': { name: 'V1c Archetyp Strategic', steps: 4, baseUrl: '/umzugsofferten-v1c' },
  'v1d': { name: 'V1d Optimized Funnel', steps: 4, baseUrl: '/umzugsofferten-v1d' },
  'v1e': { name: 'V1e Trust Enhanced', steps: 4, baseUrl: '/umzugsofferten-v1e' },
  'v1f': { name: 'V1f Sticky CTA + Trust ⭐', steps: 2, baseUrl: '/umzugsofferten-v1f' },
  'v1g': { name: 'V1g Input UX + Validation', steps: 2, baseUrl: '/umzugsofferten-v1g' },
  
  // === V2 - Premium Full-Journey (7 variants) ===
  'v2': { name: 'V2 Premium (Baseline)', steps: 4, baseUrl: '/umzugsofferten-v2' },
  'v2a': { name: 'V2a Progress Enhanced', steps: 4, baseUrl: '/umzugsofferten-v2a' },
  'v2b': { name: 'V2b Simplified Labels', steps: 6, baseUrl: '/umzugsofferten-v2b' },
  'v2c': { name: 'V2c Archetyp Calculator', steps: 6, baseUrl: '/umzugsofferten-v2c' },
  'v2d': { name: 'V2d Speed Optimized', steps: 6, baseUrl: '/umzugsofferten-v2d' },
  'v2e': { name: 'V2e Chat Funnel', steps: 6, baseUrl: '/umzugsofferten-v2e' },
  'v2f': { name: 'V2f Premium Upsell ⭐', steps: 3, baseUrl: '/umzugsofferten-v2f' },
  
  // === V3 - God Mode Mobile-First (6 variants) ===
  'v3': { name: 'V3 God Mode (Baseline)', steps: 4, baseUrl: '/umzugsofferten-v3' },
  'v3a': { name: 'V3a Mobile First', steps: 4, baseUrl: '/umzugsofferten-v3a' },
  'v3b': { name: 'V3b Swipe Navigation', steps: 4, baseUrl: '/umzugsofferten-v3b' },
  'v3c': { name: 'V3c Bottom Sheet', steps: 4, baseUrl: '/umzugsofferten-v3c' },
  'v3d': { name: 'V3d Thumb Zone', steps: 3, baseUrl: '/umzugsofferten-v3d' },
  'v3e': { name: 'V3e Fullscreen', steps: 3, baseUrl: '/umzugsofferten-v3e' },
  
  // === V4 - Video-First Conversion (7 variants) ===
  'v4': { name: 'V4 Video-First (Baseline)', steps: 4, baseUrl: '/umzugsofferten-v4' },
  'v4a': { name: 'V4a Urgency Based', steps: 4, baseUrl: '/umzugsofferten-v4a' },
  'v4b': { name: 'V4b Social Proof', steps: 3, baseUrl: '/umzugsofferten-v4b' },
  'v4c': { name: 'V4c Value First ⭐', steps: 3, baseUrl: '/umzugsofferten-v4c' },
  'v4d': { name: 'V4d Gamified', steps: 4, baseUrl: '/umzugsofferten-v4d' },
  'v4e': { name: 'V4e Minimal Friction', steps: 2, baseUrl: '/umzugsofferten-v4e' },
  'v4f': { name: 'V4f Video-First Feedback', steps: 3, baseUrl: '/umzugsofferten-v4f' },
  
  // === V5 - Marketplace Accessibility (7 variants) ===
  'v5': { name: 'V5 Marketplace (Baseline)', steps: 4, baseUrl: '/umzugsofferten-v5' },
  'v5a': { name: 'V5a High Contrast', steps: 4, baseUrl: '/umzugsofferten-v5a' },
  'v5b': { name: 'V5b Screen Reader', steps: 3, baseUrl: '/umzugsofferten-v5b' },
  'v5c': { name: 'V5c Keyboard Nav', steps: 3, baseUrl: '/umzugsofferten-v5c' },
  'v5d': { name: 'V5d ChatGPT Feedback', steps: 5, baseUrl: '/umzugsofferten-v5d' },
  'v5e': { name: 'V5e Reduced Motion', steps: 3, baseUrl: '/umzugsofferten-v5e' },
  'v5f': { name: 'V5f Marketplace Feedback', steps: 3, baseUrl: '/umzugsofferten-v5f' },
  
  // === V6 - Ultimate 6-Tier (7 variants) ===
  'v6': { name: 'V6 Ultimate (Baseline)', steps: 6, baseUrl: '/umzugsofferten-v6' },
  'v6a': { name: 'V6a Package Choice ⭐', steps: 3, baseUrl: '/umzugsofferten-v6a' },
  'v6b': { name: 'V6b ChatGPT Feedback', steps: 5, baseUrl: '/umzugsofferten-v6b' },
  'v6c': { name: 'V6c Gemini God Mode', steps: 6, baseUrl: '/umzugsofferten-v6c' },
  'v6d': { name: 'V6d Deep Research', steps: 5, baseUrl: '/umzugsofferten-v6d' },
  'v6e': { name: 'V6e Thinking Mode', steps: 5, baseUrl: '/umzugsofferten-v6e' },
  'v6f': { name: 'V6f Ultimate (Best of All)', steps: 5, baseUrl: '/umzugsofferten-v6f' },
  
  // === V7 - SwissMove 90s (2 variants) ===
  'v7': { name: 'V7 SwissMove (Baseline)', steps: 3, baseUrl: '/umzugsofferten-v7' },
  'v7a': { name: 'V7a SwissMove Feedback', steps: 3, baseUrl: '/umzugsofferten-v7a' },
  
  // === V8 - Decision-Free (2 variants) ===
  'v8': { name: 'V8 Decision-Free (Baseline)', steps: 2, baseUrl: '/umzugsofferten-v8' },
  'v8a': { name: 'V8a Decision-Free ⭐', steps: 2, baseUrl: '/umzugsofferten-v8a' },
  
  // === V9 - Zero Friction Extended (5 variants) ===
  'v9': { name: 'V9 Zero Friction (Baseline)', steps: 6, baseUrl: '/umzugsofferten-v9' },
  'v9a': { name: 'V9a Gemini Archetyp', steps: 6, baseUrl: '/umzugsofferten-v9a' },
  'v9b': { name: 'V9b Gemini Agent', steps: 5, baseUrl: '/umzugsofferten-v9b' },
  'v9c': { name: 'V9c Zero Friction Optimized', steps: 5, baseUrl: '/umzugsofferten-v9c' },
  'v9d': { name: 'V9d Gemini Extended', steps: 6, baseUrl: '/umzugsofferten-v9d' },
  
  // === V10 - Golden Flow ===
  'v10': { name: 'V10 Golden Flow', steps: 4, baseUrl: '/umzugsofferten-v10' },
  
  // === Multi Variants ===
  'multi-a': { name: 'Multi.A ChatGPT Pro ⭐', steps: 3, baseUrl: '/umzugsofferten-multi-a' },
  
  // === Ultimate Variants ===
  'ultimate-best36': { name: 'Ultimate Best36 ⭐⭐', steps: 5, baseUrl: '/umzugsofferten-ultimate-best36' },
  'ultimate-v7': { name: 'Ultimate V7 (95/100) ⭐', steps: 5, baseUrl: '/umzugsofferten-ultimate-v7' },
  'ultimate-all': { name: 'Ultimate All', steps: 5, baseUrl: '/umzugsofferten-ultimate-all' },
  'ultimate-v1': { name: 'Ultimate V1', steps: 5, baseUrl: '/umzugsofferten-ultimate-v1' },
  'ultimate-v2': { name: 'Ultimate V2', steps: 5, baseUrl: '/umzugsofferten-ultimate-v2' },
  'ultimate-v5': { name: 'Ultimate V5', steps: 5, baseUrl: '/umzugsofferten-ultimate-v5' },
  'ultimate-ch': { name: 'Ultimate Swiss CH ⭐', steps: 5, baseUrl: '/umzugsofferten-ultimate-ch' },
  'v2-archetyp': { name: 'V2 Archetyp ⭐', steps: 6, baseUrl: '/umzugsofferten-v2-archetyp' },
  'vultimate': { name: 'Ultimate Flow (All) ⭐', steps: 6, baseUrl: '/umzugsofferten?v=vultimate' },
  'vultimate-v1': { name: 'Ultimate Flow V1 - Swiss Archetype Edition ⭐', steps: 6, baseUrl: '/umzugsofferten?v=vultimate-v1' },
  'vultimate-v2': { name: 'Ultimate Flow V2 ⭐', steps: 6, baseUrl: '/umzugsofferten?v=vultimate-v2' },
  
  // === ChatGPT Optimized Flows ===
  'chatgpt-flow-1': { name: 'ChatGPT Flow 1 - Zero Friction Pro ⭐', steps: 2, baseUrl: '/chatgpt-flow-1' },
  'chatgpt-flow-2': { name: 'ChatGPT Flow 2 - Social Proof ⭐', steps: 3, baseUrl: '/chatgpt-flow-2' },
  'chatgpt-flow-3': { name: 'ChatGPT Flow 3 - Guided Chat ⭐', steps: 3, baseUrl: '/chatgpt-flow-3' },
  
  // === Swiss Premium Flows ===
  'v9-zero-friction': { name: 'V9 Zero Friction Flow ⭐⭐', steps: 5, baseUrl: '/flow/v9-zero-friction' },
  'golden-flow-v10': { name: 'Golden Flow V10 ⭐⭐', steps: 4, baseUrl: '/flow/golden-flow-v10' },
  'swiss-lightning': { name: 'Swiss Lightning (90s) ⭐', steps: 3, baseUrl: '/flow/swiss-lightning' },
  'swiss-premium-choice': { name: 'Swiss Premium Choice ⭐', steps: 4, baseUrl: '/flow/swiss-premium-choice' },
  'swiss-concierge-hybrid': { name: 'Swiss Concierge Hybrid ⭐', steps: 5, baseUrl: '/flow/swiss-concierge-hybrid' },
  
  // === Gemini Flows ===
  'gemini-pro': { name: 'Gemini Pro', steps: 4, baseUrl: '/umzugsofferten-gemini-pro' },
  'gemini-pro-ext': { name: 'Gemini Pro Ext', steps: 4, baseUrl: '/umzugsofferten-gemini-pro-ext' },
  
  // === ChatGPT Research ===
  'chatgpt-research': { name: 'ChatGPT Research', steps: 4, baseUrl: '/umzugsofferten-chatgpt-research' },
  'chatgpt-agent': { name: 'ChatGPT Agent', steps: 4, baseUrl: '/umzugsofferten-chatgpt-agent' },
};

// Default flow paths based on flowId patterns
const getFlowPath = (flowId: string): string => {
  // Check if we have a config for this flow
  if (FLOW_CONFIGS[flowId]) {
    return FLOW_CONFIGS[flowId].baseUrl;
  }
  
  if (flowId === 'umzugsofferten-v1' || flowId === 'v1') return '/umzugsofferten-v1';
  if (flowId.startsWith('v') && flowId.length <= 4) {
    return `/umzugsofferten-${flowId}`;
  }
  if (flowId.startsWith('chatgpt-flow-')) {
    return `/${flowId}`;
  }
  const match = flowId.match(/umzugsofferten-v(\d+[a-z]?)/);
  if (match) {
    return `/umzugsofferten-v${match[1]}`;
  }
  return `/umzugsofferten?v=${flowId}`;
};

export function BulkScreenshotCapture() {
  const [flows, setFlows] = useState<FlowConfig[]>([]);
  const [selectedFlows, setSelectedFlows] = useState<Set<string>>(new Set());
  const [captureDesktop, setCaptureDesktop] = useState(true);
  const [captureMobile, setCaptureMobile] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const { activeJob, isPolling, startJob, clearJob, checkPendingJobs } = useBulkScreenshotJob();

  // Load flows and check for pending jobs on mount
  useEffect(() => {
    loadFlows();
    checkPendingJobs();
  }, []);

  const loadFlows = async () => {
    setIsLoading(true);
    try {
      // Use FLOW_CONFIGS as the authoritative source (80+ flows)
      // This ensures we always show ALL flows, not just those with previous runs
      
      // Get existing screenshots from flow_step_metrics
      const { data: metricsData } = await supabase
        .from('flow_step_metrics')
        .select('flow_id')
        .or('mobile_screenshot_url.not.is.null,desktop_screenshot_url.not.is.null');

      const flowsWithScreenshots = new Set((metricsData || []).map(m => m.flow_id));
      
      // Also get flows from analysis runs that might not be in FLOW_CONFIGS
      const { data: analysisFlows } = await supabase
        .from('flow_analysis_runs')
        .select('flow_id, flow_name')
        .order('created_at', { ascending: false });
      
      // Build flow list from FLOW_CONFIGS first
      const flowConfigs: FlowConfig[] = Object.entries(FLOW_CONFIGS).map(([flowId, config]) => ({
        flowId,
        flowName: config.name,
        stepCount: config.steps,
        flowPath: config.baseUrl,
        hasScreenshots: flowsWithScreenshots.has(flowId) || 
                       flowsWithScreenshots.has(`umzugsofferten-${flowId}`)
      }));
      
      // Add any flows from analysis_runs that aren't in FLOW_CONFIGS
      const existingIds = new Set(Object.keys(FLOW_CONFIGS));
      for (const f of analysisFlows || []) {
        const normalizedId = f.flow_id.startsWith('umzugsofferten-') 
          ? f.flow_id.replace('umzugsofferten-', '') 
          : f.flow_id;
        
        if (!existingIds.has(normalizedId) && !existingIds.has(f.flow_id)) {
          flowConfigs.push({
            flowId: f.flow_id,
            flowName: f.flow_name || f.flow_id,
            stepCount: 4, // default
            flowPath: getFlowPath(f.flow_id),
            hasScreenshots: flowsWithScreenshots.has(f.flow_id)
          });
          existingIds.add(f.flow_id);
        }
      }

      // Sort: flows without screenshots first, then alphabetically
      flowConfigs.sort((a, b) => {
        if (a.hasScreenshots === b.hasScreenshots) return a.flowId.localeCompare(b.flowId);
        return a.hasScreenshots ? 1 : -1;
      });

      setFlows(flowConfigs);
      setSelectedFlows(new Set(flowConfigs.filter(f => !f.hasScreenshots).map(f => f.flowId)));
    } catch (error) {
      console.error('Failed to load flows:', error);
      toast.error('Flows konnten nicht geladen werden');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFlow = (flowId: string) => {
    setSelectedFlows(prev => {
      const next = new Set(prev);
      if (next.has(flowId)) {
        next.delete(flowId);
      } else {
        next.add(flowId);
      }
      return next;
    });
  };

  const selectAll = () => setSelectedFlows(new Set(flows.map(f => f.flowId)));
  const selectNone = () => setSelectedFlows(new Set());

  const calculateTotalCaptures = () => {
    const dimensions = (captureDesktop ? 1 : 0) + (captureMobile ? 1 : 0);
    return flows
      .filter(f => selectedFlows.has(f.flowId))
      .reduce((acc, f) => acc + f.stepCount * dimensions, 0);
  };

  const startBackgroundCapture = async () => {
    if (selectedFlows.size === 0) {
      toast.error('Bitte mindestens einen Flow auswählen');
      return;
    }
    if (!captureDesktop && !captureMobile) {
      toast.error('Bitte mindestens Desktop oder Mobile auswählen');
      return;
    }

    const flowsToCapture = flows
      .filter(f => selectedFlows.has(f.flowId))
      .map(f => ({
        flowId: f.flowId,
        flowName: f.flowName,
        stepCount: f.stepCount,
        flowPath: f.flowPath
      }));

    await startJob({
      flows: flowsToCapture,
      baseUrl: SITE_CONFIG.previewUrl.replace(/\/$/, ''),
      captureDesktop,
      captureMobile
    });
  };

  const flowsWithoutScreenshots = flows.filter(f => !f.hasScreenshots).length;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Bulk Screenshot Capture
          </h2>
          <p className="text-sm text-muted-foreground">
            {flows.length} Flows gefunden • {flowsWithoutScreenshots} ohne Screenshots
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/flow-review">
              <ExternalLink className="h-4 w-4 mr-2" />
              Flow Review
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={loadFlows} disabled={isPolling}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isPolling ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
        </div>
      </div>

      {/* Active Job Status */}
      {activeJob && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CloudUpload className="h-5 w-5 text-primary animate-pulse" />
                <div>
                  <p className="font-medium">
                    {activeJob.status === 'processing' ? 'Erfassung läuft im Hintergrund...' : 
                     activeJob.status === 'pending' ? 'Job wird gestartet...' :
                     activeJob.status === 'completed' ? 'Erfassung abgeschlossen!' :
                     'Fehler aufgetreten'}
                  </p>
                  <p className="text-sm text-muted-foreground">{activeJob.progressMessage}</p>
                </div>
              </div>
              {(activeJob.status === 'completed' || activeJob.status === 'failed') && (
                <Button variant="ghost" size="sm" onClick={clearJob}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Progress value={activeJob.progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {activeJob.progress}% • Du kannst diese Seite schliessen - der Job läuft im Hintergrund weiter
            </p>
            {activeJob.error && (
              <p className="text-sm text-destructive mt-2">{activeJob.error}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status Summary */}
      {flowsWithoutScreenshots > 0 && !activeJob && (
        <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium text-orange-600">
              {flowsWithoutScreenshots} Flows ohne Screenshots
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-orange-500/50 text-orange-600 hover:bg-orange-500/10"
            onClick={() => setSelectedFlows(new Set(flows.filter(f => !f.hasScreenshots).map(f => f.flowId)))}
          >
            Nur diese auswählen
          </Button>
        </div>
      )}

      {/* Configuration */}
      {!activeJob && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            {/* Device Selection */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  checked={captureDesktop} 
                  onCheckedChange={(v) => setCaptureDesktop(Boolean(v))} 
                />
                <Monitor className="h-4 w-4" />
                <span>Desktop (1920x1080)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox 
                  checked={captureMobile} 
                  onCheckedChange={(v) => setCaptureMobile(Boolean(v))} 
                />
                <Smartphone className="h-4 w-4" />
                <span>Mobile (390x844)</span>
              </label>
            </div>

            {/* Flow Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Flows auswählen ({selectedFlows.size}/{flows.length})</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll}>Alle</Button>
                  <Button variant="outline" size="sm" onClick={selectNone}>Keine</Button>
                </div>
              </div>

              <ScrollArea className="h-64 border rounded-lg p-2">
                <div className="space-y-1">
                  {flows.map(flow => (
                    <label
                      key={flow.flowId}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                        selectedFlows.has(flow.flowId) 
                          ? 'bg-primary/10' 
                          : 'hover:bg-muted/50'
                      } ${!flow.hasScreenshots ? 'border-l-2 border-l-orange-500' : ''}`}
                    >
                      <Checkbox
                        checked={selectedFlows.has(flow.flowId)}
                        onCheckedChange={() => toggleFlow(flow.flowId)}
                      />
                      <span className="flex-1 text-sm">{flow.flowName}</span>
                      {flow.hasScreenshots ? (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-600/50">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Hat Screenshots
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-orange-600 border-orange-600/50">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Fehlt
                        </Badge>
                      )}
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Start Button */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {calculateTotalCaptures()} Screenshots werden erfasst
              </div>
              <Button 
                onClick={startBackgroundCapture}
                disabled={selectedFlows.size === 0 || (!captureDesktop && !captureMobile)}
                className="gap-2"
              >
                <Play className="h-4 w-4" />
                Im Hintergrund starten
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

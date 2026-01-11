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

// Default flow paths based on flowId patterns
const getFlowPath = (flowId: string): string => {
  if (flowId === 'umzugsofferten-v1' || flowId === 'v1') return '/umzugsofferten';
  if (flowId.startsWith('v') && flowId.length <= 4) {
    return `/umzugsofferten?v=${flowId}`;
  }
  if (flowId.startsWith('chatgpt-flow-')) {
    return `/umzugsofferten?v=${flowId}`;
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
      // Get all unique flows from flow_analysis_runs (has 74 unique flows)
      const { data: analysisFlows, error: analysisError } = await supabase
        .from('flow_analysis_runs')
        .select('flow_id, flow_name')
        .order('created_at', { ascending: false });

      if (analysisError) throw analysisError;

      // Get step counts from flow_versions (authoritative source)
      const { data: versionData } = await supabase
        .from('flow_versions')
        .select('flow_id, step_configs');

      // Build step count map from flow_versions
      const flowStepCounts = new Map<string, number>();
      for (const v of versionData || []) {
        const stepConfigs = v.step_configs as any[] | null;
        const stepCount = Array.isArray(stepConfigs) && stepConfigs.length > 0 ? stepConfigs.length : 0;
        // Keep the highest step count for each flow_id (some flows have multiple versions)
        const existing = flowStepCounts.get(v.flow_id) || 0;
        if (stepCount > existing) {
          flowStepCounts.set(v.flow_id, stepCount);
        }
        // Also map normalized ID
        const normalized = v.flow_id.startsWith('umzugsofferten-') 
          ? v.flow_id.replace('umzugsofferten-', '') 
          : v.flow_id;
        const existingNorm = flowStepCounts.get(normalized) || 0;
        if (stepCount > existingNorm) {
          flowStepCounts.set(normalized, stepCount);
        }
      }

      // Get existing screenshots from flow_step_metrics
      const { data: metricsData } = await supabase
        .from('flow_step_metrics')
        .select('flow_id')
        .or('mobile_screenshot_url.not.is.null,desktop_screenshot_url.not.is.null');

      const flowsWithScreenshots = new Set((metricsData || []).map(m => m.flow_id));

      // Deduplicate by flow_id
      const uniqueFlowMap = new Map<string, { flow_id: string; flow_name: string }>();
      for (const f of analysisFlows || []) {
        if (!uniqueFlowMap.has(f.flow_id)) {
          uniqueFlowMap.set(f.flow_id, f);
        }
      }

      // Get step count for a flow - try normalized and prefixed variants
      const getStepCount = (flowId: string): number => {
        const normalized = flowId.startsWith('umzugsofferten-') 
          ? flowId.replace('umzugsofferten-', '') 
          : flowId;
        const prefixed = `umzugsofferten-${normalized}`;
        
        return flowStepCounts.get(flowId) || 
               flowStepCounts.get(normalized) || 
               flowStepCounts.get(prefixed) || 
               6; // fallback to 6 steps
      };

      const flowConfigs: FlowConfig[] = Array.from(uniqueFlowMap.values()).map(f => ({
        flowId: f.flow_id,
        flowName: f.flow_name || f.flow_id,
        stepCount: getStepCount(f.flow_id),
        flowPath: getFlowPath(f.flow_id),
        hasScreenshots: flowsWithScreenshots.has(f.flow_id)
      }));

      // Sort: flows without screenshots first
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

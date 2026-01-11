import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/data/constants";
import {
  Camera,
  CheckCircle2,
  XCircle,
  Loader2,
  Play,
  Square,
  RefreshCw,
  Monitor,
  Smartphone,
  AlertTriangle,
  Clock
} from "lucide-react";
import { captureScreenshot } from "@/lib/screenshot-service";

interface FlowConfig {
  flowId: string;
  flowName: string;
  stepCount: number;
  flowPath: string;
}

interface CaptureStatus {
  flowId: string;
  step: number;
  type: 'desktop' | 'mobile';
  status: 'pending' | 'capturing' | 'success' | 'error';
  error?: string;
  imageUrl?: string;
}

// Default flow paths based on flowId patterns
const getFlowPath = (flowId: string): string => {
  // Handle special cases
  if (flowId === 'umzugsofferten-v1' || flowId === 'v1') return '/umzugsofferten';
  if (flowId.startsWith('v') && flowId.length <= 4) {
    // Short codes like v3a, v9a
    return `/umzugsofferten?v=${flowId}`;
  }
  // Standard patterns like umzugsofferten-v3
  const match = flowId.match(/umzugsofferten-v(\d+[a-z]?)/);
  if (match) {
    return `/umzugsofferten-v${match[1]}`;
  }
  // Fallback
  return `/umzugsofferten?v=${flowId}`;
};

export function BulkScreenshotCapture() {
  const [flows, setFlows] = useState<FlowConfig[]>([]);
  const [selectedFlows, setSelectedFlows] = useState<Set<string>>(new Set());
  const [captureDesktop, setCaptureDesktop] = useState(true);
  const [captureMobile, setCaptureMobile] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [captureStatuses, setCaptureStatuses] = useState<CaptureStatus[]>([]);
  const [currentProgress, setCurrentProgress] = useState({ current: 0, total: 0, message: '' });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const pauseRef = useRef(false);

  // Load flows from database
  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('flow_versions')
        .select('flow_id, version_name, step_configs')
        .eq('is_active', true)
        .order('flow_id');

      if (error) throw error;

      const flowConfigs: FlowConfig[] = (data || []).map(f => {
        const stepConfigs = f.step_configs as any[] || [];
        return {
          flowId: f.flow_id,
          flowName: f.version_name || f.flow_id,
          stepCount: stepConfigs.length || 6,
          flowPath: getFlowPath(f.flow_id)
        };
      });

      setFlows(flowConfigs);
      // Select all by default
      setSelectedFlows(new Set(flowConfigs.map(f => f.flowId)));
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

  const buildCaptureUrl = (flowPath: string, step: number): string => {
    const baseUrl = SITE_CONFIG.previewUrl.replace(/\/$/, '');
    const u = new URL(flowPath, baseUrl);
    u.searchParams.set('uc_capture', '1');
    u.searchParams.set('uc_step', String(step));
    u.searchParams.set('uc_render', '1');
    u.searchParams.set('uc_cb', String(Date.now()));
    return u.toString();
  };

  const calculateTotalCaptures = () => {
    const dimensions = (captureDesktop ? 1 : 0) + (captureMobile ? 1 : 0);
    return flows
      .filter(f => selectedFlows.has(f.flowId))
      .reduce((acc, f) => acc + f.stepCount * dimensions, 0);
  };

  const stopCapture = () => {
    abortControllerRef.current?.abort();
    setIsCapturing(false);
    setIsPaused(false);
    pauseRef.current = false;
    toast.info('Capture gestoppt');
  };

  const pauseCapture = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(pauseRef.current);
    toast.info(pauseRef.current ? 'Capture pausiert' : 'Capture fortgesetzt');
  };

  const startCapture = async () => {
    if (selectedFlows.size === 0) {
      toast.error('Bitte mindestens einen Flow auswählen');
      return;
    }
    if (!captureDesktop && !captureMobile) {
      toast.error('Bitte mindestens Desktop oder Mobile auswählen');
      return;
    }

    abortControllerRef.current = new AbortController();
    pauseRef.current = false;
    setIsCapturing(true);
    setIsPaused(false);

    const flowsToCapture = flows.filter(f => selectedFlows.has(f.flowId));
    const dimensions: ('desktop' | 'mobile')[] = [];
    if (captureDesktop) dimensions.push('desktop');
    if (captureMobile) dimensions.push('mobile');

    // Initialize statuses
    const initialStatuses: CaptureStatus[] = [];
    for (const flow of flowsToCapture) {
      for (let step = 1; step <= flow.stepCount; step++) {
        for (const dim of dimensions) {
          initialStatuses.push({
            flowId: flow.flowId,
            step,
            type: dim,
            status: 'pending'
          });
        }
      }
    }
    setCaptureStatuses(initialStatuses);

    const total = initialStatuses.length;
    let completed = 0;
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const flow of flowsToCapture) {
        if (abortControllerRef.current?.signal.aborted) break;

        for (let step = 1; step <= flow.stepCount; step++) {
          if (abortControllerRef.current?.signal.aborted) break;

          for (const dim of dimensions) {
            if (abortControllerRef.current?.signal.aborted) break;

            // Wait if paused
            while (pauseRef.current) {
              await new Promise(r => setTimeout(r, 500));
              if (abortControllerRef.current?.signal.aborted) break;
            }

            const statusKey = `${flow.flowId}-${step}-${dim}`;
            const statusIndex = initialStatuses.findIndex(
              s => s.flowId === flow.flowId && s.step === step && s.type === dim
            );

            // Mark as capturing
            setCaptureStatuses(prev => {
              const next = [...prev];
              if (next[statusIndex]) {
                next[statusIndex] = { ...next[statusIndex], status: 'capturing' };
              }
              return next;
            });

            setCurrentProgress({
              current: completed + 1,
              total,
              message: `${flow.flowName} Step ${step} (${dim})`
            });

            const captureUrl = buildCaptureUrl(flow.flowPath, step);
            const dimension = dim === 'desktop' ? '1920x1080' : '390x844';

            try {
              const result = await captureScreenshot({
                url: captureUrl,
                dimension,
                delay: 10000,
                format: 'png',
                fullPage: false,
                scroll: false,
                noCache: true,
                waitForReadySentinel: true
              });

              if (result.success) {
                successCount++;
                // Save to database
                await saveScreenshotToDb(flow.flowId, step, dim, result.image || '');
                
                setCaptureStatuses(prev => {
                  const next = [...prev];
                  if (next[statusIndex]) {
                    next[statusIndex] = { 
                      ...next[statusIndex], 
                      status: 'success',
                      imageUrl: result.image
                    };
                  }
                  return next;
                });
              } else {
                errorCount++;
                setCaptureStatuses(prev => {
                  const next = [...prev];
                  if (next[statusIndex]) {
                    next[statusIndex] = { 
                      ...next[statusIndex], 
                      status: 'error',
                      error: result.error || 'Unknown error'
                    };
                  }
                  return next;
                });
              }
            } catch (err) {
              errorCount++;
              setCaptureStatuses(prev => {
                const next = [...prev];
                if (next[statusIndex]) {
                  next[statusIndex] = { 
                    ...next[statusIndex], 
                    status: 'error',
                    error: err instanceof Error ? err.message : 'Network error'
                  };
                }
                return next;
              });
            }

            completed++;

            // Wait between captures to avoid rate limiting
            await new Promise(r => setTimeout(r, 2000));
          }
        }
      }

      toast.success(`Fertig! ${successCount} erfolgreich, ${errorCount} Fehler`);
    } catch (error) {
      if (!abortControllerRef.current?.signal.aborted) {
        console.error('Capture error:', error);
        toast.error('Capture fehlgeschlagen');
      }
    } finally {
      setIsCapturing(false);
      setIsPaused(false);
    }
  };

  const saveScreenshotToDb = async (
    flowId: string, 
    step: number, 
    type: 'desktop' | 'mobile', 
    imageBase64: string
  ) => {
    try {
      // Upload to storage first
      const fileName = `${flowId}/step-${step}-${type}-${Date.now()}.png`;
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('screenshots-archive')
        .upload(fileName, binaryData, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return;
      }

      const { data: urlData } = supabase.storage
        .from('screenshots-archive')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Update or insert flow_step_metrics
      const updateColumn = type === 'desktop' ? 'desktop_screenshot_url' : 'mobile_screenshot_url';
      
      // Check if record exists
      const { data: existing } = await supabase
        .from('flow_step_metrics')
        .select('id')
        .eq('flow_id', flowId)
        .eq('step_number', step)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('flow_step_metrics')
          .update({ [updateColumn]: publicUrl })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('flow_step_metrics')
          .insert({
            flow_id: flowId,
            step_number: step,
            [updateColumn]: publicUrl
          });
      }
    } catch (err) {
      console.error('Failed to save screenshot to DB:', err);
    }
  };

  const getStatusCounts = () => {
    const success = captureStatuses.filter(s => s.status === 'success').length;
    const error = captureStatuses.filter(s => s.status === 'error').length;
    const pending = captureStatuses.filter(s => s.status === 'pending' || s.status === 'capturing').length;
    return { success, error, pending };
  };

  const { success, error, pending } = getStatusCounts();
  const progressPercent = captureStatuses.length > 0 
    ? Math.round(((success + error) / captureStatuses.length) * 100) 
    : 0;

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
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Bulk Screenshot Capture
          </CardTitle>
          <CardDescription>
            Erfasse alle Flow-Screenshots auf einmal. Die Screenshots werden automatisch in der Datenbank gespeichert.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <Button variant="outline" size="sm" onClick={loadFlows}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-48 border rounded-lg p-3">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {flows.map(flow => (
                  <label 
                    key={flow.flowId}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                      selectedFlows.has(flow.flowId) 
                        ? 'bg-primary/10 border border-primary/30' 
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    <Checkbox 
                      checked={selectedFlows.has(flow.flowId)}
                      onCheckedChange={() => toggleFlow(flow.flowId)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{flow.flowName}</p>
                      <p className="text-xs text-muted-foreground">{flow.stepCount} Steps</p>
                    </div>
                  </label>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Summary & Actions */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="text-sm">
              <span className="font-medium">{calculateTotalCaptures()}</span> Screenshots werden erfasst
              <span className="text-muted-foreground ml-2">
                (~{Math.ceil(calculateTotalCaptures() * 12 / 60)} Min.)
              </span>
            </div>
            
            {!isCapturing ? (
              <Button onClick={startCapture} disabled={selectedFlows.size === 0}>
                <Play className="h-4 w-4 mr-2" />
                Capture starten
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={pauseCapture}>
                  {isPaused ? <Play className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </Button>
                <Button variant="destructive" onClick={stopCapture}>
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress & Status */}
      {captureStatuses.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Fortschritt</CardTitle>
              <div className="flex gap-2">
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {success}
                </Badge>
                {error > 0 && (
                  <Badge variant="destructive">
                    <XCircle className="h-3 w-3 mr-1" />
                    {error}
                  </Badge>
                )}
                <Badge variant="secondary">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  {pending}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={progressPercent} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {currentProgress.message || `${progressPercent}% abgeschlossen`}
            </p>

            {/* Error list if any */}
            {error > 0 && (
              <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
                <p className="text-sm font-medium text-destructive mb-2 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  {error} Fehler aufgetreten
                </p>
                <ScrollArea className="h-32">
                  <div className="space-y-1">
                    {captureStatuses
                      .filter(s => s.status === 'error')
                      .slice(0, 10)
                      .map((s, i) => (
                        <p key={i} className="text-xs text-muted-foreground">
                          {s.flowId} Step {s.step} ({s.type}): {s.error}
                        </p>
                      ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

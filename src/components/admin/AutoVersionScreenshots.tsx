/**
 * AutoVersionScreenshots - Automatische Screenshot-Erfassung für alle Flow-Versionen
 * 
 * Features:
 * - Auto-Sync: Neue Versionen werden automatisch erkannt und Screenshots erfasst
 * - Storage: Screenshots werden in Supabase Storage gespeichert (nicht als base64 in DB)
 * - Realtime: Überwacht flow_versions Tabelle auf neue Einträge
 */

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/data/constants";
import {
  Camera,
  RefreshCw,
  Loader2,
  Play,
  CheckCircle2,
  XCircle,
  Smartphone,
  Monitor,
  Database,
  Zap,
  Save,
  Radio,
  CloudUpload,
} from "lucide-react";
import { captureScreenshot } from "@/lib/screenshot-service";
import { Json } from "@/integrations/supabase/types";

// Flow definitions - maps flow_id to path and step count
const FLOW_DEFINITIONS: Record<string, { path: string; maxSteps: number; name: string }> = {
  "umzugsofferten": { path: "/umzugsofferten", maxSteps: 4, name: "V1 - Control" },
  "umzugsofferten-v2": { path: "/umzugsofferten-v2", maxSteps: 6, name: "V2" },
  "umzugsofferten-v2e": { path: "/umzugsofferten-v2e", maxSteps: 10, name: "V2.e Chat-Funnel" },
  "umzugsofferten-v3": { path: "/umzugsofferten-v3", maxSteps: 4, name: "V3" },
  "umzugsofferten-v4": { path: "/umzugsofferten-v4", maxSteps: 6, name: "V4" },
  "umzugsofferten-v5": { path: "/umzugsofferten-v5", maxSteps: 6, name: "V5" },
  "umzugsofferten-v6": { path: "/umzugsofferten-v6", maxSteps: 6, name: "V6" },
  "umzugsofferten-v7": { path: "/umzugsofferten-v7", maxSteps: 5, name: "V7" },
  "umzugsofferten-v8": { path: "/umzugsofferten-v8", maxSteps: 6, name: "V8" },
  "umzugsofferten-v9": { path: "/umzugsofferten-v9", maxSteps: 7, name: "V9" },
};

// V9 Sub-variants
const V9_VARIANTS: Record<string, { component: string; steps: number }> = {
  "A": { component: "ZeroFrictionWizard", steps: 7 },
  "B": { component: "ZeroFrictionWizard", steps: 7 },
  "C": { component: "ZeroFrictionWizard", steps: 7 },
  "D": { component: "ArchetypWizardV9D", steps: 6 },
};

interface FlowVersion {
  id: string;
  flow_id: string;
  version_number: string;
  version_name: string | null;
  screenshots: Json;
  config: Json;
}

interface CaptureResult {
  versionId: string;
  step: number;
  dimension: "desktop" | "mobile";
  success: boolean;
  url?: string;
  error?: string;
}

export function AutoVersionScreenshots() {
  const defaultPublicBaseUrl = useMemo(() => {
    if (typeof window === "undefined") return SITE_CONFIG.url.replace(/\/$/, "");
    const { origin, hostname } = window.location;
    const isPreviewHost = hostname.includes("lovable.app") || hostname.includes("lovableproject.com");
    return (isPreviewHost ? SITE_CONFIG.url : origin).replace(/\/$/, "");
  }, []);

  const [baseUrl, setBaseUrl] = useState(defaultPublicBaseUrl);
  const [versions, setVersions] = useState<FlowVersion[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [captureDesktop, setCaptureDesktop] = useState(true);
  const [captureMobile, setCaptureMobile] = useState(true);
  const [delayMs, setDelayMs] = useState(10000);
  const [progress, setProgress] = useState({ current: 0, total: 0, message: "" });
  const [results, setResults] = useState<CaptureResult[]>([]);
  const [autoSync, setAutoSync] = useState(true);
  const [pendingQueue, setPendingQueue] = useState<string[]>([]);
  const processingRef = useRef(false);

  // Fetch all versions
  const fetchVersions = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("flow_versions")
        .select("id, flow_id, version_number, version_name, screenshots, config")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setVersions(data || []);
      
      // Auto-select versions without screenshots
      const versionsWithoutScreenshots = (data || []).filter(v => {
        const screenshots = v.screenshots as Record<string, string> | null;
        return !screenshots || Object.keys(screenshots).length === 0;
      });
      setSelectedVersions(versionsWithoutScreenshots.map(v => v.id));
    } catch (err) {
      console.error("Failed to fetch versions:", err);
      toast.error("Versionen konnten nicht geladen werden");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  // Realtime subscription for auto-sync
  useEffect(() => {
    if (!autoSync) return;

    const channel = supabase
      .channel("flow_versions_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "flow_versions" },
        (payload) => {
          const newVersion = payload.new as FlowVersion;
          console.log("New version detected:", newVersion.version_number);
          
          // Add to pending queue if no screenshots
          const screenshots = newVersion.screenshots as Record<string, string> | null;
          if (!screenshots || Object.keys(screenshots).length === 0) {
            setPendingQueue(prev => [...prev, newVersion.id]);
            setVersions(prev => [newVersion, ...prev]);
            toast.info(`Neue Version erkannt: ${newVersion.version_number}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [autoSync]);

  // Process pending queue automatically
  useEffect(() => {
    if (pendingQueue.length === 0 || processingRef.current || !autoSync) return;

    const processQueue = async () => {
      processingRef.current = true;
      const versionId = pendingQueue[0];
      
      await captureVersionScreenshots(versionId);
      
      setPendingQueue(prev => prev.slice(1));
      processingRef.current = false;
    };

    // Small delay before starting
    const timeout = setTimeout(processQueue, 2000);
    return () => clearTimeout(timeout);
  }, [pendingQueue, autoSync]);

  const getFlowPath = (version: FlowVersion): { path: string; steps: number } | null => {
    const config = version.config as {
      variantId?: unknown;
      variantPath?: unknown;
      variantSteps?: unknown;
    } | null;

    // Prefer explicit variantPath stored in version config (e.g. v1a-v1e, v2f, ...)
    const variantPath = typeof config?.variantPath === "string" ? config.variantPath : null;
    const variantSteps = Array.isArray(config?.variantSteps) ? (config?.variantSteps as unknown[]) : null;
    if (variantPath) {
      const fallbackSteps = FLOW_DEFINITIONS[version.flow_id]?.maxSteps ?? 4;
      return { path: variantPath, steps: variantSteps?.length ?? fallbackSteps };
    }

    // Check for V9 variants
    if (typeof config?.variantId === "string") {
      const variantLetter = config.variantId.replace("v9-variant-", "").toUpperCase();
      const variantConfig = V9_VARIANTS[variantLetter];
      if (variantConfig) {
        return { 
          path: `/umzugsofferten-v9?uc_variant=${variantLetter}`,
          steps: variantConfig.steps 
        };
      }
    }

    // Fallback to standard flow definitions
    const flowDef = FLOW_DEFINITIONS[version.flow_id];
    if (flowDef) {
      return { path: flowDef.path, steps: flowDef.maxSteps };
    }

    // Try to extract from version number (e.g., "9.4" -> V9)
    const match = version.version_number.match(/^(\d+)/);
    if (match) {
      const majorVersion = parseInt(match[1], 10);
      const flowId = majorVersion === 1 ? "umzugsofferten" : `umzugsofferten-v${majorVersion}`;
      const def = FLOW_DEFINITIONS[flowId];
      if (def) return { path: def.path, steps: def.maxSteps };
    }

    return null;
  };

  const toggleVersion = (id: string) => {
    setSelectedVersions(prev =>
      prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
    );
  };

  const selectAll = () => setSelectedVersions(versions.map(v => v.id));
  const deselectAll = () => setSelectedVersions([]);
  
  const selectWithoutScreenshots = () => {
    const ids = versions.filter(v => {
      const screenshots = v.screenshots as Record<string, string> | null;
      return !screenshots || Object.keys(screenshots).length === 0;
    }).map(v => v.id);
    setSelectedVersions(ids);
  };

  const buildCaptureUrl = (path: string, step: number) => {
    const base = (baseUrl || defaultPublicBaseUrl).replace(/\/$/, "");
    const separator = path.includes("?") ? "&" : "?";
    return `${base}${path}${separator}uc_capture=1&uc_step=${step}&uc_cb=${Date.now()}`;
  };

  // Upload screenshot to Supabase Storage
  const uploadScreenshot = async (
    versionId: string,
    step: number,
    dimension: "desktop" | "mobile",
    base64Data: string
  ): Promise<string | null> => {
    try {
      // Convert base64 to blob
      const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
      const byteCharacters = atob(base64Clean);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });

      // Create unique path
      const fileName = `${versionId}/step${step}_${dimension}_${Date.now()}.png`;
      
      const { data, error } = await supabase.storage
        .from("flow-screenshots")
        .upload(fileName, blob, {
          contentType: "image/png",
          upsert: true,
        });

      if (error) {
        console.error("Storage upload error:", error);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("flow-screenshots")
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (err) {
      console.error("Failed to upload screenshot:", err);
      return null;
    }
  };

  // Capture screenshots for a single version
  const captureVersionScreenshots = async (versionId: string) => {
    const version = versions.find(v => v.id === versionId);
    if (!version) return;

    const flowInfo = getFlowPath(version);
    if (!flowInfo) {
      console.warn(`No flow path found for version ${version.version_number}`);
      return;
    }

    const dimensions = [
      ...(captureDesktop ? [{ type: "desktop" as const, value: "1920x1080" }] : []),
      ...(captureMobile ? [{ type: "mobile" as const, value: "390x844" }] : []),
    ];

    if (dimensions.length === 0) return;

    const totalCaptures = flowInfo.steps * dimensions.length;
    let captureCount = 0;
    const screenshotUrls: Record<string, string> = {};
    const captureResults: CaptureResult[] = [];

    setIsRunning(true);

    for (let step = 1; step <= flowInfo.steps; step++) {
      for (const dim of dimensions) {
        captureCount++;
        const dimLabel = dim.type === "desktop" ? "Desktop" : "Mobile";
        setProgress({
          current: captureCount,
          total: totalCaptures,
          message: `${version.version_number} - Step ${step}: ${dimLabel}...`,
        });

        const url = buildCaptureUrl(flowInfo.path, step);

        try {
          const result = await captureScreenshot({
            url,
            dimension: dim.value,
            delay: delayMs,
            format: "png",
            fullPage: false,
            scroll: false,
            noCache: true,
          });

          if (result.success && result.image) {
            // Upload to storage
            const publicUrl = await uploadScreenshot(versionId, step, dim.type, result.image);
            
            if (publicUrl) {
              const key = `step${step}${dim.type === "desktop" ? "Desktop" : "Mobile"}`;
              screenshotUrls[key] = publicUrl;
              
              captureResults.push({
                versionId,
                step,
                dimension: dim.type,
                success: true,
                url: publicUrl,
              });
            } else {
              captureResults.push({
                versionId,
                step,
                dimension: dim.type,
                success: false,
                error: "Storage upload failed",
              });
            }
          } else {
            captureResults.push({
              versionId,
              step,
              dimension: dim.type,
              success: false,
              error: result.error || "Capture failed",
            });
          }
        } catch (err) {
          captureResults.push({
            versionId,
            step,
            dimension: dim.type,
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
          });
        }

        // Small delay between captures
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    // Save URLs to DB (much smaller than base64!)
    if (Object.keys(screenshotUrls).length > 0) {
      setProgress(prev => ({ ...prev, message: `${version.version_number}: Speichere...` }));
      
      try {
        const { error } = await supabase
          .from("flow_versions")
          .update({ screenshots: screenshotUrls })
          .eq("id", versionId);

        if (error) {
          console.error(`Failed to save screenshots for ${version.version_number}:`, error);
          toast.error(`Fehler beim Speichern: ${version.version_number}`);
        } else {
          toast.success(`${version.version_number}: ${Object.keys(screenshotUrls).length} Screenshots gespeichert`);
          // Update local state
          setVersions(prev => prev.map(v => 
            v.id === versionId ? { ...v, screenshots: screenshotUrls } : v
          ));
        }
      } catch (err) {
        console.error(`Exception saving screenshots:`, err);
        toast.error(`Fehler beim Speichern: ${version.version_number}`);
      }
    }

    setResults(prev => [...prev, ...captureResults]);
    setIsRunning(false);
  };

  // Run capture for selected versions
  const runCapture = async () => {
    if (selectedVersions.length === 0) {
      toast.error("Bitte wähle mindestens eine Version aus");
      return;
    }

    if (!captureDesktop && !captureMobile) {
      toast.error("Bitte wähle mindestens eine Auflösung");
      return;
    }

    setResults([]);

    for (const versionId of selectedVersions) {
      await captureVersionScreenshots(versionId);
    }

    const successCount = results.filter(r => r.success).length;
    toast.success(`Fertig! Screenshots erfolgreich erfasst`);
    fetchVersions();
  };

  const getScreenshotCount = (version: FlowVersion): number => {
    const screenshots = version.screenshots as Record<string, string> | null;
    return screenshots ? Object.keys(screenshots).length : 0;
  };

  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Lade Versionen...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Auto-Screenshots für alle Versionen
              </CardTitle>
              <CardDescription>
                Erfasst automatisch Screenshots und speichert sie in Storage
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Radio className={`h-4 w-4 ${autoSync ? "text-green-500 animate-pulse" : "text-muted-foreground"}`} />
              <span className="text-sm">Auto-Sync</span>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Missing Screenshots Alert - Most Important! */}
          {(() => {
            const versionsWithoutScreenshots = versions.filter(v => {
              const screenshots = v.screenshots as Record<string, string> | null;
              return !screenshots || Object.keys(screenshots).length === 0;
            });
            const missingCount = versionsWithoutScreenshots.length;
            
            if (missingCount > 0) {
              return (
                <div className="p-4 bg-orange-50 dark:bg-orange-950 border-2 border-orange-300 dark:border-orange-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                        <Camera className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-orange-800 dark:text-orange-200">
                          {missingCount} {missingCount === 1 ? 'Version' : 'Versionen'} ohne Screenshots
                        </div>
                        <div className="text-sm text-orange-600 dark:text-orange-400">
                          {versions.length - missingCount} von {versions.length} Versionen haben Screenshots
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="default" 
                      className="bg-orange-600 hover:bg-orange-700"
                      onClick={() => {
                        selectWithoutScreenshots();
                        toast.info(`${missingCount} Versionen ausgewählt - klicke auf "Screenshots erfassen"`);
                      }}
                      disabled={isRunning}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Alle {missingCount} auswählen
                    </Button>
                  </div>
                </div>
              );
            }
            
            return (
              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 dark:text-green-300 font-medium">
                    Alle {versions.length} Versionen haben Screenshots
                  </span>
                </div>
              </div>
            );
          })()}

          {/* Auto-Sync Status */}
          {autoSync && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <Radio className="h-4 w-4 text-green-500 animate-pulse" />
              <span className="text-sm text-green-700 dark:text-green-300">
                Auto-Sync aktiv: Neue Versionen werden automatisch erfasst
              </span>
              {pendingQueue.length > 0 && (
                <Badge variant="secondary">{pendingQueue.length} in Warteschlange</Badge>
              )}
            </div>
          )}

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <label className="text-sm font-medium">Base URL</label>
              <Input
                value={baseUrl}
                onChange={e => setBaseUrl(e.target.value)}
                placeholder={defaultPublicBaseUrl}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Delay (ms)</label>
              <Input
                type="number"
                value={delayMs}
                min={1000}
                step={1000}
                onChange={e => setDelayMs(Math.max(1000, Number(e.target.value) || 10000))}
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2">
                <Checkbox checked={captureDesktop} onCheckedChange={v => setCaptureDesktop(Boolean(v))} />
                <Monitor className="h-4 w-4" />
                Desktop
              </label>
              <label className="flex items-center gap-2">
                <Checkbox checked={captureMobile} onCheckedChange={v => setCaptureMobile(Boolean(v))} />
                <Smartphone className="h-4 w-4" />
                Mobile
              </label>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={selectAll}>
              Alle auswählen
            </Button>
            <Button variant="outline" size="sm" onClick={deselectAll}>
              Alle abwählen
            </Button>
            <Button variant="outline" size="sm" onClick={selectWithoutScreenshots}>
              <Zap className="h-4 w-4 mr-1" />
              Nur ohne Screenshots
            </Button>
            <Button variant="outline" size="sm" onClick={fetchVersions}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Aktualisieren
            </Button>
          </div>

          {/* Version List */}
          <ScrollArea className="h-[300px] border rounded-lg">
            <div className="p-2 space-y-1">
              {versions.map(version => {
                const screenshotCount = getScreenshotCount(version);
                const flowInfo = getFlowPath(version);
                const isSelected = selectedVersions.includes(version.id);
                const isPending = pendingQueue.includes(version.id);

                return (
                  <div
                    key={version.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/10 border border-primary/30" : 
                      isPending ? "bg-yellow-50 border border-yellow-300" : 
                      "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleVersion(version.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox checked={isSelected} />
                      <div>
                        <div className="font-medium">
                          v{version.version_number}
                          {version.version_name && (
                            <span className="text-muted-foreground ml-2">({version.version_name})</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {version.flow_id} • {flowInfo?.steps || "?"} Steps
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isPending && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Wartend
                        </Badge>
                      )}
                      {screenshotCount > 0 ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          <CloudUpload className="h-3 w-3 mr-1" />
                          {screenshotCount}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          Keine Screenshots
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Action */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{selectedVersions.length}</span> von{" "}
              {versions.length} Versionen ausgewählt
            </div>
            <Button onClick={runCapture} disabled={isRunning || selectedVersions.length === 0}>
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Läuft...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Screenshots erfassen & speichern
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span>{progress.message}</span>
              <span>{progress.current} / {progress.total}</span>
            </div>
            <Progress value={(progress.current / progress.total) * 100} />
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5" />
              Ergebnisse
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="default" className="bg-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {successCount} OK
              </Badge>
              {failCount > 0 && (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  {failCount} Fehler
                </Badge>
              )}
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-1">
                {results.map((result, idx) => {
                  const version = versions.find(v => v.id === result.versionId);
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded text-sm ${
                        result.success ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        <span>v{version?.version_number}</span>
                        <Badge variant="outline" className="text-xs">Step {result.step}</Badge>
                        <span className="capitalize">{result.dimension}</span>
                      </div>
                      {result.success && result.url && (
                        <img src={result.url} alt="" className="h-8 w-auto rounded" />
                      )}
                      {result.error && (
                        <span className="text-xs truncate max-w-[200px]">{result.error}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Download, FileJson, FileText, Image, Loader2, CheckCircle2, Package,
  FileCode, AlertCircle, ChevronDown, RefreshCw, Camera, Filter,
  Smartphone, Monitor, RotateCcw, Zap, ChevronRight, CheckCheck,
  XCircle, AlertTriangle, HardDrive
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Top 10 Flow IDs - hardcoded for quick access (normalized ids = analysis tables)
const TOP_10_FLOW_IDS = [
  { rank: 1, id: "ultimate-best36", name: "Ultimate Best36" },
  { rank: 2, id: "v1", name: "V1 Control" },
  { rank: 3, id: "v7", name: "V7 Ultimate" },
  { rank: 4, id: "v3a", name: "V3a" },
  { rank: 5, id: "v3b", name: "V3b" },
  { rank: 6, id: "v3c", name: "V3c" },
  { rank: 7, id: "v3d", name: "V3d" },
  { rank: 8, id: "v3e", name: "V3e" },
  { rank: 9, id: "v2", name: "V2" },
  { rank: 10, id: "v2e", name: "V2e" },
];

const normalizeFlowId = (id: string) => {
  // Keep export tool consistent with analysis/screenshot tables.
  // flow_versions often uses prefix (umzugsofferten-...), analysis tables use normalized ids (v1, v2, ultimate-best36, ...)
  return id.startsWith("umzugsofferten-") ? id.replace("umzugsofferten-", "") : id;
};

interface StepScreenshot {
  flowId: string;
  flowName: string;
  rank: number;
  stepNumber: number;
  mobileUrl: string | null;
  desktopUrl: string | null;
}

interface FlowInfo {
  id: string;
  name: string;
  rank: number;
  stepCount?: number;
  hasScreenshots?: boolean;
  screenshotStatus?: 'complete' | 'partial' | 'none';
}

interface FailedDownload {
  flowId: string;
  stepNumber: number;
  type: 'mobile' | 'desktop';
  url: string;
}

type ExportMode = "top10" | "all" | "custom";
type ScreenshotFilter = "all" | "complete" | "partial" | "none";
type DeviceFilter = "both" | "mobile" | "desktop";

const ExportDownload = () => {
  const [mode, setMode] = useState<ExportMode>("top10");
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [completed, setCompleted] = useState(false);
  const [screenshots, setScreenshots] = useState<StepScreenshot[]>([]);
  const [allFlows, setAllFlows] = useState<FlowInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureProgress, setCaptureProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  
  // New features state
  const [screenshotFilter, setScreenshotFilter] = useState<ScreenshotFilter>("all");
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>("both");
  const [selectedFlowIds, setSelectedFlowIds] = useState<Set<string>>(new Set());
  const [failedDownloads, setFailedDownloads] = useState<FailedDownload[]>([]);
  const [showFlowSelector, setShowFlowSelector] = useState(false);
  const [autoCaptureEnabled, setAutoCaptureEnabled] = useState(false);

  // After auto-capture we need to keep syncing until screenshots actually appear (analysis runs in background)
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);
  const autoRefreshIntervalRef = useRef<number | null>(null);
  const autoRefreshAttemptsRef = useRef(0);
  const flowsWithoutScreenshotsCountRef = useRef(0);

  // Fetch all available flows from DB
  const fetchAllFlows = useCallback(async (showSyncState = false) => {
    if (showSyncState) setIsSyncing(true);
    try {
      // Fetch ALL flow_versions to get the true count
      const { data: versionData, count: totalCount } = await supabase
        .from('flow_versions')
        .select('flow_id, version_name, flow_code, step_configs', { count: 'exact' });
      
      // Also get analysis runs for additional flow info
      const { data: analysisData } = await supabase
        .from('flow_analysis_runs')
        .select('flow_id, flow_name')
        .order('created_at', { ascending: false });
      
      // Get screenshot counts per flow - this is now the PRIMARY source for what flows have screenshots
      const { data: screenshotData } = await supabase
        .from('flow_step_metrics')
        .select('flow_id, step_number, mobile_screenshot_url, desktop_screenshot_url');
      
      // Build screenshot status map AND discover all flows with screenshots
      const flowScreenshotStatus = new Map<string, { mobile: number; desktop: number; total: number; maxStep: number }>();
      for (const row of screenshotData || []) {
        const current = flowScreenshotStatus.get(row.flow_id) || { mobile: 0, desktop: 0, total: 0, maxStep: 0 };
        if (row.mobile_screenshot_url) current.mobile++;
        if (row.desktop_screenshot_url) current.desktop++;
        current.total++;
        current.maxStep = Math.max(current.maxStep, row.step_number || 0);
        flowScreenshotStatus.set(row.flow_id, current);
      }
      
      // Combine ALL sources - prioritize flow_step_metrics since that's where screenshots live
      const uniqueFlows = new Map<string, FlowInfo>();
      
      // First add from flow_versions (authoritative source for step configs)
      if (versionData) {
        versionData.forEach((row, idx) => {
          if (!uniqueFlows.has(row.flow_id)) {
            const stepConfigs = row.step_configs as any[] | null;
            const stepCount = Array.isArray(stepConfigs) ? stepConfigs.length : 0;
            const ssStatus = flowScreenshotStatus.get(row.flow_id);
            
            let screenshotStatus: 'complete' | 'partial' | 'none' = 'none';
            if (ssStatus) {
              const expectedCount = stepCount * 2; // mobile + desktop
              const actualCount = ssStatus.mobile + ssStatus.desktop;
              if (actualCount >= expectedCount && expectedCount > 0) {
                screenshotStatus = 'complete';
              } else if (actualCount > 0) {
                screenshotStatus = 'partial';
              }
            }
            
            uniqueFlows.set(row.flow_id, {
              id: row.flow_id,
              name: row.version_name || row.flow_code || row.flow_id,
              rank: idx + 1,
              stepCount,
              hasScreenshots: !!ssStatus && (ssStatus.mobile > 0 || ssStatus.desktop > 0),
              screenshotStatus,
            });
          }
        });
      }
      
      // Then add from analysis runs (may have additional flows)
      if (analysisData) {
        analysisData.forEach((row) => {
          if (!uniqueFlows.has(row.flow_id)) {
            const ssStatus = flowScreenshotStatus.get(row.flow_id);
            uniqueFlows.set(row.flow_id, {
              id: row.flow_id,
              name: row.flow_name || row.flow_id,
              rank: uniqueFlows.size + 1,
              stepCount: ssStatus?.maxStep || 0,
              hasScreenshots: !!ssStatus && (ssStatus.mobile > 0 || ssStatus.desktop > 0),
              screenshotStatus: ssStatus ? (ssStatus.mobile > 0 || ssStatus.desktop > 0 ? 'partial' : 'none') : 'none',
            });
          }
        });
      }
      
      // IMPORTANT: Also add any flows from flow_step_metrics that aren't in either table
      // This ensures we don't miss any flows that have screenshots but no version/analysis record
      for (const [flowId, ssStatus] of flowScreenshotStatus) {
        if (!uniqueFlows.has(flowId)) {
          uniqueFlows.set(flowId, {
            id: flowId,
            name: flowId, // Use ID as name if no other source
            rank: uniqueFlows.size + 1,
            stepCount: ssStatus.maxStep,
            hasScreenshots: ssStatus.mobile > 0 || ssStatus.desktop > 0,
            screenshotStatus: ssStatus.mobile > 0 || ssStatus.desktop > 0 ? 'partial' : 'none',
          });
        }
      }
      
      setAllFlows(Array.from(uniqueFlows.values()));
      setLastSynced(new Date());
      console.log(`[Sync] Loaded ${uniqueFlows.size} flows (${totalCount} total in flow_versions, ${flowScreenshotStatus.size} with screenshots)`);
    } catch (err) {
      console.error("Failed to fetch all flows:", err);
      setError("Fehler beim Synchronisieren der Flows.");
    } finally {
      if (showSyncState) setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllFlows();
  }, [fetchAllFlows]);

  // Get flow list based on mode and filters
  const targetFlows = useMemo(() => {
    let flows: FlowInfo[];
    
    if (mode === "top10") {
      flows = TOP_10_FLOW_IDS.map(f => {
        const dbFlow = allFlows.find(af => af.id === f.id);
        return {
          ...f,
          stepCount: dbFlow?.stepCount,
          hasScreenshots: dbFlow?.hasScreenshots,
          screenshotStatus: dbFlow?.screenshotStatus || 'none',
        };
      });
    } else if (mode === "custom") {
      flows = allFlows.filter(f => selectedFlowIds.has(f.id));
    } else {
      flows = allFlows;
    }
    
    // Apply screenshot filter
    if (screenshotFilter !== "all") {
      flows = flows.filter(f => f.screenshotStatus === screenshotFilter);
    }
    
    return flows.map((f, idx) => ({ ...f, rank: idx + 1 }));
  }, [mode, allFlows, selectedFlowIds, screenshotFilter]);

  // Fetch screenshots when mode or targetFlows changes
  useEffect(() => {
    const fetchScreenshots = async () => {
      if (targetFlows.length === 0) {
        setIsLoading(false);
        setScreenshots([]);
        return;
      }
      
      setIsLoading(true);
      setError(null);

      try {
        const flowIds = targetFlows.map(f => f.id);
        console.log(`[FetchScreenshots] Loading screenshots for ${flowIds.length} flows:`, flowIds);

        // SIMPLIFIED: Get ALL screenshots for these flows directly, regardless of run_id
        // This ensures we don't miss any screenshots
        const { data: allScreenshots, error: queryError } = await supabase
          .from('flow_step_metrics')
          .select('flow_id, step_number, mobile_screenshot_url, desktop_screenshot_url, created_at')
          .in('flow_id', flowIds)
          .or('mobile_screenshot_url.not.is.null,desktop_screenshot_url.not.is.null')
          .order('created_at', { ascending: false });

        if (queryError) {
          console.error('[FetchScreenshots] Query error:', queryError);
          throw queryError;
        }

        console.log(`[FetchScreenshots] Found ${allScreenshots?.length || 0} screenshot records`);

        // Deduplicate: keep only latest per flow_id + step_number
        const latestMap = new Map<string, StepScreenshot>();
        
        for (const row of allScreenshots || []) {
          const key = `${row.flow_id}-${row.step_number}`;
          if (!latestMap.has(key) && (row.mobile_screenshot_url || row.desktop_screenshot_url)) {
            const flowInfo = targetFlows.find(f => f.id === row.flow_id);
            // Even if flowInfo is not found, still include the screenshot with fallback name
            latestMap.set(key, {
              flowId: row.flow_id,
              flowName: flowInfo?.name || row.flow_id,
              rank: flowInfo?.rank || 999,
              stepNumber: row.step_number,
              mobileUrl: row.mobile_screenshot_url,
              desktopUrl: row.desktop_screenshot_url,
            });
          }
        }

        console.log(`[FetchScreenshots] Deduplicated to ${latestMap.size} unique flow-step combinations`);

        // Sort by rank, then step number
        const sorted = Array.from(latestMap.values()).sort((a, b) => {
          if (a.rank !== b.rank) return a.rank - b.rank;
          return a.stepNumber - b.stepNumber;
        });

        setScreenshots(sorted);
      } catch (err) {
        console.error("Failed to fetch screenshots:", err);
        setError("Fehler beim Laden der Screenshots aus der Datenbank.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScreenshots();
  }, [targetFlows]);

  // Filter screenshots by device
  const filteredScreenshots = useMemo(() => {
    return screenshots.map(s => ({
      ...s,
      mobileUrl: deviceFilter === 'desktop' ? null : s.mobileUrl,
      desktopUrl: deviceFilter === 'mobile' ? null : s.desktopUrl,
    })).filter(s => s.mobileUrl || s.desktopUrl);
  }, [screenshots, deviceFilter]);

  const mobileCount = filteredScreenshots.filter(s => s.mobileUrl).length;
  const desktopCount = filteredScreenshots.filter(s => s.desktopUrl).length;
  const totalScreenshots = mobileCount + desktopCount;
  const uniqueFlowCount = new Set(filteredScreenshots.map(s => s.flowId)).size;
  
  // Estimated ZIP size (rough: ~200KB per screenshot)
  const estimatedSizeMB = ((totalScreenshots * 200) / 1024).toFixed(1);
  
  // Flows missing screenshots
  const flowsWithoutScreenshots = useMemo(() => {
    const flowsWithSS = new Set(screenshots.map(s => s.flowId));
    return targetFlows.filter(f => !flowsWithSS.has(f.id));
  }, [targetFlows, screenshots]);

  // Auto-capture missing screenshots
  const captureMissingScreenshots = async () => {
    if (flowsWithoutScreenshots.length === 0) {
      toast.info("Alle Flows haben bereits Screenshots!");
      return;
    }
    
    setIsCapturing(true);
    setCaptureProgress({ current: 0, total: flowsWithoutScreenshots.length });
    flowsWithoutScreenshotsCountRef.current = flowsWithoutScreenshots.length;
    
    let successCount = 0;
    let errorCount = 0;
    
    try {
      for (let i = 0; i < flowsWithoutScreenshots.length; i++) {
        const flow = flowsWithoutScreenshots[i];
        setCaptureProgress({ current: i + 1, total: flowsWithoutScreenshots.length });
        
        // Normalize flow ID for edge function (remove umzugsofferten- prefix)
        const normalizedId = normalizeFlowId(flow.id);
        setStatus(`Erfasse Screenshots für ${flow.name} (${normalizedId})...`);
        
        try {
          const { error } = await supabase.functions.invoke('auto-analyze-flow', {
            body: {
              flowId: normalizedId,
              runType: 'manual',
            },
          });
          
          if (error) {
            console.error(`Failed to capture ${normalizedId}:`, error);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.error(`Error capturing ${normalizedId}:`, err);
          errorCount++;
        }
        
        // Small delay between captures to avoid rate limiting
        await new Promise(r => setTimeout(r, 1500));
      }
      
      if (successCount > 0) {
        toast.success(`${successCount} Flows zur Analyse gesendet!`);
      }
      if (errorCount > 0) {
        toast.warning(`${errorCount} Flows konnten nicht analysiert werden`);
      }
      
      setStatus("Capture abgeschlossen - Screenshots werden im Hintergrund erstellt.");
      
      // Start auto-refresh loop to wait for screenshots to appear
      startAutoRefresh();
    } catch (err) {
      console.error("Capture error:", err);
      toast.error("Fehler beim Erfassen der Screenshots");
    } finally {
      setIsCapturing(false);
    }
  };

  // Auto-refresh loop after capture
  const startAutoRefresh = () => {
    if (autoRefreshIntervalRef.current) {
      clearInterval(autoRefreshIntervalRef.current);
    }
    
    autoRefreshAttemptsRef.current = 0;
    setIsAutoRefreshing(true);
    
    // Poll every 5 seconds for up to 60 seconds (12 attempts)
    autoRefreshIntervalRef.current = window.setInterval(async () => {
      autoRefreshAttemptsRef.current++;
      
      // Sync to check for new screenshots
      await fetchAllFlows(false);
      
      // Check if new screenshots appeared (flows without screenshots decreased)
      const currentWithoutCount = flowsWithoutScreenshots.length;
      
      if (currentWithoutCount < flowsWithoutScreenshotsCountRef.current) {
        toast.success(`Screenshots aktualisiert! Noch ${currentWithoutCount} ohne Screenshots.`);
        flowsWithoutScreenshotsCountRef.current = currentWithoutCount;
      }
      
      // Stop after 12 attempts (60 seconds) or if all have screenshots
      if (autoRefreshAttemptsRef.current >= 12 || currentWithoutCount === 0) {
        if (autoRefreshIntervalRef.current) {
          clearInterval(autoRefreshIntervalRef.current);
          autoRefreshIntervalRef.current = null;
        }
        setIsAutoRefreshing(false);
        
        if (currentWithoutCount === 0) {
          toast.success("Alle Screenshots wurden erfolgreich erfasst!");
        } else {
          toast.info(`Auto-Refresh beendet. ${currentWithoutCount} Flows noch ohne Screenshots.`);
        }
      }
    }, 5000);
  };

  // Cleanup auto-refresh on unmount
  useEffect(() => {
    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, []);

  // Retry failed downloads
  const retryFailedDownloads = async () => {
    if (failedDownloads.length === 0) return;
    
    setIsDownloading(true);
    setStatus(`Wiederhole ${failedDownloads.length} fehlgeschlagene Downloads...`);
    
    const stillFailed: FailedDownload[] = [];
    
    for (const failed of failedDownloads) {
      try {
        const response = await fetch(failed.url);
        if (!response.ok) {
          stillFailed.push(failed);
        }
      } catch {
        stillFailed.push(failed);
      }
    }
    
    setFailedDownloads(stillFailed);
    setIsDownloading(false);
    
    if (stillFailed.length === 0) {
      toast.success("Alle Downloads erfolgreich!");
    } else {
      toast.error(`${stillFailed.length} Downloads immer noch fehlgeschlagen`);
    }
  };

  const downloadZip = async () => {
    setIsDownloading(true);
    setProgress(0);
    setCompleted(false);
    setFailedDownloads([]);

    try {
      const zip = new JSZip();
      const mobileFolder = zip.folder("screenshots-mobile");
      const desktopFolder = zip.folder("screenshots-desktop");
      
      const total = totalScreenshots;
      let current = 0;
      const failed: FailedDownload[] = [];

      // Generate dynamic JSON manifest
      const manifestData = {
        generatedAt: new Date().toISOString(),
        mode: mode,
        deviceFilter: deviceFilter,
        screenshotFilter: screenshotFilter,
        totalFlows: uniqueFlowCount,
        totalSteps: filteredScreenshots.length,
        mobileScreenshots: mobileCount,
        desktopScreenshots: desktopCount,
        flows: targetFlows.filter(f => filteredScreenshots.some(s => s.flowId === f.id)).map(f => ({
          rank: f.rank,
          id: f.id,
          name: f.name,
          steps: filteredScreenshots.filter(s => s.flowId === f.id).map(s => ({
            step: s.stepNumber,
            hasMobile: !!s.mobileUrl,
            hasDesktop: !!s.desktopUrl,
            mobileUrl: s.mobileUrl,
            desktopUrl: s.desktopUrl,
          })),
        })),
      };

      // Generate Markdown summary
      let markdown = `# Umzugscheck Flow Export\n\n`;
      markdown += `**Generated:** ${new Date().toISOString()}\n`;
      markdown += `**Mode:** ${mode === 'top10' ? 'Top 10 Flows' : mode === 'custom' ? 'Benutzerdefiniert' : `Alle Flows (${uniqueFlowCount})`}\n`;
      markdown += `**Device Filter:** ${deviceFilter === 'both' ? 'Mobile + Desktop' : deviceFilter === 'mobile' ? 'Nur Mobile' : 'Nur Desktop'}\n`;
      markdown += `**Total Steps:** ${filteredScreenshots.length}\n`;
      markdown += `**Screenshots:** ${mobileCount} Mobile, ${desktopCount} Desktop\n\n`;
      markdown += `---\n\n`;

      for (const flow of manifestData.flows) {
        markdown += `## ${flow.rank}. ${flow.name}\n`;
        markdown += `**Flow ID:** \`${flow.id}\`\n\n`;
        
        for (const step of flow.steps) {
          markdown += `### Step ${step.step}\n`;
          if (step.mobileUrl) {
            markdown += `- Mobile: [View](${step.mobileUrl})\n`;
          }
          if (step.desktopUrl) {
            markdown += `- Desktop: [View](${step.desktopUrl})\n`;
          }
          markdown += `\n`;
        }
        markdown += `---\n\n`;
      }

      // Generate HTML summary
      let html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Umzugscheck Flow Export</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    h1 { color: #1e3a5f; }
    .meta { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .flow { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
    .flow h2 { margin-top: 0; color: #1e3a5f; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
    .steps { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }
    .step { background: #f9fafb; padding: 10px; border-radius: 6px; }
    .step img { width: 100%; border-radius: 4px; border: 1px solid #e5e7eb; }
    .step-title { font-weight: 600; margin-bottom: 8px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
    .mobile { background: #dbeafe; color: #1d4ed8; }
    .desktop { background: #dcfce7; color: #166534; }
  </style>
</head>
<body>
  <h1>🚚 Umzugscheck Flow Export</h1>
  <div class="meta">
    <p><strong>Generated:</strong> ${new Date().toISOString()}</p>
    <p><strong>Mode:</strong> ${mode === 'top10' ? 'Top 10 Flows' : mode === 'custom' ? 'Custom Selection' : `All Flows (${uniqueFlowCount})`}</p>
    <p><strong>Total:</strong> ${filteredScreenshots.length} Steps | ${mobileCount} Mobile | ${desktopCount} Desktop</p>
  </div>
`;

      for (const flow of manifestData.flows) {
        html += `  <div class="flow">
    <h2>${flow.rank}. ${flow.name}</h2>
    <p><code>${flow.id}</code></p>
    <div class="steps">
`;
        for (const step of flow.steps) {
          html += `      <div class="step">
        <div class="step-title">Step ${step.step}</div>
`;
          if (step.mobileUrl) {
            html += `        <p><span class="badge mobile">Mobile</span></p>
        <a href="${step.mobileUrl}" target="_blank"><img src="${step.mobileUrl}" alt="Step ${step.step} Mobile" loading="lazy"></a>
`;
          }
          if (step.desktopUrl) {
            html += `        <p><span class="badge desktop">Desktop</span></p>
        <a href="${step.desktopUrl}" target="_blank"><img src="${step.desktopUrl}" alt="Step ${step.step} Desktop" loading="lazy"></a>
`;
          }
          html += `      </div>
`;
        }
        html += `    </div>
  </div>
`;
      }

      html += `</body>
</html>`;

      // Add generated files to ZIP
      zip.file("manifest.json", JSON.stringify(manifestData, null, 2));
      zip.file("summary.md", markdown);
      zip.file("summary.html", html);

      // Fetch all screenshots from database URLs
      for (const shot of filteredScreenshots) {
        const prefix = `${String(shot.rank).padStart(2, '0')}-${shot.flowId}-step${shot.stepNumber}`;
        
        // Mobile screenshot
        if (shot.mobileUrl) {
          setStatus(`Lade Mobile: ${shot.flowName} Step ${shot.stepNumber}...`);
          try {
            const response = await fetch(shot.mobileUrl);
            if (response.ok) {
              const blob = await response.blob();
              mobileFolder?.file(`${prefix}-mobile.png`, blob);
            } else {
              failed.push({ flowId: shot.flowId, stepNumber: shot.stepNumber, type: 'mobile', url: shot.mobileUrl });
            }
          } catch (err) {
            console.error(`Failed to fetch mobile screenshot for ${shot.flowId} step ${shot.stepNumber}:`, err);
            failed.push({ flowId: shot.flowId, stepNumber: shot.stepNumber, type: 'mobile', url: shot.mobileUrl });
          }
          current++;
          setProgress((current / total) * 100);
        }

        // Desktop screenshot
        if (shot.desktopUrl) {
          setStatus(`Lade Desktop: ${shot.flowName} Step ${shot.stepNumber}...`);
          try {
            const response = await fetch(shot.desktopUrl);
            if (response.ok) {
              const blob = await response.blob();
              desktopFolder?.file(`${prefix}-desktop.png`, blob);
            } else {
              failed.push({ flowId: shot.flowId, stepNumber: shot.stepNumber, type: 'desktop', url: shot.desktopUrl });
            }
          } catch (err) {
            console.error(`Failed to fetch desktop screenshot for ${shot.flowId} step ${shot.stepNumber}:`, err);
            failed.push({ flowId: shot.flowId, stepNumber: shot.stepNumber, type: 'desktop', url: shot.desktopUrl });
          }
          current++;
          setProgress((current / total) * 100);
        }
      }

      setFailedDownloads(failed);

      // Generate ZIP
      setStatus("Erstelle ZIP-Datei...");
      const content = await zip.generateAsync({ type: "blob" });
      
      // Download
      const filename = mode === "top10" 
        ? `umzugscheck-top10-flows-${new Date().toISOString().split('T')[0]}.zip`
        : mode === "custom"
        ? `umzugscheck-custom-${uniqueFlowCount}-flows-${new Date().toISOString().split('T')[0]}.zip`
        : `umzugscheck-all-${uniqueFlowCount}-flows-${new Date().toISOString().split('T')[0]}.zip`;
      saveAs(content, filename);
      
      setStatus(failed.length > 0 
        ? `Download gestartet! (${failed.length} fehlgeschlagen)` 
        : "Download gestartet!"
      );
      setCompleted(true);
    } catch (error) {
      console.error("Download error:", error);
      setStatus("Fehler beim Download. Bitte versuche es erneut.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Toggle flow selection
  const toggleFlowSelection = (flowId: string) => {
    const newSet = new Set(selectedFlowIds);
    if (newSet.has(flowId)) {
      newSet.delete(flowId);
    } else {
      newSet.add(flowId);
    }
    setSelectedFlowIds(newSet);
  };

  // Select/deselect all flows
  const toggleAllFlows = (select: boolean) => {
    if (select) {
      setSelectedFlowIds(new Set(allFlows.map(f => f.id)));
    } else {
      setSelectedFlowIds(new Set());
    }
  };

  // Screenshot status stats
  const statusStats = useMemo(() => {
    const complete = allFlows.filter(f => f.screenshotStatus === 'complete').length;
    const partial = allFlows.filter(f => f.screenshotStatus === 'partial').length;
    const none = allFlows.filter(f => f.screenshotStatus === 'none').length;
    return { complete, partial, none };
  }, [allFlows]);

  if (isLoading && allFlows.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center gap-3">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span>Lade Screenshots aus Datenbank...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Flow Screenshot Export</CardTitle>
          <CardDescription>
            {mode === "top10" 
              ? `Top 10 Flows - ${filteredScreenshots.length} Steps`
              : mode === "custom"
              ? `${selectedFlowIds.size} ausgewählte Flows - ${filteredScreenshots.length} Steps`
              : `Alle ${uniqueFlowCount} Flows - ${filteredScreenshots.length} Steps`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selector + Sync Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Export-Modus:</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchAllFlows(true)}
                disabled={isSyncing}
                className="h-8 gap-1.5 text-xs"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Synchronisiere...' : 'Sync'}
              </Button>
            </div>
            <Select value={mode} onValueChange={(v: ExportMode) => setMode(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top10">Top 10 Flows</SelectItem>
                <SelectItem value="all">Alle Flows ({allFlows.length})</SelectItem>
                <SelectItem value="custom">Benutzerdefiniert ({selectedFlowIds.size})</SelectItem>
              </SelectContent>
            </Select>
            {lastSynced && (
              <p className="text-xs text-muted-foreground">
                Zuletzt synchronisiert: {lastSynced.toLocaleTimeString('de-CH')}
              </p>
            )}
          </div>

          {/* Custom Flow Selector */}
          {mode === "custom" && (
            <Collapsible open={showFlowSelector} onOpenChange={setShowFlowSelector}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>Flows auswählen ({selectedFlowIds.size} von {allFlows.length})</span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${showFlowSelector ? 'rotate-90' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-2">
                <div className="flex gap-2 mb-2">
                  <Button variant="outline" size="sm" onClick={() => toggleAllFlows(true)}>
                    <CheckCheck className="h-3.5 w-3.5 mr-1" />
                    Alle
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toggleAllFlows(false)}>
                    <XCircle className="h-3.5 w-3.5 mr-1" />
                    Keine
                  </Button>
                </div>
                <ScrollArea className="h-48 border rounded-md p-2">
                  <div className="space-y-1">
                    {allFlows.map(flow => (
                      <div 
                        key={flow.id}
                        className="flex items-center gap-2 p-1.5 hover:bg-muted/50 rounded cursor-pointer group"
                        onClick={() => toggleFlowSelection(flow.id)}
                      >
                        <Checkbox 
                          checked={selectedFlowIds.has(flow.id)}
                          onCheckedChange={() => toggleFlowSelection(flow.id)}
                        />
                        <span className="text-sm flex-1 truncate">{flow.name}</span>
                        {flow.screenshotStatus === 'complete' && (
                          <div className="flex items-center gap-1" title="Alle Screenshots vorhanden">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                          </div>
                        )}
                        {flow.screenshotStatus === 'partial' && (
                          <div 
                            className="flex items-center gap-1 cursor-help" 
                            title={`${flow.name}: Einige Screenshots fehlen - Flow auswählen für Details`}
                          >
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          </div>
                        )}
                        {flow.screenshotStatus === 'none' && (
                          <div className="flex items-center gap-1" title="Keine Screenshots vorhanden">
                            <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Filters */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Screenshot-Status
              </label>
              <Select value={screenshotFilter} onValueChange={(v: ScreenshotFilter) => setScreenshotFilter(v)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle ({allFlows.length})</SelectItem>
                  <SelectItem value="complete">Vollständig ({statusStats.complete})</SelectItem>
                  <SelectItem value="partial">Teilweise ({statusStats.partial})</SelectItem>
                  <SelectItem value="none">Keine ({statusStats.none})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
                Geräte
              </label>
              <Select value={deviceFilter} onValueChange={(v: DeviceFilter) => setDeviceFilter(v)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Mobile + Desktop</SelectItem>
                  <SelectItem value="mobile">Nur Mobile</SelectItem>
                  <SelectItem value="desktop">Nur Desktop</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-5 gap-2 text-center">
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-xl font-bold text-primary">{uniqueFlowCount}</div>
              <div className="text-[10px] text-muted-foreground">Flows</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-xl font-bold text-amber-500">{filteredScreenshots.length}</div>
              <div className="text-[10px] text-muted-foreground">Steps</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-xl font-bold text-blue-500">{mobileCount}</div>
              <div className="text-[10px] text-muted-foreground">Mobile</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-xl font-bold text-green-500">{desktopCount}</div>
              <div className="text-[10px] text-muted-foreground">Desktop</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-xl font-bold text-purple-500">{estimatedSizeMB}</div>
              <div className="text-[10px] text-muted-foreground">MB (ca.)</div>
            </div>
          </div>

          {/* PROMINENT Auto-Capture Button - Always visible when screenshots are missing */}
          {flowsWithoutScreenshots.length > 0 && (
            <div className="space-y-3">
              {/* Big prominent button */}
              <Button 
                onClick={captureMissingScreenshots}
                disabled={isCapturing || isAutoRefreshing}
                className="w-full h-14 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
                size="lg"
              >
                {isCapturing ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                    Erfasse Screenshots... {captureProgress.current}/{captureProgress.total}
                  </>
                ) : isAutoRefreshing ? (
                  <>
                    <RefreshCw className="h-6 w-6 mr-3 animate-spin" />
                    Warte auf Screenshots... (Auto-Refresh)
                  </>
                ) : (
                  <>
                    <Camera className="h-6 w-6 mr-3" />
                    🚀 Auto-Capture starten ({flowsWithoutScreenshots.length} fehlende Flows)
                  </>
                )}
              </Button>
              
              {/* Info box */}
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200 block">
                      {flowsWithoutScreenshots.length} Flows ohne Screenshots
                    </span>
                    <p className="text-xs text-amber-700/80 dark:text-amber-300/80">
                      Klicke auf "Auto-Capture" um automatisch alle fehlenden Screenshots zu erfassen.
                      Die Screenshots werden im Hintergrund erstellt und nach Fertigstellung hier angezeigt.
                    </p>
                    {flowsWithoutScreenshots.length <= 5 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {flowsWithoutScreenshots.map(f => (
                          <Badge key={f.id} variant="outline" className="text-xs bg-white/50">
                            {f.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* All screenshots complete - success state */}
          {flowsWithoutScreenshots.length === 0 && filteredScreenshots.length > 0 && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">
                  Alle {uniqueFlowCount} Flows haben Screenshots - bereit zum Download!
                </span>
              </div>
            </div>
          )}

          {/* Contents Preview */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm">Inhalt der ZIP-Datei:</h3>
            <div className="space-y-2 text-sm">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Dokumentation (dynamisch generiert)</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileJson className="h-4 w-4 text-blue-500" />
                <span>manifest.json</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">mit URLs</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4 text-green-500" />
                <span>summary.md</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileCode className="h-4 w-4 text-orange-500" />
                <span>summary.html</span>
                <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">mit Previews</span>
              </div>
              
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide pt-2">Screenshots (aus Datenbank)</p>
              {deviceFilter !== 'desktop' && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Image className="h-4 w-4 text-purple-500" />
                  <span>screenshots-mobile/</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">{mobileCount} PNG</span>
                </div>
              )}
              {deviceFilter !== 'mobile' && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Image className="h-4 w-4 text-teal-500" />
                  <span>screenshots-desktop/</span>
                  <span className="text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded">{desktopCount} PNG</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-muted-foreground pt-1">
                <HardDrive className="h-4 w-4 text-gray-500" />
                <span>Geschätzte Größe:</span>
                <span className="text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">~{estimatedSizeMB} MB</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          {(isDownloading || isCapturing) && (
            <div className="space-y-2">
              <Progress value={isCapturing ? (captureProgress.current / captureProgress.total) * 100 : progress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">{status}</p>
            </div>
          )}

          {/* Failed Downloads */}
          {failedDownloads.length > 0 && (
            <div className="flex items-center justify-between gap-2 bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">{failedDownloads.length} Downloads fehlgeschlagen</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={retryFailedDownloads}
                disabled={isDownloading}
                className="h-7 text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Wiederholen
              </Button>
            </div>
          )}

          {/* Success Message */}
          {completed && (
            <div className="flex items-center gap-2 justify-center text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-medium">Download erfolgreich! ({totalScreenshots} Screenshots)</span>
            </div>
          )}

          {/* Download Button */}
          <Button 
            onClick={downloadZip} 
            disabled={isDownloading || isCapturing || filteredScreenshots.length === 0}
            className="w-full h-12 text-base"
            size="lg"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Wird heruntergeladen...
              </>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                ZIP herunterladen ({totalScreenshots} Screenshots, ~{estimatedSizeMB} MB)
              </>
            )}
          </Button>

          {filteredScreenshots.length === 0 && !isLoading && (
            <p className="text-sm text-muted-foreground text-center">
              Keine Screenshots gefunden. Verwende "Auto-Capture" oder ändere die Filter.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportDownload;

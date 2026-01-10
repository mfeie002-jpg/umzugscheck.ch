import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileJson, FileText, Image, Loader2, CheckCircle2, Package, FileCode, AlertCircle, ChevronDown } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "@/integrations/supabase/client";

// Top 10 Flow IDs - hardcoded for quick access
const TOP_10_FLOW_IDS = [
  { rank: 1, id: "umzugsofferten-ultimate-best36", name: "Ultimate Best36" },
  { rank: 2, id: "umzugsofferten-v1", name: "V1 Control" },
  { rank: 3, id: "umzugsofferten-v7", name: "V7 Ultimate" },
  { rank: 4, id: "v3a", name: "V3a" },
  { rank: 5, id: "v3b", name: "V3b" },
  { rank: 6, id: "v3c", name: "V3c" },
  { rank: 7, id: "v3d", name: "V3d" },
  { rank: 8, id: "v3e", name: "V3e" },
  { rank: 9, id: "umzugsofferten-v2", name: "V2" },
  { rank: 10, id: "umzugsofferten-v2e", name: "V2e" },
];

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
}

type ExportMode = "top10" | "all";

const ExportDownload = () => {
  const [mode, setMode] = useState<ExportMode>("top10");
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [completed, setCompleted] = useState(false);
  const [screenshots, setScreenshots] = useState<StepScreenshot[]>([]);
  const [allFlows, setAllFlows] = useState<FlowInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all available flows from DB
  useEffect(() => {
    const fetchAllFlows = async () => {
      try {
        const { data } = await supabase
          .from('flow_analysis_runs')
          .select('flow_id, flow_name')
          .order('created_at', { ascending: false });
        
        if (data) {
          // Deduplicate by flow_id
          const uniqueFlows = new Map<string, FlowInfo>();
          data.forEach((row, idx) => {
            if (!uniqueFlows.has(row.flow_id)) {
              uniqueFlows.set(row.flow_id, {
                id: row.flow_id,
                name: row.flow_name || row.flow_id,
                rank: idx + 1,
              });
            }
          });
          setAllFlows(Array.from(uniqueFlows.values()));
        }
      } catch (err) {
        console.error("Failed to fetch all flows:", err);
      }
    };
    fetchAllFlows();
  }, []);

  // Get flow list based on mode
  const targetFlows = useMemo(() => {
    if (mode === "top10") {
      return TOP_10_FLOW_IDS;
    }
    // "all" mode - use all flows from DB
    return allFlows.map((f, idx) => ({
      rank: idx + 1,
      id: f.id,
      name: f.name,
    }));
  }, [mode, allFlows]);

  // Fetch screenshots when mode or targetFlows changes
  useEffect(() => {
    const fetchScreenshots = async () => {
      if (targetFlows.length === 0) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);

      try {
        const flowIds = targetFlows.map(f => f.id);

        // Get ALL runs for these flows (not just completed)
        const { data: allRuns } = await supabase
          .from('flow_analysis_runs')
          .select('id, flow_id, status, created_at')
          .in('flow_id', flowIds)
          .order('created_at', { ascending: false });

        // Build a map: flow_id -> best run_id (prefer completed, fallback to latest)
        const flowToRunId = new Map<string, string>();
        const completedRunIds: string[] = [];
        
        for (const run of allRuns || []) {
          if (!flowToRunId.has(run.flow_id)) {
            flowToRunId.set(run.flow_id, run.id);
          }
          if (run.status === 'completed') {
            completedRunIds.push(run.id);
            // Override with completed run if we had a non-completed one
            flowToRunId.set(run.flow_id, run.id);
          }
        }

        const runIdsToQuery = Array.from(flowToRunId.values());

        if (runIdsToQuery.length === 0) {
          setScreenshots([]);
          setIsLoading(false);
          return;
        }

        // Get step metrics for these runs
        const { data, error: queryError } = await supabase
          .from('flow_step_metrics')
          .select('flow_id, step_number, mobile_screenshot_url, desktop_screenshot_url, created_at, run_id')
          .in('run_id', runIdsToQuery)
          .order('created_at', { ascending: false });

        if (queryError) throw queryError;

        // Deduplicate: keep only latest per flow_id + step_number from completed runs
        const latestMap = new Map<string, StepScreenshot>();
        
        for (const row of data || []) {
          const key = `${row.flow_id}-${row.step_number}`;
          if (!latestMap.has(key) && (row.mobile_screenshot_url || row.desktop_screenshot_url)) {
            const flowInfo = targetFlows.find(f => f.id === row.flow_id);
            if (flowInfo) {
              latestMap.set(key, {
                flowId: row.flow_id,
                flowName: flowInfo.name,
                rank: flowInfo.rank,
                stepNumber: row.step_number,
                mobileUrl: row.mobile_screenshot_url,
                desktopUrl: row.desktop_screenshot_url,
              });
            }
          }
        }

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

  const mobileCount = screenshots.filter(s => s.mobileUrl).length;
  const desktopCount = screenshots.filter(s => s.desktopUrl).length;
  const totalScreenshots = mobileCount + desktopCount;
  const uniqueFlowCount = new Set(screenshots.map(s => s.flowId)).size;

  const downloadZip = async () => {
    setIsDownloading(true);
    setProgress(0);
    setCompleted(false);

    try {
      const zip = new JSZip();
      const mobileFolder = zip.folder("screenshots-mobile");
      const desktopFolder = zip.folder("screenshots-desktop");
      
      const total = totalScreenshots;
      let current = 0;

      // Generate dynamic JSON manifest
      const manifestData = {
        generatedAt: new Date().toISOString(),
        mode: mode,
        totalFlows: uniqueFlowCount,
        totalSteps: screenshots.length,
        mobileScreenshots: mobileCount,
        desktopScreenshots: desktopCount,
        flows: targetFlows.filter(f => screenshots.some(s => s.flowId === f.id)).map(f => ({
          rank: f.rank,
          id: f.id,
          name: f.name,
          steps: screenshots.filter(s => s.flowId === f.id).map(s => ({
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
      markdown += `**Mode:** ${mode === 'top10' ? 'Top 10 Flows' : `All Flows (${uniqueFlowCount})`}\n`;
      markdown += `**Total Steps:** ${screenshots.length}\n`;
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
    <p><strong>Mode:</strong> ${mode === 'top10' ? 'Top 10 Flows' : `All Flows (${uniqueFlowCount})`}</p>
    <p><strong>Total:</strong> ${screenshots.length} Steps | ${mobileCount} Mobile | ${desktopCount} Desktop</p>
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
      for (const shot of screenshots) {
        const prefix = `${String(shot.rank).padStart(2, '0')}-${shot.flowId}-step${shot.stepNumber}`;
        
        // Mobile screenshot
        if (shot.mobileUrl) {
          setStatus(`Lade Mobile: ${shot.flowName} Step ${shot.stepNumber}...`);
          try {
            const response = await fetch(shot.mobileUrl);
            if (response.ok) {
              const blob = await response.blob();
              mobileFolder?.file(`${prefix}-mobile.png`, blob);
            }
          } catch (err) {
            console.error(`Failed to fetch mobile screenshot for ${shot.flowId} step ${shot.stepNumber}:`, err);
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
            }
          } catch (err) {
            console.error(`Failed to fetch desktop screenshot for ${shot.flowId} step ${shot.stepNumber}:`, err);
          }
          current++;
          setProgress((current / total) * 100);
        }
      }

      // Generate ZIP
      setStatus("Erstelle ZIP-Datei...");
      const content = await zip.generateAsync({ type: "blob" });
      
      // Download
      const filename = mode === "top10" 
        ? `umzugscheck-top10-flows-${new Date().toISOString().split('T')[0]}.zip`
        : `umzugscheck-all-${uniqueFlowCount}-flows-${new Date().toISOString().split('T')[0]}.zip`;
      saveAs(content, filename);
      
      setStatus("Download gestartet!");
      setCompleted(true);
    } catch (error) {
      console.error("Download error:", error);
      setStatus("Fehler beim Download. Bitte versuche es erneut.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
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
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Flow Screenshot Export</CardTitle>
          <CardDescription>
            {mode === "top10" 
              ? `Top 10 Flows - ${screenshots.length} Steps`
              : `Alle ${uniqueFlowCount} Flows - ${screenshots.length} Steps`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Export-Modus:</label>
            <Select value={mode} onValueChange={(v: ExportMode) => setMode(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top10">Top 10 Flows</SelectItem>
                <SelectItem value="all">Alle Flows ({allFlows.length})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-xl font-bold text-primary">{uniqueFlowCount}</div>
              <div className="text-[10px] text-muted-foreground">Flows</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-2">
              <div className="text-xl font-bold text-amber-500">{screenshots.length}</div>
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
          </div>

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
              <div className="flex items-center gap-2 text-muted-foreground">
                <Image className="h-4 w-4 text-purple-500" />
                <span>screenshots-mobile/</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">{mobileCount} PNG</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Image className="h-4 w-4 text-teal-500" />
                <span>screenshots-desktop/</span>
                <span className="text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded">{desktopCount} PNG</span>
              </div>
            </div>
          </div>

          {/* Progress */}
          {isDownloading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center">{status}</p>
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
            disabled={isDownloading || screenshots.length === 0}
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
                ZIP herunterladen ({totalScreenshots} Screenshots)
              </>
            )}
          </Button>

          {screenshots.length === 0 && !isLoading && (
            <p className="text-sm text-muted-foreground text-center">
              Keine Screenshots gefunden. Bitte zuerst Screenshots erfassen.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportDownload;

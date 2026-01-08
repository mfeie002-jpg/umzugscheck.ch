import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, FileJson, FileText, Image, Loader2, CheckCircle2, Package, FileCode, AlertCircle } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "@/integrations/supabase/client";

// Top 10 Flow IDs in ranking order
const TOP_10_FLOW_IDS = [
  { rank: 1, id: "chatgpt-flow-1", name: "ChatGPT Flow 1" },
  { rank: 2, id: "v8a", name: "V8a Decision-Free" },
  { rank: 3, id: "v1f", name: "V1f Sticky CTA" },
  { rank: 4, id: "v6a", name: "V6a Ultimate" },
  { rank: 5, id: "v5f", name: "V5f Marketplace" },
  { rank: 6, id: "umzugsofferten-ultimate-best36", name: "Ultimate Best36" },
  { rank: 7, id: "v6f", name: "V6f Ultimate" },
  { rank: 8, id: "ultimate-v7", name: "Ultimate V7" },
  { rank: 9, id: "v9c", name: "V9c Zero Friction" },
  { rank: 10, id: "v2-archetyp", name: "V2 Archetyp" },
];

interface StepScreenshot {
  flowId: string;
  flowName: string;
  rank: number;
  stepNumber: number;
  mobileUrl: string | null;
  desktopUrl: string | null;
}

const ExportDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [completed, setCompleted] = useState(false);
  const [screenshots, setScreenshots] = useState<StepScreenshot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch screenshots from database on mount
  useEffect(() => {
    const fetchScreenshots = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const flowIds = TOP_10_FLOW_IDS.map(f => f.id);

        // First get only completed runs for these flows
        const { data: completedRuns } = await supabase
          .from('flow_analysis_runs')
          .select('id, flow_id')
          .in('flow_id', flowIds)
          .eq('status', 'completed')
          .order('created_at', { ascending: false });

        const completedRunIds = completedRuns?.map(r => r.id) || [];

        // Get latest screenshots per flow/step from completed runs only
        let query = supabase
          .from('flow_step_metrics')
          .select('flow_id, step_number, mobile_screenshot_url, desktop_screenshot_url, created_at, run_id')
          .in('flow_id', flowIds)
          .order('created_at', { ascending: false });

        if (completedRunIds.length > 0) {
          query = query.in('run_id', completedRunIds);
        }

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;

        // Deduplicate: keep only latest per flow_id + step_number from completed runs
        const latestMap = new Map<string, StepScreenshot>();
        
        for (const row of data || []) {
          const key = `${row.flow_id}-${row.step_number}`;
          if (!latestMap.has(key) && (row.mobile_screenshot_url || row.desktop_screenshot_url)) {
            const flowInfo = TOP_10_FLOW_IDS.find(f => f.id === row.flow_id);
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
  }, []);

  const mobileCount = screenshots.filter(s => s.mobileUrl).length;
  const desktopCount = screenshots.filter(s => s.desktopUrl).length;
  const totalScreenshots = mobileCount + desktopCount;

  const downloadZip = async () => {
    setIsDownloading(true);
    setProgress(0);
    setCompleted(false);

    try {
      const zip = new JSZip();
      const mobileFolder = zip.folder("screenshots-mobile");
      const desktopFolder = zip.folder("screenshots-desktop");
      
      // 6 doc files + all screenshots
      const total = 6 + totalScreenshots;
      let current = 0;

      // Fetch Summary JSON
      setStatus("Lade Zusammenfassung JSON...");
      try {
        const jsonResponse = await fetch("/exports/top10-flows-mobile-complete.json");
        if (jsonResponse.ok) {
          const jsonData = await jsonResponse.text();
          zip.file("top10-flows-mobile-complete.json", jsonData);
        }
      } catch (e) { console.warn("Could not fetch summary JSON"); }
      current++;
      setProgress((current / total) * 100);

      // Fetch Summary Markdown
      setStatus("Lade Zusammenfassung Markdown...");
      try {
        const mdResponse = await fetch("/exports/top10-flows-mobile-complete.md");
        if (mdResponse.ok) {
          const mdData = await mdResponse.text();
          zip.file("top10-flows-mobile-complete.md", mdData);
        }
      } catch (e) { console.warn("Could not fetch summary MD"); }
      current++;
      setProgress((current / total) * 100);

      // Fetch Summary HTML
      setStatus("Lade Zusammenfassung HTML...");
      try {
        const htmlResponse = await fetch("/exports/top10-flows-mobile-complete.html");
        if (htmlResponse.ok) {
          const htmlData = await htmlResponse.text();
          zip.file("top10-flows-mobile-complete.html", htmlData);
        }
      } catch (e) { console.warn("Could not fetch summary HTML"); }
      current++;
      setProgress((current / total) * 100);

      // Fetch All-Steps JSON
      setStatus("Lade Alle Steps JSON...");
      try {
        const allStepsJsonResponse = await fetch("/exports/top10-flows-all-steps-mobile.json");
        if (allStepsJsonResponse.ok) {
          const allStepsJsonData = await allStepsJsonResponse.text();
          zip.file("top10-flows-all-steps-mobile.json", allStepsJsonData);
        }
      } catch (e) { console.warn("Could not fetch all-steps JSON"); }
      current++;
      setProgress((current / total) * 100);

      // Fetch All-Steps Markdown
      setStatus("Lade Alle Steps Markdown...");
      try {
        const allStepsMdResponse = await fetch("/exports/top10-flows-all-steps-mobile.md");
        if (allStepsMdResponse.ok) {
          const allStepsMdData = await allStepsMdResponse.text();
          zip.file("top10-flows-all-steps-mobile.md", allStepsMdData);
        }
      } catch (e) { console.warn("Could not fetch all-steps MD"); }
      current++;
      setProgress((current / total) * 100);

      // Fetch All-Steps HTML
      setStatus("Lade Alle Steps HTML...");
      try {
        const allStepsHtmlResponse = await fetch("/exports/top10-flows-all-steps-mobile.html");
        if (allStepsHtmlResponse.ok) {
          const allStepsHtmlData = await allStepsHtmlResponse.text();
          zip.file("top10-flows-all-steps-mobile.html", allStepsHtmlData);
        }
      } catch (e) { console.warn("Could not fetch all-steps HTML"); }
      current++;
      setProgress((current / total) * 100);

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

      // Generate manifest of what's included
      const manifest = {
        generatedAt: new Date().toISOString(),
        totalFlows: TOP_10_FLOW_IDS.length,
        totalSteps: screenshots.length,
        mobileScreenshots: mobileCount,
        desktopScreenshots: desktopCount,
        flows: TOP_10_FLOW_IDS.map(f => ({
          rank: f.rank,
          id: f.id,
          name: f.name,
          steps: screenshots.filter(s => s.flowId === f.id).map(s => ({
            step: s.stepNumber,
            hasMobile: !!s.mobileUrl,
            hasDesktop: !!s.desktopUrl,
          })),
        })),
      };
      zip.file("manifest.json", JSON.stringify(manifest, null, 2));

      // Generate ZIP
      setStatus("Erstelle ZIP-Datei...");
      const content = await zip.generateAsync({ type: "blob" });
      
      // Download
      saveAs(content, `umzugscheck-top10-flows-all-steps-${new Date().toISOString().split('T')[0]}.zip`);
      
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
          <CardTitle className="text-2xl">Top 10 Flows - Vollständiger Export</CardTitle>
          <CardDescription>
            Alle {screenshots.length} Steps mit Mobile & Desktop Screenshots
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-primary">{screenshots.length}</div>
              <div className="text-xs text-muted-foreground">Steps</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-500">{mobileCount}</div>
              <div className="text-xs text-muted-foreground">Mobile</div>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-500">{desktopCount}</div>
              <div className="text-xs text-muted-foreground">Desktop</div>
            </div>
          </div>

          {/* Contents Preview */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm">Inhalt der ZIP-Datei:</h3>
            <div className="space-y-2 text-sm">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Dokumentation</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileJson className="h-4 w-4 text-blue-500" />
                <span>top10-flows-mobile-complete.json</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4 text-green-500" />
                <span>top10-flows-mobile-complete.md</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileCode className="h-4 w-4 text-orange-500" />
                <span>top10-flows-mobile-complete.html</span>
              </div>
              
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide pt-2">Alle Steps einzeln</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileJson className="h-4 w-4 text-blue-500" />
                <span>top10-flows-all-steps-mobile.json</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{screenshots.length} Steps</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4 text-green-500" />
                <span>top10-flows-all-steps-mobile.md</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileCode className="h-4 w-4 text-orange-500" />
                <span>top10-flows-all-steps-mobile.html</span>
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

          {/* Individual Links */}
          <div className="pt-4 border-t space-y-3">
            <p className="text-xs text-muted-foreground text-center">
              Oder einzelne Dateien herunterladen:
            </p>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Zusammenfassung:</p>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button variant="outline" size="sm" asChild>
                  <a href="/exports/top10-flows-mobile-complete.json" download>JSON</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/exports/top10-flows-mobile-complete.md" download>MD</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/exports/top10-flows-mobile-complete.html" download>HTML</a>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Alle {screenshots.length} Steps:</p>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button variant="outline" size="sm" asChild>
                  <a href="/exports/top10-flows-all-steps-mobile.json" download>JSON</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/exports/top10-flows-all-steps-mobile.md" download>MD</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/exports/top10-flows-all-steps-mobile.html" download>HTML</a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportDownload;

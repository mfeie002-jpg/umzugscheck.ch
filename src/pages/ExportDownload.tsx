import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, FileJson, FileText, Image, Loader2, CheckCircle2, Package } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const FLOWS_DATA = {
  exportDate: "2025-01-07T18:26:00Z",
  flows: [
    { rank: 1, id: "chatgpt-flow-1", name: "ChatGPT Flow 1", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/18b93b20-0e44-4f42-8e72-a7c212a0a464/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767810355830.png" },
    { rank: 2, id: "v8a", name: "V8a Decision-Free", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e53e92dd-162f-4804-9e69-8b18956eadca/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767810357213.png" },
    { rank: 3, id: "v1f", name: "V1f Sticky CTA", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d22a26b8-79f7-41c9-b2cf-b924651a6bf8/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767810362403.png" },
    { rank: 4, id: "v6a", name: "V6a Ultimate", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/24a822f6-57d7-410e-a6c5-dee4c144732a/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767810364138.png" },
    { rank: 5, id: "v5f", name: "V5f Marketplace", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a1dff45c-429d-48eb-9b82-c24b5d8cb19a/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767810364908.png" },
    { rank: 6, id: "best36", name: "Ultimate Best36", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/0e70193a-560d-412d-983d-d37451df2ab6/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767810359229.png" },
    { rank: 7, id: "v6f", name: "V6f Ultimate", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6ab38599-1832-476c-a1b3-511b02d9772e/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767810361038.png" },
    { rank: 8, id: "v7", name: "Ultimate V7", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/bdb57f3c-e35f-497e-aaf4-73122788f1c6/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767810365612.png" },
    { rank: 9, id: "v9c", name: "V9c Zero Friction", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/4f28c796-62d2-4181-9027-4486d1371826/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767810363994.png" },
    { rank: 10, id: "v2-archetyp", name: "V2 Archetyp", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ae52cc49-980e-4e9a-9a3d-5c35a224eb4f/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767810361631.png" },
  ]
};

const ExportDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [completed, setCompleted] = useState(false);

  const downloadZip = async () => {
    setIsDownloading(true);
    setProgress(0);
    setCompleted(false);

    try {
      const zip = new JSZip();
      const screenshotsFolder = zip.folder("screenshots");
      const total = FLOWS_DATA.flows.length + 2; // screenshots + 2 files

      // Fetch JSON
      setStatus("Lade JSON...");
      const jsonResponse = await fetch("/exports/top10-flows-analysis.json");
      const jsonData = await jsonResponse.text();
      zip.file("top10-flows-analysis.json", jsonData);
      setProgress(1 / total * 100);

      // Fetch Markdown
      setStatus("Lade Markdown...");
      const mdResponse = await fetch("/exports/top10-flows-analysis.md");
      const mdData = await mdResponse.text();
      zip.file("top10-flows-analysis.md", mdData);
      setProgress(2 / total * 100);

      // Fetch Screenshots
      for (let i = 0; i < FLOWS_DATA.flows.length; i++) {
        const flow = FLOWS_DATA.flows[i];
        setStatus(`Lade Screenshot ${i + 1}/10: ${flow.name}...`);
        
        try {
          const response = await fetch(flow.screenshot);
          const blob = await response.blob();
          screenshotsFolder?.file(`${String(flow.rank).padStart(2, '0')}-${flow.id}.png`, blob);
        } catch (err) {
          console.error(`Failed to fetch screenshot for ${flow.name}:`, err);
          // Continue with other screenshots
        }
        
        setProgress(((i + 3) / total) * 100);
      }

      // Generate ZIP
      setStatus("Erstelle ZIP-Datei...");
      const content = await zip.generateAsync({ type: "blob" });
      
      // Download
      saveAs(content, `umzugscheck-top10-flows-${new Date().toISOString().split('T')[0]}.zip`);
      
      setStatus("Download gestartet!");
      setCompleted(true);
    } catch (error) {
      console.error("Download error:", error);
      setStatus("Fehler beim Download. Bitte versuche es erneut.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Top 10 Flows Export</CardTitle>
          <CardDescription>
            Lade alle Flow-Daten als ZIP herunter für ChatGPT Analyse
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contents Preview */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm">Inhalt der ZIP-Datei:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileJson className="h-4 w-4 text-blue-500" />
                <span>top10-flows-analysis.json</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4 text-green-500" />
                <span>top10-flows-analysis.md</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Image className="h-4 w-4 text-purple-500" />
                <span>screenshots/ (10 PNG-Dateien)</span>
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
              <span className="font-medium">Download erfolgreich!</span>
            </div>
          )}

          {/* Download Button */}
          <Button 
            onClick={downloadZip} 
            disabled={isDownloading}
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
                ZIP herunterladen
              </>
            )}
          </Button>

          {/* Individual Links */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Oder einzelne Dateien herunterladen:
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" size="sm" asChild>
                <a href="/exports/top10-flows-analysis.json" download>JSON</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/exports/top10-flows-analysis.md" download>Markdown</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportDownload;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Download, FileJson, FileText, Image, Loader2, CheckCircle2, Package, FileCode } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const MOBILE_SCREENSHOTS = [
  { rank: 1, id: "chatgpt-flow-1", name: "ChatGPT Flow 1", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8f2b6da6-d9c9-4872-93d8-86fa02e75024/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767811437967.png" },
  { rank: 2, id: "v8a", name: "V8a Decision-Free", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9f07c6b5-7ca7-493c-8eaf-e494b2fc14b1/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767811438779.png" },
  { rank: 3, id: "v1f", name: "V1f Sticky CTA", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c253b32b-e0b8-4cd8-ba07-fafd8a3d197a/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767811443082.png" },
  { rank: 4, id: "v6a", name: "V6a Ultimate", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6e5b2e03-62cd-4a99-856f-9b7773dc74d0/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767811440648.png" },
  { rank: 5, id: "v5f", name: "V5f Marketplace", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/448eb988-dde7-45fe-8b90-4342fbda728a/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767811440956.png" },
  { rank: 6, id: "best36", name: "Ultimate Best36", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b1948636-c114-4ac0-8c6b-0e041f3bdab3/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767811443001.png" },
  { rank: 7, id: "v6f", name: "V6f Ultimate", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/16e96953-7b7c-49fc-8b60-57526f77fd3d/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767811444607.png" },
  { rank: 8, id: "v7", name: "Ultimate V7", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ca4cd521-0e09-4516-8260-c57baf7978bf/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767811448637.png" },
  { rank: 9, id: "v9c", name: "V9c Zero Friction", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ca37ffe4-55f2-48a7-b855-9c7e56a3108b/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767811443750.png" },
  { rank: 10, id: "v2-archetyp", name: "V2 Archetyp", screenshot: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/8d592687-0e00-44ad-b93e-dec5db3678ed/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1767811444216.png" },
];

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
      const screenshotsFolder = zip.folder("mobile-screenshots");
      const total = MOBILE_SCREENSHOTS.length + 3; // screenshots + 3 files

      // Fetch JSON
      setStatus("Lade JSON...");
      const jsonResponse = await fetch("/exports/top10-flows-mobile-complete.json");
      const jsonData = await jsonResponse.text();
      zip.file("top10-flows-mobile-complete.json", jsonData);
      setProgress(1 / total * 100);

      // Fetch Markdown
      setStatus("Lade Markdown...");
      const mdResponse = await fetch("/exports/top10-flows-mobile-complete.md");
      const mdData = await mdResponse.text();
      zip.file("top10-flows-mobile-complete.md", mdData);
      setProgress(2 / total * 100);

      // Fetch HTML
      setStatus("Lade HTML...");
      const htmlResponse = await fetch("/exports/top10-flows-mobile-complete.html");
      const htmlData = await htmlResponse.text();
      zip.file("top10-flows-mobile-complete.html", htmlData);
      setProgress(3 / total * 100);

      // Fetch Screenshots
      for (let i = 0; i < MOBILE_SCREENSHOTS.length; i++) {
        const flow = MOBILE_SCREENSHOTS[i];
        setStatus(`Lade Mobile Screenshot ${i + 1}/10: ${flow.name}...`);
        
        try {
          const response = await fetch(flow.screenshot);
          const blob = await response.blob();
          screenshotsFolder?.file(`${String(flow.rank).padStart(2, '0')}-${flow.id}-mobile.png`, blob);
        } catch (err) {
          console.error(`Failed to fetch screenshot for ${flow.name}:`, err);
        }
        
        setProgress(((i + 4) / total) * 100);
      }

      // Generate ZIP
      setStatus("Erstelle ZIP-Datei...");
      const content = await zip.generateAsync({ type: "blob" });
      
      // Download
      saveAs(content, `umzugscheck-top10-flows-mobile-${new Date().toISOString().split('T')[0]}.zip`);
      
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
          <CardTitle className="text-2xl">Top 10 Flows - Mobile Export</CardTitle>
          <CardDescription>
            Vollständige Mobile-Analyse mit allen Steps für ChatGPT Agent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Contents Preview */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <h3 className="font-medium text-sm">Inhalt der ZIP-Datei:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileJson className="h-4 w-4 text-blue-500" />
                <span>top10-flows-mobile-complete.json</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">39 Steps</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileText className="h-4 w-4 text-green-500" />
                <span>top10-flows-mobile-complete.md</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <FileCode className="h-4 w-4 text-orange-500" />
                <span>top10-flows-mobile-complete.html</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Image className="h-4 w-4 text-purple-500" />
                <span>mobile-screenshots/ (10 PNG-Dateien)</span>
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
            <div className="flex gap-2 justify-center flex-wrap">
              <Button variant="outline" size="sm" asChild>
                <a href="/exports/top10-flows-mobile-complete.json" download>JSON</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/exports/top10-flows-mobile-complete.md" download>Markdown</a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="/exports/top10-flows-mobile-complete.html" download>HTML</a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportDownload;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Download, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

export const FullPageScreenshot = () => {
  const [url, setUrl] = useState("/");
  const [isCapturing, setIsCapturing] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const captureFullPage = async () => {
    if (!url) {
      toast.error("Bitte geben Sie eine URL ein");
      return;
    }

    setIsCapturing(true);
    setScreenshot(null);

    try {
      // Create an iframe to load the target page
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.top = "-9999px";
      iframe.style.left = "-9999px";
      iframe.style.width = "1440px";
      iframe.style.height = "900px";
      iframe.style.border = "none";
      
      document.body.appendChild(iframe);

      // Build full URL
      const fullUrl = url.startsWith("http") 
        ? url 
        : `${window.location.origin}${url.startsWith("/") ? url : "/" + url}`;

      // Load the page in iframe
      iframe.src = fullUrl;

      await new Promise<void>((resolve, reject) => {
        iframe.onload = () => {
          // Wait for content to render
          setTimeout(resolve, 2000);
        };
        iframe.onerror = reject;
        
        // Timeout after 15 seconds
        setTimeout(() => reject(new Error("Timeout")), 15000);
      });

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (!iframeDoc) {
        throw new Error("Could not access iframe document");
      }

      // Get full page height
      const body = iframeDoc.body;
      const html = iframeDoc.documentElement;
      const fullHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );

      // Resize iframe to full page height
      iframe.style.height = `${fullHeight}px`;
      
      // Wait for resize
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture screenshot
      const canvas = await html2canvas(iframeDoc.body, {
        width: 1440,
        height: fullHeight,
        windowWidth: 1440,
        windowHeight: fullHeight,
        scrollX: 0,
        scrollY: 0,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scale: 1,
        logging: false,
      });

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      setScreenshot(dataUrl);
      
      // Cleanup
      document.body.removeChild(iframe);
      
      toast.success("Screenshot erfolgreich erstellt!");
    } catch (error) {
      console.error("Screenshot error:", error);
      
      // Fallback: capture current visible page
      try {
        toast.info("Versuche Alternative...");
        
        const mainContent = document.querySelector("main") || document.body;
        const canvas = await html2canvas(mainContent as HTMLElement, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          scale: 1,
        });
        
        const dataUrl = canvas.toDataURL("image/png", 1.0);
        setScreenshot(dataUrl);
        toast.success("Screenshot erstellt (sichtbarer Bereich)");
      } catch (fallbackError) {
        toast.error("Screenshot konnte nicht erstellt werden");
        console.error("Fallback error:", fallbackError);
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadScreenshot = () => {
    if (!screenshot) return;

    const link = document.createElement("a");
    const pageName = url.replace(/\//g, "-").replace(/^-/, "") || "homepage";
    link.download = `screenshot-${pageName}-${Date.now()}.png`;
    link.href = screenshot;
    link.click();
    
    toast.success("Download gestartet");
  };

  const openInNewTab = () => {
    if (!screenshot) return;
    
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Screenshot</title></head>
          <body style="margin:0;display:flex;justify-content:center;background:#1a1a1a;">
            <img src="${screenshot}" style="max-width:100%;height:auto;" />
          </body>
        </html>
      `);
    }
  };

  const presetUrls = [
    { label: "Homepage", value: "/" },
    { label: "Umzugsofferten", value: "/umzugsofferten" },
    { label: "Firmenverzeichnis", value: "/umzugsfirmen" },
    { label: "Preisrechner", value: "/preisrechner" },
    { label: "Über uns", value: "/ueber-uns" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Full-Page Screenshot
        </CardTitle>
        <CardDescription>
          Erstellen Sie Screenshots von beliebigen Seiten der Website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <Label htmlFor="url">Seiten-URL</Label>
          <div className="flex gap-2">
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="z.B. / oder /umzugsofferten"
              className="flex-1"
            />
            <Button 
              onClick={captureFullPage} 
              disabled={isCapturing}
              className="min-w-[140px]"
            >
              {isCapturing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Erfassen...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Screenshot
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Preset URLs */}
        <div className="flex flex-wrap gap-2">
          {presetUrls.map((preset) => (
            <Button
              key={preset.value}
              variant={url === preset.value ? "default" : "outline"}
              size="sm"
              onClick={() => setUrl(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Screenshot Preview */}
        {screenshot && (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-muted">
              <div className="max-h-[500px] overflow-auto">
                <img 
                  src={screenshot} 
                  alt="Screenshot" 
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={downloadScreenshot} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download PNG
              </Button>
              <Button variant="outline" onClick={openInNewTab}>
                <ExternalLink className="h-4 w-4 mr-2" />
                In neuem Tab öffnen
              </Button>
            </div>
          </div>
        )}

        {/* Info */}
        <p className="text-sm text-muted-foreground">
          Hinweis: Screenshots werden lokal im Browser erstellt. Bei Cross-Origin-Einschränkungen 
          wird nur der sichtbare Bereich erfasst.
        </p>
      </CardContent>
    </Card>
  );
};

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Camera, Download, ExternalLink, Loader2, Monitor, Smartphone, Tablet, FileImage, Bug, X, Maximize2 } from "lucide-react";

const SCREENSHOT_API_KEY = "892618";

interface ScreenshotResult {
  url: string;
  imageUrl: string;
  timestamp: Date;
  isFullPage: boolean;
  dimension: string;
}

const PRESET_URLS = [
  { label: "Homepage", url: "https://umzugscheck.ch" },
  { label: "Umzugsofferten", url: "https://umzugscheck.ch/umzugsofferten" },
  { label: "Umzugsfirmen", url: "https://umzugscheck.ch/firmen" },
  { label: "Beste Umzugsfirma", url: "https://umzugscheck.ch/beste-umzugsfirma" },
  { label: "Günstige Umzugsfirma", url: "https://umzugscheck.ch/guenstige-umzugsfirma" },
  { label: "Region Zürich", url: "https://umzugscheck.ch/umzugsfirmen/zuerich" },
  { label: "Region Bern", url: "https://umzugscheck.ch/umzugsfirmen/bern" },
  { label: "Region Basel", url: "https://umzugscheck.ch/umzugsfirmen/basel" },
];

const DIMENSIONS = [
  { value: "1920x1080", label: "Desktop Full HD (1920x1080)" },
  { value: "1366x768", label: "Desktop HD (1366x768)" },
  { value: "1024x768", label: "Desktop (1024x768)" },
  { value: "768x1024", label: "Tablet Portrait (768x1024)" },
  { value: "1024x1366", label: "Tablet Landscape (1024x1366)" },
  { value: "375x812", label: "Mobile iPhone X (375x812)" },
  { value: "414x896", label: "Mobile iPhone XR (414x896)" },
  { value: "360x640", label: "Mobile Android (360x640)" },
];

export function ScreenshotMachine() {
  const [url, setUrl] = useState("");
  const [dimension, setDimension] = useState("1920x1080");
  const [fullPage, setFullPage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ScreenshotResult[]>([]);
  
  // Bulk mode
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkUrls, setBulkUrls] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });

  // Debug mode
  const [showDebug, setShowDebug] = useState(false);
  const [debugUrl, setDebugUrl] = useState("");

  // Modal for full-page preview
  const [selectedImage, setSelectedImage] = useState<ScreenshotResult | null>(null);

  const generateScreenshotUrl = (targetUrl: string): string => {
    const width = dimension.split("x")[0];
    // ScreenshotMachine API: full page via "WIDTHxfull" format (e.g., 1920xfull)
    const effectiveDimension = fullPage ? `${width}xfull` : dimension;

    const params = new URLSearchParams({
      key: SCREENSHOT_API_KEY,
      url: targetUrl,
      dimension: effectiveDimension,
      format: "png",
      cacheLimit: "0",
      delay: fullPage ? "3000" : "2000", // Longer delay for full-page
    });

    return `https://api.screenshotmachine.com?${params.toString()}`;
  };

  const testRequest = () => {
    const testUrl = url || "https://umzugscheck.ch";
    const apiUrl = generateScreenshotUrl(testUrl);
    setDebugUrl(apiUrl);
    setShowDebug(true);
    
    // Copy to clipboard
    navigator.clipboard.writeText(apiUrl);
    toast.success("API-URL in Zwischenablage kopiert!");
  };

  const captureScreenshot = async () => {
    if (!url) {
      toast.error("Bitte gib eine URL ein");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = generateScreenshotUrl(url);
      
      // Pre-load the image to verify it works
      const img = new Image();
      img.onload = () => {
        setResults(prev => [{
          url,
          imageUrl,
          timestamp: new Date(),
          isFullPage: fullPage,
          dimension: fullPage ? `${dimension.split("x")[0]}xfull` : dimension,
        }, ...prev]);
        toast.success("Screenshot erfolgreich erstellt!");
        setLoading(false);
      };
      img.onerror = () => {
        toast.error("Fehler beim Erstellen des Screenshots");
        setLoading(false);
      };
      img.src = imageUrl;
    } catch (error) {
      toast.error("Fehler beim Erstellen des Screenshots");
      setLoading(false);
    }
  };

  const captureBulkScreenshots = async () => {
    const urls = bulkUrls
      .split("\n")
      .map(u => u.trim())
      .filter(u => u.length > 0);

    if (urls.length === 0) {
      toast.error("Bitte gib mindestens eine URL ein");
      return;
    }

    setBulkLoading(true);
    setBulkProgress({ current: 0, total: urls.length });

    for (let i = 0; i < urls.length; i++) {
      const targetUrl = urls[i];
      setBulkProgress({ current: i + 1, total: urls.length });

      try {
        const imageUrl = generateScreenshotUrl(targetUrl);
        
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            setResults(prev => [{
              url: targetUrl,
              imageUrl,
              timestamp: new Date(),
              isFullPage: fullPage,
              dimension: fullPage ? `${dimension.split("x")[0]}xfull` : dimension,
            }, ...prev]);
            resolve();
          };
          img.onerror = () => {
            console.error(`Failed to capture: ${targetUrl}`);
            resolve(); // Continue with next URL even on error
          };
          img.src = imageUrl;
        });

        // Small delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error capturing ${targetUrl}:`, error);
      }
    }

    setBulkLoading(false);
    toast.success(`${urls.length} Screenshots erstellt!`);
  };

  const downloadScreenshot = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Download gestartet!");
    } catch (error) {
      // Fallback: open in new tab
      window.open(imageUrl, "_blank");
    }
  };

  const usePresetUrl = (presetUrl: string) => {
    if (bulkMode) {
      setBulkUrls(prev => prev ? `${prev}\n${presetUrl}` : presetUrl);
    } else {
      setUrl(presetUrl);
    }
  };

  const addAllPresets = () => {
    const allUrls = PRESET_URLS.map(p => p.url).join("\n");
    setBulkUrls(allUrls);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Screenshot Machine
          </CardTitle>
          <CardDescription>
            Erstelle Screenshots von beliebigen Webseiten mit Full-Page und Bulk-Optionen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-1">
              <Label className="text-base font-medium">Bulk-Modus</Label>
              <p className="text-sm text-muted-foreground">
                Mehrere URLs gleichzeitig erfassen
              </p>
            </div>
            <Switch checked={bulkMode} onCheckedChange={setBulkMode} />
          </div>

          {/* Preset URLs */}
          <div className="space-y-2">
            <Label>Schnellauswahl</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_URLS.map((preset) => (
                <Button
                  key={preset.url}
                  variant="outline"
                  size="sm"
                  onClick={() => usePresetUrl(preset.url)}
                >
                  {preset.label}
                </Button>
              ))}
              {bulkMode && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={addAllPresets}
                >
                  Alle hinzufügen
                </Button>
              )}
            </div>
          </div>

          {/* URL Input */}
          {bulkMode ? (
            <div className="space-y-2">
              <Label>URLs (eine pro Zeile)</Label>
              <Textarea
                placeholder="https://example.com&#10;https://example.org&#10;https://example.net"
                value={bulkUrls}
                onChange={(e) => setBulkUrls(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                {bulkUrls.split("\n").filter(u => u.trim()).length} URLs eingegeben
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>URL</Label>
              <Input
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          )}

          {/* Settings */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Auflösung</Label>
              <Select value={dimension} onValueChange={setDimension}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIMENSIONS.map((dim) => (
                    <SelectItem key={dim.value} value={dim.value}>
                      <div className="flex items-center gap-2">
                        {dim.value.startsWith("1920") || dim.value.startsWith("1366") || dim.value.startsWith("1024x768") ? (
                          <Monitor className="h-4 w-4" />
                        ) : dim.value.includes("768x1024") || dim.value.includes("1024x1366") ? (
                          <Tablet className="h-4 w-4" />
                        ) : (
                          <Smartphone className="h-4 w-4" />
                        )}
                        {dim.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label className="text-base">Full Page</Label>
                <p className="text-sm text-muted-foreground">
                  Gesamte Seite erfassen ({dimension.split("x")[0]}xfull)
                </p>
              </div>
              <Switch checked={fullPage} onCheckedChange={setFullPage} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {bulkMode ? (
              <Button 
                onClick={captureBulkScreenshots} 
                disabled={bulkLoading}
                className="flex-1"
                size="lg"
              >
                {bulkLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Erfasse {bulkProgress.current}/{bulkProgress.total}...
                  </>
                ) : (
                  <>
                    <FileImage className="h-4 w-4 mr-2" />
                    Bulk-Screenshots erstellen
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={captureScreenshot} 
                disabled={loading}
                className="flex-1"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Erstelle Screenshot...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Screenshot erstellen
                  </>
                )}
              </Button>
            )}
            
            {/* Debug Button */}
            <Button 
              variant="outline" 
              size="lg"
              onClick={testRequest}
              title="API-URL anzeigen"
            >
              <Bug className="h-4 w-4" />
            </Button>
          </div>

          {/* Debug Panel */}
          {showDebug && (
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Debug: API-URL</Label>
                <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <code className="block text-xs bg-background p-3 rounded border break-all">
                {debugUrl}
              </code>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(debugUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Im Browser öffnen
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(debugUrl);
                    toast.success("Kopiert!");
                  }}
                >
                  Kopieren
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Screenshots ({results.length})</CardTitle>
            <CardDescription>
              Klicke auf ein Bild um es in voller Grösse anzuzeigen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div 
                    className="aspect-video bg-muted relative group cursor-pointer"
                    onClick={() => setSelectedImage(result)}
                  >
                    <img
                      src={result.imageUrl}
                      alt={`Screenshot of ${result.url}`}
                      className="w-full h-full object-cover object-top"
                    />
                    
                    {/* Full Page Badge */}
                    {result.isFullPage && (
                      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                        Full Page
                      </Badge>
                    )}
                    
                    {/* Dimension Badge */}
                    <Badge variant="secondary" className="absolute top-2 right-2">
                      {result.dimension}
                    </Badge>

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(result);
                        }}
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(result.imageUrl, "_blank");
                        }}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadScreenshot(
                            result.imageUrl,
                            `screenshot-${new URL(result.url).hostname}-${Date.now()}`
                          );
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-sm font-medium truncate" title={result.url}>
                      {result.url}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {result.timestamp.toLocaleString("de-CH")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full-Page Preview Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="flex items-center gap-2 text-sm">
              {selectedImage?.url}
              {selectedImage?.isFullPage && (
                <Badge className="bg-primary text-primary-foreground">Full Page</Badge>
              )}
              <Badge variant="secondary">{selectedImage?.dimension}</Badge>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[calc(90vh-80px)]">
            <div className="p-4 pt-2">
              {selectedImage && (
                <img
                  src={selectedImage.imageUrl}
                  alt={`Screenshot of ${selectedImage.url}`}
                  className="w-full h-auto rounded-lg border"
                />
              )}
            </div>
          </ScrollArea>
          <div className="p-4 pt-0 flex gap-2 justify-end border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectedImage && window.open(selectedImage.imageUrl, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Neuer Tab
            </Button>
            <Button
              size="sm"
              onClick={() => selectedImage && downloadScreenshot(
                selectedImage.imageUrl,
                `screenshot-${new URL(selectedImage.url).hostname}-${Date.now()}`
              )}
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
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
import { Camera, Download, ExternalLink, Loader2, Monitor, Smartphone, Tablet, FileImage, Bug, X, Maximize2, Archive, FileText, Code, CloudUpload, FolderArchive } from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { supabase } from "@/integrations/supabase/client";

const SCREENSHOT_API_KEY = "892618";

interface ScreenshotResult {
  url: string;
  imageUrl: string;
  timestamp: Date;
  isFullPage: boolean;
  dimension: string;
  htmlContent?: string;
  storagePath?: string;
}

interface ArchivedScreenshot {
  id: string;
  url: string;
  screenshotPath: string;
  htmlPath: string;
  dimension: string;
  isFullPage: boolean;
  archivedAt: Date;
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

const TOP_20_URLS = [
  "https://umzugscheck.ch",
  "https://umzugscheck.ch/umzugsofferten",
  "https://umzugscheck.ch/firmen",
  "https://umzugscheck.ch/beste-umzugsfirma",
  "https://umzugscheck.ch/guenstige-umzugsfirma",
  "https://umzugscheck.ch/umzugsfirmen/zuerich",
  "https://umzugscheck.ch/umzugsfirmen/bern",
  "https://umzugscheck.ch/umzugsfirmen/basel",
  "https://umzugscheck.ch/umzugsfirmen/aargau",
  "https://umzugscheck.ch/umzugsfirmen/luzern",
  "https://umzugscheck.ch/privatumzug",
  "https://umzugscheck.ch/firmenumzug",
  "https://umzugscheck.ch/umzugskosten",
  "https://umzugscheck.ch/reinigung",
  "https://umzugscheck.ch/entsorgung",
  "https://umzugscheck.ch/ratgeber",
  "https://umzugscheck.ch/checkliste",
  "https://umzugscheck.ch/preisrechner",
  "https://umzugscheck.ch/fuer-firmen",
  "https://umzugscheck.ch/kontakt",
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

  // Export options
  const [exportLoading, setExportLoading] = useState(false);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [top20Loading, setTop20Loading] = useState(false);
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

  const fetchHtmlContent = async (pageUrl: string): Promise<string> => {
    try {
      console.log(`Fetching HTML via Edge Function for: ${pageUrl}`);
      const { data, error } = await supabase.functions.invoke('fetch-html', {
        body: { url: pageUrl }
      });

      if (error) {
        console.error('Edge function error:', error);
        return `<!-- Error fetching HTML: ${error.message} -->`;
      }

      if (data?.html) {
        console.log(`Successfully fetched HTML for ${pageUrl}, length: ${data.html.length}`);
        return data.html;
      }

      return `<!-- No HTML content returned for ${pageUrl} -->`;
    } catch (error) {
      console.error('Error fetching HTML:', error);
      return `<!-- Could not fetch HTML from ${pageUrl} -->`;
    }
  };

  const archiveToStorage = async (result: ScreenshotResult): Promise<{ screenshotPath: string; htmlPath: string } | null> => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const hostname = new URL(result.url).hostname;
      const pathname = new URL(result.url).pathname.replace(/\//g, '_') || 'index';
      const basePath = `${timestamp}/${hostname}${pathname}`;

      // Fetch and upload screenshot
      const screenshotResponse = await fetch(result.imageUrl);
      const screenshotBlob = await screenshotResponse.blob();
      const screenshotPath = `${basePath}.png`;
      
      const { error: screenshotError } = await supabase.storage
        .from('screenshots-archive')
        .upload(screenshotPath, screenshotBlob, {
          contentType: 'image/png',
          upsert: true
        });

      if (screenshotError) {
        console.error('Screenshot upload error:', screenshotError);
        throw screenshotError;
      }

      // Fetch and upload HTML
      const htmlContent = await fetchHtmlContent(result.url);
      const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
      const htmlPath = `${basePath}.html`;
      
      const { error: htmlError } = await supabase.storage
        .from('screenshots-archive')
        .upload(htmlPath, htmlBlob, {
          contentType: 'text/html',
          upsert: true
        });

      if (htmlError) {
        console.error('HTML upload error:', htmlError);
        throw htmlError;
      }

      // Upload metadata JSON
      const metadata = {
        url: result.url,
        dimension: result.dimension,
        isFullPage: result.isFullPage,
        capturedAt: result.timestamp.toISOString(),
        screenshotPath,
        htmlPath
      };
      const metadataBlob = new Blob([JSON.stringify(metadata, null, 2)], { type: 'application/json' });
      
      await supabase.storage
        .from('screenshots-archive')
        .upload(`${basePath}_meta.json`, metadataBlob, {
          contentType: 'application/json',
          upsert: true
        });

      return { screenshotPath, htmlPath };
    } catch (error) {
      console.error('Archive error:', error);
      return null;
    }
  };

  const archiveAllToStorage = async () => {
    if (results.length === 0) {
      toast.error("Keine Screenshots zum Archivieren");
      return;
    }

    setArchiveLoading(true);
    toast.info("Archivierung gestartet...");
    
    let successCount = 0;
    for (let i = 0; i < results.length; i++) {
      toast.info(`Archiviere ${i + 1}/${results.length}...`);
      const result = await archiveToStorage(results[i]);
      if (result) {
        successCount++;
        // Update the result with storage paths
        setResults(prev => prev.map((r, idx) => 
          idx === i ? { ...r, storagePath: result.screenshotPath } : r
        ));
      }
    }

    setArchiveLoading(false);
    toast.success(`${successCount}/${results.length} Screenshots archiviert!`);
  };

  const downloadTop20WithHtml = async () => {
    setTop20Loading(true);
    toast.info("Lade Top 20 Seiten herunter...");
    
    const zip = new JSZip();
    
    try {
      for (let i = 0; i < TOP_20_URLS.length; i++) {
        const targetUrl = TOP_20_URLS[i];
        toast.info(`Verarbeite ${i + 1}/${TOP_20_URLS.length}: ${new URL(targetUrl).hostname}${new URL(targetUrl).pathname}`);
        
        const hostname = new URL(targetUrl).hostname;
        const pathname = new URL(targetUrl).pathname.replace(/\//g, '_') || 'index';
        const filename = `${String(i + 1).padStart(2, '0')}_${hostname}${pathname}`;
        
        // Generate screenshot URL
        const width = dimension.split("x")[0];
        const effectiveDimension = fullPage ? `${width}xfull` : dimension;
        const params = new URLSearchParams({
          key: SCREENSHOT_API_KEY,
          url: targetUrl,
          dimension: effectiveDimension,
          format: "png",
          cacheLimit: "0",
          delay: fullPage ? "3000" : "2000",
        });
        const screenshotUrl = `https://api.screenshotmachine.com?${params.toString()}`;
        
        // Fetch screenshot
        try {
          const screenshotResponse = await fetch(screenshotUrl);
          const screenshotBlob = await screenshotResponse.blob();
          zip.file(`${filename}.png`, screenshotBlob);
        } catch (error) {
          console.error(`Failed to fetch screenshot for ${targetUrl}:`, error);
          zip.file(`${filename}_screenshot_error.txt`, `Failed to capture: ${error}`);
        }
        
        // Fetch HTML
        try {
          const htmlContent = await fetchHtmlContent(targetUrl);
          zip.file(`${filename}.html`, htmlContent);
        } catch (error) {
          console.error(`Failed to fetch HTML for ${targetUrl}:`, error);
          zip.file(`${filename}_html_error.txt`, `Failed to fetch HTML: ${error}`);
        }
        
        // Add metadata
        zip.file(`${filename}_info.json`, JSON.stringify({
          url: targetUrl,
          dimension: effectiveDimension,
          isFullPage: fullPage,
          capturedAt: new Date().toISOString(),
          index: i + 1
        }, null, 2));
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `top20_screenshots_html_${new Date().toISOString().split('T')[0]}.zip`);
      toast.success("Top 20 Seiten als ZIP heruntergeladen!");
    } catch (error) {
      console.error("Top 20 download error:", error);
      toast.error("Fehler beim Download der Top 20");
    } finally {
      setTop20Loading(false);
    }
  };

  const downloadAllAsZip = async () => {
    if (results.length === 0) {
      toast.error("Keine Screenshots zum Exportieren");
      return;
    }

    setExportLoading(true);
    toast.info("ZIP-Export mit HTML gestartet...");
    const zip = new JSZip();
    
    try {
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        toast.info(`Verarbeite ${i + 1}/${results.length}...`);
        
        const hostname = new URL(result.url).hostname;
        const pathname = new URL(result.url).pathname.replace(/\//g, '_') || 'index';
        const filename = `${String(i + 1).padStart(2, '0')}_${hostname}${pathname}`;

        // Fetch and add screenshot
        try {
          const response = await fetch(result.imageUrl);
          const blob = await response.blob();
          zip.file(`${filename}.png`, blob);
        } catch (error) {
          console.error(`Failed to add screenshot for ${result.url}:`, error);
        }

        // Fetch and add HTML
        try {
          const htmlContent = await fetchHtmlContent(result.url);
          zip.file(`${filename}.html`, htmlContent);
        } catch (error) {
          console.error(`Failed to fetch HTML for ${result.url}:`, error);
        }

        // Add metadata JSON
        zip.file(`${filename}_info.json`, JSON.stringify({
          url: result.url,
          dimension: result.dimension,
          isFullPage: result.isFullPage,
          capturedAt: result.timestamp.toISOString(),
        }, null, 2));
      }

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `screenshots_with_html_${new Date().toISOString().split('T')[0]}.zip`);
      toast.success(`${results.length} Screenshots mit HTML als ZIP exportiert!`);
    } catch (error) {
      console.error("ZIP export error:", error);
      toast.error("Fehler beim ZIP-Export");
    } finally {
      setExportLoading(false);
    }
  };

  const downloadAllAsPdf = async () => {
    if (results.length === 0) {
      toast.error("Keine Screenshots zum Exportieren");
      return;
    }

    setExportLoading(true);
    toast.info("PDF-Export gestartet, HTML wird geladen...");
    
    try {
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        toast.info(`Verarbeite ${i + 1}/${results.length}: ${new URL(result.url).hostname}`);
        
        if (i > 0) {
          pdf.addPage();
        }

        // Title
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.text(`Screenshot ${i + 1}/${results.length}`, margin, margin + 5);
        
        // URL and metadata
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        pdf.text(`URL: ${result.url}`, margin, margin + 12);
        pdf.text(`Dimension: ${result.dimension} | Full Page: ${result.isFullPage ? 'Ja' : 'Nein'}`, margin, margin + 18);
        pdf.text(`Erfasst: ${result.timestamp.toLocaleString('de-CH')}`, margin, margin + 24);

        // Add screenshot image
        try {
          const response = await fetch(result.imageUrl);
          const blob = await response.blob();
          const base64 = await blobToBase64(blob);
          
          const imgWidth = pageWidth - (margin * 2);
          const imgHeight = pageHeight - margin - 35; // Leave space for header
          
          pdf.addImage(base64, 'PNG', margin, margin + 30, imgWidth, imgHeight, undefined, 'FAST');
        } catch (error) {
          console.error(`Failed to add image for ${result.url}:`, error);
          pdf.setFontSize(12);
          pdf.text("Bild konnte nicht geladen werden", margin, margin + 50);
        }

        // Fetch and add HTML source code on separate page(s)
        try {
          const htmlContent = await fetchHtmlContent(result.url);
          
          if (htmlContent && !htmlContent.startsWith('<!--')) {
            // Add HTML source code page(s)
            pdf.addPage('a4', 'portrait');
            
            pdf.setFontSize(12);
            pdf.setFont("helvetica", "bold");
            pdf.text(`HTML-Quellcode: ${result.url}`, margin, margin + 5);
            
            pdf.setFontSize(8);
            pdf.setFont("courier", "normal");
            
            // Split HTML into lines that fit the page
            const maxCharsPerLine = 100;
            const maxLinesPerPage = 55;
            const lines: string[] = [];
            
            // Split by newlines first, then wrap long lines
            const rawLines = htmlContent.split('\n');
            for (const rawLine of rawLines) {
              if (rawLine.length <= maxCharsPerLine) {
                lines.push(rawLine);
              } else {
                // Wrap long lines
                for (let j = 0; j < rawLine.length; j += maxCharsPerLine) {
                  lines.push(rawLine.substring(j, j + maxCharsPerLine));
                }
              }
            }
            
            let lineY = margin + 15;
            let currentLine = 0;
            
            for (const line of lines) {
              if (currentLine >= maxLinesPerPage) {
                pdf.addPage('a4', 'portrait');
                pdf.setFontSize(8);
                pdf.setFont("courier", "normal");
                lineY = margin + 5;
                currentLine = 0;
              }
              
              // Sanitize line for PDF (remove control characters)
              const sanitizedLine = line.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
              pdf.text(sanitizedLine || ' ', margin, lineY);
              lineY += 3.5;
              currentLine++;
            }
          }
        } catch (htmlError) {
          console.error(`Failed to fetch HTML for ${result.url}:`, htmlError);
          // Continue without HTML - don't break the export
        }
      }

      pdf.save(`screenshots_with_html_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success(`${results.length} Screenshots mit HTML als PDF exportiert!`);
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Fehler beim PDF-Export");
    } finally {
      setExportLoading(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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

          {/* Top 20 Quick Action */}
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Top 20 Seiten</Label>
                <p className="text-sm text-muted-foreground">
                  Alle wichtigen Seiten inkl. Screenshot + HTML als ZIP herunterladen
                </p>
              </div>
              <Button 
                onClick={downloadTop20WithHtml}
                disabled={top20Loading}
                variant="default"
              >
                {top20Loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Lädt...
                  </>
                ) : (
                  <>
                    <FolderArchive className="h-4 w-4 mr-2" />
                    Top 20 ZIP + HTML
                  </>
                )}
              </Button>
            </div>
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Screenshots ({results.length})</CardTitle>
                <CardDescription>
                  Klicke auf ein Bild um es in voller Grösse anzuzeigen
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadAllAsZip}
                  disabled={exportLoading || archiveLoading}
                  title="ZIP mit Screenshot + HTML"
                >
                  {exportLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Archive className="h-4 w-4 mr-1" />
                      ZIP + HTML
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadAllAsPdf}
                  disabled={exportLoading || archiveLoading}
                  title="PDF mit HTML-Quellcode exportieren"
                >
                  {exportLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Code className="h-4 w-4 mr-1" />
                      PDF + HTML
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={archiveAllToStorage}
                  disabled={archiveLoading || exportLoading}
                  title="In Cloud-Speicher archivieren"
                >
                  {archiveLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CloudUpload className="h-4 w-4 mr-1" />
                      Archivieren
                    </>
                  )}
                </Button>
              </div>
            </div>
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
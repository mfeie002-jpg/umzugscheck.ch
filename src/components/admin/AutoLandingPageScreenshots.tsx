import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { SITE_CONFIG } from "@/data/constants";
import {
  Camera,
  Download,
  Loader2,
  Play,
  CheckCircle2,
  XCircle,
  Smartphone,
  Monitor,
  Package,
  RefreshCw,
  Globe,
  MapPin,
  FileText,
  Sparkles,
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { captureScreenshot } from "@/lib/screenshot-service";
import { supabase } from "@/integrations/supabase/client";

// Viewport presets
const DIMENSION_PRESETS = {
  desktop: [
    { value: "1920x1080", label: "Full Viewport (1920x1080)", recommended: true },
    { value: "1920x800", label: "Extended Viewport (1920x800)" },
    { value: "1920x600", label: "Hero Only (1920x600)" },
    { value: "1920xfull", label: "Full Page (1920xfull)" },
  ],
  mobile: [
    { value: "390x844", label: "Full Viewport (390x844)", recommended: true },
    { value: "390x700", label: "Extended Viewport (390x700)" },
    { value: "390x500", label: "Hero Only (390x500)" },
    { value: "390xfull", label: "Full Page (390xfull)" },
  ],
};

const DEFAULT_DIMENSIONS = {
  desktop: DIMENSION_PRESETS.desktop[0],
  mobile: DIMENSION_PRESETS.mobile[0],
};

interface LandingPage {
  id: string;
  page_type: string;
  slug: string;
  url_path: string;
  display_name: string;
  canton_code: string | null;
  city_name: string | null;
  is_active: boolean;
  priority: number;
  tags: string[];
}

interface CaptureResult {
  pageId: string;
  pageName: string;
  urlPath: string;
  dimension: string;
  deviceType: 'desktop' | 'mobile';
  success: boolean;
  imageBase64?: string;
  error?: string;
}

export function AutoLandingPageScreenshots() {
  const defaultPublicBaseUrl = useMemo(() => {
    return "https://www.umzugscheck.ch";
  }, []);

  const [pages, setPages] = useState<LandingPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [baseUrlOverride, setBaseUrlOverride] = useState<string>(defaultPublicBaseUrl);
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [captureDesktop, setCaptureDesktop] = useState(true);
  const [captureMobile, setCaptureMobile] = useState(true);
  const [selectedDesktopDim, setSelectedDesktopDim] = useState(DEFAULT_DIMENSIONS.desktop);
  const [selectedMobileDim, setSelectedMobileDim] = useState(DEFAULT_DIMENSIONS.mobile);
  const [fullPage, setFullPage] = useState(false);
  const [delayMs, setDelayMs] = useState(5000);
  const [filterType, setFilterType] = useState<string>('all');

  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentItem: "" });
  const [results, setResults] = useState<CaptureResult[]>([]);

  // Load landing pages from DB
  const loadPages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false });

      if (error) throw error;
      setPages(data || []);
    } catch (error) {
      console.error('Error loading pages:', error);
      toast.error('Fehler beim Laden der Landing Pages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  // Filter pages by type
  const filteredPages = useMemo(() => {
    if (filterType === 'all') return pages;
    return pages.filter(p => p.page_type === filterType);
  }, [pages, filterType]);

  // Get unique page types
  const pageTypes = useMemo(() => {
    const types = new Set(pages.map(p => p.page_type));
    return Array.from(types);
  }, [pages]);

  const getBaseUrl = () => (baseUrlOverride.trim() || defaultPublicBaseUrl).replace(/\/$/, "");

  const buildCaptureUrl = (urlPath: string) => {
    const baseUrl = getBaseUrl();
    const url = new URL(urlPath, baseUrl);
    url.searchParams.set("uc_cb", String(Date.now())); // Cache buster
    return url.toString();
  };

  const togglePage = (pageId: string) => {
    setSelectedPages((prev) =>
      prev.includes(pageId)
        ? prev.filter((id) => id !== pageId)
        : [...prev, pageId]
    );
  };

  const selectAllPages = () => {
    setSelectedPages(filteredPages.map((p) => p.id));
  };

  const deselectAllPages = () => {
    setSelectedPages([]);
  };

  const calculateTotalCaptures = () => {
    const dimensions = (captureDesktop ? 1 : 0) + (captureMobile ? 1 : 0);
    return selectedPages.length * dimensions;
  };

  const runAutomaticCapture = async () => {
    if (selectedPages.length === 0) {
      toast.error("Bitte wähle mindestens eine Landing Page aus");
      return;
    }
    if (!captureDesktop && !captureMobile) {
      toast.error("Bitte wähle mindestens eine Auflösung");
      return;
    }

    setIsRunning(true);
    setResults([]);
    const totalCaptures = calculateTotalCaptures();
    setProgress({ current: 0, total: totalCaptures, currentItem: "" });

    const newResults: CaptureResult[] = [];
    let captureCount = 0;

    const dimensionsToCapture = [
      ...(captureDesktop ? [{ ...selectedDesktopDim, type: 'desktop' }] : []),
      ...(captureMobile ? [{ ...selectedMobileDim, type: 'mobile' }] : []),
    ];

    for (const pageId of selectedPages) {
      const page = pages.find((p) => p.id === pageId);
      if (!page) continue;

      for (const dim of dimensionsToCapture) {
        captureCount++;
        const itemLabel = `${page.display_name} (${dim.label})`;
        setProgress({
          current: captureCount,
          total: totalCaptures,
          currentItem: itemLabel,
        });

        const captureUrl = buildCaptureUrl(page.url_path);

        try {
          const result = await captureScreenshot({
            url: captureUrl,
            dimension: dim.value,
            delay: delayMs,
            format: "png",
            fullPage,
            scroll: fullPage,
            noCache: true,
          });

          const captureResult: CaptureResult = {
            pageId: page.id,
            pageName: page.display_name,
            urlPath: page.url_path,
            dimension: dim.value,
            deviceType: dim.type as 'desktop' | 'mobile',
            success: result.success,
            imageBase64: result.image,
            error: result.error,
          };

          newResults.push(captureResult);
          setResults([...newResults]);

          if (!result.success) {
            console.error(`Failed: ${itemLabel}`, result.error);
          }
        } catch (error) {
          const captureResult: CaptureResult = {
            pageId: page.id,
            pageName: page.display_name,
            urlPath: page.url_path,
            dimension: dim.value,
            deviceType: dim.type as 'desktop' | 'mobile',
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
          newResults.push(captureResult);
          setResults([...newResults]);
        }

        // Small delay between captures
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }

    setIsRunning(false);
    const successCount = newResults.filter((r) => r.success).length;
    toast.success(
      `Fertig! ${successCount}/${totalCaptures} Screenshots erfolgreich`
    );
  };

  const downloadAllAsZip = async () => {
    const successfulResults = results.filter((r) => r.success && r.imageBase64);
    if (successfulResults.length === 0) {
      toast.error("Keine Screenshots zum Download verfügbar");
      return;
    }

    const zip = new JSZip();

    for (const result of successfulResults) {
      const safeSlug = result.urlPath.replace(/\//g, '_').replace(/^_/, '');
      const fileName = `landing-pages/${safeSlug}-${result.deviceType}.png`;

      const base64Data = result.imageBase64!.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      zip.file(fileName, base64Data, { base64: true });
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `landing-page-screenshots-${new Date().toISOString().split("T")[0]}.zip`);
    toast.success("ZIP-Download gestartet!");
  };

  // Save to database
  const saveToDatabase = async () => {
    const successfulResults = results.filter((r) => r.success && r.imageBase64);
    if (successfulResults.length === 0) {
      toast.error("Keine Screenshots zum Speichern");
      return;
    }

    // Group results by pageId
    const resultsByPage = new Map<string, typeof successfulResults>();
    for (const result of successfulResults) {
      const existing = resultsByPage.get(result.pageId) || [];
      existing.push(result);
      resultsByPage.set(result.pageId, existing);
    }

    let savedCount = 0;
    for (const [pageId, pageResults] of resultsByPage) {
      try {
        const page = pages.find(p => p.id === pageId);
        if (!page) continue;

        // Get current version count ONCE per page
        const { data: versions } = await supabase
          .from('landing_page_versions')
          .select('version_number')
          .eq('landing_page_id', pageId)
          .order('version_number', { ascending: false })
          .limit(1);

        const nextVersionNumber = (versions?.[0]?.version_number || 0) + 1;
        
        let desktopUrl: string | null = null;
        let mobileUrl: string | null = null;

        // Upload all screenshots for this page
        for (const result of pageResults) {
          const dimLabel = result.deviceType;
          const fileName = `landing-pages/${pageId}/v${nextVersionNumber}-${dimLabel}-${Date.now()}.png`;
          const base64Data = result.imageBase64!.replace(/^data:image\/\w+;base64,/, "");
          const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

          const { error: uploadError } = await supabase.storage
            .from('flow-screenshots')
            .upload(fileName, binaryData, { contentType: 'image/png', upsert: true });

          if (uploadError) {
            console.error('Upload error:', uploadError);
            continue;
          }

          const { data: publicUrl } = supabase.storage
            .from('flow-screenshots')
            .getPublicUrl(fileName);

          if (dimLabel === 'desktop') {
            desktopUrl = publicUrl.publicUrl;
          } else {
            mobileUrl = publicUrl.publicUrl;
          }
          savedCount++;
        }

        // Only create/update version if we have at least one screenshot
        if (desktopUrl || mobileUrl) {
          // Check if version already exists
          const { data: existingVersion } = await supabase
            .from('landing_page_versions')
            .select('id, desktop_screenshot_url, mobile_screenshot_url')
            .eq('landing_page_id', pageId)
            .eq('version_number', nextVersionNumber)
            .maybeSingle();

          if (existingVersion) {
            // Update existing version, merging URLs
            await supabase
              .from('landing_page_versions')
              .update({
                desktop_screenshot_url: desktopUrl || existingVersion.desktop_screenshot_url,
                mobile_screenshot_url: mobileUrl || existingVersion.mobile_screenshot_url,
              })
              .eq('id', existingVersion.id);
          } else {
            // Create new version with all screenshots
            await supabase
              .from('landing_page_versions')
              .insert({
                landing_page_id: pageId,
                version_number: nextVersionNumber,
                version_name: `v${nextVersionNumber}`,
                desktop_screenshot_url: desktopUrl,
                mobile_screenshot_url: mobileUrl,
                created_by: 'admin-tool'
              });
          }
        }
      } catch (error) {
        console.error('Save error:', error);
      }
    }

    toast.success(`${savedCount} Screenshots in der Datenbank gespeichert`);
  };

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Selection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Landing Page Screenshots für AI Review
              </CardTitle>
              <CardDescription>
                Erfasse Screenshots aller Landing Pages (Städte, Kantone, Services)
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadPages}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Aktualisieren
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Base URL + capture settings */}
          <div className="grid grid-cols-1 gap-3 rounded-lg border border-border p-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Base URL</label>
              <Input
                value={baseUrlOverride}
                onChange={(e) => setBaseUrlOverride(e.target.value)}
                placeholder={defaultPublicBaseUrl}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Delay (ms)</label>
                <Input
                  type="number"
                  value={delayMs}
                  min={0}
                  step={1000}
                  onChange={(e) => setDelayMs(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>

              <div className="flex items-center gap-2 pt-6">
                <Checkbox checked={fullPage} onCheckedChange={(v) => setFullPage(Boolean(v))} />
                <span className="text-sm">Full Page</span>
              </div>

              <div className="flex items-center justify-end sm:justify-start pt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setBaseUrlOverride(defaultPublicBaseUrl);
                    toast.success("Base URL zurückgesetzt");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Filter & Quick Actions */}
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Alle Typen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Typen ({pages.length})</SelectItem>
                {pageTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type} ({pages.filter(p => p.page_type === type).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={selectAllPages}>
              Alle auswählen ({filteredPages.length})
            </Button>
            <Button variant="outline" size="sm" onClick={deselectAllPages}>
              Alle abwählen
            </Button>

            <Badge variant="secondary" className="ml-auto">
              {selectedPages.length} ausgewählt
            </Badge>
          </div>

          {/* Page Grid */}
          <ScrollArea className="h-[300px] rounded-lg border p-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredPages.map((page) => (
                <div
                  key={page.id}
                  className={`p-2 border rounded-lg cursor-pointer transition-all text-sm ${
                    selectedPages.includes(page.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground"
                  }`}
                  onClick={() => togglePage(page.id)}
                >
                  <div className="flex items-start gap-2">
                    <Checkbox
                      checked={selectedPages.includes(page.id)}
                      onCheckedChange={() => togglePage(page.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{page.display_name}</div>
                      <div className="text-xs text-muted-foreground truncate">{page.url_path}</div>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-[10px] px-1">
                          {page.page_type}
                        </Badge>
                        {page.canton_code && (
                          <Badge variant="secondary" className="text-[10px] px-1">
                            {page.canton_code}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Dimension Selection */}
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex gap-4">
              {/* Desktop */}
              <div className="flex-1 space-y-2">
                <div
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${
                    captureDesktop ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setCaptureDesktop(!captureDesktop)}
                >
                  <Checkbox
                    checked={captureDesktop}
                    onCheckedChange={() => setCaptureDesktop(!captureDesktop)}
                  />
                  <Monitor className="h-4 w-4" />
                  <span>Desktop</span>
                </div>
                {captureDesktop && (
                  <Select
                    value={selectedDesktopDim.value}
                    onValueChange={(val) => {
                      const preset = DIMENSION_PRESETS.desktop.find(p => p.value === val);
                      if (preset) setSelectedDesktopDim(preset);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIMENSION_PRESETS.desktop.map((preset) => (
                        <SelectItem key={preset.value} value={preset.value}>
                          {preset.label} {preset.recommended && "⭐"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Mobile */}
              <div className="flex-1 space-y-2">
                <div
                  className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer ${
                    captureMobile ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onClick={() => setCaptureMobile(!captureMobile)}
                >
                  <Checkbox
                    checked={captureMobile}
                    onCheckedChange={() => setCaptureMobile(!captureMobile)}
                  />
                  <Smartphone className="h-4 w-4" />
                  <span>Mobile</span>
                </div>
                {captureMobile && (
                  <Select
                    value={selectedMobileDim.value}
                    onValueChange={(val) => {
                      const preset = DIMENSION_PRESETS.mobile.find(p => p.value === val);
                      if (preset) setSelectedMobileDim(preset);
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIMENSION_PRESETS.mobile.map((preset) => (
                        <SelectItem key={preset.value} value={preset.value}>
                          {preset.label} {preset.recommended && "⭐"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground">
              ⭐ Full Viewport empfohlen für Landing Pages
            </p>
          </div>

          {/* Summary & Action */}
          <div className="flex flex-col gap-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {calculateTotalCaptures()}
                </span>{" "}
                Screenshots werden erstellt
              </div>
              <Button
                onClick={runAutomaticCapture}
                disabled={isRunning || selectedPages.length === 0}
                className="gap-2"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Läuft...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    Alle Screenshots erstellen
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {isRunning && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{progress.currentItem}</span>
                <span>
                  {progress.current} / {progress.total}
                </span>
              </div>
              <Progress value={(progress.current / progress.total) * 100} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Ergebnisse
              </CardTitle>
              <div className="flex items-center gap-2">
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveToDatabase}
                  disabled={successCount === 0}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  In DB speichern
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadAllAsZip}
                  disabled={successCount === 0}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  ZIP Download
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {results.map((result, idx) => {
                  const dimLabel = result.deviceType === "mobile"
                    ? "Mobile"
                    : "Desktop";
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2 rounded border ${
                        result.success
                          ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                          : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {result.success ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">{result.pageName}</span>
                        <span className="text-sm text-muted-foreground">{result.urlPath}</span>
                        <Badge variant="secondary">{dimLabel}</Badge>
                      </div>
                      {result.success && result.imageBase64 && (
                        <img
                          src={result.imageBase64}
                          alt={result.pageName}
                          className="h-12 w-auto rounded border"
                        />
                      )}
                      {result.error && (
                        <span className="text-xs text-red-600 max-w-[200px] truncate">
                          {result.error}
                        </span>
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

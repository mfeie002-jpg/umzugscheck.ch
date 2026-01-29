import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Download, FileJson, FileText, Image, Loader2, CheckCircle2, 
  FileCode, AlertCircle, ChevronDown, RefreshCw, Camera, Filter,
  Smartphone, Monitor, ChevronRight, CheckCheck, XCircle, AlertTriangle,
  HardDrive, MapPin, Building2, Globe, Search, Eye, ExternalLink,
  FileImage, Code, Hash, Calendar, Copy, Zap, LayoutGrid, RotateCcw, X
} from "lucide-react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Landing page types
type PageType = "all" | "canton" | "city" | "regional" | "service";
type DeviceFilter = "both" | "mobile" | "desktop";
type ExportFormat = "zip" | "json" | "markdown" | "html";

interface LandingPageInfo {
  id: string;
  displayName: string;
  slug: string;
  urlPath: string;
  pageType: string;
  cantonCode: string | null;
  cityName: string | null;
  priority: number;
  isActive: boolean;
  hasVersions: boolean;
  latestVersion: {
    id: string;
    versionNumber: number;
    desktopUrl: string | null;
    mobileUrl: string | null;
    htmlSnapshot: string | null;
    markdownContent: string | null;
    metaData: Record<string, any> | null;
    createdAt: string;
  } | null;
}

interface LandingPageExportProps {
  onClose?: () => void;
}

const LandingPageExport = ({ onClose }: LandingPageExportProps) => {
  // State
  const [landingPages, setLandingPages] = useState<LandingPageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturingPageId, setCapturingPageId] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  
  // Screenshot preview modal
  const [previewPage, setPreviewPage] = useState<LandingPageInfo | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  
  // Filters
  const [pageTypeFilter, setPageTypeFilter] = useState<PageType>("all");
  const [deviceFilter, setDeviceFilter] = useState<DeviceFilter>("both");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPageIds, setSelectedPageIds] = useState<Set<string>>(new Set());
  const [showPageSelector, setShowPageSelector] = useState(true);
  
  // Export options
  const [exportFormat, setExportFormat] = useState<ExportFormat>("zip");
  const [includeScreenshots, setIncludeScreenshots] = useState(true);
  const [includeHtml, setIncludeHtml] = useState(true);
  const [includeMarkdown, setIncludeMarkdown] = useState(true);
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [groupByType, setGroupByType] = useState(true);

  // Fetch all landing pages with their versions
  const fetchLandingPages = useCallback(async (showSyncState = false) => {
    if (showSyncState) setIsSyncing(true);
    setError(null);
    
    try {
      // Fetch landing pages
      const { data: pagesData, error: pagesError } = await supabase
        .from('landing_pages')
        .select('*')
        .order('priority', { ascending: false });
      
      if (pagesError) throw pagesError;
      
      // Fetch latest versions for each page
      const { data: versionsData, error: versionsError } = await supabase
        .from('landing_page_versions')
        .select('*')
        .order('version_number', { ascending: false });
      
      if (versionsError) throw versionsError;
      
      // Build version map (latest version per page)
      const latestVersionMap = new Map<string, any>();
      for (const version of versionsData || []) {
        if (!latestVersionMap.has(version.landing_page_id)) {
          latestVersionMap.set(version.landing_page_id, version);
        }
      }
      
      // Combine data
      const pages: LandingPageInfo[] = (pagesData || []).map(page => {
        const latestVersion = latestVersionMap.get(page.id);
        return {
          id: page.id,
          displayName: page.display_name,
          slug: page.slug,
          urlPath: page.url_path,
          pageType: page.page_type,
          cantonCode: page.canton_code,
          cityName: page.city_name,
          priority: page.priority || 0,
          isActive: page.is_active ?? true,
          hasVersions: !!latestVersion,
          latestVersion: latestVersion ? {
            id: latestVersion.id,
            versionNumber: latestVersion.version_number,
            desktopUrl: latestVersion.desktop_screenshot_url,
            mobileUrl: latestVersion.mobile_screenshot_url,
            htmlSnapshot: latestVersion.html_snapshot,
            markdownContent: latestVersion.markdown_content,
            metaData: latestVersion.meta_data as Record<string, any> | null,
            createdAt: latestVersion.created_at,
          } : null,
        };
      });
      
      setLandingPages(pages);
      setLastSynced(new Date());
      console.log(`[LandingPageExport] Loaded ${pages.length} pages, ${latestVersionMap.size} with versions`);
    } catch (err) {
      console.error("Failed to fetch landing pages:", err);
      setError("Fehler beim Laden der Landing Pages");
    } finally {
      setIsLoading(false);
      if (showSyncState) setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchLandingPages();
  }, [fetchLandingPages]);

  // Filtered pages
  const filteredPages = useMemo(() => {
    let pages = landingPages;
    
    // Filter by type
    if (pageTypeFilter !== "all") {
      pages = pages.filter(p => p.pageType === pageTypeFilter);
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      pages = pages.filter(p => 
        p.displayName.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query) ||
        p.urlPath.toLowerCase().includes(query) ||
        (p.cantonCode?.toLowerCase().includes(query)) ||
        (p.cityName?.toLowerCase().includes(query))
      );
    }
    
    return pages;
  }, [landingPages, pageTypeFilter, searchQuery]);

  // Selected pages (for export)
  const selectedPages = useMemo(() => {
    if (selectedPageIds.size === 0) return filteredPages;
    return filteredPages.filter(p => selectedPageIds.has(p.id));
  }, [filteredPages, selectedPageIds]);

  // Stats
  const stats = useMemo(() => {
    const withScreenshots = selectedPages.filter(p => 
      p.latestVersion?.desktopUrl || p.latestVersion?.mobileUrl
    ).length;
    const withHtml = selectedPages.filter(p => p.latestVersion?.htmlSnapshot).length;
    const withMarkdown = selectedPages.filter(p => p.latestVersion?.markdownContent).length;
    const mobileCount = selectedPages.filter(p => p.latestVersion?.mobileUrl).length;
    const desktopCount = selectedPages.filter(p => p.latestVersion?.desktopUrl).length;
    
    return {
      total: selectedPages.length,
      withScreenshots,
      withHtml,
      withMarkdown,
      mobileCount,
      desktopCount,
      noVersions: selectedPages.filter(p => !p.hasVersions).length,
    };
  }, [selectedPages]);

  // Type counts
  const typeCounts = useMemo(() => ({
    all: landingPages.length,
    canton: landingPages.filter(p => p.pageType === 'canton').length,
    city: landingPages.filter(p => p.pageType === 'city').length,
    regional: landingPages.filter(p => p.pageType === 'regional').length,
    service: landingPages.filter(p => p.pageType === 'service').length,
  }), [landingPages]);

  // Capture screenshots for pages without them
  const captureScreenshots = async () => {
    const pagesWithoutScreenshots = selectedPages.filter(p => 
      !p.latestVersion?.desktopUrl && !p.latestVersion?.mobileUrl
    );
    
    if (pagesWithoutScreenshots.length === 0) {
      toast.info("Alle ausgewählten Seiten haben bereits Screenshots!");
      return;
    }
    
    setIsCapturing(true);
    setProgress(0);
    let successCount = 0;
    let errorCount = 0;
    
    try {
      for (let i = 0; i < pagesWithoutScreenshots.length; i++) {
        const page = pagesWithoutScreenshots[i];
        setProgress(((i + 1) / pagesWithoutScreenshots.length) * 100);
        setStatus(`Erfasse: ${page.displayName}...`);
        
        try {
          // Use PUBLIC URL, not window.location.origin (which is admin-locked preview)
          const fullUrl = `https://umzugscheckv2.lovable.app${page.urlPath}`;
          
          const { error } = await supabase.functions.invoke('capture-landing-page', {
            body: {
              pageId: page.id,
              url: fullUrl,
              captureDesktop: true,
              captureMobile: true,
            },
          });
          
          if (error) {
            console.error(`Failed to capture ${page.urlPath}:`, error);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.error(`Error capturing ${page.urlPath}:`, err);
          errorCount++;
        }
        
        // Delay between captures
        await new Promise(r => setTimeout(r, 2000));
      }
      
      if (successCount > 0) {
        toast.success(`${successCount} Seiten erfolgreich erfasst!`);
        // Refresh data
        await fetchLandingPages(true);
      }
      if (errorCount > 0) {
        toast.warning(`${errorCount} Seiten konnten nicht erfasst werden`);
      }
    } catch (err) {
      console.error("Capture error:", err);
      toast.error("Fehler beim Erfassen der Screenshots");
    } finally {
      setIsCapturing(false);
      setProgress(0);
      setStatus("");
    }
  };

  // Capture single page screenshot
  const captureSinglePage = async (page: LandingPageInfo) => {
    setCapturingPageId(page.id);
    
    try {
      // Use PUBLIC URL, not window.location.origin (which is admin-locked preview)
      const fullUrl = `https://umzugscheckv2.lovable.app${page.urlPath}`;
      
      const { error } = await supabase.functions.invoke('capture-landing-page', {
        body: {
          pageId: page.id,
          url: fullUrl,
          captureDesktop: true,
          captureMobile: true,
        },
      });
      
      if (error) {
        console.error(`Failed to capture ${page.urlPath}:`, error);
        toast.error(`Fehler beim Erfassen von ${page.displayName}`);
      } else {
        toast.success(`${page.displayName} erfolgreich erfasst!`);
        // Close preview modal to force refresh
        setPreviewPage(null);
        // Refresh data
        await fetchLandingPages(true);
      }
    } catch (err) {
      console.error(`Error capturing ${page.urlPath}:`, err);
      toast.error(`Fehler beim Erfassen von ${page.displayName}`);
    } finally {
      setCapturingPageId(null);
    }
  };

  // Download export
  const downloadExport = async () => {
    if (selectedPages.length === 0) {
      toast.error("Keine Seiten ausgewählt");
      return;
    }
    
    setIsDownloading(true);
    setProgress(0);
    
    try {
      const zip = new JSZip();
      const total = selectedPages.length;
      let current = 0;
      
      // Create manifest
      const manifest = {
        generatedAt: new Date().toISOString(),
        exportFormat,
        pageTypeFilter,
        deviceFilter,
        totalPages: selectedPages.length,
        options: {
          includeScreenshots,
          includeHtml,
          includeMarkdown,
          includeMetadata,
          groupByType,
        },
        pages: selectedPages.map(p => ({
          id: p.id,
          name: p.displayName,
          slug: p.slug,
          urlPath: p.urlPath,
          pageType: p.pageType,
          cantonCode: p.cantonCode,
          cityName: p.cityName,
          priority: p.priority,
          hasScreenshots: !!(p.latestVersion?.desktopUrl || p.latestVersion?.mobileUrl),
          hasHtml: !!p.latestVersion?.htmlSnapshot,
          hasMarkdown: !!p.latestVersion?.markdownContent,
          version: p.latestVersion?.versionNumber || 0,
          urls: {
            desktop: p.latestVersion?.desktopUrl,
            mobile: p.latestVersion?.mobileUrl,
          },
        })),
      };
      
      // Add manifest
      zip.file("manifest.json", JSON.stringify(manifest, null, 2));
      
      // Generate summary markdown
      let summaryMd = `# Umzugscheck Landing Pages Export\n\n`;
      summaryMd += `**Generiert:** ${new Date().toISOString()}\n`;
      summaryMd += `**Seiten:** ${selectedPages.length}\n`;
      summaryMd += `**Filter:** ${pageTypeFilter === 'all' ? 'Alle Typen' : pageTypeFilter}\n\n`;
      summaryMd += `---\n\n`;
      
      // Group pages by type
      const pagesByType = new Map<string, LandingPageInfo[]>();
      for (const page of selectedPages) {
        const type = page.pageType || 'other';
        if (!pagesByType.has(type)) pagesByType.set(type, []);
        pagesByType.get(type)!.push(page);
      }
      
      for (const [type, pages] of pagesByType) {
        summaryMd += `## ${type.charAt(0).toUpperCase() + type.slice(1)} (${pages.length})\n\n`;
        for (const page of pages) {
          summaryMd += `### ${page.displayName}\n`;
          summaryMd += `- **URL:** \`${page.urlPath}\`\n`;
          summaryMd += `- **Slug:** \`${page.slug}\`\n`;
          if (page.cantonCode) summaryMd += `- **Kanton:** ${page.cantonCode}\n`;
          if (page.cityName) summaryMd += `- **Stadt:** ${page.cityName}\n`;
          summaryMd += `- **Version:** ${page.latestVersion?.versionNumber || 'N/A'}\n`;
          summaryMd += `\n`;
        }
      }
      
      zip.file("summary.md", summaryMd);
      
      // Generate HTML summary
      let summaryHtml = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Umzugscheck Landing Pages Export</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1400px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    h1 { color: #1e3a5f; margin-bottom: 10px; }
    .meta { background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
    .type-section { margin-bottom: 30px; }
    .type-header { background: #1e3a5f; color: white; padding: 10px 15px; border-radius: 8px 8px 0 0; margin-bottom: 0; }
    .pages-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 15px; padding: 15px; background: white; border-radius: 0 0 8px 8px; }
    .page-card { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; background: #fafafa; }
    .page-card-header { background: #f3f4f6; padding: 10px 15px; border-bottom: 1px solid #e5e7eb; }
    .page-card-header h3 { margin: 0; font-size: 14px; }
    .page-card-body { padding: 10px 15px; }
    .page-card-body p { margin: 4px 0; font-size: 12px; color: #666; }
    .screenshots { display: flex; gap: 10px; margin-top: 10px; }
    .screenshots img { max-width: 150px; border-radius: 4px; border: 1px solid #ddd; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-right: 4px; }
    .badge-canton { background: #dbeafe; color: #1d4ed8; }
    .badge-city { background: #dcfce7; color: #166534; }
    .badge-regional { background: #fef3c7; color: #92400e; }
    .badge-service { background: #f3e8ff; color: #7c3aed; }
  </style>
</head>
<body>
  <h1>🏠 Umzugscheck Landing Pages Export</h1>
  <div class="meta">
    <p><strong>Generiert:</strong> ${new Date().toISOString()}</p>
    <p><strong>Seiten:</strong> ${selectedPages.length}</p>
    <p><strong>Mit Screenshots:</strong> ${stats.withScreenshots}</p>
    <p><strong>Mit HTML:</strong> ${stats.withHtml}</p>
    <p><strong>Mit Markdown:</strong> ${stats.withMarkdown}</p>
  </div>
`;
      
      for (const [type, pages] of pagesByType) {
        summaryHtml += `
  <div class="type-section">
    <h2 class="type-header">${type.charAt(0).toUpperCase() + type.slice(1)} (${pages.length})</h2>
    <div class="pages-grid">
`;
        for (const page of pages) {
          summaryHtml += `
      <div class="page-card">
        <div class="page-card-header">
          <span class="badge badge-${type}">${type}</span>
          <h3>${page.displayName}</h3>
        </div>
        <div class="page-card-body">
          <p><strong>URL:</strong> <code>${page.urlPath}</code></p>
          <p><strong>Slug:</strong> ${page.slug}</p>
          ${page.cantonCode ? `<p><strong>Kanton:</strong> ${page.cantonCode}</p>` : ''}
          ${page.cityName ? `<p><strong>Stadt:</strong> ${page.cityName}</p>` : ''}
          <p><strong>Version:</strong> ${page.latestVersion?.versionNumber || 'N/A'}</p>
`;
          if (includeScreenshots && (page.latestVersion?.desktopUrl || page.latestVersion?.mobileUrl)) {
            summaryHtml += `          <div class="screenshots">\n`;
            if (page.latestVersion?.mobileUrl) {
              summaryHtml += `            <a href="${page.latestVersion.mobileUrl}" target="_blank"><img src="${page.latestVersion.mobileUrl}" alt="Mobile" title="Mobile"></a>\n`;
            }
            if (page.latestVersion?.desktopUrl) {
              summaryHtml += `            <a href="${page.latestVersion.desktopUrl}" target="_blank"><img src="${page.latestVersion.desktopUrl}" alt="Desktop" title="Desktop"></a>\n`;
            }
            summaryHtml += `          </div>\n`;
          }
          summaryHtml += `        </div>
      </div>
`;
        }
        summaryHtml += `    </div>
  </div>
`;
      }
      
      summaryHtml += `</body></html>`;
      zip.file("summary.html", summaryHtml);
      
      // Create folders
      const screenshotsFolder = zip.folder("screenshots");
      const htmlFolder = zip.folder("html");
      const markdownFolder = zip.folder("markdown");
      const metadataFolder = zip.folder("metadata");
      
      // Process each page
      for (const page of selectedPages) {
        current++;
        setProgress((current / total) * 100);
        setStatus(`Verarbeite: ${page.displayName}...`);
        
        const folderPath = groupByType ? `${page.pageType}/${page.slug}` : page.slug;
        
        // Screenshots
        if (includeScreenshots && page.latestVersion) {
          if (page.latestVersion.desktopUrl && deviceFilter !== 'mobile') {
            try {
              const response = await fetch(page.latestVersion.desktopUrl);
              if (response.ok) {
                const blob = await response.blob();
                screenshotsFolder?.file(`${folderPath}/desktop.png`, blob);
              }
            } catch (err) {
              console.error(`Failed to fetch desktop screenshot for ${page.slug}`);
            }
          }
          if (page.latestVersion.mobileUrl && deviceFilter !== 'desktop') {
            try {
              const response = await fetch(page.latestVersion.mobileUrl);
              if (response.ok) {
                const blob = await response.blob();
                screenshotsFolder?.file(`${folderPath}/mobile.png`, blob);
              }
            } catch (err) {
              console.error(`Failed to fetch mobile screenshot for ${page.slug}`);
            }
          }
        }
        
        // HTML
        if (includeHtml && page.latestVersion?.htmlSnapshot) {
          htmlFolder?.file(`${folderPath}.html`, page.latestVersion.htmlSnapshot);
        }
        
        // Markdown
        if (includeMarkdown && page.latestVersion?.markdownContent) {
          markdownFolder?.file(`${folderPath}.md`, page.latestVersion.markdownContent);
        }
        
        // Metadata
        if (includeMetadata) {
          const pageMetadata = {
            id: page.id,
            displayName: page.displayName,
            slug: page.slug,
            urlPath: page.urlPath,
            pageType: page.pageType,
            cantonCode: page.cantonCode,
            cityName: page.cityName,
            priority: page.priority,
            version: page.latestVersion?.versionNumber,
            capturedAt: page.latestVersion?.createdAt,
            meta: page.latestVersion?.metaData,
          };
          metadataFolder?.file(`${folderPath}.json`, JSON.stringify(pageMetadata, null, 2));
        }
      }
      
      // Generate ZIP
      setStatus("Erstelle ZIP-Datei...");
      const content = await zip.generateAsync({ type: "blob" });
      
      // Download
      const filename = `umzugscheck-landingpages-${pageTypeFilter}-${new Date().toISOString().split('T')[0]}.zip`;
      saveAs(content, filename);
      
      toast.success(`Export erfolgreich! ${selectedPages.length} Seiten`);
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Fehler beim Export");
    } finally {
      setIsDownloading(false);
      setProgress(0);
      setStatus("");
    }
  };

  // Toggle page selection
  const togglePageSelection = (pageId: string) => {
    const newSet = new Set(selectedPageIds);
    if (newSet.has(pageId)) {
      newSet.delete(pageId);
    } else {
      newSet.add(pageId);
    }
    setSelectedPageIds(newSet);
  };

  // Select/deselect all
  const toggleAllPages = (select: boolean) => {
    if (select) {
      setSelectedPageIds(new Set(filteredPages.map(p => p.id)));
    } else {
      setSelectedPageIds(new Set());
    }
  };

  // Copy all URLs
  const copyAllUrls = () => {
    const urls = selectedPages.map(p => `https://www.umzugscheck.ch${p.urlPath}`).join('\n');
    navigator.clipboard.writeText(urls);
    toast.success(`${selectedPages.length} URLs kopiert!`);
  };

  // Get page type icon
  const getPageTypeIcon = (type: string) => {
    switch (type) {
      case 'canton': return <MapPin className="h-3.5 w-3.5" />;
      case 'city': return <Building2 className="h-3.5 w-3.5" />;
      case 'regional': return <Globe className="h-3.5 w-3.5" />;
      case 'service': return <LayoutGrid className="h-3.5 w-3.5" />;
      default: return <Globe className="h-3.5 w-3.5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Lade Landing Pages...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with sync */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Landing Pages Export</h3>
          <p className="text-sm text-muted-foreground">
            {landingPages.length} Seiten verfügbar
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchLandingPages(true)}
            disabled={isSyncing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync
          </Button>
          {lastSynced && (
            <span className="text-xs text-muted-foreground">
              {lastSynced.toLocaleTimeString('de-CH')}
            </span>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Filter className="h-3 w-3" />
            Seiten-Typ
          </label>
          <Select value={pageTypeFilter} onValueChange={(v: PageType) => setPageTypeFilter(v)}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle ({typeCounts.all})</SelectItem>
              <SelectItem value="canton">Kanton ({typeCounts.canton})</SelectItem>
              <SelectItem value="city">Stadt ({typeCounts.city})</SelectItem>
              <SelectItem value="regional">Regional ({typeCounts.regional})</SelectItem>
              <SelectItem value="service">Service ({typeCounts.service})</SelectItem>
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
        
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Search className="h-3 w-3" />
            Suche
          </label>
          <Input
            placeholder="Name, URL, Kanton..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 text-sm"
          />
        </div>
      </div>

      {/* Page Selector */}
      <Collapsible open={showPageSelector} onOpenChange={setShowPageSelector}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Seiten auswählen ({selectedPageIds.size > 0 ? selectedPageIds.size : 'Alle'} von {filteredPages.length})
            </span>
            <ChevronRight className={`h-4 w-4 transition-transform ${showPageSelector ? 'rotate-90' : ''}`} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="flex gap-2 mb-2">
            <Button variant="outline" size="sm" onClick={() => toggleAllPages(true)}>
              <CheckCheck className="h-3.5 w-3.5 mr-1" />
              Alle
            </Button>
            <Button variant="outline" size="sm" onClick={() => toggleAllPages(false)}>
              <XCircle className="h-3.5 w-3.5 mr-1" />
              Keine
            </Button>
            <Button variant="outline" size="sm" onClick={copyAllUrls}>
              <Copy className="h-3.5 w-3.5 mr-1" />
              URLs kopieren
            </Button>
          </div>
          <ScrollArea className="h-80 border rounded-md p-2">
            <div className="space-y-2">
              {filteredPages.map(page => (
                <div 
                  key={page.id}
                  className="flex items-start gap-3 p-3 hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition-colors"
                >
                  <Checkbox 
                    checked={selectedPageIds.size === 0 || selectedPageIds.has(page.id)}
                    onCheckedChange={() => togglePageSelection(page.id)}
                    className="mt-1"
                  />
                  
                  {/* Screenshot Thumbnails */}
                  <div className="flex gap-1 shrink-0">
                    {page.latestVersion?.mobileUrl ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewPage(page);
                          setPreviewDevice('mobile');
                        }}
                        className="w-8 h-14 rounded border border-border overflow-hidden hover:ring-2 ring-primary transition-all bg-muted"
                        title="Mobile Screenshot anzeigen"
                      >
                        <img 
                          src={page.latestVersion.mobileUrl} 
                          alt="Mobile" 
                          className="w-full h-full object-cover object-top"
                        />
                      </button>
                    ) : (
                      <div className="w-8 h-14 rounded border border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/50">
                        <Smartphone className="h-3 w-3 text-muted-foreground/50" />
                      </div>
                    )}
                    {page.latestVersion?.desktopUrl ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewPage(page);
                          setPreviewDevice('desktop');
                        }}
                        className="w-16 h-14 rounded border border-border overflow-hidden hover:ring-2 ring-primary transition-all bg-muted"
                        title="Desktop Screenshot anzeigen"
                      >
                        <img 
                          src={page.latestVersion.desktopUrl} 
                          alt="Desktop" 
                          className="w-full h-full object-cover object-top"
                        />
                      </button>
                    ) : (
                      <div className="w-16 h-14 rounded border border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/50">
                        <Monitor className="h-3 w-3 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  
                  {/* Page Info */}
                  <div className="flex-1 min-w-0" onClick={() => togglePageSelection(page.id)}>
                    <div className="flex items-center gap-2">
                      {getPageTypeIcon(page.pageType)}
                      <span className="text-sm font-medium truncate">{page.displayName}</span>
                    </div>
                    <span className="text-xs text-muted-foreground truncate block">{page.urlPath}</span>
                    <div className="flex items-center gap-2 mt-1">
                      {page.latestVersion?.htmlSnapshot && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1">HTML</Badge>
                      )}
                      {page.latestVersion?.markdownContent && (
                        <Badge variant="outline" className="text-[10px] h-4 px-1">MD</Badge>
                      )}
                      {page.latestVersion && (
                        <span className="text-[10px] text-muted-foreground">
                          v{page.latestVersion.versionNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              captureSinglePage(page);
                            }}
                            disabled={capturingPageId === page.id || isCapturing}
                          >
                            {capturingPageId === page.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <RotateCcw className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Screenshot neu erfassen</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://www.umzugscheck.ch${page.urlPath}`, '_blank');
                            }}
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Seite öffnen</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-center">
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-xl font-bold text-primary">{stats.total}</div>
          <div className="text-[10px] text-muted-foreground">Seiten</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-xl font-bold text-green-500">{stats.withScreenshots}</div>
          <div className="text-[10px] text-muted-foreground">Screenshots</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-xl font-bold text-blue-500">{stats.mobileCount}</div>
          <div className="text-[10px] text-muted-foreground">Mobile</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-xl font-bold text-purple-500">{stats.desktopCount}</div>
          <div className="text-[10px] text-muted-foreground">Desktop</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-xl font-bold text-orange-500">{stats.withHtml}</div>
          <div className="text-[10px] text-muted-foreground">HTML</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-2">
          <div className="text-xl font-bold text-amber-500">{stats.withMarkdown}</div>
          <div className="text-[10px] text-muted-foreground">Markdown</div>
        </div>
      </div>

      {/* Capture button for missing screenshots */}
      {stats.noVersions > 0 && (
        <div className="space-y-3">
          <Button 
            onClick={captureScreenshots}
            disabled={isCapturing || isDownloading}
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            {isCapturing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Erfasse Screenshots... {Math.round(progress)}%
              </>
            ) : (
              <>
                <Camera className="h-5 w-5 mr-2" />
                🚀 Screenshots erfassen ({stats.noVersions} Seiten ohne)
              </>
            )}
          </Button>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  {stats.noVersions} Seiten ohne Screenshots
                </span>
                <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-1">
                  Klicke auf "Screenshots erfassen" um automatisch alle fehlenden Screenshots zu erstellen.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-4">
        <h4 className="font-medium text-sm flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Export-Optionen
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Switch 
              checked={includeScreenshots} 
              onCheckedChange={setIncludeScreenshots}
              id="screenshots"
            />
            <label htmlFor="screenshots" className="text-sm cursor-pointer flex items-center gap-1">
              <FileImage className="h-3.5 w-3.5" />
              Screenshots
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              checked={includeHtml} 
              onCheckedChange={setIncludeHtml}
              id="html"
            />
            <label htmlFor="html" className="text-sm cursor-pointer flex items-center gap-1">
              <Code className="h-3.5 w-3.5" />
              HTML
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              checked={includeMarkdown} 
              onCheckedChange={setIncludeMarkdown}
              id="markdown"
            />
            <label htmlFor="markdown" className="text-sm cursor-pointer flex items-center gap-1">
              <FileText className="h-3.5 w-3.5" />
              Markdown
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch 
              checked={includeMetadata} 
              onCheckedChange={setIncludeMetadata}
              id="metadata"
            />
            <label htmlFor="metadata" className="text-sm cursor-pointer flex items-center gap-1">
              <FileJson className="h-3.5 w-3.5" />
              Metadata
            </label>
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-2 border-t">
          <Switch 
            checked={groupByType} 
            onCheckedChange={setGroupByType}
            id="groupByType"
          />
          <label htmlFor="groupByType" className="text-sm cursor-pointer">
            Nach Typ gruppieren (canton/, city/, regional/, service/)
          </label>
        </div>
      </div>

      {/* ZIP Contents Preview */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-sm">Inhalt der ZIP-Datei:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileJson className="h-4 w-4 text-blue-500" />
            <span>manifest.json</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="h-4 w-4 text-green-500" />
            <span>summary.md</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileCode className="h-4 w-4 text-orange-500" />
            <span>summary.html</span>
            <Badge variant="outline" className="text-xs">mit Previews</Badge>
          </div>
          {includeScreenshots && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Image className="h-4 w-4 text-purple-500" />
              <span>screenshots/</span>
              <Badge variant="outline" className="text-xs">{stats.mobileCount + stats.desktopCount} PNG</Badge>
            </div>
          )}
          {includeHtml && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Code className="h-4 w-4 text-cyan-500" />
              <span>html/</span>
              <Badge variant="outline" className="text-xs">{stats.withHtml} HTML</Badge>
            </div>
          )}
          {includeMarkdown && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4 text-yellow-500" />
              <span>markdown/</span>
              <Badge variant="outline" className="text-xs">{stats.withMarkdown} MD</Badge>
            </div>
          )}
          {includeMetadata && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileJson className="h-4 w-4 text-pink-500" />
              <span>metadata/</span>
              <Badge variant="outline" className="text-xs">{stats.total} JSON</Badge>
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      {(isDownloading || isCapturing) && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">{status}</p>
        </div>
      )}

      {/* Download Button */}
      <Button 
        onClick={downloadExport}
        disabled={isDownloading || isCapturing || selectedPages.length === 0}
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
            ZIP herunterladen ({selectedPages.length} Seiten)
          </>
        )}
      </Button>

      {/* Screenshot Preview Modal */}
      <Dialog open={!!previewPage} onOpenChange={() => setPreviewPage(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewPage && getPageTypeIcon(previewPage.pageType)}
              {previewPage?.displayName}
            </DialogTitle>
            <DialogDescription>
              {previewPage?.urlPath}
            </DialogDescription>
          </DialogHeader>
          
          {/* Device Toggle */}
          <div className="flex items-center justify-center gap-2 py-2">
            <Button
              variant={previewDevice === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewDevice('mobile')}
              disabled={!previewPage?.latestVersion?.mobileUrl}
            >
              <Smartphone className="h-4 w-4 mr-1" />
              Mobile
            </Button>
            <Button
              variant={previewDevice === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewDevice('desktop')}
              disabled={!previewPage?.latestVersion?.desktopUrl}
            >
              <Monitor className="h-4 w-4 mr-1" />
              Desktop
            </Button>
          </div>
          
          {/* Screenshot Display */}
          <div className="flex-1 overflow-auto bg-muted/30 rounded-lg p-4 flex items-start justify-center">
            {previewPage?.latestVersion && (
              previewDevice === 'mobile' && previewPage.latestVersion.mobileUrl ? (
                <img 
                  src={previewPage.latestVersion.mobileUrl}
                  alt={`Mobile Screenshot: ${previewPage.displayName}`}
                  className="max-w-full max-h-[60vh] rounded-lg shadow-lg border"
                />
              ) : previewDevice === 'desktop' && previewPage.latestVersion.desktopUrl ? (
                <img 
                  src={previewPage.latestVersion.desktopUrl}
                  alt={`Desktop Screenshot: ${previewPage.displayName}`}
                  className="max-w-full max-h-[60vh] rounded-lg shadow-lg border"
                />
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>Kein {previewDevice === 'mobile' ? 'Mobile' : 'Desktop'} Screenshot verfügbar</p>
                </div>
              )
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {previewPage?.latestVersion?.createdAt && (
                <span>Erstellt: {new Date(previewPage.latestVersion.createdAt).toLocaleDateString('de-CH')}</span>
              )}
              <Badge variant="outline">v{previewPage?.latestVersion?.versionNumber}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => previewPage && captureSinglePage(previewPage)}
                disabled={capturingPageId === previewPage?.id}
              >
                {capturingPageId === previewPage?.id ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4 mr-1" />
                )}
                Neu erfassen
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => previewPage && window.open(`https://www.umzugscheck.ch${previewPage.urlPath}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Seite öffnen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LandingPageExport;

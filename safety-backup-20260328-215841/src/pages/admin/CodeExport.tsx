import { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Copy, Check, FileCode, ChevronDown, ChevronRight, RefreshCw, Filter, Package, Braces, FileJson, Loader2 } from "lucide-react";
import { toast } from "sonner";
import JSZip from "jszip";

interface FileSection {
  title: string;
  files: string[];
  content?: string;
}

interface DirectFile {
  path: string;
  category: string;
  selected: boolean;
}

// Direkte Datei-Kategorien für den Export
const FILE_CATEGORIES = {
  "Design System": [
    "src/index.css",
    "tailwind.config.ts",
  ],
  "Pages": [
    "src/pages/Index.tsx",
    "src/pages/Umzugsrechner.tsx",
    "src/pages/Reinigungsrechner.tsx",
    "src/pages/Entsorgungsrechner.tsx",
    "src/pages/Firmenumzug.tsx",
    "src/pages/UmzugsOfferten.tsx",
    "src/pages/Firmen.tsx",
    "src/pages/RegionalDetail.tsx",
    "src/pages/CompanyDetail.tsx",
  ],
  "Components - Layout": [
    "src/components/layout/Header.tsx",
    "src/components/layout/Footer.tsx",
    "src/components/layout/Navigation.tsx",
  ],
  "Components - Homepage": [
    "src/components/homepage/HeroSection.tsx",
    "src/components/homepage/TrustSection.tsx",
    "src/components/homepage/ServicesSection.tsx",
    "src/components/homepage/CTASection.tsx",
  ],
  "Components - UI": [
    "src/components/ui/button.tsx",
    "src/components/ui/card.tsx",
    "src/components/ui/input.tsx",
    "src/components/ui/badge.tsx",
  ],
  "Calculators": [
    "src/components/calculator/UnifiedCalculator.tsx",
    "src/components/calculator/CalculatorProgress.tsx",
    "src/components/calculator/EstimateDisplay.tsx",
  ],
  "Companies": [
    "src/components/companies/CompanyCard.tsx",
    "src/components/companies/CompanyFilters.tsx",
    "src/components/companies/CompanyRanking.tsx",
  ],
  "Config & Types": [
    "src/integrations/supabase/types.ts",
  ],
};

const CodeExport = () => {
  const [exportContent, setExportContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [sections, setSections] = useState<FileSection[]>([]);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [generatedAt, setGeneratedAt] = useState<string>("");
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());
  
  // Direct file loading state
  const [directFiles, setDirectFiles] = useState<Record<string, DirectFile[]>>({});
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(Object.keys(FILE_CATEGORIES)));
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [filesLoaded, setFilesLoaded] = useState(false);

  // Initialize direct files
  useEffect(() => {
    const files: Record<string, DirectFile[]> = {};
    Object.entries(FILE_CATEGORIES).forEach(([category, paths]) => {
      files[category] = paths.map(path => ({
        path,
        category,
        selected: true,
      }));
    });
    setDirectFiles(files);
  }, []);

  const fetchExport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/chatgpt-export.txt");
      if (!response.ok) throw new Error("Export not found");
      const text = await response.text();
      if (text.trim().length < 100) {
        throw new Error("Export file is empty or invalid");
      }
      setExportContent(text);
      parseExportContent(text);
    } catch (error) {
      console.log("Export file not available, using direct file loading");
      setExportContent("");
      setSections([]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseExportContent = (content: string) => {
    const timestampMatch = content.match(/# Generated: (.+?)(?:\n|\()/);
    if (timestampMatch) {
      const dateStr = timestampMatch[1].trim();
      try {
        setGeneratedAt(new Date(dateStr).toLocaleString("de-CH"));
      } catch {
        setGeneratedAt(dateStr);
      }
    }

    const sectionRegex = /={60,}\n([A-Z][A-Z0-9\s\-_&]+)\n={60,}/g;
    
    const parsedSections: FileSection[] = [];
    let sectionMatch;
    const sectionPositions: { title: string; start: number; end: number }[] = [];

    while ((sectionMatch = sectionRegex.exec(content)) !== null) {
      sectionPositions.push({
        title: sectionMatch[1].trim(),
        start: sectionMatch.index,
        end: content.length
      });
    }

    for (let i = 0; i < sectionPositions.length; i++) {
      if (i < sectionPositions.length - 1) {
        sectionPositions[i].end = sectionPositions[i + 1].start;
      }
    }

    for (const section of sectionPositions) {
      const sectionContent = content.slice(section.start, section.end);
      
      const filePatterns = [
        /FILE: (.+)/g,
        /\/\/ File: (.+)/g,
        /src\/[a-zA-Z0-9\-_\/]+\.[a-z]+/g
      ];
      
      const files: string[] = [];
      for (const pattern of filePatterns) {
        let fileMatch;
        while ((fileMatch = pattern.exec(sectionContent)) !== null) {
          const file = fileMatch[1] || fileMatch[0];
          if (!files.includes(file)) {
            files.push(file);
          }
        }
        pattern.lastIndex = 0;
      }

      let sectionFiles = files;
      if (sectionFiles.length === 0) {
        if (section.title.includes("DESIGN")) {
          sectionFiles = ["src/index.css", "tailwind.config.ts"];
        } else if (section.title.includes("TAILWIND")) {
          sectionFiles = ["tailwind.config.ts"];
        } else if (section.title.includes("COMPONENT")) {
          sectionFiles = ["src/components/"];
        } else {
          sectionFiles = ["(inline content)"];
        }
      }

      parsedSections.push({
        title: section.title,
        files: sectionFiles,
        content: sectionContent
      });
    }

    setSections(parsedSections);
    setSelectedSections(new Set(parsedSections.map(s => s.title)));
  };

  // Load files directly from the project
  const loadDirectFiles = useCallback(async () => {
    setLoadingFiles(true);
    const contents: Record<string, string> = {};
    
    const allPaths = Object.values(FILE_CATEGORIES).flat();
    
    for (const filePath of allPaths) {
      try {
        // Try to fetch from public or as module
        const response = await fetch(`/${filePath}`);
        if (response.ok) {
          contents[filePath] = await response.text();
        } else {
          // File not accessible via fetch, mark as unavailable
          contents[filePath] = `// File not accessible: ${filePath}\n// This file exists but cannot be fetched directly.`;
        }
      } catch {
        contents[filePath] = `// Could not load: ${filePath}`;
      }
    }
    
    setFileContents(contents);
    setFilesLoaded(true);
    setLoadingFiles(false);
    toast.success("Dateien geladen");
  }, []);

  useEffect(() => {
    fetchExport();
  }, []);

  const filteredExportContent = useMemo(() => {
    if (selectedSections.size === sections.length) {
      return exportContent;
    }

    const selectedSectionContents = sections
      .filter(s => selectedSections.has(s.title))
      .map(s => s.content || "")
      .join("\n");

    const timestamp = new Date().toISOString();
    const header = `# Design System & Components Export (Gefiltert)
# Generated: ${timestamp}
# Enthält: ${Array.from(selectedSections).join(", ")}

`;
    return header + selectedSectionContents;
  }, [selectedSections, sections, exportContent]);

  // Build combined export from selected categories
  const buildDirectExport = useCallback(() => {
    const timestamp = new Date().toISOString();
    let output = `# Umzugscheck.ch - Code Export
# Generated: ${timestamp}
# Categories: ${Array.from(selectedCategories).join(", ")}

`;

    for (const category of Array.from(selectedCategories)) {
      const files = directFiles[category] || [];
      if (files.length === 0) continue;

      output += `\n${"=".repeat(80)}\n`;
      output += `${category.toUpperCase()}\n`;
      output += `${"=".repeat(80)}\n`;

      for (const file of files) {
        if (!file.selected) continue;
        output += `\n${"-".repeat(60)}\n`;
        output += `FILE: ${file.path}\n`;
        output += `${"-".repeat(60)}\n\n`;
        output += fileContents[file.path] || `// Content not loaded for: ${file.path}`;
        output += "\n";
      }
    }

    return output;
  }, [selectedCategories, directFiles, fileContents]);

  // Build JSON export
  const buildJsonExport = useCallback(() => {
    const data: Record<string, any> = {
      meta: {
        generated: new Date().toISOString(),
        categories: Array.from(selectedCategories),
        totalFiles: Object.values(directFiles)
          .flat()
          .filter(f => f.selected && selectedCategories.has(f.category)).length,
      },
      files: {},
    };

    for (const category of Array.from(selectedCategories)) {
      data.files[category] = {};
      const files = directFiles[category] || [];
      for (const file of files) {
        if (!file.selected) continue;
        data.files[category][file.path] = fileContents[file.path] || null;
      }
    }

    return JSON.stringify(data, null, 2);
  }, [selectedCategories, directFiles, fileContents]);

  const handleDownload = () => {
    const blob = new Blob([filteredExportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const suffix = selectedSections.size === sections.length ? "" : "-filtered";
    a.download = `code-export${suffix}-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Export heruntergeladen");
  };

  const handleDirectDownload = () => {
    const content = buildDirectExport();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `umzugscheck-code-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Export heruntergeladen");
  };

  const handleJsonDownload = () => {
    const content = buildJsonExport();
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `umzugscheck-code-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("JSON Export heruntergeladen");
  };

  const handleZipDownload = async () => {
    const zip = new JSZip();
    
    // Add text export
    zip.file("code-export.txt", buildDirectExport());
    
    // Add JSON export
    zip.file("code-export.json", buildJsonExport());
    
    // Add individual files in folders
    for (const category of Array.from(selectedCategories)) {
      const files = directFiles[category] || [];
      for (const file of files) {
        if (!file.selected) continue;
        const content = fileContents[file.path];
        if (content) {
          zip.file(file.path, content);
        }
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `umzugscheck-complete-${new Date().toISOString().split("T")[0]}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("ZIP-Archiv heruntergeladen");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(filteredExportContent);
    setCopied(true);
    toast.success("In Zwischenablage kopiert");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectCopy = async () => {
    await navigator.clipboard.writeText(buildDirectExport());
    setCopied(true);
    toast.success("In Zwischenablage kopiert");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJsonCopy = async () => {
    await navigator.clipboard.writeText(buildJsonExport());
    setCopied(true);
    toast.success("JSON in Zwischenablage kopiert");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSection = (title: string) => {
    const newOpen = new Set(openSections);
    if (newOpen.has(title)) {
      newOpen.delete(title);
    } else {
      newOpen.add(title);
    }
    setOpenSections(newOpen);
  };

  const toggleSectionSelection = (title: string) => {
    const newSelected = new Set(selectedSections);
    if (newSelected.has(title)) {
      newSelected.delete(title);
    } else {
      newSelected.add(title);
    }
    setSelectedSections(newSelected);
  };

  const toggleCategorySelection = (category: string) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(category)) {
      newSelected.delete(category);
    } else {
      newSelected.add(category);
    }
    setSelectedCategories(newSelected);
  };

  const toggleFileSelection = (category: string, path: string) => {
    setDirectFiles(prev => ({
      ...prev,
      [category]: prev[category].map(f => 
        f.path === path ? { ...f, selected: !f.selected } : f
      )
    }));
  };

  const selectAll = () => setSelectedSections(new Set(sections.map(s => s.title)));
  const selectNone = () => setSelectedSections(new Set());
  const selectAllCategories = () => setSelectedCategories(new Set(Object.keys(FILE_CATEGORIES)));
  const selectNoCategories = () => setSelectedCategories(new Set());

  const selectedFiles = sections
    .filter(s => selectedSections.has(s.title))
    .reduce((acc, s) => acc + s.files.length, 0);

  const totalFiles = sections.reduce((acc, s) => acc + s.files.length, 0);
  const exportSize = new Blob([filteredExportContent]).size;
  const exportSizeFormatted = exportSize > 1024 * 1024 
    ? `${(exportSize / 1024 / 1024).toFixed(2)} MB`
    : `${(exportSize / 1024).toFixed(1)} KB`;

  const directFilesCount = Object.values(directFiles)
    .flat()
    .filter(f => f.selected && selectedCategories.has(f.category)).length;

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Code Export für ChatGPT</h1>
          <p className="text-muted-foreground">
            Vollständiger Export des Design Systems und aller Komponenten für AI-Reviews.
          </p>
        </div>

        <Tabs defaultValue="direct" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="direct" className="gap-2">
              <FileCode className="h-4 w-4" />
              Direkt-Export
            </TabsTrigger>
            <TabsTrigger value="prebuilt" className="gap-2">
              <Package className="h-4 w-4" />
              Build-Export
            </TabsTrigger>
            <TabsTrigger value="json" className="gap-2">
              <Braces className="h-4 w-4" />
              JSON Export
            </TabsTrigger>
          </TabsList>

          {/* Direct Export Tab */}
          <TabsContent value="direct" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Actions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="h-5 w-5" />
                    Direkt-Export
                  </CardTitle>
                  <CardDescription>
                    Lade Dateien direkt aus dem Projekt
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Kategorien</p>
                      <p className="text-2xl font-bold">{selectedCategories.size}/{Object.keys(FILE_CATEGORIES).length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Dateien</p>
                      <p className="text-2xl font-bold">{directFilesCount}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-4">
                    <Button 
                      onClick={loadDirectFiles} 
                      disabled={loadingFiles}
                      variant={filesLoaded ? "outline" : "default"}
                      className="w-full"
                    >
                      {loadingFiles ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                      )}
                      {filesLoaded ? "Neu laden" : "Dateien laden"}
                    </Button>
                    
                    <Button 
                      onClick={handleDirectDownload} 
                      disabled={!filesLoaded || selectedCategories.size === 0} 
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Als TXT
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleDirectCopy} 
                      disabled={!filesLoaded || selectedCategories.size === 0} 
                      className="w-full"
                    >
                      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copied ? "Kopiert!" : "Kopieren"}
                    </Button>

                    <Button 
                      variant="secondary" 
                      onClick={handleZipDownload} 
                      disabled={!filesLoaded || selectedCategories.size === 0} 
                      className="w-full"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Alles als ZIP
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Category Browser */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Kategorien wählen
                      </CardTitle>
                      <CardDescription>
                        Wähle aus, welche Dateien exportiert werden sollen
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={selectAllCategories}>Alle</Button>
                      <Button variant="outline" size="sm" onClick={selectNoCategories}>Keine</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-2">
                      {Object.entries(FILE_CATEGORIES).map(([category, paths]) => (
                        <Collapsible
                          key={category}
                          open={openSections.has(category)}
                          onOpenChange={() => toggleSection(category)}
                        >
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              checked={selectedCategories.has(category)}
                              onCheckedChange={() => toggleCategorySelection(category)}
                              id={`cat-${category}`}
                            />
                            <CollapsibleTrigger className="flex items-center justify-between flex-1 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                              <div className="flex items-center gap-2">
                                {openSections.has(category) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                <span className="font-medium">{category}</span>
                              </div>
                              <Badge variant={selectedCategories.has(category) ? "default" : "secondary"}>
                                {paths.length} Dateien
                              </Badge>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent className="pt-2">
                            <div className="ml-10 space-y-1">
                              {directFiles[category]?.map((file) => (
                                <div
                                  key={file.path}
                                  className="flex items-center gap-2 text-sm py-1 px-2 rounded hover:bg-muted/30"
                                >
                                  <Checkbox 
                                    checked={file.selected}
                                    onCheckedChange={() => toggleFileSelection(category, file.path)}
                                    id={`file-${file.path}`}
                                  />
                                  <span className="font-mono text-muted-foreground">{file.path}</span>
                                  {fileContents[file.path] && (
                                    <Badge variant="outline" className="ml-auto text-xs">
                                      {(fileContents[file.path].length / 1024).toFixed(1)}KB
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            {filesLoaded && (
              <Card>
                <CardHeader>
                  <CardTitle>Vorschau</CardTitle>
                  <CardDescription>Die ersten 3000 Zeichen des Exports</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <pre className="text-xs font-mono whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                      {buildDirectExport().slice(0, 3000)}
                      {buildDirectExport().length > 3000 && "\n\n... (gekürzt)"}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Prebuilt Export Tab */}
          <TabsContent value="prebuilt" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Build Export
                  </CardTitle>
                  <CardDescription>
                    Generiert während npm run build
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Sektionen</p>
                      <p className="text-2xl font-bold">{selectedSections.size}/{sections.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Dateien</p>
                      <p className="text-2xl font-bold">{selectedFiles}/{totalFiles}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Grösse</p>
                      <p className="text-lg font-semibold">{exportSizeFormatted}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Generiert</p>
                      <p className="text-xs">{generatedAt || "-"}</p>
                    </div>
                  </div>

                  {sections.length === 0 && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm">
                      <p className="font-medium text-amber-600">Export nicht verfügbar</p>
                      <p className="text-muted-foreground mt-1">
                        Die Build-Export-Datei wurde nicht gefunden. Nutze den "Direkt-Export" Tab stattdessen.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-4">
                    <Button onClick={handleDownload} disabled={isLoading || selectedSections.size === 0 || sections.length === 0} className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Herunterladen
                    </Button>
                    <Button variant="outline" onClick={handleCopy} disabled={isLoading || selectedSections.size === 0 || sections.length === 0} className="w-full">
                      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {copied ? "Kopiert!" : "Kopieren"}
                    </Button>
                    <Button variant="ghost" onClick={fetchExport} disabled={isLoading} className="w-full">
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                      Aktualisieren
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Sektionen filtern
                      </CardTitle>
                      <CardDescription>
                        Wähle aus, welche Sektionen exportiert werden sollen
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={selectAll} disabled={sections.length === 0}>Alle</Button>
                      <Button variant="outline" size="sm" onClick={selectNone} disabled={sections.length === 0}>Keine</Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] pr-4">
                    {sections.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        Keine Sektionen verfügbar
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {sections.map((section) => (
                          <Collapsible
                            key={section.title}
                            open={openSections.has(section.title)}
                            onOpenChange={() => toggleSection(section.title)}
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                checked={selectedSections.has(section.title)}
                                onCheckedChange={() => toggleSectionSelection(section.title)}
                                id={`section-${section.title}`}
                              />
                              <CollapsibleTrigger className="flex items-center justify-between flex-1 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                                <div className="flex items-center gap-2">
                                  {openSections.has(section.title) ? (
                                    <ChevronDown className="h-4 w-4" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4" />
                                  )}
                                  <span className="font-medium">{section.title}</span>
                                </div>
                                <Badge variant={selectedSections.has(section.title) ? "default" : "secondary"}>
                                  {section.files.length} Dateien
                                </Badge>
                              </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent className="pt-2">
                              <div className="ml-10 space-y-1">
                                {section.files.map((file) => (
                                  <div
                                    key={file}
                                    className="text-sm text-muted-foreground py-1 px-2 rounded hover:bg-muted/30 font-mono"
                                  >
                                    {file}
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {sections.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Vorschau</CardTitle>
                  <CardDescription>Die ersten 2000 Zeichen des gefilterten Exports</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <pre className="text-xs font-mono whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                      {filteredExportContent.slice(0, 2000)}
                      {filteredExportContent.length > 2000 && "\n\n... (gekürzt)"}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* JSON Export Tab */}
          <TabsContent value="json" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileJson className="h-5 w-5" />
                    JSON Export
                  </CardTitle>
                  <CardDescription>
                    Strukturierter Export für programmatische Nutzung
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Kategorien</p>
                      <p className="text-2xl font-bold">{selectedCategories.size}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Dateien</p>
                      <p className="text-2xl font-bold">{directFilesCount}</p>
                    </div>
                  </div>

                  {!filesLoaded && (
                    <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm">
                      <p className="text-muted-foreground">
                        Lade zuerst die Dateien im "Direkt-Export" Tab.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-4">
                    <Button 
                      onClick={handleJsonDownload} 
                      disabled={!filesLoaded || selectedCategories.size === 0} 
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      JSON herunterladen
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleJsonCopy} 
                      disabled={!filesLoaded || selectedCategories.size === 0} 
                      className="w-full"
                    >
                      {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      JSON kopieren
                    </Button>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg text-xs">
                    <p className="font-medium mb-1">💡 ChatGPT Tipp</p>
                    <p className="text-muted-foreground">
                      JSON-Format eignet sich besonders für strukturierte Analysen und API-Integrationen.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>JSON Vorschau</CardTitle>
                  <CardDescription>Strukturierte Daten</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <pre className="text-xs font-mono whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
                      {filesLoaded ? buildJsonExport().slice(0, 5000) : "// Dateien nicht geladen"}
                      {filesLoaded && buildJsonExport().length > 5000 && "\n\n... (gekürzt)"}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default CodeExport;

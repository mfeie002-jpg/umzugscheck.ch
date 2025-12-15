import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Download, Copy, Check, FileCode, ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface FileSection {
  title: string;
  files: string[];
}

const CodeExport = () => {
  const [exportContent, setExportContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [sections, setSections] = useState<FileSection[]>([]);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set());
  const [generatedAt, setGeneratedAt] = useState<string>("");

  const fetchExport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/chatgpt-export.txt");
      if (!response.ok) throw new Error("Export not found");
      const text = await response.text();
      setExportContent(text);
      parseExportContent(text);
    } catch (error) {
      toast.error("Export-Datei nicht gefunden. Bitte Build ausführen.");
    } finally {
      setIsLoading(false);
    }
  };

  const parseExportContent = (content: string) => {
    const timestampMatch = content.match(/# Generated: (.+)/);
    if (timestampMatch) {
      setGeneratedAt(new Date(timestampMatch[1]).toLocaleString("de-CH"));
    }

    const sectionRegex = /={80}\n([A-Z\s]+)\n={80}/g;
    const fileRegex = /-{80}\nFILE: (.+)\n-{80}/g;
    
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
      const files: string[] = [];
      let fileMatch;
      
      while ((fileMatch = fileRegex.exec(sectionContent)) !== null) {
        files.push(fileMatch[1]);
      }
      fileRegex.lastIndex = 0;

      if (files.length > 0 || section.title === "DESIGN SYSTEM") {
        parsedSections.push({
          title: section.title,
          files: files.length > 0 ? files : ["src/index.css", "tailwind.config.ts"]
        });
      }
    }

    setSections(parsedSections);
  };

  useEffect(() => {
    fetchExport();
  }, []);

  const handleDownload = () => {
    const blob = new Blob([exportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `umzugscheck-code-export-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Export heruntergeladen");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(exportContent);
    setCopied(true);
    toast.success("In Zwischenablage kopiert");
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

  const totalFiles = sections.reduce((acc, s) => acc + s.files.length, 0);
  const exportSize = new Blob([exportContent]).size;
  const exportSizeFormatted = exportSize > 1024 * 1024 
    ? `${(exportSize / 1024 / 1024).toFixed(2)} MB`
    : `${(exportSize / 1024).toFixed(1)} KB`;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Code Export für ChatGPT</h1>
        <p className="text-muted-foreground">
          Vollständiger Export des Design Systems und aller Komponenten für AI-Reviews.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Stats & Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Export Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Sektionen</p>
                <p className="text-2xl font-bold">{sections.length}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dateien</p>
                <p className="text-2xl font-bold">{totalFiles}</p>
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

            <div className="flex flex-col gap-2 pt-4">
              <Button onClick={handleDownload} disabled={isLoading} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Herunterladen
              </Button>
              <Button variant="outline" onClick={handleCopy} disabled={isLoading} className="w-full">
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

        {/* File Browser */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enthaltene Dateien</CardTitle>
            <CardDescription>
              Klicke auf eine Sektion um die Dateien zu sehen
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {sections.map((section) => (
                  <Collapsible
                    key={section.title}
                    open={openSections.has(section.title)}
                    onOpenChange={() => toggleSection(section.title)}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                      <div className="flex items-center gap-2">
                        {openSections.has(section.title) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <span className="font-medium">{section.title}</span>
                      </div>
                      <Badge variant="secondary">{section.files.length} Dateien</Badge>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <div className="ml-6 space-y-1">
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
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Vorschau</CardTitle>
          <CardDescription>Die ersten 2000 Zeichen des Exports</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <pre className="text-xs font-mono whitespace-pre-wrap bg-muted/30 p-4 rounded-lg">
              {exportContent.slice(0, 2000)}
              {exportContent.length > 2000 && "\n\n... (gekürzt)"}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeExport;

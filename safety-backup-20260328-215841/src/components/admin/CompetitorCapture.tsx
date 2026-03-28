import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Users, Plus, Trash2, Camera, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { addScreenshotRenderParamIfHost } from "@/lib/screenshot-render-mode";

const SCREENSHOT_API_KEY = "892618";

interface CompetitorScreenshot {
  url: string;
  desktopUrl: string;
  mobileUrl: string;
  htmlContent?: string;
  capturedAt: Date;
  isCompetitor: boolean;
  domain: string;
}

// Default competitor URLs for Swiss moving industry
const DEFAULT_COMPETITORS = [
  { name: "Movu", url: "https://www.movu.ch" },
  { name: "Umzug24", url: "https://www.umzug24.ch" },
  { name: "Comparis", url: "https://www.comparis.ch/umzug" },
  { name: "Homegate", url: "https://www.homegate.ch" },
];

export function CompetitorCapture() {
  const [competitors, setCompetitors] = useState<string[]>(
    DEFAULT_COMPETITORS.map(c => c.url)
  );
  const [newCompetitor, setNewCompetitor] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompetitorScreenshot[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const addCompetitor = () => {
    if (!newCompetitor.trim()) {
      toast.error("Bitte URL eingeben");
      return;
    }
    
    try {
      new URL(newCompetitor);
      if (!competitors.includes(newCompetitor)) {
        setCompetitors([...competitors, newCompetitor]);
        setNewCompetitor("");
        toast.success("Konkurrent hinzugefügt");
      } else {
        toast.error("URL bereits vorhanden");
      }
    } catch {
      toast.error("Ungültige URL");
    }
  };

  const removeCompetitor = (url: string) => {
    setCompetitors(competitors.filter(c => c !== url));
  };

  const generateScreenshotUrl = (targetUrl: string, width: string): string => {
    const urlForShot = addScreenshotRenderParamIfHost(targetUrl, "umzugscheck.ch");
    const params = new URLSearchParams({
      key: SCREENSHOT_API_KEY,
      url: urlForShot,
      dimension: `${width}xfull`,
      format: "png",
      cacheLimit: "0",
      delay: "3000",
    });
    return `https://api.screenshotmachine.com?${params.toString()}`;
  };

  const fetchHtml = async (pageUrl: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-html', {
        body: { url: pageUrl }
      });
      if (error) throw error;
      return data?.html || `<!-- No content for ${pageUrl} -->`;
    } catch (error) {
      return `<!-- Error fetching ${pageUrl} -->`;
    }
  };

  const captureAll = async () => {
    const allUrls = [
      ...competitors,
      "https://umzugscheck.ch" // Always include own site for comparison
    ];

    setLoading(true);
    setResults([]);
    setProgress({ current: 0, total: allUrls.length });

    const captured: CompetitorScreenshot[] = [];

    for (let i = 0; i < allUrls.length; i++) {
      const url = allUrls[i];
      const domain = new URL(url).hostname;
      const isCompetitor = !url.includes("umzugscheck.ch");

      setProgress({ current: i + 1, total: allUrls.length });
      toast.info(`Erfasse ${domain}...`);

      try {
        const desktopUrl = generateScreenshotUrl(url, "1920");
        const mobileUrl = generateScreenshotUrl(url, "375");
        const htmlContent = await fetchHtml(url);

        captured.push({
          url,
          desktopUrl,
          mobileUrl,
          htmlContent,
          capturedAt: new Date(),
          isCompetitor,
          domain,
        });

        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.error(`Error capturing ${url}:`, error);
      }
    }

    setResults(captured);
    setLoading(false);
    toast.success(`${captured.length} Seiten erfasst!`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Konkurrenz-Analyse
        </CardTitle>
        <CardDescription>
          Erfasse Screenshots von Konkurrenten für direkten Vergleich
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Competitor */}
        <div className="flex gap-2">
          <Input
            placeholder="https://konkurrent.ch"
            value={newCompetitor}
            onChange={(e) => setNewCompetitor(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCompetitor()}
          />
          <Button onClick={addCompetitor}>
            <Plus className="h-4 w-4 mr-1" />
            Hinzufügen
          </Button>
        </div>

        {/* Competitor List */}
        <div className="space-y-2">
          <Label>Konkurrenten ({competitors.length})</Label>
          <div className="flex flex-wrap gap-2">
            {competitors.map((url) => (
              <Badge 
                key={url} 
                variant="secondary" 
                className="flex items-center gap-1 py-1.5"
              >
                {new URL(url).hostname}
                <button
                  onClick={() => removeCompetitor(url)}
                  className="ml-1 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Add Defaults */}
        <div className="space-y-2">
          <Label>Schnellauswahl</Label>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_COMPETITORS.map((comp) => (
              <Button
                key={comp.url}
                variant="outline"
                size="sm"
                onClick={() => {
                  if (!competitors.includes(comp.url)) {
                    setCompetitors([...competitors, comp.url]);
                  }
                }}
                disabled={competitors.includes(comp.url)}
              >
                {comp.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Capture Button */}
        <Button 
          onClick={captureAll} 
          disabled={loading || competitors.length === 0}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Erfasse {progress.current}/{progress.total}...
            </>
          ) : (
            <>
              <Camera className="h-4 w-4 mr-2" />
              Alle erfassen (+ umzugscheck.ch)
            </>
          )}
        </Button>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <Label>Erfasste Seiten ({results.length})</Label>
            <div className="grid gap-4 md:grid-cols-2">
              {results.map((result, index) => (
                <div 
                  key={index} 
                  className={`border rounded-lg p-4 ${
                    result.isCompetitor ? 'border-orange-200 bg-orange-50/50' : 'border-green-200 bg-green-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={result.isCompetitor ? "secondary" : "default"}>
                        {result.isCompetitor ? "Konkurrent" : "Eigene Seite"}
                      </Badge>
                      <span className="font-medium">{result.domain}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(result.url, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Desktop</p>
                      <img 
                        src={result.desktopUrl} 
                        alt={`Desktop ${result.domain}`}
                        className="w-full aspect-video object-cover object-top rounded border"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Mobile</p>
                      <img 
                        src={result.mobileUrl} 
                        alt={`Mobile ${result.domain}`}
                        className="w-full aspect-video object-cover object-top rounded border"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export type { CompetitorScreenshot };

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  MousePointer2, 
  ScrollText, 
  Move, 
  Eye, 
  Download, 
  RefreshCw,
  Loader2,
  MapPin,
  TrendingUp
} from "lucide-react";

interface ClickData {
  x: number;
  y: number;
  count: number;
  element: string;
}

interface ScrollData {
  depth: number;
  percentage: number;
  dropoff: number;
}

interface HeatmapConfig {
  url: string;
  dateRange: string;
  heatmapType: 'click' | 'scroll' | 'move' | 'attention';
}

// Simulated heatmap data for visualization
const generateClickData = (count: number): ClickData[] => {
  const data: ClickData[] = [];
  const hotspots = [
    { x: 0.5, y: 0.1, weight: 0.9, element: "Navigation" },
    { x: 0.3, y: 0.25, weight: 0.8, element: "Hero CTA" },
    { x: 0.7, y: 0.25, weight: 0.7, element: "Calculator Button" },
    { x: 0.5, y: 0.4, weight: 0.6, element: "Company Cards" },
    { x: 0.8, y: 0.5, weight: 0.5, element: "Contact Form" },
    { x: 0.2, y: 0.7, weight: 0.4, element: "Footer Links" },
  ];

  for (let i = 0; i < count; i++) {
    const hotspot = hotspots[Math.floor(Math.random() * hotspots.length)];
    data.push({
      x: hotspot.x * 100 + (Math.random() - 0.5) * 10,
      y: hotspot.y * 100 + (Math.random() - 0.5) * 5,
      count: Math.floor(Math.random() * 100 * hotspot.weight) + 1,
      element: hotspot.element,
    });
  }
  return data;
};

const generateScrollData = (): ScrollData[] => {
  return [
    { depth: 0, percentage: 100, dropoff: 0 },
    { depth: 25, percentage: 85, dropoff: 15 },
    { depth: 50, percentage: 62, dropoff: 23 },
    { depth: 75, percentage: 38, dropoff: 24 },
    { depth: 100, percentage: 21, dropoff: 17 },
  ];
};

export function HeatmapAnalytics() {
  const [config, setConfig] = useState<HeatmapConfig>({
    url: "https://umzugscheck.ch",
    dateRange: "7d",
    heatmapType: "click",
  });
  const [loading, setLoading] = useState(false);
  const [clickData, setClickData] = useState<ClickData[]>([]);
  const [scrollData, setScrollData] = useState<ScrollData[]>([]);
  const [activeTab, setActiveTab] = useState("click");

  const loadHeatmapData = async () => {
    setLoading(true);
    try {
      // Simulate API call to Hotjar/analytics service
      await new Promise(resolve => setTimeout(resolve, 1500));
      setClickData(generateClickData(50));
      setScrollData(generateScrollData());
      toast.success("Heatmap-Daten geladen");
    } catch (error) {
      toast.error("Fehler beim Laden der Daten");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeatmapData();
  }, []);

  const getHeatColor = (intensity: number): string => {
    if (intensity > 80) return "bg-red-500";
    if (intensity > 60) return "bg-orange-500";
    if (intensity > 40) return "bg-yellow-500";
    if (intensity > 20) return "bg-green-500";
    return "bg-blue-500";
  };

  const exportHeatmapData = () => {
    const exportData = {
      url: config.url,
      dateRange: config.dateRange,
      generated: new Date().toISOString(),
      clickData,
      scrollData,
      summary: {
        totalClicks: clickData.reduce((sum, d) => sum + d.count, 0),
        avgScrollDepth: scrollData.reduce((sum, d) => sum + d.percentage, 0) / scrollData.length,
        topElements: [...new Set(clickData.map(d => d.element))].slice(0, 5),
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heatmap-data-${Date.now()}.json`;
    a.click();
    toast.success("Heatmap-Daten exportiert");
  };

  const topClickedElements = clickData.reduce((acc, item) => {
    const existing = acc.find(a => a.element === item.element);
    if (existing) {
      existing.count += item.count;
    } else {
      acc.push({ element: item.element, count: item.count });
    }
    return acc;
  }, [] as { element: string; count: number }[]).sort((a, b) => b.count - a.count);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MousePointer2 className="h-5 w-5" />
          Heatmap & User Behavior Analytics
        </CardTitle>
        <CardDescription>
          Analysiere Klick-, Scroll- und Bewegungsmuster deiner Besucher
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={config.url}
              onChange={(e) => setConfig({ ...config, url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Zeitraum</Label>
            <Select value={config.dateRange} onValueChange={(v) => setConfig({ ...config, dateRange: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Letzte 24 Stunden</SelectItem>
                <SelectItem value="7d">Letzte 7 Tage</SelectItem>
                <SelectItem value="30d">Letzte 30 Tage</SelectItem>
                <SelectItem value="90d">Letzte 90 Tage</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button onClick={loadHeatmapData} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Aktualisieren
            </Button>
            <Button variant="outline" onClick={exportHeatmapData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="click" className="flex items-center gap-1">
              <MousePointer2 className="h-4 w-4" />
              Klicks
            </TabsTrigger>
            <TabsTrigger value="scroll" className="flex items-center gap-1">
              <ScrollText className="h-4 w-4" />
              Scroll
            </TabsTrigger>
            <TabsTrigger value="move" className="flex items-center gap-1">
              <Move className="h-4 w-4" />
              Bewegung
            </TabsTrigger>
            <TabsTrigger value="attention" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Aufmerksamkeit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="click" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Click Heatmap Visualization */}
              <div className="relative bg-gradient-to-b from-slate-100 to-slate-200 rounded-lg h-96 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
                  Heatmap Visualization
                </div>
                {clickData.slice(0, 30).map((point, i) => (
                  <div
                    key={i}
                    className={`absolute w-4 h-4 rounded-full ${getHeatColor(point.count)} opacity-50 blur-sm`}
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      transform: 'translate(-50%, -50%)',
                      width: `${Math.max(16, point.count / 3)}px`,
                      height: `${Math.max(16, point.count / 3)}px`,
                    }}
                  />
                ))}
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 rounded p-2 text-xs">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-red-500 rounded-full"></span> Hot
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Medium
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span> Cool
                    </span>
                  </div>
                </div>
              </div>

              {/* Top Clicked Elements */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Meistgeklickte Elemente
                </h4>
                {topClickedElements.slice(0, 6).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-24 truncate">{item.element}</span>
                    <Progress value={(item.count / topClickedElements[0].count) * 100} className="flex-1" />
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Total Klicks</p>
                      <p className="text-2xl font-bold">{clickData.reduce((sum, d) => sum + d.count, 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Unique Elemente</p>
                      <p className="text-2xl font-bold">{topClickedElements.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scroll" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Scroll Depth Visualization */}
              <div className="relative bg-gradient-to-b from-green-100 via-yellow-100 to-red-100 rounded-lg h-96 flex flex-col justify-between p-4">
                {scrollData.map((data, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-mono w-12">{data.depth}%</span>
                    <div className="flex-1 bg-white/50 rounded h-8 relative overflow-hidden">
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-primary/60"
                        style={{ width: `${data.percentage}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                        {data.percentage}% erreichen diese Tiefe
                      </span>
                    </div>
                    {data.dropoff > 0 && (
                      <Badge variant="destructive" className="text-xs">-{data.dropoff}%</Badge>
                    )}
                  </div>
                ))}
              </div>

              {/* Scroll Stats */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Scroll-Statistiken
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Durchschn. Scroll-Tiefe</p>
                    <p className="text-3xl font-bold text-primary">61%</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Fold-Rate</p>
                    <p className="text-3xl font-bold text-green-600">85%</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-3xl font-bold text-orange-600">21%</p>
                  </Card>
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Grösster Drop-Off</p>
                    <p className="text-3xl font-bold text-red-600">50%</p>
                    <p className="text-xs text-muted-foreground">Bei 50% Seitenposition</p>
                  </Card>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-medium text-yellow-800">💡 Empfehlung</h5>
                  <p className="text-sm text-yellow-700 mt-1">
                    38% der Besucher verlieren bei 50% der Seite. Erwäge wichtige CTAs weiter oben zu platzieren.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="move" className="space-y-4">
            <div className="bg-slate-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Move className="h-16 w-16 mx-auto text-slate-400" />
                <p className="text-slate-600">Mausbewegungen-Tracking</p>
                <p className="text-sm text-slate-500">Zeigt, wohin Besucher ihre Maus bewegen</p>
                <Badge>Hotjar Integration erforderlich</Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="attention" className="space-y-4">
            <div className="bg-slate-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center space-y-4">
                <Eye className="h-16 w-16 mx-auto text-slate-400" />
                <p className="text-slate-600">Aufmerksamkeits-Analyse</p>
                <p className="text-sm text-slate-500">Zeigt, wie lange Besucher welche Bereiche betrachten</p>
                <Badge>Eye-Tracking Daten erforderlich</Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

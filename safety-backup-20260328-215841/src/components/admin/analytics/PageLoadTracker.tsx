import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Gauge, TrendingUp, TrendingDown, Download, AlertTriangle, CheckCircle } from "lucide-react";

interface PageLoadMetric {
  page: string;
  path: string;
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  overallScore: number;
  trend: 'up' | 'down' | 'stable';
}

const MOCK_LOAD_DATA: PageLoadMetric[] = [
  { page: "Homepage", path: "/", lcp: 1.8, fid: 45, cls: 0.05, ttfb: 0.3, overallScore: 92, trend: "stable" },
  { page: "Preisrechner", path: "/preisrechner", lcp: 2.4, fid: 80, cls: 0.12, ttfb: 0.4, overallScore: 78, trend: "up" },
  { page: "Umzugsofferten", path: "/umzugsofferten", lcp: 2.1, fid: 55, cls: 0.08, ttfb: 0.35, overallScore: 85, trend: "up" },
  { page: "Firmenverzeichnis", path: "/firmen", lcp: 3.2, fid: 120, cls: 0.18, ttfb: 0.5, overallScore: 62, trend: "down" },
  { page: "Regionale Seiten", path: "/umzugsfirmen/*", lcp: 2.8, fid: 90, cls: 0.15, ttfb: 0.45, overallScore: 71, trend: "stable" },
];

export function PageLoadTracker() {
  const [loadData] = useState<PageLoadMetric[]>(MOCK_LOAD_DATA);

  const avgScore = loadData.reduce((sum, d) => sum + d.overallScore, 0) / loadData.length;
  const slowPages = loadData.filter(d => d.overallScore < 70).length;

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ 
      pageLoadMetrics: loadData, 
      avgScore, 
      exported: new Date().toISOString() 
    }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `page-load-metrics-${Date.now()}.json`;
    a.click();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getMetricStatus = (value: number, thresholds: { good: number; moderate: number }) => {
    if (value <= thresholds.good) return "good";
    if (value <= thresholds.moderate) return "moderate";
    return "poor";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Page Load Performance
        </CardTitle>
        <CardDescription>Core Web Vitals und Ladezeiten pro Seite</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Durchschn. Score</p>
            <p className={`text-3xl font-bold ${getScoreColor(avgScore)}`}>{avgScore.toFixed(0)}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Langsame Seiten</p>
            <p className="text-3xl font-bold text-red-600">{slowPages}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Schnellste</p>
            <p className="text-xl font-bold text-green-600">Homepage</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-center">
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Core Web Vitals Legend */}
        <div className="flex gap-4 mb-4 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded"></span> Gut</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded"></span> Verbesserungswürdig</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded"></span> Schlecht</span>
        </div>

        {/* Page List */}
        <div className="space-y-3">
          {loadData.sort((a, b) => a.overallScore - b.overallScore).map((page, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-sm">{page.page}</h4>
                  <p className="text-xs text-muted-foreground font-mono">{page.path}</p>
                </div>
                <div className="flex items-center gap-2">
                  {page.overallScore < 70 ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : page.overallScore >= 90 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : null}
                  <span className={`text-xl font-bold ${getScoreColor(page.overallScore)}`}>
                    {page.overallScore}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">LCP</p>
                  <p className={`font-medium ${
                    getMetricStatus(page.lcp, { good: 2.5, moderate: 4 }) === 'good' ? 'text-green-600' :
                    getMetricStatus(page.lcp, { good: 2.5, moderate: 4 }) === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                  }`}>{page.lcp}s</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">FID</p>
                  <p className={`font-medium ${
                    getMetricStatus(page.fid, { good: 100, moderate: 300 }) === 'good' ? 'text-green-600' :
                    getMetricStatus(page.fid, { good: 100, moderate: 300 }) === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                  }`}>{page.fid}ms</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CLS</p>
                  <p className={`font-medium ${
                    getMetricStatus(page.cls, { good: 0.1, moderate: 0.25 }) === 'good' ? 'text-green-600' :
                    getMetricStatus(page.cls, { good: 0.1, moderate: 0.25 }) === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                  }`}>{page.cls}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">TTFB</p>
                  <p className={`font-medium ${
                    getMetricStatus(page.ttfb, { good: 0.8, moderate: 1.8 }) === 'good' ? 'text-green-600' :
                    getMetricStatus(page.ttfb, { good: 0.8, moderate: 1.8 }) === 'moderate' ? 'text-yellow-600' : 'text-red-600'
                  }`}>{page.ttfb}s</p>
                </div>
              </div>

              <div className="mt-3">
                <Progress value={page.overallScore} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

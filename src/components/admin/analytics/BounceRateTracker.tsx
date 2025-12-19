import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LogOut, TrendingUp, TrendingDown, Download, AlertTriangle, CheckCircle } from "lucide-react";

interface BounceMetric {
  page: string;
  path: string;
  visitors: number;
  bounceRate: number;
  avgTimeOnPage: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

const MOCK_BOUNCE_DATA: BounceMetric[] = [
  { page: "Homepage", path: "/", visitors: 15000, bounceRate: 35, avgTimeOnPage: "1:45", trend: "down", trendValue: 5 },
  { page: "Preisrechner", path: "/preisrechner", visitors: 5200, bounceRate: 22, avgTimeOnPage: "3:12", trend: "down", trendValue: 8 },
  { page: "Umzugsofferten", path: "/umzugsofferten", visitors: 4800, bounceRate: 18, avgTimeOnPage: "4:05", trend: "stable", trendValue: 0 },
  { page: "Blog - Kosten", path: "/umzugskosten", visitors: 3200, bounceRate: 65, avgTimeOnPage: "2:30", trend: "up", trendValue: 12 },
  { page: "Firmenverzeichnis", path: "/firmen", visitors: 2800, bounceRate: 42, avgTimeOnPage: "1:20", trend: "down", trendValue: 3 },
  { page: "Regionale Seiten", path: "/umzugsfirmen/*", visitors: 6500, bounceRate: 48, avgTimeOnPage: "1:55", trend: "up", trendValue: 7 },
];

export function BounceRateTracker() {
  const [bounceData] = useState<BounceMetric[]>(MOCK_BOUNCE_DATA);

  const avgBounceRate = bounceData.reduce((sum, d) => sum + d.bounceRate, 0) / bounceData.length;
  const highBouncePages = bounceData.filter(d => d.bounceRate > 50).length;

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ bounceRates: bounceData, avgBounceRate, exported: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bounce-rates-${Date.now()}.json`;
    a.click();
  };

  const getBounceColor = (rate: number) => {
    if (rate < 30) return "text-green-600";
    if (rate < 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LogOut className="h-5 w-5" />
          Bounce Rate Tracker
        </CardTitle>
        <CardDescription>Überwache Absprungraten pro Seite</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Durchschn. Bounce Rate</p>
            <p className={`text-3xl font-bold ${getBounceColor(avgBounceRate)}`}>{avgBounceRate.toFixed(1)}%</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground">Problemseiten (&gt;50%)</p>
            <p className="text-3xl font-bold text-red-600">{highBouncePages}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 text-center flex flex-col items-center justify-center">
            <Button variant="outline" size="sm" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Page List */}
        <div className="space-y-3">
          {bounceData.sort((a, b) => b.bounceRate - a.bounceRate).map((page, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-sm">{page.page}</h4>
                  <p className="text-xs text-muted-foreground font-mono">{page.path}</p>
                </div>
                <div className="flex items-center gap-2">
                  {page.bounceRate > 50 ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : page.bounceRate < 30 ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : null}
                  <span className={`text-xl font-bold ${getBounceColor(page.bounceRate)}`}>
                    {page.bounceRate}%
                  </span>
                </div>
              </div>

              <Progress 
                value={page.bounceRate} 
                className="h-2 mb-3"
              />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {page.visitors.toLocaleString()} Besucher · Ø {page.avgTimeOnPage} auf Seite
                </span>
                <span className={`flex items-center gap-1 ${
                  page.trend === 'down' ? 'text-green-600' : 
                  page.trend === 'up' ? 'text-red-600' : 'text-slate-500'
                }`}>
                  {page.trend === 'down' ? <TrendingDown className="h-3 w-3" /> : 
                   page.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : null}
                  {page.trendValue > 0 ? `${page.trend === 'down' ? '-' : '+'}${page.trendValue}%` : 'Stabil'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

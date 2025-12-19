import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Download, TrendingUp, Zap, Clock, Target } from "lucide-react";

interface UserSegment {
  name: string;
  description: string;
  size: number;
  percentage: number;
  avgSessionDuration: string;
  conversionRate: number;
  topPages: string[];
  characteristics: string[];
}

const MOCK_SEGMENTS: UserSegment[] = [
  {
    name: "High-Intent Movers",
    description: "Benutzer die Preisrechner + Offerten in einer Session nutzen",
    size: 2450,
    percentage: 18,
    avgSessionDuration: "5:32",
    conversionRate: 42,
    topPages: ["/preisrechner", "/umzugsofferten", "/beste-umzugsfirma"],
    characteristics: ["Desktop", "Wiederkehrend", "2+ Seiten"]
  },
  {
    name: "Research Phase",
    description: "Benutzer die hauptsächlich Content-Seiten besuchen",
    size: 4200,
    percentage: 31,
    avgSessionDuration: "3:15",
    conversionRate: 8,
    topPages: ["/umzugskosten", "/ratgeber", "/checkliste"],
    characteristics: ["Mixed Devices", "Erstbesucher", "Content-fokussiert"]
  },
  {
    name: "Quick Browsers",
    description: "Kurze Sessions, nur Homepage oder 1-2 Seiten",
    size: 5800,
    percentage: 43,
    avgSessionDuration: "0:45",
    conversionRate: 2,
    topPages: ["/", "/firmen"],
    characteristics: ["Mobile", "Hohe Bounce Rate", "Erstbesucher"]
  },
  {
    name: "Power Users",
    description: "Wiederkehrende Benutzer mit vielen Interaktionen",
    size: 1100,
    percentage: 8,
    avgSessionDuration: "8:42",
    conversionRate: 65,
    topPages: ["/umzugsofferten", "/firmen", "/preisrechner"],
    characteristics: ["Desktop", "5+ Besuche", "Mehrere Konversionen"]
  },
];

export function UserSegments() {
  const [segments] = useState<UserSegment[]>(MOCK_SEGMENTS);

  const totalUsers = segments.reduce((sum, s) => sum + s.size, 0);

  const exportSegments = () => {
    const blob = new Blob([JSON.stringify({ 
      userSegments: segments, 
      totalUsers,
      exported: new Date().toISOString() 
    }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-segments-${Date.now()}.json`;
    a.click();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Segments
        </CardTitle>
        <CardDescription>Benutzer-Segmentierung nach Verhalten</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-muted-foreground">
            <strong>{totalUsers.toLocaleString()}</strong> Benutzer in {segments.length} Segmenten
          </div>
          <Button variant="outline" size="sm" onClick={exportSegments}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="space-y-4">
          {segments.sort((a, b) => b.conversionRate - a.conversionRate).map((segment, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{segment.name}</h4>
                  <p className="text-sm text-muted-foreground">{segment.description}</p>
                </div>
                <Badge variant={segment.conversionRate > 30 ? "default" : segment.conversionRate > 10 ? "secondary" : "outline"}>
                  {segment.conversionRate}% Conv.
                </Badge>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>{segment.size.toLocaleString()} Benutzer</span>
                  <span>{segment.percentage}% aller Besucher</span>
                </div>
                <Progress value={segment.percentage} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>Ø {segment.avgSessionDuration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span>{segment.conversionRate}% Conversion</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span>{segment.topPages.length} Top-Seiten</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {segment.characteristics.map((char, j) => (
                  <Badge key={j} variant="outline" className="text-xs">
                    {char}
                  </Badge>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground mb-1">Top Seiten:</p>
                <div className="flex gap-2">
                  {segment.topPages.map((page, j) => (
                    <code key={j} className="text-xs bg-slate-100 px-2 py-1 rounded">
                      {page}
                    </code>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

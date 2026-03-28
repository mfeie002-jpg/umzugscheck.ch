import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Globe, Monitor, Smartphone, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActiveVisitor {
  id: string;
  page: string;
  device: 'desktop' | 'mobile' | 'tablet';
  country: string;
  city: string;
  timeOnSite: string;
  referrer: string;
}

const MOCK_VISITORS: ActiveVisitor[] = [
  { id: "v1", page: "/pricing", device: "desktop", country: "CH", city: "Zürich", timeOnSite: "3:24", referrer: "Google" },
  { id: "v2", page: "/services", device: "mobile", country: "CH", city: "Bern", timeOnSite: "1:45", referrer: "Direct" },
  { id: "v3", page: "/companies", device: "desktop", country: "CH", city: "Basel", timeOnSite: "2:12", referrer: "Google" },
  { id: "v4", page: "/", device: "mobile", country: "DE", city: "Berlin", timeOnSite: "0:32", referrer: "Facebook" },
  { id: "v5", page: "/regions/zurich", device: "desktop", country: "CH", city: "Winterthur", timeOnSite: "4:56", referrer: "Google" },
];

export function RealTimeVisitors() {
  const [visitors, setVisitors] = useState<ActiveVisitor[]>(MOCK_VISITORS);
  const [totalActive, setTotalActive] = useState(23);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalActive(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const exportVisitors = () => {
    const blob = new Blob([JSON.stringify({ 
      activeVisitors: visitors, 
      totalActive, 
      exported: new Date().toISOString() 
    }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `realtime-visitors-${Date.now()}.json`;
    a.click();
  };

  const deviceCounts = visitors.reduce((acc, v) => {
    acc[v.device] = (acc[v.device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const countryCounts = visitors.reduce((acc, v) => {
    acc[v.country] = (acc[v.country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Real-Time Visitors
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </CardTitle>
        <CardDescription>Live-Ansicht aktiver Besucher</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <p className="text-4xl font-bold text-primary">{totalActive}</p>
            <p className="text-sm text-muted-foreground">Aktive Besucher</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{deviceCounts.desktop || 0}</p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Monitor className="h-3 w-3" /> Desktop
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{deviceCounts.mobile || 0}</p>
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Smartphone className="h-3 w-3" /> Mobile
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-4 text-center flex flex-col items-center justify-center">
            <Button variant="outline" size="sm" onClick={exportVisitors}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Top Countries */}
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Globe className="h-4 w-4" /> Nach Land
          </h4>
          <div className="flex gap-2">
            {Object.entries(countryCounts).map(([country, count]) => (
              <Badge key={country} variant="secondary">
                {country}: {count}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Sessions */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Aktive Sessions</h4>
          {visitors.map((visitor) => (
            <div key={visitor.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm">
              <div className="flex items-center gap-3">
                {visitor.device === 'desktop' ? <Monitor className="h-4 w-4 text-slate-500" /> : 
                 <Smartphone className="h-4 w-4 text-slate-500" />}
                <div>
                  <p className="font-medium">{visitor.page}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {visitor.city}, {visitor.country}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs">{visitor.timeOnSite}</p>
                <p className="text-xs text-muted-foreground">via {visitor.referrer}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

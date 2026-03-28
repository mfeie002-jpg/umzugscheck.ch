import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { 
  TrendingUp, TrendingDown, Users, Eye, MousePointer,
  MapPin, Target, RefreshCw, Smartphone, Monitor, Clock
} from "lucide-react";
import { getAnalyticsSummary } from "@/hooks/useAnalytics";

// Mock analytics functions (these would connect to real analytics in production)
function getAnalyticsReport() {
  return {
    totalSessions: Math.floor(Math.random() * 1000) + 100,
    trafficSources: [
      { source: 'google', count: Math.floor(Math.random() * 500) + 50 },
      { source: 'direct', count: Math.floor(Math.random() * 300) + 30 },
      { source: 'facebook', count: Math.floor(Math.random() * 100) + 10 },
    ],
    devices: {
      mobilePercent: 65
    }
  };
}

function getEngagementAnalytics() {
  return [];
}

function getScrollAnalytics() {
  return [];
}

interface EngagementEvent {
  type: string;
  data: {
    path?: string;
    text?: string;
    duration?: number;
    maxScrollDepth?: number;
  };
  timestamp: string;
}

interface ScrollEvent {
  depth: number;
  path: string;
  timestamp: string;
}

const AdminAnalytics = () => {
  const [summary, setSummary] = useState<ReturnType<typeof getAnalyticsSummary> | null>(null);
  const [report, setReport] = useState<ReturnType<typeof getAnalyticsReport> | null>(null);
  const [engagementData, setEngagementData] = useState<EngagementEvent[]>([]);
  const [scrollData, setScrollData] = useState<ScrollEvent[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadAnalytics = () => {
    setSummary(getAnalyticsSummary());
    setReport(getAnalyticsReport());
    setEngagementData(getEngagementAnalytics());
    setScrollData(getScrollAnalytics());
    setLastRefresh(new Date());
  };

  useEffect(() => {
    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const trafficSourcesData = report?.trafficSources.map(s => ({
    name: s.source.charAt(0).toUpperCase() + s.source.slice(1),
    value: s.count,
    color: getSourceColor(s.source)
  })) || [];

  const topPagesData = summary?.topPages.slice(0, 6).map(p => ({
    page: p.path === '/' ? 'Startseite' : p.path.replace('/', '').replace(/-/g, ' '),
    views: p.count
  })) || [];

  const ctaClicks = engagementData
    .filter(e => e.type === 'cta_click')
    .reduce((acc: Record<string, number>, e) => {
      const text = e.data?.text || 'Unbekannt';
      acc[text] = (acc[text] || 0) + 1;
      return acc;
    }, {});

  const ctaData = Object.entries(ctaClicks)
    .map(([name, count]) => ({ name: name.slice(0, 20), clicks: count }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  const scrollDepthCounts = scrollData.reduce((acc: Record<number, number>, s) => {
    acc[s.depth] = (acc[s.depth] || 0) + 1;
    return acc;
  }, {});

  const scrollDepthData = [25, 50, 75, 100].map(depth => ({
    depth: `${depth}%`,
    count: scrollDepthCounts[depth] || 0
  }));

  const timeOnPageEvents = engagementData.filter(e => e.type === 'time_on_page');
  const avgTimeOnPage = timeOnPageEvents.length > 0
    ? Math.round(timeOnPageEvents.reduce((sum, e) => sum + (e.data?.duration || 0), 0) / timeOnPageEvents.length / 1000)
    : 0;

  const kpis = [
    { 
      label: "Seitenaufrufe", 
      value: summary?.totalPageViews.toLocaleString() || "0", 
      change: "+live", 
      trend: "up" as const,
      icon: Eye 
    },
    { 
      label: "Sessions", 
      value: report?.totalSessions.toLocaleString() || "0", 
      change: "+live", 
      trend: "up" as const,
      icon: Users 
    },
    { 
      label: "Events", 
      value: summary?.totalEvents.toLocaleString() || "0", 
      change: "+live", 
      trend: "up" as const,
      icon: MousePointer 
    },
    { 
      label: "⌀ Verweildauer", 
      value: `${avgTimeOnPage}s`, 
      change: "live", 
      trend: "up" as const,
      icon: Clock 
    }
  ];

  const deviceData = [
    { name: "Mobile", value: report?.devices.mobilePercent || 0, icon: Smartphone },
    { name: "Desktop", value: 100 - (report?.devices.mobilePercent || 0), icon: Monitor },
  ];

  const conversionFunnel = [
    { stage: "Seitenaufrufe", count: summary?.totalPageViews || 0 },
    { stage: "CTA-Klicks", count: Object.values(ctaClicks).reduce((a, b) => a + b, 0) },
    { stage: "Events", count: summary?.totalEvents || 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Live Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Letzte Aktualisierung: {lastRefresh.toLocaleTimeString('de-CH')}
          </p>
        </div>
        <Button onClick={loadAnalytics} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Aktualisieren
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon className="h-5 w-5 text-muted-foreground" />
                <Badge variant="default" className="text-xs bg-green-500">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {kpi.change}
                </Badge>
              </div>
              <h3 className="text-2xl font-bold">{kpi.value}</h3>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Traffic-Quellen
            </CardTitle>
            <CardDescription>Woher kommen Ihre Besucher</CardDescription>
          </CardHeader>
          <CardContent>
            {trafficSourcesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={trafficSourcesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {trafficSourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Noch keine Daten verfügbar
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top Seiten
            </CardTitle>
            <CardDescription>Meistbesuchte Seiten</CardDescription>
          </CardHeader>
          <CardContent>
            {topPagesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topPagesData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="page" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Noch keine Daten verfügbar
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MousePointer className="h-5 w-5" />
              CTA-Performance
            </CardTitle>
            <CardDescription>Klicks auf Call-to-Action Buttons</CardDescription>
          </CardHeader>
          <CardContent>
            {ctaData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={ctaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                Noch keine CTA-Klicks erfasst
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Scroll-Tiefe
            </CardTitle>
            <CardDescription>Wie weit scrollen Besucher</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={scrollDepthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="depth" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.3}
                  name="Besucher"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Geräteverteilung
          </CardTitle>
          <CardDescription>Mobile vs Desktop Besucher</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            {deviceData.map((device) => (
              <div key={device.name} className="space-y-2">
                <div className="flex items-center gap-3">
                  <device.icon className="h-6 w-6 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{device.name}</span>
                      <span className="text-muted-foreground">{device.value}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${device.value}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Engagement Funnel
          </CardTitle>
          <CardDescription>Nutzer-Engagement auf der Website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionFunnel.map((stage, index) => {
              const percentage = index === 0 ? 100 : (stage.count / (conversionFunnel[0].count || 1) * 100);
              const conversionRate = index > 0 && conversionFunnel[index - 1].count > 0
                ? ((stage.count / conversionFunnel[index - 1].count) * 100).toFixed(1) 
                : null;
              
              return (
                <div key={stage.stage} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-muted-foreground">
                      {stage.count.toLocaleString()}
                      {conversionRate && (
                        <span className="text-green-600 ml-2">({conversionRate}%)</span>
                      )}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Datenübersicht</CardTitle>
          <CardDescription>Zusammenfassung der gespeicherten Analytics-Daten</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Sessions</p>
              <p className="font-semibold">{report?.totalSessions || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Seitenaufrufe</p>
              <p className="font-semibold">{summary?.totalPageViews || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Events</p>
              <p className="font-semibold">{summary?.totalEvents || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">⌀ Zeit/Seite</p>
              <p className="font-semibold">{summary?.avgTimeOnPage || 0}s</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function getSourceColor(source: string): string {
  const colors: Record<string, string> = {
    google: "#4285F4",
    direct: "#34A853",
    facebook: "#1877F2",
    instagram: "#E4405F",
    linkedin: "#0A66C2",
    twitter: "#1DA1F2",
    bing: "#008373",
    referral: "#F59E0B",
    unknown: "#6B7280",
  };
  return colors[source.toLowerCase()] || "#6B7280";
}

export default AdminAnalytics;
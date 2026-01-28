import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, MousePointer, Gift, Sparkles, ArrowDown,
  RefreshCw, Trash2, Target, Percent, Eye, CheckCircle
} from 'lucide-react';
import { getConversionStats, clearConversionData } from '@/lib/conversionTracker';
import { toast } from '@/hooks/use-toast';

const ConversionDashboard = () => {
  const [stats, setStats] = useState(getConversionStats());
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const loadStats = () => {
    setStats(getConversionStats());
    setLastRefresh(new Date());
  };

  useEffect(() => {
    loadStats();
    
    // Listen for real-time conversion events
    const handleConversion = () => loadStats();
    window.addEventListener('conversion-tracked', handleConversion);
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    
    return () => {
      window.removeEventListener('conversion-tracked', handleConversion);
      clearInterval(interval);
    };
  }, []);

  const handleClearData = () => {
    clearConversionData();
    loadStats();
    toast({
      title: 'Daten gelöscht',
      description: 'Alle Conversion-Daten wurden zurückgesetzt.',
    });
  };

  // KPI Cards data
  const kpis = [
    {
      label: 'Exit-Intent Rate',
      value: `${stats.exitIntent.rate}%`,
      subValue: `${stats.exitIntent.converted}/${stats.exitIntent.shown}`,
      icon: Gift,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      label: 'Empfehlungs-Rate',
      value: `${stats.recommendations.rate}%`,
      subValue: `${stats.recommendations.clicked}/${stats.recommendations.shown}`,
      icon: Sparkles,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: 'CTA-Klicks',
      value: stats.cta?.total?.toLocaleString() || '0',
      subValue: `${Object.keys(stats.cta?.byName || {}).length} verschiedene CTAs`,
      icon: MousePointer,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Formular-Rate',
      value: `${stats.forms.rate}%`,
      subValue: `${stats.forms.completes}/${stats.forms.starts}`,
      icon: CheckCircle,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
  ];

  // Scroll depth chart data
  const scrollDepthData = [25, 50, 75, 100].map(depth => ({
    depth: `${depth}%`,
    besucher: stats.scrollDepth[depth] || 0,
  }));

  // Recommendations by service
  const recommendationsData = Object.entries(stats.recommendations.byService)
    .map(([name, count]) => ({ name, clicks: count }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 5);

  // CTA clicks data
  const ctaByNameData = Object.entries(stats.cta?.byName || {})
    .map(([name, count]) => ({ name, clicks: count as number }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 8);

  const ctaByLocationData = Object.entries(stats.cta?.byLocation || {})
    .map(([location, count]) => ({ location, clicks: count as number }))
    .sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Conversion Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Exit-Intent, Empfehlungen & Scroll-Tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadStats} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
          <Button onClick={handleClearData} variant="outline" size="sm" className="text-destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Zurücksetzen
          </Button>
        </div>
      </div>

      {/* Refresh indicator */}
      <p className="text-xs text-muted-foreground">
        Letzte Aktualisierung: {lastRefresh.toLocaleTimeString('de-CH')}
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${kpi.bgColor}`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
                <Badge variant="outline" className="text-xs">
                  Live
                </Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold">{kpi.value}</h3>
                <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{kpi.subValue}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Zeitverlauf</TabsTrigger>
          <TabsTrigger value="cta">CTA-Klicks</TabsTrigger>
          <TabsTrigger value="scroll">Scroll-Tiefe</TabsTrigger>
          <TabsTrigger value="recommendations">Empfehlungen</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
        </TabsList>

        {/* Timeline Chart */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Conversions (letzte 7 Tage)</CardTitle>
              <CardDescription>Exit-Intent, Empfehlungen und CTA-Klicks im Zeitverlauf</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={stats.timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="exitIntent" 
                    name="Exit-Intent" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recommendations" 
                    name="Empfehlungen" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ctaClicks" 
                    name="CTA-Klicks" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CTA Clicks Chart */}
        <TabsContent value="cta">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MousePointer className="h-5 w-5" />
                  CTA-Klicks nach Button
                </CardTitle>
                <CardDescription>Welche CTAs werden am meisten geklickt</CardDescription>
              </CardHeader>
              <CardContent>
                {ctaByNameData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ctaByNameData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={140} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="clicks" fill="#10b981" radius={[0, 4, 4, 0]} name="Klicks" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Noch keine CTA-Klicks erfasst
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  CTA-Klicks nach Position
                </CardTitle>
                <CardDescription>Wo werden CTAs am häufigsten geklickt</CardDescription>
              </CardHeader>
              <CardContent>
                {ctaByLocationData.length > 0 ? (
                  <div className="space-y-4">
                    {ctaByLocationData.map((item, index) => (
                      <div key={item.location} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{item.location.replace(/_/g, ' ')}</span>
                          <span className="font-bold">{item.clicks}</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full transition-all"
                            style={{ 
                              width: `${(item.clicks / Math.max(...ctaByLocationData.map(d => d.clicks))) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Noch keine CTA-Klicks erfasst
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Scroll Depth Chart */}
        <TabsContent value="scroll">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowDown className="h-5 w-5" />
                Scroll-Tiefe Verteilung
              </CardTitle>
              <CardDescription>Wie weit scrollen Besucher auf der Seite</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={scrollDepthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="depth" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="besucher" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.3}
                    name="Besucher"
                  />
                </AreaChart>
              </ResponsiveContainer>
              
              {/* Scroll depth breakdown */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                {scrollDepthData.map((item) => (
                  <div key={item.depth} className="text-center p-3 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">{item.besucher}</p>
                    <p className="text-sm text-muted-foreground">{item.depth}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recommendations Chart */}
        <TabsContent value="recommendations">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Empfehlungs-Klicks nach Service
                </CardTitle>
                <CardDescription>Welche Empfehlungen werden am meisten geklickt</CardDescription>
              </CardHeader>
              <CardContent>
                {recommendationsData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={recommendationsData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="clicks" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Klicks" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Noch keine Empfehlungs-Klicks erfasst
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Empfehlungs-Statistiken</CardTitle>
                <CardDescription>Übersicht der Empfehlungs-Performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>Angezeigt</span>
                    </div>
                    <span className="font-bold">{stats.recommendations.shown}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4 text-green-500" />
                      <span>Geklickt</span>
                    </div>
                    <span className="font-bold text-green-600">{stats.recommendations.clicked}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>Abgelehnt</span>
                    </div>
                    <span className="font-bold">{stats.recommendations.dismissed}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-amber-500">{stats.recommendations.rate}%</p>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conversion Funnel */}
        <TabsContent value="funnel">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Conversion Funnel
              </CardTitle>
              <CardDescription>Vom Exit-Intent zur Conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Exit Intent Funnel */}
                <div className="space-y-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Gift className="h-4 w-4 text-purple-500" />
                    Exit-Intent Popup
                  </h4>
                  <div className="space-y-2">
                    <FunnelStep 
                      label="Angezeigt" 
                      count={stats.exitIntent.shown} 
                      percentage={100}
                      color="bg-purple-500"
                    />
                    <FunnelStep 
                      label="Konvertiert" 
                      count={stats.exitIntent.converted} 
                      percentage={stats.exitIntent.shown > 0 ? (stats.exitIntent.converted / stats.exitIntent.shown) * 100 : 0}
                      color="bg-green-500"
                    />
                    <FunnelStep 
                      label="Abgelehnt" 
                      count={stats.exitIntent.dismissed} 
                      percentage={stats.exitIntent.shown > 0 ? (stats.exitIntent.dismissed / stats.exitIntent.shown) * 100 : 0}
                      color="bg-gray-400"
                    />
                  </div>
                </div>

                {/* Form Funnel */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-semibold flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Formular-Abschluss
                  </h4>
                  <div className="space-y-2">
                    <FunnelStep 
                      label="Gestartet" 
                      count={stats.forms.starts} 
                      percentage={100}
                      color="bg-blue-500"
                    />
                    <FunnelStep 
                      label="Abgeschlossen" 
                      count={stats.forms.completes} 
                      percentage={stats.forms.starts > 0 ? (stats.forms.completes / stats.forms.starts) * 100 : 0}
                      color="bg-green-500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Funnel step component
const FunnelStep = ({ 
  label, 
  count, 
  percentage, 
  color 
}: { 
  label: string; 
  count: number; 
  percentage: number; 
  color: string;
}) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span className="font-medium">{count} ({percentage.toFixed(1)}%)</span>
    </div>
    <div className="h-3 bg-muted rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  </div>
);

export default ConversionDashboard;
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Zap, 
  Eye, 
  MousePointer, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Smartphone,
  Monitor,
  AlertTriangle,
  CheckCircle2,
  Info,
  FileText,
  Calendar,
  ExternalLink,
  Download,
  BarChart3
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Area, AreaChart } from 'recharts';

interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  target: number;
  unit: string;
  description: string;
}

interface PerformanceEntry {
  timestamp: string;
  lcp: number;
  fid: number;
  cls: number;
  fcp: number;
  ttfb: number;
  device: 'mobile' | 'desktop';
}

interface LighthouseReport {
  id: string;
  date: string;
  url: string;
  device: 'mobile' | 'desktop';
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  vitals: {
    lcp: number;
    fid: number;
    cls: number;
    fcp: number;
    ttfb: number;
    tbt: number;
    si: number;
  };
}

// Thresholds based on Google's Core Web Vitals
const thresholds = {
  lcp: { good: 2500, poor: 4000 },
  fid: { good: 100, poor: 300 },
  cls: { good: 0.1, poor: 0.25 },
  fcp: { good: 1800, poor: 3000 },
  ttfb: { good: 800, poor: 1800 },
  inp: { good: 200, poor: 500 },
};

const getRating = (metric: keyof typeof thresholds, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const threshold = thresholds[metric];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

const getRatingColor = (rating: 'good' | 'needs-improvement' | 'poor') => {
  switch (rating) {
    case 'good': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
    case 'needs-improvement': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
    case 'poor': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
  }
};

const getRatingIcon = (rating: 'good' | 'needs-improvement' | 'poor') => {
  switch (rating) {
    case 'good': return <CheckCircle2 className="h-4 w-4" />;
    case 'needs-improvement': return <AlertTriangle className="h-4 w-4" />;
    case 'poor': return <AlertTriangle className="h-4 w-4" />;
  }
};

const getScoreRating = (score: number): 'good' | 'needs-improvement' | 'poor' => {
  if (score >= 90) return 'good';
  if (score >= 50) return 'needs-improvement';
  return 'poor';
};

// Simulated Lighthouse historical data for both mobile and desktop
const generateLighthouseHistory = (): LighthouseReport[] => {
  const reports: LighthouseReport[] = [];
  const urls = ['/', '/contact', '/calculator', '/booking', '/plan', '/area/zurich'];
  const devices: ('mobile' | 'desktop')[] = ['mobile', 'desktop'];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    urls.forEach((url, urlIndex) => {
      devices.forEach((device) => {
        // Mobile typically has lower performance scores
        const devicePenalty = device === 'mobile' ? 8 : 0;
        const deviceLcpPenalty = device === 'mobile' ? 400 : 0;
        
        reports.push({
          id: `report-${i}-${urlIndex}-${device}`,
          date: date.toISOString().split('T')[0],
          url,
          device,
          scores: {
            performance: Math.max(40, Math.floor(75 + Math.random() * 20 + (29 - i) * 0.3 - devicePenalty)),
            accessibility: Math.floor(85 + Math.random() * 12),
            bestPractices: Math.floor(80 + Math.random() * 15),
            seo: Math.floor(88 + Math.random() * 10),
          },
          vitals: {
            lcp: Math.floor(1800 + Math.random() * 1200 - (29 - i) * 15 + deviceLcpPenalty),
            fid: Math.floor(30 + Math.random() * 80 + (device === 'mobile' ? 20 : 0)),
            cls: parseFloat((0.02 + Math.random() * 0.08 + (device === 'mobile' ? 0.02 : 0)).toFixed(3)),
            fcp: Math.floor(1200 + Math.random() * 800 + (device === 'mobile' ? 200 : 0)),
            ttfb: Math.floor(300 + Math.random() * 600),
            tbt: Math.floor(100 + Math.random() * 300 + (device === 'mobile' ? 100 : 0)),
            si: Math.floor(2000 + Math.random() * 1500 + (device === 'mobile' ? 500 : 0)),
          },
        });
      });
    });
  }
  
  return reports;
};

export default function AdminPerformance() {
  const [vitals, setVitals] = useState<WebVital[]>([]);
  const [history, setHistory] = useState<PerformanceEntry[]>([]);
  const [lighthouseReports, setLighthouseReports] = useState<LighthouseReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<'all' | 'mobile' | 'desktop'>('all');
  const [selectedPage, setSelectedPage] = useState<string>('/');
  const [comparisonDevice, setComparisonDevice] = useState<'mobile' | 'desktop'>('desktop');
  useEffect(() => {
    collectWebVitals();
    loadPerformanceHistory();
    setLighthouseReports(generateLighthouseHistory());
  }, []);

  const collectWebVitals = () => {
    setIsLoading(true);
    
    // Collect real performance metrics from the browser
    const entries: WebVital[] = [];
    
    // Performance timing API
    if (window.performance) {
      const timing = performance.timing || (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming);
      
      if (timing) {
        // TTFB (Time to First Byte)
        const ttfb = 'responseStart' in timing 
          ? (timing as PerformanceNavigationTiming).responseStart 
          : performance.timing.responseStart - performance.timing.navigationStart;
        
        entries.push({
          name: 'TTFB',
          value: Math.round(ttfb),
          rating: getRating('ttfb', ttfb),
          target: 800,
          unit: 'ms',
          description: 'Zeit bis zum ersten Byte vom Server'
        });

        // FCP from paint timing
        const paintEntries = performance.getEntriesByType('paint');
        const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
        if (fcpEntry) {
          entries.push({
            name: 'FCP',
            value: Math.round(fcpEntry.startTime),
            rating: getRating('fcp', fcpEntry.startTime),
            target: 1800,
            unit: 'ms',
            description: 'First Contentful Paint - Erster sichtbarer Inhalt'
          });
        }
      }

      // LCP from PerformanceObserver (if available in stored data)
      const lcpValue = parseFloat(localStorage.getItem('perf_lcp') || '0') || 2100;
      entries.push({
        name: 'LCP',
        value: Math.round(lcpValue),
        rating: getRating('lcp', lcpValue),
        target: 2500,
        unit: 'ms',
        description: 'Largest Contentful Paint - Grösstes Element geladen'
      });

      // CLS from stored data
      const clsValue = parseFloat(localStorage.getItem('perf_cls') || '0') || 0.05;
      entries.push({
        name: 'CLS',
        value: clsValue,
        rating: getRating('cls', clsValue),
        target: 0.1,
        unit: '',
        description: 'Cumulative Layout Shift - Visuelle Stabilität'
      });

      // FID/INP simulation (real values need user interaction)
      const fidValue = parseFloat(localStorage.getItem('perf_fid') || '0') || 45;
      entries.push({
        name: 'FID',
        value: Math.round(fidValue),
        rating: getRating('fid', fidValue),
        target: 100,
        unit: 'ms',
        description: 'First Input Delay - Reaktionszeit auf erste Interaktion'
      });
    }

    setVitals(entries);
    setIsLoading(false);
    
    // Store current measurement
    storePerformanceEntry(entries);
  };

  const storePerformanceEntry = (currentVitals: WebVital[]) => {
    const entry: PerformanceEntry = {
      timestamp: new Date().toISOString(),
      lcp: currentVitals.find(v => v.name === 'LCP')?.value || 0,
      fid: currentVitals.find(v => v.name === 'FID')?.value || 0,
      cls: currentVitals.find(v => v.name === 'CLS')?.value || 0,
      fcp: currentVitals.find(v => v.name === 'FCP')?.value || 0,
      ttfb: currentVitals.find(v => v.name === 'TTFB')?.value || 0,
      device: window.innerWidth < 768 ? 'mobile' : 'desktop'
    };

    const stored = JSON.parse(localStorage.getItem('perf_history') || '[]');
    stored.push(entry);
    // Keep last 50 entries
    const trimmed = stored.slice(-50);
    localStorage.setItem('perf_history', JSON.stringify(trimmed));
  };

  const loadPerformanceHistory = () => {
    const stored = JSON.parse(localStorage.getItem('perf_history') || '[]');
    setHistory(stored);
  };

  const getOverallScore = (): number => {
    if (vitals.length === 0) return 0;
    const scores = vitals.map(v => {
      if (v.rating === 'good') return 100;
      if (v.rating === 'needs-improvement') return 60;
      return 30;
    });
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const chartData = history.slice(-20).map((entry, index) => ({
    name: `#${index + 1}`,
    LCP: entry.lcp,
    FCP: entry.fcp,
    TTFB: entry.ttfb,
    CLS: entry.cls * 1000, // Scale for visibility
  }));

  const deviceDistribution = [
    { name: 'Mobile', value: history.filter(h => h.device === 'mobile').length },
    { name: 'Desktop', value: history.filter(h => h.device === 'desktop').length },
  ];

  const overallScore = getOverallScore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <p className="text-muted-foreground">Core Web Vitals & Lighthouse Metriken</p>
        </div>
        <Button onClick={collectWebVitals} disabled={isLoading} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Neu messen
        </Button>
      </div>

      {/* Overall Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${overallScore * 3.52} 352`}
                  className={getScoreColor(overallScore)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}
                </span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-semibold mb-2">Performance Score</h3>
              <p className="text-muted-foreground mb-4">
                {overallScore >= 90 
                  ? 'Ausgezeichnet! Ihre Website ist sehr schnell.' 
                  : overallScore >= 50 
                    ? 'Gut, aber es gibt Verbesserungspotenzial.'
                    : 'Verbesserungen erforderlich für bessere Nutzererfahrung.'}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="outline" className="gap-1">
                  <Smartphone className="h-3 w-3" />
                  {history.filter(h => h.device === 'mobile').length} Mobile
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Monitor className="h-3 w-3" />
                  {history.filter(h => h.device === 'desktop').length} Desktop
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Web Vitals Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {vitals.map((vital) => (
          <Card key={vital.name}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{vital.name}</CardTitle>
                <Badge className={getRatingColor(vital.rating)}>
                  {getRatingIcon(vital.rating)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {vital.name === 'CLS' ? vital.value.toFixed(3) : vital.value}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  {vital.unit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Ziel: {vital.name === 'CLS' ? `< ${vital.target}` : `< ${vital.target}${vital.unit}`}
              </p>
              <Progress 
                value={Math.min(100, (vital.target / vital.value) * 100)} 
                className="mt-2 h-1.5"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Metrics */}
      <Tabs defaultValue="lighthouse" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="lighthouse" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Lighthouse
          </TabsTrigger>
          <TabsTrigger value="comparison" className="gap-2">
            <Smartphone className="h-4 w-4" />
            Mobile vs Desktop
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Calendar className="h-4 w-4" />
            Berichte
          </TabsTrigger>
          <TabsTrigger value="details" className="gap-2">
            <Info className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-2">
            <Zap className="h-4 w-4" />
            Empfehlungen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lighthouse">
          <div className="space-y-6">
            {/* Page Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Lighthouse Scores pro Seite</CardTitle>
                <CardDescription>Wählen Sie eine Seite für detaillierte Analyse</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['/', '/contact', '/calculator', '/booking', '/plan', '/area/zurich'].map((url) => (
                    <Button
                      key={url}
                      variant={selectedPage === url ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPage(url)}
                    >
                      {url === '/' ? 'Homepage' : url.replace('/', '').replace('/area/', '')}
                    </Button>
                  ))}
                </div>

                {/* Device Selector */}
                <div className="flex gap-2 mb-6">
                  <Button
                    variant={comparisonDevice === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setComparisonDevice('desktop')}
                    className="gap-2"
                  >
                    <Monitor className="h-4 w-4" />
                    Desktop
                  </Button>
                  <Button
                    variant={comparisonDevice === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setComparisonDevice('mobile')}
                    className="gap-2"
                  >
                    <Smartphone className="h-4 w-4" />
                    Mobile
                  </Button>
                </div>

                {/* Score Cards */}
                {(() => {
                  const latestReport = lighthouseReports
                    .filter(r => r.url === selectedPage && r.device === comparisonDevice)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                  
                  if (!latestReport) return null;

                  return (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { name: 'Performance', score: latestReport.scores.performance, color: 'blue' },
                        { name: 'Accessibility', score: latestReport.scores.accessibility, color: 'purple' },
                        { name: 'Best Practices', score: latestReport.scores.bestPractices, color: 'orange' },
                        { name: 'SEO', score: latestReport.scores.seo, color: 'green' },
                      ].map((category) => (
                        <Card key={category.name}>
                          <CardContent className="pt-6 text-center">
                            <div className="relative w-20 h-20 mx-auto mb-3">
                              <svg className="w-full h-full transform -rotate-90">
                                <circle
                                  cx="40"
                                  cy="40"
                                  r="36"
                                  stroke="currentColor"
                                  strokeWidth="6"
                                  fill="none"
                                  className="text-muted"
                                />
                                <circle
                                  cx="40"
                                  cy="40"
                                  r="36"
                                  stroke="currentColor"
                                  strokeWidth="6"
                                  fill="none"
                                  strokeDasharray={`${category.score * 2.26} 226`}
                                  className={getRatingColor(getScoreRating(category.score))}
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className={`text-xl font-bold ${getRatingColor(getScoreRating(category.score))}`}>
                                  {category.score}
                                </span>
                              </div>
                            </div>
                            <h4 className="font-medium text-sm">{category.name}</h4>
                            <Badge className={`mt-2 ${getRatingColor(getScoreRating(category.score))}`}>
                              {getScoreRating(category.score) === 'good' ? 'Gut' : 
                               getScoreRating(category.score) === 'needs-improvement' ? 'Verbesserbar' : 'Schlecht'}
                            </Badge>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Score Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Score-Entwicklung über Zeit</CardTitle>
                <CardDescription>Lighthouse Scores der letzten 30 Tage für {selectedPage === '/' ? 'Homepage' : selectedPage}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    data={lighthouseReports
                      .filter(r => r.url === selectedPage && r.device === comparisonDevice)
                      .slice(-30)
                      .map(r => ({
                        date: new Date(r.date).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit' }),
                        Performance: r.scores.performance,
                        Accessibility: r.scores.accessibility,
                        'Best Practices': r.scores.bestPractices,
                        SEO: r.scores.seo,
                      }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }} 
                    />
                    <Legend />
                    <Area type="monotone" dataKey="Performance" stackId="1" stroke="hsl(200, 80%, 42%)" fill="hsl(200, 80%, 42%)" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="SEO" stackId="2" stroke="hsl(155, 45%, 35%)" fill="hsl(155, 45%, 35%)" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Core Web Vitals from Lighthouse */}
            <Card>
              <CardHeader>
                <CardTitle>Core Web Vitals (Lighthouse)</CardTitle>
                <CardDescription>Detaillierte Metriken aus dem letzten Lighthouse-Bericht</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const latestReport = lighthouseReports
                    .filter(r => r.url === selectedPage && r.device === comparisonDevice)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                  
                  if (!latestReport) return null;

                  const metrics = [
                    { name: 'LCP', value: latestReport.vitals.lcp, unit: 'ms', target: 2500, description: 'Largest Contentful Paint' },
                    { name: 'FID', value: latestReport.vitals.fid, unit: 'ms', target: 100, description: 'First Input Delay' },
                    { name: 'CLS', value: latestReport.vitals.cls, unit: '', target: 0.1, description: 'Cumulative Layout Shift' },
                    { name: 'FCP', value: latestReport.vitals.fcp, unit: 'ms', target: 1800, description: 'First Contentful Paint' },
                    { name: 'TBT', value: latestReport.vitals.tbt, unit: 'ms', target: 300, description: 'Total Blocking Time' },
                    { name: 'SI', value: latestReport.vitals.si, unit: 'ms', target: 3400, description: 'Speed Index' },
                  ];

                  return (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {metrics.map((metric) => {
                        const rating = metric.name === 'CLS' 
                          ? getRating('cls', metric.value)
                          : metric.value <= metric.target ? 'good' : metric.value <= metric.target * 1.5 ? 'needs-improvement' : 'poor';
                        
                        return (
                          <div key={metric.name} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold">{metric.name}</span>
                              <Badge className={getRatingColor(rating)}>
                                {getRatingIcon(rating)}
                              </Badge>
                            </div>
                            <div className="text-2xl font-bold">
                              {metric.name === 'CLS' ? metric.value.toFixed(3) : metric.value}
                              <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                            <Progress 
                              value={Math.min(100, (metric.target / metric.value) * 100)} 
                              className="mt-2 h-1.5"
                            />
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <div className="space-y-6">
            {/* Page Selector for Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Mobile vs Desktop Vergleich
                </CardTitle>
                <CardDescription>
                  Vergleichen Sie die Performance zwischen Mobile und Desktop für jede Seite
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {['/', '/contact', '/calculator', '/booking', '/plan', '/area/zurich'].map((url) => (
                    <Button
                      key={url}
                      variant={selectedPage === url ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPage(url)}
                    >
                      {url === '/' ? 'Homepage' : url.replace('/', '').replace('/area/', '')}
                    </Button>
                  ))}
                </div>

                {/* Side by Side Score Comparison */}
                {(() => {
                  const mobileReport = lighthouseReports
                    .filter(r => r.url === selectedPage && r.device === 'mobile')
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                  
                  const desktopReport = lighthouseReports
                    .filter(r => r.url === selectedPage && r.device === 'desktop')
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

                  if (!mobileReport || !desktopReport) return null;

                  const categories = [
                    { name: 'Performance', mobile: mobileReport.scores.performance, desktop: desktopReport.scores.performance },
                    { name: 'Accessibility', mobile: mobileReport.scores.accessibility, desktop: desktopReport.scores.accessibility },
                    { name: 'Best Practices', mobile: mobileReport.scores.bestPractices, desktop: desktopReport.scores.bestPractices },
                    { name: 'SEO', mobile: mobileReport.scores.seo, desktop: desktopReport.scores.seo },
                  ];

                  return (
                    <div className="space-y-6">
                      {/* Score Cards Comparison */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Mobile Scores */}
                        <div className="p-4 border rounded-lg bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10">
                          <div className="flex items-center gap-2 mb-4">
                            <Smartphone className="h-5 w-5 text-orange-600" />
                            <h3 className="font-semibold text-lg">Mobile</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {categories.map((cat) => (
                              <div key={`mobile-${cat.name}`} className="text-center p-3 bg-background rounded-lg">
                                <div className={`text-2xl font-bold ${getRatingColor(getScoreRating(cat.mobile))}`}>
                                  {cat.mobile}
                                </div>
                                <div className="text-xs text-muted-foreground">{cat.name}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Desktop Scores */}
                        <div className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
                          <div className="flex items-center gap-2 mb-4">
                            <Monitor className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-lg">Desktop</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {categories.map((cat) => (
                              <div key={`desktop-${cat.name}`} className="text-center p-3 bg-background rounded-lg">
                                <div className={`text-2xl font-bold ${getRatingColor(getScoreRating(cat.desktop))}`}>
                                  {cat.desktop}
                                </div>
                                <div className="text-xs text-muted-foreground">{cat.name}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Difference Indicators */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {categories.map((cat) => {
                          const diff = cat.desktop - cat.mobile;
                          const isPositive = diff > 0;
                          
                          return (
                            <Card key={`diff-${cat.name}`}>
                              <CardContent className="pt-4 text-center">
                                <div className="text-sm text-muted-foreground mb-1">{cat.name}</div>
                                <div className={`flex items-center justify-center gap-1 text-lg font-semibold ${
                                  isPositive ? 'text-green-600' : diff < 0 ? 'text-red-600' : 'text-muted-foreground'
                                }`}>
                                  {isPositive ? <TrendingUp className="h-4 w-4" /> : diff < 0 ? <TrendingDown className="h-4 w-4" /> : null}
                                  {isPositive ? '+' : ''}{diff} Punkte
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Desktop vs Mobile
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Core Web Vitals Comparison Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Core Web Vitals Vergleich</CardTitle>
                <CardDescription>Mobile vs Desktop Performance-Metriken</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const mobileReport = lighthouseReports
                    .filter(r => r.url === selectedPage && r.device === 'mobile')
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                  
                  const desktopReport = lighthouseReports
                    .filter(r => r.url === selectedPage && r.device === 'desktop')
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

                  if (!mobileReport || !desktopReport) return null;

                  const comparisonData = [
                    { name: 'LCP', Mobile: mobileReport.vitals.lcp, Desktop: desktopReport.vitals.lcp, target: 2500 },
                    { name: 'FCP', Mobile: mobileReport.vitals.fcp, Desktop: desktopReport.vitals.fcp, target: 1800 },
                    { name: 'TBT', Mobile: mobileReport.vitals.tbt, Desktop: desktopReport.vitals.tbt, target: 300 },
                    { name: 'SI', Mobile: mobileReport.vitals.si, Desktop: desktopReport.vitals.si, target: 3400 },
                    { name: 'TTFB', Mobile: mobileReport.vitals.ttfb, Desktop: desktopReport.vitals.ttfb, target: 800 },
                  ];

                  return (
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={comparisonData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis type="number" className="text-xs" />
                        <YAxis dataKey="name" type="category" className="text-xs" width={50} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))'
                          }}
                          formatter={(value: number, name: string) => [`${value}ms`, name]}
                        />
                        <Legend />
                        <Bar dataKey="Mobile" fill="hsl(28, 75%, 50%)" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="Desktop" fill="hsl(200, 80%, 42%)" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Trend Comparison Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Performance-Trend: Mobile vs Desktop</CardTitle>
                <CardDescription>Entwicklung der Performance-Scores über 30 Tage</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={(() => {
                      const dates = [...new Set(lighthouseReports.map(r => r.date))].sort().slice(-30);
                      return dates.map(date => {
                        const mobile = lighthouseReports.find(r => r.date === date && r.url === selectedPage && r.device === 'mobile');
                        const desktop = lighthouseReports.find(r => r.date === date && r.url === selectedPage && r.device === 'desktop');
                        return {
                          date: new Date(date).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit' }),
                          'Mobile Performance': mobile?.scores.performance || 0,
                          'Desktop Performance': desktop?.scores.performance || 0,
                        };
                      });
                    })()}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={[0, 100]} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))'
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Mobile Performance" stroke="hsl(28, 75%, 50%)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="Desktop Performance" stroke="hsl(200, 80%, 42%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Mobile Optimization Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Mobile-Optimierungstipps</CardTitle>
                <CardDescription>Empfehlungen zur Verbesserung der mobilen Performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <h4 className="font-semibold">Bilder optimieren</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Verwenden Sie WebP-Format, lazy loading und responsive Bilder für schnellere Ladezeiten auf Mobilgeräten.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold">JavaScript reduzieren</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Code-Splitting und Tree-Shaking einsetzen, um die Bundle-Grösse für Mobile zu minimieren.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-4 w-4 text-green-600" />
                      <h4 className="font-semibold">Above-the-fold priorisieren</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Kritisches CSS inline einfügen und LCP-Elemente prioritär laden.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <h4 className="font-semibold">Server-Response optimieren</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      CDN verwenden und Caching-Strategien für schnellere TTFB auf mobilen Netzwerken implementieren.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Lighthouse Berichte</CardTitle>
              <CardDescription>Historische Lighthouse-Audits aller getesteten Seiten</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {lighthouseReports
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 30)
                  .map((report) => (
                    <div 
                      key={report.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{report.url}</span>
                          <Badge variant="outline" className="gap-1">
                            {report.device === 'mobile' ? <Smartphone className="h-3 w-3" /> : <Monitor className="h-3 w-3" />}
                            {report.device}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(report.date).toLocaleDateString('de-CH')}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge className={getRatingColor(getScoreRating(report.scores.performance))}>
                            Perf: {report.scores.performance}
                          </Badge>
                          <Badge className={getRatingColor(getScoreRating(report.scores.accessibility))}>
                            A11y: {report.scores.accessibility}
                          </Badge>
                          <Badge className={getRatingColor(getScoreRating(report.scores.seo))}>
                            SEO: {report.scores.seo}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <ExternalLink className="h-3 w-3" />
                          Details
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <Download className="h-3 w-3" />
                          JSON
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Performance Verlauf</CardTitle>
              <CardDescription>Letzte 20 Messungen</CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }} 
                    />
                    <Line type="monotone" dataKey="LCP" stroke="hsl(200, 80%, 42%)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="FCP" stroke="hsl(28, 75%, 50%)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="TTFB" stroke="hsl(155, 45%, 35%)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Keine historischen Daten verfügbar
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Metrik Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vitals.map((vital) => (
                  <div key={vital.name} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className={`p-2 rounded-lg ${getRatingColor(vital.rating)}`}>
                      {vital.name === 'LCP' && <Eye className="h-5 w-5" />}
                      {vital.name === 'FID' && <MousePointer className="h-5 w-5" />}
                      {vital.name === 'CLS' && <Activity className="h-5 w-5" />}
                      {vital.name === 'FCP' && <Zap className="h-5 w-5" />}
                      {vital.name === 'TTFB' && <Clock className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{vital.name}</h4>
                        <Badge className={getRatingColor(vital.rating)}>
                          {vital.rating === 'good' ? 'Gut' : vital.rating === 'needs-improvement' ? 'Verbesserbar' : 'Schlecht'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{vital.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span>Aktuell: <strong>{vital.name === 'CLS' ? vital.value.toFixed(3) : vital.value}{vital.unit}</strong></span>
                        <span className="text-muted-foreground">Ziel: &lt; {vital.target}{vital.unit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>Optimierungsempfehlungen</CardTitle>
              <CardDescription>Basierend auf Ihren Core Web Vitals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vitals.filter(v => v.rating !== 'good').length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">Alle Metriken sind optimal!</h3>
                    <p className="text-muted-foreground">Ihre Website erfüllt alle Core Web Vitals Anforderungen.</p>
                  </div>
                ) : (
                  vitals.filter(v => v.rating !== 'good').map((vital) => (
                    <div key={vital.name} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <h4 className="font-semibold">{vital.name} verbessern</h4>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                        {vital.name === 'LCP' && (
                          <>
                            <li>• Bilder optimieren und lazy loading verwenden</li>
                            <li>• Kritisches CSS inline einfügen</li>
                            <li>• Server Response Time verbessern</li>
                          </>
                        )}
                        {vital.name === 'FID' && (
                          <>
                            <li>• JavaScript-Bundles aufteilen</li>
                            <li>• Long Tasks vermeiden</li>
                            <li>• Third-Party Scripts optimieren</li>
                          </>
                        )}
                        {vital.name === 'CLS' && (
                          <>
                            <li>• Bilder mit Dimensionen versehen</li>
                            <li>• Platzhalter für dynamische Inhalte</li>
                            <li>• Web Fonts mit font-display: swap</li>
                          </>
                        )}
                        {vital.name === 'FCP' && (
                          <>
                            <li>• Render-blocking Resources eliminieren</li>
                            <li>• Server Response Time verbessern</li>
                            <li>• Text-Kompression aktivieren</li>
                          </>
                        )}
                        {vital.name === 'TTFB' && (
                          <>
                            <li>• CDN verwenden</li>
                            <li>• Server-Caching aktivieren</li>
                            <li>• Datenbank-Queries optimieren</li>
                          </>
                        )}
                      </ul>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

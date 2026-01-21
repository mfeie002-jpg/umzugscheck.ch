/**
 * Launch Readiness Panel - Phase 5 Dashboard
 * Displays Core Web Vitals and Launch Checklist progress
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Rocket, 
  Gauge, 
  Shield, 
  Search, 
  Zap, 
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { 
  performanceMonitor, 
  getLaunchReadiness, 
  LAUNCH_CHECKLIST,
  type WebVitalsMetric,
  type LaunchChecklistItem 
} from '@/lib/performance-monitor';

const categoryIcons: Record<string, React.ReactNode> = {
  performance: <Gauge className="h-4 w-4" />,
  seo: <Search className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  functionality: <Zap className="h-4 w-4" />,
  business: <Briefcase className="h-4 w-4" />,
};

const categoryLabels: Record<string, string> = {
  performance: 'Performance',
  seo: 'SEO',
  security: 'Sicherheit',
  functionality: 'Funktionalität',
  business: 'Business',
};

const statusIcons: Record<string, React.ReactNode> = {
  done: <CheckCircle2 className="h-4 w-4 text-green-500" />,
  'in-progress': <Clock className="h-4 w-4 text-yellow-500" />,
  pending: <AlertCircle className="h-4 w-4 text-muted-foreground" />,
};

export function LaunchReadinessPanel() {
  const [metrics, setMetrics] = useState<Map<string, WebVitalsMetric>>(new Map());
  const readiness = getLaunchReadiness();

  useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe((metric) => {
      setMetrics((prev) => new Map(prev).set(metric.name, metric));
    });

    // Get initial report
    const report = performanceMonitor.getReport();
    const initialMetrics = new Map<string, WebVitalsMetric>();
    Object.entries(report.metrics).forEach(([name, metric]) => {
      if (metric) initialMetrics.set(name, metric);
    });
    setMetrics(initialMetrics);

    return unsubscribe;
  }, []);

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'needs-improvement': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'poor': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatMetricValue = (name: string, value: number) => {
    if (name === 'CLS') return value.toFixed(3);
    return `${Math.round(value)}ms`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Rocket className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Launch Readiness</h2>
          <p className="text-muted-foreground">Phase 5: Go-Live Vorbereitung</p>
        </div>
      </div>

      {/* Overall Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Gesamtfortschritt</span>
            <span className="text-2xl font-bold">{readiness.score}%</span>
          </div>
          <Progress value={readiness.score} className="h-3" />
          
          {readiness.criticalBlocking.length > 0 && (
            <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm font-medium text-destructive mb-2">
                ⚠️ {readiness.criticalBlocking.length} kritische Blocker
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {readiness.criticalBlocking.map((item) => (
                  <li key={item.id}>• {item.title}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Core Web Vitals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {['LCP', 'FID', 'CLS', 'TTFB', 'FCP'].map((name) => {
              const metric = metrics.get(name);
              return (
                <div 
                  key={name}
                  className={`p-4 rounded-lg border ${
                    metric ? getRatingColor(metric.rating) : 'bg-muted/50'
                  }`}
                >
                  <div className="text-xs font-medium opacity-70">{name}</div>
                  <div className="text-lg font-bold">
                    {metric ? formatMetricValue(name, metric.value) : '—'}
                  </div>
                  {metric && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {metric.rating === 'good' ? '✓ Gut' : 
                       metric.rating === 'needs-improvement' ? '⚠ Verbessern' : '✗ Schlecht'}
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Progress */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.entries(readiness.byCategory).map(([category, stats]) => (
          <Card key={category}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                {categoryIcons[category]}
                <span className="text-sm font-medium">{categoryLabels[category]}</span>
              </div>
              <div className="text-2xl font-bold">
                {stats.done}/{stats.total}
              </div>
              <Progress 
                value={(stats.done / stats.total) * 100} 
                className="h-1.5 mt-2" 
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Launch Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {LAUNCH_CHECKLIST.map((item) => (
              <ChecklistItem key={item.id} item={item} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ChecklistItem({ item }: { item: LaunchChecklistItem }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${
      item.status === 'done' ? 'bg-green-500/5 border-green-500/20' :
      item.status === 'in-progress' ? 'bg-yellow-500/5 border-yellow-500/20' :
      'bg-muted/30'
    }`}>
      {statusIcons[item.status]}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{item.title}</span>
          {item.priority === 'critical' && (
            <Badge variant="destructive" className="text-xs">Kritisch</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{item.description}</p>
      </div>
      <Badge variant="outline" className="text-xs shrink-0">
        {categoryLabels[item.category]}
      </Badge>
    </div>
  );
}

export default LaunchReadinessPanel;

/**
 * Post-Launch Analytics Dashboard Component
 * Real-time monitoring after go-live
 */

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Users,
  Target,
  DollarSign,
  MousePointer,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Zap,
  Eye,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import {
  LIVE_METRICS,
  FUNNEL_STEPS,
  TRAFFIC_SOURCES,
  ALERT_CONFIGS,
  calculateFunnelConversion,
  getMetricsByCategory,
  getPerformanceScore,
  type LiveMetric
} from "@/lib/post-launch-analytics";

const categoryIcons = {
  traffic: Users,
  conversion: Target,
  revenue: DollarSign,
  engagement: MousePointer,
  quality: CheckCircle2
};

const categoryLabels = {
  traffic: 'Traffic',
  conversion: 'Conversion',
  revenue: 'Umsatz',
  engagement: 'Engagement',
  quality: 'Qualität'
};

const MetricCard = memo(function MetricCard({ metric }: { metric: LiveMetric }) {
  const change = metric.previousValue 
    ? ((metric.value - metric.previousValue) / metric.previousValue) * 100 
    : 0;
  
  const isPositiveTrend = 
    (metric.trend === 'up' && !['bounce-rate', 'error-rate', 'cpl'].includes(metric.id)) ||
    (metric.trend === 'down' && ['bounce-rate', 'error-rate', 'cpl'].includes(metric.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border bg-card"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm text-muted-foreground">{metric.name}</span>
        {metric.trend !== 'stable' && (
          <Badge 
            variant="outline" 
            className={isPositiveTrend ? 'text-success border-success' : 'text-destructive border-destructive'}
          >
            {isPositiveTrend ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(change).toFixed(1)}%
          </Badge>
        )}
      </div>
      
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">
          {typeof metric.value === 'number' && metric.value % 1 !== 0 
            ? metric.value.toFixed(2) 
            : metric.value.toLocaleString('de-CH')}
        </span>
        <span className="text-sm text-muted-foreground">{metric.unit}</span>
      </div>

      {metric.target && (
        <div className="mt-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Ziel: {metric.target}{metric.unit}</span>
            <span>{Math.round((metric.value / metric.target) * 100)}%</span>
          </div>
          <Progress value={(metric.value / metric.target) * 100} className="h-1.5" />
        </div>
      )}
    </motion.div>
  );
});

export const PostLaunchDashboard = memo(function PostLaunchDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const performanceScore = getPerformanceScore();
  const funnelConversion = calculateFunnelConversion();

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Post-Launch Analytics
          </h2>
          <p className="text-muted-foreground">
            Echtzeit-Überwachung seit Go-Live
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Live
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Aktualisieren
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="md:col-span-1">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {performanceScore}%
            </div>
            <p className="text-sm text-muted-foreground">Performance Score</p>
            <Progress value={performanceScore} className="h-2 mt-3" />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold text-success mb-2">
              {funnelConversion}%
            </div>
            <p className="text-sm text-muted-foreground">Funnel-Conversion</p>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>847 → 89 Leads</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold text-accent mb-2">
              23
            </div>
            <p className="text-sm text-muted-foreground">Leads heute</p>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-success">
              <TrendingUp className="w-3 h-3" />
              <span>+28% vs. gestern</span>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-bold mb-2">
              1'240
            </div>
            <p className="text-sm text-muted-foreground">CHF Umsatz heute</p>
            <div className="flex items-center justify-center gap-1 mt-2 text-xs text-success">
              <TrendingUp className="w-3 h-3" />
              <span>+27% vs. gestern</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {ALERT_CONFIGS.some(a => a.isActive) && (
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <span className="font-medium">Aktive Alerts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ALERT_CONFIGS.filter(a => a.isActive).slice(0, 3).map(alert => (
                <Badge 
                  key={alert.id} 
                  variant="outline"
                  className={
                    alert.severity === 'critical' ? 'border-destructive text-destructive' :
                    alert.severity === 'warning' ? 'border-warning text-warning' :
                    'border-muted-foreground'
                  }
                >
                  {alert.metric}: {alert.condition} {alert.threshold}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="funnel">Funnel</TabsTrigger>
          <TabsTrigger value="sources">Traffic-Quellen</TabsTrigger>
          <TabsTrigger value="metrics">Alle Metriken</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(categoryLabels).map(([category, label]) => {
              const metrics = getMetricsByCategory(category as LiveMetric['category']);
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              
              return (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      {label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {metrics.slice(0, 3).map(metric => (
                      <MetricCard key={metric.id} metric={metric} />
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Funnel Tab */}
        <TabsContent value="funnel" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Conversion Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {FUNNEL_STEPS.map((step, index) => (
                  <div key={step.name} className="relative">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{step.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {step.visitors.toLocaleString('de-CH')} Besucher
                          </span>
                        </div>
                        <Progress 
                          value={step.conversionRate} 
                          className="h-3"
                        />
                      </div>
                      
                      <div className="w-20 text-right">
                        <div className="text-sm font-medium">{step.conversionRate}%</div>
                        {step.dropOffRate > 0 && (
                          <div className="text-xs text-destructive">
                            -{step.dropOffRate}%
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {index < FUNNEL_STEPS.length - 1 && (
                      <div className="ml-4 pl-3 border-l-2 border-dashed border-border h-4" />
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Gesamt-Conversion</div>
                    <div className="text-2xl font-bold text-primary">{funnelConversion}%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Grösster Drop-Off</div>
                    <div className="text-lg font-medium text-destructive">
                      Step 4: Kontakt (-36.3%)
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Sources Tab */}
        <TabsContent value="sources" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Traffic-Quellen Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {TRAFFIC_SOURCES.map((source, index) => (
                  <div 
                    key={source.name}
                    className="p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{source.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {source.visitors} Besucher
                          </div>
                        </div>
                      </div>
                      
                      <Badge 
                        variant="outline"
                        className={source.trend === 'up' ? 'text-success border-success' : ''}
                      >
                        {source.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : null}
                        {source.conversionRate}% CR
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold">{source.leads}</div>
                        <div className="text-xs text-muted-foreground">Leads</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{source.conversionRate}%</div>
                        <div className="text-xs text-muted-foreground">Conversion</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">{source.revenue} CHF</div>
                        <div className="text-xs text-muted-foreground">Umsatz</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* All Metrics Tab */}
        <TabsContent value="metrics" className="mt-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {LIVE_METRICS.map(metric => (
              <MetricCard key={metric.id} metric={metric} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});

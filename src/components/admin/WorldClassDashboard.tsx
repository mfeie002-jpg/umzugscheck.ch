/**
 * WORLD-CLASS METRICS DASHBOARD
 * 
 * Real-time dashboard showing all KPIs and progress towards world-class status.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, TrendingDown, Target, CheckCircle, Clock, 
  Zap, Shield, Users, BarChart3, Globe, Award,
  AlertCircle, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  WORLD_CLASS_TARGETS, 
  FEATURE_CHECKLIST, 
  calculateWorldClassScore,
  getHighImpactTodos,
  COMPETITOR_BENCHMARKS,
  type FeatureStatus 
} from '@/lib/world-class-metrics';
import { webVitals } from '@/lib/web-vitals';

// Mock current metrics (would come from analytics in production)
const CURRENT_METRICS = {
  conversion: {
    overallConversionRate: 0.052,
    heroToFormStart: 0.28,
    formStartToComplete: 0.38,
    funnelDropoffRate: 0.22,
    mobilConversionRate: 0.045,
    returningUserConversion: 0.11,
  },
  performance: {
    lcp: 2800,
    fid: 85,
    cls: 0.08,
    inp: 180,
    ttfb: 650,
    fcp: 1600,
    lighthouseScore: 78,
  },
  trust: {
    avgRating: 4.7,
    reviewCount: 1847,
    nps: 42,
  },
  business: {
    leadsPerDay: 28,
    costPerLead: 22,
    leadQualityScore: 68,
  },
};

const MetricCard = ({ 
  title, 
  current, 
  target, 
  unit = '',
  isPercentage = false,
  lowerIsBetter = false,
  icon: Icon 
}: {
  title: string;
  current: number;
  target: number;
  unit?: string;
  isPercentage?: boolean;
  lowerIsBetter?: boolean;
  icon: any;
}) => {
  const progress = lowerIsBetter 
    ? Math.min((target / current) * 100, 100)
    : Math.min((current / target) * 100, 100);
  
  const isGood = lowerIsBetter ? current <= target : current >= target;
  const trend = isGood ? 'up' : 'down';
  
  const formatValue = (val: number) => {
    if (isPercentage) return `${(val * 100).toFixed(1)}%`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toFixed(val < 10 ? 2 : 0);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${isGood ? 'bg-green-100 dark:bg-green-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
              <Icon className={`h-4 w-4 ${isGood ? 'text-green-600' : 'text-amber-600'}`} />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          {trend === 'up' ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-amber-500" />
          )}
        </div>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-2xl font-bold">{formatValue(current)}{unit}</span>
          <span className="text-sm text-muted-foreground">/ {formatValue(target)}{unit}</span>
        </div>
        
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
};

const FeatureChecklist = ({ features }: { features: FeatureStatus[] }) => {
  const statusIcons = {
    done: <CheckCircle className="h-4 w-4 text-green-500" />,
    in_progress: <Clock className="h-4 w-4 text-amber-500" />,
    todo: <AlertCircle className="h-4 w-4 text-muted-foreground" />,
    blocked: <AlertCircle className="h-4 w-4 text-red-500" />,
  };
  
  const statusBadges = {
    done: <Badge variant="secondary" className="bg-green-100 text-green-700">Done</Badge>,
    in_progress: <Badge variant="secondary" className="bg-amber-100 text-amber-700">In Progress</Badge>,
    todo: <Badge variant="outline">Todo</Badge>,
    blocked: <Badge variant="destructive">Blocked</Badge>,
  };
  
  return (
    <div className="space-y-2">
      {features.slice(0, 8).map((feature) => (
        <div 
          key={feature.id}
          className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            {statusIcons[feature.status]}
            <span className={`text-sm ${feature.status === 'done' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
              {feature.name}
            </span>
          </div>
          {statusBadges[feature.status]}
        </div>
      ))}
    </div>
  );
};

export const WorldClassDashboard = () => {
  const [webVitalsData, setWebVitalsData] = useState<any>(null);
  const worldClassScore = calculateWorldClassScore();
  const highImpactTodos = getHighImpactTodos();
  
  useEffect(() => {
    // Get web vitals after a delay
    const timer = setTimeout(() => {
      setWebVitalsData(webVitals.getMetrics());
    }, 3000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">World-Class Dashboard</h1>
            <p className="text-muted-foreground">Tracking progress towards #1 Moving Platform</p>
          </div>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className={`text-5xl font-bold ${
              worldClassScore >= 80 ? 'text-green-500' : 
              worldClassScore >= 60 ? 'text-amber-500' : 'text-red-500'
            }`}>
              {worldClassScore}%
            </div>
            <Badge variant="outline" className="mt-1">World-Class Score</Badge>
          </motion.div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Conversion Rate"
            current={CURRENT_METRICS.conversion.overallConversionRate}
            target={WORLD_CLASS_TARGETS.conversion.overallConversionRate}
            isPercentage
            icon={Target}
          />
          <MetricCard
            title="LCP"
            current={CURRENT_METRICS.performance.lcp}
            target={WORLD_CLASS_TARGETS.performance.lcp}
            unit="ms"
            lowerIsBetter
            icon={Zap}
          />
          <MetricCard
            title="Avg Rating"
            current={CURRENT_METRICS.trust.avgRating}
            target={WORLD_CLASS_TARGETS.trust.avgRating}
            icon={Award}
          />
          <MetricCard
            title="Leads/Day"
            current={CURRENT_METRICS.business.leadsPerDay}
            target={WORLD_CLASS_TARGETS.business.leadsPerDay}
            icon={Users}
          />
        </div>
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feature Progress */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Feature Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-sm text-muted-foreground">CONVERSION</h4>
                  <FeatureChecklist features={FEATURE_CHECKLIST.filter(f => f.category === 'conversion')} />
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-sm text-muted-foreground">PERFORMANCE</h4>
                  <FeatureChecklist features={FEATURE_CHECKLIST.filter(f => f.category === 'performance')} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* High Impact Todos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                High-Impact Todos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {highImpactTodos.slice(0, 5).map((todo) => (
                  <div 
                    key={todo.id}
                    className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
                  >
                    <div>
                      <div className="font-medium text-sm">{todo.name}</div>
                      <div className="text-xs text-muted-foreground">
                        P{todo.priority} • {todo.effort} effort
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-amber-600" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Competitor Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Competitor Benchmark
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(COMPETITOR_BENCHMARKS).map(([key, comp]) => (
                <div 
                  key={key}
                  className="p-4 border rounded-lg"
                >
                  <div className="font-semibold mb-2">{comp.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Conv. Rate:</span>
                      <span className="ml-1 font-medium">{(comp.conversionRate * 100).toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">LCP:</span>
                      <span className="ml-1 font-medium">{comp.lcp}ms</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Bounce:</span>
                      <span className="ml-1 font-medium">{comp.bounceRate}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="ml-1 font-medium">{comp.avgRating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Core Web Vitals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Core Web Vitals (Live)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {['LCP', 'FID', 'CLS', 'INP', 'TTFB', 'FCP'].map((metric) => {
                const key = metric.toLowerCase() as keyof typeof WORLD_CLASS_TARGETS.performance;
                const data = webVitalsData?.[key];
                const target = WORLD_CLASS_TARGETS.performance[key];
                
                return (
                  <div 
                    key={metric}
                    className="text-center p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="text-xs text-muted-foreground mb-1">{metric}</div>
                    <div className={`text-xl font-bold ${
                      data?.rating === 'good' ? 'text-green-500' :
                      data?.rating === 'needs-improvement' ? 'text-amber-500' : 
                      'text-muted-foreground'
                    }`}>
                      {data?.value ? (metric === 'CLS' ? data.value.toFixed(3) : `${Math.round(data.value)}ms`) : '...'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Target: {metric === 'CLS' ? target : `${target}ms`}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

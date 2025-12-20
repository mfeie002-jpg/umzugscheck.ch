import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, Users, TrendingUp, TrendingDown, 
  MousePointer, FormInput, CheckCircle2, ArrowRight,
  Eye, Clock, Target
} from "lucide-react";

interface FunnelStep {
  name: string;
  icon: React.ElementType;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

interface FunnelMetrics {
  totalVisitors: number;
  ctaClicks: number;
  wizardStarts: number;
  step1Complete: number;
  step2Complete: number;
  step3Complete: number;
  step4Complete: number;
  submissions: number;
  offerViews: number;
  conversions: number;
}

export const FunnelDashboard = () => {
  const [metrics, setMetrics] = useState<FunnelMetrics>({
    totalVisitors: 0,
    ctaClicks: 0,
    wizardStarts: 0,
    step1Complete: 0,
    step2Complete: 0,
    step3Complete: 0,
    step4Complete: 0,
    submissions: 0,
    offerViews: 0,
    conversions: 0,
  });

  const [isLoading, setIsLoading] = useState(true);

  // Simulated data - in production, fetch from analytics
  useEffect(() => {
    // Simulate fetching from GA4 or similar
    const simulatedMetrics: FunnelMetrics = {
      totalVisitors: 12450,
      ctaClicks: 3112,
      wizardStarts: 2489,
      step1Complete: 2115,
      step2Complete: 1903,
      step3Complete: 1714,
      step4Complete: 1371,
      submissions: 1234,
      offerViews: 987,
      conversions: 296,
    };
    
    setMetrics(simulatedMetrics);
    setIsLoading(false);
  }, []);

  const funnelSteps: FunnelStep[] = [
    {
      name: "Besucher",
      icon: Eye,
      count: metrics.totalVisitors,
      percentage: 100,
      trend: 'up',
      trendValue: 12,
    },
    {
      name: "CTA Klicks",
      icon: MousePointer,
      count: metrics.ctaClicks,
      percentage: (metrics.ctaClicks / metrics.totalVisitors) * 100,
      trend: 'up',
      trendValue: 8,
    },
    {
      name: "Wizard Start",
      icon: FormInput,
      count: metrics.wizardStarts,
      percentage: (metrics.wizardStarts / metrics.totalVisitors) * 100,
      trend: 'stable',
      trendValue: 2,
    },
    {
      name: "Schritt 1",
      icon: Target,
      count: metrics.step1Complete,
      percentage: (metrics.step1Complete / metrics.wizardStarts) * 100,
      trend: 'up',
      trendValue: 5,
    },
    {
      name: "Schritt 2",
      icon: Target,
      count: metrics.step2Complete,
      percentage: (metrics.step2Complete / metrics.step1Complete) * 100,
      trend: 'up',
      trendValue: 3,
    },
    {
      name: "Schritt 3",
      icon: Target,
      count: metrics.step3Complete,
      percentage: (metrics.step3Complete / metrics.step2Complete) * 100,
      trend: 'down',
      trendValue: 2,
    },
    {
      name: "Schritt 4",
      icon: Target,
      count: metrics.step4Complete,
      percentage: (metrics.step4Complete / metrics.step3Complete) * 100,
      trend: 'up',
      trendValue: 4,
    },
    {
      name: "Anfragen",
      icon: CheckCircle2,
      count: metrics.submissions,
      percentage: (metrics.submissions / metrics.step4Complete) * 100,
      trend: 'up',
      trendValue: 15,
    },
  ];

  const overallConversionRate = (metrics.submissions / metrics.totalVisitors) * 100;
  const wizardConversionRate = (metrics.submissions / metrics.wizardStarts) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Besucher</span>
            </div>
            <div className="text-2xl font-bold">{metrics.totalVisitors.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              +12% vs. Vormonat
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <FormInput className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Anfragen</span>
            </div>
            <div className="text-2xl font-bold">{metrics.submissions.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              +15% vs. Vormonat
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Gesamt CVR</span>
            </div>
            <div className="text-2xl font-bold">{overallConversionRate.toFixed(1)}%</div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              +0.5% vs. Vormonat
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Wizard CVR</span>
            </div>
            <div className="text-2xl font-bold">{wizardConversionRate.toFixed(1)}%</div>
            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3" />
              +3.2% vs. Vormonat
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelSteps.map((step, index) => {
              const widthPercentage = (step.count / metrics.totalVisitors) * 100;
              const dropOff = index > 0 
                ? funnelSteps[index - 1].count - step.count 
                : 0;
              const dropOffPercentage = index > 0 
                ? (dropOff / funnelSteps[index - 1].count) * 100 
                : 0;
              
              return (
                <div key={step.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <step.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{step.name}</span>
                      {index > 0 && dropOffPercentage > 15 && (
                        <Badge variant="destructive" className="text-xs">
                          -{dropOffPercentage.toFixed(0)}% Drop
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {step.count.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1 text-xs">
                        {step.trend === 'up' && (
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        )}
                        {step.trend === 'down' && (
                          <TrendingDown className="h-3 w-3 text-red-500" />
                        )}
                        <span className={
                          step.trend === 'up' ? 'text-green-600' :
                          step.trend === 'down' ? 'text-red-600' : 
                          'text-muted-foreground'
                        }>
                          {step.trend === 'up' ? '+' : step.trend === 'down' ? '-' : ''}
                          {step.trendValue}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={widthPercentage} 
                      className="h-8 rounded-sm" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                      {widthPercentage.toFixed(1)}% of visitors
                    </div>
                  </div>
                  {index < funnelSteps.length - 1 && (
                    <div className="flex justify-center py-1">
                      <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Optimierungsempfehlungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                priority: 'high',
                title: 'Drop-off bei Schritt 3 reduzieren',
                description: 'Der Zugang-Schritt hat den höchsten Drop-off. Vereinfachen Sie die Eingabefelder.',
                impact: '+12% mehr Leads geschätzt',
              },
              {
                priority: 'medium',
                title: 'CTA Klickrate verbessern',
                description: 'Nur 25% der Besucher klicken auf CTAs. A/B-Test mit verschiedenen Texten.',
                impact: '+8% mehr Wizard-Starts geschätzt',
              },
              {
                priority: 'low',
                title: 'Mobile Experience optimieren',
                description: '65% der Besucher sind mobil, aber mobile CVR ist 20% niedriger.',
                impact: '+5% mehr Leads geschätzt',
              },
            ].map((rec, i) => (
              <div 
                key={i} 
                className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === 'high' ? 'border-l-red-500 bg-red-50/50 dark:bg-red-950/20' :
                  rec.priority === 'medium' ? 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20' :
                  'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={
                        rec.priority === 'high' ? 'destructive' :
                        rec.priority === 'medium' ? 'default' : 'secondary'
                      }>
                        {rec.priority === 'high' ? 'Hoch' : 
                         rec.priority === 'medium' ? 'Mittel' : 'Niedrig'}
                      </Badge>
                      <span className="font-medium">{rec.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{rec.description}</p>
                  </div>
                  <Badge variant="outline" className="whitespace-nowrap text-green-600">
                    {rec.impact}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FunnelDashboard;

/**
 * Brand Performance Module
 * Side-by-side comparison of all 3 brands
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BRAND_PORTFOLIO } from '@/lib/cherries-chaff/brands';
import { TrendingUp, TrendingDown, Users, Target, DollarSign, Percent } from 'lucide-react';

export function BrandPerformanceModule() {
  // Mock data - would come from DB in production
  const brandStats = [
    { 
      ...BRAND_PORTFOLIO[0], 
      jobsThisMonth: 8, 
      revenue: 22400, 
      margin: 35,
      leads: 15,
      conversionRate: 53,
      trend: 'up' as const
    },
    { 
      ...BRAND_PORTFOLIO[1], 
      jobsThisMonth: 10, 
      revenue: 16000, 
      margin: 28,
      leads: 28,
      conversionRate: 36,
      trend: 'up' as const
    },
    { 
      ...BRAND_PORTFOLIO[2], 
      jobsThisMonth: 8, 
      revenue: 8800, 
      margin: 22,
      leads: 35,
      conversionRate: 23,
      trend: 'stable' as const
    },
  ];

  const totalRevenue = brandStats.reduce((sum, b) => sum + b.revenue, 0);
  const totalJobs = brandStats.reduce((sum, b) => sum + b.jobsThisMonth, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold">CHF {totalRevenue.toLocaleString('de-CH')}</p>
              <p className="text-sm text-green-600 flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4" /> +12% vs. Vormonat
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Total Jobs</p>
              <p className="text-3xl font-bold">{totalJobs}</p>
              <p className="text-sm text-muted-foreground mt-1">
                von 31 Kapazität (84%)
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Blended Margin</p>
              <p className="text-3xl font-bold">28.4%</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ziel: 30% CM2
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {brandStats.map((brand) => (
          <Card key={brand.id} className="relative overflow-hidden">
            {/* Brand Color Accent */}
            <div 
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: brand.colorAccent }}
            />
            
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{brand.name}</CardTitle>
                <Badge 
                  variant="secondary"
                  className="capitalize"
                >
                  {brand.positioning}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{brand.tagline}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <MetricBox 
                  icon={DollarSign}
                  label="Revenue"
                  value={`CHF ${brand.revenue.toLocaleString('de-CH')}`}
                />
                <MetricBox 
                  icon={Users}
                  label="Jobs"
                  value={brand.jobsThisMonth.toString()}
                />
                <MetricBox 
                  icon={Percent}
                  label="CM2"
                  value={`${brand.margin}%`}
                  status={brand.margin >= brand.targetMargin * 100 ? 'good' : 'warning'}
                />
                <MetricBox 
                  icon={Target}
                  label="Conv. Rate"
                  value={`${brand.conversionRate}%`}
                />
              </div>

              {/* Progress to Target */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Monatsziel</span>
                  <span>{brand.jobsThisMonth} / {brand.id === 'feierabend' ? 8 : brand.id === 'umzugexpress' ? 10 : 8}</span>
                </div>
                <Progress 
                  value={(brand.jobsThisMonth / (brand.id === 'feierabend' ? 8 : brand.id === 'umzugexpress' ? 10 : 8)) * 100} 
                  className="h-2"
                />
              </div>

              {/* Target Segments */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Zielgruppen:</p>
                <div className="flex flex-wrap gap-1">
                  {brand.targetSegments.slice(0, 3).map((seg) => (
                    <Badge key={seg} variant="outline" className="text-xs">
                      {seg}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Differentiators */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">USPs:</p>
                <ul className="text-xs space-y-1">
                  {brand.differentiators.slice(0, 3).map((diff, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span className="text-primary">•</span>
                      {diff}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MetricBox({ 
  icon: Icon, 
  label, 
  value, 
  status 
}: { 
  icon: React.ElementType; 
  label: string; 
  value: string;
  status?: 'good' | 'warning' | 'bad';
}) {
  return (
    <div className="bg-muted/50 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`font-bold ${
        status === 'good' ? 'text-green-600' :
        status === 'warning' ? 'text-yellow-600' :
        status === 'bad' ? 'text-destructive' : ''
      }`}>
        {value}
      </p>
    </div>
  );
}

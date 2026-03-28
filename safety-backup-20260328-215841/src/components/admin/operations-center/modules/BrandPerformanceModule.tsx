/**
 * Brand Performance Module - Mobile First
 * Touch-friendly brand comparison
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BRAND_PORTFOLIO } from '@/lib/cherries-chaff/brands';
import { TrendingUp, Users, Target, DollarSign, Percent, ChevronRight } from 'lucide-react';

export function BrandPerformanceModule() {
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
    <div className="space-y-4 md:space-y-6">
      {/* Summary Cards - Mobile: Stack, Desktop: Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 md:pt-6">
            <div className="flex items-center gap-3 sm:block sm:text-center">
              <DollarSign className="h-8 w-8 text-primary sm:hidden" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl md:text-3xl font-bold">CHF {(totalRevenue / 1000).toFixed(1)}K</p>
                <p className="text-sm text-green-600 flex items-center gap-1 sm:justify-center mt-1">
                  <TrendingUp className="h-4 w-4" /> +12% vs. Vormonat
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:pt-6">
            <div className="flex items-center gap-3 sm:block sm:text-center">
              <Users className="h-8 w-8 text-primary sm:hidden" />
              <div>
                <p className="text-sm text-muted-foreground">Total Jobs</p>
                <p className="text-2xl md:text-3xl font-bold">{totalJobs}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  von 31 Kapazität (84%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 md:pt-6">
            <div className="flex items-center gap-3 sm:block sm:text-center">
              <Percent className="h-8 w-8 text-primary sm:hidden" />
              <div>
                <p className="text-sm text-muted-foreground">Blended Margin</p>
                <p className="text-2xl md:text-3xl font-bold">28.4%</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Ziel: 30% CM2
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Cards - Mobile: Full width, Desktop: 3 columns */}
      <div className="grid gap-4 md:grid-cols-3">
        {brandStats.map((brand) => (
          <Card key={brand.id} className="relative overflow-hidden">
            {/* Brand Color Accent */}
            <div 
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: brand.colorAccent }}
            />
            
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg">{brand.name}</CardTitle>
                <Badge variant="secondary" className="capitalize text-xs">
                  {brand.positioning}
                </Badge>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground">{brand.tagline}</p>
            </CardHeader>
            
            <CardContent className="p-4 pt-2 space-y-4">
              {/* Key Metrics - 2x2 Grid */}
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <MetricBoxMobile 
                  icon={DollarSign}
                  label="Revenue"
                  value={`${(brand.revenue / 1000).toFixed(1)}K`}
                />
                <MetricBoxMobile 
                  icon={Users}
                  label="Jobs"
                  value={brand.jobsThisMonth.toString()}
                />
                <MetricBoxMobile 
                  icon={Percent}
                  label="CM2"
                  value={`${brand.margin}%`}
                  status={brand.margin >= brand.targetMargin * 100 ? 'good' : 'warning'}
                />
                <MetricBoxMobile 
                  icon={Target}
                  label="Conv."
                  value={`${brand.conversionRate}%`}
                />
              </div>

              {/* Progress to Target */}
              <div>
                <div className="flex justify-between text-xs md:text-sm mb-1.5">
                  <span>Monatsziel</span>
                  <span className="font-medium">{brand.jobsThisMonth} / {brand.id === 'feierabend' ? 8 : brand.id === 'umzugexpress' ? 10 : 8}</span>
                </div>
                <Progress 
                  value={(brand.jobsThisMonth / (brand.id === 'feierabend' ? 8 : brand.id === 'umzugexpress' ? 10 : 8)) * 100} 
                  className="h-2"
                />
              </div>

              {/* Target Segments - Horizontal scroll */}
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

              {/* USPs - Compact list */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">USPs:</p>
                <ul className="text-xs space-y-1">
                  {brand.differentiators.slice(0, 3).map((diff, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>
                      <span className="line-clamp-1">{diff}</span>
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

function MetricBoxMobile({ 
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
    <div className="bg-muted/50 rounded-lg p-2.5 md:p-3 min-h-[60px]">
      <div className="flex items-center gap-1.5 mb-0.5">
        <Icon className="h-3 w-3 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className={`font-bold text-sm md:text-base ${
        status === 'good' ? 'text-green-600' :
        status === 'warning' ? 'text-yellow-600' :
        status === 'bad' ? 'text-destructive' : ''
      }`}>
        {value}
      </p>
    </div>
  );
}

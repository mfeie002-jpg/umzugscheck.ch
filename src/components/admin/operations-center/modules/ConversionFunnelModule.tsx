/**
 * Conversion Funnel Module
 * Website → Lead → Quote → Booked visualization
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, Users, Calculator, FileText, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface FunnelStage {
  name: string;
  icon: React.ElementType;
  count: number;
  conversionRate: number;
  benchmark: number;
  trend: 'up' | 'down' | 'stable';
}

export function ConversionFunnelModule() {
  const funnelStages: FunnelStage[] = [
    { name: 'Website Visitors', icon: Users, count: 2500, conversionRate: 100, benchmark: 100, trend: 'up' },
    { name: 'Calculator Started', icon: Calculator, count: 450, conversionRate: 18, benchmark: 15, trend: 'up' },
    { name: 'Lead Submitted', icon: FileText, count: 95, conversionRate: 21.1, benchmark: 20, trend: 'stable' },
    { name: 'Quote Sent', icon: FileText, count: 42, conversionRate: 44.2, benchmark: 45, trend: 'down' },
    { name: 'Booked', icon: CheckCircle, count: 26, conversionRate: 61.9, benchmark: 55, trend: 'up' },
  ];

  // By source
  const sourceBreakdown = [
    { source: 'Google Ads', visitors: 1200, leads: 52, booked: 14, cpl: 48 },
    { source: 'SEO', visitors: 800, leads: 28, booked: 8, cpl: 0 },
    { source: 'Direct', visitors: 300, leads: 10, booked: 3, cpl: 0 },
    { source: 'Meta Ads', visitors: 200, leads: 5, booked: 1, cpl: 85 },
  ];

  return (
    <div className="space-y-6">
      {/* Visual Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            {funnelStages.map((stage, index) => {
              const widthPercent = 100 - (index * 15);
              const Icon = stage.icon;
              const isAboveBenchmark = stage.conversionRate >= stage.benchmark;
              
              return (
                <div key={stage.name} className="w-full flex flex-col items-center">
                  {/* Stage Bar */}
                  <div 
                    className="relative bg-primary/20 rounded-lg p-4 flex items-center justify-between transition-all"
                    style={{ width: `${widthPercent}%` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/20 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{stage.name}</p>
                        <p className="text-2xl font-bold">{stage.count.toLocaleString('de-CH')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {index > 0 && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-bold ${
                              isAboveBenchmark ? 'text-green-600' : 'text-yellow-600'
                            }`}>
                              {stage.conversionRate.toFixed(1)}%
                            </span>
                            {stage.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
                            {stage.trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Benchmark: {stage.benchmark}%
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Arrow between stages */}
                  {index < funnelStages.length - 1 && (
                    <div className="py-2">
                      <ArrowDown className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* By Source */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance nach Quelle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sourceBreakdown.map((source) => {
              const conversionRate = source.visitors > 0 ? (source.leads / source.visitors) * 100 : 0;
              const bookingRate = source.leads > 0 ? (source.booked / source.leads) * 100 : 0;
              
              return (
                <div key={source.source} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{source.source}</h4>
                    {source.cpl > 0 && (
                      <Badge variant={source.cpl <= 50 ? 'default' : source.cpl <= 70 ? 'secondary' : 'destructive'}>
                        CPL: CHF {source.cpl}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-center text-sm">
                    <div>
                      <p className="text-muted-foreground">Visitors</p>
                      <p className="font-bold text-lg">{source.visitors.toLocaleString('de-CH')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Leads</p>
                      <p className="font-bold text-lg">{source.leads}</p>
                      <p className="text-xs text-muted-foreground">({conversionRate.toFixed(1)}%)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Booked</p>
                      <p className="font-bold text-lg">{source.booked}</p>
                      <p className="text-xs text-muted-foreground">({bookingRate.toFixed(0)}%)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Wert</p>
                      <p className="font-bold text-lg">CHF {(source.booked * 1800).toLocaleString('de-CH')}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Opportunities */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Optimierungs-Potenzial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded border border-green-500/20">
              <div>
                <p className="font-medium">Calculator → Lead (+1%)</p>
                <p className="text-sm text-muted-foreground">Von 21% auf 22% = +4.5 Leads/Monat</p>
              </div>
              <Badge>+CHF 8'100</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded border border-yellow-500/20">
              <div>
                <p className="font-medium">Quote → Booked (+5%)</p>
                <p className="text-sm text-muted-foreground">Von 62% auf 67% = +2 Buchungen/Monat</p>
              </div>
              <Badge>+CHF 3'600</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

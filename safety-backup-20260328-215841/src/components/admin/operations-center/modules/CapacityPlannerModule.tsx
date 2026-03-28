/**
 * Capacity Planner Module
 * Crew utilization and scheduling across brands
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, Truck, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

export function CapacityPlannerModule() {
  // Current month stats
  const currentMonth = {
    totalDays: 22, // working days
    bookedDays: 17,
    utilization: 77,
    targetUtilization: 85,
    crewCount: 1,
    jobsPerDay: 1.5,
  };

  // Weekly breakdown
  const weeks = [
    { week: 'KW 5', jobs: 6, capacity: 7.5, utilization: 80, revenue: 10200 },
    { week: 'KW 6', jobs: 7, capacity: 7.5, utilization: 93, revenue: 12400 },
    { week: 'KW 7', jobs: 5, capacity: 7.5, utilization: 67, revenue: 8100 },
    { week: 'KW 8', jobs: 8, capacity: 7.5, utilization: 107, revenue: 14500 },
  ];

  // Brand allocation
  const brandAllocation = [
    { brand: 'Feierabend', color: '#1E3A5F', jobs: 8, target: 8, days: 6 },
    { brand: 'Umzugexpress', color: '#E63946', jobs: 10, target: 10, days: 7 },
    { brand: 'Zügelhelden', color: '#2A9D8F', jobs: 8, target: 8, days: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Current Status */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Crews</p>
                <p className="text-2xl font-bold">{currentMonth.crewCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Jobs/Tag</p>
                <p className="text-2xl font-bold">{currentMonth.jobsPerDay}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Gebuchte Tage</p>
                <p className="text-2xl font-bold">{currentMonth.bookedDays} / {currentMonth.totalDays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={currentMonth.utilization >= currentMonth.targetUtilization ? 'border-green-500' : 'border-yellow-500'}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className={`h-8 w-8 ${
                currentMonth.utilization >= currentMonth.targetUtilization ? 'text-green-500' : 'text-yellow-500'
              }`} />
              <div>
                <p className="text-sm text-muted-foreground">Auslastung</p>
                <p className="text-2xl font-bold">{currentMonth.utilization}%</p>
                <p className="text-xs text-muted-foreground">Ziel: {currentMonth.targetUtilization}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Utilization Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Auslastungs-Schwellwerte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm">Aktuelle Auslastung</div>
              <div className="flex-1">
                <div className="relative h-8 bg-muted rounded-full overflow-hidden">
                  {/* Threshold markers */}
                  <div className="absolute top-0 bottom-0 w-px bg-yellow-500" style={{ left: '60%' }} />
                  <div className="absolute top-0 bottom-0 w-px bg-green-500" style={{ left: '85%' }} />
                  <div className="absolute top-0 bottom-0 w-px bg-red-500" style={{ left: '95%' }} />
                  
                  {/* Current value */}
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${currentMonth.utilization}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-right font-bold">{currentMonth.utilization}%</div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-red-500/10 rounded text-center">
                <p className="font-medium">&lt;60%</p>
                <p className="text-muted-foreground">-10% Rabatt</p>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded text-center">
                <p className="font-medium">60-80%</p>
                <p className="text-muted-foreground">Listenpreis</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded text-center">
                <p className="font-medium">80-95%</p>
                <p className="text-muted-foreground">Optimal</p>
              </div>
              <div className="p-2 bg-destructive/10 rounded text-center">
                <p className="font-medium">&gt;95%</p>
                <p className="text-muted-foreground">+20% Peak</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly View */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Wochen-Übersicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weeks.map((week) => (
              <div key={week.week} className="flex items-center gap-4">
                <div className="w-16 font-medium">{week.week}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Progress 
                      value={week.utilization > 100 ? 100 : week.utilization} 
                      className={`h-3 ${
                        week.utilization > 95 ? '[&>div]:bg-red-500' :
                        week.utilization >= 80 ? '[&>div]:bg-green-500' :
                        week.utilization >= 60 ? '[&>div]:bg-yellow-500' : ''
                      }`}
                    />
                    {week.utilization > 95 && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{week.jobs} Jobs</span>
                    <span>CHF {week.revenue.toLocaleString('de-CH')}</span>
                  </div>
                </div>
                <Badge variant={
                  week.utilization > 95 ? 'destructive' :
                  week.utilization >= 80 ? 'default' : 'secondary'
                }>
                  {week.utilization}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brand Allocation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Marken-Verteilung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {brandAllocation.map((brand) => (
              <div key={brand.brand} className="flex items-center gap-4">
                <div 
                  className="w-3 h-10 rounded"
                  style={{ backgroundColor: brand.color }}
                />
                <div className="w-32">
                  <p className="font-medium">{brand.brand}</p>
                  <p className="text-xs text-muted-foreground">{brand.days} Tage</p>
                </div>
                <div className="flex-1">
                  <Progress 
                    value={(brand.jobs / brand.target) * 100}
                    className="h-2"
                  />
                </div>
                <div className="w-20 text-right">
                  <span className="font-bold">{brand.jobs}</span>
                  <span className="text-muted-foreground">/{brand.target}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scale Trigger */}
      <Card className="border-dashed">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Scale Trigger</h3>
              <p className="text-sm text-muted-foreground">
                Bei &gt;85% Auslastung für 4 Wochen → Crew #2 einstellen
              </p>
            </div>
            <Badge variant="secondary">
              2/4 Wochen erreicht
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

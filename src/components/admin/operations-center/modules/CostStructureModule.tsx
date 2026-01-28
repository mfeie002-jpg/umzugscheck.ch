/**
 * Cost Structure Module
 * COGS breakdown (labor, vehicle, marketing)
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DollarSign, Users, Truck, Megaphone, Building2, TrendingDown, TrendingUp } from 'lucide-react';

export function CostStructureModule() {
  // Monthly cost breakdown
  const costBreakdown = [
    { name: 'Personal', value: 18500, percentage: 55, icon: Users, color: '#1E3A5F' },
    { name: 'Fahrzeug', value: 4200, percentage: 12, icon: Truck, color: '#E63946' },
    { name: 'Marketing', value: 5700, percentage: 17, icon: Megaphone, color: '#2A9D8F' },
    { name: 'Overhead', value: 5400, percentage: 16, icon: Building2, color: '#6B7280' },
  ];

  const totalCosts = costBreakdown.reduce((sum, c) => sum + c.value, 0);
  const revenue = 47200;
  const grossMargin = ((revenue - totalCosts) / revenue) * 100;

  // Per-job cost breakdown
  const perJobCosts = {
    avgRevenue: 1815,
    laborCost: 712, // ~CHF 135-145/hour * 5h avg
    vehicleCost: 162,
    marketingShare: 219,
    overhead: 208,
    cm2: 514,
    cm2Percent: 28.3,
  };

  // Monthly trend
  const monthlyTrend = [
    { month: 'Okt', personal: 17500, fahrzeug: 4000, marketing: 4200, overhead: 5200 },
    { month: 'Nov', personal: 18000, fahrzeug: 4100, marketing: 5000, overhead: 5300 },
    { month: 'Dez', personal: 17800, fahrzeug: 3900, marketing: 4800, overhead: 5100 },
    { month: 'Jan', personal: 18500, fahrzeug: 4200, marketing: 5700, overhead: 5400 },
  ];

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">CHF {revenue.toLocaleString('de-CH')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-8 w-8 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Total Kosten</p>
                <p className="text-2xl font-bold">CHF {totalCosts.toLocaleString('de-CH')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={grossMargin >= 25 ? 'border-green-500' : 'border-yellow-500'}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className={`h-8 w-8 ${grossMargin >= 25 ? 'text-green-500' : 'text-yellow-500'}`} />
              <div>
                <p className="text-sm text-muted-foreground">Gross Margin</p>
                <p className="text-2xl font-bold">{grossMargin.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">CM2 (Profit)</p>
                <p className="text-2xl font-bold">CHF {(revenue - totalCosts).toLocaleString('de-CH')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Kostenverteilung</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`CHF ${value.toLocaleString('de-CH')}`, '']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Per Job Unit Economics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Unit Economics pro Job</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between p-2 bg-green-500/10 rounded">
                <span>Ø Revenue</span>
                <span className="font-bold">CHF {perJobCosts.avgRevenue}</span>
              </div>
              
              <div className="border-l-2 border-destructive/50 pl-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Personal (5h × CHF 140)</span>
                  <span>- CHF {perJobCosts.laborCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fahrzeug</span>
                  <span>- CHF {perJobCosts.vehicleCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Marketing-Anteil</span>
                  <span>- CHF {perJobCosts.marketingShare}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overhead</span>
                  <span>- CHF {perJobCosts.overhead}</span>
                </div>
              </div>
              
              <div className="flex justify-between p-2 bg-primary/10 rounded font-bold">
                <span>CM2 (Contribution Margin 2)</span>
                <span className="text-green-600">CHF {perJobCosts.cm2} ({perJobCosts.cm2Percent}%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kosten-Trend (4 Monate)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} className="text-xs" />
              <Tooltip 
                formatter={(value: number) => [`CHF ${value.toLocaleString('de-CH')}`, '']}
              />
              <Legend />
              <Bar dataKey="personal" name="Personal" fill="#1E3A5F" stackId="a" />
              <Bar dataKey="fahrzeug" name="Fahrzeug" fill="#E63946" stackId="a" />
              <Bar dataKey="marketing" name="Marketing" fill="#2A9D8F" stackId="a" />
              <Bar dataKey="overhead" name="Overhead" fill="#6B7280" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cost Categories Detail */}
      <div className="grid md:grid-cols-2 gap-4">
        {costBreakdown.map((cost) => {
          const Icon = cost.icon;
          return (
            <Card key={cost.name}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${cost.color}20` }}
                  >
                    <Icon className="h-6 w-6" style={{ color: cost.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{cost.name}</h3>
                      <Badge variant="outline">{cost.percentage}%</Badge>
                    </div>
                    <p className="text-2xl font-bold mt-1">
                      CHF {cost.value.toLocaleString('de-CH')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

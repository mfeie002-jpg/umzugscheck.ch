/**
 * Revenue Forecast Module
 * Projected monthly revenue by brand
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, Calendar, DollarSign } from 'lucide-react';
import { BRAND_PORTFOLIO } from '@/lib/cherries-chaff/brands';

export function RevenueForecastModule() {
  // 6-month forecast data
  const forecastData = [
    { month: 'Feb', feierabend: 22400, umzugexpress: 16000, zuegelhelden: 8800, total: 47200, target: 50000 },
    { month: 'Mär', feierabend: 25200, umzugexpress: 19200, zuegelhelden: 9900, total: 54300, target: 55000 },
    { month: 'Apr', feierabend: 30800, umzugexpress: 24000, zuegelhelden: 12100, total: 66900, target: 65000 },
    { month: 'Mai', feierabend: 36400, umzugexpress: 28800, zuegelhelden: 14300, total: 79500, target: 75000 },
    { month: 'Jun', feierabend: 39200, umzugexpress: 32000, zuegelhelden: 15400, total: 86600, target: 85000 },
    { month: 'Jul', feierabend: 33600, umzugexpress: 27200, zuegelhelden: 13200, total: 74000, target: 80000 },
  ];

  // Scenario comparison
  const scenarios = [
    { name: 'Pessimistisch', revenue: 42000, probability: 20, jobs: 22, cpl: 75 },
    { name: 'Basis', revenue: 47200, probability: 50, jobs: 26, cpl: 52 },
    { name: 'Optimistisch', revenue: 58000, probability: 30, jobs: 32, cpl: 40 },
  ];

  const currentForecast = forecastData[0];
  const yearTotal = forecastData.reduce((sum, m) => sum + m.total, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Diesen Monat</p>
                <p className="text-2xl font-bold">CHF {currentForecast.total.toLocaleString('de-CH')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Monatsziel</p>
                <p className="text-2xl font-bold">CHF {currentForecast.target.toLocaleString('de-CH')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">6-Monats-Prognose</p>
                <p className="text-2xl font-bold">CHF {yearTotal.toLocaleString('de-CH')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={currentForecast.total >= currentForecast.target ? 'border-green-500' : 'border-yellow-500'}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className={`h-8 w-8 ${
                currentForecast.total >= currentForecast.target ? 'text-green-500' : 'text-yellow-500'
              }`} />
              <div>
                <p className="text-sm text-muted-foreground">vs. Ziel</p>
                <p className="text-2xl font-bold">
                  {((currentForecast.total / currentForecast.target) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">6-Monats-Prognose nach Marke</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`CHF ${value.toLocaleString('de-CH')}`, '']}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="feierabend" 
                name="Feierabend"
                stackId="1"
                fill="#1E3A5F" 
                stroke="#1E3A5F"
              />
              <Area 
                type="monotone" 
                dataKey="umzugexpress" 
                name="Umzugexpress"
                stackId="1"
                fill="#E63946" 
                stroke="#E63946"
              />
              <Area 
                type="monotone" 
                dataKey="zuegelhelden" 
                name="Zügelhelden"
                stackId="1"
                fill="#2A9D8F" 
                stroke="#2A9D8F"
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                name="Ziel"
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Scenario Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Szenarien-Vergleich</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {scenarios.map((scenario) => (
              <Card key={scenario.name} className={scenario.name === 'Basis' ? 'border-primary' : ''}>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{scenario.name}</h3>
                      <Badge variant={scenario.name === 'Basis' ? 'default' : 'secondary'}>
                        {scenario.probability}%
                      </Badge>
                    </div>
                    <p className="text-3xl font-bold">
                      CHF {scenario.revenue.toLocaleString('de-CH')}
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Jobs/Monat</span>
                        <span>{scenario.jobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Angenommener CPL</span>
                        <span>CHF {scenario.cpl}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Brand Contribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Marken-Beitrag zum Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={forecastData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis type="number" tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
              <YAxis dataKey="month" type="category" className="text-xs" />
              <Tooltip 
                formatter={(value: number) => [`CHF ${value.toLocaleString('de-CH')}`, '']}
              />
              <Bar dataKey="feierabend" name="Feierabend" fill="#1E3A5F" stackId="a" />
              <Bar dataKey="umzugexpress" name="Umzugexpress" fill="#E63946" stackId="a" />
              <Bar dataKey="zuegelhelden" name="Zügelhelden" fill="#2A9D8F" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

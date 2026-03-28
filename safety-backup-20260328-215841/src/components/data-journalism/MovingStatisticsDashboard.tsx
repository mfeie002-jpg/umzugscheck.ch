/**
 * SCHWEIZER UMZUGSSTATISTIK DASHBOARD
 * Visualizations of moving trends, popular routes, seasonal patterns
 * SEO optimized for backlinks from media outlets
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  MapPin, 
  Calendar, 
  Users, 
  Truck,
  ArrowRight,
  Info,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  YEARLY_STATISTICS, 
  MONTHLY_DISTRIBUTION, 
  POPULAR_ROUTES,
  formatCurrency 
} from '@/lib/data-journalism';

const CHART_COLORS = {
  primary: 'hsl(var(--primary))',
  muted: 'hsl(var(--muted-foreground))',
  destructive: 'hsl(var(--destructive))',
  green: '#22c55e'
};

const DEMAND_COLORS: Record<string, string> = {
  'niedrig': '#22c55e',
  'mittel': 'hsl(var(--primary))',
  'hoch': '#f59e0b',
  'sehr hoch': 'hsl(var(--destructive))'
};

export function MovingStatisticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const latestYear = YEARLY_STATISTICS[0];
  const previousYear = YEARLY_STATISTICS[1];

  const yoyChange = {
    moves: ((latestYear.totalMoves - previousYear.totalMoves) / previousYear.totalMoves * 100).toFixed(1),
    cost: ((latestYear.avgCostCH - previousYear.avgCostCH) / previousYear.avgCostCH * 100).toFixed(1),
    professional: (latestYear.professionalMovePercent - previousYear.professionalMovePercent).toFixed(1)
  };

  return (
    <section className="py-12 md:py-16">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-4">
            Statistik 2024
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Schweizer Umzugsstatistik
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aktuelle Trends, saisonale Muster und beliebte Umzugsrouten in der Schweiz – 
            basierend auf Daten von über 50'000 Umzugsanfragen.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Truck className="w-4 h-4" />
                Umzüge 2024
              </div>
              <div className="text-2xl md:text-3xl font-bold">
                {(latestYear.totalMoves / 1000).toFixed(0)}k
              </div>
              <div className={`text-xs flex items-center gap-1 mt-1 ${parseFloat(yoyChange.moves) > 0 ? 'text-green-600' : 'text-destructive'}`}>
                {parseFloat(yoyChange.moves) > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {yoyChange.moves}% vs. 2023
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <TrendingUp className="w-4 h-4" />
                Ø Kosten
              </div>
              <div className="text-2xl md:text-3xl font-bold">
                {formatCurrency(latestYear.avgCostCH)}
              </div>
              <div className={`text-xs flex items-center gap-1 mt-1 ${parseFloat(yoyChange.cost) > 0 ? 'text-destructive' : 'text-green-600'}`}>
                {parseFloat(yoyChange.cost) > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {yoyChange.cost}% vs. 2023
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Calendar className="w-4 h-4" />
                Peak-Monat
              </div>
              <div className="text-2xl md:text-3xl font-bold">
                {latestYear.mostPopularMonth.slice(0, 3)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Höchste Nachfrage
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Users className="w-4 h-4" />
                Mit Firma
              </div>
              <div className="text-2xl md:text-3xl font-bold">
                {latestYear.professionalMovePercent}%
              </div>
              <div className={`text-xs flex items-center gap-1 mt-1 ${parseFloat(yoyChange.professional) > 0 ? 'text-green-600' : 'text-destructive'}`}>
                {parseFloat(yoyChange.professional) > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {yoyChange.professional}% vs. 2023
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Jahresübersicht</TabsTrigger>
            <TabsTrigger value="seasonal">Saisonalität</TabsTrigger>
            <TabsTrigger value="routes">Top-Routen</TabsTrigger>
          </TabsList>

          {/* Yearly Overview */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Entwicklung über 5 Jahre</CardTitle>
                <CardDescription>
                  Anzahl Umzüge und Durchschnittskosten 2020–2024
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[...YEARLY_STATISTICS].reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="year" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        yAxisId="left"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickFormatter={(v) => `${(v/1000).toFixed(0)}k`}
                      />
                      <YAxis 
                        yAxisId="right"
                        orientation="right"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickFormatter={(v) => `${v} CHF`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number, name: string) => {
                          if (name === 'totalMoves') return [`${(value/1000).toFixed(0)}k Umzüge`, 'Umzüge'];
                          return [`${value} CHF`, 'Ø Kosten'];
                        }}
                      />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="totalMoves" 
                        stroke={CHART_COLORS.primary}
                        strokeWidth={3}
                        dot={{ fill: CHART_COLORS.primary, r: 5 }}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="avgCostCH" 
                        stroke={CHART_COLORS.green}
                        strokeWidth={3}
                        dot={{ fill: CHART_COLORS.green, r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm text-muted-foreground">Umzüge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">Ø Kosten</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seasonal Patterns */}
          <TabsContent value="seasonal">
            <Card>
              <CardHeader>
                <CardTitle>Umzüge nach Monat</CardTitle>
                <CardDescription>
                  Verteilung der Umzüge und Durchschnittskosten nach Monat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MONTHLY_DISTRIBUTION}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="monthShort" 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                      />
                      <YAxis 
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number, name: string) => {
                          if (name === 'percent') return [`${value}%`, 'Anteil'];
                          return [`${value} CHF`, 'Ø Kosten'];
                        }}
                        labelFormatter={(label) => {
                          const month = MONTHLY_DISTRIBUTION.find(m => m.monthShort === label);
                          return month?.month || label;
                        }}
                      />
                      <Bar 
                        dataKey="percent" 
                        radius={[4, 4, 0, 0]}
                      >
                        {MONTHLY_DISTRIBUTION.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={DEMAND_COLORS[entry.demandLevel]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {Object.entries(DEMAND_COLORS).map(([level, color]) => (
                    <div key={level} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm text-muted-foreground capitalize">{level}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Savings Tip */}
            <Card className="mt-6 border-green-500/30 bg-green-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Spartipp</h3>
                    <p className="text-muted-foreground text-sm">
                      Umzüge im November, Dezember oder Januar sind im Durchschnitt 
                      <strong className="text-green-600"> 25–30% günstiger</strong> als 
                      in der Hochsaison (Juni–September). Planen Sie Ihren Umzug 
                      antizyklisch und sparen Sie bis zu CHF 400.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Popular Routes */}
          <TabsContent value="routes">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Umzugsrouten</CardTitle>
                <CardDescription>
                  Die beliebtesten Umzugsstrecken in der Schweiz 2024
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {POPULAR_ROUTES.map((route, index) => (
                    <div 
                      key={`${route.from}-${route.to}`}
                      className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{route.from}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{route.to}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ml-auto ${
                              route.trend === 'steigend' 
                                ? 'text-green-600 border-green-500/30' 
                                : route.trend === 'sinkend' 
                                ? 'text-destructive border-destructive/30' 
                                : ''
                            }`}
                          >
                            {route.trend}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{route.count.toLocaleString('de-CH')} Umzüge/Jahr</span>
                          <span>Ø {route.avgDistance} km</span>
                          <span className="font-medium text-foreground">
                            {formatCurrency(route.avgCost)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Methodology Note */}
        <div className="mt-8 flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
          <Info className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-sm text-muted-foreground">
            <strong>Datenquelle:</strong> Die Statistiken basieren auf aggregierten und 
            anonymisierten Daten von Umzugsanfragen auf umzugscheck.ch sowie öffentlichen 
            Statistiken des Bundesamts für Statistik (BFS). Alle Angaben ohne Gewähr.
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <Button size="lg" asChild>
            <Link to="/umzugsofferten">
              Jetzt eigenen Umzug planen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default MovingStatisticsDashboard;

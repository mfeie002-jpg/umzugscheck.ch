import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Users, FileText, CreditCard, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const RevenueAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 45678,
    monthlyGrowth: 12.5,
    avgLeadValue: 32.50,
    activeProviders: 156,
    totalLeads: 1234,
    conversionValue: 89450,
  });

  const revenueData = [
    { date: '01.11', revenue: 1250, leads: 38 },
    { date: '08.11', revenue: 1480, leads: 45 },
    { date: '15.11', revenue: 1320, leads: 41 },
    { date: '22.11', revenue: 1890, leads: 58 },
    { date: '29.11', revenue: 2100, leads: 64 },
    { date: '06.12', revenue: 1950, leads: 60 },
  ];

  const revenueBySource = [
    { name: 'Lead-Verkäufe', value: 28500, color: '#3b82f6' },
    { name: 'Abonnements', value: 12400, color: '#22c55e' },
    { name: 'Bidding-Auktionen', value: 3200, color: '#f59e0b' },
    { name: 'Click-Kosten', value: 1578, color: '#8b5cf6' },
  ];

  const topProviders = [
    { name: 'Züri-Umzüge GmbH', revenue: 2450, leads: 78 },
    { name: 'Basel Move AG', revenue: 1890, leads: 62 },
    { name: 'Berner Transport', revenue: 1650, leads: 54 },
    { name: 'Luzern Express', revenue: 1420, leads: 48 },
    { name: 'St. Gallen Logistics', revenue: 1280, leads: 42 },
  ];

  const monthlyComparison = [
    { month: 'Aug', current: 32000, previous: 28000 },
    { month: 'Sep', current: 38000, previous: 31000 },
    { month: 'Okt', current: 42000, previous: 35000 },
    { month: 'Nov', current: 45678, previous: 38000 },
  ];

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      // Load real data from database
      const { data: billingData } = await supabase
        .from('billing_records')
        .select('price_chf, status')
        .eq('status', 'paid');

      if (billingData) {
        const total = billingData.reduce((sum, r) => sum + r.price_chf, 0);
        setMetrics(prev => ({ ...prev, totalRevenue: total || prev.totalRevenue }));
      }
    } catch (error) {
      console.error('Error loading revenue metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Umsatz-Analyse</h2>
          <p className="text-muted-foreground">Detaillierte Übersicht Ihrer Einnahmen</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 Tage</SelectItem>
              <SelectItem value="30d">30 Tage</SelectItem>
              <SelectItem value="90d">90 Tage</SelectItem>
              <SelectItem value="1y">1 Jahr</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Gesamtumsatz
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">CHF {metrics.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              +{metrics.monthlyGrowth}% vs Vormonat
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Ø Lead-Wert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">CHF {metrics.avgLeadValue}</div>
            <p className="text-sm text-muted-foreground">Pro verkauftem Lead</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Aktive Provider
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{metrics.activeProviders}</div>
            <p className="text-sm text-muted-foreground">Zahlende Anbieter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Conversion-Wert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">CHF {metrics.conversionValue.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">Aufträge via Plattform</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="sources">Einnahmequellen</TabsTrigger>
          <TabsTrigger value="providers">Top Anbieter</TabsTrigger>
          <TabsTrigger value="comparison">Vergleich</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Umsatzentwicklung</CardTitle>
              <CardDescription>Umsatz und Leads über Zeit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        name === 'revenue' ? `CHF ${value}` : value,
                        name === 'revenue' ? 'Umsatz' : 'Leads'
                      ]}
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      fill="#3b82f6" 
                      fillOpacity={0.3}
                    />
                    <Area 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="leads" 
                      stroke="#22c55e" 
                      fill="#22c55e" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Einnahmequellen</CardTitle>
              <CardDescription>Aufschlüsselung nach Umsatzart</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueBySource}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {revenueBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `CHF ${value.toLocaleString()}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  {revenueBySource.map(source => (
                    <div key={source.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: source.color }}
                        />
                        <span>{source.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">CHF {source.value.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {Math.round((source.value / metrics.totalRevenue) * 100)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="providers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Anbieter nach Umsatz</CardTitle>
              <CardDescription>Die umsatzstärksten Partner</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProviders.map((provider, index) => (
                  <div 
                    key={provider.name}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-muted-foreground">{provider.leads} Leads</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">CHF {provider.revenue.toLocaleString()}</p>
                      <Badge variant="outline">
                        Ø CHF {Math.round(provider.revenue / provider.leads)}/Lead
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Monatsvergleich</CardTitle>
              <CardDescription>Aktuelles vs. Vorjahr</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `CHF ${value.toLocaleString()}`} />
                    <Legend />
                    <Bar dataKey="current" name="Aktuell" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="previous" name="Vorjahr" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

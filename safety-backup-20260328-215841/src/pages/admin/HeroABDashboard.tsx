/**
 * Hero A/B Test Dashboard
 * 
 * Shows performance metrics for Hero variants:
 * - Impressions, CTA clicks, Funnel starts, Lead submissions
 * - Conversion rates per variant
 * - Statistical significance indicators
 */

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line
} from 'recharts';
import {
  TrendingUp, TrendingDown, Eye, MousePointer, Target, Trophy,
  RefreshCw, Calendar, ArrowUpRight, CheckCircle2
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { de } from 'date-fns/locale';

interface VariantStats {
  variant: string;
  impressions: number;
  cta_clicks: number;
  funnel_starts: number;
  lead_submits: number;
  cta_rate: number;
  funnel_rate: number;
  conversion_rate: number;
}

interface DailyStats {
  date: string;
  variant_a_impressions: number;
  variant_b_impressions: number;
  variant_a_conversions: number;
  variant_b_conversions: number;
}

export default function HeroABDashboard() {
  const [stats, setStats] = useState<VariantStats[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30);

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Call the database function for aggregated stats
      const { data: abStats, error: abError } = await supabase
        .rpc('get_homepage_ab_stats', { p_days: dateRange });

      if (abError) throw abError;

      if (abStats) {
        setStats(abStats.map((s: any) => ({
          variant: s.flow_variant || 'Unknown',
          impressions: Number(s.impressions) || 0,
          cta_clicks: Number(s.cta_clicks) || 0,
          funnel_starts: Number(s.funnel_starts) || 0,
          lead_submits: Number(s.lead_submits) || 0,
          cta_rate: Number(s.cta_rate) || 0,
          funnel_rate: Number(s.funnel_rate) || 0,
          conversion_rate: Number(s.conversion_rate) || 0,
        })));
      }

      // Fetch daily breakdown for charts
      const startDate = subDays(new Date(), dateRange).toISOString();
      const { data: dailyData, error: dailyError } = await supabase
        .from('homepage_ab_events')
        .select('created_at, flow_variant, event_type')
        .gte('created_at', startDate)
        .order('created_at', { ascending: true });

      if (dailyError) throw dailyError;

      // Aggregate by day
      const dailyAgg: Record<string, DailyStats> = {};
      (dailyData || []).forEach((event: any) => {
        const date = format(new Date(event.created_at), 'dd.MM', { locale: de });
        if (!dailyAgg[date]) {
          dailyAgg[date] = {
            date,
            variant_a_impressions: 0,
            variant_b_impressions: 0,
            variant_a_conversions: 0,
            variant_b_conversions: 0,
          };
        }
        const isVariantA = event.flow_variant === 'A' || event.flow_variant === 'original';
        if (event.event_type === 'impression') {
          if (isVariantA) dailyAgg[date].variant_a_impressions++;
          else dailyAgg[date].variant_b_impressions++;
        }
        if (event.event_type === 'lead_submit') {
          if (isVariantA) dailyAgg[date].variant_a_conversions++;
          else dailyAgg[date].variant_b_conversions++;
        }
      });
      setDailyStats(Object.values(dailyAgg));

    } catch (error) {
      console.error('Error fetching A/B stats:', error);
    } finally {
      setLoading(false);
    }
  };

  // Find winning variant
  const winningVariant = useMemo(() => {
    if (stats.length < 2) return null;
    const sorted = [...stats].sort((a, b) => b.conversion_rate - a.conversion_rate);
    const winner = sorted[0];
    const runnerUp = sorted[1];
    const improvement = runnerUp.conversion_rate > 0 
      ? ((winner.conversion_rate - runnerUp.conversion_rate) / runnerUp.conversion_rate * 100).toFixed(1)
      : 'N/A';
    return { winner, improvement };
  }, [stats]);

  // Total metrics
  const totals = useMemo(() => ({
    impressions: stats.reduce((sum, s) => sum + s.impressions, 0),
    clicks: stats.reduce((sum, s) => sum + s.cta_clicks, 0),
    leads: stats.reduce((sum, s) => sum + s.lead_submits, 0),
  }), [stats]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Hero A/B Dashboard</h1>
            <p className="text-muted-foreground">
              Performance-Vergleich der Homepage Hero-Varianten
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={dateRange === 7 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(7)}
            >
              7 Tage
            </Button>
            <Button
              variant={dateRange === 30 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(30)}
            >
              30 Tage
            </Button>
            <Button
              variant={dateRange === 90 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(90)}
            >
              90 Tage
            </Button>
            <Button variant="ghost" size="sm" onClick={fetchStats}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Impressionen</p>
                  <p className="text-2xl font-bold">{totals.impressions.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">CTA Klicks</p>
                  <p className="text-2xl font-bold">{totals.clicks.toLocaleString()}</p>
                </div>
                <MousePointer className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Leads</p>
                  <p className="text-2xl font-bold">{totals.leads.toLocaleString()}</p>
                </div>
                <Target className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className={winningVariant ? 'border-green-500/50 bg-green-500/5' : ''}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Gewinner</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold">
                      {winningVariant?.winner.variant || '-'}
                    </p>
                    {winningVariant && (
                      <Badge variant="secondary" className="bg-green-500/20 text-green-700">
                        +{winningVariant.improvement}%
                      </Badge>
                    )}
                  </div>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Variant Comparison Table */}
        <Card>
          <CardHeader>
            <CardTitle>Varianten-Vergleich</CardTitle>
            <CardDescription>Detaillierte Metriken pro Hero-Variante</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Variante</th>
                    <th className="text-right p-3 font-medium">Impressionen</th>
                    <th className="text-right p-3 font-medium">CTA Klicks</th>
                    <th className="text-right p-3 font-medium">Funnel Starts</th>
                    <th className="text-right p-3 font-medium">Leads</th>
                    <th className="text-right p-3 font-medium">CTA Rate</th>
                    <th className="text-right p-3 font-medium">Conv. Rate</th>
                    <th className="text-center p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.map((s, i) => {
                    const isWinner = winningVariant?.winner.variant === s.variant;
                    return (
                      <tr 
                        key={s.variant} 
                        className={`border-b ${isWinner ? 'bg-green-500/5' : ''}`}
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{s.variant}</span>
                            {isWinner && <Trophy className="h-4 w-4 text-yellow-500" />}
                          </div>
                        </td>
                        <td className="text-right p-3">{s.impressions.toLocaleString()}</td>
                        <td className="text-right p-3">{s.cta_clicks.toLocaleString()}</td>
                        <td className="text-right p-3">{s.funnel_starts.toLocaleString()}</td>
                        <td className="text-right p-3 font-semibold">{s.lead_submits.toLocaleString()}</td>
                        <td className="text-right p-3">
                          <span className={s.cta_rate >= 15 ? 'text-green-600' : 'text-muted-foreground'}>
                            {s.cta_rate.toFixed(2)}%
                          </span>
                        </td>
                        <td className="text-right p-3">
                          <span className={`font-semibold ${s.conversion_rate >= 3 ? 'text-green-600' : ''}`}>
                            {s.conversion_rate.toFixed(2)}%
                          </span>
                        </td>
                        <td className="text-center p-3">
                          {isWinner ? (
                            <Badge className="bg-green-500">Führend</Badge>
                          ) : s.impressions >= 100 ? (
                            <Badge variant="outline">Aktiv</Badge>
                          ) : (
                            <Badge variant="secondary">Wenig Daten</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Charts */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList>
            <TabsTrigger value="timeline">Zeitverlauf</TabsTrigger>
            <TabsTrigger value="comparison">Raten-Vergleich</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Tägliche Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="variant_a_impressions"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Variante A Impressionen"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="variant_b_impressions"
                      stroke="hsl(var(--secondary))"
                      strokeWidth={2}
                      name="Variante B Impressionen"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="variant_a_conversions"
                      stroke="hsl(142, 76%, 36%)"
                      strokeWidth={2}
                      name="Variante A Leads"
                    />
                    <Line
                      type="monotone"
                      dataKey="variant_b_conversions"
                      stroke="hsl(38, 92%, 50%)"
                      strokeWidth={2}
                      name="Variante B Leads"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Raten Vergleich</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={stats}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="variant" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="cta_rate" fill="hsl(var(--primary))" name="CTA Rate %" />
                    <Bar dataKey="funnel_rate" fill="hsl(var(--secondary))" name="Funnel Rate %" />
                    <Bar dataKey="conversion_rate" fill="hsl(142, 76%, 36%)" name="Conv. Rate %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Empfehlungen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {winningVariant && winningVariant.winner.impressions >= 1000 && (
              <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg">
                <ArrowUpRight className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Statistisch signifikant</p>
                  <p className="text-sm text-green-700">
                    Variante {winningVariant.winner.variant} zeigt eine {winningVariant.improvement}% höhere 
                    Conversion-Rate bei {winningVariant.winner.impressions.toLocaleString()} Impressionen. 
                    Empfehlung: Als Standard aktivieren.
                  </p>
                </div>
              </div>
            )}
            {(!winningVariant || winningVariant.winner.impressions < 1000) && (
              <div className="flex items-start gap-3 p-3 bg-yellow-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">Mehr Daten benötigt</p>
                  <p className="text-sm text-yellow-700">
                    Mindestens 1'000 Impressionen pro Variante für statistische Signifikanz empfohlen.
                    Aktuell: Test weiterlaufen lassen.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

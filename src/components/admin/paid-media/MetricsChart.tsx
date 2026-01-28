/**
 * Metrics Chart Component
 * Time series visualization of paid media metrics
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart, Area } from 'recharts';
import type { PaidMediaDailyMetrics } from './types';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

interface MetricsChartProps {
  metrics: PaidMediaDailyMetrics[];
}

export function MetricsChart({ metrics }: MetricsChartProps) {
  // Aggregate by date
  const chartData = useMemo(() => {
    const byDate = new Map<string, {
      date: string;
      cost: number;
      impressions: number;
      clicks: number;
      conversions: number;
      value: number;
    }>();

    metrics.forEach(m => {
      const existing = byDate.get(m.date) || {
        date: m.date,
        cost: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        value: 0,
      };

      byDate.set(m.date, {
        date: m.date,
        cost: existing.cost + (m.cost_chf || 0),
        impressions: existing.impressions + (m.impressions || 0),
        clicks: existing.clicks + (m.clicks || 0),
        conversions: existing.conversions + (m.conversions || 0),
        value: existing.value + (m.conversion_value_chf || 0),
      });
    });

    return Array.from(byDate.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(d => ({
        ...d,
        displayDate: format(parseISO(d.date), 'dd.MM', { locale: de }),
        cpl: d.conversions > 0 ? d.cost / d.conversions : 0,
        roas: d.cost > 0 ? d.value / d.cost : 0,
        ctr: d.impressions > 0 ? (d.clicks / d.impressions) * 100 : 0,
      }));
  }, [metrics]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Noch keine Daten für die Visualisierung verfügbar.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Spend & Conversions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ausgaben & Conversions</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="displayDate" className="text-xs" />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-xs" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number, name: string) => {
                  if (name === 'cost') return [`CHF ${value.toFixed(2)}`, 'Kosten'];
                  if (name === 'conversions') return [value, 'Conversions'];
                  return [value, name];
                }}
              />
              <Legend />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="cost" 
                name="Kosten"
                fill="hsl(var(--primary))" 
                fillOpacity={0.2}
                stroke="hsl(var(--primary))"
              />
              <Bar 
                yAxisId="right"
                dataKey="conversions" 
                name="Conversions"
                fill="hsl(var(--chart-2))" 
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CPL Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">CPL Trend (Kill Switch: CHF 90)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="displayDate" className="text-xs" />
              <YAxis className="text-xs" domain={[0, 'auto']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`CHF ${value.toFixed(2)}`, 'CPL']}
              />
              {/* Kill Switch Line */}
              <Line
                type="monotone"
                dataKey={() => 90}
                stroke="hsl(var(--destructive))"
                strokeDasharray="5 5"
                dot={false}
                name="Kill Switch"
              />
              {/* Warning Line */}
              <Line
                type="monotone"
                dataKey={() => 60}
                stroke="orange"
                strokeDasharray="5 5"
                dot={false}
                name="Warnung"
              />
              {/* Target Line */}
              <Line
                type="monotone"
                dataKey={() => 45}
                stroke="hsl(var(--chart-2))"
                strokeDasharray="5 5"
                dot={false}
                name="Ziel"
              />
              <Line 
                type="monotone" 
                dataKey="cpl" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                name="CPL"
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ROAS Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">ROAS Trend (Ziel: 4x)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="displayDate" className="text-xs" />
              <YAxis className="text-xs" domain={[0, 'auto']} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value.toFixed(2)}x`, 'ROAS']}
              />
              {/* Target Line */}
              <Line
                type="monotone"
                dataKey={() => 4}
                stroke="hsl(var(--chart-2))"
                strokeDasharray="5 5"
                dot={false}
                name="Ziel (4x)"
              />
              <Line 
                type="monotone" 
                dataKey="roas" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-3))' }}
                name="ROAS"
              />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* CTR & Clicks */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">CTR & Klicks</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="displayDate" className="text-xs" />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-xs" unit="%" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="clicks" 
                name="Klicks"
                fill="hsl(var(--chart-4))" 
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="ctr" 
                name="CTR %"
                stroke="hsl(var(--chart-5))" 
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Weekly Summary Module
 * Automated report generation
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, FileText, Download, Mail, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';
import { de } from 'date-fns/locale';

interface WeeklyReport {
  weekNumber: number;
  startDate: Date;
  endDate: Date;
  revenue: number;
  jobs: number;
  leads: number;
  avgMargin: number;
  adSpend: number;
  roas: number;
  highlights: string[];
  warnings: string[];
  actionItems: string[];
}

export function WeeklySummaryModule() {
  const now = new Date();
  
  // Mock weekly reports
  const reports: WeeklyReport[] = [
    {
      weekNumber: 5,
      startDate: startOfWeek(now, { weekStartsOn: 1 }),
      endDate: endOfWeek(now, { weekStartsOn: 1 }),
      revenue: 11200,
      jobs: 7,
      leads: 23,
      avgMargin: 29,
      adSpend: 1425,
      roas: 7.9,
      highlights: ['Beste Woche seit Q4', 'Feierabend: 3 Premium-Jobs'],
      warnings: [],
      actionItems: ['Google Ads Budget um 20% erhöhen'],
    },
    {
      weekNumber: 4,
      startDate: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
      endDate: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
      revenue: 9800,
      jobs: 6,
      leads: 19,
      avgMargin: 27,
      adSpend: 1380,
      roas: 7.1,
      highlights: ['CPL unter CHF 50 gehalten'],
      warnings: ['Umzugexpress: Close Rate unter 30%'],
      actionItems: ['Sales-Skript für Express überarbeiten'],
    },
    {
      weekNumber: 3,
      startDate: startOfWeek(subWeeks(now, 2), { weekStartsOn: 1 }),
      endDate: endOfWeek(subWeeks(now, 2), { weekStartsOn: 1 }),
      revenue: 8500,
      jobs: 5,
      leads: 16,
      avgMargin: 25,
      adSpend: 1200,
      roas: 7.1,
      highlights: [],
      warnings: ['Margin unter 28% Ziel', 'Weniger Leads als geplant'],
      actionItems: ['Keyword-Optimierung', 'Landing Page A/B Test starten'],
    },
  ];

  const [selectedWeek, setSelectedWeek] = useState(reports[0]);

  return (
    <div className="space-y-6">
      {/* Week Selector */}
      <div className="flex items-center gap-4">
        <Calendar className="h-5 w-5 text-muted-foreground" />
        <div className="flex gap-2">
          {reports.map((report) => (
            <Button
              key={report.weekNumber}
              variant={selectedWeek.weekNumber === report.weekNumber ? 'default' : 'outline'}
              onClick={() => setSelectedWeek(report)}
            >
              KW {report.weekNumber}
            </Button>
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            PDF Export
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Per E-Mail senden
          </Button>
        </div>
      </div>

      {/* Report Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                Wochenbericht KW {selectedWeek.weekNumber}
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                {format(selectedWeek.startDate, 'dd. MMMM', { locale: de })} - {format(selectedWeek.endDate, 'dd. MMMM yyyy', { locale: de })}
              </p>
            </div>
            <Badge 
              variant={selectedWeek.warnings.length === 0 ? 'default' : 'secondary'}
              className="text-lg px-4 py-2"
            >
              {selectedWeek.warnings.length === 0 ? '✓ Ziele erreicht' : `${selectedWeek.warnings.length} Warnung(en)`}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <KPICard label="Revenue" value={`CHF ${selectedWeek.revenue.toLocaleString('de-CH')}`} />
        <KPICard label="Jobs" value={selectedWeek.jobs.toString()} />
        <KPICard label="Leads" value={selectedWeek.leads.toString()} />
        <KPICard label="Ø Margin" value={`${selectedWeek.avgMargin}%`} status={selectedWeek.avgMargin >= 28 ? 'good' : 'warning'} />
        <KPICard label="Ad Spend" value={`CHF ${selectedWeek.adSpend.toLocaleString('de-CH')}`} />
        <KPICard label="ROAS" value={`${selectedWeek.roas.toFixed(1)}x`} status={selectedWeek.roas >= 4 ? 'good' : 'warning'} />
      </div>

      {/* Details */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedWeek.highlights.length > 0 ? (
              <ul className="space-y-2">
                {selectedWeek.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Keine besonderen Highlights diese Woche</p>
            )}
          </CardContent>
        </Card>

        {/* Warnings */}
        <Card className={selectedWeek.warnings.length > 0 ? 'border-yellow-500' : ''}>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className={`h-5 w-5 ${selectedWeek.warnings.length > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
              Warnungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedWeek.warnings.length > 0 ? (
              <ul className="space-y-2">
                {selectedWeek.warnings.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <TrendingDown className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Keine Warnungen - alles im grünen Bereich!</p>
            )}
          </CardContent>
        </Card>

        {/* Action Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Action Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedWeek.actionItems.length > 0 ? (
              <ul className="space-y-2">
                {selectedWeek.actionItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <input type="checkbox" className="mt-1" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Keine offenen Action Items</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Week-over-Week Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Woche-über-Woche Vergleich</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Metrik</th>
                  {reports.map((r) => (
                    <th key={r.weekNumber} className="text-right py-2">KW {r.weekNumber}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Revenue</td>
                  {reports.map((r) => (
                    <td key={r.weekNumber} className="text-right py-2">CHF {r.revenue.toLocaleString('de-CH')}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Jobs</td>
                  {reports.map((r) => (
                    <td key={r.weekNumber} className="text-right py-2">{r.jobs}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Leads</td>
                  {reports.map((r) => (
                    <td key={r.weekNumber} className="text-right py-2">{r.leads}</td>
                  ))}
                </tr>
                <tr className="border-b">
                  <td className="py-2">Margin</td>
                  {reports.map((r) => (
                    <td key={r.weekNumber} className={`text-right py-2 ${r.avgMargin >= 28 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {r.avgMargin}%
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2">ROAS</td>
                  {reports.map((r) => (
                    <td key={r.weekNumber} className="text-right py-2">{r.roas.toFixed(1)}x</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KPICard({ label, value, status }: { label: string; value: string; status?: 'good' | 'warning' | 'bad' }) {
  return (
    <Card className={
      status === 'good' ? 'border-green-500/50' :
      status === 'warning' ? 'border-yellow-500/50' :
      status === 'bad' ? 'border-destructive/50' : ''
    }>
      <CardContent className="pt-4 text-center">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-xl font-bold ${
          status === 'good' ? 'text-green-600' :
          status === 'warning' ? 'text-yellow-600' :
          status === 'bad' ? 'text-destructive' : ''
        }`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

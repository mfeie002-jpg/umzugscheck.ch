/**
 * Paid Media Dashboard
 * Real-time monitoring of Google Ads, Meta Ads, etc.
 * Includes Kill Switch monitoring from memory/strategy
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MousePointer, 
  Eye, 
  Target,
  AlertTriangle,
  RefreshCw,
  Upload,
  Zap,
  BarChart3,
  Calendar,
  AlertOctagon
} from 'lucide-react';
import type { 
  PaidMediaCampaign, 
  PaidMediaDailyMetrics, 
  PaidMediaAlert,
  AggregatedMetrics,
  KillSwitchStatus 
} from './types';
import { ManualDataImport } from './ManualDataImport';
import { CampaignTable } from './CampaignTable';
import { MetricsChart } from './MetricsChart';
import { AlertsPanel } from './AlertsPanel';

export function PaidMediaDashboard() {
  const [campaigns, setCampaigns] = useState<PaidMediaCampaign[]>([]);
  const [metrics, setMetrics] = useState<PaidMediaDailyMetrics[]>([]);
  const [alerts, setAlerts] = useState<PaidMediaAlert[]>([]);
  const [aggregated, setAggregated] = useState<AggregatedMetrics | null>(null);
  const [killSwitch, setKillSwitch] = useState<KillSwitchStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const daysAgo = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Fetch campaigns
      const { data: campaignsData } = await supabase
        .from('paid_media_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      setCampaigns((campaignsData as PaidMediaCampaign[]) || []);

      // Fetch metrics
      const { data: metricsData } = await supabase
        .from('paid_media_daily_metrics')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date', { ascending: false });

      setMetrics((metricsData as PaidMediaDailyMetrics[]) || []);

      // Calculate aggregated metrics
      if (metricsData && metricsData.length > 0) {
        const agg = calculateAggregatedMetrics(metricsData as PaidMediaDailyMetrics[]);
        setAggregated(agg);
        
        // Determine kill switch status
        setKillSwitch(determineKillSwitchStatus(agg.avgCPL));
      }

      // Fetch alerts
      const { data: alertsData } = await supabase
        .from('paid_media_alerts')
        .select('*')
        .eq('is_acknowledged', false)
        .order('created_at', { ascending: false });

      setAlerts((alertsData as PaidMediaAlert[]) || []);

    } catch (error) {
      console.error('Error fetching paid media data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAggregatedMetrics = (data: PaidMediaDailyMetrics[]): AggregatedMetrics => {
    const totalSpend = data.reduce((sum, d) => sum + (d.cost_chf || 0), 0);
    const totalImpressions = data.reduce((sum, d) => sum + (d.impressions || 0), 0);
    const totalClicks = data.reduce((sum, d) => sum + (d.clicks || 0), 0);
    const totalConversions = data.reduce((sum, d) => sum + (d.conversions || 0), 0);
    const totalConversionValue = data.reduce((sum, d) => sum + (d.conversion_value_chf || 0), 0);

    return {
      totalSpend,
      totalImpressions,
      totalClicks,
      totalConversions,
      totalConversionValue,
      avgCTR: totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0,
      avgCPC: totalClicks > 0 ? totalSpend / totalClicks : 0,
      avgCPL: totalConversions > 0 ? totalSpend / totalConversions : 0,
      avgROAS: totalSpend > 0 ? totalConversionValue / totalSpend : 0,
    };
  };

  const determineKillSwitchStatus = (avgCPL: number): KillSwitchStatus => {
    // Based on memory/strategy/paid-media-guardrails-kill-switches
    if (avgCPL > 90) {
      return {
        cplStatus: 'critical',
        currentCPL: avgCPL,
        threshold: 90,
        message: '🚨 KILL SWITCH: CPL > CHF 90 - ADS SOFORT PAUSIEREN!'
      };
    } else if (avgCPL > 60) {
      return {
        cplStatus: 'warning',
        currentCPL: avgCPL,
        threshold: 60,
        message: '⚠️ Warnung: CPL steigt - Kampagnen optimieren'
      };
    }
    return {
      cplStatus: 'ok',
      currentCPL: avgCPL,
      threshold: 45,
      message: '✅ CPL im Zielbereich'
    };
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-paid-media', {
        body: { platform: 'google_ads', action: 'sync' }
      });

      if (error) throw error;

      toast({
        title: 'Sync erfolgreich',
        description: `${data.records_synced} Datensätze synchronisiert`,
      });

      fetchData();
    } catch (error) {
      toast({
        title: 'Sync fehlgeschlagen',
        description: error instanceof Error ? error.message : 'Unbekannter Fehler',
        variant: 'destructive',
      });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Kill Switch Alert */}
      {killSwitch && killSwitch.cplStatus !== 'ok' && (
        <Card className={`border-2 ${
          killSwitch.cplStatus === 'critical' 
            ? 'border-destructive bg-destructive/10' 
            : 'border-yellow-500 bg-yellow-500/10'
        }`}>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <AlertOctagon className={`h-10 w-10 ${
                killSwitch.cplStatus === 'critical' ? 'text-destructive' : 'text-yellow-500'
              }`} />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{killSwitch.message}</h3>
                <p className="text-sm text-muted-foreground">
                  Aktueller CPL: CHF {killSwitch.currentCPL.toFixed(2)} | Schwellwert: CHF {killSwitch.threshold}
                </p>
              </div>
              {killSwitch.cplStatus === 'critical' && (
                <Button variant="destructive" size="lg">
                  Ads pausieren
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Paid Media Dashboard
          </h2>
          <p className="text-muted-foreground">
            ROI Tracking & Kill Switch Monitoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={dateRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDateRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
          <Button onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Sync...' : 'Sync'}
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {aggregated && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <MetricCard
            title="Ausgaben"
            value={`CHF ${aggregated.totalSpend.toLocaleString('de-CH', { minimumFractionDigits: 2 })}`}
            icon={DollarSign}
            trend={null}
          />
          <MetricCard
            title="Impressions"
            value={aggregated.totalImpressions.toLocaleString('de-CH')}
            icon={Eye}
            trend={null}
          />
          <MetricCard
            title="Klicks"
            value={aggregated.totalClicks.toLocaleString('de-CH')}
            icon={MousePointer}
            subValue={`CTR: ${aggregated.avgCTR.toFixed(2)}%`}
          />
          <MetricCard
            title="Conversions"
            value={aggregated.totalConversions.toLocaleString('de-CH')}
            icon={Target}
            subValue={`CPA: CHF ${aggregated.avgCPL.toFixed(2)}`}
          />
          <MetricCard
            title="CPL (Ø)"
            value={`CHF ${aggregated.avgCPL.toFixed(2)}`}
            icon={TrendingDown}
            status={
              aggregated.avgCPL > 90 ? 'critical' : 
              aggregated.avgCPL > 60 ? 'warning' : 'ok'
            }
          />
          <MetricCard
            title="ROAS"
            value={`${aggregated.avgROAS.toFixed(2)}x`}
            icon={TrendingUp}
            status={aggregated.avgROAS >= 4 ? 'ok' : aggregated.avgROAS >= 2 ? 'warning' : 'critical'}
          />
        </div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="campaigns">Kampagnen</TabsTrigger>
          <TabsTrigger value="import">Daten Import</TabsTrigger>
          <TabsTrigger value="alerts" className="relative">
            Alerts
            {alerts.length > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {alerts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <MetricsChart metrics={metrics} />
        </TabsContent>

        <TabsContent value="campaigns" className="mt-6">
          <CampaignTable campaigns={campaigns} metrics={metrics} />
        </TabsContent>

        <TabsContent value="import" className="mt-6">
          <ManualDataImport onImportComplete={fetchData} />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <AlertsPanel alerts={alerts} onRefresh={fetchData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: 'up' | 'down' | null;
  subValue?: string;
  status?: 'ok' | 'warning' | 'critical';
}

function MetricCard({ title, value, icon: Icon, trend, subValue, status }: MetricCardProps) {
  return (
    <Card className={
      status === 'critical' ? 'border-destructive' :
      status === 'warning' ? 'border-yellow-500' :
      status === 'ok' ? 'border-green-500' : ''
    }>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">{title}</span>
          <Icon className={`h-4 w-4 ${
            status === 'critical' ? 'text-destructive' :
            status === 'warning' ? 'text-yellow-500' :
            status === 'ok' ? 'text-green-500' : 'text-muted-foreground'
          }`} />
        </div>
        <p className="text-xl font-bold">{value}</p>
        {subValue && (
          <p className="text-xs text-muted-foreground mt-1">{subValue}</p>
        )}
      </CardContent>
    </Card>
  );
}

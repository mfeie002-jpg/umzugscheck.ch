/**
 * Executive Snapshot - Daily KPI Cards
 */

import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatSwissCHF, formatSwissPercent } from '@/lib/swiss-number-format';
import type { ExecutiveKPIs } from './types';

interface ExecutiveSnapshotProps {
  kpis: ExecutiveKPIs;
  period: '7d' | '30d';
  onPeriodChange: (period: '7d' | '30d') => void;
}

interface MetricCardProps {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  status?: 'good' | 'warning' | 'bad' | 'neutral';
  subtext?: string;
}

function MetricCard({ label, value, trend, status = 'neutral', subtext }: MetricCardProps) {
  const statusColors = {
    good: 'border-green-500/50 bg-green-500/5',
    warning: 'border-yellow-500/50 bg-yellow-500/5',
    bad: 'border-red-500/50 bg-red-500/5',
    neutral: 'border-border',
  };
  
  return (
    <Card className={`${statusColors[status]} border`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">{label}</span>
          {trend && (
            trend === 'up' ? <TrendingUp className="h-3 w-3 text-green-500" /> :
            trend === 'down' ? <TrendingDown className="h-3 w-3 text-red-500" /> : null
          )}
        </div>
        <p className="text-xl font-bold font-mono mt-1">{value}</p>
        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </CardContent>
    </Card>
  );
}

export function ExecutiveSnapshot({ kpis, period, onPeriodChange }: ExecutiveSnapshotProps) {
  const revenue = period === '7d' ? kpis.revenue7d : kpis.revenue30d;
  const cm2 = period === '7d' ? kpis.cm2_7d : kpis.cm2_30d;
  const cm2Percent = period === '7d' ? kpis.cm2Percent7d : kpis.cm2Percent30d;
  const jobs = period === '7d' ? kpis.jobsCompleted7d : kpis.jobsCompleted30d;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Executive Snapshot</h3>
        <Tabs value={period} onValueChange={(v) => onPeriodChange(v as '7d' | '30d')}>
          <TabsList className="h-7">
            <TabsTrigger value="7d" className="text-xs px-2 h-5">7d</TabsTrigger>
            <TabsTrigger value="30d" className="text-xs px-2 h-5">30d</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
        <MetricCard
          label="Revenue"
          value={formatSwissCHF(revenue)}
          status={revenue > 30000 ? 'good' : revenue > 15000 ? 'warning' : 'bad'}
        />
        <MetricCard
          label="CM2"
          value={formatSwissCHF(cm2)}
          subtext={formatSwissPercent(cm2Percent)}
          status={cm2Percent >= 25 ? 'good' : cm2Percent >= 15 ? 'warning' : 'bad'}
        />
        <MetricCard
          label="Blended CAC"
          value={formatSwissCHF(kpis.blendedCAC)}
          status={kpis.blendedCAC < 80 ? 'good' : kpis.blendedCAC < 120 ? 'warning' : 'bad'}
        />
        <MetricCard
          label="Avg AOV"
          value={formatSwissCHF(kpis.avgAOV)}
          status={kpis.avgAOV >= 2500 ? 'good' : kpis.avgAOV >= 2000 ? 'warning' : 'bad'}
        />
        <MetricCard
          label="Jobs"
          value={jobs.toString()}
          status={jobs >= 8 ? 'good' : jobs >= 4 ? 'warning' : 'bad'}
        />
        <MetricCard
          label="Marketplace"
          value={formatSwissCHF(kpis.marketplaceNetMargin)}
          status={kpis.marketplaceNetMargin > 0 ? 'good' : 'bad'}
        />
        <MetricCard
          label="Claims"
          value={formatSwissPercent(kpis.claimsRatePercent)}
          status={kpis.claimsRatePercent <= 2 ? 'good' : kpis.claimsRatePercent <= 5 ? 'warning' : 'bad'}
        />
        <MetricCard
          label="Disputes"
          value={formatSwissPercent(kpis.partnerDisputeRatePercent)}
          status={kpis.partnerDisputeRatePercent <= 5 ? 'good' : kpis.partnerDisputeRatePercent <= 10 ? 'warning' : 'bad'}
        />
      </div>
    </div>
  );
}

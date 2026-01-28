/**
 * Finance KPI Cards - Top Health Indicators
 */

import { TrendingUp, TrendingDown, DollarSign, Percent, Calendar, AlertTriangle, Clock, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatSwissCHF, formatSwissPercent } from '@/lib/swiss-number-format';
import type { FinanceKPIs, HealthStatus } from './types';

interface FinanceKPICardsProps {
  kpis: FinanceKPIs;
  period: '7d' | '30d';
}

interface KPICardProps {
  label: string;
  value: string;
  status: HealthStatus;
  icon: React.ReactNode;
  subtext?: string;
}

function getStatusColor(status: HealthStatus): string {
  switch (status) {
    case 'green': return 'bg-green-500/10 border-green-500 text-green-700';
    case 'yellow': return 'bg-yellow-500/10 border-yellow-500 text-yellow-700';
    case 'red': return 'bg-red-500/10 border-red-500 text-red-700';
  }
}

function getStatusBadge(status: HealthStatus): { label: string; className: string } {
  switch (status) {
    case 'green': return { label: 'Healthy', className: 'bg-green-500 text-white' };
    case 'yellow': return { label: 'Caution', className: 'bg-yellow-500 text-black' };
    case 'red': return { label: 'Critical', className: 'bg-red-500 text-white' };
  }
}

function KPICard({ label, value, status, icon, subtext }: KPICardProps) {
  const badge = getStatusBadge(status);
  
  return (
    <Card className={`border-2 ${getStatusColor(status)}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <span className="text-xs font-medium">{label}</span>
          </div>
          <Badge className={badge.className}>{badge.label}</Badge>
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
        {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
      </CardContent>
    </Card>
  );
}

export function FinanceKPICards({ kpis, period }: FinanceKPICardsProps) {
  const revenue = period === '7d' ? kpis.totalRevenue7d : kpis.totalRevenue30d;
  const cm2 = period === '7d' ? kpis.cm2_7d : kpis.cm2_30d;
  const cm2Percent = period === '7d' ? kpis.cm2Percent7d : kpis.cm2Percent30d;
  
  // Status logic
  const revenueStatus: HealthStatus = revenue > 50000 ? 'green' : revenue > 20000 ? 'yellow' : 'red';
  const cm2Status: HealthStatus = cm2Percent >= 25 ? 'green' : cm2Percent >= 15 ? 'yellow' : 'red';
  const cacStatus: HealthStatus = kpis.blendedCAC < 80 ? 'green' : kpis.blendedCAC < 120 ? 'yellow' : 'red';
  const aovStatus: HealthStatus = kpis.avgAOV >= 2500 ? 'green' : kpis.avgAOV >= 2000 ? 'yellow' : 'red';
  const utilizationStatus: HealthStatus = kpis.utilizationRate >= 70 ? 'green' : kpis.utilizationRate >= 50 ? 'yellow' : 'red';
  const claimsStatus: HealthStatus = kpis.claimsRate <= 2 ? 'green' : kpis.claimsRate <= 5 ? 'yellow' : 'red';
  const marketplaceStatus: HealthStatus = kpis.marketplaceNetMargin > 0 ? 'green' : kpis.marketplaceNetMargin > -1000 ? 'yellow' : 'red';
  const runwayStatus: HealthStatus = kpis.cashRunwayMonths >= 6 ? 'green' : kpis.cashRunwayMonths >= 2 ? 'yellow' : 'red';
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KPICard
        label="Total Revenue"
        value={formatSwissCHF(revenue)}
        status={revenueStatus}
        icon={<DollarSign className="h-4 w-4" />}
        subtext={`Last ${period === '7d' ? '7' : '30'} days`}
      />
      <KPICard
        label="Contribution Margin II"
        value={formatSwissCHF(cm2)}
        status={cm2Status}
        icon={<TrendingUp className="h-4 w-4" />}
        subtext={`${formatSwissPercent(cm2Percent)} of revenue`}
      />
      <KPICard
        label="Blended CAC"
        value={formatSwissCHF(kpis.blendedCAC)}
        status={cacStatus}
        icon={<ShoppingCart className="h-4 w-4" />}
        subtext="Cost per acquired customer"
      />
      <KPICard
        label="Avg AOV"
        value={formatSwissCHF(kpis.avgAOV)}
        status={aovStatus}
        icon={<DollarSign className="h-4 w-4" />}
        subtext="Average order value"
      />
      <KPICard
        label="Utilization Rate"
        value={formatSwissPercent(kpis.utilizationRate)}
        status={utilizationStatus}
        icon={<Calendar className="h-4 w-4" />}
        subtext="Booked / Available"
      />
      <KPICard
        label="Claims Rate"
        value={formatSwissPercent(kpis.claimsRate)}
        status={claimsStatus}
        icon={<AlertTriangle className="h-4 w-4" />}
        subtext="% of revenue"
      />
      <KPICard
        label="Marketplace Net Margin"
        value={formatSwissCHF(kpis.marketplaceNetMargin)}
        status={marketplaceStatus}
        icon={kpis.marketplaceNetMargin >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
      />
      <KPICard
        label="Cash Runway"
        value={`${kpis.cashRunwayMonths.toFixed(1)} Mo.`}
        status={runwayStatus}
        icon={<Clock className="h-4 w-4" />}
        subtext="Months remaining"
      />
    </div>
  );
}

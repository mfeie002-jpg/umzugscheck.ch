/**
 * Kill Switch Panel - Auto-triggered alerts
 */

import { AlertTriangle, XCircle, Pause, Shield, DollarSign, Users, Truck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { formatSwissCHF, formatSwissPercent } from '@/lib/swiss-number-format';
import type { LaunchKPIs, KillSwitch } from './types';

interface KillSwitchPanelProps {
  kpis: LaunchKPIs;
}

export function KillSwitchPanel({ kpis }: KillSwitchPanelProps) {
  const killSwitches: KillSwitch[] = [
    {
      id: 'pause_ads',
      name: 'PAUSE ADS',
      condition: 'Blended CPL > CHF 90 (7-day avg)',
      threshold: 90,
      currentValue: kpis.blendedCPL7Day,
      triggered: kpis.blendedCPL7Day > 90,
      action: 'Immediately pause all Google Ads',
      severity: 'critical',
    },
    {
      id: 'stop_ops',
      name: 'STOP OPS',
      condition: 'Claims rate > 5% of revenue',
      threshold: 5,
      currentValue: kpis.claimRatePercent,
      triggered: kpis.claimRatePercent > 5,
      action: 'Stop operations, retrain crew',
      severity: 'critical',
    },
    {
      id: 'suspend_partners',
      name: 'SUSPEND PARTNERS',
      condition: 'Partner refund rate > 15%',
      threshold: 15,
      currentValue: kpis.partnerRefundRate,
      triggered: kpis.partnerRefundRate > 15,
      action: 'Suspend marketplace, audit lead quality',
      severity: 'critical',
    },
    {
      id: 'cash_emergency',
      name: 'CASH EMERGENCY',
      condition: 'Cash reserve < 1 month opex',
      threshold: 1,
      currentValue: kpis.cashReserveMonths,
      triggered: kpis.cashReserveMonths < 1,
      action: 'Emergency capital call or liquidation',
      severity: 'critical',
    },
  ];
  
  const triggeredCount = killSwitches.filter(ks => ks.triggered).length;
  
  return (
    <Card className={triggeredCount > 0 ? 'border-red-500 border-2' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Kill Switches
          </CardTitle>
          {triggeredCount > 0 ? (
            <Badge variant="destructive" className="animate-pulse">
              {triggeredCount} TRIGGERED
            </Badge>
          ) : (
            <Badge variant="outline" className="text-green-600 border-green-600">
              ALL CLEAR
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {killSwitches.map((ks) => (
          <KillSwitchRow key={ks.id} killSwitch={ks} />
        ))}
      </CardContent>
    </Card>
  );
}

function KillSwitchRow({ killSwitch }: { killSwitch: KillSwitch }) {
  const { name, condition, threshold, currentValue, triggered, action, id } = killSwitch;
  
  // Calculate progress (inverse for cash reserve)
  const isInverse = id === 'cash_emergency';
  const progress = isInverse 
    ? Math.min(100, (currentValue / (threshold * 3)) * 100)
    : Math.min(100, (currentValue / threshold) * 100);
  
  const formatValue = (val: number) => {
    if (id === 'pause_ads') return formatSwissCHF(val);
    if (id === 'cash_emergency') return `${val.toFixed(1)} Mo.`;
    return `${val.toFixed(1)}%`;
  };
  
  return (
    <div className={`p-3 rounded-lg border ${triggered ? 'bg-red-500/10 border-red-500' : 'bg-muted/50'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {triggered ? (
            <XCircle className="h-4 w-4 text-red-500" />
          ) : (
            <div className="h-4 w-4 rounded-full bg-green-500" />
          )}
          <span className="font-mono font-bold text-sm">{name}</span>
        </div>
        <Badge variant={triggered ? 'destructive' : 'outline'} className="text-xs">
          {formatValue(currentValue)} / {formatValue(threshold)}
        </Badge>
      </div>
      
      <Progress 
        value={progress} 
        className={`h-1.5 mb-2 ${triggered ? '[&>div]:bg-red-500' : ''}`}
      />
      
      <p className="text-xs text-muted-foreground">{condition}</p>
      
      {triggered && (
        <div className="mt-2 p-2 bg-red-500/20 rounded text-xs font-medium text-red-700 dark:text-red-300">
          ⚡ ACTION: {action}
        </div>
      )}
    </div>
  );
}

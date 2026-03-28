/**
 * Kill Switches & Guardrails Panel
 */

import { Shield, XCircle, AlertTriangle, Pause } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { formatSwissCHF, formatSwissPercent } from '@/lib/swiss-number-format';

interface KillSwitchAlertsProps {
  blendedCPL7d: number;
  cm2Percent: number;
  claimsRatePercent: number;
  cashRunwayMonths: number;
  resaleRate: number;
  partnerDisputePercent: number;
  fillRatePercent: number;
}

interface KillSwitch {
  id: string;
  name: string;
  condition: string;
  triggered: boolean;
  type: 'ads' | 'marketplace';
  action: string;
}

export function KillSwitchAlerts({
  blendedCPL7d,
  cm2Percent,
  claimsRatePercent,
  cashRunwayMonths,
  resaleRate,
  partnerDisputePercent,
  fillRatePercent,
}: KillSwitchAlertsProps) {
  const killSwitches: KillSwitch[] = [
    {
      id: 'cpl',
      name: 'PAUSE ADS',
      condition: `Blended CPL > CHF 90 (Current: ${formatSwissCHF(blendedCPL7d)})`,
      triggered: blendedCPL7d > 90,
      type: 'ads',
      action: 'Immediately pause all Google Ads',
    },
    {
      id: 'cm2',
      name: 'PAUSE ADS',
      condition: `CM2 < 20% for last 5 jobs (Current: ${formatSwissPercent(cm2Percent)})`,
      triggered: cm2Percent < 20,
      type: 'ads',
      action: 'Review pricing and COGS',
    },
    {
      id: 'claims',
      name: 'PAUSE ADS',
      condition: `Claims > 5% revenue (Current: ${formatSwissPercent(claimsRatePercent)})`,
      triggered: claimsRatePercent > 5,
      type: 'ads',
      action: 'Stop ops, retrain crew',
    },
    {
      id: 'runway',
      name: 'EMERGENCY',
      condition: `Cash runway < 1 month (Current: ${cashRunwayMonths.toFixed(1)} Mo.)`,
      triggered: cashRunwayMonths < 1,
      type: 'ads',
      action: 'Emergency capital call',
    },
    {
      id: 'resale',
      name: 'PAUSE MARKETPLACE',
      condition: `Resale rate < 1.5 (Current: ${resaleRate.toFixed(2)}x)`,
      triggered: resaleRate < 1.5,
      type: 'marketplace',
      action: 'Improve lead quality or lower price',
    },
    {
      id: 'disputes',
      name: 'PAUSE MARKETPLACE',
      condition: `Partner disputes > 15% (Current: ${formatSwissPercent(partnerDisputePercent)})`,
      triggered: partnerDisputePercent > 15,
      type: 'marketplace',
      action: 'Audit partner quality, pause bad actors',
    },
    {
      id: 'fill',
      name: 'PAUSE MARKETPLACE',
      condition: `Fill rate < 70% (Current: ${formatSwissPercent(fillRatePercent)})`,
      triggered: fillRatePercent < 70,
      type: 'marketplace',
      action: 'Onboard more partners or lower price',
    },
  ];
  
  const triggeredAds = killSwitches.filter(k => k.triggered && k.type === 'ads');
  const triggeredMarketplace = killSwitches.filter(k => k.triggered && k.type === 'marketplace');
  const allTriggered = [...triggeredAds, ...triggeredMarketplace];
  
  if (allTriggered.length === 0) {
    return (
      <div className="flex items-center gap-2 p-2 rounded border border-green-500 bg-green-500/10">
        <Shield className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium text-green-700">All Kill Switches Clear</span>
        <Badge variant="outline" className="text-green-600 border-green-600 text-xs ml-auto">
          0 / {killSwitches.length} triggered
        </Badge>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {/* Ads Kill Switches */}
      {triggeredAds.length > 0 && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            🚨 AUTO-PAUSE ADS
            <Badge variant="destructive" className="text-xs animate-pulse">{triggeredAds.length} ACTIVE</Badge>
          </AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1 text-sm">
              {triggeredAds.map(k => (
                <li key={k.id} className="flex items-center gap-2">
                  <Pause className="h-3 w-3" />
                  <span>{k.condition}</span>
                  <span className="text-muted-foreground">→ {k.action}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Marketplace Kill Switches */}
      {triggeredMarketplace.length > 0 && (
        <Alert className="border-yellow-500 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="flex items-center gap-2 text-yellow-700">
            ⚠️ MARKETPLACE WARNING
            <Badge className="bg-yellow-500 text-black text-xs">{triggeredMarketplace.length} ACTIVE</Badge>
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            <ul className="mt-2 space-y-1 text-sm">
              {triggeredMarketplace.map(k => (
                <li key={k.id} className="flex items-center gap-2">
                  <AlertTriangle className="h-3 w-3" />
                  <span>{k.condition}</span>
                  <span className="opacity-75">→ {k.action}</span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

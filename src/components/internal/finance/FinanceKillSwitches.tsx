/**
 * Finance Kill Switches - Auto alerts and warnings
 */

import { XCircle, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { KillSwitchAlert, FinanceKPIs, FinanceInputs } from './types';

interface FinanceKillSwitchesProps {
  kpis: FinanceKPIs;
  inputs: FinanceInputs;
}

export function FinanceKillSwitches({ kpis, inputs }: FinanceKillSwitchesProps) {
  const alerts: KillSwitchAlert[] = [];
  
  // Critical kill switches
  if (kpis.blendedCAC > 90) {
    alerts.push({
      id: 'cpl-high',
      type: 'critical',
      condition: 'Blended CPL > CHF 90',
      message: `Aktuell: CHF ${kpis.blendedCAC.toFixed(0)} – Ads sofort pausieren!`,
      triggered: true,
    });
  }
  
  if (kpis.cm2Percent30d < 20) {
    alerts.push({
      id: 'cm2-low',
      type: 'critical',
      condition: 'CM2 < 20% (30d)',
      message: `Aktuell: ${kpis.cm2Percent30d.toFixed(1)}% – Marge kritisch!`,
      triggered: true,
    });
  }
  
  if (kpis.claimsRate > 5) {
    alerts.push({
      id: 'claims-high',
      type: 'critical',
      condition: 'Claims > 5% of Revenue',
      message: `Aktuell: ${kpis.claimsRate.toFixed(1)}% – Ops stoppen & Crew retrainieren!`,
      triggered: true,
    });
  }
  
  if (kpis.cashRunwayMonths < 1) {
    alerts.push({
      id: 'runway-critical',
      type: 'critical',
      condition: 'Cash Runway < 1 Monat',
      message: `Aktuell: ${kpis.cashRunwayMonths.toFixed(1)} Monate – Notfall-Kapitalbeschaffung!`,
      triggered: true,
    });
  }
  
  // Warnings
  if (kpis.utilizationRate < 60) {
    alerts.push({
      id: 'util-low',
      type: 'warning',
      condition: 'Utilization < 60%',
      message: `Aktuell: ${kpis.utilizationRate.toFixed(0)}% – Kapazitäten unterausgelastet.`,
      triggered: true,
    });
  }
  
  if (inputs.avgCloseRate < 15) {
    alerts.push({
      id: 'close-low',
      type: 'warning',
      condition: 'Close Rate < 15%',
      message: `Aktuell: ${inputs.avgCloseRate.toFixed(0)}% – Sales optimieren.`,
      triggered: true,
    });
  }
  
  if (kpis.avgAOV < 2000) {
    alerts.push({
      id: 'aov-low',
      type: 'warning',
      condition: 'Avg AOV < CHF 2,000',
      message: `Aktuell: CHF ${kpis.avgAOV.toFixed(0)} – Preise erhöhen oder Upselling verbessern.`,
      triggered: true,
    });
  }
  
  const criticalAlerts = alerts.filter(a => a.type === 'critical');
  const warningAlerts = alerts.filter(a => a.type === 'warning');
  
  if (alerts.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-3">
      {criticalAlerts.map(alert => (
        <Alert key={alert.id} variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>🚨 AUTO-PAUSE: {alert.condition}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}
      
      {warningAlerts.map(alert => (
        <Alert key={alert.id} className="border-yellow-500 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-700">⚠️ CAUTION: {alert.condition}</AlertTitle>
          <AlertDescription className="text-yellow-700">{alert.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

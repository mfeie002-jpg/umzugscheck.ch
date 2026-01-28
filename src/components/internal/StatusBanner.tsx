/**
 * Status Banner - Alert banners based on current state
 */

import { AlertTriangle, XCircle, CheckCircle, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { LaunchKPIs } from './types';

interface StatusBannerProps {
  kpis: LaunchKPIs;
  currentWeek: number;
}

interface AlertItem {
  type: 'critical' | 'warning' | 'success' | 'info';
  title: string;
  description: string;
}

export function StatusBanner({ kpis, currentWeek }: StatusBannerProps) {
  const alerts: AlertItem[] = [];
  
  // Critical alerts
  if (kpis.blendedCPL7Day > 90) {
    alerts.push({
      type: 'critical',
      title: '🔴 KILL SWITCH: Pause Ads',
      description: `Blended CPL (CHF ${kpis.blendedCPL7Day.toFixed(0)}) exceeds CHF 90 threshold. Pause all Google Ads immediately.`,
    });
  }
  
  if (kpis.claimRatePercent > 5) {
    alerts.push({
      type: 'critical',
      title: '🔴 KILL SWITCH: Stop Operations',
      description: `Claim rate (${kpis.claimRatePercent.toFixed(1)}%) exceeds 5% threshold. Halt operations and retrain crew.`,
    });
  }
  
  if (kpis.partnerRefundRate > 15) {
    alerts.push({
      type: 'critical',
      title: '🔴 KILL SWITCH: Suspend Marketplace',
      description: `Partner refund rate (${kpis.partnerRefundRate.toFixed(0)}%) exceeds 15%. Suspend marketplace and audit lead quality.`,
    });
  }
  
  if (kpis.cashReserveMonths < 1) {
    alerts.push({
      type: 'critical',
      title: '🔴 KILL SWITCH: Cash Emergency',
      description: `Cash reserve (${kpis.cashReserveMonths.toFixed(1)} months) below 1 month. Emergency capital call required.`,
    });
  }
  
  // Warning alerts
  if (kpis.closeRate < 15 && currentWeek >= 2) {
    alerts.push({
      type: 'warning',
      title: '⚠️ Low Close Rate',
      description: `Close rate (${kpis.closeRate.toFixed(0)}%) below 15%. Review sales script and pricing.`,
    });
  }
  
  if (kpis.cm2Percent < 20 && currentWeek >= 3) {
    alerts.push({
      type: 'warning',
      title: '⚠️ Margin Compression',
      description: `CM2 margin (${kpis.cm2Percent.toFixed(1)}%) below 20%. Review COGS or increase prices.`,
    });
  }
  
  if (kpis.utilization < 50 && currentWeek >= 4) {
    alerts.push({
      type: 'warning',
      title: '⚠️ Low Utilization',
      description: `Utilization (${kpis.utilization.toFixed(0)}%) below 50%. Activate discounts and increase marketing.`,
    });
  }
  
  if (kpis.partnerAcceptRate < 40 && currentWeek >= 6) {
    alerts.push({
      type: 'warning',
      title: '⚠️ Partner Fatigue',
      description: `Partner accept rate (${kpis.partnerAcceptRate.toFixed(0)}%) below 40%. Improve lead quality or lower price.`,
    });
  }
  
  // Success alerts
  if (kpis.closeRate > 45) {
    alerts.push({
      type: 'success',
      title: '✅ Pricing Power Detected',
      description: `Close rate (${kpis.closeRate.toFixed(0)}%) above 45%. Consider raising prices by 10%.`,
    });
  }
  
  if (kpis.utilization > 85 && kpis.utilization < 95) {
    alerts.push({
      type: 'success',
      title: '✅ Optimal Utilization',
      description: `Utilization (${kpis.utilization.toFixed(0)}%) in target range. Maintain current operations.`,
    });
  }
  
  // Phase-specific alerts
  if (currentWeek === 4 && kpis.cm2 > 0) {
    alerts.push({
      type: 'info',
      title: '🚀 Phase 1 Complete',
      description: 'CM2 is positive. Ready to unlock Phase 2 (Hybrid Switch).',
    });
  }
  
  if (currentWeek === 8 && kpis.marketplaceRevenuePercent >= 30) {
    alerts.push({
      type: 'info',
      title: '🚀 Phase 2 Complete',
      description: 'Marketplace revenue covers 30%+ of ad spend. Ready to scale.',
    });
  }
  
  if (alerts.length === 0) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-6 py-4 space-y-3">
      {alerts.map((alert, index) => (
        <Alert 
          key={index}
          variant={alert.type === 'critical' ? 'destructive' : 'default'}
          className={
            alert.type === 'warning' ? 'border-yellow-500 bg-yellow-500/10' :
            alert.type === 'success' ? 'border-green-500 bg-green-500/10' :
            alert.type === 'info' ? 'border-blue-500 bg-blue-500/10' :
            ''
          }
        >
          {alert.type === 'critical' && <XCircle className="h-4 w-4" />}
          {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
          {alert.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
          {alert.type === 'info' && <Zap className="h-4 w-4 text-blue-600" />}
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
}

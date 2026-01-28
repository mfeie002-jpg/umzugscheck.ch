/**
 * Cherries & Chaff - Automated Guardrails
 * Alert System for Swiss Moving Operations
 */

import type { AlertConfig, AlertType } from './types';

// ============================================
// ALERT DEFINITIONS
// ============================================

export const ALERT_CONFIGS: Record<AlertType, AlertConfig> = {
  high_burn: {
    type: 'high_burn',
    threshold: 500, // CHF daily spend
    message: '⚠️ HIGH BURN: Tägliche Ausgaben > CHF 500 bei < 5 Leads',
    action: 'Pause Ads, überprüfe Landing Page CVR',
    severity: 'critical',
  },
  margin_compression: {
    type: 'margin_compression',
    threshold: 20, // CM2 percent
    message: '⚠️ MARGIN COMPRESSION: Feierabend CM2 < 20% (letzte 5 Jobs)',
    action: 'Preise erhöhen oder COGS reduzieren',
    severity: 'warning',
  },
  partner_fatigue: {
    type: 'partner_fatigue',
    threshold: 1.0, // bids per lead
    message: '⚠️ PARTNER FATIGUE: Marketplace Bid Rate < 1.0',
    action: 'Lead-Qualität verbessern oder Preis senken',
    severity: 'warning',
  },
  pricing_power: {
    type: 'pricing_power',
    threshold: 45, // close rate percent
    message: '✅ PRICING POWER: Close Rate > 45%',
    action: 'Preise um 10% erhöhen',
    severity: 'info',
  },
  low_utilization: {
    type: 'low_utilization',
    threshold: 50, // utilization percent
    message: '🔴 LOW UTILIZATION: Auslastung < 50%',
    action: 'Rabatte aktivieren, Marketing erhöhen',
    severity: 'critical',
  },
  capacity_overflow: {
    type: 'capacity_overflow',
    threshold: 95, // utilization percent
    message: '⚠️ CAPACITY OVERFLOW: Auslastung > 95%',
    action: 'Premium-Pricing aktivieren, Crew #2 planen',
    severity: 'warning',
  },
};

// ============================================
// ALERT EVALUATION
// ============================================

export interface AlertEvaluation {
  triggered: boolean;
  alert: AlertConfig;
  currentValue: number;
  delta: number; // How far above/below threshold
}

export interface DailyMetrics {
  dailySpend: number;
  dailyLeads: number;
  feierabendCM2Percent: number;
  marketplaceBidRate: number;
  closeRatePercent: number;
  utilizationPercent: number;
}

export function evaluateAlerts(metrics: DailyMetrics): AlertEvaluation[] {
  const evaluations: AlertEvaluation[] = [];
  
  // High Burn Alert
  if (metrics.dailySpend > ALERT_CONFIGS.high_burn.threshold && metrics.dailyLeads < 5) {
    evaluations.push({
      triggered: true,
      alert: ALERT_CONFIGS.high_burn,
      currentValue: metrics.dailySpend,
      delta: metrics.dailySpend - ALERT_CONFIGS.high_burn.threshold,
    });
  }
  
  // Margin Compression Alert
  if (metrics.feierabendCM2Percent < ALERT_CONFIGS.margin_compression.threshold) {
    evaluations.push({
      triggered: true,
      alert: ALERT_CONFIGS.margin_compression,
      currentValue: metrics.feierabendCM2Percent,
      delta: ALERT_CONFIGS.margin_compression.threshold - metrics.feierabendCM2Percent,
    });
  }
  
  // Partner Fatigue Alert
  if (metrics.marketplaceBidRate < ALERT_CONFIGS.partner_fatigue.threshold) {
    evaluations.push({
      triggered: true,
      alert: ALERT_CONFIGS.partner_fatigue,
      currentValue: metrics.marketplaceBidRate,
      delta: ALERT_CONFIGS.partner_fatigue.threshold - metrics.marketplaceBidRate,
    });
  }
  
  // Pricing Power Alert (positive)
  if (metrics.closeRatePercent > ALERT_CONFIGS.pricing_power.threshold) {
    evaluations.push({
      triggered: true,
      alert: ALERT_CONFIGS.pricing_power,
      currentValue: metrics.closeRatePercent,
      delta: metrics.closeRatePercent - ALERT_CONFIGS.pricing_power.threshold,
    });
  }
  
  // Low Utilization Alert
  if (metrics.utilizationPercent < ALERT_CONFIGS.low_utilization.threshold) {
    evaluations.push({
      triggered: true,
      alert: ALERT_CONFIGS.low_utilization,
      currentValue: metrics.utilizationPercent,
      delta: ALERT_CONFIGS.low_utilization.threshold - metrics.utilizationPercent,
    });
  }
  
  // Capacity Overflow Alert
  if (metrics.utilizationPercent > ALERT_CONFIGS.capacity_overflow.threshold) {
    evaluations.push({
      triggered: true,
      alert: ALERT_CONFIGS.capacity_overflow,
      currentValue: metrics.utilizationPercent,
      delta: metrics.utilizationPercent - ALERT_CONFIGS.capacity_overflow.threshold,
    });
  }
  
  return evaluations;
}

// ============================================
// KILL SWITCHES
// ============================================

export interface KillSwitchStatus {
  name: string;
  triggered: boolean;
  condition: string;
  action: string;
}

export interface KillSwitchMetrics {
  blendedCPL7Day: number;
  claimsRatePercent: number;
  partnerRefundRatePercent: number;
  cashReserveMonths: number;
}

export function evaluateKillSwitches(metrics: KillSwitchMetrics): KillSwitchStatus[] {
  return [
    {
      name: 'PAUSE_ADS',
      triggered: metrics.blendedCPL7Day > 90,
      condition: 'Blended CPL > CHF 90 (7-day avg)',
      action: 'Immediately pause all Google Ads',
    },
    {
      name: 'STOP_OPS',
      triggered: metrics.claimsRatePercent > 5,
      condition: 'Claims rate > 5% of revenue',
      action: 'Stop operations, retrain crew',
    },
    {
      name: 'SUSPEND_PARTNERS',
      triggered: metrics.partnerRefundRatePercent > 15,
      condition: 'Partner refund rate > 15%',
      action: 'Suspend marketplace, audit lead quality',
    },
    {
      name: 'CASH_EMERGENCY',
      triggered: metrics.cashReserveMonths < 1,
      condition: 'Cash reserve < 1 month opex',
      action: 'Emergency capital call or liquidation',
    },
  ];
}

// ============================================
// ALERT FORMATTING
// ============================================

export function formatAlertForSlack(evaluation: AlertEvaluation): string {
  const emoji = evaluation.alert.severity === 'critical' ? '🔴' 
    : evaluation.alert.severity === 'warning' ? '🟡' 
    : '🟢';
  
  return `${emoji} *${evaluation.alert.type.toUpperCase()}*
> ${evaluation.alert.message}
> Current: ${evaluation.currentValue.toFixed(1)} | Threshold: ${evaluation.alert.threshold}
> *Action:* ${evaluation.alert.action}`;
}

export function formatAlertForEmail(evaluations: AlertEvaluation[]): string {
  if (evaluations.length === 0) {
    return 'No alerts triggered. All metrics within normal range.';
  }
  
  const critical = evaluations.filter(e => e.alert.severity === 'critical');
  const warnings = evaluations.filter(e => e.alert.severity === 'warning');
  const info = evaluations.filter(e => e.alert.severity === 'info');
  
  let html = '<h2>Daily Alert Summary</h2>';
  
  if (critical.length > 0) {
    html += '<h3 style="color: red;">🔴 Critical Alerts</h3><ul>';
    critical.forEach(e => {
      html += `<li><strong>${e.alert.message}</strong><br/>Action: ${e.alert.action}</li>`;
    });
    html += '</ul>';
  }
  
  if (warnings.length > 0) {
    html += '<h3 style="color: orange;">🟡 Warnings</h3><ul>';
    warnings.forEach(e => {
      html += `<li><strong>${e.alert.message}</strong><br/>Action: ${e.alert.action}</li>`;
    });
    html += '</ul>';
  }
  
  if (info.length > 0) {
    html += '<h3 style="color: green;">🟢 Opportunities</h3><ul>';
    info.forEach(e => {
      html += `<li><strong>${e.alert.message}</strong><br/>Action: ${e.alert.action}</li>`;
    });
    html += '</ul>';
  }
  
  return html;
}

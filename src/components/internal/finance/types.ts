/**
 * Finance & P&L Dashboard Types
 */

export interface FinanceInputs {
  cashOnHand: number;
  monthlyFixedCosts: number;
  avgDailyAdSpend: number;
  avgCPL: number;
  avgCloseRate: number;
  avgCM2PerJob: number;
  jobsCompleted7d: number;
  jobsCompleted30d: number;
  claimsPaid: number;
  refundsIssued: number;
}

export interface FinanceKPIs {
  totalRevenue7d: number;
  totalRevenue30d: number;
  cm2_7d: number;
  cm2_30d: number;
  cm2Percent7d: number;
  cm2Percent30d: number;
  blendedCAC: number;
  avgAOV: number;
  utilizationRate: number;
  claimsRate: number;
  marketplaceNetMargin: number;
  cashRunwayMonths: number;
}

export interface DailyPLEntry {
  date: Date;
  revenue: number;
  cogs: number;
  adSpend: number;
  acquisitionCost: number;
  cm2: number;
  jobsCompleted: number;
  marketplaceRevenue: number;
  netCashDelta: number;
}

export interface ScenarioResult {
  newBlendedCAC: number;
  newCM2: number;
  newCashRunway: number;
  stillProfitable: boolean;
}

export type HealthStatus = 'green' | 'yellow' | 'red';

export interface KillSwitchAlert {
  id: string;
  type: 'critical' | 'warning';
  condition: string;
  message: string;
  triggered: boolean;
}

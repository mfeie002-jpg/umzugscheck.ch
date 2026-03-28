/**
 * Internal Dashboard Types
 */

export interface LaunchKPIs {
  // Ads Metrics
  cpc: number;
  ctr: number;
  dailySpend: number;
  dailyLeads: number;
  
  // Sales Metrics
  closeRate: number;
  cpl: number;
  
  // Ops Metrics
  jobsCompleted: number;
  avgAOV: number;
  avgCOGS: number;
  cm2: number;
  cm2Percent: number;
  utilization: number;
  
  // Marketplace Metrics
  marketplaceCPL: number;
  resaleRate: number;
  fillRate: number;
  disputeRate: number;
  partnerAcceptRate: number;
  
  // Financial Metrics
  cashReserveMonths: number;
  claimRatePercent: number;
  
  // Calculated/Rolling
  blendedCPL7Day: number;
  partnerRefundRate: number;
  marketplaceRevenuePercent: number;
}

export interface RoadmapWeek {
  week: number;
  phase: 1 | 2 | 3;
  buildAction: string;
  measureKPI: string[];
  stopGoCriteria: string;
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'blocked';
}

export interface KillSwitch {
  id: string;
  name: string;
  condition: string;
  threshold: number;
  currentValue: number;
  triggered: boolean;
  action: string;
  severity: 'critical' | 'warning';
}

export type OverallStatus = 'healthy' | 'warning' | 'critical';

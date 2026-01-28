/**
 * Command Center Types
 * Unified Internal Dashboard Types
 */

export interface GlobalStatus {
  overall: 'scale' | 'hold' | 'stop';
  blendedCPL7d: number;
  cm2_7d: number;
  utilizationPercent: number;
  cashRunwayMonths: number;
  activeKillSwitches: number;
}

export interface ExecutiveKPIs {
  revenue7d: number;
  revenue30d: number;
  cm2_7d: number;
  cm2_30d: number;
  cm2Percent7d: number;
  cm2Percent30d: number;
  blendedCAC: number;
  avgAOV: number;
  jobsCompleted7d: number;
  jobsCompleted30d: number;
  marketplaceNetMargin: number;
  claimsRatePercent: number;
  partnerDisputeRatePercent: number;
}

export interface FeierabendInputs {
  aovNet: number;
  cplMkt: number;
  closeRate: number;
  salesMinutesPerLead: number;
  salesHourlyCost: number;
  crewSize: number;
  jobHours: number;
  crewHourlyCost: number;
  fleetCost: number;
  materialsCost: number;
}

export interface MarketplaceInputs {
  cplBuy: number;
  partnerPricePerLead: number;
  avgBuyersPerLead: number;
  commissionPercent: number;
  estBookingValue: number;
  partnerCloseRate: number;
  conciergeEnabled: boolean;
  supportCostPerLead: number;
}

export interface LeadSimulatorInput {
  rooms: number;
  distanceKm: number;
  services: string[];
  moveDate: Date;
  budgetAttitude: 'quality' | 'neutral' | 'cheap';
  feierabendCapacityAvailable: boolean;
}

export interface RoadmapWeek {
  week: number;
  phase: 1 | 2 | 3;
  buildAction: string;
  measureKPI: string[];
  stopGoCriteria: string;
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'blocked';
}

export interface DailyPLEntry {
  date: Date;
  revenue: number;
  cogs: number;
  adSpend: number;
  cm2: number;
  netCash: number;
}

export interface OperatorDecision {
  action: 'scale' | 'hold' | 'stop';
  reasons: string[];
  todayActions: string[];
}

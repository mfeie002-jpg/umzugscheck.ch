/**
 * Cherries & Chaff - Calculation Logic
 * Unit Economics for Swiss Moving Market
 */

import type { Lead, FeierabendJob, MarketplaceSale } from './types';

// ============================================
// CONSTANTS (Swiss 2026)
// ============================================

export const SWISS_CONSTANTS = {
  // Labor
  LABOR_RATE_CHF_PER_HOUR: 50,
  SALES_RATE_CHF_PER_HOUR: 40,
  
  // Vehicle
  VEHICLE_DAY_RATE: 180,
  WORKING_DAYS_PER_MONTH: 21,
  DISTANCE_COST_PER_KM: 0.70,
  
  // Targets
  TARGET_MARGIN_PERCENT: 30,
  SAFETY_FACTOR: 1.5,
  
  // Marketplace
  DEFAULT_LEAD_PRICE: 40,
  MIN_LEAD_PRICE: 15,
  PREMIUM_LEAD_PRICE: 55,
} as const;

// ============================================
// A. FEIERABEND (DIRECT) METRICS
// ============================================

/**
 * Calculate forecasted COGS for a job
 */
export function calculateCOGSForecast(
  laborHours: number,
  distanceKm: number,
  vehicleDayRate: number = SWISS_CONSTANTS.VEHICLE_DAY_RATE
): number {
  const laborCost = laborHours * SWISS_CONSTANTS.LABOR_RATE_CHF_PER_HOUR;
  const distanceCost = distanceKm * SWISS_CONSTANTS.DISTANCE_COST_PER_KM;
  const vehicleCost = vehicleDayRate / SWISS_CONSTANTS.WORKING_DAYS_PER_MONTH;
  
  return laborCost + distanceCost + vehicleCost;
}

/**
 * Calculate Total Customer Acquisition Cost
 */
export function calculateTotalCAC(
  marketingSpendShare: number,
  salesHours: number
): number {
  const salesCost = salesHours * SWISS_CONSTANTS.SALES_RATE_CHF_PER_HOUR;
  return marketingSpendShare + salesCost;
}

/**
 * Calculate actual Contribution Margin 2
 */
export function calculateCM2(
  jobRevenue: number,
  cogsActual: number,
  totalCAC: number
): { cm2: number; marginPercent: number } {
  const cm2 = jobRevenue - cogsActual - totalCAC;
  const marginPercent = jobRevenue > 0 ? (cm2 / jobRevenue) * 100 : 0;
  
  return { cm2, marginPercent };
}

/**
 * Calculate maximum allowable CPL for profitability
 */
export function calculateMaxAllowableCPL(
  avgJobValue: number,
  targetMarginPercent: number = SWISS_CONSTANTS.TARGET_MARGIN_PERCENT,
  closeRate: number,
  safetyFactor: number = SWISS_CONSTANTS.SAFETY_FACTOR
): number {
  const targetMarginDecimal = targetMarginPercent / 100;
  return (avgJobValue * targetMarginDecimal * closeRate) / safetyFactor;
}

/**
 * Full Feierabend job profitability analysis
 */
export function analyzeFeierabendJob(job: FeierabendJob): {
  cogs: number;
  cac: number;
  cm2: number;
  marginPercent: number;
  isProfitable: boolean;
  recommendation: string;
} {
  const cogs = calculateCOGSForecast(job.labor_hours, job.distance_km, job.vehicle_day_rate);
  const cac = calculateTotalCAC(job.marketing_spend_share, job.sales_hours);
  const { cm2, marginPercent } = calculateCM2(job.job_revenue, job.cogs_actual || cogs, cac);
  
  const isProfitable = cm2 > 0;
  let recommendation = '';
  
  if (marginPercent >= 35) {
    recommendation = '✅ Excellent margin - consider taking more similar jobs';
  } else if (marginPercent >= 25) {
    recommendation = '✅ Good margin - on target';
  } else if (marginPercent >= 15) {
    recommendation = '⚠️ Thin margin - review pricing or efficiency';
  } else if (marginPercent >= 0) {
    recommendation = '🔴 Break-even - increase price or reduce costs';
  } else {
    recommendation = '🔴 LOSS - stop taking similar jobs immediately';
  }
  
  return { cogs, cac, cm2, marginPercent, isProfitable, recommendation };
}

// ============================================
// B. UMZUGSCHECK (MARKETPLACE) METRICS
// ============================================

/**
 * Calculate Revenue Per Lead
 */
export function calculateRPL(
  leadsSoldCount: number,
  leadPrice: number,
  totalLeadsGenerated: number
): number {
  if (totalLeadsGenerated === 0) return 0;
  return (leadsSoldCount * leadPrice) / totalLeadsGenerated;
}

/**
 * Calculate Margin Per Lead
 */
export function calculateMarginPerLead(rpl: number, cpl: number): number {
  return rpl - cpl;
}

/**
 * Calculate Break-Even Resale Rate
 * How many partners must buy each lead to break even
 */
export function calculateBreakEvenResaleRate(cpl: number, leadPrice: number): number {
  if (leadPrice === 0) return Infinity;
  return cpl / leadPrice;
}

/**
 * Analyze marketplace lead profitability
 */
export function analyzeMarketplaceLead(sale: MarketplaceSale): {
  rpl: number;
  margin: number;
  breakEvenRate: number;
  actualRate: number;
  isProfitable: boolean;
  recommendation: string;
} {
  const rpl = sale.partners_accepted * sale.lead_price;
  const margin = rpl - sale.cpl;
  const breakEvenRate = calculateBreakEvenResaleRate(sale.cpl, sale.lead_price);
  const actualRate = sale.partners_offered > 0 
    ? sale.partners_accepted / sale.partners_offered 
    : 0;
  
  const isProfitable = margin > 0;
  let recommendation = '';
  
  if (sale.partners_accepted >= 2) {
    recommendation = '✅ Strong demand - consider raising lead price';
  } else if (sale.partners_accepted === 1 && isProfitable) {
    recommendation = '✅ Break-even achieved - stable';
  } else if (sale.partners_accepted === 1 && !isProfitable) {
    recommendation = '⚠️ Below break-even - lower CPL or raise price';
  } else {
    recommendation = '🔴 No takers - improve lead quality or lower price';
  }
  
  return { rpl, margin, breakEvenRate, actualRate, isProfitable, recommendation };
}

// ============================================
// C. BLENDED METRICS
// ============================================

/**
 * Calculate blended CPL across channels
 */
export function calculateBlendedCPL(
  channels: Array<{ spend: number; leads: number }>
): number {
  const totalSpend = channels.reduce((sum, c) => sum + c.spend, 0);
  const totalLeads = channels.reduce((sum, c) => sum + c.leads, 0);
  
  if (totalLeads === 0) return 0;
  return totalSpend / totalLeads;
}

/**
 * Calculate ROAS (Return on Ad Spend)
 */
export function calculateROAS(revenue: number, adSpend: number): number {
  if (adSpend === 0) return 0;
  return (revenue / adSpend) * 100;
}

/**
 * Estimate job value based on rooms and distance
 */
export function estimateJobValue(rooms: number, distanceKm: number): number {
  // Base rate per room (Swiss market)
  const basePerRoom = 450;
  // Distance multiplier
  const distanceMultiplier = distanceKm > 50 ? 1.3 : distanceKm > 20 ? 1.15 : 1.0;
  // Complexity bonus for larger apartments
  const complexityMultiplier = rooms > 4 ? 1.2 : rooms > 3 ? 1.1 : 1.0;
  
  return Math.round(rooms * basePerRoom * distanceMultiplier * complexityMultiplier);
}

/**
 * Cherries & Chaff - Scenario Matrix
 * Swiss 2026 Market Assumptions
 */

import type { ScenarioConfig } from './types';

// ============================================
// SCENARIO DEFINITIONS
// ============================================

export const SCENARIOS: Record<string, ScenarioConfig> = {
  conservative: {
    name: 'Conservative (Winter)',
    cpc: 5.50,
    lead_conv_rate: 0.08,
    cpl: 68.75,
    feierabend_close_rate: 0.20,
    partner_demand: 0.8,
    recommendation: 'Focus on SEO, minimize paid spend',
  },
  base: {
    name: 'Base Case (Spring/Fall)',
    cpc: 7.50,
    lead_conv_rate: 0.12,
    cpl: 62.50,
    feierabend_close_rate: 0.30,
    partner_demand: 1.5,
    recommendation: 'Hybrid approach - balanced paid/organic',
  },
  aggressive: {
    name: 'Aggressive (Summer)',
    cpc: 10.00,
    lead_conv_rate: 0.15,
    cpl: 66.67,
    feierabend_close_rate: 0.40,
    partner_demand: 2.5,
    recommendation: 'Max arbitrage - scale paid aggressively',
  },
} as const;

// ============================================
// SEASONAL MAPPING
// ============================================

export function getScenarioForMonth(month: number): ScenarioConfig {
  // Month is 0-indexed (0 = January)
  if (month >= 0 && month <= 1) {
    // Jan-Feb: Winter/Dead
    return SCENARIOS.conservative;
  } else if (month >= 2 && month <= 4) {
    // Mar-May: Spring ramp
    return SCENARIOS.base;
  } else if (month >= 5 && month <= 7) {
    // Jun-Aug: Peak summer
    return SCENARIOS.aggressive;
  } else if (month >= 8 && month <= 9) {
    // Sep-Oct: Fall
    return SCENARIOS.base;
  } else {
    // Nov-Dec: Pre-winter
    return SCENARIOS.conservative;
  }
}

export function getCurrentScenario(): ScenarioConfig {
  const currentMonth = new Date().getMonth();
  return getScenarioForMonth(currentMonth);
}

// ============================================
// SCENARIO PROJECTIONS
// ============================================

export interface ScenarioProjection {
  scenario: ScenarioConfig;
  monthlyBudget: number;
  expectedLeads: number;
  feierabendBookings: number;
  marketplaceLeads: number;
  expectedRevenue: {
    feierabend: number;
    marketplace: number;
    total: number;
  };
  expectedCosts: {
    adSpend: number;
    cogs: number;
    total: number;
  };
  projectedCM2: number;
  projectedMargin: number;
}

export function projectScenario(
  scenario: ScenarioConfig,
  monthlyBudget: number,
  avgJobValue: number = 2200,
  avgLeadPrice: number = 40
): ScenarioProjection {
  // Calculate expected leads from budget
  const expectedLeads = Math.floor(monthlyBudget / scenario.cpl);
  
  // Split by tier (60% Tier 1, 30% Tier 2, 10% Tier 3)
  const tier1Leads = Math.floor(expectedLeads * 0.35);
  const tier2Leads = Math.floor(expectedLeads * 0.45);
  // tier3Leads go to reject
  
  // Feierabend bookings from Tier 1
  const feierabendBookings = Math.floor(tier1Leads * scenario.feierabend_close_rate);
  
  // Marketplace revenue from Tier 2
  const marketplaceLeadsSold = Math.floor(tier2Leads * Math.min(1, scenario.partner_demand / 2));
  const avgPartnersPerLead = Math.min(3, scenario.partner_demand);
  
  // Revenue calculations
  const feierabendRevenue = feierabendBookings * avgJobValue;
  const marketplaceRevenue = marketplaceLeadsSold * avgLeadPrice * avgPartnersPerLead;
  const totalRevenue = feierabendRevenue + marketplaceRevenue;
  
  // Cost calculations
  const avgCOGS = avgJobValue * 0.55; // ~55% COGS
  const totalCOGS = feierabendBookings * avgCOGS;
  const totalCosts = monthlyBudget + totalCOGS;
  
  // CM2
  const projectedCM2 = totalRevenue - totalCosts;
  const projectedMargin = totalRevenue > 0 ? (projectedCM2 / totalRevenue) * 100 : 0;
  
  return {
    scenario,
    monthlyBudget,
    expectedLeads,
    feierabendBookings,
    marketplaceLeads: marketplaceLeadsSold,
    expectedRevenue: {
      feierabend: feierabendRevenue,
      marketplace: marketplaceRevenue,
      total: totalRevenue,
    },
    expectedCosts: {
      adSpend: monthlyBudget,
      cogs: totalCOGS,
      total: totalCosts,
    },
    projectedCM2,
    projectedMargin,
  };
}

// ============================================
// SENSITIVITY ANALYSIS
// ============================================

export interface SensitivityResult {
  cpc: number;
  convRate: number;
  cpl: number;
  roas: number;
  viable: boolean;
}

export function runSensitivityAnalysis(
  cpcRange: number[] = [6, 7, 8, 9, 10],
  convRateRange: number[] = [0.08, 0.10, 0.12, 0.15],
  targetROAS: number = 300
): SensitivityResult[] {
  const results: SensitivityResult[] = [];
  
  for (const cpc of cpcRange) {
    for (const convRate of convRateRange) {
      const cpl = cpc / convRate;
      // Assume 30% close rate, CHF 2200 avg job, 35% margin
      const revenuePerLead = 2200 * 0.30 * 0.35;
      const roas = (revenuePerLead / cpl) * 100;
      
      results.push({
        cpc,
        convRate,
        cpl: Math.round(cpl * 100) / 100,
        roas: Math.round(roas),
        viable: roas >= targetROAS,
      });
    }
  }
  
  return results;
}

/**
 * Cherries & Chaff - Lead Routing Brain
 * The "Intelligence" Layer for Lead Distribution
 */

import type { Lead, RoutingTier } from './types';
import { estimateJobValue } from './calculations';

// ============================================
// SCORING WEIGHTS
// ============================================

export const SCORING_WEIGHTS = {
  rooms: {
    'gt_3.5': 30,
    '2.5_to_3.5': 20,
    '2_to_2.5': 10,
    '1.5_to_2': 0,
    'lt_1.5': -10,
  },
  distance: {
    'gt_50': 20,
    '20_to_50': 15,
    '10_to_20': 10,
    'lt_10': 5,
  },
  services: {
    'packing_unpacking': 20,
    'reinigung': 10,
    'lagerung': 5,
    'transport_only': 0,
  },
  date: {
    'mid_month': 20,      // Days 3-20
    'end_month': 0,       // Days 26-2
    'week_2_out': 10,     // 7-14 days
    'urgent': -20,        // <7 days
    'tomorrow': -50,      // <24h
  },
  budget_signal: {
    'quality_focus': 10,
    'best_service': 5,
    'cheapest': -20,
    'student_wg': -30,
  },
} as const;

// ============================================
// SCORING LOGIC
// ============================================

export interface LeadInput {
  rooms: number;
  distance_km: number;
  move_date: Date;
  services: string[];
  budget_signal?: string;
  from_plz?: string;
  to_plz?: string;
}

export interface ScoringResult {
  total_score: number;
  breakdown: {
    rooms: number;
    distance: number;
    services: number;
    date: number;
    budget: number;
  };
  tier: RoutingTier;
  reasons: string[];
}

/**
 * Calculate lead score based on input parameters
 */
export function calculateLeadScore(input: LeadInput): ScoringResult {
  const breakdown = {
    rooms: 0,
    distance: 0,
    services: 0,
    date: 0,
    budget: 0,
  };
  const reasons: string[] = [];
  
  // Score: Rooms (Volume indicator)
  if (input.rooms > 3.5) {
    breakdown.rooms = SCORING_WEIGHTS.rooms['gt_3.5'];
    reasons.push(`Grosser Umzug (${input.rooms} Zimmer)`);
  } else if (input.rooms >= 2.5) {
    breakdown.rooms = SCORING_WEIGHTS.rooms['2.5_to_3.5'];
    reasons.push('Standard Wohnung');
  } else if (input.rooms >= 2) {
    breakdown.rooms = SCORING_WEIGHTS.rooms['2_to_2.5'];
  } else if (input.rooms >= 1.5) {
    breakdown.rooms = SCORING_WEIGHTS.rooms['1.5_to_2'];
  } else {
    breakdown.rooms = SCORING_WEIGHTS.rooms['lt_1.5'];
    reasons.push('Kleiner Umzug (niedrige Priorität)');
  }
  
  // Score: Distance (Higher value, more logistics)
  if (input.distance_km > 50) {
    breakdown.distance = SCORING_WEIGHTS.distance['gt_50'];
    reasons.push('Fernumzug (>50km)');
  } else if (input.distance_km > 20) {
    breakdown.distance = SCORING_WEIGHTS.distance['20_to_50'];
  } else if (input.distance_km > 10) {
    breakdown.distance = SCORING_WEIGHTS.distance['10_to_20'];
  } else {
    breakdown.distance = SCORING_WEIGHTS.distance['lt_10'];
  }
  
  // Score: Services
  const hasPackingService = input.services.some(s => 
    s.toLowerCase().includes('pack') || s.toLowerCase().includes('verpack')
  );
  const hasCleaningService = input.services.some(s => 
    s.toLowerCase().includes('reinig') || s.toLowerCase().includes('clean')
  );
  const hasStorageService = input.services.some(s => 
    s.toLowerCase().includes('lager') || s.toLowerCase().includes('storage')
  );
  
  if (hasPackingService) {
    breakdown.services += SCORING_WEIGHTS.services['packing_unpacking'];
    reasons.push('Verpackungsservice gewünscht');
  }
  if (hasCleaningService) {
    breakdown.services += SCORING_WEIGHTS.services['reinigung'];
    reasons.push('Reinigung gewünscht');
  }
  if (hasStorageService) {
    breakdown.services += SCORING_WEIGHTS.services['lagerung'];
  }
  
  // Score: Date urgency
  const daysUntilMove = Math.floor(
    (input.move_date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const dayOfMonth = input.move_date.getDate();
  
  if (daysUntilMove < 1) {
    breakdown.date = SCORING_WEIGHTS.date['tomorrow'];
    reasons.push('🔴 Kurzfristig - Auto-Reject');
  } else if (daysUntilMove < 7) {
    breakdown.date = SCORING_WEIGHTS.date['urgent'];
    reasons.push('⚠️ Urgent (<7 Tage)');
  } else if (daysUntilMove < 14) {
    breakdown.date += SCORING_WEIGHTS.date['week_2_out'];
  }
  
  // Day of month scoring (mid-month = good for capacity)
  if (dayOfMonth >= 3 && dayOfMonth <= 20) {
    breakdown.date += SCORING_WEIGHTS.date['mid_month'];
    reasons.push('📅 Mid-month (Kapazitäts-Fill)');
  }
  
  // Score: Budget signal
  if (input.budget_signal) {
    const signal = input.budget_signal.toLowerCase();
    if (signal.includes('qualität') || signal.includes('quality')) {
      breakdown.budget = SCORING_WEIGHTS.budget_signal['quality_focus'];
      reasons.push('Qualitätsfokus');
    } else if (signal.includes('günstig') || signal.includes('billig') || signal.includes('cheap')) {
      breakdown.budget = SCORING_WEIGHTS.budget_signal['cheapest'];
      reasons.push('⚠️ Preisjäger');
    } else if (signal.includes('student') || signal.includes('wg')) {
      breakdown.budget = SCORING_WEIGHTS.budget_signal['student_wg'];
      reasons.push('Student/WG (niedrige Marge)');
    }
  }
  
  // Calculate total
  const total_score = Math.max(0, Math.min(100,
    breakdown.rooms + 
    breakdown.distance + 
    breakdown.services + 
    breakdown.date + 
    breakdown.budget
  ));
  
  // Determine tier
  let tier: RoutingTier;
  if (total_score >= 60) {
    tier = 'feierabend';
  } else if (total_score >= 30) {
    tier = 'marketplace_standard';
  } else {
    tier = 'reject';
  }
  
  return { total_score, breakdown, tier, reasons };
}

// ============================================
// ROUTING LOGIC
// ============================================

export interface RoutingDecision {
  tier: RoutingTier;
  destination: string;
  action: string;
  sla_minutes: number;
  concierge_type: 'human' | 'auto' | 'none';
  lead_price: number;
  max_partners: number;
  priority: 'high' | 'medium' | 'low';
}

export interface FeierabendCapacity {
  available_slots: number;
  date: Date;
  utilization_percent: number;
}

/**
 * Main routing function - the "Brain"
 */
export function routeLead(
  input: LeadInput,
  capacity: FeierabendCapacity
): RoutingDecision {
  const scoring = calculateLeadScore(input);
  const score = scoring.total_score;
  
  // Rule 1: First Right of Refusal (High score + capacity available)
  if (score >= 60 && capacity.available_slots > 0) {
    return {
      tier: 'feierabend',
      destination: 'FEIERABEND_EXCLUSIVE',
      action: 'Human callback immediately',
      sla_minutes: 15,
      concierge_type: 'human',
      lead_price: 0, // Internal
      max_partners: 0,
      priority: 'high',
    };
  }
  
  // Rule 2: High Value but No Capacity -> Premium Auction
  if (score >= 60 && capacity.available_slots === 0) {
    return {
      tier: 'marketplace_premium',
      destination: 'MARKETPLACE_PREMIUM_AUCTION',
      action: 'Sell to highest bidder',
      sla_minutes: 30,
      concierge_type: 'human',
      lead_price: 55, // Premium price
      max_partners: 1, // Exclusive
      priority: 'high',
    };
  }
  
  // Rule 3: Standard Marketplace Lead
  if (score >= 30 && score < 60) {
    // Check if Feierabend should bid as backup (low utilization)
    const feierabendBackup = capacity.utilization_percent < 60;
    
    return {
      tier: 'marketplace_standard',
      destination: 'MARKETPLACE_ROUND_ROBIN',
      action: feierabendBackup 
        ? 'Round robin + Feierabend backup bid' 
        : 'Round robin to partners',
      sla_minutes: 60,
      concierge_type: 'auto',
      lead_price: 40, // Standard price
      max_partners: 3,
      priority: 'medium',
    };
  }
  
  // Rule 4: Low Quality -> Auto-Reject or Budget Sale
  return {
    tier: 'reject',
    destination: 'AUTO_REJECT_OR_BUDGET',
    action: 'Auto-reject or sell to budget partner for CHF 15',
    sla_minutes: 0,
    concierge_type: 'none',
    lead_price: 15,
    max_partners: 1,
    priority: 'low',
  };
}

// ============================================
// BATCH ROUTING
// ============================================

export interface BatchRoutingResult {
  leads: Array<{
    input: LeadInput;
    scoring: ScoringResult;
    routing: RoutingDecision;
    estimated_value: number;
  }>;
  summary: {
    total: number;
    tier1_feierabend: number;
    tier2_marketplace: number;
    tier3_reject: number;
    estimated_total_value: number;
  };
}

export function routeLeadBatch(
  leads: LeadInput[],
  capacity: FeierabendCapacity
): BatchRoutingResult {
  const results = leads.map(input => {
    const scoring = calculateLeadScore(input);
    const routing = routeLead(input, capacity);
    const estimated_value = estimateJobValue(input.rooms, input.distance_km);
    
    // Decrease capacity for each Feierabend assignment
    if (routing.tier === 'feierabend') {
      capacity.available_slots = Math.max(0, capacity.available_slots - 1);
    }
    
    return { input, scoring, routing, estimated_value };
  });
  
  const summary = {
    total: results.length,
    tier1_feierabend: results.filter(r => r.routing.tier === 'feierabend').length,
    tier2_marketplace: results.filter(r => 
      r.routing.tier === 'marketplace_standard' || r.routing.tier === 'marketplace_premium'
    ).length,
    tier3_reject: results.filter(r => r.routing.tier === 'reject').length,
    estimated_total_value: results
      .filter(r => r.routing.tier === 'feierabend')
      .reduce((sum, r) => sum + r.estimated_value, 0),
  };
  
  return { leads: results, summary };
}

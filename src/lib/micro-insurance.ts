/**
 * Micro-Insurance Service
 * Smart insurance policies based on inventory video data
 * Key revenue stream: 50-99 CHF premium with ~60% margin
 */

export interface InsurancePolicy {
  id: string;
  leadId: string;
  customerId: string;
  customerEmail: string;
  status: PolicyStatus;
  coverage: CoverageType;
  premiumCHF: number;
  coverageAmountCHF: number;
  deductibleCHF: number;
  moveDate: string;
  validFrom: string;
  validUntil: string;
  inventoryItems: InsuredItem[];
  riskScore: number;
  createdAt: string;
  activatedAt?: string;
  claimId?: string;
}

export type PolicyStatus = 
  | 'pending_payment'
  | 'active'
  | 'expired'
  | 'claimed'
  | 'cancelled';

export type CoverageType = 'basic' | 'standard' | 'premium' | 'allrisk';

export interface InsuredItem {
  id: string;
  name: string;
  category: ItemCategory;
  estimatedValueCHF: number;
  condition: 'new' | 'good' | 'fair' | 'worn';
  isHighValue: boolean;
  photoUrl?: string;
  videoTimestamp?: number;
}

export type ItemCategory = 
  | 'furniture'
  | 'electronics'
  | 'appliances'
  | 'art'
  | 'antiques'
  | 'instruments'
  | 'fragile'
  | 'clothing'
  | 'books'
  | 'other';

export interface InsuranceClaim {
  id: string;
  policyId: string;
  status: ClaimStatus;
  claimType: 'damage' | 'loss' | 'theft';
  items: ClaimItem[];
  totalClaimAmountCHF: number;
  approvedAmountCHF?: number;
  description: string;
  evidencePhotos: string[];
  evidenceVideoUrl?: string;
  filedAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export type ClaimStatus = 
  | 'filed'
  | 'under_review'
  | 'approved'
  | 'partially_approved'
  | 'rejected'
  | 'paid';

export interface ClaimItem {
  insuredItemId: string;
  itemName: string;
  damageType: 'scratched' | 'broken' | 'lost' | 'water_damage' | 'other';
  damageDescription: string;
  claimedAmountCHF: number;
  approvedAmountCHF?: number;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
}

// Coverage Plans Configuration
export const COVERAGE_PLANS: Record<CoverageType, {
  name: string;
  description: string;
  basePremiumCHF: number;
  maxCoverageRatio: number; // Coverage as multiple of premium
  deductibleCHF: number;
  includes: string[];
  excludes: string[];
}> = {
  basic: {
    name: 'Basis-Schutz',
    description: 'Grundschutz für Standardumzüge',
    basePremiumCHF: 29,
    maxCoverageRatio: 100, // Up to 2,900 CHF coverage
    deductibleCHF: 200,
    includes: [
      'Transportschäden',
      'Bruch durch Sturz',
      'Wasserschäden'
    ],
    excludes: [
      'Vorschäden',
      'Kratzer & Abnutzung',
      'Wertgegenstände über 500 CHF'
    ]
  },
  standard: {
    name: 'Standard-Schutz',
    description: 'Empfohlen für die meisten Umzüge',
    basePremiumCHF: 49,
    maxCoverageRatio: 150,
    deductibleCHF: 100,
    includes: [
      'Alle Basis-Leistungen',
      'Kratzer & leichte Beschädigungen',
      'Wertgegenstände bis 2\'000 CHF'
    ],
    excludes: [
      'Vorschäden',
      'Kunst & Antiquitäten'
    ]
  },
  premium: {
    name: 'Premium-Schutz',
    description: 'Umfassender Schutz für wertvolle Umzüge',
    basePremiumCHF: 79,
    maxCoverageRatio: 200,
    deductibleCHF: 50,
    includes: [
      'Alle Standard-Leistungen',
      'Kunst & Antiquitäten bis 5\'000 CHF',
      'Elektronik-Vollkasko',
      'Verzögerte Lieferung'
    ],
    excludes: [
      'Vorschäden mit Dokumentation'
    ]
  },
  allrisk: {
    name: 'All-Risk',
    description: 'Maximaler Schutz ohne Einschränkungen',
    basePremiumCHF: 149,
    maxCoverageRatio: 300,
    deductibleCHF: 0,
    includes: [
      'Vollständige Deckung',
      'Keine Wertbegrenzung',
      'Express-Schadensabwicklung',
      'Ersatzunterkunft bei Verzögerung'
    ],
    excludes: []
  }
};

// Risk factors for premium calculation
export const RISK_FACTORS: Record<string, number> = {
  // Distance factors
  'distance_local': 1.0,      // < 50km
  'distance_regional': 1.1,   // 50-150km
  'distance_national': 1.2,   // > 150km
  
  // Building factors
  'elevator_yes': 0.9,
  'elevator_no': 1.15,
  'floor_ground': 1.0,
  'floor_1_2': 1.05,
  'floor_3_plus': 1.15,
  
  // Item factors
  'high_value_items': 1.2,
  'fragile_items': 1.1,
  'antiques': 1.3,
  'standard_items': 1.0,
  
  // Provider factors
  'verified_provider': 0.9,
  'new_provider': 1.1,
  
  // Season factors
  'peak_season': 1.15,  // July-August
  'off_season': 0.95
};

// Calculate risk score (0-100)
export function calculateRiskScore(factors: {
  distanceKm: number;
  hasElevator: boolean;
  floor: number;
  highValueItems: number;
  fragileItems: number;
  isVerifiedProvider: boolean;
  moveMonth: number;
}): number {
  let score = 50; // Base score
  
  // Distance impact
  if (factors.distanceKm > 150) score += 10;
  else if (factors.distanceKm > 50) score += 5;
  
  // Building impact
  if (!factors.hasElevator) score += 10;
  if (factors.floor >= 3) score += 8;
  else if (factors.floor >= 1) score += 3;
  
  // Item impact
  score += Math.min(20, factors.highValueItems * 4);
  score += Math.min(10, factors.fragileItems * 2);
  
  // Provider impact
  if (factors.isVerifiedProvider) score -= 10;
  
  // Season impact
  if (factors.moveMonth === 7 || factors.moveMonth === 8) score += 5;
  
  return Math.max(10, Math.min(100, score));
}

// Calculate premium based on coverage and risk
export function calculatePremium(
  coverage: CoverageType,
  inventoryValueCHF: number,
  riskScore: number
): {
  premiumCHF: number;
  coverageAmountCHF: number;
  deductibleCHF: number;
  savingsVsTraditional: number;
} {
  const plan = COVERAGE_PLANS[coverage];
  
  // Base premium from plan
  let premium = plan.basePremiumCHF;
  
  // Adjust for inventory value (every 5000 CHF adds 10%)
  const valueMultiplier = 1 + Math.floor(inventoryValueCHF / 5000) * 0.1;
  premium *= valueMultiplier;
  
  // Adjust for risk score (50 is neutral)
  const riskMultiplier = 0.8 + (riskScore / 100) * 0.4;
  premium *= riskMultiplier;
  
  // Round to nearest 5
  premium = Math.round(premium / 5) * 5;
  
  // Calculate coverage amount
  const coverageAmount = Math.min(
    inventoryValueCHF,
    premium * plan.maxCoverageRatio
  );
  
  // Traditional insurance comparison (typically 2-3% of value)
  const traditionalPremium = inventoryValueCHF * 0.025;
  const savings = Math.max(0, traditionalPremium - premium);

  return {
    premiumCHF: premium,
    coverageAmountCHF: coverageAmount,
    deductibleCHF: plan.deductibleCHF,
    savingsVsTraditional: Math.round(savings)
  };
}

// Estimate claim processing time
export function estimateClaimProcessingDays(claim: {
  hasVideoEvidence: boolean;
  hasBeforePhotos: boolean;
  itemCount: number;
  totalAmount: number;
}): number {
  let days = 5; // Base processing time
  
  // Video evidence speeds up significantly
  if (claim.hasVideoEvidence) days -= 2;
  if (claim.hasBeforePhotos) days -= 1;
  
  // More items = more review time
  days += Math.floor(claim.itemCount / 5);
  
  // High value claims need more review
  if (claim.totalAmount > 2000) days += 2;
  if (claim.totalAmount > 5000) days += 3;
  
  return Math.max(1, Math.min(14, days));
}

// Format policy status
export function formatPolicyStatus(status: PolicyStatus): {
  label: string;
  color: string;
  icon: string;
} {
  switch (status) {
    case 'pending_payment':
      return { label: 'Zahlung ausstehend', color: 'text-amber-600', icon: '💳' };
    case 'active':
      return { label: 'Aktiv', color: 'text-emerald-600', icon: '✅' };
    case 'expired':
      return { label: 'Abgelaufen', color: 'text-muted-foreground', icon: '⏰' };
    case 'claimed':
      return { label: 'Schaden gemeldet', color: 'text-blue-600', icon: '📋' };
    case 'cancelled':
      return { label: 'Storniert', color: 'text-destructive', icon: '❌' };
  }
}

// Format claim status
export function formatClaimStatus(status: ClaimStatus): {
  label: string;
  color: string;
  icon: string;
} {
  switch (status) {
    case 'filed':
      return { label: 'Eingereicht', color: 'text-muted-foreground', icon: '📝' };
    case 'under_review':
      return { label: 'In Prüfung', color: 'text-amber-600', icon: '🔍' };
    case 'approved':
      return { label: 'Genehmigt', color: 'text-emerald-600', icon: '✅' };
    case 'partially_approved':
      return { label: 'Teilweise genehmigt', color: 'text-amber-600', icon: '⚠️' };
    case 'rejected':
      return { label: 'Abgelehnt', color: 'text-destructive', icon: '❌' };
    case 'paid':
      return { label: 'Ausgezahlt', color: 'text-emerald-600', icon: '💰' };
  }
}

// Category labels
export const ITEM_CATEGORY_LABELS: Record<ItemCategory, string> = {
  furniture: 'Möbel',
  electronics: 'Elektronik',
  appliances: 'Haushaltsgeräte',
  art: 'Kunst',
  antiques: 'Antiquitäten',
  instruments: 'Musikinstrumente',
  fragile: 'Zerbrechliches',
  clothing: 'Kleidung',
  books: 'Bücher & Medien',
  other: 'Sonstiges'
};

// Get coverage recommendation based on inventory
export function getRecommendedCoverage(inventoryValueCHF: number, hasHighValueItems: boolean): CoverageType {
  if (inventoryValueCHF > 50000 || hasHighValueItems) return 'allrisk';
  if (inventoryValueCHF > 20000) return 'premium';
  if (inventoryValueCHF > 5000) return 'standard';
  return 'basic';
}

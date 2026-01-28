/**
 * Guaranteed Fixed Price Engine
 * 
 * Phase 3 completion: Generates binding fixed prices with
 * Swiss consumer protection compliance (Abgabegarantie).
 */

import { supabase } from "@/integrations/supabase/client";
import { MoveProject, DigitalTwin, PriceBreakdown } from './move-project';
import { calculateMovePricing, PricingResult, ServiceTier } from './move-pricing-engine';

// ============================================================================
// TYPES
// ============================================================================

export interface GuaranteedQuote {
  id: string;
  projectId: string;
  
  // Core pricing
  tierPrices: {
    essential: number;
    comfort: number;
    premium: number;
  };
  selectedTier: ServiceTier;
  finalPrice: number;
  
  // Guarantee details
  guaranteeType: 'binding_fixed' | 'estimate_range';
  guaranteeLevel: 'standard' | 'premium' | 'swiss_certified';
  bindingUntil: string; // ISO date - quote validity
  
  // Insurance & protection
  insuranceCoverage: number; // CHF amount covered
  damageProtection: boolean;
  cancellationTerms: string;
  
  // Calculation basis
  volumeBasis: number;
  distanceBasis: number;
  complexityScore: number;
  confidenceLevel: number; // 0-1
  
  // Audit trail
  calculatedAt: string;
  calculationVersion: string;
  inputHash: string; // Hash of inputs for verification
  
  // Digital signature placeholder
  customerAccepted: boolean;
  customerAcceptedAt?: string;
  providerConfirmed: boolean;
  providerConfirmedAt?: string;
}

export interface PriceGuaranteeResult {
  quote: GuaranteedQuote;
  breakdown: PriceBreakdown;
  pricingResult: PricingResult;
  savingsVsEstimate: number;
  guaranteeExplanation: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const QUOTE_VALIDITY_DAYS = 7;
const CALCULATION_VERSION = '2.0.0-guaranteed';
const MINIMUM_CONFIDENCE_FOR_FIXED = 0.75;

// Insurance tiers
const INSURANCE_TIERS: Record<ServiceTier, number> = {
  essential: 20000,  // CHF 20k coverage
  comfort: 50000,    // CHF 50k coverage
  premium: 100000,   // CHF 100k coverage
};

// Guarantee levels based on confidence
const getGuaranteeLevel = (confidence: number): GuaranteedQuote['guaranteeLevel'] => {
  if (confidence >= 0.90) return 'swiss_certified';
  if (confidence >= 0.80) return 'premium';
  return 'standard';
};

// ============================================================================
// HASH FUNCTION
// ============================================================================

function hashInputs(project: MoveProject): string {
  const relevant = {
    origin: project.origin,
    destination: project.destination,
    moveDate: project.moveDate,
    totalVolume: project.totalVolume,
    digitalTwin: project.digitalTwin?.totalVolume,
    serviceTier: project.serviceTier,
  };
  
  // Simple hash for demo - production would use crypto
  return btoa(JSON.stringify(relevant)).substring(0, 32);
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Generate a guaranteed fixed price quote for a move project
 */
export function generateGuaranteedQuote(
  project: MoveProject
): PriceGuaranteeResult {
  // Calculate base pricing
  const twin = project.digitalTwin;
  const volume = twin?.totalVolume || project.totalVolume || 25;
  const confidence = twin?.confidence || 0.7;
  
  // Estimate distance (in production: use geocoding API)
  const distanceKm = estimateDistance(project);
  
  const pricingResult = calculateMovePricing({
    totalVolume: volume,
    distanceKm,
    originFloor: project.origin.floor || 0,
    originHasElevator: project.origin.hasElevator || false,
    destinationFloor: project.destination.floor || 0,
    destinationHasElevator: project.destination.hasElevator || false,
    moveDate: project.moveDate || new Date().toISOString(),
    serviceTier: project.serviceTier || 'comfort',
    additionalServices: project.additionalServices || [],
    fragilityScore: twin?.fragilityScore,
  });
  
  // Determine if we can offer fixed price
  const canOfferFixed = confidence >= MINIMUM_CONFIDENCE_FOR_FIXED && twin != null;
  
  // Calculate complexity score
  const complexityScore = calculateComplexityScore(project);
  
  // Build guaranteed quote
  const quoteId = `gq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date();
  const validUntil = new Date(now.getTime() + QUOTE_VALIDITY_DAYS * 24 * 60 * 60 * 1000);
  
  const quote: GuaranteedQuote = {
    id: quoteId,
    projectId: project.id,
    
    tierPrices: {
      essential: pricingResult.tiers.essential.total,
      comfort: pricingResult.tiers.comfort.total,
      premium: pricingResult.tiers.premium.total,
    },
    selectedTier: project.serviceTier || 'comfort',
    finalPrice: pricingResult.breakdown.total,
    
    guaranteeType: canOfferFixed ? 'binding_fixed' : 'estimate_range',
    guaranteeLevel: getGuaranteeLevel(confidence),
    bindingUntil: validUntil.toISOString(),
    
    insuranceCoverage: INSURANCE_TIERS[project.serviceTier || 'comfort'],
    damageProtection: true,
    cancellationTerms: getCancellationTerms(project.serviceTier || 'comfort'),
    
    volumeBasis: volume,
    distanceBasis: distanceKm,
    complexityScore,
    confidenceLevel: confidence,
    
    calculatedAt: now.toISOString(),
    calculationVersion: CALCULATION_VERSION,
    inputHash: hashInputs(project),
    
    customerAccepted: false,
    providerConfirmed: false,
  };
  
  // Calculate savings vs traditional estimate
  const typicalEstimateVariance = 0.25; // 25% variance in typical estimates
  const estimateMax = quote.finalPrice * (1 + typicalEstimateVariance);
  const savingsVsEstimate = Math.round(estimateMax - quote.finalPrice);
  
  // Generate explanation
  const guaranteeExplanation = generateGuaranteeExplanation(quote, canOfferFixed);
  
  return {
    quote,
    breakdown: pricingResult.breakdown,
    pricingResult,
    savingsVsEstimate,
    guaranteeExplanation,
  };
}

/**
 * Accept a guaranteed quote (customer side)
 */
export async function acceptGuaranteedQuote(
  quoteId: string,
  projectId: string
): Promise<{ success: boolean; escrowUrl?: string; error?: string }> {
  try {
    // In production: Create escrow transaction
    const escrowId = `esc_${Date.now()}`;
    
    // Update project with quote acceptance
    const { error } = await supabase
      .from('move_projects')
      .update({
        escrow_id: escrowId,
        price_breakdown: {
          guaranteeType: 'fixed',
          acceptedAt: new Date().toISOString(),
          quoteId,
        },
        status: 'booking',
      })
      .eq('id', projectId);
    
    if (error) throw error;
    
    return {
      success: true,
      escrowUrl: `/booking/escrow/${escrowId}`,
    };
  } catch (e) {
    console.error('Failed to accept quote:', e);
    return {
      success: false,
      error: 'Fehler bei der Angebotsannahme. Bitte versuchen Sie es erneut.',
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function estimateDistance(project: MoveProject): number {
  const fromPostal = project.origin.postalCode;
  const toPostal = project.destination.postalCode;
  
  if (!fromPostal || !toPostal) return 20;
  
  // Same first digit = roughly same region
  if (fromPostal[0] === toPostal[0]) {
    return 15 + Math.abs(parseInt(fromPostal) - parseInt(toPostal)) / 100;
  }
  
  // Different regions = longer distance
  const regionDiff = Math.abs(parseInt(fromPostal[0]) - parseInt(toPostal[0]));
  return 30 + regionDiff * 25;
}

function calculateComplexityScore(project: MoveProject): number {
  let score = 50; // Base
  
  // Floor access complexity
  const originFloor = project.origin.floor || 0;
  const destFloor = project.destination.floor || 0;
  
  if (originFloor > 2 && !project.origin.hasElevator) score += 15;
  if (destFloor > 2 && !project.destination.hasElevator) score += 15;
  
  // Special items
  if (project.digitalTwin?.specialHandling?.length) {
    score += project.digitalTwin.specialHandling.length * 5;
  }
  
  // High fragility
  if (project.digitalTwin?.fragilityScore && project.digitalTwin.fragilityScore > 60) {
    score += 10;
  }
  
  return Math.min(100, score);
}

function getCancellationTerms(tier: ServiceTier): string {
  switch (tier) {
    case 'premium':
      return 'Kostenlose Stornierung bis 48h vor Umzug. Danach 10% Gebühr.';
    case 'comfort':
      return 'Kostenlose Stornierung bis 72h vor Umzug. Danach 15% Gebühr.';
    default:
      return 'Kostenlose Stornierung bis 7 Tage vor Umzug. Danach 20% Gebühr.';
  }
}

function generateGuaranteeExplanation(
  quote: GuaranteedQuote,
  isFixed: boolean
): string {
  if (isFixed) {
    return `Dieser Festpreis von CHF ${quote.finalPrice.toLocaleString('de-CH')} ist verbindlich und gültig bis ${new Date(quote.bindingUntil).toLocaleDateString('de-CH')}. 
    
Der Preis basiert auf der AI-Analyse Ihrer Wohnung mit ${Math.round(quote.confidenceLevel * 100)}% Genauigkeit. Er beinhaltet:
- ${quote.guaranteeLevel === 'swiss_certified' ? 'Swiss-zertifizierte' : 'Standard'} Transportversicherung bis CHF ${quote.insuranceCoverage.toLocaleString('de-CH')}
- Schadensschutz für alle Möbel
- Keine versteckten Kosten

${quote.cancellationTerms}`;
  }
  
  return `Dies ist eine unverbindliche Schätzung. Für einen garantierten Festpreis empfehlen wir einen Video-Scan Ihrer Wohnung durchzuführen.`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  QUOTE_VALIDITY_DAYS,
  MINIMUM_CONFIDENCE_FOR_FIXED,
  INSURANCE_TIERS,
};

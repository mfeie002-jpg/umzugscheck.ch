/**
 * Auto-Bidding System
 * Automated bidding strategies for providers
 */

export interface BiddingRule {
  id: string;
  providerId: string;
  name: string;
  enabled: boolean;
  maxBidAmount: number;
  filters: {
    minVolume?: number;
    maxVolume?: number;
    regions?: string[];
    minScore?: number; // Minimum match score to auto-bid
  };
  strategy: 'aggressive' | 'balanced' | 'conservative';
  createdAt: Date;
}

export interface BidRecommendation {
  leadId: string;
  shouldBid: boolean;
  recommendedBid: number;
  confidence: number;
  reason: string;
}

/**
 * Calculate recommended bid amount based on strategy
 */
export function calculateBidAmount(
  startingBid: number,
  currentHighestBid: number | null,
  strategy: 'aggressive' | 'balanced' | 'conservative',
  maxBidAmount: number,
  matchScore: number
): number {
  const minIncrement = 5; // CHF
  
  if (!currentHighestBid) {
    // No bids yet - bid at starting price
    return Math.min(startingBid, maxBidAmount);
  }

  let bidAmount: number;
  
  switch (strategy) {
    case 'aggressive':
      // Bid 10-15% above current highest
      bidAmount = currentHighestBid + Math.ceil(currentHighestBid * 0.15);
      break;
    
    case 'balanced':
      // Bid 5-10% above current highest
      bidAmount = currentHighestBid + Math.ceil(currentHighestBid * 0.08);
      break;
    
    case 'conservative':
      // Bid minimum increment above current highest
      bidAmount = currentHighestBid + minIncrement;
      break;
  }

  // Adjust based on match score
  if (matchScore >= 80) {
    bidAmount *= 1.1; // Willing to pay more for great matches
  } else if (matchScore < 50) {
    bidAmount *= 0.9; // Pay less for poor matches
  }

  // Respect maximum bid limit
  return Math.min(Math.round(bidAmount), maxBidAmount);
}

/**
 * Evaluate if provider should auto-bid on a lead
 */
export function shouldAutoBid(
  lead: any,
  rule: BiddingRule,
  matchScore: number
): BidRecommendation {
  if (!rule.enabled) {
    return {
      leadId: lead.id,
      shouldBid: false,
      recommendedBid: 0,
      confidence: 0,
      reason: 'Regel ist deaktiviert',
    };
  }

  // Check volume filters
  const leadVolume = lead.calculator_output?.volumeM3 || lead.calculator_output?.volume || 30;
  
  if (rule.filters.minVolume && leadVolume < rule.filters.minVolume) {
    return {
      leadId: lead.id,
      shouldBid: false,
      recommendedBid: 0,
      confidence: 0,
      reason: 'Volumen zu klein',
    };
  }

  if (rule.filters.maxVolume && leadVolume > rule.filters.maxVolume) {
    return {
      leadId: lead.id,
      shouldBid: false,
      recommendedBid: 0,
      confidence: 0,
      reason: 'Volumen zu groß',
    };
  }

  // Check region filters
  if (rule.filters.regions && rule.filters.regions.length > 0) {
    const leadRegion = lead.from_postal?.substring(0, 1);
    const matchesRegion = rule.filters.regions.some(r => r.startsWith(leadRegion || ''));
    
    if (!matchesRegion) {
      return {
        leadId: lead.id,
        shouldBid: false,
        recommendedBid: 0,
        confidence: 0,
        reason: 'Region passt nicht',
      };
    }
  }

  // Check minimum score
  if (rule.filters.minScore && matchScore < rule.filters.minScore) {
    return {
      leadId: lead.id,
      shouldBid: false,
      recommendedBid: 0,
      confidence: 0,
      reason: `Match-Score zu niedrig (${matchScore} < ${rule.filters.minScore})`,
    };
  }

  // Calculate bid
  const recommendedBid = calculateBidAmount(
    lead.starting_bid || 20,
    lead.current_highest_bid,
    rule.strategy,
    rule.maxBidAmount,
    matchScore
  );

  // Calculate confidence based on match score and strategy
  let confidence = matchScore / 100;
  
  if (rule.strategy === 'aggressive') {
    confidence *= 0.9; // Slightly lower confidence for aggressive bids
  } else if (rule.strategy === 'conservative') {
    confidence *= 1.1; // Higher confidence for conservative bids
  }
  
  confidence = Math.min(0.95, confidence);

  return {
    leadId: lead.id,
    shouldBid: true,
    recommendedBid,
    confidence: Math.round(confidence * 100) / 100,
    reason: `Auto-Gebot: ${rule.strategy} Strategie, Score: ${matchScore}`,
  };
}

/**
 * Process multiple leads with auto-bidding rules
 */
export function evaluateLeadsForAutoBidding(
  leads: any[],
  rules: BiddingRule[],
  matchScores: Map<string, number>
): Map<string, BidRecommendation[]> {
  const recommendations = new Map<string, BidRecommendation[]>();

  rules.forEach(rule => {
    const ruleRecommendations: BidRecommendation[] = [];

    leads.forEach(lead => {
      const matchScore = matchScores.get(lead.id) || 0;
      const recommendation = shouldAutoBid(lead, rule, matchScore);
      
      if (recommendation.shouldBid) {
        ruleRecommendations.push(recommendation);
      }
    });

    recommendations.set(rule.id, ruleRecommendations);
  });

  return recommendations;
}

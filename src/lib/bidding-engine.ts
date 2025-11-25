/**
 * Bidding Engine for Sponsored Company Rankings
 * Implements a simplified ads auction system for moving companies
 */

export interface BiddingCompany {
  id: string;
  name: string;
  biddingEnabled: boolean;
  bidModel: "CPL" | "CPC";
  maxBidPerLeadCHF: number;
  maxBidPerClickCHF: number;
  dailyBudgetCHF: number;
  remainingDailyBudgetCHF: number;
  qualityScore: number; // 0-10
  sponsoredActiveRegions: string[];
  // ... rest of company fields
  [key: string]: any;
}

export interface BiddingResult {
  sponsored: BiddingCompany[];
  organic: BiddingCompany[];
}

/**
 * Calculate quality score based on company metrics
 */
export const calculateQualityScore = (company: any): number => {
  const ratingScore = (company.rating / 5) * 4; // Max 4 points
  const reviewScore = Math.min(Math.log10(company.review_count + 1), 3); // Max 3 points
  const completenessScore = (company.profile_completeness || 50) / 100 * 2; // Max 2 points
  const conversionScore = (company.conversion_rate || 0) / 100; // Max 1 point
  
  return Math.min(ratingScore + reviewScore + completenessScore + conversionScore, 10);
};

/**
 * Calculate effective bid score
 */
const calculateEffectiveBidScore = (
  company: BiddingCompany,
  bidType: "CPL" | "CPC"
): number => {
  const bid = bidType === "CPL" ? company.maxBidPerLeadCHF : company.maxBidPerClickCHF;
  const qualityScore = company.qualityScore || calculateQualityScore(company);
  
  return bid * qualityScore;
};

/**
 * Check if company is eligible for sponsored placement
 */
const isEligibleForSponsored = (
  company: BiddingCompany,
  region?: string
): boolean => {
  if (!company.biddingEnabled) return false;
  if (company.remainingDailyBudgetCHF <= 0) return false;
  
  // If region is specified, check if company serves it
  if (region && region !== "all") {
    const activeInRegion = company.sponsoredActiveRegions?.includes(region) ||
                          company.service_areas?.includes(region) ||
                          company.cantons_served?.includes(region);
    if (!activeInRegion) return false;
  }
  
  return true;
};

/**
 * Run bidding auction and return sponsored + organic results
 */
export const runBiddingAuction = (
  companies: any[],
  options: {
    region?: string;
    pageType?: "beste-umzugsfirma" | "guenstige-umzugsfirma";
    maxSponsored?: number;
  } = {}
): BiddingResult => {
  const { region, pageType = "beste-umzugsfirma", maxSponsored = 4 } = options;
  
  // Enrich companies with quality scores
  const enrichedCompanies = companies.map(company => ({
    ...company,
    biddingEnabled: company.biddingEnabled ?? company.is_featured ?? false,
    bidModel: company.bidModel || "CPL",
    maxBidPerLeadCHF: company.maxBidPerLeadCHF || 25,
    maxBidPerClickCHF: company.maxBidPerClickCHF || 5,
    dailyBudgetCHF: company.dailyBudgetCHF || 500,
    remainingDailyBudgetCHF: company.remainingDailyBudgetCHF || 500,
    qualityScore: company.qualityScore || calculateQualityScore(company),
    sponsoredActiveRegions: company.sponsoredActiveRegions || company.service_areas || [],
  }));
  
  // Filter eligible sponsored companies
  const eligibleSponsored = enrichedCompanies.filter(company =>
    isEligibleForSponsored(company, region)
  );
  
  // Calculate effective bid scores
  const companiesWithScores = eligibleSponsored.map(company => ({
    ...company,
    effectiveBidScore: calculateEffectiveBidScore(company, company.bidModel),
  }));
  
  // Sort by effective bid score (descending)
  companiesWithScores.sort((a, b) => b.effectiveBidScore - a.effectiveBidScore);
  
  // Select top N as sponsored
  const sponsored = companiesWithScores.slice(0, maxSponsored);
  
  // Deduct estimated cost from remaining budget (simplified)
  sponsored.forEach(company => {
    const estimatedCost = company.bidModel === "CPL" 
      ? company.maxBidPerLeadCHF * 0.1 // Reserve 10% of lead cost
      : company.maxBidPerClickCHF * 2; // Reserve for 2 clicks
    company.remainingDailyBudgetCHF -= estimatedCost;
  });
  
  // Get all non-sponsored companies (organic)
  const sponsoredIds = new Set(sponsored.map(c => c.id));
  const organic = enrichedCompanies.filter(c => !sponsoredIds.has(c.id));
  
  return {
    sponsored,
    organic,
  };
};

/**
 * Track click event (for CPC billing)
 */
export const trackClickEvent = async (
  companyId: string,
  eventType: "profile_view" | "call_button" | "request_quote"
) => {
  // This would call a backend API to log the event
  console.log(`Click tracked: ${companyId} - ${eventType}`);
  
  // In production, this would:
  // 1. Log to database (provider_click_events table)
  // 2. Deduct from remainingDailyBudgetCHF
  // 3. Create billing record if bidModel is CPC
};

/**
 * Track lead conversion (for CPL billing)
 */
export const trackLeadConversion = async (
  companyIds: string[],
  leadId: string
) => {
  console.log(`Lead tracked: ${leadId} for companies:`, companyIds);
  
  // In production, this would:
  // 1. Create billing records for each company with bidModel = CPL
  // 2. Deduct from remainingDailyBudgetCHF
  // 3. Log to lead_transactions table
};

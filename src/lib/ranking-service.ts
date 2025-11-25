/**
 * Ranking Service
 * Handles filtering, sorting, and ranking of moving companies
 */

import { runBiddingAuction, BiddingResult } from "./bidding-engine";
import { generateRanking, RankedCompany, CompanyData } from "./ranking-algorithm";

export interface RankingFilters {
  region?: string;
  services?: string[];
  priceLevel?: string;
  minRating?: number;
  sortBy?: string;
}

export interface RankingOptions {
  filters?: RankingFilters;
  pageType?: "beste-umzugsfirma" | "guenstige-umzugsfirma";
  maxSponsored?: number;
  enableBidding?: boolean;
}

/**
 * Apply filters to companies
 */
const applyFilters = (
  companies: CompanyData[],
  filters: RankingFilters
): CompanyData[] => {
  let filtered = [...companies];
  
  // Region filter
  if (filters.region && filters.region !== "all") {
    filtered = filtered.filter(c => 
      c.service_areas?.includes(filters.region!) ||
      c.cities_served?.includes(filters.region!)
    );
  }
  
  // Services filter
  if (filters.services && filters.services.length > 0) {
    filtered = filtered.filter(c => {
      const companyServices = (c.services_offered || []).map(s => s.toLowerCase());
      return filters.services!.some(filterService => 
        companyServices.some(cs => cs.includes(filterService))
      );
    });
  }
  
  // Price level filter
  if (filters.priceLevel && filters.priceLevel !== "all") {
    filtered = filtered.filter(c => c.price_level === filters.priceLevel);
  }
  
  // Minimum rating filter
  if (filters.minRating && filters.minRating > 0) {
    filtered = filtered.filter(c => c.rating >= filters.minRating!);
  }
  
  return filtered;
};

/**
 * Apply sorting to companies
 */
const applySorting = (
  companies: RankedCompany[],
  sortBy: string
): RankedCompany[] => {
  const sorted = [...companies];
  
  switch (sortBy) {
    case "rating":
      // Best rating first, then most reviews
      sorted.sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        return b.review_count - a.review_count;
      });
      break;
      
    case "reviews":
      // Most reviews first, then best rating
      sorted.sort((a, b) => {
        if (b.review_count !== a.review_count) return b.review_count - a.review_count;
        return b.rating - a.rating;
      });
      break;
      
    case "price":
      // Günstig first, then by score
      const priceOrder = { 'günstig': 1, 'fair': 2, 'premium': 3 };
      sorted.sort((a, b) => {
        const priceA = priceOrder[a.price_level as keyof typeof priceOrder] || 3;
        const priceB = priceOrder[b.price_level as keyof typeof priceOrder] || 3;
        if (priceA !== priceB) return priceA - priceB;
        return b.score - a.score;
      });
      break;
      
    case "recommended":
    default:
      // Already sorted by algorithm score
      break;
  }
  
  return sorted;
};

/**
 * Get ranked companies with bidding and filtering
 */
export const getRankedCompanies = (
  companies: CompanyData[],
  options: RankingOptions = {}
): {
  sponsored: RankedCompany[];
  organic: RankedCompany[];
  total: number;
} => {
  const {
    filters = {},
    pageType = "beste-umzugsfirma",
    maxSponsored = 4,
    enableBidding = true,
  } = options;
  
  // Apply filters
  const filteredCompanies = applyFilters(companies, filters);
  
  let sponsored: RankedCompany[] = [];
  let organic: RankedCompany[] = [];
  
  if (enableBidding) {
    // Run bidding auction
    const biddingResult: BiddingResult = runBiddingAuction(filteredCompanies, {
      region: filters.region,
      pageType,
      maxSponsored,
    });
    
    // Generate ranking for both sponsored and organic
    const rankedSponsored = generateRanking(
      biddingResult.sponsored as unknown as CompanyData[],
      {},
      pageType === "guenstige-umzugsfirma" ? "cheapest" : "best"
    );
    
    const rankedOrganic = generateRanking(
      biddingResult.organic as unknown as CompanyData[],
      {},
      pageType === "guenstige-umzugsfirma" ? "cheapest" : "best"
    );
    
    // Mark sponsored companies
    sponsored = rankedSponsored.map(c => ({ ...c, isSponsored: true }));
    organic = rankedOrganic.map(c => ({ ...c, isSponsored: false }));
    
  } else {
    // Use traditional ranking without bidding
    const ranked = generateRanking(
      filteredCompanies,
      {},
      pageType === "guenstige-umzugsfirma" ? "cheapest" : "best"
    );
    
    // Separate featured vs non-featured
    sponsored = ranked.filter(c => c.is_featured).slice(0, maxSponsored);
    organic = ranked.filter(c => !c.is_featured);
  }
  
  // Apply sorting to organic companies
  if (filters.sortBy) {
    organic = applySorting(organic, filters.sortBy);
  }
  
  return {
    sponsored,
    organic,
    total: sponsored.length + organic.length,
  };
};

/**
 * Format ranking for display
 */
export const formatRankingForDisplay = (
  sponsored: RankedCompany[],
  organic: RankedCompany[]
) => {
  return {
    sponsoredCompanies: sponsored.map((company, index) => ({
      ...company,
      displayPosition: index + 1,
      isSponsored: true,
    })),
    organicCompanies: organic.map((company, index) => ({
      ...company,
      displayPosition: index + 1,
      isSponsored: false,
    })),
  };
};

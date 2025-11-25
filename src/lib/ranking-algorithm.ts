/**
 * Ranking Algorithm for Umzugscheck.ch
 * Handles both sponsored and organic company rankings
 */

export interface CompanyData {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  price_level: string;
  is_featured: boolean;
  featured_position?: number;
  ranking_position?: number;
  service_areas: string[];
  services_offered: string[];
  profile_completeness?: number;
  conversion_rate?: number;
  response_time_avg_hours?: number;
}

export interface RankingFilters {
  region?: string;
  services?: string[];
  priceLevel?: string;
  minRating?: number;
}

export interface RankedCompany extends CompanyData {
  rank: number;
  isSponsored: boolean;
  score: number;
  savingsPercentage?: number;
}

/**
 * Calculate organic ranking score for a company
 * Factors: rating, review count, price level, profile completeness
 */
export const calculateOrganicScore = (company: CompanyData): number => {
  let score = 0;
  
  // Rating weight: 40 points (max)
  const ratingScore = (company.rating / 5) * 40;
  score += ratingScore;
  
  // Review count weight: 25 points (logarithmic scale)
  const reviewScore = Math.min(25, Math.log10(company.review_count + 1) * 10);
  score += reviewScore;
  
  // Price level bonus: 20 points
  // "günstig" gets full points, "fair" gets 15, "premium" gets 10
  const priceLevelMap: Record<string, number> = {
    'günstig': 20,
    'fair': 15,
    'premium': 10,
  };
  score += priceLevelMap[company.price_level] || 10;
  
  // Profile completeness: 15 points
  const completenessScore = (company.profile_completeness || 50) / 100 * 15;
  score += completenessScore;
  
  return Math.round(score * 100) / 100;
};

/**
 * Filter companies based on criteria
 */
export const filterCompanies = (
  companies: CompanyData[],
  filters: RankingFilters
): CompanyData[] => {
  return companies.filter((company) => {
    // Region filter
    if (filters.region && !company.service_areas.includes(filters.region)) {
      return false;
    }
    
    // Services filter
    if (filters.services && filters.services.length > 0) {
      const hasAllServices = filters.services.every((service) =>
        company.services_offered.includes(service)
      );
      if (!hasAllServices) return false;
    }
    
    // Price level filter
    if (filters.priceLevel && company.price_level !== filters.priceLevel) {
      return false;
    }
    
    // Min rating filter
    if (filters.minRating && company.rating < filters.minRating) {
      return false;
    }
    
    return true;
  });
};

/**
 * Generate ranked list with sponsored and organic companies
 */
export const generateRanking = (
  companies: CompanyData[],
  filters?: RankingFilters,
  rankingType: 'best' | 'cheapest' = 'best'
): RankedCompany[] => {
  // Filter companies
  let filtered = filters ? filterCompanies(companies, filters) : companies;
  
  // Separate sponsored and organic
  const sponsored = filtered
    .filter((c) => c.is_featured)
    .sort((a, b) => (a.featured_position || 999) - (b.featured_position || 999))
    .slice(0, 4); // Max 4 sponsored
  
  const organic = filtered.filter((c) => !c.is_featured);
  
  // Calculate scores and rank organic companies
  const rankedOrganic = organic
    .map((company) => {
      const score = calculateOrganicScore(company);
      
      // For "cheapest" ranking, boost price level in scoring
      const adjustedScore = rankingType === 'cheapest' && company.price_level === 'günstig'
        ? score * 1.2
        : score;
      
      return {
        ...company,
        score: adjustedScore,
        isSponsored: false,
        rank: 0, // Will be set below
      };
    })
    .sort((a, b) => b.score - a.score);
  
  // Calculate average price for savings percentage
  const avgScore = rankedOrganic.reduce((sum, c) => sum + c.score, 0) / rankedOrganic.length;
  
  // Assign ranks and calculate savings
  const rankedOrganicWithSavings = rankedOrganic.map((company, index) => ({
    ...company,
    rank: index + 1,
    savingsPercentage: company.price_level === 'günstig' 
      ? Math.min(35, Math.round((1 - company.score / avgScore) * 100))
      : undefined,
  }));
  
  // Format sponsored companies
  const sponsoredFormatted: RankedCompany[] = sponsored.map((company, index) => ({
    ...company,
    rank: index + 1,
    isSponsored: true,
    score: 100, // Sponsored always have max score for display
  }));
  
  // Return sponsored first, then organic
  return [...sponsoredFormatted, ...rankedOrganicWithSavings];
};

/**
 * Get price range text based on price level
 */
export const getPriceRangeText = (priceLevel: string): string => {
  const ranges: Record<string, string> = {
    'günstig': 'CHF 850-1200/Tag',
    'fair': 'CHF 1200-1800/Tag',
    'premium': 'CHF 1800-2500/Tag',
  };
  return ranges[priceLevel] || 'Preis auf Anfrage';
};

/**
 * Calculate market position for competitor analysis
 */
export const calculateMarketPosition = (
  company: CompanyData,
  allCompanies: CompanyData[]
): {
  percentile: number;
  position: 'top' | 'above-average' | 'average' | 'below-average';
} => {
  const scores = allCompanies.map(calculateOrganicScore).sort((a, b) => b - a);
  const companyScore = calculateOrganicScore(company);
  const rank = scores.findIndex((s) => s <= companyScore) + 1;
  const percentile = (rank / scores.length) * 100;
  
  let position: 'top' | 'above-average' | 'average' | 'below-average';
  if (percentile <= 10) position = 'top';
  else if (percentile <= 30) position = 'above-average';
  else if (percentile <= 70) position = 'average';
  else position = 'below-average';
  
  return { percentile: Math.round(percentile), position };
};

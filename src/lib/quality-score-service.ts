/**
 * Quality Score Service
 * Calculates provider quality scores based on multiple factors
 */

export interface QualityScoreInputs {
  rating: number;
  reviewCount: number;
  profileCompleteness?: number;
  responseTimeAvgHours?: number;
  successRate?: number;
  conversionRate?: number;
}

/**
 * Calculate quality score (0.3 - 1.0 scale)
 * Higher scores indicate better quality providers
 */
export const calculateQualityScore = (inputs: QualityScoreInputs): number => {
  const {
    rating,
    reviewCount,
    profileCompleteness = 50,
    responseTimeAvgHours = 24,
    successRate = 85,
    conversionRate = 20,
  } = inputs;

  // Rating component (0-0.35): normalized rating
  const ratingScore = (rating / 5.0) * 0.35;

  // Review count component (0-0.25): log-scaled to prevent outlier dominance
  const reviewScore = Math.min(Math.log10(reviewCount + 1) / 3, 1) * 0.25;

  // Profile completeness component (0-0.15)
  const completenessScore = (profileCompleteness / 100) * 0.15;

  // Response time component (0-0.1): faster is better (inverse scale)
  const responseScore = Math.max(0, 1 - responseTimeAvgHours / 48) * 0.1;

  // Success rate component (0-0.1)
  const successScore = (successRate / 100) * 0.1;

  // Conversion rate component (0-0.05)
  const conversionScore = (conversionRate / 100) * 0.05;

  // Total score
  const totalScore = 
    ratingScore + 
    reviewScore + 
    completenessScore + 
    responseScore + 
    successScore + 
    conversionScore;

  // Ensure score is between 0.3 and 1.0
  return Math.max(0.3, Math.min(1.0, totalScore));
};

/**
 * Calculate profile completeness percentage
 */
export const calculateProfileCompleteness = (provider: any): number => {
  let score = 0;
  const fields = [
    { key: 'logo_url', weight: 10 },
    { key: 'short_description', weight: 10 },
    { key: 'long_description', weight: 10 },
    { key: 'services_offered', weight: 15, arrayMin: 3 },
    { key: 'service_areas', weight: 15, arrayMin: 1 },
    { key: 'certifications', weight: 10, arrayMin: 1 },
    { key: 'profile_gallery', weight: 10, arrayMin: 2 },
    { key: 'phone_tracking_number', weight: 10 },
    { key: 'discount_offer', weight: 5 },
    { key: 'response_time_avg_hours', weight: 5 },
  ];

  fields.forEach(field => {
    const value = provider[field.key];
    
    if (field.arrayMin) {
      if (Array.isArray(value) && value.length >= field.arrayMin) {
        score += field.weight;
      }
    } else {
      if (value !== null && value !== undefined && value !== '') {
        score += field.weight;
      }
    }
  });

  return Math.min(100, score);
};

/**
 * Get quality score label
 */
export const getQualityScoreLabel = (score: number): string => {
  if (score >= 0.9) return "Hervorragend";
  if (score >= 0.8) return "Sehr gut";
  if (score >= 0.7) return "Gut";
  if (score >= 0.6) return "Solide";
  if (score >= 0.5) return "Durchschnittlich";
  return "Ausbaufähig";
};

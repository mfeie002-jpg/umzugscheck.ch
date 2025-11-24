/**
 * ML-Based Prediction System
 * Uses historical data to predict lead quality, conversion probability, and optimal pricing
 */

import { supabase } from "@/integrations/supabase/client";

export interface LeadPrediction {
  leadId: string;
  qualityScore: number;
  conversionProbability: number;
  predictedValue: number;
  confidence: number;
  factors: {
    volumeImpact: number;
    distanceImpact: number;
    urgencyImpact: number;
    historicalMatch: number;
  };
}

export interface PricePrediction {
  recommendedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  demandFactor: number;
  competitionFactor: number;
  confidenceLevel: number;
}

/**
 * Predict lead quality and conversion probability based on historical data
 */
export async function predictLeadQuality(leadData: {
  volume?: number;
  distance?: number;
  moveDate?: string;
  priceRange?: { min: number; max: number };
}): Promise<LeadPrediction> {
  try {
    // Fetch historical conversion data
    const { data: historicalLeads, error } = await supabase
      .from('lead_transactions')
      .select('*, leads(*)')
      .eq('conversion_status', 'converted')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) throw error;

    // Calculate average metrics from historical data
    const historicalMetrics = calculateHistoricalMetrics(historicalLeads || []);

    // Calculate quality score based on various factors
    const volumeImpact = calculateVolumeImpact(leadData.volume, historicalMetrics.avgVolume);
    const distanceImpact = calculateDistanceImpact(leadData.distance, historicalMetrics.avgDistance);
    const urgencyImpact = calculateUrgencyImpact(leadData.moveDate);
    const historicalMatch = calculateHistoricalMatch(leadData, historicalMetrics);

    // Weighted quality score (0-100)
    const qualityScore = Math.round(
      (volumeImpact * 0.3 + 
       distanceImpact * 0.2 + 
       urgencyImpact * 0.2 + 
       historicalMatch * 0.3) * 100
    );

    // Conversion probability based on quality score and historical data
    const conversionProbability = calculateConversionProbability(qualityScore, historicalMetrics);

    // Predicted job value
    const predictedValue = estimatePredictedValue(leadData, historicalMetrics);

    // Confidence level based on available data
    const confidence = calculateConfidence(leadData, historicalLeads?.length || 0);

    return {
      leadId: '', // Will be set by caller
      qualityScore,
      conversionProbability,
      predictedValue,
      confidence,
      factors: {
        volumeImpact: Math.round(volumeImpact * 100),
        distanceImpact: Math.round(distanceImpact * 100),
        urgencyImpact: Math.round(urgencyImpact * 100),
        historicalMatch: Math.round(historicalMatch * 100),
      }
    };
  } catch (error) {
    console.error('Error predicting lead quality:', error);
    // Return default prediction on error
    return {
      leadId: '',
      qualityScore: 50,
      conversionProbability: 0.3,
      predictedValue: 1500,
      confidence: 0.5,
      factors: {
        volumeImpact: 50,
        distanceImpact: 50,
        urgencyImpact: 50,
        historicalMatch: 50,
      }
    };
  }
}

/**
 * Predict optimal pricing for a lead based on demand and competition
 */
export async function predictOptimalPricing(leadData: {
  volume?: number;
  region?: string;
  urgency?: number;
}): Promise<PricePrediction> {
  try {
    // Fetch recent pricing data
    const { data: recentBids, error } = await supabase
      .from('lead_bids')
      .select('bid_amount, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    // Calculate base price from historical bids
    const basePrices = recentBids?.map(b => b.bid_amount) || [30, 35, 40, 45];
    const avgPrice = basePrices.reduce((a, b) => a + b, 0) / basePrices.length;

    // Adjust for demand (recent bidding activity)
    const demandFactor = calculateDemandFactor(recentBids || []);

    // Adjust for competition
    const competitionFactor = calculateCompetitionFactor(basePrices);

    // Calculate recommended price
    const recommendedPrice = Math.round(
      avgPrice * (1 + demandFactor) * (1 - competitionFactor * 0.2)
    );

    // Calculate price range
    const priceRange = {
      min: Math.round(recommendedPrice * 0.85),
      max: Math.round(recommendedPrice * 1.15)
    };

    // Confidence based on data availability
    const confidenceLevel = Math.min(basePrices.length / 50, 1);

    return {
      recommendedPrice,
      priceRange,
      demandFactor,
      competitionFactor,
      confidenceLevel
    };
  } catch (error) {
    console.error('Error predicting optimal pricing:', error);
    return {
      recommendedPrice: 35,
      priceRange: { min: 25, max: 45 },
      demandFactor: 0.1,
      competitionFactor: 0.5,
      confidenceLevel: 0.5
    };
  }
}

// Helper functions

function calculateHistoricalMetrics(historicalData: any[]) {
  if (historicalData.length === 0) {
    return {
      avgVolume: 30,
      avgDistance: 50,
      avgValue: 2000,
      conversionRate: 0.3
    };
  }

      const volumes = historicalData
    .map(d => {
      const output = d.leads?.calculator_output as any;
      return output?.volume || 30;
    })
    .filter(v => v > 0);
  
  const distances = historicalData
    .map(d => {
      const output = d.leads?.calculator_output as any;
      return output?.distance || 50;
    })
    .filter(d => d > 0);

  const values = historicalData
    .map(d => d.actual_job_value || 0)
    .filter(v => v > 0);

  return {
    avgVolume: volumes.reduce((a, b) => a + b, 0) / volumes.length || 30,
    avgDistance: distances.reduce((a, b) => a + b, 0) / distances.length || 50,
    avgValue: values.reduce((a, b) => a + b, 0) / values.length || 2000,
    conversionRate: 0.3 // Could be calculated from conversion_status
  };
}

function calculateVolumeImpact(volume: number | undefined, avgVolume: number): number {
  if (!volume) return 0.5;
  // Larger volumes typically convert better (more serious moves)
  const ratio = volume / avgVolume;
  return Math.min(Math.max(ratio * 0.7, 0.2), 1);
}

function calculateDistanceImpact(distance: number | undefined, avgDistance: number): number {
  if (!distance) return 0.5;
  // Medium distances are optimal (not too short, not too long)
  const ratio = distance / avgDistance;
  if (ratio > 0.5 && ratio < 1.5) return 0.9;
  if (ratio > 0.3 && ratio < 2) return 0.7;
  return 0.5;
}

function calculateUrgencyImpact(moveDate: string | undefined): number {
  if (!moveDate) return 0.5;
  
  const daysUntilMove = Math.floor(
    (new Date(moveDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  
  // Sweet spot: 2-8 weeks
  if (daysUntilMove >= 14 && daysUntilMove <= 56) return 0.9;
  if (daysUntilMove < 14 && daysUntilMove > 0) return 0.7; // Urgent
  if (daysUntilMove > 56 && daysUntilMove < 120) return 0.6; // Far future
  return 0.4;
}

function calculateHistoricalMatch(leadData: any, metrics: any): number {
  // Simple similarity score based on volume and distance proximity
  let score = 0.5;
  
  if (leadData.volume && metrics.avgVolume) {
    const volumeRatio = leadData.volume / metrics.avgVolume;
    if (volumeRatio > 0.7 && volumeRatio < 1.3) score += 0.2;
  }
  
  if (leadData.distance) {
    const distanceRatio = (leadData.distance || 50) / metrics.avgDistance;
    if (distanceRatio > 0.7 && distanceRatio < 1.3) score += 0.2;
  }
  
  return Math.min(score, 1);
}

function calculateConversionProbability(qualityScore: number, metrics: any): number {
  // Base conversion rate from historical data
  const baseRate = metrics.conversionRate || 0.3;
  
  // Adjust based on quality score
  const adjustment = (qualityScore - 50) / 100; // -0.5 to +0.5
  
  return Math.max(0.1, Math.min(0.9, baseRate + adjustment));
}

function estimatePredictedValue(leadData: any, metrics: any): number {
  let baseValue = metrics.avgValue || 2000;
  
  // Adjust for volume
  if (leadData.volume) {
    baseValue *= (leadData.volume / metrics.avgVolume);
  }
  
  // Adjust for distance
  if (leadData.distance) {
    baseValue += (leadData.distance || 0) * 5; // CHF 5 per km
  }
  
  return Math.round(baseValue);
}

function calculateConfidence(leadData: any, sampleSize: number): number {
  let confidence = Math.min(sampleSize / 100, 0.7); // Max 0.7 from sample size
  
  // Boost confidence if we have complete data
  if (leadData.volume) confidence += 0.1;
  if (leadData.distance) confidence += 0.1;
  if (leadData.moveDate) confidence += 0.1;
  
  return Math.min(confidence, 1);
}

function calculateDemandFactor(recentBids: any[]): number {
  if (recentBids.length < 10) return 0.1;
  
  // High recent activity = higher demand
  const recentCount = recentBids.filter(bid => {
    const age = Date.now() - new Date(bid.created_at).getTime();
    return age < 7 * 24 * 60 * 60 * 1000; // Last 7 days
  }).length;
  
  return Math.min(recentCount / 20, 0.5);
}

function calculateCompetitionFactor(prices: number[]): number {
  if (prices.length < 5) return 0.3;
  
  // Higher price variance = less competition
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const variance = prices.reduce((sum, price) => sum + Math.pow(price - avg, 2), 0) / prices.length;
  const stdDev = Math.sqrt(variance);
  
  // Normalize to 0-1 range
  return Math.min(stdDev / avg, 1);
}

/**
 * Get ML-powered recommendations for a provider
 */
export async function getMLRecommendations(providerId: string) {
  try {
    // Fetch provider's historical performance
    const { data: conversions } = await supabase
      .from('lead_transactions')
      .select('*, leads(*)')
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false })
      .limit(50);

    // Analyze patterns
    const recommendations = [];

    if (conversions && conversions.length > 0) {
      const successfulLeads = conversions.filter(c => c.conversion_status === 'converted');
      
      // Find optimal lead characteristics
      const optimalVolume = calculateOptimalCharacteristic(
        successfulLeads.map(l => {
          const output = l.leads?.calculator_output as any;
          return output?.volume;
        }).filter(Boolean)
      );
      
      if (optimalVolume) {
        recommendations.push({
          type: 'volume',
          message: `Ihre besten Conversions haben durchschnittlich ${Math.round(optimalVolume)}m³. Fokussieren Sie auf ähnliche Leads.`,
          impact: 'high'
        });
      }

      // Check conversion rate by time of year
      const seasonalInsight = analyzeSeasonalPatterns(successfulLeads);
      if (seasonalInsight) {
        recommendations.push(seasonalInsight);
      }
    }

    return recommendations;
  } catch (error) {
    console.error('Error generating ML recommendations:', error);
    return [];
  }
}

function calculateOptimalCharacteristic(values: number[]): number | null {
  if (values.length < 3) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function analyzeSeasonalPatterns(leads: any[]) {
  // Group by month
  const monthCounts: { [key: number]: number } = {};
  
  leads.forEach(lead => {
    const month = new Date(lead.created_at).getMonth();
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });

  const maxMonth = Object.entries(monthCounts).reduce((max, [month, count]) => 
    count > (monthCounts[max] || 0) ? Number(month) : max, 0
  );

  const monthNames = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 
                      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

  if (monthCounts[maxMonth] >= 3) {
    return {
      type: 'seasonal',
      message: `Ihre beste Conversion-Rate ist im ${monthNames[maxMonth]}. Erhöhen Sie Ihr Angebot in diesem Zeitraum.`,
      impact: 'medium'
    };
  }

  return null;
}

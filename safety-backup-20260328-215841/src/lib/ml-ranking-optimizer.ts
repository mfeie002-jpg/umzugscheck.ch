interface CompanyMetrics {
  company_id: string;
  total_clicks: number;
  total_conversions: number;
  conversion_rate: number;
  avg_position: number;
  revenue: number;
}

interface OptimizationRecommendation {
  company_id: string;
  company_name: string;
  current_position: number;
  recommended_position: number;
  expected_improvement: number;
  confidence: number;
  reasoning: string;
}

export class MLRankingOptimizer {
  /**
   * Analyzes historical conversion data to recommend optimal ranking positions
   */
  static analyzeOptimalPositions(
    companies: any[],
    metricsData: CompanyMetrics[]
  ): OptimizationRecommendation[] {
    const recommendations: OptimizationRecommendation[] = [];

    // Create metrics map for quick lookup
    const metricsMap = new Map(
      metricsData.map(m => [m.company_id, m])
    );

    // Calculate position-based performance scores
    const positionScores = this.calculatePositionScores(metricsData);

    // For each company, calculate optimal position
    for (const company of companies) {
      const metrics = metricsMap.get(company.id);
      if (!metrics) continue;

      const currentPosition = company.ranking_position || company.featured_position || 999;
      const performanceScore = this.calculatePerformanceScore(metrics);
      
      // Recommend position based on performance score
      const optimalPosition = this.findOptimalPosition(
        performanceScore,
        positionScores,
        companies.length
      );

      if (optimalPosition !== currentPosition) {
        const improvement = this.estimateImprovement(
          metrics,
          currentPosition,
          optimalPosition
        );

        recommendations.push({
          company_id: company.id,
          company_name: company.company_name,
          current_position: currentPosition,
          recommended_position: optimalPosition,
          expected_improvement: improvement,
          confidence: this.calculateConfidence(metrics),
          reasoning: this.generateReasoning(metrics, currentPosition, optimalPosition),
        });
      }
    }

    // Sort by expected improvement (descending)
    return recommendations.sort((a, b) => b.expected_improvement - a.expected_improvement);
  }

  /**
   * Calculates a performance score for a company based on conversion metrics
   */
  private static calculatePerformanceScore(metrics: CompanyMetrics): number {
    const clickWeight = 0.2;
    const conversionWeight = 0.5;
    const rateWeight = 0.3;

    // Normalize metrics (0-100 scale)
    const normalizedClicks = Math.min(metrics.total_clicks / 1000, 1) * 100;
    const normalizedConversions = Math.min(metrics.total_conversions / 100, 1) * 100;
    const normalizedRate = Math.min(metrics.conversion_rate, 100);

    return (
      normalizedClicks * clickWeight +
      normalizedConversions * conversionWeight +
      normalizedRate * rateWeight
    );
  }

  /**
   * Analyzes which positions historically perform best
   */
  private static calculatePositionScores(metricsData: CompanyMetrics[]): Map<number, number> {
    const positionScores = new Map<number, number>();

    for (const metrics of metricsData) {
      const position = metrics.avg_position;
      const score = metrics.conversion_rate;
      
      if (!positionScores.has(position)) {
        positionScores.set(position, score);
      } else {
        const currentScore = positionScores.get(position)!;
        positionScores.set(position, (currentScore + score) / 2);
      }
    }

    return positionScores;
  }

  /**
   * Finds the optimal position for a company based on performance score
   */
  private static findOptimalPosition(
    performanceScore: number,
    positionScores: Map<number, number>,
    totalCompanies: number
  ): number {
    // High performers should be in top positions
    if (performanceScore >= 80) {
      return Math.ceil(totalCompanies * 0.1); // Top 10%
    } else if (performanceScore >= 60) {
      return Math.ceil(totalCompanies * 0.3); // Top 30%
    } else if (performanceScore >= 40) {
      return Math.ceil(totalCompanies * 0.5); // Top 50%
    } else {
      return Math.ceil(totalCompanies * 0.7); // Top 70%
    }
  }

  /**
   * Estimates conversion improvement from position change
   */
  private static estimateImprovement(
    metrics: CompanyMetrics,
    currentPosition: number,
    newPosition: number
  ): number {
    // Position decay factor: each position down reduces conversions by ~5%
    const positionDiff = currentPosition - newPosition;
    const baseImprovement = positionDiff * 5; // 5% per position

    // Apply current conversion rate as baseline
    const estimatedImprovement = (metrics.conversion_rate * baseImprovement) / 100;

    return Math.max(0, estimatedImprovement);
  }

  /**
   * Calculates confidence level in the recommendation
   */
  private static calculateConfidence(metrics: CompanyMetrics): number {
    // More data = higher confidence
    const dataPoints = metrics.total_clicks + metrics.total_conversions;
    
    if (dataPoints >= 1000) return 95;
    if (dataPoints >= 500) return 85;
    if (dataPoints >= 100) return 70;
    if (dataPoints >= 50) return 55;
    return 40;
  }

  /**
   * Generates human-readable reasoning for the recommendation
   */
  private static generateReasoning(
    metrics: CompanyMetrics,
    currentPosition: number,
    recommendedPosition: number
  ): string {
    const direction = recommendedPosition < currentPosition ? "höher" : "tiefer";
    const positionChange = Math.abs(currentPosition - recommendedPosition);
    
    if (metrics.conversion_rate > 10) {
      return `Starke Conversion Rate (${metrics.conversion_rate.toFixed(1)}%) rechtfertigt ${direction}e Position. Erwartet +${positionChange} Positionen für bessere Sichtbarkeit.`;
    } else if (metrics.total_conversions > 50) {
      return `Hohe Conversion-Anzahl (${metrics.total_conversions}) deutet auf Qualität hin. ${direction.charAt(0).toUpperCase() + direction.slice(1)}e Positionierung empfohlen.`;
    } else {
      return `Basierend auf Performance-Daten wird Position ${recommendedPosition} empfohlen (aktuell: ${currentPosition}).`;
    }
  }

  /**
   * Predicts optimal featured/sponsored mix
   */
  static optimizeFeaturedMix(
    companies: any[],
    metricsData: CompanyMetrics[],
    targetFeaturedCount: number = 4
  ): { featured: string[], organic: string[] } {
    const metricsMap = new Map(
      metricsData.map(m => [m.company_id, m])
    );

    // Score each company
    const scoredCompanies = companies
      .map(company => {
        const metrics = metricsMap.get(company.id);
        if (!metrics) return null;

        return {
          ...company,
          score: this.calculatePerformanceScore(metrics),
          metrics,
        };
      })
      .filter(c => c !== null)
      .sort((a, b) => b!.score - a!.score);

    // Top performers become featured
    const featured = scoredCompanies
      .slice(0, targetFeaturedCount)
      .map(c => c!.id);

    const organic = scoredCompanies
      .slice(targetFeaturedCount)
      .map(c => c!.id);

    return { featured, organic };
  }
}

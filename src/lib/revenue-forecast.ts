/**
 * Revenue Forecasting Engine
 * Predicts future revenue based on historical ranking performance
 */

interface ForecastData {
  month: string;
  predictedRevenue: number;
  confidence: number;
  trend: "up" | "down" | "stable";
}

interface RevenueMetrics {
  totalRevenue: number;
  avgLeadValue: number;
  conversionRate: number;
  monthlyGrowth: number;
}

export class RevenueForecast {
  /**
   * Generate revenue forecast for next N months
   */
  static generateForecast(
    historicalData: any[],
    months: number = 6
  ): ForecastData[] {
    const forecast: ForecastData[] = [];
    const revenueHistory = this.extractRevenueHistory(historicalData);
    
    if (revenueHistory.length === 0) {
      return this.generateDefaultForecast(months);
    }

    const trend = this.calculateTrend(revenueHistory);
    const seasonalFactors = this.calculateSeasonalFactors(revenueHistory);
    
    for (let i = 1; i <= months; i++) {
      const baseRevenue = this.calculateBaseRevenue(revenueHistory);
      const trendAdjustment = baseRevenue * (trend * i / 100);
      const seasonalAdjustment = this.getSeasonalAdjustment(i, seasonalFactors);
      
      const predictedRevenue = Math.max(
        0,
        baseRevenue + trendAdjustment + seasonalAdjustment
      );
      
      const confidence = this.calculateConfidence(revenueHistory.length, i);
      
      forecast.push({
        month: this.getMonthName(i),
        predictedRevenue: Math.round(predictedRevenue),
        confidence,
        trend: trend > 2 ? "up" : trend < -2 ? "down" : "stable",
      });
    }

    return forecast;
  }

  /**
   * Calculate current revenue metrics
   */
  static calculateMetrics(data: any[]): RevenueMetrics {
    if (data.length === 0) {
      return {
        totalRevenue: 0,
        avgLeadValue: 0,
        conversionRate: 0,
        monthlyGrowth: 0,
      };
    }

    const totalRevenue = data.reduce((sum, item) => sum + (item.amount || 0), 0);
    const totalLeads = data.length;
    const convertedLeads = data.filter((item) => item.conversion_status === "converted").length;
    
    const avgLeadValue = totalLeads > 0 ? totalRevenue / totalLeads : 0;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;
    
    const monthlyGrowth = this.calculateMonthlyGrowth(data);

    return {
      totalRevenue: Math.round(totalRevenue),
      avgLeadValue: Math.round(avgLeadValue),
      conversionRate: Math.round(conversionRate * 10) / 10,
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
    };
  }

  private static extractRevenueHistory(data: any[]): number[] {
    const monthlyRevenue = new Map<string, number>();
    
    data.forEach((item) => {
      const date = new Date(item.created_at || item.purchased_at);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const current = monthlyRevenue.get(monthKey) || 0;
      monthlyRevenue.set(monthKey, current + (item.amount || 0));
    });

    return Array.from(monthlyRevenue.values());
  }

  private static calculateTrend(history: number[]): number {
    if (history.length < 2) return 0;
    
    const recent = history.slice(-3);
    const older = history.slice(-6, -3);
    
    if (older.length === 0) return 0;
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
    
    if (olderAvg === 0) return 0;
    
    return ((recentAvg - olderAvg) / olderAvg) * 100;
  }

  private static calculateSeasonalFactors(history: number[]): number[] {
    // Simple seasonal adjustment based on month
    return [1.0, 0.9, 1.1, 1.2, 1.3, 1.2, 1.1, 1.0, 1.1, 1.0, 0.9, 0.8];
  }

  private static calculateBaseRevenue(history: number[]): number {
    if (history.length === 0) return 0;
    const recent = history.slice(-3);
    return recent.reduce((a, b) => a + b, 0) / recent.length;
  }

  private static getSeasonalAdjustment(monthOffset: number, factors: number[]): number {
    const currentMonth = new Date().getMonth();
    const targetMonth = (currentMonth + monthOffset) % 12;
    return (factors[targetMonth] - 1) * 1000; // Adjust impact
  }

  private static calculateConfidence(historyLength: number, monthsAhead: number): number {
    const baseConfidence = Math.min(100, historyLength * 10);
    const decayRate = 5;
    return Math.max(30, baseConfidence - (monthsAhead * decayRate));
  }

  private static getMonthName(offset: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return date.toLocaleDateString("de-CH", { month: "short", year: "numeric" });
  }

  private static calculateMonthlyGrowth(data: any[]): number {
    const history = this.extractRevenueHistory(data);
    if (history.length < 2) return 0;
    
    const recent = history[history.length - 1];
    const previous = history[history.length - 2];
    
    if (previous === 0) return 0;
    
    return ((recent - previous) / previous) * 100;
  }

  private static generateDefaultForecast(months: number): ForecastData[] {
    return Array.from({ length: months }, (_, i) => ({
      month: this.getMonthName(i + 1),
      predictedRevenue: 0,
      confidence: 0,
      trend: "stable" as const,
    }));
  }
}

/**
 * Phase 6 Extended Features
 * Additional 5 strategic growth enhancements beyond the initial 5
 */

// ============================================================================
// FEATURE 6: REFERRAL & AFFILIATE TRACKING
// ============================================================================

export interface ReferralProgram {
  id: string;
  name: string;
  commissionType: "percentage" | "fixed";
  commissionValue: number;
  minPayout: number;
  cookieDuration: number; // days
  tiers: ReferralTier[];
}

export interface ReferralTier {
  tier: number;
  name: string;
  minReferrals: number;
  bonusMultiplier: number;
  perks: string[];
}

export const REFERRAL_PROGRAM: ReferralProgram = {
  id: "standard",
  name: "Umzugscheck Partner Programm",
  commissionType: "fixed",
  commissionValue: 25, // CHF per qualified lead
  minPayout: 100,
  cookieDuration: 30,
  tiers: [
    {
      tier: 1,
      name: "Starter",
      minReferrals: 0,
      bonusMultiplier: 1.0,
      perks: ["Standard Commission", "Monthly Reports"]
    },
    {
      tier: 2,
      name: "Bronze",
      minReferrals: 10,
      bonusMultiplier: 1.1,
      perks: ["10% Bonus", "Priority Support", "Custom Landing Page"]
    },
    {
      tier: 3,
      name: "Silver",
      minReferrals: 50,
      bonusMultiplier: 1.25,
      perks: ["25% Bonus", "Dedicated Manager", "API Access"]
    },
    {
      tier: 4,
      name: "Gold",
      minReferrals: 200,
      bonusMultiplier: 1.5,
      perks: ["50% Bonus", "Co-Branding", "Revenue Share Option"]
    }
  ]
};

// ============================================================================
// FEATURE 7: SMART NOTIFICATION SYSTEM
// ============================================================================

export interface NotificationRule {
  id: string;
  name: string;
  trigger: NotificationTrigger;
  channels: NotificationChannel[];
  template: string;
  delay: number; // minutes
  conditions: NotificationCondition[];
}

export type NotificationTrigger = 
  | "lead_created"
  | "lead_qualified"
  | "offer_received"
  | "offer_accepted"
  | "review_submitted"
  | "provider_response"
  | "payment_received"
  | "move_completed";

export type NotificationChannel = "email" | "sms" | "push" | "whatsapp";

export interface NotificationCondition {
  field: string;
  operator: "equals" | "greater" | "less" | "contains";
  value: any;
}

export const NOTIFICATION_RULES: NotificationRule[] = [
  {
    id: "instant-lead-notify",
    name: "Sofortige Lead-Benachrichtigung",
    trigger: "lead_created",
    channels: ["email", "push"],
    template: "new_lead",
    delay: 0,
    conditions: []
  },
  {
    id: "provider-reminder",
    name: "Provider Antwort-Erinnerung",
    trigger: "lead_created",
    channels: ["email", "sms"],
    template: "provider_reminder",
    delay: 60, // 1 hour
    conditions: [{ field: "response_count", operator: "equals", value: 0 }]
  },
  {
    id: "customer-followup",
    name: "Kunden-Nachfass",
    trigger: "offer_received",
    channels: ["email"],
    template: "customer_followup",
    delay: 1440, // 24 hours
    conditions: [{ field: "status", operator: "equals", value: "pending" }]
  }
];

// ============================================================================
// FEATURE 8: COMPETITIVE INTELLIGENCE
// ============================================================================

export interface CompetitorInsight {
  competitor: string;
  avgPrice: number;
  responseTime: number; // hours
  marketShare: number;
  strengths: string[];
  weaknesses: string[];
  lastUpdated: string;
}

export const COMPETITOR_INSIGHTS: CompetitorInsight[] = [
  {
    competitor: "MOVU",
    avgPrice: 1500,
    responseTime: 2,
    marketShare: 35,
    strengths: ["Brand Recognition", "Large Network", "Insurance"],
    weaknesses: ["Higher Prices", "Less Personalized", "Corporate Feel"],
    lastUpdated: "2025-01-21"
  },
  {
    competitor: "Umzug.ch",
    avgPrice: 1200,
    responseTime: 4,
    marketShare: 15,
    strengths: ["Local Focus", "Good Reviews"],
    weaknesses: ["Limited Coverage", "Outdated Platform"],
    lastUpdated: "2025-01-21"
  },
  {
    competitor: "Comparis Umzug",
    avgPrice: 1400,
    responseTime: 6,
    marketShare: 20,
    strengths: ["Trusted Brand", "Multi-Service"],
    weaknesses: ["Generic Experience", "Not Specialized"],
    lastUpdated: "2025-01-21"
  }
];

export function calculateCompetitiveAdvantage(ourMetrics: {
  avgPrice: number;
  responseTime: number;
  conversionRate: number;
}): { score: number; advantages: string[]; improvements: string[] } {
  const advantages: string[] = [];
  const improvements: string[] = [];
  let score = 50; // Base score

  // Price comparison
  const avgCompetitorPrice = COMPETITOR_INSIGHTS.reduce((sum, c) => sum + c.avgPrice, 0) / COMPETITOR_INSIGHTS.length;
  if (ourMetrics.avgPrice < avgCompetitorPrice * 0.9) {
    advantages.push(`${Math.round((1 - ourMetrics.avgPrice / avgCompetitorPrice) * 100)}% günstiger als Markt`);
    score += 15;
  }

  // Response time
  const avgCompetitorResponse = COMPETITOR_INSIGHTS.reduce((sum, c) => sum + c.responseTime, 0) / COMPETITOR_INSIGHTS.length;
  if (ourMetrics.responseTime < avgCompetitorResponse) {
    advantages.push(`${Math.round(avgCompetitorResponse - ourMetrics.responseTime)}h schnellere Antwort`);
    score += 10;
  } else {
    improvements.push("Antwortzeit verbessern");
  }

  // Conversion rate benchmark
  if (ourMetrics.conversionRate > 0.15) {
    advantages.push("Überdurchschnittliche Conversion");
    score += 15;
  }

  return { score: Math.min(100, score), advantages, improvements };
}

// ============================================================================
// FEATURE 9: REVENUE FORECASTING
// ============================================================================

export interface RevenueForecast {
  period: string;
  predictedLeads: number;
  predictedConversions: number;
  predictedRevenue: number;
  confidence: number; // 0-1
  factors: ForecastFactor[];
}

export interface ForecastFactor {
  name: string;
  impact: "positive" | "negative" | "neutral";
  weight: number;
  description: string;
}

export function generateRevenueForecast(
  historicalData: { month: string; leads: number; revenue: number }[],
  seasonalFactors: Record<string, number>
): RevenueForecast[] {
  const forecasts: RevenueForecast[] = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
  
  // Calculate averages from historical data
  const avgLeadsPerMonth = historicalData.reduce((sum, d) => sum + d.leads, 0) / historicalData.length || 100;
  const avgRevenuePerLead = historicalData.reduce((sum, d) => sum + d.revenue, 0) / 
                            historicalData.reduce((sum, d) => sum + d.leads, 0) || 50;

  // Generate 3-month forecast
  const currentMonth = new Date().getMonth();
  for (let i = 1; i <= 3; i++) {
    const forecastMonth = (currentMonth + i) % 12;
    const monthName = months[forecastMonth];
    const seasonalFactor = seasonalFactors[monthName] || 1.0;

    const predictedLeads = Math.round(avgLeadsPerMonth * seasonalFactor * (1 + (i * 0.05))); // Growth factor
    const conversionRate = 0.12 + (Math.random() * 0.05); // 12-17%
    const predictedConversions = Math.round(predictedLeads * conversionRate);
    const predictedRevenue = Math.round(predictedConversions * avgRevenuePerLead);

    forecasts.push({
      period: `${monthName} 2025`,
      predictedLeads,
      predictedConversions,
      predictedRevenue,
      confidence: 0.85 - (i * 0.1), // Confidence decreases further out
      factors: [
        {
          name: "Saisonalität",
          impact: seasonalFactor > 1 ? "positive" : seasonalFactor < 1 ? "negative" : "neutral",
          weight: seasonalFactor,
          description: seasonalFactor > 1 ? "Hochsaison für Umzüge" : "Nebensaison"
        },
        {
          name: "Marketing-Spend",
          impact: "positive",
          weight: 1.1,
          description: "Google Ads Kampagnen aktiv"
        }
      ]
    });
  }

  return forecasts;
}

// ============================================================================
// FEATURE 10: QUALITY ASSURANCE AUTOMATION
// ============================================================================

export interface QACheck {
  id: string;
  name: string;
  category: "performance" | "content" | "security" | "ux";
  automated: boolean;
  frequency: "realtime" | "hourly" | "daily" | "weekly";
  threshold: number;
  currentValue: number;
  status: "pass" | "warning" | "fail";
}

export const QA_CHECKS: QACheck[] = [
  {
    id: "page-load-time",
    name: "Seitenladezeit",
    category: "performance",
    automated: true,
    frequency: "realtime",
    threshold: 3000, // ms
    currentValue: 1800,
    status: "pass"
  },
  {
    id: "broken-links",
    name: "Broken Links",
    category: "content",
    automated: true,
    frequency: "daily",
    threshold: 0,
    currentValue: 0,
    status: "pass"
  },
  {
    id: "form-validation",
    name: "Formular-Validierung",
    category: "ux",
    automated: true,
    frequency: "hourly",
    threshold: 100, // % success rate
    currentValue: 99.5,
    status: "pass"
  },
  {
    id: "ssl-validity",
    name: "SSL-Zertifikat",
    category: "security",
    automated: true,
    frequency: "daily",
    threshold: 30, // days until expiry
    currentValue: 365,
    status: "pass"
  },
  {
    id: "mobile-usability",
    name: "Mobile Usability Score",
    category: "ux",
    automated: true,
    frequency: "weekly",
    threshold: 90,
    currentValue: 95,
    status: "pass"
  }
];

export function runQAChecks(): { passed: number; warnings: number; failed: number; checks: QACheck[] } {
  const results = QA_CHECKS.map(check => {
    let status: "pass" | "warning" | "fail";
    
    if (check.category === "performance") {
      status = check.currentValue <= check.threshold ? "pass" : 
               check.currentValue <= check.threshold * 1.5 ? "warning" : "fail";
    } else {
      status = check.currentValue >= check.threshold ? "pass" :
               check.currentValue >= check.threshold * 0.8 ? "warning" : "fail";
    }

    return { ...check, status };
  });

  return {
    passed: results.filter(c => c.status === "pass").length,
    warnings: results.filter(c => c.status === "warning").length,
    failed: results.filter(c => c.status === "fail").length,
    checks: results
  };
}

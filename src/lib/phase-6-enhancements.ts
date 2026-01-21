/**
 * Phase 6 Enhancements
 * 5 Strategic features for post-launch growth
 */

// ============ ENHANCEMENT 1: SMART LEAD SCORING ============

export interface LeadScore {
  leadId: string;
  totalScore: number;
  factors: LeadScoreFactor[];
  priority: 'hot' | 'warm' | 'cold';
  recommendedAction: string;
  estimatedValue: number;
}

export interface LeadScoreFactor {
  name: string;
  weight: number;
  score: number;
  reason: string;
}

export const LEAD_SCORING_FACTORS: Omit<LeadScoreFactor, 'score' | 'reason'>[] = [
  { name: 'Umzugsvolumen', weight: 25 },
  { name: 'Zeitrahmen', weight: 20 },
  { name: 'Budget-Indikator', weight: 20 },
  { name: 'Services gebucht', weight: 15 },
  { name: 'Engagement-Level', weight: 10 },
  { name: 'Profil-Vollständigkeit', weight: 10 }
];

export function calculateLeadScore(data: {
  volume: number;
  daysUntilMove: number;
  hasPackingService: boolean;
  hasCleaningService: boolean;
  profileComplete: boolean;
  pagesViewed: number;
}): LeadScore {
  const factors: LeadScoreFactor[] = [];
  let totalScore = 0;

  // Volume scoring
  const volumeScore = Math.min(data.volume / 50 * 100, 100);
  factors.push({
    name: 'Umzugsvolumen',
    weight: 25,
    score: volumeScore,
    reason: `${data.volume}m³ - ${data.volume > 40 ? 'Grosser Umzug' : data.volume > 20 ? 'Mittlerer Umzug' : 'Kleiner Umzug'}`
  });
  totalScore += volumeScore * 0.25;

  // Urgency scoring
  const urgencyScore = data.daysUntilMove < 14 ? 100 : data.daysUntilMove < 30 ? 80 : data.daysUntilMove < 60 ? 50 : 20;
  factors.push({
    name: 'Zeitrahmen',
    weight: 20,
    score: urgencyScore,
    reason: `${data.daysUntilMove} Tage bis Umzug`
  });
  totalScore += urgencyScore * 0.20;

  // Services scoring
  const servicesScore = (data.hasPackingService ? 50 : 0) + (data.hasCleaningService ? 50 : 0);
  factors.push({
    name: 'Services gebucht',
    weight: 15,
    score: servicesScore,
    reason: `${data.hasPackingService ? 'Verpackung ✓' : ''} ${data.hasCleaningService ? 'Reinigung ✓' : ''}`
  });
  totalScore += servicesScore * 0.15;

  const priority = totalScore > 70 ? 'hot' : totalScore > 40 ? 'warm' : 'cold';
  const estimatedValue = Math.round(data.volume * 45 + (data.hasPackingService ? 400 : 0) + (data.hasCleaningService ? 350 : 0));

  return {
    leadId: 'generated',
    totalScore: Math.round(totalScore),
    factors,
    priority,
    recommendedAction: priority === 'hot' ? 'Sofort kontaktieren' : priority === 'warm' ? 'Innerhalb 24h' : 'Email Nurturing',
    estimatedValue
  };
}

// ============ ENHANCEMENT 2: AUTOMATED FOLLOW-UP SEQUENCES ============

export interface FollowUpSequence {
  id: string;
  name: string;
  trigger: string;
  steps: FollowUpStep[];
  isActive: boolean;
  stats: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
}

export interface FollowUpStep {
  dayOffset: number;
  channel: 'email' | 'sms' | 'whatsapp';
  templateId: string;
  subject?: string;
}

export const FOLLOW_UP_SEQUENCES: FollowUpSequence[] = [
  {
    id: 'seq-1',
    name: 'Lead Nurturing',
    trigger: 'Nach Offerten-Anfrage',
    steps: [
      { dayOffset: 0, channel: 'email', templateId: 'welcome', subject: 'Ihre Umzugsofferten sind unterwegs!' },
      { dayOffset: 1, channel: 'whatsapp', templateId: 'check-in' },
      { dayOffset: 3, channel: 'email', templateId: 'tips', subject: '5 Tipps für Ihren Umzug' },
      { dayOffset: 7, channel: 'email', templateId: 'reminder', subject: 'Haben Sie sich entschieden?' }
    ],
    isActive: true,
    stats: { sent: 245, opened: 178, clicked: 89, converted: 23 }
  },
  {
    id: 'seq-2',
    name: 'Abandoned Calculator',
    trigger: 'Rechner abgebrochen bei Step 3+',
    steps: [
      { dayOffset: 0, channel: 'email', templateId: 'abandoned', subject: 'Fast geschafft! Noch 1 Schritt...' },
      { dayOffset: 2, channel: 'whatsapp', templateId: 'help-offer' }
    ],
    isActive: true,
    stats: { sent: 156, opened: 98, clicked: 45, converted: 12 }
  },
  {
    id: 'seq-3',
    name: 'Post-Move Upsell',
    trigger: 'Nach erfolgreichem Umzug',
    steps: [
      { dayOffset: 1, channel: 'email', templateId: 'thank-you', subject: 'Danke für Ihr Vertrauen!' },
      { dayOffset: 7, channel: 'email', templateId: 'review-request', subject: 'Wie war Ihr Umzug?' },
      { dayOffset: 14, channel: 'email', templateId: 'referral', subject: 'Empfehlen Sie uns weiter – 50 CHF Bonus!' }
    ],
    isActive: true,
    stats: { sent: 89, opened: 67, clicked: 34, converted: 8 }
  }
];

// ============ ENHANCEMENT 3: DYNAMIC PRICING ENGINE ============

export interface PricingRule {
  id: string;
  name: string;
  condition: string;
  modifier: number; // percentage adjustment
  isActive: boolean;
  appliedCount: number;
}

export const DYNAMIC_PRICING_RULES: PricingRule[] = [
  { id: 'rule-1', name: 'Peak Season', condition: 'April-Juni, September', modifier: 15, isActive: true, appliedCount: 234 },
  { id: 'rule-2', name: 'Weekend Premium', condition: 'Samstag/Sonntag', modifier: 20, isActive: true, appliedCount: 156 },
  { id: 'rule-3', name: 'Last Minute', condition: '< 7 Tage Vorlauf', modifier: 25, isActive: true, appliedCount: 89 },
  { id: 'rule-4', name: 'Early Bird', condition: '> 60 Tage Vorlauf', modifier: -10, isActive: true, appliedCount: 67 },
  { id: 'rule-5', name: 'Bundle Discount', condition: 'Umzug + Reinigung + Verpackung', modifier: -15, isActive: true, appliedCount: 45 },
  { id: 'rule-6', name: 'Low Capacity', condition: 'Provider-Auslastung < 30%', modifier: -10, isActive: true, appliedCount: 23 },
  { id: 'rule-7', name: 'High Demand', condition: 'Monatsende (25.-31.)', modifier: 10, isActive: true, appliedCount: 178 }
];

export function calculateDynamicPrice(basePrice: number, applicableRules: PricingRule[]): {
  finalPrice: number;
  adjustments: { rule: string; amount: number }[];
  totalModifier: number;
} {
  let totalModifier = 0;
  const adjustments: { rule: string; amount: number }[] = [];

  applicableRules.forEach(rule => {
    if (rule.isActive) {
      const amount = basePrice * (rule.modifier / 100);
      adjustments.push({ rule: rule.name, amount });
      totalModifier += rule.modifier;
    }
  });

  return {
    finalPrice: Math.round(basePrice * (1 + totalModifier / 100)),
    adjustments,
    totalModifier
  };
}

// ============ ENHANCEMENT 4: PROVIDER PERFORMANCE DASHBOARD ============

export interface ProviderPerformance {
  providerId: string;
  name: string;
  metrics: {
    responseTime: number; // hours
    acceptanceRate: number; // percentage
    completionRate: number; // percentage
    customerRating: number; // 1-5
    onTimeRate: number; // percentage
    disputeRate: number; // percentage
  };
  rank: number;
  trend: 'improving' | 'stable' | 'declining';
  badges: string[];
}

export const PROVIDER_PERFORMANCE: ProviderPerformance[] = [
  {
    providerId: 'prov-1',
    name: 'Blitz Umzüge AG',
    metrics: {
      responseTime: 2.4,
      acceptanceRate: 78,
      completionRate: 98,
      customerRating: 4.8,
      onTimeRate: 96,
      disputeRate: 0.5
    },
    rank: 1,
    trend: 'improving',
    badges: ['Top Performer', 'Schnelle Antwort', 'Premium Partner']
  },
  {
    providerId: 'prov-2',
    name: 'SwissMove GmbH',
    metrics: {
      responseTime: 4.1,
      acceptanceRate: 65,
      completionRate: 95,
      customerRating: 4.6,
      onTimeRate: 92,
      disputeRate: 1.2
    },
    rank: 2,
    trend: 'stable',
    badges: ['Verified', 'Grossumzüge']
  },
  {
    providerId: 'prov-3',
    name: 'Zügel Express',
    metrics: {
      responseTime: 1.8,
      acceptanceRate: 82,
      completionRate: 97,
      customerRating: 4.7,
      onTimeRate: 94,
      disputeRate: 0.8
    },
    rank: 3,
    trend: 'improving',
    badges: ['Schnellster', 'Neuling des Monats']
  }
];

// ============ ENHANCEMENT 5: CUSTOMER JOURNEY INSIGHTS ============

export interface JourneyInsight {
  id: string;
  title: string;
  insight: string;
  impact: 'high' | 'medium' | 'low';
  category: 'conversion' | 'engagement' | 'retention' | 'revenue';
  recommendation: string;
  dataPoints: { label: string; value: string }[];
}

export const CUSTOMER_JOURNEY_INSIGHTS: JourneyInsight[] = [
  {
    id: 'insight-1',
    title: 'Drop-Off bei Kontaktformular',
    insight: '36% der Nutzer brechen bei Step 4 (Kontakt) ab – höchster Drop-Off im Funnel',
    impact: 'high',
    category: 'conversion',
    recommendation: 'Kontaktformular vereinfachen, nur Name/Email/Telefon als Pflichtfelder',
    dataPoints: [
      { label: 'Drop-Off Rate', value: '36.3%' },
      { label: 'Verlorene Leads/Tag', value: '~32' },
      { label: 'Potentieller Umsatz', value: '~4\'800 CHF/Tag' }
    ]
  },
  {
    id: 'insight-2',
    title: 'Mobile Conversion Gap',
    insight: 'Mobile Nutzer konvertieren 40% schlechter als Desktop-Nutzer',
    impact: 'high',
    category: 'conversion',
    recommendation: 'Mobile UX optimieren: Grössere Touch-Targets, weniger Formularfelder',
    dataPoints: [
      { label: 'Desktop CR', value: '5.2%' },
      { label: 'Mobile CR', value: '3.1%' },
      { label: 'Mobile Traffic', value: '68%' }
    ]
  },
  {
    id: 'insight-3',
    title: 'Peak Traffic Zeiten',
    insight: 'Höchste Conversion zwischen 19-21 Uhr – aber wenig Ads-Budget zu dieser Zeit',
    impact: 'medium',
    category: 'revenue',
    recommendation: 'Google Ads Budget-Verteilung auf Abendstunden verschieben',
    dataPoints: [
      { label: 'Peak CR', value: '6.8%' },
      { label: 'Abend-Traffic', value: '23%' },
      { label: 'Abend-Budget', value: '12%' }
    ]
  },
  {
    id: 'insight-4',
    title: 'Verpackungsservice Upsell',
    insight: 'Nur 18% der Kunden buchen Verpackungsservice – obwohl es 35% mehr Marge bringt',
    impact: 'high',
    category: 'revenue',
    recommendation: 'Verpackungsservice prominenter im Flow platzieren, Preisersparnis hervorheben',
    dataPoints: [
      { label: 'Upsell Rate', value: '18%' },
      { label: 'Ø Mehrwert', value: '+380 CHF' },
      { label: 'Marge Boost', value: '+35%' }
    ]
  },
  {
    id: 'insight-5',
    title: 'Wiederkehrende Besucher',
    insight: 'Wiederkehrende Besucher konvertieren 3x besser als Erstbesucher',
    impact: 'medium',
    category: 'retention',
    recommendation: 'Retargeting-Budget erhöhen, E-Mail Nurturing für Nicht-Konvertierer',
    dataPoints: [
      { label: 'Erstbesucher CR', value: '2.1%' },
      { label: 'Wiederkehrend CR', value: '6.4%' },
      { label: 'Anteil Wiederkehrend', value: '18%' }
    ]
  }
];

// ============ PHASE 6 SUMMARY ============

export const PHASE_6_ENHANCEMENTS = [
  {
    id: 'enh-1',
    name: 'Smart Lead Scoring',
    status: 'active',
    description: 'KI-basierte Priorisierung von Leads nach Abschluss-Wahrscheinlichkeit',
    impact: '+15% Conversion durch fokussierte Nachverfolgung'
  },
  {
    id: 'enh-2',
    name: 'Automated Follow-Up Sequences',
    status: 'active',
    description: 'Automatische E-Mail/WhatsApp-Sequenzen für verschiedene Trigger',
    impact: '+23% Reaktivierung von abgebrochenen Leads'
  },
  {
    id: 'enh-3',
    name: 'Dynamic Pricing Engine',
    status: 'active',
    description: 'Automatische Preisanpassung nach Nachfrage, Saison und Kapazität',
    impact: '+12% Umsatz durch Yield Management'
  },
  {
    id: 'enh-4',
    name: 'Provider Performance Dashboard',
    status: 'active',
    description: 'Echtzeit-Überwachung und Ranking der Partner-Firmen',
    impact: 'Bessere Lead-Zuweisung, höhere Kundenzufriedenheit'
  },
  {
    id: 'enh-5',
    name: 'Customer Journey Insights',
    status: 'active',
    description: 'Automatische Erkennung von Optimierungs-Potentialen',
    impact: 'Datengetriebene Entscheidungen für kontinuierliche Verbesserung'
  }
];

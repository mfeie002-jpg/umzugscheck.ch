/**
 * Post-Launch Analytics Dashboard
 * Real-time monitoring of key business metrics after go-live
 */

export interface LiveMetric {
  id: string;
  name: string;
  value: number;
  previousValue?: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target?: number;
  category: 'traffic' | 'conversion' | 'revenue' | 'engagement' | 'quality';
}

export interface FunnelStep {
  name: string;
  visitors: number;
  conversionRate: number;
  dropOffRate: number;
}

export interface AlertConfig {
  id: string;
  metric: string;
  condition: 'above' | 'below';
  threshold: number;
  severity: 'info' | 'warning' | 'critical';
  isActive: boolean;
}

// ============ LIVE METRICS ============

export const LIVE_METRICS: LiveMetric[] = [
  // Traffic
  {
    id: 'visitors-today',
    name: 'Besucher heute',
    value: 847,
    previousValue: 723,
    unit: '',
    trend: 'up',
    target: 1000,
    category: 'traffic'
  },
  {
    id: 'unique-sessions',
    name: 'Unique Sessions',
    value: 612,
    previousValue: 534,
    unit: '',
    trend: 'up',
    category: 'traffic'
  },
  {
    id: 'bounce-rate',
    name: 'Bounce Rate',
    value: 34.2,
    previousValue: 38.5,
    unit: '%',
    trend: 'down',
    target: 30,
    category: 'traffic'
  },
  {
    id: 'avg-session-duration',
    name: 'Ø Verweildauer',
    value: 4.2,
    previousValue: 3.8,
    unit: 'min',
    trend: 'up',
    target: 5,
    category: 'traffic'
  },

  // Conversion
  {
    id: 'leads-today',
    name: 'Leads heute',
    value: 23,
    previousValue: 18,
    unit: '',
    trend: 'up',
    target: 50,
    category: 'conversion'
  },
  {
    id: 'conversion-rate',
    name: 'Conversion Rate',
    value: 3.8,
    previousValue: 3.2,
    unit: '%',
    trend: 'up',
    target: 5,
    category: 'conversion'
  },
  {
    id: 'calculator-starts',
    name: 'Rechner gestartet',
    value: 156,
    previousValue: 132,
    unit: '',
    trend: 'up',
    category: 'conversion'
  },
  {
    id: 'calculator-completions',
    name: 'Rechner abgeschlossen',
    value: 89,
    previousValue: 72,
    unit: '',
    trend: 'up',
    category: 'conversion'
  },

  // Revenue
  {
    id: 'revenue-today',
    name: 'Umsatz heute',
    value: 1240,
    previousValue: 980,
    unit: 'CHF',
    trend: 'up',
    category: 'revenue'
  },
  {
    id: 'avg-order-value',
    name: 'Ø Auftragswert',
    value: 1850,
    previousValue: 1720,
    unit: 'CHF',
    trend: 'up',
    target: 2000,
    category: 'revenue'
  },
  {
    id: 'cpl',
    name: 'Cost per Lead',
    value: 12.50,
    previousValue: 15.20,
    unit: 'CHF',
    trend: 'down',
    target: 10,
    category: 'revenue'
  },
  {
    id: 'roas',
    name: 'ROAS',
    value: 4.2,
    previousValue: 3.8,
    unit: 'x',
    trend: 'up',
    target: 5,
    category: 'revenue'
  },

  // Engagement
  {
    id: 'pages-per-session',
    name: 'Seiten/Session',
    value: 4.7,
    previousValue: 4.2,
    unit: '',
    trend: 'up',
    category: 'engagement'
  },
  {
    id: 'return-visitors',
    name: 'Wiederkehrende',
    value: 18.5,
    previousValue: 15.2,
    unit: '%',
    trend: 'up',
    category: 'engagement'
  },
  {
    id: 'scroll-depth',
    name: 'Scroll-Tiefe',
    value: 72,
    previousValue: 65,
    unit: '%',
    trend: 'up',
    category: 'engagement'
  },

  // Quality
  {
    id: 'nps-score',
    name: 'NPS Score',
    value: 62,
    previousValue: 58,
    unit: '',
    trend: 'up',
    target: 70,
    category: 'quality'
  },
  {
    id: 'error-rate',
    name: 'Fehlerrate',
    value: 0.02,
    previousValue: 0.05,
    unit: '%',
    trend: 'down',
    target: 0.01,
    category: 'quality'
  },
  {
    id: 'uptime',
    name: 'Uptime',
    value: 99.98,
    previousValue: 99.95,
    unit: '%',
    trend: 'up',
    target: 99.99,
    category: 'quality'
  }
];

// ============ FUNNEL ANALYSIS ============

export const FUNNEL_STEPS: FunnelStep[] = [
  { name: 'Homepage', visitors: 847, conversionRate: 100, dropOffRate: 0 },
  { name: 'Rechner gestartet', visitors: 423, conversionRate: 49.9, dropOffRate: 50.1 },
  { name: 'Step 1: Von/Nach', visitors: 356, conversionRate: 84.2, dropOffRate: 15.8 },
  { name: 'Step 2: Volumen', visitors: 298, conversionRate: 83.7, dropOffRate: 16.3 },
  { name: 'Step 3: Services', visitors: 245, conversionRate: 82.2, dropOffRate: 17.8 },
  { name: 'Step 4: Kontakt', visitors: 156, conversionRate: 63.7, dropOffRate: 36.3 },
  { name: 'Lead abgeschickt', visitors: 89, conversionRate: 57.1, dropOffRate: 42.9 }
];

// ============ TRAFFIC SOURCES ============

export interface TrafficSource {
  name: string;
  visitors: number;
  leads: number;
  conversionRate: number;
  revenue: number;
  trend: 'up' | 'down' | 'stable';
}

export const TRAFFIC_SOURCES: TrafficSource[] = [
  { name: 'Google Organic', visitors: 312, leads: 12, conversionRate: 3.8, revenue: 540, trend: 'up' },
  { name: 'Google Ads', visitors: 245, leads: 8, conversionRate: 3.3, revenue: 380, trend: 'up' },
  { name: 'Direct', visitors: 156, leads: 2, conversionRate: 1.3, revenue: 120, trend: 'stable' },
  { name: 'Social Media', visitors: 78, leads: 1, conversionRate: 1.3, revenue: 80, trend: 'up' },
  { name: 'Referral', visitors: 56, leads: 0, conversionRate: 0, revenue: 0, trend: 'stable' }
];

// ============ REAL-TIME ALERTS ============

export const ALERT_CONFIGS: AlertConfig[] = [
  { id: 'alert-1', metric: 'error-rate', condition: 'above', threshold: 1, severity: 'critical', isActive: true },
  { id: 'alert-2', metric: 'uptime', condition: 'below', threshold: 99.5, severity: 'critical', isActive: true },
  { id: 'alert-3', metric: 'conversion-rate', condition: 'below', threshold: 2, severity: 'warning', isActive: true },
  { id: 'alert-4', metric: 'bounce-rate', condition: 'above', threshold: 50, severity: 'warning', isActive: true },
  { id: 'alert-5', metric: 'leads-today', condition: 'below', threshold: 10, severity: 'info', isActive: true }
];

// ============ HELPER FUNCTIONS ============

export function calculateFunnelConversion(): number {
  if (FUNNEL_STEPS.length === 0) return 0;
  const start = FUNNEL_STEPS[0].visitors;
  const end = FUNNEL_STEPS[FUNNEL_STEPS.length - 1].visitors;
  return Math.round((end / start) * 1000) / 10;
}

export function getMetricsByCategory(category: LiveMetric['category']): LiveMetric[] {
  return LIVE_METRICS.filter(m => m.category === category);
}

export function getPerformanceScore(): number {
  let score = 0;
  let count = 0;
  
  LIVE_METRICS.forEach(metric => {
    if (metric.target) {
      const isGood = metric.trend === 'up' 
        ? metric.value >= metric.target 
        : metric.value <= metric.target;
      score += isGood ? 100 : (metric.value / metric.target) * 100;
      count++;
    }
  });
  
  return count > 0 ? Math.round(score / count) : 0;
}

export function getTopPerformingSource(): TrafficSource | null {
  return TRAFFIC_SOURCES.reduce((best, current) => 
    current.conversionRate > (best?.conversionRate || 0) ? current : best
  , null as TrafficSource | null);
}

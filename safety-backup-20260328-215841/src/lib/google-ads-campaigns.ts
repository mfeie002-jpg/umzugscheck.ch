/**
 * Google Ads Campaign Management System
 * UTM tracking, conversion optimization, and campaign structure
 */

export interface AdCampaign {
  id: string;
  name: string;
  type: 'search' | 'display' | 'remarketing' | 'pmax';
  status: 'active' | 'paused' | 'draft';
  budget: {
    daily: number;
    monthly: number;
  };
  targeting: {
    locations: string[];
    keywords: string[];
    audiences: string[];
    demographics?: {
      ageRange?: string;
      gender?: string;
      income?: string;
    };
  };
  bidStrategy: 'maximize_conversions' | 'target_cpa' | 'target_roas' | 'manual_cpc';
  targetCpa?: number;
  landingPage: string;
  utmParams: UTMParams;
  expectedMetrics: {
    ctr: number;
    conversionRate: number;
    cpc: number;
    cpa: number;
  };
}

export interface UTMParams {
  source: string;
  medium: string;
  campaign: string;
  content?: string;
  term?: string;
}

export interface AdGroup {
  id: string;
  campaignId: string;
  name: string;
  keywords: Keyword[];
  ads: Ad[];
}

export interface Keyword {
  text: string;
  matchType: 'exact' | 'phrase' | 'broad';
  bid?: number;
  qualityScore?: number;
}

export interface Ad {
  id: string;
  type: 'responsive_search' | 'responsive_display' | 'call';
  headlines: string[];
  descriptions: string[];
  finalUrl: string;
  displayPath?: string[];
}

// Swiss moving market campaigns
export const SWISS_MOVING_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'search-brand',
    name: 'Brand - Umzugscheck',
    type: 'search',
    status: 'active',
    budget: { daily: 50, monthly: 1500 },
    targeting: {
      locations: ['CH'],
      keywords: ['umzugscheck', 'umzugscheck.ch', 'umzugs check schweiz'],
      audiences: [],
    },
    bidStrategy: 'maximize_conversions',
    landingPage: '/',
    utmParams: {
      source: 'google',
      medium: 'cpc',
      campaign: 'brand_umzugscheck',
    },
    expectedMetrics: { ctr: 15, conversionRate: 12, cpc: 0.5, cpa: 4.2 },
  },
  {
    id: 'search-generic-moving',
    name: 'Generic - Umzug Schweiz',
    type: 'search',
    status: 'active',
    budget: { daily: 200, monthly: 6000 },
    targeting: {
      locations: ['CH'],
      keywords: [
        'umzugsfirma schweiz',
        'umzug offerte',
        'umzugsunternehmen',
        'günstig umziehen',
        'umzug kosten',
        'umzugsfirma vergleich',
      ],
      audiences: [],
    },
    bidStrategy: 'target_cpa',
    targetCpa: 25,
    landingPage: '/umzugsofferten',
    utmParams: {
      source: 'google',
      medium: 'cpc',
      campaign: 'generic_umzug',
    },
    expectedMetrics: { ctr: 5.5, conversionRate: 8, cpc: 2, cpa: 25 },
  },
  {
    id: 'search-city-zurich',
    name: 'City - Zürich Umzug',
    type: 'search',
    status: 'active',
    budget: { daily: 100, monthly: 3000 },
    targeting: {
      locations: ['Zürich', 'Winterthur', 'Uster'],
      keywords: [
        'umzugsfirma zürich',
        'umzug zürich',
        'zürich umzugsunternehmen',
        'umziehen zürich kosten',
      ],
      audiences: [],
    },
    bidStrategy: 'target_cpa',
    targetCpa: 20,
    landingPage: '/zurich',
    utmParams: {
      source: 'google',
      medium: 'cpc',
      campaign: 'city_zurich',
    },
    expectedMetrics: { ctr: 6, conversionRate: 9, cpc: 1.8, cpa: 20 },
  },
  {
    id: 'search-city-bern',
    name: 'City - Bern Umzug',
    type: 'search',
    status: 'active',
    budget: { daily: 80, monthly: 2400 },
    targeting: {
      locations: ['Bern', 'Thun', 'Biel'],
      keywords: [
        'umzugsfirma bern',
        'umzug bern',
        'bern umzugsunternehmen',
      ],
      audiences: [],
    },
    bidStrategy: 'target_cpa',
    targetCpa: 22,
    landingPage: '/bern',
    utmParams: {
      source: 'google',
      medium: 'cpc',
      campaign: 'city_bern',
    },
    expectedMetrics: { ctr: 5.8, conversionRate: 8.5, cpc: 1.9, cpa: 22 },
  },
  {
    id: 'search-calculator',
    name: 'Intent - Preisrechner',
    type: 'search',
    status: 'active',
    budget: { daily: 150, monthly: 4500 },
    targeting: {
      locations: ['CH'],
      keywords: [
        'umzug kosten rechner',
        'umzugskosten berechnen',
        'was kostet ein umzug',
        'umzug preisrechner',
        'umzugskalkulator',
      ],
      audiences: [],
    },
    bidStrategy: 'target_cpa',
    targetCpa: 18,
    landingPage: '/preisrechner',
    utmParams: {
      source: 'google',
      medium: 'cpc',
      campaign: 'intent_calculator',
    },
    expectedMetrics: { ctr: 7, conversionRate: 11, cpc: 2, cpa: 18 },
  },
  {
    id: 'search-cleaning',
    name: 'Service - Endreinigung',
    type: 'search',
    status: 'active',
    budget: { daily: 60, monthly: 1800 },
    targeting: {
      locations: ['CH'],
      keywords: [
        'endreinigung umzug',
        'wohnungsreinigung auszug',
        'umzugsreinigung kosten',
        'abgabereinigung wohnung',
      ],
      audiences: [],
    },
    bidStrategy: 'target_cpa',
    targetCpa: 15,
    landingPage: '/reinigung',
    utmParams: {
      source: 'google',
      medium: 'cpc',
      campaign: 'service_cleaning',
    },
    expectedMetrics: { ctr: 6.5, conversionRate: 10, cpc: 1.5, cpa: 15 },
  },
  {
    id: 'remarketing-visitors',
    name: 'Remarketing - Site Visitors',
    type: 'remarketing',
    status: 'active',
    budget: { daily: 40, monthly: 1200 },
    targeting: {
      locations: ['CH'],
      keywords: [],
      audiences: ['site_visitors_30d', 'calculator_users', 'form_abandoners'],
    },
    bidStrategy: 'target_cpa',
    targetCpa: 12,
    landingPage: '/umzugsofferten',
    utmParams: {
      source: 'google',
      medium: 'remarketing',
      campaign: 'rmkt_visitors',
    },
    expectedMetrics: { ctr: 0.8, conversionRate: 15, cpc: 0.8, cpa: 12 },
  },
  {
    id: 'pmax-moving',
    name: 'Performance Max - Umzug CH',
    type: 'pmax',
    status: 'draft',
    budget: { daily: 100, monthly: 3000 },
    targeting: {
      locations: ['CH'],
      keywords: [],
      audiences: ['in_market_moving', 'real_estate_seekers'],
      demographics: {
        ageRange: '25-54',
        income: 'top_30%',
      },
    },
    bidStrategy: 'maximize_conversions',
    landingPage: '/',
    utmParams: {
      source: 'google',
      medium: 'pmax',
      campaign: 'pmax_moving_ch',
    },
    expectedMetrics: { ctr: 2, conversionRate: 6, cpc: 1.5, cpa: 25 },
  },
];

// Ad copy templates
export const AD_COPY_TEMPLATES = {
  headlines: {
    brand: [
      'Umzugscheck.ch | Offizielle Seite',
      '5 Offerten in 24 Stunden',
      '100% Kostenlos Vergleichen',
      'Geprüfte Schweizer Firmen',
    ],
    generic: [
      'Umzugsfirmen Vergleichen',
      'Bis zu 40% Sparen',
      '5 Offerten Kostenlos',
      'Schweizer Qualität',
      'Jetzt Preise Vergleichen',
      'Günstig & Sicher Umziehen',
    ],
    city: [
      'Umzug {city} | Top Firmen',
      'Umzugsfirma {city} Finden',
      '{city} Umzug Vergleichen',
      'Beste Preise in {city}',
    ],
    calculator: [
      'Umzugskosten Berechnen',
      'Gratis Preisrechner',
      'In 2 Min. Wissen Was Es Kostet',
      'Jetzt Kosten Kalkulieren',
    ],
  },
  descriptions: {
    brand: [
      'Die #1 Vergleichsplattform für Umzüge in der Schweiz. Geprüfte Firmen, faire Preise, 24h Antwort.',
      'Vergleichen Sie jetzt 5 Angebote von verifizierten Umzugsfirmen. 100% kostenlos & unverbindlich.',
    ],
    generic: [
      'Erhalten Sie in 24h bis zu 5 Offerten von geprüften Schweizer Umzugsfirmen. Kostenlos vergleichen!',
      'Sparen Sie bis zu 40% bei Ihrem Umzug. Jetzt Preise vergleichen und die beste Firma finden.',
    ],
    city: [
      'Die besten Umzugsfirmen in {city} im Vergleich. Kostenlos Offerten anfordern & clever sparen.',
      'Umzug in {city}? Vergleichen Sie jetzt lokale Firmen und erhalten Sie faire Angebote.',
    ],
    calculator: [
      'Berechnen Sie in 2 Minuten, was Ihr Umzug kostet. Gratis Preisrechner mit Schweizer Marktdaten.',
      'Unser intelligenter Rechner zeigt Ihnen den fairen Preis. Jetzt kostenlos kalkulieren!',
    ],
  },
};

// UTM tracking utilities
export const buildUTMUrl = (baseUrl: string, params: UTMParams): string => {
  const url = new URL(baseUrl, window.location.origin);
  url.searchParams.set('utm_source', params.source);
  url.searchParams.set('utm_medium', params.medium);
  url.searchParams.set('utm_campaign', params.campaign);
  if (params.content) url.searchParams.set('utm_content', params.content);
  if (params.term) url.searchParams.set('utm_term', params.term);
  return url.toString();
};

export const parseUTMParams = (): UTMParams | null => {
  const params = new URLSearchParams(window.location.search);
  const source = params.get('utm_source');
  const medium = params.get('utm_medium');
  const campaign = params.get('utm_campaign');
  
  if (!source || !medium || !campaign) return null;
  
  return {
    source,
    medium,
    campaign,
    content: params.get('utm_content') || undefined,
    term: params.get('utm_term') || undefined,
  };
};

export const storeUTMParams = (): void => {
  const params = parseUTMParams();
  if (params) {
    sessionStorage.setItem('utm_params', JSON.stringify(params));
    sessionStorage.setItem('utm_landing_page', window.location.pathname);
    sessionStorage.setItem('utm_timestamp', new Date().toISOString());
  }
};

export const getStoredUTMParams = (): UTMParams | null => {
  const stored = sessionStorage.getItem('utm_params');
  return stored ? JSON.parse(stored) : null;
};

// Campaign performance calculations
export const calculateCampaignROI = (
  spend: number,
  leads: number,
  conversionRate: number,
  revenuePerCustomer: number
): { roi: number; roas: number; costPerLead: number; costPerCustomer: number } => {
  const customers = leads * (conversionRate / 100);
  const revenue = customers * revenuePerCustomer;
  const costPerLead = spend / leads;
  const costPerCustomer = spend / customers;
  const profit = revenue - spend;
  const roi = (profit / spend) * 100;
  const roas = revenue / spend;
  
  return { roi, roas, costPerLead, costPerCustomer };
};

// Monthly budget allocation
export const MONTHLY_BUDGET_ALLOCATION = {
  totalBudget: 20000,
  allocation: {
    search: { percentage: 60, amount: 12000 },
    remarketing: { percentage: 15, amount: 3000 },
    pmax: { percentage: 15, amount: 3000 },
    display: { percentage: 10, amount: 2000 },
  },
  expectedResults: {
    impressions: 500000,
    clicks: 15000,
    leads: 1200,
    customers: 96,
    revenue: 52800, // 96 * 550 CHF avg
    roas: 2.64,
  },
};

// Conversion tracking events
export const CONVERSION_EVENTS = {
  lead_form_submit: { value: 50, category: 'lead' },
  calculator_complete: { value: 20, category: 'engagement' },
  phone_call_click: { value: 30, category: 'lead' },
  whatsapp_click: { value: 25, category: 'lead' },
  company_profile_view: { value: 5, category: 'engagement' },
  quote_request: { value: 75, category: 'lead' },
  booking_complete: { value: 200, category: 'transaction' },
};

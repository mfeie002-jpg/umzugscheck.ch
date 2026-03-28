/**
 * Funnel Test Helpers
 * Provides test personas, test data, and selectors for E2E testing
 * Used by Playwright, Lovable Agent, and external QA agents
 */

// ============================================
// TEST PERSONAS
// ============================================

export interface TestPersona {
  name: string;
  email: string;
  phone: string;
  fromPostal: string;
  toPostal: string;
  rooms: string;
  moveDate: string;
  description: string;
  category: 'private' | 'business' | 'cleaning-only' | 'mixed';
}

export const TEST_PERSONAS = {
  P1_PRIVATE_ZUG: {
    name: 'Max Test',
    email: 'max.test+umzug@example.com',
    phone: '+41 79 000 00 01',
    fromPostal: '8001',
    toPostal: '6300',
    rooms: '3',
    moveDate: '2026-03-15',
    description: 'Private move from Zurich to Zug, 2.5–3.5 rooms',
    category: 'private',
  } as TestPersona,

  P2_PRIVATE_CLEANING: {
    name: 'Mia Muster',
    email: 'mia.muster+umzug@example.com',
    phone: '+41 79 000 00 02',
    fromPostal: '6003',
    toPostal: '6300',
    rooms: '2.5',
    moveDate: '2026-03-22',
    description: 'Private move + end-of-tenancy cleaning',
    category: 'mixed',
  } as TestPersona,

  P3_CLEANING_ONLY: {
    name: 'Peter Sauber',
    email: 'peter.sauber+umzug@example.com',
    phone: '+41 79 000 00 03',
    fromPostal: '3011',
    toPostal: '',
    rooms: '0',
    moveDate: '',
    description: 'End-of-tenancy cleaning only',
    category: 'cleaning-only',
  } as TestPersona,

  P4_BUSINESS: {
    name: 'Franz Gesch',
    email: 'franz.gesch+umzug@example.com',
    phone: '+41 79 000 00 04',
    fromPostal: '8001',
    toPostal: '8003',
    rooms: '8',
    moveDate: '2026-04-01',
    description: 'Small office move, 3–10 workstations',
    category: 'business',
  } as TestPersona,

  P5_MOBILE_IMPATIENT: {
    name: 'Rapidus User',
    email: 'rapid.user+umzug@example.com',
    phone: '+41 79 000 00 05',
    fromPostal: '8001',
    toPostal: '8002',
    rooms: '1',
    moveDate: '2026-02-28',
    description: 'Mobile user, impatient, easily drops if friction',
    category: 'private',
  } as TestPersona,
};

// ============================================
// CORE 20 FUNNELS INVENTORY
// ============================================

export interface FunnelDefinition {
  id: number;
  name: string;
  route: string;
  priority: 'Critical' | 'High' | 'Medium';
  persona: keyof typeof TEST_PERSONAS;
  entryPoint: string;
  expectedGoal: string;
  minKPI: number; // Minimum expected success rate
  tags: string[];
}

export const CORE_20_FUNNELS: FunnelDefinition[] = [
  // Critical Funnels
  {
    id: 1,
    name: 'Homepage Smart Router',
    route: '/',
    priority: 'Critical',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'PLZ input or Method Selection',
    expectedGoal: 'Route to /vergleich or specific flow',
    minKPI: 15, // >15% CTA click rate
    tags: ['home', 'entry', 'router'],
  },
  {
    id: 2,
    name: 'Vergleich Wizard',
    route: '/vergleich',
    priority: 'Critical',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'PLZ + Rooms + Date form',
    expectedGoal: 'Lead submission → Thank you page',
    minKPI: 25, // >25% completion rate
    tags: ['core', 'conversion', 'wizard'],
  },
  {
    id: 3,
    name: 'Video-Offerte',
    route: '/video',
    priority: 'Critical',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'Video upload interface',
    expectedGoal: 'AI analysis → Price estimate → Lead',
    minKPI: 40, // >40% upload completion
    tags: ['video', 'ai', 'upload'],
  },
  {
    id: 5,
    name: 'Firmenverzeichnis',
    route: '/umzugsfirmen',
    priority: 'Critical',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'Company list with filters',
    expectedGoal: 'View company or request offer',
    minKPI: 35, // >35% profile view rate
    tags: ['companies', 'list', 'filter'],
  },
  {
    id: 6,
    name: 'Beste Firmen Ranking',
    route: '/beste-umzugsfirma',
    priority: 'Critical',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'Top-rated ranking list',
    expectedGoal: 'Request offers from top companies',
    minKPI: 20, // >20% multi-select rate
    tags: ['ranking', 'social-proof', 'best'],
  },
  {
    id: 11,
    name: 'Region Zürich',
    route: '/umzugsfirmen/zuerich',
    priority: 'Critical',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'Local company list (Zurich)',
    expectedGoal: 'Request regional offers',
    minKPI: 25, // >25% local engagement
    tags: ['regional', 'location', 'zuerich'],
  },

  // High Priority Funnels
  {
    id: 4,
    name: 'AI Photo Upload',
    route: '/rechner/ai',
    priority: 'High',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'Photo upload (drag & drop)',
    expectedGoal: 'Inventory detection → Price estimate',
    minKPI: 30, // >30% photo upload rate
    tags: ['ai', 'photo', 'estimate'],
  },
  {
    id: 7,
    name: 'Günstige Firmen',
    route: '/guenstige-umzugsfirma',
    priority: 'High',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'Price-sorted ranking list',
    expectedGoal: 'Request offers from cheap companies',
    minKPI: 20,
    tags: ['ranking', 'cheap', 'budget'],
  },
  {
    id: 8,
    name: 'Firmenprofil',
    route: '/firma/:slug',
    priority: 'High',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'Company detail page',
    expectedGoal: 'Request offer from this company',
    minKPI: 15, // >15% contact rate
    tags: ['profile', 'detail', 'company'],
  },
  {
    id: 9,
    name: 'Reinigungsrechner',
    route: '/rechner/reinigung',
    priority: 'High',
    persona: 'P2_PRIVATE_CLEANING',
    entryPoint: 'Cleaning service form',
    expectedGoal: 'Price estimate → Request',
    minKPI: 40, // >40% completion
    tags: ['calculator', 'cleaning', 'service'],
  },
  {
    id: 10,
    name: 'Entsorgungsrechner',
    route: '/rechner/entsorgung',
    priority: 'High',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'Disposal service form',
    expectedGoal: 'Price estimate → Request',
    minKPI: 40,
    tags: ['calculator', 'disposal', 'service'],
  },
  {
    id: 12,
    name: 'Region Bern',
    route: '/umzugsfirmen/bern',
    priority: 'High',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'Local company list (Bern)',
    expectedGoal: 'Request regional offers',
    minKPI: 25,
    tags: ['regional', 'location', 'bern'],
  },
  {
    id: 13,
    name: 'Privatumzug Service',
    route: '/privatumzug',
    priority: 'High',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'Service landing page',
    expectedGoal: 'Route to main calculator',
    minKPI: 20, // >20% CTA click rate
    tags: ['service', 'private', 'landing'],
  },
  {
    id: 14,
    name: 'Firmenumzug Service',
    route: '/firmenumzug',
    priority: 'High',
    persona: 'P4_BUSINESS',
    entryPoint: 'Business service landing page',
    expectedGoal: 'Route to main calculator',
    minKPI: 20,
    tags: ['service', 'business', 'landing'],
  },
  {
    id: 18,
    name: 'Für Firmen (B2B)',
    route: '/fuer-firmen',
    priority: 'High',
    persona: 'P4_BUSINESS',
    entryPoint: 'Provider/partner signup',
    expectedGoal: 'Registration or contact',
    minKPI: 5, // >5% sign-up rate
    tags: ['b2b', 'provider', 'portal'],
  },

  // Medium Priority Funnels
  {
    id: 15,
    name: 'Umzugskosten Guide',
    route: '/umzugskosten',
    priority: 'Medium',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'Information page',
    expectedGoal: 'CTA to calculator or offers',
    minKPI: 10, // >10% cross-link click rate
    tags: ['guide', 'info', 'seo'],
  },
  {
    id: 16,
    name: 'Checkliste',
    route: '/umzugscheckliste',
    priority: 'Medium',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'Checklist page',
    expectedGoal: 'Download or CTA click',
    minKPI: 10,
    tags: ['checklist', 'guide', 'content'],
  },
  {
    id: 17,
    name: 'FAQ',
    route: '/faq',
    priority: 'Medium',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'FAQ page',
    expectedGoal: 'Answer found or CTA clicked',
    minKPI: 10,
    tags: ['faq', 'help', 'support'],
  },
  {
    id: 19,
    name: 'Lagerrechner',
    route: '/rechner/lager',
    priority: 'Medium',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'Storage service form',
    expectedGoal: 'Price estimate → Request',
    minKPI: 40,
    tags: ['calculator', 'storage', 'service'],
  },
  {
    id: 20,
    name: 'Packservice',
    route: '/rechner/packservice',
    priority: 'Medium',
    persona: 'P1_PRIVATE_ZUG',
    entryPoint: 'Packing service form',
    expectedGoal: 'Price estimate → Request',
    minKPI: 40,
    tags: ['calculator', 'packing', 'service'],
  },
];

// ============================================
// TEST SELECTORS (CSS/ARIA for E2E Tests)
// ============================================

export const TEST_SELECTORS = {
  // Global
  MAIN_CTA: '[data-testid="main-cta"], [data-testid="primary-cta"], button:has-text("Offerten"), button:has-text("Weiter")',
  FORM_SUBMIT: 'button[type="submit"], [data-testid="submit-btn"]',
  POSTAL_INPUT: 'input[placeholder*="PLZ"], input[name="postal"], input[name="from_postal"]',
  EMAIL_INPUT: 'input[type="email"], input[name="email"]',
  PHONE_INPUT: 'input[type="tel"], input[name="phone"]',
  ROOMS_INPUT: 'input[name="rooms"], input[name="room_count"], select[name="rooms"]',
  ERROR_MESSAGE: '[role="alert"], .error-message, .text-red-500',
  SUCCESS_MESSAGE: '[role="status"], .success-message, .text-green-500',
  THANK_YOU: '[data-testid="thank-you"], h1:has-text("Danke"), h1:has-text("Vielen Dank")',

  // Video Flow
  VIDEO_UPLOAD: '[data-testid="video-upload"], input[accept="video/*"]',
  VIDEO_SUBMIT: '[data-testid="video-submit"], button:has-text("Hochladen")',

  // Photo/AI Upload
  PHOTO_UPLOAD: '[data-testid="photo-upload"], input[accept="image/*"]',
  AI_RESULT: '[data-testid="ai-result"], .inventory-result',

  // Calculator
  CALCULATOR_FORM: '[data-testid="calculator-form"]',
  ROOM_SELECTOR: '[data-testid="room-selector"], select[name="rooms"]',
  SERVICE_TOGGLE: '[data-testid="service-toggle"], input[type="checkbox"]',
  PRICE_RESULT: '[data-testid="price-result"], .price-estimate',
  REQUEST_OFFER_BTN: 'button:has-text("Offerte"), button:has-text("Anfragen")',

  // Company Pages
  COMPANY_LIST: '[data-testid="company-list"], ul[role="list"]',
  COMPANY_CARD: '[data-testid="company-card"], .company-item',
  FILTER_BAR: '[data-testid="filter-bar"], .filters',
  SORT_DROPDOWN: 'select[name="sort"], [data-testid="sort-control"]',

  // Ranking Pages
  RANKING_LIST: '[data-testid="ranking-list"], .ranking-list',
  CHECKBOX_SELECT: 'input[type="checkbox"][name*="company"]',

  // Navigation
  NAVBAR: '[data-testid="navigation"], nav',
  LOGO: '[data-testid="logo"], a:has(img)',
  STICKY_CTA: '[data-testid="sticky-cta"], .sticky-cta',

  // Mobile
  MOBILE_MENU: '[data-testid="mobile-menu"], button[aria-label="Menu"]',
  BACK_BUTTON: 'button:has-text("Zurück"), [aria-label="Back"]',

  // Consent/Popups
  COOKIE_ACCEPT: 'button:has-text("Akzeptieren"), button:has-text("Accept")',
  CLOSE_POPUP: 'button[aria-label="Close"], button:contains("✕")',
};

// ============================================
// FLOW TEST CONFIGURATION
// ============================================

export interface FlowTestConfig {
  baseUrl: string;
  viewport: { width: number; height: number };
  timeout: number;
  headless: boolean;
  slowMo: number;
}

export const DEFAULT_TEST_CONFIG: FlowTestConfig = {
  baseUrl: 'https://umzugscheckv2.lovable.app',
  viewport: { width: 1920, height: 1080 },
  timeout: 30000,
  headless: true,
  slowMo: 0,
};

export const MOBILE_TEST_CONFIG: FlowTestConfig = {
  baseUrl: 'https://umzugscheckv2.lovable.app',
  viewport: { width: 390, height: 844 },
  timeout: 30000,
  headless: true,
  slowMo: 100, // Slightly slower on mobile
};

// ============================================
// TEST UTILITIES
// ============================================

/**
 * Get test data for a persona
 */
export function getPersonaData(personaKey: keyof typeof TEST_PERSONAS) {
  return TEST_PERSONAS[personaKey];
}

/**
 * Get funnel definition by ID
 */
export function getFunnelById(id: number): FunnelDefinition | undefined {
  return CORE_20_FUNNELS.find((f) => f.id === id);
}

/**
 * Get all funnels by priority
 */
export function getFunnelsByPriority(priority: 'Critical' | 'High' | 'Medium'): FunnelDefinition[] {
  return CORE_20_FUNNELS.filter((f) => f.priority === priority);
}

/**
 * Generate test report metadata
 */
export function generateTestMetadata() {
  return {
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString('de-CH'),
    totalFunnels: CORE_20_FUNNELS.length,
    criticalFunnels: CORE_20_FUNNELS.filter((f) => f.priority === 'Critical').length,
    highFunnels: CORE_20_FUNNELS.filter((f) => f.priority === 'High').length,
    mediumFunnels: CORE_20_FUNNELS.filter((f) => f.priority === 'Medium').length,
  };
}

/**
 * Fake data generator for forms
 */
export function generateFakePostal() {
  const codes = ['8001', '8002', '3011', '6003', '6300', '1201'];
  return codes[Math.floor(Math.random() * codes.length)];
}

export function generateFakeEmail() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let email = '';
  for (let i = 0; i < 8; i++) {
    email += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${email}+umzug@example.com`;
}

export function generateFakePhone() {
  return `+41 79 ${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')} ${String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')} ${String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')}`;
}

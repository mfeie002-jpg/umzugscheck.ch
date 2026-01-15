/**
 * E2E Test Configuration and Helpers
 * Ready for Playwright/Vitest integration
 */

// Test selectors for critical flows
export const TEST_SELECTORS = {
  // Navigation
  nav: {
    home: '[data-testid="nav-home"]',
    calculator: '[data-testid="nav-calculator"]',
    companies: '[data-testid="nav-companies"]',
    offertenCta: '[data-testid="cta-offerten"]',
  },
  
  // Calculator Flow
  calculator: {
    fromPostal: '[data-testid="from-postal"]',
    toPostal: '[data-testid="to-postal"]',
    rooms: '[data-testid="rooms-select"]',
    submitBtn: '[data-testid="calculator-submit"]',
    result: '[data-testid="calculator-result"]',
  },
  
  // Lead Form
  leadForm: {
    name: '[data-testid="lead-name"]',
    email: '[data-testid="lead-email"]',
    phone: '[data-testid="lead-phone"]',
    submit: '[data-testid="lead-submit"]',
    success: '[data-testid="lead-success"]',
  },
  
  // Company Cards
  company: {
    card: '[data-testid="company-card"]',
    rating: '[data-testid="company-rating"]',
    cta: '[data-testid="company-cta"]',
  },
};

// Critical user flows to test
export const CRITICAL_FLOWS = [
  {
    name: 'Homepage to Calculator',
    steps: ['visit /', 'click CTA', 'fill form', 'submit', 'verify result'],
  },
  {
    name: 'Full Lead Submission',
    steps: ['calculator', 'select companies', 'fill contact', 'submit', 'verify thank you'],
  },
  {
    name: 'Company Profile View',
    steps: ['visit /umzugsfirmen', 'click company', 'verify profile loads'],
  },
];

// Test data
export const TEST_DATA = {
  validPostalCodes: ['8001', '3000', '4001', '6003'],
  validEmail: 'test@example.com',
  validPhone: '+41 44 123 45 67',
  validName: 'Test User',
};

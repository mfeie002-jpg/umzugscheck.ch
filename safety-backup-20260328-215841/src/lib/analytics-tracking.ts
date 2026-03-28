/**
 * Comprehensive Analytics Tracking for Hotjar/Contentsquare
 * Tracks all meaningful user interactions across the platform
 */

// Event categories for organization
export type EventCategory = 
  | 'conversion'
  | 'engagement'
  | 'navigation'
  | 'calculator'
  | 'company'
  | 'form'
  | 'user';

export interface TrackingEvent {
  name: string;
  category: EventCategory;
  properties?: Record<string, string | number | boolean>;
}

// Check if Hotjar/Contentsquare is available
const isHotjarAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).hj === 'function';
};

// Check if Contentsquare is available
const isContentsquareAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any)._uxa === 'object';
};

/**
 * Core tracking function - sends events to Hotjar/Contentsquare
 */
export function trackEvent(event: TrackingEvent): void {
  const { name, category, properties } = event;
  const eventName = `${category}_${name}`;
  
  // Log in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, properties);
  }

  // Hotjar Events API
  if (isHotjarAvailable()) {
    try {
      (window as any).hj('event', eventName);
      
      // Also set user attributes if properties provided
      if (properties) {
        (window as any).hj('identify', null, properties);
      }
    } catch (e) {
      console.warn('Hotjar tracking error:', e);
    }
  }

  // Contentsquare Dynamic Variables
  if (isContentsquareAvailable()) {
    try {
      (window as any)._uxa = (window as any)._uxa || [];
      (window as any)._uxa.push(['trackDynamicVariable', { key: eventName, value: properties ? JSON.stringify(properties) : 'true' }]);
    } catch (e) {
      console.warn('Contentsquare tracking error:', e);
    }
  }
}

/**
 * Track page view with custom properties
 */
export function trackPageView(pageName: string, properties?: Record<string, string | number>): void {
  trackEvent({
    name: 'page_view',
    category: 'navigation',
    properties: { page: pageName, ...properties }
  });

  // Contentsquare virtual pageview
  if (isContentsquareAvailable()) {
    try {
      (window as any)._uxa.push(['trackPageview', pageName]);
    } catch (e) {
      // Silently fail
    }
  }
}

// ============================================================================
// CONVERSION EVENTS - High-value user actions
// ============================================================================

export const ConversionEvents = {
  /** User submitted an offerte/lead request */
  offerteSubmitted: (data: { 
    calculatorType: string; 
    fromCity: string; 
    toCity: string;
    companiesSelected: number;
  }) => trackEvent({
    name: 'offerte_submitted',
    category: 'conversion',
    properties: data
  }),

  /** User completed a calculator flow */
  calculatorCompleted: (data: {
    version: string;
    estimatedPrice?: number;
    duration?: number;
  }) => trackEvent({
    name: 'calculator_completed',
    category: 'conversion',
    properties: data
  }),

  /** User clicked to call a company */
  phoneClicked: (data: { companyId: string; companyName: string }) => trackEvent({
    name: 'phone_clicked',
    category: 'conversion',
    properties: data
  }),

  /** User clicked company website */
  websiteClicked: (data: { companyId: string; companyName: string }) => trackEvent({
    name: 'website_clicked',
    category: 'conversion',
    properties: data
  }),

  /** User requested offerte from specific company */
  companyOfferteRequested: (data: { companyId: string; companyName: string }) => trackEvent({
    name: 'company_offerte_requested',
    category: 'conversion',
    properties: data
  }),
};

// ============================================================================
// CALCULATOR EVENTS - Funnel tracking
// ============================================================================

export const CalculatorEvents = {
  /** User started a calculator */
  started: (version: string) => trackEvent({
    name: 'started',
    category: 'calculator',
    properties: { version }
  }),

  /** User progressed to next step */
  stepCompleted: (data: { version: string; step: number; stepName: string }) => trackEvent({
    name: 'step_completed',
    category: 'calculator',
    properties: data
  }),

  /** User abandoned calculator */
  abandoned: (data: { version: string; lastStep: number }) => trackEvent({
    name: 'abandoned',
    category: 'calculator',
    properties: data
  }),

  /** User selected services */
  servicesSelected: (data: { version: string; services: string[] }) => trackEvent({
    name: 'services_selected',
    category: 'calculator',
    properties: { version: data.version, services: data.services.join(','), serviceCount: data.services.length }
  }),

  /** User selected companies */
  companiesSelected: (data: { version: string; count: number }) => trackEvent({
    name: 'companies_selected',
    category: 'calculator',
    properties: data
  }),

  /** Price estimate shown */
  priceShown: (data: { version: string; priceMin: number; priceMax: number }) => trackEvent({
    name: 'price_shown',
    category: 'calculator',
    properties: data
  }),
};

// ============================================================================
// COMPANY EVENTS - Company interaction tracking
// ============================================================================

export const CompanyEvents = {
  /** User viewed company profile */
  profileViewed: (data: { companyId: string; companyName: string; source?: string }) => trackEvent({
    name: 'profile_viewed',
    category: 'company',
    properties: data
  }),

  /** User compared companies */
  compared: (data: { companyIds: string[]; count: number }) => trackEvent({
    name: 'compared',
    category: 'company',
    properties: { companyIds: data.companyIds.join(','), count: data.count }
  }),

  /** User clicked on sponsored company */
  sponsoredClicked: (data: { companyId: string; companyName: string; position: number }) => trackEvent({
    name: 'sponsored_clicked',
    category: 'company',
    properties: data
  }),

  /** User filtered companies */
  filtered: (data: { filterType: string; filterValue: string }) => trackEvent({
    name: 'filtered',
    category: 'company',
    properties: data
  }),

  /** User sorted companies */
  sorted: (sortBy: string) => trackEvent({
    name: 'sorted',
    category: 'company',
    properties: { sortBy }
  }),

  /** User viewed reviews */
  reviewsViewed: (data: { companyId: string; reviewCount: number }) => trackEvent({
    name: 'reviews_viewed',
    category: 'company',
    properties: data
  }),
};

// ============================================================================
// FORM EVENTS - Form interaction tracking
// ============================================================================

export const FormEvents = {
  /** User started filling a form */
  started: (formName: string) => trackEvent({
    name: 'started',
    category: 'form',
    properties: { formName }
  }),

  /** User focused on a field */
  fieldFocused: (data: { formName: string; fieldName: string }) => trackEvent({
    name: 'field_focused',
    category: 'form',
    properties: data
  }),

  /** User submitted a form */
  submitted: (data: { formName: string; success: boolean }) => trackEvent({
    name: 'submitted',
    category: 'form',
    properties: data
  }),

  /** Form validation error */
  validationError: (data: { formName: string; fieldName: string; errorType: string }) => trackEvent({
    name: 'validation_error',
    category: 'form',
    properties: data
  }),

  /** Newsletter signup */
  newsletterSignup: (source: string) => trackEvent({
    name: 'newsletter_signup',
    category: 'form',
    properties: { source }
  }),
};

// ============================================================================
// USER EVENTS - User account actions
// ============================================================================

export const UserEvents = {
  /** User signed up */
  signedUp: (method: string) => trackEvent({
    name: 'signed_up',
    category: 'user',
    properties: { method }
  }),

  /** User logged in */
  loggedIn: (method: string) => trackEvent({
    name: 'logged_in',
    category: 'user',
    properties: { method }
  }),

  /** User submitted a review */
  reviewSubmitted: (data: { companyId: string; rating: number }) => trackEvent({
    name: 'review_submitted',
    category: 'user',
    properties: data
  }),
};

// ============================================================================
// ENGAGEMENT EVENTS - General engagement tracking
// ============================================================================

export const EngagementEvents = {
  /** User opened FAQ item */
  faqOpened: (question: string) => trackEvent({
    name: 'faq_opened',
    category: 'engagement',
    properties: { question: question.substring(0, 50) }
  }),

  /** User scrolled to section */
  sectionViewed: (sectionName: string) => trackEvent({
    name: 'section_viewed',
    category: 'engagement',
    properties: { section: sectionName }
  }),

  /** User clicked CTA button */
  ctaClicked: (data: { ctaName: string; location: string }) => trackEvent({
    name: 'cta_clicked',
    category: 'engagement',
    properties: data
  }),

  /** User used search */
  searched: (data: { query: string; resultsCount: number }) => trackEvent({
    name: 'searched',
    category: 'engagement',
    properties: data
  }),

  /** User selected region */
  regionSelected: (region: string) => trackEvent({
    name: 'region_selected',
    category: 'engagement',
    properties: { region }
  }),

  /** User interacted with slider */
  sliderUsed: (data: { sliderName: string; value: number }) => trackEvent({
    name: 'slider_used',
    category: 'engagement',
    properties: data
  }),

  /** User downloaded content */
  downloadClicked: (data: { contentType: string; contentName: string }) => trackEvent({
    name: 'download_clicked',
    category: 'engagement',
    properties: data
  }),

  /** User shared content */
  shareClicked: (data: { platform: string; contentType: string }) => trackEvent({
    name: 'share_clicked',
    category: 'engagement',
    properties: data
  }),

  /** User toggled chat/support */
  supportOpened: (source: string) => trackEvent({
    name: 'support_opened',
    category: 'engagement',
    properties: { source }
  }),

  /** Time spent on page */
  timeSpent: (data: { page: string; seconds: number }) => trackEvent({
    name: 'time_spent',
    category: 'engagement',
    properties: data
  }),
};

// ============================================================================
// NAVIGATION EVENTS
// ============================================================================

export const NavigationEvents = {
  /** User clicked internal link */
  internalLinkClicked: (data: { from: string; to: string }) => trackEvent({
    name: 'internal_link_clicked',
    category: 'navigation',
    properties: data
  }),

  /** User used breadcrumb */
  breadcrumbClicked: (level: number) => trackEvent({
    name: 'breadcrumb_clicked',
    category: 'navigation',
    properties: { level }
  }),

  /** User used back/forward */
  historyNavigation: (direction: 'back' | 'forward') => trackEvent({
    name: 'history_navigation',
    category: 'navigation',
    properties: { direction }
  }),

  /** Tab changed */
  tabChanged: (tabName: string) => trackEvent({
    name: 'tab_changed',
    category: 'navigation',
    properties: { tab: tabName }
  }),
};

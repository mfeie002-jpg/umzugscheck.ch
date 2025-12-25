/**
 * Analytics tracking with consent gating and V3 event map
 * 
 * CANONICAL EVENTS:
 * - page_viewed
 * - step_started
 * - step_completed  
 * - field_interacted
 * - option_selected
 * - service_toggled
 * - lead_submitted
 * - lead_confirmation_viewed
 * - error_occurred
 * - rage_click
 * - ab_test_impression
 * - ab_test_conversion
 * 
 * NO PII: Never send name, email, phone, exact addresses
 */

import { hasAnalyticsConsent, isDebugMode, logDebugEvent } from './consent';

export type AnalyticsEvent = 
  | 'page_viewed'
  | 'step_started'
  | 'step_completed'
  | 'field_interacted'
  | 'option_selected'
  | 'service_toggled'
  | 'lead_submitted'
  | 'lead_confirmation_viewed'
  | 'error_occurred'
  | 'rage_click'
  | 'ab_test_impression'
  | 'ab_test_conversion'
  // Legacy events for backwards compatibility
  | 'calculator_started'
  | 'calculator_completed'
  | 'service_selected'
  | 'upsell_selected'
  | 'company_viewed'
  | 'company_clicked'
  | 'company_bookmarked'
  | 'filter_applied';

export interface AnalyticsPayload {
  event: AnalyticsEvent;
  properties?: Record<string, any>;
  timestamp?: number;
  sessionId?: string;
}

// A/B Test variants storage
interface ABTestVariant {
  testName: string;
  variant: 'A' | 'B';
  assignedAt: number;
}

// Track which events have fired (for "once only" guards)
const firedEvents = new Set<string>();

class Analytics {
  private sessionId: string;
  private abTests: Map<string, ABTestVariant> = new Map();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadABTests();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadABTests() {
    try {
      const stored = localStorage.getItem('ab_tests');
      if (stored) {
        const tests = JSON.parse(stored);
        Object.entries(tests).forEach(([key, value]) => {
          this.abTests.set(key, value as ABTestVariant);
        });
      }
    } catch (e) {
      console.warn('Could not load A/B tests');
    }
  }

  private saveABTests() {
    try {
      const obj: Record<string, ABTestVariant> = {};
      this.abTests.forEach((value, key) => {
        obj[key] = value;
      });
      localStorage.setItem('ab_tests', JSON.stringify(obj));
    } catch (e) {
      console.warn('Could not save A/B tests');
    }
  }

  // Get or assign A/B test variant (variant assignment always works, tracking requires consent)
  getABTestVariant(testName: string): 'A' | 'B' {
    let test = this.abTests.get(testName);
    
    if (!test) {
      const variant: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
      test = {
        testName,
        variant,
        assignedAt: Date.now()
      };
      this.abTests.set(testName, test);
      this.saveABTests();
      
      // Track impression only if consent given
      this.track('ab_test_impression', {
        test_name: testName,
        variant
      });
    }
    
    return test.variant;
  }

  // Track A/B test conversion
  trackABTestConversion(testName: string, conversionType: string) {
    const test = this.abTests.get(testName);
    if (test) {
      this.track('ab_test_conversion', {
        test_name: testName,
        variant: test.variant,
        conversion_type: conversionType
      });
    }
  }

  // Core track method with consent gating
  track(event: AnalyticsEvent, properties?: Record<string, any>) {
    const payload: AnalyticsPayload = {
      event,
      properties: this.sanitizePayload(properties),
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    // Always log to debug overlay if debug mode
    if (isDebugMode()) {
      logDebugEvent(event, payload.properties || {});
    }

    // Only send to analytics if consent given
    if (hasAnalyticsConsent()) {
      this.sendToAnalytics(payload);
    } else if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics - BLOCKED by consent]', event, payload.properties);
    }
  }

  // Track with "once only" guard
  trackOnce(event: AnalyticsEvent, key: string, properties?: Record<string, any>) {
    const eventKey = `${event}:${key}`;
    if (firedEvents.has(eventKey)) {
      return; // Already fired
    }
    firedEvents.add(eventKey);
    this.track(event, properties);
  }

  // Sanitize payload - remove any PII
  private sanitizePayload(properties?: Record<string, any>): Record<string, any> | undefined {
    if (!properties) return undefined;
    
    // Fields that are NEVER allowed
    const forbiddenFields = [
      'name', 'email', 'phone', 'address', 'plz', 'postal',
      'fromAddress', 'toAddress', 'fromPLZ', 'toPLZ',
      'kontaktperson', 'telefon', 'vorname', 'nachname'
    ];
    
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(properties)) {
      const lowerKey = key.toLowerCase();
      
      // Skip forbidden fields
      if (forbiddenFields.some(f => lowerKey.includes(f.toLowerCase()))) {
        continue;
      }
      
      // Skip string values that look like PII
      if (typeof value === 'string') {
        // Skip emails
        if (value.includes('@')) continue;
        // Skip phone numbers (10+ digits)
        if (/\d{10,}/.test(value.replace(/\s/g, ''))) continue;
        // Skip full addresses (contains street indicators)
        if (/strasse|str\.|weg|platz|gasse/i.test(value)) continue;
      }
      
      sanitized[key] = value;
    }
    
    return sanitized;
  }

  // === V3 Event Methods ===

  // Page tracking
  trackPageView(page: string, source?: string) {
    this.trackOnce('page_viewed', `${page}-${this.sessionId}`, {
      page,
      source: source || 'direct',
      device: this.getDeviceType()
    });
  }

  // Step tracking
  trackStepStarted(step: number, stepName: string, formType: string = 'funnel') {
    this.trackOnce('step_started', `step-${step}-${this.sessionId}`, {
      step,
      step_name: stepName,
      form_type: formType
    });
  }

  trackStepCompleted(step: number, stepName: string, formType: string = 'funnel', durationMs?: number) {
    this.trackOnce('step_completed', `step-${step}-${this.sessionId}`, {
      step,
      step_name: stepName,
      form_type: formType,
      duration_ms: durationMs
    });
  }

  // Field interaction (NO values - just field name)
  trackFieldInteracted(step: number, field: string) {
    this.trackOnce('field_interacted', `field-${step}-${field}-${this.sessionId}`, {
      step,
      field
    });
  }

  // Option selection
  trackOptionSelected(step: number, option: string) {
    this.track('option_selected', {
      step,
      option
    });
  }

  // Service toggle
  trackServiceToggled(step: number, service: string, state: 'on' | 'off') {
    this.track('service_toggled', {
      step,
      service,
      state
    });
  }

  // Lead submitted - SAFE payload only
  trackLeadSubmitted(data: {
    calculatorType?: string;
    servicesCount: number;
    hasServices: boolean;
    source?: string;
  }) {
    this.trackOnce('lead_submitted', `lead-${this.sessionId}`, {
      calculator_type: data.calculatorType || 'full',
      services_count: data.servicesCount,
      has_services: data.hasServices,
      source: data.source || 'direct'
    });
  }

  // Confirmation viewed
  trackLeadConfirmationViewed() {
    this.trackOnce('lead_confirmation_viewed', `confirmation-${this.sessionId}`, {
      lead_status: 'submitted'
    });
  }

  // Error tracking (NO PII)
  trackError(page: string, step: number | null, context: string) {
    this.track('error_occurred', {
      page,
      step,
      context
    });
  }

  // === Legacy Methods (backwards compatible) ===

  trackServiceSelected(serviceName: string, selected: boolean, formType: string) {
    this.trackServiceToggled(0, serviceName, selected ? 'on' : 'off');
  }

  trackUpsellSelected(upsellType: string, value?: number) {
    this.track('service_toggled', {
      step: 0,
      service: upsellType,
      state: 'on'
    });
  }

  trackCalculatorStarted(calculatorType: 'quick' | 'advanced' | 'ai') {
    this.track('calculator_started', {
      calculator_type: calculatorType,
    });
  }

  trackCalculatorCompleted(calculatorType: string, result: any) {
    this.track('calculator_completed', {
      calculator_type: calculatorType,
    });
  }

  trackCompanyViewed(companyId: string, companyName: string) {
    this.track('company_viewed', {
      company_id: companyId,
    });
  }

  trackCompanyClicked(companyId: string, companyName: string, action: string) {
    this.track('company_clicked', {
      company_id: companyId,
      action,
    });
  }

  trackCompanyBookmarked(companyId: string, companyName: string, bookmarked: boolean) {
    this.track('company_bookmarked', {
      company_id: companyId,
      bookmarked
    });
  }

  trackFilterApplied(filters: Record<string, any>) {
    this.track('filter_applied', {
      filter_count: Object.keys(filters).filter(k => filters[k]).length,
    });
  }

  // Device detection helper
  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private sendToAnalytics(payload: AnalyticsPayload) {
    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', payload.event, {
        ...payload.properties,
        session_id: payload.sessionId,
      });
    }
    
    // Send to Hotjar
    if (typeof window !== 'undefined' && (window as any).hj) {
      try {
        (window as any).hj('event', payload.event);
        // Identify user attributes for Hotjar (if available)
        if (payload.properties) {
          (window as any).hj('identify', null, payload.properties);
        }
      } catch (e) {
        // Silently fail
      }
    }
    
    // Send to Contentsquare
    if (typeof window !== 'undefined' && (window as any)._uxa) {
      try {
        (window as any)._uxa.push(['trackDynamicVariable', { 
          key: payload.event, 
          value: payload.properties ? JSON.stringify(payload.properties) : 'true' 
        }]);
      } catch (e) {
        // Silently fail
      }
    }
    
    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', payload.event, payload.properties);
    }
  }

  // Reset fired events (useful for testing)
  resetFiredEvents() {
    firedEvents.clear();
  }
}

// Singleton instance
const analytics = new Analytics();

// React hook for analytics
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackOnce: analytics.trackOnce.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackStepStarted: analytics.trackStepStarted.bind(analytics),
    trackStepCompleted: analytics.trackStepCompleted.bind(analytics),
    trackFieldInteracted: analytics.trackFieldInteracted.bind(analytics),
    trackOptionSelected: analytics.trackOptionSelected.bind(analytics),
    trackServiceToggled: analytics.trackServiceToggled.bind(analytics),
    trackLeadSubmitted: analytics.trackLeadSubmitted.bind(analytics),
    trackLeadConfirmationViewed: analytics.trackLeadConfirmationViewed.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    // Legacy
    trackServiceSelected: analytics.trackServiceSelected.bind(analytics),
    trackUpsellSelected: analytics.trackUpsellSelected.bind(analytics),
    trackCalculatorStarted: analytics.trackCalculatorStarted.bind(analytics),
    trackCalculatorCompleted: analytics.trackCalculatorCompleted.bind(analytics),
    trackCompanyViewed: analytics.trackCompanyViewed.bind(analytics),
    trackCompanyClicked: analytics.trackCompanyClicked.bind(analytics),
    trackCompanyBookmarked: analytics.trackCompanyBookmarked.bind(analytics),
    trackFilterApplied: analytics.trackFilterApplied.bind(analytics),
    getABTestVariant: analytics.getABTestVariant.bind(analytics),
    trackABTestConversion: analytics.trackABTestConversion.bind(analytics),
  };
};

export default analytics;

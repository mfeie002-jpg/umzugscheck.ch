/**
 * Analytics tracking hooks and utilities
 * Enhanced with multi-step form tracking, A/B test support
 */

export type AnalyticsEvent = 
  | 'calculator_started'
  | 'calculator_completed'
  | 'step_started'
  | 'step_completed'
  | 'service_selected'
  | 'upsell_selected'
  | 'lead_submitted'
  | 'company_viewed'
  | 'company_clicked'
  | 'company_bookmarked'
  | 'filter_applied'
  | 'page_viewed'
  | 'error_occurred'
  | 'ab_test_impression'
  | 'ab_test_conversion';

export interface AnalyticsPayload {
  event: AnalyticsEvent;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

// A/B Test variants storage
interface ABTestVariant {
  testName: string;
  variant: 'A' | 'B';
  assignedAt: number;
}

class Analytics {
  private sessionId: string;
  private isEnabled: boolean;
  private abTests: Map<string, ABTestVariant> = new Map();

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = true;
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

  // Get or assign A/B test variant
  getABTestVariant(testName: string): 'A' | 'B' {
    let test = this.abTests.get(testName);
    
    if (!test) {
      // Randomly assign variant (50/50)
      const variant: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
      test = {
        testName,
        variant,
        assignedAt: Date.now()
      };
      this.abTests.set(testName, test);
      this.saveABTests();
      
      // Track impression
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

  track(event: AnalyticsEvent, properties?: Record<string, any>) {
    const payload: AnalyticsPayload = {
      event,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
    };

    if (this.isEnabled) {
      this.sendToAnalytics(payload);
    }
  }

  // Multi-step form tracking
  trackStepStarted(step: number, stepName: string, formType: string) {
    this.track('step_started', {
      step_number: step,
      step_name: stepName,
      form_type: formType
    });
  }

  trackStepCompleted(step: number, stepName: string, formType: string, duration?: number) {
    this.track('step_completed', {
      step_number: step,
      step_name: stepName,
      form_type: formType,
      duration_seconds: duration
    });
  }

  trackServiceSelected(serviceName: string, selected: boolean, formType: string) {
    this.track('service_selected', {
      service_name: serviceName,
      selected,
      form_type: formType
    });
  }

  trackUpsellSelected(upsellType: string, value?: number) {
    this.track('upsell_selected', {
      upsell_type: upsellType,
      estimated_value: value
    });
  }

  // Calculator tracking
  trackCalculatorStarted(calculatorType: 'quick' | 'advanced' | 'ai') {
    this.track('calculator_started', {
      calculator_type: calculatorType,
    });
  }

  trackCalculatorCompleted(calculatorType: string, result: any) {
    this.track('calculator_completed', {
      calculator_type: calculatorType,
      price_range: `${result.priceMin}-${result.priceMax}`,
      volume_m3: result.volumeM3,
      estimated_hours: result.estimatedHours,
    });
  }

  // Lead tracking
  trackLeadSubmitted(leadData: {
    calculatorType: string;
    moveDate: string;
    fromCity: string;
    toCity: string;
    priceRange: string;
    services?: string[];
  }) {
    this.track('lead_submitted', {
      ...leadData,
      services_count: leadData.services?.length || 0
    });
  }

  // Company tracking
  trackCompanyViewed(companyId: string, companyName: string) {
    this.track('company_viewed', {
      company_id: companyId,
      company_name: companyName,
    });
  }

  trackCompanyClicked(companyId: string, companyName: string, action: 'view_profile' | 'request_quote' | 'joint_quote_request' | 'call' | 'website') {
    this.track('company_clicked', {
      company_id: companyId,
      company_name: companyName,
      action,
    });
  }

  trackCompanyBookmarked(companyId: string, companyName: string, bookmarked: boolean) {
    this.track('company_bookmarked', {
      company_id: companyId,
      company_name: companyName,
      bookmarked
    });
  }

  trackFilterApplied(filters: Record<string, any>) {
    this.track('filter_applied', {
      filters,
      filter_count: Object.keys(filters).filter(k => filters[k]).length,
    });
  }

  trackPageView(pageName: string, path: string) {
    this.track('page_viewed', {
      page_name: pageName,
      path,
    });
  }

  trackError(error: string, context?: Record<string, any>) {
    this.track('error_occurred', {
      error_message: error,
      ...context,
    });
  }

  private sendToAnalytics(payload: AnalyticsPayload) {
    // Send to Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', payload.event, {
        ...payload.properties,
        session_id: payload.sessionId,
      });
    }
    
    // Console log for development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', payload.event, payload.properties);
    }
  }
}

// Singleton instance
const analytics = new Analytics();

// React hook for analytics
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackStepStarted: analytics.trackStepStarted.bind(analytics),
    trackStepCompleted: analytics.trackStepCompleted.bind(analytics),
    trackServiceSelected: analytics.trackServiceSelected.bind(analytics),
    trackUpsellSelected: analytics.trackUpsellSelected.bind(analytics),
    trackCalculatorStarted: analytics.trackCalculatorStarted.bind(analytics),
    trackCalculatorCompleted: analytics.trackCalculatorCompleted.bind(analytics),
    trackLeadSubmitted: analytics.trackLeadSubmitted.bind(analytics),
    trackCompanyViewed: analytics.trackCompanyViewed.bind(analytics),
    trackCompanyClicked: analytics.trackCompanyClicked.bind(analytics),
    trackCompanyBookmarked: analytics.trackCompanyBookmarked.bind(analytics),
    trackFilterApplied: analytics.trackFilterApplied.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    getABTestVariant: analytics.getABTestVariant.bind(analytics),
    trackABTestConversion: analytics.trackABTestConversion.bind(analytics),
  };
};

export default analytics;

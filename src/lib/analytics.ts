/**
 * Analytics tracking hooks and utilities
 * Simple console logging for now, easily extendable to GA4, Mixpanel, etc.
 */

export type AnalyticsEvent = 
  | 'calculator_started'
  | 'calculator_completed'
  | 'lead_submitted'
  | 'company_viewed'
  | 'company_clicked'
  | 'filter_applied'
  | 'page_viewed'
  | 'error_occurred';

export interface AnalyticsPayload {
  event: AnalyticsEvent;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

class Analytics {
  private sessionId: string;
  private isEnabled: boolean;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.isEnabled = true; // Always enabled for production
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

  // Specific tracking methods
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

  trackLeadSubmitted(leadData: {
    calculatorType: string;
    moveDate: string;
    fromCity: string;
    toCity: string;
    priceRange: string;
  }) {
    this.track('lead_submitted', leadData);
  }

  trackCompanyViewed(companyId: string, companyName: string) {
    this.track('company_viewed', {
      company_id: companyId,
      company_name: companyName,
    });
  }

  trackCompanyClicked(companyId: string, companyName: string, action: 'view_profile' | 'request_quote') {
    this.track('company_clicked', {
      company_id: companyId,
      company_name: companyName,
      action,
    });
  }

  trackFilterApplied(filters: Record<string, any>) {
    this.track('filter_applied', {
      filters,
      filter_count: Object.keys(filters).length,
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
  }
}

// Singleton instance
const analytics = new Analytics();

// React hook for analytics
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    trackCalculatorStarted: analytics.trackCalculatorStarted.bind(analytics),
    trackCalculatorCompleted: analytics.trackCalculatorCompleted.bind(analytics),
    trackLeadSubmitted: analytics.trackLeadSubmitted.bind(analytics),
    trackCompanyViewed: analytics.trackCompanyViewed.bind(analytics),
    trackCompanyClicked: analytics.trackCompanyClicked.bind(analytics),
    trackFilterApplied: analytics.trackFilterApplied.bind(analytics),
    trackPageView: analytics.trackPageView.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
  };
};

export default analytics;

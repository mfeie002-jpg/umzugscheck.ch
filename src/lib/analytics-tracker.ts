// Analytics tracking utilities
// Integrates with Google Analytics 4, Plausible, or any analytics service

interface EventParams {
  [key: string]: string | number | boolean;
}

class AnalyticsTracker {
  private isInitialized = false;

  init() {
    if (this.isInitialized) return;
    
    // Initialize analytics
    if (typeof window !== 'undefined') {
      this.isInitialized = true;
      console.log('Analytics initialized');
    }
  }

  // Track page views
  trackPageView(path: string, title?: string) {
    if (!this.isInitialized) return;
    
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: path,
        page_title: title || document.title,
      });
    }
    
    console.log('Page view tracked:', path, title);
  }

  // Track custom events
  trackEvent(eventName: string, params?: EventParams) {
    if (!this.isInitialized) return;
    
    // Google Analytics 4
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', eventName, params);
    }
    
    console.log('Event tracked:', eventName, params);
  }

  // Track calculator usage
  trackCalculatorStart(calculatorType: string) {
    this.trackEvent('calculator_started', {
      calculator_type: calculatorType,
    });
  }

  trackCalculatorComplete(calculatorType: string, result: any) {
    this.trackEvent('calculator_completed', {
      calculator_type: calculatorType,
      price_min: result.priceMin || 0,
      price_max: result.priceMax || 0,
    });
  }

  // Track lead generation
  trackLeadGeneration(leadData: any) {
    this.trackEvent('generate_lead', {
      value: leadData.estimatedValue || 0,
      lead_source: leadData.source || 'website',
    });
  }

  // Track company interactions
  trackCompanyView(companyId: string, companyName: string) {
    this.trackEvent('view_company', {
      company_id: companyId,
      company_name: companyName,
    });
  }

  trackCompanyClick(companyId: string, companyName: string, action: string) {
    this.trackEvent('company_interaction', {
      company_id: companyId,
      company_name: companyName,
      interaction_type: action,
    });
  }

  // Track conversions
  trackConversion(conversionType: string, value?: number) {
    this.trackEvent('conversion', {
      conversion_type: conversionType,
      value: value || 0,
    });
  }

  // Track user engagement
  trackScroll(scrollDepth: number) {
    this.trackEvent('scroll_depth', {
      depth_percentage: scrollDepth,
    });
  }

  trackTimeOnPage(duration: number) {
    this.trackEvent('time_on_page', {
      duration_seconds: duration,
    });
  }

  // Track feature usage
  trackFeatureUsage(featureName: string, params?: EventParams) {
    this.trackEvent('feature_used', {
      feature_name: featureName,
      ...params,
    });
  }

  // Track errors
  trackError(errorType: string, errorMessage: string) {
    this.trackEvent('error', {
      error_type: errorType,
      error_message: errorMessage,
    });
  }
}

export const analytics = new AnalyticsTracker();

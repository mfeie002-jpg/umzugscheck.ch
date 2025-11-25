/**
 * Tracking & Analytics Library
 * Handles conversion tracking, call tracking, and metrics
 */

export interface CallTrackingEvent {
  companyId: string;
  timestamp: Date;
  callDuration?: number;
  wasSuccessful?: boolean;
  callerPhone?: string;
}

export interface ConversionEvent {
  leadId: string;
  companyId: string;
  source: "calculator" | "ranking" | "profile" | "direct";
  value?: number;
}

export interface PageViewEvent {
  page: string;
  companyId?: string;
  referrer?: string;
}

/**
 * Track a phone call to a moving company
 */
export const trackCall = async (event: CallTrackingEvent): Promise<void> => {
  try {
    // In production, this would send to your analytics backend
    console.log("📞 Call tracked:", event);
    
    // Could integrate with:
    // - Google Analytics
    // - Custom backend API
    // - Call tracking service (e.g., CallRail)
    
    // Store in localStorage for demo
    const calls = JSON.parse(localStorage.getItem("call_tracking") || "[]");
    calls.push({
      ...event,
      timestamp: event.timestamp.toISOString(),
    });
    localStorage.setItem("call_tracking", JSON.stringify(calls.slice(-100)));
  } catch (error) {
    console.error("Failed to track call:", error);
  }
};

/**
 * Track a lead conversion
 */
export const trackConversion = async (event: ConversionEvent): Promise<void> => {
  try {
    console.log("✅ Conversion tracked:", event);
    
    // Store conversion data
    const conversions = JSON.parse(localStorage.getItem("conversions") || "[]");
    conversions.push({
      ...event,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("conversions", JSON.stringify(conversions.slice(-100)));
    
    // Could also trigger:
    // - Facebook Pixel
    // - Google Ads conversion
    // - Backend monetization tracking
  } catch (error) {
    console.error("Failed to track conversion:", error);
  }
};

/**
 * Track page view
 */
export const trackPageView = async (event: PageViewEvent): Promise<void> => {
  try {
    console.log("👁️ Page view tracked:", event);
    
    // In production, integrate with analytics
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: event.page,
        company_id: event.companyId,
        referrer: event.referrer,
      });
    }
  } catch (error) {
    console.error("Failed to track page view:", error);
  }
};

/**
 * Get call tracking stats for a company
 */
export const getCallStats = (companyId: string): {
  totalCalls: number;
  successfulCalls: number;
  avgDuration: number;
} => {
  try {
    const calls = JSON.parse(localStorage.getItem("call_tracking") || "[]");
    const companyCalls = calls.filter((c: any) => c.companyId === companyId);
    
    return {
      totalCalls: companyCalls.length,
      successfulCalls: companyCalls.filter((c: any) => c.wasSuccessful).length,
      avgDuration: companyCalls.reduce((sum: number, c: any) => sum + (c.callDuration || 0), 0) / companyCalls.length || 0,
    };
  } catch {
    return { totalCalls: 0, successfulCalls: 0, avgDuration: 0 };
  }
};

/**
 * Get conversion stats for a company
 */
export const getConversionStats = (companyId: string): {
  totalConversions: number;
  bySource: Record<string, number>;
  totalValue: number;
} => {
  try {
    const conversions = JSON.parse(localStorage.getItem("conversions") || "[]");
    const companyConversions = conversions.filter((c: any) => c.companyId === companyId);
    
    const bySource = companyConversions.reduce((acc: Record<string, number>, c: any) => {
      acc[c.source] = (acc[c.source] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalConversions: companyConversions.length,
      bySource,
      totalValue: companyConversions.reduce((sum: number, c: any) => sum + (c.value || 0), 0),
    };
  } catch {
    return { totalConversions: 0, bySource: {}, totalValue: 0 };
  }
};

// Extend window type for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
/**
 * Multi-Touch Attribution Tracking
 * 
 * Tracks the complete customer journey across multiple touchpoints.
 * Enables proper ROI measurement and channel optimization.
 */

// Attribution models
export type AttributionModel = 
  | "first_touch"      // 100% to first touchpoint
  | "last_touch"       // 100% to last touchpoint
  | "linear"           // Equal distribution
  | "time_decay"       // More weight to recent
  | "position_based";  // 40% first, 20% middle, 40% last

// Touchpoint types
export type TouchpointType = 
  | "organic_search"
  | "paid_search"
  | "social_organic"
  | "social_paid"
  | "email"
  | "direct"
  | "referral"
  | "display_ad"
  | "affiliate"
  | "offline"
  | "unknown";

export interface Touchpoint {
  id: string;
  type: TouchpointType;
  source: string;           // e.g., "google", "facebook", "newsletter"
  medium: string;           // e.g., "cpc", "organic", "email"
  campaign?: string;
  content?: string;
  term?: string;            // Search term
  landingPage: string;
  referrer?: string;
  timestamp: number;
  sessionId: string;
  deviceType: "mobile" | "tablet" | "desktop";
  isNewSession: boolean;
}

export interface AttributionData {
  visitorId: string;
  touchpoints: Touchpoint[];
  firstTouch: Touchpoint | null;
  lastTouch: Touchpoint | null;
  totalTouchpoints: number;
  daysSinceFirstTouch: number;
  conversions: ConversionEvent[];
}

export interface ConversionEvent {
  id: string;
  type: "lead" | "quote_request" | "phone_call" | "signup" | "purchase";
  value?: number;
  timestamp: number;
  touchpointId: string;
  metadata?: Record<string, unknown>;
}

// Storage keys
const STORAGE_KEYS = {
  VISITOR_ID: "uc_visitor_id",
  TOUCHPOINTS: "uc_touchpoints",
  CONVERSIONS: "uc_conversions",
  SESSION_ID: "uc_session_id",
  LAST_ACTIVITY: "uc_last_activity"
};

// Session timeout (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Max touchpoints to store
const MAX_TOUCHPOINTS = 50;

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Get or create visitor ID
export const getVisitorId = (): string => {
  if (typeof window === "undefined") return "";
  
  let visitorId = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  if (!visitorId) {
    visitorId = `v_${generateId()}`;
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, visitorId);
  }
  return visitorId;
};

// Get or create session ID
const getSessionId = (): { sessionId: string; isNewSession: boolean } => {
  const now = Date.now();
  const lastActivity = parseInt(sessionStorage.getItem(STORAGE_KEYS.LAST_ACTIVITY) || "0");
  let sessionId = sessionStorage.getItem(STORAGE_KEYS.SESSION_ID);
  let isNewSession = false;

  // Check if session expired
  if (!sessionId || (now - lastActivity > SESSION_TIMEOUT)) {
    sessionId = `s_${generateId()}`;
    sessionStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionId);
    isNewSession = true;
  }

  sessionStorage.setItem(STORAGE_KEYS.LAST_ACTIVITY, now.toString());
  return { sessionId, isNewSession };
};

// Parse UTM parameters
const parseUTMParams = (): Record<string, string> => {
  if (typeof window === "undefined") return {};
  
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get("utm_source") || "",
    medium: params.get("utm_medium") || "",
    campaign: params.get("utm_campaign") || "",
    content: params.get("utm_content") || "",
    term: params.get("utm_term") || "",
    gclid: params.get("gclid") || "",  // Google Ads
    fbclid: params.get("fbclid") || "", // Facebook Ads
  };
};

// Detect touchpoint type from parameters
const detectTouchpointType = (
  utm: Record<string, string>,
  referrer: string
): { type: TouchpointType; source: string; medium: string } => {
  // Google Ads
  if (utm.gclid) {
    return { type: "paid_search", source: "google", medium: "cpc" };
  }

  // Facebook Ads
  if (utm.fbclid) {
    return { type: "social_paid", source: "facebook", medium: "cpc" };
  }

  // UTM-based detection
  if (utm.source && utm.medium) {
    const medium = utm.medium.toLowerCase();
    const source = utm.source.toLowerCase();

    if (medium === "cpc" || medium === "ppc" || medium === "paid") {
      if (source.includes("google") || source.includes("bing")) {
        return { type: "paid_search", source: utm.source, medium: utm.medium };
      }
      if (source.includes("facebook") || source.includes("instagram") || source.includes("linkedin")) {
        return { type: "social_paid", source: utm.source, medium: utm.medium };
      }
      return { type: "display_ad", source: utm.source, medium: utm.medium };
    }

    if (medium === "email" || medium === "newsletter") {
      return { type: "email", source: utm.source, medium: utm.medium };
    }

    if (medium === "social" || medium === "organic_social") {
      return { type: "social_organic", source: utm.source, medium: utm.medium };
    }

    if (medium === "affiliate") {
      return { type: "affiliate", source: utm.source, medium: utm.medium };
    }

    if (medium === "referral") {
      return { type: "referral", source: utm.source, medium: utm.medium };
    }

    return { type: "unknown", source: utm.source, medium: utm.medium };
  }

  // Referrer-based detection
  if (referrer) {
    const refUrl = new URL(referrer);
    const refHost = refUrl.hostname.toLowerCase();

    // Search engines
    if (refHost.includes("google") || refHost.includes("bing") || refHost.includes("duckduckgo")) {
      return { type: "organic_search", source: refHost.split(".")[0], medium: "organic" };
    }

    // Social networks
    if (refHost.includes("facebook") || refHost.includes("instagram") || refHost.includes("linkedin") || 
        refHost.includes("twitter") || refHost.includes("tiktok")) {
      return { type: "social_organic", source: refHost.split(".")[0], medium: "social" };
    }

    // Other referrers
    return { type: "referral", source: refHost, medium: "referral" };
  }

  // Direct traffic
  return { type: "direct", source: "(direct)", medium: "(none)" };
};

// Get device type
const getDeviceType = (): "mobile" | "tablet" | "desktop" => {
  if (typeof window === "undefined") return "desktop";
  
  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod/.test(ua)) return "mobile";
  if (/tablet|ipad/.test(ua)) return "tablet";
  return "desktop";
};

// Get stored touchpoints
const getTouchpoints = (): Touchpoint[] => {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TOUCHPOINTS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save touchpoints
const saveTouchpoints = (touchpoints: Touchpoint[]) => {
  if (typeof window === "undefined") return;
  
  // Keep only last N touchpoints
  const trimmed = touchpoints.slice(-MAX_TOUCHPOINTS);
  localStorage.setItem(STORAGE_KEYS.TOUCHPOINTS, JSON.stringify(trimmed));
};

// Track a new touchpoint
export const trackTouchpoint = (): Touchpoint | null => {
  if (typeof window === "undefined") return null;

  const utm = parseUTMParams();
  const referrer = document.referrer;
  const { sessionId, isNewSession } = getSessionId();
  const { type, source, medium } = detectTouchpointType(utm, referrer);

  const touchpoint: Touchpoint = {
    id: generateId(),
    type,
    source,
    medium,
    campaign: utm.campaign || undefined,
    content: utm.content || undefined,
    term: utm.term || undefined,
    landingPage: window.location.pathname,
    referrer: referrer || undefined,
    timestamp: Date.now(),
    sessionId,
    deviceType: getDeviceType(),
    isNewSession
  };

  // Only track if new session or new source
  const existingTouchpoints = getTouchpoints();
  const lastTouchpoint = existingTouchpoints[existingTouchpoints.length - 1];
  
  if (isNewSession || !lastTouchpoint || lastTouchpoint.source !== source) {
    saveTouchpoints([...existingTouchpoints, touchpoint]);
    
    // Log for debugging
    if (process.env.NODE_ENV === "development") {
      console.log("[Attribution] New touchpoint:", touchpoint);
    }

    return touchpoint;
  }

  return null;
};

// Track conversion
export const trackConversion = (
  type: ConversionEvent["type"],
  value?: number,
  metadata?: Record<string, unknown>
): ConversionEvent | null => {
  if (typeof window === "undefined") return null;

  const touchpoints = getTouchpoints();
  const lastTouchpoint = touchpoints[touchpoints.length - 1];

  const conversion: ConversionEvent = {
    id: generateId(),
    type,
    value,
    timestamp: Date.now(),
    touchpointId: lastTouchpoint?.id || "unknown",
    metadata
  };

  // Store conversion
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONVERSIONS);
    const conversions: ConversionEvent[] = stored ? JSON.parse(stored) : [];
    conversions.push(conversion);
    localStorage.setItem(STORAGE_KEYS.CONVERSIONS, JSON.stringify(conversions.slice(-100)));
  } catch {
    // Ignore storage errors
  }

  // Log for debugging
  if (process.env.NODE_ENV === "development") {
    console.log("[Attribution] Conversion tracked:", conversion);
  }

  return conversion;
};

// Get full attribution data
export const getAttributionData = (): AttributionData => {
  const visitorId = getVisitorId();
  const touchpoints = getTouchpoints();
  const firstTouch = touchpoints[0] || null;
  const lastTouch = touchpoints[touchpoints.length - 1] || null;

  let conversions: ConversionEvent[] = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONVERSIONS);
    conversions = stored ? JSON.parse(stored) : [];
  } catch {
    // Ignore
  }

  const daysSinceFirstTouch = firstTouch 
    ? Math.floor((Date.now() - firstTouch.timestamp) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    visitorId,
    touchpoints,
    firstTouch,
    lastTouch,
    totalTouchpoints: touchpoints.length,
    daysSinceFirstTouch,
    conversions
  };
};

// Calculate attributed value based on model
export const calculateAttribution = (
  touchpoints: Touchpoint[],
  value: number,
  model: AttributionModel = "position_based"
): Map<string, number> => {
  const attribution = new Map<string, number>();
  
  if (touchpoints.length === 0) return attribution;
  if (touchpoints.length === 1) {
    attribution.set(touchpoints[0].id, value);
    return attribution;
  }

  switch (model) {
    case "first_touch":
      attribution.set(touchpoints[0].id, value);
      break;

    case "last_touch":
      attribution.set(touchpoints[touchpoints.length - 1].id, value);
      break;

    case "linear":
      const equalShare = value / touchpoints.length;
      touchpoints.forEach(tp => attribution.set(tp.id, equalShare));
      break;

    case "time_decay":
      // More recent touchpoints get higher weight
      const totalWeight = touchpoints.reduce((sum, _, i) => sum + Math.pow(2, i), 0);
      touchpoints.forEach((tp, i) => {
        const weight = Math.pow(2, i) / totalWeight;
        attribution.set(tp.id, value * weight);
      });
      break;

    case "position_based":
    default:
      // 40% first, 20% middle (distributed), 40% last
      const firstShare = value * 0.4;
      const lastShare = value * 0.4;
      const middleShare = value * 0.2;

      attribution.set(touchpoints[0].id, firstShare);
      attribution.set(touchpoints[touchpoints.length - 1].id, lastShare);

      if (touchpoints.length > 2) {
        const middleTouchpoints = touchpoints.slice(1, -1);
        const perMiddle = middleShare / middleTouchpoints.length;
        middleTouchpoints.forEach(tp => attribution.set(tp.id, perMiddle));
      }
      break;
  }

  return attribution;
};

// Initialize attribution on page load
export const initAttribution = () => {
  if (typeof window === "undefined") return;

  // Track touchpoint on page load
  trackTouchpoint();

  // Ensure visitor ID exists
  getVisitorId();

  if (process.env.NODE_ENV === "development") {
    console.log("[Attribution] Initialized", getAttributionData());
  }
};

// Export for GTM/analytics integration
export const getAttributionForAnalytics = () => {
  const data = getAttributionData();
  return {
    visitor_id: data.visitorId,
    first_touch_source: data.firstTouch?.source,
    first_touch_medium: data.firstTouch?.medium,
    first_touch_campaign: data.firstTouch?.campaign,
    last_touch_source: data.lastTouch?.source,
    last_touch_medium: data.lastTouch?.medium,
    last_touch_campaign: data.lastTouch?.campaign,
    total_touchpoints: data.totalTouchpoints,
    days_since_first_touch: data.daysSinceFirstTouch,
    total_conversions: data.conversions.length
  };
};

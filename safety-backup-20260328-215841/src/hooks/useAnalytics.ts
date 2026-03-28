import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalyticsEvent {
  eventType: string;
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  timestamp: string;
  sessionId: string;
  pageUrl: string;
  referrer: string;
  userAgent: string;
  screenSize: string;
  language: string;
}

interface PageView {
  path: string;
  title: string;
  timestamp: string;
  sessionId: string;
  referrer: string;
  timeOnPage?: number;
}

function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics-session-id');
  if (!sessionId) {
    sessionId = `as-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics-session-id', sessionId);
  }
  return sessionId;
}

function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    screenSize: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language,
    platform: navigator.platform,
    isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    isTablet: /iPad|Android/i.test(navigator.userAgent) && !/Mobile/i.test(navigator.userAgent),
  };
}

function saveEvent(event: AnalyticsEvent) {
  const events = JSON.parse(localStorage.getItem('analytics-events') || '[]');
  events.push(event);
  
  // Keep only last 500 events
  if (events.length > 500) {
    events.splice(0, events.length - 500);
  }
  
  localStorage.setItem('analytics-events', JSON.stringify(events));
}

function savePageView(pageView: PageView) {
  const pageViews = JSON.parse(localStorage.getItem('analytics-pageviews') || '[]');
  pageViews.push(pageView);
  
  // Keep only last 200 page views
  if (pageViews.length > 200) {
    pageViews.splice(0, pageViews.length - 200);
  }
  
  localStorage.setItem('analytics-pageviews', JSON.stringify(pageViews));
}

export function useAnalytics() {
  const location = useLocation();
  const sessionId = getSessionId();
  const pageStartTime = useRef<number>(Date.now());
  const lastPath = useRef<string>(location.pathname);

  // Track page views
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Save time on previous page
    if (lastPath.current !== currentPath) {
      const timeOnPage = Date.now() - pageStartTime.current;
      const previousPageView: PageView = {
        path: lastPath.current,
        title: document.title,
        timestamp: new Date().toISOString(),
        sessionId,
        referrer: document.referrer,
        timeOnPage,
      };
      savePageView(previousPageView);
    }

    // Reset for new page
    pageStartTime.current = Date.now();
    lastPath.current = currentPath;

    // Track current page view
    const pageView: PageView = {
      path: currentPath,
      title: document.title,
      timestamp: new Date().toISOString(),
      sessionId,
      referrer: document.referrer,
    };
    savePageView(pageView);
  }, [location.pathname, sessionId]);

  // Track custom events
  const trackEvent = useCallback((
    eventCategory: string,
    eventAction: string,
    eventLabel?: string,
    eventValue?: number
  ) => {
    const deviceInfo = getDeviceInfo();
    const event: AnalyticsEvent = {
      eventType: 'custom',
      eventCategory,
      eventAction,
      eventLabel,
      eventValue,
      timestamp: new Date().toISOString(),
      sessionId,
      pageUrl: window.location.href,
      referrer: document.referrer,
      userAgent: deviceInfo.userAgent,
      screenSize: deviceInfo.screenSize,
      language: deviceInfo.language,
    };
    saveEvent(event);
  }, [sessionId]);

  // Track button clicks
  const trackClick = useCallback((buttonName: string, section?: string) => {
    trackEvent('interaction', 'click', buttonName, section ? 1 : undefined);
  }, [trackEvent]);

  // Track form submissions
  const trackFormSubmit = useCallback((formName: string, success: boolean) => {
    trackEvent('form', success ? 'submit_success' : 'submit_error', formName);
  }, [trackEvent]);

  // Track scroll depth
  const trackScrollDepth = useCallback((depth: number) => {
    trackEvent('engagement', 'scroll_depth', `${depth}%`, depth);
  }, [trackEvent]);

  // Track outbound links
  const trackOutboundLink = useCallback((url: string) => {
    trackEvent('outbound', 'click', url);
  }, [trackEvent]);

  // Track search queries
  const trackSearch = useCallback((query: string, resultsCount?: number) => {
    trackEvent('search', 'query', query, resultsCount);
  }, [trackEvent]);

  // Track conversions
  const trackConversion = useCallback((conversionType: string, value?: number) => {
    trackEvent('conversion', conversionType, undefined, value);
  }, [trackEvent]);

  return {
    trackEvent,
    trackClick,
    trackFormSubmit,
    trackScrollDepth,
    trackOutboundLink,
    trackSearch,
    trackConversion,
  };
}

// Get analytics data for dashboard
export function getAnalyticsData() {
  const events = JSON.parse(localStorage.getItem('analytics-events') || '[]') as AnalyticsEvent[];
  const pageViews = JSON.parse(localStorage.getItem('analytics-pageviews') || '[]') as PageView[];
  
  return { events, pageViews };
}

// Get analytics summary
export function getAnalyticsSummary() {
  const { events, pageViews } = getAnalyticsData();
  
  const uniqueSessions = new Set(pageViews.map(pv => pv.sessionId)).size;
  const totalPageViews = pageViews.length;
  const totalEvents = events.length;
  
  // Calculate average time on page
  const pagesWithTime = pageViews.filter(pv => pv.timeOnPage);
  const avgTimeOnPage = pagesWithTime.length > 0
    ? pagesWithTime.reduce((sum, pv) => sum + (pv.timeOnPage || 0), 0) / pagesWithTime.length
    : 0;

  // Top pages
  const pageCounts: Record<string, number> = {};
  pageViews.forEach(pv => {
    pageCounts[pv.path] = (pageCounts[pv.path] || 0) + 1;
  });
  const topPages = Object.entries(pageCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  // Event categories
  const eventCategories: Record<string, number> = {};
  events.forEach(e => {
    eventCategories[e.eventCategory] = (eventCategories[e.eventCategory] || 0) + 1;
  });

  return {
    uniqueSessions,
    totalPageViews,
    totalEvents,
    avgTimeOnPage: Math.round(avgTimeOnPage / 1000), // in seconds
    topPages,
    eventCategories,
  };
}

export default useAnalytics;

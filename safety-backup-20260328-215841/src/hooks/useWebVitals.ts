/**
 * Web Vitals Tracking Hook
 * 
 * Tracks Core Web Vitals (LCP, FID, CLS) and reports to analytics.
 * Helps identify performance issues before they impact conversions.
 */

import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WebVital {
  name: 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  entries: PerformanceEntry[];
}

interface WebVitalsOptions {
  /** Report to Supabase analytics */
  reportToAnalytics?: boolean;
  /** Console log vitals (dev only) */
  debug?: boolean;
  /** Page identifier for analytics */
  pagePath?: string;
}

// Rating thresholds based on Google's Core Web Vitals
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
  INP: { good: 200, poor: 500 },
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

export function useWebVitals(options: WebVitalsOptions = {}) {
  const { reportToAnalytics = true, debug = false, pagePath } = options;
  const hasReported = useRef(false);
  const vitalsCollected = useRef<Partial<Record<string, WebVital>>>({});

  const reportVital = useCallback((vital: WebVital) => {
    vitalsCollected.current[vital.name] = vital;

    if (debug) {
      console.log(`[WebVitals] ${vital.name}: ${vital.value.toFixed(2)} (${vital.rating})`);
    }

    // Report to analytics after collecting key vitals
    if (reportToAnalytics && !hasReported.current) {
      const collected = vitalsCollected.current;
      // Wait until we have LCP and CLS at minimum
      if (collected.LCP && collected.CLS) {
        hasReported.current = true;
        reportToSupabase(vitalsCollected.current, pagePath);
      }
    }
  }, [debug, reportToAnalytics, pagePath]);

  useEffect(() => {
    // Only run in browser
    if (typeof window === 'undefined') return;

    // LCP - Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      if (lastEntry) {
        const value = lastEntry.startTime;
        reportVital({
          name: 'LCP',
          value,
          rating: getRating('LCP', value),
          delta: value,
          id: `lcp-${Date.now()}`,
          entries,
        });
      }
    });

    // CLS - Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      reportVital({
        name: 'CLS',
        value: clsValue,
        rating: getRating('CLS', clsValue),
        delta: clsValue,
        id: `cls-${Date.now()}`,
        entries: [],
      });
    });

    // FCP - First Contentful Paint
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const fcpEntry = entries.find(e => e.name === 'first-contentful-paint');
      if (fcpEntry) {
        const value = fcpEntry.startTime;
        reportVital({
          name: 'FCP',
          value,
          rating: getRating('FCP', value),
          delta: value,
          id: `fcp-${Date.now()}`,
          entries,
        });
      }
    });

    // INP - Interaction to Next Paint (replaces FID)
    const inpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as any[];
      for (const entry of entries) {
        const value = entry.duration;
        reportVital({
          name: 'INP',
          value,
          rating: getRating('INP', value),
          delta: value,
          id: `inp-${Date.now()}`,
          entries,
        });
      }
    });

    try {
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      fcpObserver.observe({ type: 'paint', buffered: true });
      // INP observer with duration threshold (cast to avoid TS error)
      inpObserver.observe({ type: 'event', buffered: true } as PerformanceObserverInit);
    } catch (e) {
      // Observer not supported
      if (debug) console.warn('[WebVitals] PerformanceObserver not fully supported');
    }

    return () => {
      lcpObserver.disconnect();
      clsObserver.disconnect();
      fcpObserver.disconnect();
      inpObserver.disconnect();
    };
  }, [reportVital, debug]);

  return vitalsCollected.current;
}

async function reportToSupabase(
  vitals: Partial<Record<string, WebVital>>,
  pagePath?: string
) {
  try {
    const payload = {
      page_path: pagePath || window.location.pathname,
      lcp_ms: vitals.LCP?.value,
      lcp_rating: vitals.LCP?.rating,
      cls_value: vitals.CLS?.value,
      cls_rating: vitals.CLS?.rating,
      fcp_ms: vitals.FCP?.value,
      inp_ms: vitals.INP?.value,
      user_agent: navigator.userAgent,
      connection_type: (navigator as any).connection?.effectiveType || 'unknown',
      device_memory: (navigator as any).deviceMemory || null,
      timestamp: new Date().toISOString(),
    };

    // Log to conversion_analytics as a performance event
    await supabase.from('conversion_analytics').insert({
      conversion_type: 'web_vitals',
      source_page: pagePath || window.location.pathname,
      city: 'performance',
      service: 'performance',
      metadata: payload,
    });
  } catch (e) {
    // Silent fail - don't block user experience
  }
}

/**
 * WebVitalsReporter Component
 * 
 * Drop-in component to enable Web Vitals tracking.
 * Usage: <WebVitalsReporter /> anywhere in your app.
 */
export function WebVitalsReporter() {
  useWebVitals({ 
    reportToAnalytics: true, 
    debug: import.meta.env.DEV 
  });
  return null;
}

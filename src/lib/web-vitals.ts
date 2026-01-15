/**
 * Core Web Vitals Monitoring - Real-time Performance Tracking
 * Tracks LCP, FID, CLS, INP, TTFB and reports to analytics
 */

interface WebVitalMetric {
  name: 'LCP' | 'FID' | 'CLS' | 'INP' | 'TTFB' | 'FCP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  entries: PerformanceEntry[];
}

interface WebVitalsReport {
  lcp?: WebVitalMetric;
  fid?: WebVitalMetric;
  cls?: WebVitalMetric;
  inp?: WebVitalMetric;
  ttfb?: WebVitalMetric;
  fcp?: WebVitalMetric;
  timestamp: number;
  url: string;
  deviceType: 'mobile' | 'tablet' | 'desktop';
}

// Thresholds based on Google's Core Web Vitals standards
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  TTFB: { good: 800, poor: 1800 },
  FCP: { good: 1800, poor: 3000 },
};

const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

const getRating = (name: keyof typeof THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
};

class WebVitalsMonitor {
  private metrics: Partial<WebVitalsReport> = {};
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;
  private onReport?: (report: WebVitalsReport) => void;

  init(onReport?: (report: WebVitalsReport) => void) {
    if (this.isInitialized || typeof window === 'undefined') return;
    
    this.onReport = onReport;
    this.isInitialized = true;
    this.metrics = {
      timestamp: Date.now(),
      url: window.location.pathname,
      deviceType: getDeviceType(),
    };

    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeINP();
    this.observeTTFB();
    this.observeFCP();

    // Report on page hide
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.report();
      }
    });

    // Report on beforeunload
    window.addEventListener('beforeunload', () => this.report());
  }

  private observeLCP() {
    try {
      const po = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        
        this.metrics.lcp = {
          name: 'LCP',
          value: lastEntry.startTime,
          rating: getRating('LCP', lastEntry.startTime),
          delta: lastEntry.startTime,
          id: crypto.randomUUID?.() || `lcp-${Date.now()}`,
          entries: [lastEntry],
        };
      });
      po.observe({ type: 'largest-contentful-paint', buffered: true });
      this.observers.push(po);
    } catch (e) {
      // LCP not supported
    }
  }

  private observeFID() {
    try {
      const po = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const value = entry.processingStart - entry.startTime;
          
          this.metrics.fid = {
            name: 'FID',
            value,
            rating: getRating('FID', value),
            delta: value,
            id: crypto.randomUUID?.() || `fid-${Date.now()}`,
            entries: [entry],
          };
        });
      });
      po.observe({ type: 'first-input', buffered: true });
      this.observers.push(po);
    } catch (e) {
      // FID not supported
    }
  }

  private observeCLS() {
    try {
      let clsValue = 0;
      let clsEntries: PerformanceEntry[] = [];
      
      const po = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
          }
        });
        
        this.metrics.cls = {
          name: 'CLS',
          value: clsValue,
          rating: getRating('CLS', clsValue),
          delta: clsValue,
          id: crypto.randomUUID?.() || `cls-${Date.now()}`,
          entries: clsEntries,
        };
      });
      po.observe({ type: 'layout-shift', buffered: true });
      this.observers.push(po);
    } catch (e) {
      // CLS not supported
    }
  }

  private observeINP() {
    try {
      let maxINP = 0;
      
      const po = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const inp = entry.duration;
          if (inp > maxINP) {
            maxINP = inp;
            
            this.metrics.inp = {
              name: 'INP',
              value: inp,
              rating: getRating('INP', inp),
              delta: inp,
              id: crypto.randomUUID?.() || `inp-${Date.now()}`,
              entries: [entry],
            };
          }
        });
      });
      po.observe({ type: 'event', buffered: true, durationThreshold: 16 } as any);
      this.observers.push(po);
    } catch (e) {
      // INP not supported
    }
  }

  private observeTTFB() {
    try {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        const ttfb = navEntry.responseStart - navEntry.requestStart;
        
        this.metrics.ttfb = {
          name: 'TTFB',
          value: ttfb,
          rating: getRating('TTFB', ttfb),
          delta: ttfb,
          id: crypto.randomUUID?.() || `ttfb-${Date.now()}`,
          entries: [navEntry],
        };
      }
    } catch (e) {
      // TTFB not supported
    }
  }

  private observeFCP() {
    try {
      const po = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = {
              name: 'FCP',
              value: entry.startTime,
              rating: getRating('FCP', entry.startTime),
              delta: entry.startTime,
              id: crypto.randomUUID?.() || `fcp-${Date.now()}`,
              entries: [entry],
            };
          }
        });
      });
      po.observe({ type: 'paint', buffered: true });
      this.observers.push(po);
    } catch (e) {
      // FCP not supported
    }
  }

  private report() {
    if (this.onReport) {
      this.onReport(this.metrics as WebVitalsReport);
    }
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.group('📊 Core Web Vitals Report');
      console.log('URL:', this.metrics.url);
      console.log('Device:', this.metrics.deviceType);
      if (this.metrics.lcp) console.log(`LCP: ${this.metrics.lcp.value.toFixed(0)}ms (${this.metrics.lcp.rating})`);
      if (this.metrics.fid) console.log(`FID: ${this.metrics.fid.value.toFixed(0)}ms (${this.metrics.fid.rating})`);
      if (this.metrics.cls) console.log(`CLS: ${this.metrics.cls.value.toFixed(3)} (${this.metrics.cls.rating})`);
      if (this.metrics.inp) console.log(`INP: ${this.metrics.inp.value.toFixed(0)}ms (${this.metrics.inp.rating})`);
      if (this.metrics.ttfb) console.log(`TTFB: ${this.metrics.ttfb.value.toFixed(0)}ms (${this.metrics.ttfb.rating})`);
      if (this.metrics.fcp) console.log(`FCP: ${this.metrics.fcp.value.toFixed(0)}ms (${this.metrics.fcp.rating})`);
      console.groupEnd();
    }
    
    // Store locally for dashboard
    try {
      const stored = JSON.parse(localStorage.getItem('web_vitals_history') || '[]');
      stored.push({ ...this.metrics, timestamp: Date.now() });
      // Keep last 50 entries
      if (stored.length > 50) stored.shift();
      localStorage.setItem('web_vitals_history', JSON.stringify(stored));
    } catch (e) {
      // Silent fail
    }
  }

  getMetrics(): Partial<WebVitalsReport> {
    return { ...this.metrics };
  }

  getScores(): { overall: number; lcp: number; fid: number; cls: number } {
    const lcpScore = this.metrics.lcp?.rating === 'good' ? 100 : this.metrics.lcp?.rating === 'needs-improvement' ? 60 : 30;
    const fidScore = this.metrics.fid?.rating === 'good' ? 100 : this.metrics.fid?.rating === 'needs-improvement' ? 60 : 30;
    const clsScore = this.metrics.cls?.rating === 'good' ? 100 : this.metrics.cls?.rating === 'needs-improvement' ? 60 : 30;
    
    return {
      overall: Math.round((lcpScore + fidScore + clsScore) / 3),
      lcp: lcpScore,
      fid: fidScore,
      cls: clsScore,
    };
  }

  destroy() {
    this.observers.forEach(o => o.disconnect());
    this.observers = [];
    this.isInitialized = false;
  }
}

export const webVitals = new WebVitalsMonitor();
export type { WebVitalMetric, WebVitalsReport };

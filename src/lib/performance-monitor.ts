/**
 * Performance Monitor - Core Web Vitals Tracking
 * Phase 5: Launch Readiness
 * 
 * Tracks LCP, FID, CLS, TTFB for Lighthouse optimization
 */

export interface WebVitalsMetric {
  name: 'LCP' | 'FID' | 'CLS' | 'TTFB' | 'FCP' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

export interface PerformanceReport {
  timestamp: Date;
  url: string;
  metrics: Partial<Record<WebVitalsMetric['name'], WebVitalsMetric>>;
  score: number; // 0-100
  recommendations: string[];
}

// Thresholds based on Google's Core Web Vitals
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // milliseconds
  FID: { good: 100, poor: 300 },   // milliseconds
  CLS: { good: 0.1, poor: 0.25 },  // score
  TTFB: { good: 800, poor: 1800 }, // milliseconds
  FCP: { good: 1800, poor: 3000 }, // milliseconds
  INP: { good: 200, poor: 500 },   // milliseconds
};

function getRating(name: WebVitalsMetric['name'], value: number): WebVitalsMetric['rating'] {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

class PerformanceMonitor {
  private metrics: Map<string, WebVitalsMetric> = new Map();
  private observers: ((metric: WebVitalsMetric) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initObservers();
    }
  }

  private initObservers() {
    // Largest Contentful Paint
    this.observeLCP();
    // First Input Delay / Interaction to Next Paint
    this.observeFID();
    // Cumulative Layout Shift
    this.observeCLS();
    // Time to First Byte
    this.observeTTFB();
    // First Contentful Paint
    this.observeFCP();
  }

  private observeLCP() {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        
        this.recordMetric({
          name: 'LCP',
          value: lastEntry.startTime,
          rating: getRating('LCP', lastEntry.startTime),
          delta: lastEntry.startTime,
          id: `lcp-${Date.now()}`,
          navigationType: this.getNavigationType(),
        });
      });
      
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.debug('LCP observer not supported');
    }
  }

  private observeFID() {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          this.recordMetric({
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            rating: getRating('FID', entry.processingStart - entry.startTime),
            delta: entry.processingStart - entry.startTime,
            id: `fid-${Date.now()}`,
            navigationType: this.getNavigationType(),
          });
        });
      });
      
      observer.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.debug('FID observer not supported');
    }
  }

  private observeCLS() {
    if (!('PerformanceObserver' in window)) return;
    
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: any[] = [];
    
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0];
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
            
            if (
              sessionValue &&
              entry.startTime - lastSessionEntry.startTime < 1000 &&
              entry.startTime - firstSessionEntry.startTime < 5000
            ) {
              sessionValue += entry.value;
              sessionEntries.push(entry);
            } else {
              sessionValue = entry.value;
              sessionEntries = [entry];
            }
            
            if (sessionValue > clsValue) {
              clsValue = sessionValue;
              
              this.recordMetric({
                name: 'CLS',
                value: clsValue,
                rating: getRating('CLS', clsValue),
                delta: entry.value,
                id: `cls-${Date.now()}`,
                navigationType: this.getNavigationType(),
              });
            }
          }
        }
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.debug('CLS observer not supported');
    }
  }

  private observeTTFB() {
    if (typeof window === 'undefined') return;
    
    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart;
        
        this.recordMetric({
          name: 'TTFB',
          value: ttfb,
          rating: getRating('TTFB', ttfb),
          delta: ttfb,
          id: `ttfb-${Date.now()}`,
          navigationType: this.getNavigationType(),
        });
      }
    } catch (e) {
      console.debug('TTFB measurement not supported');
    }
  }

  private observeFCP() {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            this.recordMetric({
              name: 'FCP',
              value: entry.startTime,
              rating: getRating('FCP', entry.startTime),
              delta: entry.startTime,
              id: `fcp-${Date.now()}`,
              navigationType: this.getNavigationType(),
            });
          }
        });
      });
      
      observer.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.debug('FCP observer not supported');
    }
  }

  private getNavigationType(): string {
    if (typeof window === 'undefined') return 'unknown';
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    return nav?.type || 'navigate';
  }

  private recordMetric(metric: WebVitalsMetric) {
    this.metrics.set(metric.name, metric);
    this.observers.forEach((cb) => cb(metric));
    
    // Log in development
    if (import.meta.env.DEV) {
      const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
      console.log(`${emoji} ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`);
    }
  }

  subscribe(callback: (metric: WebVitalsMetric) => void) {
    this.observers.push(callback);
    return () => {
      this.observers = this.observers.filter((cb) => cb !== callback);
    };
  }

  getReport(): PerformanceReport {
    const metricsObj: Partial<Record<WebVitalsMetric['name'], WebVitalsMetric>> = {};
    this.metrics.forEach((metric, name) => {
      metricsObj[name as WebVitalsMetric['name']] = metric;
    });

    const recommendations = this.generateRecommendations();
    const score = this.calculateScore();

    return {
      timestamp: new Date(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      metrics: metricsObj,
      score,
      recommendations,
    };
  }

  private calculateScore(): number {
    let totalWeight = 0;
    let weightedScore = 0;

    const weights = { LCP: 25, FID: 25, CLS: 25, TTFB: 15, FCP: 10 };

    this.metrics.forEach((metric) => {
      const weight = weights[metric.name] || 0;
      totalWeight += weight;
      
      const ratingScore = metric.rating === 'good' ? 100 : metric.rating === 'needs-improvement' ? 60 : 20;
      weightedScore += ratingScore * weight;
    });

    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    const lcp = this.metrics.get('LCP');
    if (lcp && lcp.rating !== 'good') {
      recommendations.push('🖼️ LCP: Optimiere Hero-Bilder mit WebP/AVIF, preload kritische Ressourcen');
    }

    const fid = this.metrics.get('FID');
    if (fid && fid.rating !== 'good') {
      recommendations.push('⚡ FID: Reduziere JavaScript-Blocking, nutze Code-Splitting');
    }

    const cls = this.metrics.get('CLS');
    if (cls && cls.rating !== 'good') {
      recommendations.push('📐 CLS: Setze width/height auf Bilder, reserviere Platz für dynamische Inhalte');
    }

    const ttfb = this.metrics.get('TTFB');
    if (ttfb && ttfb.rating !== 'good') {
      recommendations.push('🌐 TTFB: Aktiviere CDN-Caching, optimiere Server-Antwortzeiten');
    }

    if (recommendations.length === 0) {
      recommendations.push('🎉 Alle Core Web Vitals im grünen Bereich!');
    }

    return recommendations;
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Launch Readiness Checklist
export interface LaunchChecklistItem {
  id: string;
  category: 'performance' | 'seo' | 'security' | 'functionality' | 'business';
  title: string;
  description: string;
  status: 'done' | 'in-progress' | 'pending';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export const LAUNCH_CHECKLIST: LaunchChecklistItem[] = [
  // Performance
  { id: 'perf-1', category: 'performance', title: 'Core Web Vitals', description: 'LCP < 2.5s, FID < 100ms, CLS < 0.1', status: 'in-progress', priority: 'critical' },
  { id: 'perf-2', category: 'performance', title: 'Image Optimization', description: 'WebP/AVIF, lazy loading, responsive sizes', status: 'done', priority: 'high' },
  { id: 'perf-3', category: 'performance', title: 'Code Splitting', description: 'Route-based lazy loading, dynamic imports', status: 'done', priority: 'high' },
  { id: 'perf-4', category: 'performance', title: 'CDN & Caching', description: 'Static assets cached, edge locations', status: 'done', priority: 'medium' },
  
  // SEO
  { id: 'seo-1', category: 'seo', title: 'Meta Tags', description: 'Title, description, OG tags auf allen Seiten', status: 'done', priority: 'critical' },
  { id: 'seo-2', category: 'seo', title: 'Schema.org Markup', description: 'LocalBusiness, FAQ, Breadcrumbs', status: 'done', priority: 'high' },
  { id: 'seo-3', category: 'seo', title: 'Sitemap & Robots', description: 'XML Sitemap, robots.txt konfiguriert', status: 'done', priority: 'high' },
  { id: 'seo-4', category: 'seo', title: 'Hub-and-Spoke URLs', description: 'Kanton (Hub) vs. Stadt (Spoke) Struktur', status: 'done', priority: 'high' },
  
  // Security
  { id: 'sec-1', category: 'security', title: 'RLS Policies', description: 'Row Level Security auf allen Tabellen', status: 'done', priority: 'critical' },
  { id: 'sec-2', category: 'security', title: 'HTTPS & Headers', description: 'SSL, CSP, HSTS konfiguriert', status: 'done', priority: 'critical' },
  { id: 'sec-3', category: 'security', title: 'API Key Protection', description: 'Secrets in Edge Functions, nicht im Client', status: 'done', priority: 'critical' },
  { id: 'sec-4', category: 'security', title: 'Input Validation', description: 'Zod-Schemas für alle Formulare', status: 'done', priority: 'high' },
  
  // Functionality
  { id: 'func-1', category: 'functionality', title: 'Golden Flow', description: '4-Step Wizard vollständig getestet', status: 'done', priority: 'critical' },
  { id: 'func-2', category: 'functionality', title: 'Email Automation', description: 'Lead-Benachrichtigungen, Provider-Alerts', status: 'done', priority: 'high' },
  { id: 'func-3', category: 'functionality', title: 'Payment Integration', description: 'Stripe Checkout & Webhooks', status: 'done', priority: 'high' },
  { id: 'func-4', category: 'functionality', title: 'Mobile Responsiveness', description: 'Alle Flows auf Mobile getestet', status: 'done', priority: 'critical' },
  
  // Business
  { id: 'biz-1', category: 'business', title: 'Provider Onboarding', description: 'Erste 10 Partner-Firmen aktiv', status: 'pending', priority: 'critical' },
  { id: 'biz-2', category: 'business', title: 'Analytics Setup', description: 'GA4, Conversion Tracking, Funnels', status: 'in-progress', priority: 'high' },
  { id: 'biz-3', category: 'business', title: 'Legal Compliance', description: 'AGB, Datenschutz, Impressum', status: 'done', priority: 'critical' },
  { id: 'biz-4', category: 'business', title: 'Support Workflow', description: 'Ticket-System, FAQ, Kontaktformular', status: 'done', priority: 'medium' },
];

export function getLaunchReadiness(): { 
  score: number; 
  byCategory: Record<string, { done: number; total: number }>;
  criticalBlocking: LaunchChecklistItem[];
} {
  const byCategory: Record<string, { done: number; total: number }> = {};
  
  LAUNCH_CHECKLIST.forEach((item) => {
    if (!byCategory[item.category]) {
      byCategory[item.category] = { done: 0, total: 0 };
    }
    byCategory[item.category].total++;
    if (item.status === 'done') {
      byCategory[item.category].done++;
    }
  });
  
  const totalDone = LAUNCH_CHECKLIST.filter((i) => i.status === 'done').length;
  const score = Math.round((totalDone / LAUNCH_CHECKLIST.length) * 100);
  
  const criticalBlocking = LAUNCH_CHECKLIST.filter(
    (i) => i.priority === 'critical' && i.status !== 'done'
  );
  
  return { score, byCategory, criticalBlocking };
}

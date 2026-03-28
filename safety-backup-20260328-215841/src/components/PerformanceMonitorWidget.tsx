/**
 * Performance Monitoring Widget
 * Tracks Core Web Vitals and displays alerts
 * Only visible in development or with debug flag
 */

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertTriangle, CheckCircle2, X, Zap, Image, MousePointer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface WebVitals {
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  fcp: number | null; // First Contentful Paint
  ttfb: number | null; // Time to First Byte
}

interface VitalThresholds {
  good: number;
  needsImprovement: number;
}

const THRESHOLDS: Record<keyof WebVitals, VitalThresholds> = {
  lcp: { good: 2500, needsImprovement: 4000 },
  fid: { good: 100, needsImprovement: 300 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  fcp: { good: 1800, needsImprovement: 3000 },
  ttfb: { good: 800, needsImprovement: 1800 }
};

const VITAL_NAMES: Record<keyof WebVitals, string> = {
  lcp: 'LCP',
  fid: 'FID',
  cls: 'CLS',
  fcp: 'FCP',
  ttfb: 'TTFB'
};

const VITAL_DESCRIPTIONS: Record<keyof WebVitals, string> = {
  lcp: 'Largest Contentful Paint',
  fid: 'First Input Delay',
  cls: 'Cumulative Layout Shift',
  fcp: 'First Contentful Paint',
  ttfb: 'Time to First Byte'
};

function getVitalStatus(metric: keyof WebVitals, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[metric];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

function formatVitalValue(metric: keyof WebVitals, value: number): string {
  if (metric === 'cls') return value.toFixed(3);
  return `${Math.round(value)}ms`;
}

interface PerformanceMonitorWidgetProps {
  /** Show even without debug mode */
  forceShow?: boolean;
  /** Position on screen */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export const PerformanceMonitorWidget = memo(({
  forceShow = false,
  position = 'bottom-right',
  className
}: PerformanceMonitorWidgetProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [vitals, setVitals] = useState<WebVitals>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null
  });
  const [hasIssues, setHasIssues] = useState(false);

  useEffect(() => {
    // Only show in dev or with debug flag
    const isDebug = import.meta.env.DEV || localStorage.getItem('uc_perf_debug') === 'true';
    if (!isDebug && !forceShow) return;
    setIsVisible(true);

    // Measure performance metrics
    const measureVitals = () => {
      // Get paint timing
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(e => e.name === 'first-contentful-paint');
      if (fcpEntry) {
        setVitals(v => ({ ...v, fcp: fcpEntry.startTime }));
      }

      // Get navigation timing
      const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      if (navEntries.length > 0) {
        const nav = navEntries[0];
        setVitals(v => ({ ...v, ttfb: nav.responseStart - nav.requestStart }));
      }

      // Observe LCP
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
          if (lastEntry) {
            setVitals(v => ({ ...v, lcp: lastEntry.startTime }));
          }
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        // LCP not supported
      }

      // Observe CLS
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          setVitals(v => ({ ...v, cls: clsValue }));
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        // CLS not supported
      }

      // Observe FID
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const firstInput = entries[0] as PerformanceEntry & { processingStart: number; startTime: number };
            setVitals(v => ({ ...v, fid: firstInput.processingStart - firstInput.startTime }));
          }
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch (e) {
        // FID not supported
      }
    };

    measureVitals();
  }, [forceShow]);

  // Check for issues
  useEffect(() => {
    const issues = Object.entries(vitals).some(([key, value]) => {
      if (value === null) return false;
      const status = getVitalStatus(key as keyof WebVitals, value);
      return status === 'poor';
    });
    setHasIssues(issues);
  }, [vitals]);

  const positionClasses = {
    'bottom-right': 'bottom-20 right-4 sm:bottom-4',
    'bottom-left': 'bottom-20 left-4 sm:bottom-4',
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4'
  };

  if (!isVisible) return null;

  const overallScore = Object.entries(vitals).filter(([_, v]) => v !== null).length > 0
    ? Math.round(
        Object.entries(vitals)
          .filter(([_, v]) => v !== null)
          .reduce((acc, [key, value]) => {
            const status = getVitalStatus(key as keyof WebVitals, value!);
            return acc + (status === 'good' ? 100 : status === 'needs-improvement' ? 50 : 0);
          }, 0) / Object.entries(vitals).filter(([_, v]) => v !== null).length
      )
    : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={cn(
          "fixed z-50",
          positionClasses[position],
          className
        )}
      >
        {isExpanded ? (
          <div className="bg-white rounded-xl shadow-xl border border-border p-4 min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">Performance</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setIsExpanded(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Score */}
            {overallScore !== null && (
              <div className={cn(
                "text-center py-3 mb-3 rounded-lg",
                overallScore >= 75 ? "bg-green-50" : 
                overallScore >= 50 ? "bg-yellow-50" : "bg-red-50"
              )}>
                <p className="text-3xl font-bold">
                  {overallScore}
                </p>
                <p className="text-xs text-muted-foreground">Overall Score</p>
              </div>
            )}

            {/* Metrics */}
            <div className="space-y-2">
              {Object.entries(vitals).map(([key, value]) => {
                if (value === null) return null;
                const status = getVitalStatus(key as keyof WebVitals, value);
                
                return (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        status === 'good' ? "bg-green-500" :
                        status === 'needs-improvement' ? "bg-yellow-500" : "bg-red-500"
                      )} />
                      <span className="font-medium">{VITAL_NAMES[key as keyof WebVitals]}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {formatVitalValue(key as keyof WebVitals, value)}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-muted-foreground mt-3 text-center">
              Core Web Vitals
            </p>
          </div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-full shadow-lg border",
              "bg-white hover:bg-muted transition-colors",
              hasIssues ? "border-red-200" : "border-border"
            )}
          >
            {hasIssues ? (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            ) : (
              <Zap className="w-4 h-4 text-green-500" />
            )}
            <span className="text-xs font-medium">
              {overallScore !== null ? `${overallScore}%` : '...'}
            </span>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
});

PerformanceMonitorWidget.displayName = 'PerformanceMonitorWidget';

export default PerformanceMonitorWidget;

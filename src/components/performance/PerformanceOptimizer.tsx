import React, { useEffect, useCallback, useRef, useState } from 'react';

interface PerformanceIssue {
  type: 'lcp' | 'cls' | 'fid' | 'blocking' | 'memory' | 'long-task';
  severity: 'warning' | 'critical';
  message: string;
  suggestion: string;
}

interface PerformanceOptimizerProps {
  children: React.ReactNode;
  onIssueDetected?: (issue: PerformanceIssue) => void;
  enableAutoFix?: boolean;
}

export const PerformanceOptimizer: React.FC<PerformanceOptimizerProps> = ({
  children,
  onIssueDetected,
  enableAutoFix = true,
}) => {
  const [issues, setIssues] = useState<PerformanceIssue[]>([]);
  const observersRef = useRef<PerformanceObserver[]>([]);

  const addIssue = useCallback((issue: PerformanceIssue) => {
    setIssues((prev) => {
      if (prev.some((i) => i.type === issue.type && i.message === issue.message)) {
        return prev;
      }
      return [...prev, issue];
    });
    onIssueDetected?.(issue);

    if (process.env.NODE_ENV === 'development') {
      const emoji = issue.severity === 'critical' ? '🔴' : '🟡';
      console.warn(`${emoji} Performance Issue: ${issue.message}\n💡 Suggestion: ${issue.suggestion}`);
    }
  }, [onIssueDetected]);

  useEffect(() => {
    if (!('PerformanceObserver' in window)) return;

    // Monitor Long Tasks (>50ms)
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 100) {
            addIssue({
              type: 'long-task',
              severity: entry.duration > 200 ? 'critical' : 'warning',
              message: `Long task detected: ${entry.duration.toFixed(0)}ms`,
              suggestion: 'Break up long-running JavaScript into smaller chunks using requestIdleCallback or Web Workers',
            });
          }
        });
      });
      longTaskObserver.observe({ type: 'longtask', buffered: true });
      observersRef.current.push(longTaskObserver);
    } catch (e) {
      // Long task observer not supported
    }

    // Monitor Layout Shifts
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceEntry & { hadRecentInput?: boolean; value?: number }) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value || 0;
            if (clsValue > 0.1) {
              addIssue({
                type: 'cls',
                severity: clsValue > 0.25 ? 'critical' : 'warning',
                message: `High CLS detected: ${clsValue.toFixed(3)}`,
                suggestion: 'Add explicit width/height to images and embeds, avoid inserting content above existing content',
              });
            }
          }
        });
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      observersRef.current.push(clsObserver);
    } catch (e) {
      // CLS observer not supported
    }

    // Monitor LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
        const lcpTime = lastEntry.renderTime || lastEntry.loadTime || 0;
        
        if (lcpTime > 2500) {
          addIssue({
            type: 'lcp',
            severity: lcpTime > 4000 ? 'critical' : 'warning',
            message: `Slow LCP detected: ${lcpTime.toFixed(0)}ms`,
            suggestion: 'Optimize images, preload critical resources, reduce server response time',
          });

          // Auto-fix: Add priority hints to LCP element
          if (enableAutoFix) {
            const lcpElement = (lastEntry as unknown as { element?: HTMLElement }).element;
            if (lcpElement instanceof HTMLImageElement) {
              lcpElement.fetchPriority = 'high';
              lcpElement.loading = 'eager';
            }
          }
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      observersRef.current.push(lcpObserver);
    } catch (e) {
      // LCP observer not supported
    }

    // Monitor Resource Blocking
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: PerformanceResourceTiming) => {
          const blockingTime = entry.connectEnd - entry.startTime;
          if (blockingTime > 500 && entry.initiatorType === 'script') {
            addIssue({
              type: 'blocking',
              severity: blockingTime > 1000 ? 'critical' : 'warning',
              message: `Blocking resource: ${entry.name.split('/').pop()} (${blockingTime.toFixed(0)}ms)`,
              suggestion: 'Use async/defer for scripts, preload critical resources',
            });
          }
        });
      });
      resourceObserver.observe({ type: 'resource', buffered: true });
      observersRef.current.push(resourceObserver);
    } catch (e) {
      // Resource observer not supported
    }

    // Monitor Memory (if available)
    if (performance.memory) {
      const checkMemory = () => {
        const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
        const usage = usedJSHeapSize / jsHeapSizeLimit;
        
        if (usage > 0.8) {
          addIssue({
            type: 'memory',
            severity: usage > 0.9 ? 'critical' : 'warning',
            message: `High memory usage: ${(usage * 100).toFixed(1)}%`,
            suggestion: 'Check for memory leaks, remove unused event listeners, clean up large data structures',
          });
        }
      };
      
      const memoryInterval = setInterval(checkMemory, 30000);
      return () => clearInterval(memoryInterval);
    }

    return () => {
      observersRef.current.forEach((obs) => obs.disconnect());
    };
  }, [addIssue, enableAutoFix]);

  return <>{children}</>;
};

// Performance debugging overlay (dev only)
export const PerformanceDebugOverlay: React.FC = () => {
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const updateMetrics = () => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      setMetrics({
        TTFB: nav?.responseStart - nav?.requestStart || 0,
        FCP: paint.find((e) => e.name === 'first-contentful-paint')?.startTime || 0,
        DOMContentLoaded: nav?.domContentLoadedEventEnd - nav?.startTime || 0,
        Load: nav?.loadEventEnd - nav?.startTime || 0,
      });
    };

    window.addEventListener('load', updateMetrics);
    const interval = setInterval(updateMetrics, 2000);

    // Toggle with Ctrl+Shift+P
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible((v) => !v);
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('load', updateMetrics);
      clearInterval(interval);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white text-xs p-3 rounded-lg z-[9999] font-mono">
      <div className="font-bold mb-2">Performance Metrics</div>
      {Object.entries(metrics).map(([key, value]) => (
        <div key={key} className="flex justify-between gap-4">
          <span>{key}:</span>
          <span className={value > 2500 ? 'text-red-400' : value > 1000 ? 'text-yellow-400' : 'text-green-400'}>
            {value.toFixed(0)}ms
          </span>
        </div>
      ))}
      <div className="text-muted-foreground mt-2 text-[10px]">Ctrl+Shift+P to toggle</div>
    </div>
  );
};

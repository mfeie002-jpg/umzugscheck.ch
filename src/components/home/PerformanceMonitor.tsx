import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
}

export const PerformanceMonitor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    // Collect Web Vitals
    if ('web-vitals' in window || typeof window !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const entryType = entry.entryType;
          
          if (entryType === 'largest-contentful-paint') {
            setMetrics((prev) => ({
              ...prev!,
              lcp: (entry as any).renderTime || (entry as any).loadTime,
            }));
          }
        }
      });

      observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // Get other metrics from Navigation Timing API
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          setMetrics({
            lcp: 0,
            fid: 0,
            cls: 0,
            ttfb: navigation.responseStart - navigation.requestStart,
          });
        }
      }, 1000);
    }

    // Show monitor after 2 seconds
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!metrics) return null;

  const getStatus = (metric: number, thresholds: [number, number]) => {
    if (metric <= thresholds[0]) return { color: "text-green-600", label: "Good" };
    if (metric <= thresholds[1]) return { color: "text-yellow-600", label: "Needs Improvement" };
    return { color: "text-red-600", label: "Poor" };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Card className="shadow-2xl border-2 border-primary/30 w-80">
            <CardContent className="p-4">
              <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h4 className="font-bold text-foreground">Performance</h4>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground">TTFB</span>
                    <span className={getStatus(metrics.ttfb, [800, 1800]).color}>
                      {Math.round(metrics.ttfb)}ms
                    </span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        metrics.ttfb <= 800
                          ? "bg-green-500"
                          : metrics.ttfb <= 1800
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min((metrics.ttfb / 2000) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {metrics.lcp > 0 && (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-muted-foreground">LCP</span>
                      <span className={getStatus(metrics.lcp, [2500, 4000]).color}>
                        {Math.round(metrics.lcp)}ms
                      </span>
                    </div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          metrics.lcp <= 2500
                            ? "bg-green-500"
                            : metrics.lcp <= 4000
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min((metrics.lcp / 5000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Dev only • Real metrics from Web Vitals
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

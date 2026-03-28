/**
 * CTA Visibility Checker Component
 * Automatically checks if sticky CTAs are visible and not overlapped
 * Shows overlay with results and logs affected flows
 */

import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertTriangle, CheckCircle2, X, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CtaCheckResult {
  flowId: string;
  flowName: string;
  isVisible: boolean;
  isOverlapped: boolean;
  overlappingElements: string[];
  ctaRect: DOMRect | null;
  timestamp: Date;
}

interface CtaVisibilityCheckerProps {
  /** Enable/disable the checker */
  enabled?: boolean;
  /** Class name for positioning */
  className?: string;
}

export function CtaVisibilityChecker({ enabled = true, className }: CtaVisibilityCheckerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [checkResults, setCheckResults] = useState<CtaCheckResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  // Selectors for common sticky CTA elements
  const CTA_SELECTORS = [
    '[class*="sticky"][class*="cta"]',
    '[class*="StickyCtaBar"]',
    '[class*="StickyMobileCTA"]',
    '[class*="StickyFooter"]',
    '[class*="fixed"][class*="bottom-0"]',
    '.fixed.bottom-0 button',
    '[data-cta="sticky"]',
  ];

  // Elements that might overlap with CTAs
  const OVERLAPPING_SELECTORS = [
    '.site-bottom-nav',
    '[class*="MobileBottomNav"]',
    '[class*="trust-bar"]',
    '[class*="TrustBar"]',
    'nav[class*="fixed"]',
    '[class*="floating"]',
    '[class*="fab"]',
  ];

  const checkCtaVisibility = useCallback(() => {
    setIsChecking(true);
    const results: CtaCheckResult[] = [];

    // Find all potential sticky CTAs
    let ctaElements: Element[] = [];
    CTA_SELECTORS.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (!ctaElements.includes(el)) {
            ctaElements.push(el);
          }
        });
      } catch (e) {
        // Invalid selector, skip
      }
    });

    // Find all potential overlapping elements
    let overlappingElements: Element[] = [];
    OVERLAPPING_SELECTORS.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (!overlappingElements.includes(el)) {
            overlappingElements.push(el);
          }
        });
      } catch (e) {
        // Invalid selector, skip
      }
    });

    // Check each CTA
    ctaElements.forEach((cta, index) => {
      const ctaRect = cta.getBoundingClientRect();
      const ctaStyle = window.getComputedStyle(cta);
      
      // Check if CTA is visible
      const isVisible = 
        ctaStyle.display !== 'none' &&
        ctaStyle.visibility !== 'hidden' &&
        ctaStyle.opacity !== '0' &&
        ctaRect.height > 0 &&
        ctaRect.width > 0;

      // Check for overlapping elements
      const overlaps: string[] = [];
      overlappingElements.forEach(overlap => {
        if (overlap === cta || overlap.contains(cta) || cta.contains(overlap)) return;
        
        const overlapRect = overlap.getBoundingClientRect();
        const overlapStyle = window.getComputedStyle(overlap);
        
        // Skip if overlapping element is not visible
        if (overlapStyle.display === 'none' || overlapStyle.visibility === 'hidden') return;

        // Check for overlap
        const overlapsHorizontally = ctaRect.left < overlapRect.right && ctaRect.right > overlapRect.left;
        const overlapsVertically = ctaRect.top < overlapRect.bottom && ctaRect.bottom > overlapRect.top;
        
        if (overlapsHorizontally && overlapsVertically) {
          // Check z-index
          const ctaZ = parseInt(ctaStyle.zIndex) || 0;
          const overlapZ = parseInt(overlapStyle.zIndex) || 0;
          
          if (overlapZ >= ctaZ) {
            const className = overlap.className.toString().split(' ').slice(0, 3).join(' ');
            overlaps.push(className || overlap.tagName.toLowerCase());
          }
        }
      });

      // Get flow name from context or parent
      const flowName = cta.closest('[data-flow-name]')?.getAttribute('data-flow-name') ||
                       document.title.replace(' | Umzugscheck.ch', '') ||
                       `CTA #${index + 1}`;

      results.push({
        flowId: `cta-${index}`,
        flowName,
        isVisible,
        isOverlapped: overlaps.length > 0,
        overlappingElements: overlaps,
        ctaRect,
        timestamp: new Date(),
      });
    });

    // If no CTAs found, add a warning result
    if (results.length === 0) {
      results.push({
        flowId: 'no-cta',
        flowName: 'Kein Sticky CTA gefunden',
        isVisible: false,
        isOverlapped: false,
        overlappingElements: [],
        ctaRect: null,
        timestamp: new Date(),
      });
    }

    setCheckResults(results);
    setLastCheck(new Date());
    setIsChecking(false);

    // Log results to console
    console.group('🔍 CTA Visibility Check');
    console.log('Timestamp:', new Date().toISOString());
    results.forEach(result => {
      if (!result.isVisible || result.isOverlapped) {
        console.warn(`❌ ${result.flowName}:`, {
          visible: result.isVisible,
          overlapped: result.isOverlapped,
          overlappingElements: result.overlappingElements,
        });
      } else {
        console.log(`✅ ${result.flowName}: OK`);
      }
    });
    console.groupEnd();

    return results;
  }, []);

  // Auto-check on mount and route changes
  useEffect(() => {
    if (!enabled) return;
    
    // Initial check after render
    const timeout = setTimeout(() => {
      checkCtaVisibility();
    }, 1000);

    return () => clearTimeout(timeout);
  }, [enabled, checkCtaVisibility]);

  // Listen for route changes
  useEffect(() => {
    if (!enabled) return;

    const handleRouteChange = () => {
      setTimeout(checkCtaVisibility, 500);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [enabled, checkCtaVisibility]);

  if (!enabled) return null;

  const hasIssues = checkResults.some(r => !r.isVisible || r.isOverlapped);
  const issueCount = checkResults.filter(r => !r.isVisible || r.isOverlapped).length;

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed z-[9999] w-12 h-12 rounded-full shadow-lg",
          "flex items-center justify-center",
          "transition-colors touch-manipulation",
          hasIssues
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-green-500 hover:bg-green-600 text-white",
          className || "top-20 right-4"
        )}
        title="CTA Sichtbarkeits-Check"
      >
        {hasIssues ? (
          <div className="relative">
            <EyeOff size={20} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
              {issueCount}
            </span>
          </div>
        ) : (
          <Eye size={20} />
        )}
      </motion.button>

      {/* Overlay Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed top-16 right-4 z-[9999] w-80 max-h-[70vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
              <div className="flex items-center gap-2">
                <Eye size={18} className="text-blue-400" />
                <h3 className="font-semibold text-white text-sm">CTA Check</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => checkCtaVisibility()}
                  disabled={isChecking}
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Erneut prüfen"
                >
                  <RefreshCw size={16} className={isChecking ? 'animate-spin' : ''} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-[50vh]">
              {/* Summary */}
              <div className={cn(
                "p-3 rounded-xl flex items-center gap-3",
                hasIssues ? "bg-red-500/10 border border-red-500/30" : "bg-green-500/10 border border-green-500/30"
              )}>
                {hasIssues ? (
                  <AlertTriangle className="text-red-400 shrink-0" size={20} />
                ) : (
                  <CheckCircle2 className="text-green-400 shrink-0" size={20} />
                )}
                <div>
                  <div className={cn("font-medium text-sm", hasIssues ? "text-red-400" : "text-green-400")}>
                    {hasIssues ? `${issueCount} Problem(e) gefunden` : 'Alle CTAs sichtbar'}
                  </div>
                  {lastCheck && (
                    <div className="text-xs text-slate-500">
                      Letzte Prüfung: {lastCheck.toLocaleTimeString('de-CH')}
                    </div>
                  )}
                </div>
              </div>

              {/* Details Toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
              >
                <span>Details ({checkResults.length} Elemente)</span>
                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {/* Detailed Results */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    {checkResults.map((result, index) => (
                      <div
                        key={result.flowId}
                        className={cn(
                          "p-3 rounded-xl text-sm",
                          result.isVisible && !result.isOverlapped
                            ? "bg-slate-800 border border-slate-700"
                            : "bg-red-500/10 border border-red-500/30"
                        )}
                      >
                        <div className="flex items-start gap-2">
                          {result.isVisible && !result.isOverlapped ? (
                            <CheckCircle2 className="text-green-400 shrink-0 mt-0.5" size={14} />
                          ) : (
                            <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={14} />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">
                              {result.flowName}
                            </div>
                            {!result.isVisible && (
                              <div className="text-red-400 text-xs mt-1">
                                ⚠️ CTA nicht sichtbar
                              </div>
                            )}
                            {result.isOverlapped && (
                              <div className="text-red-400 text-xs mt-1">
                                ⚠️ Überlappt von: {result.overlappingElements.join(', ')}
                              </div>
                            )}
                            {result.ctaRect && (
                              <div className="text-slate-500 text-xs mt-1">
                                Position: {Math.round(result.ctaRect.bottom)}px vom Top
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-700 bg-slate-800">
              <p className="text-xs text-slate-500 text-center">
                💡 Prüft automatisch ob Sticky CTAs überlappt werden
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default CtaVisibilityChecker;

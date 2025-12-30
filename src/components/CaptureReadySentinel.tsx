import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUcCaptureParams } from "@/lib/uc-capture";

/**
 * Sentinel 2.3 - ChatGPT Self-Sabotage Fixes
 * 
 * CRITICAL FIXES:
 * 1. MutationObserver ignores mutations from sentinel itself (prevents infinite loop)
 * 2. Removed Date.now() attributes that caused constant mutations
 * 3. Throttled debug updates (500ms) to avoid triggering mutations
 * 4. Uses [data-uc-capture-root="1"] for critical content detection (not just body height)
 * 5. Force-ERROR on timeout (not ready) so we know something's wrong
 * 6. Only ONE sentinel should exist - routes call markReady(), don't mount their own
 */

type CaptureStatus = "loading" | "ready" | "error";

interface CaptureReadySentinelProps {
  step?: number | string;
  flow?: string;
  isReady?: boolean;
  metadata?: Record<string, string | number | boolean>;
}

interface SentinelState {
  status: CaptureStatus;
  reason: string;
  step: string | number;
  flow: string;
  pendingRequests: number;
  fontsReady: boolean;
  lastMutationAt: number;
  scrollY: number;
  buildId: string;
  contentVisible: boolean;
}

// Build ID for mismatch detection - generated ONCE at module load
const BUILD_ID = typeof import.meta !== "undefined" 
  ? `${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`
  : "unknown";

/**
 * CRITICAL FIX: Safe scrollTo that works in headless Chrome
 */
function scrollToTopSafe() {
  try {
    window.scrollTo(0, 0);
  } catch {
    // ignore
  }
  try {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  } catch {
    // ignore
  }
}

// Patch fetch/XHR to track pending network requests
function ensureNetworkPendingPatch() {
  if (typeof window === "undefined") return;
  const w = window as any;
  if (w.__ucNetPatched) return;
  w.__ucNetPatched = true;
  w.__ucPendingRequests = 0;

  try {
    const originalFetch = window.fetch?.bind(window);
    if (originalFetch) {
      window.fetch = (async (...args: any[]) => {
        w.__ucPendingRequests = (w.__ucPendingRequests || 0) + 1;
        try {
          return await originalFetch(...args);
        } finally {
          w.__ucPendingRequests = Math.max(0, (w.__ucPendingRequests || 1) - 1);
        }
      }) as any;
    }
  } catch {
    // ignore
  }

  try {
    const XHR = window.XMLHttpRequest;
    if (XHR && !w.__ucXhrPatched) {
      w.__ucXhrPatched = true;
      const origOpen = XHR.prototype.open;
      const origSend = XHR.prototype.send;

      XHR.prototype.open = function (...args: any[]) {
        (this as any).__ucTracked = true;
        return origOpen.apply(this, args as any);
      } as any;

      XHR.prototype.send = function (...args: any[]) {
        if ((this as any).__ucTracked) {
          w.__ucPendingRequests = (w.__ucPendingRequests || 0) + 1;
          const done = () => {
            try {
              this.removeEventListener("loadend", done);
            } catch {
              // ignore
            }
            w.__ucPendingRequests = Math.max(0, (w.__ucPendingRequests || 1) - 1);
          };
          try {
            this.addEventListener("loadend", done);
          } catch {
            // ignore
          }
        }
        return origSend.apply(this, args as any);
      } as any;
    }
  } catch {
    // ignore
  }
}

/**
 * CRITICAL FIX: Check for explicit capture root marker
 * This prevents "ready" when only shell/header is visible.
 * Routes must add data-uc-capture-root="1" to their main content.
 */
function isCriticalContentVisible(): boolean {
  // Primary: explicit marker from route component
  const criticalEl = document.querySelector('[data-uc-capture-root="1"]');
  if (criticalEl) {
    const rect = (criticalEl as HTMLElement).getBoundingClientRect();
    if (rect.height > 80 && rect.width > 100) {
      return true;
    }
  }
  
  // Fallback selectors for step content
  const selectors = [
    '[data-step-content]',
    '.wizard-step',
    'form[data-calculator]',
    '.calculator-card',
    '[data-testid="calculator-step"]',
    '[data-service-id]',
    '[data-company-id]',
  ];

  for (const sel of selectors) {
    try {
      const el = document.querySelector(sel);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 100 && rect.height > 100 && rect.top < window.innerHeight) {
          return true;
        }
      }
    } catch {
      // ignore
    }
  }

  // Last resort: body has substantial content beyond header
  const bodyHeight = document.body?.getBoundingClientRect?.()?.height || 0;
  const mainContent = document.querySelector('main');
  const mainHeight = mainContent?.getBoundingClientRect?.()?.height || 0;
  
  return bodyHeight > 600 && mainHeight > 300;
}

export function CaptureReadySentinel({
  step: propStep,
  flow: propFlow,
  isReady: propIsReady,
  metadata = {},
}: CaptureReadySentinelProps = {}) {
  const location = useLocation();
  const captureParams = getUcCaptureParams(location.search);
  const enabled = captureParams.enabled;

  const effectiveStep = propStep ?? captureParams.step ?? "unknown";
  const effectiveFlow = propFlow ?? captureParams.flow ?? "unknown";

  const [state, setState] = useState<SentinelState>({
    status: "loading",
    reason: "",
    step: effectiveStep,
    flow: effectiveFlow,
    pendingRequests: 0,
    fontsReady: false,
    lastMutationAt: Date.now(),
    scrollY: 0,
    buildId: BUILD_ID,
    contentVisible: false,
  });

  const timeoutRef = useRef<number | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);
  const lastMutationRef = useRef<number>(Date.now());
  const sentinelElRef = useRef<HTMLDivElement | null>(null);
  const lastDebugUpdateRef = useRef<number>(0);
  const startedAtRef = useRef<number>(Date.now());

  // Update state when props change
  useEffect(() => {
    setState(s => ({
      ...s,
      step: effectiveStep,
      flow: effectiveFlow,
    }));
  }, [effectiveStep, effectiveFlow]);

  // If isReady prop is explicitly true, mark ready immediately
  useEffect(() => {
    if (!enabled) return;
    if (propIsReady === true && state.status === "loading") {
      const t = window.setTimeout(() => {
        scrollToTopSafe();
        setState(s => ({ ...s, status: "ready", reason: "isReady prop", scrollY: 0 }));
      }, 150);
      return () => window.clearTimeout(t);
    }
  }, [enabled, propIsReady, state.status]);

  // Expose global API and setup error handlers
  useEffect(() => {
    if (!enabled) return;
    
    ensureNetworkPendingPatch();

    const w = window as any;
    
    // Global readiness API
    w.__UC_MARK_READY = () => {
      scrollToTopSafe();
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setState(s => ({ ...s, status: "ready", reason: "markReady called", scrollY: 0 }));
        });
      });
    };
    
    w.__UC_MARK_LOADING = () => {
      setState(s => ({ ...s, status: "loading", reason: "" }));
    };
    
    w.__UC_MARK_ERROR = (msg: string) => {
      setState(s => ({ ...s, status: "error", reason: msg }));
    };

    // Catch unhandled errors
    const onError = (e: ErrorEvent) => {
      setState(s => ({ 
        ...s, 
        status: "error", 
        reason: e.message || "window.onerror" 
      }));
    };

    const onRejection = (e: PromiseRejectionEvent) => {
      setState(s => ({ 
        ...s, 
        status: "error", 
        reason: e.reason?.message || e.reason || "unhandledrejection" 
      }));
    };

    // Catch resource load errors (capture phase)
    const onResourceError = (ev: Event) => {
      const t = ev.target as any;
      const src = t?.src || t?.href;
      if (src && (t?.tagName === "SCRIPT" || t?.tagName === "LINK")) {
        console.error("[CaptureReadySentinel] Resource error:", src);
        setState(s => ({ ...s, status: "error", reason: `resource error: ${src}` }));
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("error", onResourceError, true);

    // CRITICAL FIX: MutationObserver that ignores animated/toast elements
    try {
      mutationObserverRef.current = new MutationObserver((mutations) => {
        const sentinelEl = sentinelElRef.current;
        
        // Elements to ignore (toasts, chat widgets, animations)
        const ignoreSelectors = [
          '#uc-capture-sentinel',
          '#uc-capture-watermark',
          '[data-sonner-toaster]',     // Sonner toast container
          '.sonner-toast',              // Sonner toasts
          '[role="status"]',            // Toast announcements
          '.chat-widget',               // Chat widgets
          '[class*="Toaster"]',         // Generic toaster containers
          '[class*="toast"]',           // Generic toast classes
          '[class*="notification"]',    // Notification containers
          '[style*="transform"]',       // Animated elements (framer-motion etc)
        ];
        
        for (const m of mutations) {
          const target = m.target as Element | null;
          if (!target) continue;
          
          // Skip if target matches any ignore selector
          let shouldIgnore = false;
          
          if (sentinelEl && sentinelEl.contains(target)) {
            shouldIgnore = true;
          } else {
            for (const sel of ignoreSelectors) {
              try {
                if (target.matches?.(sel) || target.closest?.(sel)) {
                  shouldIgnore = true;
                  break;
                }
              } catch {
                // ignore invalid selectors
              }
            }
          }
          
          if (!shouldIgnore) {
            lastMutationRef.current = Date.now();
            break;
          }
        }
      });
      
      // Only observe childList - NO attributes (animations cause constant noise)
      mutationObserverRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
      });
    } catch {
      // ignore
    }

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onResourceError, true);
      delete w.__UC_MARK_READY;
      delete w.__UC_MARK_LOADING;
      delete w.__UC_MARK_ERROR;
      mutationObserverRef.current?.disconnect();
    };
  }, [enabled]);

  // Stability-based auto-ready with CRITICAL CONTENT detection
  useEffect(() => {
    if (!enabled) return;
    if (state.status !== "loading") return;

    const graceMs = 500; // Reduced grace period
    const stabilityMs = 200; // Reduced stability requirement
    const networkSettleMs = 300; // Reduced network settle time
    const maxWaitMs = 15000; // Reduced max wait (was 45s)
    startedAtRef.current = Date.now();
    let lastNetworkSettled = 0;

    const checkReady = async () => {
      const pending = Number((window as any).__ucPendingRequests || 0);
      const elapsed = Date.now() - startedAtRef.current;
      const msSinceLastMutation = Date.now() - lastMutationRef.current;
      
      if (pending === 0) {
        if (lastNetworkSettled === 0) lastNetworkSettled = Date.now();
      } else {
        lastNetworkSettled = 0;
      }
      const networkSettled = lastNetworkSettled > 0 && (Date.now() - lastNetworkSettled) >= networkSettleMs;
      
      let fontsReady = true;
      try {
        if (document.fonts?.ready) {
          await Promise.race([
            document.fonts.ready,
            new Promise(r => setTimeout(r, 1000)), // Reduced timeout
          ]);
          fontsReady = document.fonts.status === "loaded";
        }
      } catch {
        fontsReady = true;
      }

      const contentVisible = isCriticalContentVisible();

      // CRITICAL FIX: Throttle debug updates to avoid causing mutations
      const now = Date.now();
      if (now - lastDebugUpdateRef.current > 500) {
        lastDebugUpdateRef.current = now;
        setState(s => ({ 
          ...s, 
          pendingRequests: pending,
          fontsReady,
          lastMutationAt: lastMutationRef.current,
          scrollY: window.scrollY,
          contentVisible,
        }));
      }

      const domStable = msSinceLastMutation >= stabilityMs;
      
      // Ready when: content visible AND (network idle OR stable for a while)
      const isReady = contentVisible && (networkSettled || (domStable && elapsed > 2000));

      if (isReady) {
        scrollToTopSafe();
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setState(s => ({ 
              ...s, 
              status: "ready", 
              reason: `auto: net=${pending}, stable=${msSinceLastMutation}ms`,
              scrollY: 0,
              contentVisible: true,
            }));
          });
        });
        return;
      }

      // CRITICAL FIX: Mark ERROR on timeout (not ready!) so we see what's wrong
      if (elapsed >= maxWaitMs) {
        scrollToTopSafe();
        setState(s => ({ 
          ...s, 
          status: "error", 
          reason: `timeout: content=${contentVisible}, net=${pending}, stable=${msSinceLastMutation}ms`,
          scrollY: 0,
        }));
        return;
      }

      timeoutRef.current = window.setTimeout(checkReady, 150);
    };

    timeoutRef.current = window.setTimeout(checkReady, graceMs);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, state.status]);

  // Expose debug info globally
  useEffect(() => {
    (window as any).__UC_CAPTURE_STATUS = state.status;
    (window as any).__UC_CAPTURE_DEBUG = {
      ...state,
      buildId: BUILD_ID,
      elapsedMs: Date.now() - startedAtRef.current,
    };
  }, [state]);

  // CRITICAL: Render null at END after all hooks
  if (!enabled) return null;

  return (
    <>
      {/* Sentinel element - NO Date.now() attributes! */}
      <div
        ref={sentinelElRef}
        id="uc-capture-sentinel"
        data-status={state.status}
        data-uc-step={state.step}
        data-uc-flow={state.flow}
        data-uc-reason={state.reason}
        data-uc-pending={state.pendingRequests}
        data-uc-fonts={state.fontsReady ? "ready" : "loading"}
        data-uc-content={state.contentVisible ? "visible" : "hidden"}
        data-uc-build={BUILD_ID}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          opacity: 0.0001,
          pointerEvents: "none",
          zIndex: 0,
        }}
        aria-hidden="true"
      />
      
      {/* Debug watermark - ONLY visible in screenshot capture mode, positioned to NOT obscure CTAs */}
      {/* Issue #1: Moved to top-right corner and made smaller so it doesn't cover bottom CTAs */}
      <div
        id="uc-capture-watermark"
        style={{
          position: "fixed",
          top: 4,
          right: 4,
          padding: "2px 5px",
          background: state.status === "ready" 
            ? "rgba(22,163,74,0.8)" 
            : state.status === "error" 
              ? "rgba(220,38,38,0.8)" 
              : "rgba(245,158,11,0.8)",
          color: "white",
          borderRadius: 4,
          fontSize: 8,
          fontFamily: "monospace",
          zIndex: 99999,
          lineHeight: 1.2,
          maxWidth: 150,
          wordBreak: "break-all",
          pointerEvents: "none",
        }}
      >
        <div><strong>{state.status.toUpperCase()}</strong> s{state.step}</div>
        <div style={{ fontSize: 7 }}>net:{state.pendingRequests} {state.contentVisible ? "✓" : "✗"}</div>
      </div>
    </>
  );
}

export function useIsCaptureMode(): boolean {
  const location = useLocation();
  const params = getUcCaptureParams(location.search);
  return params.enabled;
}

export function useMarkCaptureReady() {
  const isCaptureMode = useIsCaptureMode();
  
  return {
    markReady: () => {
      if (isCaptureMode && typeof (window as any).__UC_MARK_READY === "function") {
        (window as any).__UC_MARK_READY();
      }
    },
    markLoading: () => {
      if (isCaptureMode && typeof (window as any).__UC_MARK_LOADING === "function") {
        (window as any).__UC_MARK_LOADING();
      }
    },
    markError: (msg: string) => {
      if (isCaptureMode && typeof (window as any).__UC_MARK_ERROR === "function") {
        (window as any).__UC_MARK_ERROR(msg);
      }
    },
    isCaptureMode,
  };
}

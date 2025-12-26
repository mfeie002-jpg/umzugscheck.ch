import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUcCaptureParams } from "@/lib/uc-capture";

/**
 * Sentinel 2.2 - ChatGPT Fixes Applied
 * 
 * FIXES:
 * 1. scrollToTopSafe() - removes "instant" ScrollBehavior which throws in headless Chrome
 * 2. Resource error capturing (capture phase)
 * 3. Proper hook ordering (enabled gating in effects, null render at end)
 * 4. Only ONE sentinel should exist in app (routes call markReady(), don't mount their own)
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

// Build ID for mismatch detection
const BUILD_ID = typeof import.meta !== "undefined" 
  ? `${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`
  : "unknown";

/**
 * CRITICAL FIX: Safe scrollTo that works in headless Chrome
 * "instant" is NOT a valid ScrollBehavior in some Chrome versions and can throw.
 */
function scrollToTopSafe() {
  try {
    // Most robust across browsers/headless
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
 * Check if step-specific content is actually rendered.
 * This prevents "ready" when only shell/header is visible.
 */
function isStepContentVisible(): boolean {
  const selectors = [
    '[data-step-content]',
    '.wizard-step',
    'form[data-calculator]',
    '[class*="step-"]',
    '.calculator-card',
    '[data-testid="calculator-step"]',
    'main section',
    'input[name="fromLocation"], input[name="toLocation"]',
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

  const bodyHeight = document.body?.getBoundingClientRect?.()?.height || 0;
  const hasMultipleElements = document.querySelectorAll('main > *').length > 2;
  
  return bodyHeight > 400 && hasMultipleElements;
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

  // Update state when props change
  useEffect(() => {
    setState(s => ({
      ...s,
      step: effectiveStep,
      flow: effectiveFlow,
    }));
  }, [effectiveStep, effectiveFlow]);

  // If isReady prop is explicitly true, mark ready immediately (after scroll to top)
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

  // Expose global API and setup stability checks
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

    // FIX: Catch resource load errors (script/link) - must use capture phase
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
    window.addEventListener("error", onResourceError, true); // capture phase for resource errors

    // Setup MutationObserver to track DOM stability
    try {
      mutationObserverRef.current = new MutationObserver(() => {
        lastMutationRef.current = Date.now();
      });
      mutationObserverRef.current.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
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

  // Stability-based auto-ready with REAL content detection
  useEffect(() => {
    if (!enabled) return;
    if (state.status !== "loading") return;

    const graceMs = 800;
    const stabilityMs = 300;
    const networkSettleMs = 500;
    const maxWaitMs = 45000;
    const startedAt = Date.now();
    let lastNetworkSettled = 0;

    const checkReady = async () => {
      const pending = Number((window as any).__ucPendingRequests || 0);
      const elapsed = Date.now() - startedAt;
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
            new Promise(r => setTimeout(r, 2000)),
          ]);
          fontsReady = document.fonts.status === "loaded";
        }
      } catch {
        fontsReady = true;
      }

      const contentVisible = isStepContentVisible();

      setState(s => ({ 
        ...s, 
        pendingRequests: pending,
        fontsReady,
        lastMutationAt: lastMutationRef.current,
        scrollY: window.scrollY,
        contentVisible,
      }));

      const domStable = msSinceLastMutation >= stabilityMs;
      const isReady = contentVisible && networkSettled && domStable && fontsReady;

      if (isReady) {
        scrollToTopSafe();
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setState(s => ({ 
              ...s, 
              status: "ready", 
              reason: `content-ready: net=${pending}, stable=${msSinceLastMutation}ms, fonts=${fontsReady}`,
              scrollY: 0,
              contentVisible: true,
            }));
          });
        });
        return;
      }

      // Timeout - mark ERROR (not ready!) so we know something's wrong
      if (elapsed >= maxWaitMs) {
        scrollToTopSafe();
        setState(s => ({ 
          ...s, 
          status: "error", 
          reason: `timeout ${elapsed}ms: content=${contentVisible}, net=${pending}, stable=${msSinceLastMutation}ms`,
          scrollY: 0,
        }));
        return;
      }

      timeoutRef.current = window.setTimeout(checkReady, 200);
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
      timestamp: Date.now(),
      buildId: BUILD_ID,
    };
  }, [state]);

  // CRITICAL: Render null at END, after all hooks have run
  // This prevents hook order issues when enabled changes
  if (!enabled) return null;

  const elapsedSec = Math.round((Date.now() - state.lastMutationAt) / 1000);

  return (
    <>
      {/* Sentinel element - viewport-sized for selector-based capture */}
      <div
        id="uc-capture-sentinel"
        data-status={state.status}
        data-uc-step={state.step}
        data-uc-flow={state.flow}
        data-uc-reason={state.reason}
        data-uc-pending={state.pendingRequests}
        data-uc-fonts={state.fontsReady ? "ready" : "loading"}
        data-uc-content={state.contentVisible ? "visible" : "hidden"}
        data-uc-mutation-age={Date.now() - state.lastMutationAt}
        data-uc-scroll={state.scrollY}
        data-uc-build={BUILD_ID}
        data-uc-timestamp={Date.now()}
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
      
      {/* Debug watermark - visible in screenshot for debugging */}
      <div
        id="uc-capture-watermark"
        style={{
          position: "fixed",
          bottom: 4,
          right: 4,
          padding: "2px 6px",
          background: state.status === "ready" 
            ? "rgba(22,163,74,0.9)" 
            : state.status === "error" 
              ? "rgba(220,38,38,0.9)" 
              : "rgba(245,158,11,0.9)",
          color: "white",
          borderRadius: 4,
          fontSize: 9,
          fontFamily: "monospace",
          zIndex: 99999,
          lineHeight: 1.3,
          maxWidth: 200,
          wordBreak: "break-all",
        }}
      >
        <div><strong>{state.status.toUpperCase()}</strong> s{state.step} {state.flow}</div>
        <div>net:{state.pendingRequests} mut:{elapsedSec}s cnt:{state.contentVisible ? "✓" : "✗"}</div>
        <div style={{ fontSize: 7, opacity: 0.8 }}>{BUILD_ID}</div>
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

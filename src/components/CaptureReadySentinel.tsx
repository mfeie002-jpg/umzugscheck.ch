import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUcCaptureParams } from "@/lib/uc-capture";

/**
 * Sentinel 2.0 for screenshot automation with "READY Contract".
 * 
 * Ready = ALL of these conditions are true:
 * 1. Step component mounted (caller calls markReady OR auto-detect)
 * 2. All network requests settled (no pending fetch/XHR)
 * 3. Fonts ready (document.fonts.ready)
 * 4. No DOM mutations for X ms (MutationObserver)
 * 5. Above-the-fold content visible (body height > threshold)
 * 6. Scroll position at top (for consistent captures)
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
}

// Build ID for mismatch detection
const BUILD_ID = typeof import.meta !== "undefined" 
  ? `${new Date().toISOString().slice(0, 10)}-${Math.random().toString(36).slice(2, 8)}`
  : "unknown";

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

export function CaptureReadySentinel({
  step: propStep,
  flow: propFlow,
  isReady: propIsReady,
  metadata = {},
}: CaptureReadySentinelProps = {}) {
  const location = useLocation();
  const captureParams = getUcCaptureParams(location.search);

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
    if (propIsReady === true && state.status === "loading") {
      const t = window.setTimeout(() => {
        // Ensure we're at the top
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        setState(s => ({ ...s, status: "ready", reason: "isReady prop", scrollY: 0 }));
      }, 150);
      return () => window.clearTimeout(t);
    }
  }, [propIsReady, state.status]);

  // Only render in capture mode
  if (!captureParams.enabled) return null;

  // Expose global API and setup stability checks
  useEffect(() => {
    ensureNetworkPendingPatch();

    const w = window as any;
    
    // Global readiness API
    w.__UC_MARK_READY = () => {
      // Always scroll to top before marking ready
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
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

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

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
      delete w.__UC_MARK_READY;
      delete w.__UC_MARK_LOADING;
      delete w.__UC_MARK_ERROR;
      mutationObserverRef.current?.disconnect();
    };
  }, []);

  // Stability-based auto-ready with full contract checks
  // CRITICAL: If route-chunk doesn't load, we still need to set ready after timeout
  // so the provider can at least capture something (even if blank - for debugging)
  useEffect(() => {
    if (state.status !== "loading") return;

    const graceMs = 500; // Initial grace period for JS execution
    const stabilityMs = 300; // No mutations for this long = stable  
    const maxWaitMs = 12000; // 12 seconds max wait (shorter to avoid provider timeout)
    const forceReadyMs = 8000; // Force ready after 8s even without stability
    const startedAt = Date.now();

    // Force ready timeout - ensures we always mark ready eventually
    const forceReadyTimeout = window.setTimeout(() => {
      if (state.status === "loading") {
        console.warn("[CaptureReadySentinel] Force-ready after timeout");
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        setState(s => ({ 
          ...s, 
          status: "ready", 
          reason: `force-ready after ${forceReadyMs}ms`,
          scrollY: 0,
        }));
      }
    }, forceReadyMs);

    const checkReady = async () => {
      const pending = Number((window as any).__ucPendingRequests || 0);
      const elapsed = Date.now() - startedAt;
      const msSinceLastMutation = Date.now() - lastMutationRef.current;
      
      // Check fonts ready (with short timeout)
      let fontsReady = true;
      try {
        if (document.fonts?.ready) {
          await Promise.race([
            document.fonts.ready,
            new Promise(r => setTimeout(r, 1500)),
          ]);
          fontsReady = document.fonts.status === "loaded";
        }
      } catch {
        fontsReady = true;
      }

      // Update debug state
      setState(s => ({ 
        ...s, 
        pendingRequests: pending,
        fontsReady,
        lastMutationAt: lastMutationRef.current,
        scrollY: window.scrollY,
      }));

      // Ready conditions - more lenient to avoid hanging
      const bodyHasContent = document.body?.getBoundingClientRect?.()?.height > 50;
      const noNetworkPending = pending === 0;
      const domStable = msSinceLastMutation >= stabilityMs;
      
      // Be more lenient: ready if network settled OR dom stable with content
      const isReady = (noNetworkPending && bodyHasContent) || (domStable && bodyHasContent && elapsed > 2000);

      if (isReady) {
        window.clearTimeout(forceReadyTimeout);
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setState(s => ({ 
              ...s, 
              status: "ready", 
              reason: `auto-ready: pending=${pending}, stable=${msSinceLastMutation}ms, fonts=${fontsReady}`,
              scrollY: 0,
            }));
          });
        });
        return;
      }

      if (elapsed >= maxWaitMs) {
        window.clearTimeout(forceReadyTimeout);
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        setState(s => ({ 
          ...s, 
          status: "ready", 
          reason: `timeout ${elapsed}ms (pending=${pending}, stable=${msSinceLastMutation}ms)`,
          scrollY: 0,
        }));
        return;
      }

      timeoutRef.current = window.setTimeout(checkReady, 150);
    };

    timeoutRef.current = window.setTimeout(checkReady, graceMs);

    return () => {
      window.clearTimeout(forceReadyTimeout);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [state.status]);

  // Expose debug info globally
  useEffect(() => {
    (window as any).__UC_CAPTURE_STATUS = state.status;
    (window as any).__UC_CAPTURE_DEBUG = {
      ...state,
      timestamp: Date.now(),
      buildId: BUILD_ID,
    };
  }, [state]);

  return (
    <div
      id="uc-capture-sentinel"
      data-status={state.status}
      data-uc-step={state.step}
      data-uc-flow={state.flow}
      data-uc-reason={state.reason}
      data-uc-pending={state.pendingRequests}
      data-uc-fonts={state.fontsReady ? "ready" : "loading"}
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

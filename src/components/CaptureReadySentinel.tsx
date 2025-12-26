import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUcCaptureParams } from "@/lib/uc-capture";

/**
 * Sentinel 2.0 for screenshot automation.
 * 
 * - Always rendered at root level in capture mode
 * - Exposes global API for routes to signal readiness
 * - Auto-catches unhandled errors and sets status=error
 * - Never causes infinite loops from animation observation
 */

type CaptureStatus = "loading" | "ready" | "error";

interface CaptureReadySentinelProps {
  /** The current step being rendered (optional - will use URL params if not provided) */
  step?: number | string;
  /** The flow variant being rendered (optional - will use URL params if not provided) */
  flow?: string;
  /** Whether the wizard content is fully ready (optional - enables immediate ready) */
  isReady?: boolean;
  /** Optional additional metadata for debugging */
  metadata?: Record<string, string | number | boolean>;
}

interface SentinelState {
  status: CaptureStatus;
  reason: string;
  step: string | number;
  flow: string;
  pendingRequests: number;
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
  });

  const timeoutRef = useRef<number | null>(null);

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
    if (propIsReady === true && state.status === "loading") {
      // Small delay to ensure DOM is painted
      const t = window.setTimeout(() => {
        setState(s => ({ ...s, status: "ready", reason: "isReady prop" }));
      }, 100);
      return () => window.clearTimeout(t);
    }
  }, [propIsReady, state.status]);

  // Only render in capture mode
  if (!captureParams.enabled) return null;

  // Expose global API for routes/components to signal readiness
  useEffect(() => {
    ensureNetworkPendingPatch();

    const w = window as any;
    
    // Global readiness API
    w.__UC_MARK_READY = () => {
      setState(s => ({ ...s, status: "ready", reason: "markReady called" }));
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

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
      delete w.__UC_MARK_READY;
      delete w.__UC_MARK_LOADING;
      delete w.__UC_MARK_ERROR;
    };
  }, []);

  // Auto-ready after grace period if no explicit markReady called
  // This ensures we don't hang forever
  useEffect(() => {
    if (state.status !== "loading") return;

    // Short grace period, then check conditions
    const graceMs = 500;
    const maxWaitMs = 20000; // 20 seconds max wait

    const startedAt = Date.now();

    const checkReady = () => {
      const pending = Number((window as any).__ucPendingRequests || 0);
      const elapsed = Date.now() - startedAt;
      
      // Update pending count for debug display
      setState(s => ({ ...s, pendingRequests: pending }));

      // Ready conditions:
      // 1. No pending network requests AND body has content
      // 2. OR timeout reached
      const bodyHasContent =
        document.body &&
        document.body.getBoundingClientRect &&
        document.body.getBoundingClientRect().height > 50;

      if (pending === 0 && bodyHasContent) {
        setState(s => ({ ...s, status: "ready", reason: "auto-ready: no pending, content visible" }));
        return;
      }

      if (elapsed >= maxWaitMs) {
        setState(s => ({ ...s, status: "ready", reason: `timeout after ${elapsed}ms (pending: ${pending})` }));
        return;
      }

      // Keep checking
      timeoutRef.current = window.setTimeout(checkReady, 250);
    };

    timeoutRef.current = window.setTimeout(checkReady, graceMs);

    return () => {
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
      data-uc-scroll={typeof window !== "undefined" ? String(window.scrollY) : "0"}
      data-uc-timestamp={Date.now()}
      style={{
        // IMPORTANT: viewport-sized to make provider `selector` cropping safe.
        // The screenshot provider crops to the selector's bounding box.
        // By making this box = viewport, we avoid 1px "micro screenshots".
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

/**
 * Hook to check if we're in capture mode
 */
export function useIsCaptureMode(): boolean {
  const location = useLocation();
  const params = getUcCaptureParams(location.search);
  return params.enabled;
}

/**
 * Hook to mark the current component/page as ready for capture.
 * Call this when your component has finished loading all critical data.
 */
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

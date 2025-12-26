import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUcCaptureParams } from "@/lib/uc-capture";

/**
 * Sentinel element for screenshot automation.
 *
 * "Sentinel 2.0": The element always exists in capture-mode, but its status changes from
 * loading -> ready (or error). Screenshot tools can wait for:
 *   #uc-capture-sentinel[data-status="ready"]
 *
 * This avoids invalid/fragile selectors while still allowing deterministic readiness.
 */

interface CaptureReadySentinelProps {
  /** The current step being rendered */
  step?: number | string;
  /** The flow variant being rendered */
  flow?: string;
  /** Whether the wizard content is fully ready (data loaded, components mounted) */
  isReady: boolean;
  /** Optional additional metadata for debugging */
  metadata?: Record<string, string | number | boolean>;
}

type CaptureStatus = "loading" | "ready" | "error";

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
  step,
  flow,
  isReady,
  metadata = {},
}: CaptureReadySentinelProps) {
  const location = useLocation();
  const captureParams = getUcCaptureParams(location.search);

  const [status, setStatus] = useState<CaptureStatus>("loading");
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const lastMutationAtRef = useRef<number>(Date.now());
  const stableSinceRef = useRef<number>(Date.now());

  const flowId = useMemo(
    () => flow || captureParams.flow || "unknown",
    [flow, captureParams.flow]
  );

  // Only render anything in capture mode.
  if (!captureParams.enabled) return null;

  // Provide global debug hooks (optional, but useful during flaky provider captures).
  (window as any).__UC_CAPTURE_STATUS = status;
  (window as any).__UC_CAPTURE_DEBUG = {
    step: step ?? captureParams.step ?? null,
    flow: flowId,
    pendingRequests: (window as any).__ucPendingRequests ?? null,
    lastMutationAt: lastMutationAtRef.current,
    now: Date.now(),
    ...metadata,
  };

  useEffect(() => {
    ensureNetworkPendingPatch();

    // Track DOM stability
    lastMutationAtRef.current = Date.now();
    stableSinceRef.current = Date.now();

    const mo = new MutationObserver(() => {
      lastMutationAtRef.current = Date.now();
      stableSinceRef.current = Date.now();
    });

    try {
      mo.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      });
    } catch {
      // ignore
    }

    return () => {
      try {
        mo.disconnect();
      } catch {
        // ignore
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const go = async () => {
      setErrorCode(null);

      if (!isReady) {
        setStatus("loading");
        return;
      }

      // Fonts readiness (deterministic, but with timeout so we never hang forever)
      const fontsReady = async () => {
        const d: any = document as any;
        if (!d?.fonts?.ready) return;
        await Promise.race([
          d.fonts.ready,
          new Promise((resolve) => window.setTimeout(resolve, 8000)),
        ]);
      };

      try {
        await fontsReady();

        // Stability gate: no DOM mutations + no pending requests for X ms.
        const stableMs = 900;
        const maxWaitMs = 90_000;
        const startedAt = Date.now();

        while (!cancelled) {
          const now = Date.now();
          const pending = Number((window as any).__ucPendingRequests || 0);
          const lastMutationAgo = now - lastMutationAtRef.current;

          const bodyHasContent =
            document.body &&
            document.body.getBoundingClientRect &&
            document.body.getBoundingClientRect().height > 0;

          const stable = pending === 0 && lastMutationAgo >= stableMs && bodyHasContent;

          if (stable) {
            setStatus("ready");
            return;
          }

          if (now - startedAt > maxWaitMs) {
            setStatus("error");
            setErrorCode("timeout");
            return;
          }

          await new Promise((r) => window.setTimeout(r, 250));
        }
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setErrorCode(e instanceof Error ? e.message : "unknown");
      }
    };

    void go();

    return () => {
      cancelled = true;
    };
  }, [isReady]);

  return (
    <div
      id="uc-capture-sentinel"
      data-status={status}
      data-uc-step={step ?? captureParams.step ?? "unknown"}
      data-uc-flow={flowId}
      data-uc-error={errorCode || ""}
      data-uc-timestamp={Date.now()}
      {...Object.fromEntries(
        Object.entries(metadata).map(([k, v]) => [`data-uc-${k}`, String(v)])
      )}
      style={{
        position: "fixed",
        left: "-9999px",
        top: "-9999px",
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
      aria-hidden="true"
    >
      {status}{errorCode ? `:${errorCode}` : ""}
    </div>
  );
}

/**
 * Simple hook to check if we're in capture mode
 */
export function useIsCaptureMode(): boolean {
  const location = useLocation();
  const params = getUcCaptureParams(location.search);
  return params.enabled;
}

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUcCaptureParams } from "@/lib/uc-capture";

/**
 * Invisible sentinel element that signals "the wizard/page is fully rendered and ready for capture."
 * 
 * ScreenshotMachine can use selector=#uc-capture-ready to:
 * 1. Verify the page actually rendered correctly (selector found = success)
 * 2. Fail fast if wizard didn't render (selector not found = invalid_selector error)
 * 
 * Usage: Place this at the end of your wizard/calculator component, 
 * and only render it when all content is loaded.
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

export function CaptureReadySentinel({ 
  step, 
  flow, 
  isReady,
  metadata = {}
}: CaptureReadySentinelProps) {
  const location = useLocation();
  const captureParams = getUcCaptureParams(location.search);
  const [mounted, setMounted] = useState(false);
  
  // Delay mounting slightly to ensure DOM is stable
  useEffect(() => {
    if (isReady) {
      const timer = setTimeout(() => setMounted(true), 100);
      return () => clearTimeout(timer);
    }
    setMounted(false);
  }, [isReady]);
  
  // Only render in capture mode when ready
  if (!captureParams.enabled || !isReady || !mounted) {
    return null;
  }
  
  return (
    <div
      id="uc-capture-ready"
      data-uc-step={step}
      data-uc-flow={flow || captureParams.flow || "unknown"}
      data-uc-timestamp={Date.now()}
      {...Object.fromEntries(
        Object.entries(metadata).map(([k, v]) => [`data-uc-${k}`, String(v)])
      )}
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: 1,
        height: 1,
        opacity: 0,
        pointerEvents: "none",
        zIndex: -1,
      }}
      aria-hidden="true"
    />
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

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getUcCaptureParams } from "@/lib/uc-capture";

/**
 * Debug overlay that shows in capture mode (uc_capture=1) to help diagnose
 * blue/blank screenshot issues. Shows current status, step, and pending requests.
 * 
 * This overlay is positioned off-screen but visible for debugging when needed.
 * In production captures, the screenshot tool crops the visible area.
 */
export function CaptureDebugOverlay() {
  const location = useLocation();
  const captureParams = getUcCaptureParams(location.search);
  const [status, setStatus] = useState<string>("initializing");
  const [pendingRequests, setPendingRequests] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Only render in capture mode
  if (!captureParams.enabled) return null;

  // Track status
  useEffect(() => {
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      setElapsed(Math.round((Date.now() - startTime) / 1000));
      setPendingRequests(Number((window as any).__ucPendingRequests || 0));
      
      const sentinel = document.getElementById("uc-capture-sentinel");
      if (sentinel) {
        setStatus(sentinel.getAttribute("data-status") || "no-status");
      } else {
        setStatus("no-sentinel");
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const isReady = status === "ready";
  const hasError = status === "error" || status === "no-sentinel";

  // Position overlay at top-left to avoid covering UI elements (Issue #1, #6, #11)
  return (
    <div
      id="uc-capture-debug"
      style={{
        position: "fixed",
        top: 10,
        left: 10,
        padding: "6px 10px",
        background: hasError ? "#dc2626" : isReady ? "#16a34a" : "#f59e0b",
        color: "white",
        borderRadius: 4,
        fontSize: 10,
        fontFamily: "monospace",
        zIndex: 99999,
        opacity: 0.85,
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        maxWidth: 140,
        pointerEvents: "none", // Prevent blocking any clicks
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 2, fontSize: 9 }}>
        📷 Capture
      </div>
      <div style={{ fontSize: 9 }}>
        {status} | S{captureParams.step ?? "?"} | {elapsed}s
      </div>
    </div>
  );
}

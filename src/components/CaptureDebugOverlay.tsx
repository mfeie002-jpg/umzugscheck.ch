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

  return (
    <div
      id="uc-capture-debug"
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        padding: "8px 12px",
        background: hasError ? "#dc2626" : isReady ? "#16a34a" : "#f59e0b",
        color: "white",
        borderRadius: 6,
        fontSize: 11,
        fontFamily: "monospace",
        zIndex: 99999,
        opacity: 0.95,
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
      }}
    >
      <div style={{ fontWeight: "bold", marginBottom: 2 }}>
        📷 Capture Mode
      </div>
      <div>Status: <strong>{status}</strong></div>
      <div>Step: {captureParams.step ?? "auto"}</div>
      <div>Flow: {captureParams.flow ?? "default"}</div>
      <div>Pending: {pendingRequests}</div>
      <div>Elapsed: {elapsed}s</div>
    </div>
  );
}

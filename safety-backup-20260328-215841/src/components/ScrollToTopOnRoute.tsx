import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Check if in capture/render mode - skip scroll to avoid interfering with screenshot
function isCaptureModeActive(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const p = new URLSearchParams(window.location.search);
    return p.get("uc_capture") === "1" || p.get("uc_render") === "1";
  } catch {
    return false;
  }
}

export const ScrollToTopOnRoute = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Skip scroll in capture mode - CaptureReadySentinel handles scroll positioning
    if (isCaptureModeActive()) return;
    
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

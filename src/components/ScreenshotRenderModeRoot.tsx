import { useEffect } from "react";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";

/**
 * Adds a global CSS hook for screenshot rendering (uc_render=1).
 * Goal: avoid "white blocks" caused by in-view animations (e.g. framer-motion whileInView).
 */
export function ScreenshotRenderModeRoot() {
  useEffect(() => {
    const el = document.documentElement;
    const enabled = isScreenshotRenderMode();

    if (enabled) el.classList.add("uc-render");
    else el.classList.remove("uc-render");

    return () => {
      el.classList.remove("uc-render");
    };
  }, []);

  return null;
}

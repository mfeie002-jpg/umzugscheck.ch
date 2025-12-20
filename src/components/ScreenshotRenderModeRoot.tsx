import { useEffect } from "react";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";

// Apply the screenshot rendering class as early as possible (before first paint).
// Many screenshot engines capture before React effects run, which can leave whileInView sections hidden.
if (typeof window !== "undefined") {
  try {
    if (isScreenshotRenderMode()) {
      document.documentElement.classList.add("uc-render");
    }
  } catch {
    // ignore
  }
}

/**
 * Adds a global CSS hook for screenshot rendering (uc_render=1).
 * Goal: avoid "white blocks" caused by in-view animations (e.g. framer-motion whileInView)
 * and eager-load images even if they were marked as `loading=lazy`.
 */
export function ScreenshotRenderModeRoot() {
  useEffect(() => {
    const el = document.documentElement;
    const enabled = isScreenshotRenderMode();

    if (enabled) el.classList.add("uc-render");
    else el.classList.remove("uc-render");

    if (enabled) {
      // Force eager loading for all images so full-page screenshot tools don't capture unloaded lazy images.
      const imgs = Array.from(document.images);
      imgs.forEach((img) => {
        try {
          img.loading = "eager";
          img.decoding = "sync";
          img.setAttribute("fetchpriority", "high");
        } catch {
          // ignore
        }
      });
    }

    return () => {
      el.classList.remove("uc-render");
    };
  }, []);

  return null;
}

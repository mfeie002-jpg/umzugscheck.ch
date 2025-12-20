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

    let t1: number | undefined;
    let t2: number | undefined;

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

      // Trigger IntersectionObserver-based animations (framer-motion whileInView / useInView)
      // by doing a quick scroll sweep. Many screenshot engines don't scroll, leaving sections hidden.
      const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      t1 = window.setTimeout(() => {
        try {
          window.scrollTo({ top: maxY, left: 0, behavior: "instant" as ScrollBehavior });
        } catch {
          try {
            window.scrollTo(0, maxY);
          } catch {
            // ignore
          }
        }
        try {
          window.dispatchEvent(new Event("scroll"));
        } catch {
          // ignore
        }
      }, 100);

      t2 = window.setTimeout(() => {
        try {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        } catch {
          try {
            window.scrollTo(0, 0);
          } catch {
            // ignore
          }
        }
        try {
          window.dispatchEvent(new Event("scroll"));
          window.dispatchEvent(new Event("resize"));
        } catch {
          // ignore
        }
      }, 350);
    }

    return () => {
      if (t1) window.clearTimeout(t1);
      if (t2) window.clearTimeout(t2);
      el.classList.remove("uc-render");
    };
  }, []);

  return null;
}

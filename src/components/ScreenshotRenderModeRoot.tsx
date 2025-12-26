import { useEffect } from "react";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";

function getCaptureRenderMode() {
  if (typeof window === "undefined") {
    return { enabled: false, capture: false, render: false };
  }
  try {
    const params = new URLSearchParams(window.location.search);
    const capture = params.get("uc_capture") === "1";
    const render = params.get("uc_render") === "1";
    return { enabled: capture || render, capture, render };
  } catch {
    return { enabled: false, capture: false, render: false };
  }
}

// Apply the screenshot rendering hooks as early as possible (before first paint).
// Many screenshot engines capture before React effects run.
if (typeof window !== "undefined") {
  try {
    const mode = getCaptureRenderMode();

    if (mode.enabled) {
      // Classes:
      // - uc-render: legacy "render mode" (explicit uc_render=1)
      // - uc-capture: capture-mode (uc_capture=1)
      if (mode.render || isScreenshotRenderMode()) document.documentElement.classList.add("uc-render");
      if (mode.capture) document.documentElement.classList.add("uc-capture");

      // Patch IntersectionObserver so whileInView/useInView content renders immediately.
      const w = window as any;
      if (!w.__ucIntersectionObserverPatched && "IntersectionObserver" in window) {
        w.__ucIntersectionObserverPatched = true;
        w.__ucOriginalIntersectionObserver = window.IntersectionObserver;

        const defer = (fn: () => void) =>
          typeof (globalThis as any).queueMicrotask === "function"
            ? (globalThis as any).queueMicrotask(fn)
            : Promise.resolve().then(fn);

        class UCIntersectionObserver implements IntersectionObserver {
          readonly root: Element | Document | null;
          readonly rootMargin: string;
          readonly thresholds: ReadonlyArray<number>;
          private _callback: IntersectionObserverCallback;

          constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
            this._callback = callback;
            this.root = options?.root ?? null;
            this.rootMargin = options?.rootMargin ?? "0px";
            const t = options?.threshold ?? 0;
            this.thresholds = Array.isArray(t) ? t : [t];
          }

          observe = (target: Element) => {
            defer(() => {
              const rect = (target as any).getBoundingClientRect?.() ?? ({} as any);
              const entry = {
                target,
                isIntersecting: true,
                intersectionRatio: 1,
                time: (globalThis.performance?.now?.() ?? Date.now()) as number,
                boundingClientRect: rect,
                intersectionRect: rect,
                rootBounds: null,
              } as IntersectionObserverEntry;
              this._callback([entry], this);
            });
          };

          unobserve = () => {};
          disconnect = () => {};
          takeRecords = () => [];
        }

        window.IntersectionObserver = UCIntersectionObserver as any;
      }
    }
  } catch {
    // ignore
  }
}

/**
 * Capture-mode render stabilizer.
 * - Avoid hidden whileInView sections (IntersectionObserver patch above)
 * - Eager-load images
 * - Freeze animations/transitions (reduce flakiness)
 * - IMPORTANT: No scroll-sweeps in capture-mode (can trigger blank/odd states in providers)
 */
export function ScreenshotRenderModeRoot() {
  useEffect(() => {
    const el = document.documentElement;
    const mode = getCaptureRenderMode();

    // Maintain classes
    if (mode.render || isScreenshotRenderMode()) el.classList.add("uc-render");
    else el.classList.remove("uc-render");

    if (mode.capture) el.classList.add("uc-capture");
    else el.classList.remove("uc-capture");

    let styleEl: HTMLStyleElement | null = null;
    let t1: number | undefined;
    let t2: number | undefined;

    if (mode.enabled) {
      // Inject capture-safe CSS overrides
      styleEl = document.getElementById("uc-capture-style") as HTMLStyleElement | null;
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "uc-capture-style";
        styleEl.textContent = `
          html.uc-capture *,
          html.uc-render * {
            scroll-behavior: auto !important;
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 1ms !important;
            transition-delay: 0ms !important;
          }
          @media (prefers-reduced-motion: no-preference) {
            html.uc-capture {
              --uc-reduce-motion: 1;
            }
          }
        `;
        document.head.appendChild(styleEl);
      }

      // Force eager loading for all images
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

      // Scroll sweeps are ONLY for explicit uc_render=1 (not for capture-mode)
      if (mode.render || isScreenshotRenderMode()) {
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
    }

    return () => {
      if (t1) window.clearTimeout(t1);
      if (t2) window.clearTimeout(t2);
      try {
        el.classList.remove("uc-render");
        el.classList.remove("uc-capture");
      } catch {
        // ignore
      }

      try {
        const s = document.getElementById("uc-capture-style");
        if (s) s.remove();
      } catch {
        // ignore
      }
    };
  }, []);

  return null;
}

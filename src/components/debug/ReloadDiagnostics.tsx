import { useEffect } from "react";

/**
 * Logs unexpected hard reloads (e.g. after screenshot / focus changes).
 * Only active on Lovable preview domains to avoid noisy production logs.
 */
export function ReloadDiagnostics() {
  useEffect(() => {
    const isLovablePreview = (() => {
      try {
        return window.location.hostname.endsWith("lovableproject.com");
      } catch {
        return false;
      }
    })();

    if (!isLovablePreview) return;

    const safeWrap = <T extends (...args: any[]) => any>(
      _name: string,
      fn: T,
      wrapper: (orig: T) => T
    ): T => {
      try {
        return wrapper(fn);
      } catch {
        return fn;
      }
    };

    // Patch reload/replace/assign to log stack traces when they're invoked.
    // NOTE: This does not block reloads; it only helps us identify the source.
    try {
      const loc = window.location as unknown as {
        reload: () => void;
        replace: (url: string) => void;
        assign: (url: string) => void;
      };

      const origReload = loc.reload?.bind(window.location);
      const origReplace = loc.replace?.bind(window.location);
      const origAssign = loc.assign?.bind(window.location);

      if (origReload) {
        (loc as any).reload = safeWrap("location.reload", origReload, (orig) => {
          return (() => {
            // eslint-disable-next-line no-console
            console.warn("[ReloadDiagnostics] location.reload() called", {
              href: window.location.href,
              hidden: document.hidden,
              visibilityState: document.visibilityState,
            });
            // eslint-disable-next-line no-console
            console.warn(new Error("location.reload stack").stack);
            return orig();
          }) as any;
        });
      }

      if (origReplace) {
        (loc as any).replace = safeWrap("location.replace", origReplace, (orig) => {
          return ((url: string) => {
            // eslint-disable-next-line no-console
            console.warn("[ReloadDiagnostics] location.replace() called", {
              to: url,
              from: window.location.href,
            });
            // eslint-disable-next-line no-console
            console.warn(new Error("location.replace stack").stack);
            return orig(url);
          }) as any;
        });
      }

      if (origAssign) {
        (loc as any).assign = safeWrap("location.assign", origAssign, (orig) => {
          return ((url: string) => {
            // eslint-disable-next-line no-console
            console.warn("[ReloadDiagnostics] location.assign() called", {
              to: url,
              from: window.location.href,
            });
            // eslint-disable-next-line no-console
            console.warn(new Error("location.assign stack").stack);
            return orig(url);
          }) as any;
        });
      }
    } catch {
      // ignore
    }

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      // eslint-disable-next-line no-console
      console.warn("[ReloadDiagnostics] beforeunload", {
        href: window.location.href,
        hidden: document.hidden,
        visibilityState: document.visibilityState,
      });
      // eslint-disable-next-line no-console
      console.warn(new Error("beforeunload stack").stack);
      return e;
    };

    const onVisibility = () => {
      // eslint-disable-next-line no-console
      console.debug("[ReloadDiagnostics] visibilitychange", {
        hidden: document.hidden,
        visibilityState: document.visibilityState,
      });
    };

    const onPageShow = (e: PageTransitionEvent) => {
      // eslint-disable-next-line no-console
      console.warn("[ReloadDiagnostics] pageshow", {
        persisted: e.persisted,
        href: window.location.href,
      });
    };

    const onPageHide = (e: PageTransitionEvent) => {
      // eslint-disable-next-line no-console
      console.warn("[ReloadDiagnostics] pagehide", {
        persisted: e.persisted,
        href: window.location.href,
      });
    };

    const onFocus = () => {
      // eslint-disable-next-line no-console
      console.debug("[ReloadDiagnostics] window.focus", {
        href: window.location.href,
      });
    };

    const onBlur = () => {
      // eslint-disable-next-line no-console
      console.debug("[ReloadDiagnostics] window.blur", {
        href: window.location.href,
      });
    };

    try {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      // eslint-disable-next-line no-console
      console.debug("[ReloadDiagnostics] navigation", {
        type: nav?.type,
        redirectCount: nav?.redirectCount,
        href: window.location.href,
      });
    } catch {
      // ignore
    }

    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}

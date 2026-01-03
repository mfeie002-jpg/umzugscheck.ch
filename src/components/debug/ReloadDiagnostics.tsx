import { useEffect, useRef } from "react";

/**
 * Enhanced diagnostics for unexpected hard reloads / scroll jumps.
 * Active on Lovable preview domains to trace what causes refresh.
 */
export function ReloadDiagnostics() {
  const mountTime = useRef(Date.now());

  useEffect(() => {
    const isLovablePreview = (() => {
      try {
        return (
          window.location.hostname.endsWith("lovableproject.com") ||
          window.location.hostname.endsWith("lovable.app")
        );
      } catch {
        return false;
      }
    })();

    if (!isLovablePreview) return;

    // eslint-disable-next-line no-console
    console.info(
      "%c[ReloadDiagnostics] Active",
      "color: cyan; font-weight: bold",
      {
        mountedAt: new Date().toISOString(),
        href: window.location.href,
      }
    );

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

    // ---------- Patch navigation methods to log stack traces ----------
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
            console.warn(
              "%c[ReloadDiagnostics] location.reload() called",
              "color: red; font-weight: bold",
              {
                href: window.location.href,
                hidden: document.hidden,
                visibilityState: document.visibilityState,
              }
            );
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
            console.warn(
              "%c[ReloadDiagnostics] location.replace() called",
              "color: red; font-weight: bold",
              {
                to: url,
                from: window.location.href,
              }
            );
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
            console.warn(
              "%c[ReloadDiagnostics] location.assign() called",
              "color: red; font-weight: bold",
              {
                to: url,
                from: window.location.href,
              }
            );
            // eslint-disable-next-line no-console
            console.warn(new Error("location.assign stack").stack);
            return orig(url);
          }) as any;
        });
      }
    } catch {
      // ignore
    }

    // ---------- Patch scrollTo to catch programmatic scrolls ----------
    // SKIP patching in capture/render mode to avoid breaking screenshot stability
    const skipScrollPatch = (() => {
      try {
        const p = new URLSearchParams(window.location.search);
        return p.get("uc_capture") === "1" || p.get("uc_render") === "1";
      } catch { return false; }
    })();
    
    if (!skipScrollPatch) {
      try {
        const origScrollTo = window.scrollTo.bind(window);
        (window as any).scrollTo = (...args: any[]) => {
          const scrollY = typeof args[0] === "number" ? args[0] : (args[0] as ScrollToOptions)?.top;
          // Only log scroll-to-top (likely culprit for unwanted jumps)
          if (scrollY === 0 || scrollY === undefined) {
            // eslint-disable-next-line no-console
            console.warn(
              "%c[ReloadDiagnostics] window.scrollTo(0) detected",
              "color: orange; font-weight: bold",
              { args, href: window.location.href }
            );
            // eslint-disable-next-line no-console
            console.warn(new Error("scrollTo stack").stack);
          }
          return origScrollTo(...(args as [any]));
        };
      } catch {
        // ignore
      }
    }

    // ---------- Event listeners ----------
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      // eslint-disable-next-line no-console
      console.warn(
        "%c[ReloadDiagnostics] beforeunload",
        "color: red; font-weight: bold",
        {
          href: window.location.href,
          hidden: document.hidden,
          visibilityState: document.visibilityState,
          uptime: Date.now() - mountTime.current,
        }
      );
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

    const onPopState = (e: PopStateEvent) => {
      // eslint-disable-next-line no-console
      console.warn(
        "%c[ReloadDiagnostics] popstate (history navigation)",
        "color: purple; font-weight: bold",
        { state: e.state, href: window.location.href }
      );
    };

    const onHashChange = () => {
      // eslint-disable-next-line no-console
      console.warn(
        "%c[ReloadDiagnostics] hashchange",
        "color: purple; font-weight: bold",
        { href: window.location.href }
      );
    };

    // Log initial navigation type
    try {
      const nav = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      // eslint-disable-next-line no-console
      console.info("[ReloadDiagnostics] navigation", {
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
    window.addEventListener("popstate", onPopState);
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return null;
}

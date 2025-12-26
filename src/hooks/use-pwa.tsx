import { useEffect, useState } from "react";

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const isCaptureLike = (() => {
      try {
        const sp = new URLSearchParams(window.location.search);
        return sp.get("uc_capture") === "1" || sp.get("uc_render") === "1" || sp.has("uc_step");
      } catch {
        return false;
      }
    })();

    const isLovablePreview = (() => {
      try {
        return window.location.hostname.endsWith("lovableproject.com");
      } catch {
        return false;
      }
    })();

    // In preview we always disable SW to avoid cached build mismatches / broken navigation.
    // In capture mode we also remove any existing SWs.
    if ("serviceWorker" in navigator && (isCaptureLike || isLovablePreview)) {
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
    }

    // Register service worker only in real production environments (not preview) and not in capture/render modes.
    if (
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production" &&
      !isCaptureLike &&
      !isLovablePreview
    ) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Make sure we pick up the newest SW quickly.
          registration.update().catch(() => {});
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("PWA installed");
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return { isInstallable, installPWA };
};

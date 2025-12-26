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

    // Register service worker (skip in capture/render modes)
    if ("serviceWorker" in navigator && !isCaptureLike) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }

    // If we're in capture mode, ensure old SWs are removed (prevents cached build mismatches)
    if ("serviceWorker" in navigator && isCaptureLike) {
      navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
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

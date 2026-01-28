import { useEffect, useState } from "react";

// ✅ Published hostname - SW only registers here
const PUBLISHED_HOSTNAME = "umzugscheckv2.lovable.app";

export const usePWA = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for install prompt (works regardless of SW status)
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

  // Only show install option on published host
  const isPublishedHost = typeof window !== "undefined" && 
    window.location.hostname === PUBLISHED_HOSTNAME;

  return { 
    isInstallable: isInstallable && isPublishedHost, 
    installPWA 
  };
};

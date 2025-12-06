import React, { useEffect, useState, useCallback } from 'react';

interface ThirdPartyScript {
  id: string;
  src?: string;
  innerHTML?: string;
  async?: boolean;
  defer?: boolean;
  type?: string;
  onLoad?: () => void;
}

// Scripts to load after user interaction
const DEFERRED_SCRIPTS: ThirdPartyScript[] = [
  // Google Analytics 4
  {
    id: 'ga4-script',
    src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX',
    async: true,
  },
  {
    id: 'ga4-config',
    innerHTML: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX', {
        page_path: window.location.pathname,
        anonymize_ip: true,
        cookie_flags: 'SameSite=None;Secure'
      });
    `,
  },
];

// User interaction events that trigger script loading
const INTERACTION_EVENTS = [
  'mousedown',
  'mousemove',
  'keydown',
  'scroll',
  'touchstart',
  'click',
];

export const ThirdPartyScriptLoader: React.FC = () => {
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const loadScripts = useCallback(() => {
    if (scriptsLoaded) return;

    DEFERRED_SCRIPTS.forEach((script) => {
      if (document.getElementById(script.id)) return;

      const scriptElement = document.createElement('script');
      scriptElement.id = script.id;
      
      if (script.src) {
        scriptElement.src = script.src;
      }
      
      if (script.innerHTML) {
        scriptElement.innerHTML = script.innerHTML;
      }
      
      if (script.async) {
        scriptElement.async = true;
      }
      
      if (script.defer) {
        scriptElement.defer = true;
      }
      
      if (script.type) {
        scriptElement.type = script.type;
      }

      if (script.onLoad) {
        scriptElement.onload = script.onLoad;
      }

      document.head.appendChild(scriptElement);
    });

    setScriptsLoaded(true);
    console.log('[ThirdPartyScriptLoader] Scripts loaded after user interaction');
  }, [scriptsLoaded]);

  const handleInteraction = useCallback(() => {
    if (hasInteracted) return;
    
    setHasInteracted(true);
    
    // Small delay to not block the interaction
    requestIdleCallback ? 
      requestIdleCallback(() => loadScripts(), { timeout: 2000 }) :
      setTimeout(loadScripts, 100);
  }, [hasInteracted, loadScripts]);

  useEffect(() => {
    // Add interaction listeners
    INTERACTION_EVENTS.forEach((event) => {
      window.addEventListener(event, handleInteraction, { 
        once: true, 
        passive: true 
      });
    });

    // Also load after 5 seconds if no interaction (for SEO bots, etc.)
    const fallbackTimer = setTimeout(() => {
      if (!scriptsLoaded) {
        loadScripts();
      }
    }, 5000);

    return () => {
      INTERACTION_EVENTS.forEach((event) => {
        window.removeEventListener(event, handleInteraction);
      });
      clearTimeout(fallbackTimer);
    };
  }, [handleInteraction, loadScripts, scriptsLoaded]);

  return null;
};

// Hook to manually trigger third-party script loading
export const useLoadThirdPartyScripts = () => {
  const [loaded, setLoaded] = useState(false);

  const loadScript = useCallback((script: ThirdPartyScript) => {
    return new Promise<void>((resolve, reject) => {
      if (document.getElementById(script.id)) {
        resolve();
        return;
      }

      const scriptElement = document.createElement('script');
      scriptElement.id = script.id;
      
      if (script.src) {
        scriptElement.src = script.src;
        scriptElement.onload = () => resolve();
        scriptElement.onerror = () => reject(new Error(`Failed to load ${script.src}`));
      } else if (script.innerHTML) {
        scriptElement.innerHTML = script.innerHTML;
        resolve();
      }
      
      if (script.async) scriptElement.async = true;
      if (script.defer) scriptElement.defer = true;
      if (script.type) scriptElement.type = script.type;

      document.head.appendChild(scriptElement);
    });
  }, []);

  const loadAllScripts = useCallback(async () => {
    if (loaded) return;
    
    try {
      await Promise.all(DEFERRED_SCRIPTS.map(loadScript));
      setLoaded(true);
    } catch (error) {
      console.error('[ThirdPartyScriptLoader] Error loading scripts:', error);
    }
  }, [loaded, loadScript]);

  return { loaded, loadScript, loadAllScripts };
};

// Analytics event helper
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
};

// Page view tracking
export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', 'G-XXXXXXXXXX', {
      page_path: path,
      page_title: title,
    });
  }
};

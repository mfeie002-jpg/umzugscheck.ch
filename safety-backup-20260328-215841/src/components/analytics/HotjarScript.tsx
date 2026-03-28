import { useEffect } from 'react';

interface HotjarScriptProps {
  siteId?: string;
  hotjarVersion?: number;
}

/**
 * Hotjar integration component for session recording and heatmaps.
 * 
 * To enable Hotjar:
 * 1. Create an account at https://www.hotjar.com
 * 2. Get your Site ID from Settings > Sites & Organizations
 * 3. Pass the siteId prop or set VITE_HOTJAR_SITE_ID environment variable
 * 
 * Features enabled:
 * - Session recordings
 * - Heatmaps (click, scroll, move)
 * - User feedback widgets
 * - Conversion funnels
 */
export function HotjarScript({ 
  siteId = import.meta.env.VITE_HOTJAR_SITE_ID,
  hotjarVersion = 6 
}: HotjarScriptProps) {
  useEffect(() => {
    // Only initialize if we have a site ID and we're in production
    if (!siteId) {
      if (import.meta.env.DEV) {
        console.log('[Hotjar] No site ID configured. Set VITE_HOTJAR_SITE_ID to enable.');
      }
      return;
    }

    // Check if already initialized
    if ((window as any).hj) {
      return;
    }

    // Initialize Hotjar
    (function(h: any, o: Document, t: string, j: string, a?: HTMLElement, r?: HTMLScriptElement) {
      h.hj = h.hj || function() {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
      h._hjSettings = { hjid: parseInt(siteId), hjsv: hotjarVersion };
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script');
      r.async = true;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');

    if (import.meta.env.DEV) {
      console.log('[Hotjar] Initialized with site ID:', siteId);
    }
  }, [siteId, hotjarVersion]);

  return null;
}

/**
 * Hotjar event tracking utilities
 */
export const hotjar = {
  /**
   * Identify a user for session recordings
   */
  identify: (userId: string, attributes?: Record<string, string | number | boolean>) => {
    if ((window as any).hj) {
      (window as any).hj('identify', userId, attributes);
    }
  },

  /**
   * Tag a recording with a custom tag
   */
  tagRecording: (tags: string[]) => {
    if ((window as any).hj) {
      (window as any).hj('tagRecording', tags);
    }
  },

  /**
   * Trigger a Hotjar event (for custom heatmaps/surveys)
   */
  event: (eventName: string) => {
    if ((window as any).hj) {
      (window as any).hj('event', eventName);
    }
  },

  /**
   * Trigger state change (for SPA route changes)
   */
  stateChange: (path: string) => {
    if ((window as any).hj) {
      (window as any).hj('stateChange', path);
    }
  },

  /**
   * Trigger a feedback widget
   */
  trigger: (widgetId: string) => {
    if ((window as any).hj) {
      (window as any).hj('trigger', widgetId);
    }
  },
};

// Export type for window augmentation
declare global {
  interface Window {
    hj?: (...args: any[]) => void;
    _hjSettings?: {
      hjid: number;
      hjsv: number;
    };
  }
}

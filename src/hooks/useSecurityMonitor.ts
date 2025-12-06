import { useEffect, useCallback } from 'react';

interface SecurityEvent {
  type: 'xss_attempt' | 'csrf_mismatch' | 'rate_limit' | 'suspicious_activity' | 'clickjack_attempt';
  details: string;
  timestamp: number;
  userAgent: string;
  url: string;
}

/**
 * Security monitoring hook for detecting and logging suspicious activity.
 */
export const useSecurityMonitor = () => {
  const logSecurityEvent = useCallback((event: Omit<SecurityEvent, 'timestamp' | 'userAgent' | 'url'>) => {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn('Security Event:', fullEvent);
    }

    // In production, you would send this to your security logging endpoint
    // Example: sendToSecurityLog(fullEvent);
  }, []);

  useEffect(() => {
    // Monitor for XSS attempts in URL parameters
    const checkUrlForXSS = () => {
      const urlParams = window.location.search + window.location.hash;
      const xssPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+=/i,
        /data:text\/html/i,
        /<iframe/i,
        /<img[^>]+onerror/i
      ];

      for (const pattern of xssPatterns) {
        if (pattern.test(decodeURIComponent(urlParams))) {
          logSecurityEvent({
            type: 'xss_attempt',
            details: `Potential XSS in URL: ${urlParams.substring(0, 200)}`
          });
          break;
        }
      }
    };

    // Monitor for suspicious console access (devtools detection - basic)
    let devtoolsOpen = false;
    const threshold = 160;
    
    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if ((widthThreshold || heightThreshold) && !devtoolsOpen) {
        devtoolsOpen = true;
        // This is informational, not necessarily suspicious
        // Some users legitimately use devtools
      }
    };

    // Monitor for rapid navigation (potential automated attack)
    let navigationCount = 0;
    const navigationWindow = 10000; // 10 seconds
    
    const trackNavigation = () => {
      navigationCount++;
      
      if (navigationCount > 20) { // More than 20 navigations in 10 seconds
        logSecurityEvent({
          type: 'suspicious_activity',
          details: 'Rapid navigation detected - possible automated attack'
        });
      }

      setTimeout(() => {
        navigationCount = Math.max(0, navigationCount - 1);
      }, navigationWindow);
    };

    // Run initial checks
    checkUrlForXSS();
    
    // Set up listeners
    window.addEventListener('resize', checkDevTools);
    window.addEventListener('popstate', trackNavigation);

    // Monitor for DOM manipulation attempts (MutationObserver)
    const sensitiveSelectors = ['script', 'iframe[src*="javascript"]'];
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              for (const selector of sensitiveSelectors) {
                if (node.matches?.(selector) || node.querySelector?.(selector)) {
                  logSecurityEvent({
                    type: 'xss_attempt',
                    details: `Suspicious DOM insertion: ${node.tagName}`
                  });
                }
              }
            }
          });
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      window.removeEventListener('resize', checkDevTools);
      window.removeEventListener('popstate', trackNavigation);
      observer.disconnect();
    };
  }, [logSecurityEvent]);

  return { logSecurityEvent };
};

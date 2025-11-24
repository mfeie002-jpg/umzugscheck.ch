import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const AdvancedAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Track user session
    const sessionId = sessionStorage.getItem('session-id') || 
      `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('session-id', sessionId);

    // Track entry point
    if (!sessionStorage.getItem('entry-point')) {
      sessionStorage.setItem('entry-point', location.pathname);
      sessionStorage.setItem('entry-time', Date.now().toString());
    }

    // Track page sequence
    const pageSequence = JSON.parse(sessionStorage.getItem('page-sequence') || '[]');
    pageSequence.push({
      path: location.pathname,
      timestamp: Date.now(),
    });
    sessionStorage.setItem('page-sequence', JSON.stringify(pageSequence));

    // Track user engagement
    let scrollDepth = 0;
    let maxScrollDepth = 0;
    let timeOnPage = Date.now();
    let interactions = 0;

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      scrollDepth = ((scrollTop + windowHeight) / documentHeight) * 100;
      maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
    };

    const handleInteraction = () => {
      interactions++;
    };

    const handleBeforeUnload = () => {
      const duration = Date.now() - timeOnPage;
      
      // Send analytics data
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'user_engagement', {
          session_id: sessionId,
          page_path: location.pathname,
          duration_seconds: Math.floor(duration / 1000),
          max_scroll_depth: Math.round(maxScrollDepth),
          interactions_count: interactions,
          entry_point: sessionStorage.getItem('entry-point'),
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleInteraction);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location]);

  // Track visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', document.hidden ? 'page_hidden' : 'page_visible', {
          page_path: location.pathname,
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [location]);

  return null;
};

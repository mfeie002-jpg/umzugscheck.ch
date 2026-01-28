import { useEffect, useRef } from 'react';
import { trackConversion } from '@/lib/conversionTracker';

const ScrollDepthTracker = () => {
  const tracked = useRef<Set<number>>(new Set());

  useEffect(() => {
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );

      // Track at 25%, 50%, 75%, 100% milestones
      const milestones = [25, 50, 75, 100];
      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !tracked.current.has(milestone)) {
          tracked.current.add(milestone);
          
          // Track in conversion analytics
          trackConversion('scroll_milestone', { 
            depth: milestone,
            path: window.location.pathname 
          });
          
          // Also store in legacy analytics
          const scrollData = JSON.parse(localStorage.getItem('scroll-analytics') || '{}');
          const pagePath = window.location.pathname;
          if (!scrollData[pagePath]) {
            scrollData[pagePath] = { maxDepth: 0, visits: 0 };
          }
          scrollData[pagePath].maxDepth = Math.max(scrollData[pagePath].maxDepth, milestone);
          scrollData[pagePath].visits++;
          localStorage.setItem('scroll-analytics', JSON.stringify(scrollData));
        }
      });
    };

    window.addEventListener('scroll', trackScrollDepth, { passive: true });
    return () => window.removeEventListener('scroll', trackScrollDepth);
  }, []);

  return null;
};

export default ScrollDepthTracker;
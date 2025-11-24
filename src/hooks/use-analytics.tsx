import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { analytics } from "@/lib/analytics-tracker";

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    analytics.init();
  }, []);

  useEffect(() => {
    analytics.trackPageView(location.pathname);
  }, [location]);

  return analytics;
};

export const useScrollTracking = () => {
  useEffect(() => {
    let lastScrollDepth = 0;
    const milestones = [25, 50, 75, 100];

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollDepth = ((scrollTop + windowHeight) / documentHeight) * 100;

      milestones.forEach((milestone) => {
        if (scrollDepth >= milestone && lastScrollDepth < milestone) {
          analytics.trackScroll(milestone);
        }
      });

      lastScrollDepth = scrollDepth;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
};

export const useTimeTracking = () => {
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      if (duration > 5) {
        analytics.trackTimeOnPage(duration);
      }
    };
  }, []);
};

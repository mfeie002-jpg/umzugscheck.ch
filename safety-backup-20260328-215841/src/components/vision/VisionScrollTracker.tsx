/**
 * VisionScrollTracker - Track section visibility for analytics
 * Logs scroll depth and section views
 */

import { memo, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface VisionScrollTrackerProps {
  sectionId: string;
  sectionName: string;
  children: React.ReactNode;
  onSectionView?: (sectionId: string, sectionName: string) => void;
}

// Global tracking to prevent duplicate logs
const viewedSections = new Set<string>();

export const VisionScrollTracker = memo(({ 
  sectionId, 
  sectionName, 
  children,
  onSectionView 
}: VisionScrollTrackerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  
  useEffect(() => {
    if (isInView && !viewedSections.has(sectionId)) {
      viewedSections.add(sectionId);
      
      // Log to console for debugging
      console.log(`[Analytics] Section viewed: ${sectionName} (${sectionId})`);
      
      // Call callback if provided
      if (onSectionView) {
        onSectionView(sectionId, sectionName);
      }
      
      // Future: Send to analytics service
      // gtag('event', 'section_view', { section_id: sectionId, section_name: sectionName });
    }
  }, [isInView, sectionId, sectionName, onSectionView]);
  
  return (
    <div ref={ref} data-section-id={sectionId}>
      {children}
    </div>
  );
});

VisionScrollTracker.displayName = 'VisionScrollTracker';

// Hook for scroll depth tracking
export function useScrollDepthTracking() {
  useEffect(() => {
    let maxDepth = 0;
    const depths = [25, 50, 75, 90, 100];
    const loggedDepths = new Set<number>();
    
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const currentDepth = Math.round((scrollTop / scrollHeight) * 100);
      
      if (currentDepth > maxDepth) {
        maxDepth = currentDepth;
        
        depths.forEach(depth => {
          if (currentDepth >= depth && !loggedDepths.has(depth)) {
            loggedDepths.add(depth);
            console.log(`[Analytics] Scroll depth: ${depth}%`);
            // Future: gtag('event', 'scroll_depth', { depth: depth });
          }
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

// Reset function for SPA navigation
export function resetScrollTracking() {
  viewedSections.clear();
}

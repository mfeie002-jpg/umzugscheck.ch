import React, { createContext, useContext, useMemo } from 'react';
import { useFrameRateMonitor } from '@/hooks/useFrameRateMonitor';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { useIsMobile } from '@/hooks/use-mobile';

interface PerformanceContextValue {
  fps: number;
  performanceLevel: 'high' | 'medium' | 'low' | 'critical';
  shouldReduceAnimations: boolean;
  shouldDisableAnimations: boolean;
  shouldShowParticles: boolean;
  shouldShowComplexAnimations: boolean;
  shouldShowBackgroundEffects: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
}

const PerformanceContext = createContext<PerformanceContextValue | null>(null);

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const frameRate = useFrameRateMonitor({
    sampleSize: 30,
    lowFpsThreshold: 30,
    criticalFpsThreshold: 15,
    checkInterval: 2000,
  });
  
  const prefersReducedMotion = usePrefersReducedMotion();
  const isMobile = useIsMobile();

  const value = useMemo<PerformanceContextValue>(() => {
    const shouldReduceAnimations = 
      prefersReducedMotion || 
      frameRate.shouldReduceAnimations || 
      isMobile;

    const shouldDisableAnimations = 
      prefersReducedMotion || 
      frameRate.shouldDisableAnimations;

    return {
      fps: frameRate.fps,
      performanceLevel: frameRate.performanceLevel,
      shouldReduceAnimations,
      shouldDisableAnimations,
      shouldShowParticles: !shouldReduceAnimations && frameRate.performanceLevel === 'high',
      shouldShowComplexAnimations: !shouldReduceAnimations,
      shouldShowBackgroundEffects: !shouldDisableAnimations && !isMobile,
      isMobile,
      prefersReducedMotion,
    };
  }, [frameRate, prefersReducedMotion, isMobile]);

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

export function usePerformance(): PerformanceContextValue {
  const context = useContext(PerformanceContext);
  
  if (!context) {
    // Return safe defaults if used outside provider
    return {
      fps: 60,
      performanceLevel: 'high',
      shouldReduceAnimations: false,
      shouldDisableAnimations: false,
      shouldShowParticles: true,
      shouldShowComplexAnimations: true,
      shouldShowBackgroundEffects: true,
      isMobile: false,
      prefersReducedMotion: false,
    };
  }
  
  return context;
}

// HOC for components that need performance optimization
export function withPerformanceOptimization<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: {
    hideOnLowPerformance?: boolean;
    hideOnMobile?: boolean;
    hideOnReducedMotion?: boolean;
  } = {}
) {
  return function PerformanceOptimizedComponent(props: P) {
    const performance = usePerformance();

    if (options.hideOnLowPerformance && performance.shouldReduceAnimations) {
      return null;
    }

    if (options.hideOnMobile && performance.isMobile) {
      return null;
    }

    if (options.hideOnReducedMotion && performance.prefersReducedMotion) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}

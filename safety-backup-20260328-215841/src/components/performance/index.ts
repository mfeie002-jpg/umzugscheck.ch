// Performance Optimization Components & Utilities
// Central export file for all performance-related modules

// Components
export { ResourceHints, prefetchRoute, preloadImage } from './ResourceHints';
export { ThirdPartyScriptLoader, useLoadThirdPartyScripts, trackEvent, trackPageView } from './ThirdPartyScriptLoader';
export { OptimizedImage } from './OptimizedImage';
export { 
  DeferredContent, 
  IdleContent, 
  AfterHydration, 
  SkeletonLoader,
  useIntersectionTrigger 
} from './DeferredContent';
export { CriticalCSSLoader, deferStylesheet, removeUnusedCSS } from './CriticalCSSLoader';
export { PrefetchManager } from './PrefetchManager';
export { PerformanceOptimizer } from './PerformanceOptimizer';
export { PerformanceProvider, usePerformance } from './PerformanceProvider';
export { 
  createLazyComponent,
  preloadComponent,
  LazyVisible,
  LazyOnInteraction,
  dynamicImportWithRetry,
  ModulePreloader,
  ConditionalRender
} from './BundleOptimizer';

// Re-export hooks
export { useVirtualScroll } from '@/hooks/useVirtualScroll';
export { useNetworkStatus } from '@/hooks/useNetworkStatus';
export { 
  useCleanup, 
  useSafeState, 
  useMemoryMonitor, 
  useCache,
  useDebouncedCallback,
  useThrottledCallback,
  useObjectPool
} from '@/hooks/useMemoryOptimization';
export { 
  useImageFormatSupport,
  compressImage,
  useLazyImage,
  useProgressiveImage,
  generateResponsiveSrcSet,
  usePreloadImages,
  getOptimalImageFormat
} from '@/hooks/useImageOptimization';
export { useWebVitals } from '@/hooks/useWebVitals';

// Utilities from lib
export {
  preloadImage as preloadImageUtil,
  lazyLoadImage,
  generateSrcSet,
  debounce,
  throttle,
  measureCoreWebVitals,
  preconnect,
  dnsPrefetch,
  initPerformanceOptimizations,
  optimizeImages
} from '@/lib/performance';

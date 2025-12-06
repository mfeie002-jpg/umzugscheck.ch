import React, { createContext, useContext, useEffect, useState } from 'react';
import { ResourceHints } from './ResourceHints';
import { ThirdPartyScriptLoader } from './ThirdPartyScriptLoader';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useMemoryMonitor } from '@/hooks/useMemoryOptimization';

interface PerformanceContextValue {
  // Network status
  isOnline: boolean;
  connectionType: string;
  isSlowConnection: boolean;
  
  // Adaptive loading
  shouldReduceData: boolean;
  shouldDeferImages: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  
  // Memory status
  memoryWarning: boolean;
  
  // Performance flags
  prefersReducedMotion: boolean;
  supportsWebP: boolean;
  supportsAVIF: boolean;
}

const PerformanceContext = createContext<PerformanceContextValue | null>(null);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider');
  }
  return context;
};

/**
 * Check WebP support
 */
const checkWebPSupport = (): Promise<boolean> => {
  return new Promise(resolve => {
    const webp = new Image();
    webp.onload = webp.onerror = () => {
      resolve(webp.height === 2);
    };
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

/**
 * Check AVIF support
 */
const checkAVIFSupport = (): Promise<boolean> => {
  return new Promise(resolve => {
    const avif = new Image();
    avif.onload = avif.onerror = () => {
      resolve(avif.height === 2);
    };
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKBzgABc0R//4AAAAAAMP/4wBEy/3A8A==';
  });
};

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const network = useNetworkStatus();
  const memoryWarning = useMemoryMonitor();
  
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState(false);
  const [supportsAVIF, setSupportsAVIF] = useState(false);

  // Derive adaptive loading settings from network status
  const isSlowConnection = network.effectiveType === 'slow-2g' || network.effectiveType === '2g';
  const shouldReduceData = network.saveData || isSlowConnection;
  const shouldDeferImages = shouldReduceData || network.effectiveType === '3g';
  const imageQuality = shouldReduceData ? 'low' : 
    network.effectiveType === '3g' ? 'medium' : 'high';

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Check image format support
  useEffect(() => {
    checkWebPSupport().then(setSupportsWebP);
    checkAVIFSupport().then(setSupportsAVIF);
  }, []);

  const value: PerformanceContextValue = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    connectionType: network.effectiveType || 'unknown',
    isSlowConnection,
    shouldReduceData,
    shouldDeferImages,
    imageQuality,
    memoryWarning,
    prefersReducedMotion,
    supportsWebP,
    supportsAVIF,
  };

  return (
    <PerformanceContext.Provider value={value}>
      {/* Resource hints for critical assets */}
      <ResourceHints />
      
      {/* Deferred third-party scripts */}
      <ThirdPartyScriptLoader />
      
      {children}
    </PerformanceContext.Provider>
  );
};

export default PerformanceProvider;

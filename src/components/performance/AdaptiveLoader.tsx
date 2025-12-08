import React, { useState, useEffect, Suspense, lazy, ComponentType } from 'react';
import { shouldLoadHeavyAssets, getConnectionQuality, prefersReducedMotion } from '@/lib/performance-enhanced';

interface AdaptiveLoaderProps {
  /** Component to load for high-performance devices */
  heavyComponent: () => Promise<{ default: ComponentType<any> }>;
  /** Fallback component for low-performance devices */
  lightComponent?: () => Promise<{ default: ComponentType<any> }>;
  /** Loading placeholder */
  fallback?: React.ReactNode;
  /** Props to pass to the loaded component */
  componentProps?: Record<string, unknown>;
  /** Force heavy or light version */
  forceVersion?: 'heavy' | 'light';
}

export function AdaptiveLoader({
  heavyComponent,
  lightComponent,
  fallback = <div className="animate-pulse bg-muted h-32 rounded-lg" />,
  componentProps = {},
  forceVersion
}: AdaptiveLoaderProps) {
  const [shouldLoadHeavy, setShouldLoadHeavy] = useState<boolean | null>(null);

  useEffect(() => {
    if (forceVersion) {
      setShouldLoadHeavy(forceVersion === 'heavy');
    } else {
      setShouldLoadHeavy(shouldLoadHeavyAssets());
    }
  }, [forceVersion]);

  if (shouldLoadHeavy === null) {
    return <>{fallback}</>;
  }

  const Component = lazy(
    shouldLoadHeavy || !lightComponent ? heavyComponent : lightComponent
  );

  return (
    <Suspense fallback={fallback}>
      <Component {...componentProps} />
    </Suspense>
  );
}

// Hook for adaptive component loading
export function useAdaptiveLoad() {
  const [deviceCapability, setDeviceCapability] = useState<'high' | 'medium' | 'low'>('medium');

  useEffect(() => {
    const connection = getConnectionQuality();
    const reducedMotion = prefersReducedMotion();
    const memory = typeof navigator !== 'undefined' ? (navigator as any).deviceMemory : 8;

    if (connection === 'slow' || reducedMotion || memory < 2) {
      setDeviceCapability('low');
    } else if (connection === 'fast' && memory >= 4) {
      setDeviceCapability('high');
    } else {
      setDeviceCapability('medium');
    }
  }, []);

  return {
    deviceCapability,
    shouldLoadAnimations: deviceCapability === 'high',
    shouldLoadHeavyImages: deviceCapability !== 'low',
    shouldLoadVideos: deviceCapability === 'high',
    imageQuality: deviceCapability === 'high' ? 90 : deviceCapability === 'medium' ? 75 : 60
  };
}

// Wrapper for conditional rendering based on device capability
interface ConditionalRenderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  minCapability?: 'low' | 'medium' | 'high';
}

export function ConditionalRender({
  children,
  fallback = null,
  minCapability = 'medium'
}: ConditionalRenderProps) {
  const { deviceCapability } = useAdaptiveLoad();
  
  const capabilityOrder = { low: 0, medium: 1, high: 2 };
  const shouldRender = capabilityOrder[deviceCapability] >= capabilityOrder[minCapability];
  
  return <>{shouldRender ? children : fallback}</>;
}

export default AdaptiveLoader;

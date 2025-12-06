import React from 'react';
import { useNetworkQuality } from '@/hooks/useNetworkQuality';

interface NetworkAwareLoaderProps {
  highQuality: React.ReactNode;
  lowQuality?: React.ReactNode;
  offline?: React.ReactNode;
  effectiveTypeThreshold?: '4g' | '3g' | '2g' | 'slow-2g';
  loading?: React.ReactNode;
}

export const NetworkAwareLoader: React.FC<NetworkAwareLoaderProps> = ({
  highQuality,
  lowQuality,
  offline,
  effectiveTypeThreshold = '3g',
  loading,
}) => {
  const networkInfo = useNetworkQuality();
  const { isOnline, effectiveType, isLoading } = networkInfo;

  if (isLoading && loading) {
    return <>{loading}</>;
  }

  if (!isOnline) {
    return <>{offline || lowQuality || highQuality}</>;
  }

  const speedRanking = { '4g': 4, '3g': 3, '2g': 2, 'slow-2g': 1 };
  const currentSpeed = speedRanking[effectiveType] || 4;
  const thresholdSpeed = speedRanking[effectiveTypeThreshold] || 3;

  const isSlow = currentSpeed < thresholdSpeed;

  if (isSlow && lowQuality) {
    return <>{lowQuality}</>;
  }

  return <>{highQuality}</>;
};

export function withNetworkAwareness<P extends object>(
  HighQualityComponent: React.ComponentType<P>,
  LowQualityComponent?: React.ComponentType<P>,
  OfflineComponent?: React.ComponentType<P>
) {
  return function NetworkAwareComponent(props: P) {
    return (
      <NetworkAwareLoader
        highQuality={<HighQualityComponent {...props} />}
        lowQuality={LowQualityComponent ? <LowQualityComponent {...props} /> : undefined}
        offline={OfflineComponent ? <OfflineComponent {...props} /> : undefined}
      />
    );
  };
}

export const useNetworkAwarePreload = () => {
  const { isOnline, effectiveType, saveData } = useNetworkQuality();

  const shouldPreload = (): boolean => {
    if (!isOnline || saveData) return false;
    return effectiveType === '4g' || effectiveType === '3g';
  };

  const preloadImage = (src: string) => {
    if (!shouldPreload()) return;
    const img = new Image();
    img.src = src;
  };

  const preloadComponent = (importFn: () => Promise<unknown>) => {
    if (!shouldPreload()) return;
    importFn();
  };

  return { shouldPreload, preloadImage, preloadComponent };
};

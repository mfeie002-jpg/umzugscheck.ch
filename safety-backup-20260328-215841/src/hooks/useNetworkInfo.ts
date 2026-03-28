import { useState, useEffect, useCallback } from 'react';

interface NetworkInfo {
  isOnline: boolean;
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  downlink: number | null;
  rtt: number | null;
  saveData: boolean;
  type: string | null;
  isSupported: boolean;
}

interface UseNetworkInfoOptions {
  onOnline?: () => void;
  onOffline?: () => void;
  onConnectionChange?: (info: NetworkInfo) => void;
}

export function useNetworkInfo(options: UseNetworkInfoOptions = {}): NetworkInfo {
  const { onOnline, onOffline, onConnectionChange } = options;

  const getNetworkInfo = useCallback((): NetworkInfo => {
    const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection;

    return {
      isOnline: navigator.onLine,
      effectiveType: connection?.effectiveType || 'unknown',
      downlink: connection?.downlink || null,
      rtt: connection?.rtt || null,
      saveData: connection?.saveData || false,
      type: connection?.type || null,
      isSupported: !!connection
    };
  }, []);

  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>(getNetworkInfo);

  useEffect(() => {
    const handleOnline = () => {
      const info = getNetworkInfo();
      setNetworkInfo(info);
      onOnline?.();
      onConnectionChange?.(info);
    };

    const handleOffline = () => {
      const info = { ...getNetworkInfo(), isOnline: false };
      setNetworkInfo(info);
      onOffline?.();
      onConnectionChange?.(info);
    };

    const handleConnectionChange = () => {
      const info = getNetworkInfo();
      setNetworkInfo(info);
      onConnectionChange?.(info);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [getNetworkInfo, onOnline, onOffline, onConnectionChange]);

  return networkInfo;
}

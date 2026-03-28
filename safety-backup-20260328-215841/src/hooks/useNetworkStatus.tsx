import { useState, useEffect, useCallback } from 'react';

interface NetworkStatus {
  isOnline: boolean;
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

interface NetworkInfo {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

/**
 * Network Status Hook
 * Monitors network conditions for adaptive loading
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    effectiveType: 'unknown',
    downlink: 10,
    rtt: 50,
    saveData: false,
  });

  useEffect(() => {
    const updateNetworkStatus = () => {
      const connection = (navigator as any).connection as NetworkInfo | undefined;
      
      setStatus({
        isOnline: navigator.onLine,
        effectiveType: (connection?.effectiveType as any) || 'unknown',
        downlink: connection?.downlink || 10,
        rtt: connection?.rtt || 50,
        saveData: connection?.saveData || false,
      });
    };

    // Initial update
    updateNetworkStatus();

    // Listen for online/offline events
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    // Listen for connection changes
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkStatus);
    }

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      if (connection) {
        connection.removeEventListener('change', updateNetworkStatus);
      }
    };
  }, []);

  return status;
}

/**
 * Adaptive Loading Hook
 * Returns loading strategy based on network conditions
 */
export function useAdaptiveLoading() {
  const network = useNetworkStatus();

  const shouldReduceData = network.saveData || 
    network.effectiveType === 'slow-2g' || 
    network.effectiveType === '2g';

  const shouldDeferImages = shouldReduceData || network.effectiveType === '3g';
  
  const imageQuality = shouldReduceData ? 'low' : 
    network.effectiveType === '3g' ? 'medium' : 'high';

  return {
    network,
    shouldReduceData,
    shouldDeferImages,
    imageQuality,
    isSlowConnection: shouldReduceData,
    isFastConnection: network.effectiveType === '4g' && network.downlink > 5,
  };
}

/**
 * Offline Detection Hook with Callback
 */
export function useOfflineDetection(
  onOffline?: () => void,
  onOnline?: () => void
) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      onOffline?.();
    };

    const handleOnline = () => {
      setIsOffline(false);
      onOnline?.();
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [onOffline, onOnline]);

  return isOffline;
}

/**
 * Request Queue for Offline Support
 */
export function useRequestQueue() {
  const [queue, setQueue] = useState<Array<() => Promise<any>>>([]);
  const isOffline = useOfflineDetection();

  const addToQueue = useCallback((request: () => Promise<any>) => {
    setQueue(prev => [...prev, request]);
  }, []);

  const processQueue = useCallback(async () => {
    if (isOffline || queue.length === 0) return;

    const requests = [...queue];
    setQueue([]);

    for (const request of requests) {
      try {
        await request();
      } catch (error) {
        console.error('Failed to process queued request:', error);
        // Re-queue failed requests
        setQueue(prev => [...prev, request]);
      }
    }
  }, [isOffline, queue]);

  // Process queue when coming back online
  useEffect(() => {
    if (!isOffline && queue.length > 0) {
      processQueue();
    }
  }, [isOffline, queue.length, processQueue]);

  return {
    addToQueue,
    queueLength: queue.length,
    isOffline,
  };
}

export default useNetworkStatus;

import { useEffect, useState } from 'react';

interface NetworkInfo {
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g';
  downlink: number;
  saveData: boolean;
  isOnline: boolean;
}

export const useNetworkQuality = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    effectiveType: '4g',
    downlink: 10,
    saveData: false,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // @ts-ignore - Navigator connection API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    const updateNetworkInfo = () => {
      setNetworkInfo({
        effectiveType: connection?.effectiveType || '4g',
        downlink: connection?.downlink || 10,
        saveData: connection?.saveData || false,
        isOnline: navigator.onLine
      });
      setIsLoading(false);
    };

    updateNetworkInfo();

    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
    }

    window.addEventListener('online', updateNetworkInfo);
    window.addEventListener('offline', updateNetworkInfo);

    return () => {
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
      window.removeEventListener('online', updateNetworkInfo);
      window.removeEventListener('offline', updateNetworkInfo);
    };
  }, []);

  const isSlowNetwork = networkInfo.effectiveType === '2g' || 
                        networkInfo.effectiveType === 'slow-2g' ||
                        networkInfo.saveData;

  const shouldReduceQuality = isSlowNetwork || networkInfo.downlink < 1.5;

  return {
    ...networkInfo,
    isSlowNetwork,
    shouldReduceQuality,
    isLoading
  };
};

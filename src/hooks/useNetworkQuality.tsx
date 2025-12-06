import { useEffect, useState } from 'react';

interface NetworkInfo {
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g';
  downlink: number;
  saveData: boolean;
}

export const useNetworkQuality = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    effectiveType: '4g',
    downlink: 10,
    saveData: false
  });

  useEffect(() => {
    // @ts-ignore - Navigator connection API
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      const updateNetworkInfo = () => {
        setNetworkInfo({
          effectiveType: connection.effectiveType || '4g',
          downlink: connection.downlink || 10,
          saveData: connection.saveData || false
        });
      };

      updateNetworkInfo();
      connection.addEventListener('change', updateNetworkInfo);
      return () => connection.removeEventListener('change', updateNetworkInfo);
    }
  }, []);

  const isSlowNetwork = networkInfo.effectiveType === '2g' || 
                        networkInfo.effectiveType === 'slow-2g' ||
                        networkInfo.saveData;

  const shouldReduceQuality = isSlowNetwork || networkInfo.downlink < 1.5;

  return {
    ...networkInfo,
    isSlowNetwork,
    shouldReduceQuality
  };
};

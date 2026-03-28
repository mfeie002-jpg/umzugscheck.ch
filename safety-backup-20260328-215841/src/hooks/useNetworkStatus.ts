import { useState, useEffect } from 'react';

interface NetworkInfo {
  effectiveType?: '2g' | '3g' | '4g' | 'slow-2g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export const useNetworkStatus = () => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({});
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection;

    if (!connection) return;

    const updateNetworkInfo = () => {
      const info: NetworkInfo = {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData,
      };
      setNetworkInfo(info);
      setIsSlowConnection(
        info.effectiveType === '2g' || 
        info.effectiveType === 'slow-2g' ||
        info.saveData === true
      );
    };

    updateNetworkInfo();
    connection.addEventListener('change', updateNetworkInfo);

    return () => connection.removeEventListener('change', updateNetworkInfo);
  }, []);

  return { ...networkInfo, isSlowConnection };
};

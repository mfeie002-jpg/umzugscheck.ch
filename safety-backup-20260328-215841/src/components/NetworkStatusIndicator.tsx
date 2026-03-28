import { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const NetworkStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);
  const [connectionSpeed, setConnectionSpeed] = useState<string>('');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    // Check connection speed
    const checkConnectionSpeed = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (connection) {
        setConnectionSpeed(connection.effectiveType || '');
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    checkConnectionSpeed();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className={cn(
            "fixed top-20 left-1/2 z-50 px-4 py-2 rounded-full shadow-lg flex items-center gap-2",
            isOnline 
              ? "bg-forest text-forest-foreground" 
              : "bg-destructive text-destructive-foreground"
          )}
        >
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4" />
              <span className="text-sm font-medium">Verbindung wiederhergestellt</span>
              {connectionSpeed && (
                <span className="text-xs opacity-75">({connectionSpeed})</span>
              )}
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              <span className="text-sm font-medium">Keine Internetverbindung</span>
              <RefreshCw className="w-4 h-4 animate-spin" />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NetworkStatusIndicator;
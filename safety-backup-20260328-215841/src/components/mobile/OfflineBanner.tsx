import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, Cloud } from 'lucide-react';
import { useOfflineSync } from '@/hooks/useOfflineSync';

export const OfflineBanner = () => {
  const { isOnline, pendingCount, isSyncing, syncAll } = useOfflineSync();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950 py-2 px-4"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <WifiOff className="w-4 h-4" />
            <span>Offline-Modus</span>
            {pendingCount > 0 && (
              <span className="bg-amber-600 text-white px-2 py-0.5 rounded-full text-xs">
                {pendingCount} ausstehend
              </span>
            )}
          </div>
        </motion.div>
      )}

      {isOnline && pendingCount > 0 && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] bg-primary text-primary-foreground py-2 px-4"
        >
          <button
            onClick={syncAll}
            disabled={isSyncing}
            className="flex items-center justify-center gap-2 text-sm font-medium w-full"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synchronisiere...</span>
              </>
            ) : (
              <>
                <Cloud className="w-4 h-4" />
                <span>{pendingCount} Änderungen werden synchronisiert</span>
              </>
            )}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

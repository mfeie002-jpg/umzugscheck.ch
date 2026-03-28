import { useState, useCallback, useEffect } from 'react';
import { useIndexedDB } from './useIndexedDB';
import { useOfflineDetection } from './useOfflineDetection';

interface SyncItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  endpoint: string;
  data: unknown;
  timestamp: number;
  retryCount: number;
}

export const useOfflineSync = () => {
  const { isOnline } = useOfflineDetection();
  const { isReady, add, getAll, remove, clear } = useIndexedDB<SyncItem>({
    dbName: 'umzugscheck-offline',
    storeName: 'sync-queue',
  });
  
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const queueAction = useCallback(async (
    type: SyncItem['type'],
    endpoint: string,
    data: unknown
  ) => {
    const item: SyncItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      endpoint,
      data,
      timestamp: Date.now(),
      retryCount: 0,
    };
    
    await add(item);
    setPendingCount(prev => prev + 1);
  }, [add]);

  const syncAll = useCallback(async () => {
    if (!isOnline || !isReady || isSyncing) return;
    
    setIsSyncing(true);
    
    try {
      const items = await getAll();
      
      for (const item of items) {
        try {
          const method = item.type === 'delete' ? 'DELETE' : 
                        item.type === 'create' ? 'POST' : 'PUT';
          
          const response = await fetch(item.endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: item.type !== 'delete' ? JSON.stringify(item.data) : undefined,
          });
          
          if (response.ok) {
            await remove(item.id);
            setPendingCount(prev => Math.max(0, prev - 1));
          }
        } catch {
          // Keep in queue for retry
        }
      }
    } finally {
      setIsSyncing(false);
    }
  }, [isOnline, isReady, isSyncing, getAll, remove]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && isReady) {
      syncAll();
    }
  }, [isOnline, isReady, syncAll]);

  // Load pending count on init
  useEffect(() => {
    if (isReady) {
      getAll().then(items => setPendingCount(items.length));
    }
  }, [isReady, getAll]);

  return {
    isOnline,
    pendingCount,
    isSyncing,
    queueAction,
    syncAll,
    clearQueue: clear,
  };
};

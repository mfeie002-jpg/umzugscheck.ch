import { useState, useCallback, useEffect } from 'react';

interface UseIndexedDBOptions {
  dbName: string;
  storeName: string;
  version?: number;
}

export const useIndexedDB = <T extends { id: string }>({ 
  dbName, 
  storeName, 
  version = 1 
}: UseIndexedDBOptions) => {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const request = indexedDB.open(dbName, version);

    request.onerror = () => {
      setError('Failed to open database');
    };

    request.onsuccess = () => {
      setDb(request.result);
      setIsReady(true);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      if (!database.objectStoreNames.contains(storeName)) {
        database.createObjectStore(storeName, { keyPath: 'id' });
      }
    };

    return () => {
      db?.close();
    };
  }, [dbName, storeName, version]);

  const add = useCallback(async (item: T): Promise<void> => {
    if (!db) throw new Error('Database not ready');
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }, [db, storeName]);

  const get = useCallback(async (id: string): Promise<T | undefined> => {
    if (!db) throw new Error('Database not ready');
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db, storeName]);

  const getAll = useCallback(async (): Promise<T[]> => {
    if (!db) throw new Error('Database not ready');
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db, storeName]);

  const remove = useCallback(async (id: string): Promise<void> => {
    if (!db) throw new Error('Database not ready');
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }, [db, storeName]);

  const clear = useCallback(async (): Promise<void> => {
    if (!db) throw new Error('Database not ready');
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }, [db, storeName]);

  return { isReady, error, add, get, getAll, remove, clear };
};

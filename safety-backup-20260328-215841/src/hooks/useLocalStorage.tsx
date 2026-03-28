import { useState, useEffect } from 'react';

type StorageType = 'localStorage' | 'sessionStorage';

interface UseStorageOptions<T> {
  type?: StorageType;
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseStorageOptions<T> = {}
) {
  const {
    type = 'localStorage',
    serializer = JSON.stringify,
    deserializer = JSON.parse
  } = options;

  const storage = type === 'localStorage' ? localStorage : sessionStorage;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = storage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key} from ${type}:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storage.setItem(key, serializer(valueToStore));
    } catch (error) {
      console.error(`Error storing ${key} to ${type}:`, error);
    }
  };

  const removeValue = () => {
    try {
      storage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing ${key} from ${type}:`, error);
    }
  };

  // Sync across tabs
  useEffect(() => {
    if (type !== 'localStorage') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(deserializer(e.newValue));
        } catch (error) {
          console.error(`Error syncing ${key}:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, type, deserializer]);

  return [storedValue, setValue, removeValue] as const;
}

import { useEffect, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface UseFormPersistenceOptions<T> {
  key: string;
  initialValues: T;
  debounceMs?: number;
}

export const useFormPersistence = <T extends Record<string, any>>({
  key,
  initialValues,
  debounceMs = 500,
}: UseFormPersistenceOptions<T>) => {
  const storageKey = `form-${key}`;
  const [savedValues, setSavedValues, clearSavedValues] = useLocalStorage<T | null>(storageKey, null);

  const persistValues = useCallback((values: T) => {
    setSavedValues(values);
  }, [setSavedValues]);

  const getRestoredValues = useCallback((): T => {
    return savedValues || initialValues;
  }, [savedValues, initialValues]);

  const clearPersistedValues = useCallback(() => {
    clearSavedValues();
  }, [clearSavedValues]);

  // Auto-save with debounce
  const useAutoSave = (values: T, enabled: boolean = true) => {
    useEffect(() => {
      if (!enabled) return;
      
      const timeoutId = setTimeout(() => {
        persistValues(values);
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    }, [values, enabled]);
  };

  return {
    savedValues,
    persistValues,
    getRestoredValues,
    clearPersistedValues,
    useAutoSave,
    hasSavedData: savedValues !== null,
  };
};

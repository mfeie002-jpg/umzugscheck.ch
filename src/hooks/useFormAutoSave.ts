/**
 * Form Auto-Save & Recovery Hook
 * Persists form state to localStorage with debouncing
 * Recovers form state on page reload/return
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface AutoSaveOptions {
  key: string;
  debounceMs?: number;
  expirationMs?: number;
  onRestore?: (data: any) => void;
}

interface SavedFormState<T> {
  data: T;
  savedAt: number;
  stepIndex?: number;
  sessionId?: string;
}

export function useFormAutoSave<T extends Record<string, any>>(
  initialData: T,
  options: AutoSaveOptions
) {
  const { 
    key, 
    debounceMs = 500, 
    expirationMs = 24 * 60 * 60 * 1000, // 24 hours default
    onRestore 
  } = options;

  const [formData, setFormData] = useState<T>(initialData);
  const [hasRestoredData, setHasRestoredData] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const storageKey = `umzugscheck_form_${key}`;

  // Restore from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: SavedFormState<T> = JSON.parse(saved);
        const now = Date.now();
        
        // Check if data is not expired
        if (now - parsed.savedAt < expirationMs) {
          setFormData(parsed.data);
          setHasRestoredData(true);
          setLastSaved(new Date(parsed.savedAt));
          onRestore?.(parsed.data);
        } else {
          // Clear expired data
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.warn('Failed to restore form data:', error);
      localStorage.removeItem(storageKey);
    }
  }, [storageKey, expirationMs, onRestore]);

  // Save to localStorage with debouncing
  const saveToStorage = useCallback((data: T, stepIndex?: number) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      try {
        const state: SavedFormState<T> = {
          data,
          savedAt: Date.now(),
          stepIndex,
          sessionId: getSessionId()
        };
        localStorage.setItem(storageKey, JSON.stringify(state));
        setLastSaved(new Date());
      } catch (error) {
        console.warn('Failed to save form data:', error);
      }
    }, debounceMs);
  }, [storageKey, debounceMs]);

  // Update form data and trigger auto-save
  const updateFormData = useCallback((
    updates: Partial<T> | ((prev: T) => T),
    stepIndex?: number
  ) => {
    setFormData(prev => {
      const newData = typeof updates === 'function' 
        ? updates(prev) 
        : { ...prev, ...updates };
      saveToStorage(newData, stepIndex);
      return newData;
    });
  }, [saveToStorage]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    localStorage.removeItem(storageKey);
    setLastSaved(null);
    setHasRestoredData(false);
  }, [storageKey]);

  // Reset to initial data
  const resetForm = useCallback(() => {
    setFormData(initialData);
    clearSavedData();
  }, [initialData, clearSavedData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    formData,
    setFormData: updateFormData,
    hasRestoredData,
    lastSaved,
    clearSavedData,
    resetForm
  };
}

// Get or create session ID
function getSessionId(): string {
  const key = 'umzugscheck_session_id';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
}

// Hook for showing recovery prompt
export function useFormRecoveryPrompt(storageKey: string) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [savedData, setSavedData] = useState<any>(null);

  useEffect(() => {
    const fullKey = `umzugscheck_form_${storageKey}`;
    try {
      const saved = localStorage.getItem(fullKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const isRecent = Date.now() - parsed.savedAt < 24 * 60 * 60 * 1000;
        if (isRecent && Object.keys(parsed.data).length > 0) {
          setSavedData(parsed);
          setShowPrompt(true);
        }
      }
    } catch {
      // Ignore errors
    }
  }, [storageKey]);

  const acceptRecovery = useCallback(() => {
    setShowPrompt(false);
    return savedData?.data;
  }, [savedData]);

  const declineRecovery = useCallback(() => {
    setShowPrompt(false);
    localStorage.removeItem(`umzugscheck_form_${storageKey}`);
    return null;
  }, [storageKey]);

  return {
    showPrompt,
    savedData,
    acceptRecovery,
    declineRecovery,
    lastSavedAt: savedData ? new Date(savedData.savedAt) : null
  };
}

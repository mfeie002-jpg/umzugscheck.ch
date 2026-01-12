/**
 * usePrefill Hook - React Hook für Prefill-Logik
 */

import { useState, useEffect, useCallback } from 'react';
import { getPrefill, clearPrefill, getSourceLabel, ParsedPrefill } from '@/lib/prefill';

interface UsePrefillOptions {
  autoApply?: boolean;
  onApply?: (prefill: ParsedPrefill) => void;
}

interface UsePrefillReturn {
  prefill: ParsedPrefill | null;
  isPrefilled: boolean;
  sourceLabel: string;
  apply: () => void;
  clear: () => void;
  dismiss: () => void;
}

export function usePrefill(options: UsePrefillOptions = {}): UsePrefillReturn {
  const { autoApply = false, onApply } = options;
  const [prefill, setPrefillState] = useState<ParsedPrefill | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const data = getPrefill();
    if (data?.isValid) {
      setPrefillState(data);
      
      if (autoApply && onApply) {
        onApply(data);
      }
    }
  }, [autoApply, onApply]);

  const apply = useCallback(() => {
    if (prefill && onApply) {
      onApply(prefill);
    }
  }, [prefill, onApply]);

  const clear = useCallback(() => {
    clearPrefill();
    setPrefillState(null);
  }, []);

  const dismiss = useCallback(() => {
    setIsDismissed(true);
  }, []);

  const isPrefilled = !!(prefill?.isValid && !isDismissed);
  const sourceLabel = prefill ? getSourceLabel(prefill.source) : '';

  return {
    prefill,
    isPrefilled,
    sourceLabel,
    apply,
    clear,
    dismiss,
  };
}

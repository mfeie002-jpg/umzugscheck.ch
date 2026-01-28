/**
 * usePrefill Hook - React Hook für Prefill-Logik
 * 
 * Priority: URL params > localStorage (uc_prefill)
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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

/**
 * Parse PLZ/Ort String
 * Handles: "8000", "8000 Zürich", "Zürich 8000", "8000 - Zürich"
 */
function parsePLZOrt(value: string): { plz: string; city: string } {
  if (!value) return { plz: '', city: '' };
  
  const trimmed = value.trim();
  
  // Match Swiss PLZ (4 digits)
  const plzMatch = trimmed.match(/\b(\d{4})\b/);
  const plz = plzMatch ? plzMatch[1] : '';
  
  // Remove PLZ and separators to get city
  const city = trimmed.replace(/\b\d{4}\b/, '').replace(/\s*-\s*/, '').trim();
  
  return { plz, city };
}

export function usePrefill(options: UsePrefillOptions = {}): UsePrefillReturn {
  const { autoApply = false, onApply } = options;
  const [prefill, setPrefillState] = useState<ParsedPrefill | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Priority 1: Check URL parameters
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    const sizeParam = searchParams.get('size') || searchParams.get('rooms');
    
    if (fromParam || toParam) {
      const fromParsed = parsePLZOrt(decodeURIComponent(fromParam || ''));
      const toParsed = parsePLZOrt(decodeURIComponent(toParam || ''));
      
      const urlPrefill: ParsedPrefill = {
        fromPLZ: fromParsed.plz,
        fromCity: fromParsed.city,
        toPLZ: toParsed.plz,
        toCity: toParsed.city,
        size: sizeParam || undefined,
        source: 'url-params',
        isValid: !!(fromParsed.plz || toParsed.plz),
        isComplete: !!(fromParsed.plz && toParsed.plz),
        age: 0,
        autoSelectServices: [],
        isServicePage: false,
        isCantonPage: false,
      };
      
      if (urlPrefill.isValid) {
        setPrefillState(urlPrefill);
        
        if (autoApply && onApply) {
          onApply(urlPrefill);
        }
        return;
      }
    }
    
    // Priority 2: Check localStorage
    const data = getPrefill();
    if (data?.isValid) {
      setPrefillState(data);
      
      if (autoApply && onApply) {
        onApply(data);
      }
    }
  }, [autoApply, onApply, searchParams]);

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

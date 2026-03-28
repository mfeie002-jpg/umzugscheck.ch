import { useState, useCallback } from 'react';
import { useHaptic } from './use-haptic';

export const useClipboard = (resetDelay = 2000) => {
  const [hasCopied, setHasCopied] = useState(false);
  const { trigger } = useHaptic();

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator.clipboard) {
      // Fallback for older browsers
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setHasCopied(true);
        trigger('success');
        setTimeout(() => setHasCopied(false), resetDelay);
        return true;
      } catch {
        return false;
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setHasCopied(true);
      trigger('success');
      setTimeout(() => setHasCopied(false), resetDelay);
      return true;
    } catch {
      return false;
    }
  }, [resetDelay, trigger]);

  const paste = useCallback(async (): Promise<string | null> => {
    if (!navigator.clipboard) return null;

    try {
      return await navigator.clipboard.readText();
    } catch {
      return null;
    }
  }, []);

  return { copy, paste, hasCopied };
};

import { useState, useEffect, useCallback } from 'react';

interface TextSelection {
  text: string;
  rect: DOMRect | null;
  isCollapsed: boolean;
}

export const useTextSelection = () => {
  const [selection, setSelection] = useState<TextSelection>({
    text: '',
    rect: null,
    isCollapsed: true,
  });

  const updateSelection = useCallback(() => {
    const sel = window.getSelection();
    
    if (!sel || sel.isCollapsed) {
      setSelection({
        text: '',
        rect: null,
        isCollapsed: true,
      });
      return;
    }

    const text = sel.toString();
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setSelection({
      text,
      rect,
      isCollapsed: false,
    });
  }, []);

  const clearSelection = useCallback(() => {
    window.getSelection()?.removeAllRanges();
    setSelection({
      text: '',
      rect: null,
      isCollapsed: true,
    });
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', updateSelection);
    document.addEventListener('mouseup', updateSelection);
    document.addEventListener('touchend', updateSelection);

    return () => {
      document.removeEventListener('selectionchange', updateSelection);
      document.removeEventListener('mouseup', updateSelection);
      document.removeEventListener('touchend', updateSelection);
    };
  }, [updateSelection]);

  return {
    ...selection,
    hasSelection: !selection.isCollapsed && selection.text.length > 0,
    clearSelection,
  };
};

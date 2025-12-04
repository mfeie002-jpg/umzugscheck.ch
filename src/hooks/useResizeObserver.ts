import { useState, useEffect, useRef, useCallback } from 'react';

interface ElementSize {
  width: number;
  height: number;
  borderBoxWidth: number;
  borderBoxHeight: number;
  contentBoxWidth: number;
  contentBoxHeight: number;
}

interface UseResizeObserverOptions {
  onResize?: (size: ElementSize) => void;
  debounce?: number;
}

interface UseResizeObserverReturn<T extends HTMLElement> {
  ref: React.RefObject<T>;
  size: ElementSize;
  isObserving: boolean;
}

export function useResizeObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseResizeObserverOptions = {}
): UseResizeObserverReturn<T> {
  const { onResize, debounce = 0 } = options;

  const ref = useRef<T>(null);
  const [size, setSize] = useState<ElementSize>({
    width: 0,
    height: 0,
    borderBoxWidth: 0,
    borderBoxHeight: 0,
    contentBoxWidth: 0,
    contentBoxHeight: 0
  });
  const [isObserving, setIsObserving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    const entry = entries[0];
    if (!entry) return;

    const newSize: ElementSize = {
      width: entry.contentRect.width,
      height: entry.contentRect.height,
      borderBoxWidth: entry.borderBoxSize?.[0]?.inlineSize || entry.contentRect.width,
      borderBoxHeight: entry.borderBoxSize?.[0]?.blockSize || entry.contentRect.height,
      contentBoxWidth: entry.contentBoxSize?.[0]?.inlineSize || entry.contentRect.width,
      contentBoxHeight: entry.contentBoxSize?.[0]?.blockSize || entry.contentRect.height
    };

    const updateSize = () => {
      setSize(newSize);
      onResize?.(newSize);
    };

    if (debounce > 0) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(updateSize, debounce);
    } else {
      updateSize();
    }
  }, [onResize, debounce]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(handleResize);
    observer.observe(element);
    setIsObserving(true);

    return () => {
      observer.disconnect();
      setIsObserving(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleResize]);

  return { ref, size, isObserving };
}

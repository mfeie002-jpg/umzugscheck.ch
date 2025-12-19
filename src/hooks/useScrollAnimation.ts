import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { isScreenshotRenderMode } from '@/lib/screenshot-render-mode';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook for triggering animations when element enters viewport
 * Respects reduced motion preferences and screenshot render mode
 */
export const useScrollAnimation = <T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true
}: ScrollAnimationOptions = {}) => {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const screenshotMode = isScreenshotRenderMode();

  useEffect(() => {
    // If reduced motion is preferred OR screenshot mode, show immediately
    if (prefersReducedMotion || screenshotMode) {
      setIsVisible(true);
      setHasAnimated(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    // If already animated and triggerOnce, skip
    if (triggerOnce && hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasAnimated(true);
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasAnimated, prefersReducedMotion, screenshotMode]);

  return { ref, isVisible };
};

/**
 * Hook for staggered list animations
 */
export const useStaggerAnimation = (
  itemCount: number,
  staggerDelay: number = 100
) => {
  const prefersReducedMotion = useReducedMotion();
  const screenshotMode = isScreenshotRenderMode();
  
  const getDelay = useCallback((index: number) => {
    if (prefersReducedMotion || screenshotMode) return 0;
    return index * staggerDelay;
  }, [staggerDelay, prefersReducedMotion, screenshotMode]);

  return { getDelay };
};

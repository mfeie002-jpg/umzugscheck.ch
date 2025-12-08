import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Hook for triggering animations when element enters viewport
 * Respects reduced motion preferences
 */
export const useScrollAnimation = <T extends HTMLElement = HTMLElement>({
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true
}: ScrollAnimationOptions = {}) => {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // If reduced motion is preferred, show immediately
    if (prefersReducedMotion) {
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
  }, [threshold, rootMargin, triggerOnce, hasAnimated, prefersReducedMotion]);

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
  
  const getDelay = useCallback((index: number) => {
    if (prefersReducedMotion) return 0;
    return index * staggerDelay;
  }, [staggerDelay, prefersReducedMotion]);

  return { getDelay };
};

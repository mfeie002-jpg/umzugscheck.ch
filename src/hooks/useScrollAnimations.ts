/**
 * Scroll-triggered Animations Hook
 * Performant scroll animations with intersection observer
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollAnimationOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

interface ScrollProgress {
  progress: number;
  isVisible: boolean;
  hasAnimated: boolean;
}

// Basic visibility detection
export function useInView(options: ScrollAnimationOptions = {}) {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true } = options;
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsInView(visible);
        if (visible && triggerOnce) {
          setHasTriggered(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { ref, isInView, hasTriggered };
}

// Scroll progress tracking
export function useScrollProgress(elementRef?: React.RefObject<HTMLElement>): ScrollProgress {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = elementRef?.current;
    
    const handleScroll = () => {
      if (element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementHeight = rect.height;
        
        // Calculate progress through element
        const start = windowHeight;
        const end = -elementHeight;
        const current = elementTop;
        const newProgress = Math.max(0, Math.min(1, (start - current) / (start - end)));
        
        setProgress(newProgress);
        setIsVisible(rect.top < windowHeight && rect.bottom > 0);
        if (newProgress > 0.1 && !hasAnimated) setHasAnimated(true);
      } else {
        // Page scroll progress
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementRef, hasAnimated]);

  return { progress, isVisible, hasAnimated };
}

// Parallax effect
export function useParallax(speed: number = 0.5) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distance = elementCenter - viewportCenter;
      
      setOffset(distance * speed * -1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return { ref, offset, style: { transform: `translateY(${offset}px)` } };
}

// Stagger animation for lists
export function useStaggerAnimation(itemCount: number, options: ScrollAnimationOptions = {}) {
  const { delay = 100 } = options;
  const { ref, isInView } = useInView(options);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    if (!isInView) {
      setVisibleItems([]);
      return;
    }

    const timers: NodeJS.Timeout[] = [];
    
    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => [...prev, i]);
      }, i * delay);
      timers.push(timer);
    }

    return () => timers.forEach(clearTimeout);
  }, [isInView, itemCount, delay]);

  return { ref, visibleItems, isInView };
}

// Scroll direction detection
export function useScrollDirection() {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setDirection('up');
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return direction;
}

// Counter animation
export function useCountUp(
  end: number,
  options: { duration?: number; start?: number; enabled?: boolean } = {}
) {
  const { duration = 2000, start = 0, enabled = true } = options;
  const [count, setCount] = useState(start);
  const { ref, isInView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!isInView || !enabled) return;

    const startTime = performance.now();
    const difference = end - start;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.round(start + difference * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, start, duration, enabled]);

  return { ref, count };
}

// Animation presets
export const animationPresets = {
  fadeUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  fadeDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  },
  fadeLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  },
  fadeRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 }
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    transition: { duration: 0.6 }
  }
};

// Scroll-linked value (for smooth animations)
export function useScrollLinkedValue(
  inputRange: [number, number],
  outputRange: [number, number]
) {
  const { progress } = useScrollProgress();
  
  const [inputStart, inputEnd] = inputRange;
  const [outputStart, outputEnd] = outputRange;
  
  // Clamp and interpolate
  const clampedProgress = Math.max(inputStart, Math.min(inputEnd, progress));
  const normalizedProgress = (clampedProgress - inputStart) / (inputEnd - inputStart);
  const value = outputStart + normalizedProgress * (outputEnd - outputStart);
  
  return value;
}

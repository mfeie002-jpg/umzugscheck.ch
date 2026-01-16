/**
 * Smooth Scroll Utilities
 * 
 * Features:
 * - Smooth scroll to element
 * - Scroll to top button
 * - Section navigation
 * - Scroll spy for active sections
 */

import { useCallback, useEffect, useState, memo } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Smooth scroll to element by ID
 */
export function scrollToElement(elementId: string, offset = 80) {
  const element = document.getElementById(elementId);
  if (!element) return;

  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Smooth scroll to top
 */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Hook for scroll position
 */
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
      setLastScrollY(currentScrollY);
      setScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return { scrollY, scrollDirection };
}

/**
 * Hook for scroll spy - tracks which section is active
 */
export function useScrollSpy(sectionIds: string[], offset = 100) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;

        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(id);
          return;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
}

/**
 * Scroll to top button
 */
export const ScrollToTopButton = memo(function ScrollToTopButton({
  threshold = 400,
  className,
}: {
  threshold?: number;
  className?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-24 right-4 z-40",
            "w-12 h-12 rounded-full",
            "bg-primary text-primary-foreground shadow-lg",
            "flex items-center justify-center",
            "hover:bg-primary/90 active:scale-95 transition-all",
            "touch-manipulation",
            className
          )}
          aria-label="Nach oben scrollen"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
});

/**
 * Anchor link component with smooth scroll
 */
export const SmoothAnchor = memo(function SmoothAnchor({
  href,
  children,
  offset = 80,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  offset?: number;
  className?: string;
  onClick?: () => void;
}) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const id = href.replace('#', '');
    scrollToElement(id, offset);
    onClick?.();
  }, [href, offset, onClick]);

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
});

/**
 * Progress indicator based on scroll
 */
export const ScrollProgressIndicator = memo(function ScrollProgressIndicator({
  className,
}: {
  className?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={cn("fixed top-0 left-0 right-0 h-1 z-[100]", className)}>
      <motion.div
        className="h-full bg-gradient-to-r from-primary to-secondary"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
});

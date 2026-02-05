/**
 * useFormScrollBehavior - Prevents form from scrolling out of viewport
 * 
 * Features:
 * - Keeps focused input visible when mobile keyboard opens
 * - Prevents viewport jumps on form submit
 * - Smooth scrolling to form section
 */

import { useEffect, useCallback, useRef } from 'react';

interface UseFormScrollBehaviorOptions {
  formRef: React.RefObject<HTMLElement>;
  offset?: number; // Extra padding from top
}

export const useFormScrollBehavior = ({ formRef, offset = 20 }: UseFormScrollBehaviorOptions) => {
  const lastScrollPosition = useRef(0);
  const isSubmitting = useRef(false);

  // Scroll form into view smoothly
  const scrollFormIntoView = useCallback(() => {
    if (!formRef.current) return;
    
    const rect = formRef.current.getBoundingClientRect();
    const viewportHeight = window.visualViewport?.height || window.innerHeight;
    
    // Only scroll if form is partially out of view
    if (rect.top < offset || rect.bottom > viewportHeight) {
      formRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  }, [formRef, offset]);

  // Lock scroll position before submit, restore after
  const lockScrollForSubmit = useCallback(() => {
    lastScrollPosition.current = window.scrollY;
    isSubmitting.current = true;
  }, []);

  const unlockScrollAfterSubmit = useCallback(() => {
    if (isSubmitting.current) {
      window.scrollTo({ top: lastScrollPosition.current, behavior: 'instant' });
      isSubmitting.current = false;
    }
  }, []);

  // Handle mobile keyboard opening
  useEffect(() => {
    if (!formRef.current) return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (!formRef.current?.contains(target)) return;
      
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        // Delay to allow keyboard to open
        setTimeout(() => {
          const rect = target.getBoundingClientRect();
          const viewportHeight = window.visualViewport?.height || window.innerHeight;
          
          // If input is below fold (accounting for keyboard)
          if (rect.bottom > viewportHeight - 100) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    };

    // Visual viewport resize (keyboard open/close)
    const handleViewportResize = () => {
      if (document.activeElement && formRef.current?.contains(document.activeElement)) {
        const activeEl = document.activeElement as HTMLElement;
        if (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA') {
          setTimeout(() => {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    window.visualViewport?.addEventListener('resize', handleViewportResize);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      window.visualViewport?.removeEventListener('resize', handleViewportResize);
    };
  }, [formRef]);

  return {
    scrollFormIntoView,
    lockScrollForSubmit,
    unlockScrollAfterSubmit
  };
};

import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSwipeGesture } from './useSwipeGesture';
import { useHaptic } from './use-haptic';

const SERVICE_PAGES = [
  '/dienstleistungen/umzug',
  '/dienstleistungen/reinigung',
  '/dienstleistungen/entsorgung',
  '/dienstleistungen/lagerung',
  '/dienstleistungen/moebelmontage',
  '/dienstleistungen/firmenumzug',
];

const MAIN_PAGES = [
  '/',
  '/umzugsrechner',
  '/umzugsofferten',
  '/umzugsfirmen',
  '/ratgeber',
];

export const usePageSwipeNavigation = (pageGroup: 'services' | 'main' = 'main') => {
  const navigate = useNavigate();
  const location = useLocation();
  const { trigger } = useHaptic();
  
  const pages = pageGroup === 'services' ? SERVICE_PAGES : MAIN_PAGES;
  const currentIndex = pages.indexOf(location.pathname);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      trigger('light');
      navigate(pages[currentIndex - 1]);
    }
  }, [currentIndex, navigate, pages, trigger]);

  const goToNext = useCallback(() => {
    if (currentIndex < pages.length - 1 && currentIndex !== -1) {
      trigger('light');
      navigate(pages[currentIndex + 1]);
    }
  }, [currentIndex, navigate, pages, trigger]);

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 80,
  });

  return {
    swipeHandlers,
    currentIndex,
    totalPages: pages.length,
    canGoNext: currentIndex < pages.length - 1 && currentIndex !== -1,
    canGoPrevious: currentIndex > 0,
    goToNext,
    goToPrevious,
  };
};

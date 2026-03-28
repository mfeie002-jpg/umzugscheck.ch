import { ReactNode, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSwipeNavigation, getAdjacentPages, servicePages } from '@/hooks/useSwipeNavigation';
import SwipeNavIndicator from './SwipeNavIndicator';
import GestureHints from './GestureHints';

interface ServicePageWrapperProps {
  children: ReactNode;
  currentLabel: string;
}

export default function ServicePageWrapper({ children, currentLabel }: ServicePageWrapperProps) {
  const location = useLocation();
  
  const { prevPage, nextPage } = useMemo(() => 
    getAdjacentPages(location.pathname), 
    [location.pathname]
  );

  const swipeHandlers = useSwipeNavigation({
    prevPage: prevPage?.path,
    nextPage: nextPage?.path,
  });

  return (
    <div 
      className="min-h-screen"
      onTouchStart={swipeHandlers.onTouchStart}
      onTouchMove={swipeHandlers.onTouchMove}
      onTouchEnd={swipeHandlers.onTouchEnd}
    >
      {children}
      <SwipeNavIndicator 
        prevPage={prevPage} 
        nextPage={nextPage}
        currentLabel={currentLabel}
      />
      <GestureHints type="swipe" />
    </div>
  );
}
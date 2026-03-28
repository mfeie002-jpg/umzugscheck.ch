import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useMobileScrollSnap } from '@/hooks/useMobileScrollSnap';

interface MobileSnapCarouselProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
  showDots?: boolean;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  gap?: 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
}

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

const paddingClasses = {
  sm: 'px-2',
  md: 'px-4',
  lg: 'px-6',
};

export default function MobileSnapCarousel({
  children,
  className,
  itemClassName,
  showDots = true,
  autoScroll = false,
  autoScrollInterval = 4000,
  gap = 'md',
  padding = 'md',
}: MobileSnapCarouselProps) {
  const { scrollRef, currentIndex, scrollToIndex, scrollContainerProps, itemProps } = useMobileScrollSnap({
    itemCount: children.length,
    autoScroll,
    autoScrollInterval,
  });

  return (
    <div className={cn('relative', className)}>
      {/* Scroll Container */}
      <div
        ref={scrollRef}
        {...scrollContainerProps}
        className={cn(
          scrollContainerProps.className,
          gapClasses[gap],
          paddingClasses[padding],
          '-mx-4',
          'pb-4'
        )}
      >
        {children.map((child, index) => (
          <div
            key={index}
            {...itemProps}
            className={cn(
              itemProps.className,
              'w-[85vw] max-w-[320px]',
              itemClassName
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Dots Navigation */}
      {showDots && children.length > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300 touch-manipulation',
                index === currentIndex 
                  ? 'bg-primary w-6' 
                  : 'bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  lowResSrc?: string;
  aspectRatio?: string;
}

// Generate low-res placeholder
const generatePlaceholder = (width: number = 20, height: number = 15): string => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect fill='%23f3f4f6' width='${width}' height='${height}'/%3E%3C/svg%3E`;
};

export const ProgressiveImage = ({
  src,
  alt,
  className,
  lowResSrc,
  aspectRatio = '16/9'
}: ProgressiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const placeholder = lowResSrc || generatePlaceholder();

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden bg-muted', className)}
      style={{ aspectRatio }}
    >
      {/* Low-res placeholder */}
      <img
        src={placeholder}
        alt=""
        aria-hidden="true"
        className={cn(
          'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
          isLoaded ? 'opacity-0' : 'opacity-100 blur-sm scale-105'
        )}
      />

      {/* High-res image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  );
};

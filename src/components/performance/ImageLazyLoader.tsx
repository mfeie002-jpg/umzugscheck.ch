import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ImageLazyLoaderProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const ImageLazyLoader: React.FC<ImageLazyLoaderProps> = ({
  src,
  alt,
  className,
  placeholderClassName,
  width,
  height,
  priority = false,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px', threshold: 0 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [priority]);

  const shouldLoad = priority || isIntersecting;

  useEffect(() => {
    if (!shouldLoad || !imgRef.current) return;

    const img = imgRef.current;
    
    if (!priority && 'loading' in HTMLImageElement.prototype) {
      img.loading = 'lazy';
    }

    if ('decode' in img) {
      img.decode?.()
        .then(() => {
          setIsLoaded(true);
          onLoad?.();
        })
        .catch(() => {
          setIsLoaded(true);
          onLoad?.();
        });
    }
  }, [shouldLoad, priority, onLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const placeholderColor = `hsl(${hashCode(src) % 360}, 20%, 90%)`;

  return (
    <div 
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={{ 
        width: width ? `${width}px` : undefined,
        height: height ? `${height}px` : undefined,
      }}
    >
      {!isLoaded && !hasError && (
        <div 
          className={cn(
            'absolute inset-0 animate-pulse',
            placeholderClassName
          )}
          style={{ backgroundColor: placeholderColor }}
        />
      )}

      {shouldLoad && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
        />
      )}

      {hasError && (
        <div className={cn(
          'absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground',
          className
        )}>
          <span className="text-sm">Bild nicht verfügbar</span>
        </div>
      )}
    </div>
  );
};

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

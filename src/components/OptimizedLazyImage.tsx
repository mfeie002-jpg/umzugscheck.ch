/**
 * Optimized Image Component with Lazy Loading
 * Features:
 * - Blur placeholder while loading
 * - Lazy loading with IntersectionObserver
 * - WebP support detection
 * - Error handling with fallback
 */

import { useState, useEffect, useRef, memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedLazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Default blur placeholder (tiny transparent image)
const DEFAULT_BLUR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';

export const OptimizedLazyImage = memo(({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError
}: OptimizedLazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const placeholderSrc = blurDataURL || DEFAULT_BLUR;

  return (
    <div 
      className={cn(
        "relative overflow-hidden",
        className
      )}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {placeholder === 'blur' && !isLoaded && (
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden="true"
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            "filter blur-lg scale-110 transition-opacity duration-300",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={isInView && !hasError ? src : placeholderSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Bild nicht verfügbar</span>
        </div>
      )}
    </div>
  );
});

OptimizedLazyImage.displayName = 'OptimizedLazyImage';

/**
 * Picture element with WebP support
 */
interface ResponsiveImageProps extends OptimizedLazyImageProps {
  webpSrc?: string;
  srcSet?: string;
  sizes?: string;
}

export const ResponsiveImage = memo(({
  src,
  webpSrc,
  srcSet,
  sizes,
  alt,
  className,
  width,
  height,
  priority = false,
  onLoad
}: ResponsiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const pictureRef = useRef<HTMLPictureElement>(null);

  useEffect(() => {
    if (priority || !pictureRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    observer.observe(pictureRef.current);
    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <picture 
      ref={pictureRef}
      className={cn("block", className)}
    >
      {/* WebP source */}
      {webpSrc && isInView && (
        <source srcSet={webpSrc} type="image/webp" />
      )}
      
      {/* Responsive srcSet */}
      {srcSet && isInView && (
        <source srcSet={srcSet} sizes={sizes} />
      )}
      
      {/* Fallback img */}
      <img
        src={isInView ? src : DEFAULT_BLUR}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={handleLoad}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-70"
        )}
      />
    </picture>
  );
});

ResponsiveImage.displayName = 'ResponsiveImage';

export default OptimizedLazyImage;

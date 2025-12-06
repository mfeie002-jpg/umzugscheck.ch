import { useState, useEffect, useRef, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  lowResSrc?: string;
  aspectRatio?: string;
  sizes?: string;
  quality?: number;
}

const BREAKPOINTS = [320, 480, 640, 768, 1024, 1280, 1920];

const generatePlaceholder = (width: number = 20, height: number = 15): string => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect fill='%23f3f4f6' width='${width}' height='${height}'/%3E%3C/svg%3E`;
};

export const ProgressiveImage = ({
  src,
  alt,
  className,
  lowResSrc,
  aspectRatio = '16/9',
  sizes = '100vw',
  quality = 80
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

  const { webpSrcSet, webpSrc, lowQualitySrc } = useMemo(() => {
    const isUnsplash = src.includes('unsplash.com');
    const isCloudinary = src.includes('cloudinary.com');

    if (isUnsplash) {
      const baseUrl = src.split('?')[0];
      const srcSet = BREAKPOINTS
        .map(w => `${baseUrl}?w=${w}&q=${quality}&fm=webp ${w}w`)
        .join(', ');
      return {
        webpSrcSet: srcSet,
        webpSrc: `${baseUrl}?w=1920&q=${quality}&fm=webp`,
        lowQualitySrc: `${baseUrl}?w=40&q=20&blur=20&fm=webp`
      };
    }

    if (isCloudinary) {
      const srcSet = BREAKPOINTS
        .map(w => src.replace('/upload/', `/upload/w_${w},f_webp,q_${quality}/`) + ` ${w}w`)
        .join(', ');
      return {
        webpSrcSet: srcSet,
        webpSrc: src.replace('/upload/', `/upload/f_webp,q_${quality}/`),
        lowQualitySrc: src.replace('/upload/', '/upload/w_40,q_20,e_blur:1000,f_webp/')
      };
    }

    return { webpSrcSet: undefined, webpSrc: src, lowQualitySrc: undefined };
  }, [src, quality]);

  const placeholder = lowResSrc || lowQualitySrc || generatePlaceholder();

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden bg-muted', className)}
      style={{ aspectRatio }}
    >
      <img
        src={placeholder}
        alt=""
        aria-hidden="true"
        className={cn(
          'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
          isLoaded ? 'opacity-0' : 'opacity-100 blur-sm scale-105'
        )}
      />

      {isInView && (
        <picture>
          {webpSrcSet && (
            <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
          )}
          <img
            src={webpSrc}
            alt={alt}
            sizes={sizes}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        </picture>
      )}
    </div>
  );
};

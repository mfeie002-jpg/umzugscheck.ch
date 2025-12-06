import { useState, useRef, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  sizes?: string;
  quality?: number;
}

const BREAKPOINTS = [320, 480, 640, 768, 1024, 1280, 1920];

export const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  sizes = '100vw',
  quality = 80
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const { webpSrcSet, webpSrc } = useMemo(() => {
    const isUnsplash = src.includes('unsplash.com');
    const isCloudinary = src.includes('cloudinary.com');

    if (isUnsplash) {
      const baseUrl = src.split('?')[0];
      const srcSet = BREAKPOINTS
        .map(w => `${baseUrl}?w=${w}&q=${quality}&fm=webp ${w}w`)
        .join(', ');
      return { webpSrcSet: srcSet, webpSrc: `${baseUrl}?w=${width || 1920}&q=${quality}&fm=webp` };
    }

    if (isCloudinary) {
      const srcSet = BREAKPOINTS
        .map(w => src.replace('/upload/', `/upload/w_${w},f_webp,q_${quality}/`) + ` ${w}w`)
        .join(', ');
      return { webpSrcSet: srcSet, webpSrc: src.replace('/upload/', `/upload/f_webp,q_${quality}/`) };
    }

    return { webpSrcSet: undefined, webpSrc: src };
  }, [src, width, quality]);

  const defaultBlur = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';

  return (
    <div 
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {placeholder === 'blur' && !isLoaded && (
        <img
          src={blurDataURL || defaultBlur}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl"
        />
      )}
      
      {placeholder === 'empty' && !isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      
      {isInView && (
        <picture>
          {webpSrcSet && (
            <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
          )}
          <img
            src={webpSrc}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            onLoad={handleLoad}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
          />
        </picture>
      )}
    </div>
  );
};

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string; // Added for backwards compatibility
  width?: number;
  height?: number;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  sizes?: string;
  quality?: number;
}

const BREAKPOINTS = [320, 480, 640, 768, 1024, 1280, 1536, 1920];

/**
 * Optimized image component with WebP and srcset support
 */
export const OptimizedImage = ({
  src,
  alt,
  className,
  containerClassName, // accepted but merged into className
  width,
  height,
  priority = false,
  objectFit = 'cover',
  sizes = '100vw',
  quality = 80
}: OptimizedImageProps) => {
  const combinedClassName = containerClassName ? `${className || ''} ${containerClassName}`.trim() : className;
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectRatio = width && height ? `${width} / ${height}` : undefined;

  const { webpSrcSet, fallbackSrcSet, webpSrc } = useMemo(() => {
    const isUnsplash = src.includes('unsplash.com');
    const isCloudinary = src.includes('cloudinary.com');

    if (isUnsplash) {
      const baseUrl = src.split('?')[0];
      const webpSet = BREAKPOINTS
        .filter(w => !width || w <= width * 2)
        .map(w => `${baseUrl}?w=${w}&q=${quality}&fm=webp ${w}w`)
        .join(', ');
      const jpgSet = BREAKPOINTS
        .filter(w => !width || w <= width * 2)
        .map(w => `${baseUrl}?w=${w}&q=${quality}&fm=jpg ${w}w`)
        .join(', ');
      return {
        webpSrcSet: webpSet,
        fallbackSrcSet: jpgSet,
        webpSrc: `${baseUrl}?w=${width || 1920}&q=${quality}&fm=webp`
      };
    }

    if (isCloudinary) {
      const webpSet = BREAKPOINTS
        .filter(w => !width || w <= width * 2)
        .map(w => src.replace('/upload/', `/upload/w_${w},f_webp,q_${quality}/`) + ` ${w}w`)
        .join(', ');
      const jpgSet = BREAKPOINTS
        .filter(w => !width || w <= width * 2)
        .map(w => src.replace('/upload/', `/upload/w_${w},f_jpg,q_${quality}/`) + ` ${w}w`)
        .join(', ');
      return {
        webpSrcSet: webpSet,
        fallbackSrcSet: jpgSet,
        webpSrc: src.replace('/upload/', `/upload/f_webp,q_${quality}/`)
      };
    }

    if (src.match(/\.(jpg|jpeg|png)$/i)) {
      return {
        webpSrcSet: undefined,
        fallbackSrcSet: undefined,
        webpSrc: src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      };
    }

    return { webpSrcSet: undefined, fallbackSrcSet: undefined, webpSrc: src };
  }, [src, width, quality]);

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={{ aspectRatio }}
      >
        <span className="text-sm">Bild nicht verfügbar</span>
      </div>
    );
  }

  return (
    <picture 
      className={cn("relative overflow-hidden block", combinedClassName)}
      style={{ aspectRatio }}
    >
      {webpSrcSet && (
        <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
      )}
      {fallbackSrcSet && (
        <source srcSet={fallbackSrcSet} sizes={sizes} type="image/jpeg" />
      )}
      
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      <img
        src={webpSrc || src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          "transition-opacity duration-300 w-full h-full",
          isLoaded ? "opacity-100" : "opacity-0",
          objectFit === 'cover' && "object-cover",
          objectFit === 'contain' && "object-contain",
          objectFit === 'fill' && "object-fill"
        )}
      />
    </picture>
  );
};

export default OptimizedImage;

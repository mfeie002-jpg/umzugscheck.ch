import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
}

/**
 * Optimized image component for Core Web Vitals
 * - Lazy loading by default (unless priority=true)
 * - Explicit dimensions to prevent CLS
 * - Aspect ratio preservation
 * - WebP support hint via srcset
 */
export const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  objectFit = 'cover'
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Calculate aspect ratio for container
  const aspectRatio = width && height ? `${width} / ${height}` : undefined;

  // Generate srcset for responsive images
  const generateSrcSet = (baseSrc: string) => {
    // If it's an external URL (unsplash, etc.), use their optimization params
    if (baseSrc.includes('unsplash.com')) {
      return `${baseSrc}&w=640 640w, ${baseSrc}&w=1024 1024w, ${baseSrc}&w=1920 1920w`;
    }
    // For local images, assume they're optimized
    return undefined;
  };

  const srcSet = generateSrcSet(src);

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-secondary text-muted-foreground",
          className
        )}
        style={{ aspectRatio }}
      >
        <span className="text-sm">Bild nicht verfügbar</span>
      </div>
    );
  }

  return (
    <div 
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio }}
    >
      {/* Low-quality placeholder during loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-secondary animate-pulse" />
      )}

      <img
        src={src}
        srcSet={srcSet}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          objectFit === 'cover' && "object-cover w-full h-full",
          objectFit === 'contain' && "object-contain w-full h-full",
          objectFit === 'fill' && "object-fill w-full h-full"
        )}
        style={{
          objectFit: objectFit
        }}
      />
    </div>
  );
};

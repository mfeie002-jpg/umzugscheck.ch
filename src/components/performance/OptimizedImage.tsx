import React, { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import { isScreenshotRenderMode } from '@/lib/screenshot-render-mode';
interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoadComplete?: () => void;
  quality?: number;
  sizes?: string;
}

// Generate srcset for responsive images
const generateSrcSet = (src: string, widths: number[] = [640, 750, 828, 1080, 1200, 1920]): string => {
  // For external URLs or already optimized images, return empty
  if (src.startsWith('data:') || src.includes('?')) {
    return '';
  }
  
  // For local images, we can't dynamically resize, but we set up the structure
  return '';
};

// Detect WebP/AVIF support
const supportsWebP = (): boolean => {
  if (typeof document === 'undefined') return false;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

const supportsAVIF = (): boolean => {
  if (typeof document === 'undefined') return false;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
};

// Placeholder blur effect
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

const generateBlurPlaceholder = (width = 700, height = 475): string => {
  return `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;
};

export const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  onLoadComplete,
  quality = 75,
  sizes = '100vw',
  className,
  style,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState<string>(
    placeholder === 'blur' 
      ? (blurDataURL || generateBlurPlaceholder(width, height)) 
      : ''
  );
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '200px',
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Load actual image when in view
  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
      onLoadComplete?.();
    };

    img.onerror = () => {
      // Fallback to original src on error
      setCurrentSrc(src);
      setIsLoaded(true);
    };
  }, [isInView, src, onLoadComplete]);

  // Priority images get preloaded
  useEffect(() => {
    if (priority && typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      if (sizes) link.setAttribute('imagesizes', sizes);
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, src, sizes]);

  const srcSet = generateSrcSet(src);

  return (
    <picture>
      {/* AVIF format for browsers that support it */}
      {src.match(/\.(jpg|jpeg|png)$/i) && (
        <source
          srcSet={src.replace(/\.(jpg|jpeg|png)$/i, '.avif')}
          type="image/avif"
        />
      )}
      
      {/* WebP format as fallback */}
      {src.match(/\.(jpg|jpeg|png)$/i) && (
        <source
          srcSet={src.replace(/\.(jpg|jpeg|png)$/i, '.webp')}
          type="image/webp"
        />
      )}
      
      <img
        ref={imgRef}
        src={currentSrc || src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        sizes={sizes}
        srcSet={srcSet || undefined}
        className={cn(
          'transition-opacity duration-300',
          !isLoaded && placeholder === 'blur' && 'blur-sm',
          isLoaded && 'blur-0',
          className
        )}
        style={{
          ...style,
          opacity: currentSrc ? 1 : 0,
        }}
        {...props}
      />
    </picture>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Hook for preloading images
export const usePreloadImages = (imageSrcs: string[]) => {
  useEffect(() => {
    const preloadedImages: HTMLImageElement[] = [];

    imageSrcs.forEach((src) => {
      const img = new Image();
      img.src = src;
      preloadedImages.push(img);
    });

    return () => {
      preloadedImages.length = 0;
    };
  }, [imageSrcs]);
};

// Component for background images with optimization
export const OptimizedBackgroundImage: React.FC<{
  src: string;
  className?: string;
  children?: React.ReactNode;
  priority?: boolean;
}> = memo(({ src, className, children, priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [isInView, src]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'transition-opacity duration-500',
        isLoaded ? 'opacity-100' : 'opacity-0',
        className
      )}
      style={{
        backgroundImage: isLoaded ? `url(${src})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {children}
    </div>
  );
});

OptimizedBackgroundImage.displayName = 'OptimizedBackgroundImage';

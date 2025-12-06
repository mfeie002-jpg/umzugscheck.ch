import { useState, useEffect, useCallback, useRef } from 'react';

interface ImageOptimizationOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
}

interface OptimizedImageResult {
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

// Check browser support for image formats
export const useImageFormatSupport = () => {
  const [support, setSupport] = useState({
    webp: false,
    avif: false,
  });

  useEffect(() => {
    const checkWebP = async (): Promise<boolean> => {
      return new Promise((resolve) => {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
          resolve(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
      });
    };

    const checkAVIF = async (): Promise<boolean> => {
      return new Promise((resolve) => {
        const avif = new Image();
        avif.onload = avif.onerror = () => {
          resolve(avif.height === 2);
        };
        avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKBzgANtAAAQQUAAgEFoOzv9DJycmJyYCMjcpZCAAAAA==';
      });
    };

    Promise.all([checkWebP(), checkAVIF()]).then(([webp, avif]) => {
      setSupport({ webp, avif });
    });
  }, []);

  return support;
};

// Compress image using canvas
export const compressImage = async (
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<OptimizedImageResult> => {
  const {
    quality = 0.8,
    maxWidth = 1920,
    maxHeight = 1080,
    format = 'webp',
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = `image/${format}`;
        const dataUrl = canvas.toDataURL(mimeType, quality);
        
        // Calculate approximate file size
        const base64Length = dataUrl.length - `data:${mimeType};base64,`.length;
        const size = Math.ceil((base64Length * 3) / 4);

        resolve({
          url: dataUrl,
          width,
          height,
          size,
          format,
        });
      };

      img.onerror = () => reject(new Error('Failed to load image'));
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};

// Hook for lazy loading images with IntersectionObserver
export const useLazyImage = (src: string, options?: IntersectionObserverInit) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
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
        rootMargin: '100px',
        threshold: 0.1,
        ...options,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [options]);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
    };
  }, [isInView, src]);

  return { imgRef, imageSrc, isLoaded, isInView };
};

// Hook for progressive image loading (low quality → high quality)
export const useProgressiveImage = (lowQualitySrc: string, highQualitySrc: string) => {
  const [src, setSrc] = useState(lowQualitySrc);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = highQualitySrc;
    
    img.onload = () => {
      setSrc(highQualitySrc);
      setIsHighQualityLoaded(true);
    };
  }, [highQualitySrc]);

  return { src, isHighQualityLoaded, isBlurred: !isHighQualityLoaded };
};

// Generate responsive image srcset
export const generateResponsiveSrcSet = (
  baseSrc: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536, 1920]
): string => {
  // For images that support dynamic resizing (like Unsplash, Cloudinary)
  if (baseSrc.includes('unsplash.com')) {
    return widths
      .map((w) => `${baseSrc}&w=${w} ${w}w`)
      .join(', ');
  }
  
  // For other images, return empty (browser will use src)
  return '';
};

// Hook for batch preloading images
export const usePreloadImages = () => {
  const preloadedRef = useRef<Set<string>>(new Set());

  const preloadImage = useCallback((src: string): Promise<void> => {
    if (preloadedRef.current.has(src)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = src;
      
      img.onload = () => {
        preloadedRef.current.add(src);
        resolve();
      };
      
      img.onerror = reject;
    });
  }, []);

  const preloadImages = useCallback(async (srcs: string[]): Promise<void> => {
    await Promise.all(srcs.map(preloadImage));
  }, [preloadImage]);

  const preloadImagesInIdle = useCallback((srcs: string[]) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        preloadImages(srcs);
      }, { timeout: 5000 });
    } else {
      setTimeout(() => preloadImages(srcs), 1000);
    }
  }, [preloadImages]);

  return { preloadImage, preloadImages, preloadImagesInIdle };
};

// Utility to get optimal image format based on browser support
export const getOptimalImageFormat = async (): Promise<'avif' | 'webp' | 'jpeg'> => {
  // Check AVIF support
  const avifSupported = await new Promise<boolean>((resolve) => {
    const avif = new Image();
    avif.onload = () => resolve(true);
    avif.onerror = () => resolve(false);
    avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKBzgANtAAAQQUAAgEFoOzv9DJycmJyYCMjcpZCAAAAA==';
  });
  
  if (avifSupported) return 'avif';

  // Check WebP support
  const webpSupported = await new Promise<boolean>((resolve) => {
    const webP = new Image();
    webP.onload = () => resolve(true);
    webP.onerror = () => resolve(false);
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });

  if (webpSupported) return 'webp';

  return 'jpeg';
};

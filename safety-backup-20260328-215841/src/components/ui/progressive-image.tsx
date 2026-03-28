import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
}

const BREAKPOINTS = [320, 480, 640, 768, 1024, 1280, 1920];

export const ProgressiveImage = ({ 
  src, 
  alt, 
  className,
  placeholderClassName,
  blurDataURL,
  sizes = '100vw',
  quality = 80
}: ProgressiveImageProps) => {
  const [imgSrc, setImgSrc] = useState(blurDataURL || src);
  const [isLoading, setIsLoading] = useState(true);

  const { webpSrcSet, webpSrc } = useMemo(() => {
    const isUnsplash = src.includes('unsplash.com');
    const isCloudinary = src.includes('cloudinary.com');

    if (isUnsplash) {
      const baseUrl = src.split('?')[0];
      const srcSet = BREAKPOINTS
        .map(w => `${baseUrl}?w=${w}&q=${quality}&fm=webp ${w}w`)
        .join(', ');
      return { webpSrcSet: srcSet, webpSrc: `${baseUrl}?w=1920&q=${quality}&fm=webp` };
    }

    if (isCloudinary) {
      const srcSet = BREAKPOINTS
        .map(w => src.replace('/upload/', `/upload/w_${w},f_webp,q_${quality}/`) + ` ${w}w`)
        .join(', ');
      return { webpSrcSet: srcSet, webpSrc: src.replace('/upload/', `/upload/f_webp,q_${quality}/`) };
    }

    return { webpSrcSet: undefined, webpSrc: src };
  }, [src, quality]);

  useEffect(() => {
    const img = new Image();
    img.src = webpSrc;
    img.onload = () => {
      setImgSrc(webpSrc);
      setIsLoading(false);
    };
  }, [webpSrc]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <picture>
        {webpSrcSet && (
          <source srcSet={webpSrcSet} sizes={sizes} type="image/webp" />
        )}
        <img
          src={imgSrc}
          alt={alt}
          sizes={sizes}
          className={cn(
            "transition-all duration-300 w-full h-full object-cover",
            isLoading && "blur-sm scale-105",
          )}
          loading="lazy"
        />
      </picture>
      {isLoading && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-muted/50 to-muted animate-pulse",
          placeholderClassName
        )} />
      )}
    </div>
  );
};

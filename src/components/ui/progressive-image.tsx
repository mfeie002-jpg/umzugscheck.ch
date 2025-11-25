import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  blurDataURL?: string;
}

export const ProgressiveImage = ({ 
  src, 
  alt, 
  className,
  placeholderClassName,
  blurDataURL 
}: ProgressiveImageProps) => {
  const [imgSrc, setImgSrc] = useState(blurDataURL || src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
      setIsLoading(false);
    };
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <img
        src={imgSrc}
        alt={alt}
        className={cn(
          "transition-all duration-300",
          isLoading && "blur-sm scale-105",
          className
        )}
        loading="lazy"
      />
      {isLoading && (
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-muted/50 to-muted animate-pulse",
          placeholderClassName
        )} />
      )}
    </div>
  );
};

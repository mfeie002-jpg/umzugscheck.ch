import { useState } from 'react';
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  src: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function ImagePlaceholder({
  src,
  alt,
  className,
  placeholderClassName,
  width,
  height,
  priority = false
}: ImagePlaceholderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className={cn(
            "absolute inset-0 bg-muted animate-pulse",
            placeholderClassName
          )}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <span className="text-muted-foreground text-sm">Bild nicht verfügbar</span>
        </div>
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          hasError && "hidden"
        )}
      />
    </div>
  );
}

export function BlurImage({
  src,
  alt,
  className,
  blurDataUrl,
  width,
  height,
  priority = false
}: ImagePlaceholderProps & { blurDataUrl?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  const defaultBlur = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3C/svg%3E";

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Blur placeholder */}
      <img
        src={blurDataUrl || defaultBlur}
        alt=""
        aria-hidden="true"
        className={cn(
          "absolute inset-0 w-full h-full object-cover scale-110 blur-xl",
          "transition-opacity duration-500",
          isLoaded ? "opacity-0" : "opacity-100"
        )}
      />
      
      {/* Main image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          "w-full h-full object-cover",
          "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}

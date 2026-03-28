import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
}

export const LazyImage = ({ src, alt, className, placeholderColor = "bg-muted" }: LazyImageProps) => {
  const screenshotMode = isScreenshotRenderMode();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(screenshotMode);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (screenshotMode) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [screenshotMode]);

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", className)}>
      {!isLoaded && <div className={cn("absolute inset-0 animate-pulse", placeholderColor)} />}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading={screenshotMode ? "eager" : "lazy"}
          decoding={screenshotMode ? "sync" : "async"}
          fetchPriority={screenshotMode ? "high" : "auto"}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
};


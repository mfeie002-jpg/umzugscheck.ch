import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  blurDataUrl?: string;
  aspectRatio?: string;
}

// Generate a simple blur placeholder
const generateBlurPlaceholder = (width = 10, height = 10) => {
  return `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <filter id="b" color-interpolation-filters="sRGB">
        <feGaussianBlur stdDeviation="2"/>
      </filter>
      <rect width="100%" height="100%" fill="#e5e7eb" filter="url(#b)"/>
    </svg>`
  )}`;
};

export const OptimizedImage = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  blurDataUrl,
  aspectRatio,
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  const placeholder = blurDataUrl || generateBlurPlaceholder();

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px", // Start loading 200px before entering viewport
        threshold: 0,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  return (
    <div
      ref={imgRef}
      className={cn("relative overflow-hidden", className)}
      style={{ aspectRatio }}
    >
      {/* Blur placeholder */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${placeholder})` }}
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoaded ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Actual image */}
      {isInView && (
        <motion.img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          onLoad={() => setIsLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className={cn("w-full h-full object-cover", className)}
        />
      )}

      {/* Loading shimmer effect */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      )}
    </div>
  );
};

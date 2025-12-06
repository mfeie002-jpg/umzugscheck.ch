import { ImgHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

interface ResponsiveImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  aspectRatio?: "square" | "video" | "wide" | "auto";
  fallbackSrc?: string;
  webpSrc?: string;
}

/**
 * ResponsiveImage component with WebP support and optimized loading
 * - Automatic WebP detection and fallback
 * - Uses native lazy loading for below-fold images
 * - Adds proper sizes attribute for browser optimization
 * - Supports priority loading for LCP images
 * - Generates responsive srcset for different screen sizes
 */
export const ResponsiveImage = ({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  aspectRatio = "auto",
  fallbackSrc,
  webpSrc,
  className = "",
  ...props
}: ResponsiveImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
    auto: "",
  };

  // Generate srcset for responsive images (Unsplash, Cloudinary, etc.)
  const generateSrcSet = (baseSrc: string): string | undefined => {
    if (baseSrc.includes('unsplash.com')) {
      const widths = [320, 640, 768, 1024, 1280, 1920];
      return widths
        .map(w => `${baseSrc}&w=${w}&q=80&fm=webp ${w}w`)
        .join(', ');
    }
    if (baseSrc.includes('cloudinary.com')) {
      const widths = [320, 640, 768, 1024, 1280, 1920];
      return widths
        .map(w => baseSrc.replace('/upload/', `/upload/w_${w},f_webp,q_80/`) + ` ${w}w`)
        .join(', ');
    }
    return undefined;
  };

  // Get WebP version of URL if supported
  const getWebPUrl = (url: string): string => {
    if (webpSrc) return webpSrc;
    if (url.includes('unsplash.com')) {
      return url.includes('?') ? `${url}&fm=webp&q=80` : `${url}?fm=webp&q=80`;
    }
    if (url.includes('cloudinary.com')) {
      return url.replace('/upload/', '/upload/f_webp,q_80/');
    }
    // For local images, try .webp version
    if (url.match(/\.(jpg|jpeg|png)$/i)) {
      return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    return url;
  };

  const srcSet = generateSrcSet(src);
  const webpUrl = getWebPUrl(src);
  const displaySrc = hasError ? (fallbackSrc || src) : src;

  return (
    <picture className={cn("relative overflow-hidden", aspectClasses[aspectRatio])}>
      {/* WebP source */}
      {!hasError && webpUrl !== src && (
        <source
          srcSet={srcSet || webpUrl}
          sizes={sizes}
          type="image/webp"
        />
      )}
      {/* Fallback source with srcset */}
      {srcSet && (
        <source
          srcSet={srcSet.replace(/fm=webp/g, 'fm=jpg')}
          sizes={sizes}
          type="image/jpeg"
        />
      )}
      {/* Actual img element */}
      <img
        src={displaySrc}
        alt={alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={cn(
          aspectClasses[aspectRatio],
          "transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        {...props}
      />
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </picture>
  );
};

// Common size presets for reuse
export const IMAGE_SIZES = {
  hero: "100vw",
  companyLogo: "(max-width: 640px) 48px, (max-width: 768px) 64px, 80px",
  serviceCard: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  footerLogo: "164px",
  navLogo: "(max-width: 640px) 128px, (max-width: 768px) 160px, 196px",
  thumbnail: "(max-width: 640px) 80px, 120px",
  avatar: "48px",
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px",
} as const;

export default ResponsiveImage;

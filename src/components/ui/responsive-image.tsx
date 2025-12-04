import { ImgHTMLAttributes } from "react";

interface ResponsiveImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  aspectRatio?: "square" | "video" | "wide" | "auto";
}

/**
 * ResponsiveImage component with optimized loading attributes
 * - Uses native lazy loading for below-fold images
 * - Adds proper sizes attribute for browser optimization
 * - Supports priority loading for LCP images
 */
export const ResponsiveImage = ({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  aspectRatio = "auto",
  className = "",
  ...props
}: ResponsiveImageProps) => {
  const aspectClasses = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
    auto: "",
  };

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={`${aspectClasses[aspectRatio]} ${className}`}
      {...props}
    />
  );
};

// Common size presets for reuse
export const IMAGE_SIZES = {
  // Full width hero images
  hero: "100vw",
  // Company logos in cards (responsive grid)
  companyLogo: "(max-width: 640px) 48px, (max-width: 768px) 64px, 80px",
  // Service cards in grid
  serviceCard: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  // Footer logo
  footerLogo: "164px",
  // Navigation logo
  navLogo: "(max-width: 640px) 128px, (max-width: 768px) 160px, 196px",
} as const;

export default ResponsiveImage;

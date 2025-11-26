import { useState } from 'react';

interface OptimizedHeroImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export const OptimizedHeroImage = ({ src, alt, className = "", priority = false }: OptimizedHeroImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 animate-pulse" />
      )}
      
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
      />
    </div>
  );
};

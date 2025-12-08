import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface FloatingParticlesProps {
  count?: number;
  className?: string;
  color?: string;
}

export const FloatingParticles = memo(function FloatingParticles({
  count = 20,
  className,
  color = "bg-primary/20"
}: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Reduce particle count on mobile for better performance
  const actualCount = isMobile ? Math.min(count, 8) : count;

  // Don't render anything if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: actualCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, [actualCount]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={cn("absolute rounded-full", color)}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size
          }}
          animate={isMobile ? {
            opacity: [0.3, 0.5, 0.3]
          } : {
            y: [0, -30, 0],
            x: [0, 10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: isMobile ? particle.duration * 1.5 : particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
});
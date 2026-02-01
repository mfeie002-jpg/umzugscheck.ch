/**
 * Confetti Animation Component
 * Celebrates form submissions with a burst of colorful particles
 */
import { memo, useEffect, useState } from "react";

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  particleCount?: number;
  spread?: number;
  onComplete?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
  velocity: number;
  color: string;
  rotation: number;
  size: number;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "#22c55e", // green
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ec4899", // pink
];

export const Confetti = memo(function Confetti({
  trigger,
  duration = 3000,
  particleCount = 50,
  spread = 360,
  onComplete,
}: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      
      // Generate particles
      const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: 50, // Start from center (percentage)
        y: 50,
        angle: (spread / particleCount) * i - spread / 2,
        velocity: 8 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 360,
        size: 6 + Math.random() * 6,
      }));
      
      setParticles(newParticles);
      
      // Cleanup after duration
      const timeout = setTimeout(() => {
        setIsActive(false);
        setParticles([]);
        onComplete?.();
      }, duration);
      
      return () => clearTimeout(timeout);
    }
  }, [trigger, particleCount, spread, duration, onComplete, isActive]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `confetti-fall ${duration}ms cubic-bezier(0.23, 1, 0.32, 1) forwards`,
            '--confetti-angle': `${particle.angle}deg`,
            '--confetti-velocity': particle.velocity,
            animationDelay: `${Math.random() * 100}ms`,
          } as React.CSSProperties}
        />
      ))}
      
      <style>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: 
              translate(
                calc(cos(var(--confetti-angle)) * var(--confetti-velocity) * 50px),
                calc(sin(var(--confetti-angle)) * var(--confetti-velocity) * 50px + 200px)
              ) 
              rotate(720deg) 
              scale(0.5);
          }
        }
      `}</style>
    </div>
  );
});

// Simple success burst animation
export const SuccessBurst = memo(function SuccessBurst({
  trigger,
  className,
}: {
  trigger: boolean;
  className?: string;
}) {
  if (!trigger) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <div className="relative inline-flex rounded-full h-16 w-16 bg-emerald-500" />
      </div>
    </div>
  );
});

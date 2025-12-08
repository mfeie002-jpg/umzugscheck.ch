import { memo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  particleColor?: string;
  speed?: number;
}

export const ParticleField = memo(function ParticleField({
  className,
  particleCount = 50,
  particleColor = "hsl(var(--primary))",
  speed = 1
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Reduce particle count on mobile
  const actualCount = isMobile ? Math.min(particleCount, 15) : particleCount;
  const actualSpeed = isMobile ? speed * 0.5 : speed;

  // Don't render if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    for (let i = 0; i < actualCount; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * actualSpeed,
        vy: (Math.random() - 0.5) * actualSpeed,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = particleColor.replace(")", ` / ${p.opacity})`).replace("hsl(", "hsla(");
        ctx.fill();
      });

      // Draw connections only on desktop for performance
      if (!isMobile) {
        particles.forEach((p1, i) => {
          particles.slice(i + 1).forEach((p2) => {
            const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
            if (dist < 100) {
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = particleColor.replace(")", ` / ${0.1 * (1 - dist / 100)})`).replace("hsl(", "hsla(");
              ctx.stroke();
            }
          });
        });
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [actualCount, particleColor, actualSpeed, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{ width: "100%", height: "100%" }}
    />
  );
});

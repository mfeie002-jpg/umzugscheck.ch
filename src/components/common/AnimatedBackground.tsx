import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBackgroundProps {
  variant?: "dots" | "grid" | "waves" | "gradient" | "particles";
  className?: string;
  children?: React.ReactNode;
}

export const AnimatedBackground = memo(function AnimatedBackground({
  variant = "gradient",
  className,
  children
}: AnimatedBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {variant === "gradient" && (
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, hsl(var(--secondary) / 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, hsl(var(--primary) / 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.1) 0%, transparent 50%)",
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      {variant === "dots" && (
        <div 
          className="absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}
        />
      )}
      
      {variant === "grid" && (
        <div 
          className="absolute inset-0 -z-10 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px"
          }}
        />
      )}
      
      {variant === "waves" && (
        <svg className="absolute inset-0 -z-10 w-full h-full opacity-5" viewBox="0 0 1440 320">
          <motion.path
            fill="hsl(var(--primary))"
            d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            animate={{
              d: [
                "M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,128L48,154.7C96,181,192,235,288,234.7C384,235,480,181,576,181.3C672,181,768,235,864,250.7C960,267,1056,245,1152,229.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              ]
            }}
            transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
          />
        </svg>
      )}
      
      {variant === "particles" && (
        <div className="absolute inset-0 -z-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary/20"
              initial={{
                x: Math.random() * 100 + "%",
                y: Math.random() * 100 + "%",
              }}
              animate={{
                y: [null, "-20%", "120%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      )}
      
      {children}
    </div>
  );
});

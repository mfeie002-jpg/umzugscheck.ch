import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
}

export const Confetti = memo(function Confetti({
  trigger,
  duration = 3000
}: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    color: string;
  }>>([]);

  useEffect(() => {
    if (trigger) {
      const colors = ["#dc2626", "#2563eb", "#16a34a", "#eab308", "#8b5cf6"];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => setParticles([]), duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  return (
    <AnimatePresence>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="fixed w-3 h-3 rounded-full pointer-events-none z-[100]"
          style={{ backgroundColor: p.color, left: `${p.x}%` }}
          initial={{ top: -20, rotate: 0 }}
          animate={{
            top: "100vh",
            rotate: Math.random() * 720 - 360,
            x: Math.random() * 200 - 100
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 + Math.random(), ease: "easeIn" }}
        />
      ))}
    </AnimatePresence>
  );
});

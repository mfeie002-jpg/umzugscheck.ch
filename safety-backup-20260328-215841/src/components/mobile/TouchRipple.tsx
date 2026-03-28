import { useState, useCallback, ReactNode, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RippleEffect {
  id: number;
  x: number;
  y: number;
}

interface TouchRippleProps {
  children: ReactNode;
  className?: string;
  color?: string;
  disabled?: boolean;
}

export const TouchRipple = ({
  children,
  className = '',
  color = 'rgba(255, 255, 255, 0.3)',
  disabled = false,
}: TouchRippleProps) => {
  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  const handleClick = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  }, [disabled]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: 20,
              height: 20,
              marginLeft: -10,
              marginTop: -10,
              borderRadius: '50%',
              backgroundColor: color,
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

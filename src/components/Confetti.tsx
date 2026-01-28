import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
}

interface ConfettiProps {
  trigger: boolean;
  duration?: number;
  pieceCount?: number;
}

export default function Confetti({ 
  trigger, 
  duration = 3000, 
  pieceCount = 50 
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [isActive, setIsActive] = useState(false);

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6A1', 
    '#DDA0DD', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      
      const newPieces: ConfettiPiece[] = Array.from({ length: pieceCount }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 360,
      }));
      
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setIsActive(false);
        setPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{ 
                y: -20, 
                x: `${piece.x}vw`, 
                opacity: 1,
                rotate: 0,
                scale: 1
              }}
              animate={{ 
                y: '100vh', 
                rotate: piece.rotation + 720,
                scale: [1, 1.2, 0.8, 1],
                opacity: [1, 1, 1, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 2 + Math.random(),
                delay: piece.delay,
                ease: 'easeOut'
              }}
              className="absolute w-3 h-3"
              style={{ backgroundColor: piece.color }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

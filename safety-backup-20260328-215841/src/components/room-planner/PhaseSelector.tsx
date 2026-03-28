import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Phase } from './types';

interface PhaseSelectorProps {
  phases: Phase[];
  currentPhase: string;
  onPhaseChange: (phaseId: string) => void;
}

export const PhaseSelector: React.FC<PhaseSelectorProps> = ({
  phases,
  currentPhase,
  onPhaseChange,
}) => {
  const currentIndex = phases.findIndex(p => p.id === currentPhase);

  return (
    <div className="relative">
      {/* Progress line */}
      <div className="absolute top-6 left-0 right-0 h-1 bg-muted rounded-full mx-8">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentIndex / (phases.length - 1)) * 100}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>

      {/* Phase buttons */}
      <div className="flex justify-between relative z-10">
        {phases.map((phase, index) => {
          const isActive = phase.id === currentPhase;
          const isPast = index < currentIndex;

          return (
            <button
              key={phase.id}
              onClick={() => onPhaseChange(phase.id)}
              className="flex flex-col items-center gap-1 group"
            >
              <motion.div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all border-2",
                  isActive 
                    ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg" 
                    : isPast 
                      ? "bg-primary/20 border-primary/50" 
                      : "bg-muted border-muted-foreground/20 group-hover:border-primary/50"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {phase.icon}
              </motion.div>
              <span className={cn(
                "text-xs font-medium transition-colors hidden sm:block",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {phase.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

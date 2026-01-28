import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ScrollSnapServicesProps {
  children: ReactNode;
}

export default function ScrollSnapServices({ children }: ScrollSnapServicesProps) {
  return (
    <div className="md:hidden">
      <div 
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {children}
      </div>
      <div className="flex justify-center gap-1 mt-2">
        <span className="text-xs text-muted-foreground">← Wischen für mehr →</span>
      </div>
    </div>
  );
}

interface ScrollSnapServiceItemProps {
  children: ReactNode;
  className?: string;
}

export function ScrollSnapServiceItem({ children, className = '' }: ScrollSnapServiceItemProps) {
  return (
    <motion.div 
      className={`flex-shrink-0 w-[85%] snap-center ${className}`}
      style={{ scrollSnapAlign: 'center' }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}
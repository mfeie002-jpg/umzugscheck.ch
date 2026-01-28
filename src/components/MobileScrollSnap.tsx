import { ReactNode } from 'react';

interface MobileScrollSnapProps {
  children: ReactNode;
  className?: string;
}

export default function MobileScrollSnap({ children, className = '' }: MobileScrollSnapProps) {
  return (
    <div 
      className={`snap-x snap-mandatory overflow-x-auto flex gap-4 pb-4 scrollbar-hide ${className}`}
      style={{ scrollSnapType: 'x mandatory' }}
    >
      {children}
    </div>
  );
}

interface ScrollSnapItemProps {
  children: ReactNode;
  className?: string;
}

export function ScrollSnapItem({ children, className = '' }: ScrollSnapItemProps) {
  return (
    <div 
      className={`snap-center flex-shrink-0 ${className}`}
      style={{ scrollSnapAlign: 'center' }}
    >
      {children}
    </div>
  );
}
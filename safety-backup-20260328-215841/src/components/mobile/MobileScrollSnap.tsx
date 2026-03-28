import { ReactNode } from 'react';

interface MobileScrollSnapProps {
  children: ReactNode;
  className?: string;
}

export const MobileScrollSnap = ({ children, className = '' }: MobileScrollSnapProps) => {
  return (
    <div 
      className={`snap-y snap-mandatory overflow-y-auto h-screen lg:snap-none lg:overflow-visible lg:h-auto ${className}`}
    >
      {children}
    </div>
  );
};

interface SnapSectionProps {
  children: ReactNode;
  className?: string;
}

export const SnapSection = ({ children, className = '' }: SnapSectionProps) => {
  return (
    <section className={`snap-start snap-always min-h-screen lg:min-h-0 lg:snap-align-none ${className}`}>
      {children}
    </section>
  );
};

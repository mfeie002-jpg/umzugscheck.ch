import { memo } from 'react';
import { cn } from '@/lib/utils';

interface SectionDividerProps {
  variant?: 'wave' | 'curve' | 'angle' | 'simple';
  flip?: boolean;
  color?: string;
  className?: string;
}

export const SectionDivider = memo(function SectionDivider({
  variant = 'wave',
  flip = false,
  color = 'fill-muted',
  className,
}: SectionDividerProps) {
  const paths = {
    wave: 'M0,64 C320,100 640,20 960,64 C1280,108 1600,40 1920,64 L1920,128 L0,128 Z',
    curve: 'M0,96 Q960,0 1920,96 L1920,128 L0,128 Z',
    angle: 'M0,128 L1920,64 L1920,128 L0,128 Z',
    simple: 'M0,120 L1920,120 L1920,128 L0,128 Z',
  };

  return (
    <div className={cn('w-full overflow-hidden', flip && 'rotate-180', className)}>
      <svg
        viewBox="0 0 1920 128"
        className={cn('w-full h-8 md:h-12', color)}
        preserveAspectRatio="none"
      >
        <path d={paths[variant]} />
      </svg>
    </div>
  );
});

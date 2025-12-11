import { cn } from '@/lib/utils';
import { memo, ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'rainbow' | 'gold';
  animate?: boolean;
}

const gradients = {
  primary: 'from-primary via-primary to-accent-foreground',
  secondary: 'from-secondary via-secondary to-primary',
  rainbow: 'from-blue-500 via-purple-500 to-pink-500',
  gold: 'from-yellow-400 via-amber-500 to-orange-500',
};

export const GradientText = memo(function GradientText({
  children,
  className,
  variant = 'primary',
  animate = false,
}: GradientTextProps) {
  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        gradients[variant],
        animate && 'animate-shimmer-text bg-[length:200%_auto]',
        className
      )}
    >
      {children}
    </span>
  );
});

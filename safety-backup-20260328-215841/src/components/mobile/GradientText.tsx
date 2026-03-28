import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  children: ReactNode;
  gradient?: string;
  animate?: boolean;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export const GradientText = ({
  children,
  gradient = 'from-primary via-primary/80 to-primary/60',
  animate = false,
  className = '',
  as: Component = 'span',
}: GradientTextProps) => {
  if (animate) {
    return (
      <motion.span
        className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent bg-[length:200%_auto] ${className}`}
        animate={{
          backgroundPosition: ['0%', '100%', '0%'],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {children}
      </motion.span>
    );
  }

  return (
    <Component className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}>
      {children}
    </Component>
  );
};

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileStickyFooterProps {
  children: ReactNode;
  className?: string;
  show?: boolean;
}

export default function MobileStickyFooter({ 
  children, 
  className,
  show = true 
}: MobileStickyFooterProps) {
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: show ? 0 : 100 }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 md:hidden",
        "bg-background/95 backdrop-blur-sm border-t",
        "px-4 py-3 pb-safe",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
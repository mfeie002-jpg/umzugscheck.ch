import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileSearchOverlay } from './MobileSearchOverlay';

export const MobileSearchButton: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsSearchOpen(true)}
        className="fixed top-[4.5rem] right-2 z-40 h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm border border-border shadow-md flex items-center justify-center"
        style={{ right: 'max(0.75rem, env(safe-area-inset-right))' }}
        aria-label="Suche öffnen"
      >
        <Search className="h-5 w-5 text-foreground" />
      </motion.button>

      <MobileSearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};

export default MobileSearchButton;

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
        className="fixed top-4 right-16 z-50 h-10 w-10 rounded-full bg-background border border-border shadow-lg flex items-center justify-center"
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

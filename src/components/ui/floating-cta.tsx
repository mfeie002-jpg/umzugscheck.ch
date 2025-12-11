import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, MessageCircle, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface FloatingCTAProps {
  showAfter?: number; // scroll position in pixels
}

export const FloatingCTA = memo(function FloatingCTA({ showAfter = 500 }: FloatingCTAProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > showAfter);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showAfter]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 md:bottom-8 right-4 z-40 flex flex-col gap-2"
        >
          {/* Chat Button */}
          <Button
            size="icon"
            variant="outline"
            onClick={() => setShowChat(!showChat)}
            className={cn(
              "w-12 h-12 rounded-full shadow-lg bg-card border-border",
              showChat && "bg-secondary text-secondary-foreground"
            )}
            aria-label="Hilfe Chat öffnen"
          >
            {showChat ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
          </Button>

          {/* Scroll to Top */}
          <Button
            size="icon"
            variant="outline"
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full shadow-lg bg-card border-border hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Nach oben scrollen"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

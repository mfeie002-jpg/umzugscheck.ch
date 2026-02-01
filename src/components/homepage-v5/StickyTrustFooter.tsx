/**
 * Sticky Trust Footer V5 - Always visible trust + CTA in thumb zone
 * Addresses: "Der 'Sticky Trust Footer' (Daumen-Zone)"
 */
import { memo, useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Lock, Star, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const TRUST_MESSAGES = [
  { icon: Lock, text: 'SSL-gesichert' },
  { icon: Star, text: '4.9/5 Bewertung' },
  { icon: Shield, text: 'FINMA-reguliert' },
];

export const StickyTrustFooter = memo(function StickyTrustFooter() {
  const [isVisible, setIsVisible] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY > 400);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Rotate trust messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % TRUST_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const CurrentIcon = TRUST_MESSAGES[messageIndex].icon;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      role="complementary"
      aria-label="Schnellzugriff und Sicherheitshinweise"
    >
      {/* Gradient fade */}
      <div className="absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" aria-hidden="true" />
      
      <div className="bg-card border-t border-border shadow-2xl">
        <div className="px-4 py-3 flex items-center gap-3">
          {/* Rotating Trust Badge - Left */}
          <AnimatePresence mode="wait">
            <motion.div
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 bg-green-50 dark:bg-green-950 px-3 py-2 rounded-lg min-w-[120px]"
            >
              <CurrentIcon className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700 dark:text-green-300">
                {TRUST_MESSAGES[messageIndex].text}
              </span>
            </motion.div>
          </AnimatePresence>
          
          {/* CTA Button - Right */}
          <Link to="/umzugsofferten" className="flex-1">
            <Button 
              className="w-full h-12 text-base font-bold shadow-lg rounded-xl gap-2"
              aria-label="Jetzt kostenlos Preise prüfen"
            >
              Preise prüfen
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
});

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

interface GestureHintsProps {
  type: 'swipe' | 'pull' | 'scroll';
}

export default function GestureHints({ type }: GestureHintsProps) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const key = `gestureHint_${type}_dismissed`;
    const wasDismissed = localStorage.getItem(key);
    
    if (!wasDismissed) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [type]);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem(`gestureHint_${type}_dismissed`, 'true');
  };

  if (dismissed) return null;

  const hints = {
    swipe: {
      text: 'Wischen Sie links/rechts für weitere Seiten',
      icon: (
        <div className="flex items-center gap-1">
          <ChevronLeft className="h-4 w-4 animate-pulse" />
          <ChevronRight className="h-4 w-4 animate-pulse" />
        </div>
      ),
    },
    pull: {
      text: 'Ziehen Sie nach unten zum Aktualisieren',
      icon: <ChevronDown className="h-4 w-4 animate-bounce" />,
    },
    scroll: {
      text: 'Scrollen Sie für mehr Inhalte',
      icon: <ChevronDown className="h-4 w-4 animate-bounce" />,
    },
  };

  const hint = hints[type];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 md:hidden"
        >
          <div className="bg-foreground/90 text-background px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
            {hint.icon}
            <span className="text-sm font-medium">{hint.text}</span>
            <button onClick={handleDismiss} className="p-1 hover:bg-background/20 rounded-full">
              <X className="h-3 w-3" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

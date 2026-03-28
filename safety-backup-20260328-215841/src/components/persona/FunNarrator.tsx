/**
 * FunNarrator - Sticky narrator chip that updates on scroll
 */

import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PersonaKey, PageKey } from '@/lib/persona-types';
import { getNarratorLines } from '@/content/persona-content-index';

interface FunNarratorProps {
  persona: PersonaKey;
  page: PageKey;
}

export const FunNarrator = memo(function FunNarrator({ persona, page }: FunNarratorProps) {
  const lines = getNarratorLines(persona, page);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed || lines.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % lines.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [isDismissed, lines.length]);

  if (isDismissed || lines.length === 0) return null;

  const currentLine = lines[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className="fixed bottom-4 right-4 z-50 max-w-xs"
      >
        <div className="bg-card border border-border rounded-xl shadow-lg p-3 flex items-start gap-2">
          <MessageCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground flex-1">{currentLine?.text}</p>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => setIsDismissed(true)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
});

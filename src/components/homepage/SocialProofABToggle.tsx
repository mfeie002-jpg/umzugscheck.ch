/**
 * Floating A/B Toggle Button for Social Proof Sections
 * Only visible in development/preview mode
 */

import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, X } from 'lucide-react';
import { useState } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';

export const SocialProofABToggle = () => {
  const { variant, toggleVariant } = useSocialProofAB();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-card border-2 border-primary/30 rounded-xl shadow-2xl p-4 w-64"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-foreground">Social Proof A/B Test</h3>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3">
              Teste verschiedene Varianten der Trust-Sections
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => { toggleVariant(); }}
                className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all ${
                  variant === 'A' 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Variante A
              </button>
              <button
                onClick={() => { toggleVariant(); }}
                className={`flex-1 py-2 px-3 rounded-lg font-bold text-sm transition-all ${
                  variant === 'B' 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Variante B
              </button>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <strong>A:</strong> Aktuelle Version<br/>
                <strong>B:</strong> Neue Variante (anpassbar)
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main toggle button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-xl border-2 transition-all ${
          isExpanded 
            ? 'bg-primary text-primary-foreground border-primary' 
            : 'bg-card text-foreground border-primary/30 hover:border-primary/50'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FlaskConical className="w-5 h-5" />
        <span className="font-bold text-sm">
          {variant}
        </span>
      </motion.button>
    </div>
  );
};

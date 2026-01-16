/**
 * Floating A/B Toggle Button for Social Proof Sections
 * Highly visible toggle for testing
 */

import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, X } from 'lucide-react';
import { useState } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';

export const SocialProofABToggle = () => {
  const { variant, setVariant } = useSocialProofAB();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-[9999]">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 left-0 bg-white dark:bg-card border-2 border-primary rounded-xl shadow-2xl p-4 w-72"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-foreground">🧪 A/B Test: Social Proof</h3>
              <button 
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3">
              Wechsle zwischen verschiedenen Versionen
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={() => setVariant('A')}
                className={`flex-1 py-3 px-3 rounded-lg font-bold text-sm transition-all ${
                  variant === 'A' 
                    ? 'bg-primary text-white shadow-lg ring-2 ring-primary ring-offset-2' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                A (Live)
              </button>
              <button
                onClick={() => setVariant('B')}
                className={`flex-1 py-3 px-3 rounded-lg font-bold text-sm transition-all ${
                  variant === 'B' 
                    ? 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-600 ring-offset-2' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                B (Neu)
              </button>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
              <strong>A:</strong> Aktuelle Live-Version<br/>
              <strong>B:</strong> Trust Anchor + Live Stats + Deal Cards
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main toggle button - VERY VISIBLE */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl border-2 transition-all ${
          variant === 'A'
            ? 'bg-primary text-white border-primary' 
            : 'bg-emerald-600 text-white border-emerald-600'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ 
          boxShadow: isExpanded 
            ? '0 0 0 4px rgba(0,80,168,0.3)' 
            : '0 10px 40px rgba(0,0,0,0.3)'
        }}
      >
        <FlaskConical className="w-5 h-5" />
        <span className="font-bold">
          Variante {variant}
        </span>
      </motion.button>
    </div>
  );
};

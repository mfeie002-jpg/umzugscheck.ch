/**
 * A/B Testing Toggle for Social Proof sections
 * 4 Variants: A (Original), B (Live Dashboard), C (Trust Hierarchy), D (Trust Stack)
 */

import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, X, Check } from 'lucide-react';
import { useState, memo } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';

const variantInfo = {
  A: { label: 'V1', title: 'Original', color: 'bg-primary' },
  B: { label: 'V2', title: 'Live Dashboard', color: 'bg-emerald-600' },
  C: { label: 'V3', title: 'Trust Hierarchy', color: 'bg-amber-600' },
  D: { label: 'V4', title: 'Trust Stack', color: 'bg-violet-600' },
};

export const SocialProofABToggle = memo(function SocialProofABToggle() {
  const { variant, setVariant } = useSocialProofAB();
  const [isExpanded, setIsExpanded] = useState(false);
  const currentInfo = variantInfo[variant];

  return (
    <div className="fixed bottom-6 left-6 z-[9999]">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 left-0 bg-white dark:bg-card border-2 border-primary rounded-xl shadow-2xl p-4 w-80"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-foreground">🧪 A/B Test: Social Proof</h3>
              <button onClick={() => setIsExpanded(false)} className="p-1 rounded hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(variantInfo) as Array<keyof typeof variantInfo>).map((v) => {
                const info = variantInfo[v];
                const isActive = variant === v;
                return (
                  <button
                    key={v}
                    onClick={() => { setVariant(v); setIsExpanded(false); }}
                    className={`py-3 px-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-1 ${
                      isActive ? `${info.color} text-white shadow-lg ring-2 ring-offset-2` : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {info.label} {isActive && <Check className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground space-y-1">
              <div><strong>V1:</strong> Original (farbige Logos, 15k+)</div>
              <div><strong>V2:</strong> Live Dashboard + Deal Cards</div>
              <div><strong>V3:</strong> Trust Hierarchy (Logos oben)</div>
              <div><strong>V4:</strong> Trust Stack (kompakt)</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl border-2 text-white transition-all ${currentInfo.color} border-white/20`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FlaskConical className="w-5 h-5" />
        <span className="font-bold">{currentInfo.label}: {currentInfo.title}</span>
      </motion.button>
    </div>
  );
});

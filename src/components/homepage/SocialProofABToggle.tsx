/**
 * A/B Testing Toggle for Social Proof sections
 * 5 Variants: A (Original), B (Live Dashboard), C (Trust Hierarchy), D (Trust Stack), E (Trust Strip 2.0)
 * 
 * IMPROVED: Higher z-index, better visibility, larger touch target
 */

import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, X, Check } from 'lucide-react';
import { useState, memo } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';

const variantInfo = {
  A: { label: 'V1', title: 'Original', color: 'bg-blue-600' },
  B: { label: 'V2', title: 'Live Dashboard', color: 'bg-emerald-600' },
  C: { label: 'V3', title: 'Trust Hierarchy', color: 'bg-amber-600' },
  D: { label: 'V4', title: 'Trust Stack', color: 'bg-violet-600' },
  E: { label: 'V5', title: 'Trust Strip 2.0', color: 'bg-rose-600' },
  F: { label: 'V6', title: 'Verifiable Trust', color: 'bg-cyan-600' },
};

export const SocialProofABToggle = memo(function SocialProofABToggle() {
  const { variant, setVariant } = useSocialProofAB();
  const [isExpanded, setIsExpanded] = useState(false);
  const currentInfo = variantInfo[variant];

  return (
    <div 
      className="fixed z-[90] pointer-events-auto"
      style={{ 
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 96px)',
        left: '16px'
      }}
    >
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="absolute bottom-16 left-0 bg-white dark:bg-card border-2 border-primary rounded-xl shadow-2xl p-4 w-72 pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-foreground">🧪 A/B Test: Social Proof</h3>
              <button onClick={() => setIsExpanded(false)} className="p-1 rounded hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {(Object.keys(variantInfo) as Array<keyof typeof variantInfo>).map((v) => {
                const info = variantInfo[v];
                const isActive = variant === v;
                return (
                  <button
                    key={v}
                    onClick={() => { setVariant(v); setIsExpanded(false); }}
                    className={`w-full py-2.5 px-3 rounded-lg font-medium text-sm transition-all flex items-center justify-between ${
                      isActive 
                        ? `${info.color} text-white shadow-lg ring-2 ring-offset-2 ring-offset-background` 
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-bold">{info.label}</span>
                      <span className="opacity-80">{info.title}</span>
                    </span>
                    {isActive && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground space-y-1">
              <div><strong>V1:</strong> Original (farbige Logos)</div>
              <div><strong>V2:</strong> Live Dashboard + Deal Cards</div>
              <div><strong>V3:</strong> Trust Hierarchy (Logos oben)</div>
              <div><strong>V4:</strong> Trust Stack (kompakt)</div>
              <div><strong>V5:</strong> Trust Strip 2.0 (unified)</div>
              <div><strong>V6:</strong> Verifiable Trust (ZEFIX/UID)</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-4 py-3 rounded-full shadow-2xl border-2 text-white font-bold transition-all ${currentInfo.color} border-white/30 hover:scale-105`}
        whileTap={{ scale: 0.95 }}
        style={{ 
          boxShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.2)'
        }}
      >
        <FlaskConical className="w-5 h-5" />
        <span>SP {currentInfo.label}</span>
      </motion.button>
    </div>
  );
});

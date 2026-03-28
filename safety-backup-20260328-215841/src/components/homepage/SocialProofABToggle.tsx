/**
 * A/B Testing Toggle for Social Proof sections
 * EXPANDED: 28 Variants (A-AB) - includes research-based + CRO patterns
 */

import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, X, Check } from 'lucide-react';
import { useState, memo } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const variantInfo = {
  // === Standalone Sections ===
  A: { label: 'V1', title: 'Original', color: 'bg-blue-600', group: 'standalone' },
  B: { label: 'V2', title: 'Live Dashboard', color: 'bg-emerald-600', group: 'standalone' },
  C: { label: 'V3', title: 'Trust Hierarchy', color: 'bg-amber-600', group: 'standalone' },
  D: { label: 'V4', title: 'Trust Stack', color: 'bg-violet-600', group: 'standalone' },
  E: { label: 'V5', title: 'Trust Strip 2.0', color: 'bg-rose-600', group: 'standalone' },
  F: { label: 'V6', title: 'Verifiable Trust', color: 'bg-cyan-600', group: 'standalone' },
  // === Hybrid/Swiss ===
  G: { label: 'V7', title: 'Swiss Infrastructure', color: 'bg-red-600', group: 'hybrid' },
  H: { label: 'V8', title: 'Minimal Proof Strip', color: 'bg-slate-600', group: 'hybrid' },
  // === Hero-Integrated (Best 5) ===
  I: { label: 'V9', title: 'Card CTA Trust 🎯', color: 'bg-red-700', group: 'hero' },
  J: { label: 'V10', title: 'Press Trust Bar', color: 'bg-emerald-700', group: 'hero' },
  K: { label: 'V11', title: 'Glassmorphism Bar', color: 'bg-cyan-700', group: 'hero' },
  L: { label: 'V12', title: 'Hero Left + Form', color: 'bg-yellow-600', group: 'hero' },
  M: { label: 'V13', title: 'Left Under CTA', color: 'bg-amber-700', group: 'hero' },
  // === Psychological Triggers ===
  N: { label: 'V14', title: 'Bandwagon Effect', color: 'bg-purple-600', group: 'psych' },
  O: { label: 'V15', title: 'Local Trust', color: 'bg-green-600', group: 'psych' },
  P: { label: 'V16', title: 'Data Security', color: 'bg-stone-600', group: 'psych' },
  Q: { label: 'V17', title: 'In-Form Container', color: 'bg-rose-700', group: 'psych' },
  // === Research-Based ===
  R: { label: 'V18', title: 'Scannable Grid 📊', color: 'bg-indigo-600', group: 'research' },
  S: { label: 'V19', title: 'Hierarchy Strip', color: 'bg-teal-600', group: 'research' },
  T: { label: 'V20', title: 'Comparison Preview', color: 'bg-orange-600', group: 'research' },
  U: { label: 'V21', title: 'Mobile-First Tabs', color: 'bg-pink-600', group: 'research' },
  V: { label: 'V22', title: 'Trust + Pain Combo', color: 'bg-lime-600', group: 'research' },
  // === CRO Patterns (NEW) ===
  W: { label: 'V23', title: 'Trust Floor 🏛️', color: 'bg-blue-700', group: 'cro' },
  X: { label: 'V24', title: 'Form Anchor', color: 'bg-emerald-800', group: 'cro' },
  Y: { label: 'V25', title: 'Eyebrow Badge', color: 'bg-violet-700', group: 'cro' },
  Z: { label: 'V26', title: 'Floating Cards ✨', color: 'bg-amber-800', group: 'cro' },
  AA: { label: 'V27', title: 'Trust Ticker 📜', color: 'bg-cyan-800', group: 'cro' },
  AB: { label: 'V28', title: 'Glasmorphism Auth', color: 'bg-slate-700', group: 'cro' },
};

type VariantKey = keyof typeof variantInfo;

export const SocialProofABToggle = memo(function SocialProofABToggle() {
  const { variant, setVariant } = useSocialProofAB();
  const [isExpanded, setIsExpanded] = useState(false);
  const currentInfo = variantInfo[variant as VariantKey] || variantInfo.A;

  const groupedVariants = {
    standalone: { label: '📊 Standalone Sections', variants: ['A', 'B', 'C', 'D', 'E', 'F'] as VariantKey[] },
    hybrid: { label: '🇨🇭 Hybrid/Swiss', variants: ['G', 'H'] as VariantKey[] },
    hero: { label: '🎯 Hero-Integrated', variants: ['I', 'J', 'K', 'L', 'M'] as VariantKey[] },
    psych: { label: '🧠 Psychological', variants: ['N', 'O', 'P', 'Q'] as VariantKey[] },
    research: { label: '🔬 Research-Based', variants: ['R', 'S', 'T', 'U', 'V'] as VariantKey[] },
    cro: { label: '📈 CRO Patterns', variants: ['W', 'X', 'Y', 'Z', 'AA', 'AB'] as VariantKey[] },
  };

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
            className="absolute bottom-16 left-0 bg-white dark:bg-card border-2 border-primary rounded-xl shadow-2xl w-80 pointer-events-auto overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">🧪 Social Proof A/B (22)</h3>
              <button onClick={() => setIsExpanded(false)} className="p-1 rounded hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <ScrollArea className="h-[380px]">
              <div className="p-3 space-y-4">
                {Object.entries(groupedVariants).map(([groupKey, group]) => (
                  <div key={groupKey}>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                      {group.label}
                    </div>
                    <div className="space-y-1">
                      {group.variants.map((v) => {
                        const info = variantInfo[v];
                        const isActive = variant === v;
                        return (
                          <button
                            key={v}
                            onClick={() => { setVariant(v as any); setIsExpanded(false); }}
                            className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-all flex items-center justify-between ${
                              isActive 
                                ? `${info.color} text-white shadow-lg ring-2 ring-offset-2 ring-offset-background` 
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="font-bold">{info.label}</span>
                              <span className="opacity-80 text-xs">{info.title}</span>
                            </span>
                            {isActive && <Check className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-3 border-t border-border text-[10px] text-muted-foreground">
              <div className="font-semibold text-foreground">🎯 V9 (Card CTA Trust) = Empfohlen</div>
              <div className="mt-1">28 Varianten inkl. 6 CRO Patterns (W-AB)</div>
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

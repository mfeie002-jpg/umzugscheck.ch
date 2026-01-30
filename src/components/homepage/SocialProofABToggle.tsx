/**
 * A/B Testing Toggle for Social Proof sections
 * 20 Variants: A-T
 * 
 * IMPROVED: Scrollable list for many variants
 */

import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, X, Check } from 'lucide-react';
import { useState, memo } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const variantInfo = {
  A: { label: 'V1', title: 'Original', color: 'bg-blue-600' },
  B: { label: 'V2', title: 'Live Dashboard', color: 'bg-emerald-600' },
  C: { label: 'V3', title: 'Trust Hierarchy', color: 'bg-amber-600' },
  D: { label: 'V4', title: 'Trust Stack', color: 'bg-violet-600' },
  E: { label: 'V5', title: 'Trust Strip 2.0', color: 'bg-rose-600' },
  F: { label: 'V6', title: 'Verifiable Trust', color: 'bg-cyan-600' },
  G: { label: 'V7', title: 'Swiss Infrastructure', color: 'bg-red-600' },
  H: { label: 'V8', title: 'Pain vs Gain', color: 'bg-orange-600' },
  I: { label: 'V9', title: 'Hybrid Trust Bar', color: 'bg-yellow-600' },
  J: { label: 'V10', title: 'Trust Ecosystem', color: 'bg-teal-600' },
  K: { label: 'V11', title: 'Minimal Proof Strip', color: 'bg-slate-600' },
  L: { label: 'V12', title: 'Swiss Standards', color: 'bg-indigo-600' },
  M: { label: 'V13', title: 'Hero Reassurance', color: 'bg-pink-600' },
  N: { label: 'V14', title: 'Hero Form Footer', color: 'bg-lime-600' },
  O: { label: 'V15', title: 'Hero Eyebrow', color: 'bg-fuchsia-600' },
  P: { label: 'V16', title: 'CTA Adjacent', color: 'bg-sky-600' },
  Q: { label: 'V17', title: 'Bandwagon Effect', color: 'bg-purple-600' },
  R: { label: 'V18', title: 'Local Trust', color: 'bg-green-600' },
  S: { label: 'V19', title: 'Data Security', color: 'bg-stone-600' },
  T: { label: 'V20', title: 'Safety Architecture', color: 'bg-zinc-700' },
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
            className="absolute bottom-16 left-0 bg-white dark:bg-card border-2 border-primary rounded-xl shadow-2xl w-80 pointer-events-auto overflow-hidden"
          >
            <div className="flex items-center justify-between p-3 border-b border-border">
              <h3 className="font-bold text-sm text-foreground">🧪 A/B Test: Social Proof (20)</h3>
              <button onClick={() => setIsExpanded(false)} className="p-1 rounded hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <ScrollArea className="h-[360px]">
              <div className="p-3 space-y-1.5">
                {(Object.keys(variantInfo) as Array<keyof typeof variantInfo>).map((v) => {
                  const info = variantInfo[v];
                  const isActive = variant === v;
                  return (
                    <button
                      key={v}
                      onClick={() => { setVariant(v); setIsExpanded(false); }}
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
            </ScrollArea>
            
            <div className="p-3 border-t border-border text-[10px] text-muted-foreground space-y-0.5 max-h-40 overflow-y-auto">
              <div><strong>V1-V6:</strong> Original, Live Dashboard, Trust Hierarchy, Stack, Strip, Verifiable</div>
              <div><strong>V7-V12:</strong> Swiss Infra, Pain/Gain, Hybrid, Ecosystem, Minimal, Standards</div>
              <div className="pt-1 border-t border-border/50 mt-1"><strong>V13-V15:</strong> Hero-integriert (Reassurance, Form Footer, Eyebrow)</div>
              <div><strong>V16-V20:</strong> CTA Adjacent, Bandwagon, Local Trust, Data Security, Safety</div>
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
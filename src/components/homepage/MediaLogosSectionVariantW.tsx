/**
 * Social Proof Variant W (V23): Comparison Preview
 * 
 * Research-based: Visual table preview showing price differences
 * Based on: Smashing Magazine pricing guidelines, side-by-side comparisons
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, X, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const MediaLogosSectionVariantW = memo(function MediaLogosSectionVariantW({ className }: Props) {
  return (
    <section className={cn("py-8 bg-muted/30", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              Warum vergleichen? Ein Beispiel:
            </p>
          </div>
          
          {/* Comparison Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Without Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-background rounded-xl border p-4"
            >
              <div className="text-center mb-4">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Ohne Vergleich</span>
                <div className="text-2xl font-bold text-rose-600 mt-1">CHF 2'400</div>
                <div className="text-[10px] text-muted-foreground">Erstbeste Offerte</div>
              </div>
              
              <div className="space-y-2">
                {[
                  { text: 'Keine Preistransparenz', included: false },
                  { text: 'Unbekannte Qualität', included: false },
                  { text: 'Keine Garantien', included: false },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <X className="w-3 h-3 text-rose-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* With Comparison (Recommended) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-xl border-2 border-emerald-300 dark:border-emerald-700 p-4"
            >
              {/* Recommended Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  Empfohlen
                </span>
              </div>
              
              <div className="text-center mb-4 pt-2">
                <span className="text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Mit UmzugsCheck</span>
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400 mt-1">CHF 1'680</div>
                <div className="text-[10px] text-emerald-600 dark:text-emerald-500 font-medium">Ø 30% günstiger</div>
              </div>
              
              <div className="space-y-2">
                {[
                  { text: 'Transparente Preise', included: true },
                  { text: 'Geprüfte Qualität', included: true },
                  { text: 'Kostenlose Garantie', included: true },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                    <span className="text-emerald-800 dark:text-emerald-300 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Savings Callout */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 rounded-full border border-amber-200 dark:border-amber-700">
              <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Durchschnittliche Ersparnis: <strong>CHF 620</strong>
              </span>
              <ArrowRight className="w-4 h-4 text-amber-600" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantW;

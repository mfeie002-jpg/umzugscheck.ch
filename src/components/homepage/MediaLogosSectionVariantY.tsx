/**
 * Social Proof Variant Y (V25): Trust + Pain Combo
 * 
 * Research-based: Addresses pain points directly paired with solutions
 * Based on: DivByZero tips - address pains, feature reviews
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, Shield, Banknote, Clock, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

const PAIN_SOLUTIONS = [
  {
    pain: 'Versteckte Kosten?',
    painIcon: Banknote,
    solution: 'Festpreis-Garantie',
    solutionDetail: 'Keine bösen Überraschungen',
  },
  {
    pain: 'Schäden am Hausrat?',
    painIcon: AlertTriangle,
    solution: 'Versicherte Partner',
    solutionDetail: 'Alle Firmen haftpflichtversichert',
  },
  {
    pain: 'Zu viel Aufwand?',
    painIcon: Clock,
    solution: '3 Min. Formular',
    solutionDetail: 'Sofort vergleichbare Offerten',
  },
  {
    pain: 'Unseriöse Firmen?',
    painIcon: HelpCircle,
    solution: 'Geprüfte Qualität',
    solutionDetail: '200+ verifizierte Anbieter',
  },
];

export const MediaLogosSectionVariantY = memo(function MediaLogosSectionVariantY({ className }: Props) {
  return (
    <section className={cn("py-8 bg-muted/30", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold">Ihre Sorgen – unsere Lösungen</h3>
          </div>
          
          {/* Pain → Solution Grid */}
          <div className="grid md:grid-cols-2 gap-3">
            {PAIN_SOLUTIONS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-background rounded-xl border p-4 flex items-center gap-4"
              >
                {/* Pain Side */}
                <div className="flex-shrink-0 w-20 text-center">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 mx-auto mb-1 flex items-center justify-center">
                    <item.painIcon className="w-4 h-4 text-rose-600" />
                  </div>
                  <span className="text-[10px] text-rose-600 font-medium">{item.pain}</span>
                </div>
                
                {/* Arrow */}
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs">→</span>
                  </div>
                </div>
                
                {/* Solution Side */}
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                      {item.solution}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5 ml-5">
                    {item.solutionDetail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Trust Summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-medium">100% kostenlos & unverbindlich</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantY;

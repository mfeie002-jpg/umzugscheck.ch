/**
 * Social Proof Variant P (V16): CTA Adjacent Trust
 * 
 * Trust badges placed next to CTA/submit buttons - based on UX research:
 * "To maximize conversion, trust badges must be visually adjacent to the Submit button"
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, CheckCircle, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const MediaLogosSectionVariantP = memo(function MediaLogosSectionVariantP({ className }: Props) {
  return (
    <section className={cn("py-6 bg-muted/30", className)}>
      <div className="container mx-auto px-4">
        {/* Headline */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground">
            Vertrauen am Entscheidungspunkt – direkt neben jedem CTA
          </p>
        </div>
        
        {/* Demo: Simulated CTA with adjacent trust badges */}
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-background rounded-xl border-2 border-primary/20 p-6 shadow-lg"
          >
            {/* Fake Form Preview */}
            <div className="space-y-4 mb-6">
              <div className="h-10 bg-muted rounded-lg" />
              <div className="h-10 bg-muted rounded-lg" />
            </div>
            
            {/* CTA Button */}
            <button className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl text-lg">
              Offerten erhalten
            </button>
            
            {/* Adjacent Trust Badges - The Key Feature */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>SSL-verschlüsselt</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>DSGVO-konform</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Gratis & unverbindlich</span>
              </div>
            </div>
            
            {/* Micro-trust line */}
            <p className="text-center text-[10px] text-muted-foreground mt-3">
              Ihre Daten werden ausschliesslich zur Offertenerstellung verwendet
            </p>
          </motion.div>
        </div>
        
        {/* Trust Badges Row */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          {[
            { icon: Award, label: 'Swiss Made', sublabel: 'Software' },
            { icon: ShieldCheck, label: 'Versichert', sublabel: 'Transport' },
            { icon: Lock, label: 'Daten', sublabel: 'Schweiz' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-2 px-4 py-2 bg-background rounded-full border shadow-sm"
            >
              <item.icon className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="text-xs font-semibold">{item.label}</div>
                <div className="text-[10px] text-muted-foreground">{item.sublabel}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantP;

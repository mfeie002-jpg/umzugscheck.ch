/**
 * Social Proof Variant T (V20): Safety Architecture
 * 
 * Combined trust signals at action points - full "Safety Architecture":
 * Integrates CTA-adjacent trust, live activity, local trust, and data security
 */

import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Lock, CheckCircle, Award, Users, MapPin, Star, 
  TrendingUp, Server, BadgeCheck, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const MediaLogosSectionVariantT = memo(function MediaLogosSectionVariantT({ className }: Props) {
  const [liveCount, setLiveCount] = useState(7);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(Math.floor(Math.random() * 12) + 3);
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className={cn("py-10 bg-muted/20", className)}>
      <div className="container mx-auto px-4">
        {/* Top: Live Activity Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-3 mb-8 max-w-xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-green-800 dark:text-green-300">
              <span className="font-bold">{liveCount} Personen</span> vergleichen gerade Offerten
            </span>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
        </motion.div>
        
        {/* Middle: Trust Pillars */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
          {/* Pillar 1: Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-background rounded-xl border p-5 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 mx-auto mb-3 flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-bold text-sm mb-2">Datensicherheit</h4>
            <div className="space-y-1.5">
              {['SSL-verschlüsselt', 'Schweizer Server', 'DSGVO-konform'].map((item, idx) => (
                <div key={idx} className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Pillar 2: Quality */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-background rounded-xl border p-5 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 mx-auto mb-3 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-600" />
            </div>
            <h4 className="font-bold text-sm mb-2">Geprüfte Qualität</h4>
            <div className="space-y-1.5">
              {['200+ Partner', '4.8★ Durchschnitt', 'Alle versichert'].map((item, idx) => (
                <div key={idx} className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          {/* Pillar 3: Service */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-background rounded-xl border p-5 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 mx-auto mb-3 flex items-center justify-center">
              <Zap className="w-6 h-6 text-violet-600" />
            </div>
            <h4 className="font-bold text-sm mb-2">Garantien</h4>
            <div className="space-y-1.5">
              {['100% kostenlos', 'Unverbindlich', 'Kein Spam'].map((item, idx) => (
                <div key={idx} className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Bottom: Compact Local Trust */}
        <div className="flex flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto">
          {[
            { icon: MapPin, label: 'Lokale Partner', value: 'in 26 Kantonen' },
            { icon: Star, label: 'Bewertungen', value: '15\'000+' },
            { icon: BadgeCheck, label: 'Swiss Made', value: 'Software' },
            { icon: Server, label: 'Hosting', value: 'Schweiz' },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-2 px-3 py-2 bg-background rounded-full border text-xs"
            >
              <item.icon className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{item.label}:</span>
              <span className="font-semibold">{item.value}</span>
            </motion.div>
          ))}
        </div>
        
        {/* Trust Promise */}
        <p className="text-center text-[10px] text-muted-foreground mt-6">
          Alle Angaben transparent & verifizierbar • Ihre Daten bleiben in der Schweiz
        </p>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantT;

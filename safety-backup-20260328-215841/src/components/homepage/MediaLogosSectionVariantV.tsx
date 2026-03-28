/**
 * Social Proof Variant V (V22): Hierarchy Strip
 * 
 * Research-based: High-hierarchy layout with micro-testimonial + core stats
 * Based on NNGroup: visual hierarchy, side-by-side layouts
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, TrendingUp, Award, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

export const MediaLogosSectionVariantV = memo(function MediaLogosSectionVariantV({ className }: Props) {
  return (
    <section className={cn("py-6 bg-muted/40", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Split Layout: Testimonial + Stats */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            {/* Left: Micro-Testimonial (High Hierarchy) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20"
            >
              <div className="flex gap-3">
                <Quote className="w-8 h-8 text-primary/30 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    "Dank UmzugsCheck haben wir <span className="text-primary font-bold">CHF 720 gespart</span> – 
                    und der Umzug lief reibungslos."
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      — Familie Meier, Zürich → Winterthur
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Right: Core Stats Strip */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-3"
            >
              {[
                { icon: TrendingUp, value: "15'000+", label: 'erfolgreiche Umzüge' },
                { icon: Star, value: '4.8 / 5', label: 'Kundenbewertung' },
                { icon: Award, value: '200+', label: 'geprüfte Partnerfirmen' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-background rounded-lg border px-4 py-2.5"
                >
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="font-bold text-lg">{stat.value}</span>
                    <span className="text-xs text-muted-foreground ml-2">{stat.label}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
          
          {/* Bottom Trust Line */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6 text-xs text-muted-foreground">
            {['100% kostenlos', 'Unverbindlich', 'Schweizer Daten', 'Kein Spam'].map((item, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-green-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantV;

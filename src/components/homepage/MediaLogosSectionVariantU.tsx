/**
 * Social Proof Variant U (V21): Scannable Grid
 * 
 * Research-based: 4-card grid with icons and color coding for quick scanning
 * Based on NNGroup principles: scannability, consistency, user control
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Award, Percent, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

const SCANNABLE_METRICS = [
  {
    icon: TrendingUp,
    value: "15'000+",
    label: 'Vermittelte Umzüge',
    bgColor: 'bg-primary/10',
    iconColor: 'text-primary',
    highlight: false
  },
  {
    icon: Star,
    value: '4.8/5',
    label: 'Kundenbewertung',
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-600',
    highlight: false
  },
  {
    icon: Award,
    value: '200+',
    label: 'Geprüfte Partner',
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-600',
    highlight: false
  },
  {
    icon: Percent,
    value: 'Ø 40%',
    label: 'Ersparnis',
    bgColor: 'bg-rose-500/10',
    iconColor: 'text-rose-600',
    highlight: true
  },
];

export const MediaLogosSectionVariantU = memo(function MediaLogosSectionVariantU({ className }: Props) {
  return (
    <section className={cn("py-8 bg-muted/30", className)}>
      <div className="container mx-auto px-4">
        {/* Compact Grid - No Header for maximum scannability */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {SCANNABLE_METRICS.map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "relative rounded-xl border p-4 text-center transition-shadow hover:shadow-md",
                metric.highlight 
                  ? "bg-gradient-to-br from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30 border-rose-200 dark:border-rose-800"
                  : "bg-background"
              )}
            >
              {metric.highlight && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-rose-500 text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                  Beliebt
                </span>
              )}
              
              <div className={cn(
                "w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center",
                metric.bgColor
              )}>
                <metric.icon className={cn("w-5 h-5", metric.iconColor)} />
              </div>
              
              <div className="text-xl font-bold tracking-tight">{metric.value}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{metric.label}</div>
            </motion.div>
          ))}
        </div>
        
        {/* Single line trust footer */}
        <div className="flex items-center justify-center gap-4 mt-6 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            <span>100% kostenlos</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            <span>Unverbindlich</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            <span>Swiss Made</span>
          </div>
        </div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantU;

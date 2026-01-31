/**
 * TrustRibbon VARIANT O - Local Trust (Regional Badges)
 * 
 * VERSION 15: Shows regional presence and local trust signals
 * - Regional presence badges (Zürich, Bern, Basel, etc.)
 * - Local partner count per region
 * - "Ihre Region" personalization
 */

import { memo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, Star, CheckCircle2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TRUST } from '@/content/trust';

const REGIONS = [
  { name: 'Zürich', partners: 45, active: true },
  { name: 'Bern', partners: 32, active: true },
  { name: 'Basel', partners: 28, active: true },
  { name: 'Luzern', partners: 22, active: false },
  { name: 'Aargau', partners: 18, active: false },
  { name: 'St. Gallen', partners: 15, active: false },
];

interface TrustRibbonVariantOProps {
  variant?: "full" | "compact";
  className?: string;
}

export const TrustRibbonVariantO = memo(function TrustRibbonVariantO({ 
  variant = "full",
  className 
}: TrustRibbonVariantOProps) {
  const [highlightedRegion, setHighlightedRegion] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHighlightedRegion(prev => (prev + 1) % REGIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (variant === "compact") {
    return (
      <div className={cn("py-3 bg-muted/30 border-b border-border/50", className)}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium">{TRUST.companiesCount} Partner schweizweit</span>
            </div>
            <span className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              {REGIONS.slice(0, 3).map((r) => (
                <span key={r.name} className="text-xs text-muted-foreground">{r.name}</span>
              ))}
              <span className="text-xs text-primary">+20 Regionen</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={cn("py-8 bg-gradient-to-b from-muted/30 to-background", className)}>
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-1">
            <MapPin className="w-5 h-5 inline-block mr-1 text-destructive" />
            In Ihrer Region verfügbar
          </h3>
          <p className="text-sm text-muted-foreground">
            {TRUST.companiesCount} geprüfte Partner in der ganzen Schweiz
          </p>
        </motion.div>

        {/* Regions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6"
        >
          {REGIONS.map((region, idx) => (
            <motion.div
              key={region.name}
              animate={{
                scale: idx === highlightedRegion ? 1.05 : 1,
                borderColor: idx === highlightedRegion ? 'hsl(var(--primary))' : 'hsl(var(--border))'
              }}
              className={cn(
                "flex flex-col items-center p-3 rounded-xl border bg-card transition-all",
                idx === highlightedRegion && "shadow-md"
              )}
            >
              <span className="text-sm font-semibold text-foreground">{region.name}</span>
              <div className="flex items-center gap-1 mt-1">
                <Building2 className="w-3 h-3 text-primary" />
                <span className="text-xs text-muted-foreground">{region.partners} Partner</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-border"
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-bold text-lg">{TRUST.movesCount}</span>
            <span className="text-sm text-muted-foreground">erfolgreiche Umzüge</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-bold text-lg">{TRUST.ratingDisplay}</span>
            <span className="text-sm text-muted-foreground">Bewertung</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-muted-foreground">Alle Partner versichert</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

/**
 * TrustRibbon VARIANT E - Trust Strip 2.0
 * 
 * VERSION 5: Single unified trust strip
 * - ONE compact section replacing KPIs + logos + rating separately
 * - Consistent 4.8 rating everywhere (from trust.ts)
 * - Stats row + micro-proof + press logos + trust badges
 * - "Alle Bewertungen ansehen" link to #bewertungen
 * - Mobile: horizontal scroll chips
 */

import { memo, useMemo } from "react";
import { Star, Shield, Clock, CheckCircle2, Globe, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { TRUST, VERIFIED_PRESS } from "@/content/trust";

// Monochrome press logos with good contrast
const PressLogo = memo(({ name }: { name: string }) => {
  const logos: Record<string, JSX.Element> = {
    "SRF": (
      <span className="font-bold text-sm text-foreground/75 hover:text-foreground transition-colors cursor-pointer">
        SRF
      </span>
    ),
    "NZZ": (
      <span className="font-serif font-bold text-base text-foreground/75 hover:text-foreground transition-colors cursor-pointer">
        NZZ
      </span>
    ),
    "20 Minuten": (
      <span className="font-bold text-sm text-foreground/75 hover:text-foreground transition-colors cursor-pointer">
        20 Min
      </span>
    ),
    "Blick": (
      <span className="font-bold text-sm uppercase text-foreground/75 hover:text-foreground transition-colors cursor-pointer">
        Blick
      </span>
    ),
    "TCS": (
      <span className="font-bold text-sm text-foreground/75 hover:text-foreground transition-colors cursor-pointer">
        TCS
      </span>
    ),
  };
  return logos[name] || <span className="text-sm text-foreground/75">{name}</span>;
});

PressLogo.displayName = 'PressLogo';

// Stats chip component
const StatChip = memo(({ value, label, icon }: { value: string; label: string; icon?: React.ReactNode }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border whitespace-nowrap">
    {icon}
    <span className="font-bold text-foreground">{value}</span>
    <span className="text-sm text-muted-foreground hidden sm:inline">{label}</span>
  </div>
));

StatChip.displayName = 'StatChip';

interface TrustRibbonVariantEProps {
  variant?: "full" | "compact";
  className?: string;
}

export const TrustRibbonVariantE = memo(function TrustRibbonVariantE({ 
  variant = "full",
  className = ""
}: TrustRibbonVariantEProps) {

  const stats = useMemo(() => [
    { value: TRUST.movesCount, label: TRUST.movesLabel },
    { value: TRUST.companiesCount, label: TRUST.companiesLabel },
    { value: TRUST.ratingDisplay, label: "Bewertung", icon: <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> },
    { value: `Ø ${TRUST.savingsPercent}`, label: TRUST.savingsLabel },
  ], []);

  if (variant === "compact") {
    return (
      <div className={`py-3 bg-muted/30 border-b border-border ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="font-bold text-sm ml-1">{TRUST.ratingDisplay}</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <span className="text-sm text-muted-foreground whitespace-nowrap">{TRUST.movesCount} Umzüge</span>
            <span className="text-muted-foreground hidden sm:inline">|</span>
            <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline">{TRUST.companiesCount} Firmen</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-8 md:py-10 bg-gradient-to-b from-muted/20 to-background ${className}`}>
      <div className="container mx-auto px-4">
        
        {/* HEADLINE */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-medium text-primary mb-1">
            Schweizweit bewährt. Transparent. Kostenlos.
          </p>
        </motion.div>

        {/* MAIN TRUST STRIP */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          
          {/* ROW 1: Stats (horizontal scroll on mobile) */}
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar justify-start md:justify-center">
            {stats.map((stat, i) => (
              <StatChip key={i} {...stat} />
            ))}
          </div>

          {/* ROW 2: Rating + Review Link + Trust Chips */}
          <div className="bg-card border border-border rounded-xl p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              
              {/* Left: Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className={`w-5 h-5 ${i <= Math.floor(TRUST.ratingValue) ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-200 text-yellow-200'}`} />
                    ))}
                  </div>
                  <span className="font-bold text-lg">{TRUST.ratingDisplay}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  aus <strong className="text-foreground">{TRUST.ratingCount.toLocaleString()}</strong> Bewertungen
                </div>
              </div>
              
              {/* Right: CTA Link */}
              <a 
                href="#bewertungen" 
                className="inline-flex items-center gap-1.5 text-primary font-medium text-sm hover:underline group"
              >
                Alle Bewertungen ansehen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
            
            {/* Trust Chips */}
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-xs font-medium">
                <Shield className="w-3.5 h-3.5 text-primary" />
                Geprüfte Firmen
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                Antwort in 24–48h
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Kostenlos
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                Schweizweit
              </div>
            </div>
          </div>

          {/* ROW 3: Press Logos */}
          <div className="text-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-3">
              Bekannt aus
            </span>
            <div className="flex flex-wrap items-center justify-center gap-5 md:gap-8">
              {VERIFIED_PRESS.map(({ name }) => (
                <motion.div
                  key={name}
                  whileHover={{ scale: 1.05 }}
                  className="transition-opacity"
                >
                  <PressLogo name={name} />
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
});

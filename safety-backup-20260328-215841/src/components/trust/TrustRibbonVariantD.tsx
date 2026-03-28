/**
 * TrustRibbon VARIANT D - Trust Stack
 * 
 * VERSION 4: Compact unified trust module
 * - "Schweizer Standard. Verifiziert." headline
 * - Rating + Proof Chips + CTA in one card
 * - High-contrast logos with "Bekannt aus" label
 * - Microtrust lines
 */

import { memo } from "react";
import { Shield, Star, CheckCircle2, Clock, Globe, Lock, ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// High-contrast monochrome logos (60-75% opacity)
const PressLogo = ({ name }: { name: string }) => {
  const logos: Record<string, JSX.Element> = {
    "SRF": <span className="font-bold text-sm text-foreground/70 hover:text-foreground transition-colors">SRF</span>,
    "NZZ": <span className="font-serif font-bold text-base text-foreground/70 hover:text-foreground transition-colors">NZZ</span>,
    "20 Minuten": <span className="font-bold text-sm text-foreground/70 hover:text-foreground transition-colors">20 Minuten</span>,
    "Blick": <span className="font-bold text-sm text-foreground/70 hover:text-foreground transition-colors uppercase">Blick</span>,
    "TCS": <span className="font-bold text-sm text-foreground/70 hover:text-foreground transition-colors">TCS</span>,
  };
  return logos[name] || <span className="font-bold text-sm text-foreground/70">{name}</span>;
};

interface TrustRibbonVariantDProps {
  variant?: "full" | "compact";
  className?: string;
}

export const TrustRibbonVariantD = memo(function TrustRibbonVariantD({ 
  variant = "full",
  className = ""
}: TrustRibbonVariantDProps) {

  const reviewCount = 2847;

  if (variant === "compact") {
    return (
      <div className={`py-4 bg-muted/20 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-bold text-foreground">4.8/5</span>
              <span className="text-sm text-muted-foreground">({reviewCount}+)</span>
            </div>
            <div className="flex items-center gap-4">
              {["SRF", "TCS", "NZZ"].map((name) => (
                <PressLogo key={name} name={name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-10 md:py-12 bg-muted/20 ${className}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* HEADER */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Schweizer Standard. Verifiziert.
          </h2>
          <p className="text-muted-foreground">
            Echte Bewertungen, geprüfte Partner und transparente Offerten, damit Sie sicher entscheiden.
          </p>
        </motion.div>

        {/* TRUST SUMMARY CARD */}
        <motion.div
          className="bg-card border border-border rounded-2xl shadow-lg p-6 md:p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-12 gap-6 md:gap-8">
            
            {/* LEFT: Rating + Proof */}
            <div className="md:col-span-8">
              {/* Rating Row */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={`w-6 h-6 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-300 text-yellow-300'}`} />
                  ))}
                </div>
                <span className="text-2xl font-bold text-foreground">4.8/5</span>
                <span className="text-muted-foreground">aus {reviewCount.toLocaleString()} verifizierten Bewertungen</span>
              </div>
              
              <a href="#bewertungen" className="text-primary hover:underline text-sm font-medium mb-5 inline-block">
                Bewertungen ansehen →
              </a>
              
              {/* Proof Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="font-medium text-foreground">Geprüfte & versicherte Firmen</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">Offerten in 24–48h</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-foreground">Kostenlos & unverbindlich</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">Schweizweit</span>
                </div>
              </div>
              
              {/* Microtrust Line */}
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Lock className="w-3 h-3" />
                Ihre Kontaktdaten werden nur mit Ihrer Einwilligung an passende Anbieter übermittelt.
              </p>
            </div>
            
            {/* RIGHT: CTA Stack */}
            <div className="md:col-span-4 flex flex-col justify-center gap-3">
              <Button size="lg" className="w-full gap-2">
                Offerten vergleichen
                <ArrowRight className="w-4 h-4" />
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Dauert 2 Minuten. Keine Verpflichtung.
              </p>
              <Button variant="outline" size="sm" className="w-full gap-1.5">
                <Shield className="w-4 h-4" />
                Prüfprozess ansehen
              </Button>
            </div>
          </div>
        </motion.div>

        {/* PRESS / BEKANNT AUS - High visibility */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-4">
            Bekannt aus
          </span>
          
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-3">
            {["SRF", "NZZ", "20 Minuten", "Blick", "TCS"].map((name) => (
              <motion.div
                key={name}
                whileHover={{ scale: 1.05 }}
                className="cursor-pointer"
              >
                <PressLogo name={name} />
              </motion.div>
            ))}
          </div>
          
          <p className="text-xs text-muted-foreground">
            Quellen & Nachweise finden Sie im{" "}
            <a href="/pruefprozess" className="text-primary hover:underline">Prüfprozess</a>.
          </p>
        </motion.div>
      </div>
    </section>
  );
});

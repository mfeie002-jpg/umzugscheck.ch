/**
 * TrustRibbon - High-Impact Trust Section
 * 
 * Designed to STAND OUT, not blend in:
 * ✅ Gradient background that creates visual "zone"
 * ✅ Shield icon with clear value prop
 * ✅ Colored logos (NOT greyscale/muted)
 * ✅ Bold typography with proper hierarchy
 */

import { memo } from "react";
import { Shield, Star, CheckCircle2, BadgeCheck, Building2, FileCheck2 } from "lucide-react";
import { motion } from "framer-motion";

// Trust criteria - what we actually verify
const trustCriteria = [
  { icon: FileCheck2, label: "Handelsregister", color: "text-blue-600" },
  { icon: Shield, label: "Versicherung", color: "text-emerald-600" },
  { icon: BadgeCheck, label: "Bewertungen", color: "text-amber-600" },
  { icon: Building2, label: "Identität", color: "text-primary" },
];

// Media partners with brand colors
const mediaLogos = [
  { name: "TCS", color: "#0050A8" },
  { name: "SRF", color: "#C8102E" },
  { name: "NZZ", color: "#1a1a1a" },
  { name: "20 Minuten", color: "#E3000F" },
  { name: "Blick", color: "#E30613" },
  { name: "Watson", color: "#1a1a1a" },
];

interface TrustRibbonProps {
  variant?: "full" | "compact";
  className?: string;
}

export const TrustRibbon = memo(function TrustRibbon({ 
  variant = "full",
  className = ""
}: TrustRibbonProps) {
  
  if (variant === "compact") {
    return (
      <div className={`py-6 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 border-y border-primary/20 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span className="font-bold text-foreground">Geprüfte Firmen</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="font-bold text-foreground">4.7</span>
              <span className="text-muted-foreground text-sm">von 5</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {["TCS", "SRF", "NZZ"].map((name) => (
                <span key={name} className="font-semibold text-muted-foreground">{name}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`relative py-10 md:py-14 overflow-hidden ${className}`}>
      {/* Bold gradient background - creates visual "trust zone" */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/8 to-secondary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/50 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        {/* Main Trust Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 bg-card/90 backdrop-blur-sm border-2 border-primary/30 rounded-full px-6 py-3 mb-4 shadow-lg shadow-primary/10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-inner">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-foreground text-lg">Geprüfte Umzugsfirmen</h3>
              <p className="text-sm text-muted-foreground">Jeder Partner wird manuell verifiziert</p>
            </div>
          </div>
        </motion.div>

        {/* Trust Criteria Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-8">
          {trustCriteria.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 bg-card border border-border/80 rounded-full px-4 py-2 shadow-sm hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all"
              >
                <Icon className={`w-4 h-4 ${item.color}`} />
                <span className="font-medium text-foreground text-sm">{item.label}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              </motion.div>
            );
          })}
        </div>

        {/* Rating Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 mb-10"
        >
          <div className="flex items-center gap-2 bg-card rounded-full px-5 py-2.5 shadow-md border border-yellow-300/50">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-bold text-xl text-foreground">4.7</span>
            <span className="text-muted-foreground">von 5</span>
          </div>
          <span className="text-sm text-muted-foreground hidden sm:block">
            aus verifizierten Kundenbewertungen
          </span>
        </motion.div>

        {/* Media Logos - FULL COLOR, NOT MUTED */}
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-5">
            Bekannt aus Schweizer Medien
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
            {mediaLogos.map((logo, index) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="px-5 py-2.5 rounded-xl bg-card border-2 shadow-sm hover:shadow-lg transition-all cursor-default"
                style={{ 
                  borderColor: `${logo.color}40`,
                  background: `linear-gradient(135deg, ${logo.color}08, white)`
                }}
              >
                <span 
                  className="font-bold text-base md:text-lg"
                  style={{ color: logo.color }}
                >
                  {logo.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
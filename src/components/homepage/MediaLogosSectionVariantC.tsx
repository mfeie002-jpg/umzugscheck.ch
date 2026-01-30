/**
 * MediaLogosSection VARIANT C - Trust Hierarchy (Schweizer Pyramide)
 * 
 * VERSION 3: Authority → Logic → Emotion flow
 * - Row 1: Branchen-Standards (ASTAG, Swiss Label) - Authority
 * - Row 2: Sicherheit (Versicherung, Handelsregister) - Logic
 * - Row 3: Rating summary - Emotion
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Truck, Building2, Award, CheckCircle2 } from "lucide-react";
import { TRUST } from "@/content/trust";

// Authority tier - Branchen-Standards
const authoritySeals = [
  {
    id: "astag",
    name: "ASTAG",
    label: "Verbandsmitglied",
    Icon: Truck,
    iconColor: "text-primary",
    description: "Der TÜV der Umzugsbranche",
  },
  {
    id: "swisslabel",
    name: "Swiss Label",
    label: "Armbrust-Zertifiziert",
    Icon: Award,
    iconColor: "text-[#D52B1E]",
    description: "Schweizer Qualitätsstandard",
  },
];

// Logic tier - Sicherheit & Verifizierung
const securitySeals = [
  {
    id: "versicherung",
    name: "Versichert",
    label: "Bis CHF 2 Mio.",
    Icon: Shield,
    iconColor: "text-[#E2001A]",
  },
  {
    id: "handelsregister",
    name: "Handelsregister",
    label: "Geprüfte Firmen",
    Icon: Building2,
    iconColor: "text-foreground",
  },
  {
    id: "verifiziert",
    name: TRUST.companiesCount,
    label: TRUST.companiesLabel,
    Icon: CheckCircle2,
    iconColor: "text-primary",
  },
];

export const MediaLogosSectionVariantC = memo(function MediaLogosSectionVariantC() {
  return (
    <section className="py-6 md:py-10 bg-muted/20 dark:bg-muted/30 border-y border-border/30">
      <div className="container max-w-5xl px-4">
        
        {/* ROW 1: AUTHORITY - Branchen-Standards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
            Schweizer Branchen-Standards
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {authoritySeals.map((seal) => (
              <div
                key={seal.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border/50 
                           hover:border-border hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center
                                group-hover:bg-primary/10 transition-colors`}>
                  <seal.Icon className={`w-5 h-5 ${seal.iconColor}`} />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-foreground block">{seal.name}</span>
                  <span className="text-[10px] text-muted-foreground">{seal.label}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Divider */}
        <div className="w-20 h-px bg-border mx-auto mb-6" />
        
        {/* ROW 2: SECURITY - Logic tier */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-6"
        >
          {securitySeals.map((seal) => (
            <div
              key={seal.id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border/50 
                         hover:border-border hover:shadow-sm transition-all"
            >
              <seal.Icon className={`w-4 h-4 ${seal.iconColor}`} />
              <div className="text-left">
                <span className="text-xs font-semibold text-foreground block leading-tight">{seal.name}</span>
                <span className="text-[10px] text-muted-foreground">{seal.label}</span>
              </div>
            </div>
          ))}
        </motion.div>
        
        {/* ROW 3: RATING - Emotion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-sm">
            <strong className="text-foreground">{TRUST.ratingDisplay}</strong>
            <span className="text-muted-foreground ml-1">aus {TRUST.ratingCount.toLocaleString('de-CH')} Bewertungen</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
});

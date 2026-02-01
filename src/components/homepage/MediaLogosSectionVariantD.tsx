/**
 * MediaLogosSection VARIANT D - Trust Pills (Schweizer Kompakt)
 * 
 * VERSION 4: Pill-based compact layout
 * - Nur verifizierbare Schweizer Trust-Siegel
 * - Single row, horizontal scroll on mobile
 * - Maximum density, minimum space
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Truck, CheckCircle2, Award, CreditCard } from "lucide-react";
import { TRUST } from "@/content/trust";

// Swiss Trust pills - prioritized by Swiss authority
const trustPills = [
  {
    id: "astag",
    icon: Truck,
    text: "ASTAG Mitglied",
    subtext: "Verbandsmitglied",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "versichert",
    icon: Shield,
    text: "Bis CHF 2 Mio.",
    subtext: "Versichert",
    color: "text-[#E2001A]",
    bgColor: "bg-[#E2001A]/10",
  },
  {
    id: "swisslabel",
    icon: Award,
    text: "Swiss Label",
    subtext: "Armbrust",
    color: "text-[#D52B1E]",
    bgColor: "bg-[#D52B1E]/10",
  },
  {
    id: "firmen",
    icon: CheckCircle2,
    text: TRUST.companiesCount,
    subtext: "Geprüfte Firmen",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "twint",
    icon: CreditCard,
    text: "TWINT",
    subtext: "& Karte",
    color: "text-[#00A0E4]",
    bgColor: "bg-[#00A0E4]/10",
  },
  {
    id: "rating",
    icon: Star,
    text: TRUST.ratingDisplay,
    subtext: `${TRUST.ratingCount.toLocaleString('de-CH')} Reviews`,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

export const MediaLogosSectionVariantD = memo(function MediaLogosSectionVariantD() {
  return (
    <section className="py-4 md:py-5 bg-muted/20 border-y border-border/30">
      <div className="container px-4">
        
        {/* Header */}
        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
          Schweizer Qualität & Sicherheit
        </p>
        
        {/* SINGLE ROW - Scrollable on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-start md:justify-center gap-2 md:gap-3 
                     overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {trustPills.map((pill, index) => (
            <motion.div
              key={pill.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-full ${pill.bgColor} 
                         border border-border/30 whitespace-nowrap flex-shrink-0
                         hover:scale-105 transition-transform cursor-default`}
            >
              <pill.icon className={`w-4 h-4 ${pill.color}`} />
              <div className="flex flex-col leading-none">
                {pill.subtext && (
                  <span className="text-[9px] text-muted-foreground">{pill.subtext}</span>
                )}
                <span className={`text-xs font-semibold ${pill.id === 'rating' ? 'text-foreground' : pill.color}`}>
                  {pill.text}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

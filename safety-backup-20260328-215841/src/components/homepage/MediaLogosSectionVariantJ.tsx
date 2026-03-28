/**
 * MediaLogosSection VARIANT J - "Trust Ecosystem"
 * 
 * VERSION 10: Comprehensive trust grid with categories
 * Based on feedback: "TrustEcosystemSection" - 6 categories
 * 
 * Categories:
 * - official: State/government links
 * - payments: Payment methods
 * - insurance: Risk coverage
 * - security: Data/privacy
 * - associations: Industry bodies
 * - quality: Quality standards
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Building2,
  CreditCard,
  Shield,
  Lock,
  Award,
  BadgeCheck,
  Star,
  ExternalLink
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { TRUST } from "@/content/trust";

type TrustCategory = "official" | "payments" | "insurance" | "security" | "associations" | "quality";

interface TrustItem {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: TrustCategory;
  color: string;
  url?: string;
}

const trustItems: TrustItem[] = [
  // Official
  {
    id: "eumzug",
    name: "eUmzugCH",
    description: "Offizielle Umzugsmeldung",
    icon: Building2,
    category: "official",
    color: "text-red-600",
    url: "https://www.eumzug.swiss",
  },
  {
    id: "post",
    name: "Die Post",
    description: "Nachsendeauftrag",
    icon: Building2,
    category: "official",
    color: "text-yellow-600",
    url: "https://www.post.ch",
  },
  // Security
  {
    id: "swiss-hosting",
    name: "Swiss Hosting",
    description: "Daten in CH",
    icon: Lock,
    category: "security",
    color: "text-emerald-600",
  },
  {
    id: "ndsg",
    name: "nDSG konform",
    description: "Datenschutz",
    icon: Shield,
    category: "security",
    color: "text-primary",
  },
  // Insurance
  {
    id: "versicherung",
    name: "Versichert",
    description: "Haftpflicht geprüft",
    icon: Shield,
    category: "insurance",
    color: "text-[#E2001A]",
  },
  // Payments
  {
    id: "twint",
    name: "TWINT",
    description: "Swiss Payment",
    icon: CreditCard,
    category: "payments",
    color: "text-primary",
  },
  // Associations
  {
    id: "astag",
    name: "ASTAG",
    description: "Branchenverband",
    icon: Award,
    category: "associations",
    color: "text-blue-600",
    url: "https://www.astag.ch",
  },
  // Quality
  {
    id: "swissmade",
    name: "Swiss Made",
    description: "Software aus CH",
    icon: BadgeCheck,
    category: "quality",
    color: "text-primary",
  },
];

const categoryLabels: Record<TrustCategory, string> = {
  official: "Behörden",
  payments: "Zahlung",
  insurance: "Versicherung",
  security: "Sicherheit",
  associations: "Verbände",
  quality: "Qualität",
};

export const MediaLogosSectionVariantJ = memo(function MediaLogosSectionVariantJ() {
  return (
    <section className="py-8 md:py-10 bg-gradient-to-b from-muted/30 to-background border-b border-border/30">
      <div className="container max-w-5xl px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Verankert in Schweizer Infrastruktur
          </h3>
          <p className="text-xs text-muted-foreground">
            Kompatibel dort, wo es Sinn macht: Prozesse, Zahlung und Datensicherheit
          </p>
        </motion.div>

        {/* Trust Grid - 2 rows on mobile, flexible on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-3"
        >
          {trustItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.03 * index }}
              className="group"
            >
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center p-2 rounded-lg bg-card border border-border/50
                            hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className={`w-7 h-7 rounded-full bg-muted flex items-center justify-center mb-1.5
                                  group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <span className="text-[10px] font-medium text-center leading-tight">{item.name}</span>
                  <span className="text-[8px] text-muted-foreground text-center hidden md:block">{item.description}</span>
                </a>
              ) : (
                <div className="flex flex-col items-center p-2 rounded-lg bg-card border border-border/50
                               hover:border-primary/30 hover:shadow-sm transition-all cursor-default">
                  <div className={`w-7 h-7 rounded-full bg-muted flex items-center justify-center mb-1.5
                                  group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                  </div>
                  <span className="text-[10px] font-medium text-center leading-tight">{item.name}</span>
                  <span className="text-[8px] text-muted-foreground text-center hidden md:block">{item.description}</span>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Rating Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-border/30"
        >
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(TRUST.ratingValue) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                />
              ))}
            </div>
            <span className="font-bold">{TRUST.ratingDisplay}</span>
            <span className="text-xs text-muted-foreground">({TRUST.ratingCount.toLocaleString()} Bewertungen)</span>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <p className="text-center text-[10px] text-muted-foreground mt-3">
          Hinweis: Logos nur bei belegbarer Partnerschaft oder Integration.
        </p>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantJ;

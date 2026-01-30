import { memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Star, Shield, Building2, CreditCard, CheckCircle2 } from "lucide-react";
import { SWISS_MEDIA_PARTNERS, ColoredMediaLogo } from "@/components/trust/media-logos";

// Tier 1: Quality & Association Badges (Verbände & Qualität)
const qualityBadges = [
  { 
    name: "ASTAG Mitglied", 
    description: "Branchenverband",
    icon: "🚚",
    color: "text-primary"
  },
  { 
    name: "Konsumentenschutz", 
    description: "Geprüft",
    icon: "🛡️",
    color: "text-green-600"
  },
  { 
    name: "Versichert", 
    description: "Bis CHF 2 Mio.",
    icon: "✓",
    color: "text-blue-600"
  },
];

// Tier 2: Trust & Convenience Badges
const trustBadges = [
  { 
    name: "Handelsregister", 
    description: "Geprüfte Firmen",
    Icon: Building2,
    color: "text-foreground"
  },
  { 
    name: "4.8/5 Sterne", 
    description: "2'847 Bewertungen",
    Icon: Star,
    color: "text-amber-500"
  },
  { 
    name: "TWINT & Karte", 
    description: "Bequem bezahlen",
    Icon: CreditCard,
    color: "text-primary"
  },
];

export const MediaLogosSection = memo(function MediaLogosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.3], [20, 0]);

  return (
    <section 
      ref={sectionRef} 
      className="py-8 md:py-12 bg-gradient-to-b from-muted/50 via-background to-muted/30 border-y border-border/50 overflow-hidden relative"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
      
      <motion.div 
        className="container relative max-w-6xl"
        style={{ opacity, y }}
      >
        {/* Section Header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span className="text-xs md:text-sm font-semibold text-primary uppercase tracking-wide">
              Bekannt aus & geprüft von
            </span>
          </div>
        </motion.div>

        {/* Row 1: Media Logos - Grayscale with hover color */}
        <div className="mb-6">
          <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
            Bekannt aus Schweizer Medien
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {SWISS_MEDIA_PARTNERS.map((partner, index) => (
              <motion.a
                key={partner.name}
                href={`https://www.${partner.website}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.08 }}
                className="p-2.5 md:p-3 rounded-lg bg-card/60 hover:bg-card border border-transparent hover:border-border/50 
                           grayscale hover:grayscale-0 opacity-70 hover:opacity-100
                           transition-all duration-300 cursor-pointer group"
                title={partner.name}
              >
                <ColoredMediaLogo name={partner.name} size="sm" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-border/60" />
          <Shield className="w-4 h-4 text-muted-foreground/50" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-border/60" />
        </div>

        {/* Row 2: Quality & Trust Badges - Two sub-rows on mobile */}
        <div className="space-y-4">
          {/* Tier 1: Verbände & Qualität */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {qualityBadges.map((badge, index) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + index * 0.08 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full 
                           bg-card border border-border/60 hover:border-primary/30 
                           shadow-sm hover:shadow-md transition-all duration-300"
              >
                <span className="text-base md:text-lg">{badge.icon}</span>
                <div className="flex flex-col leading-none">
                  <span className="text-xs md:text-sm font-semibold text-foreground">{badge.name}</span>
                  <span className="text-[9px] md:text-[10px] text-muted-foreground">{badge.description}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tier 2: Trust & Convenience */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.08 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-full 
                           bg-muted/50 border border-border/40 hover:border-primary/20 
                           hover:bg-card transition-all duration-300"
              >
                <badge.Icon className={`w-4 h-4 ${badge.color}`} />
                <div className="flex flex-col leading-none">
                  <span className="text-xs md:text-sm font-medium text-foreground">{badge.name}</span>
                  <span className="text-[9px] md:text-[10px] text-muted-foreground">{badge.description}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Trust Statement */}
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">200+ geprüfte Umzugsfirmen</span>
            {" "}• Alle Partner im Handelsregister eingetragen • Schweizer Datenschutz
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
});

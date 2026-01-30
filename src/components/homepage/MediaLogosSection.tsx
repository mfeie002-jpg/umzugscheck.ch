import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Building2, Shield, Truck, Award, CreditCard } from "lucide-react";
import { TRUST } from "@/content/trust";

/**
 * Trust Bar - Mobile First Design (Schweizer Trust-Strategie)
 * 
 * Hierarchie nach Schweizer Vertrauens-Währung:
 * 1. ASTAG (Branchen-Standard) - Der "TÜV" der Umzugsbranche
 * 2. Versicherung (Mobiliar) - Finanzielle Sicherheit
 * 3. Swiss Label (Armbrust) - Ultimate Swissness
 * 4. Handelsregister - Lokale Verankerung
 * 5. TWINT - Modern & Schweizerisch
 * 6. Rating - Social Proof
 * 
 * Layout: 2-Spalten Grid auf Mobile, Flexbox auf Desktop
 * Keine Slider/Karussells – Trust muss statisch sein
 */

// Die 6 Kern-Vertrauenselemente nach Schweizer Trust-Strategie
const trustElements = [
  {
    id: "astag",
    name: "ASTAG",
    label: "Verbandsmitglied",
    Icon: Truck,
    // ASTAG Blau - Primär
    iconColor: "group-hover:text-primary",
    bgColor: "group-hover:bg-primary/10",
    priority: 1,
  },
  {
    id: "versicherung",
    name: "Die Mobiliar",
    label: "Bis CHF 2 Mio. versichert",
    Icon: Shield,
    // Mobiliar Rot: #E2001A
    iconColor: "group-hover:text-[#E2001A]",
    bgColor: "group-hover:bg-[#E2001A]/10",
    priority: 2,
  },
  {
    id: "swisslabel",
    name: "Swiss Label",
    label: "Schweizer Qualität",
    Icon: Award,
    // Armbrust Rot
    iconColor: "group-hover:text-[#D52B1E]",
    bgColor: "group-hover:bg-[#D52B1E]/10",
    priority: 3,
  },
  {
    id: "handelsregister",
    name: "Handelsregister",
    label: "Geprüfte Firmen",
    Icon: Building2,
    // Neutral/Schwarz
    iconColor: "group-hover:text-foreground",
    bgColor: "group-hover:bg-muted",
    priority: 4,
  },
];

// Bottom Row: TWINT + Rating (Modern & Social Proof)
const BottomTrustRow = memo(function BottomTrustRow() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className="flex flex-wrap items-center justify-center gap-4 md:gap-6"
    >
      {/* TWINT Badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-full 
                      bg-card border border-border/50 
                      hover:border-[#00A0E4]/50 transition-all duration-300 cursor-default group">
        <div className="w-5 h-5 rounded bg-gray-400 group-hover:bg-[#00A0E4]
                        flex items-center justify-center transition-colors duration-300">
          <CreditCard className="w-3 h-3 text-white" />
        </div>
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          TWINT & Karte
        </span>
      </div>

      {/* Rating Badge */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-full 
                      bg-card border border-border/50
                      hover:border-amber-400/50 transition-all duration-300 cursor-default group">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className="w-3 h-3 fill-gray-300 text-gray-300 
                         group-hover:fill-amber-400 group-hover:text-amber-400 
                         transition-colors duration-300" 
            />
          ))}
        </div>
        <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          {TRUST.ratingValue}/5 ({TRUST.ratingCount.toLocaleString('de-CH')} Bewertungen)
        </span>
      </div>
    </motion.div>
  );
});

export const MediaLogosSection = memo(function MediaLogosSection() {
  return (
    <section className="py-5 md:py-8 bg-muted/20 dark:bg-muted/30 border-y border-border/30">
      <div className="container max-w-4xl px-4">
        {/* Header - klein und dezent */}
        <p className="text-center text-[10px] md:text-xs text-muted-foreground uppercase tracking-widest mb-4 md:mb-6">
          Schweizer Qualität & Sicherheit garantiert durch:
        </p>

        {/* 2-Spalten Grid Mobile / 4-Spalten Flexbox Desktop */}
        <div className="grid grid-cols-2 md:flex md:flex-row md:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          {trustElements.map((element, index) => (
            <motion.div
              key={element.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group flex flex-col items-center text-center p-3 md:p-4 
                         rounded-xl bg-card border border-border/40
                         hover:border-border hover:shadow-sm
                         transition-all duration-300 cursor-default
                         md:flex-1"
            >
              {/* Icon Container - Grayscale → Farbig bei Hover */}
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full 
                              flex items-center justify-center mb-2
                              bg-muted ${element.bgColor}
                              transition-colors duration-300`}>
                <element.Icon 
                  className={`w-5 h-5 md:w-6 md:h-6 
                             text-muted-foreground ${element.iconColor}
                             transition-colors duration-300`} 
                />
              </div>
              
              {/* Name */}
              <span className="text-xs md:text-sm font-semibold text-foreground mb-0.5">
                {element.name}
              </span>
              
              {/* Micro-Label */}
              <span className="text-[10px] md:text-xs text-muted-foreground leading-tight">
                {element.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Bottom Row: TWINT + Rating */}
        <BottomTrustRow />
      </div>
    </section>
  );
});

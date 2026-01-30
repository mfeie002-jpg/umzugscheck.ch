import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Building2, Shield, Truck } from "lucide-react";

/**
 * Trust Bar - Mobile First Design
 * 
 * Ziel: "Sofortige Beruhigung" ohne Scrollen
 * Layout: 2-Spalten Grid auf Mobile, Flexbox auf Desktop
 * Logos: Grayscale → Farbig bei Hover (Premium-Look)
 * Keine Slider/Karussells – Trust muss statisch sein
 */

// Die 4 Kern-Vertrauenselemente für Schweizer Umzugskunden
const trustElements = [
  {
    id: "versicherung",
    name: "Die Mobiliar",
    label: "Bis CHF 2 Mio. versichert",
    Icon: Shield,
    // Mobiliar Rot: #E2001A
    iconColor: "group-hover:text-[#E2001A]",
    bgColor: "group-hover:bg-[#E2001A]/10",
  },
  {
    id: "astag",
    name: "ASTAG",
    label: "Verbandsmitglied",
    Icon: Truck,
    // ASTAG Blau
    iconColor: "group-hover:text-primary",
    bgColor: "group-hover:bg-primary/10",
  },
  {
    id: "handelsregister",
    name: "Handelsregister",
    label: "Eingetragen ZH",
    Icon: Building2,
    // Neutral/Schwarz
    iconColor: "group-hover:text-foreground",
    bgColor: "group-hover:bg-muted",
  },
  {
    id: "google",
    name: "Google",
    label: "4.9 ★ (150+ Kunden)",
    Icon: Star,
    // Google Gelb
    iconColor: "group-hover:text-amber-500",
    bgColor: "group-hover:bg-amber-500/10",
  },
];

// TWINT Badge (optional, unten zentriert)
const TwintBadge = memo(function TwintBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className="flex items-center justify-center gap-2 px-4 py-2 rounded-full 
                 bg-card border border-border/50 
                 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer group"
    >
      {/* TWINT Logo simplified */}
      <div className="w-5 h-5 rounded bg-[#00A0E4] group-hover:bg-[#00A0E4] bg-gray-400 
                      flex items-center justify-center transition-colors duration-300">
        <span className="text-white text-[10px] font-bold">T</span>
      </div>
      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
        TWINT & Karte akzeptiert
      </span>
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
                         rounded-xl bg-white dark:bg-card border border-border/40
                         hover:border-border hover:shadow-sm
                         transition-all duration-300 cursor-default
                         md:flex-1"
            >
              {/* Icon Container - Grayscale → Farbig bei Hover */}
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full 
                              flex items-center justify-center mb-2
                              bg-gray-100 dark:bg-muted ${element.bgColor}
                              transition-colors duration-300`}>
                <element.Icon 
                  className={`w-5 h-5 md:w-6 md:h-6 
                             text-gray-400 ${element.iconColor}
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

        {/* TWINT Badge - zentriert unten */}
        <div className="flex justify-center">
          <TwintBadge />
        </div>
      </div>
    </section>
  );
});

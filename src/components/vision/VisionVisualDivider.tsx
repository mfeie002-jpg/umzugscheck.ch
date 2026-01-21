/**
 * VisionVisualDivider - Image-based section divider
 * Adds visual breaks with emotional photography
 */

import { memo } from "react";
import { motion } from "framer-motion";
import type { VisionLanguage } from "@/lib/vision-translations";

// Import section-specific images
import heroFamilyNewHome from "@/assets/vision/hero-family-new-home.jpg";
import heroMovingSwitzerland from "@/assets/vision/hero-moving-switzerland.jpg";
import heroInvestorMeeting from "@/assets/vision/hero-investor-meeting.jpg";

interface VisionVisualDividerProps {
  language: VisionLanguage;
  variant?: 'family' | 'business' | 'journey';
  quote?: string;
}

const quotes = {
  de: {
    family: "Ein neues Zuhause, ein neuer Anfang.",
    business: "Wo Innovation auf Tradition trifft.",
    journey: "Die Reise beginnt mit dem ersten Schritt."
  },
  bg: {
    family: "Нов дом, ново начало.",
    business: "Където иновацията среща традицията.",
    journey: "Пътуването започва с първата стъпка."
  },
  it: {
    family: "Una nuova casa, un nuovo inizio.",
    business: "Dove l'innovazione incontra la tradizione.",
    journey: "Il viaggio inizia con il primo passo."
  }
};

const images = {
  family: heroFamilyNewHome,
  business: heroInvestorMeeting,
  journey: heroMovingSwitzerland
};

export const VisionVisualDivider = memo(({ 
  language, 
  variant = 'journey',
  quote 
}: VisionVisualDividerProps) => {
  const t = quotes[language] || quotes.de;
  const displayQuote = quote || t[variant];
  const image = images[variant];
  
  return (
    <section className="relative h-48 md:h-64 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
      </div>
      
      {/* Quote */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl lg:text-3xl font-bold text-white text-center max-w-3xl italic drop-shadow-lg"
        >
          "{displayQuote}"
        </motion.blockquote>
      </div>
    </section>
  );
});

VisionVisualDivider.displayName = 'VisionVisualDivider';

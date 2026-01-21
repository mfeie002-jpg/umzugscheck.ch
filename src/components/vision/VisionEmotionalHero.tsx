/**
 * Aspirational Hero Section
 * Win-Win-Win positioning: simple, transparent, fair
 * We will become #1 - not we are #1
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Globe, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionEmotionalHeroProps {
  language: VisionLanguage;
  variant?: 'family' | 'investor' | 'full';
}

const content = {
  de: {
    badge: "🇨🇭 Made in Switzerland",
    
    headline: {
      family: "Umziehen war noch nie so einfach",
      investor: "Die Zukunft des Umzugsmarktes – 10 Umsatzströme",
      full: "Wir werden die Nr. 1 in der Schweiz"
    },
    
    subheadline: {
      family: "Während andere noch Telefonnummern googeln, haben unsere Kunden schon 5 Offerten. Transparent, fair, stressfrei.",
      investor: "10 Revenue Streams. 95% Automatisierung. Win-Win-Win für Kunden, Firmen und uns. Das ist die Zukunft.",
      full: "Wir haben einen fragmentierten, stressigen Prozess revolutioniert. Faire Preise, echte Bewertungen, ein Ökosystem."
    },
    
    stats: [
      { value: "Weltweit", label: "Einzigartig" },
      { value: "95%", label: "KI-Automatisiert" },
      { value: "10×", label: "Revenue Streams" }
    ],
    
    cta: {
      primary: "Unsere Vision entdecken",
      secondary: "Technologie ansehen"
    },
    
    tagline: "Win-Win-Win für alle Beteiligten"
  },
  bg: {
    badge: "🇨🇭 Made in Switzerland",
    
    headline: {
      family: "Преместването никога не е било толкова лесно",
      investor: "Бъдещето на пазара – 10 потока приходи",
      full: "Ще станем №1 в Швейцария"
    },
    
    subheadline: {
      family: "Докато другите търсят телефонни номера, нашите клиенти вече имат 5 оферти. Прозрачно, честно, без стрес.",
      investor: "10 потока приходи. 95% автоматизация. Win-Win-Win за клиенти, фирми и нас. Това е бъдещето.",
      full: "Революционизирахме един фрагментиран, стресиращ процес. Честни цени, истински отзиви, една екосистема."
    },
    
    stats: [
      { value: "Световен", label: "Уникат" },
      { value: "95%", label: "AI-автоматизирано" },
      { value: "10×", label: "Потоци приходи" }
    ],
    
    cta: {
      primary: "Открийте нашата визия",
      secondary: "Технология"
    },
    
    tagline: "Win-Win-Win за всички участници"
  },
  it: {
    badge: "🇨🇭 Made in Switzerland",
    
    headline: {
      family: "Traslocare non è mai stato così semplice",
      investor: "Il futuro del mercato – 10 flussi di ricavo",
      full: "Diventeremo il #1 in Svizzera"
    },
    
    subheadline: {
      family: "Mentre altri cercano ancora numeri di telefono, i nostri clienti hanno già 5 preventivi. Trasparente, equo, senza stress.",
      investor: "10 flussi di ricavo. 95% automazione. Win-Win-Win per clienti, aziende e noi. Questo è il futuro.",
      full: "Abbiamo rivoluzionato un processo frammentato e stressante. Prezzi equi, recensioni vere, un ecosistema."
    },
    
    stats: [
      { value: "Mondiale", label: "Unico" },
      { value: "95%", label: "Automatizzato AI" },
      { value: "10×", label: "Flussi di Ricavo" }
    ],
    
    cta: {
      primary: "Scopri la nostra visione",
      secondary: "Vedi tecnologia"
    },
    
    tagline: "Win-Win-Win per tutti i partecipanti"
  }
};

// Professional business images
const heroImages = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80", // Modern skyscraper
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80", // Modern office
  "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=1200&q=80", // City skyline
];

export const VisionEmotionalHero = memo(({ language, variant = 'full' }: VisionEmotionalHeroProps) => {
  const t = content[language] || content.de;
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/5">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImages[0]}
          alt=""
          className="w-full h-full object-cover opacity-20"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
      </div>
      
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-28 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-black mb-6 shadow-lg">
              <Globe className="w-4 h-4" />
              {t.badge}
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight"
          >
            {t.headline[variant]}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto"
          >
            {t.subheadline[variant]}
          </motion.p>
          
          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-3 gap-4 mb-10 max-w-xl mx-auto"
          >
            {t.stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center p-4 rounded-2xl bg-card/80 backdrop-blur-sm border-2 border-primary/20 shadow-lg"
              >
                <p className="text-2xl md:text-3xl font-black text-primary">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
          
          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Link to="/vision#vision-customer-usps">
              <Button size="lg" className="w-full sm:w-auto min-h-[52px] text-base font-bold px-8 group shadow-xl">
                <Sparkles className="w-5 h-5 mr-2" />
                {t.cta.primary}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[52px] text-base font-bold px-8 border-2">
                <Zap className="w-5 h-5 mr-2" />
                {t.cta.secondary}
              </Button>
            </Link>
          </motion.div>
          
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-center gap-2 text-sm font-bold text-primary"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>{t.tagline}</span>
            <Heart className="w-4 h-4 fill-current" />
          </motion.div>
          
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
});

VisionEmotionalHero.displayName = 'VisionEmotionalHero';

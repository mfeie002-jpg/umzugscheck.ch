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
    badge: "🇨🇭 Weltweit einzigartig",
    
    headline: {
      family: "Umziehen war noch nie so einfach",
      investor: "Das weltweit erste Full-Stack Umzugsportal",
      full: "Das weltweit erste Full-Stack Umzugsportal"
    },
    
    subheadline: {
      family: "Während andere noch Telefonnummern googeln, haben unsere Kunden schon 5 Offerten. Transparent, fair, stressfrei.",
      investor: "KI-Präzision. Escrow-Sicherheit. 10 Revenue Streams. Ein Ökosystem, das Umziehen in der Schweiz revolutioniert.",
      full: "KI-Präzision. Escrow-Sicherheit. Bürokratie-Autopilot. Ein Ökosystem, das Umziehen in der Schweiz revolutioniert."
    },
    
    // 3 Core promises
    promises: [
      "Stress weg",
      "Fairness rein", 
      "Kontrolle zurück"
    ],
    
    stats: [
      { value: "Weltweit", label: "Einzigartig" },
      { value: "95%", label: "KI-Automatisiert" },
      { value: "10×", label: "Revenue Streams" }
    ],
    
    cta: {
      primary: "Vision entdecken",
      secondary: "Live Demo"
    },
    
    tagline: "Win-Win-Win: Kunden sparen, Firmen wachsen, wir skalieren"
  },
  bg: {
    badge: "🇨🇭 Световен уникат",
    
    headline: {
      family: "Преместването никога не е било толкова лесно",
      investor: "Първият в света Full-Stack портал за преместване",
      full: "Първият в света Full-Stack портал за преместване"
    },
    
    subheadline: {
      family: "Докато другите търсят телефонни номера, нашите клиенти вече имат 5 оферти. Прозрачно, честно, без стрес.",
      investor: "AI прецизност. Escrow сигурност. 10 потока приходи. Екосистема, която революционизира преместването.",
      full: "AI прецизност. Escrow сигурност. Бюрократичен автопилот. Екосистема, която революционизира преместването."
    },
    
    promises: [
      "Без стрес",
      "Честност",
      "Контрол обратно"
    ],
    
    stats: [
      { value: "Световен", label: "Уникат" },
      { value: "95%", label: "AI-автоматизирано" },
      { value: "10×", label: "Потоци приходи" }
    ],
    
    cta: {
      primary: "Открий визията",
      secondary: "Live Demo"
    },
    
    tagline: "Win-Win-Win: Клиенти спестяват, фирми растат, ние скалираме"
  },
  it: {
    badge: "🇨🇭 Unico al mondo",
    
    headline: {
      family: "Traslocare non è mai stato così semplice",
      investor: "Il primo portale traslochi Full-Stack al mondo",
      full: "Il primo portale traslochi Full-Stack al mondo"
    },
    
    subheadline: {
      family: "Mentre altri cercano ancora numeri di telefono, i nostri clienti hanno già 5 preventivi. Trasparente, equo, senza stress.",
      investor: "Precisione AI. Sicurezza Escrow. 10 flussi di ricavo. Un ecosistema che rivoluziona i traslochi.",
      full: "Precisione AI. Sicurezza Escrow. Autopilota burocrazia. Un ecosistema che rivoluziona i traslochi."
    },
    
    promises: [
      "Via lo stress",
      "Dentro l'equità",
      "Riprendere il controllo"
    ],
    
    stats: [
      { value: "Mondiale", label: "Unico" },
      { value: "95%", label: "Automatizzato AI" },
      { value: "10×", label: "Flussi di Ricavo" }
    ],
    
    cta: {
      primary: "Scopri la visione",
      secondary: "Live Demo"
    },
    
    tagline: "Win-Win-Win: Clienti risparmiano, aziende crescono, noi scaliamo"
  }
};

// Real moving images - people actively moving, packing boxes, carrying furniture
const heroImages = {
  de: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=1400&q=90", // Couple carrying moving boxes
  bg: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1400&q=90", // Professional movers with boxes
  it: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1400&q=90", // Family moving day with boxes
  fallback: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=90", // Moving truck and boxes
};

export const VisionEmotionalHero = memo(({ language, variant = 'full' }: VisionEmotionalHeroProps) => {
  const t = content[language] || content.de;
  
  const currentImage = heroImages[language] || heroImages.fallback;
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/5">
      {/* Background with real emotional image - more visible */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentImage}
          alt="Happy family moving to their new home"
          className="w-full h-full object-cover opacity-40"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/80 to-background/70" />
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
            className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed max-w-3xl mx-auto"
          >
            {t.subheadline[variant]}
          </motion.p>
          
          {/* 3 Core Promises - The Feeling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex flex-wrap justify-center gap-3 mb-8"
          >
            {t.promises.map((promise, i) => (
              <span 
                key={i}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm border border-primary/20"
              >
                <span className="text-secondary">✓</span>
                {promise}
              </span>
            ))}
          </motion.div>
          
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

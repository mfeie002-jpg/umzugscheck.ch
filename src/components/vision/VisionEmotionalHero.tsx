/**
 * Emotional Hero Section
 * Celebrates the human side of moving - new beginnings, family moments
 * Uses stock photos + emotional messaging
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Heart, Sparkles, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionEmotionalHeroProps {
  language: VisionLanguage;
  variant?: 'family' | 'investor' | 'full';
}

const content = {
  de: {
    badge: "Neue Anfänge ✨",
    
    headline: {
      family: "Ein Umzug ist mehr als nur Kartons",
      investor: "450'000 neue Kapitel pro Jahr",
      full: "Wir helfen Menschen, neu anzufangen"
    },
    
    subheadline: {
      family: "Es ist der Beginn eines neuen Lebensabschnitts. Das erste Frühstück im neuen Zuhause. Der Moment, wenn die Kinder ihr neues Zimmer entdecken.",
      investor: "Jeder Umzug ist ein emotionaler Meilenstein – eine Hochzeit, ein neuer Job, ein grösseres Zuhause für die wachsende Familie.",
      full: "Jeder Umzug erzählt eine Geschichte. Wir machen diese Geschichten stressfrei und unvergesslich."
    },
    
    stats: [
      { value: "450k", label: "Umzüge/Jahr in CH" },
      { value: "85%", label: "positive Lebensveränderung" },
      { value: "#1", label: "Stressfaktor im Leben" }
    ],
    
    cta: {
      primary: "Unsere Mission entdecken",
      secondary: "So funktioniert's"
    },
    
    imageAlt: "Glückliche Familie beim Umzug in ihr neues Zuhause"
  },
  bg: {
    badge: "Нови начала ✨",
    
    headline: {
      family: "Преместването е повече от кашони",
      investor: "450'000 нови глави годишно",
      full: "Помагаме на хората да започнат отначало"
    },
    
    subheadline: {
      family: "Това е началото на нов етап от живота. Първата закуска в новия дом. Моментът, когато децата откриват новата си стая.",
      investor: "Всяко преместване е емоционален етап – сватба, нова работа, по-голям дом за растящото семейство.",
      full: "Всяко преместване разказва история. Ние правим тези истории безстресови и незабравими."
    },
    
    stats: [
      { value: "450k", label: "преместванията/год в CH" },
      { value: "85%", label: "положителна промяна в живота" },
      { value: "#1", label: "стрес фактор в живота" }
    ],
    
    cta: {
      primary: "Открийте нашата мисия",
      secondary: "Как работи"
    },
    
    imageAlt: "Щастливо семейство, което се мести в новия си дом"
  }
};

// High-quality Unsplash images of happy moving families
const heroImages = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80", // Modern home interior
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80", // Beautiful house exterior
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80", // Bright living room
];

const familyImages = [
  "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=800&q=80", // Family with boxes
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80", // Happy family home
  "https://images.unsplash.com/photo-1600573472591-ee6e7e3c7c8e?w=800&q=80", // Family moment
];

export const VisionEmotionalHero = memo(({ language, variant = 'full' }: VisionEmotionalHeroProps) => {
  const t = content[language];
  
  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImages[0]}
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-28 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-bold mb-6">
              <Heart className="w-4 h-4" />
              {t.badge}
            </span>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight">
              {t.headline[variant]}
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
              {t.subheadline[variant]}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {t.stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-center p-3 rounded-xl bg-card/80 backdrop-blur-sm border"
                >
                  <p className="text-xl md:text-2xl font-black text-primary">{stat.value}</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/vision#vision-customer-usps">
                <Button size="lg" className="w-full sm:w-auto min-h-[48px] group">
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t.cta.primary}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[48px]">
                  <Home className="w-4 h-4 mr-2" />
                  {t.cta.secondary}
                </Button>
              </Link>
            </div>
          </motion.div>
          
          {/* Right: Image Collage */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main image */}
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={familyImages[0]}
                  alt={t.imageAlt}
                  className="w-full h-80 object-cover"
                  loading="eager"
                />
              </div>
              
              {/* Floating smaller images */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -left-6 w-40 h-28 rounded-xl overflow-hidden shadow-xl border-4 border-background"
              >
                <img
                  src={familyImages[1]}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="absolute -top-4 -right-4 w-32 h-24 rounded-xl overflow-hidden shadow-xl border-4 border-background"
              >
                <img
                  src={familyImages[2]}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -z-10 bottom-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-2xl" />
            </div>
          </motion.div>
          
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
});

VisionEmotionalHero.displayName = 'VisionEmotionalHero';

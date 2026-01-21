/**
 * Vision Hero Section with Executive Summary
 * Aspirational tone: "We WILL become #1" + World-unique positioning
 * Clear mission + 3 Investor CTAs + Key Stats + Hero Image
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Play, FileText, Calendar, Rocket, 
  TrendingUp, Globe, DollarSign, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionHeroExecutiveProps {
  language: VisionLanguage;
  onDemoClick?: () => void;
  onPitchDeckClick?: () => void;
  onContactClick?: () => void;
}

const content = {
  de: {
    badge: "🇨🇭 Made in Switzerland",
    headline: "Umziehen in der Schweiz – endlich einfach.",
    subheadline: "Wir haben einen fragmentierten, stressigen Prozess in eine transparente Plattform verwandelt. Faire Preise, geprüfte Firmen, ein Klick – fertig.",
    
    // 3 CTAs
    ctas: {
      demo: "Demo ansehen",
      demoSub: "60 Sek. Video",
      pitchDeck: "Pitch Deck",
      pitchDeckSub: "PDF Download",
      contact: "Gespräch buchen",
      contactSub: "15 Min. Call"
    },
    
    // Key Stats (Value-focused)
    stats: [
      { value: "Weltweit", label: "Einzigartig", icon: Globe, color: "text-primary" },
      { value: "553 CHF", label: "Revenue/Kunde", icon: DollarSign, color: "text-primary" },
      { value: "95%", label: "KI-Automatisiert", icon: Sparkles, color: "text-primary" },
      { value: "10×", label: "Revenue Streams", icon: TrendingUp, color: "text-primary" }
    ],
    
    // What we built
    whyUnique: {
      title: "Was haben wir gebaut?",
      points: [
        "Eine Plattform, die Kunden, Firmen und Markt gleichzeitig gewinnen lässt",
        "Transparenz wo vorher Chaos war – faire Preise, echte Bewertungen",
        "10 Einnahmequellen in einem Ökosystem – weltweit einzigartig",
        "95% KI-Automatisierung – skaliert ohne proportionale Kosten"
      ]
    }
  },
  bg: {
    badge: "🇨🇭 Made in Switzerland",
    headline: "Преместване в Швейцария – най-накрая лесно.",
    subheadline: "Превърнахме фрагментиран, стресиращ процес в прозрачна платформа. Честни цени, проверени фирми, един клик – готово.",
    
    ctas: {
      demo: "Гледай демо",
      demoSub: "60 сек видео",
      pitchDeck: "Pitch Deck",
      pitchDeckSub: "PDF Download",
      contact: "Резервирай разговор",
      contactSub: "15 мин. call"
    },
    
    stats: [
      { value: "Световен", label: "Уникат", icon: Globe, color: "text-primary" },
      { value: "553 CHF", label: "Приход/клиент", icon: DollarSign, color: "text-primary" },
      { value: "95%", label: "AI автоматизирано", icon: Sparkles, color: "text-primary" },
      { value: "10×", label: "Източници на приходи", icon: TrendingUp, color: "text-primary" }
    ],
    
    whyUnique: {
      title: "Какво създадохме?",
      points: [
        "Платформа, която печели за клиенти, фирми и пазара едновременно",
        "Прозрачност там, където преди имаше хаос – честни цени, истински отзиви",
        "10 източника на приходи в една екосистема – световен уникат",
        "95% AI автоматизация – мащабира без пропорционални разходи"
      ]
    }
  },
  it: {
    badge: "🇨🇭 Made in Switzerland",
    headline: "Traslocare in Svizzera – finalmente semplice.",
    subheadline: "Abbiamo trasformato un processo frammentato e stressante in una piattaforma trasparente. Prezzi equi, aziende verificate, un click – fatto.",
    
    ctas: {
      demo: "Guarda demo",
      demoSub: "Video 60 sec",
      pitchDeck: "Pitch Deck",
      pitchDeckSub: "PDF Download",
      contact: "Prenota chiamata",
      contactSub: "15 min. call"
    },
    
    stats: [
      { value: "Mondiale", label: "Unico", icon: Globe, color: "text-primary" },
      { value: "553 CHF", label: "Revenue/Cliente", icon: DollarSign, color: "text-primary" },
      { value: "95%", label: "AI-Automatizzato", icon: Sparkles, color: "text-primary" },
      { value: "10×", label: "Flussi di Entrate", icon: TrendingUp, color: "text-primary" }
    ],
    
    whyUnique: {
      title: "Cosa abbiamo costruito?",
      points: [
        "Una piattaforma che fa vincere clienti, aziende e mercato contemporaneamente",
        "Trasparenza dove prima c'era caos – prezzi equi, recensioni vere",
        "10 flussi di entrate in un ecosistema – unico al mondo",
        "95% automazione AI – scala senza costi proporzionali"
      ]
    }
  }
};

export const VisionHeroExecutive = memo(({ 
  language, 
  onDemoClick,
  onPitchDeckClick,
  onContactClick 
}: VisionHeroExecutiveProps) => {
  const t = content[language] || content.de;
  
  return (
    <section id="vision-hero" className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          alt="Modern cityscape representing innovation"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70" />
        {/* Accent gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Badge className="bg-primary/20 text-white border-primary/30 text-sm px-4 py-2 backdrop-blur-sm">
              {t.badge}
            </Badge>
          </motion.div>
          
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight"
          >
            {t.headline}
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl"
          >
            {t.subheadline}
          </motion.p>
          
          {/* Key Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
          >
            {t.stats.map((stat, i) => (
              <div 
                key={i} 
                className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-center"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="text-xl sm:text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
          
          {/* 3 CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 mb-10"
          >
            <Button 
              size="lg" 
              onClick={onDemoClick}
              className="gap-2 min-h-[52px] bg-primary hover:bg-primary/90"
            >
              <Play className="w-4 h-4" />
              <div className="text-left">
                <div className="font-semibold">{t.ctas.demo}</div>
                <div className="text-xs opacity-80">{t.ctas.demoSub}</div>
              </div>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={onPitchDeckClick}
              className="gap-2 min-h-[52px] border-white/30 text-white hover:bg-white/10"
            >
              <FileText className="w-4 h-4" />
              <div className="text-left">
                <div className="font-semibold">{t.ctas.pitchDeck}</div>
                <div className="text-xs opacity-80">{t.ctas.pitchDeckSub}</div>
              </div>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              onClick={onContactClick}
              className="gap-2 min-h-[52px] border-white/30 text-white hover:bg-white/10"
            >
              <Calendar className="w-4 h-4" />
              <div className="text-left">
                <div className="font-semibold">{t.ctas.contact}</div>
                <div className="text-xs opacity-80">{t.ctas.contactSub}</div>
              </div>
            </Button>
          </motion.div>
          
          {/* Why Unique Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20"
          >
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white">
              <Globe className="w-5 h-5 text-primary" />
              {t.whyUnique.title}
            </h3>
            <ul className="grid gap-2 md:grid-cols-2">
              {t.whyUnique.points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                  <span className="text-primary mt-0.5 flex-shrink-0">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
});

VisionHeroExecutive.displayName = 'VisionHeroExecutive';

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

// Import the generated images
import visionFamilyMoving from "@/assets/vision-family-moving.jpg";
import visionHeroLoop from "@/assets/vision-hero-loop.mp4";

const content = {
  de: {
    badge: "🇨🇭 Made in Switzerland",
    // SWISS TRUST WORDING - Gemini Feedback: No "MOVU-Killer", no "dominieren"
    headline: "Das Betriebssystem für den Schweizer Umzug.",
    subheadline: "Umziehen, wie es in der Schweiz sein sollte: klar, sicher, digital. Faire Preise, geprüfte Partner, maximale Transparenz.",
    
    // Single primary CTA (Swiss clarity)
    ctaPrimary: "Offerten erhalten",
    ctaPrimarySub: "Kostenlos. Ohne Verpflichtung.",
    ctaSecondaryDemo: "Demo (60 Sek.)",
    ctaSecondaryDeck: "Pitch Deck (PDF)",
    ctaSecondaryCall: "Gespräch (15 Min.)",
    
    // Key Stats (Value-focused)
    stats: [
      { value: "Weltweit", label: "Einzigartig", icon: Globe, color: "text-primary" },
      { value: "553 CHF", label: "Revenue/Kunde", icon: DollarSign, color: "text-primary" },
      { value: "95%", label: "KI-Automatisiert", icon: Sparkles, color: "text-primary" },
      { value: "10×", label: "Revenue Streams", icon: TrendingUp, color: "text-primary" }
    ],
    
    // What we built - SWISS TRUST focus (no "killer", no "dominieren")
    whyUnique: {
      title: "Warum der neue Schweizer Standard?",
      subtitle: "Nicht einzelne Features – die KOMPLETTE Full-Stack-Kombi macht uns zur intelligenten Evolution des Marktes:",
      points: [
        { title: "«Invisible Move»", desc: "Kein Rechner, keine Formulare – KI übernimmt alles. Paradigmenwechsel statt Feature." },
        { title: "Video-Scan statt Hausbesuch", desc: "AI Video-Analyse als Single Source of Truth → Offerten in ~60 Sekunden." },
        { title: "Fintech-Layer (Treuhand)", desc: "Wir kontrollieren den Geldfluss. Trust, Float, Fees – Plattform statt Makler." },
        { title: "10 Revenue Streams gestapelt", desc: "Logistik + Telco + Cleaning + Insurance + SaaS + B2B HR – pro Kunde statt 1×." },
        { title: "Relocation-Autopilot", desc: "eGov-Schnittstellen, Adresswechsel, Provider – automatisiert, nicht nur Checkliste." },
        { title: "Micro-Insurance + Video-Beweis", desc: "Claims-Handling integriert. Versicherung, die wirklich zahlt." }
      ]
    }
  },
  bg: {
    badge: "🇨🇭 Made in Switzerland",
    headline: "Операционната система за швейцарско преместване.",
    subheadline: "Преместване, както трябва да бъде в Швейцария: ясно, сигурно, дигитално. Честни цени, проверени партньори, максимална прозрачност.",
    
    ctaPrimary: "Получи оферти",
    ctaPrimarySub: "Безплатно. Без ангажимент.",
    ctaSecondaryDemo: "Демо (60 сек.)",
    ctaSecondaryDeck: "Pitch Deck (PDF)",
    ctaSecondaryCall: "Разговор (15 мин.)",
    
    stats: [
      { value: "Световен", label: "Уникат", icon: Globe, color: "text-primary" },
      { value: "553 CHF", label: "Приход/клиент", icon: DollarSign, color: "text-primary" },
      { value: "95%", label: "AI автоматизирано", icon: Sparkles, color: "text-primary" },
      { value: "10×", label: "Източници на приходи", icon: TrendingUp, color: "text-primary" }
    ],
    
    whyUnique: {
      title: "Защо новият швейцарски стандарт?",
      subtitle: "Не отделни функции – ПЪЛНИЯТ Full-Stack ни прави интелигентната еволюция на пазара:",
      points: [
        { title: "«Invisible Move»", desc: "Без калкулатори, без формуляри – AI поема всичко. Смяна на парадигмата." },
        { title: "Видео скан вместо посещение", desc: "AI видео анализ като единствен източник → оферти за ~60 секунди." },
        { title: "Fintech слой (Escrow)", desc: "Контролираме паричния поток. Trust, Float, Fees – платформа, не посредник." },
        { title: "10 приходни потока", desc: "Логистика + Телеком + Почистване + Застраховка + SaaS + B2B HR – на клиент." },
        { title: "Relocation автопилот", desc: "eGov интерфейси, смяна на адрес – автоматизирано, не само чеклист." },
        { title: "Микро-застраховка + видео доказателство", desc: "Claims интегрирани. Застраховка, която наистина плаща." }
      ]
    }
  },
  it: {
    badge: "🇨🇭 Made in Switzerland",
    headline: "Il sistema operativo per il trasloco svizzero.",
    subheadline: "Traslocare come dovrebbe essere in Svizzera: chiaro, sicuro, digitale. Prezzi equi, partner verificati, massima trasparenza.",
    
    ctaPrimary: "Ricevi preventivi",
    ctaPrimarySub: "Gratis. Senza impegno.",
    ctaSecondaryDemo: "Demo (60 sec.)",
    ctaSecondaryDeck: "Pitch Deck (PDF)",
    ctaSecondaryCall: "Chiamata (15 min.)",
    
    stats: [
      { value: "Mondiale", label: "Unico", icon: Globe, color: "text-primary" },
      { value: "553 CHF", label: "Revenue/Cliente", icon: DollarSign, color: "text-primary" },
      { value: "95%", label: "AI-Automatizzato", icon: Sparkles, color: "text-primary" },
      { value: "10×", label: "Flussi di Entrate", icon: TrendingUp, color: "text-primary" }
    ],
    
    whyUnique: {
      title: "Perché il nuovo standard svizzero?",
      subtitle: "Non singole funzionalità – la COMPLETA combinazione Full-Stack ci rende l'evoluzione intelligente del mercato:",
      points: [
        { title: "«Invisible Move»", desc: "Niente calcolatori, niente moduli – l'AI fa tutto. Cambio di paradigma." },
        { title: "Video scan invece di visita", desc: "AI video analisi come unica fonte di verità → preventivi in ~60 secondi." },
        { title: "Layer Fintech (Escrow)", desc: "Controlliamo il flusso di denaro. Trust, Float, Fees – piattaforma, non broker." },
        { title: "10 flussi di entrate", desc: "Logistica + Telco + Pulizia + Assicurazione + SaaS + B2B HR – per cliente." },
        { title: "Autopilota Relocation", desc: "Interfacce eGov, cambio indirizzo – automatizzato, non solo checklist." },
        { title: "Micro-assicurazione + prova video", desc: "Claims integrati. Assicurazione che paga davvero." }
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
      {/* Hero Background Video (loop) + Image fallback */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={visionFamilyMoving}
          aria-label="Emotionaler Umzugsmoment"
        >
          <source src={visionHeroLoop} type="video/mp4" />
        </video>
        {/* Readability overlay using tokens */}
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/15 via-transparent to-transparent" />
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
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight"
          >
            {t.headline}
          </motion.h1>
          
          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl"
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
                className="p-4 rounded-xl bg-card/80 backdrop-blur-sm border border-border text-center"
              >
                <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                <div className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
          
          {/* Single primary CTA + secondary links (no "tab" look) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-3 mb-10"
          >
            <Button 
              size="lg" 
              asChild
              className="gap-2 min-h-[52px] bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <a href="/umzugsofferten">
                <Rocket className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-semibold">{t.ctaPrimary}</div>
                  <div className="text-xs opacity-80">{t.ctaPrimarySub}</div>
                </div>
              </a>
            </Button>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <button
                type="button"
                onClick={onDemoClick}
                className="inline-flex items-center gap-2 text-primary hover:underline underline-offset-4"
              >
                <Play className="w-4 h-4" />
                {t.ctaSecondaryDemo}
              </button>
              <button
                type="button"
                onClick={onPitchDeckClick}
                className="inline-flex items-center gap-2 text-primary hover:underline underline-offset-4"
              >
                <FileText className="w-4 h-4" />
                {t.ctaSecondaryDeck}
              </button>
              <button
                type="button"
                onClick={onContactClick}
                className="inline-flex items-center gap-2 text-primary hover:underline underline-offset-4"
              >
                <Calendar className="w-4 h-4" />
                {t.ctaSecondaryCall}
              </button>
            </div>
          </motion.div>
          
          {/* Why Unique Box - Full Stack Differentiation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card/80 backdrop-blur-md rounded-xl p-5 border border-border"
          >
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-white">
              <Globe className="w-5 h-5 text-primary" />
              {t.whyUnique.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{t.whyUnique.subtitle}</p>
            <ul className="grid gap-3 md:grid-cols-2">
              {t.whyUnique.points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5 flex-shrink-0 font-bold">✓</span>
                  <div>
                    <span className="font-semibold text-foreground">{point.title}:</span>{' '}
                    <span className="text-muted-foreground">{point.desc}</span>
                  </div>
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

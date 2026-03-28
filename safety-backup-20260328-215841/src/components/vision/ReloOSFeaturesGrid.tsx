/**
 * ReloOS Features Grid - Technical differentiators
 * Shows AI Video Scan, Smart Escrow, GPS Tracking, Swiss Handover
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Shield, 
  Truck, 
  FileCheck,
  Brain,
  Smartphone,
  CreditCard,
  Award,
  Zap,
  Target
} from 'lucide-react';
import type { VisionLanguage } from '@/lib/vision-translations';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  tech: string;
  impact: string;
}

const translations: Record<VisionLanguage, {
  badge: string;
  title: string;
  subtitle: string;
  features: Feature[];
}> = {
  de: {
    badge: "Technologie",
    title: "Was uns einzigartig macht",
    subtitle: "Schweizweit einzigartige Technologie-Integration",
    features: [
      {
        icon: <Video className="w-6 h-6" />,
        title: "AI Video Scan",
        description: "LiDAR-Tiefenerfassung erstellt einen Digital Twin. Einfach Video hochladen – AI erkennt alle Möbel automatisch.",
        tech: "Google Vision + LiDAR",
        impact: "95% genauer als manuelle Eingabe"
      },
      {
        icon: <Brain className="w-6 h-6" />,
        title: "Dynamic Pricing Engine",
        description: "Echtzeitberechnung basierend auf Distanz, Volumen, Saison und Verfügbarkeit. Garantierter Festpreis.",
        tech: "ML-basiert",
        impact: "Bis 40% günstiger als Konkurrenz"
      },
      {
        icon: <Shield className="w-6 h-6" />,
        title: "Smart Escrow",
        description: "Stripe-Treuhand hält die Zahlung sicher. Freigabe erst nach erfolgreicher Wohnungsübergabe.",
        tech: "Stripe Connect",
        impact: "100% Zahlungssicherheit"
      },
      {
        icon: <Target className="w-6 h-6" />,
        title: "Quality-Weighted Bidding",
        description: "QWB-Algorithmus priorisiert Qualität über Preis. Top-bewertete Firmen werden bevorzugt.",
        tech: "Eigener Algorithmus",
        impact: "4.8+ Durchschnittsbewertung"
      },
      {
        icon: <Truck className="w-6 h-6" />,
        title: "Live GPS Tracking",
        description: "Echtzeit-Standort des Umzugswagens. ETA-Updates via SMS, WhatsApp und Push.",
        tech: "Multi-Channel API",
        impact: "Keine Wartezeit"
      },
      {
        icon: <FileCheck className="w-6 h-6" />,
        title: "Swiss Handover Protocol",
        description: "Digitales Übergabeprotokoll nach OR Art. 14. Rechtsgültige Signatur, automatische Escrow-Freigabe.",
        tech: "Schweizer Recht konform",
        impact: "Rechtssichere Dokumentation"
      },
      {
        icon: <Smartphone className="w-6 h-6" />,
        title: "Zero-UI Experience",
        description: "Kein kompliziertes Formular. Einfach Video hochladen oder mit einem Tap starten.",
        tech: "Mobile-First",
        impact: "<2 Min bis zur Offerte"
      },
      {
        icon: <Award className="w-6 h-6" />,
        title: "Abgabegarantie",
        description: "Wir garantieren eine akzeptierte Wohnungsübergabe oder organisieren kostenlose Nachreinigung.",
        tech: "Partner-Netzwerk",
        impact: "0 abgelehnte Übergaben"
      }
    ]
  },
  bg: {
    badge: "Технология",
    title: "Какво ни прави уникални",
    subtitle: "Уникална технологична интеграция за Швейцария",
    features: [
      {
        icon: <Video className="w-6 h-6" />,
        title: "AI Видео Сканиране",
        description: "LiDAR създава Digital Twin. Просто качете видео – AI разпознава всички мебели автоматично.",
        tech: "Google Vision + LiDAR",
        impact: "95% по-точно от ръчно въвеждане"
      },
      {
        icon: <Brain className="w-6 h-6" />,
        title: "Dynamic Pricing Engine",
        description: "Изчисление в реално време на база разстояние, обем, сезон и наличност. Гарантирана фиксирана цена.",
        tech: "ML-базиран",
        impact: "До 40% по-евтино от конкуренцията"
      },
      {
        icon: <Shield className="w-6 h-6" />,
        title: "Smart Escrow",
        description: "Stripe escrow държи плащането сигурно. Освобождаване само след успешно предаване.",
        tech: "Stripe Connect",
        impact: "100% сигурност на плащането"
      },
      {
        icon: <Target className="w-6 h-6" />,
        title: "Quality-Weighted Bidding",
        description: "QWB алгоритъмът приоритизира качеството над цената. Топ-оценени компании са предпочитани.",
        tech: "Собствен алгоритъм",
        impact: "4.8+ средна оценка"
      },
      {
        icon: <Truck className="w-6 h-6" />,
        title: "Live GPS Проследяване",
        description: "Местоположение в реално време. ETA актуализации чрез SMS, WhatsApp и Push.",
        tech: "Multi-Channel API",
        impact: "Без чакане"
      },
      {
        icon: <FileCheck className="w-6 h-6" />,
        title: "Swiss Handover Protocol",
        description: "Дигитален протокол за предаване по OR Art. 14. Правен подпис, автоматично освобождаване.",
        tech: "Съответствие с швейцарското право",
        impact: "Правно сигурна документация"
      },
      {
        icon: <Smartphone className="w-6 h-6" />,
        title: "Zero-UI Изживяване",
        description: "Без сложни формуляри. Просто качете видео или започнете с един тап.",
        tech: "Mobile-First",
        impact: "<2 мин до офертата"
      },
      {
        icon: <Award className="w-6 h-6" />,
        title: "Гаранция за предаване",
        description: "Гарантираме прието предаване или организираме безплатно почистване.",
        tech: "Партньорска мрежа",
        impact: "0 отхвърлени предавания"
      }
    ]
  },
  it: {
    badge: "Tecnologia",
    title: "Cosa ci rende unici",
    subtitle: "Integrazione tecnologica unica in Svizzera",
    features: [
      {
        icon: <Video className="w-6 h-6" />,
        title: "AI Video Scan",
        description: "LiDAR crea un Digital Twin. Basta caricare un video – l'AI riconosce automaticamente tutti i mobili.",
        tech: "Google Vision + LiDAR",
        impact: "95% più preciso dell'inserimento manuale"
      },
      {
        icon: <Brain className="w-6 h-6" />,
        title: "Dynamic Pricing Engine",
        description: "Calcolo in tempo reale basato su distanza, volume, stagione e disponibilità. Prezzo fisso garantito.",
        tech: "Basato su ML",
        impact: "Fino al 40% più economico"
      },
      {
        icon: <Shield className="w-6 h-6" />,
        title: "Smart Escrow",
        description: "L'escrow Stripe trattiene il pagamento in sicurezza. Rilascio solo dopo consegna riuscita.",
        tech: "Stripe Connect",
        impact: "100% sicurezza del pagamento"
      },
      {
        icon: <Target className="w-6 h-6" />,
        title: "Quality-Weighted Bidding",
        description: "L'algoritmo QWB dà priorità alla qualità sul prezzo. Le aziende con le migliori valutazioni sono preferite.",
        tech: "Algoritmo proprietario",
        impact: "4.8+ valutazione media"
      },
      {
        icon: <Truck className="w-6 h-6" />,
        title: "Live GPS Tracking",
        description: "Posizione in tempo reale del camion. Aggiornamenti ETA via SMS, WhatsApp e Push.",
        tech: "Multi-Channel API",
        impact: "Nessuna attesa"
      },
      {
        icon: <FileCheck className="w-6 h-6" />,
        title: "Swiss Handover Protocol",
        description: "Protocollo di consegna digitale secondo OR Art. 14. Firma legale, rilascio automatico.",
        tech: "Conforme al diritto svizzero",
        impact: "Documentazione legalmente sicura"
      },
      {
        icon: <Smartphone className="w-6 h-6" />,
        title: "Zero-UI Experience",
        description: "Nessun modulo complicato. Basta caricare un video o iniziare con un tap.",
        tech: "Mobile-First",
        impact: "<2 min fino al preventivo"
      },
      {
        icon: <Award className="w-6 h-6" />,
        title: "Garanzia Consegna",
        description: "Garantiamo una consegna accettata o organizziamo una pulizia gratuita.",
        tech: "Rete partner",
        impact: "0 consegne rifiutate"
      }
    ]
  }
};

interface ReloOSFeaturesGridProps {
  language: VisionLanguage;
  variant?: 'full' | 'compact';
}

export const ReloOSFeaturesGrid = memo(function ReloOSFeaturesGrid({
  language,
  variant = 'full'
}: ReloOSFeaturesGridProps) {
  const t = translations[language];
  const isCompact = variant === 'compact';
  const displayedFeatures = isCompact ? t.features.slice(0, 4) : t.features;

  return (
    <section className="py-12 md:py-16 bg-muted/30" id="relo-os-features">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <Badge className="mb-4 bg-primary/10 text-primary">
            <Zap className="w-3 h-3 mr-1" />
            {t.badge}
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3">
            {t.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            {t.subtitle}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className={`grid gap-4 md:gap-6 ${isCompact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
          {displayedFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <div className="h-full bg-card rounded-xl border border-border p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>

                {/* Tech & Impact */}
                <div className="flex flex-col gap-2 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Tech:</span>
                    <span className="font-mono text-primary/80">{feature.tech}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Impact:</span>
                    <span className="font-semibold text-secondary">{feature.impact}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

/**
 * ReloOS Journey Section - Invisible Move 6-Phase Visualization
 * Shows the complete customer journey through the Relo-OS system
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Video, 
  Calculator, 
  CreditCard, 
  Truck, 
  ClipboardCheck,
  Sparkles,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import type { VisionLanguage } from '@/lib/vision-translations';

interface Phase {
  id: string;
  number: number;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  tech: string;
  color: string;
}

const translations: Record<VisionLanguage, {
  badge: string;
  title: string;
  subtitle: string;
  phases: Phase[];
  northStar: { label: string; metric: string; description: string };
}> = {
  de: {
    badge: "Invisible Move",
    title: "Relo-OS: 6-Phasen Journey",
    subtitle: "Vom ersten Klick bis zur perfekten Wohnungsübergabe – vollständig automatisiert",
    phases: [
      {
        id: 'route',
        number: 1,
        icon: <MapPin className="w-6 h-6" />,
        title: "Route",
        subtitle: "Adress-Initialisierung",
        description: "PLZ-zu-PLZ Erfassung mit Distanzberechnung und Kantons-Zuordnung",
        features: ["Swiss GeoAPI", "Auto-Vervollständigung", "Sofort-Distanz"],
        tech: "RouteInitializer",
        color: "from-blue-500 to-blue-600"
      },
      {
        id: 'inventory',
        number: 2,
        icon: <Video className="w-6 h-6" />,
        title: "Inventar",
        subtitle: "AI Video Scan",
        description: "LiDAR-Tiefenerfassung erstellt einen Digital Twin des Haushalts",
        features: ["Zero-UI Video Upload", "Möbelerkennung", "Digital Twin"],
        tech: "AI + LiDAR",
        color: "from-purple-500 to-purple-600"
      },
      {
        id: 'quote',
        number: 3,
        icon: <Calculator className="w-6 h-6" />,
        title: "Offerte",
        subtitle: "Sofort-Festpreis",
        description: "Dynamic Pricing Engine berechnet garantierten Endpreis – keine bösen Überraschungen",
        features: ["Abgabegarantie", "Festpreis", "Transparenz"],
        tech: "QuoteOrchestrator",
        color: "from-green-500 to-green-600"
      },
      {
        id: 'booking',
        number: 4,
        icon: <CreditCard className="w-6 h-6" />,
        title: "Buchung",
        subtitle: "Smart Escrow",
        description: "Sichere Zahlung via Stripe-Treuhand – Auszahlung erst nach erfolgreicher Übergabe",
        features: ["QWB-Matching", "Stripe Escrow", "Kundenschutz"],
        tech: "BookingOrchestrator",
        color: "from-yellow-500 to-yellow-600"
      },
      {
        id: 'moving',
        number: 5,
        icon: <Truck className="w-6 h-6" />,
        title: "Umzug",
        subtitle: "Live GPS Tracking",
        description: "Echtzeit-Verfolgung mit Multi-Channel-Benachrichtigungen (SMS, WhatsApp, Push)",
        features: ["GPS Live", "SMS/WhatsApp", "ETA Updates"],
        tech: "MovingOrchestrator",
        color: "from-orange-500 to-orange-600"
      },
      {
        id: 'complete',
        number: 6,
        icon: <ClipboardCheck className="w-6 h-6" />,
        title: "Übergabe",
        subtitle: "Swiss Protocol",
        description: "Digitales Übergabeprotokoll nach OR Art. 14 mit rechtsgültiger Signatur",
        features: ["Foto-Dokumentation", "Digital Signatur", "Auto-Freigabe"],
        tech: "CompleteOrchestrator",
        color: "from-red-500 to-red-600"
      }
    ],
    northStar: {
      label: "North Star Metric",
      metric: "Perfect Moves Delivered",
      description: "0 Schäden • Pünktlich • <1h Admin-Aufwand"
    }
  },
  bg: {
    badge: "Invisible Move",
    title: "Relo-OS: 6-Фазово Пътуване",
    subtitle: "От първия клик до перфектното предаване – напълно автоматизирано",
    phases: [
      {
        id: 'route',
        number: 1,
        icon: <MapPin className="w-6 h-6" />,
        title: "Маршрут",
        subtitle: "Инициализация на адреси",
        description: "PLZ-to-PLZ въвеждане с изчисляване на разстоянието",
        features: ["Swiss GeoAPI", "Авто-попълване", "Моментално разстояние"],
        tech: "RouteInitializer",
        color: "from-blue-500 to-blue-600"
      },
      {
        id: 'inventory',
        number: 2,
        icon: <Video className="w-6 h-6" />,
        title: "Инвентар",
        subtitle: "AI Видео Сканиране",
        description: "LiDAR създава Digital Twin на домакинството",
        features: ["Zero-UI Видео", "Разпознаване на мебели", "Digital Twin"],
        tech: "AI + LiDAR",
        color: "from-purple-500 to-purple-600"
      },
      {
        id: 'quote',
        number: 3,
        icon: <Calculator className="w-6 h-6" />,
        title: "Оферта",
        subtitle: "Мигновена фиксирана цена",
        description: "Dynamic Pricing Engine изчислява гарантирана крайна цена",
        features: ["Гаранция за предаване", "Фиксирана цена", "Прозрачност"],
        tech: "QuoteOrchestrator",
        color: "from-green-500 to-green-600"
      },
      {
        id: 'booking',
        number: 4,
        icon: <CreditCard className="w-6 h-6" />,
        title: "Резервация",
        subtitle: "Smart Escrow",
        description: "Сигурно плащане чрез Stripe – плащане само след успешно предаване",
        features: ["QWB-Matching", "Stripe Escrow", "Защита на клиента"],
        tech: "BookingOrchestrator",
        color: "from-yellow-500 to-yellow-600"
      },
      {
        id: 'moving',
        number: 5,
        icon: <Truck className="w-6 h-6" />,
        title: "Преместване",
        subtitle: "Live GPS Проследяване",
        description: "Проследяване в реално време с SMS, WhatsApp, Push известия",
        features: ["GPS Live", "SMS/WhatsApp", "ETA Updates"],
        tech: "MovingOrchestrator",
        color: "from-orange-500 to-orange-600"
      },
      {
        id: 'complete',
        number: 6,
        icon: <ClipboardCheck className="w-6 h-6" />,
        title: "Предаване",
        subtitle: "Швейцарски протокол",
        description: "Дигитален протокол за предаване по OR Art. 14 с правен подпис",
        features: ["Фото документация", "Дигитален подпис", "Авто-освобождаване"],
        tech: "CompleteOrchestrator",
        color: "from-red-500 to-red-600"
      }
    ],
    northStar: {
      label: "North Star Метрика",
      metric: "Перфектни премествания",
      description: "0 щети • Навреме • <1ч административна работа"
    }
  },
  it: {
    badge: "Invisible Move",
    title: "Relo-OS: Viaggio in 6 Fasi",
    subtitle: "Dal primo clic alla consegna perfetta – completamente automatizzato",
    phases: [
      {
        id: 'route',
        number: 1,
        icon: <MapPin className="w-6 h-6" />,
        title: "Percorso",
        subtitle: "Inizializzazione indirizzi",
        description: "Inserimento PLZ-to-PLZ con calcolo della distanza",
        features: ["Swiss GeoAPI", "Auto-completamento", "Distanza istantanea"],
        tech: "RouteInitializer",
        color: "from-blue-500 to-blue-600"
      },
      {
        id: 'inventory',
        number: 2,
        icon: <Video className="w-6 h-6" />,
        title: "Inventario",
        subtitle: "AI Video Scan",
        description: "LiDAR crea un Digital Twin della casa",
        features: ["Zero-UI Video", "Riconoscimento mobili", "Digital Twin"],
        tech: "AI + LiDAR",
        color: "from-purple-500 to-purple-600"
      },
      {
        id: 'quote',
        number: 3,
        icon: <Calculator className="w-6 h-6" />,
        title: "Preventivo",
        subtitle: "Prezzo fisso istantaneo",
        description: "Dynamic Pricing Engine calcola un prezzo finale garantito",
        features: ["Garanzia consegna", "Prezzo fisso", "Trasparenza"],
        tech: "QuoteOrchestrator",
        color: "from-green-500 to-green-600"
      },
      {
        id: 'booking',
        number: 4,
        icon: <CreditCard className="w-6 h-6" />,
        title: "Prenotazione",
        subtitle: "Smart Escrow",
        description: "Pagamento sicuro via Stripe – rilascio solo dopo consegna riuscita",
        features: ["QWB-Matching", "Stripe Escrow", "Protezione cliente"],
        tech: "BookingOrchestrator",
        color: "from-yellow-500 to-yellow-600"
      },
      {
        id: 'moving',
        number: 5,
        icon: <Truck className="w-6 h-6" />,
        title: "Trasloco",
        subtitle: "Live GPS Tracking",
        description: "Tracciamento in tempo reale con notifiche SMS, WhatsApp, Push",
        features: ["GPS Live", "SMS/WhatsApp", "ETA Updates"],
        tech: "MovingOrchestrator",
        color: "from-orange-500 to-orange-600"
      },
      {
        id: 'complete',
        number: 6,
        icon: <ClipboardCheck className="w-6 h-6" />,
        title: "Consegna",
        subtitle: "Protocollo Svizzero",
        description: "Protocollo di consegna digitale secondo OR Art. 14 con firma legale",
        features: ["Documentazione foto", "Firma digitale", "Rilascio automatico"],
        tech: "CompleteOrchestrator",
        color: "from-red-500 to-red-600"
      }
    ],
    northStar: {
      label: "North Star Metric",
      metric: "Traslochi Perfetti Consegnati",
      description: "0 danni • Puntuale • <1h lavoro admin"
    }
  }
};

interface ReloOSJourneySectionProps {
  language: VisionLanguage;
  variant?: 'full' | 'compact' | 'family';
}

export const ReloOSJourneySection = memo(function ReloOSJourneySection({
  language,
  variant = 'full'
}: ReloOSJourneySectionProps) {
  const t = translations[language];
  const isCompact = variant === 'compact';
  const isFamily = variant === 'family';

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30" id="relo-os-journey">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-14"
        >
          <Badge className="mb-4 bg-gradient-to-r from-primary to-secondary text-white border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            {t.badge}
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-3">
            {t.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
            {t.subtitle}
          </p>
        </motion.div>

        {/* North Star Metric */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-10 md:mb-14"
        >
          <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-2xl p-6 border border-primary/20 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-secondary" />
              <span className="text-sm font-semibold text-secondary">{t.northStar.label}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-foreground mb-2">
              {t.northStar.metric}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t.northStar.description}
            </p>
          </div>
        </motion.div>

        {/* 6 Phases Grid */}
        <div className={`grid gap-4 md:gap-6 ${isCompact ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {t.phases.map((phase, index) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className={`relative bg-card rounded-xl border border-border overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-lg ${isCompact ? 'p-4' : 'p-6'}`}>
                {/* Phase Number Badge */}
                <div className={`absolute top-3 right-3 w-7 h-7 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center text-white text-xs font-bold`}>
                  {phase.number}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {phase.icon}
                </div>

                {/* Content */}
                <h3 className="font-bold text-foreground mb-1">{phase.title}</h3>
                <p className="text-xs text-secondary font-medium mb-2">{phase.subtitle}</p>
                
                {!isCompact && (
                  <>
                    <p className="text-sm text-muted-foreground mb-4">{phase.description}</p>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {phase.features.map((feature, i) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* Tech Badge */}
                    <div className="flex items-center gap-1.5 text-xs text-primary/70">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span className="font-mono">{phase.tech}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Connector Arrow (not for last item) */}
              {!isCompact && index < t.phases.length - 1 && (
                <div className="hidden lg:flex justify-center py-2">
                  <ArrowRight className="w-5 h-5 text-muted-foreground/30" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA for Family Variant */}
        {isFamily && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
              <Shield className="w-4 h-4" />
              <span>
                {language === 'de' ? 'Alles automatisiert. Kein Stress.' : 
                 language === 'it' ? 'Tutto automatizzato. Nessuno stress.' :
                 'Всичко автоматизирано. Без стрес.'}
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
});

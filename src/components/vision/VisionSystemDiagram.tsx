/**
 * VisionSystemDiagram - Interactive System Architecture Visualization
 * 
 * Shows how all platform components connect and create the flywheel effect.
 * Visual representation of the complete business ecosystem.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Calculator, FileText, Shield, Phone, Package, 
  TrendingUp, Database, Bot, Star, ArrowRight, Zap,
  RefreshCw, DollarSign, BarChart3, Brain
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VisionSystemDiagramProps {
  language?: 'de' | 'it' | 'bg';
}

const TRANSLATIONS = {
  de: {
    title: "Das Ökosystem",
    subtitle: "Wie alles zusammenspielt",
    flywheel: "Flywheel-Effekt",
    flywheelDesc: "Je mehr Kunden → Bessere Daten → Bessere Matches → Mehr Kunden",
    layers: {
      customer: {
        title: "Kunden-Layer",
        items: ["Preisrechner", "Offerten-Formular", "Firmenvergleich", "Buchung"]
      },
      platform: {
        title: "Plattform-Layer",
        items: ["Matching AI", "Escrow System", "Quality Scoring", "Automation"]
      },
      partner: {
        title: "Partner-Layer",
        items: ["Partner OS", "Lead-Management", "Bidding System", "Analytics"]
      },
      data: {
        title: "Daten-Layer",
        items: ["MoveScan AI", "Pricing Index", "Quality Metrics", "Feedback Loop"]
      }
    },
    revenue: "6 Revenue Streams verbunden",
  },
  it: {
    title: "L'Ecosistema",
    subtitle: "Come tutto funziona insieme",
    flywheel: "Effetto Flywheel",
    flywheelDesc: "Più clienti → Dati migliori → Match migliori → Più clienti",
    layers: {
      customer: {
        title: "Layer Cliente",
        items: ["Calcolatore", "Modulo Preventivi", "Confronto", "Prenotazione"]
      },
      platform: {
        title: "Layer Piattaforma",
        items: ["Matching AI", "Sistema Escrow", "Quality Scoring", "Automazione"]
      },
      partner: {
        title: "Layer Partner",
        items: ["Partner OS", "Gestione Lead", "Sistema Bidding", "Analytics"]
      },
      data: {
        title: "Layer Dati",
        items: ["MoveScan AI", "Indice Prezzi", "Metriche Qualità", "Feedback Loop"]
      }
    },
    revenue: "6 Fonti di Ricavo connesse",
  },
  bg: {
    title: "Екосистемата",
    subtitle: "Как всичко работи заедно",
    flywheel: "Flywheel ефект",
    flywheelDesc: "Повече клиенти → По-добри данни → По-добри съвпадения → Повече клиенти",
    layers: {
      customer: {
        title: "Клиентски слой",
        items: ["Калкулатор", "Формуляр оферти", "Сравнение", "Резервация"]
      },
      platform: {
        title: "Платформен слой",
        items: ["Matching AI", "Escrow система", "Quality Scoring", "Автоматизация"]
      },
      partner: {
        title: "Партньорски слой",
        items: ["Partner OS", "Lead управление", "Bidding система", "Анализи"]
      },
      data: {
        title: "Данни слой",
        items: ["MoveScan AI", "Ценови индекс", "Качествени метрики", "Feedback Loop"]
      }
    },
    revenue: "6 свързани потока приходи",
  }
};

const LAYER_ICONS = {
  customer: Users,
  platform: Shield,
  partner: BarChart3,
  data: Database
};

const LAYER_COLORS = {
  customer: "from-blue-500 to-blue-600",
  platform: "from-primary to-primary/80",
  partner: "from-cyan-500 to-cyan-600",
  data: "from-violet-500 to-violet-600"
};

export const VisionSystemDiagram = ({ language = 'de' }: VisionSystemDiagramProps) => {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const t = TRANSLATIONS[language];
  const layers = ['customer', 'platform', 'partner', 'data'] as const;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Zap className="w-4 h-4 mr-2 text-primary" />
            {t.flywheel}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.subtitle}</p>
        </motion.div>

        {/* Layer Stack Visualization */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            {layers.map((layerKey, index) => {
              const layer = t.layers[layerKey];
              const Icon = LAYER_ICONS[layerKey];
              const isActive = activeLayer === layerKey;
              
              return (
                <motion.div
                  key={layerKey}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className={cn(
                    "relative mb-4 rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
                    isActive ? "scale-[1.02] shadow-xl z-10" : "hover:scale-[1.01]"
                  )}
                  onMouseEnter={() => setActiveLayer(layerKey)}
                  onMouseLeave={() => setActiveLayer(null)}
                  style={{
                    marginLeft: `${index * 20}px`,
                    marginRight: `${(3 - index) * 20}px`
                  }}
                >
                  <div className={cn(
                    "bg-gradient-to-r p-6 text-white",
                    LAYER_COLORS[layerKey]
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{layer.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {layer.items.slice(0, isActive ? 4 : 2).map((item, i) => (
                              <Badge 
                                key={i} 
                                variant="secondary" 
                                className="bg-white/20 text-white border-0 text-xs"
                              >
                                {item}
                              </Badge>
                            ))}
                            {!isActive && layer.items.length > 2 && (
                              <Badge className="bg-white/10 text-white border-0 text-xs">
                                +{layer.items.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className={cn(
                        "w-6 h-6 transition-transform",
                        isActive && "translate-x-2"
                      )} />
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Connection Lines */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Flywheel Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative bg-card rounded-2xl p-8 border shadow-lg">
            {/* Center */}
            <div className="flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center"
              >
                <RefreshCw className="w-10 h-10 text-primary" />
              </motion.div>
            </div>

            {/* Flywheel Description */}
            <div className="text-center mb-6">
              <p className="text-lg font-medium text-primary">{t.flywheelDesc}</p>
            </div>

            {/* Revenue Indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              <span>{t.revenue}</span>
            </div>

            {/* Flywheel Stages */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { icon: Users, label: language === 'de' ? "Mehr Kunden" : language === 'it' ? "Più Clienti" : "Повече клиенти" },
                { icon: Database, label: language === 'de' ? "Bessere Daten" : language === 'it' ? "Dati Migliori" : "По-добри данни" },
                { icon: Brain, label: language === 'de' ? "Bessere AI" : language === 'it' ? "AI Migliore" : "По-добър AI" },
                { icon: Star, label: language === 'de' ? "Bessere Matches" : language === 'it' ? "Match Migliori" : "По-добри съвпадения" },
              ].map((stage, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center p-4 bg-muted/50 rounded-lg"
                >
                  <stage.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-sm font-medium">{stage.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VisionSystemDiagram;

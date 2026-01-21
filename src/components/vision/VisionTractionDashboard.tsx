/**
 * Traction Dashboard Component
 * Shows key metrics and proof points for investors
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Rocket, Users, TrendingUp, Globe, 
  CheckCircle2, ExternalLink, Star
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionTractionDashboardProps {
  language: VisionLanguage;
}

const content = {
  de: {
    badge: "Traction & Status",
    title: "Wo wir stehen",
    subtitle: "Aktuelle Kennzahlen und Meilensteine",
    
    // Live Status
    liveStatus: {
      label: "Platform Status",
      value: "LIVE",
      sublabel: "www.umzugscheck.ch",
      link: "https://umzugscheck.ch"
    },
    
    // Key Metrics
    metrics: [
      { 
        label: "Seiten", 
        value: "130+", 
        description: "SEO-optimierte Landing Pages",
        trend: null
      },
      { 
        label: "Städte", 
        value: "26", 
        description: "Mit Neighborhood-Daten",
        trend: null
      },
      { 
        label: "Rechner", 
        value: "10", 
        description: "Umzug, Reinigung, Entsorgung...",
        trend: null
      },
      { 
        label: "Entwicklungszeit", 
        value: "2'100+", 
        description: "Stunden in 83 Tagen",
        trend: null
      }
    ],
    
    // Milestones achieved
    milestones: [
      { text: "Production Deployment live", done: true },
      { text: "Domain & SSL konfiguriert", done: true },
      { text: "10 Funnel-Varianten A/B-ready", done: true },
      { text: "Multi-Language (DE/FR/IT)", done: true },
      { text: "Provider-Onboarding", done: false },
      { text: "Erste zahlende Kunden", done: false }
    ],
    
    // Social Proof (Placeholder for now)
    socialProof: {
      title: "Vertrauen aufbauen",
      items: [
        "Schweizer Hosting & Datenschutz",
        "DSGVO/DSG-konform",
        "Treuhand-Zahlungen geplant"
      ]
    }
  },
  bg: {
    badge: "Traction & Статус",
    title: "Къде сме",
    subtitle: "Актуални показатели и етапи",
    
    liveStatus: {
      label: "Статус на платформата",
      value: "LIVE",
      sublabel: "www.umzugscheck.ch",
      link: "https://umzugscheck.ch"
    },
    
    metrics: [
      { 
        label: "Страници", 
        value: "130+", 
        description: "SEO-оптимизирани Landing Pages",
        trend: null
      },
      { 
        label: "Градове", 
        value: "26", 
        description: "С данни за кварталите",
        trend: null
      },
      { 
        label: "Калкулатори", 
        value: "10", 
        description: "Преместване, почистване, изхвърляне...",
        trend: null
      },
      { 
        label: "Време за разработка", 
        value: "2'100+", 
        description: "Часа за 83 дни",
        trend: null
      }
    ],
    
    milestones: [
      { text: "Production Deployment live", done: true },
      { text: "Домейн & SSL конфигурирани", done: true },
      { text: "10 Funnel варианта A/B-ready", done: true },
      { text: "Multi-Language (DE/FR/IT)", done: true },
      { text: "Onboarding на доставчици", done: false },
      { text: "Първи плащащи клиенти", done: false }
    ],
    
    socialProof: {
      title: "Изграждане на доверие",
      items: [
        "Швейцарски хостинг & защита на данните",
        "GDPR/DSG съвместим",
        "Планирани Escrow плащания"
      ]
    }
  }
};

export const VisionTractionDashboard = memo(({ language }: VisionTractionDashboardProps) => {
  const t = content[language];
  
  return (
    <section className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <Badge className="mb-3 bg-green-100 text-green-700">
              <Rocket className="w-3 h-3 mr-1" />
              {t.badge}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{t.title}</h2>
            <p className="text-muted-foreground">{t.subtitle}</p>
          </motion.div>
          
          {/* Live Status Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <a 
              href={t.liveStatus.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="p-4 bg-green-50 border-green-200 hover:border-green-400 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
                    </div>
                    <div>
                      <p className="text-sm text-green-600 font-medium">{t.liveStatus.label}</p>
                      <p className="text-2xl font-bold text-green-700">{t.liveStatus.value}</p>
                      <p className="text-sm text-green-600">{t.liveStatus.sublabel}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-green-600" />
                </div>
              </Card>
            </a>
          </motion.div>
          
          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            {t.metrics.map((metric, i) => (
              <Card key={i} className="p-4 text-center">
                <p className="text-3xl font-bold text-primary">{metric.value}</p>
                <p className="font-medium">{metric.label}</p>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </Card>
            ))}
          </motion.div>
          
          {/* Two columns: Milestones + Social Proof */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Milestones */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-5 h-full">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {language === 'de' ? 'Meilensteine' : 'Етапи'}
                </h3>
                <ul className="space-y-3">
                  {t.milestones.map((milestone, i) => (
                    <li key={i} className="flex items-center gap-3">
                      {milestone.done ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                      )}
                      <span className={milestone.done ? "text-foreground" : "text-muted-foreground"}>
                        {milestone.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
            
            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-5 h-full bg-primary/5 border-primary/20">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  {t.socialProof.title}
                </h3>
                <ul className="space-y-3">
                  {t.socialProof.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                {/* Placeholder for future logos */}
                <div className="mt-6 pt-4 border-t border-primary/10">
                  <p className="text-xs text-muted-foreground mb-2">
                    {language === 'de' ? 'Partner (coming soon)' : 'Партньори (скоро)'}
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-16 h-8 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
            
          </div>
          
        </div>
      </div>
    </section>
  );
});

VisionTractionDashboard.displayName = 'VisionTractionDashboard';

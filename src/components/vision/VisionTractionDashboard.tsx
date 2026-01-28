/**
 * Traction Dashboard Component
 * Shows key metrics and proof points for investors
 * Updated: 13.5h/day average since 31.10.2024
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Rocket, Users, TrendingUp, Globe, 
  CheckCircle2, ExternalLink, Star, Clock, Code, Building2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VisionLanguage } from "@/lib/vision-translations";

// Import unique background image
import professionalMovers from "@/assets/vision/professional-movers.jpg";

interface VisionTractionDashboardProps {
  language: VisionLanguage;
}

// Calculate days since start (31.10.2026)
const getProjectDays = () => {
  const startDate = new Date('2026-10-31');
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Calculate total hours (13.5h average per day)
const getTotalHours = () => {
  const days = getProjectDays();
  return Math.round(days * 13.5);
};

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
    
    // Key Metrics - Dynamic calculation
    metrics: [
      { 
        label: "Seiten", 
        value: "130+", 
        description: "SEO-optimierte Landing Pages",
        icon: Globe
      },
      { 
        label: "Städte", 
        value: "26", 
        description: "Mit Neighborhood-Daten",
        icon: Building2
      },
      { 
        label: "Rechner", 
        value: "10", 
        description: "Umzug, Reinigung, Entsorgung...",
        icon: Code
      },
      { 
        label: "Entwicklungszeit", 
        value: `${getTotalHours().toLocaleString('de-CH')}+`, 
        description: `Stunden (Ø 13.5h/Tag, ${getProjectDays()} Tage)`,
        icon: Clock
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
    
    // Created websites/projects
    createdProjects: {
      title: "Erstellte Projekte",
      subtitle: "Weitere Seiten in diesem Zeitraum erstellt:",
      projects: [
        { name: "umzugexpress.ch", status: "live" },
        { name: "zuegelhelden.ch", status: "live" },
        { name: "feierabend-umzug.ch", status: "live" },
        { name: "gentlehands.ch", status: "live" },
        { name: "sbpi.ch", status: "live" },
        { name: "itsfeierabend.ch", status: "live" },
        { name: "reride.ch", status: "live" },
        { name: "iwantsexnow.ch", status: "live" }
      ]
    },
    
    // Social Proof
    socialProof: {
      title: "Vertrauen aufbauen",
      items: [
        "Schweizer Hosting & Datenschutz",
        "DSGVO/DSG-konform",
        "Treuhand-Zahlungen geplant"
      ]
    },
    
    workEthic: {
      title: "Arbeitsethik",
      stats: [
        { label: "Start", value: "31.10.2024" },
        { label: "Tage", value: getProjectDays().toString() },
        { label: "Ø Stunden/Tag", value: "13.5h" },
        { label: "Total Stunden", value: `${getTotalHours().toLocaleString('de-CH')}+` }
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
        icon: Globe
      },
      { 
        label: "Градове", 
        value: "26", 
        description: "С данни за кварталите",
        icon: Building2
      },
      { 
        label: "Калкулатори", 
        value: "10", 
        description: "Преместване, почистване, изхвърляне...",
        icon: Code
      },
      { 
        label: "Време за разработка", 
        value: `${getTotalHours().toLocaleString('de-CH')}+`, 
        description: `Часа (Ø 13.5ч/ден, ${getProjectDays()} дни)`,
        icon: Clock
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
    
    createdProjects: {
      title: "Създадени проекти",
      subtitle: "Други сайтове създадени в този период:",
      projects: [
        { name: "umzugexpress.ch", status: "live" },
        { name: "zuegelhelden.ch", status: "live" },
        { name: "feierabend-umzug.ch", status: "live" },
        { name: "gentlehands.ch", status: "live" },
        { name: "sbpi.ch", status: "live" },
        { name: "itsfeierabend.ch", status: "live" },
        { name: "reride.ch", status: "live" },
        { name: "iwantsexnow.ch", status: "live" }
      ]
    },
    
    socialProof: {
      title: "Изграждане на доверие",
      items: [
        "Швейцарски хостинг & защита на данните",
        "GDPR/DSG съвместим",
        "Планирани Escrow плащания"
      ]
    },
    
    workEthic: {
      title: "Работна етика",
      stats: [
        { label: "Старт", value: "31.10.2024" },
        { label: "Дни", value: getProjectDays().toString() },
        { label: "Ø Часа/ден", value: "13.5ч" },
        { label: "Общо часове", value: `${getTotalHours().toLocaleString('de-CH')}+` }
      ]
    }
  },
  it: {
    badge: "Traction & Stato",
    title: "Dove siamo",
    subtitle: "Metriche attuali e traguardi",
    
    liveStatus: {
      label: "Stato piattaforma",
      value: "LIVE",
      sublabel: "www.umzugscheck.ch",
      link: "https://umzugscheck.ch"
    },
    
    metrics: [
      { 
        label: "Pagine", 
        value: "130+", 
        description: "Landing Pages ottimizzate SEO",
        icon: Globe
      },
      { 
        label: "Città", 
        value: "26", 
        description: "Con dati sui quartieri",
        icon: Building2
      },
      { 
        label: "Calcolatori", 
        value: "10", 
        description: "Trasloco, pulizia, smaltimento...",
        icon: Code
      },
      { 
        label: "Tempo sviluppo", 
        value: `${getTotalHours().toLocaleString('de-CH')}+`, 
        description: `Ore (Ø 13.5h/giorno, ${getProjectDays()} giorni)`,
        icon: Clock
      }
    ],
    
    milestones: [
      { text: "Production Deployment live", done: true },
      { text: "Dominio & SSL configurato", done: true },
      { text: "10 varianti Funnel A/B-ready", done: true },
      { text: "Multi-Language (DE/FR/IT)", done: true },
      { text: "Onboarding fornitori", done: false },
      { text: "Primi clienti paganti", done: false }
    ],
    
    createdProjects: {
      title: "Progetti creati",
      subtitle: "Altri siti creati in questo periodo:",
      projects: [
        { name: "umzugexpress.ch", status: "live" },
        { name: "zuegelhelden.ch", status: "live" },
        { name: "feierabend-umzug.ch", status: "live" },
        { name: "gentlehands.ch", status: "live" },
        { name: "sbpi.ch", status: "live" },
        { name: "itsfeierabend.ch", status: "live" },
        { name: "reride.ch", status: "live" },
        { name: "iwantsexnow.ch", status: "live" }
      ]
    },
    
    socialProof: {
      title: "Costruire fiducia",
      items: [
        "Hosting svizzero & protezione dati",
        "Conforme GDPR/DSG",
        "Pagamenti Escrow pianificati"
      ]
    },
    
    workEthic: {
      title: "Etica del lavoro",
      stats: [
        { label: "Inizio", value: "31.10.2024" },
        { label: "Giorni", value: getProjectDays().toString() },
        { label: "Ø Ore/giorno", value: "13.5h" },
        { label: "Ore totali", value: `${getTotalHours().toLocaleString('de-CH')}+` }
      ]
    }
  }
};

export const VisionTractionDashboard = memo(({ language }: VisionTractionDashboardProps) => {
  const t = content[language];
  
  return (
    <section className="py-8 md:py-10 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={professionalMovers}
          alt="Professional movers"
          className="w-full h-full object-cover opacity-10"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-muted/90 to-muted/95" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-8"
          >
            <Badge className="mb-3 bg-green-100 text-green-700 text-xs">
              <Rocket className="w-3 h-3 mr-1" />
              {t.badge}
            </Badge>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">{t.title}</h2>
            <p className="text-sm md:text-base text-muted-foreground">{t.subtitle}</p>
          </motion.div>
          
          {/* Live Status Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-6 md:mb-8"
          >
            <a 
              href={t.liveStatus.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block touch-manipulation active:scale-[0.99] transition-transform"
            >
              <Card className="p-3 md:p-4 bg-green-50 border-green-200 hover:border-green-400 transition-colors min-h-[72px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-green-600 font-medium">{t.liveStatus.label}</p>
                      <p className="text-xl md:text-2xl font-bold text-green-700">{t.liveStatus.value}</p>
                      <p className="text-xs md:text-sm text-green-600">{t.liveStatus.sublabel}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0" />
                </div>
              </Card>
            </a>
          </motion.div>
          
          {/* Work Ethic Stats - NEW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 md:mb-8"
          >
            <Card className="p-4 md:p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-sm md:text-base">
                <Clock className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                {t.workEthic.title}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {t.workEthic.stats.map((stat, i) => (
                  <div key={i} className="text-center p-3 rounded-xl bg-background/80 backdrop-blur-sm">
                    <p className="text-lg md:text-2xl font-black text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
          
          {/* Metrics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8"
          >
            {t.metrics.map((metric, i) => (
              <Card key={i} className="p-3 md:p-4 text-center bg-background/95 backdrop-blur-sm">
                <metric.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-primary">{metric.value}</p>
                <p className="font-medium text-sm md:text-base">{metric.label}</p>
                <p className="text-[10px] md:text-xs text-muted-foreground leading-tight">{metric.description}</p>
              </Card>
            ))}
          </motion.div>
          
          {/* Three columns: Milestones + Created Projects + Social Proof */}
          <div className="grid gap-4 md:gap-6 md:grid-cols-3">
            
            {/* Milestones */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-4 md:p-5 h-full bg-background/95 backdrop-blur-sm">
                <h3 className="font-bold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                  <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  {language === 'de' ? 'Meilensteine' : language === 'it' ? 'Traguardi' : 'Етапи'}
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {t.milestones.map((milestone, i) => (
                    <li key={i} className="flex items-center gap-2 md:gap-3 min-h-[36px]">
                      {milestone.done ? (
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                      )}
                      <span className={`text-sm md:text-base ${milestone.done ? "text-foreground" : "text-muted-foreground"}`}>
                        {milestone.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
            
            {/* Created Projects - NEW */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-4 md:p-5 h-full bg-background/95 backdrop-blur-sm border-secondary/20">
                <h3 className="font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
                  <Code className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
                  {t.createdProjects.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">{t.createdProjects.subtitle}</p>
                <ul className="space-y-1.5">
                  {t.createdProjects.projects.map((project, i) => (
                    <li key={i} className="flex items-center justify-between text-xs md:text-sm">
                      <span className="font-medium">{project.name}</span>
                      <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                        {project.status}
                      </Badge>
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
              <Card className="p-4 md:p-5 h-full bg-primary/5 border-primary/20">
                <h3 className="font-bold mb-3 md:mb-4 flex items-center gap-2 text-sm md:text-base">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  {t.socialProof.title}
                </h3>
                <ul className="space-y-2 md:space-y-3">
                  {t.socialProof.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 md:gap-3 text-xs md:text-sm min-h-[32px]">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                {/* Placeholder for future logos */}
                <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-primary/10">
                  <p className="text-[10px] md:text-xs text-muted-foreground mb-2">
                    {language === 'de' ? 'Partner (coming soon)' : language === 'it' ? 'Partner (prossimamente)' : 'Партньори (скоро)'}
                  </p>
                  <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-12 h-6 md:w-16 md:h-8 bg-muted rounded animate-pulse" />
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

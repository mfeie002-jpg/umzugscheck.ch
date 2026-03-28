/**
 * Vision Progress Milestones Component
 * Shows past achievements + current progress + future milestones
 * Milestone-based progress tracking to show 3 months of intensive work
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Clock, Circle, Rocket, Trophy, 
  Calendar, ChevronDown, ChevronUp, Sparkles,
  Code2, Database, Palette, Target, TrendingUp, Globe
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionProgressMilestonesProps {
  language: VisionLanguage;
}

// Milestone definitions with past, current, and future phases
const milestones = {
  de: {
    title: "Projekt-Roadmap",
    subtitle: "Von der Idee zum Launch: 8 Meilensteine, 2'100+ Stunden Entwicklung",
    introExplanation: "100% = Produkt ist live & generiert Umsatz",
    pastMilestonesTitle: "Abgeschlossene Meilensteine",
    currentMilestoneTitle: "Aktueller Meilenstein",
    futureMilestonesTitle: "Kommende Meilensteine",
    showDetails: "Details anzeigen",
    hideDetails: "Details verbergen",
    
    // Past milestones (DONE) - Now with clear numbering
    pastMilestones: [
      {
        id: "m1",
        name: "Meilenstein 1: Technisches Fundament",
        timeframe: "Oktober - November 2024",
        durationDays: 45,
        progress: 100,
        summary: "Komplette Architektur und Grundstruktur",
        achievements: [
          "React/TypeScript/Vite Setup",
          "Supabase Backend & 20+ DB-Tabellen",
          "Authentifizierung & RLS Policies",
          "200+ Komponenten entwickelt",
          "50+ Seiten und Routes erstellt",
          "Mobile-First responsive Design",
          "Tailwind + shadcn/ui Design System"
        ]
      },
      {
        id: "m2",
        name: "Meilenstein 2: Kern-Features",
        timeframe: "November - Dezember 2024",
        durationDays: 40,
        progress: 100,
        summary: "Alle Hauptfunktionen für Nutzer",
        achievements: [
          "10 verschiedene Rechner (Umzug, Reinigung, etc.)",
          "Firmen-Verzeichnis mit 30+ Providern",
          "Mehrstufiger Offerten-Funnel (5 Schritte)",
          "SEO-optimierte Landing Pages",
          "Lead-Generierung & Speicherung",
          "Admin Dashboard Grundstruktur",
          "PDF Export Funktionalität"
        ]
      },
      {
        id: "m3",
        name: "Meilenstein 3: Daten & Intelligence",
        timeframe: "Dezember 2024 - Januar 2025",
        durationDays: 35,
        progress: 100,
        summary: "Relocation Intelligence Database",
        achievements: [
          "26 Städte mit Neighborhood-Daten",
          "POIs & lokale Informationen",
          "Newcomer Kit UI-Komponenten",
          "Schema.org SEO Markup",
          "Vision Page für Stakeholder",
          "Bulgarisch/Deutsch Übersetzungen",
          "Dark Mode Support"
        ]
      },
      {
        id: "m4",
        name: "Meilenstein 4: Extended Features",
        timeframe: "Januar 2025",
        durationDays: 20,
        progress: 100,
        summary: "10 Conversion-Boosting Features",
        achievements: [
          "AI Cost Predictor (CH-Preise)",
          "WhatsApp-First Integration",
          "Capacity Radar (Live-Verfügbarkeit)",
          "Buddy Matching (LKW-Sharing)",
          "AR Inventory Scanner",
          "Provider Live-Chat Widget",
          "Post-Move Checklist (7 Kategorien)",
          "Neighborhood Comparison (11 Metriken)"
        ]
      },
      {
        id: "m5",
        name: "Meilenstein 5: Launch-Vorbereitung",
        timeframe: "Januar 2025",
        durationDays: 15,
        progress: 100,
        summary: "Finalisierung vor Go-Live",
        achievements: [
          "Admin Dashboard fertiggestellt",
          "Email Templates (10 Vorlagen)",
          "Lead Scoring System",
          "Multi-Language (DE/FR/IT)",
          "Performance Optimierung",
          "SEO Final Audit"
        ]
      },
      {
        id: "m6",
        name: "Meilenstein 6: Strategisches Wachstum",
        timeframe: "Januar 2025",
        durationDays: 20,
        progress: 100,
        summary: "Skalierung, Automation & Optimierung",
        achievements: [
          "Smart Lead Scoring System",
          "Automated Follow-Up Sequences",
          "Dynamic Pricing Engine",
          "Mock Data Framework",
          "Provider Performance Analytics",
          "Customer Journey Insights",
          "Mobile UX Final Polish"
        ]
      }
    ],
    
    // Current milestone (Milestone 7 - Go-Live - DONE since deployed to umzugscheck.ch)
    currentMilestone: {
      id: "m7",
      name: "Meilenstein 7: Go-Live & First Revenue",
      timeframe: "Januar 2025",
      durationDays: 10,
      progress: 100,
      summary: "🎉 LIVE auf www.umzugscheck.ch",
      completed: [
        "Production Deployment",
        "Domain umzugscheck.ch konfiguriert",
        "SSL & DNS aktiv",
        "Plattform öffentlich zugänglich"
      ],
      inProgress: [
        "Google Ads Kampagnen aufsetzen",
        "Erste Leads generieren"
      ],
      upcoming: [
        "Provider-Onboarding (10 Firmen)"
      ]
    },
    
    // Future milestones (Post-Launch Growth) - only 1 left!
    futureMilestones: [
      {
        id: "m8",
        name: "Meilenstein 8: Market Expansion",
        timeframe: "Februar - März 2025",
        progress: 0,
        summary: "Wachstum & erste Umsätze",
        items: [
          "Erste 100 Leads generieren",
          "Provider-Onboarding (10 Firmen)",
          "Französische Schweiz (Romandie)",
          "Tessin (Italienisch)"
        ]
      }
    ],
    
    // Stats
    stats: {
      totalDays: "150+ Tage",
      totalHours: "2'100+ Stunden",
      hoursPerDay: "14-15h/Tag",
      components: "370+",
      pages: "130+",
      tables: "40+",
      cities: "26"
    }
  },
  bg: {
    title: "Пътна карта на проекта",
    subtitle: "От идея до стартиране: 8 етапа, 2'100+ часа разработка",
    introExplanation: "100% = Продуктът е live & генерира приходи",
    pastMilestonesTitle: "Завършени етапи",
    currentMilestoneTitle: "Текущ етап",
    futureMilestonesTitle: "Предстоящи етапи",
    showDetails: "Покажи детайли",
    hideDetails: "Скрий детайли",
    
    pastMilestones: [
      {
        id: "m1",
        name: "Етап 1: Техническа основа",
        timeframe: "Октомври - Ноември 2024",
        durationDays: 45,
        progress: 100,
        summary: "Пълна архитектура и структура",
        achievements: [
          "React/TypeScript/Vite Setup",
          "Supabase Backend & 20+ таблици",
          "Автентикация & RLS политики",
          "200+ компонента разработени",
          "50+ страници и маршрути",
          "Mobile-First дизайн",
          "Tailwind + shadcn/ui дизайн система"
        ]
      },
      {
        id: "m2",
        name: "Етап 2: Основни функции",
        timeframe: "Ноември - Декември 2024",
        durationDays: 40,
        progress: 100,
        summary: "Всички основни функции за потребители",
        achievements: [
          "10 различни калкулатора",
          "Каталог с 30+ фирми",
          "Многостъпков формуляр (5 стъпки)",
          "SEO-оптимизирани страници",
          "Генериране и съхранение на leads",
          "Admin Dashboard структура",
          "PDF Export функционалност"
        ]
      },
      {
        id: "m3",
        name: "Етап 3: Данни & Intelligence",
        timeframe: "Декември 2024 - Януари 2025",
        durationDays: 35,
        progress: 100,
        summary: "Relocation Intelligence Database",
        achievements: [
          "26 града с данни за кварталите",
          "POIs & локална информация",
          "Newcomer Kit компоненти",
          "Schema.org SEO маркиране",
          "Vision Page за заинтересовани страни",
          "Български/Немски преводи",
          "Dark Mode поддръжка"
        ]
      },
      {
        id: "m4",
        name: "Етап 4: Extended Features",
        timeframe: "Януари 2025",
        durationDays: 20,
        progress: 100,
        summary: "10 Conversion-Boosting функции",
        achievements: [
          "AI Cost Predictor (CH цени)",
          "WhatsApp-First интеграция",
          "Capacity Radar (реално време)",
          "Buddy Matching (споделяне на камион)",
          "AR Inventory Scanner",
          "Provider Live-Chat Widget",
          "Post-Move чеклист (7 категории)",
          "Сравнение на квартали (11 метрики)"
        ]
      },
      {
        id: "m5",
        name: "Етап 5: Подготовка за стартиране",
        timeframe: "Януари 2025",
        durationDays: 15,
        progress: 100,
        summary: "Финализиране преди Go-Live",
        achievements: [
          "Admin Dashboard завършен",
          "Email Templates (10 шаблона)",
          "Lead Scoring система",
          "Multi-Language (DE/FR/IT)",
          "Оптимизация на производителността",
          "SEO финален одит"
        ]
      },
      {
        id: "m6",
        name: "Етап 6: Стратегически растеж",
        timeframe: "Януари 2025",
        durationDays: 20,
        progress: 100,
        summary: "Мащабиране, автоматизация и оптимизация",
        achievements: [
          "Smart Lead Scoring система",
          "Автоматични Follow-Up последователности",
          "Dynamic Pricing Engine",
          "Mock Data Framework",
          "Provider Performance Analytics",
          "Customer Journey Insights",
          "Mobile UX финален полиш"
        ]
      }
    ],
    
    // Current milestone (Milestone 7 - Go-Live - DONE!)
    currentMilestone: {
      id: "m7",
      name: "Етап 7: Go-Live & Първи приходи",
      timeframe: "Януари 2025",
      durationDays: 10,
      progress: 100,
      summary: "🎉 LIVE на www.umzugscheck.ch",
      completed: [
        "Production Deployment",
        "Домейн umzugscheck.ch конфигуриран",
        "SSL & DNS активни",
        "Платформата е публично достъпна"
      ],
      inProgress: [
        "Настройка на Google Ads кампании",
        "Генериране на първите leads"
      ],
      upcoming: [
        "Onboarding на доставчици (10 фирми)"
      ]
    },
    
    // Future milestones (Post-Launch Growth) - only 1 left!
    futureMilestones: [
      {
        id: "m8",
        name: "Етап 8: Пазарна експанзия",
        timeframe: "Февруари - Март 2025",
        progress: 0,
        summary: "Растеж & първи приходи",
        items: [
          "Първите 100 leads",
          "Onboarding на доставчици (10 фирми)",
          "Френска Швейцария (Романди)",
          "Тичино (италиански)"
        ]
      }
    ],
    
    stats: {
      totalDays: "150+ дни",
      totalHours: "2'100+ часа",
      hoursPerDay: "14-15ч/ден",
      components: "370+",
      pages: "130+",
      tables: "40+",
      cities: "26"
    }
  }
};

export const VisionProgressMilestones = memo(({ language }: VisionProgressMilestonesProps) => {
  const t = milestones[language];
  const [expandedPast, setExpandedPast] = useState(false);
  const [expandedCurrent, setExpandedCurrent] = useState(false);
  const [expandedFuture, setExpandedFuture] = useState(false);
  
  // Calculate overall progress - 6 of 8 milestones done (5 past + current at 100%)
  const currentProgress = t.currentMilestone.progress;
  const totalMilestones = t.pastMilestones.length + 1 + t.futureMilestones.length; // 8 total
  const completedMilestones = t.pastMilestones.length + (currentProgress === 100 ? 1 : 0); // 6 if current is done
  
  // Progress: completed milestones / total milestones
  const overallProgress = Math.round((completedMilestones / totalMilestones) * 100);
  
  return (
    <section className="py-12 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <Badge className="mb-3 bg-primary/10 text-primary">
            <Rocket className="w-3 h-3 mr-1" />
            {t.title}
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {t.subtitle}
          </h2>
        </motion.div>
        
        {/* Overall Progress Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-8"
        >
          <Card className="p-6">
            {/* Intro explanation */}
            <p className="text-sm text-muted-foreground mb-4 text-center italic">
              {t.introExplanation}
            </p>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                <div>
                  <span className="font-bold text-lg">{language === 'de' ? 'Gesamtfortschritt bis Go-Live' : 'Общ напредък до Go-Live'}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({completedMilestones + 1}/{totalMilestones} {language === 'de' ? 'Meilensteine' : 'етапа'})
                  </span>
                </div>
              </div>
              <span className="text-3xl font-black text-primary">{overallProgress}%</span>
            </div>
            
            {/* Progress bar */}
            <div className="h-3 bg-muted rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${overallProgress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary rounded-full"
              />
            </div>
            
            {/* Quick stats */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 text-center text-sm">
              <div className="p-2 bg-muted/50 rounded-lg">
                <Calendar className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="font-bold">{t.stats.totalDays}</p>
                <p className="text-xs text-muted-foreground">{language === 'de' ? 'Entwicklung' : 'Разработка'}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="font-bold">{t.stats.totalHours}</p>
                <p className="text-xs text-muted-foreground">{language === 'de' ? 'Arbeit' : 'Работа'}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <Code2 className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="font-bold">{t.stats.components}</p>
                <p className="text-xs text-muted-foreground">{language === 'de' ? 'Komponenten' : 'Компоненти'}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <Palette className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="font-bold">{t.stats.pages}</p>
                <p className="text-xs text-muted-foreground">{language === 'de' ? 'Seiten' : 'Страници'}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <Database className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="font-bold">{t.stats.tables}</p>
                <p className="text-xs text-muted-foreground">{language === 'de' ? 'Tabellen' : 'Таблици'}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <Globe className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                <p className="font-bold">{t.stats.cities}</p>
                <p className="text-xs text-muted-foreground">{language === 'de' ? 'Städte' : 'Градове'}</p>
              </div>
            </div>
          </Card>
        </motion.div>
        
        {/* Milestones Timeline */}
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* PAST MILESTONES (Collapsible) */}
          <Card className="overflow-hidden">
            <button
              onClick={() => setExpandedPast(!expandedPast)}
              className="w-full p-4 flex items-center justify-between bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-primary" />
                <span className="font-bold text-primary">{t.pastMilestonesTitle}</span>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {t.pastMilestones.length} {language === 'de' ? 'abgeschlossen' : 'завършени'}
                </Badge>
              </div>
              {expandedPast ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            <AnimatePresence>
              {expandedPast && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-4">
                    {t.pastMilestones.map((milestone, idx) => (
                      <div key={milestone.id} className="border rounded-lg p-4 bg-card">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                          <span className="font-bold">{milestone.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {milestone.timeframe} • {milestone.durationDays} {language === 'de' ? 'Tage' : 'дни'}
                        </p>
                        <p className="text-sm mb-3">{milestone.summary}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {milestone.achievements.map((item, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-primary/10">
                              ✓ {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
          
          {/* CURRENT MILESTONE (Collapsible, highlighted) */}
          <Card className="border-2 border-primary overflow-hidden">
            <button
              onClick={() => setExpandedCurrent(!expandedCurrent)}
              className="w-full p-4 flex items-center justify-between bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  {t.currentMilestone.progress === 100 ? 
                    <CheckCircle2 className="w-4 h-4 text-white" /> : 
                    <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  }
                </div>
                <div className="text-left">
                  <span className="font-bold text-primary">{t.currentMilestoneTitle}</span>
                  <p className="text-sm text-primary/80">{t.currentMilestone.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black text-primary">{t.currentMilestone.progress}%</span>
                {expandedCurrent ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
              </div>
            </button>
            
            <AnimatePresence>
              {expandedCurrent && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-primary/5">
                    {/* Progress bar for current milestone */}
                    <div className="h-2 bg-primary/20 rounded-full overflow-hidden mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${t.currentMilestone.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {t.currentMilestone.timeframe} • {t.currentMilestone.summary}
                    </p>
                    
                    {/* Dynamic grid - only show filled columns */}
                    <div className={cn(
                      "grid gap-3",
                      t.currentMilestone.inProgress.length > 0 && t.currentMilestone.upcoming.length > 0 ? "md:grid-cols-3" :
                      t.currentMilestone.inProgress.length > 0 || t.currentMilestone.upcoming.length > 0 ? "md:grid-cols-2" : "md:grid-cols-1"
                    )}>
                      {/* Completed - always show */}
                      {t.currentMilestone.completed.length > 0 && (
                        <div className="bg-primary/20 rounded-lg p-3">
                          <p className="text-xs font-bold text-primary mb-2">✅ {language === 'de' ? 'Fertig' : 'Готово'} ({t.currentMilestone.completed.length})</p>
                          <ul className="text-xs space-y-1">
                            {t.currentMilestone.completed.map((item, i) => (
                              <li key={i} className="text-primary">• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* In Progress - only show if not empty */}
                      {t.currentMilestone.inProgress.length > 0 && (
                        <div className="bg-accent/50 rounded-lg p-3">
                          <p className="text-xs font-bold text-accent-foreground mb-2">🔄 {language === 'de' ? 'In Arbeit' : 'В процес'}</p>
                          <ul className="text-xs space-y-1">
                            {t.currentMilestone.inProgress.map((item, i) => (
                              <li key={i} className="text-accent-foreground">• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Upcoming - only show if not empty */}
                      {t.currentMilestone.upcoming.length > 0 && (
                        <div className="bg-muted rounded-lg p-3">
                          <p className="text-xs font-bold text-muted-foreground mb-2">⏳ {language === 'de' ? 'Geplant' : 'Планирано'}</p>
                          <ul className="text-xs space-y-1 text-muted-foreground">
                            {t.currentMilestone.upcoming.map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
          
          {/* FUTURE MILESTONES (Collapsible) */}
          <Card className="overflow-hidden">
            <button
              onClick={() => setExpandedFuture(!expandedFuture)}
              className="w-full p-4 flex items-center justify-between bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <Circle className="w-5 h-5 text-muted-foreground" />
                <span className="font-bold">{t.futureMilestonesTitle}</span>
                <Badge variant="outline">
                  {t.futureMilestones.length} {language === 'de' ? 'geplant' : 'планирани'}
                </Badge>
              </div>
              {expandedFuture ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
            
            <AnimatePresence>
              {expandedFuture && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 space-y-3">
                    {t.futureMilestones.map((milestone) => (
                      <div key={milestone.id} className="border rounded-lg p-3 bg-card opacity-70">
                        <div className="flex items-center gap-2 mb-1">
                          <Circle className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{milestone.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {milestone.timeframe} • {milestone.summary}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {milestone.items.map((item, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
          
        </div>
      </div>
    </section>
  );
});

VisionProgressMilestones.displayName = 'VisionProgressMilestones';

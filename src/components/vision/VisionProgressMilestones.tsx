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
    title: "Projekt-Fortschritt",
    subtitle: "3+ Monate intensive Arbeit – hier ist was wir erreicht haben und was noch kommt",
    pastMilestonesTitle: "✅ Abgeschlossene Meilensteine",
    currentMilestoneTitle: "🔄 Aktueller Meilenstein",
    futureMilestonesTitle: "⏳ Kommende Meilensteine",
    showDetails: "Details anzeigen",
    hideDetails: "Details verbergen",
    
    // Past milestones (DONE)
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
      }
    ],
    
    // Current milestone (Phase 6 - Strategic Growth)
    currentMilestone: {
      id: "m6",
      name: "Phase 6: Strategisches Wachstum",
      timeframe: "Januar - Februar 2025",
      durationDays: 45,
      progress: 60,
      summary: "Skalierung, Automation & Optimierung",
      completed: [
        "Smart Lead Scoring System",
        "Automated Follow-Up Sequences",
        "Dynamic Pricing Engine",
        "Email Template System (10 Templates)",
        "Mock Data Framework",
        "Multi-Language Support (DE/FR/IT)",
        "Platform Documentation",
        "Admin Dashboard Components"
      ],
      inProgress: [
        "Provider Performance Analytics",
        "Customer Journey Insights",
        "Conversion Funnel Optimierung",
        "Mobile UX Final Polish"
      ],
      upcoming: [
        "Live Traffic Monitoring",
        "A/B Test Auswertung",
        "SEO Ranking Tracking",
        "Revenue Attribution"
      ]
    },
    
    // Future milestones (BONUS - Post-Launch Growth)
    futureMilestones: [
      {
        id: "m6",
        name: "Phase 6: Strategisches Wachstum",
        timeframe: "Februar - März 2025",
        progress: 50,
        summary: "Skalierung und Optimierung",
        items: [
          "✅ Smart Lead Scoring",
          "✅ Automated Follow-Ups",
          "✅ Dynamic Pricing Engine",
          "🔄 Provider Performance Analytics",
          "🔄 Customer Journey Insights"
        ]
      },
      {
        id: "m7",
        name: "Phase 7: Market Expansion",
        timeframe: "März - April 2025",
        progress: 0,
        summary: "Wachstum in neue Märkte",
        items: [
          "Französische Schweiz (Romandie)",
          "Tessin (Italienisch)",
          "B2B Enterprise Features",
          "White-Label Lösung"
        ]
      },
      {
        id: "m8",
        name: "Phase 8: Exit Preparation",
        timeframe: "Q3-Q4 2025",
        progress: 0,
        summary: "Strategische Akquisitionsvorbereitung",
        items: [
          "MOVU Konkurrenz-Positionierung",
          "Due Diligence Paket",
          "10'000+ Leads/Monat",
          "Profitabilität nachgewiesen"
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
    title: "Напредък на проекта",
    subtitle: "3+ месеца интензивна работа – ето какво постигнахме и какво предстои",
    pastMilestonesTitle: "✅ Завършени етапи",
    currentMilestoneTitle: "🔄 Текущ етап",
    futureMilestonesTitle: "⏳ Предстоящи етапи",
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
      }
    ],
    
    // Current milestone (NOW COMPLETE!)
    currentMilestone: {
      id: "m5",
      name: "Етап 5: Конверсия & Go-Live",
      timeframe: "Януари 2025",
      durationDays: 30,
      progress: 100,
      summary: "Качество на leads и първи приходи - ЗАВЪРШЕН ✅",
      completed: [
        "A/B тест система",
        "Flow анализ система",
        "SEO Hub-and-Spoke основа",
        "Интеграция на Extended Features",
        "Lead Bidding система",
        "Provider Quality Scores",
        "Email Automation",
        "Stripe интеграция",
        "Google Ads Kampagnen-Manager",
        "Go-Live Dashboard & Checklist",
        "Post-Launch Analytics Dashboard",
        "Phase 6 Growth Features"
      ],
      inProgress: [],
      upcoming: []
    },
    
    // Future milestones (BONUS - Post-Launch Growth)
    futureMilestones: [
      {
        id: "m6",
        name: "Фаза 6: Стратегически растеж",
        timeframe: "Февруари - Март 2025",
        progress: 50,
        summary: "Мащабиране и оптимизация",
        items: ["✅ Smart Lead Scoring", "✅ Automated Follow-Ups", "✅ Dynamic Pricing", "🔄 Provider Analytics"]
      },
      {
        id: "m7",
        name: "Фаза 7: Пазарна експанзия",
        timeframe: "Март - Април 2025",
        progress: 0,
        summary: "Разширяване в нови пазари",
        items: ["Френска Швейцария", "Тичино (италиански)", "B2B Enterprise", "White-Label"]
      },
      {
        id: "m8",
        name: "Фаза 8: Подготовка за Exit",
        timeframe: "Q3-Q4 2025",
        progress: 0,
        summary: "Подготовка за стратегическо придобиване",
        items: ["MOVU конкурентна позиция", "Due Diligence пакет", "10'000+ leads/месец", "Доказана печалба"]
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
  const [expandedFuture, setExpandedFuture] = useState(false);
  
  // Calculate overall progress
  const pastProgress = t.pastMilestones.reduce((sum, m) => sum + m.progress, 0);
  const currentProgress = t.currentMilestone.progress;
  const totalMilestones = t.pastMilestones.length + 1 + t.futureMilestones.length; // 7 total
  const completedMilestones = t.pastMilestones.length; // 3 done
  
  // Weighted calculation: past milestones fully count, current partially
  const overallProgress = Math.round(
    ((completedMilestones * 100) + currentProgress) / (totalMilestones * 100) * 100
  );
  
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                <div>
                  <span className="font-bold text-lg">{language === 'de' ? 'Gesamtfortschritt' : 'Общ напредък'}</span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({completedMilestones}/{totalMilestones} {language === 'de' ? 'Meilensteine' : 'етапа'})
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
          
          {/* CURRENT MILESTONE (Always visible, highlighted) */}
          <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950/30 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <span className="font-bold text-blue-800 dark:text-blue-300">{t.currentMilestoneTitle}</span>
                  <p className="text-sm text-blue-600 dark:text-blue-400">{t.currentMilestone.name}</p>
                </div>
                <span className="text-2xl font-black text-blue-600">{t.currentMilestone.progress}%</span>
              </div>
              
              {/* Progress bar for current milestone */}
              <div className="h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${t.currentMilestone.progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {t.currentMilestone.timeframe} • {t.currentMilestone.summary}
              </p>
              
              <div className="grid md:grid-cols-3 gap-3">
                <div className="bg-primary/20 rounded-lg p-3">
                  <p className="text-xs font-bold text-primary mb-2">✅ {language === 'de' ? 'Fertig' : 'Готово'}</p>
                  <ul className="text-xs space-y-1">
                    {t.currentMilestone.completed.map((item, i) => (
                      <li key={i} className="text-primary">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-3">
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-300 mb-2">🔄 {language === 'de' ? 'In Arbeit' : 'В процес'}</p>
                  <ul className="text-xs space-y-1">
                    {t.currentMilestone.inProgress.map((item, i) => (
                      <li key={i} className="text-blue-800 dark:text-blue-300">• {item}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs font-bold text-muted-foreground mb-2">⏳ {language === 'de' ? 'Geplant' : 'Планирано'}</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    {t.currentMilestone.upcoming.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
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

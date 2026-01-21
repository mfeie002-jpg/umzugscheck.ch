/**
 * Profitability Roadmap Component
 * 12-Month timeline from Launch to Profitable
 * Bold, confident "American" style messaging
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Rocket, Target, TrendingUp, DollarSign, 
  CheckCircle2, Clock, Milestone, Crown
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionProfitabilityRoadmapProps {
  language: VisionLanguage;
}

const content = {
  de: {
    badge: "Execution Roadmap 2025",
    title: "Der Weg zum Marktführer",
    subtitle: "Website fertig → Ads starten → Backlinks aufbauen → Content erstellen → Profitable bis August",
    currentPhase: "Phase 2/5",
    
    milestones: [
      {
        month: "Okt 24",
        title: "Projektstart",
        description: "Entwicklung gestartet",
        icon: "rocket",
        status: "completed",
        highlight: false
      },
      {
        month: "Jan 25",
        title: "🚀 Website fertig",
        description: "Plattform live – bereit für Traffic",
        icon: "check",
        status: "completed",
        highlight: true
      },
      {
        month: "Feb–Mar",
        title: "Ads & Traffic",
        description: "Google Ads starten, erste Kampagnen optimieren",
        icon: "target",
        status: "current",
        highlight: true
      },
      {
        month: "Apr–Jun",
        title: "Scale & Optimize",
        description: "Backlinks kaufen, Content erstellen, USP-Kampagnen testen",
        icon: "trending",
        status: "upcoming",
        highlight: false
      },
      {
        month: "Aug 25",
        title: "💰 Profitabel",
        description: "Spätestens Ende August – nachhaltig profitabel",
        icon: "dollar",
        status: "upcoming",
        highlight: true
      }
    ],
    
    progressLabel: "Gesamtfortschritt",
    monthsLeft: "Monate bis Profitabilität",
    todayLabel: "Heute",
    onTrack: "Ziel: Profitabel bis Ende August"
  },
  bg: {
    badge: "Пътна карта за изпълнение 2025",
    title: "Пътят към лидерство на пазара",
    subtitle: "Сайтът готов → Реклами стартират → Backlinks → Съдържание → Рентабилни до Август",
    currentPhase: "Фаза 2/5",
    
    milestones: [
      {
        month: "Окт 24",
        title: "Старт на проекта",
        description: "Разработката започна",
        icon: "rocket",
        status: "completed",
        highlight: false
      },
      {
        month: "Ян 25",
        title: "🚀 Сайтът готов",
        description: "Платформата активна – готови за трафик",
        icon: "check",
        status: "completed",
        highlight: true
      },
      {
        month: "Фев–Мар",
        title: "Реклами & Трафик",
        description: "Google Ads стартират, първи кампании оптимизират",
        icon: "target",
        status: "current",
        highlight: true
      },
      {
        month: "Апр–Юни",
        title: "Scale & Optimize",
        description: "Backlinks, съдържание, USP кампании тестват",
        icon: "trending",
        status: "upcoming",
        highlight: false
      },
      {
        month: "Авг 25",
        title: "💰 Рентабилен",
        description: "Най-късно края на Август – устойчиво рентабилни",
        icon: "dollar",
        status: "upcoming",
        highlight: true
      }
    ],
    
    progressLabel: "Общ напредък",
    monthsLeft: "месеца до рентабилност",
    todayLabel: "Днес",
    onTrack: "Цел: Рентабилни до края на Август"
  },
  it: {
    badge: "Roadmap di Esecuzione 2025",
    title: "La Strada verso la Leadership di Mercato",
    subtitle: "Sito pronto → Ads attivi → Backlinks → Contenuti → Redditizio entro Agosto",
    currentPhase: "Fase 2/5",
    
    milestones: [
      {
        month: "Ott 24",
        title: "Inizio Progetto",
        description: "Sviluppo avviato",
        icon: "rocket",
        status: "completed",
        highlight: false
      },
      {
        month: "Gen 25",
        title: "🚀 Sito pronto",
        description: "Piattaforma attiva – pronta per il traffico",
        icon: "check",
        status: "completed",
        highlight: true
      },
      {
        month: "Feb–Mar",
        title: "Ads & Traffico",
        description: "Google Ads attivi, prime campagne ottimizzate",
        icon: "target",
        status: "current",
        highlight: true
      },
      {
        month: "Apr–Giu",
        title: "Scale & Optimize",
        description: "Backlinks, contenuti, test campagne USP",
        icon: "trending",
        status: "upcoming",
        highlight: false
      },
      {
        month: "Ago 25",
        title: "💰 Redditizio",
        description: "Entro fine Agosto – profitti sostenibili",
        icon: "dollar",
        status: "upcoming",
        highlight: true
      }
    ],
    
    progressLabel: "Progresso Totale",
    monthsLeft: "mesi alla redditività",
    todayLabel: "Oggi",
    onTrack: "Obiettivo: Redditizio entro fine Agosto"
  }
};

const getIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'rocket': return <Rocket className={className} />;
    case 'check': return <CheckCircle2 className={className} />;
    case 'target': return <Target className={className} />;
    case 'trending': return <TrendingUp className={className} />;
    case 'dollar': return <DollarSign className={className} />;
    default: return <Milestone className={className} />;
  }
};

export const VisionProfitabilityRoadmap = memo(({ language }: VisionProfitabilityRoadmapProps) => {
  const t = content[language] || content.de;
  
  // Calculate progress (we're at milestone 2 of 5 = ~40%, target August = ~6 months away)
  const progress = 40;
  const monthsRemaining = 6;
  
  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <Badge className="mb-3 bg-primary text-primary-foreground font-bold">
              <Crown className="w-3 h-3 mr-1" />
              {t.badge}
            </Badge>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-2">{t.title}</h2>
            <p className="text-sm md:text-base text-muted-foreground">{t.subtitle}</p>
          </motion.div>
          
          {/* Progress Summary */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Card className="p-4 md:p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground mb-2">{t.progressLabel}</p>
                  <Progress value={progress} className="h-3 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-black text-primary">{monthsRemaining}</span> {t.monthsLeft}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full font-bold">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-sm">{t.todayLabel}: {t.currentPhase}</span>
                </div>
              </div>
              <p className="text-xs font-bold text-primary mt-3 text-center">✓ {t.onTrack}</p>
            </Card>
          </motion.div>
          
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line for mobile */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-muted md:hidden" />
            
            {/* Horizontal line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-muted -translate-y-1/2" />
            
            <div className="grid md:grid-cols-5 gap-4 md:gap-2">
              {t.milestones.map((milestone, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative ${milestone.status === 'current' ? 'z-10' : ''}`}
                >
                  {/* Mobile layout */}
                  <div className="md:hidden flex gap-4 pl-8">
                    {/* Icon on timeline */}
                    <div 
                      className={`
                        absolute left-0 w-8 h-8 rounded-full flex items-center justify-center
                        ${milestone.status === 'completed' 
                          ? 'bg-green-500 text-white' 
                          : milestone.status === 'current'
                            ? 'bg-primary text-primary-foreground ring-4 ring-primary/30'
                            : 'bg-muted text-muted-foreground'
                        }
                      `}
                    >
                      {getIcon(milestone.icon, 'w-4 h-4')}
                    </div>
                    
                    <Card 
                      className={`
                        flex-1 p-3
                        ${milestone.highlight ? 'border-primary/50 bg-primary/5' : ''}
                        ${milestone.status === 'current' ? 'ring-2 ring-primary shadow-lg' : ''}
                      `}
                    >
                      <p className="text-xs font-black text-primary mb-1">{milestone.month}</p>
                      <p className="font-black text-sm">{milestone.title}</p>
                      <p className="text-xs text-muted-foreground">{milestone.description}</p>
                    </Card>
                  </div>
                  
                  {/* Desktop layout */}
                  <div className="hidden md:block text-center">
                    {/* Icon on timeline */}
                    <div className="flex justify-center mb-2">
                      <div 
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${milestone.status === 'completed' 
                            ? 'bg-green-500 text-white' 
                            : milestone.status === 'current'
                              ? 'bg-primary text-primary-foreground ring-4 ring-primary/30 animate-pulse'
                              : 'bg-muted text-muted-foreground'
                          }
                        `}
                      >
                        {getIcon(milestone.icon, 'w-5 h-5')}
                      </div>
                    </div>
                    
                    <Card 
                      className={`
                        p-3 h-full
                        ${milestone.highlight ? 'border-primary/50 bg-primary/5' : ''}
                        ${milestone.status === 'current' ? 'ring-2 ring-primary shadow-lg' : ''}
                      `}
                    >
                      <p className="text-xs font-black text-primary mb-1">{milestone.month}</p>
                      <p className="font-black text-sm leading-tight">{milestone.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{milestone.description}</p>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
});

VisionProfitabilityRoadmap.displayName = 'VisionProfitabilityRoadmap';

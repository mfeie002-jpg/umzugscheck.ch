/**
 * Profitability Roadmap Component
 * 12-Month timeline from Launch to Profitable
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Rocket, Target, TrendingUp, DollarSign, 
  CheckCircle2, Clock, Milestone
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
    badge: "Roadmap 2025",
    title: "Weg zur Profitabilität",
    subtitle: "12-Monats-Plan: Von Go-Live zu nachhaltigen Gewinnen",
    currentPhase: "Aktuell",
    
    milestones: [
      {
        month: "Okt 24",
        title: "Projektstart",
        description: "Entwicklung begonnen",
        icon: "rocket",
        status: "completed",
        highlight: false
      },
      {
        month: "Jan 25",
        title: "🚀 Go-Live",
        description: "Platform live auf umzugscheck.ch",
        icon: "check",
        status: "completed",
        highlight: true
      },
      {
        month: "Feb–Mar",
        title: "First Revenue",
        description: "Erste Provider zahlen für Leads",
        icon: "target",
        status: "current",
        highlight: true
      },
      {
        month: "Apr–Jun",
        title: "Traktion",
        description: "50+ Provider, 1'000+ Leads/Monat",
        icon: "trending",
        status: "upcoming",
        highlight: false
      },
      {
        month: "Jul–Sep",
        title: "Break-Even",
        description: "Einnahmen decken laufende Kosten",
        icon: "target",
        status: "upcoming",
        highlight: false
      },
      {
        month: "Okt–Dez",
        title: "💰 Profitabel",
        description: "Nachhaltige Gewinne, Expansion bereit",
        icon: "dollar",
        status: "upcoming",
        highlight: true
      }
    ],
    
    progressLabel: "Gesamtfortschritt",
    monthsLeft: "Monate bis Profitabilität",
    todayLabel: "Heute"
  },
  bg: {
    badge: "Пътна карта 2025",
    title: "Път към рентабилност",
    subtitle: "12-месечен план: От Go-Live до устойчиви печалби",
    currentPhase: "Актуално",
    
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
        title: "🚀 Go-Live",
        description: "Платформата е на живо на umzugscheck.ch",
        icon: "check",
        status: "completed",
        highlight: true
      },
      {
        month: "Фев–Мар",
        title: "Първи приходи",
        description: "Първите доставчици плащат за leads",
        icon: "target",
        status: "current",
        highlight: true
      },
      {
        month: "Апр–Юни",
        title: "Traction",
        description: "50+ доставчици, 1'000+ leads/месец",
        icon: "trending",
        status: "upcoming",
        highlight: false
      },
      {
        month: "Юли–Сеп",
        title: "Break-Even",
        description: "Приходите покриват текущите разходи",
        icon: "target",
        status: "upcoming",
        highlight: false
      },
      {
        month: "Окт–Дек",
        title: "💰 Рентабилен",
        description: "Устойчиви печалби, готови за разширяване",
        icon: "dollar",
        status: "upcoming",
        highlight: true
      }
    ],
    
    progressLabel: "Общ напредък",
    monthsLeft: "месеца до рентабилност",
    todayLabel: "Днес"
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
  const t = content[language];
  
  // Calculate progress (we're at milestone 3 of 6 = ~33%, but more realistically ~25% through the year)
  const progress = 30;
  const monthsRemaining = 10;
  
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
            <Badge className="mb-3 bg-primary/10 text-primary">
              <Clock className="w-3 h-3 mr-1" />
              {t.badge}
            </Badge>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">{t.title}</h2>
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
                  <p className="text-sm font-medium text-muted-foreground mb-2">{t.progressLabel}</p>
                  <Progress value={progress} className="h-3 mb-2" />
                  <p className="text-xs text-muted-foreground">
                    <span className="font-bold text-primary">{monthsRemaining}</span> {t.monthsLeft}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-sm font-bold">{t.todayLabel}: {t.currentPhase}</span>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line for mobile */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-muted md:hidden" />
            
            {/* Horizontal line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary/50 to-muted -translate-y-1/2" />
            
            <div className="grid md:grid-cols-6 gap-4 md:gap-2">
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
                      <p className="text-xs font-bold text-primary mb-1">{milestone.month}</p>
                      <p className="font-bold text-sm">{milestone.title}</p>
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
                      <p className="text-xs font-bold text-primary mb-1">{milestone.month}</p>
                      <p className="font-bold text-sm leading-tight">{milestone.title}</p>
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

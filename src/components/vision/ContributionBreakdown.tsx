/**
 * Contribution Breakdown Component
 * Shows AI vs Human split, timeline, and remaining work prognosis
 * BRAND COLORS: Only Primary Blue & Secondary Red
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Bot, User, Clock, Calendar, Target, TrendingUp,
  CheckCircle2, Circle, Sparkles, ChevronDown
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { VisionLanguage } from "@/lib/vision-translations";

interface ContributionBreakdownProps {
  language: VisionLanguage;
}

const content = {
  de: {
    title: "Arbeitsaufteilung & Prognose",
    subtitle: "Wer hat was gemacht und was steht noch an",
    
    // Overall stats
    totalProgress: "Gesamtfortschritt bis Launch",
    whatIs100: "100% = Produkt ist live & generiert Umsatz",
    hereWeAre: "Hier sind wir",
    
    // Timeline
    timeline: {
      title: "Projekt-Timeline",
      start: "Start",
      startDate: "31. Oktober 2024",
      today: "Heute",
      todayDate: "21. Januar 2025",
      launch: "Launch",
      launchDate: "~Februar 2025",
      elapsed: "Vergangen",
      remaining: "Verbleibend",
      daysElapsed: "83 Tage",
      daysRemaining: "~14-21 Tage",
      atCurrentPace: "Bei aktuellem Tempo (14-15h/Tag)"
    },
    
    // Contribution split
    contribution: {
      title: "Arbeitsteilung",
      ai: {
        name: "KI (Lovable)",
        role: "Code-Generierung & Komponenten",
        done: 85,
        items: [
          "370+ React-Komponenten generiert",
          "130+ Seiten erstellt",
          "UI/UX Implementation",
          "Responsive Design",
          "40+ DB-Tabellen"
        ]
      },
      human: {
        name: "Mensch (Du)",
        role: "Strategie, Architektur & Prompting",
        done: 15,
        items: [
          "Geschäftsmodell & Vision",
          "Prompt Engineering (2'100+ Prompts)",
          "Architektur-Entscheidungen",
          "QA & Testing",
          "Content & Texte"
        ]
      }
    },
    
    // Remaining work
    remaining: {
      title: "Verbleibende Arbeit bis Launch",
      totalRemaining: 15,
      aiShare: 60,
      humanShare: 40,
      aiTasks: [
        "Go-Live Deployment Scripts",
        "Production Error Handling",
        "Final Performance Optimierung"
      ],
      humanTasks: [
        "Domain konfigurieren",
        "Google Ads Setup",
        "Provider-Onboarding (Telefonate)",
        "Legal Review"
      ]
    },
    
    // Prognosis
    prognosis: {
      title: "Prognose bei aktuellem Tempo",
      currentPace: "14-15 Stunden/Tag",
      estimatedCompletion: "~2-3 Wochen",
      completionDate: "Mitte Februar 2025",
      confidence: "Hohe Sicherheit",
      confidenceNote: "Alle kritischen Features fertig"
    }
  },
  bg: {
    title: "Разпределение на работата & Прогноза",
    subtitle: "Кой какво е направил и какво предстои",
    
    totalProgress: "Общ напредък до лансиране",
    whatIs100: "100% = Продуктът е на живо & генерира приходи",
    hereWeAre: "Тук сме",
    
    timeline: {
      title: "Времева линия",
      start: "Старт",
      startDate: "31 октомври 2024",
      today: "Днес",
      todayDate: "21 януари 2025",
      launch: "Лансиране",
      launchDate: "~Февруари 2025",
      elapsed: "Изминало",
      remaining: "Остава",
      daysElapsed: "83 дни",
      daysRemaining: "~14-21 дни",
      atCurrentPace: "При текущо темпо (14-15ч/ден)"
    },
    
    contribution: {
      title: "Разпределение на труда",
      ai: {
        name: "AI (Lovable)",
        role: "Генериране на код & компоненти",
        done: 85,
        items: [
          "370+ React компоненти генерирани",
          "130+ страници създадени",
          "UI/UX имплементация",
          "Responsive дизайн",
          "40+ DB таблици"
        ]
      },
      human: {
        name: "Човек (Ти)",
        role: "Стратегия, архитектура & промптинг",
        done: 15,
        items: [
          "Бизнес модел & визия",
          "Prompt Engineering (2'100+ промпта)",
          "Архитектурни решения",
          "QA & тестване",
          "Съдържание & текстове"
        ]
      }
    },
    
    remaining: {
      title: "Оставаща работа до лансиране",
      totalRemaining: 15,
      aiShare: 60,
      humanShare: 40,
      aiTasks: [
        "Go-Live Deployment скриптове",
        "Production Error Handling",
        "Финална оптимизация"
      ],
      humanTasks: [
        "Конфигуриране на домейн",
        "Google Ads настройка",
        "Onboarding на доставчици (обаждания)",
        "Правен преглед"
      ]
    },
    
    prognosis: {
      title: "Прогноза при текущо темпо",
      currentPace: "14-15 часа/ден",
      estimatedCompletion: "~2-3 седмици",
      completionDate: "Средата на февруари 2025",
      confidence: "Висока увереност",
      confidenceNote: "Всички критични функции готови"
    }
  }
};

export const ContributionBreakdown = memo(({ language }: ContributionBreakdownProps) => {
  const t = content[language];
  
  // Calculate overall progress (85% complete, 15% remaining)
  const overallProgress = 85;
  const aiDonePercent = 85; // Of the work done, 85% was AI
  const humanDonePercent = 15; // Of the work done, 15% was human
  const remainingTotal = 15;
  const remainingAI = 60; // Of remaining, 60% is AI work
  const remainingHuman = 40; // Of remaining, 40% is human work
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto mb-8"
    >
      <Card className="p-6 border-2 border-primary/20">
        {/* Header */}
        <div className="text-center mb-6">
          <Badge className="mb-2 bg-primary/10 text-primary">
            <Sparkles className="w-3 h-3 mr-1" />
            {t.title}
          </Badge>
          <p className="text-sm text-muted-foreground">{t.subtitle}</p>
        </div>
        
        {/* Overall Progress with Arrow Indicator */}
        <div className="mb-8 p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="font-bold">{t.totalProgress}</span>
            </div>
            <span className="text-3xl font-black text-primary">{overallProgress}%</span>
          </div>
          
          {/* Progress Bar with Arrow Indicator */}
          <div className="relative mb-6">
            <div className="h-4 rounded-full overflow-hidden flex">
              <div 
                className="bg-primary transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
              <div 
                className="bg-secondary transition-all duration-500"
                style={{ width: `${100 - overallProgress}%` }}
              />
            </div>
            
            {/* Arrow Indicator - "Hier sind wir" */}
            <div 
              className="absolute -top-8 flex flex-col items-center transition-all duration-500"
              style={{ left: `${overallProgress}%`, transform: 'translateX(-50%)' }}
            >
              <span className="text-xs font-bold text-primary whitespace-nowrap bg-background px-2 py-0.5 rounded border border-primary/30">
                {t.hereWeAre}
              </span>
              <ChevronDown className="w-4 h-4 text-primary animate-bounce" />
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground italic">
            💡 {t.whatIs100}
          </p>
        </div>
        
        {/* Timeline Visual */}
        <div className="mb-8">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            {t.timeline.title}
          </h4>
          
          <div className="relative">
            {/* Timeline bar */}
            <div className="h-3 bg-muted rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "82%" }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="absolute left-0 h-full bg-gradient-to-r from-primary via-primary to-primary/60 rounded-full"
              />
              {/* Today marker - using secondary (red) */}
              <div className="absolute left-[82%] top-1/2 -translate-y-1/2 w-4 h-4 bg-secondary border-2 border-white rounded-full shadow-lg" />
            </div>
            
            {/* Labels */}
            <div className="flex justify-between mt-2 text-xs">
              <div className="text-left">
                <p className="font-bold text-primary">{t.timeline.start}</p>
                <p className="text-muted-foreground">{t.timeline.startDate}</p>
              </div>
              <div className="text-center absolute left-[82%] -translate-x-1/2">
                <p className="font-bold text-secondary">{t.timeline.today}</p>
                <p className="text-muted-foreground">{t.timeline.todayDate}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{t.timeline.launch}</p>
                <p className="text-muted-foreground">{t.timeline.launchDate}</p>
              </div>
            </div>
            
            {/* Time stats - using brand colors */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-black text-primary">{t.timeline.daysElapsed}</p>
                <p className="text-xs text-muted-foreground">{t.timeline.elapsed}</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-3 text-center">
                <p className="text-2xl font-black text-primary">{t.timeline.daysRemaining}</p>
                <p className="text-xs text-muted-foreground">{t.timeline.remaining}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* AI vs Human Contribution - BRAND COLORS ONLY */}
        <div className="mb-8">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            {t.contribution.title}
          </h4>
          
          {/* Visual Split Bar - Primary Blue & Secondary Red */}
          <div className="h-8 rounded-full overflow-hidden flex mb-4 shadow-inner">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${aiDonePercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-primary flex items-center justify-center"
            >
              <span className="text-primary-foreground text-sm font-bold flex items-center gap-1">
                <Bot className="w-4 h-4" />
                {aiDonePercent}% KI
              </span>
            </motion.div>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: `${humanDonePercent}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-secondary flex items-center justify-center"
            >
              <span className="text-secondary-foreground text-xs font-bold flex items-center gap-1">
                <User className="w-3 h-3" />
                {humanDonePercent}%
              </span>
            </motion.div>
          </div>
          
          {/* Details Grid - Brand Colors */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* AI Column - Primary Blue */}
            <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold">{t.contribution.ai.name}</p>
                  <p className="text-xs text-muted-foreground">{t.contribution.ai.role}</p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {t.contribution.ai.items.map((item, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Human Column - Secondary Red */}
            <div className="bg-secondary/10 rounded-xl p-4 border border-secondary/20">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <User className="w-5 h-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="font-bold">{t.contribution.human.name}</p>
                  <p className="text-xs text-muted-foreground">{t.contribution.human.role}</p>
                </div>
              </div>
              <ul className="space-y-1.5">
                {t.contribution.human.items.map((item, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Remaining Work - Brand Colors */}
        <div className="mb-6">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Circle className="w-4 h-4 text-muted-foreground" />
            {t.remaining.title}
            <Badge variant="outline" className="ml-2">{remainingTotal}%</Badge>
          </h4>
          
          {/* Remaining Split */}
          <div className="bg-muted/50 rounded-xl p-4 mb-4">
            <p className="text-sm text-muted-foreground mb-3">
              {language === 'de' 
                ? `Von den verbleibenden ${remainingTotal}%:`
                : `От оставащите ${remainingTotal}%:`
              }
            </p>
            
            <div className="h-6 rounded-full overflow-hidden flex mb-3">
              <div 
                className="bg-primary/70 flex items-center justify-center transition-all"
                style={{ width: `${remainingAI}%` }}
              >
                <span className="text-primary-foreground text-xs font-bold">{remainingAI}% KI</span>
              </div>
              <div 
                className="bg-secondary/70 flex items-center justify-center transition-all"
                style={{ width: `${remainingHuman}%` }}
              >
                <span className="text-secondary-foreground text-xs font-bold">{remainingHuman}% {language === 'de' ? 'Du' : 'Ти'}</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-medium text-primary mb-1">🤖 KI-Tasks:</p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {t.remaining.aiTasks.map((task, i) => (
                    <li key={i}>• {task}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-secondary mb-1">👤 {language === 'de' ? 'Deine Tasks' : 'Твоите задачи'}:</p>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {t.remaining.humanTasks.map((task, i) => (
                    <li key={i}>• {task}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Prognosis - Brand Primary */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl p-4 border border-primary/20">
          <h4 className="font-bold mb-3 flex items-center gap-2 text-primary">
            <Clock className="w-4 h-4" />
            {t.prognosis.title}
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-primary">{t.prognosis.currentPace}</p>
              <p className="text-xs text-muted-foreground">{language === 'de' ? 'Tempo' : 'Темпо'}</p>
            </div>
            <div>
              <p className="text-lg font-bold text-primary">{t.prognosis.estimatedCompletion}</p>
              <p className="text-xs text-muted-foreground">{language === 'de' ? 'Bis Launch' : 'До лансиране'}</p>
            </div>
            <div>
              <p className="text-lg font-bold text-primary">{t.prognosis.completionDate}</p>
              <p className="text-xs text-muted-foreground">{language === 'de' ? 'Zieldatum' : 'Целева дата'}</p>
            </div>
            <div>
              <p className="text-lg font-bold text-primary">✓</p>
              <p className="text-xs text-muted-foreground">{t.prognosis.confidence}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

ContributionBreakdown.displayName = 'ContributionBreakdown';

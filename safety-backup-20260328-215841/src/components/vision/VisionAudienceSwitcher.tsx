/**
 * Audience Switcher Component
 * Routes different audiences to their relevant content
 */

import { memo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, TrendingUp, Building2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionAudienceSwitcherProps {
  language: VisionLanguage;
  className?: string;
}

const content = {
  de: {
    // Gemini Feedback: "Für wen ist diese Seite?" statt "Wähle deine Perspektive"
    title: "Für wen ist diese Seite?",
    subtitle: "Wähle deine Perspektive – oder scrolle für die vollständige Übersicht:",
    
    audiences: [
      {
        id: "family",
        icon: Heart,
        title: "Für die Familie",
        description: "Einfach erklärt: Was wir bauen und warum es funktioniert",
        link: "/family",
        color: "border-red-200 hover:border-red-400 hover:bg-red-50/50 dark:border-red-800 dark:hover:border-red-600",
        iconColor: "text-red-500",
        badge: "Einfach"
      },
      {
        id: "investors",
        icon: TrendingUp,
        title: "Für Investoren",
        description: "Unit Economics, 10 Revenue Streams, Exit-Potenzial",
        link: "/investoren",
        color: "border-primary/30 hover:border-primary hover:bg-primary/5",
        iconColor: "text-primary",
        badge: "Business"
      },
      {
        id: "partners",
        icon: Building2,
        title: "Für Partner",
        description: "Premium-Leads, Bidding-System & Tools für Wachstum",
        link: "/fuer-firmen",
        color: "border-muted-foreground/30 hover:border-muted-foreground hover:bg-muted/50",
        iconColor: "text-muted-foreground",
        badge: "B2B"
      }
    ],
    
    continueHere: "Oder scrolle weiter für die vollständige Übersicht"
  },
  bg: {
    title: "За кого е тази страница?",
    subtitle: "Избери своята перспектива – или скролни за пълния преглед:",
    
    audiences: [
      {
        id: "family",
        icon: Heart,
        title: "За семейството",
        description: "Просто обяснено: Какво строим и защо работи",
        link: "/family",
        color: "border-red-200 hover:border-red-400 hover:bg-red-50/50 dark:border-red-800 dark:hover:border-red-600",
        iconColor: "text-red-500",
        badge: "Просто"
      },
      {
        id: "investors",
        icon: TrendingUp,
        title: "За инвеститори",
        description: "Unit Economics, 10 потока приходи, Exit потенциал",
        link: "/investoren",
        color: "border-primary/30 hover:border-primary hover:bg-primary/5",
        iconColor: "text-primary",
        badge: "Бизнес"
      },
      {
        id: "partners",
        icon: Building2,
        title: "За партньори",
        description: "Premium-Leads, Bidding система & инструменти за растеж",
        link: "/fuer-firmen",
        color: "border-muted-foreground/30 hover:border-muted-foreground hover:bg-muted/50",
        iconColor: "text-muted-foreground",
        badge: "B2B"
      }
    ],
    
    continueHere: "Или продължи да скролиш за пълния преглед"
  },
  it: {
    title: "Per chi è questa pagina?",
    subtitle: "Scegli la tua prospettiva – o scorri per la panoramica completa:",
    
    audiences: [
      {
        id: "family",
        icon: Heart,
        title: "Per la Famiglia",
        description: "Spiegato semplicemente: Cosa costruiamo e perché funziona",
        link: "/family",
        color: "border-red-200 hover:border-red-400 hover:bg-red-50/50 dark:border-red-800 dark:hover:border-red-600",
        iconColor: "text-red-500",
        badge: "Semplice"
      },
      {
        id: "investors",
        icon: TrendingUp,
        title: "Per Investitori",
        description: "Unit Economics, 10 flussi di ricavo, potenziale Exit",
        link: "/investoren",
        color: "border-primary/30 hover:border-primary hover:bg-primary/5",
        iconColor: "text-primary",
        badge: "Business"
      },
      {
        id: "partners",
        icon: Building2,
        title: "Per Partner",
        description: "Lead Premium, sistema Bidding & strumenti per crescita",
        link: "/fuer-firmen",
        color: "border-muted-foreground/30 hover:border-muted-foreground hover:bg-muted/50",
        iconColor: "text-muted-foreground",
        badge: "B2B"
      }
    ],
    
    continueHere: "Oppure continua a scorrere per la panoramica completa"
  }
};

export const VisionAudienceSwitcher = memo(({ language, className }: VisionAudienceSwitcherProps) => {
  const t = content[language];
  
  return (
    <section className={cn("py-6 md:py-8", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{t.title}</h2>
            <p className="text-muted-foreground text-xs md:text-sm">{t.subtitle}</p>
          </div>
          
          {/* Audience Cards */}
          <div className="grid gap-3 md:gap-4 md:grid-cols-3 mb-4 md:mb-6">
            {t.audiences.map((audience, i) => (
              <motion.div
                key={audience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={audience.link}>
                  <Card className={cn(
                    "p-4 md:p-5 h-full transition-all cursor-pointer border-2 touch-manipulation active:scale-[0.98]",
                    audience.color
                  )}>
                    <div className="flex items-start justify-between mb-2 md:mb-3">
                      <audience.icon className={cn("w-6 h-6 md:w-8 md:h-8", audience.iconColor)} />
                      <Badge variant="secondary" className="text-[10px] md:text-xs">
                        {audience.badge}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-sm md:text-base mb-1">{audience.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">{audience.description}</p>
                    <div className="flex items-center gap-1 text-xs md:text-sm font-medium text-primary">
                      <span>{language === 'de' ? 'Ansehen' : language === 'it' ? 'Vedi' : 'Виж'}</span>
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Continue hint */}
          <p className="text-center text-xs md:text-sm text-muted-foreground">
            ↓ {t.continueHere} ↓
          </p>
          
        </div>
      </div>
    </section>
  );
});

VisionAudienceSwitcher.displayName = 'VisionAudienceSwitcher';

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
    title: "Wähle deine Perspektive",
    subtitle: "Diese Seite enthält alles – oder springe direkt zu deinem Fokus:",
    
    audiences: [
      {
        id: "family",
        icon: Heart,
        title: "Für Familie",
        description: "Einfach erklärt: Was ich baue und warum es funktioniert",
        link: "/family",
        color: "border-red-200 hover:border-red-400 hover:bg-red-50/50",
        iconColor: "text-red-500",
        badge: "Für Eltern"
      },
      {
        id: "investors",
        icon: TrendingUp,
        title: "Für Investoren",
        description: "Unit Economics, Market Sizing, Exit Strategy",
        link: "/investoren",
        color: "border-primary/30 hover:border-primary hover:bg-primary/5",
        iconColor: "text-primary",
        badge: "Business"
      },
      {
        id: "partners",
        icon: Building2,
        title: "Für Partner",
        description: "Umzugsfirmen: Leads, Bidding & Provision",
        link: "/fuer-firmen",
        color: "border-slate-200 hover:border-slate-400 hover:bg-slate-50/50",
        iconColor: "text-slate-600",
        badge: "B2B"
      }
    ],
    
    continueHere: "Oder scrolle weiter für die vollständige Übersicht"
  },
  bg: {
    title: "Избери своята перспектива",
    subtitle: "Тази страница съдържа всичко – или скочи директно към твоя фокус:",
    
    audiences: [
      {
        id: "family",
        icon: Heart,
        title: "За семейството",
        description: "Просто обяснено: Какво строя и защо работи",
        link: "/family",
        color: "border-red-200 hover:border-red-400 hover:bg-red-50/50",
        iconColor: "text-red-500",
        badge: "За родители"
      },
      {
        id: "investors",
        icon: TrendingUp,
        title: "За инвеститори",
        description: "Unit Economics, Market Sizing, Exit Strategy",
        link: "/investoren",
        color: "border-primary/30 hover:border-primary hover:bg-primary/5",
        iconColor: "text-primary",
        badge: "Бизнес"
      },
      {
        id: "partners",
        icon: Building2,
        title: "За партньори",
        description: "Фирми за преместване: Leads, Bidding & Комисионни",
        link: "/fuer-firmen",
        color: "border-slate-200 hover:border-slate-400 hover:bg-slate-50/50",
        iconColor: "text-slate-600",
        badge: "B2B"
      }
    ],
    
    continueHere: "Или продължи да скролиш за пълния преглед"
  }
};

export const VisionAudienceSwitcher = memo(({ language, className }: VisionAudienceSwitcherProps) => {
  const t = content[language];
  
  return (
    <section className={cn("py-8", className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold mb-2">{t.title}</h2>
            <p className="text-muted-foreground text-sm">{t.subtitle}</p>
          </div>
          
          {/* Audience Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {t.audiences.map((audience, i) => (
              <motion.div
                key={audience.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={audience.link}>
                  <Card className={cn(
                    "p-5 h-full transition-all cursor-pointer border-2",
                    audience.color
                  )}>
                    <div className="flex items-start justify-between mb-3">
                      <audience.icon className={cn("w-8 h-8", audience.iconColor)} />
                      <Badge variant="secondary" className="text-xs">
                        {audience.badge}
                      </Badge>
                    </div>
                    <h3 className="font-bold mb-1">{audience.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{audience.description}</p>
                    <div className="flex items-center gap-1 text-sm font-medium text-primary">
                      <span>{language === 'de' ? 'Ansehen' : 'Виж'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Continue hint */}
          <p className="text-center text-sm text-muted-foreground">
            ↓ {t.continueHere} ↓
          </p>
          
        </div>
      </div>
    </section>
  );
});

VisionAudienceSwitcher.displayName = 'VisionAudienceSwitcher';

/**
 * VisionQuickStats - Icon-focused stats grid with minimal text
 * Visual-first design for stakeholder pages
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Globe, Zap, TrendingUp, Shield, Clock, Users, 
  Building2, Percent, Star, CheckCircle2
} from "lucide-react";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionQuickStatsProps {
  language: VisionLanguage;
  variant?: 'full' | 'family' | 'investor';
}

const stats = {
  de: {
    full: [
      { icon: Globe, value: "🇨🇭", label: "Weltweit Einzigartig", color: "text-primary" },
      { icon: Zap, value: "95%", label: "KI-Automatisiert", color: "text-secondary" },
      { icon: TrendingUp, value: "10", label: "Revenue Streams", color: "text-primary" },
      { icon: Shield, value: "Escrow", label: "Fintech-Layer", color: "text-secondary" },
      { icon: Clock, value: "450d", label: "Entwicklungszeit", color: "text-primary" },
      { icon: Star, value: "4.8★", label: "Ziel-Rating", color: "text-secondary" },
    ],
    family: [
      { icon: CheckCircle2, value: "5", label: "Offerten erhalten", color: "text-primary" },
      { icon: Clock, value: "2 Min", label: "Zeit gespart", color: "text-secondary" },
      { icon: Percent, value: "40%", label: "Günstiger", color: "text-primary" },
      { icon: Shield, value: "100%", label: "Sicher", color: "text-secondary" },
    ],
    investor: [
      { icon: TrendingUp, value: "553", label: "CHF/Kunde", color: "text-primary" },
      { icon: Percent, value: "90%+", label: "Marge", color: "text-secondary" },
      { icon: Building2, value: "10", label: "Profit Centers", color: "text-primary" },
      { icon: Users, value: "450k", label: "Umzüge/Jahr", color: "text-secondary" },
      { icon: Zap, value: "95%", label: "Automatisiert", color: "text-primary" },
      { icon: Globe, value: "DACH", label: "Skalierbar", color: "text-secondary" },
    ]
  },
  bg: {
    full: [
      { icon: Globe, value: "🇨🇭", label: "Световен Уникат", color: "text-primary" },
      { icon: Zap, value: "95%", label: "AI-Автоматизирано", color: "text-secondary" },
      { icon: TrendingUp, value: "10", label: "Потоци приходи", color: "text-primary" },
      { icon: Shield, value: "Escrow", label: "Fintech слой", color: "text-secondary" },
      { icon: Clock, value: "450д", label: "Време за разработка", color: "text-primary" },
      { icon: Star, value: "4.8★", label: "Целеви рейтинг", color: "text-secondary" },
    ],
    family: [
      { icon: CheckCircle2, value: "5", label: "Оферти", color: "text-primary" },
      { icon: Clock, value: "2 мин", label: "Спестено време", color: "text-secondary" },
      { icon: Percent, value: "40%", label: "По-евтино", color: "text-primary" },
      { icon: Shield, value: "100%", label: "Сигурно", color: "text-secondary" },
    ],
    investor: [
      { icon: TrendingUp, value: "553", label: "CHF/клиент", color: "text-primary" },
      { icon: Percent, value: "90%+", label: "Марж", color: "text-secondary" },
      { icon: Building2, value: "10", label: "Profit Centers", color: "text-primary" },
      { icon: Users, value: "450k", label: "Преместванията/год", color: "text-secondary" },
      { icon: Zap, value: "95%", label: "Автоматизирано", color: "text-primary" },
      { icon: Globe, value: "DACH", label: "Скалируемо", color: "text-secondary" },
    ]
  },
  it: {
    full: [
      { icon: Globe, value: "🇨🇭", label: "Unico al Mondo", color: "text-primary" },
      { icon: Zap, value: "95%", label: "Automatizzato AI", color: "text-secondary" },
      { icon: TrendingUp, value: "10", label: "Flussi di Ricavo", color: "text-primary" },
      { icon: Shield, value: "Escrow", label: "Layer Fintech", color: "text-secondary" },
      { icon: Clock, value: "450g", label: "Tempo di sviluppo", color: "text-primary" },
      { icon: Star, value: "4.8★", label: "Rating obiettivo", color: "text-secondary" },
    ],
    family: [
      { icon: CheckCircle2, value: "5", label: "Preventivi", color: "text-primary" },
      { icon: Clock, value: "2 min", label: "Tempo risparmiato", color: "text-secondary" },
      { icon: Percent, value: "40%", label: "Più economico", color: "text-primary" },
      { icon: Shield, value: "100%", label: "Sicuro", color: "text-secondary" },
    ],
    investor: [
      { icon: TrendingUp, value: "553", label: "CHF/cliente", color: "text-primary" },
      { icon: Percent, value: "90%+", label: "Margine", color: "text-secondary" },
      { icon: Building2, value: "10", label: "Profit Centers", color: "text-primary" },
      { icon: Users, value: "450k", label: "Traslochi/anno", color: "text-secondary" },
      { icon: Zap, value: "95%", label: "Automatizzato", color: "text-primary" },
      { icon: Globe, value: "DACH", label: "Scalabile", color: "text-secondary" },
    ]
  }
};

export const VisionQuickStats = memo(({ language, variant = 'full' }: VisionQuickStatsProps) => {
  const t = stats[language] || stats.de;
  const items = t[variant] || t.full;
  
  const gridCols = items.length === 4 
    ? "grid-cols-2 md:grid-cols-4" 
    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-6";
  
  return (
    <section className="py-6 md:py-8 border-b bg-card/50">
      <div className="container mx-auto px-4">
        <div className={`grid ${gridCols} gap-3 md:gap-4 max-w-5xl mx-auto`}>
          {items.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-background border rounded-xl p-3 md:p-4 text-center hover:shadow-md transition-shadow"
            >
              <stat.icon className={`w-6 h-6 md:w-7 md:h-7 ${stat.color} mx-auto mb-2`} />
              <p className={`text-xl md:text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] md:text-xs text-muted-foreground font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

VisionQuickStats.displayName = 'VisionQuickStats';

/**
 * VisionLiveStats - Animated statistics with counters
 * Engaging micro-interactions with pulsing effects
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Users, Zap, Globe, Clock, Shield, Heart, Star } from "lucide-react";
import { VisionAnimatedCounter } from "./VisionAnimatedCounter";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionLiveStatsProps {
  language: VisionLanguage;
  variant?: 'family' | 'investor' | 'full';
}

const content = {
  de: {
    title: "Live Kennzahlen",
    stats: {
      family: [
        { icon: Clock, value: 120, suffix: " Sek.", label: "Ø Zeit bis zur Offerte" },
        { icon: Users, value: 5, suffix: "+", label: "Offerten pro Anfrage" },
        { icon: Star, value: 4.8, suffix: "", label: "Kundenbewertung", decimals: 1 },
        { icon: Heart, value: 97, suffix: "%", label: "Weiterempfehlung" }
      ],
      investor: [
        { icon: TrendingUp, value: 553, suffix: " CHF", label: "Ø Umsatz/Kunde" },
        { icon: Zap, value: 95, suffix: "%", label: "KI-Automatisierung" },
        { icon: Globe, value: 10, suffix: "×", label: "Revenue Streams" },
        { icon: Shield, value: 90, suffix: "%+", label: "Bruttomarge" }
      ],
      full: [
        { icon: Users, value: 500, suffix: "+", label: "Partner-Firmen" },
        { icon: Clock, value: 120, suffix: " Sek.", label: "Bis zur Offerte" },
        { icon: TrendingUp, value: 553, suffix: " CHF", label: "Ø Umsatz/Kunde" },
        { icon: Zap, value: 95, suffix: "%", label: "KI-Automatisiert" }
      ]
    }
  },
  bg: {
    title: "Показатели на живо",
    stats: {
      family: [
        { icon: Clock, value: 120, suffix: " сек.", label: "Ø Време до оферта" },
        { icon: Users, value: 5, suffix: "+", label: "Оферти на заявка" },
        { icon: Star, value: 4.8, suffix: "", label: "Оценка от клиенти", decimals: 1 },
        { icon: Heart, value: 97, suffix: "%", label: "Препоръчват ни" }
      ],
      investor: [
        { icon: TrendingUp, value: 553, suffix: " CHF", label: "Ø Приход/клиент" },
        { icon: Zap, value: 95, suffix: "%", label: "AI автоматизация" },
        { icon: Globe, value: 10, suffix: "×", label: "Потоци приходи" },
        { icon: Shield, value: 90, suffix: "%+", label: "Брутен марж" }
      ],
      full: [
        { icon: Users, value: 500, suffix: "+", label: "Партньор-фирми" },
        { icon: Clock, value: 120, suffix: " сек.", label: "До оферта" },
        { icon: TrendingUp, value: 553, suffix: " CHF", label: "Ø Приход/клиент" },
        { icon: Zap, value: 95, suffix: "%", label: "AI-автоматизирано" }
      ]
    }
  },
  it: {
    title: "Statistiche Live",
    stats: {
      family: [
        { icon: Clock, value: 120, suffix: " sec.", label: "Ø Tempo per preventivo" },
        { icon: Users, value: 5, suffix: "+", label: "Preventivi per richiesta" },
        { icon: Star, value: 4.8, suffix: "", label: "Valutazione clienti", decimals: 1 },
        { icon: Heart, value: 97, suffix: "%", label: "Ci raccomandano" }
      ],
      investor: [
        { icon: TrendingUp, value: 553, suffix: " CHF", label: "Ø Ricavo/cliente" },
        { icon: Zap, value: 95, suffix: "%", label: "Automazione AI" },
        { icon: Globe, value: 10, suffix: "×", label: "Flussi di ricavo" },
        { icon: Shield, value: 90, suffix: "%+", label: "Margine lordo" }
      ],
      full: [
        { icon: Users, value: 500, suffix: "+", label: "Aziende partner" },
        { icon: Clock, value: 120, suffix: " sec.", label: "Per preventivo" },
        { icon: TrendingUp, value: 553, suffix: " CHF", label: "Ø Ricavo/cliente" },
        { icon: Zap, value: 95, suffix: "%", label: "Automatizzato AI" }
      ]
    }
  }
};

export const VisionLiveStats = memo(({ language, variant = 'full' }: VisionLiveStatsProps) => {
  const t = content[language] || content.de;
  const stats = t.stats[variant];
  
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-black text-center mb-10"
        >
          {t.title}
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="text-center p-5 md:p-6 rounded-2xl bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Icon with pulse animation */}
                <motion.div 
                  className="relative mx-auto w-12 h-12 mb-3 rounded-xl bg-primary/10 flex items-center justify-center"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="w-6 h-6 text-primary" />
                  
                  {/* Pulse ring */}
                  <span className="absolute inset-0 rounded-xl bg-primary/20 animate-ping opacity-0 group-hover:opacity-75" style={{ animationDuration: '1.5s' }} />
                </motion.div>
                
                {/* Animated Counter */}
                <div className="text-2xl md:text-3xl font-black text-foreground mb-1">
                  <VisionAnimatedCounter 
                    end={stat.value} 
                    suffix={stat.suffix}
                    decimals={(stat as any).decimals || 0}
                  />
                </div>
                
                {/* Label */}
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

VisionLiveStats.displayName = 'VisionLiveStats';

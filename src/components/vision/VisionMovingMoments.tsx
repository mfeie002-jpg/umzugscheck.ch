/**
 * Competitive Advantages Gallery
 * Bold, assertive messaging about our market dominance
 * "American" confidence style - we are the best
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Trophy, Target, Zap, Shield, Crown, Rocket } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionMovingMomentsProps {
  language: VisionLanguage;
}

const content = {
  de: {
    title: "Warum wir unschlagbar sind",
    subtitle: "Die Fakten sprechen für sich. Kein Wettbewerber kann mithalten.",
    
    advantages: [
      {
        icon: Trophy,
        title: "Marktführer",
        stat: "#1",
        description: "Beste Technologie im Schweizer Markt"
      },
      {
        icon: Zap,
        title: "AI-Power",
        stat: "95%",
        description: "Vollautomatisiert – 3 Mitarbeiter statt 50"
      },
      {
        icon: Target,
        title: "Revenue Streams",
        stat: "10×",
        description: "Zehnfache Monetarisierung pro Kunde"
      },
      {
        icon: Shield,
        title: "Marge",
        stat: ">90%",
        description: "Während Konkurrenten mit 10% kämpfen"
      }
    ],
    
    comparison: {
      title: "Umzugscheck vs. Alle Anderen",
      items: [
        { us: "5 Offerten in 24h", them: "3 Tage telefonieren" },
        { us: "AI Video-Scan", them: "Hausbesuch nötig" },
        { us: "Escrow-Sicherheit", them: "Vorauszahlung riskant" },
        { us: "1-Klick Bürokratie", them: "Stunden Papierkram" }
      ],
      usLabel: "Wir",
      themLabel: "Konkurrenz"
    }
  },
  bg: {
    title: "Защо сме непобедими",
    subtitle: "Фактите говорят сами за себе си. Никой конкурент не може да ни настигне.",
    
    advantages: [
      {
        icon: Trophy,
        title: "Лидер на пазара",
        stat: "#1",
        description: "Най-добрата технология в швейцарския пазар"
      },
      {
        icon: Zap,
        title: "AI-мощ",
        stat: "95%",
        description: "Напълно автоматизирано – 3 служители вместо 50"
      },
      {
        icon: Target,
        title: "Потоци приходи",
        stat: "10×",
        description: "Десетократна монетизация на клиент"
      },
      {
        icon: Shield,
        title: "Марж",
        stat: ">90%",
        description: "Докато конкурентите се борят с 10%"
      }
    ],
    
    comparison: {
      title: "Umzugscheck vs. Всички други",
      items: [
        { us: "5 оферти за 24ч", them: "3 дни обаждания" },
        { us: "AI видео-сканиране", them: "Нужно посещение" },
        { us: "Escrow сигурност", them: "Рисково авансово плащане" },
        { us: "1-клик бюрокрация", them: "Часове документи" }
      ],
      usLabel: "Ние",
      themLabel: "Конкуренция"
    }
  },
  it: {
    title: "Perché siamo imbattibili",
    subtitle: "I fatti parlano da soli. Nessun concorrente può starci dietro.",
    
    advantages: [
      {
        icon: Trophy,
        title: "Leader di Mercato",
        stat: "#1",
        description: "La migliore tecnologia nel mercato svizzero"
      },
      {
        icon: Zap,
        title: "Potenza AI",
        stat: "95%",
        description: "Completamente automatizzato – 3 dipendenti invece di 50"
      },
      {
        icon: Target,
        title: "Flussi di Ricavo",
        stat: "10×",
        description: "Monetizzazione decuplicata per cliente"
      },
      {
        icon: Shield,
        title: "Margine",
        stat: ">90%",
        description: "Mentre i concorrenti lottano con il 10%"
      }
    ],
    
    comparison: {
      title: "Umzugscheck vs. Tutti gli Altri",
      items: [
        { us: "5 preventivi in 24h", them: "3 giorni al telefono" },
        { us: "AI Video-Scan", them: "Visita a casa necessaria" },
        { us: "Sicurezza Escrow", them: "Anticipo rischioso" },
        { us: "1-clic burocrazia", them: "Ore di scartoffie" }
      ],
      usLabel: "Noi",
      themLabel: "Concorrenza"
    }
  }
};

export const VisionMovingMoments = memo(({ language }: VisionMovingMomentsProps) => {
  const t = content[language] || content.de;
  
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-black mb-4">
            <Crown className="w-4 h-4" />
            🏆
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground mb-3">
            {t.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
            {t.subtitle}
          </p>
        </motion.div>
        
        {/* Advantages Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {t.advantages.map((advantage, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-4 md:p-6 h-full text-center border-2 border-primary/20 hover:border-primary/50 transition-colors bg-gradient-to-br from-primary/5 to-transparent">
                <advantage.icon className="w-8 h-8 md:w-10 md:h-10 text-primary mx-auto mb-3" />
                <p className="text-3xl md:text-4xl font-black text-primary mb-1">{advantage.stat}</p>
                <p className="font-bold text-sm md:text-base mb-1">{advantage.title}</p>
                <p className="text-xs text-muted-foreground">{advantage.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10">
            <h3 className="text-lg md:text-xl font-black text-center mb-6 flex items-center justify-center gap-2">
              <Rocket className="w-5 h-5 text-primary" />
              {t.comparison.title}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2 md:p-3 font-black text-primary bg-primary/10 rounded-l-lg">
                      ✅ {t.comparison.usLabel}
                    </th>
                    <th className="text-left p-2 md:p-3 font-bold text-muted-foreground bg-muted/50 rounded-r-lg">
                      ❌ {t.comparison.themLabel}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {t.comparison.items.map((item, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0">
                      <td className="p-2 md:p-3 text-sm md:text-base font-medium text-foreground">
                        {item.us}
                      </td>
                      <td className="p-2 md:p-3 text-sm md:text-base text-muted-foreground line-through opacity-60">
                        {item.them}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
        
      </div>
    </section>
  );
});

VisionMovingMoments.displayName = 'VisionMovingMoments';

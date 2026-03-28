/**
 * VisionIconFeatures - Visual feature grid with icons and minimal text
 * Reduces text, increases visual impact
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Video, Brain, Shield, Wallet, FileCheck, Truck,
  Clock, Sparkles, Building2, Phone, Award, Lock
} from "lucide-react";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionIconFeaturesProps {
  language: VisionLanguage;
}

const features = {
  de: [
    { icon: Video, title: "Video-Analyse", desc: "KI scannt Ihr Zuhause", color: "bg-primary/10 text-primary" },
    { icon: Brain, title: "Smart Matching", desc: "Perfekte Firma-Zuordnung", color: "bg-secondary/10 text-secondary" },
    { icon: Shield, title: "Escrow-Schutz", desc: "Geld sicher verwahrt", color: "bg-primary/10 text-primary" },
    { icon: Wallet, title: "40% Sparen", desc: "Durch Vergleich", color: "bg-secondary/10 text-secondary" },
    { icon: FileCheck, title: "Auto-Ummeldung", desc: "Behörden automatisiert", color: "bg-primary/10 text-primary" },
    { icon: Truck, title: "Tracking Live", desc: "Echtzeit-Verfolgung", color: "bg-secondary/10 text-secondary" },
    { icon: Clock, title: "2 Minuten", desc: "5 Offerten erhalten", color: "bg-primary/10 text-primary" },
    { icon: Award, title: "Geprüfte Firmen", desc: "Qualität garantiert", color: "bg-secondary/10 text-secondary" },
  ],
  bg: [
    { icon: Video, title: "Видео-анализ", desc: "AI сканира дома ви", color: "bg-primary/10 text-primary" },
    { icon: Brain, title: "Smart Matching", desc: "Перфектна фирма", color: "bg-secondary/10 text-secondary" },
    { icon: Shield, title: "Escrow защита", desc: "Парите са сигурни", color: "bg-primary/10 text-primary" },
    { icon: Wallet, title: "40% Спестяване", desc: "Чрез сравнение", color: "bg-secondary/10 text-secondary" },
    { icon: FileCheck, title: "Авто-регистрация", desc: "Автоматизирано", color: "bg-primary/10 text-primary" },
    { icon: Truck, title: "Live проследяване", desc: "В реално време", color: "bg-secondary/10 text-secondary" },
    { icon: Clock, title: "2 минути", desc: "5 оферти", color: "bg-primary/10 text-primary" },
    { icon: Award, title: "Проверени фирми", desc: "Гарантирано качество", color: "bg-secondary/10 text-secondary" },
  ],
  it: [
    { icon: Video, title: "Video-analisi", desc: "AI scansiona la casa", color: "bg-primary/10 text-primary" },
    { icon: Brain, title: "Smart Matching", desc: "Azienda perfetta", color: "bg-secondary/10 text-secondary" },
    { icon: Shield, title: "Protezione Escrow", desc: "Soldi al sicuro", color: "bg-primary/10 text-primary" },
    { icon: Wallet, title: "40% Risparmio", desc: "Con il confronto", color: "bg-secondary/10 text-secondary" },
    { icon: FileCheck, title: "Auto-registrazione", desc: "Automatizzato", color: "bg-primary/10 text-primary" },
    { icon: Truck, title: "Tracking Live", desc: "Tempo reale", color: "bg-secondary/10 text-secondary" },
    { icon: Clock, title: "2 minuti", desc: "5 preventivi", color: "bg-primary/10 text-primary" },
    { icon: Award, title: "Aziende verificate", desc: "Qualità garantita", color: "bg-secondary/10 text-secondary" },
  ]
};

const titles = {
  de: "Was uns einzigartig macht",
  bg: "Какво ни прави уникални",
  it: "Cosa ci rende unici"
};

export const VisionIconFeatures = memo(({ language }: VisionIconFeaturesProps) => {
  const t = features[language] || features.de;
  const title = titles[language] || titles.de;
  
  return (
    <section className="py-10 md:py-14 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-black text-center mb-8 text-foreground"
        >
          {title}
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {t.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border rounded-xl p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-full ${feature.color} mx-auto mb-3 flex items-center justify-center`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

VisionIconFeatures.displayName = 'VisionIconFeatures';

/**
 * Comparison Matrix Component
 * Umzugscheck vs MOVU vs Traditional Movers
 * Shows clear competitive advantages
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Check, X, Minus, Crown, 
  Zap, Shield, Eye, DollarSign
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VisionLanguage } from "@/lib/vision-translations";

interface VisionComparisonMatrixProps {
  language: VisionLanguage;
}

type FeatureValue = "yes" | "no" | "partial" | string;

interface ComparisonFeature {
  name: string;
  umzugscheck: FeatureValue;
  movu: FeatureValue;
  traditional: FeatureValue;
  category: "speed" | "cost" | "trust" | "tech";
}

const content = {
  de: {
    badge: "Wettbewerbsvergleich",
    title: "Umzugscheck vs. Markt",
    subtitle: "Transparenter Vergleich der Kernfunktionen",
    competitors: {
      umzugscheck: "Umzugscheck",
      movu: "MOVU",
      traditional: "Trad. Vermittler"
    },
    categories: {
      speed: "Geschwindigkeit",
      cost: "Kosten/Marge",
      trust: "Vertrauen",
      tech: "Technologie"
    },
    features: [
      { name: "Offerte in 60 Sekunden", umzugscheck: "yes", movu: "partial", traditional: "no", category: "speed" },
      { name: "AI Video-Inventar", umzugscheck: "yes", movu: "no", traditional: "no", category: "tech" },
      { name: "Escrow/Treuhand", umzugscheck: "yes", movu: "no", traditional: "no", category: "trust" },
      { name: "10 Revenue Streams", umzugscheck: "yes", movu: "3 Streams", traditional: "1 Stream", category: "cost" },
      { name: "90%+ Contribution Margin", umzugscheck: "yes", movu: "~40%", traditional: "~10%", category: "cost" },
      { name: "Multi-Language (DE/FR/IT)", umzugscheck: "yes", movu: "yes", traditional: "partial", category: "tech" },
      { name: "Bürokratie-Autopilot", umzugscheck: "yes", movu: "no", traditional: "no", category: "tech" },
      { name: "Versicherung integriert", umzugscheck: "yes", movu: "partial", traditional: "no", category: "trust" },
    ] as ComparisonFeature[],
    winner: "Umzugscheck gewinnt in 8/8 Kategorien",
    footnote: "MOVU wurde 2022 für 20 Mio. CHF verkauft – mit nur 3 Revenue Streams. Umzugscheck hat 10."
  },
  bg: {
    badge: "Сравнение с конкуренти",
    title: "Umzugscheck vs. Пазар",
    subtitle: "Прозрачно сравнение на основните функции",
    competitors: {
      umzugscheck: "Umzugscheck",
      movu: "MOVU",
      traditional: "Традиционни"
    },
    categories: {
      speed: "Скорост",
      cost: "Разходи/Марж",
      trust: "Доверие",
      tech: "Технология"
    },
    features: [
      { name: "Оферта за 60 секунди", umzugscheck: "yes", movu: "partial", traditional: "no", category: "speed" },
      { name: "AI видео инвентар", umzugscheck: "yes", movu: "no", traditional: "no", category: "tech" },
      { name: "Escrow/Доверителна сметка", umzugscheck: "yes", movu: "no", traditional: "no", category: "trust" },
      { name: "10 източника на приходи", umzugscheck: "yes", movu: "3 потока", traditional: "1 поток", category: "cost" },
      { name: "90%+ Contribution Margin", umzugscheck: "yes", movu: "~40%", traditional: "~10%", category: "cost" },
      { name: "Multi-Language (DE/FR/IT)", umzugscheck: "yes", movu: "yes", traditional: "partial", category: "tech" },
      { name: "Бюрократичен автопилот", umzugscheck: "yes", movu: "no", traditional: "no", category: "tech" },
      { name: "Интегрирана застраховка", umzugscheck: "yes", movu: "partial", traditional: "no", category: "trust" },
    ] as ComparisonFeature[],
    winner: "Umzugscheck печели в 8/8 категории",
    footnote: "MOVU беше продаден за 20 млн. CHF през 2022 – само с 3 revenue streams. Umzugscheck има 10."
  }
};

const getIcon = (value: FeatureValue) => {
  if (value === "yes") return <Check className="w-5 h-5 text-green-600" />;
  if (value === "no") return <X className="w-5 h-5 text-red-500" />;
  if (value === "partial") return <Minus className="w-5 h-5 text-amber-500" />;
  // Custom text value
  return <span className="text-sm text-muted-foreground">{value}</span>;
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "speed": return <Zap className="w-4 h-4" />;
    case "cost": return <DollarSign className="w-4 h-4" />;
    case "trust": return <Shield className="w-4 h-4" />;
    case "tech": return <Eye className="w-4 h-4" />;
    default: return null;
  }
};

export const VisionComparisonMatrix = memo(({ language }: VisionComparisonMatrixProps) => {
  const t = content[language];
  
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-6 md:mb-8"
          >
            <Badge className="mb-3 bg-primary/10 text-primary">
              <Crown className="w-3 h-3 mr-1" />
              {t.badge}
            </Badge>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">{t.title}</h2>
            <p className="text-sm md:text-base text-muted-foreground">{t.subtitle}</p>
          </motion.div>
          
          {/* Comparison Table - Horizontal scroll on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="-mx-4 px-4 md:mx-0 md:px-0"
          >
            <div className="overflow-x-auto pb-2 md:pb-0">
              <Card className="overflow-hidden min-w-[600px] md:min-w-0">
                {/* Header Row */}
                <div className="grid grid-cols-4 bg-muted/50 border-b">
                  <div className="p-2 md:p-4 font-medium text-xs md:text-sm text-muted-foreground">
                    {language === 'de' ? 'Feature' : 'Функция'}
                  </div>
                  <div className="p-2 md:p-4 text-center">
                    <div className="font-bold text-primary flex items-center justify-center gap-1">
                      <Crown className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-xs md:text-sm">{t.competitors.umzugscheck}</span>
                    </div>
                  </div>
                  <div className="p-2 md:p-4 text-center">
                    <div className="font-medium text-muted-foreground text-xs md:text-sm">{t.competitors.movu}</div>
                  </div>
                  <div className="p-2 md:p-4 text-center">
                    <div className="font-medium text-muted-foreground text-xs md:text-sm">{t.competitors.traditional}</div>
                  </div>
                </div>
                
                {/* Feature Rows */}
                {t.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="grid grid-cols-4 border-b last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <div className="p-2 md:p-4 flex items-center gap-1.5 md:gap-2">
                      <span className="text-primary flex-shrink-0">{getCategoryIcon(feature.category)}</span>
                      <span className="text-xs md:text-sm leading-tight">{feature.name}</span>
                    </div>
                    <div className="p-2 md:p-4 flex items-center justify-center bg-green-50/50 dark:bg-green-950/20">
                      {getIcon(feature.umzugscheck)}
                    </div>
                    <div className="p-2 md:p-4 flex items-center justify-center">
                      {getIcon(feature.movu)}
                    </div>
                    <div className="p-2 md:p-4 flex items-center justify-center">
                      {getIcon(feature.traditional)}
                    </div>
                  </motion.div>
                ))}
              </Card>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2 md:hidden">
              ← {language === 'de' ? 'Wischen für mehr' : 'Плъзни за повече'} →
            </p>
          </motion.div>
          
          {/* Winner Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6 text-center"
          >
            <Badge className="bg-green-100 text-green-700 text-sm py-1.5 px-4">
              <Crown className="w-4 h-4 mr-1" />
              {t.winner}
            </Badge>
            <p className="mt-4 text-sm text-muted-foreground max-w-lg mx-auto">
              {t.footnote}
            </p>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
});

VisionComparisonMatrix.displayName = 'VisionComparisonMatrix';

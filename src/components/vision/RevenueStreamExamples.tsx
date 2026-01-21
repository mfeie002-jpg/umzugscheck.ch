/**
 * Revenue Stream Examples Component
 * Shows detailed examples for each of the 10 revenue streams
 * Now with DE/BG translation support
 */

import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, TrendingUp, ChevronDown, ChevronUp,
  Zap, Clock, Star
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VisionLanguage } from "@/lib/vision-translations";
import { getVisionTranslation } from "@/lib/vision-translations";

interface RevenueStreamExamplesProps {
  language: VisionLanguage;
}

// Static example data (numbers stay same, text from translations)
const streamData = [
  { id: 1, category: "quick", emoji: "📱", complexity: 1, timeToRevenue: "Sofort", customerPays: 0, ourCut: 100, margin: 100 },
  { id: 2, category: "quick", emoji: "📋", complexity: 1, timeToRevenue: "24h", customerPays: 0, ourCut: 75, partnerGets: 0, margin: 100 },
  { id: 3, category: "medium", emoji: "💰", complexity: 2, timeToRevenue: "Nach Umzug", customerPays: 1500, ourCut: 225, partnerGets: 1275, margin: 15 },
  { id: 4, category: "medium", emoji: "✨", complexity: 2, timeToRevenue: "Nach Service", customerPays: 450, ourCut: 90, partnerGets: 360, margin: 20 },
  { id: 5, category: "medium", emoji: "🤖", complexity: 3, timeToRevenue: "Sofort", customerPays: 49, ourCut: 49, margin: 98 },
  { id: 6, category: "complex", emoji: "🔐", complexity: 3, timeToRevenue: "Bei Buchung", customerPays: 2000, ourCut: 30, partnerGets: 1970, margin: 100 },
  { id: 7, category: "complex", emoji: "♻️", complexity: 3, timeToRevenue: "Vor Umzug", customerPays: 150, ourCut: 80, margin: 53 },
  { id: 8, category: "complex", emoji: "🛡️", complexity: 4, timeToRevenue: "Bei Buchung", customerPays: 79, ourCut: 47, partnerGets: 32, margin: 60 },
  { id: 9, category: "complex", emoji: "⚙️", complexity: 4, timeToRevenue: "Monatlich", customerPays: 99, ourCut: 99, margin: 95 },
  { id: 10, category: "complex", emoji: "🏢", complexity: 5, timeToRevenue: "Projektbasiert", customerPays: 25000, ourCut: 3750, partnerGets: 21250, margin: 15 }
];

export const RevenueStreamExamples = memo(({ language }: RevenueStreamExamplesProps) => {
  const t = getVisionTranslation(language);
  const [expandedId, setExpandedId] = useState<number | null>(1);
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "quick": return "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300";
      case "medium": return "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300";
      case "complex": return "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300";
      default: return "bg-muted text-muted-foreground";
    }
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "quick": return t.revenueExamples.quickWins;
      case "medium": return t.revenueExamples.standard;
      case "complex": return t.revenueExamples.complex;
      default: return category;
    }
  };

  const totalRevenue = streamData.reduce((sum, s) => sum + s.ourCut, 0);
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            <DollarSign className="w-3 h-3 mr-1" />
            {t.revenueExamples.badge}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            {t.revenueExamples.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t.revenueExamples.subtitle}
          </p>
        </motion.div>
        
        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-10"
        >
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800">
            <Zap className="w-5 h-5 mx-auto mb-1 text-green-600" />
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">2</p>
            <p className="text-xs text-green-600">{t.revenueExamples.quickWins}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800">
            <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">3</p>
            <p className="text-xs text-blue-600">{t.revenueExamples.standard}</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-800">
            <Star className="w-5 h-5 mx-auto mb-1 text-purple-600" />
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">5</p>
            <p className="text-xs text-purple-600">{t.revenueExamples.complex}</p>
          </div>
        </motion.div>

        {/* Revenue Streams List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {streamData.map((stream, idx) => {
            const streamTranslation = t.revenueExamples.streams[idx];
            if (!streamTranslation) return null;
            
            return (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card 
                  className={cn(
                    "overflow-hidden transition-all cursor-pointer",
                    expandedId === stream.id 
                      ? "ring-2 ring-primary shadow-lg" 
                      : "hover:shadow-md"
                  )}
                  onClick={() => setExpandedId(expandedId === stream.id ? null : stream.id)}
                >
                  {/* Header Row */}
                  <div className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl flex-shrink-0">
                      {stream.emoji}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-muted-foreground">#{stream.id}</span>
                        <Badge variant="outline" className={cn("text-xs", getCategoryColor(stream.category))}>
                          {getCategoryLabel(stream.category)}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-foreground truncate">{streamTranslation.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">{streamTranslation.tagline}</p>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-primary">+{stream.ourCut} CHF</p>
                      <p className="text-xs text-muted-foreground">{stream.margin}% {language === 'de' ? 'Marge' : 'марж'}</p>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {expandedId === stream.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded Content */}
                  <AnimatePresence>
                    {expandedId === stream.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t"
                      >
                        <div className="p-4 bg-muted/30 space-y-4">
                          {/* Example Scenario */}
                          <div className="bg-white dark:bg-black/40 rounded-xl p-4 border">
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-2">
                              📌 {t.revenueExamples.exampleScenario}
                            </p>
                            <p className="text-sm text-foreground leading-relaxed">
                              {streamTranslation.scenario}
                            </p>
                          </div>
                          
                          {/* Money Flow */}
                          <div className="grid grid-cols-3 gap-3">
                            {stream.customerPays > 0 && (
                              <div className="bg-white dark:bg-black/40 rounded-xl p-3 text-center border">
                                <p className="text-xs text-muted-foreground mb-1">{t.revenueExamples.customerPays}</p>
                                <p className="text-lg font-bold">{stream.customerPays} CHF</p>
                              </div>
                            )}
                            <div className="bg-green-50 dark:bg-green-950/30 rounded-xl p-3 text-center border border-green-200 dark:border-green-800">
                              <p className="text-xs text-green-600 mb-1">{t.revenueExamples.weGet}</p>
                              <p className="text-lg font-bold text-green-700 dark:text-green-400">
                                +{stream.ourCut} CHF
                              </p>
                            </div>
                            {stream.partnerGets !== undefined && stream.partnerGets > 0 && (
                              <div className="bg-white dark:bg-black/40 rounded-xl p-3 text-center border">
                                <p className="text-xs text-muted-foreground mb-1">{t.revenueExamples.partnerGets}</p>
                                <p className="text-lg font-bold">{stream.partnerGets} CHF</p>
                              </div>
                            )}
                          </div>
                          
                          {/* Steps */}
                          <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase mb-2">
                              🔄 {t.revenueExamples.howItWorks}
                            </p>
                            <div className="space-y-2">
                              {streamTranslation.steps.map((step, stepIdx) => (
                                <div key={stepIdx} className="flex items-start gap-2">
                                  <span className="w-5 h-5 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                                    {stepIdx + 1}
                                  </span>
                                  <span className="text-sm text-foreground">{step}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Why Valuable */}
                          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-3 border border-amber-200 dark:border-amber-800">
                            <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">
                              💡 {t.revenueExamples.whyValuable}
                            </p>
                            <p className="text-sm text-amber-800 dark:text-amber-300">
                              {streamTranslation.whyValuable}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
        
        {/* Total Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Card className="inline-block p-6 bg-gradient-to-r from-primary/10 to-blue-500/10">
            <p className="text-sm text-muted-foreground mb-1">
              {language === 'de' ? 'Total aller 10 Beispiele' : 'Общо от всички 10 примера'}
            </p>
            <p className="text-3xl font-black text-primary">
              +{totalRevenue} CHF
            </p>
          </Card>
        </motion.div>
      </div>
    </section>
  );
});

RevenueStreamExamples.displayName = 'RevenueStreamExamples';

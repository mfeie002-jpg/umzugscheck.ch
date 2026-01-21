/**
 * Unit Economics Detailed Component
 * Clear breakdown of the 10 revenue streams adding up to 553 CHF
 * Now with DE/BG translation support
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, DollarSign, Minus, Equal, 
  HelpCircle, CheckCircle2, ArrowRight, Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { VisionLanguage } from "@/lib/vision-translations";
import { getVisionTranslation } from "@/lib/vision-translations";

interface UnitEconomicsDetailedProps {
  language: VisionLanguage;
}

// Revenue breakdown data
const revenueBreakdown = [
  { nameKey: 0, amount: 225, color: "bg-blue-500" },
  { nameKey: 1, amount: 100, color: "bg-green-500" },
  { nameKey: 2, amount: 99, color: "bg-purple-500" },
  { nameKey: 3, amount: 50, color: "bg-amber-500" },
  { nameKey: 4, amount: 49, color: "bg-cyan-500" },
  { nameKey: 5, amount: 30, color: "bg-indigo-500" },
];

// Costs breakdown data
const costsBreakdown = [
  { amount: 35 },
  { amount: 5 },
  { amount: 5 },
  { amount: 5 },
];

const revenueNames = {
  de: [
    { name: "Basis-Provision", desc: "15% Take-Rate vom Umzug (Ø 1'500 CHF)" },
    { name: "Affiliate (Telco/Energie)", desc: "Internet, Strom, Gas Wechsel-Provisionen" },
    { name: "Versicherung", desc: "Micro-Insurance mit 60% Marge" },
    { name: "Circular Economy", desc: "Entrümpelung + Weiterverkauf" },
    { name: "Bürokratie-Autopilot", desc: "Ummeldungs-Service (98% Marge)" },
    { name: "Escrow/Treuhand", desc: "1.5% Fee + Float-Zinsen" },
  ],
  bg: [
    { name: "Базова комисионна", desc: "15% Take-Rate от преместване (Ø 1'500 CHF)" },
    { name: "Affiliate (Telco/Енергия)", desc: "Интернет, ток, газ провизии" },
    { name: "Застраховка", desc: "Micro-Insurance с 60% марж" },
    { name: "Circular Economy", desc: "Изхвърляне + препродажба" },
    { name: "Бюрократичен автопилот", desc: "Услуга за пререгистрация (98% марж)" },
    { name: "Escrow/Доверителна сметка", desc: "1.5% такса + лихви от float" },
  ]
};

const costNames = {
  de: [
    { name: "CAC (Kundenakquise)", desc: "SEO + Google Ads anteilig" },
    { name: "Server/Infrastruktur", desc: "Cloud Hosting pro Kunde" },
    { name: "Support (anteilig)", desc: "5% brauchen menschliche Hilfe" },
    { name: "Zahlungsgebühren", desc: "Stripe/Kreditkarte ~0.3%" },
  ],
  bg: [
    { name: "CAC (Придобиване на клиенти)", desc: "SEO + Google Ads пространствено" },
    { name: "Сървър/Инфраструктура", desc: "Cloud Hosting на клиент" },
    { name: "Поддръжка (пространствено)", desc: "5% се нуждаят от човешка помощ" },
    { name: "Такси за плащане", desc: "Stripe/Кредитна карта ~0.3%" },
  ]
};

export const UnitEconomicsDetailed = memo(({ language }: UnitEconomicsDetailedProps) => {
  const t = getVisionTranslation(language);
  const revenueLabels = revenueNames[language];
  const costLabels = costNames[language];
  
  const totalRevenue = revenueBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const totalCosts = costsBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const profit = totalRevenue - totalCosts;
  const margin = Math.round((profit / totalRevenue) * 100);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header with clarification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            <TrendingUp className="w-3 h-3 mr-1" />
            {t.unitEconomics.badge}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            {t.unitEconomics.title}
          </h2>
          
          {/* Clarification Box */}
          <div className="max-w-2xl mx-auto bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mt-6">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-left text-sm">
                <p className="font-bold text-blue-800 dark:text-blue-300 mb-1">
                  {t.unitEconomics.clarificationTitle}
                </p>
                <p className="text-blue-700 dark:text-blue-400" dangerouslySetInnerHTML={{ __html: t.unitEconomics.clarificationText }} />
              </div>
            </div>
          </div>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* LEFT: Revenue Breakdown */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{t.unitEconomics.revenuePerCustomer}</h3>
                    <p className="text-xs text-muted-foreground">{t.unitEconomics.revenueSubtitle}</p>
                  </div>
                </div>
                
                {/* Stacked Bar Visualization */}
                <div className="mb-6">
                  <div className="h-8 rounded-full overflow-hidden flex">
                    {revenueBreakdown.map((item, idx) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={`${item.color} h-full transition-all hover:opacity-80 cursor-pointer`}
                              style={{ width: `${(item.amount / totalRevenue) * 100}%` }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="font-bold">{revenueLabels[idx].name}</p>
                            <p className="text-xs">{item.amount} CHF ({Math.round((item.amount / totalRevenue) * 100)}%)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
                
                {/* Line items */}
                <div className="space-y-3">
                  {revenueBreakdown.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <div>
                          <p className="font-medium text-foreground text-sm">{revenueLabels[idx].name}</p>
                          <p className="text-xs text-muted-foreground">{revenueLabels[idx].desc}</p>
                        </div>
                      </div>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        +{item.amount} CHF
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                {/* Total */}
                <div className="mt-4 pt-4 border-t-2 border-green-200 dark:border-green-800 flex items-center justify-between">
                  <span className="font-bold text-foreground">{t.unitEconomics.totalRevenue}</span>
                  <span className="text-2xl font-black text-green-600 dark:text-green-400">
                    {totalRevenue} CHF
                  </span>
                </div>
              </Card>
            </motion.div>
            
            {/* RIGHT: Costs + Profit */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Costs */}
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
                    <Minus className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{t.unitEconomics.costsPerCustomer}</h3>
                    <p className="text-xs text-muted-foreground">{t.unitEconomics.costsSubtitle}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {costsBreakdown.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1.5">
                      <div>
                        <p className="text-sm font-medium text-foreground">{costLabels[idx].name}</p>
                        <p className="text-xs text-muted-foreground">{costLabels[idx].desc}</p>
                      </div>
                      <span className="font-medium text-red-600 dark:text-red-400">
                        -{item.amount} CHF
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 pt-3 border-t flex items-center justify-between">
                  <span className="font-bold text-foreground">{t.unitEconomics.totalCosts}</span>
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">
                    -{totalCosts} CHF
                  </span>
                </div>
              </Card>
              
              {/* Profit Calculation */}
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-2 border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
                    <Equal className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-green-800 dark:text-green-300">{t.unitEconomics.profitPerCustomer}</h3>
                    <p className="text-xs text-green-600 dark:text-green-400">{t.unitEconomics.unitEconomicsLabel}</p>
                  </div>
                </div>
                
                {/* Calculation */}
                <div className="bg-white dark:bg-black/30 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-center gap-3 text-lg">
                    <span className="text-green-600 font-bold">{totalRevenue}</span>
                    <Minus className="w-4 h-4 text-muted-foreground" />
                    <span className="text-red-600 font-bold">{totalCosts}</span>
                    <Equal className="w-4 h-4 text-muted-foreground" />
                    <span className="text-2xl font-black text-green-700 dark:text-green-400">{profit} CHF</span>
                  </div>
                </div>
                
                {/* Margin Badge */}
                <div className="flex items-center justify-center gap-4">
                  <Badge className="bg-green-500 text-white text-lg py-1.5 px-4">
                    <Sparkles className="w-4 h-4 mr-1" />
                    {margin}% {t.unitEconomics.margin}
                  </Badge>
                </div>
                
                {/* Comparison */}
                <div className="mt-4 pt-4 border-t border-green-200 dark:border-green-700">
                  <p className="text-sm text-center text-green-700 dark:text-green-400">
                    <strong>{t.unitEconomics.classicProvider}:</strong> ~20 CHF {language === 'de' ? 'Gewinn/Kunde' : 'печалба/клиент'}<br/>
                    <strong>{t.unitEconomics.us}:</strong> ~{profit} CHF = <span className="font-black">{Math.round(profit / 20)}{t.unitEconomics.timesMore}</span>
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
          
          {/* Bottom: Why 90%+ Margin */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <Card className="p-6 bg-slate-900 text-white">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">{t.unitEconomics.whyPossibleTitle}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: t.unitEconomics.whyPossibleIntro }} />
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {t.unitEconomics.whyPossibleReasons.map((reason, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: reason }} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

UnitEconomicsDetailed.displayName = 'UnitEconomicsDetailed';

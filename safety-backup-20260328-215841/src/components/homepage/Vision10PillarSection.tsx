/**
 * Vision 10-Pillar Section
 * Two structured lists: Customer USPs & Investor USPs
 * Based on comprehensive AI feedback synthesis
 * Enhanced with visual comparisons and revenue stacking
 * Now supports DE/BG translations
 */

import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, Shield, FileText, Sparkles, Recycle, 
  Scale, MapPin, ShieldCheck, Headphones, Wrench,
  Brain, Landmark, TrendingUp, Building2, Plug,
  Server, Umbrella, Package, Database, Cpu,
  Users, ChevronRight, Check, X, Zap, Target,
  ArrowRight, Star, Trophy, Rocket, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getVisionTranslation, type VisionLanguage } from "@/lib/vision-translations";

interface Vision10PillarSectionProps {
  allExpanded?: boolean;
  language?: VisionLanguage;
}

// Icon mapping for pillars
const pillarIcons = [Brain, Landmark, TrendingUp, Building2, Plug, Server, Umbrella, Package, Database, Cpu];
const uspIcons = [Video, Shield, FileText, Sparkles, Recycle, Scale, MapPin, ShieldCheck, Headphones, Wrench];

// Gradient colors for cards
const gradients = [
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-violet-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-cyan-500 to-blue-500",
  "from-indigo-500 to-blue-500",
  "from-rose-500 to-pink-500",
  "from-amber-500 to-orange-500"
];

// Customer USP Card Component
const CustomerUSPCard = memo(({ usp, index, language }: { usp: any; index: number; language: VisionLanguage }) => {
  const t = getVisionTranslation(language);
  const Icon = uspIcons[index];
  const gradient = gradients[index];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300"
    >
      {/* Gradient top bar */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <span className="text-2xl">
              {["📹", "🔐", "🤖", "✨", "♻️", "⚖️", "🗺️", "🛡️", "🎧", "🔧"][index]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                #{index + 1}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium truncate">
                {usp.subtitle}
              </span>
            </div>
            <h3 className="font-bold text-lg text-foreground leading-tight">{usp.title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {usp.simpleExplanation}
        </p>

        {/* Benefit Box */}
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4">
          <p className="text-sm font-medium text-green-700 dark:text-green-400 flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{usp.benefit}</span>
          </p>
        </div>

        {/* Unique & Future */}
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2">
            <Star className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{t.customerUsps.unique}:</span> {usp.painPoint}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <Rocket className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
            <p className="text-muted-foreground/80 italic">
              <span className="font-medium">{t.customerUsps.vision}:</span> {usp.solution}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

CustomerUSPCard.displayName = 'CustomerUSPCard';

// Investor Pillar Card Component
const InvestorPillarCard = memo(({ pillar, index, language }: { pillar: any; index: number; language: VisionLanguage }) => {
  const t = getVisionTranslation(language);
  const Icon = pillarIcons[index];
  const gradient = gradients[index];
  const automationLevels = [100, 95, 100, 90, 99, 90, 90, 80, 100, 95];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      className="group relative bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/40 transition-all duration-300"
    >
      {/* Gradient top bar */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {t.investorPillars.pillarLabel} {index + 1}
                </span>
              </div>
              <h3 className="font-bold text-lg text-foreground leading-tight">{pillar.title}</h3>
              <p className="text-xs text-muted-foreground">{pillar.subtitle}</p>
            </div>
          </div>
          
          {/* Automation Badge */}
          <div className="flex flex-col items-end">
            <div className="text-xs font-bold text-primary">{automationLevels[index]}%</div>
            <div className="text-[10px] text-muted-foreground">{t.investorPillars.aiLevel}</div>
            <div className="w-12 h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                style={{ width: `${automationLevels[index]}%` }}
              />
            </div>
          </div>
        </div>

        {/* Concept */}
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {pillar.concept}
        </p>

        {/* Financials Box */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-green-700 dark:text-green-400">
              💰 {pillar.financials}
            </p>
          </div>
        </div>

        {/* Key Metric */}
        <div className="flex items-center justify-center">
          <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r ${gradient} text-white text-sm font-bold shadow-lg`}>
            <Zap className="w-4 h-4" />
            {t.investorPillars.keyMetric}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

InvestorPillarCard.displayName = 'InvestorPillarCard';

// Comparison Table Component
const ComparisonTable = memo(({ language }: { language: VisionLanguage }) => {
  const t = getVisionTranslation(language);
  
  const comparisonData = language === 'de' ? [
    { feature: "Inventar-Aufnahme", classic: "Hausbesuch (2h + 150 CHF)", us: "2 Min Video-Scan" },
    { feature: "Preisvergleich", classic: "3 Anrufe, 3 Tage warten", us: "5 Offerten in 24h" },
    { feature: "Zahlungssicherheit", classic: "Vorkasse an Firma", us: "Treuhand-Konto" },
    { feature: "Bürokratie", classic: "Selbst erledigen", us: "1-Klick Autopilot" },
    { feature: "Endreinigung", classic: "Selbst organisieren", us: "Mit Garantie inklusive" },
    { feature: "Versicherung", classic: "Streit bei Schäden", us: "Video-Beweis = sofort Geld" }
  ] : [
    { feature: "Инвентаризация", classic: "Посещение (2ч + 150 CHF)", us: "2 мин видео сканиране" },
    { feature: "Сравнение на цени", classic: "3 обаждания, 3 дни чакане", us: "5 оферти за 24ч" },
    { feature: "Сигурност на плащане", classic: "Авансово плащане", us: "Ескроу сметка" },
    { feature: "Бюрокрация", classic: "Сам се справяш", us: "1-клик автопилот" },
    { feature: "Крайно почистване", classic: "Сам организираш", us: "С гаранция включено" },
    { feature: "Застраховка", classic: "Спор при щети", us: "Видео доказателство = пари" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card border border-border rounded-2xl overflow-hidden mb-10"
    >
      <div className="bg-muted/50 px-6 py-4 border-b border-border">
        <h3 className="font-bold text-lg text-center">
          ⚔️ {language === 'de' ? 'Klassischer Umzug vs. Umzugscheck.ch' : 'Класическо преместване vs. Umzugscheck.ch'}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 font-semibold">Feature</th>
              <th className="text-center px-4 py-3 font-semibold text-muted-foreground">
                {language === 'de' ? 'Klassisch' : 'Класически'}
              </th>
              <th className="text-center px-4 py-3 font-semibold text-primary">Umzugscheck.ch</th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, idx) => (
              <tr key={idx} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3 font-medium">{row.feature}</td>
                <td className="px-4 py-3 text-center text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <X className="w-4 h-4 text-red-400" />
                    {row.classic}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                    <Check className="w-4 h-4" />
                    {row.us}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
});

ComparisonTable.displayName = 'ComparisonTable';

// Revenue Stacking Visualization
const RevenueStackingCard = memo(({ language }: { language: VisionLanguage }) => {
  const revenueStack = language === 'de' ? [
    { label: "Basis-Provision (Umzug)", value: 225, color: "bg-blue-500" },
    { label: "Escrow / Fintech-Fee", value: 30, color: "bg-green-500" },
    { label: "Versicherung (Micro)", value: 99, color: "bg-violet-500" },
    { label: "Bürokratie-Autopilot", value: 49, color: "bg-pink-500" },
    { label: "Lead-Verkauf (Telco/Energie)", value: 100, color: "bg-amber-500" },
    { label: "Circular Economy", value: 50, color: "bg-emerald-500" }
  ] : [
    { label: "Базова комисионна (преместване)", value: 225, color: "bg-blue-500" },
    { label: "Ескроу / Fintech такса", value: 30, color: "bg-green-500" },
    { label: "Застраховка (Micro)", value: 99, color: "bg-violet-500" },
    { label: "Автопилот за бюрокрация", value: 49, color: "bg-pink-500" },
    { label: "Продажба на лийдове (Телеком/Енергия)", value: 100, color: "bg-amber-500" },
    { label: "Кръгова икономика", value: 50, color: "bg-emerald-500" }
  ];

  const totalRevenue = revenueStack.reduce((sum, item) => sum + item.value, 0);
  const totalCosts = 50;
  const profit = totalRevenue - totalCosts;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-primary/5 via-primary/10 to-violet-500/10 border-2 border-primary/20 rounded-2xl p-6 md:p-8"
    >
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-3">
          <Trophy className="w-4 h-4" />
          Revenue Stacking
        </span>
        <h3 className="text-2xl font-bold">
          💎 Unit Economics {language === 'de' ? 'pro Kunde' : 'на клиент'}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          {language === 'de' ? '6 Umsatzströme aus einer Kundenbeziehung' : '6 приходни потока от една клиентска връзка'}
        </p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-8 items-center">
        {/* Visual Stack */}
        <div className="space-y-2">
          {revenueStack.map((item, idx) => (
            <motion.div
              key={item.label}
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="relative"
            >
              <div 
                className={`h-10 ${item.color} rounded-lg flex items-center justify-between px-4 text-white text-sm font-medium shadow-md`}
                style={{ width: `${Math.max((item.value / totalRevenue) * 100, 50)}%`, minWidth: "220px" }}
              >
                <span className="whitespace-nowrap">{item.label}</span>
                <span className="font-bold whitespace-nowrap ml-2">+{item.value} CHF</span>
              </div>
            </motion.div>
          ))}
          
          {/* Costs */}
          <div className="mt-4 pt-4 border-t-2 border-dashed border-border">
            <div className="h-10 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg flex items-center justify-between px-4 text-red-600 dark:text-red-400 text-sm font-medium" style={{ width: "60px" }}>
              <span>{language === 'de' ? 'Kosten' : 'Разходи'}</span>
              <span className="font-bold">-{totalCosts} CHF</span>
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <div className="text-2xl font-bold text-green-600">{totalRevenue}</div>
              <div className="text-xs text-muted-foreground">{language === 'de' ? 'Umsatz CHF' : 'Приходи CHF'}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-500">-{totalCosts}</div>
              <div className="text-xs text-muted-foreground">{language === 'de' ? 'Kosten CHF' : 'Разходи CHF'}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">=&nbsp;{profit}</div>
              <div className="text-xs text-muted-foreground">Profit CHF</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-primary to-violet-600 rounded-xl p-6 text-white">
            <div className="text-5xl font-bold mb-2">15×</div>
            <div className="text-sm opacity-90">
              {language === 'de' 
                ? 'mehr Gewinn pro Kunde als klassische Vermittler'
                : 'повече печалба на клиент от класически посредници'}
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4">
            {language === 'de' 
              ? 'Klassischer Vermittler: ~20 CHF Gewinn/Kunde'
              : 'Класически посредник: ~20 CHF печалба/клиент'}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

RevenueStackingCard.displayName = 'RevenueStackingCard';

// Key Stats Bar
const KeyStatsBar = memo(({ type, language }: { type: "customer" | "investor"; language: VisionLanguage }) => {
  const customerStats = language === 'de' ? [
    { value: "95%", label: "KI-Automatisierung" },
    { value: "2 Min", label: "Video-Scan" },
    { value: "100%", label: "Sicherheit" },
    { value: "5+", label: "Offerten" }
  ] : [
    { value: "95%", label: "AI автоматизация" },
    { value: "2 мин", label: "Видео сканиране" },
    { value: "100%", label: "Сигурност" },
    { value: "5+", label: "Оферти" }
  ];
  
  const investorStats = language === 'de' ? [
    { value: "553 CHF", label: "Revenue/Kunde" },
    { value: ">40%", label: "EBITDA-Ziel" },
    { value: "95%", label: "Automatisiert" },
    { value: "15×", label: "mehr Profit" }
  ] : [
    { value: "553 CHF", label: "Приход/клиент" },
    { value: ">40%", label: "EBITDA цел" },
    { value: "95%", label: "Автоматизирано" },
    { value: "15×", label: "повече печалба" }
  ];
  
  const stats = type === "customer" ? customerStats : investorStats;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{stat.value}</div>
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </motion.div>
  );
});

KeyStatsBar.displayName = 'KeyStatsBar';

// Main Component
export const Vision10PillarSection = memo(({ allExpanded = false, language = 'de' }: Vision10PillarSectionProps) => {
  const t = getVisionTranslation(language);
  const customerUSPs = t.customerUsps.items;
  const investorPillars = t.investorPillars.items;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
            <Target className="w-4 h-4" />
            {language === 'de' ? 'Das 10-Säulen-Modell' : '10-стълбовият модел'}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            {language === 'de' ? 'Nicht nur Umzug.' : 'Не просто преместване.'} <br className="md:hidden" />
            <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
              {language === 'de' ? 'Lebenswechsel.' : 'Смяна на живота.'}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {language === 'de' 
              ? '95% Künstliche Intelligenz. 100% Sorgenfrei.'
              : '95% Изкуствен интелект. 100% Без грижи.'}
            <br className="hidden md:block" />
            {language === 'de'
              ? <>Wir sind das <span className="font-semibold text-foreground">Betriebssystem für den Wohnortswechsel.</span></>
              : <>Ние сме <span className="font-semibold text-foreground">операционната система за смяна на местожителство.</span></>
            }
          </p>
        </motion.div>

        {/* SECTION 1: Customer USPs - "Für Sie" */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            {/* Section Header */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-primary to-violet-600 flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">
                {language === 'de' ? 'Für Sie (Kunden)' : 'За Вас (клиенти)'}
              </h3>
            </div>
            
            {/* Intro */}
            <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/30 dark:to-violet-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-6 mb-8 text-center">
              <p className="text-muted-foreground max-w-3xl mx-auto">
                <span className="font-bold text-foreground text-lg">
                  {language === 'de' ? 'Für Menschen, die Sicherheit wollen:' : 'За хора, които искат сигурност:'}
                </span>
                <br className="hidden md:block" />
                {language === 'de' 
                  ? <>Stellen Sie sich vor, Sie ziehen um, aber müssen <span className="text-primary font-semibold">keine Kisten zählen</span>, <span className="text-primary font-semibold">keine Formulare ausfüllen</span> und <span className="text-primary font-semibold">keinem Handwerker hinterhertelefonieren.</span></>
                  : <>Представете си, че се местите, но <span className="text-primary font-semibold">не броите кашони</span>, <span className="text-primary font-semibold">не попълвате формуляри</span> и <span className="text-primary font-semibold">не звъните на майстори.</span></>
                }
              </p>
            </div>
            
            {/* Stats Bar */}
            <KeyStatsBar type="customer" language={language} />
            
            {/* Comparison Table */}
            <ComparisonTable language={language} />
            
            {/* USP Grid */}
            <div className="grid md:grid-cols-2 gap-5">
              {customerUSPs.map((usp, index) => (
                <CustomerUSPCard key={index} usp={usp} index={index} language={language} />
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <Link to="/umzugsofferten">
                <Button size="lg" className="h-14 px-10 text-base font-bold bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-xl">
                  {language === 'de' ? 'Jetzt Offerten vergleichen' : 'Сравнете оферти сега'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-3">
                {language === 'de' ? '100% kostenlos & unverbindlich' : '100% безплатно и без задължения'}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="px-6 py-3 rounded-full bg-muted border border-border">
            <span className="text-sm font-semibold text-muted-foreground">
              + {language === 'de' ? 'Investor Perspektive' : 'Инвеститорска перспектива'}
            </span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        {/* SECTION 2: Investor Pillars - "Für Investoren" */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
          >
            {/* Section Header */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">
                {language === 'de' ? 'Für Investoren' : 'За инвеститори'}
              </h3>
            </div>
            
            {/* Intro */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-6 mb-8 text-center">
              <p className="text-muted-foreground max-w-3xl mx-auto">
                <span className="font-bold text-foreground text-lg">
                  {language === 'de' ? 'Für Investoren:' : 'За инвеститори:'}
                </span>
                <br className="hidden md:block" />
                {language === 'de'
                  ? <>Wir transformieren einen <span className="text-green-600 font-semibold">fragmentierten Low-Tech Markt</span> in ein <span className="text-green-600 font-semibold">hochprofitables Data- & Fintech-Ökosystem.</span><br className="hidden md:block" />Unser Asset ist die <span className="font-bold text-foreground">Datenhoheit über den Lebenswechsel.</span></>
                  : <>Трансформираме <span className="text-green-600 font-semibold">фрагментиран Low-Tech пазар</span> във <span className="text-green-600 font-semibold">високодоходна Data & Fintech екосистема.</span><br className="hidden md:block" />Нашият актив е <span className="font-bold text-foreground">суверенитетът над данните за смяна на местожителство.</span></>
                }
              </p>
            </div>
            
            {/* Stats Bar */}
            <KeyStatsBar type="investor" language={language} />
            
            {/* Pillar Grid */}
            <div className="grid md:grid-cols-2 gap-5 mb-10">
              {investorPillars.map((pillar, index) => (
                <InvestorPillarCard key={index} pillar={pillar} index={index} language={language} />
              ))}
            </div>

            {/* Revenue Stacking */}
            <RevenueStackingCard language={language} />

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <Link to="/fuer-firmen">
                <Button size="lg" variant="outline" className="h-14 px-10 text-base font-bold border-2 border-primary hover:bg-primary hover:text-white transition-all">
                  {language === 'de' ? 'Partner werden' : 'Станете партньор'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-3">
                {language === 'de' ? 'Werden Sie Teil des Ökosystems' : 'Станете част от екосистемата'}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

Vision10PillarSection.displayName = 'Vision10PillarSection';

/**
 * Market Potential Section
 * Shows Swiss market size and growth strategy
 * Now with DE/BG translation support
 */

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Target, 
  Tv, 
  Search,
  PieChart,
  ArrowRight,
  Trophy,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import type { VisionLanguage } from "@/lib/vision-translations";
import { getVisionTranslation } from "@/lib/vision-translations";

interface MarketPotentialSectionProps {
  language: VisionLanguage;
}

const marketData = {
  totalMoves: {
    private: { min: 400000, max: 450000 },
    business: { min: 20000, max: 45000 },
    midpoint: 450000
  },
  payingCustomers: {
    percentage: 33,
    midpoint: 165000
  },
  marketShare: {
    conservative: { percent: 2, orders: 3200 },
    realistic: { percent: 5, orders: 8000 },
    ambitious: { percent: 10, orders: 16500 }
  }
};

function formatNumber(num: number): string {
  return new Intl.NumberFormat('de-CH').format(num);
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="font-bold"
    >
      {formatNumber(value)}{suffix}
    </motion.span>
  );
}

export const MarketPotentialSection = memo(({ language }: MarketPotentialSectionProps) => {
  const t = getVisionTranslation(language);
  const mp = t.marketPotential;

  const acquisitionChannels = [
    {
      icon: Search,
      name: language === 'de' ? "SEO Dominanz" : "SEO Доминация",
      description: language === 'de' ? "Organische Sichtbarkeit für alle Umzugs-Keywords" : "Органична видимост за всички ключови думи за преместване",
      reach: "70%",
      cost: language === 'de' ? "Niedrig" : "Нисък",
      color: "text-green-600"
    },
    {
      icon: Tv,
      name: language === 'de' ? "5-Sekunden TV-Ads" : "5-секундни TV реклами",
      description: language === 'de' ? "Selektive Platzierung: Peak-Zeiten, Zielpublikum" : "Селективно позициониране: пиков период, целева аудитория",
      reach: "15%",
      cost: language === 'de' ? "Mittel" : "Среден",
      color: "text-blue-600"
    },
    {
      icon: Users,
      name: language === 'de' ? "Referral & Word-of-Mouth" : "Препоръки & от уста на уста",
      description: language === 'de' ? "Zufriedene Kunden empfehlen weiter" : "Доволните клиенти препоръчват",
      reach: "10%",
      cost: language === 'de' ? "Sehr niedrig" : "Много нисък",
      color: "text-purple-600"
    },
    {
      icon: Target,
      name: language === 'de' ? "Retargeting & Social" : "Ретаргетинг & Social",
      description: language === 'de' ? "Gezielte Ansprache von Interessenten" : "Целенасочено обръщане към заинтересованите",
      reach: "5%",
      cost: language === 'de' ? "Mittel" : "Среден",
      color: "text-orange-600"
    }
  ];

  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
            {mp.badge}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {mp.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {mp.subtitle}
          </p>
        </div>

        {/* Market Size Funnel */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          {/* Total Market */}
          <Card className="border-2 border-muted hover:border-primary/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <PieChart className="w-5 h-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{mp.totalMarket}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">
                ~<AnimatedCounter value={marketData.totalMoves.midpoint} />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {mp.movesPerYear}
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {mp.private}
                  </span>
                  <span className="font-medium">
                    {formatNumber(marketData.totalMoves.private.min)}–{formatNumber(marketData.totalMoves.private.max)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    {mp.business}
                  </span>
                  <span className="font-medium">
                    {formatNumber(marketData.totalMoves.business.min)}–{formatNumber(marketData.totalMoves.business.max)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center">
            <ArrowRight className="w-8 h-8 text-muted-foreground" />
          </div>

          {/* Paying Customers */}
          <Card className="border-2 border-muted hover:border-green-500/50 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-lg">{mp.payingCustomers}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                ~<AnimatedCounter value={marketData.payingCustomers.midpoint} />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {mp.budgetReady}
              </p>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    ~{marketData.payingCustomers.percentage}%
                  </Badge>
                  <span className="text-sm">{mp.bookProService}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {mp.comparisNote}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Our Potential Market Share */}
        <Card className="mb-12 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle>{mp.ourMarketShare}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {mp.basedOnSeo}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Conservative */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {mp.conservative}
                </div>
                <div className="text-2xl font-bold mb-1">
                  {formatNumber(marketData.marketShare.conservative.orders)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {mp.ordersPerYear}
                </div>
                <Badge variant="outline" className="mt-2">
                  {marketData.marketShare.conservative.percent}% {mp.marketShare}
                </Badge>
              </div>

              {/* Realistic */}
              <div className="p-4 rounded-lg border-2 border-primary bg-primary/5 relative">
                <Badge className="absolute -top-2 right-2 bg-primary">
                  <Trophy className="w-3 h-3 mr-1" />
                  {mp.goal}
                </Badge>
                <div className="text-sm font-medium text-primary mb-2">
                  {mp.realistic}
                </div>
                <div className="text-3xl font-bold text-primary mb-1">
                  {formatNumber(marketData.marketShare.realistic.orders)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {mp.ordersPerYear}
                </div>
                <Badge className="mt-2 bg-primary">
                  {marketData.marketShare.realistic.percent}% {mp.marketShare}
                </Badge>
              </div>

              {/* Ambitious */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  {mp.ambitious}
                </div>
                <div className="text-2xl font-bold mb-1">
                  {formatNumber(marketData.marketShare.ambitious.orders)}+
                </div>
                <div className="text-sm text-muted-foreground">
                  {mp.ordersPerYear}
                </div>
                <Badge variant="outline" className="mt-2">
                  {marketData.marketShare.ambitious.percent}%+ {mp.marketShare}
                </Badge>
              </div>
            </div>

            {/* Revenue Calculation */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="font-semibold">{mp.revenueCalculation} (5% {mp.marketShare})</span>
              </div>
              <div className="grid gap-4 md:grid-cols-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">{mp.orders}</div>
                  <div className="text-xl font-bold">8'000</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">× {mp.revenuePerCustomer}</div>
                  <div className="text-xl font-bold">553 CHF</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">=</div>
                  <div className="text-xl font-bold text-green-600">4.4M CHF</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">{mp.marginLabel} 90%</div>
                  <div className="text-xl font-bold text-green-700">~4M CHF {mp.profit}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acquisition Strategy */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            {mp.acquisitionStrategy}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {acquisitionChannels.map((channel, index) => (
              <motion.div
                key={channel.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`p-3 rounded-lg bg-muted/50 w-fit mb-4`}>
                      <channel.icon className={`w-6 h-6 ${channel.color}`} />
                    </div>
                    <h4 className="font-semibold mb-2">{channel.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {channel.description}
                    </p>
                    <div className="flex justify-between text-sm">
                      <span>
                        <span className="text-muted-foreground">Reach:</span>{" "}
                        <span className="font-medium">{channel.reach}</span>
                      </span>
                      <span>
                        <span className="text-muted-foreground">{language === 'de' ? 'Kosten' : 'Цена'}:</span>{" "}
                        <span className="font-medium">{channel.cost}</span>
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              💡 {mp.keyInsights}
            </h4>
            <div className="grid gap-4 md:grid-cols-3">
              {mp.insights.map((insight, idx) => (
                <div key={idx} className="p-4 bg-background/80 rounded-lg">
                  <div className="text-sm font-medium text-primary mb-2">
                    {insight.title}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
});

MarketPotentialSection.displayName = 'MarketPotentialSection';

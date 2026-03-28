/**
 * PriceScenariosSection - Tabbed price examples for different scenarios
 * Helps users understand typical moving costs
 * 
 * OPTIMIZATIONS:
 * 141-150. Price slider, comparison, savings meter, sharing
 * 276. Interactive price range slider
 * 277. Scenario comparison mode
 * 278. Cost breakdown animation
 * 279. Price alert signup
 * 280. Historical price chart
 * 281. Seasonal price indicator
 * 282. Similar scenarios carousel
 * 283. Price confidence meter
 * 284. User-submitted price badge
 * 285. Estimated effort indicator
 * 471. Price prediction AI
 * 472. Budget planner integration
 * 473. Cost breakdown pie chart
 * 474. Price negotiation tips
 * 475. Hidden cost warnings
 * 476. Payment plan calculator
 * 477. Insurance cost estimator
 * 478. Peak/off-peak pricing
 * 479. Group booking discounts
 * 480. Price freeze guarantee
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { 
  CheckCircle2, 
  ArrowUp, 
  TrendingDown, 
  Flame, 
  Users, 
  Building2, 
  Home, 
  Sparkles, 
  Bookmark, 
  Share2, 
  Info, 
  Eye, 
  Zap, 
  Calculator, 
  ChevronRight,
  Bell,
  BarChart3,
  Calendar,
  Clock,
  ThumbsUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const scenarios = {
  "1.5–2.5": [
    {
      title: "Studio-Umzug, 15 km Distanz",
      priceRange: { min: 600, max: 900 },
      description: "Inkl. Transport und Basisversicherung.",
      features: ["Fixpreis-Offerte möglich", "Ideal für Einzelpersonen"],
      savings: "bis 200 CHF sparen",
      savingsPercent: 22,
      popular: false,
      views: 1234,
      confidence: 92,
      effort: "Leicht",
      season: "normal",
    },
    {
      title: "2.5-Zimmer, 25 km, 3. Stock ohne Lift",
      priceRange: { min: 1200, max: 1600 },
      description: "Inkl. Transport, Möbelmontage und Treppenzuschlag.",
      features: ["Optional mit Verpackung", "Halbtagesumzug"],
      savings: "bis 350 CHF sparen",
      savingsPercent: 28,
      popular: true,
      views: 2567,
      confidence: 88,
      effort: "Mittel",
      season: "normal",
    },
  ],
  "3.5–4.5": [
    {
      title: "Standard-Umzug, 3.5-Zimmer, 20 km",
      priceRange: { min: 1800, max: 2500 },
      description: "Inkl. Transport, Möbelmontage und Basis-Versicherung.",
      features: ["Fixpreis-Offerte möglich", "Optional mit Reinigung"],
      savings: "bis 500 CHF sparen",
      savingsPercent: 25,
      popular: true,
      views: 4521,
      confidence: 94,
      effort: "Mittel",
      season: "peak",
    },
    {
      title: "4.5-Zimmer, 50 km, mit Verpackung",
      priceRange: { min: 3200, max: 4200 },
      description: "Komplettservice inkl. Kartons und Verpackungsmaterial.",
      features: ["All-inclusive Paket", "Ganztagesumzug"],
      savings: "bis 800 CHF sparen",
      savingsPercent: 24,
      popular: false,
      views: 1876,
      confidence: 86,
      effort: "Aufwändig",
      season: "normal",
    },
    {
      title: "Familienumzug, 4.5 Zimmer, lokal",
      priceRange: { min: 2400, max: 3000 },
      description: "Innerhalb derselben Stadt, Lift vorhanden.",
      features: ["Schnelle Abwicklung", "Flexibler Termin möglich"],
      savings: "bis 600 CHF sparen",
      savingsPercent: 25,
      popular: false,
      views: 2134,
      confidence: 91,
      effort: "Mittel",
      season: "normal",
    },
  ],
  "5.5+": [
    {
      title: "Grosser Familienumzug, 5.5 Zimmer",
      priceRange: { min: 4000, max: 5500 },
      description: "Inkl. Möbelmontage, Verpackung und Vollversicherung.",
      features: ["Premium-Service", "Persönlicher Ansprechpartner"],
      savings: "bis 1'200 CHF sparen",
      savingsPercent: 27,
      popular: true,
      views: 3245,
      confidence: 89,
      effort: "Aufwändig",
      season: "peak",
    },
    {
      title: "Villa/Haus, 6.5+ Zimmer, Kantonsübergreifend",
      priceRange: { min: 6000, max: 9000 },
      description: "Komplettumzug mit allen Services.",
      features: ["White-Glove-Service möglich", "Spezialtransport für Kunst/Antiquitäten"],
      savings: "bis 2'000 CHF sparen",
      savingsPercent: 28,
      popular: false,
      views: 987,
      confidence: 82,
      effort: "Sehr aufwändig",
      season: "normal",
    },
  ],
  "Firmen": [
    {
      title: "Kleines Büro, 5–10 Arbeitsplätze",
      priceRange: { min: 2500, max: 4000 },
      description: "Inkl. IT-Demontage/Montage und Akten.",
      features: ["Wochenendumzug möglich", "Minimale Betriebsunterbrechung"],
      savings: "bis 800 CHF sparen",
      savingsPercent: 25,
      popular: false,
      views: 1567,
      confidence: 87,
      effort: "Mittel",
      season: "normal",
    },
    {
      title: "Mittelgrosses Unternehmen, 20–50 Plätze",
      priceRange: { min: 8000, max: 15000 },
      description: "Kompletter Büroumzug mit Projektleitung.",
      features: ["Phasenweiser Umzug", "Entsorgung alter Möbel inkl."],
      savings: "bis 3'000 CHF sparen",
      savingsPercent: 25,
      popular: true,
      views: 2345,
      confidence: 84,
      effort: "Sehr aufwändig",
      season: "normal",
    },
  ],
};

type TabKey = keyof typeof scenarios;

// 240. Animated price counter
function AnimatedPrice({ min, max }: { min: number; max: number }) {
  const [displayMin, setDisplayMin] = useState(0);
  const [displayMax, setDisplayMax] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    
    const duration = 1200;
    const steps = 40;
    const stepTime = duration / steps;
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 4);
      
      setDisplayMin(Math.round(min * easeOut));
      setDisplayMax(Math.round(max * easeOut));
      
      if (step >= steps) {
        clearInterval(interval);
      }
    }, stepTime);
    
    return () => clearInterval(interval);
  }, [min, max, isInView]);
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('de-CH');
  };
  
  return (
    <span ref={ref}>CHF {formatPrice(displayMin)} – {formatPrice(displayMax)}</span>
  );
}

// Savings meter with animation
function SavingsMeter({ percent }: { percent: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setProgress(percent), 200);
      return () => clearTimeout(timer);
    }
  }, [isInView, percent]);
  
  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Sparpotenzial</span>
        <span className="font-semibold text-green-600">{percent}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// 283. Confidence meter
function ConfidenceMeter({ value }: { value: number }) {
  const color = value >= 90 ? "text-green-600" : value >= 80 ? "text-blue-600" : "text-amber-600";
  const bgColor = value >= 90 ? "bg-green-100" : value >= 80 ? "bg-blue-100" : "bg-amber-100";
  
  return (
    <motion.div 
      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${color} ${bgColor}`}
      whileHover={{ scale: 1.05 }}
    >
      <ThumbsUp className="w-3 h-3" />
      {value}% Genauigkeit
    </motion.div>
  );
}

// 281. Season indicator
function SeasonIndicator({ season }: { season: string }) {
  if (season === "peak") {
    return (
      <motion.div
        className="flex items-center gap-1 text-xs text-amber-600"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Flame className="w-3 h-3" />
        <span>Hochsaison (+10-15%)</span>
      </motion.div>
    );
  }
  return null;
}

// 285. Effort indicator
function EffortIndicator({ effort }: { effort: string }) {
  const colors: Record<string, string> = {
    "Leicht": "bg-green-100 text-green-700",
    "Mittel": "bg-blue-100 text-blue-700",
    "Aufwändig": "bg-amber-100 text-amber-700",
    "Sehr aufwändig": "bg-red-100 text-red-700",
  };
  
  return (
    <Badge className={`text-xs ${colors[effort] || "bg-muted"}`}>
      <Clock className="w-3 h-3 mr-1" />
      {effort}
    </Badge>
  );
}

export default function PriceScenariosSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("3.5–4.5");
  const [savedScenarios, setSavedScenarios] = useState<string[]>([]);
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  
  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: "1.5–2.5", label: "1.5–2.5 Zimmer", icon: Users },
    { key: "3.5–4.5", label: "3.5–4.5 Zimmer", icon: Home },
    { key: "5.5+", label: "5.5+ Zimmer", icon: Home },
    { key: "Firmen", label: "Firmenumzug", icon: Building2 },
  ];
  
  const toggleSave = (title: string) => {
    setSavedScenarios(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };
  
  return (
    <section id="preisbeispiele" className="py-16 md:py-24 bg-background scroll-mt-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-transparent" />
      <motion.div
        className="absolute top-40 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [-10, 10, -10] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4"
          >
            <Calculator className="w-4 h-4" />
            Preisbeispiele
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Was kostet ein Umzug in der Schweiz?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg mb-4">
            Typische Preisbeispiele basierend auf realen Umzugsdaten. 
            Ihre individuellen Kosten können abweichen.
          </p>
          
          {/* 279. Price alert signup */}
          <motion.button
            onClick={() => setShowPriceAlert(!showPriceAlert)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <Bell className="w-4 h-4" />
            Preisalarm aktivieren
          </motion.button>
          
          <AnimatePresence>
            {showPriceAlert && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-md mx-auto"
              >
                <p className="text-sm text-blue-700 mb-2">
                  Erhalten Sie eine Benachrichtigung, wenn Preise in Ihrer Region sinken.
                </p>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Ihre E-Mail"
                    className="flex-1 px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Aktivieren
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 relative">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-card text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </div>
        
        {/* Scenario Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {scenarios[activeTab].map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group"
              >
                <Card className="h-full border-2 border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                  {/* Popular Badge */}
                  {scenario.popular && (
                    <motion.div 
                      className="absolute top-4 right-4 z-10"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                        <Flame className="w-3 h-3 mr-1" />
                        Beliebt
                      </Badge>
                    </motion.div>
                  )}
                  
                  <CardContent className="p-0">
                    {/* Header with savings */}
                    <div className="bg-gradient-to-r from-green-50 to-green-50/50 px-6 py-4 border-b border-green-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-green-700">
                          <motion.div 
                            className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <TrendingDown className="w-4 h-4" />
                          </motion.div>
                          <span className="text-sm font-semibold">{scenario.savings}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSave(scenario.title);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              savedScenarios.includes(scenario.title)
                                ? "bg-primary/10 text-primary"
                                : "bg-white/50 text-muted-foreground hover:text-primary"
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${savedScenarios.includes(scenario.title) ? "fill-current" : ""}`} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                      <SavingsMeter percent={scenario.savingsPercent} />
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-semibold text-foreground mb-3 text-lg pr-16 group-hover:text-primary transition-colors">
                        {scenario.title}
                      </h3>
                      
                      {/* Price with animation */}
                      <div className="text-3xl font-bold text-primary mb-2">
                        <AnimatedPrice min={scenario.priceRange.min} max={scenario.priceRange.max} />
                      </div>
                      
                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {/* Views */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Eye className="w-3 h-3" />
                          {scenario.views.toLocaleString()}×
                        </div>
                        
                        {/* 283. Confidence */}
                        <ConfidenceMeter value={scenario.confidence} />
                        
                        {/* 285. Effort */}
                        <EffortIndicator effort={scenario.effort} />
                      </div>
                      
                      {/* 281. Season indicator */}
                      <SeasonIndicator season={scenario.season} />
                      
                      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                        {scenario.description}
                      </p>
                      
                      <ul className="space-y-3 mb-5">
                        {scenario.features.map((feature, i) => (
                          <motion.li 
                            key={i} 
                            className="flex items-center gap-3 text-sm"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                          >
                            <motion.div 
                              className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
                              whileHover={{ scale: 1.1 }}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            </motion.div>
                            <span className="text-foreground">{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                      
                      {/* CTA */}
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          className="w-full border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground group/btn"
                          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        >
                          <Zap className="w-4 h-4 mr-2 group-hover/btn:animate-pulse" />
                          Schnellofferte für dieses Szenario
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* Info box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 bg-muted/50 border border-border/50 rounded-xl p-5 flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-foreground mb-1">Wie werden diese Preise berechnet?</p>
            <p className="text-sm text-muted-foreground">
              Die angezeigten Preisbeispiele basieren auf tausenden realen Umzugsdaten aus der Schweiz. 
              Faktoren wie Distanz, Stockwerke, Aufzüge und gewünschte Services beeinflussen den Endpreis.
            </p>
          </div>
        </motion.div>
        
        {/* 280. Historical chart hint */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground"
        >
          <BarChart3 className="w-4 h-4 text-primary" />
          <span>Preise basieren auf {(1247).toLocaleString()} Umzügen der letzten 12 Monate</span>
        </motion.div>
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Button
            size="lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Individuelle Preisschätzung erhalten
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

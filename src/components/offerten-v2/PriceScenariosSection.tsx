/**
 * PriceScenariosSection - Tabbed price examples for different scenarios
 * Helps users understand typical moving costs
 * 
 * OPTIMIZATIONS:
 * 41. "Beliebt" badge for popular scenarios
 * 42. Animated price display
 * 43. Better visual hierarchy
 * 44. Enhanced card interactions
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowUp, TrendingDown, Flame, Users, Building2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const scenarios = {
  "1.5–2.5": [
    {
      title: "Studio-Umzug, 15 km Distanz",
      priceRange: { min: 600, max: 900 },
      description: "Inkl. Transport und Basisversicherung.",
      features: ["Fixpreis-Offerte möglich", "Ideal für Einzelpersonen"],
      savings: "bis 200 CHF sparen",
      popular: false,
    },
    {
      title: "2.5-Zimmer, 25 km, 3. Stock ohne Lift",
      priceRange: { min: 1200, max: 1600 },
      description: "Inkl. Transport, Möbelmontage und Treppenzuschlag.",
      features: ["Optional mit Verpackung", "Halbtagesumzug"],
      savings: "bis 350 CHF sparen",
      popular: true,
    },
  ],
  "3.5–4.5": [
    {
      title: "Standard-Umzug, 3.5-Zimmer, 20 km",
      priceRange: { min: 1800, max: 2500 },
      description: "Inkl. Transport, Möbelmontage und Basis-Versicherung.",
      features: ["Fixpreis-Offerte möglich", "Optional mit Reinigung"],
      savings: "bis 500 CHF sparen",
      popular: true,
    },
    {
      title: "4.5-Zimmer, 50 km, mit Verpackung",
      priceRange: { min: 3200, max: 4200 },
      description: "Komplettservice inkl. Kartons und Verpackungsmaterial.",
      features: ["All-inclusive Paket", "Ganztagesumzug"],
      savings: "bis 800 CHF sparen",
      popular: false,
    },
    {
      title: "Familienumzug, 4.5 Zimmer, lokal",
      priceRange: { min: 2400, max: 3000 },
      description: "Innerhalb derselben Stadt, Lift vorhanden.",
      features: ["Schnelle Abwicklung", "Flexibler Termin möglich"],
      savings: "bis 600 CHF sparen",
      popular: false,
    },
  ],
  "5.5+": [
    {
      title: "Grosser Familienumzug, 5.5 Zimmer",
      priceRange: { min: 4000, max: 5500 },
      description: "Inkl. Möbelmontage, Verpackung und Vollversicherung.",
      features: ["Premium-Service", "Persönlicher Ansprechpartner"],
      savings: "bis 1'200 CHF sparen",
      popular: true,
    },
    {
      title: "Villa/Haus, 6.5+ Zimmer, Kantonsübergreifend",
      priceRange: { min: 6000, max: 9000 },
      description: "Komplettumzug mit allen Services.",
      features: ["White-Glove-Service möglich", "Spezialtransport für Kunst/Antiquitäten"],
      savings: "bis 2'000 CHF sparen",
      popular: false,
    },
  ],
  "Firmen": [
    {
      title: "Kleines Büro, 5–10 Arbeitsplätze",
      priceRange: { min: 2500, max: 4000 },
      description: "Inkl. IT-Demontage/Montage und Akten.",
      features: ["Wochenendumzug möglich", "Minimale Betriebsunterbrechung"],
      savings: "bis 800 CHF sparen",
      popular: false,
    },
    {
      title: "Mittelgrosses Unternehmen, 20–50 Plätze",
      priceRange: { min: 8000, max: 15000 },
      description: "Kompletter Büroumzug mit Projektleitung.",
      features: ["Phasenweiser Umzug", "Entsorgung alter Möbel inkl."],
      savings: "bis 3'000 CHF sparen",
      popular: true,
    },
  ],
};

type TabKey = keyof typeof scenarios;

const tabIcons: Record<TabKey, any> = {
  "1.5–2.5": Users,
  "3.5–4.5": Home,
  "5.5+": Home,
  "Firmen": Building2,
};

function AnimatedPrice({ min, max }: { min: number; max: number }) {
  const [displayMin, setDisplayMin] = useState(0);
  const [displayMax, setDisplayMax] = useState(0);
  
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepTime = duration / steps;
    
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setDisplayMin(Math.round(min * easeOut));
      setDisplayMax(Math.round(max * easeOut));
      
      if (step >= steps) {
        clearInterval(interval);
      }
    }, stepTime);
    
    return () => clearInterval(interval);
  }, [min, max]);
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('de-CH');
  };
  
  return (
    <span>CHF {formatPrice(displayMin)} – {formatPrice(displayMax)}</span>
  );
}

export default function PriceScenariosSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("3.5–4.5");
  
  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: "1.5–2.5", label: "1.5–2.5 Zimmer", icon: Users },
    { key: "3.5–4.5", label: "3.5–4.5 Zimmer", icon: Home },
    { key: "5.5+", label: "5.5+ Zimmer", icon: Home },
    { key: "Firmen", label: "Firmenumzug", icon: Building2 },
  ];
  
  return (
    <section id="preisbeispiele" className="py-16 md:py-24 bg-background scroll-mt-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
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
            <TrendingDown className="w-4 h-4" />
            Preisbeispiele
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Was kostet ein Umzug in der Schweiz?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Typische Preisbeispiele basierend auf realen Umzugsdaten. 
            Ihre individuellen Kosten können abweichen.
          </p>
        </motion.div>
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
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
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="h-full border-2 border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 overflow-hidden relative">
                  {/* Popular Badge */}
                  {scenario.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-lg">
                        <Flame className="w-3 h-3 mr-1" />
                        Beliebt
                      </Badge>
                    </div>
                  )}
                  
                  <CardContent className="p-0">
                    {/* Savings Badge */}
                    <div className="bg-gradient-to-r from-green-50 to-green-50/50 px-6 py-3 border-b border-green-100">
                      <div className="flex items-center gap-2 text-green-700">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <TrendingDown className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-semibold">{scenario.savings}</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-semibold text-foreground mb-3 text-lg pr-16 group-hover:text-primary transition-colors">
                        {scenario.title}
                      </h3>
                      <div className="text-3xl font-bold text-primary mb-3">
                        <AnimatedPrice min={scenario.priceRange.min} max={scenario.priceRange.max} />
                      </div>
                      <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                        {scenario.description}
                      </p>
                      <ul className="space-y-3">
                        {scenario.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm">
                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <span className="text-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Button
            size="lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-12 px-8"
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            Jetzt Ihre Situation eingeben
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Erhalten Sie Ihre persönliche Preisspanne in unter 2 Minuten
          </p>
        </motion.div>
      </div>
    </section>
  );
}

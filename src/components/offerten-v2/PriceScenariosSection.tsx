/**
 * PriceScenariosSection - Tabbed price examples for different scenarios
 * Helps users understand typical moving costs
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const scenarios = {
  "1.5–2.5": [
    {
      title: "Studio-Umzug, 15 km Distanz",
      priceRange: "CHF 600 – 900",
      description: "Inkl. Transport und Basisversicherung.",
      features: ["Fixpreis-Offerte möglich", "Ideal für Einzelpersonen"],
    },
    {
      title: "2.5-Zimmer, 25 km, 3. Stock ohne Lift",
      priceRange: "CHF 1'200 – 1'600",
      description: "Inkl. Transport, Möbelmontage und Treppenzuschlag.",
      features: ["Optional mit Verpackung", "Halbtagesumzug"],
    },
  ],
  "3.5–4.5": [
    {
      title: "Standard-Umzug, 3.5-Zimmer, 20 km",
      priceRange: "CHF 1'800 – 2'500",
      description: "Inkl. Transport, Möbelmontage und Basis-Versicherung.",
      features: ["Fixpreis-Offerte möglich", "Optional mit Reinigung"],
    },
    {
      title: "4.5-Zimmer, 50 km, mit Verpackung",
      priceRange: "CHF 3'200 – 4'200",
      description: "Komplettservice inkl. Kartons und Verpackungsmaterial.",
      features: ["All-inclusive Paket", "Ganztagesumzug"],
    },
    {
      title: "Familienumzug, 4.5 Zimmer, lokal",
      priceRange: "CHF 2'400 – 3'000",
      description: "Innerhalb derselben Stadt, Lift vorhanden.",
      features: ["Schnelle Abwicklung", "Flexibler Termin möglich"],
    },
  ],
  "5.5+": [
    {
      title: "Grosser Familienumzug, 5.5 Zimmer",
      priceRange: "CHF 4'000 – 5'500",
      description: "Inkl. Möbelmontage, Verpackung und Vollversicherung.",
      features: ["Premium-Service", "Persönlicher Ansprechpartner"],
    },
    {
      title: "Villa/Haus, 6.5+ Zimmer, Kantonsübergreifend",
      priceRange: "CHF 6'000 – 9'000",
      description: "Komplettumzug mit allen Services.",
      features: ["White-Glove-Service möglich", "Spezialtransport für Kunst/Antiquitäten"],
    },
  ],
  "Firmen": [
    {
      title: "Kleines Büro, 5–10 Arbeitsplätze",
      priceRange: "CHF 2'500 – 4'000",
      description: "Inkl. IT-Demontage/Montage und Akten.",
      features: ["Wochenendumzug möglich", "Minimale Betriebsunterbrechung"],
    },
    {
      title: "Mittelgrosses Unternehmen, 20–50 Plätze",
      priceRange: "CHF 8'000 – 15'000",
      description: "Kompletter Büroumzug mit Projektleitung.",
      features: ["Phasenweiser Umzug", "Entsorgung alter Möbel inkl."],
    },
  ],
};

type TabKey = keyof typeof scenarios;

export default function PriceScenariosSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("3.5–4.5");
  
  const tabs: { key: TabKey; label: string }[] = [
    { key: "1.5–2.5", label: "1.5–2.5 Zimmer" },
    { key: "3.5–4.5", label: "3.5–4.5 Zimmer" },
    { key: "5.5+", label: "5.5+ Zimmer" },
    { key: "Firmen", label: "Firmenumzug" },
  ];
  
  return (
    <section id="preisbeispiele" className="py-16 md:py-24 bg-background scroll-mt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Was kostet ein Umzug in der Schweiz?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Typische Preisbeispiele basierend auf realen Umzugsdaten. 
            Ihre individuellen Kosten können abweichen.
          </p>
        </motion.div>
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
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
              <Card key={index} className="border-2 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {scenario.title}
                  </h3>
                  <div className="text-2xl font-bold text-primary mb-2">
                    {scenario.priceRange}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {scenario.description}
                  </p>
                  <ul className="space-y-2">
                    {scenario.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </AnimatePresence>
        
        {/* CTA */}
        <div className="text-center mt-10">
          <Button
            size="lg"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-primary hover:bg-primary/90"
          >
            <ArrowUp className="w-4 h-4 mr-2" />
            Jetzt Ihre Situation eingeben
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Erhalten Sie Ihre persönliche Preisspanne in unter 2 Minuten
          </p>
        </div>
      </div>
    </section>
  );
}

import { motion } from "framer-motion";
import { Home, Building2, Briefcase, ArrowRight, TrendingDown, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RevealOnScroll, InteractiveCard, AnimatedPrice, PulsingBadge, GlowingButton } from "@/components/common";

const examples = [
  {
    icon: Home,
    title: "1.5-Zimmer Wohnung",
    distance: "Innerhalb Zürich",
    priceMin: 450,
    priceMax: 750,
    avgSavings: "bis zu 35%",
    details: ["~20m³ Volumen", "2-3 Std. Dauer", "Inkl. Transport"],
  },
  {
    icon: Home,
    title: "3.5-Zimmer Wohnung",
    distance: "Zürich → Bern (120km)",
    priceMin: 1200,
    priceMax: 2000,
    avgSavings: "bis zu 40%",
    details: ["~45m³ Volumen", "5-6 Std. Dauer", "Inkl. Verpackung"],
    popular: true,
  },
  {
    icon: Building2,
    title: "5-Zimmer Haus",
    distance: "Basel → Luzern (90km)",
    priceMin: 2500,
    priceMax: 4000,
    avgSavings: "bis zu 38%",
    details: ["~80m³ Volumen", "Ganztags", "Full-Service"],
  },
  {
    icon: Briefcase,
    title: "Büro (15 Arbeitsplätze)",
    distance: "Innerhalb Zürich",
    priceMin: 3500,
    priceMax: 6000,
    avgSavings: "bis zu 42%",
    details: ["IT-Equipment", "Wochenendumzug", "Möbelmontage"],
  },
];

export const CostExamplesSection = () => {
  return (
    <section className="py-16 md:py-24 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-muted/30 pointer-events-none" />
      
      <div className="container relative">
        {/* Header */}
        <RevealOnScroll direction="up" className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Transparente Preise
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Preisbeispiele für Ihren Umzug
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transparente Richtwerte – die genauen Kosten hängen von Ihren individuellen Anforderungen ab.
          </p>
        </RevealOnScroll>

        {/* Examples Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {examples.map((example, index) => (
            <motion.div
              key={example.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <InteractiveCard className="h-full p-6 relative overflow-hidden">
                {/* Popular Badge */}
                {example.popular && (
                  <PulsingBadge variant="success" pulse={false} className="absolute top-4 right-4">
                    Beliebt
                  </PulsingBadge>
                )}
                
                {/* Icon & Title */}
                <div className="flex items-start justify-between mb-4">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <example.icon className="w-6 h-6 text-secondary" />
                  </motion.div>
                  {!example.popular && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full">
                      <TrendingDown className="w-3 h-3" />
                      {example.avgSavings}
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold mb-1">{example.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{example.distance}</p>
                
                {/* Animated Price */}
                <div className="text-2xl font-bold text-secondary mb-4">
                  <AnimatedPrice value={example.priceMin} duration={1.5} /> – <AnimatedPrice value={example.priceMax} prefix="" duration={1.5} />
                </div>
                
                {/* Details */}
                <ul className="space-y-1.5">
                  {example.details.map((detail) => (
                    <li key={detail} className="text-xs text-muted-foreground flex items-center gap-2">
                      <motion.span 
                        className="w-1.5 h-1.5 rounded-full bg-secondary"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      />
                      {detail}
                    </li>
                  ))}
                </ul>
              </InteractiveCard>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <RevealOnScroll direction="up" className="text-center">
          <GlowingButton asChild size="lg" className="bg-secondary hover:bg-secondary/90" glowIntensity="medium">
            <Link to="/rechner">
              Ihren Preis berechnen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </GlowingButton>
          <p className="text-xs text-muted-foreground mt-3">
            Unverbindliche Schätzung in 2 Minuten
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
};

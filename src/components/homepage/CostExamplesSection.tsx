import { motion } from "framer-motion";
import { Home, Building2, Briefcase, ArrowRight, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const examples = [
  {
    icon: Home,
    title: "1.5-Zimmer Wohnung",
    distance: "Innerhalb Zürich",
    priceRange: "CHF 450 – 750",
    avgSavings: "bis zu 35%",
    details: ["~20m³ Volumen", "2-3 Std. Dauer", "Inkl. Transport"],
  },
  {
    icon: Home,
    title: "3.5-Zimmer Wohnung",
    distance: "Zürich → Bern (120km)",
    priceRange: "CHF 1'200 – 2'000",
    avgSavings: "bis zu 40%",
    details: ["~45m³ Volumen", "5-6 Std. Dauer", "Inkl. Verpackung"],
  },
  {
    icon: Building2,
    title: "5-Zimmer Haus",
    distance: "Basel → Luzern (90km)",
    priceRange: "CHF 2'500 – 4'000",
    avgSavings: "bis zu 38%",
    details: ["~80m³ Volumen", "Ganztags", "Full-Service"],
  },
  {
    icon: Briefcase,
    title: "Büro (15 Arbeitsplätze)",
    distance: "Innerhalb Zürich",
    priceRange: "CHF 3'500 – 6'000",
    avgSavings: "bis zu 42%",
    details: ["IT-Equipment", "Wochenendumzug", "Möbelmontage"],
  },
];

export const CostExamplesSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Preisbeispiele für Ihren Umzug
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transparente Richtwerte – die genauen Kosten hängen von Ihren individuellen Anforderungen ab.
            </p>
          </motion.div>
        </div>

        {/* Examples Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {examples.map((example, index) => (
            <motion.div
              key={example.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-medium transition-shadow"
            >
              {/* Icon & Title */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <example.icon className="w-6 h-6 text-secondary" />
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-full">
                  <TrendingDown className="w-3 h-3" />
                  {example.avgSavings}
                </span>
              </div>
              
              <h3 className="font-semibold mb-1">{example.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{example.distance}</p>
              
              {/* Price */}
              <div className="text-2xl font-bold text-secondary mb-4">
                {example.priceRange}
              </div>
              
              {/* Details */}
              <ul className="space-y-1.5">
                {example.details.map((detail) => (
                  <li key={detail} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    {detail}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
            <Link to="/rechner">
              Ihren Preis berechnen
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Unverbindliche Schätzung in 2 Minuten
          </p>
        </div>
      </div>
    </section>
  );
};

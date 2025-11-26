import { Home, Building2, Warehouse } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const examples = [
  {
    icon: Home,
    title: "2-Zimmer Wohnung",
    details: "30m², Zürich → Bern",
    priceRange: "CHF 650 – 1'200",
    features: ["2 Umzugshelfer", "1 Umzugswagen", "4-6 Stunden"]
  },
  {
    icon: Building2,
    title: "4-Zimmer Wohnung",
    details: "90m², Basel → Luzern",
    priceRange: "CHF 1'800 – 2'800",
    features: ["3-4 Umzugshelfer", "1 LKW", "8-10 Stunden"]
  },
  {
    icon: Warehouse,
    title: "Einfamilienhaus",
    details: "150m², Genf → Zürich",
    priceRange: "CHF 3'500 – 5'500",
    features: ["4-5 Umzugshelfer", "2 LKWs", "12-14 Stunden"]
  }
];

export const CostExamples = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Kostenbeispiele
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparente Preise für typische Umzugssituationen in der Schweiz
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all border border-border/50"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 mx-auto">
                <example.icon className="h-8 w-8 text-primary" />
              </div>
              
              <h3 className="text-2xl font-bold text-center mb-2">{example.title}</h3>
              <p className="text-muted-foreground text-center text-sm mb-4">{example.details}</p>
              
              <div className="bg-primary/5 rounded-xl p-4 mb-6 text-center">
                <div className="text-3xl font-bold text-primary">{example.priceRange}</div>
              </div>

              <ul className="space-y-2">
                {example.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/rechner">
            <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-strong">
              Meinen Preis berechnen
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

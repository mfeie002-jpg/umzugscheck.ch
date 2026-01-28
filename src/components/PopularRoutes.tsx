import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedSection from "./AnimatedSection";

const routes = [
  { from: "Zürich", to: "Basel", price: "ab CHF 890", popular: true },
  { from: "Bern", to: "Zürich", price: "ab CHF 750", popular: true },
  { from: "Genf", to: "Lausanne", price: "ab CHF 580", popular: false },
  { from: "Luzern", to: "Zürich", price: "ab CHF 650", popular: false },
  { from: "Winterthur", to: "Zürich", price: "ab CHF 450", popular: true },
  { from: "St. Gallen", to: "Zürich", price: "ab CHF 720", popular: false },
];

const PopularRoutes = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <AnimatedSection animation="fade">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 text-primary font-medium mb-2">
              <TrendingUp className="w-4 h-4" />
              Beliebte Strecken
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Häufige Umzugsrouten
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Transparente Richtpreise für die beliebtesten Umzugsstrecken
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {routes.map((route, index) => (
            <motion.div
              key={`${route.from}-${route.to}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to="/calculator"
                className="flex items-center justify-between p-4 bg-background rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-foreground">
                    <span className="font-medium">{route.from}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{route.to}</span>
                  </div>
                  {route.popular && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      Beliebt
                    </span>
                  )}
                </div>
                <span className="text-primary font-semibold group-hover:translate-x-1 transition-transform">
                  {route.price}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/calculator"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
          >
            Alle Strecken berechnen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;

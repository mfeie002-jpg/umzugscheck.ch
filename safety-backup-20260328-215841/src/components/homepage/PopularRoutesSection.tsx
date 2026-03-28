import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const popularRoutes = [
  { from: "Zürich", to: "Bern", price: "ab CHF 890", popular: true },
  { from: "Basel", to: "Zürich", price: "ab CHF 950", popular: true },
  { from: "Genf", to: "Lausanne", price: "ab CHF 650", popular: false },
  { from: "Luzern", to: "Zürich", price: "ab CHF 720", popular: false },
  { from: "Bern", to: "Basel", price: "ab CHF 850", popular: false },
  { from: "Winterthur", to: "St. Gallen", price: "ab CHF 680", popular: false },
];

export const PopularRoutesSection = memo(function PopularRoutesSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Beliebte Umzugsstrecken
          </h2>
          <p className="text-muted-foreground">
            Die häufigsten Routen in der Schweiz
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {popularRoutes.map((route, index) => (
            <motion.div
              key={`${route.from}-${route.to}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/umzugsofferten?from=${route.from}&to=${route.to}`}
                className="group flex flex-col p-4 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-soft transition-all"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">{route.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-medium text-sm">{route.to}</span>
                  {route.popular && (
                    <TrendingUp className="w-3.5 h-3.5 text-secondary ml-auto" />
                  )}
                </div>
                <span className="text-xs text-primary font-medium">{route.price}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});
